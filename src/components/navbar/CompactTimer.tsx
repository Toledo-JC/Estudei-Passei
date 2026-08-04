import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, Play, Pause, Square, ChevronDown, Sparkles, BookOpen } from 'lucide-react';
import { useStudyTimer } from '../../contexts/StudyTimerContext';

interface CompactTimerProps {
  onOpenStudyTab?: () => void;
}

export const CompactTimer: React.FC<CompactTimerProps> = ({ onOpenStudyTab }) => {
  const {
    status,
    mode,
    blocks,
    currentBlockIndex,
    currentBlock,
    formattedTime,
    pauseSession,
    resumeSession,
    finishSession
  } = useStudyTimer();

  const [isOpen, setIsOpen] = useState(false);

  if (status === 'idle') {
    return null; // Renderizar APENAS quando status !== 'idle'
  }

  const isRunning = status === 'running';

  const badgeText = mode === 'ciclo'
    ? `Ciclo (${currentBlockIndex + 1}/${blocks.length || 1})`
    : 'Manual';

  return (
    <div className="relative">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: -5 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: -5 }}
        transition={{ duration: 0.2 }}
        className="flex items-center"
      >
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-medium shadow-sm transition border ${
            isRunning
              ? 'bg-slate-900 dark:bg-slate-900 border-indigo-500/50 text-white hover:border-indigo-400'
              : 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200 hover:bg-amber-100'
          }`}
        >
          <div className={`p-1 rounded-full ${isRunning ? 'bg-emerald-500/20 text-emerald-400 animate-pulse' : 'bg-amber-500/20 text-amber-500'}`}>
            <Clock className="w-3.5 h-3.5" />
          </div>

          <span className="font-mono text-xs font-bold tabular-nums text-emerald-400 dark:text-emerald-400">
            {formattedTime}
          </span>

          <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-indigo-950/80 text-indigo-300 border border-indigo-800/60 uppercase tracking-wider">
            {badgeText}
          </span>

          <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </motion.div>

      {/* Dropdown / Popover */}
      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-4 z-50 space-y-3"
            >
              {/* Info da Matéria Atual */}
              <div className="flex items-start space-x-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 shrink-0">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Sessão Ativa
                  </p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                    {currentBlock?.subject || 'Estudo Livre'}
                  </p>
                  {currentBlock?.topic && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {currentBlock.topic}
                    </p>
                  )}
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                {isRunning ? (
                  <button
                    type="button"
                    onClick={() => {
                      pauseSession();
                      setIsOpen(false);
                    }}
                    className="flex items-center justify-center space-x-1.5 py-2 px-3 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl transition shadow-xs"
                  >
                    <Pause className="w-3.5 h-3.5" />
                    <span>Pausar</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      resumeSession();
                      setIsOpen(false);
                    }}
                    className="flex items-center justify-center space-x-1.5 py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition shadow-xs"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Retomar</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    finishSession();
                    setIsOpen(false);
                  }}
                  className="flex items-center justify-center space-x-1.5 py-2 px-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40 text-xs font-bold rounded-xl transition"
                >
                  <Square className="w-3.5 h-3.5" />
                  <span>Finalizar</span>
                </button>
              </div>

              {/* Atalho para ir para Tela de Estudo */}
              {onOpenStudyTab && (
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    onOpenStudyTab();
                  }}
                  className="w-full mt-1 py-1.5 text-center text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline flex items-center justify-center space-x-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Abrir Tela de Estudo Completa</span>
                </button>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CompactTimer;
