import React from 'react';
import { StudySession } from './StudySession';
import { DailyCycle, Subject, StudySessionLog } from '../types';

interface CycleSessionProps {
  isOpen: boolean;
  onClose: () => void;
  dailyCycle: DailyCycle | null;
  initialBlockIndex?: number;
  isFreeMode?: boolean;
  subjects: Subject[];
  onMarkBlockCompleted: (
    blockId: string, 
    actualMinutes: number, 
    questionsDone?: number, 
    questionsCorrect?: number, 
    notes?: string
  ) => void;
  onAddFreeLog: (log: StudySessionLog) => void;
}

export const CycleSession: React.FC<CycleSessionProps> = ({
  isOpen,
  onClose,
  dailyCycle,
  initialBlockIndex = 0,
  isFreeMode = false,
  subjects,
  onMarkBlockCompleted,
  onAddFreeLog
}) => {
  return (
    <StudySession
      isOpen={isOpen}
      onClose={onClose}
      dailyPlan={dailyCycle}
      initialBlockIndex={initialBlockIndex}
      isFreeMode={isFreeMode}
      subjects={subjects}
      onMarkBlockCompleted={onMarkBlockCompleted}
      onAddFreeLog={onAddFreeLog}
    />
  );
};
