import React, { useState, useMemo } from 'react';
import { Subject, TeacherTopic, BimesterNumber } from '../types';
import { Check, Search, ChevronDown, ChevronUp, Layers, CheckSquare, Square, Info } from 'lucide-react';

interface TopicSelectorProps {
  subjects: Subject[];
  selectedSubjectId: string;
  selectedPeriodIndex: number;
  selectedTopicIds: string[];
  onChangeSelectedTopicIds: (ids: string[]) => void;
  title?: string;
}

export const TopicSelector: React.FC<TopicSelectorProps> = ({
  subjects,
  selectedSubjectId,
  selectedPeriodIndex,
  selectedTopicIds,
  onChangeSelectedTopicIds,
  title = "Vincular Tópicos do Currículo Cobrados nesta Prova"
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showPastPeriods, setShowPastPeriods] = useState(false);

  // Find primary selected subject and any sub-subjects that belong to it (parentSubjectId)
  const primarySubject = subjects.find(s => s.id === selectedSubjectId);
  const relatedSubjects = useMemo(() => {
    if (!primarySubject) return [];
    return subjects.filter(
      s => s.id === selectedSubjectId || s.parentSubjectId === selectedSubjectId
    );
  }, [subjects, selectedSubjectId, primarySubject]);

  // Aggregate topics across related subjects (subdivisions)
  const allTopicsWithSubject = useMemo(() => {
    const list: Array<{ topic: TeacherTopic; subjectName: string; subjectId: string }> = [];
    relatedSubjects.forEach(sub => {
      (sub.topics || []).forEach(top => {
        list.push({ topic: top, subjectName: sub.name, subjectId: sub.id });
      });
    });
    return list;
  }, [relatedSubjects]);

  // Filter topics into current period vs past/other periods
  const currentPeriodTopics = useMemo(() => {
    return allTopicsWithSubject.filter(({ topic }) => {
      if (!topic.bimester) return true; // default if unassigned
      return topic.bimester === (selectedPeriodIndex as BimesterNumber);
    });
  }, [allTopicsWithSubject, selectedPeriodIndex]);

  const pastPeriodTopics = useMemo(() => {
    return allTopicsWithSubject.filter(({ topic }) => {
      return topic.bimester && topic.bimester !== (selectedPeriodIndex as BimesterNumber);
    });
  }, [allTopicsWithSubject, selectedPeriodIndex]);

  // Filter by search term
  const filterBySearch = (items: typeof allTopicsWithSubject) => {
    if (!searchTerm.trim()) return items;
    const term = searchTerm.toLowerCase();
    return items.filter(
      ({ topic, subjectName }) =>
        topic.name.toLowerCase().includes(term) ||
        subjectName.toLowerCase().includes(term)
    );
  };

  const filteredCurrentTopics = filterBySearch(currentPeriodTopics);
  const filteredPastTopics = filterBySearch(pastPeriodTopics);

  // Toggle single topic
  const handleToggleTopic = (topicId: string) => {
    if (selectedTopicIds.includes(topicId)) {
      onChangeSelectedTopicIds(selectedTopicIds.filter(id => id !== topicId));
    } else {
      onChangeSelectedTopicIds([...selectedTopicIds, topicId]);
    }
  };

  // Select / Deselect All for current period
  const handleSelectAllCurrent = () => {
    const currentIds = filteredCurrentTopics.map(t => t.topic.id);
    const allSelected = currentIds.every(id => selectedTopicIds.includes(id));

    if (allSelected) {
      // Remove all current
      onChangeSelectedTopicIds(selectedTopicIds.filter(id => !currentIds.includes(id)));
    } else {
      // Add all current
      const newSet = new Set([...selectedTopicIds, ...currentIds]);
      onChangeSelectedTopicIds(Array.from(newSet));
    }
  };

  // Coverage statistics
  const totalCurrentCount = currentPeriodTopics.length;
  const selectedCurrentCount = currentPeriodTopics.filter(t => selectedTopicIds.includes(t.topic.id)).length;
  const coveragePercent = totalCurrentCount > 0 ? Math.round((selectedCurrentCount / totalCurrentCount) * 100) : 0;

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3.5">
      {/* Header & Coverage Progress */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
        <div>
          <span className="text-xs font-extrabold text-slate-900 font-display flex items-center space-x-1.5">
            <Layers className="w-4 h-4 text-indigo-600" />
            <span>{title}</span>
          </span>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Selecione os tópicos que cairão na prova para gerar o plano de revisão automático.
          </p>
        </div>

        {totalCurrentCount > 0 && (
          <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shrink-0">
            <div className="text-right">
              <span className="text-xs font-black text-indigo-900 block">
                {selectedCurrentCount} de {totalCurrentCount} Tópicos
              </span>
              <span className="text-[10px] text-slate-500 font-medium">
                {coveragePercent}% de cobertura do {selectedPeriodIndex}º Bimestre
              </span>
            </div>
            <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center font-black text-xs text-indigo-700 border border-indigo-200">
              {coveragePercent}%
            </div>
          </div>
        )}
      </div>

      {/* Toolbar: Search & Select All */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar tópico por nome ou subdivisão..."
            className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <button
          type="button"
          onClick={handleSelectAllCurrent}
          className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 rounded-xl text-xs font-bold text-slate-700 transition flex items-center justify-center space-x-1.5 shrink-0"
        >
          <CheckSquare className="w-3.5 h-3.5 text-indigo-600" />
          <span>
            {filteredCurrentTopics.every(t => selectedTopicIds.includes(t.topic.id))
              ? 'Desmarcar Todos'
              : 'Selecionar Todos'}
          </span>
        </button>
      </div>

      {/* Primary Section: Current Period Topics */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
            Tópicos do {selectedPeriodIndex}º Bimestre ({filteredCurrentTopics.length})
          </span>
          {relatedSubjects.length > 1 && (
            <span className="text-[10px] bg-indigo-100 text-indigo-900 px-2 py-0.5 rounded-full font-bold">
              Subdivisões ({relatedSubjects.length} frentes)
            </span>
          )}
        </div>

        {filteredCurrentTopics.length === 0 ? (
          <div className="p-4 bg-white rounded-xl border border-dashed border-slate-300 text-center text-xs text-slate-500">
            Nenhum tópico encontrado para este bimestre. Você pode adicionar tópicos na gestão de matérias ou incluir de períodos anteriores abaixo.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
            {filteredCurrentTopics.map(({ topic, subjectName }) => {
              const isSelected = selectedTopicIds.includes(topic.id);
              const isMultipleSubjects = relatedSubjects.length > 1;

              return (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => handleToggleTopic(topic.id)}
                  className={`p-2.5 rounded-xl border text-left transition flex items-start space-x-2.5 min-h-[44px] ${
                    isSelected
                      ? 'bg-indigo-50/90 border-indigo-400 text-indigo-950 font-semibold shadow-sm'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100/80'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 transition ${
                    isSelected ? 'bg-indigo-600 text-white' : 'border border-slate-300 bg-slate-50'
                  }`}>
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className="text-xs block leading-snug break-words">
                      {topic.name}
                    </span>
                    <div className="flex items-center space-x-1.5 mt-0.5">
                      {isMultipleSubjects && (
                        <span className="text-[9px] bg-indigo-100 text-indigo-900 px-1.5 py-0.2 rounded font-bold">
                          {subjectName}
                        </span>
                      )}
                      {topic.needsRecovery && (
                        <span className="text-[9px] bg-rose-100 text-rose-800 px-1.5 py-0.2 rounded font-black">
                          ⚠️ Em Recuperação
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Expandable Section: Past Periods Topics */}
      {pastPeriodTopics.length > 0 && (
        <div className="pt-2 border-t border-slate-200 space-y-2">
          <button
            type="button"
            onClick={() => setShowPastPeriods(!showPastPeriods)}
            className="w-full text-left py-1.5 px-3 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition flex items-center justify-between"
          >
            <span className="flex items-center space-x-1.5">
              <span>+ Incluir tópicos de bimestres/períodos anteriores ({pastPeriodTopics.length})</span>
            </span>
            {showPastPeriods ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
          </button>

          {showPastPeriods && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1 animate-in fade-in">
              {filteredPastTopics.map(({ topic, subjectName }) => {
                const isSelected = selectedTopicIds.includes(topic.id);

                return (
                  <button
                    key={topic.id}
                    type="button"
                    onClick={() => handleToggleTopic(topic.id)}
                    className={`p-2.5 rounded-xl border text-left transition flex items-start space-x-2.5 min-h-[44px] ${
                      isSelected
                        ? 'bg-amber-50 border-amber-400 text-amber-950 font-semibold shadow-sm'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100/80'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 transition ${
                      isSelected ? 'bg-amber-600 text-white' : 'border border-slate-300 bg-slate-50'
                    }`}>
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <span className="text-xs block leading-snug break-words">
                        {topic.name}
                      </span>
                      <span className="text-[9px] text-amber-800 font-bold bg-amber-100/70 px-1.5 py-0.2 rounded inline-block mt-0.5">
                        {topic.bimester}º Bimestre • {subjectName}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
