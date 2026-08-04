import React, { useState } from 'react';
import { Subject } from '../types';
import { Split, Check, X, Layers, AlertCircle } from 'lucide-react';

interface SubjectSubdivisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  parentSubject: Subject | null;
  onSubdivide: (parentSubjectId: string, subdivisionName: string, topicIdsToMove: string[]) => void;
}

export const SubjectSubdivisionModal: React.FC<SubjectSubdivisionModalProps> = ({
  isOpen,
  onClose,
  parentSubject,
  onSubdivide
}) => {
  const [subdivisionName, setSubdivisionName] = useState('');
  const [selectedTopicIds, setSelectedTopicIds] = useState<string[]>([]);

  if (!isOpen || !parentSubject) return null;

  const handleToggleTopic = (topicId: string) => {
    setSelectedTopicIds(prev =>
      prev.includes(topicId) ? prev.filter(id => id !== topicId) : [...prev, topicId]
    );
  };

  const handleSelectAll = () => {
    if (selectedTopicIds.length === parentSubject.topics.length) {
      setSelectedTopicIds([]);
    } else {
      setSelectedTopicIds(parentSubject.topics.map(t => t.id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = subdivisionName.trim() || `${parentSubject.name} (Subdivisão)`;
    if (selectedTopicIds.length === 0) {
      alert('Selecione pelo menos 1 tópico para mover para a nova subdivisão.');
      return;
    }
    onSubdivide(parentSubject.id, finalName, selectedTopicIds);
    setSubdivisionName('');
    setSelectedTopicIds([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-indigo-100 border border-indigo-200 rounded-2xl">
              <Split className="w-5 h-5 text-indigo-700" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 font-display">
                Subdividir {parentSubject.name}
              </h3>
              <p className="text-xs text-slate-500">
                Crie uma segunda frente ou professor para esta disciplina.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1">
              Nome da Nova Subdivisão:
            </label>
            <input
              type="text"
              required
              placeholder={`Ex: ${parentSubject.name} B, ${parentSubject.name} II ou Frente 2`}
              value={subdivisionName}
              onChange={(e) => setSubdivisionName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:bg-white"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 block">
                Selecione os tópicos que pertencerão a esta nova frente ({selectedTopicIds.length} selecionados):
              </label>

              <button
                type="button"
                onClick={handleSelectAll}
                className="text-[11px] font-bold text-indigo-600 hover:underline"
              >
                {selectedTopicIds.length === parentSubject.topics.length ? 'Desmarcar Todos' : 'Marcar Todos'}
              </button>
            </div>

            <div className="max-h-60 overflow-y-auto border border-slate-200 rounded-2xl p-2 bg-slate-50 space-y-1">
              {parentSubject.topics.map((t) => {
                const isChecked = selectedTopicIds.includes(t.id);

                return (
                  <label
                    key={t.id}
                    className={`flex items-center justify-between p-2.5 rounded-xl border transition cursor-pointer ${
                      isChecked
                        ? 'bg-indigo-50 border-indigo-300 text-indigo-950 font-bold'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleTopic(t.id)}
                        className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                      />
                      <span className="text-xs truncate">{t.name}</span>
                    </div>

                    {t.bimester && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-200 text-slate-700 shrink-0">
                        {t.bimester}º Bim.
                      </span>
                    )}
                  </label>
                );
              })}
            </div>
          </div>

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-[11px] text-amber-900 flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              Os tópicos selecionados serão transferidos do card de <strong>{parentSubject.name}</strong> para o novo card de <strong>{subdivisionName || 'Subdivisão'}</strong>.
            </span>
          </div>

          <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-extrabold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-sm transition flex items-center space-x-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Criar Subdivisão</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
