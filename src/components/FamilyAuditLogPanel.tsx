import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ShieldCheck, UserMinus, UserPlus, RefreshCw, Award, Clock } from 'lucide-react';

export const FamilyAuditLogPanel: React.FC = () => {
  const { familyAuditLogs } = useAuth();

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs">
      <div className="flex items-center space-x-3">
        <div className="p-2.5 bg-slate-900 text-amber-400 rounded-2xl">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-black text-slate-900 font-display">
            Histórico de Auditoria da Família (Audit Logs)
          </h3>
          <p className="text-xs text-slate-500">
            Registro transparente e imutável de convites, remoções, alterações e premiações
          </p>
        </div>
      </div>

      {familyAuditLogs.length === 0 ? (
        <div className="p-4 bg-slate-50 rounded-2xl text-center text-xs text-slate-500 font-medium">
          Nenhum registro de auditoria no histórico recente.
        </div>
      ) : (
        <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
          {familyAuditLogs.map((log) => {
            let IconComponent = Clock;
            let badgeBg = 'bg-slate-100 text-slate-700';

            if (log.action === 'invite_created' || log.action === 'invite_accepted') {
              IconComponent = UserPlus;
              badgeBg = 'bg-emerald-100 text-emerald-900 border border-emerald-300';
            } else if (log.action === 'member_removed') {
              IconComponent = UserMinus;
              badgeBg = 'bg-rose-100 text-rose-900 border border-rose-300';
            } else if (log.action === 'profile_reset') {
              IconComponent = RefreshCw;
              badgeBg = 'bg-amber-100 text-amber-900 border border-amber-300';
            } else if (log.action === 'reward_granted') {
              IconComponent = Award;
              badgeBg = 'bg-yellow-100 text-yellow-900 border border-yellow-400';
            }

            return (
              <div
                key={log.id}
                className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-start justify-between gap-3 text-xs"
              >
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${badgeBg}`}>
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-extrabold text-slate-900">
                        {log.actorName}
                      </span>
                      <span className="text-[10px] uppercase font-bold text-slate-400">
                        ({log.action})
                      </span>
                    </div>
                    <p className="text-slate-600 font-medium mt-0.5">{log.details}</p>
                  </div>
                </div>

                <span className="text-[10px] text-slate-400 font-mono font-semibold shrink-0">
                  {new Date(log.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
