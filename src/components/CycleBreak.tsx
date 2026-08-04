import React, { useState, useEffect } from 'react';
import { Coffee, Play, Sparkles, CheckCircle2, RotateCcw, Heart, Droplets, Smile } from 'lucide-react';

interface CycleBreakProps {
  breakMinutes: number;
  nextSubjectName?: string;
  onFinishBreak: () => void;
  onSkipBreak: () => void;
}

export const CycleBreak: React.FC<CycleBreakProps> = ({
  breakMinutes,
  nextSubjectName,
  onFinishBreak,
  onSkipBreak
}) => {
  const [secondsLeft, setSecondsLeft] = useState(breakMinutes * 60);

  useEffect(() => {
    if (secondsLeft <= 0) {
      onFinishBreak();
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft, onFinishBreak]);

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const timeFormatted = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  return (
    <div className="bg-gradient-to-br from-slate-900 via-indigo-950/50 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 sm:p-8 text-center space-y-6 max-w-md mx-auto shadow-2xl">
      <div className="w-16 h-16 rounded-full bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center mx-auto text-indigo-400 animate-bounce">
        <Coffee className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/30 inline-flex items-center space-x-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Hora da Pausa Estratégica</span>
        </span>
        <h3 className="text-2xl font-extrabold text-white font-display">
          Descanse a Mente
        </h3>
        <p className="text-slate-300 text-xs sm:text-sm">
          A consolidação da memória ocorre durante as pausas ativas.
        </p>
      </div>

      {/* Timer display */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 inline-block px-8 py-4 shadow-inner">
        <span className="text-4xl sm:text-5xl font-mono font-extrabold text-amber-400 tracking-wider">
          {timeFormatted}
        </span>
      </div>

      {/* Wellness suggestions */}
      <div className="grid grid-cols-3 gap-2 text-center text-[11px] text-slate-300">
        <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/60 flex flex-col items-center space-y-1">
          <Droplets className="w-4 h-4 text-sky-400" />
          <span>Beba Água</span>
        </div>
        <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/60 flex flex-col items-center space-y-1">
          <Heart className="w-4 h-4 text-rose-400" />
          <span>Alongue-se</span>
        </div>
        <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/60 flex flex-col items-center space-y-1">
          <Smile className="w-4 h-4 text-amber-400" />
          <span>Descanse os Olhos</span>
        </div>
      </div>

      {nextSubjectName && (
        <div className="bg-indigo-950/30 p-3 rounded-xl border border-indigo-500/20 text-xs text-indigo-200">
          A seguir: <strong>{nextSubjectName}</strong>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-center space-x-3 pt-2">
        <button
          onClick={onSkipBreak}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl border border-slate-700 transition"
        >
          Pular Pausa
        </button>
        <button
          onClick={onFinishBreak}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition flex items-center space-x-1.5"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>Próximo Bloco</span>
        </button>
      </div>
    </div>
  );
};
