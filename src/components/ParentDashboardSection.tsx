import React from 'react';
import { Subject, Evaluation, StudySessionLog, ParentGuardSettings, SchoolConfig } from '../types';
import { TooltipHelp } from './TooltipHelp';
import { ShieldCheck, AlertTriangle, CheckCircle2, Flame, Clock, Award, Users, Lock, Sparkles, BookOpen, Key, Copy } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface ParentDashboardSectionProps {
  subjects: Subject[];
  evaluations: Evaluation[];
  studyLogs: StudySessionLog[];
  parentSettings: ParentGuardSettings;
  schoolConfig: SchoolConfig;
}

export const ParentDashboardSection: React.FC<ParentDashboardSectionProps> = ({
  subjects,
  evaluations,
  studyLogs,
  parentSettings,
  schoolConfig
}) => {
  const { familyGroup, familyStudents, activeStudentUid, setActiveStudentUid } = useAuth();
  const [copied, setCopied] = React.useState(false);

  // Total Net Study Hours
  const totalMinutesAllTime = studyLogs.reduce((acc, curr) => acc + curr.minutes, 0);
  const totalHours = (totalMinutesAllTime / 60).toFixed(1);

  // Predictive Alert Check: Subjects below passing threshold
  const atRiskSubjects = subjects.filter((sub) => {
    const subEvals = evaluations.filter(e => e.subjectId === sub.id && e.periodIndex === 2);
    const subObtained = subEvals.filter(e => e.scoreObtained !== null).reduce((a, c) => a + c.scoreObtained! * c.weight, 0);
    const subLoggedWeight = subEvals.filter(e => e.scoreObtained !== null).reduce((a, c) => a + c.weight, 0);
    const avg = subLoggedWeight > 0 ? (subObtained / subLoggedWeight) : null;
    return avg !== null && avg < schoolConfig.passingScore;
  });

  const activeStudentProfile = familyStudents.find(s => s.uid === activeStudentUid);
  const currentStudentName = activeStudentProfile?.name || parentSettings.studentName;
  const currentStudentYear = activeStudentProfile?.studentYear || parentSettings.studentYear;

  const handleCopyCode = () => {
    if (familyGroup?.familyCode) {
      navigator.clipboard.writeText(familyGroup.familyCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner Edição Família & Multi-Filho Selector */}
      <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 rounded-2xl p-6 text-slate-950 shadow-md space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-slate-950/10 rounded-2xl">
              <ShieldCheck className="w-8 h-8 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl font-display">Visão dos Pais — Painel da Família</span>
                <span className="bg-slate-950 text-amber-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                  Isolamento LGPD
                </span>
              </div>
              <p className="text-xs font-semibold opacity-90 mt-0.5">
                Acompanhamento em tempo real dos estudos, boletim e tarefas dos filhos.
              </p>
            </div>
          </div>

          <div className="bg-slate-950 text-white p-3.5 rounded-2xl text-right shrink-0">
            <span className="text-[10px] text-amber-400 font-bold uppercase block">Aluno Ativo Visualizado</span>
            <span className="text-sm font-extrabold">{currentStudentName} ({currentStudentYear})</span>
          </div>
        </div>

        {/* Multi-Student Tab Selector & Family Code Bar */}
        <div className="bg-slate-950/20 backdrop-blur-md p-3 rounded-xl border border-slate-950/20 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto">
            <span className="text-xs font-extrabold text-slate-950 uppercase tracking-wider shrink-0">
              Selecionar Filho(a):
            </span>
            {familyStudents.length > 0 ? (
              familyStudents.map((st) => (
                <button
                  key={st.uid}
                  onClick={() => setActiveStudentUid(st.uid)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                    activeStudentUid === st.uid
                      ? 'bg-slate-950 text-amber-300 shadow-md'
                      : 'bg-amber-100/60 hover:bg-amber-100 text-slate-900'
                  }`}
                >
                  👦 {st.name} ({st.studentYear?.split(' ')[0] || 'Ensino Médio'})
                </button>
              ))
            ) : (
              <span className="text-xs font-semibold text-slate-950 bg-amber-100 px-3 py-1 rounded-lg">
                👦 {parentSettings.studentName} ({parentSettings.studentYear})
              </span>
            )}
          </div>

          {familyGroup && (
            <button
              onClick={handleCopyCode}
              className="bg-slate-950 hover:bg-slate-900 text-amber-300 text-xs font-extrabold px-3 py-1.5 rounded-xl flex items-center space-x-1.5 transition shrink-0"
              title="Clique para copiar e enviar este código para seus outros filhos"
            >
              <Key className="w-3.5 h-3.5 text-amber-400" />
              <span>Código Familiar: {familyGroup.familyCode}</span>
              <span className="text-[10px] bg-amber-400/20 text-amber-300 px-1.5 py-0.5 rounded">
                {copied ? 'Copiado!' : 'Copiar'}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* ALERTAS PREVENTIVOS PREDITIVOS */}
      {atRiskSubjects.length > 0 ? (
        <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-5 text-rose-950 space-y-3 shadow-sm animate-in fade-in">
          <div className="flex items-center space-x-2 font-bold text-base text-rose-800">
            <AlertTriangle className="w-6 h-6 text-rose-600 shrink-0" />
            <span>Alerta Preventivo do Estudei: Risco de Recuperação Detectado</span>
            <TooltipHelp
              title="Alertas Preventivos Família"
              text="O sistema avisa antecipadamente antes do fechamento do bimestre para que a família possa apoiar o aluno sem pânico ou surpresas."
            />
          </div>

          <p className="text-xs leading-relaxed font-medium">
            Atenção, responsável! O algoritmo do Estudei identificou que {parentSettings.studentName} precisa de apoio pontual nas seguintes matérias no 2º Bimestre:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {atRiskSubjects.map((sub) => (
              <div key={sub.id} className="p-3 bg-white rounded-xl border border-rose-200 shadow-xs">
                <span className="text-xs font-bold text-rose-950 block">{sub.name}</span>
                <span className="text-[11px] text-rose-700">
                  Professor: {sub.teacherName || 'Não Informado'}
                </span>
                <p className="text-[10px] text-slate-500 mt-1 italic">
                  💡 Sugestão: Incentivar o aluno a utilizar o Tutor Socrático IA ou agendar 30min no cronômetro do Estudei.
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-5 text-emerald-950 flex items-center space-x-3">
          <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
          <div>
            <span className="text-sm font-bold block">Desempenho Seguro em Todas as Matérias!</span>
            <p className="text-xs text-emerald-800">
              Todas as médias parciais estão acima da média de corte ({schoolConfig.passingScore.toFixed(1)} pts).
            </p>
          </div>
        </div>
      )}

      {/* Relatório de Constância e Desempenho */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Horas Totais Estudadas */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
            <span>Horas Líquidas de Estudo</span>
            <Clock className="w-4 h-4 text-indigo-600" />
          </span>
          <span className="text-3xl font-black text-slate-900 font-mono block">
            {totalHours} hrs
          </span>
          <p className="text-xs text-slate-500">
            Tempo real acumulado de dedicação em casa no aplicativo.
          </p>
        </div>

        {/* Frequência & Constância */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
            <span>Constância nos Estudos</span>
            <Flame className="w-4 h-4 text-amber-500" />
          </span>
          <span className="text-3xl font-black text-slate-900 font-mono block">
            {studyLogs.length} Sessões
          </span>
          <p className="text-xs text-slate-500">
            Total de ciclos de estudo registrados neste mês.
          </p>
        </div>

        {/* Situação Geral */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
            <span>Escola Cadastrada</span>
            <BookOpen className="w-4 h-4 text-emerald-600" />
          </span>
          <span className="text-sm font-bold text-slate-900 block truncate">
            {parentSettings.schoolName}
          </span>
          <p className="text-xs text-slate-500">
            Regime: {schoolConfig.periodType === 'bimestre' ? '4 Bimestres' : '3 Trimestres'}
          </p>
        </div>
      </div>

      {/* Resumo Simplificado das Matérias */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 font-display">
          Situação Atual Por Disciplina (2º Bimestre)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {subjects.map((sub) => {
            const subEvals = evaluations.filter(e => e.subjectId === sub.id && e.periodIndex === 2);
            const subObtained = subEvals.filter(e => e.scoreObtained !== null).reduce((a, c) => a + c.scoreObtained! * c.weight, 0);
            const subLoggedWeight = subEvals.filter(e => e.scoreObtained !== null).reduce((a, c) => a + c.weight, 0);
            const avg = subLoggedWeight > 0 ? (subObtained / subLoggedWeight) : null;
            const isPassing = avg !== null && avg >= schoolConfig.passingScore;

            return (
              <div key={sub.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">{sub.name}</span>
                  <span className="text-[11px] text-slate-500">
                    {sub.teacherName || 'Prof. Não Informado'}
                  </span>
                </div>

                <div>
                  {avg !== null ? (
                    <span className={`text-xs font-extrabold px-2.5 py-1 rounded-lg ${
                      isPassing ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {avg.toFixed(1)} pts
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400 font-medium">Em Andamento</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* LGPD & Consentimento Familiar */}
      <div className="bg-slate-900 text-slate-300 rounded-2xl p-5 border border-slate-800 text-xs flex items-center space-x-3">
        <Lock className="w-5 h-5 text-indigo-400 shrink-0" />
        <div>
          <span className="font-bold text-white block">Conformidade LGPD Educacional & Privacidade</span>
          <p className="text-slate-400 mt-0.5">
            Os dados de notas, frequência e evolução do estudante estão protegidos sob autorização expressa do responsável legal ({parentSettings.guardianEmail}).
          </p>
        </div>
      </div>
    </div>
  );
};
