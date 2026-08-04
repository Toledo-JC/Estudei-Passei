import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Clock,
  Play,
  Pause,
  FastForward,
  Plus,
  CheckCircle2,
  BookOpen,
  Sparkles,
  RotateCcw,
  BookMarked,
  Layers,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useStudyTimer, StudyMode } from '../contexts/StudyTimerContext';

export const StudyScreen: React.FC = () => {
  const navigate = useNavigate();
  const {
    status,
    mode,
    blocks,
    currentBlockIndex,
    currentBlock,
    timeElapsed,
    totalTime,
    formattedTime,
    startSession,
    pauseSession,
    resumeSession,
    addTime,
    skipBlock,
    finishBlock,
    finishSession,
    resetSession
  } = useStudyTimer();

  const [selectedMode, setSelectedMode] = useState<StudyMode>('ciclo');
  const [isQuestionsFormOpen, setIsQuestionsFormOpen] = useState(false);
  const [questionsCount, setQuestionsCount] = useState<number>(10);
  const [correctCount, setCorrectCount] = useState<number>(8);

  const isRunning = status === 'running';

  // Handler para iniciar estudo
  const handleStart = () => {
    startSession(selectedMode);
  };

  // 1. ESTADO IDLE / VAZIO
  if (status === 'idle') {
    return (
      <div className="max-w-3xl mx-auto py-6 px-4 space-y-6">
        {/* Header com ícone de voltar */}
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 transition shadow-2xs"
            title="Voltar ao Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">Estudo</h1>
            <p className="text-xs text-slate-500">Configure e inicie sua sessão</p>
          </div>
        </div>

        {/* Seleção do Modo e Iniciar */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 text-xs font-bold border border-indigo-200 dark:border-indigo-800">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Sessão de Estudo Focada</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Escolha como deseja estudar agora
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl">
            <button
              type="button"
              onClick={() => setSelectedMode('ciclo')}
              className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-bold text-xs transition ${
                selectedMode === 'ciclo'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Modo Ciclo Intercalado</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedMode('manual')}
              className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-bold text-xs transition ${
                selectedMode === 'manual'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Modo Livre (Manual)</span>
            </button>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
            {selectedMode === 'ciclo' ? (
              <p>
                <strong>Modo Ciclo:</strong> Blocos intercalados de matérias com tempo delimitado para máxima absorção e memorização.
              </p>
            ) : (
              <p>
                <strong>Modo Livre:</strong> Cronômetro contínuo para estudar uma matéria no seu ritmo.
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={handleStart}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-sm rounded-xl shadow-md shadow-indigo-500/20 flex items-center justify-center space-x-2 transition cursor-pointer"
          >
            <Play className="w-5 h-5 fill-current text-amber-300" />
            <span>Iniciar Estudo Agora</span>
          </button>
        </div>
      </div>
    );
  }

  // 2. ESTADO FINISHED
  if (status === 'finished') {
    return (
      <div className="max-w-md mx-auto py-12 px-4 text-center space-y-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-sm space-y-4"
        >
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto text-3xl shadow-inner">
            🎉
          </div>

          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            Parabéns! Sessão Concluída!
          </h2>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            Seu tempo de estudo foi gravado. Excelente dedicação e foco!
          </p>

          <div className="pt-2 space-y-2">
            <button
              type="button"
              onClick={resetSession}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center space-x-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Iniciar Nova Sessão</span>
            </button>

            <button
              type="button"
              onClick={() => {
                resetSession();
                navigate('/dashboard');
              }}
              className="w-full py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl hover:bg-slate-200 transition"
            >
              Voltar ao Dashboard
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // 3. ESTADO ATIVO (RUNNING OU PAUSED) – UNIFICADO
  const progressPercentage = mode === 'ciclo' && totalTime > 0
    ? Math.min(100, Math.round((timeElapsed / totalTime) * 100))
    : 100;

  return (
    <div className="max-w-2xl mx-auto py-6 px-4 space-y-6">
      {/* Header com botão voltar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 transition shadow-2xs"
            title="Voltar ao Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white">Estudo em Andamento</h1>
            <p className="text-xs text-slate-500">Mantenha seu foco total</p>
          </div>
        </div>

        <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 uppercase tracking-wider">
          {mode === 'ciclo' ? 'Modo Ciclo' : 'Modo Manual'}
        </span>
      </div>

      {/* CRONÔMETRO CENTRAL (REQUISITO: text-5xl font-mono font-bold tabular-nums - NUNCA MAIOR QUE text-5xl) */}
      <div className="bg-slate-950 rounded-2xl p-8 text-center text-white border border-slate-800 shadow-md space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <span className={`w-2.5 h-2.5 rounded-full ${isRunning ? 'bg-emerald-500 animate-ping' : 'bg-amber-500'}`} />
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            {isRunning ? 'Em Execução' : 'Pausado'}
          </span>
        </div>

        {/* RELÓGIO CENTRAL */}
        <div className="text-5xl font-mono font-bold tabular-nums tracking-wider text-emerald-400">
          {formattedTime}
        </div>

        {/* BOTÕES DE CONTROLE DO CRONÔMETRO */}
        <div className="flex items-center justify-center space-x-3 pt-2">
          {isRunning ? (
            <button
              type="button"
              onClick={pauseSession}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center space-x-2"
            >
              <Pause className="w-4 h-4" />
              <span>Pausar</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={resumeSession}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center space-x-2"
            >
              <Play className="w-4 h-4" />
              <span>Retomar</span>
            </button>
          )}

          {mode === 'manual' && (
            <button
              type="button"
              onClick={() => addTime(10)}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl transition flex items-center space-x-1.5"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              <span>+10 min</span>
            </button>
          )}

          {mode === 'ciclo' && (
            <button
              type="button"
              onClick={skipBlock}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl transition flex items-center space-x-1.5"
            >
              <FastForward className="w-4 h-4" />
              <span>Pular Bloco</span>
            </button>
          )}

          <button
            type="button"
            onClick={finishSession}
            className="px-4 py-2.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-bold text-xs rounded-xl border border-rose-500/30 transition"
          >
            Finalizar
          </button>
        </div>
      </div>

      {/* ABAIXO DO CRONÔMETRO: CARD DA MATÉRIA ATUAL */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex items-center justify-between">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                {currentBlock?.subject || 'Estudo Livre'}
              </h2>
              {currentBlock?.type && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 uppercase">
                  {currentBlock.type}
                </span>
              )}
            </div>
            {currentBlock?.topic && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {currentBlock.topic}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ABAIXO DO CARD: INFORMAÇÕES DO CICLO E BARRA DE PROGRESSO */}
      {mode === 'ciclo' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
            <span>Andamento do Ciclo</span>
            <span>Bloco {currentBlockIndex + 1} de {blocks.length || 1}</span>
          </div>

          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          <p className="text-[11px] text-slate-400 font-medium text-right">
            {progressPercentage}% concluído
          </p>
        </div>
      )}

      {/* BOTÃO PRIMÁRIO "CONCLUIR BLOCO E REGISTRAR" */}
      <button
        type="button"
        onClick={finishBlock}
        className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-sm rounded-xl shadow-md transition flex items-center justify-center space-x-2 cursor-pointer"
      >
        <CheckCircle2 className="w-5 h-5 text-amber-300" />
        <span>Concluir Bloco e Registrar</span>
      </button>

      {/* BOTÃO EXPANSÍVEL: "+ LANÇAR QUESTÕES DO CADERNO/LIVRO" */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-3">
        <button
          type="button"
          onClick={() => setIsQuestionsFormOpen(!isQuestionsFormOpen)}
          className="w-full flex items-center justify-between text-left font-bold text-xs text-slate-800 dark:text-slate-200"
        >
          <div className="flex items-center space-x-2">
            <BookMarked className="w-4 h-4 text-indigo-500" />
            <span>+ Lançar Questões do Caderno/Livro</span>
          </div>
          {isQuestionsFormOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>

        {isQuestionsFormOpen && (
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">
                Total de Questões Feitas
              </label>
              <input
                type="number"
                value={questionsCount}
                onChange={(e) => setQuestionsCount(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">
                Acertos
              </label>
              <input
                type="number"
                value={correctCount}
                onChange={(e) => setCorrectCount(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold text-slate-900 dark:text-white"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyScreen;
