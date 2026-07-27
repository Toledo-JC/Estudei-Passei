import React, { useState } from 'react';
import { Subject, SpacedRevision } from '../types';
import { TooltipHelp } from './TooltipHelp';
import { Brain, CheckCircle2, Clock, Calendar, Plus, Sparkles, CheckSquare, Square } from 'lucide-react';

interface SpacedRevisionSectionProps {
  subjects: Subject[];
  revisions: SpacedRevision[];
  onUpdateRevisions: (revisions: SpacedRevision[]) => void;
}

export const SpacedRevisionSection: React.FC<SpacedRevisionSectionProps> = ({
  subjects,
  revisions,
  onUpdateRevisions
}) => {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(subjects[0]?.id || 'matematica');
  const [newTopic, setNewTopic] = useState('');

  const handleAddRevision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopic.trim()) return;

    const today = new Date();
    const d1 = new Date(today); d1.setDate(today.getDate() + 1);
    const d7 = new Date(today); d7.setDate(today.getDate() + 7);
    const d30 = new Date(today); d30.setDate(today.getDate() + 30);

    const newRev: SpacedRevision = {
      id: `rev-${Date.now()}`,
      subjectId: selectedSubjectId,
      topic: newTopic.trim(),
      createdAt: today.toISOString().split('T')[0],
      steps: [
        { days: 1, dueDate: d1.toISOString().split('T')[0], completed: false },
        { days: 7, dueDate: d7.toISOString().split('T')[0], completed: false },
        { days: 30, dueDate: d30.toISOString().split('T')[0], completed: false }
      ]
    };

    onUpdateRevisions([...revisions, newRev]);
    setNewTopic('');
  };

  const handleToggleStep = (revisionId: string, stepDays: number) => {
    const updated = revisions.map(r => {
      if (r.id !== revisionId) return r;
      const updatedSteps = r.steps.map(s => {
        if (s.days !== stepDays) return s;
        return { ...s, completed: !s.completed };
      });
      return { ...r, steps: updatedSteps };
    });
    onUpdateRevisions(updated);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 flex-wrap gap-3">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
            <Brain className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 font-display flex items-center">
              <span>Revisão Espaçada Automatizada (1, 7 e 30 Dias)</span>
              <TooltipHelp
                title="Curva do Esquecimento de Ebbinghaus"
                text="Revisar o conteúdo estudado exatamente no 1º, 7º e 30º dia após a aula fixa a matéria na memória de longo prazo antes que seu cérebro a descarte."
              />
            </h2>
            <p className="text-xs text-slate-500">
              Vença a curva do esquecimento do ENEM com ciclos automáticos de retenção.
            </p>
          </div>
        </div>
      </div>

      {/* Form to add new revision topic */}
      <form onSubmit={handleAddRevision} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row gap-3">
        <select
          value={selectedSubjectId}
          onChange={(e) => setSelectedSubjectId(e.target.value)}
          className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
        >
          {subjects.map(s => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>

        <input
          type="text"
          value={newTopic}
          onChange={(e) => setNewTopic(e.target.value)}
          placeholder="Ex: Função Quadrática e Vértice da Parábola..."
          className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500"
        />

        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-5 py-2 rounded-xl shadow transition flex items-center justify-center space-x-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Agendar Ciclo (1d, 7d, 30d)</span>
        </button>
      </form>

      {/* Revisions List */}
      <div className="space-y-4">
        {revisions.map((rev) => {
          const subject = subjects.find(s => s.id === rev.subjectId);

          return (
            <div key={rev.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">{rev.topic}</span>
                  <span className="text-[10px] text-slate-500">{subject?.name || 'Geral'} • Criado em {rev.createdAt}</span>
                </div>
              </div>

              {/* 3 Steps: 1 day, 7 days, 30 days */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                {rev.steps.map((st) => (
                  <button
                    key={st.days}
                    type="button"
                    onClick={() => handleToggleStep(rev.id, st.days)}
                    className={`p-3 rounded-xl border text-left transition flex items-center justify-between ${
                      st.completed
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div>
                      <span className="text-xs font-bold block">{st.days}º Dia de Revisão</span>
                      <span className="text-[10px] opacity-80">Vencimento: {st.dueDate}</span>
                    </div>

                    {st.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    ) : (
                      <Clock className="w-5 h-5 text-slate-400 shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
