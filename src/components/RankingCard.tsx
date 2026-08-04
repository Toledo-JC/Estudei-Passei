import React from 'react';
import { ClassMember, RankingCategory } from '../types';
import { TrendingUp, TrendingDown, Minus, Trophy, Medal, Award } from 'lucide-react';

interface RankingCardProps {
  member: ClassMember;
  rank: number;
  category: RankingCategory;
  isCurrentUser: boolean;
}

export const RankingCard: React.FC<RankingCardProps> = ({
  member,
  rank,
  category,
  isCurrentUser
}) => {
  const getCategoryValue = (m: ClassMember) => {
    switch (category) {
      case 'hours':
        return `${m.metrics.weeklyHours}h de estudo`;
      case 'questions':
        return `${m.metrics.totalQuestions} questões`;
      case 'accuracy':
        return `${m.metrics.accuracyRate}% acertos`;
      case 'streak':
        return `${m.metrics.currentStreak} dias seguidos 🔥`;
      case 'simulations':
        return `${m.metrics.simulationsCompleted} simulados`;
      default:
        return `${m.metrics.weeklyHours}h`;
    }
  };

  const getRankBadge = () => {
    if (rank === 1) {
      return (
        <div className="w-8 h-8 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center font-black shadow-sm shrink-0">
          🥇 1
        </div>
      );
    }
    if (rank === 2) {
      return (
        <div className="w-8 h-8 rounded-2xl bg-slate-300 text-slate-900 flex items-center justify-center font-black shadow-sm shrink-0">
          🥈 2
        </div>
      );
    }
    if (rank === 3) {
      return (
        <div className="w-8 h-8 rounded-2xl bg-amber-700 text-amber-50 flex items-center justify-center font-black shadow-sm shrink-0">
          🥉 3
        </div>
      );
    }
    return (
      <div className="w-8 h-8 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center font-extrabold text-xs shrink-0 font-mono">
        #{rank}
      </div>
    );
  };

  return (
    <div
      className={`p-4 rounded-2xl border transition flex items-center justify-between ${
        isCurrentUser
          ? 'bg-indigo-50/80 border-indigo-500 ring-2 ring-indigo-200'
          : 'bg-white border-slate-200 hover:border-slate-300'
      }`}
    >
      <div className="flex items-center space-x-3.5">
        {getRankBadge()}

        <div className="w-10 h-10 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-xl shrink-0">
          {member.avatar || '👤'}
        </div>

        <div>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-extrabold text-slate-900 font-mono">
              {member.nickname}
            </span>
            {isCurrentUser && (
              <span className="px-2 py-0.5 bg-indigo-600 text-white rounded-md text-[10px] font-black uppercase">
                Você
              </span>
            )}
          </div>
          <span className="text-[11px] font-semibold text-slate-400 block">
            Entrou em {new Date(member.joinedAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className="text-right">
        <span className="text-sm font-black text-slate-900 font-mono block">
          {getCategoryValue(member)}
        </span>
        <div className="flex items-center justify-end space-x-1 text-[10px] font-bold text-slate-400 mt-0.5">
          {member.metrics.trend === 'up' && (
            <span className="text-emerald-600 flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> Subindo
            </span>
          )}
          {member.metrics.trend === 'down' && (
            <span className="text-rose-500 flex items-center">
              <TrendingDown className="w-3 h-3 mr-0.5" /> Estável
            </span>
          )}
          {(!member.metrics.trend || member.metrics.trend === 'stable') && (
            <span className="text-slate-400 flex items-center">
              <Minus className="w-3 h-3 mr-0.5" /> Constante
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
