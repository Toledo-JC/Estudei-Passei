import React, { useState, useEffect, useRef } from 'react';
import { Subject, StudySessionLog, QuestionLogEntry, DailyCycle, CycleBlockItem } from '../types';
import { TooltipHelp } from './TooltipHelp';
import { 
  Clock, Play, Pause, RotateCcw, CheckCircle2, Flame, Sparkles, FastForward, Plus, ChevronDown, ChevronUp, ArrowLeft, Coffee, BookOpen, Target, Layers, Brain, HelpCircle, Check
} from 'lucide-react';
import { playFiveMinWarningSound, playCompletionSound } from '../utils/audioAlerts';
import { useStudyTimer } from '../contexts/StudyTimerContext';

interface DailyTimerSectionProps {
  subjects: Subject[];
  studyLogs: StudySessionLog[];
  timerMinutes?: number;
  timerSeconds?: number;
  isTimerRunning?: boolean;
  onToggleTimer?: () => void;
  onResetTimer?: () => void;
  onLogStudySession?: (subjectId: string, topic: string, minutes: number, mode: 'escola' | 'enem') => void;
  onUpdateSubjects?: (updatedSubjects: Subject[]) => void;

  // Adaptive Cycle execution props
  dailyCycle?: DailyCycle | null;
  activeBlockIndex?: number;
  onMarkBlockCompleted?: (
    blockId: string, 
    actualMinutes: number, 
    questionsDone?: number, 
    questionsCorrect?: number, 
    notes?: string
  ) => void;
  onSkipBlock?: (blockId: string) => void;
  onExtendBlockTime?: (blockId: string, additionalMins?: number) => void;
  onSelectBlockIndex?: (index: number) => void;
  isModal?: boolean;
  onCloseModal?: () => void;
}

export const DailyTimerSection: React.FC<DailyTimerSectionProps> = ({
  subjects,
  studyLogs,
  timerMinutes = 0,
  timerSeconds = 0,
  isTimerRunning = false,
  onToggleTimer,
  onResetTimer,
  onLogStudySession,
  onUpdateSubjects,
  dailyCycle,
  activeBlockIndex = 0,
  onMarkBlockCompleted,
  onSkipBlock,
  onExtendBlockTime,
  onSelectBlockIndex,
  isModal = false,
  onCloseModal
}) => {
  // Determine if there are valid cycle blocks
  const hasActiveCycle = Boolean(dailyCycle && dailyCycle.blocks.length > 0);
  const studyTimerCtx = useStudyTimer();

  // Mode: 'cycle' or 'manual'
  const [timerMode, setTimerMode] = useState<'cycle' | 'manual'>(hasActiveCycle ? 'cycle' : 'manual');

  // Internal block index
  const [currentBlockIdx, setCurrentBlockIdx] = useState<number>(activeBlockIndex);

  // Active cycle block
  const activeBlock: CycleBlockItem | undefined = dailyCycle?.blocks[currentBlockIdx] || dailyCycle?.blocks.find(b => !b.completed);

  // Time states
  const [secondsLeft, setSecondsLeft] = useState<number>(
    activeBlock ? activeBlock.plannedMinutes * 60 : 25 * 60
  );
  const [totalPlannedSecs, setTotalPlannedSecs] = useState<number>(
    activeBlock ? activeBlock.plannedMinutes * 60 : 25 * 60
  );
  const [isRunningInternal, setIsRunningInternal] = useState<boolean>(false);
  const [manualCountUpSecs, setManualCountUpSecs] = useState<number>(timerMinutes * 60 + timerSeconds);

  // Break state
  const [isBreakActive, setIsBreakActive] = useState<boolean>(false);
  const [breakSecondsLeft, setBreakSecondsLeft] = useState<number>(300); // 5 min break
  const [isSoundEnabled, setIsSoundEnabled] = useState<boolean>(true);

  // Form Fields (used mainly in Manual Mode)
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(
    activeBlock?.subjectId || subjects[0]?.id || 'matematica'
  );
  const [sessionTopic, setSessionTopic] = useState<string>(
    activeBlock?.topicName || ''
  );
  const [sessionMode, setSessionMode] = useState<'escola' | 'enem'>('escola');

  // Questions from Notebook/Book state (Collapsible)
  const [showQuestionsAccordion, setShowQuestionsAccordion] = useState<boolean>(false);
  const [questionsTotal, setQuestionsTotal] = useState<number | ''>('');
  const [questionsCorrect, setQuestionsCorrect] = useState<number | ''>('');
  const [questionsSource, setQuestionsSource] = useState<string>('Caderno / Livro Didático');

  const hasPlayed5MinRef = useRef<boolean>(false);

  // Update form fields when active block changes in cycle mode
  useEffect(() => {
    if (timerMode === 'cycle' && activeBlock) {
      setSelectedSubjectId(activeBlock.subjectId);
      setSessionTopic(activeBlock.topicName || 'Tópico do Ciclo');
      const plannedSecs = activeBlock.plannedMinutes * 60;
      setSecondsLeft(plannedSecs);
      setTotalPlannedSecs(plannedSecs);
      setIsRunningInternal(false);
      hasPlayed5MinRef.current = false;
    }
  }, [currentBlockIdx, timerMode, activeBlock?.id]);

  // Sync external manual timer if provided
  useEffect(() => {
    if (timerMode === 'manual') {
      setManualCountUpSecs(timerMinutes * 60 + timerSeconds);
    }
  }, [timerMinutes, timerSeconds, timerMode]);

  // Main Timer Countdown (Cycle Mode) or Countup (Manual Mode)
  useEffect(() => {
    const isRunning = timerMode === 'cycle' ? isRunningInternal : isTimerRunning;
    if (!isRunning) return;

    if (timerMode === 'cycle') {
      if (secondsLeft <= 0) {
        if (isSoundEnabled) playCompletionSound();
        setIsRunningInternal(false);
        handleAutoFinishBlock();
        return;
      }

      if (secondsLeft === 300 && !hasPlayed5MinRef.current) {
        hasPlayed5MinRef.current = true;
        if (isSoundEnabled) playFiveMinWarningSound();
      }

      const timer = setInterval(() => {
        setSecondsLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      // Manual mode tick
      const timer = setInterval(() => {
        setManualCountUpSecs(prev => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timerMode, isRunningInternal, isTimerRunning, secondsLeft, isSoundEnabled]);

  // Break Timer Effect
  useEffect(() => {
    if (!isBreakActive) return;
    if (breakSecondsLeft <= 0) {
      setIsBreakActive(false);
      return;
    }
    const timer = setInterval(() => {
      setBreakSecondsLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isBreakActive, breakSecondsLeft]);

  // Auto-finish block when time expires
  const handleAutoFinishBlock = () => {
    if (activeBlock && onMarkBlockCompleted) {
      const qTotal = typeof questionsTotal === 'number' ? questionsTotal : undefined;
      const qCorrect = typeof questionsCorrect === 'number' ? questionsCorrect : undefined;
      onMarkBlockCompleted(activeBlock.id, activeBlock.plannedMinutes, qTotal, qCorrect);
      
      // Start 5-min break
      setIsBreakActive(true);
      setBreakSecondsLeft(300);
    }
  };

  // Toggle Timer Play / Pause
  const handleToggleTimerBtn = () => {
    if (timerMode === 'cycle') {
      setIsRunningInternal(prev => !prev);
    } else {
      if (onToggleTimer) onToggleTimer();
      else setIsRunningInternal(prev => !prev);
    }
  };

  // Reset Timer
  const handleResetTimerBtn = () => {
    if (timerMode === 'cycle' && activeBlock) {
      setSecondsLeft(activeBlock.plannedMinutes * 60);
      setIsRunningInternal(false);
    } else {
      setManualCountUpSecs(0);
      if (onResetTimer) onResetTimer();
    }
  };

  // Extend Block (+10 min)
  const handleExtend = () => {
    if (timerMode === 'cycle' && activeBlock) {
      setSecondsLeft(prev => prev + 600);
      setTotalPlannedSecs(prev => prev + 600);
      if (onExtendBlockTime) onExtendBlockTime(activeBlock.id, 10);
    } else {
      setManualCountUpSecs(prev => prev + 600);
    }
  };

  // Skip Block
  const handleSkip = () => {
    if (activeBlock && onSkipBlock) {
      onSkipBlock(activeBlock.id);
    }
    if (dailyCycle && currentBlockIdx + 1 < dailyCycle.blocks.length) {
      const nextIdx = currentBlockIdx + 1;
      setCurrentBlockIdx(nextIdx);
      if (onSelectBlockIndex) onSelectBlockIndex(nextIdx);
    }
  };

  // Save / Complete Session
  const handleSaveSession = () => {
    const elapsedMinutes = timerMode === 'cycle'
      ? Math.max(1, Math.round((totalPlannedSecs - secondsLeft) / 60))
      : Math.max(1, Math.round(manualCountUpSecs / 60));

    const hasQuestions = typeof questionsTotal === 'number' && questionsTotal > 0;

    // 1. Log Study Session
    if (timerMode === 'cycle' && activeBlock && onMarkBlockCompleted) {
      const qTotal = typeof questionsTotal === 'number' ? questionsTotal : undefined;
      const qCorrect = typeof questionsCorrect === 'number' ? questionsCorrect : undefined;
      onMarkBlockCompleted(activeBlock.id, elapsedMinutes, qTotal, qCorrect);
    } else if (onLogStudySession) {
      onLogStudySession(
        selectedSubjectId,
        sessionTopic || 'Sessão de Estudos Concentrados',
        elapsedMinutes,
        sessionMode
      );
    }

    // 2. Save External Questions if any
    if (hasQuestions) {
      const qTotal = typeof questionsTotal === 'number' ? questionsTotal : 0;
      const qCorrect = typeof questionsCorrect === 'number' ? Math.min(questionsCorrect, qTotal) : 0;
      const qWrong = Math.max(0, qTotal - qCorrect);
      const accRate = qTotal > 0 ? Math.round((qCorrect / qTotal) * 100) : 0;

      const newQLog: QuestionLogEntry = {
        id: `q-log-${Date.now()}`,
        subjectId: selectedSubjectId,
        topic: sessionTopic || 'Exercícios do Caderno / Livro',
        date: new Date().toISOString().split('T')[0],
        totalQuestions: qTotal,
        correctAnswers: qCorrect,
        wrongAnswers: qWrong,
        accuracyRate: accRate,
        source: questionsSource,
        notes: timerMode === 'cycle' ? 'Concluído no Modo Ciclo de Estudos' : 'Lançado no diário de estudo manual.',
        createdAt: new Date().toISOString()
      };

      const existingLogsStr = localStorage.getItem('estudei_questions_log_entries');
      let existingLogs: QuestionLogEntry[] = [];
      if (existingLogsStr) {
        try { existingLogs = JSON.parse(existingLogsStr); } catch (e) {}
      }
      localStorage.setItem('estudei_questions_log_entries', JSON.stringify([newQLog, ...existingLogs]));
    }

    // Reset inputs
    setQuestionsTotal('');
    setQuestionsCorrect('');
    setShowQuestionsAccordion(false);
    handleResetTimerBtn();

    // Advance to break or next block
    if (timerMode === 'cycle' && dailyCycle) {
      if (currentBlockIdx + 1 < dailyCycle.blocks.length) {
        setIsBreakActive(true);
        setBreakSecondsLeft(300);
      } else {
        alert('🎉 Parabéns! Você concluiu todos os blocos do Ciclo de Hoje!');
        if (onCloseModal) onCloseModal();
      }
    } else {
      alert('Estudo registrado com sucesso' + (hasQuestions ? ' e questões contabilizadas!' : '!'));
      if (onCloseModal) onCloseModal();
    }
  };

  // Formatters
  const formatTime = (totalSecs: number) => {
    const m = Math.floor(totalSecs / 60);
    const s = totalSecs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const totalMinutesToday = studyLogs
    .filter(l => l.date === new Date().toISOString().split('T')[0])
    .reduce((acc, curr) => acc + curr.minutes, 0);

  const hoursToday = Math.floor(totalMinutesToday / 60);
  const minsToday = totalMinutesToday % 60;
  const formattedTodayTime = hoursToday > 0 ? `${hoursToday}h ${minsToday}min` : `${minsToday}min`;

  const selectedSubject = (subjects || []).find(s => s.id === selectedSubjectId) || (subjects || [])[0];

  const currentIsRunning = timerMode === 'cycle' ? isRunningInternal : isTimerRunning;

  // Block type badge formatting helper
  const getBlockTypeBadge = (type?: string) => {
    switch (type) {
      case 'revision':
      case 'review':
        return { label: 'Revisão Espaçada', bg: 'bg-purple-500/20 text-purple-300 border-purple-500/30' };
      case 'questions':
      case 'quiz':
      case 'exercises':
        return { label: 'Treino de Questões', bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' };
      case 'teacher_diary':
        return { label: 'Fixação da Aula', bg: 'bg-amber-500/20 text-amber-300 border-amber-500/30' };
      default:
        return { label: 'Estudo Teórico', bg: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' };
    }
  };

  const blockBadge = activeBlock ? getBlockTypeBadge(activeBlock.type) : null;

  return (
    <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl p-5 sm:p-7 shadow-2xl max-w-xl mx-auto space-y-6">
      
      {/* Top Header Row with Back Button & Mode Toggle */}
      <div className="space-y-4 pb-4 border-b border-slate-800">
        <div className="flex items-center justify-between">
          {onCloseModal ? (
            <button
              type="button"
              onClick={onCloseModal}
              className="flex items-center space-x-1.5 text-xs font-bold text-slate-300 hover:text-white transition bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar</span>
            </button>
          ) : (
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-indigo-400" />
              <span className="text-sm font-bold text-white font-display">Cronômetro de Estudo</span>
            </div>
          )}

          {/* Integrated Segment Control for Mode Toggle */}
          <div className="bg-slate-950 p-1 rounded-xl flex items-center space-x-1 border border-slate-800 text-xs font-bold">
            <button
              type="button"
              onClick={() => setTimerMode('manual')}
              className={`py-1 px-3 rounded-lg transition flex items-center space-x-1 ${
                timerMode === 'manual'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>○ Modo Manual</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setTimerMode('cycle');
                if (hasActiveCycle && !activeBlock) {
                  setCurrentBlockIdx(0);
                }
              }}
              className={`py-1 px-3 rounded-lg transition flex items-center space-x-1 ${
                timerMode === 'cycle'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>
                ● Modo Ciclo {dailyCycle ? `(${dailyCycle.blocks.filter(b => b.completed).length + 1}/${dailyCycle.blocks.length})` : ''}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Break Overlay Banner if active */}
      {isBreakActive && (
        <div className="bg-gradient-to-r from-indigo-950 via-purple-950 to-indigo-950 text-white p-4 rounded-2xl border border-indigo-500/40 space-y-2 text-center animate-in fade-in">
          <div className="flex items-center justify-center space-x-2 text-amber-400 font-bold text-xs">
            <Coffee className="w-4 h-4" />
            <span>Pausa Estratégica em Andamento</span>
          </div>
          <div className="text-3xl font-mono font-extrabold text-amber-300">
            {formatTime(breakSecondsLeft)}
          </div>
          <button
            onClick={() => setIsBreakActive(false)}
            className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition shadow-md"
          >
            Próximo Bloco do Ciclo ➔
          </button>
        </div>
      )}

      {/* Cronômetro Proporcional e Centralizado */}
      <div className="text-center py-5 bg-slate-950/80 rounded-2xl text-white shadow-inner border border-slate-800/80 space-y-2">
        <span className="font-mono text-4xl sm:text-5xl font-bold tracking-wider text-white block">
          {timerMode === 'cycle' ? formatTime(secondsLeft) : formatTime(manualCountUpSecs)}
        </span>

        <p className="text-xs text-indigo-300/80 font-medium">
          {timerMode === 'cycle' && activeBlock
            ? `restantes (planejado: ${activeBlock.plannedMinutes} min)`
            : (currentIsRunning ? '🟢 Cronômetro em execução...' : '⏱️ Tempo de estudo decorrido')}
        </p>
      </div>

      {/* Card da Matéria Atual (Em Modo Ciclo: Informação Limpa | Em Modo Manual: Campos Editáveis) */}
      {timerMode === 'cycle' && activeBlock ? (
        <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-lg">📚</span>
              <span className="text-base font-extrabold text-white font-display">
                {activeBlock.subjectName}
              </span>
            </div>
            {blockBadge && (
              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${blockBadge.bg}`}>
                {blockBadge.label}
              </span>
            )}
          </div>

          {activeBlock.topicName && (
            <p className="text-xs text-slate-300 font-medium pl-7">
              {activeBlock.topicName}
            </p>
          )}

          <div className="flex items-center space-x-2 pt-1 pl-7">
            <span className="text-[10px] bg-indigo-500/20 text-indigo-300 font-extrabold px-2 py-0.5 rounded-md border border-indigo-500/30">
              ● Foco Escola
            </span>
            <span className="text-[10px] text-slate-400">
              Bloco {currentBlockIdx + 1} de {dailyCycle?.blocks.length || 1}
            </span>
          </div>
        </div>
      ) : timerMode === 'manual' ? (
        <div className="space-y-3 bg-slate-950/60 border border-slate-800 rounded-2xl p-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Matéria Estudada
            </label>
            <select
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:ring-2 focus:ring-indigo-500"
            >
              {subjects.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Tópico / Assunto
            </label>
            <input
              type="text"
              value={sessionTopic}
              onChange={(e) => setSessionTopic(e.target.value)}
              placeholder="Ex: Resolução de Lista de Exercícios de Geometria"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Modo de Estudo
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSessionMode('escola')}
                className={`py-1.5 px-3 rounded-xl text-xs font-bold transition ${
                  sessionMode === 'escola' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                Foco Escola
              </button>
              <button
                type="button"
                onClick={() => setSessionMode('enem')}
                className={`py-1.5 px-3 rounded-xl text-xs font-bold transition ${
                  sessionMode === 'enem' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                Foco ENEM
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Indicador Sutil de Tempo Acumulado do Dia */}
      <div className="p-3 bg-slate-950/40 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2 text-slate-300">
          <Flame className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Tempo Acumulado Hoje:</span>
        </div>
        <span className="font-mono font-extrabold text-amber-300">
          📊 Hoje: {formattedTodayTime} acumulados
        </span>
      </div>

      {/* Botões de Controle Proporcionais (Mesmo Tamanho, Mesma Linha) */}
      <div className="grid grid-cols-3 gap-3">
        <button
          type="button"
          onClick={handleToggleTimerBtn}
          className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-extrabold transition shadow-lg flex items-center justify-center space-x-1.5 ${
            currentIsRunning
              ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
          }`}
        >
          {currentIsRunning ? (
            <>
              <Pause className="w-4 h-4" />
              <span>Pausar</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>{timerMode === 'cycle' ? '▶ Iniciar' : '▶ Iniciar'}</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleExtend}
          className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-xl text-xs sm:text-sm font-extrabold transition border border-slate-700 flex items-center justify-center space-x-1"
          title="Adicionar 10 minutos"
        >
          <Plus className="w-4 h-4" />
          <span>+10m</span>
        </button>

        <button
          type="button"
          onClick={timerMode === 'cycle' ? handleSkip : handleResetTimerBtn}
          className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs sm:text-sm font-extrabold transition border border-slate-700 flex items-center justify-center space-x-1"
          title={timerMode === 'cycle' ? 'Pular este bloco' : 'Zerar Cronômetro'}
        >
          {timerMode === 'cycle' ? (
            <>
              <FastForward className="w-4 h-4" />
              <span>Pular</span>
            </>
          ) : (
            <>
              <RotateCcw className="w-4 h-4" />
              <span>Zerar</span>
            </>
          )}
        </button>
      </div>

      {/* Lançamento de Questões do Caderno/Livro (Expansível / Recoplado) */}
      <div className="space-y-2 pt-1 border-t border-slate-800/80">
        <button
          type="button"
          onClick={() => setShowQuestionsAccordion(!showQuestionsAccordion)}
          className="w-full py-2.5 px-3 text-xs font-bold text-indigo-300 hover:text-white transition flex items-center justify-between border border-dashed border-indigo-500/30 rounded-xl bg-indigo-950/30"
        >
          <div className="flex items-center space-x-2">
            <Target className="w-4 h-4 text-amber-400" />
            <span>+ Lançar Questões do Caderno / Livro</span>
          </div>
          {showQuestionsAccordion ? (
            <ChevronUp className="w-4 h-4 text-indigo-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-indigo-400" />
          )}
        </button>

        {showQuestionsAccordion && (
          <div className="p-3.5 bg-slate-950/80 border border-indigo-500/30 rounded-xl space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-300">
                🎯 Questões Feitas no Caderno / Livro
              </span>
              <span className="text-[10px] text-slate-400">Contabiliza no Diário</span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[10px] font-bold text-slate-300 mb-1">
                  Total de Questões
                </label>
                <input
                  type="number"
                  min="1"
                  placeholder="Ex: 15"
                  value={questionsTotal}
                  onChange={(e) => setQuestionsTotal(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-bold text-white focus:ring-2 focus:ring-amber-400"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-300 mb-1">
                  Nº de Acertos
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="Ex: 12"
                  value={questionsCorrect}
                  onChange={(e) => setQuestionsCorrect(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-bold text-emerald-400 focus:ring-2 focus:ring-emerald-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-300 mb-1">
                Origem do Exercício
              </label>
              <select
                value={questionsSource}
                onChange={(e) => setQuestionsSource(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-white"
              >
                <option value="Caderno / Livro Didático">Caderno / Livro Didático</option>
                <option value="Lista de Exercícios">Lista de Exercícios</option>
                <option value="Plataforma / QConcursos">Plataforma / QConcursos</option>
                <option value="Simulado da Escola">Simulado da Escola</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Botão de Ação Primária */}
      <button
        type="button"
        onClick={handleSaveSession}
        className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-black text-sm rounded-xl shadow-lg shadow-emerald-500/20 transition flex items-center justify-center space-x-2"
      >
        <CheckCircle2 className="w-5 h-5 text-slate-950" />
        <span>{timerMode === 'cycle' ? '✓ Concluir Bloco e Registrar' : '✓ Registrar Estudo'}</span>
      </button>

    </div>
  );
};
