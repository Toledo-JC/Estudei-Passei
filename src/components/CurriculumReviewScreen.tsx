import React, { useState, useEffect } from 'react';
import { Subject, TeacherTopic, BimesterNumber, HighSchoolSeries } from '../types';
import {
  Layers,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  Split,
  CheckCircle2,
  Circle,
  Info,
  Search,
  Filter,
  Sparkles,
  BookOpen,
  ArrowLeft,
  Check,
  User
} from 'lucide-react';
import { SubjectSubdivisionModal } from './SubjectSubdivisionModal';

interface CurriculumReviewScreenProps {
  series: HighSchoolSeries;
  currentBimester: BimesterNumber;
  subjects: Subject[];
  onUpdateSubjects: (updatedSubjects: Subject[]) => void;
  onConfirm: () => void;
  onBack: () => void;
  subdivideSubject: (
    subjects: Subject[],
    parentSubjectId: string,
    subdivisionName: string,
    topicIdsToMove: string[]
  ) => Subject[];
}

export const CurriculumReviewScreen: React.FC<CurriculumReviewScreenProps> = ({
  series,
  currentBimester,
  subjects,
  onUpdateSubjects,
  onConfirm,
  onBack,
  subdivideSubject
}) => {
  const [activeBimesterFilter, setActiveBimesterFilter] = useState<number | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [openSubjectIds, setOpenSubjectIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const handleUpdateTeacherName = (subjectId: string, newTeacherName: string) => {
    const updated = subjects.map(s => {
      if (s.id !== subjectId) return s;
      return { ...s, teacherName: newTeacherName };
    });
    onUpdateSubjects(updated);
  };

  // State for subdivision modal
  const [subdivisionTargetSubject, setSubdivisionTargetSubject] = useState<Subject | null>(null);

  // New topic inline form per subject
  const [newTopicNames, setNewTopicNames] = useState<Record<string, string>>({});

  const toggleAccordion = (subjectId: string) => {
    setOpenSubjectIds(prev => ({
      ...prev,
      [subjectId]: !prev[subjectId]
    }));
  };

  const handleToggleTopic = (subjectId: string, topicId: string) => {
    const updated = subjects.map(s => {
      if (s.id !== subjectId) return s;
      return {
        ...s,
        topics: s.topics.map(t => {
          if (t.id !== topicId) return t;
          const newTaught = !t.taught;
          return {
            ...t,
            taught: newTaught,
            taughtDate: newTaught ? new Date().toISOString().split('T')[0] : undefined
          };
        })
      };
    });
    onUpdateSubjects(updated);
  };

  const handleAddCustomTopic = (subjectId: string) => {
    const topicName = newTopicNames[subjectId]?.trim();
    if (!topicName) return;

    const updated = subjects.map(s => {
      if (s.id !== subjectId) return s;
      const newTopic: TeacherTopic = {
        id: `top-custom-${Date.now()}`,
        name: topicName,
        taught: false,
        bimester: typeof activeBimesterFilter === 'number' ? (activeBimesterFilter as BimesterNumber) : currentBimester
      };
      return {
        ...s,
        topics: [...s.topics, newTopic]
      };
    });

    onUpdateSubjects(updated);
    setNewTopicNames(prev => ({ ...prev, [subjectId]: '' }));
  };

  const handleDeleteSubject = (subjectId: string) => {
    if (confirm('Tem certeza que deseja remover esta disciplina da sua grade?')) {
      onUpdateSubjects(subjects.filter(s => s.id !== subjectId && s.parentSubjectId !== subjectId));
    }
  };

  const handleDeleteTopic = (subjectId: string, topicId: string) => {
    const updated = subjects.map(s => {
      if (s.id !== subjectId) return s;
      return {
        ...s,
        topics: s.topics.filter(t => t.id !== topicId)
      };
    });
    onUpdateSubjects(updated);
  };

  const handleSubdivideExecute = (parentSubjectId: string, subdivisionName: string, topicIdsToMove: string[]) => {
    const updated = subdivideSubject(subjects, parentSubjectId, subdivisionName, topicIdsToMove);
    onUpdateSubjects(updated);
  };

  // Filter subjects and topics based on search term and active bimester filter
  const filteredSubjects = subjects.filter(s => {
    if (searchTerm) {
      const matchSub = s.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchTopic = s.topics.some(t => t.name.toLowerCase().includes(searchTerm.toLowerCase()));
      if (!matchSub && !matchTopic) return false;
    }
    return true;
  });

  const seriesLabelMap: Record<HighSchoolSeries, string> = {
    '1st': '1º Ano EM',
    '2nd': '2º Ano EM',
    '3rd': '3º Ano EM'
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Disclaimer */}
      <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-2xl flex items-start space-x-3 text-indigo-950">
        <Info className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs">
          <p className="font-extrabold text-indigo-900">
            Grade Baseada no Currículo Nacional (BNCC & ENEM) — {seriesLabelMap[series]} ({currentBimester}º Bimestre)
          </p>
          <p className="text-indigo-800 leading-snug">
            Esta grade é uma referência padrão. Marque os tópicos já estudados, remova matérias que sua escola não leciona ou use o botão <strong className="font-bold text-indigo-900">"Subdividir"</strong> para separar disciplinas em duas frentes (ex: Física A e Física B).
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
        {/* Bimester Tabs */}
        <div className="flex items-center space-x-1 overflow-x-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setActiveBimesterFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeBimesterFilter === 'all'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            Todos os Bimestres
          </button>
          {[1, 2, 3, 4].map((bNum) => (
            <button
              key={bNum}
              type="button"
              onClick={() => setActiveBimesterFilter(bNum)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeBimesterFilter === bNum
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              {bNum}º Bimestre
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative shrink-0 sm:w-56">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar matéria ou tópico..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-800 font-medium focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Subject Accordions */}
      <div className="space-y-3">
        {filteredSubjects.map((subject, idx) => {
          const isOpen = openSubjectIds[subject.id] ?? (idx < 2);

          // Filter topics by bimester tab if selected
          const visibleTopics = subject.topics.filter(t => {
            if (activeBimesterFilter !== 'all') {
              return t.bimester === activeBimesterFilter;
            }
            if (searchTerm) {
              return t.name.toLowerCase().includes(searchTerm.toLowerCase()) || subject.name.toLowerCase().includes(searchTerm.toLowerCase());
            }
            return true;
          });

          const completedCount = subject.topics.filter(t => t.taught).length;
          const totalCount = subject.topics.length;

          return (
            <div
              key={subject.id}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs transition"
            >
              {/* Accordion Header */}
              <div className="p-4 bg-slate-50/80 hover:bg-slate-100/60 transition flex items-center justify-between gap-3 border-b border-slate-100">
                <div
                  className="flex items-center space-x-3 cursor-pointer flex-1 min-w-0"
                  onClick={() => toggleAccordion(subject.id)}
                >
                  <div className="p-2 bg-indigo-100 border border-indigo-200 rounded-xl text-indigo-700 shrink-0">
                    <BookOpen className="w-4 h-4" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-extrabold text-slate-900 truncate">
                        {subject.name}
                      </span>
                      {subject.parentSubjectId && (
                        <span className="text-[10px] font-extrabold bg-indigo-100 text-indigo-800 border border-indigo-200 px-2 py-0.5 rounded-full">
                          Subdivisão
                        </span>
                      )}
                      <span className="text-[10px] font-bold bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full">
                        {subject.category}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 mt-1" onClick={(e) => e.stopPropagation()}>
                      <p className="text-[11px] text-slate-500">
                        {completedCount} de {totalCount} tópicos • {visibleTopics.length} exibidos
                      </p>

                      <div className="flex items-center space-x-1 bg-white border border-slate-200 px-2 py-0.5 rounded-lg shadow-2xs">
                        <User className="w-3 h-3 text-indigo-500 shrink-0" />
                        <input
                          type="text"
                          placeholder="Nome do Prof. (ex: Prof. Silva)"
                          value={subject.teacherName || ''}
                          onChange={(e) => handleUpdateTeacherName(subject.id, e.target.value)}
                          className="bg-transparent text-[11px] text-slate-700 font-medium w-40 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setSubdivisionTargetSubject(subject)}
                    className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-[11px] font-bold px-2.5 py-1.5 rounded-xl transition flex items-center space-x-1"
                    title="Subdividir matéria em frentes (ex: Física A / B)"
                  >
                    <Split className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Subdividir</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteSubject(subject.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                    title="Remover matéria"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleAccordion(subject.id)}
                    className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl"
                  >
                    {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Accordion Body */}
              {isOpen && (
                <div className="p-4 space-y-3 bg-white">
                  {visibleTopics.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">
                      Nenhum tópico encontrado para os filtros selecionados.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {visibleTopics.map((topic) => {
                        const isPast = topic.bimester && topic.bimester < currentBimester;
                        const isCurrent = topic.bimester === currentBimester;
                        const isFuture = topic.bimester && topic.bimester > currentBimester;

                        return (
                          <div
                            key={topic.id}
                            className={`p-2.5 rounded-xl border transition flex items-center justify-between gap-2 ${
                              topic.taught
                                ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                                : isCurrent
                                ? 'bg-amber-50/50 border-amber-200 text-slate-800 font-medium'
                                : 'bg-slate-50 border-slate-200 text-slate-700'
                            }`}
                          >
                            <label className="flex items-center space-x-2.5 min-w-0 cursor-pointer flex-1">
                              <input
                                type="checkbox"
                                checked={topic.taught}
                                onChange={() => handleToggleTopic(subject.id, topic.id)}
                                className="rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4 shrink-0"
                              />
                              <span className={`text-xs truncate ${topic.taught ? 'line-through opacity-75' : ''}`}>
                                {topic.name}
                              </span>
                            </label>

                            <div className="flex items-center space-x-1.5 shrink-0">
                              {topic.bimester && (
                                <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-md ${
                                  isPast
                                    ? 'bg-slate-200 text-slate-700'
                                    : isCurrent
                                    ? 'bg-amber-400 text-slate-950 font-black'
                                    : 'bg-indigo-100 text-indigo-800'
                                }`}>
                                  {topic.bimester}º Bim.
                                </span>
                              )}

                              <button
                                type="button"
                                onClick={() => handleDeleteTopic(subject.id, topic.id)}
                                className="text-slate-300 hover:text-rose-500 p-1 transition"
                                title="Excluir tópico"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Add Custom Extra Topic Form */}
                  <div className="pt-2 border-t border-slate-100 flex gap-2">
                    <input
                      type="text"
                      placeholder="Adicionar novo tópico customizado..."
                      value={newTopicNames[subject.id] || ''}
                      onChange={(e) => setNewTopicNames(prev => ({ ...prev, [subject.id]: e.target.value }))}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddCustomTopic(subject.id);
                        }
                      }}
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddCustomTopic(subject.id)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition flex items-center space-x-1"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Adicionar</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal for Subject Subdivision */}
      <SubjectSubdivisionModal
        isOpen={Boolean(subdivisionTargetSubject)}
        onClose={() => setSubdivisionTargetSubject(null)}
        parentSubject={subdivisionTargetSubject}
        onSubdivide={handleSubdivideExecute}
      />

      {/* Bottom Action Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        <button
          type="button"
          onClick={onBack}
          className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl flex items-center space-x-1.5 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar ao Seletor de Série</span>
        </button>

        <button
          type="button"
          onClick={onConfirm}
          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold px-6 py-2.5 rounded-2xl flex items-center space-x-2 transition shadow-md"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Confirmar e Aplicar Grade Curricular ({subjects.length} Matérias)</span>
        </button>
      </div>
    </div>
  );
};
