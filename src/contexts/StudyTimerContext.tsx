import React, { createContext, useContext, useState, useEffect } from 'react';

export type StudyMode = 'manual' | 'ciclo';
export type StudyStatus = 'idle' | 'running' | 'paused' | 'finished';

export interface StudyBlockItem {
  id: string;
  subject: string;
  topic?: string;
  duration: number; // in minutes
  type: 'escola' | 'enem';
  completed: boolean;
}

export interface StudySessionState {
  mode: StudyMode;
  status: StudyStatus;
  blocks: StudyBlockItem[];
  currentBlockIndex: number;
  timeElapsed: number; // in seconds
  totalTime: number; // in seconds (duration of current block in cycle mode)
}

interface StudyTimerContextType extends StudySessionState {
  // Functions
  startSession: (mode: StudyMode, blocks?: StudyBlockItem[]) => void;
  pauseSession: () => void;
  resumeSession: () => void;
  addTime: (minutes: number) => void;
  skipBlock: () => void;
  finishBlock: () => void;
  finishSession: () => void;
  resetSession: () => void;

  // Formatting helper
  formattedTime: string;
  currentBlock: StudyBlockItem | null;

  // Legacy/Compatibility fields
  isTimerRunning: boolean;
  timerMode: 'cycle' | 'manual';
  secondsLeft: number;
  manualSecondsElapsed: number;
  activeSubjectName: string;
  activeTopicName: string;
  toggleTimer: () => void;
  resetTimer: () => void;
  addTenMinutes: () => void;
}

const LOCAL_STORAGE_KEY = 'estudei_passei_study_timer_session_v2';

const DEFAULT_SAMPLE_BLOCKS: StudyBlockItem[] = [
  { id: 'b1', subject: 'Matemática', topic: 'Equações do 2º Grau & Funções', duration: 50, type: 'enem', completed: false },
  { id: 'b2', subject: 'Língua Portuguesa', topic: 'Interpretação de Texto & Coesão', duration: 50, type: 'escola', completed: false },
  { id: 'b3', subject: 'Física', topic: 'Cinemática Escalar', duration: 40, type: 'enem', completed: false }
];

const StudyTimerContext = createContext<StudyTimerContextType | undefined>(undefined);

export const StudyTimerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<StudySessionState>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.status) {
          return parsed;
        }
      }
    } catch {
      // fallback to initial
    }
    return {
      mode: 'manual',
      status: 'idle',
      blocks: [],
      currentBlockIndex: 0,
      timeElapsed: 0,
      totalTime: 0
    };
  });

  // Persistence to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(session));
    } catch (e) {
      console.error('Failed to save study timer session to localStorage:', e);
    }
  }, [session]);

  // Main ticker interval
  useEffect(() => {
    if (session.status !== 'running') return;

    const interval = setInterval(() => {
      setSession(prev => {
        if (prev.status !== 'running') return prev;

        const nextElapsed = prev.timeElapsed + 1;

        // Auto advance in cycle mode if block time reached
        if (prev.mode === 'ciclo' && prev.totalTime > 0 && nextElapsed >= prev.totalTime) {
          // Finish block logic
          const updatedBlocks = prev.blocks.map((b, idx) =>
            idx === prev.currentBlockIndex ? { ...b, completed: true } : b
          );
          const nextIndex = prev.currentBlockIndex + 1;

          if (nextIndex < updatedBlocks.length) {
            const nextBlock = updatedBlocks[nextIndex];
            return {
              ...prev,
              blocks: updatedBlocks,
              currentBlockIndex: nextIndex,
              timeElapsed: 0,
              totalTime: (nextBlock.duration || 25) * 60,
              status: 'running'
            };
          } else {
            // All blocks finished
            return {
              ...prev,
              blocks: updatedBlocks,
              status: 'finished'
            };
          }
        }

        return {
          ...prev,
          timeElapsed: nextElapsed
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [session.status, session.mode, session.totalTime]);

  // Actions
  const startSession = (mode: StudyMode, customBlocks?: StudyBlockItem[]) => {
    const blocksToUse = customBlocks && customBlocks.length > 0 ? customBlocks : DEFAULT_SAMPLE_BLOCKS;
    const firstBlock = blocksToUse[0];
    const initialTotalTime = mode === 'ciclo' ? (firstBlock ? firstBlock.duration * 60 : 25 * 60) : 0;

    setSession({
      mode,
      status: 'running',
      blocks: blocksToUse,
      currentBlockIndex: 0,
      timeElapsed: 0,
      totalTime: initialTotalTime
    });
  };

  const pauseSession = () => {
    setSession(prev => (prev.status === 'running' ? { ...prev, status: 'paused' } : prev));
  };

  const resumeSession = () => {
    setSession(prev => (prev.status === 'paused' ? { ...prev, status: 'running' } : prev));
  };

  const addTime = (minutes: number) => {
    const secondsToAdd = minutes * 60;
    setSession(prev => {
      if (prev.mode === 'ciclo') {
        return { ...prev, totalTime: prev.totalTime + secondsToAdd };
      }
      return { ...prev, timeElapsed: Math.max(0, prev.timeElapsed + secondsToAdd) };
    });
  };

  const skipBlock = () => {
    setSession(prev => {
      if (prev.mode !== 'ciclo') return prev;
      const nextIndex = prev.currentBlockIndex + 1;
      if (nextIndex < prev.blocks.length) {
        const nextBlock = prev.blocks[nextIndex];
        return {
          ...prev,
          currentBlockIndex: nextIndex,
          timeElapsed: 0,
          totalTime: (nextBlock.duration || 25) * 60,
          status: 'running'
        };
      } else {
        return { ...prev, status: 'finished' };
      }
    });
  };

  const finishBlock = () => {
    setSession(prev => {
      const updatedBlocks = prev.blocks.map((b, idx) =>
        idx === prev.currentBlockIndex ? { ...b, completed: true } : b
      );

      if (prev.mode === 'ciclo') {
        const nextIndex = prev.currentBlockIndex + 1;
        if (nextIndex < updatedBlocks.length) {
          const nextBlock = updatedBlocks[nextIndex];
          return {
            ...prev,
            blocks: updatedBlocks,
            currentBlockIndex: nextIndex,
            timeElapsed: 0,
            totalTime: (nextBlock.duration || 25) * 60,
            status: 'running'
          };
        } else {
          return {
            ...prev,
            blocks: updatedBlocks,
            status: 'finished'
          };
        }
      } else {
        return {
          ...prev,
          blocks: updatedBlocks,
          status: 'finished'
        };
      }
    });
  };

  const finishSession = () => {
    setSession(prev => ({
      ...prev,
      status: 'finished'
    }));
  };

  const resetSession = () => {
    setSession({
      mode: 'manual',
      status: 'idle',
      blocks: [],
      currentBlockIndex: 0,
      timeElapsed: 0,
      totalTime: 0
    });
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  const currentBlock = session.blocks[session.currentBlockIndex] || null;

  // Formatted string (MM:SS)
  const displaySeconds = session.mode === 'ciclo'
    ? Math.max(0, session.totalTime - session.timeElapsed)
    : session.timeElapsed;

  const mins = Math.floor(displaySeconds / 60);
  const secs = displaySeconds % 60;
  const formattedTime = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  // Compatibility helpers
  const isTimerRunning = session.status === 'running';
  const timerMode = session.mode === 'ciclo' ? 'cycle' : 'manual';
  const secondsLeft = Math.max(0, session.totalTime - session.timeElapsed);
  const manualSecondsElapsed = session.timeElapsed;
  const activeSubjectName = currentBlock ? currentBlock.subject : 'Estudo Livre';
  const activeTopicName = currentBlock?.topic || '';

  const toggleTimer = () => {
    if (session.status === 'running') pauseSession();
    else if (session.status === 'paused') resumeSession();
    else if (session.status === 'idle') startSession(session.mode);
  };

  const resetTimer = () => {
    resetSession();
  };

  const addTenMinutes = () => {
    addTime(10);
  };

  return (
    <StudyTimerContext.Provider
      value={{
        ...session,
        startSession,
        pauseSession,
        resumeSession,
        addTime,
        skipBlock,
        finishBlock,
        finishSession,
        resetSession,
        formattedTime,
        currentBlock,

        // Legacy/Compatibility
        isTimerRunning,
        timerMode,
        secondsLeft,
        manualSecondsElapsed,
        activeSubjectName,
        activeTopicName,
        toggleTimer,
        resetTimer,
        addTenMinutes
      }}
    >
      {children}
    </StudyTimerContext.Provider>
  );
};

export const useStudyTimer = () => {
  const context = useContext(StudyTimerContext);
  if (!context) {
    throw new Error('useStudyTimer must be used within a StudyTimerProvider');
  }
  return context;
};

export default StudyTimerContext;
