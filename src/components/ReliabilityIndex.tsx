import React, { useState, useEffect } from 'react';
import { ShieldCheck, AlertTriangle, CheckCircle2, XCircle, Clock, Sparkles, TrendingUp, HelpCircle } from 'lucide-react';
import { ManualQuestionLog, ValidationSettings } from '../types';
import { useAuth } from '../contexts/AuthContext';

export const ReliabilityIndex: React.FC = () => {
  const { logFamilyAudit } = useAuth();
  const [logs, setLogs] = useState<ManualQuestionLog[]>([]);
  const [quizAccuracy, setQuizAccuracy] = useState<number>(68); // System quiz average
  const [manualAccuracy, setManualAccuracy] = useState<number>(0);
  const [reliabilityScore, setReliabilityScore] = useState<number>(95);
  const [rejectionCount, setRejectionCount] = useState<number>(0);

  const STORAGE_KEY = 'estudei_questions_log_entries';

  const loadLogs = () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed: ManualQuestionLog[] = JSON.parse(saved);
        setLogs(parsed);

        // Calculate stats
        const totalManualQuestions = parsed.reduce((acc, curr) => acc + (curr.totalQuestions || 0), 0);
        const totalManualCorrect = parsed.reduce((acc, curr) => acc + (curr.correctAnswers || 0), 0);
        const avgManualAcc = totalManualQuestions > 0 ? Math.round((totalManualCorrect / totalManualQuestions) * 100) : 0;
        setManualAccuracy(avgManualAcc);

        const rejected = parsed.filter(l => l.validationStatus === 'rejected').length;
        setRejectionCount(rejected);

        // System quiz average calculation (simulated from quiz sessions)
        const savedQuizzes = localStorage.getItem('estudei_quiz_history');
        let sysAcc = 68;
        if (savedQuizzes) {
          try {
            const quizzes = JSON.parse(savedQuizzes);
            if (quizzes.length > 0) {
              const totalQ = quizzes.reduce((a: number, c: any) => a + (c.totalQuestions || 0), 0);
              const totalC = quizzes.reduce((a: number, c: any) => a + (c.score || 0), 0);
              if (totalQ > 0) sysAcc = Math.round((totalC / totalQ) * 100);
            }
          } catch (e) { }
        }
        setQuizAccuracy(sysAcc);

        // Reliability Index Formula
        // Base 100
        // Penalty if rejection count > 0 (-10 per rejection)
        // Penalty if disparity between manual and quiz accuracy > 20%
        let score = 100;
        if (avgManualAcc > sysAcc + 20) {
          score -= Math.min(30, (avgManualAcc - sysAcc));
        }
        score -= (rejected * 10);
        setReliabilityScore(Math.max(30, Math.min(100, Math.round(score))));
      } catch (e) { }
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const handleApprove = (logId: string) => {
    const updated = logs.map(l => {
      if (l.id === logId) {
        return { ...l, validationStatus: 'approved' as const, validationMode: 'parent_approved' as const };
      }
      return l;
    });
    setLogs(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    logFamilyAudit('acordo_atualizado', 'Aprovou um lançamento manual de questões do estudante.');
    loadLogs();
  };

  const handleReject = (logId: string) => {
    const updated = logs.map(l => {
      if (l.id === logId) {
        return { ...l, validationStatus: 'rejected' as const };
      }
      return l;
    });
    setLogs(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    logFamilyAudit('acordo_atualizado', 'Rejeitou um lançamento manual de questões por inconsistência.');
    loadLogs();
  };

  const pendingLogs = logs.filter(l => l.validationStatus === 'pending');
  const isDiscrepant = manualAccuracy > quizAccuracy + 20 && logs.length >= 2;

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-amber-100 rounded-2xl text-amber-800">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900 font-display">
              Índice de Confiabilidade do Estudante
            </h3>
            <p className="text-xs text-slate-500">
              Auditabilidade e coerência entre os estudos em ambiente digital vs. papel/caderno
            </p>
          </div>
        </div>

        {/* Index Badge */}
        <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 px-4 py-2 rounded-2xl">
          <div className="text-right">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Confiabilidade</span>
            <span className={`text-base font-black font-mono ${
              reliabilityScore >= 80 ? 'text-emerald-600' : reliabilityScore >= 60 ? 'text-amber-600' : 'text-rose-600'
            }`}>
              {reliabilityScore}% — {reliabilityScore >= 80 ? 'Excelente' : reliabilityScore >= 60 ? 'Atenção' : 'Auditável'}
            </span>
          </div>
        </div>
      </div>

      {/* Discrepancy Alert Banner */}
      {isDiscrepant && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start space-x-3 text-amber-900">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-xs font-bold">
              Desempenho manual acima do esperado em relação aos quizzes validados pelo sistema.
            </p>
            <p className="text-xs text-amber-800">
              A taxa de acerto manual informada ({manualAccuracy}%) é significativamente superior à média dos quizzes do aplicativo ({quizAccuracy}%). Sugerimos ativar a <strong>Validação por IA Gemini Vision</strong> para fotos das páginas.
            </p>
          </div>
        </div>
      )}

      {/* Accuracy Comparison Chart Bar */}
      <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
        <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center justify-between">
          <span>Comparativo: Quizzes Digitais vs. Lançamentos Manuais</span>
          <span className="text-[11px] font-normal text-slate-500 font-mono">Consistência de Média</span>
        </h4>

        <div className="space-y-3">
          {/* System Quizzes */}
          <div>
            <div className="flex justify-between text-xs font-bold mb-1">
              <span className="text-indigo-900 flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                <span>Quizzes do Sistema (100% Validados)</span>
              </span>
              <span className="font-mono text-indigo-700">{quizAccuracy}% acertos</span>
            </div>
            <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
              <div
                className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, quizAccuracy)}%` }}
              />
            </div>
          </div>

          {/* Manual Logs */}
          <div>
            <div className="flex justify-between text-xs font-bold mb-1">
              <span className="text-amber-900 flex items-center space-x-1">
                <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
                <span>Lançamentos Manuais (Caderno/Livro)</span>
              </span>
              <span className="font-mono text-amber-800">{manualAccuracy}% acertos</span>
            </div>
            <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isDiscrepant ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min(100, manualAccuracy)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Pending Approval Submissions Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center space-x-2">
            <Clock className="w-4 h-4 text-amber-500" />
            <span>Lançamentos Pendentes de Confirmação ({pendingLogs.length})</span>
          </h4>
        </div>

        {pendingLogs.length === 0 ? (
          <div className="p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-center text-xs text-slate-500">
            Nenhum lançamento manual pendente de validação no momento.
          </div>
        ) : (
          <div className="space-y-3">
            {pendingLogs.map(log => (
              <div
                key={log.id}
                className="p-4 bg-amber-50/50 border border-amber-200 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-black text-amber-900 bg-amber-200/60 px-2.5 py-0.5 rounded-md">
                      {log.topic || 'Exercícios de Fixação'}
                    </span>
                    <span className="text-[11px] font-bold text-slate-500">
                      {log.date} • Fonte: {log.source || 'Caderno'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 font-semibold">
                    Declarado: <strong className="text-slate-900">{log.totalQuestions} questões</strong> —{' '}
                    <strong className="text-emerald-700">{log.correctAnswers} acertos</strong> ({log.accuracyRate}%)
                  </p>

                  {log.aiFeedback && (
                    <div className="text-[11px] bg-indigo-50 border border-indigo-100 p-2 rounded-xl text-indigo-900 flex items-center space-x-1.5 mt-1">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      <span><strong>Parecer da IA:</strong> {log.aiFeedback}</span>
                    </div>
                  )}

                  {log.notes && (
                    <p className="text-[11px] text-slate-500 italic">
                      "{log.notes}"
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={() => handleReject(log.id)}
                    className="px-3 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-800 text-xs font-bold rounded-xl transition flex items-center space-x-1"
                  >
                    <XCircle className="w-4 h-4 text-rose-600" />
                    <span>Rejeitar</span>
                  </button>

                  <button
                    onClick={() => handleApprove(log.id)}
                    className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-xl transition flex items-center space-x-1 shadow-xs"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Aprovar Lançamento</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Honest Conversation Advice Banner */}
      {rejectionCount >= 3 && (
        <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-2xl flex items-start space-x-3 text-indigo-950">
          <HelpCircle className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <span className="font-extrabold block">Orientação Pedagógica Empática</span>
            <p>
              Percebemos que houve mais de 3 registros com inconsistências recentes. Que tal conversar acolhedoramente com o estudante?
              O objetivo não é punir, mas lembrá-lo de que errar faz parte do aprendizado e o aplicativo existe para ajudar a evoluir com honestidade acadêmica.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
