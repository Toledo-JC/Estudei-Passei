import React, { useState } from 'react';
import { Subject, Evaluation, SchoolConfig, StudentTaskItem, SpacedRevision } from '../types';
import { processEvaluationResult } from '../lib/evaluations';
import { X, Award, AlertTriangle, CheckCircle2, ShieldAlert, HeartHandshake, Save, HelpCircle, Sparkles } from 'lucide-react';

interface EvaluationResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  evaluation: Evaluation | null;
  subjects: Subject[];
  schoolConfig: SchoolConfig;
  studentTasks: StudentTaskItem[];
  spacedRevisions: SpacedRevision[];
  onSaveResult: (
    updatedEvaluation: Evaluation,
    updatedSubjects: Subject[],
    updatedTasks: StudentTaskItem[],
    updatedRevisions: SpacedRevision[],
    recoveryNote?: string
  ) => void;
}

export const EvaluationResultModal: React.FC<EvaluationResultModalProps> = ({
  isOpen,
  onClose,
  evaluation,
  subjects,
  schoolConfig,
  studentTasks,
  spacedRevisions,
  onSaveResult
}) => {
  if (!isOpen || !evaluation) return null;

  const subject = subjects.find(s => s.id === evaluation.subjectId);

  const [scoreVal, setScoreVal] = useState<string>(
    evaluation.scoreObtained !== null ? String(evaluation.scoreObtained) : ''
  );
  const [reflectionText, setReflectionText] = useState<string>(evaluation.reflectionText || '');

  const maxScore = evaluation.maxScore || 10.0;
  const parsedScore = scoreVal !== '' ? parseFloat(scoreVal) : null;

  const passingThreshold = (schoolConfig.passingScore / (schoolConfig.maxScorePerPeriod || 10.0)) * maxScore;
  const isPassing = parsedScore !== null && parsedScore >= passingThreshold;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (parsedScore === null || isNaN(parsedScore)) return;

    const result = processEvaluationResult(
      evaluation,
      parsedScore,
      reflectionText,
      schoolConfig,
      subjects,
      studentTasks,
      spacedRevisions
    );

    onSaveResult(
      result.updatedEvaluation,
      result.updatedSubjects,
      result.updatedTasks,
      result.updatedRevisions,
      result.recoveryNoteForParents
    );

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className={`p-6 text-white flex items-center justify-between transition-colors ${
          parsedScore === null
            ? 'bg-slate-900'
            : isPassing
            ? 'bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900'
            : 'bg-gradient-to-r from-rose-900 via-amber-950 to-slate-900'
        }`}>
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-2xl border ${
              isPassing ? 'bg-emerald-500/20 border-emerald-400/30 text-emerald-300' : 'bg-amber-500/20 border-amber-400/30 text-amber-300'
            }`}>
              {isPassing ? <Award className="w-6 h-6" /> : <ShieldAlert className="w-6 h-6" />}
            </div>

            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-300 block">
                Lançamento de Resultado • {subject?.name}
              </span>
              <h3 className="text-base font-bold font-display">{evaluation.name}</h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Score Input Card */}
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-3">
            <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider">
              Nota Obtida na Prova
            </label>

            <div className="flex items-center justify-center space-x-2">
              <input
                type="number"
                step="0.1"
                min="0"
                max={maxScore}
                value={scoreVal}
                onChange={(e) => setScoreVal(e.target.value)}
                placeholder="0.0"
                required
                autoFocus
                className="w-32 bg-white border-2 border-indigo-400 rounded-2xl px-3 py-2 text-2xl font-black text-indigo-950 text-center focus:ring-4 focus:ring-indigo-200 shadow-inner"
              />
              <span className="text-sm font-bold text-slate-500">/ {maxScore.toFixed(1)} pts</span>
            </div>

            <p className="text-[11px] text-slate-500">
              Nota de corte para aprovação direta: <strong className="text-slate-800">{passingThreshold.toFixed(1)} pts</strong>
            </p>

            {/* Live Status Indicator */}
            {parsedScore !== null && (
              <div className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center space-x-2 animate-in fade-in ${
                isPassing
                  ? 'bg-emerald-100 border-emerald-300 text-emerald-900'
                  : 'bg-rose-100 border-rose-300 text-rose-900'
              }`}>
                {isPassing ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>🎉 Parabéns! Nota acima do corte de aprovação direta.</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4 text-rose-700 shrink-0" />
                    <span>🚨 Nota abaixo da média. O Modo Recuperação Sem Punição será ativado.</span>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Reflection Text Field ("O que errei mais?") */}
          <div>
            <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center space-x-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
              <span>O que errei mais? / Principais dúvidas (Opcional)</span>
            </label>
            <textarea
              value={reflectionText}
              onChange={(e) => setReflectionText(e.target.value)}
              placeholder="Ex: Confundi os sinais de sinais na fórmula de Bhaskara e errei a questão 4 de óptica..."
              rows={3}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Recovery Explanation Banner if score < threshold */}
          {parsedScore !== null && !isPassing && (
            <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl space-y-2">
              <div className="flex items-center space-x-2 text-amber-900 font-bold text-xs uppercase tracking-wider">
                <HeartHandshake className="w-4 h-4 text-amber-600" />
                <span>O que acontece ao salvar esta nota?</span>
              </div>
              <ul className="text-xs text-slate-700 space-y-1 list-disc pl-4">
                <li>Os tópicos desta prova receberão a sinalização de reforço <strong>"Precisa de Recuperação"</strong>.</li>
                <li>Tarefas de revisão e simulados de recuperação serão gerados na sua agenda.</li>
                <li>Notificação de apoio pedagógico sem cunho punitivo será disponibilizada ao responsável.</li>
              </ul>
            </div>
          )}

          {/* Submit Actions */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={parsedScore === null || isNaN(parsedScore)}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold rounded-xl shadow-md transition flex items-center space-x-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>Confirmar Lançamento</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
