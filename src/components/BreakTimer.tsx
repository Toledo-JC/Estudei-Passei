import React, { useState, useEffect } from 'react';
import { Coffee, Play, SkipForward, Sparkles, HeartPulse, Droplets, Eye } from 'lucide-react';

interface BreakTimerProps {
  breakMinutes: number;
  nextSubjectName?: string;
  onFinishBreak: () => void;
  onSkipBreak: () => void;
}

const BREAK_TIPS = [
  { icon: Droplets, title: 'Hidratação', text: 'Beba um copo d’água para manter o cérebro bem irrigado!' },
  { icon: HeartPulse, title: 'Alongamento', text: 'Levante-se, role os ombros e estique o pescoço suavemente.' },
  { icon: Eye, title: 'Descanso Visual', text: 'Olhe para algo distante na janela por 20 segundos.' },
  { icon: Sparkles, title: 'Respiração Guiada', text: 'Respire fundo em 4 segundos e solte em 6 segundos.' }
];

export const BreakTimer: React.FC<BreakTimerProps> = ({
  breakMinutes,
  nextSubjectName,
  onFinishBreak,
  onSkipBreak
}) => {
  const [secondsLeft, setSecondsLeft] = useState(breakMinutes * 60);
  const [tipIndex] = useState(() => Math.floor(Math.random() * BREAK_TIPS.length));

  useEffect(() => {
    if (secondsLeft <= 0) {
      onFinishBreak();
      return;
    }

    const interval = setInterval(() => {
      setSecondsLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [secondsLeft, onFinishBreak]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const currentTip = BREAK_TIPS[tipIndex];
  const TipIcon = currentTip.icon;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl max-w-xl mx-auto space-y-6 text-center animate-fadeIn">
      
      {/* Header */}
      <div className="inline-flex items-center space-x-2 bg-amber-500/10 border border-amber-500/20 text-amber-300 px-4 py-1.5 rounded-full text-xs font-extrabold">
        <Coffee className="w-4 h-4 text-amber-400" />
        <span>Hora da Pausa e Descompressão Mental ({breakMinutes} min)</span>
      </div>

      <div className="space-y-1">
        <h2 className="text-2xl font-extrabold text-white font-display">
          Descanse a Mente! ☕
        </h2>
        <p className="text-xs sm:text-sm text-slate-400">
          A pausa consolida a memória recente e previne a fadiga cognitiva.
        </p>
      </div>

      {/* Timer */}
      <div className="py-2">
        <div className="font-mono text-6xl font-extrabold text-amber-400 tracking-tighter drop-shadow-md">
          {timeFormatted}
        </div>
      </div>

      {/* Wellness Tip Card */}
      <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-2xl flex items-start space-x-3 text-left">
        <div className="p-2.5 bg-amber-500/20 text-amber-300 rounded-xl shrink-0">
          <TipIcon className="w-5 h-5" />
        </div>
        <div className="space-y-0.5">
          <h4 className="font-bold text-white text-xs sm:text-sm">
            Dica de Descanso: {currentTip.title}
          </h4>
          <p className="text-xs text-slate-300">
            {currentTip.text}
          </p>
        </div>
      </div>

      {/* Next Subject preview */}
      {nextSubjectName && (
        <div className="text-xs text-slate-400">
          Próximo Bloco: <strong className="text-indigo-300">{nextSubjectName}</strong>
        </div>
      )}

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <button
          onClick={onFinishBreak}
          className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm rounded-xl transition shadow-lg shadow-emerald-600/20 flex items-center justify-center space-x-2"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>Iniciar Próximo Bloco</span>
        </button>

        <button
          onClick={onSkipBreak}
          className="w-full sm:w-auto px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-semibold text-xs rounded-xl transition flex items-center justify-center space-x-1.5"
        >
          <span>Pular Pausa</span>
          <SkipForward className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
