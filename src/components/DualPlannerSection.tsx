import React, { useState } from 'react';
import { Subject, TeacherTopic } from '../types';
import { TooltipHelp } from './TooltipHelp';
import { BookOpen, Sparkles, CheckSquare, Square, Calendar, Plus, Trash2, Clock, Award, ShieldCheck, Filter } from 'lucide-react';

interface DualPlannerSectionProps {
  subjects: Subject[];
  onUpdateSubjects: (subjects: Subject[]) => void;
  onLogStudySession: (subjectId: string, topic: string, minutes: number, mode: 'escola' | 'enem') => void;
}

export const DualPlannerSection: React.FC<DualPlannerSectionProps> = ({
  subjects,
  onUpdateSubjects,
  onLogStudySession
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'journal' | 'enem' | 'assistant'>('journal');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(subjects[0]?.id || 'matematica');
  const [newTopicName, setNewTopicName] = useState('');

  // Assistant states
  const [dailyFreeHours, setDailyFreeHours] = useState<number>(3);
  const [targetFocus, setTargetFocus] = useState<'equilibrado' | 'foco_exatas' | 'foco_redacao' | 'foco_humanas' | 'personalizado'>('equilibrado');
  const [customSubjectWeights, setCustomSubjectWeights] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    subjects.forEach(s => { init[s.id] = s.weight || 3; });
    return init;
  });
  const [selectedAssistantSubjectIds, setSelectedAssistantSubjectIds] = useState<string[]>(() =>
    subjects.filter(s => s.enabled !== false).map(s => s.id)
  );
  const [generatedCycle, setGeneratedCycle] = useState<any[] | null>(null);

  const activeSubjects = subjects.filter(s => s.enabled !== false);
  const selectedSubject = activeSubjects.find(s => s.id === selectedSubjectId) || activeSubjects[0] || subjects[0];

  const handleToggleAssistantSubject = (subjectId: string) => {
    setSelectedAssistantSubjectIds(prev =>
      prev.includes(subjectId) ? prev.filter(id => id !== subjectId) : [...prev, subjectId]
    );
  };

  const handleCustomWeightChange = (subjectId: string, newWeight: number) => {
    setCustomSubjectWeights(prev => ({ ...prev, [subjectId]: newWeight }));
  };

  // Toggle taught state on topic
  const handleToggleTopicTaught = (subjectId: string, topicId: string) => {
    const updated = subjects.map(s => {
      if (s.id !== subjectId) return s;
      const updatedTopics = s.topics.map(t => {
        if (t.id !== topicId) return t;
        return {
          ...t,
          taught: !t.taught,
          taughtDate: !t.taught ? new Date().toISOString().split('T')[0] : undefined
        };
      });
      return { ...s, topics: updatedTopics };
    });
    onUpdateSubjects(updated);
  };

  // Add new topic taught by teacher
  const handleAddTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopicName.trim() || !selectedSubject) return;

    const newTopic: TeacherTopic = {
      id: `top-${Date.now()}`,
      name: newTopicName.trim(),
      taught: true,
      taughtDate: new Date().toISOString().split('T')[0]
    };

    const updated = subjects.map(s => {
      if (s.id !== selectedSubject.id) return s;
      return { ...s, topics: [...s.topics, newTopic] };
    });

    onUpdateSubjects(updated);
    setNewTopicName('');
  };

  // Generate automated study cycle ("Quero ajuda do Estudei")
  const handleGenerateCycle = () => {
    const totalWeeklyHours = dailyFreeHours * 5; // 5 dias úteis de estudos
    const minutesTotal = totalWeeklyHours * 60;

    let targetSubjectsList = subjects;

    if (targetFocus === 'personalizado') {
      targetSubjectsList = subjects.filter(s => selectedAssistantSubjectIds.includes(s.id));
      if (targetSubjectsList.length === 0) {
        targetSubjectsList = subjects; // fallback if none selected
      }
    }

    const cycle = targetSubjectsList.map(sub => {
      let weight = 1;
      if (targetFocus === 'foco_exatas' && sub.category === 'Exatas') weight = 2.5;
      else if (targetFocus === 'foco_redacao' && sub.category === 'Redação') weight = 3.0;
      else if (targetFocus === 'foco_humanas' && sub.category === 'Humanas') weight = 2.0;
      else if (targetFocus === 'personalizado') {
        weight = customSubjectWeights[sub.id] || 3;
      }

      return {
        subject: sub,
        weight
      };
    });

    const totalWeight = cycle.reduce((acc, c) => acc + c.weight, 0);

    const allocated = cycle.map(c => {
      const allocatedMins = Math.round((c.weight / Math.max(1, totalWeight)) * minutesTotal);
      return {
        subjectName: c.subject.name,
        category: c.subject.category,
        weight: c.weight,
        weeklyMinutes: allocatedMins,
        dailyBlockMinutes: Math.round(allocatedMins / 5),
        suggestedFocus: c.subject.topics.find(t => t.taught)?.name || 'Revisão dos fundamentos'
      };
    });

    setGeneratedCycle(allocated);
  };

  return (
    <div className="space-y-6">
      {/* Sub Header Navigation */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 font-display flex items-center">
            <span>Planejamento Dual: Escola + Vestibular</span>
            <TooltipHelp
              title="O que é o Planejamento Dual?"
              text="Separa de forma cirúrgica o cumprimento da matéria que o seu professor específico ensina no colégio da trilha de preparação contínua de longo prazo do ENEM/Vestibulares."
              example="Evita que você estude um assunto do ENEM na véspera de uma prova de escola que cobrará algo totalmente diferente."
            />
          </h2>
          <p className="text-xs text-slate-500">
            Acompanhe o ritmo real das aulas e monte ciclos de estudo inteligentes.
          </p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveSubTab('journal')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeSubTab === 'journal'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            <span>Diário do Professor (Escola)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('enem')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeSubTab === 'enem'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Award className="w-4 h-4 text-amber-300" />
            <span>Trilha ENEM & Vestibulares</span>
          </button>

          <button
            onClick={() => setActiveSubTab('assistant')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeSubTab === 'assistant'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>"Quero Ajuda do Estudei"</span>
          </button>
        </div>
      </div>

      {/* SUB TAB 1: Diário de Avanço do Professor */}
      {activeSubTab === 'journal' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Select Subject */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center">
              <span>Disciplinas Escolares</span>
              <TooltipHelp text="Selecione uma matéria para visualizar os tópicos ministrados e atualizar o escopo." />
            </h3>

            <div className="space-y-1.5">
              {subjects.map((sub) => {
                const taughtCount = sub.topics.filter(t => t.taught).length;
                const isSelected = sub.id === selectedSubjectId;

                return (
                  <button
                    key={sub.id}
                    onClick={() => setSelectedSubjectId(sub.id)}
                    className={`w-full text-left p-3 rounded-xl border transition flex items-center justify-between ${
                      isSelected
                        ? 'bg-indigo-50 border-indigo-400 text-indigo-950 font-bold shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div>
                      <span className="block text-xs font-bold">{sub.name}</span>
                      <span className="text-[11px] text-slate-500 font-normal">
                        {sub.teacherName || 'Prof. Não Cadastrado'}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                        {taughtCount}/{sub.topics.length} ministrados
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Topics Checklist taught in class */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
                  {selectedSubject.category}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1 font-display">
                  {selectedSubject.name} — Diário de Conteúdo Ministrado
                </h3>
                <p className="text-xs text-slate-500">
                  Marque exclusivamente os tópicos que o professor <strong>já explicou em sala de aula</strong>.
                </p>
              </div>
            </div>

            {/* Topic List */}
            <div className="space-y-2.5">
              {selectedSubject.topics.map((topic) => (
                <div
                  key={topic.id}
                  onClick={() => handleToggleTopicTaught(selectedSubject.id, topic.id)}
                  className={`p-3.5 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                    topic.taught
                      ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {topic.taught ? (
                      <CheckSquare className="w-5 h-5 text-emerald-600 shrink-0" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-400 shrink-0" />
                    )}
                    <div>
                      <span className={`text-xs font-semibold block ${topic.taught ? 'line-through text-slate-700' : 'text-slate-900'}`}>
                        {topic.name}
                      </span>
                      {topic.taught && topic.taughtDate && (
                        <span className="text-[10px] text-emerald-700 font-medium">
                          Ministrado pelo professor em: {topic.taughtDate}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onLogStudySession(selectedSubject.id, topic.name, 30, 'escola');
                      }}
                      className="text-[11px] font-semibold bg-white border border-slate-300 hover:border-indigo-500 hover:text-indigo-600 px-2.5 py-1 rounded-lg text-slate-700 transition flex items-center space-x-1"
                      title="Registrar 30 min de estudo deste tópico"
                    >
                      <Clock className="w-3 h-3 text-indigo-500" />
                      <span>+30 min</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add New Topic manually taught in class */}
            <form onSubmit={handleAddTopic} className="pt-3 border-t border-slate-200 flex gap-2">
              <input
                type="text"
                value={newTopicName}
                onChange={(e) => setNewTopicName(e.target.value)}
                placeholder="Ex: Novo assunto explicado hoje em sala (ex: Função Exponencial)..."
                className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-4 py-2 rounded-xl transition flex items-center space-x-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Registrar Aula</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* SUB TAB 2: Trilha de Longo Prazo ENEM / Vestibulares */}
      {activeSubTab === 'enem' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-display flex items-center">
                <Award className="w-5 h-5 text-amber-500 mr-2" />
                <span>Trilha ENEM & Vestibulares Seriados</span>
              </h3>
              <p className="text-xs text-slate-500">
                Acompanhamento contínuo dos conteúdos mais recorrentes na Matriz de Referência do ENEM.
              </p>
            </div>
            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded-xl">
              Carga Horária Livre: ~15h / semana
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects.map((sub) => (
              <div key={sub.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{sub.name}</span>
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                    Peso ENEM
                  </span>
                </div>

                <div className="text-xs text-slate-600 space-y-1.5">
                  <p className="font-medium text-slate-800">Tópicos de Alta Recorrência:</p>
                  <ul className="list-disc list-inside text-[11px] text-slate-600 space-y-1">
                    {sub.topics.slice(0, 3).map(t => (
                      <li key={t.id}>{t.name}</li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={() => onLogStudySession(sub.id, 'Treino de Questões ENEM', 45, 'enem')}
                  className="w-full text-center text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-xl transition flex items-center justify-center space-x-1.5 shadow-sm"
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>+45m Treino ENEM</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB TAB 3: Assistente "Quero Ajuda do Estudei" */}
      {activeSubTab === 'assistant' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex items-center space-x-3 bg-gradient-to-r from-indigo-900 to-slate-900 p-4 rounded-xl text-white">
            <Sparkles className="w-8 h-8 text-amber-400 shrink-0" />
            <div>
              <h3 className="text-base font-bold font-display">Assistente de Montagem de Ciclo Inteligente</h3>
              <p className="text-xs text-slate-300">
                O Estudei calcula a distribuição exata de minutos por matéria baseado no seu tempo livre diário e prioridades.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-5 rounded-2xl border border-slate-200">
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center">
                <span>Horas Livres de Estudo por Dia (Seg a Sex)</span>
                <TooltipHelp text="Quantidade de horas diárias dedicadas exclusivamente aos estudos em casa." />
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={dailyFreeHours}
                onChange={(e) => setDailyFreeHours(parseInt(e.target.value) || 3)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center">
                <span>Foco Estratégico Atual</span>
                <TooltipHelp text="Prioridade de estudos para turbinar as áreas de maior peso ou dificuldade." />
              </label>
              <select
                value={targetFocus}
                onChange={(e) => setTargetFocus(e.target.value as any)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500"
              >
                <option value="equilibrado">Equilibrado (Todas as disciplinas iguais)</option>
                <option value="foco_exatas">Foco em Exatas (Matemática, Física, Química)</option>
                <option value="foco_redacao">Foco em Redação (Garantir 900+ no ENEM)</option>
                <option value="foco_humanas">Foco em Humanas & Biológicas</option>
                <option value="personalizado">🎯 Personalizado (Escolher matérias e nível de dificuldade)</option>
              </select>
            </div>

            {targetFocus === 'personalizado' && (
              <div className="md:col-span-2 p-4 bg-white border border-indigo-200 rounded-2xl space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div>
                    <h4 className="text-xs font-black text-indigo-950 uppercase tracking-wide">
                      🎯 Personalização de Foco: Selecione as Matérias e os Pesos de Dificuldade
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Marque as matérias do seu foco e atribua um peso de 1 (Fácil) a 5 (Dificuldade Crítica / Maior Peso).
                    </p>
                  </div>
                  <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg">
                    {selectedAssistantSubjectIds.length} de {subjects.length} selecionadas
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-64 overflow-y-auto pr-1">
                  {subjects.map(sub => {
                    const isChecked = selectedAssistantSubjectIds.includes(sub.id);
                    const weight = customSubjectWeights[sub.id] || 3;

                    return (
                      <div
                        key={sub.id}
                        className={`p-3 rounded-xl border transition flex flex-col justify-between space-y-2 ${
                          isChecked
                            ? 'bg-indigo-50/40 border-indigo-200'
                            : 'bg-slate-50 border-slate-200 opacity-60'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleToggleAssistantSubject(sub.id)}
                              className="w-4 h-4 rounded text-indigo-600 accent-indigo-600 cursor-pointer"
                            />
                            <span className="text-xs font-bold text-slate-900">{sub.name}</span>
                          </label>

                          <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                            {sub.category}
                          </span>
                        </div>

                        {isChecked && (
                          <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                            <span className="text-[10px] font-semibold text-slate-600">Dificuldade:</span>
                            <div className="flex items-center space-x-1">
                              {[1, 2, 3, 4, 5].map(w => (
                                <button
                                  key={w}
                                  type="button"
                                  onClick={() => handleCustomWeightChange(sub.id, w)}
                                  className={`w-6 h-6 text-[10px] font-extrabold rounded transition ${
                                    weight === w
                                      ? 'bg-indigo-600 text-white shadow-xs'
                                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                                  }`}
                                  title={`Peso ${w}: ${w === 1 ? 'Muito Fácil' : w === 5 ? 'Dificuldade Máxima' : 'Regular'}`}
                                >
                                  {w}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="md:col-span-2 flex justify-end">
              <button
                type="button"
                onClick={handleGenerateCycle}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow transition flex items-center space-x-2"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Gerar Meu Ciclo Semanal Recomendado</span>
              </button>
            </div>
          </div>

          {generatedCycle && (
            <div className="space-y-4 animate-in fade-in">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Ciclo Recomendado pelo Assistente Estudei
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {generatedCycle.map((item, idx) => (
                  <div key={idx} className="p-3.5 bg-indigo-50/60 border border-indigo-200 rounded-xl">
                    <span className="text-xs font-bold text-indigo-950 block">{item.subjectName}</span>
                    <p className="text-[11px] text-indigo-700 mt-1">
                      Meta Semanal: <strong>{item.weeklyMinutes} min</strong> (~{item.dailyBlockMinutes} min/dia)
                    </p>
                    <p className="text-[10px] text-slate-500 mt-1 italic">
                      Foco sugerido: {item.suggestedFocus}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
