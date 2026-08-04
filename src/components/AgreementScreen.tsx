import React, { useState, useEffect } from 'react';
import { StudySessionLog } from '../types';
import { useDailyProgress } from '../hooks/useDailyProgress';
import { useAuth } from '../contexts/AuthContext';
import { Award, CheckCircle, ShieldCheck, Clock, Flame, Sparkles, Heart, Edit3, Send, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface AgreementScreenProps {
  studyLogs: StudySessionLog[];
  studentName?: string;
}

export const AgreementScreen: React.FC<AgreementScreenProps> = ({ studyLogs, studentName }) => {
  const { userProfile, activeStudentUid, familyStudents } = useAuth();
  const { todayMinutes, goalMinutes, progressPercent, isGoalReached, agreement, saveAgreement } = useDailyProgress(studyLogs);

  const activeStudent = (familyStudents || []).find((s) => s.uid === activeStudentUid);
  const effectiveName = studentName || activeStudent?.name || 'Estudante';

  const [sliderVal, setSliderVal] = useState<number>(60);
  const [parentNote, setParentNote] = useState('');
  const [rewardIncentive, setRewardIncentive] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (agreement) {
      setSliderVal(agreement.dailyGoalMinutes || 60);
      setParentNote(agreement.parentNote || '');
      setRewardIncentive(agreement.rewardIncentive || '');
    }
  }, [agreement]);

  const handleParentSave = async () => {
    await saveAgreement({
      dailyGoalMinutes: sliderVal,
      parentNote,
      rewardIncentive,
      status: 'pending_student',
      parentAcceptedAt: new Date().toISOString()
    });
    setIsEditing(false);
  };

  const handleStudentSign = async () => {
    await saveAgreement({
      status: 'active',
      studentAcceptedAt: new Date().toISOString()
    });
  };

  const isParent = userProfile?.role === 'parent';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-amber-100 rounded-2xl text-amber-700">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base font-extrabold font-display text-slate-900">Acordo de Confiança Familiar</h3>
              <span
                className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                  agreement?.status === 'active'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-amber-100 text-amber-800 border border-amber-300'
                }`}
              >
                {agreement?.status === 'active' ? '🤝 Válido & Assinado' : '⏳ Aguardando Assinatura'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Pacto transparente de metas de estudo entre pais e {effectiveName} com incentivo positivo.
            </p>
          </div>
        </div>

        {isParent && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-3.5 py-2 rounded-xl transition flex items-center space-x-1.5 shrink-0"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Ajustar Metas do Acordo</span>
          </button>
        )}
      </div>

      {/* Goal Reached Celebration Banner */}
      {isGoalReached && (
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="p-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl shadow-md flex items-center justify-between flex-wrap gap-3"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-white/20 rounded-xl">
              <Award className="w-7 h-7 text-amber-300 animate-bounce" />
            </div>
            <div>
              <span className="text-sm font-black block font-display">🎉 Meta Diária Concluída com Sucesso!</span>
              <p className="text-xs text-emerald-100 font-medium">
                {effectiveName} estudou {todayMinutes} minutos hoje (Meta: {goalMinutes} min). Parabéns pela dedicação!
              </p>
            </div>
          </div>
          <span className="text-xs bg-slate-950/30 font-bold px-3 py-1.5 rounded-xl border border-white/20">
            100% Cumprido
          </span>
        </motion.div>
      )}

      {/* Daily Progress Bar */}
      <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-700 flex items-center space-x-1.5">
            <Clock className="w-4 h-4 text-indigo-600" />
            <span>Progresso de Hoje ({effectiveName})</span>
          </span>
          <span className="font-extrabold text-slate-900 font-mono text-sm">
            {todayMinutes} / {goalMinutes} minutos
          </span>
        </div>

        <div className="w-full bg-slate-200 rounded-full h-3.5 overflow-hidden p-0.5">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isGoalReached ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : 'bg-gradient-to-r from-indigo-600 to-amber-500'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
          <span>{progressPercent}% da meta atingida</span>
          <span>{isGoalReached ? 'Meta alcançada!' : `Faltam ${Math.max(0, goalMinutes - todayMinutes)} minutos`}</span>
        </div>
      </div>

      {/* Edit Form (for Parent) or Display Card */}
      {isEditing ? (
        <div className="bg-amber-50/60 border border-amber-200 rounded-2xl p-5 space-y-4">
          <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
            Configurar Meta Diária de Estudo
          </h4>

          {/* Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800">Tempo Diário de Estudo Desejado:</span>
              <span className="font-black text-indigo-700 font-mono text-base">{sliderVal} minutos/dia</span>
            </div>
            <input
              type="range"
              min={30}
              max={180}
              step={15}
              value={sliderVal}
              onChange={(e) => setSliderVal(Number(e.target.value))}
              className="w-full accent-indigo-600 h-2 bg-amber-200 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>30 min</span>
              <span>60 min</span>
              <span>90 min</span>
              <span>120 min</span>
              <span>180 min</span>
            </div>
          </div>

          {/* Incentive Field */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-800 block">
              🎁 Incentivo / Recompensa Combinada (Opcional):
            </label>
            <input
              type="text"
              value={rewardIncentive}
              onChange={(e) => setRewardIncentive(e.target.value)}
              placeholder="Ex: Passeio no parque, tempo extra de videogame, cinema no fim de semana..."
              className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 bg-white"
            />
          </div>

          {/* Parent Note */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-800 block">
              💬 Recado do Responsável para o Aluno:
            </label>
            <textarea
              rows={2}
              value={parentNote}
              onChange={(e) => setParentNote(e.target.value)}
              placeholder="Ex: Contamos com sua dedicação! Estudar um pouco todo dia evita correria na semana de provas."
              className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 bg-white"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-xl"
            >
              Cancelar
            </button>
            <button
              onClick={handleParentSave}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Enviar para Assinatura do Filho</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Agreement Details Card */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
              <Award className="w-4 h-4 text-amber-500" />
              <span>Termos do Contrato Familiar</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between border-b border-slate-200 pb-1.5">
                <span className="text-slate-500">Meta Diária:</span>
                <span className="font-extrabold text-slate-900 font-mono">{agreement?.dailyGoalMinutes || 60} minutos</span>
              </div>

              {agreement?.rewardIncentive && (
                <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 space-y-0.5">
                  <span className="font-extrabold block text-[11px]">🎁 Recompensa Combinada:</span>
                  <p className="text-xs">{agreement.rewardIncentive}</p>
                </div>
              )}

              {agreement?.parentNote && (
                <div className="italic text-slate-600 bg-white p-2.5 rounded-xl border border-slate-200">
                  "{agreement.parentNote}"
                </div>
              )}
            </div>
          </div>

          {/* Dual Acceptance Workflow Card */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Assinaturas das Partes
              </span>

              {/* Parent Signature Badge */}
              <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-200 text-xs">
                <span className="font-semibold text-slate-800">Responsável (Pai/Mãe):</span>
                <span className="text-emerald-700 font-extrabold flex items-center space-x-1">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Assinado</span>
                </span>
              </div>

              {/* Student Signature Badge */}
              <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-200 text-xs">
                <span className="font-semibold text-slate-800">Estudante ({effectiveName}):</span>
                {agreement?.status === 'active' ? (
                  <span className="text-emerald-700 font-extrabold flex items-center space-x-1">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Aceito e Assinado</span>
                  </span>
                ) : (
                  <span className="text-amber-700 font-extrabold flex items-center space-x-1">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                    <span>Pendente de Aceite</span>
                  </span>
                )}
              </div>
            </div>

            {/* Student Action Button */}
            {!isParent && agreement?.status !== 'active' && (
              <button
                onClick={handleStudentSign}
                className="w-full mt-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs py-2.5 px-4 rounded-xl shadow-md transition flex items-center justify-center space-x-2"
              >
                <Heart className="w-4 h-4 text-amber-300 fill-amber-300" />
                <span>Aceitar & Assinar Acordo de Confiança</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
