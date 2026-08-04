import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FamilyReward } from '../types';
import { RewardModal } from './RewardModal';
import {
  Award,
  Star,
  Trophy,
  Gift,
  Sparkles,
  CheckCircle2,
  Calendar,
  Heart,
  PlusCircle,
  ShieldCheck,
  Flame
} from 'lucide-react';

interface AchievementsWallProps {
  studentUid?: string;
  readOnly?: boolean;
}

export const AchievementsWall: React.FC<AchievementsWallProps> = ({
  studentUid,
  readOnly = false
}) => {
  const { rewards, userProfile, familyStudents, activeStudentUid } = useAuth();
  const [isRewardModalOpen, setIsRewardModalOpen] = useState(false);
  const [celebratedId, setCelebratedId] = useState<string | null>(null);

  const targetUid = studentUid || activeStudentUid || userProfile?.uid || '';
  const isParent = userProfile?.role === 'parent';

  // Filter rewards for the current student
  const studentRewards = rewards.filter(r => r.studentUid === targetUid);

  // Count metrics
  const starsCount = studentRewards.filter(r => r.type === 'star').length;
  const medalsCount = studentRewards.filter(r => r.type.startsWith('medal')).length;
  const trophiesCount = studentRewards.filter(r => r.type === 'trophy').length;

  const targetStudentProfile = familyStudents.find(s => s.uid === targetUid);

  const triggerCelebration = (id: string) => {
    setCelebratedId(id);
    setTimeout(() => setCelebratedId(null), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Reward Modal for Parents */}
      {isRewardModalOpen && (
        <RewardModal
          isOpen={isRewardModalOpen}
          onClose={() => setIsRewardModalOpen(false)}
          defaultStudentUid={targetUid}
        />
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 rounded-3xl p-6 text-slate-950 shadow-md space-y-4 relative overflow-hidden">
        <div className="flex items-center justify-between flex-wrap gap-4 relative z-10">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-slate-950 text-amber-300 rounded-2xl shadow-md">
              <Trophy className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-black text-xl font-display text-slate-950">
                  Mural de Conquistas Familiares
                </span>
                <span className="bg-slate-950 text-amber-300 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
                  Gamificação Positiva
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-950/90 mt-0.5">
                {isParent
                  ? `Recompensas e medalhas de incentivo concedidas para ${targetStudentProfile?.name || 'o estudante'}`
                  : 'Suas estrelas, medalhas e troféus presenteados pelos seus pais!'}
              </p>
            </div>
          </div>

          {/* Parents Action Button */}
          {isParent && (
            <button
              onClick={() => setIsRewardModalOpen(true)}
              className="bg-slate-950 hover:bg-slate-900 text-amber-300 text-xs font-extrabold px-4 py-2.5 rounded-xl shadow-lg transition flex items-center space-x-2 shrink-0"
            >
              <PlusCircle className="w-4 h-4 text-amber-300" />
              <span>Conceder Recompensa 🎉</span>
            </button>
          )}
        </div>

        {/* Counter Summary Pills */}
        <div className="grid grid-cols-3 gap-3 pt-2 border-t border-slate-950/20 relative z-10">
          <div className="bg-slate-950/15 backdrop-blur-xs rounded-2xl p-3 flex items-center space-x-2.5">
            <span className="text-2xl">⭐</span>
            <div>
              <span className="text-lg font-black font-mono text-slate-950 block leading-none">
                {starsCount}
              </span>
              <span className="text-[10px] font-extrabold text-slate-950/80 uppercase">Estrelas</span>
            </div>
          </div>

          <div className="bg-slate-950/15 backdrop-blur-xs rounded-2xl p-3 flex items-center space-x-2.5">
            <span className="text-2xl">🥇</span>
            <div>
              <span className="text-lg font-black font-mono text-slate-950 block leading-none">
                {medalsCount}
              </span>
              <span className="text-[10px] font-extrabold text-slate-950/80 uppercase">Medalhas</span>
            </div>
          </div>

          <div className="bg-slate-950/15 backdrop-blur-xs rounded-2xl p-3 flex items-center space-x-2.5">
            <span className="text-2xl">🏆</span>
            <div>
              <span className="text-lg font-black font-mono text-slate-950 block leading-none">
                {trophiesCount}
              </span>
              <span className="text-[10px] font-extrabold text-slate-950/80 uppercase">Troféus</span>
            </div>
          </div>
        </div>
      </div>

      {/* Rewards Grid */}
      {studentRewards.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-3 shadow-xs">
          <div className="w-16 h-16 bg-amber-50 rounded-3xl flex items-center justify-center mx-auto text-3xl">
            🌟
          </div>
          <h3 className="text-base font-bold text-slate-900 font-display">
            Nenhuma Recompensa Cadastrada Ainda
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            {isParent
              ? 'Conceda estrelas, medalhas de bronze/prata/ouro ou troféus para incentivar seu filho ao atingir metas de estudo ou tirar notas altas.'
              : 'Complete suas metas diárias no Acordo de Confiança ou atinja notas altas para receber estrelas e troféus dos seus pais!'}
          </p>

          {isParent && (
            <button
              onClick={() => setIsRewardModalOpen(true)}
              className="mt-2 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-extrabold px-5 py-2.5 rounded-xl shadow-md transition inline-flex items-center space-x-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Dar Primeira Recompensa</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {studentRewards.map((reward) => {
            const isCelebrated = celebratedId === reward.id;

            return (
              <div
                key={reward.id}
                className={`bg-white rounded-3xl border p-5 shadow-sm transition-all space-y-3 relative overflow-hidden ${
                  reward.type === 'trophy'
                    ? 'border-amber-300 bg-gradient-to-br from-amber-50/40 via-white to-yellow-50/30 ring-1 ring-amber-300'
                    : 'border-slate-200 hover:border-amber-300'
                }`}
              >
                {/* Visual Celebration Flash */}
                {isCelebrated && (
                  <div className="absolute inset-0 bg-amber-400/20 backdrop-blur-2xs flex items-center justify-center z-20 animate-in fade-in">
                    <div className="bg-slate-950 text-amber-300 px-4 py-2 rounded-2xl shadow-xl font-black text-sm animate-bounce flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>🎉 Parabéns pela Conquista! 🎉</span>
                    </div>
                  </div>
                )}

                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center space-x-3">
                    <div className="text-3xl p-3 bg-amber-100 rounded-2xl shadow-xs shrink-0">
                      {reward.type === 'star' && '⭐'}
                      {reward.type === 'medal_bronze' && '🥉'}
                      {reward.type === 'medal_silver' && '🥈'}
                      {reward.type === 'medal_gold' && '🥇'}
                      {reward.type === 'trophy' && '🏆'}
                    </div>

                    <div>
                      <span className="text-[10px] font-extrabold uppercase bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full inline-block mb-0.5">
                        {reward.type === 'star' && 'Estrela de Dedicação'}
                        {reward.type === 'medal_bronze' && 'Medalha de Bronze'}
                        {reward.type === 'medal_silver' && 'Medalha de Prata'}
                        {reward.type === 'medal_gold' && 'Medalha de Ouro'}
                        {reward.type === 'trophy' && 'Troféu Familiar'}
                      </span>
                      <h4 className="text-sm font-black text-slate-900 font-display">
                        {reward.title}
                      </h4>
                    </div>
                  </div>

                  <span className="text-[10px] text-slate-400 font-semibold shrink-0">
                    {new Date(reward.createdAt).toLocaleDateString('pt-BR')}
                  </span>
                </div>

                {/* Parents Message */}
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs text-slate-700 italic space-y-1">
                  <p className="leading-relaxed font-medium">"{reward.message}"</p>
                  <span className="text-[10px] font-bold text-slate-400 block not-italic">
                    — Concedido por: {reward.grantedByName}
                  </span>
                </div>

                {/* Real Reward Badge if specified */}
                {reward.realReward && (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs text-emerald-950">
                    <div className="flex items-center space-x-2">
                      <Gift className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="font-extrabold">
                        Prêmio Combinado: {reward.realReward}
                      </span>
                    </div>
                    <span className="text-[10px] bg-emerald-200 text-emerald-900 font-bold px-2 py-0.5 rounded-md">
                      Acordo Cumprido
                    </span>
                  </div>
                )}

                {/* Celebration Action Button */}
                <div className="pt-1 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-medium">
                    {reward.trigger === 'auto_daily_goal' ? '🤖 Automático via Meta Diária' : '❤️ Concedido pelos Pais'}
                  </span>

                  <button
                    onClick={() => triggerCelebration(reward.id)}
                    className="text-[11px] font-extrabold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-3 py-1 rounded-xl transition flex items-center space-x-1"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>Celebrar 🎉</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
