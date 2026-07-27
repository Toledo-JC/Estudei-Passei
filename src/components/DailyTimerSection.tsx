import React, { useState } from 'react';
import { Subject, StudySessionLog } from '../types';
import { TooltipHelp } from './TooltipHelp';
import { Clock, Play, Pause, RotateCcw, Filter, CheckCircle2, Flame, Calendar, BookOpen, AlertCircle } from 'lucide-react';

interface DailyTimerSectionProps {
  subjects: Subject[];
  studyLogs: StudySessionLog[];
  timerMinutes: number;
  timerSeconds: number;
  isTimerRunning: boolean;
  onToggleTimer: () => void;
  onResetTimer: () => void;
  onLogStudySession: (subjectId: string, topic: string, minutes: number, mode: 'escola' | 'enem') => void;
  onUpdateSubjects: (updatedSubjects: Subject[]) => void;
}

export const DailyTimerSection: React.FC<DailyTimerSectionProps> = ({
  subjects,
  studyLogs,
  timerMinutes,
  timerSeconds,
  isTimerRunning,
  onToggleTimer,
  onResetTimer,
  onLogStudySession,
  onUpdateSubjects
}) => {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(subjects[0]?.id || 'matematica');
  const [sessionTopic, setSessionTopic] = useState<string>('');
  const [sessionMode, setSessionMode] = useState<'escola' | 'enem'>('escola');

  // Exam Scope Filter state
  const [scopeSubjectId, setScopeSubjectId] = useState<string>(subjects[0]?.id || 'matematica');

  const selectedSubject = subjects.find(s => s.id === selectedSubjectId) || subjects[0];
  const scopeSubject = subjects.find(s => s.id === scopeSubjectId) || subjects[0];

  const handleManualSaveTimer = () => {
    const elapsedMinutes = timerMinutes + Math.round(timerSeconds / 60);
    if (elapsedMinutes < 1) return;

    onLogStudySession(
      selectedSubjectId,
      sessionTopic || 'Sessão de Estudos Concentrados',
      elapsedMinutes,
      sessionMode
    );
    onResetTimer();
    setSessionTopic('');
  };

  const handleToggleScopeTopic = (subjectId: string, topicId: string) => {
    const updated = subjects.map(s => {
      if (s.id !== subjectId) return s;
      const currentScope = s.examScopeTopicIds || [];
      const isSelected = currentScope.includes(topicId);
      const newScope = isSelected
        ? currentScope.filter(id => id !== topicId)
        : [...currentScope, topicId];

      return { ...s, examScopeTopicIds: newScope };
    });

    onUpdateSubjects(updated);
  };

  const formatTime = (m: number, s: number) =>
    `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;

  const totalMinutesToday = studyLogs
    .filter(l => l.date === new Date().toISOString().split('T')[0])
    .reduce((acc, curr) => acc + curr.minutes, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 1. Cronômetro Pomodoro de Estudos Líquidos */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-display flex items-center">
              <Clock className="w-5 h-5 text-indigo-600 mr-2" />
              <span>Cronômetro Líquido de Estudo</span>
              <TooltipHelp
                title="Horas Líquidas"
                text="Apenas o tempo de foco real sem distrações ou pausas é contabilizado no seu diário."
              />
            </h3>
            <p className="text-xs text-slate-500">Acione o timer ao iniciar sua leitura ou exercícios.</p>
          </div>
          <div className="flex items-center space-x-1 text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full text-xs font-bold border border-amber-200">
            <Flame className="w-3.5 h-3.5" />
            <span>{totalMinutesToday}m Hoje</span>
          </div>
        </div>

        {/* Big Timer Display */}
        <div className="text-center py-4 bg-slate-900 rounded-2xl text-white shadow-inner border border-slate-800">
          <span className="font-mono text-5xl font-extrabold tracking-wider text-emerald-400">
            {formatTime(timerMinutes, timerSeconds)}
          </span>
          <p className="text-[11px] text-slate-400 mt-2 font-medium">
            {isTimerRunning ? '🟢 Cronômetro Em Execução...' : '⏸️ Pausado'}
          </p>

          <div className="flex justify-center space-x-3 mt-4">
            <button
              onClick={onToggleTimer}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs transition flex items-center space-x-2 ${
                isTimerRunning
                  ? 'bg-amber-500 hover:bg-amber-600 text-slate-950'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              {isTimerRunning ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>Pausar</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Iniciar Estudo</span>
                </>
              )}
            </button>

            <button
              onClick={onResetTimer}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Log Session Form */}
        <div className="space-y-3 pt-2">
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase">Matéria Estudada</label>
            <select
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
              className="w-full mt-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800"
            >
              {subjects.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase">Tópico/Assunto</label>
            <input
              type="text"
              value={sessionTopic}
              onChange={(e) => setSessionTopic(e.target.value)}
              placeholder="Ex: Resolução de Lista de Exercícios PA/PG"
              className="w-full mt-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase">Modo de Estudo</label>
            <div className="grid grid-cols-2 gap-2 mt-1">
              <button
                type="button"
                onClick={() => setSessionMode('escola')}
                className={`py-1.5 px-3 rounded-lg text-xs font-semibold transition ${
                  sessionMode === 'escola' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                Foco Escola
              </button>
              <button
                type="button"
                onClick={() => setSessionMode('enem')}
                className={`py-1.5 px-3 rounded-lg text-xs font-semibold transition ${
                  sessionMode === 'enem' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                Foco ENEM
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={handleManualSaveTimer}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 rounded-xl shadow transition"
          >
            Registrar Minutos no Diário Líquido
          </button>
        </div>
      </div>

      {/* 2. Filtro de Escopo para Avaliações (Estudo Cirúrgico) */}
      <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-display flex items-center">
              <Filter className="w-5 h-5 text-indigo-600 mr-2" />
              <span>Filtro de Escopo para Avaliações (Véspera de Prova)</span>
              <TooltipHelp
                title="Filtro de Escopo Cirúrgico"
                text="Marque apenas os tópicos que o professor confirmou que vão cair na prova iminente. O Estudei e a IA filtram todo o excesso de matéria para focar no que dá nota."
              />
            </h3>
            <p className="text-xs text-slate-500">
              Corte o excesso e revise estritamente o conteúdo cobrado pela sua escola.
            </p>
          </div>
        </div>

        {/* Select Subject for Scope */}
        <div className="flex flex-wrap items-center gap-2">
          {subjects.map(s => (
            <button
              key={s.id}
              onClick={() => setScopeSubjectId(s.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                s.id === scopeSubjectId
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>

        {/* Checkbox list of taught topics to include in test scope */}
        <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800">
              Tópicos Ministrados em {scopeSubject.name}:
            </span>
            <span className="text-[11px] font-semibold text-indigo-700">
              {(scopeSubject.examScopeTopicIds || []).length} selecionados para a prova
            </span>
          </div>

          <div className="space-y-2">
            {scopeSubject.topics.map(t => {
              const inScope = (scopeSubject.examScopeTopicIds || []).includes(t.id);

              return (
                <label
                  key={t.id}
                  className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition ${
                    inScope
                      ? 'bg-indigo-50 border-indigo-300 text-indigo-950 font-semibold'
                      : 'bg-white border-slate-200 text-slate-600'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={inScope}
                      onChange={() => handleToggleScopeTopic(scopeSubject.id, t.id)}
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-xs">{t.name}</span>
                  </div>

                  {t.taught ? (
                    <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                      Ensina pelo Prof
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400 font-medium">Não ensinado</span>
                  )}
                </label>
              );
            })}
          </div>

          <div className="pt-2 flex items-center justify-between text-xs text-indigo-800 bg-indigo-50/80 p-3 rounded-lg border border-indigo-200">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>Escopo ativado! As revisões e tutorias de IA estarão restritas a estes assuntos.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
