import React, { useState } from 'react';
import { Subject, Evaluation, SchoolConfig } from '../types';
import { TooltipHelp } from './TooltipHelp';
import { Calculator, Plus, Trash2, TrendingUp, AlertTriangle, CheckCircle2, ShieldAlert, Edit2, Zap } from 'lucide-react';

interface GradeManagerSectionProps {
  subjects: Subject[];
  evaluations: Evaluation[];
  schoolConfig: SchoolConfig;
  onUpdateEvaluations: (evaluations: Evaluation[]) => void;
}

export const GradeManagerSection: React.FC<GradeManagerSectionProps> = ({
  subjects,
  evaluations,
  schoolConfig,
  onUpdateEvaluations
}) => {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(subjects[0]?.id || 'matematica');
  const [selectedPeriod, setSelectedPeriod] = useState<number>(2); // 2º Bimestre como padrão ativo

  // New evaluation form modal / inline state
  const [newEvalName, setNewEvalName] = useState('');
  const [newEvalCategory, setNewEvalCategory] = useState(schoolConfig.evalCategories[0]?.name || 'Provas Principais (A1)');
  const [newEvalMaxScore, setNewEvalMaxScore] = useState(10.0);
  const [newEvalWeight, setNewEvalWeight] = useState(0.7);
  const [newEvalScore, setNewEvalScore] = useState<string>('');

  const selectedSubject = subjects.find(s => s.id === selectedSubjectId) || subjects[0];

  // Filter evaluations for current selected subject and period
  const currentEvals = evaluations.filter(
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
  // Equation: (totalWeightObtained + neededScore * remainingWeight) / (totalWeightLogged + remainingWeight) = passingScore
  let scoreNeededForPassing: number | null = null;
  if (remainingWeight > 0) {
    const targetTotalScore = schoolConfig.passingScore * (totalWeightLogged + remainingWeight);
    const scoreDiff = targetTotalScore - totalWeightObtained;
    scoreNeededForPassing = Math.max(0, parseFloat((scoreDiff / remainingWeight).toFixed(2)));
  }

  // Handle adding new evaluation
  const handleAddEvaluation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvalName.trim()) return;

    const newEval: Evaluation = {
      id: `eval-${Date.now()}`,
      subjectId: selectedSubjectId,
      periodIndex: selectedPeriod,
      name: newEvalName.trim(),
      categoryName: newEvalCategory,
      maxScore: newEvalMaxScore,
      weight: newEvalWeight,
      scoreObtained: newEvalScore !== '' ? parseFloat(newEvalScore) : null,
      date: new Date().toISOString().split('T')[0]
    };

    onUpdateEvaluations([...evaluations, newEval]);
    setNewEvalName('');
    setNewEvalScore('');
  };

  const handleUpdateScore = (evalId: string, scoreStr: string) => {
    const scoreVal = scoreStr === '' ? null : parseFloat(scoreStr);
    const updated = evaluations.map(e => e.id === evalId ? { ...e, scoreObtained: scoreVal } : e);
    onUpdateEvaluations(updated);
  };

  const handleDeleteEval = (evalId: string) => {
    onUpdateEvaluations(evaluations.filter(e => e.id !== evalId));
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-md flex flex-wrap items-center justify-between gap-4">
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
            <span>Gerenciador Avançado de Notas & Simulador Preditivo</span>
            <TooltipHelp
              title="Como funciona o Simulador Preditivo?"
              text="O sistema cruza suas notas atuais com os pesos cadastrados e calcula em tempo real a nota exata que você precisa tirar nas avaliações restantes para passar direto sem recuperação."
            />
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Mantenha o controle matemático absoluto do seu boletim em cada disciplina.
          </p>
        </div>

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

      {/* Main Grid: Subject List + Selected Subject Predictive Engine */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Subject Selector Cards */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center">
            <span>Selecione a Disciplina</span>
            <TooltipHelp text="Clique para ver o histórico detalhado e o simulador de aprovação da matéria." />
          </h3>

          <div className="space-y-2">
            {subjects.map((sub) => {
              const subEvals = evaluations.filter(e => e.subjectId === sub.id && e.periodIndex === selectedPeriod);
              const subObtained = subEvals.filter(e => e.scoreObtained !== null).reduce((a, c) => a + c.scoreObtained! * c.weight, 0);
              const subLoggedWeight = subEvals.filter(e => e.scoreObtained !== null).reduce((a, c) => a + c.weight, 0);
              const avg = subLoggedWeight > 0 ? (subObtained / subLoggedWeight) : null;
              const isPassing = avg !== null && avg >= schoolConfig.passingScore;
              const isSelected = sub.id === selectedSubjectId;

              return (
                <button
                  key={sub.id}
                  onClick={() => setSelectedSubjectId(sub.id)}
                  className={`w-full text-left p-3.5 rounded-xl border transition flex items-center justify-between ${
                    isSelected
                      ? 'bg-indigo-50 border-indigo-400 text-indigo-950 font-bold shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div>
                    <span className="text-xs font-bold block">{sub.name}</span>
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
          <div className={`p-5 rounded-2xl border transition shadow-sm ${
            currentWeightedAverage >= schoolConfig.passingScore
              ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950'
              : 'bg-amber-50/90 border-amber-300 text-amber-950'
          }`}>
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className={`p-2.5 rounded-xl text-white ${
                  currentWeightedAverage >= schoolConfig.passingScore ? 'bg-emerald-600' : 'bg-amber-600'
                }`}>
                  <Zap className="w-6 h-6" />
                </div>

                <div>
                  <span className="text-xs font-extrabold uppercase tracking-wider block opacity-80">
                    Simulador Preditivo do {selectedPeriod}º Bimestre — {selectedSubject.name}
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
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 font-display">
                Avaliações Cadastradas no {selectedPeriod}º Bimestre
              </h3>
              <span className="text-xs text-slate-500 font-medium">
                Peso total lançado: {Math.round(totalWeightLogged * 100)}%
              </span>
            </div>

            {currentEvals.length === 0 ? (
              <p className="text-xs text-slate-400 italic text-center py-6">
                Nenhuma avaliação cadastrada ainda para esta matéria neste bimestre. Cadastre abaixo!
              </p>
            ) : (
              <div className="space-y-3">
                {currentEvals.map((ev) => (
                  <div key={ev.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-slate-900">{ev.name}</span>
                        <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-md font-semibold">
                          {ev.categoryName}
                        </span>
                        <span className="text-[10px] text-indigo-700 font-bold bg-indigo-50 px-2 py-0.5 rounded-md">
                          Peso {Math.round(ev.weight * 100)}%
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 block mt-0.5">
                        Valor Máximo: {ev.maxScore.toFixed(1)} pts
                      </span>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1.5">
                        <span className="text-xs font-semibold text-slate-600">Nota:</span>
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max={ev.maxScore}
                          value={ev.scoreObtained !== null ? ev.scoreObtained : ''}
                          onChange={(e) => handleUpdateScore(ev.id, e.target.value)}
                          placeholder="Pendente"
                          className="w-24 bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs font-bold text-indigo-900 focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteEval(ev.id)}
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition"
                        title="Excluir prova"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Form to Add Evaluation */}
            <form onSubmit={handleAddEvaluation} className="pt-4 border-t border-slate-200 space-y-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center">
                <span>Cadastrar Nova Avaliação</span>
                <TooltipHelp text="Informe o nome da prova/trabalho, categoria, peso e a nota se já tiver saído o resultado." />
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <input
                  type="text"
                  value={newEvalName}
                  onChange={(e) => setNewEvalName(e.target.value)}
                  placeholder="Nome (ex: Prova A1 de Funções)"
                  className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500"
                />

                <select
                  value={newEvalCategory}
                  onChange={(e) => setNewEvalCategory(e.target.value)}
                  className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500"
                >
                  {schoolConfig.evalCategories.map(c => (
                    <option key={c.id} value={c.name}>{c.name} ({c.weightPercent}%)</option>
                  ))}
                </select>

                <input
                  type="number"
                  step="0.1"
                  value={newEvalScore}
                  onChange={(e) => setNewEvalScore(e.target.value)}
                  placeholder="Nota Obtida (Opções: Vazia)"
                  className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500"
                />

                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2 rounded-xl shadow transition flex items-center justify-center space-x-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Adicionar Prova</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
