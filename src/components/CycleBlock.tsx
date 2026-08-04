import React from 'react';
import { Play, CheckCircle2, Clock, BookOpen, Brain, HelpCircle, Layers, ArrowRight } from 'lucide-react';
import { CycleBlockItem, Subject } from '../types';

interface CycleBlockProps {
  block: CycleBlockItem;
  index: number;
  subject?: Subject;
  isCurrent?: boolean;
  onStart: (index: number) => void;
  onSkip?: (id: string) => void;
}

export const CycleBlock: React.FC<CycleBlockProps> = ({
  block,
  index,
  subject,
  isCurrent,
  onStart,
  onSkip
}) => {
  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'revision':
      case 'review':
        return {
          label: 'Revisão Espaçada',
          bg: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
          icon: Brain
        };
      case 'questions':
      case 'quiz':
      case 'exercises':
        return {
          label: 'Treino de Questões',
          bg: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
          icon: HelpCircle
        };
      case 'teacher_diary':
        return {
          label: 'Fixação (Diário)',
          bg: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
          icon: BookOpen
        };
      default:
        return {
          label: 'Estudo Teórico',
          bg: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30',
          icon: Layers
        };
    }
  };

  const badge = getTypeBadge(block.type);
  const BadgeIcon = badge.icon;

  return (
    <div
      className={`relative group rounded-xl p-3.5 sm:p-4 border transition-all ${
        block.completed
          ? 'bg-slate-900/40 border-slate-800 opacity-75'
          : isCurrent
          ? 'bg-gradient-to-r from-indigo-950/60 via-slate-900 to-slate-900 border-indigo-500/60 shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-500/30'
          : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700/80 hover:border-slate-600'
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        {/* Left Info */}
        <div className="flex items-center space-x-3 min-w-0">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
              block.completed
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : isCurrent
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 animate-pulse'
                : 'bg-slate-700/60 text-slate-300 border border-slate-600'
            }`}
          >
            {block.completed ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            ) : (
              <span>#{index + 1}</span>
            )}
          </div>

          <div className="space-y-1 min-w-0">
            <div className="flex items-center space-x-2 flex-wrap gap-y-1">
              <span className="font-bold text-white text-sm sm:text-base truncate">
                {block.subjectName}
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center space-x-1 ${badge.bg}`}>
                <BadgeIcon className="w-3 h-3" />
                <span>{badge.label}</span>
              </span>
            </div>

            {block.topicName && (
              <p className="text-slate-300 text-xs truncate">
                {block.topicName}
              </p>
            )}
          </div>
        </div>

        {/* Right Info & Actions */}
        <div className="flex items-center space-x-3 shrink-0">
          <div className="text-right">
            <div className="flex items-center space-x-1 text-slate-300 text-xs font-semibold">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              <span>{block.completed ? `${block.actualMinutes || block.plannedMinutes} min` : `${block.plannedMinutes} min`}</span>
            </div>
            {block.questionsDone !== undefined && block.questionsDone > 0 && (
              <span className="text-[10px] text-emerald-400 font-medium block">
                {block.questionsCorrect !== undefined ? `${block.questionsCorrect}/${block.questionsDone} acertos` : `${block.questionsDone} q.`}
              </span>
            )}
          </div>

          {!block.completed && (
            <button
              onClick={() => onStart(index)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 shadow ${
                isCurrent
                  ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
                  : 'bg-slate-700 hover:bg-indigo-600 text-slate-200 hover:text-white'
              }`}
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span className="hidden sm:inline">Estudar</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
