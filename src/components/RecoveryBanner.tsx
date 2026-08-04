import React from 'react';
import { Subject } from '../types';
import { ShieldAlert, HeartHandshake, CheckCircle2, Brain, ArrowRight, Sparkles } from 'lucide-react';

interface RecoveryBannerProps {
  subjects: Subject[];
  onOpenTutorForTopic?: (subjectName: string, topicName: string) => void;
  onOpenResultModalForRecovery?: (subjectId: string) => void;
  onClearRecoveryFlag?: (subjectId: string, topicId: string) => void;
}

export const RecoveryBanner: React.FC<RecoveryBannerProps> = ({
  subjects,
  onOpenTutorForTopic,
  onOpenResultModalForRecovery,
  onClearRecoveryFlag
}) => {
  // Collect all topics with needsRecovery = true
  const recoveryTopics: Array<{ subject: Subject; topic: any }> = [];

  subjects.forEach(sub => {
    (sub.topics || []).forEach(top => {
      if (top.needsRecovery) {
        recoveryTopics.push({ subject: sub, topic: top });
      }
    });
  });

  if (recoveryTopics.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-rose-900 via-amber-900 to-slate-900 rounded-3xl p-6 text-white shadow-lg space-y-4 border border-rose-500/30 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-rose-500/20 rounded-2xl border border-rose-400/30 text-rose-300">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-rose-500 text-white font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Modo Recuperação Ativo
              </span>
              <span className="text-xs text-rose-200 font-bold">
                {recoveryTopics.length} {recoveryTopics.length === 1 ? 'tópico em atenção' : 'tópicos em atenção'}
              </span>
            </div>
            <h3 className="text-lg font-bold font-display mt-0.5">
              Reforço Pedagógico sem Punição
            </h3>
            <p className="text-xs text-rose-200 mt-0.5">
              Mapeamos os conceitos que precisam de reforço. Utilize o Tutor IA e os simulados para superar estas lacunas!
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <div className="p-2.5 bg-rose-950/80 rounded-2xl border border-rose-800 text-right">
            <span className="text-[10px] text-rose-300 font-bold block uppercase">Objetivo da Semana</span>
            <span className="text-xs font-black text-amber-300">Superar {recoveryTopics.length} lacunas</span>
          </div>
        </div>
      </div>

      {/* Grid of Recovery Topics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
        {recoveryTopics.map(({ subject, topic }) => (
          <div
            key={topic.id}
            className="p-4 bg-slate-900/90 rounded-2xl border border-rose-500/30 space-y-3 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-black uppercase text-rose-400 bg-rose-950/80 px-2 py-0.5 rounded border border-rose-800">
                  {subject.name}
                </span>
                <h4 className="text-sm font-bold text-white font-display mt-1">{topic.name}</h4>
              </div>

              {onClearRecoveryFlag && (
                <button
                  onClick={() => onClearRecoveryFlag(subject.id, topic.id)}
                  className="text-[10px] bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 px-2 py-1 rounded-lg font-bold transition flex items-center space-x-1"
                  title="Marcar como superado"
                >
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Superado</span>
                </button>
              )}
            </div>

            {topic.recoveryReason && (
              <p className="text-[11px] text-rose-200 bg-rose-950/40 p-2 rounded-xl border border-rose-900/60 italic">
                📌 {topic.recoveryReason}
              </p>
            )}

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2 pt-1 border-t border-slate-800">
              {onOpenTutorForTopic && (
                <button
                  onClick={() => onOpenTutorForTopic(subject.name, topic.name)}
                  className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-[11px] font-bold transition flex items-center space-x-1"
                >
                  <Brain className="w-3.5 h-3.5 text-amber-300" />
                  <span>Explicar com IA Tutor</span>
                </button>
              )}

              {onOpenResultModalForRecovery && (
                <button
                  onClick={() => onOpenResultModalForRecovery(subject.id)}
                  className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-[11px] font-black transition flex items-center space-x-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Lançar Prova de Recuperação</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
