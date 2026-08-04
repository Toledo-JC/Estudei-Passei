import React from 'react';
import { Subject, Evaluation, StudySessionLog, SchoolConfig, AppLayoutType } from '../types';
import { DailyTimerSection } from './DailyTimerSection';
import { SchoolConfigSection } from './SchoolConfigSection';
import { WeeklyStudyChart } from './WeeklyStudyChart';
import {
  Calculator,
  Sliders,
  ChevronRight,
  BookOpen,
  CheckCircle2,
  Clock,
  Zap,
  Columns,
  Layers,
  Sparkles,
  Flame,
  LayoutGrid,
  CheckSquare,
  AlertCircle,
  Play,
  Target
} from 'lucide-react';

import { DailyCycle } from '../types';

interface DashboardLayoutManagerProps {
  layoutType: AppLayoutType;
  subjects: Subject[];
  evaluations: Evaluation[];
  studyLogs: StudySessionLog[];
  schoolConfig: SchoolConfig;
  studentName: string;
  showConfigModal: boolean;
  onToggleConfigModal: () => void;
  onNavigateTab: (tab: string) => void;
  timerMinutes: number;
  timerSeconds: number;
  isTimerRunning: boolean;
  onToggleTimer: () => void;
  onResetTimer: () => void;
  onLogStudySession: (subjectId: string, topic: string, minutes: number, mode: 'escola' | 'enem') => void;
  onUpdateSubjects: (subjects: Subject[]) => void;
  onSaveConfig: (cfg: SchoolConfig) => void;
  dailyCycle?: DailyCycle | null;
  onMarkBlockCompleted?: (blockId: string, actualMinutes: number, questionsDone?: number, questionsCorrect?: number, notes?: string) => void;
  onSkipBlock?: (blockId: string) => void;
  onExtendBlockTime?: (blockId: string, additionalMins?: number) => void;
}

export const DashboardLayoutManager: React.FC<DashboardLayoutManagerProps> = ({
  layoutType,
  subjects,
  evaluations,
  studyLogs,
  schoolConfig,
  studentName,
  showConfigModal,
  onToggleConfigModal,
  onNavigateTab,
  timerMinutes,
  timerSeconds,
  isTimerRunning,
  onToggleTimer,
  onResetTimer,
  onLogStudySession,
  onUpdateSubjects,
  onSaveConfig,
  dailyCycle,
  onMarkBlockCompleted,
  onSkipBlock,
  onExtendBlockTime
}) => {
  // Common math calculations
  const totalMinutesAllTime = studyLogs.reduce((acc, curr) => acc + curr.minutes, 0);
  const totalHours = (totalMinutesAllTime / 60).toFixed(1);

  // LAYOUT 1: BENTO GRID (Padrão Executivo Multi-Módulos)
  if (layoutType === 'bento-grid') {
    return (
      <div className="space-y-8 animate-in fade-in duration-200">
        {/* Hero Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="bg-indigo-500/20 text-indigo-300 text-xs font-bold px-3 py-1 rounded-full border border-indigo-500/30">
                2º Bimestre Ativo
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/30">
                {schoolConfig.periodType === 'bimestre' ? '4 Bimestres' : '3 Trimestres'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight text-white">
              Olá, {studentName.split(' ')[0]}! 👋 (Layout Bento Grid)
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Seu painel inteligente em mosaico multi-módulos. Acompanhe matérias do colégio, simule metas e gerencie seus tempos de estudo.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => onNavigateTab('active-study-hub')}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs px-5 py-2.5 rounded-xl transition flex items-center space-x-2 shadow-lg shadow-emerald-500/25 transform hover:scale-105 active:scale-95"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>▶ Iniciar Estudo Agora</span>
            </button>

            <button
              onClick={() => onNavigateTab('active-study-hub')}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs px-4 py-2.5 rounded-xl transition flex items-center space-x-2 shadow-md"
            >
              <Target className="w-4 h-4 text-amber-300" />
              <span>🎯 Questões & Acertos</span>
            </button>

            <button
              onClick={onToggleConfigModal}
              className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition flex items-center space-x-2 shadow-sm"
            >
              <Sliders className="w-4 h-4 text-indigo-400" />
              <span>{showConfigModal ? 'Ocultar Regras' : 'Configurar Regras'}</span>
            </button>

            <button
              onClick={() => onNavigateTab('grade-simulator')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-5 py-2.5 rounded-xl transition flex items-center space-x-2 shadow-md shadow-indigo-600/30"
            >
              <Calculator className="w-4 h-4" />
              <span>Simular Notas</span>
            </button>
          </div>
        </div>

        {showConfigModal && (
          <SchoolConfigSection config={schoolConfig} onSaveConfig={onSaveConfig} />
        )}

        <DailyTimerSection
          subjects={subjects}
          studyLogs={studyLogs}
          timerMinutes={timerMinutes}
          timerSeconds={timerSeconds}
          isTimerRunning={isTimerRunning}
          onToggleTimer={onToggleTimer}
          onResetTimer={onResetTimer}
          onLogStudySession={onLogStudySession}
          onUpdateSubjects={onUpdateSubjects}
          dailyCycle={dailyCycle}
          onMarkBlockCompleted={onMarkBlockCompleted}
          onSkipBlock={onSkipBlock}
          onExtendBlockTime={onExtendBlockTime}
        />

        {/* Weekly Study Activity Chart */}
        <WeeklyStudyChart
          subjects={subjects}
          studyLogs={studyLogs}
        />

        {/* Bento Grid Subjects */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-display">
                Diário de Aulas do Professor (Visão em Grade Bento)
              </h3>
              <p className="text-xs text-slate-500">
                Acompanhe o ritmo do professor em sala de aula e os conteúdos marcados para exames.
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('dual-planner')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1"
            >
              <span>Gerenciar Diário</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects.map((sub) => {
              const taughtCount = sub.topics.filter(t => t.taught).length;
              const scopeCount = (sub.examScopeTopicIds || []).length;

              return (
                <div
                  key={sub.id}
                  onClick={() => onNavigateTab('dual-planner')}
                  className="p-4 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-indigo-50/60 hover:border-indigo-300 transition cursor-pointer space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{sub.name}</span>
                    <span className="text-[10px] font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full">
                      {sub.category}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-600 space-y-1">
                    <p className="flex items-center justify-between">
                      <span>Prof: <strong>{sub.teacherName || 'Não Informado'}</strong></span>
                      <span className="text-emerald-700 font-semibold">{taughtCount}/{sub.topics.length} Aulas</span>
                    </p>
                    <p className="flex items-center justify-between">
                      <span>Escopo de Prova:</span>
                      <span className="text-amber-700 font-bold">{scopeCount} tópicos</span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // LAYOUT 2: SIDEBAR SPLIT (Navegação com Barra Lateral Executiva)
  if (layoutType === 'sidebar-split') {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 animate-in fade-in duration-200">
        {/* Left Vertical Sidebar Panel */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-slate-900 text-white rounded-3xl p-5 border border-slate-800 space-y-4 shadow-lg">
            <div className="flex items-center space-x-3 border-b border-slate-800 pb-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center font-extrabold text-white text-lg">
                {studentName.charAt(0)}
              </div>
              <div>
                <span className="text-xs font-bold text-indigo-300 block uppercase tracking-wider">Painel Lateral</span>
                <span className="text-sm font-bold text-white block truncate">{studentName}</span>
              </div>
            </div>

            {/* Quick Stats in Sidebar */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between bg-slate-800 p-2.5 rounded-xl">
                <span className="text-slate-400">Horas Líquidas:</span>
                <span className="font-mono font-bold text-amber-300">{totalHours}h</span>
              </div>
              <div className="flex justify-between bg-slate-800 p-2.5 rounded-xl">
                <span className="text-slate-400">Disciplinas Ativas:</span>
                <span className="font-mono font-bold text-emerald-300">{subjects.length}</span>
              </div>
            </div>

            {/* Fast Navigation Buttons in Sidebar */}
            <div className="space-y-1.5 pt-2 border-t border-slate-800">
              <button
                onClick={() => onNavigateTab('grade-simulator')}
                className="w-full text-left bg-indigo-600/30 hover:bg-indigo-600 text-indigo-200 hover:text-white p-2.5 rounded-xl text-xs font-bold transition flex items-center justify-between"
              >
                <span>Simulador de Notas</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigateTab('dual-planner')}
                className="w-full text-left bg-slate-800 hover:bg-slate-700 text-slate-200 p-2.5 rounded-xl text-xs font-bold transition flex items-center justify-between"
              >
                <span>Diário do Professor</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => onNavigateTab('ai-hub')}
                className="w-full text-left bg-slate-800 hover:bg-slate-700 text-slate-200 p-2.5 rounded-xl text-xs font-bold transition flex items-center justify-between"
              >
                <span>Tutor Socrático IA</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>

          {/* List of Subjects in Sidebar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Acesso Rápido Matérias</h4>
              <span className="text-[10px] text-slate-400 lg:hidden">Deslize para o lado ➔</span>
            </div>
            
            {/* Mobile Horizontal Carousel / Desktop Vertical Stack */}
            <div className="flex lg:flex-col overflow-x-auto lg:overflow-visible gap-2 lg:space-y-1.5 scrollbar-none pb-2 lg:pb-0">
              {subjects.map(s => (
                <button
                  key={s.id}
                  onClick={() => onNavigateTab('dual-planner')}
                  className="shrink-0 lg:shrink w-auto lg:w-full text-left p-2.5 bg-slate-50 hover:bg-indigo-50 border border-slate-200 lg:border-transparent rounded-xl text-xs font-semibold text-slate-800 flex items-center justify-between gap-3 transition shadow-2xs"
                >
                  <span className="truncate whitespace-nowrap">{s.name}</span>
                  <span className="text-[10px] text-indigo-600 font-bold bg-indigo-100 px-2 py-0.5 rounded-md whitespace-nowrap">
                    {s.topics.filter(t => t.taught).length} aulas
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Center Stage Area */}
        <div className="lg:col-span-3 space-y-6">
          <DailyTimerSection
            subjects={subjects}
            studyLogs={studyLogs}
            timerMinutes={timerMinutes}
            timerSeconds={timerSeconds}
            isTimerRunning={isTimerRunning}
            onToggleTimer={onToggleTimer}
            onResetTimer={onResetTimer}
            onLogStudySession={onLogStudySession}
            onUpdateSubjects={onUpdateSubjects}
            dailyCycle={dailyCycle}
            onMarkBlockCompleted={onMarkBlockCompleted}
            onSkipBlock={onSkipBlock}
            onExtendBlockTime={onExtendBlockTime}
          />

          {showConfigModal && (
            <SchoolConfigSection config={schoolConfig} onSaveConfig={onSaveConfig} />
          )}

          {/* Weekly Study Activity Chart */}
          <WeeklyStudyChart
            subjects={subjects}
            studyLogs={studyLogs}
          />

          {/* Subjects Overview */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 font-display">
                Matérias e Cronograma do Trimestre / Bimestre
              </h3>
              <button
                onClick={() => onNavigateTab('dual-planner')}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1"
              >
                <span>Ver Detalhes</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {subjects.map(s => {
                const taughtCount = s.topics.filter(t => t.taught).length;
                const totalTopics = s.topics.length;
                const percentage = totalTopics > 0 ? Math.round((taughtCount / totalTopics) * 100) : 0;

                return (
                  <div key={s.id} className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200 space-y-2.5">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">{s.name}</span>
                        <span className="text-[11px] text-slate-500">{s.teacherName || 'Prof. Não Informado'}</span>
                      </div>
                      <span className="text-[10px] font-extrabold bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">
                        {percentage}% Concluído
                      </span>
                    </div>

                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-indigo-600 h-full rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
                      <span>{taughtCount} de {totalTopics} conteúdos lecionados</span>
                      <button
                        onClick={() => onNavigateTab('dual-planner')}
                        className="text-indigo-600 font-bold hover:underline"
                      >
                        Diário ➔
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    );
  }

  // LAYOUT 3: FOCUS STREAM (Feed Contínuo e Foco Linear)
  if (layoutType === 'focus-stream') {
    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-200">
        {/* Streamlined Focus Card */}
        <div className="bg-gradient-to-b from-indigo-950 to-slate-900 text-white rounded-3xl p-6 shadow-xl border border-indigo-900 text-center space-y-4">
          <span className="bg-indigo-500/30 text-indigo-300 text-xs font-bold px-3 py-1 rounded-full border border-indigo-500/40 inline-block">
            Modo Foco Continuo (Feed Linear)
          </span>

          <h2 className="text-xl font-bold font-display">
            Meta Direta de Estudos — {studentName}
          </h2>

          <p className="text-xs text-slate-300 leading-relaxed max-w-lg mx-auto">
            Visualização simplificada sem distração. Mantenha o cronômetro ativo e marque o conteúdo assim que o professor expuser em sala.
          </p>

          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={onToggleTimer}
              className={`px-6 py-2.5 rounded-xl font-bold text-xs shadow-md transition flex items-center space-x-2 ${
                isTimerRunning ? 'bg-rose-600 hover:bg-rose-700 text-white' : 'bg-emerald-500 hover:bg-emerald-600 text-slate-950'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>{isTimerRunning ? 'Pausar Estudo' : 'Iniciar Cronômetro'}</span>
            </button>
          </div>
        </div>

        {/* Compact Timer Widget */}
        <DailyTimerSection
          subjects={subjects}
          studyLogs={studyLogs}
          timerMinutes={timerMinutes}
          timerSeconds={timerSeconds}
          isTimerRunning={isTimerRunning}
          onToggleTimer={onToggleTimer}
          onResetTimer={onResetTimer}
          onLogStudySession={onLogStudySession}
          onUpdateSubjects={onUpdateSubjects}
          dailyCycle={dailyCycle}
          onMarkBlockCompleted={onMarkBlockCompleted}
          onSkipBlock={onSkipBlock}
          onExtendBlockTime={onExtendBlockTime}
        />

        {showConfigModal && (
          <SchoolConfigSection config={schoolConfig} onSaveConfig={onSaveConfig} />
        )}

        {/* Weekly Study Activity Chart */}
        <WeeklyStudyChart
          subjects={subjects}
          studyLogs={studyLogs}
        />

        {/* Linear Stream of Subjects */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Feed Linear das Matérias Escolhares
          </h3>

          {subjects.map(s => {
            const taughtCount = s.topics.filter(t => t.taught).length;
            const scopeCount = (s.examScopeTopicIds || []).length;

            return (
              <div
                key={s.id}
                onClick={() => onNavigateTab('dual-planner')}
                className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-400 cursor-pointer transition flex items-center justify-between"
              >
                <div>
                  <span className="text-xs font-bold text-slate-900 block">{s.name}</span>
                  <span className="text-[11px] text-slate-500">
                    Prof: {s.teacherName || 'Não Informado'} • {taughtCount} aulas explicadas
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-1 rounded-lg">
                    {scopeCount} na Prova
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // LAYOUT 4: KANBAN BOARD (Quadro Kanban Semanal por Colunas)
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 flex items-center justify-between flex-wrap gap-4 shadow-md">
        <div>
          <div className="flex items-center space-x-2">
            <Columns className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-bold font-display">Visão Kanban Semanal & Módulos</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Organize visualmente matérias, temas lecionados, escopo de exames e revisões espaçadas.
          </p>
        </div>

        <button
          onClick={() => onNavigateTab('dual-planner')}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition"
        >
          Abrir Planejador Dual
        </button>
      </div>

      {showConfigModal && (
        <SchoolConfigSection config={schoolConfig} onSaveConfig={onSaveConfig} />
      )}

      {/* Weekly Study Activity Chart */}
      <WeeklyStudyChart
        subjects={subjects}
        studyLogs={studyLogs}
      />

      {/* 4 Kanban Columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Column 1: Disciplinas Cadastradas */}
        <div className="bg-slate-100 rounded-2xl p-4 space-y-3 border border-slate-200">
          <div className="flex justify-between items-center pb-2 border-b border-slate-200">
            <span className="text-xs font-bold text-slate-800 uppercase">1. Disciplinas ({subjects.length})</span>
            <BookOpen className="w-4 h-4 text-slate-500" />
          </div>

          <div className="space-y-2">
            {subjects.map(s => (
              <div key={s.id} className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1">
                <span className="text-xs font-bold text-slate-900 block">{s.name}</span>
                <span className="text-[10px] text-indigo-600 bg-indigo-50 font-bold px-2 py-0.5 rounded">
                  {s.category}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Column 2: Conteúdo Ministrado */}
        <div className="bg-slate-100 rounded-2xl p-4 space-y-3 border border-slate-200">
          <div className="flex justify-between items-center pb-2 border-b border-slate-200">
            <span className="text-xs font-bold text-emerald-900 uppercase">2. Aulas Ministradas</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>

          <div className="space-y-2">
            {(subjects || []).flatMap(s => (s.topics || []).filter(t => t.taught).map(t => ({ subjectName: s.name, topic: t }))).slice(0, 6).map((item, i) => (
              <div key={i} className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-emerald-800 block">{item.subjectName}</span>
                <span className="text-xs font-semibold text-slate-900 block">{item.topic.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Column 3: Escopo do Próximo Exame */}
        <div className="bg-slate-100 rounded-2xl p-4 space-y-3 border border-slate-200">
          <div className="flex justify-between items-center pb-2 border-b border-slate-200">
            <span className="text-xs font-bold text-amber-900 uppercase">3. Escopo de Prova</span>
            <Zap className="w-4 h-4 text-amber-600" />
          </div>

          <div className="space-y-2">
            {(subjects || []).flatMap(s => (s.examScopeTopicIds || []).map(topicId => {
              const topic = (s.topics || []).find(t => t.id === topicId);
              return topic ? { subjectName: s.name, topic } : null;
            })).filter(Boolean).slice(0, 6).map((item: any, i) => (
              <div key={i} className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-amber-800 block">{item.subjectName}</span>
                <span className="text-xs font-semibold text-slate-900 block">{item.topic.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Column 4: Sessão de Estudo em Andamento */}
        <div className="bg-slate-100 rounded-2xl p-4 space-y-3 border border-slate-200">
          <div className="flex justify-between items-center pb-2 border-b border-slate-200">
            <span className="text-xs font-bold text-indigo-900 uppercase">4. Cronômetro Ativo</span>
            <Clock className="w-4 h-4 text-indigo-600" />
          </div>

          <div className="p-4 bg-indigo-900 text-white rounded-xl text-center space-y-3">
            <span className="text-2xl font-black font-mono block">
              {String(timerMinutes).padStart(2, '0')}:{String(timerSeconds).padStart(2, '0')}
            </span>
            <button
              onClick={onToggleTimer}
              className={`w-full py-2 rounded-lg font-bold text-xs transition ${
                isTimerRunning ? 'bg-rose-500 text-white' : 'bg-indigo-500 text-white hover:bg-indigo-600'
              }`}
            >
              {isTimerRunning ? 'Pausar' : 'Iniciar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
