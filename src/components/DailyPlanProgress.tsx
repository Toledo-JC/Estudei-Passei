import React from 'react';
import { 
  Play, Sparkles, CheckCircle2, Clock, Calendar, Plus, RefreshCw, ChevronRight, Zap, Target 
} from 'lucide-react';
import { DailyPlan, Subject } from '../types';

interface DailyPlanProgressProps {
  dailyPlan: DailyPlan | null;
  subjects: Subject[];
  onStartSession: (blockIndex?: number) => void;
  onOpenFreeStudy: () => void;
  onGeneratePlan: () => void;
  onEditPlan: () => void;
  onLogExternal: () => void;
}

export const DailyPlanProgress: React.FC<DailyPlanProgressProps> = ({
  dailyPlan,
  subjects,
  onStartSession,
  onOpenFreeStudy,
  onGeneratePlan,
  onEditPlan,
  onLogExternal
}) => {
  if (!dailyPlan || dailyPlan.blocks.length === 0) {
    return (
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="bg-indigo-500/20 text-indigo-300 text-xs font-bold px-2.5 py-1 rounded-full border border-indigo-500/30 flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Cronômetro Inteligente</span>
              </span>
              <span className="text-slate-400 text-xs flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>Hoje</span>
              </span>
            </div>
            <h3 className="text-xl font-extrabold text-white font-display">
              Planejamento Diário de Estudos
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm">
              Gere seu plano guiado de hoje ou inicie uma sessão livre com cronômetro automático.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onGeneratePlan}
              className="flex-1 sm:flex-none px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm rounded-xl transition shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Gerar Plano de Hoje</span>
            </button>
            <button
              onClick={onOpenFreeStudy}
              className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs sm:text-sm rounded-xl transition flex items-center justify-center space-x-1.5"
            >
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Estudo Livre</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const completedBlocks = dailyPlan.blocks.filter(b => b.completed).length;
  const totalBlocks = dailyPlan.blocks.length;
  const completedMinutes = dailyPlan.blocks.reduce((acc, b) => acc + (b.completed ? (b.actualMinutes || b.plannedMinutes) : 0), 0);
  const totalPlannedMinutes = dailyPlan.totalPlannedMinutes;
  const progressPercent = Math.min(100, Math.round((completedMinutes / Math.max(1, totalPlannedMinutes)) * 100));

  const nextUncompletedIndex = dailyPlan.blocks.findIndex(b => !b.completed);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="bg-indigo-500/20 text-indigo-300 text-xs font-bold px-2.5 py-0.5 rounded-full border border-indigo-500/30 flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Plano do Dia Inteligente</span>
            </span>
            {dailyPlan.isPerfectDay && (
              <span className="bg-amber-500/20 text-amber-300 text-xs font-extrabold px-2.5 py-0.5 rounded-full border border-amber-500/30">
                🚀 Plano Perfeito!
              </span>
            )}
          </div>
          <h3 className="text-xl font-extrabold text-white font-display flex items-center space-x-2">
            <span>Ritmador de Estudos</span>
            <span className="text-slate-400 font-normal text-sm">
              ({completedBlocks}/{totalBlocks} blocos)
            </span>
          </h3>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {nextUncompletedIndex !== -1 ? (
            <button
              onClick={() => onStartSession(nextUncompletedIndex)}
              className="flex-1 sm:flex-none px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold text-xs sm:text-sm rounded-xl transition shadow-lg shadow-emerald-500/20 flex items-center justify-center space-x-2"
            >
              <Play className="w-4 h-4 fill-current text-white" />
              <span>Iniciar Estudo ({dailyPlan.blocks[nextUncompletedIndex].subjectName})</span>
            </button>
          ) : (
            <button
              onClick={() => onStartSession(0)}
              className="flex-1 sm:flex-none px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm rounded-xl transition flex items-center justify-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Revisar Sessões</span>
            </button>
          )}

          <button
            onClick={onOpenFreeStudy}
            title="Iniciar Estudo Livre"
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-xl transition"
          >
            <Zap className="w-4 h-4 text-amber-400" />
          </button>

          <button
            onClick={onLogExternal}
            title="Lançar Atividade Externa"
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-xl transition"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-slate-300 font-medium">
          <span className="flex items-center space-x-1">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            <span>Progresso em Tempo: <strong>{completedMinutes} min</strong> de {totalPlannedMinutes} min</span>
          </span>
          <span className="font-bold text-indigo-400">{progressPercent}%</span>
        </div>
        <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
          <div 
            className="bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 h-full rounded-full transition-all duration-500 shadow-sm"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Block List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {dailyPlan.blocks.map((blk, idx) => {
          const sub = subjects.find(s => s.id === blk.subjectId);
          const subColor = sub?.color || '#6366f1';

          return (
            <div
              key={blk.id}
              onClick={() => onStartSession(idx)}
              className={`p-3.5 rounded-xl border transition cursor-pointer flex flex-col justify-between space-y-3 ${
                blk.completed
                  ? 'bg-emerald-950/20 border-emerald-500/30 hover:border-emerald-500/50'
                  : idx === nextUncompletedIndex
                  ? 'bg-indigo-950/30 border-indigo-500/50 ring-1 ring-indigo-500/30 shadow-lg shadow-indigo-500/10'
                  : 'bg-slate-800/60 border-slate-700/80 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center space-x-2 min-w-0">
                  <span 
                    className="w-3 h-3 rounded-full shrink-0" 
                    style={{ backgroundColor: subColor }}
                  />
                  <span className="font-bold text-white text-xs sm:text-sm truncate">
                    {blk.subjectName}
                  </span>
                </div>

                {blk.completed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md shrink-0">
                    {blk.plannedMinutes} min
                  </span>
                )}
              </div>

              <div className="space-y-1">
                <p className="text-xs text-slate-300 font-medium line-clamp-1">
                  {blk.topicName || 'Tópicos da Disciplina'}
                </p>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="capitalize text-indigo-300 font-semibold text-[10px] bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded">
                    {blk.type === 'exercises' ? '📝 Exercícios' :
                     blk.type === 'reading' ? '📖 Leitura' :
                     blk.type === 'review' ? '🔄 Revisão' :
                     blk.type === 'flashcards' ? '🎴 Flashcards' :
                     blk.type === 'quiz' ? '⚡ Quiz' : '🎯 Simulado'}
                  </span>
                  <span className="text-slate-400 text-[10px]">
                    Bloco {idx + 1}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
        <button
          onClick={onEditPlan}
          className="text-slate-400 hover:text-white transition underline flex items-center space-x-1"
        >
          <span>Editar ou Reordenar Blocos</span>
        </button>

        <button
          onClick={onGeneratePlan}
          className="text-indigo-400 hover:text-indigo-300 transition font-semibold flex items-center space-x-1"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Regerar Plano</span>
        </button>
      </div>
    </div>
  );
};
