import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  Award,
  Star,
  Trophy,
  Gift,
  X,
  Send,
  Sparkles,
  Heart,
  CheckCircle2,
  AlertCircle,
  HelpCircle
} from 'lucide-react';

interface RewardModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultStudentUid?: string;
}

export const RewardModal: React.FC<RewardModalProps> = ({
  isOpen,
  onClose,
  defaultStudentUid
}) => {
  const { familyStudents, grantReward, userProfile } = useAuth();

  const [selectedStudentUid, setSelectedStudentUid] = useState<string>(
    defaultStudentUid || (familyStudents.length > 0 ? familyStudents[0].uid : '')
  );
  const [rewardType, setRewardType] = useState<'star' | 'medal_bronze' | 'medal_silver' | 'medal_gold' | 'trophy'>('medal_gold');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [realReward, setRealReward] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const targetStudent = familyStudents.find(s => s.uid === selectedStudentUid) || familyStudents[0];

  const handleGrant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentUid && familyStudents.length > 0) {
      setErrorMsg('Selecione o estudante que receberá a recompensa.');
      return;
    }
    if (!title.trim()) {
      setErrorMsg('Digite um título para a conquista.');
      return;
    }
    if (!message.trim()) {
      setErrorMsg('Escreva uma mensagem de incentivo.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      await grantReward({
        studentUid: selectedStudentUid || familyStudents[0]?.uid || 'demo_student',
        type: rewardType,
        title: title.trim(),
        message: message.trim(),
        realReward: realReward.trim() || undefined,
        trigger: 'manual'
      });

      setSuccessMsg('🏆 Recompensa concedida com sucesso ao filho!');
      setTimeout(() => {
        setSuccessMsg('');
        setTitle('');
        setMessage('');
        setRealReward('');
        onClose();
      }, 1500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Erro ao conceder recompensa.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const PRESET_SUGGESTIONS = [
    { type: 'medal_gold', title: 'Excelente Nota em Matemática! 🥇', msg: 'Parabéns pela dedicação nas provas. Orgulho enorme de você!' },
    { type: 'star', title: 'Meta Diária Concluída 🌟', msg: 'Você manteve o foco incrível no estudo hoje! Continue assim!' },
    { type: 'trophy', title: 'Troféu Super Streak 🏆', msg: '15 dias ininterruptos de estudos no Estudei! Conquista fantástica!' },
    { type: 'medal_silver', title: 'Avanço Excepcional em Redação 🥈', msg: 'Vimos seu progresso na escrita. Ficou excelente!' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in zoom-in-95">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 p-6 text-slate-950 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-900 hover:text-white p-1 rounded-full bg-slate-950/10 hover:bg-slate-950/30 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-950 text-amber-400 flex items-center justify-center shadow-lg font-bold text-xl shrink-0">
              🏆
            </div>
            <div>
              <span className="bg-slate-950 text-amber-300 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full">
                Gamificação Parental Positiva
              </span>
              <h2 className="text-xl font-black font-display text-slate-950 mt-1">
                Conceder Recompensa ao Filho
              </h2>
              <p className="text-xs font-semibold text-slate-900/90">
                Reconheça o empenho escolar com estrelas, medalhas, troféus e prêmios em família
              </p>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleGrant} className="p-6 space-y-5">
          {errorMsg && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-center space-x-2 text-rose-800 text-xs font-semibold">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center space-x-2 text-emerald-800 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Student Selector */}
          {familyStudents.length > 1 && (
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-slate-800 block">
                Selecione o Filho / Estudante:
              </label>
              <select
                value={selectedStudentUid}
                onChange={(e) => setSelectedStudentUid(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                {familyStudents.map((st) => (
                  <option key={st.uid} value={st.uid}>
                    {st.name} ({st.studentYear || 'Estudante'})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Reward Type Selection */}
          <div className="space-y-2">
            <label className="text-xs font-extrabold text-slate-800 block">
              Tipo de Recompensa:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {[
                { type: 'star', label: 'Estrela', icon: '⭐', bg: 'bg-amber-50 border-amber-300 text-amber-900' },
                { type: 'medal_bronze', label: 'Bronze', icon: '🥉', bg: 'bg-amber-100/50 border-amber-400 text-amber-950' },
                { type: 'medal_silver', label: 'Prata', icon: '🥈', bg: 'bg-slate-100 border-slate-400 text-slate-900' },
                { type: 'medal_gold', label: 'Ouro', icon: '🥇', bg: 'bg-yellow-100 border-yellow-400 text-yellow-950' },
                { type: 'trophy', label: 'Troféu', icon: '🏆', bg: 'bg-gradient-to-tr from-amber-100 to-yellow-200 border-amber-400 text-slate-950' },
              ].map((item) => (
                <button
                  key={item.type}
                  type="button"
                  onClick={() => setRewardType(item.type as any)}
                  className={`p-3 rounded-2xl border-2 transition flex flex-col items-center justify-center space-y-1 ${
                    rewardType === item.type
                      ? `${item.bg} ring-2 ring-amber-500 scale-105 shadow-md font-extrabold`
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-2xl">{item.icon}</span>
                  <span className="text-xs">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Fast Suggestions Chips */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-slate-500 block flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Sugestões Prontas dos Pais:</span>
            </span>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_SUGGESTIONS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setRewardType(preset.type as any);
                    setTitle(preset.title);
                    setMessage(preset.msg);
                  }}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-amber-100 border border-slate-200 hover:border-amber-300 rounded-lg text-[11px] font-bold text-slate-700 transition"
                >
                  {preset.title}
                </button>
              ))}
            </div>
          </div>

          {/* Title & Custom Message */}
          <div className="space-y-3">
            <div>
              <label className="text-xs font-extrabold text-slate-800 block mb-1">
                Título da Conquista:
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Nota 10 na Prova de Física!"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="text-xs font-extrabold text-slate-800 block mb-1">
                Mensagem Personalizada dos Pais:
              </label>
              <textarea
                rows={2}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ex: Ficamos orgulhosos do seu esforço durante as revisões dessa semana!"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="text-xs font-extrabold text-slate-800 flex items-center space-x-1 mb-1">
                <Gift className="w-4 h-4 text-emerald-600" />
                <span>Recompensa Real Combinada (Opcional):</span>
              </label>
              <input
                type="text"
                value={realReward}
                onChange={(e) => setRealReward(e.target.value)}
                placeholder="Ex: Sorvete no sábado, 1h extra de videogame, Escolher o restaurante"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <span className="text-[10px] text-slate-500 italic block mt-0.5">
                Texto livre que aparece no mural do aluno como prêmio acordado em família.
              </span>
            </div>
          </div>

          {/* Preview Card */}
          <div className="p-4 bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-300 rounded-2xl space-y-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-900 block flex items-center space-x-1">
              <Sparkles className="w-3 h-3 text-amber-600" />
              <span>Pré-visualização do Card no Mural do Aluno ({targetStudent?.name || 'Filho'}):</span>
            </span>

            <div className="bg-white rounded-xl p-3.5 border border-amber-200 shadow-xs flex items-start space-x-3">
              <div className="text-3xl shrink-0 p-2 bg-amber-100 rounded-xl">
                {rewardType === 'star' && '⭐'}
                {rewardType === 'medal_bronze' && '🥉'}
                {rewardType === 'medal_silver' && '🥈'}
                {rewardType === 'medal_gold' && '🥇'}
                {rewardType === 'trophy' && '🏆'}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-900">
                    {title || 'Título da Conquista'}
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold">Agora</span>
                </div>
                <p className="text-xs text-slate-600 italic">
                  "{message || 'Mensagem especial dos pais...'}"
                </p>
                {realReward && (
                  <div className="mt-1.5 inline-flex items-center space-x-1 bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
                    <Gift className="w-3 h-3 text-emerald-700" />
                    <span>Prêmio: {realReward}</span>
                  </div>
                )}
                <span className="text-[10px] text-slate-400 block pt-1">
                  Concedido por: <strong>{userProfile?.name || 'Responsável'}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Footer Submit Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2 rounded-xl transition"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs px-5 py-2.5 rounded-xl transition shadow-md flex items-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Enviando...' : 'Conceder Recompensa 🎉'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
