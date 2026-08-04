import React, { useState, useEffect } from 'react';
import { Subject, Evaluation, StudentTaskItem } from '../types';
import { Sparkles, X, Calendar, ArrowRight, CheckCircle2 } from 'lucide-react';

interface UpcomingExamsAlertModalProps {
  evaluations: Evaluation[];
  subjects: Subject[];
  studentTasks: StudentTaskItem[];
  onNavigateToEvaluations: () => void;
}

export const UpcomingExamsAlertModal: React.FC<UpcomingExamsAlertModalProps> = ({
  evaluations,
  subjects,
  studentTasks,
  onNavigateToEvaluations
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const todayStr = new Date().toISOString().split('T')[0];

  // Find upcoming evaluations without scores that are in the future or today (within 14 days)
  const upcomingEvals = evaluations
    .filter(e => e.scoreObtained === null && e.date >= todayStr)
    .sort((a, b) => a.date.localeCompare(b.date));

  useEffect(() => {
    // Show modal once if there are upcoming exams
    const hasSeenAlert = sessionStorage.getItem('has_seen_upcoming_exams_alert');
    if (upcomingEvals.length > 0 && !hasSeenAlert) {
      setIsOpen(true);
      sessionStorage.setItem('has_seen_upcoming_exams_alert', 'true');
    }
  }, [upcomingEvals.length]);

  if (!isOpen || upcomingEvals.length === 0) return null;

  const nextEval = upcomingEvals[0];
  const subject = subjects.find(s => s.id === nextEval.subjectId);

  // Days remaining calculation
  const examDate = new Date(nextEval.date + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffDays = Math.max(0, Math.ceil((examDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));

  const linkedTasks = studentTasks.filter(t => t.linkedEvaluationId === nextEval.id);
  const completedCount = linkedTasks.filter(t => t.completed).length;

  return (
    <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full border border-indigo-200 shadow-2xl overflow-hidden relative">
        {/* Decorative Top Glow */}
        <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 p-6 text-white space-y-2 relative">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-2">
            <span className="p-2 bg-indigo-500/20 rounded-xl border border-indigo-400/30 text-amber-300">
              <Sparkles className="w-5 h-5" />
            </span>
            <span className="text-xs font-black uppercase tracking-wider text-amber-300 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
              Alerta de Prova Próxima
            </span>
          </div>

          <h3 className="text-xl font-bold font-display">
            {diffDays === 0 ? '🚨 Você tem prova HOJE!' : diffDays === 1 ? '⏳ Você tem prova AMANHÃ!' : `Você tem prova em ${diffDays} dias!`}
          </h3>

          <p className="text-xs text-slate-300">
            O plano de revisão pré-prova está ativo para garantir seu desempenho máximo.
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          <div className="p-4 bg-indigo-50/70 rounded-2xl border border-indigo-100 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-indigo-900 bg-indigo-200/80 px-2.5 py-0.5 rounded-lg">
                {subject?.name || 'Disciplina'}
              </span>
              <span className="text-xs font-bold text-slate-600">
                Data: {new Date(nextEval.date + 'T00:00:00').toLocaleDateString('pt-BR')}
              </span>
            </div>

            <h4 className="text-base font-bold text-slate-900 font-display">{nextEval.name}</h4>

            {linkedTasks.length > 0 && (
              <div className="pt-2 border-t border-indigo-100/80 flex items-center justify-between text-xs font-bold text-indigo-950">
                <span>Progresso das Revisões:</span>
                <span className="text-indigo-700">{completedCount} de {linkedTasks.length} tarefas revisadas</span>
              </div>
            )}
          </div>

          {upcomingEvals.length > 1 && (
            <p className="text-xs text-slate-500 text-center font-medium">
              + {upcomingEvals.length - 1} outras avaliações cadastradas na sua agenda.
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex items-center space-x-3 pt-2">
            <button
              onClick={() => setIsOpen(false)}
              className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-2xl transition text-center"
            >
              Continuar para o Dashboard
            </button>

            <button
              onClick={() => {
                setIsOpen(false);
                onNavigateToEvaluations();
              }}
              className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold rounded-2xl shadow-md transition flex items-center justify-center space-x-1.5"
            >
              <span>Ver Plano Completo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
