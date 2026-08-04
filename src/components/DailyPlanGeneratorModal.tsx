import React, { useState } from 'react';
import { 
  X, Sparkles, Plus, Trash2, Clock, Check, RefreshCw, ArrowUp, ArrowDown, BookOpen 
} from 'lucide-react';
import { DailyPlan, DailyPlanBlock, DailyBlockType, Subject } from '../types';

interface DailyPlanGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  dailyPlan: DailyPlan | null;
  subjects: Subject[];
  onGeneratePlan: () => void;
  onAddBlock: (block: Omit<DailyPlanBlock, 'id' | 'completed'>) => void;
  onRemoveBlock: (blockId: string) => void;
  onUpdatePlan: (plan: DailyPlan) => void;
}

export const DailyPlanGeneratorModal: React.FC<DailyPlanGeneratorModalProps> = ({
  isOpen,
  onClose,
  dailyPlan,
  subjects,
  onGeneratePlan,
  onAddBlock,
  onRemoveBlock,
  onUpdatePlan
}) => {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(subjects[0]?.id || '');
  const [topicName, setTopicName] = useState<string>('');
  const [blockType, setBlockType] = useState<DailyBlockType>('exercises');
  const [plannedMinutes, setPlannedMinutes] = useState<number>(25);

  if (!isOpen) return null;

  const handleAddBlockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sub = subjects.find(s => s.id === selectedSubjectId);
    if (!sub) return;

    onAddBlock({
      subjectId: sub.id,
      subjectName: sub.name,
      type: blockType,
      topicName: topicName.trim() || 'Tópicos Selecionados',
      plannedMinutes,
      source: 'manual'
    });

    setTopicName('');
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    if (!dailyPlan) return;
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= dailyPlan.blocks.length) return;

    const newBlocks = [...dailyPlan.blocks];
    const temp = newBlocks[index];
    newBlocks[index] = newBlocks[newIndex];
    newBlocks[newIndex] = temp;

    onUpdatePlan({
      ...dailyPlan,
      blocks: newBlocks
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-indigo-500/20 text-indigo-400 rounded-xl border border-indigo-500/30">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-lg font-display">
                Editar Plano Diário de Estudos
              </h3>
              <p className="text-xs text-slate-400">
                Ajuste a ordem dos blocos, horários e matérias para o dia de hoje.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-6 flex-1">
          
          {/* Quick Actions */}
          <div className="flex items-center justify-between bg-indigo-950/30 border border-indigo-500/20 p-4 rounded-xl">
            <div className="text-xs text-slate-300">
              <span className="font-bold text-white block">Regerar Automático por IA</span>
              <span>Reorganiza com base na suas provas, tarefas e revisões atrasadas.</span>
            </div>
            <button
              onClick={() => {
                onGeneratePlan();
              }}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition flex items-center space-x-1.5 shrink-0"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Regerar Plano</span>
            </button>
          </div>

          {/* Existing Blocks List */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Blocos Programados ({dailyPlan?.blocks.length || 0})</span>
              <span className="text-indigo-400">
                Total: {dailyPlan?.totalPlannedMinutes || 0} min
              </span>
            </h4>

            {(!dailyPlan || dailyPlan.blocks.length === 0) ? (
              <div className="p-8 text-center text-slate-500 text-xs border border-dashed border-slate-800 rounded-xl">
                Nenhum bloco cadastrado ainda. Clique em "Regerar Plano" ou adicione abaixo.
              </div>
            ) : (
              <div className="space-y-2">
                {dailyPlan.blocks.map((blk, idx) => (
                  <div 
                    key={blk.id}
                    className="p-3 bg-slate-800/80 border border-slate-700/80 rounded-xl flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <span className="w-6 h-6 rounded-full bg-slate-700 text-slate-300 font-bold text-xs flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-white text-xs sm:text-sm truncate">
                            {blk.subjectName}
                          </span>
                          <span className="text-[10px] bg-indigo-500/20 text-indigo-300 font-bold px-2 py-0.5 rounded capitalize">
                            {blk.type}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 truncate">
                          {blk.topicName || 'Exercícios e leitura'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <span className="text-xs font-mono text-slate-300 font-bold bg-slate-900 px-2.5 py-1 rounded-md border border-slate-700">
                        {blk.plannedMinutes} min
                      </span>

                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => moveBlock(idx, 'up')}
                          disabled={idx === 0}
                          className="p-1 text-slate-400 hover:text-white disabled:opacity-30"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => moveBlock(idx, 'down')}
                          disabled={idx === dailyPlan.blocks.length - 1}
                          className="p-1 text-slate-400 hover:text-white disabled:opacity-30"
                        >
                          <ArrowDown className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onRemoveBlock(blk.id)}
                          className="p-1 text-rose-400 hover:text-rose-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form to add new block */}
          <form onSubmit={handleAddBlockSubmit} className="p-4 bg-slate-800/50 border border-slate-700/80 rounded-2xl space-y-4">
            <h4 className="font-bold text-xs uppercase tracking-wider text-amber-400 flex items-center space-x-1.5">
              <Plus className="w-4 h-4" />
              <span>Adicionar Bloco Personalizado</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Disciplina
                </label>
                <select
                  value={selectedSubjectId}
                  onChange={(e) => setSelectedSubjectId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Tipo de Estudo
                </label>
                <select
                  value={blockType}
                  onChange={(e) => setBlockType(e.target.value as DailyBlockType)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="exercises">📝 Exercícios e Lista</option>
                  <option value="reading">📖 Leitura de Teoria</option>
                  <option value="review">🔄 Revisão Espaçada</option>
                  <option value="flashcards">🎴 Flashcards</option>
                  <option value="quiz">⚡ Quiz da IA</option>
                  <option value="simulated">🎯 Simulado</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Tópico / Conteúdo (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ex: Funções Afim, Era Vargas, Cinemática..."
                  value={topicName}
                  onChange={(e) => setTopicName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Duração Planejada (Minutos)
                </label>
                <div className="flex items-center space-x-2">
                  {[15, 25, 30, 45, 60].map(m => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setPlannedMinutes(m)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition ${
                        plannedMinutes === m 
                          ? 'bg-indigo-600 text-white' 
                          : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-700'
                      }`}
                    >
                      {m}m
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition flex items-center justify-center space-x-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Inserir Bloco no Plano</span>
            </button>
          </form>

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition shadow-lg shadow-indigo-600/20"
          >
            Concluído
          </button>
        </div>

      </div>
    </div>
  );
};
