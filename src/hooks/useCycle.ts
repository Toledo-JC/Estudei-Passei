import { useState, useEffect, useCallback } from 'react';
import { 
  DailyCycle, 
  CycleBlockItem, 
  CycleBreakItem, 
  Subject, 
  StudentTaskItem, 
  SpacedRevision, 
  Evaluation, 
  StudySessionLog 
} from '../types';

const DAILY_CYCLE_KEY_PREFIX = 'estudei_daily_cycle_';

export function getTodayDateString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

interface UseCycleProps {
  subjects: Subject[];
  studentTasks?: StudentTaskItem[];
  spacedRevisions?: SpacedRevision[];
  evaluations?: Evaluation[];
  studyLogs?: StudySessionLog[];
  onAddStudyLog?: (log: StudySessionLog) => void;
  dailyGoalMinutes?: number;
  subjectWeights?: Record<string, number>;
}

export function useCycle({
  subjects,
  studentTasks = [],
  spacedRevisions = [],
  evaluations = [],
  studyLogs = [],
  onAddStudyLog,
  dailyGoalMinutes = 90,
  subjectWeights = {}
}: UseCycleProps) {
  const today = getTodayDateString();
  const storageKey = `${DAILY_CYCLE_KEY_PREFIX}${today}`;

  const [dailyCycle, setDailyCycle] = useState<DailyCycle | null>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to parse saved daily cycle', e);
    }
    return null;
  });

  // Save to localStorage
  useEffect(() => {
    if (dailyCycle) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(dailyCycle));
      } catch (e) {
        console.error('Failed to save daily cycle', e);
      }
    }
  }, [dailyCycle, storageKey]);

  // Generate Daily Cycle based on Adaptive Algorithm
  const generateDailyCycle = useCallback(() => {
    const enabledSubjects = subjects.filter(s => s.enabled !== false);
    if (enabledSubjects.length === 0) return null;

    const blocks: CycleBlockItem[] = [];
    const usedSubjectIds = new Set<string>();

    // 1. Spaced Revisions due today (Priority 1)
    const revisionsToday = spacedRevisions.filter(r => {
      return r.steps.some(s => !s.completed && s.dueDate <= today);
    });
    for (const rev of revisionsToday) {
      const sub = subjects.find(s => s.id === rev.subjectId);
      if (sub) {
        blocks.push({
          id: `blk_rev_${rev.id}`,
          subjectId: sub.id,
          subjectName: sub.name,
          type: 'revision',
          topicName: rev.topic,
          plannedMinutes: 15, // 15-20 min standard
          completed: false,
          source: 'spaced_revision'
        });
        usedSubjectIds.add(sub.id);
      }
    }

    // 2. Check Teacher Diary topics marked as "explained in class" (Priority 2)
    for (const sub of enabledSubjects) {
      const explainedTopics = sub.topics.filter(t => t.taught);
      if (explainedTopics.length > 0 && !usedSubjectIds.has(sub.id)) {
        const latestExplained = explainedTopics[explainedTopics.length - 1];
        blocks.push({
          id: `blk_diary_${sub.id}_${Date.now()}`,
          subjectId: sub.id,
          subjectName: sub.name,
          type: 'study',
          topicName: `Fixação: ${latestExplained.name}`,
          plannedMinutes: 30,
          completed: false,
          source: 'teacher_diary'
        });
        usedSubjectIds.add(sub.id);
        if (blocks.length >= 2) break; // Keep space for other items
      }
    }

    // 3. Pending Tasks / Homework due today (Priority 3)
    const tasksToday = studentTasks.filter(t => !t.completed && t.date === today);
    for (const task of tasksToday) {
      const sub = subjects.find(s => s.id === task.subjectId);
      if (sub && !usedSubjectIds.has(sub.id)) {
        blocks.push({
          id: `blk_task_${task.id}`,
          subjectId: sub.id,
          subjectName: sub.name,
          type: task.type === 'prova' ? 'revision' : (task.type === 'quiz' ? 'quiz' : 'exercises'),
          topicName: task.title,
          plannedMinutes: 25,
          completed: false,
          source: 'task'
        });
        usedSubjectIds.add(sub.id);
      }
    }

    // 4. Upcoming Exam Prep in next 7 days (Priority 4)
    const upcomingEvals = evaluations.filter(e => {
      if (!e.date) return false;
      const diffDays = (new Date(e.date).getTime() - new Date().getTime()) / (1000 * 3600 * 24);
      return diffDays >= 0 && diffDays <= 7;
    });
    for (const ev of upcomingEvals) {
      const sub = subjects.find(s => s.id === ev.subjectId);
      if (sub && !usedSubjectIds.has(sub.id)) {
        blocks.push({
          id: `blk_eval_${ev.id}`,
          subjectId: sub.id,
          subjectName: sub.name,
          type: 'questions',
          topicName: `Treino de Questões: ${ev.name}`,
          plannedMinutes: 30,
          completed: false,
          source: 'plan'
        });
        usedSubjectIds.add(sub.id);
      }
    }

    // 5. Fill remaining target time using Adaptive Subject Weights (1 to 5)
    let currentTotalMin = blocks.reduce((acc, b) => acc + b.plannedMinutes, 0);

    // Sort available subjects by weight (highest weight first)
    const sortedSubjects = [...enabledSubjects].sort((a, b) => {
      const wA = subjectWeights[a.id] || a.weight || 3;
      const wB = subjectWeights[b.id] || b.weight || 3;
      return wB - wA;
    });

    let sIdx = 0;
    while (currentTotalMin < dailyGoalMinutes && sortedSubjects.length > 0) {
      const sub = sortedSubjects[sIdx % sortedSubjects.length];
      const untaughtTopics = sub.topics.filter(t => !t.taught);
      const chosenTopic = untaughtTopics.length > 0 ? untaughtTopics[0].name : (sub.topics[0]?.name || 'Revisão e Prática');

      // Determine duration based on weight
      const weight = subjectWeights[sub.id] || sub.weight || 3;
      const duration = weight >= 4 ? 40 : (weight <= 2 ? 25 : 30);

      blocks.push({
        id: `blk_cycle_${Math.random().toString(36).substring(2, 9)}`,
        subjectId: sub.id,
        subjectName: sub.name,
        type: sIdx % 2 === 0 ? 'study' : 'questions',
        topicName: chosenTopic,
        plannedMinutes: duration,
        completed: false,
        source: 'plan'
      });

      currentTotalMin += duration;
      sIdx++;
      if (sIdx >= sortedSubjects.length * 3) break; // Guard against infinite loop
    }

    // Fallback if empty
    if (blocks.length === 0 && enabledSubjects.length > 0) {
      const sub = enabledSubjects[0];
      blocks.push({
        id: `blk_default_1`,
        subjectId: sub.id,
        subjectName: sub.name,
        type: 'study',
        topicName: sub.topics[0]?.name || 'Tópico Principal',
        plannedMinutes: 30,
        completed: false,
        source: 'plan'
      });
    }

    // Generate breaks (5-10 min)
    const breaks: CycleBreakItem[] = [];
    for (let i = 0; i < blocks.length - 1; i++) {
      breaks.push({
        afterBlockIndex: i,
        plannedMinutes: (i + 1) % 2 === 0 ? 10 : 5
      });
    }

    const newCycle: DailyCycle = {
      id: `cycle_${today}_${Date.now()}`,
      date: today,
      blocks,
      breaks,
      totalPlannedMinutes: blocks.reduce((acc, b) => acc + b.plannedMinutes, 0),
      generatedAt: new Date().toISOString()
    };

    setDailyCycle(newCycle);
    return newCycle;
  }, [subjects, studentTasks, spacedRevisions, evaluations, today, dailyGoalMinutes, subjectWeights]);

  // Mark block as completed
  const markBlockCompleted = useCallback((
    blockId: string, 
    actualMinutes: number, 
    questionsDone?: number, 
    questionsCorrect?: number,
    selfRating?: number,
    fixated?: boolean,
    notes?: string
  ) => {
    if (!dailyCycle) return;

    let targetBlock: CycleBlockItem | undefined;

    const updatedBlocks = dailyCycle.blocks.map(blk => {
      if (blk.id === blockId) {
        targetBlock = {
          ...blk,
          completed: true,
          actualMinutes: actualMinutes || blk.plannedMinutes,
          questionsDone,
          questionsCorrect,
          selfRating,
          fixated,
          completedAt: new Date().toISOString(),
          notes
        };
        return targetBlock;
      }
      return blk;
    });

    const allCompleted = updatedBlocks.every(b => b.completed);

    const updatedCycle: DailyCycle = {
      ...dailyCycle,
      blocks: updatedBlocks,
      completedAt: allCompleted ? new Date().toISOString() : dailyCycle.completedAt,
      isCompleted: allCompleted,
      isPerfectCycle: allCompleted
    };

    setDailyCycle(updatedCycle);

    // Create study log entry
    if (targetBlock && onAddStudyLog) {
      const newLog: StudySessionLog = {
        id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        subjectId: targetBlock.subjectId,
        subjectName: targetBlock.subjectName,
        topic: targetBlock.topicName || 'Bloco de Ciclo de Estudo',
        minutes: actualMinutes || targetBlock.plannedMinutes,
        date: today,
        mode: 'escola',
        type: targetBlock.type,
        dailyPlanBlockId: targetBlock.id,
        questionsDone,
        questionsCorrect,
        timestamp: new Date().toISOString()
      };
      onAddStudyLog(newLog);
    }

    return updatedCycle;
  }, [dailyCycle, onAddStudyLog, today]);

  // Extend active block (+10 mins)
  const extendBlockTime = useCallback((blockId: string, additionalMinutes: number = 10) => {
    if (!dailyCycle) return;

    const updatedBlocks = dailyCycle.blocks.map(blk => {
      if (blk.id === blockId) {
        return {
          ...blk,
          plannedMinutes: blk.plannedMinutes + additionalMinutes
        };
      }
      return blk;
    });

    const updatedCycle: DailyCycle = {
      ...dailyCycle,
      blocks: updatedBlocks,
      totalPlannedMinutes: updatedBlocks.reduce((acc, b) => acc + b.plannedMinutes, 0)
    };

    setDailyCycle(updatedCycle);
  }, [dailyCycle]);

  // Skip a block (and flag for redistribution)
  const skipBlock = useCallback((blockId: string) => {
    if (!dailyCycle) return;

    const updatedBlocks = dailyCycle.blocks.filter(b => b.id !== blockId);
    const updatedCycle: DailyCycle = {
      ...dailyCycle,
      blocks: updatedBlocks,
      totalPlannedMinutes: updatedBlocks.reduce((acc, b) => acc + b.plannedMinutes, 0)
    };

    setDailyCycle(updatedCycle);
  }, [dailyCycle]);

  // Add custom block
  const addBlock = useCallback((newBlock: Omit<CycleBlockItem, 'id' | 'completed'>) => {
    const fullBlock: CycleBlockItem = {
      ...newBlock,
      id: `blk_custom_${Date.now()}`,
      completed: false
    };

    if (!dailyCycle) {
      const newCycle: DailyCycle = {
        id: `cycle_${today}_${Date.now()}`,
        date: today,
        blocks: [fullBlock],
        breaks: [],
        totalPlannedMinutes: fullBlock.plannedMinutes,
        generatedAt: new Date().toISOString()
      };
      setDailyCycle(newCycle);
      return newCycle;
    }

    const updatedBlocks = [...dailyCycle.blocks, fullBlock];
    const updatedBreaks = [...dailyCycle.breaks, {
      afterBlockIndex: updatedBlocks.length - 2,
      plannedMinutes: 5
    }];

    const updatedCycle: DailyCycle = {
      ...dailyCycle,
      blocks: updatedBlocks,
      breaks: updatedBreaks,
      totalPlannedMinutes: updatedBlocks.reduce((acc, b) => acc + b.plannedMinutes, 0)
    };

    setDailyCycle(updatedCycle);
    return updatedCycle;
  }, [dailyCycle, today]);

  // Remove block
  const removeBlock = useCallback((blockId: string) => {
    if (!dailyCycle) return;
    const updatedBlocks = dailyCycle.blocks.filter(b => b.id !== blockId);
    const updatedCycle: DailyCycle = {
      ...dailyCycle,
      blocks: updatedBlocks,
      totalPlannedMinutes: updatedBlocks.reduce((acc, b) => acc + b.plannedMinutes, 0)
    };
    setDailyCycle(updatedCycle);
  }, [dailyCycle]);

  return {
    dailyCycle,
    generateDailyCycle,
    markBlockCompleted,
    extendBlockTime,
    skipBlock,
    addBlock,
    removeBlock,
    setDailyCycle
  };
}
