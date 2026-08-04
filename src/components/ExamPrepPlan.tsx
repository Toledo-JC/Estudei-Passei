import React, { useState } from 'react';
import { Subject, Evaluation, StudentTaskItem } from '../types';
import { Sparkles, Calendar, CheckCircle2, Clock, BookOpen, ChevronRight, HelpCircle, ArrowUpRight } from 'lucide-react';

interface ExamPrepPlanProps {
  evaluations: Evaluation[];
  subjects: Subject[];
  studentTasks: StudentTaskItem[];
  onToggleTaskCompleted: (taskId: string) => void;
  onOpenEvaluationModal: (evaluation?: Evaluation) => void;
  onNavigateToQuiz?: (subjectId: string, topicName: string) => void;
}

export const ExamPrepPlan: React.FC<ExamPrepPlanProps> = ({
  evaluations,
  subjects,
  studentTasks,
  onToggleTaskCompleted,
  onOpenEvaluationModal,
  onNavigateToQuiz
}) => {
  const todayStr = new Date().toISOString().split('T')[0];

  // Filter pending upcoming evaluations that have a date >= today
  const upcomingEvals = evaluations
    .filter(e => e.scoreObtained === null && e.date >= todayStr)
    .sort((a, b) => a.date.localeCompare(b.date));

  if (upcomingEvals.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="p-2.5 bg-indigo-100 text-indigo-700 rounded-2xl">
            <Sparkles className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 font-display">
              Planos de Revisão Inteligente Pré-Prova
            </h3>
            <p className="text-[11px] text-slate-500">
              Acompanhe a contagem regressiva e os tópicos agendados para as suas próximas avaliações.
            </p>
          </div>
        </div>

        <button
          onClick={() => onOpenEvaluationModal()}
          className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-xl transition flex items-center space-x-1"
        >
          <span>+ Cadastrar Prova</span>
        </button>
      </div>

      {/* List of upcoming evaluations */}
      <div className="space-y-4">
        {upcomingEvals.map((ev) => {
          const subject = subjects.find(s => s.id === ev.subjectId);
          const subjectName = subject?.name || 'Disciplina';

          // Days remaining calculation
          const examDate = new Date(ev.date + 'T00:00:00');
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const diffDays = Math.ceil((examDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

          // Find tasks linked to this evaluation
          const linkedTasks = studentTasks.filter(t => t.linkedEvaluationId === ev.id);
          const completedCount = linkedTasks.filter(t => t.completed).length;
          const totalTasksCount = linkedTasks.length;
          const progressPercent = totalTasksCount > 0 ? Math.round((completedCount / totalTasksCount) * 100) : 0;

          // Covered topics count
          const coveredTopicIds = ev.coveredTopics || [];

          return (
            <div
              key={ev.id}
              className="p-5 bg-gradient-to-r from-slate-50 via-indigo-50/40 to-slate-50 rounded-2xl border border-indigo-100 space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-black px-2.5 py-0.5 rounded-lg bg-indigo-600 text-white">
                      {subjectName}
                    </span>
                    <span className="text-xs text-slate-500 font-semibold">
                      {ev.periodIndex}º Período • Peso {Math.round(ev.weight * 100)}%
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-slate-900 font-display mt-1">{ev.name}</h4>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <div className="text-right">
                    <span className="text-xs font-black text-indigo-900 block">
                      {diffDays === 0 ? '🚨 É HOJE!' : diffDays === 1 ? '⏳ É AMANHÃ!' : `em ${diffDays} dias`}
                    </span>
                    <span className="text-[10px] text-slate-500 font-bold">
                      Data: {new Date(ev.date + 'T00:00:00').toLocaleDateString('pt-BR')}
                    </span>
                  </div>

                  <button
                    onClick={() => onOpenEvaluationModal(ev)}
                    className="p-2 text-slate-400 hover:text-indigo-600 rounded-lg transition"
                    title="Editar avaliação"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              {totalTasksCount > 0 && (
                <div className="space-y-1 bg-white p-3 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span>Progresso de Revisão Pré-Prova</span>
                    <span className="text-indigo-700 font-extrabold">{completedCount} de {totalTasksCount} tarefas ({progressPercent}%)</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-500 rounded-full"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Tasks Checklist */}
              {linkedTasks.length > 0 && (
                <div className="space-y-2 pt-1">
                  <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                    Cronograma de Revisão Pré-Prova ({linkedTasks.length})
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {linkedTasks.slice(0, 4).map((task) => (
                      <button
                        key={task.id}
                        onClick={() => onToggleTaskCompleted(task.id)}
                        className={`p-2.5 rounded-xl border text-left transition flex items-start space-x-2.5 ${
                          task.completed
                            ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950 line-through opacity-80'
                            : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-100'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded flex items-center justify-center shrink-0 mt-0.5 ${
                          task.completed ? 'bg-emerald-600 text-white' : 'border border-slate-300 bg-slate-50'
                        }`}>
                          {task.completed && <CheckCircle2 className="w-3 h-3 stroke-[3]" />}
                        </div>

                        <div className="flex-1 min-w-0">
                          <span className="text-xs font-semibold block truncate">{task.title}</span>
                          <span className="text-[10px] text-slate-500 block">
                            Até {new Date(task.date + 'T00:00:00').toLocaleDateString('pt-BR')}
                          </span>
                        </div>
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
  );
};
