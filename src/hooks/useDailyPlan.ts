import { useCycle, getTodayDateString } from './useCycle';
import { 
  Subject, 
  StudentTaskItem, 
  SpacedRevision, 
  Evaluation, 
  StudySessionLog 
} from '../types';

export { getTodayDateString };

interface UseDailyPlanProps {
  subjects: Subject[];
  studentTasks?: StudentTaskItem[];
  spacedRevisions?: SpacedRevision[];
  evaluations?: Evaluation[];
  studyLogs?: StudySessionLog[];
  onAddStudyLog?: (log: StudySessionLog) => void;
  dailyGoalMinutes?: number;
}

export function useDailyPlan({
  subjects,
  studentTasks = [],
  spacedRevisions = [],
  evaluations = [],
  studyLogs = [],
  onAddStudyLog,
  dailyGoalMinutes = 60
}: UseDailyPlanProps) {
  const cycleResult = useCycle({
    subjects,
    studentTasks,
    spacedRevisions,
    evaluations,
    studyLogs,
    onAddStudyLog,
    dailyGoalMinutes
  });

  return {
    dailyPlan: cycleResult.dailyCycle,
    generateDailyPlan: cycleResult.generateDailyCycle,
    markBlockCompleted: (
      blockId: string, 
      actualMinutes: number, 
      questionsDone?: number, 
      questionsCorrect?: number,
      notes?: string
    ) => cycleResult.markBlockCompleted(blockId, actualMinutes, questionsDone, questionsCorrect, undefined, undefined, notes),
    addBlock: cycleResult.addBlock,
    removeBlock: cycleResult.removeBlock,
    setDailyPlan: cycleResult.setDailyCycle,
    extendBlockTime: cycleResult.extendBlockTime,
    skipBlock: cycleResult.skipBlock
  };
}
