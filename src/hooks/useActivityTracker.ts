import { useEffect, useRef, useCallback } from 'react';
import { StudySessionLog, DailyPlanBlock } from '../types';

interface ActivityTrackerProps {
  onAutoTrackCompleted: (log: StudySessionLog) => void;
  activePlanBlock?: DailyPlanBlock | null;
}

export function useActivityTracker({
  onAutoTrackCompleted,
  activePlanBlock
}: ActivityTrackerProps) {
  const activeSessionRef = useRef<{
    subjectId: string;
    subjectName?: string;
    topic: string;
    type: 'quiz' | 'flashcards' | 'reading' | 'simulated';
    startTime: number;
    activityId?: string;
  } | null>(null);

  // Start tracking an activity
  const startActivity = useCallback((
    subjectId: string,
    topic: string,
    type: 'quiz' | 'flashcards' | 'reading' | 'simulated',
    subjectName?: string,
    activityId?: string
  ) => {
    activeSessionRef.current = {
      subjectId,
      subjectName,
      topic,
      type,
      startTime: Date.now(),
      activityId
    };
  }, []);

  // Finish tracking activity
  const finishActivity = useCallback((
    questionsDone?: number,
    questionsCorrect?: number
  ) => {
    if (!activeSessionRef.current) return null;

    const session = activeSessionRef.current;
    const durationMs = Date.now() - session.startTime;
    const durationMinutes = Math.max(1, Math.round(durationMs / 60000)); // min 1 min

    const todayStr = new Date().toISOString().split('T')[0];

    const log: StudySessionLog = {
      id: `autolog_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      subjectId: session.subjectId,
      subjectName: session.subjectName,
      topic: session.topic,
      minutes: durationMinutes,
      date: todayStr,
      mode: 'escola',
      type: session.type,
      autoTracked: true,
      activityId: session.activityId,
      dailyPlanBlockId: activePlanBlock?.id,
      questionsDone,
      questionsCorrect,
      timestamp: new Date().toISOString()
    };

    onAutoTrackCompleted(log);
    activeSessionRef.current = null;
    return log;
  }, [onAutoTrackCompleted, activePlanBlock]);

  return {
    startActivity,
    finishActivity,
    isTracking: Boolean(activeSessionRef.current)
  };
}
