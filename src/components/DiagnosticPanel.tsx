import React, { useState, useEffect } from 'react';
import { Subject, Evaluation, StudySessionLog, SchoolConfig, DiagnosticReport } from '../types';
import { Sparkles, AlertTriangle, CheckCircle, Calendar, Brain, ArrowRight, RefreshCw, HeartHandshake, ShieldAlert, Award, FileText } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';

interface DiagnosticPanelProps {
  subjects: Subject[];
  evaluations: Evaluation[];
  studyLogs: StudySessionLog[];
  schoolConfig: SchoolConfig;
  studentName: string;
  studentUid: string | null;
}

export const DiagnosticPanel: React.FC<DiagnosticPanelProps> = ({
  subjects,
  evaluations,
  studyLogs,
  schoolConfig,
  studentName,
  studentUid
}) => {
  const { isDemoMode } = useAuth();
  const [report, setReport] = useState<DiagnosticReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load existing saved report from Firestore if available
  useEffect(() => {
    if (!studentUid || isDemoMode) return;

    async function loadSavedReport() {
      try {
        const docRef = doc(db, 'studentData', studentUid);
        const snap = await getDoc(docRef);
        if (snap.exists() && snap.data().latestDiagnosticReport) {
          setReport(snap.data().latestDiagnosticReport as DiagnosticReport);
        }
      } catch (err) {
        console.error('Error loading saved diagnostic report:', err);
      }
    }

    loadSavedReport();
  }, [studentUid, isDemoMode]);

  const handleGenerateDiagnostic = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/ai/diagnostic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName,
          subjects,
          evaluations,
          studyLogs,
          schoolConfig
        })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Erro ao comunicar com o serviço de diagnóstico IA.');
      }

      const data: DiagnosticReport = await res.json();
      const fullReport: DiagnosticReport = {
        ...data,
        id: `diag_${Date.now()}`,
        studentUid: studentUid || 'student_demo',
        studentName,
        createdAt: new Date().toISOString()
      };

      setReport(fullReport);

      // Save report in Firestore under studentData
      if (studentUid && !isDemoMode) {
        const docRef = doc(db, 'studentData', studentUid);
        await setDoc(docRef, { latestDiagnosticReport: fullReport }, { merge: true });
      }
    } catch (err: any) {
      console.error('Error generating diagnostic report:', err);
      setError(err.message || 'Não foi possível gerar o diagnóstico no momento.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 rounded-2xl p-5 text-white shadow-md">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-indigo-500/30 rounded-2xl border border-indigo-400/30">
            <Sparkles className="w-7 h-7 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base font-extrabold font-display">Diagnóstico IA de Lacunas & Mapeamento</h3>
              <span className="bg-amber-400 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-full uppercase">
                Gemini 3.6
              </span>
            </div>
            <p className="text-xs text-indigo-200 mt-0.5">
              Análise inteligente do histórico de notas e horas de estudo para identificar lacunas antes da prova.
            </p>
          </div>
        </div>

        <button
          onClick={handleGenerateDiagnostic}
          disabled={loading}
          className="bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-extrabold px-4 py-2.5 rounded-xl shadow-md transition flex items-center justify-center space-x-2 shrink-0 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 text-slate-950 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'Analisando Histórico...' : report ? 'Atualizar Diagnóstico IA' : 'Gerar Diagnóstico IA'}</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-semibold flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {!report && !loading && (
        <div className="text-center py-10 px-4 bg-slate-50 border border-dashed border-slate-300 rounded-2xl space-y-3">
          <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl mx-auto flex items-center justify-center">
            <Brain className="w-6 h-6" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h4 className="text-sm font-bold text-slate-900">Nenhum Diagnóstico Gerado Ainda</h4>
            <p className="text-xs text-slate-500">
              Clique no botão acima para acionar a IA e mapear pontos fortes, tópicos em risco e um plano de revisão personalizado de 4 semanas para {studentName}.
            </p>
          </div>
          <button
            onClick={handleGenerateDiagnostic}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold px-5 py-2.5 rounded-xl shadow-sm transition inline-flex items-center space-x-2"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Gerar Diagnóstico Agora</span>
          </button>
        </div>
      )}

      {loading && (
        <div className="text-center py-12 space-y-3 bg-indigo-50/50 rounded-2xl border border-indigo-100">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-indigo-900">A Inteligência Artificial está cruzando notas e hábitos de estudo...</p>
          <p className="text-[11px] text-slate-500">Mapeando lacunas por disciplina e estruturando plano de 4 semanas.</p>
        </div>
      )}

      {report && !loading && (
        <div className="space-y-6 animate-in fade-in">
          {/* Top KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Score Card */}
            <div className="p-4 bg-indigo-50/60 border border-indigo-200 rounded-2xl space-y-1">
              <span className="text-[11px] font-bold text-indigo-900 uppercase tracking-wider block">
                Índice Geral de Aprendizagem
              </span>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-black text-indigo-950 font-mono">{report.overallScore}</span>
                <span className="text-xs font-bold text-indigo-700">/ 100 pts</span>
              </div>
              <p className="text-[10px] text-indigo-800">Baseado no cumprimento de metas e médias escolares.</p>
            </div>

            {/* Pace Card */}
            <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-2xl space-y-1">
              <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider block">
                Ritmo & Constância
              </span>
              <span className="inline-block bg-amber-400 text-slate-950 text-xs font-extrabold px-3 py-1 rounded-lg">
                ⚡ {report.learningPace}
              </span>
              <p className="text-[10px] text-amber-900">
                Constância avaliada com base nos logs de estudo e tempo diário.
              </p>
            </div>

            {/* Strengths Card */}
            <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl space-y-1">
              <span className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider block">
                Pontos Fortes Mapeados
              </span>
              <div className="space-y-1">
                {(report.strengths || []).map((s, idx) => (
                  <span key={idx} className="text-xs text-emerald-950 font-semibold flex items-center space-x-1">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">{s}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* At-Risk Topics / Gaps */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <ShieldAlert className="w-5 h-5 text-rose-600" />
              <h4 className="text-sm font-bold text-slate-900 font-display">Tópicos e Lacunas Prioritárias (Em Risco)</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {(report.atRiskTopics || []).map((topic, idx) => (
                <div key={idx} className="p-4 bg-rose-50/70 border border-rose-200 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-rose-950">{topic.subjectName}</span>
                    <span
                      className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                        topic.severity === 'alta'
                          ? 'bg-rose-600 text-white'
                          : topic.severity === 'media'
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-indigo-100 text-indigo-900'
                      }`}
                    >
                      Risco {topic.severity}
                    </span>
                  </div>

                  <span className="text-xs font-bold text-slate-800 block">📌 Tópico: {topic.topicName}</span>
                  <p className="text-xs text-rose-900 leading-snug bg-white/80 p-2.5 rounded-xl border border-rose-100 italic">
                    💡 Recomendação IA: {topic.recommendation}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 4-Week Action Plan */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-indigo-600" />
              <h4 className="text-sm font-bold text-slate-900 font-display">Plano Personalizado de Revisão (4 Semanas)</h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(report.fourWeekRevisionPlan || []).map((week) => (
                <div key={week.weekNumber} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="text-xs font-extrabold text-indigo-900">Semana {week.weekNumber}</span>
                    <div className="flex flex-wrap gap-1">
                      {(week.focusSubjects || []).map((fs, fIdx) => (
                        <span key={fIdx} className="text-[10px] bg-indigo-100 text-indigo-900 font-bold px-2 py-0.5 rounded">
                          {fs}
                        </span>
                      ))}
                    </div>
                  </div>

                  <span className="text-xs font-bold text-slate-900 block">{week.title}</span>

                  <ul className="space-y-1 pt-1">
                    {(week.actionItems || []).map((item, aIdx) => (
                      <li key={aIdx} className="text-xs text-slate-700 flex items-start space-x-1.5">
                        <ArrowRight className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Advice for Parents */}
          <div className="p-5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl space-y-2">
            <div className="flex items-center space-x-2 text-amber-900 font-bold text-xs uppercase tracking-wider">
              <HeartHandshake className="w-4 h-4 text-amber-600" />
              <span>Orientação Pedagógica aos Responsáveis</span>
            </div>
            <p className="text-xs text-slate-800 leading-relaxed italic">
              "{report.pedagogicalAdviceForParents}"
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
