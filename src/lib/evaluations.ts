import { Subject, Evaluation, StudentTaskItem, SpacedRevision, SchoolConfig, TeacherTopic } from '../types';
import { trackEvent } from './analytics';

export interface ExamPlanResult {
  updatedTasks: StudentTaskItem[];
  updatedRevisions: SpacedRevision[];
  createdTasksCount: number;
}

/**
 * Generates automated pre-exam revision plantasks and spaced revisions.
 */
export function generateExamPrepPlan(
  evaluation: Evaluation,
  coveredTopicObjects: TeacherTopic[],
  subject: Subject,
  existingTasks: StudentTaskItem[],
  existingRevisions: SpacedRevision[]
): ExamPlanResult {
  const examDateStr = evaluation.date;
  const examDate = new Date(examDateStr + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Difference in days between today and exam date
  const diffTime = examDate.getTime() - today.getTime();
  const totalDaysRemaining = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  const newTasks: StudentTaskItem[] = [];
  const topicCount = coveredTopicObjects.length;

  coveredTopicObjects.forEach((topic, index) => {
    // Spread tasks evenly between today and 1 day before exam
    const dayOffset = topicCount > 1
      ? Math.floor((index * Math.max(0, totalDaysRemaining - 1)) / topicCount)
      : 0;

    const taskDueDate = new Date(today.getTime() + dayOffset * 24 * 60 * 60 * 1000);
    // Ensure task due date does not exceed exam date
    if (taskDueDate > examDate) {
      taskDueDate.setTime(examDate.getTime());
    }
    const dueDateStr = taskDueDate.toISOString().split('T')[0];

    const taskId = `rev-${evaluation.id}-${topic.id}-${Date.now()}`;
    newTasks.push({
      id: taskId,
      subjectId: subject.id,
      title: `Revisar: ${topic.name} (${subject.name})`,
      type: 'revision',
      date: dueDateStr,
      priority: 'alta',
      completed: false,
      notes: `Revisão pré-prova para ${evaluation.name} do dia ${evaluation.date}`,
      syncedCalendar: true,
      source: 'exam_plan',
      linkedEvaluationId: evaluation.id,
      topicId: topic.id,
      topicName: topic.name
    });
  });

  // Also add a general Quiz task 1 day before exam
  const quizDueDate = new Date(Math.max(today.getTime(), examDate.getTime() - 24 * 60 * 60 * 1000));
  newTasks.push({
    id: `quiz-${evaluation.id}-${Date.now()}`,
    subjectId: subject.id,
    title: `⚡ Resolver Quiz de Revisão Geral: ${evaluation.name}`,
    type: 'quiz',
    date: quizDueDate.toISOString().split('T')[0],
    priority: 'alta',
    completed: false,
    notes: `Simulado com questões dos tópicos cobrados na prova de ${subject.name}`,
    syncedCalendar: true,
    source: 'exam_plan',
    linkedEvaluationId: evaluation.id
  });

  // Update or insert SpacedRevisions
  const updatedRevisions = [...existingRevisions];

  coveredTopicObjects.forEach((topic) => {
    const existingRevIdx = updatedRevisions.findIndex(
      r => r.subjectId === subject.id && r.topic.toLowerCase() === topic.name.toLowerCase()
    );

    if (existingRevIdx >= 0) {
      updatedRevisions[existingRevIdx] = {
        ...updatedRevisions[existingRevIdx],
        priority: 'high',
        linkedEvaluationId: evaluation.id
      };
    } else {
      updatedRevisions.push({
        id: `sr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        subjectId: subject.id,
        topic: topic.name,
        createdAt: new Date().toISOString(),
        steps: [
          { days: 1, dueDate: new Date(today.getTime() + 86400000).toISOString().split('T')[0], completed: false },
          { days: 7, dueDate: new Date(today.getTime() + 86400000 * 7).toISOString().split('T')[0], completed: false },
          { days: 30, dueDate: new Date(today.getTime() + 86400000 * 30).toISOString().split('T')[0], completed: false }
        ],
        priority: 'high',
        linkedEvaluationId: evaluation.id
      });
    }
  });

  // Track event
  trackEvent('exam_plan_generated', {
    evaluation_id: evaluation.id,
    tasks_generated_count: newTasks.length,
    spaced_revisions_count: coveredTopicObjects.length
  });

  return {
    updatedTasks: [...newTasks, ...existingTasks],
    updatedRevisions,
    createdTasksCount: newTasks.length
  };
}

export interface ProcessScoreResult {
  updatedEvaluation: Evaluation;
  updatedSubjects: Subject[];
  updatedTasks: StudentTaskItem[];
  updatedRevisions: SpacedRevision[];
  passed: boolean;
  scorePercentage: number;
  recoveryNoteForParents?: string;
}

/**
 * Process registered score for an evaluation.
 * If score < passingScore, triggers Modo Recuperação automatizado.
 * If score >= passingScore, celebrates success and clears recovery flags.
 */
export function processEvaluationResult(
  evaluation: Evaluation,
  scoreObtained: number,
  reflectionText: string | undefined,
  schoolConfig: SchoolConfig,
  subjects: Subject[],
  studentTasks: StudentTaskItem[],
  spacedRevisions: SpacedRevision[]
): ProcessScoreResult {
  const maxScore = evaluation.maxScore || 10.0;
  const scorePercentage = (scoreObtained / maxScore) * 100;
  // Passing threshold percentage e.g. passingScore=6.0 -> 60%
  const passingPercentage = (schoolConfig.passingScore / (schoolConfig.maxScorePerPeriod || 10.0)) * 100;
  const passed = scorePercentage >= passingPercentage;

  const updatedEvaluation: Evaluation = {
    ...evaluation,
    scoreObtained,
    reflectionText,
    isRecovery: evaluation.type === 'recuperacao' || evaluation.isRecovery
  };

  const coveredTopicIds = evaluation.coveredTopics || [];

  if (passed) {
    // Clear recovery flags for topics in this evaluation
    const updatedSubjects = subjects.map(sub => {
      if (sub.id === evaluation.subjectId) {
        return {
          ...sub,
          topics: sub.topics.map(t => {
            if (coveredTopicIds.includes(t.id)) {
              return { ...t, needsRecovery: false, recoveryReason: undefined };
            }
            return t;
          })
        };
      }
      return sub;
    });

    // Complete linked recovery tasks
    const updatedTasks = studentTasks.map(task => {
      if (task.linkedEvaluationId === evaluation.id && task.type === 'recovery') {
        return { ...task, completed: true };
      }
      return task;
    });

    // Reset spaced revisions priority to normal
    const updatedRevisions = spacedRevisions.map(rev => {
      if (rev.linkedEvaluationId === evaluation.id) {
        return { ...rev, priority: 'normal' as const };
      }
      return rev;
    });

    trackEvent('exam_score_registered', {
      evaluation_id: evaluation.id,
      subject_id: evaluation.subjectId,
      score: scoreObtained,
      max_score: maxScore,
      passed: true
    });

    trackEvent('recovery_completed', {
      evaluation_id: evaluation.id,
      subject_id: evaluation.subjectId
    });

    return {
      updatedEvaluation,
      updatedSubjects,
      updatedTasks,
      updatedRevisions,
      passed: true,
      scorePercentage
    };
  } else {
    // Trigger MODO RECUPERAÇÃO AUTOMATIZADO
    const subject = subjects.find(s => s.id === evaluation.subjectId);
    const subjectName = subject?.name || 'Disciplina';

    // 1. Mark covered topics as needsRecovery = true
    const failingTopicNames: string[] = [];
    const updatedSubjects = subjects.map(sub => {
      if (sub.id === evaluation.subjectId) {
        return {
          ...sub,
          topics: sub.topics.map(t => {
            if (coveredTopicIds.length === 0 || coveredTopicIds.includes(t.id)) {
              failingTopicNames.push(t.name);
              return {
                ...t,
                needsRecovery: true,
                recoveryReason: `Nota ${scoreObtained.toFixed(1)}/${maxScore.toFixed(1)} na prova ${evaluation.name}`
              };
            }
            return t;
          })
        };
      }
      return sub;
    });

    // 2. Generate recovery tasks (due in 7 days)
    const recoveryDueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const newRecoveryTasks: StudentTaskItem[] = [];

    const topicsToRecover = failingTopicNames.length > 0
      ? failingTopicNames
      : [evaluation.name];

    topicsToRecover.forEach((topicName, idx) => {
      newRecoveryTasks.push({
        id: `rec-${evaluation.id}-${idx}-${Date.now()}`,
        subjectId: evaluation.subjectId,
        title: `🚨 Plano de Recuperação: ${topicName} (${subjectName})`,
        type: 'recovery',
        date: recoveryDueDate,
        priority: 'critical',
        completed: false,
        notes: `Reforço pedagógico ativado após avaliação (${scoreObtained.toFixed(1)} pts). Fazer leitura orientada e 3 exercícios de fixação.`,
        syncedCalendar: true,
        source: 'recovery_plan',
        linkedEvaluationId: evaluation.id,
        topicName
      });
    });

    // Quiz de Recuperação
    newRecoveryTasks.push({
      id: `rec-quiz-${evaluation.id}-${Date.now()}`,
      subjectId: evaluation.subjectId,
      title: `🧠 Quiz de Recuperação Intensiva: ${subjectName}`,
      type: 'quiz',
      date: recoveryDueDate,
      priority: 'critical',
      completed: false,
      notes: `Questões direcionadas para os tópicos com vulnerabilidade identificada.`,
      syncedCalendar: true,
      source: 'recovery_plan',
      linkedEvaluationId: evaluation.id
    });

    // 3. Elevate spaced revisions priority to 'critical'
    const updatedRevisions = spacedRevisions.map(rev => {
      if (rev.subjectId === evaluation.subjectId && topicsToRecover.some(t => t.toLowerCase() === rev.topic.toLowerCase())) {
        return { ...rev, priority: 'critical' as const, linkedEvaluationId: evaluation.id };
      }
      return rev;
    });

    // 4. Parental Guidance Note
    const recoveryNoteForParents = `Informativo Acolhedor: Foi ativado o Plano de Recuperação para ${subjectName} referente à avaliação "${evaluation.name}" (Nota: ${scoreObtained.toFixed(1)}/${maxScore.toFixed(1)}). O sistema já agendou tarefas de apoio e revisão direcionada sem foco punitivo.`;

    trackEvent('exam_score_registered', {
      evaluation_id: evaluation.id,
      subject_id: evaluation.subjectId,
      score: scoreObtained,
      max_score: maxScore,
      passed: false
    });

    trackEvent('recovery_mode_activated', {
      evaluation_id: evaluation.id,
      subject_id: evaluation.subjectId,
      failing_topics_count: topicsToRecover.length
    });

    return {
      updatedEvaluation,
      updatedSubjects,
      updatedTasks: [...newRecoveryTasks, ...studentTasks],
      updatedRevisions,
      passed: false,
      scorePercentage,
      recoveryNoteForParents
    };
  }
}
