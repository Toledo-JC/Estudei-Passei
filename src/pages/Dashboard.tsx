import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Sparkles,
  Flame,
  Clock,
  Star,
  Play,
  CheckCircle2,
  Calendar,
  BookOpen,
  ArrowRight,
  Layers,
  Award,
  Target,
  Brain,
  RefreshCw,
  Trophy,
  FileText,
  Plus
} from 'lucide-react';
import { useStudyTimer } from '../contexts/StudyTimerContext';
import { useAuth } from '../contexts/AuthContext';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const { startSession } = useStudyTimer();

  const [tasks, setTasks] = useState([
    { id: 't1', title: 'Resolver 15 exercícios de Função Quadrática', subject: 'Matemática', dueDate: 'Hoje', completed: false },
    { id: 't2', title: 'Leitura do Capítulo 4 do Livro de História', subject: 'História', dueDate: 'Amanhã', completed: false },
    { id: 't3', title: 'Redação: O impacto da IA na educação moderna', subject: 'Português', dueDate: '2 dias', completed: true }
  ]);

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const handleStartCycle = () => {
    startSession('ciclo');
    navigate('/study');
  };

  const studentName = userProfile?.displayName?.split(' ')[0] || 'Estudante';

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* 1. WELCOME BANNER (PRIMEIRO ELEMENTO) */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden border border-indigo-700/40"
      >
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-200 border border-indigo-400/30 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Painel de Desempenho</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Olá, {studentName}! 👋
            </h1>
            <p className="text-sm text-indigo-200/90 max-w-xl">
              Pronto para evoluir nos seus estudos hoje? Mantenha sua constância e alcance suas metas!
            </p>
          </div>

          {/* Estatísticas no Banner */}
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-3 sm:p-4 shrink-0">
            <div className="flex items-center space-x-2 px-3 py-2 bg-amber-500/20 border border-amber-400/30 rounded-xl">
              <Flame className="w-5 h-5 text-amber-400 fill-amber-400" />
              <div>
                <p className="text-[10px] text-amber-200 uppercase font-bold">Ofensiva</p>
                <p className="text-sm font-black text-amber-300">5 Dias</p>
              </div>
            </div>

            <div className="flex items-center space-x-2 px-3 py-2 bg-emerald-500/20 border border-emerald-400/30 rounded-xl">
              <Clock className="w-5 h-5 text-emerald-400" />
              <div>
                <p className="text-[10px] text-emerald-200 uppercase font-bold">Total Mês</p>
                <p className="text-sm font-black text-emerald-300">14.5h</p>
              </div>
            </div>

            <div className="flex items-center space-x-2 px-3 py-2 bg-indigo-500/20 border border-indigo-400/30 rounded-xl">
              <Star className="w-5 h-5 text-amber-300 fill-amber-300" />
              <div>
                <p className="text-[10px] text-indigo-200 uppercase font-bold">Pontos</p>
                <p className="text-sm font-black text-white">320 pts</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 2. CARD DE RESUMO DO DIA */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Meta Diária</p>
            <p className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">1h 40m / 2h 30m</p>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold mt-1">66% concluído</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Blocos de Hoje</p>
            <p className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">2 de 3 concluidos</p>
            <p className="text-[11px] text-slate-500 mt-1">1 bloco pendente</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Qualidade do Foco</p>
            <p className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">92% Excelente</p>
            <p className="text-[11px] text-amber-600 dark:text-amber-400 font-bold mt-1">+5% em relação a ontem</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 3. CARD "CICLO DE HOJE" (COM BOTÃO "INICIAR CICLO") */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-md shadow-indigo-500/20">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                Ciclo de Hoje
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Sequência adaptativa planejada para máxima retenção de conteúdo.
              </p>
            </div>
          </div>

          <span className="text-xs font-bold px-3 py-1 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-full border border-indigo-200 dark:border-indigo-800">
            3 Blocos Planejados
          </span>
        </div>

        {/* Lista de Blocos do Ciclo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300">
                Bloco 1 • 50 min
              </span>
              <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase">ENEM</span>
            </div>
            <p className="text-sm font-bold text-slate-900 dark:text-white">Matemática</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">Equações do 2º Grau & Funções</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300">
                Bloco 2 • 50 min
              </span>
              <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase">Escola</span>
            </div>
            <p className="text-sm font-bold text-slate-900 dark:text-white">Língua Portuguesa</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">Interpretação de Texto & Coesão</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300">
                Bloco 3 • 40 min
              </span>
              <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase">ENEM</span>
            </div>
            <p className="text-sm font-bold text-slate-900 dark:text-white">Física</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">Cinemática Escalar</p>
          </div>
        </div>

        {/* Único Botão "Iniciar Ciclo" */}
        <button
          type="button"
          onClick={handleStartCycle}
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-sm rounded-xl shadow-md shadow-indigo-500/20 flex items-center justify-center space-x-2 transition cursor-pointer"
        >
          <Play className="w-5 h-5 fill-current text-amber-300" />
          <span>Iniciar Ciclo de Estudo</span>
        </button>
      </div>

      {/* 4. PRÓXIMAS TAREFAS */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              Próximas Tarefas & Trabalhos
            </h3>
          </div>
          <button
            type="button"
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center space-x-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Adicionar Tarefa</span>
          </button>
        </div>

        <div className="space-y-2">
          {tasks.map(t => (
            <div
              key={t.id}
              onClick={() => toggleTask(t.id)}
              className={`flex items-center justify-between p-3.5 rounded-xl border transition cursor-pointer ${
                t.completed
                  ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-60'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-300'
              }`}
            >
              <div className="flex items-center space-x-3 min-w-0">
                <div className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                  t.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 dark:border-slate-600'
                }`}>
                  {t.completed && <CheckCircle2 className="w-4 h-4" />}
                </div>
                <div className="min-w-0">
                  <p className={`text-xs font-bold ${t.completed ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                    {t.title}
                  </p>
                  <p className="text-[11px] text-slate-500">{t.subject}</p>
                </div>
              </div>

              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                t.dueDate === 'Hoje'
                  ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}>
                {t.dueDate}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 5. ATALHOS RÁPIDOS */}
      <div className="space-y-3">
        <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
          Atalhos Rápidos
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <button
            type="button"
            onClick={() => navigate('/study')}
            className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-indigo-500 transition text-center space-y-2 group shadow-xs"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
              <Clock className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-slate-900 dark:text-white">Estudar Agora</p>
          </button>

          <button
            type="button"
            onClick={() => navigate('/planner')}
            className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-indigo-500 transition text-center space-y-2 group shadow-xs"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-slate-900 dark:text-white">Meu Plano</p>
          </button>

          <button
            type="button"
            onClick={() => navigate('/simulator')}
            className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-indigo-500 transition text-center space-y-2 group shadow-xs"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
              <Brain className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-slate-900 dark:text-white">Simulador</p>
          </button>

          <button
            type="button"
            onClick={() => navigate('/reviews')}
            className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-indigo-500 transition text-center space-y-2 group shadow-xs"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
              <RefreshCw className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-slate-900 dark:text-white">Revisões</p>
          </button>

          <button
            type="button"
            onClick={() => navigate('/ranking')}
            className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-indigo-500 transition text-center space-y-2 group shadow-xs"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
              <Trophy className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-slate-900 dark:text-white">Ranking</p>
          </button>

          <button
            type="button"
            onClick={() => navigate('/manual')}
            className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-indigo-500 transition text-center space-y-2 group shadow-xs"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-slate-900 dark:text-white">Manual</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
