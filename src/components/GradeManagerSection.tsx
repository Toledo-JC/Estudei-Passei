import React, { useState } from 'react';
import { Subject, Evaluation, SchoolConfig, StudentTaskItem, SpacedRevision } from '../types';
import { TooltipHelp } from './TooltipHelp';
import { EvaluationFormModal } from './EvaluationFormModal';
import { EvaluationResultModal } from './EvaluationResultModal';
import { ExamPrepPlan } from './ExamPrepPlan';
import { RecoveryBanner } from './RecoveryBanner';
import { processEvaluationResult } from '../lib/evaluations';
import { Calculator, Plus, Trash2, Zap, Sparkles, Award, ShieldAlert, CheckCircle2, Layers, Edit3 } from 'lucide-react';

interface GradeManagerSectionProps {
  subjects: Subject[];
  evaluations: Evaluation[];
  schoolConfig: SchoolConfig;
  studentTasks?: StudentTaskItem[];
  spacedRevisions?: SpacedRevision[];
  onUpdateEvaluations: (evaluations: Evaluation[]) => void;
  onUpdateSubjects?: (subjects: Subject[]) => void;
  onUpdateStudentTasks?: (tasks: StudentTaskItem[]) => void;
  onUpdateSpacedRevisions?: (revisions: SpacedRevision[]) => void;
  onNavigateTab?: (tab: string) => void;
}

export const GradeManagerSection: React.FC<GradeManagerSectionProps> = ({
  subjects,
  evaluations,
  schoolConfig,
  studentTasks = [],
  spacedRevisions = [],
  onUpdateEvaluations,
  onUpdateSubjects,
  onUpdateStudentTasks,
  onUpdateSpacedRevisions,
  onNavigateTab
}) => {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>((subjects || [])[0]?.id || 'matematica');
  const [selectedPeriod, setSelectedPeriod] = useState<number>(2); // 2º Bimestre como padrão ativo

  // Modals state
  const [isEvalModalOpen, setIsEvalModalOpen] = useState(false);
  const [selectedEvalForEdit, setSelectedEvalForEdit] = useState<Evaluation | null>(null);

  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [selectedEvalForResult, setSelectedEvalForResult] = useState<Evaluation | null>(null);

  const selectedSubject = (subjects || []).find(s => s.id === selectedSubjectId) || (subjects || [])[0];

  // Filter evaluations for current selected subject and period
  const currentEvals = (evaluations || []).filter(
    e => e.subjectId === selectedSubjectId && e.periodIndex === selectedPeriod
  );

  // Math calculation for current period
  const totalWeightObtained = currentEvals
    .filter(e => e.scoreObtained !== null)
    .reduce((acc, curr) => acc + (curr.scoreObtained! * curr.weight), 0);

  const totalWeightLogged = currentEvals
    .filter(e => e.scoreObtained !== null)
    .reduce((acc, curr) => acc + curr.weight, 0);

  const pendingEvals = currentEvals.filter(e => e.scoreObtained === null);
  const remainingWeight = pendingEvals.reduce((acc, curr) => acc + curr.weight, 0);

  const currentWeightedAverage = totalWeightLogged > 0 ? (totalWeightObtained / totalWeightLogged) : 0;

  // Real-time predictive score needed
  let scoreNeededForPassing: number | null = null;
  if (remainingWeight > 0) {
    const targetTotalScore = schoolConfig.passingScore * (totalWeightLogged + remainingWeight);
    const scoreDiff = targetTotalScore - totalWeightObtained;
    scoreNeededForPassing = Math.max(0, parseFloat((scoreDiff / remainingWeight).toFixed(2)));
  }

  // Handle save from EvaluationFormModal (Create / Edit)
  const handleSaveEvaluation = (
    evalObj: Evaluation,
    newTasks?: StudentTaskItem[],
    newRevisions?: SpacedRevision[]
  ) => {
    const existingIdx = evaluations.findIndex(e => e.id === evalObj.id);
    let updatedEvals: Evaluation[];
    if (existingIdx >= 0) {
      updatedEvals = evaluations.map(e => e.id === evalObj.id ? evalObj : e);
    } else {
      updatedEvals = [...evaluations, evalObj];
    }

    onUpdateEvaluations(updatedEvals);

    if (newTasks && onUpdateStudentTasks) {
      onUpdateStudentTasks(newTasks);
    }

    if (newRevisions && onUpdateSpacedRevisions) {
      onUpdateSpacedRevisions(newRevisions);
    }
  };

  // Handle save from EvaluationResultModal (Score Result)
  const handleSaveScoreResult = (
    updatedEval: Evaluation,
    updatedSubjects: Subject[],
    updatedTasks: StudentTaskItem[],
    updatedRevisions: SpacedRevision[]
  ) => {
    const updatedEvals = evaluations.map(e => e.id === updatedEval.id ? updatedEval : e);
    onUpdateEvaluations(updatedEvals);

    if (onUpdateSubjects) {
      onUpdateSubjects(updatedSubjects);
    }
    if (onUpdateStudentTasks) {
      onUpdateStudentTasks(updatedTasks);
    }
    if (onUpdateSpacedRevisions) {
      onUpdateSpacedRevisions(updatedRevisions);
    }
  };

  const handleDeleteEval = (evalId: string) => {
    onUpdateEvaluations(evaluations.filter(e => e.id !== evalId));
  };

  const handleClearRecoveryFlag = (subjectId: string, topicId: string) => {
    if (!onUpdateSubjects) return;
    const updatedSubjects = subjects.map(s => {
      if (s.id === subjectId) {
        return {
          ...s,
          topics: s.topics.map(t => t.id === topicId ? { ...t, needsRecovery: false, recoveryReason: undefined } : t)
        };
      }
      return s;
    });
    onUpdateSubjects(updatedSubjects);
  };

  return (
    <div className="space-y-6">
      {/* Recovery Banner if any topic needs recovery */}
      <RecoveryBanner
        subjects={subjects}
        onOpenTutorForTopic={(subjectName, topicName) => {
          if (onNavigateTab) onNavigateTab('ai-hub');
        }}
        onOpenResultModalForRecovery={(subId) => {
          setSelectedSubjectId(subId);
          setIsEvalModalOpen(true);
        }}
        onClearRecoveryFlag={handleClearRecoveryFlag}
      />

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 text-white shadow-md flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="bg-indigo-500/30 text-indigo-300 text-xs font-bold px-2.5 py-1 rounded-lg border border-indigo-500/40">
              Média de Corte: {schoolConfig.passingScore.toFixed(1)} Pts
            </span>
            <span className="bg-amber-500/20 text-amber-300 text-xs font-bold px-2.5 py-1 rounded-lg border border-amber-500/30">
              Estrutura: {schoolConfig.periodType === 'bimestre' ? '4 Bimestres' : '3 Trimestres'}
            </span>
          </div>

          <h2 className="text-xl font-bold font-display mt-2 flex items-center">
            <span>Avaliações Inteligentes & Simulador Preditivo</span>
            <TooltipHelp
              title="Como funcionam as Avaliações Inteligentes?"
              text="Ao cadastrar uma prova, o sistema vincula os tópicos do currículo cobrados, calcula em tempo real a nota necessária e gera automaticamente um plano de revisão pré-prova."
            />
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Vincule os tópicos cobrados do currículo e acompanhe o plano de revisão pré-prova.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => {
              setSelectedEvalForEdit(null);
              setIsEvalModalOpen(true);
            }}
            className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black rounded-xl shadow-md transition flex items-center space-x-2 shrink-0"
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            <span>+ Cadastrar Prova Inteligente</span>
          </button>

          {/* Period Selector */}
          <div className="flex bg-slate-800/80 p-1 rounded-xl border border-slate-700">
            {[1, 2, 3, 4].slice(0, schoolConfig.periodType === 'bimestre' ? 4 : 3).map((p) => (
              <button
                key={p}
                onClick={() => setSelectedPeriod(p)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  selectedPeriod === p
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {p}º {schoolConfig.periodType === 'bimestre' ? 'Bimestre' : 'Trimestre'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Pre-Exam Revision Plans Section */}
      <ExamPrepPlan
        evaluations={evaluations}
        subjects={subjects}
        studentTasks={studentTasks}
        onToggleTaskCompleted={(taskId) => {
          if (onUpdateStudentTasks) {
            const updated = studentTasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t);
            onUpdateStudentTasks(updated);
          }
        }}
        onOpenEvaluationModal={(ev) => {
          setSelectedEvalForEdit(ev || null);
          setIsEvalModalOpen(true);
        }}
      />

      {/* Main Grid: Subject List + Selected Subject Predictive Engine */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Subject Selector Cards */}
        <div className="bg-white rounded-3xl border border-slate-200 p-4 shadow-sm space-y-3">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center">
            <span>Selecione a Disciplina</span>
            <TooltipHelp text="Clique para ver o histórico detalhado e o simulador de aprovação da matéria." />
          </h3>

          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {subjects.filter(s => s.enabled !== false && !s.parentSubjectId).map((sub) => {
              const subEvals = evaluations.filter(e => e.subjectId === sub.id && e.periodIndex === selectedPeriod);
              const subObtained = subEvals.filter(e => e.scoreObtained !== null).reduce((a, c) => a + c.scoreObtained! * c.weight, 0);
              const subLoggedWeight = subEvals.filter(e => e.scoreObtained !== null).reduce((a, c) => a + c.weight, 0);
              const avg = subLoggedWeight > 0 ? (subObtained / subLoggedWeight) : null;
              const isPassing = avg !== null && avg >= schoolConfig.passingScore;
              const isSelected = sub.id === selectedSubjectId;

              // Check if any topic in this subject needs recovery
              const hasRecovery = (sub.topics || []).some(t => t.needsRecovery);

              return (
                <button
                  key={sub.id}
                  onClick={() => setSelectedSubjectId(sub.id)}
                  className={`w-full text-left p-3.5 rounded-2xl border transition flex items-center justify-between ${
                    isSelected
                      ? 'bg-indigo-50 border-indigo-400 text-indigo-950 font-bold shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <span className="text-xs font-bold block">{sub.name}</span>
                      {hasRecovery && (
                        <span className="text-[9px] bg-rose-500 text-white font-black px-1.5 py-0.2 rounded">
                          Atenção
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500 font-normal">
                      {subEvals.length} avaliações cadastradas
                    </span>
                  </div>

                  <div className="text-right">
                    {avg !== null ? (
                      <span className={`text-xs font-extrabold px-2.5 py-1 rounded-lg ${
                        isPassing
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {avg.toFixed(1)} pts
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400 font-medium">Sem nota</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Predictive Simulator & Detailed Evaluation Entry */}
        <div className="lg:col-span-2 space-y-6">
          {/* SIMULADOR PREDITIVO BANNER */}
          <div className={`p-5 rounded-3xl border transition shadow-sm ${
            currentWeightedAverage >= schoolConfig.passingScore
              ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950'
              : 'bg-amber-50/90 border-amber-300 text-amber-950'
          }`}>
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className={`p-2.5 rounded-2xl text-white ${
                  currentWeightedAverage >= schoolConfig.passingScore ? 'bg-emerald-600' : 'bg-amber-600'
                }`}>
                  <Zap className="w-6 h-6" />
                </div>

                <div>
                  <span className="text-xs font-extrabold uppercase tracking-wider block opacity-80">
                    Simulador Preditivo do {selectedPeriod}º Bimestre — {selectedSubject?.name || ''}
                  </span>

                  <h3 className="text-lg font-bold font-display mt-0.5">
                    Média Atual Projetada: {currentWeightedAverage.toFixed(1)} / {schoolConfig.maxScorePerPeriod.toFixed(1)}
                  </h3>

                  {scoreNeededForPassing !== null ? (
                    <p className="text-xs mt-2 font-semibold bg-white/80 p-2.5 rounded-xl border border-slate-200 text-slate-900 inline-block">
                      🎯 <strong>Previsão de Aprovação Direta:</strong> Para fechar a média {schoolConfig.passingScore.toFixed(1)} e passar sem precisar de recuperação neste bimestre, você precisa tirar pelo menos <span className="text-indigo-700 font-extrabold underline">{scoreNeededForPassing.toFixed(1)}</span> na próxima avaliação!
                    </p>
                  ) : (
                    <p className="text-xs mt-2 font-medium">
                      {currentWeightedAverage >= schoolConfig.passingScore
                        ? '🎉 Parabéns! Você já atingiu a nota de corte para aprovação direta neste período.'
                        : 'Lançando avaliações adicionais, o simulador calculará sua meta.'}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Evaluations List */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900 font-display">
                  Avaliações Cadastradas no {selectedPeriod}º Bimestre ({selectedSubject?.name})
                </h3>
                <span className="text-xs text-slate-500 font-medium">
                  Peso total lançado: {Math.round(totalWeightLogged * 100)}%
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedEvalForEdit(null);
                  setIsEvalModalOpen(true);
                }}
                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-sm transition flex items-center space-x-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Nova Prova com Tópicos</span>
              </button>
            </div>

            {currentEvals.length === 0 ? (
              <div className="text-center py-8 px-4 bg-slate-50 border border-dashed border-slate-300 rounded-2xl space-y-2">
                <p className="text-xs text-slate-500">
                  Nenhuma avaliação cadastrada ainda para <strong>{selectedSubject?.name}</strong> neste bimestre.
                </p>
                <button
                  onClick={() => {
                    setSelectedEvalForEdit(null);
                    setIsEvalModalOpen(true);
                  }}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition inline-flex items-center space-x-1.5"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Cadastrar Prova & Vincular Tópicos</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {currentEvals.map((ev) => {
                  const topicCount = (ev.coveredTopics || []).length;

                  return (
                    <div
                      key={ev.id}
                      className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-indigo-300 transition"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-bold text-slate-900">{ev.name}</span>
                          <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-md font-semibold">
                            {ev.categoryName}
                          </span>
                          <span className="text-[10px] text-indigo-700 font-bold bg-indigo-50 px-2 py-0.5 rounded-md">
                            Peso {Math.round(ev.weight * 100)}%
                          </span>
                        </div>

                        <div className="flex items-center space-x-3 text-[11px] text-slate-500">
                          <span>Data: {new Date(ev.date + 'T00:00:00').toLocaleDateString('pt-BR')}</span>
                          <span>•</span>
                          <span>{topicCount} {topicCount === 1 ? 'tópico vinculado' : 'tópicos vinculados'}</span>
                        </div>

                        {ev.reflectionText && (
                          <p className="text-[11px] text-slate-600 bg-white p-2 rounded-lg border border-slate-200 italic mt-1">
                            💬 Reflexão: "{ev.reflectionText}"
                          </p>
                        )}
                      </div>

                      <div className="flex items-center space-x-3 shrink-0">
                        <button
                          onClick={() => {
                            setSelectedEvalForResult(ev);
                            setIsResultModalOpen(true);
                          }}
                          className={`px-3 py-1.5 rounded-xl font-bold text-xs transition border flex items-center space-x-1.5 ${
                            ev.scoreObtained !== null
                              ? 'bg-white border-slate-300 text-indigo-900 hover:bg-slate-100'
                              : 'bg-amber-400 hover:bg-amber-300 text-slate-950 border-amber-500 shadow-sm'
                          }`}
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>
                            {ev.scoreObtained !== null ? `Nota: ${ev.scoreObtained.toFixed(1)} pts` : 'Lançar Nota'}
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteEval(ev.id)}
                          className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition"
                          title="Excluir prova"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Evaluation Form Modal */}
      <EvaluationFormModal
        isOpen={isEvalModalOpen}
        onClose={() => {
          setIsEvalModalOpen(false);
          setSelectedEvalForEdit(null);
        }}
        subjects={subjects}
        schoolConfig={schoolConfig}
        initialEvaluation={selectedEvalForEdit}
        existingTasks={studentTasks}
        existingRevisions={spacedRevisions}
        onSaveEvaluation={handleSaveEvaluation}
      />

      {/* Evaluation Result Modal */}
      <EvaluationResultModal
        isOpen={isResultModalOpen}
        onClose={() => {
          setIsResultModalOpen(false);
          setSelectedEvalForResult(null);
        }}
        evaluation={selectedEvalForResult}
        subjects={subjects}
        schoolConfig={schoolConfig}
        studentTasks={studentTasks}
        spacedRevisions={spacedRevisions}
        onSaveResult={handleSaveScoreResult}
      />
    </div>
  );
};
