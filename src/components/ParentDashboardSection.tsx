import React, { useState } from 'react';
import { Subject, Evaluation, StudySessionLog, ParentGuardSettings, SchoolConfig, UserProfile } from '../types';
import { TooltipHelp } from './TooltipHelp';
import { WeeklyStudyChart } from './WeeklyStudyChart';
import { StudentSwitcher } from './StudentSwitcher';
import { DiagnosticPanel } from './DiagnosticPanel';
import { AgreementScreen } from './AgreementScreen';
import { FamilyChallenges } from './FamilyChallenges';
import { AchievementsWall } from './AchievementsWall';
import { FamilyAuditLogPanel } from './FamilyAuditLogPanel';
import { QuestionValidationSettings } from './QuestionValidationSettings';
import { ReliabilityIndex } from './ReliabilityIndex';
import { ShieldCheck, AlertTriangle, CheckCircle2, Flame, Clock, Award, Users, Lock, Sparkles, BookOpen, Key, Copy, Trash2, UserX, Star, History, ShieldAlert } from 'lucide-react';

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
  const { familyGroup, familyStudents, activeStudentUid, setActiveStudentUid, removeStudentFromFamily, isDemoMode } = useAuth();
  const [copied, setCopied] = useState(false);
  const [studentToRemove, setStudentToRemove] = useState<UserProfile | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);
  const [activeParentTab, setActiveParentTab] = useState<'overview' | 'rewards' | 'diagnostic' | 'agreement' | 'challenges' | 'anti_cheat' | 'audit_logs'>('overview');


  // Total Net Study Hours
  const totalMinutesAllTime = studyLogs.reduce((acc, curr) => acc + curr.minutes, 0);
  const totalHours = (totalMinutesAllTime / 60).toFixed(1);

  // Dynamic Predictive Alert Check: Subjects with weighted averages below passing score
  const atRiskSubjects = subjects.filter((sub) => {
    const subEvals = evaluations.filter(e => e.subjectId === sub.id && e.scoreObtained !== null);
    if (subEvals.length === 0) return false;
    const subObtained = subEvals.reduce((a, c) => a + c.scoreObtained! * c.weight, 0);
    const subLoggedWeight = subEvals.reduce((a, c) => a + c.weight, 0);
    const avg = subLoggedWeight > 0 ? (subObtained / subLoggedWeight) : null;
    return avg !== null && avg < schoolConfig.passingScore;
  });

  const activeStudentProfile = (familyStudents || []).find(s => s.uid === activeStudentUid);
  const currentStudentName = activeStudentProfile?.name || ((familyStudents || []).length > 0 ? (familyStudents[0]?.name || 'Estudante') : (isDemoMode ? (parentSettings.studentName || 'Lucas Toledo (Demo)') : 'Nenhum Aluno Vinculado'));
  const currentStudentYear = activeStudentProfile?.studentYear || ((familyStudents || []).length > 0 ? (familyStudents[0]?.studentYear || '2º Ano') : (isDemoMode ? (parentSettings.studentYear || '2º Ano') : 'Aguardando cadastro'));

  const handleCopyCode = () => {
    if (familyGroup?.familyCode) {
      navigator.clipboard.writeText(familyGroup.familyCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Confirmation Modal to Unlink/Remove Student */}
      {studentToRemove && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 border border-slate-200 shadow-xl">
            <div className="flex items-center space-x-3 text-rose-600">
              <div className="p-3 bg-rose-100 rounded-2xl">
                <Trash2 className="w-6 h-6 text-rose-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Desvincular Estudante da Família</h3>
                <p className="text-xs text-slate-500">Confirmação de Exclusão de Vínculo</p>
              </div>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed">
              Tem certeza de que deseja remover <strong className="text-slate-900">{studentToRemove.name || 'este estudante'}</strong> ({studentToRemove.studentYear || 'Estudante'}) do painel da sua família?
            </p>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 leading-snug space-y-1">
              <span className="font-bold block">⚠️ Importante:</span>
              <p>O vínculo com sua conta de responsável será desfeito. Se o aluno desejar se reconectar no futuro, ele poderá usar o Código Familiar ({familyGroup?.familyCode}).</p>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                disabled={isRemoving}
                onClick={() => setStudentToRemove(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
              >
                Cancelar
              </button>
              <button
                disabled={isRemoving}
                onClick={async () => {
                  try {
                    setIsRemoving(true);
                    await removeStudentFromFamily(studentToRemove.uid);
                    setStudentToRemove(null);
                  } catch (err: any) {
                    alert('Erro ao desvincular estudante: ' + err.message);
                  } finally {
                    setIsRemoving(false);
                  }
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow-sm"
              >
                {isRemoving ? 'Removendo...' : 'Sim, Desvincular Aluno'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header Banner - Parent Panel & Modern Student Switcher */}
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
                Acompanhamento em tempo real dos estudos, boletim, diagnósticos IA e acordos de família.
              </p>
            </div>
          </div>

          {/* Top Modern Student Switcher */}
          <div className="w-full sm:w-auto">
            <StudentSwitcher />
          </div>
        </div>

        {/* Navigation Tabs inside Parent View */}
        <div className="flex items-center space-x-2 overflow-x-auto pt-2 border-t border-slate-950/20">
          <button
            onClick={() => setActiveParentTab('overview')}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition shrink-0 ${
              activeParentTab === 'overview'
                ? 'bg-slate-950 text-amber-300 shadow-md'
                : 'bg-slate-950/20 text-slate-950 hover:bg-slate-950/30'
            }`}
          >
            📊 Resumo & Desempenho
          </button>

          <button
            onClick={() => setActiveParentTab('rewards')}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition shrink-0 flex items-center space-x-1.5 ${
              activeParentTab === 'rewards'
                ? 'bg-slate-950 text-amber-300 shadow-md'
                : 'bg-slate-950/20 text-slate-950 hover:bg-slate-950/30'
            }`}
          >
            <Star className="w-3.5 h-3.5 text-amber-300" />
            <span>Mural de Recompensas</span>
          </button>

          <button
            onClick={() => setActiveParentTab('diagnostic')}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition shrink-0 flex items-center space-x-1.5 ${
              activeParentTab === 'diagnostic'
                ? 'bg-slate-950 text-amber-300 shadow-md'
                : 'bg-slate-950/20 text-slate-950 hover:bg-slate-950/30'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Diagnóstico IA</span>
          </button>

          <button
            onClick={() => setActiveParentTab('agreement')}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition shrink-0 flex items-center space-x-1.5 ${
              activeParentTab === 'agreement'
                ? 'bg-slate-950 text-amber-300 shadow-md'
                : 'bg-slate-950/20 text-slate-950 hover:bg-slate-950/30'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
            <span>Acordo de Confiança</span>
          </button>

          <button
            onClick={() => setActiveParentTab('challenges')}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition shrink-0 flex items-center space-x-1.5 ${
              activeParentTab === 'challenges'
                ? 'bg-slate-950 text-amber-300 shadow-md'
                : 'bg-slate-950/20 text-slate-950 hover:bg-slate-950/30'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-amber-300" />
            <span>Desafios entre Irmãos</span>
          </button>

          <button
            onClick={() => setActiveParentTab('anti_cheat')}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition shrink-0 flex items-center space-x-1.5 ${
              activeParentTab === 'anti_cheat'
                ? 'bg-slate-950 text-amber-300 shadow-md'
                : 'bg-slate-950/20 text-slate-950 hover:bg-slate-950/30'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-300" />
            <span>Validação & Antitrapaça</span>
          </button>

          <button
            onClick={() => setActiveParentTab('audit_logs')}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition shrink-0 flex items-center space-x-1.5 ${
              activeParentTab === 'audit_logs'
                ? 'bg-slate-950 text-amber-300 shadow-md'
                : 'bg-slate-950/20 text-slate-950 hover:bg-slate-950/30'
            }`}
          >
            <History className="w-3.5 h-3.5 text-amber-300" />
            <span>Histórico da Família</span>
          </button>
        </div>
      </div>

      {/* Tab Content Display */}
      {activeParentTab === 'rewards' && (
        <AchievementsWall studentUid={activeStudentUid || undefined} />
      )}

      {activeParentTab === 'anti_cheat' && (
        <div className="space-y-6">
          <ReliabilityIndex />
          <QuestionValidationSettings />
        </div>
      )}

      {activeParentTab === 'audit_logs' && (
        <FamilyAuditLogPanel />
      )}


      {/* Tab Content Display */}
      {activeParentTab === 'diagnostic' && (
        <DiagnosticPanel
          subjects={subjects}
          evaluations={evaluations}
          studyLogs={studyLogs}
          schoolConfig={schoolConfig}
          studentName={currentStudentName}
          studentUid={activeStudentUid}
        />
      )}

      {activeParentTab === 'agreement' && (
        <AgreementScreen studyLogs={studyLogs} studentName={currentStudentName} />
      )}

      {activeParentTab === 'challenges' && (
        <FamilyChallenges />
      )}

      {activeParentTab === 'overview' && (
        <>


      {/* ALERTAS PREVENTIVOS PREDITIVOS */}
      {familyStudents.length === 0 && !isDemoMode ? (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-5 text-amber-950 space-y-2 shadow-sm animate-in fade-in">
          <div className="flex items-center space-x-2 font-bold text-base text-amber-900">
            <Users className="w-6 h-6 text-amber-600 shrink-0" />
            <span>Nenhum Aluno Vinculado à Família Ainda</span>
          </div>
          <p className="text-xs leading-relaxed font-medium text-amber-800">
            Para acompanhar boletins, tarefas e alertas preventivos em tempo real, compartilhe seu Código Familiar ({familyGroup?.familyCode || 'FAM-...'}) com seu filho ao cadastrar a conta dele no aplicativo.
          </p>
        </div>
      ) : evaluations.length === 0 ? (
        <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-5 text-indigo-950 flex items-center space-x-3 shadow-xs">
          <Sparkles className="w-6 h-6 text-indigo-600 shrink-0" />
          <div>
            <span className="text-sm font-bold block">Acompanhamento Ativo para {currentStudentName}</span>
            <p className="text-xs text-indigo-800 mt-0.5">
              Nenhuma avaliação ou nota cadastrada para este aluno até o momento. O algoritmo preventivo analisará o risco de recuperação automaticamente assim que as primeiras notas forem lançadas.
            </p>
          </div>
        </div>
      ) : atRiskSubjects.length > 0 ? (
        <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-5 text-rose-950 space-y-3 shadow-sm animate-in fade-in">
          <div className="flex items-center space-x-2 font-bold text-base text-rose-800">
            <AlertTriangle className="w-6 h-6 text-rose-600 shrink-0" />
            <span>Alerta Preventivo do Estudei: Risco de Recuperação Detectado</span>
            <TooltipHelp
              title="Alertas Preventivos Família"
              text="O sistema avisa antecipadamente antes do fechamento do período escolar para que a família possa apoiar o aluno sem pânico ou surpresas."
            />
          </div>

          <p className="text-xs leading-relaxed font-medium">
            Atenção, responsável! O algoritmo do Estudei identificou que {currentStudentName} precisa de apoio pontual nas seguintes matérias:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {atRiskSubjects.map((sub) => {
              const subEvals = evaluations.filter(e => e.subjectId === sub.id && e.scoreObtained !== null);
              const subObtained = subEvals.reduce((a, c) => a + c.scoreObtained! * c.weight, 0);
              const subLoggedWeight = subEvals.reduce((a, c) => a + c.weight, 0);
              const avg = subLoggedWeight > 0 ? (subObtained / subLoggedWeight) : 0;

              return (
                <div key={sub.id} className="p-3 bg-white rounded-xl border border-rose-200 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-rose-950 block">{sub.name}</span>
                    <span className="text-xs font-extrabold text-rose-700 bg-rose-100 px-2 py-0.5 rounded">
                      Média: {avg.toFixed(1)} / {schoolConfig.passingScore.toFixed(1)}
                    </span>
                  </div>
                  <span className="text-[11px] text-rose-700 block mt-0.5">
                    Professor: {sub.teacherName || 'Não Informado'}
                  </span>
                  <p className="text-[10px] text-slate-500 mt-1 italic">
                    💡 Sugestão: Incentivar o aluno a utilizar o Tutor Socrático IA ou agendar 30min de estudo no cronômetro do Estudei.
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-5 text-emerald-950 flex items-center space-x-3">
          <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
          <div>
            <span className="text-sm font-bold block">Desempenho Seguro em Todas as Matérias!</span>
            <p className="text-xs text-emerald-800">
              Todas as médias parciais de {currentStudentName} estão acima da média de corte ({schoolConfig.passingScore.toFixed(1)} pts).
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
            Tempo real acumulado de dedicação no aplicativo.
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
            {parentSettings.schoolName || 'Colégio Cadastrado'}
          </span>
          <p className="text-xs text-slate-500">
            Regime: {schoolConfig.periodType === 'bimestre' ? '4 Bimestres' : '3 Trimestres'} (Corte: {schoolConfig.passingScore.toFixed(1)} pts)
          </p>
        </div>
      </div>

      {/* Gráfico de Carga Horária Semanal por Matéria */}
      <WeeklyStudyChart
        subjects={subjects}
        studyLogs={studyLogs}
        title={`Atividade Semanal de Estudos de ${currentStudentName}`}
        subtitle="Gráfico em barras ilustrando as horas dedicadas por matéria nesta semana para o responsável."
      />

      {/* Resumo Simplificado das Matérias */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 font-display">
          Situação Atual Por Disciplina ({currentStudentName})
        </h3>

        {subjects.length === 0 ? (
          <p className="text-xs text-slate-500 italic">
            Nenhuma disciplina cadastrada para {currentStudentName} ainda.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {subjects.map((sub) => {
              const subEvals = evaluations.filter(e => e.subjectId === sub.id && e.scoreObtained !== null);
              const subObtained = subEvals.reduce((a, c) => a + c.scoreObtained! * c.weight, 0);
              const subLoggedWeight = subEvals.reduce((a, c) => a + c.weight, 0);
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
        )}
      </div>
      </>
      )}

      {/* LGPD & Consentimento Familiar */}
      <div className="bg-slate-900 text-slate-300 rounded-2xl p-5 border border-slate-800 text-xs flex items-center space-x-3">
        <Lock className="w-5 h-5 text-indigo-400 shrink-0" />
        <div>
          <span className="font-bold text-white block">Conformidade LGPD Educacional & Privacidade</span>
          <p className="text-slate-400 mt-0.5">
            Os dados de notas, frequência e evolução do estudante estão protegidos sob autorização do responsável legal.
          </p>
        </div>
      </div>
    </div>
  );
};
