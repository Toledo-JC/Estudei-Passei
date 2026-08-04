import React from 'react';
import { ClassOlympiad } from '../types';
import { Trophy, Medal, Award, Sparkles, CheckCircle2, RotateCcw } from 'lucide-react';

interface OlympiadPodiumProps {
  olympiad: ClassOlympiad;
  onClose: () => void;
}

export const OlympiadPodium: React.FC<OlympiadPodiumProps> = ({
  olympiad,
  onClose
}) => {
  const sortedResults = [...(olympiad.results || [])].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.timeSpentSeconds - b.timeSpentSeconds; // tiebreaker: faster time
  });

  const top3 = sortedResults.slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8 text-center p-6 space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-600 mx-auto flex items-center justify-center text-3xl shadow-inner animate-bounce">
          🏆
        </div>

        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            Pódio da Olimpíada
          </span>
          <h3 className="text-xl font-black text-slate-900 font-display mt-2">
            {olympiad.title}
          </h3>
          <p className="text-xs text-slate-500">
            Disciplina: {olympiad.subjectName} • {olympiad.questionCount} Questões
          </p>
        </div>

        {/* Podium Displays */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {/* 2nd Place */}
          {top3[1] && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col items-center">
              <span className="text-xl mb-1">🥈</span>
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-xl mb-1">
                {top3[1].avatar}
              </div>
              <span className="text-xs font-bold text-slate-900 font-mono">{top3[1].nickname}</span>
              <span className="text-xs font-extrabold text-indigo-700 font-mono mt-1">
                {top3[1].score}/{top3[1].totalQuestions} pts
              </span>
              <span className="text-[10px] text-slate-400 font-mono">{top3[1].timeSpentSeconds}s</span>
            </div>
          )}

          {/* 1st Place */}
          {top3[0] && (
            <div className="p-5 bg-amber-50 border-2 border-amber-300 rounded-2xl flex flex-col items-center shadow-md scale-105">
              <span className="text-2xl mb-1">🥇</span>
              <div className="w-12 h-12 rounded-2xl bg-white border-2 border-amber-400 flex items-center justify-center text-2xl mb-1 shadow-xs">
                {top3[0].avatar}
              </div>
              <span className="text-sm font-black text-amber-950 font-mono">{top3[0].nickname}</span>
              <span className="text-sm font-black text-amber-800 font-mono mt-1">
                {top3[0].score}/{top3[0].totalQuestions} acertos
              </span>
              <span className="text-[10px] font-bold text-amber-700 font-mono">{top3[0].timeSpentSeconds}s</span>
              <span className="mt-2 text-[10px] font-black uppercase bg-amber-200 text-amber-900 px-2 py-0.5 rounded-md">
                Campeão 🏆
              </span>
            </div>
          )}

          {/* 3rd Place */}
          {top3[2] && (
            <div className="p-4 bg-amber-50/50 border border-amber-200 rounded-2xl flex flex-col items-center">
              <span className="text-xl mb-1">🥉</span>
              <div className="w-10 h-10 rounded-xl bg-white border border-amber-200 flex items-center justify-center text-xl mb-1">
                {top3[2].avatar}
              </div>
              <span className="text-xs font-bold text-slate-900 font-mono">{top3[2].nickname}</span>
              <span className="text-xs font-extrabold text-amber-800 font-mono mt-1">
                {top3[2].score}/{top3[2].totalQuestions} pts
              </span>
              <span className="text-[10px] text-slate-400 font-mono">{top3[2].timeSpentSeconds}s</span>
            </div>
          )}
        </div>

        {/* Full Ranking Table */}
        <div className="space-y-2 text-left pt-2 border-t border-slate-100">
          <h4 className="text-xs font-extrabold text-slate-700 uppercase">Resultados Gerais</h4>
          <div className="space-y-1.5 max-h-48 overflow-y-auto">
            {sortedResults.map((res, idx) => (
              <div
                key={res.memberUid + idx}
                className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs font-bold"
              >
                <div className="flex items-center space-x-2">
                  <span className="w-5 font-mono text-slate-400">#{idx + 1}</span>
                  <span className="text-base">{res.avatar}</span>
                  <span className="font-mono text-slate-800">{res.nickname}</span>
                </div>
                <div className="text-right font-mono text-indigo-900">
                  <span>{res.score}/{res.totalQuestions} acertos</span>
                  <span className="text-[10px] text-slate-400 block">{res.timeSpentSeconds}s</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-extrabold shadow-sm transition"
          >
            Fechar Pódio
          </button>
        </div>
      </div>
    </div>
  );
};
