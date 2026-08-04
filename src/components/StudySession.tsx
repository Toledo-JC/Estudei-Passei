import React from 'react';
import { DailyCycle, Subject, StudySessionLog } from '../types';
import { DailyTimerSection } from './DailyTimerSection';

interface StudySessionProps {
  isOpen: boolean;
  onClose: () => void;
  dailyPlan: DailyCycle | null;
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

export const StudySession: React.FC<StudySessionProps> = ({
  isOpen,
  onClose,
  dailyPlan,
  initialBlockIndex = 0,
  subjects,
  onMarkBlockCompleted,
  onAddFreeLog
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in">
      <div className="w-full max-w-xl my-8">
        <DailyTimerSection
          subjects={subjects}
          studyLogs={[]}
          dailyCycle={dailyPlan}
          activeBlockIndex={initialBlockIndex}
          onMarkBlockCompleted={onMarkBlockCompleted}
          isModal={true}
          onCloseModal={onClose}
          onLogStudySession={(subId, topic, mins, mode) => {
            onAddFreeLog({
              id: `log_free_${Date.now()}`,
              subjectId: subId,
              subjectName: subjects.find(s => s.id === subId)?.name || 'Estudo Livre',
              topic: topic || 'Estudo Livre',
              minutes: mins,
              date: new Date().toISOString().split('T')[0],
              mode,
              timestamp: new Date().toISOString()
            });
          }}
        />
      </div>
    </div>
  );
};
