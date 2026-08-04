import React from 'react';
import { 
  Play, Pause, FastForward, CheckSquare, Plus, Volume2, VolumeX, AlertCircle, Clock 
} from 'lucide-react';
import { DailyPlanBlock, Subject } from '../types';

interface BlockTimerProps {
  block: DailyPlanBlock;
  subject?: Subject;
  blockIndex: number;
  totalBlocks: number;
  secondsLeft: number;
  totalSeconds: number;
  isRunning: boolean;
  isPaused: boolean;
  isSoundEnabled: boolean;
  onTogglePlayPause: () => void;
  onExtendMinutes: (minutes: number) => void;
  onSkipBlock: () => void;
  onFinishEarly: () => void;
  onToggleSound: () => void;
}

export const BlockTimer: React.FC<BlockTimerProps> = ({
  block,
  subject,
  blockIndex,
  totalBlocks,
  secondsLeft,
  totalSeconds,
  isRunning,
  isPaused,
  isSoundEnabled,
  onTogglePlayPause,
  onExtendMinutes,
  onSkipBlock,
  onFinishEarly,
  onToggleSound
}) => {
  const subColor = subject?.color || '#6366f1';
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const progressPercent = Math.min(100, Math.max(0, ((totalSeconds - secondsLeft) / Math.max(1, totalSeconds)) * 100));
  const is5MinWarning = secondsLeft > 0 && secondsLeft <= 300; // 5 minutes or less

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl max-w-xl mx-auto space-y-8 animate-fadeIn relative overflow-hidden">
      
      {/* Background Subtle Gradient Glow */}
      <div 
        className="absolute -top-24 -right-24 w-64 h-64 rounded-full blur-3xl opacity-15 pointer-events-none transition-all duration-700"
        style={{ backgroundColor: subColor }}
      />

      {/* Top Header info */}
      <div className="flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center space-x-2">
          <span className="bg-slate-800 text-slate-300 px-3 py-1 rounded-full font-mono font-bold border border-slate-700">
            Bloco {blockIndex + 1} de {totalBlocks}
          </span>
          <span className="capitalize bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full font-bold border border-indigo-500/30">
            {block.type === 'exercises' ? '📝 Exercícios' :
             block.type === 'reading' ? '📖 Leitura' :
             block.type === 'review' ? '🔄 Revisão' :
             block.type === 'flashcards' ? '🎴 Flashcards' :
             block.type === 'quiz' ? '⚡ Quiz' : '🎯 Simulado'}
          </span>
        </div>

        <button
          onClick={onToggleSound}
          title={isSoundEnabled ? "Som Ativado" : "Som Desativado"}
          className={`p-2 rounded-xl border transition ${
            isSoundEnabled 
              ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/30' 
              : 'bg-slate-800 text-slate-500 border-slate-700'
          }`}
        >
          {isSoundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>
      </div>

      {/* Subject and Topic Card */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-2 bg-slate-800/80 border border-slate-700/80 px-4 py-1.5 rounded-full">
          <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: subColor }} />
          <span className="font-extrabold text-white text-sm sm:text-base">
            {block.subjectName}
          </span>
        </div>

        <h2 className="text-xl sm:text-2xl font-extrabold text-white font-display">
          {block.topicName || 'Exercícios e Estudo Guiado'}
        </h2>

        {is5MinWarning && isRunning && (
          <div className="inline-flex items-center space-x-1.5 text-xs text-amber-300 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full animate-pulse">
            <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>Faltam menos de 5 minutos! Finalizando em breve.</span>
          </div>
        )}
      </div>

      {/* Big Countdown Timer */}
      <div className="relative flex flex-col items-center justify-center py-4">
        <div className="font-mono text-6xl sm:text-7xl font-extrabold tracking-tighter text-white drop-shadow-md">
          {timeFormatted}
        </div>

        <p className="text-xs text-slate-400 mt-2 font-medium">
          {isPaused ? '⏸️ Sessão Pausada' : isRunning ? '⏱️ Cronômetro em Andamento' : 'Pronto para Iniciar'}
        </p>

        {/* Progress Bar */}
        <div className="w-full max-w-sm bg-slate-800 h-2.5 rounded-full overflow-hidden mt-6 p-0.5 border border-slate-700">
          <div 
            className="h-full rounded-full transition-all duration-300 shadow-lg"
            style={{ 
              width: `${progressPercent}%`,
              backgroundColor: subColor
            }}
          />
        </div>
      </div>

      {/* Main Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <button
          onClick={onTogglePlayPause}
          className={`w-full sm:w-auto px-8 py-4 rounded-2xl font-extrabold text-base transition shadow-xl flex items-center justify-center space-x-3 ${
            isRunning 
              ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/20' 
              : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20'
          }`}
        >
          {isRunning ? (
            <>
              <Pause className="w-5 h-5 fill-current" />
              <span>Pausar</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5 fill-current" />
              <span>{secondsLeft < totalSeconds ? 'Retomar' : 'Iniciar Bloco'}</span>
            </>
          )}
        </button>

        <button
          onClick={onFinishEarly}
          className="w-full sm:w-auto px-5 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-2xl transition shadow-lg shadow-indigo-600/20 flex items-center justify-center space-x-2"
        >
          <CheckSquare className="w-4 h-4" />
          <span>Finalizar Bloco</span>
        </button>
      </div>

      {/* Auxiliary Controls */}
      <div className="flex items-center justify-between border-t border-slate-800 pt-4 text-xs text-slate-400">
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-slate-500">Estender:</span>
          <button
            onClick={() => onExtendMinutes(5)}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-bold rounded-lg transition"
          >
            +5m
          </button>
          <button
            onClick={() => onExtendMinutes(10)}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-bold rounded-lg transition"
          >
            +10m
          </button>
        </div>

        <button
          onClick={onSkipBlock}
          className="text-slate-400 hover:text-white transition flex items-center space-x-1 font-semibold"
        >
          <span>Pular Próximo</span>
          <FastForward className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
};
