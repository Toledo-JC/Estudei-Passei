import React from 'react';
import { 
  Play, Sparkles, CheckCircle2, Clock, Calendar, Plus, RefreshCw, ChevronRight, Zap, Target, BookOpen, Layers, Settings, FilePlus
} from 'lucide-react';
import { DailyCycle, Subject } from '../types';
import { CycleBlock } from './CycleBlock';

interface CycleDashboardProps {
  dailyCycle: DailyCycle | null;
  subjects: Subject[];
  onStartCycleSession: (blockIndex?: number) => void;
  onOpenFreeStudy: () => void;
  onGenerateCycle: () => void;
  onEditCycle: () => void;
  onLogExternal: () => void;
}

export const CycleDashboard: React.FC<CycleDashboardProps> = ({
  dailyCycle,
  subjects,
  onStartCycleSession,
  onOpenFreeStudy,
  onGenerateCycle,
  onEditCycle,
  onLogExternal
}) => {
  if (!dailyCycle || dailyCycle.blocks.length === 0) {
    return (
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="bg-indigo-500/20 text-indigo-300 text-xs font-bold px-2.5 py-1 rounded-full border border-indigo-500/30 flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Ciclo Adaptativo — Camada de Execução</span>
              </span>
              <span className="text-slate-400 text-xs flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>Hoje</span>
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white font-display">
              Execução do Ciclo de Estudos de Hoje
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl">
              O motor adaptativo calcula as matérias com base em pesos, revisões e tarefas da escola. Clique em iniciar para o cronômetro guiar sua rotina bloco a bloco.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onGenerateCycle}
              className="flex-1 sm:flex-none px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm rounded-xl transition shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2"
            >
              <Play className="w-4 h-4 fill-current text-amber-300" />
              <span>▶ Iniciar Ciclo de Hoje</span>
            </button>
            <button
              onClick={onOpenFreeStudy}
              className="px-3.5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs sm:text-sm rounded-xl transition flex items-center justify-center space-x-1.5"
            >
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Estudo Livre</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const completedBlocks = dailyCycle.blocks.filter(b => b.completed).length;
  const totalBlocks = dailyCycle.blocks.length;
  const completedMinutes = dailyCycle.blocks.reduce((acc, b) => acc + (b.completed ? (b.actualMinutes || b.plannedMinutes) : 0), 0);
  const totalPlannedMinutes = dailyCycle.totalPlannedMinutes;
  const progressPercent = Math.min(100, Math.round((completedMinutes / Math.max(1, totalPlannedMinutes)) * 100));

  const nextUncompletedIndex = dailyCycle.blocks.findIndex(b => !b.completed);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 flex-wrap gap-y-1">
            <span className="bg-indigo-500/20 text-indigo-300 text-xs font-bold px-2.5 py-0.5 rounded-full border border-indigo-500/30 flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Ciclo Adaptativo do Dia</span>
            </span>
            {dailyCycle.isPerfectCycle && (
              <span className="bg-amber-500/20 text-amber-300 text-xs font-extrabold px-2.5 py-0.5 rounded-full border border-amber-500/30">
                🚀 Ciclo Perfeito Cumprido!
              </span>
            )}
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-white font-display flex items-center space-x-2">
            <span>Assistente do Ciclo</span>
            <span className="text-slate-400 font-normal text-sm">
              ({completedBlocks}/{totalBlocks} blocos concluídos)
            </span>
          </h3>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {nextUncompletedIndex !== -1 && (
            <button
              onClick={() => onStartCycleSession(nextUncompletedIndex)}
              className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg shadow-indigo-600/30 transition flex items-center justify-center space-x-2"
            >
              <Play className="w-4 h-4 fill-current text-amber-300" />
              <span>▶ Iniciar Ciclo de Hoje</span>
            </button>
          )}

          <button
            onClick={onOpenFreeStudy}
            className="px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs rounded-xl transition flex items-center justify-center space-x-1"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Estudo Livre</span>
          </button>

          <button
            onClick={onLogExternal}
            className="px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs rounded-xl transition flex items-center justify-center space-x-1"
          >
            <FilePlus className="w-3.5 h-3.5 text-emerald-400" />
            <span>Ext.</span>
          </button>

          <button
            onClick={onEditCycle}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-xl transition"
            title="Ajustar Ciclo do Dia"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs text-slate-300 font-semibold">
          <span>Progresso do Ciclo</span>
          <span className="text-indigo-400">{completedMinutes} min / {totalPlannedMinutes} min ({progressPercent}%)</span>
        </div>
        <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Blocks List */}
      <div className="space-y-2.5">
        {dailyCycle.blocks.map((blk, idx) => {
          const sub = subjects.find(s => s.id === blk.subjectId);
          return (
            <CycleBlock
              key={blk.id}
              block={blk}
              index={idx}
              subject={sub}
              isCurrent={idx === nextUncompletedIndex}
              onStart={onStartCycleSession}
            />
          );
        })}
      </div>
    </div>
  );
};
