import React, { useState } from 'react';
import { Subject } from '../types';
import { Layers, Plus, Trash2, CheckCircle2, X, ToggleLeft, ToggleRight, Sparkles, BookOpen, User, Palette } from 'lucide-react';

interface SubjectManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjects: Subject[];
  onUpdateSubjects: (subjects: Subject[]) => void;
  onOpenBookScanner: () => void;
}

export const SubjectManagerModal: React.FC<SubjectManagerModalProps> = ({
  isOpen,
  onClose,
  subjects,
  onUpdateSubjects,
  onOpenBookScanner
}) => {
  const [showAddCustomForm, setShowAddCustomForm] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newSubjectCategory, setNewSubjectCategory] = useState<Subject['category']>('Formação Geral');
  const [newSubjectColor, setNewSubjectColor] = useState('indigo');
  const [newTeacherName, setNewTeacherName] = useState('');

  if (!isOpen) return null;

  const handleToggleSubjectEnabled = (subjectId: string) => {
    const updated = subjects.map((sub) => {
      if (sub.id === subjectId) {
        return { ...sub, enabled: sub.enabled === false ? true : false };
      }
      return sub;
    });
    onUpdateSubjects(updated);
  };

  const handleCreateCustomSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubjectName.trim()) return;

    const newSubject: Subject = {
      id: `custom-${Date.now()}`,
      name: newSubjectName.trim(),
      category: newSubjectCategory,
      color: newSubjectColor,
      teacherName: newTeacherName.trim() || 'Não Informado',
      topics: [
        { id: `topic-${Date.now()}-1`, name: 'Introdução e Conceitos Iniciais da Matéria', taught: true, taughtDate: new Date().toISOString().split('T')[0] },
        { id: `topic-${Date.now()}-2`, name: 'Conteúdo de Aprofundamento do Bimestre', taught: false }
      ],
      examScopeTopicIds: [],
      enabled: true,
      isCustom: true
    };

    onUpdateSubjects([...subjects, newSubject]);
    setNewSubjectName('');
    setNewTeacherName('');
    setShowAddCustomForm(false);
  };

  const handleDeleteSubject = (subjectId: string) => {
    if (confirm('Tem certeza que deseja remover esta matéria customizada? Todos os tópicos associados serão excluídos.')) {
      onUpdateSubjects(subjects.filter(s => s.id !== subjectId));
    }
  };

  // Pre-defined list of common optional BNCC / School subjects to quick-enable
  const commonOptionalSubjects = [
    { name: 'Sociologia', category: 'Humanas', color: 'amber' },
    { name: 'Filosofia', category: 'Humanas', color: 'purple' },
    { name: 'Artes & Expressão', category: 'Linguagens', color: 'rose' },
    { name: 'Ensino Religioso & Ética', category: 'Humanas', color: 'slate' },
    { name: 'Educação Física & Saúde', category: 'Biológicas', color: 'emerald' },
    { name: 'Projeto de Vida (Itinerário)', category: 'Itinerário', color: 'cyan' },
    { name: 'Educação Financeira', category: 'Formação Geral', color: 'emerald' },
    { name: 'Espanhol', category: 'Linguagens', color: 'indigo' },
  ];

  const handleQuickAddCommon = (item: { name: string; category: any; color: string }) => {
    const exists = subjects.find(s => s.name.toLowerCase() === item.name.toLowerCase());
    if (exists) {
      if (exists.enabled === false) {
        handleToggleSubjectEnabled(exists.id);
      }
      return;
    }

    const newSub: Subject = {
      id: `sub-${Date.now()}`,
      name: item.name,
      category: item.category,
      color: item.color,
      teacherName: 'Prof. Indicado',
      topics: [
        { id: `t-${Date.now()}-1`, name: `Apresentação da Ementa de ${item.name}`, taught: true, taughtDate: new Date().toISOString().split('T')[0] },
        { id: `t-${Date.now()}-2`, name: `Tópico Principal do Bimestre`, taught: false }
      ],
      examScopeTopicIds: [],
      enabled: true,
      isCustom: true
    };

    onUpdateSubjects([...subjects, newSub]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 max-w-3xl w-full p-6 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-indigo-100 border border-indigo-200 rounded-2xl">
              <Layers className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 font-display">
                Gestão Dinâmica de Matérias & Cursos Customizados
              </h2>
              <p className="text-xs text-slate-500">
                Ative ou desative disciplinas da grade da sua escola e adicione novos projetos pedagógicos (Itinerários, Educação Financeira).
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

        {/* Quick actions bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-slate-800">Criação Instantânea por Livro</span>
            <p className="text-[11px] text-slate-500">
              Fotografe o sumário do livro para cadastrar matérias e tópicos automaticamente.
            </p>
          </div>

          <button
            onClick={() => {
              onClose();
              onOpenBookScanner();
            }}
            className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition flex items-center space-x-2"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Escanear Sumário por Foto</span>
          </button>
        </div>

        {/* List of Active & Available Subjects */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Disciplinas da sua Grade Escolar ({subjects.filter(s => s.enabled !== false).length} ativas)
            </h3>

            <button
              onClick={() => setShowAddCustomForm(!showAddCustomForm)}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>{showAddCustomForm ? 'Cancelar' : 'Cadastrar Matéria Customizada'}</span>
            </button>
          </div>

          {/* Form to add custom subject */}
          {showAddCustomForm && (
            <form onSubmit={handleCreateCustomSubject} className="p-4 bg-indigo-50/70 border border-indigo-200 rounded-2xl space-y-4 animate-in fade-in">
              <h4 className="text-xs font-extrabold text-indigo-900 uppercase">
                Cadastrar Nova Matéria ou Projeto
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Nome da Matéria *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Educação Financeira ou Robótica"
                    value={newSubjectName}
                    onChange={(e) => setNewSubjectName(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Área do Conhecimento</label>
                  <select
                    value={newSubjectCategory}
                    onChange={(e) => setNewSubjectCategory(e.target.value as any)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Exatas">Exatas & Matemática</option>
                    <option value="Humanas">Ciências Humanas</option>
                    <option value="Biológicas">Ciências da Natureza</option>
                    <option value="Linguagens">Linguagens & Códigos</option>
                    <option value="Redação">Redação & Produção</option>
                    <option value="Formação Geral">Formação Geral Diversificada</option>
                    <option value="Itinerário">Itinerário Formativo ENEM</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Nome do Professor(a)</label>
                  <input
                    type="text"
                    placeholder="Ex: Prof. Marcos"
                    value={newTeacherName}
                    onChange={(e) => setNewTeacherName(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Cor do Card</label>
                  <select
                    value={newSubjectColor}
                    onChange={(e) => setNewSubjectColor(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="indigo">Azul Índigo</option>
                    <option value="emerald">Verde Esmeralda</option>
                    <option value="cyan">Ciano / Turquesa</option>
                    <option value="amber">Âmbar / Laranja</option>
                    <option value="purple">Roxo / Púrpura</option>
                    <option value="rose">Rosa / Magenta</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-5 py-2 rounded-xl shadow transition"
                >
                  Salvar Matéria Customizada
                </button>
              </div>
            </form>
          )}

          {/* Quick Add BNCC / Optional Subjects buttons */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
            <span className="text-[11px] font-bold text-slate-600 block">
              Ativação Rápida de Disciplinas Complementares da Escola:
            </span>

            <div className="flex flex-wrap gap-2">
              {commonOptionalSubjects.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickAddCommon(item)}
                  className="bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-slate-700 hover:text-indigo-900 text-[11px] font-bold px-3 py-1.5 rounded-xl transition flex items-center space-x-1 shadow-2xs"
                >
                  <Plus className="w-3 h-3 text-indigo-500" />
                  <span>{item.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* List of current subjects with toggles */}
          <div className="space-y-2.5">
            {subjects.map((sub) => {
              const isEnabled = sub.enabled !== false;

              return (
                <div
                  key={sub.id}
                  className={`p-3.5 rounded-2xl border transition flex items-center justify-between gap-4 ${
                    isEnabled
                      ? 'bg-white border-slate-200 shadow-2xs'
                      : 'bg-slate-50 border-slate-200 opacity-60'
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <button
                      onClick={() => handleToggleSubjectEnabled(sub.id)}
                      className={`p-2 rounded-xl transition shrink-0 ${
                        isEnabled
                          ? 'bg-indigo-100 text-indigo-700'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                      title={isEnabled ? 'Desativar do painel' : 'Ativar no painel'}
                    >
                      {isEnabled ? (
                        <ToggleRight className="w-6 h-6 text-indigo-600" />
                      ) : (
                        <ToggleLeft className="w-6 h-6 text-slate-400" />
                      )}
                    </button>

                    <div className="min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-extrabold text-slate-900 truncate">
                          {sub.name}
                        </span>
                        {sub.isCustom && (
                          <span className="bg-indigo-100 text-indigo-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-indigo-200">
                            Customizada
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500">
                        {sub.category} • Prof: {sub.teacherName || 'Não Informado'} • {sub.topics.length} tópicos cadastrados
                      </p>
                    </div>
                  </div>

                  {sub.isCustom && (
                    <button
                      onClick={() => handleDeleteSubject(sub.id)}
                      className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition shrink-0"
                      title="Excluir Matéria"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2 border-t border-slate-100">
          <button
            onClick={onClose}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow transition flex items-center space-x-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Concluir e Salvar Grade</span>
          </button>
        </div>
      </div>
    </div>
  );
};
