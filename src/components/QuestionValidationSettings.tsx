import React, { useState, useEffect } from 'react';
import { ShieldCheck, UserCheck, Sparkles, Bell, AlertTriangle, Check, Shield } from 'lucide-react';
import { ValidationSettings, QuestionValidationMode } from '../types';
import { useAuth } from '../contexts/AuthContext';

export const QuestionValidationSettings: React.FC = () => {
  const { logFamilyAudit } = useAuth();
  const [settings, setSettings] = useState<ValidationSettings>(() => {
    const saved = localStorage.getItem('estudei_validation_settings');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { }
    }
    return {
      mode: 'trust',
      notifyOnSubmission: false,
      inconsistencyAlertEnabled: true
    };
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    localStorage.setItem('estudei_validation_settings', JSON.stringify(settings));
  }, [settings]);

  const handleModeChange = (mode: QuestionValidationMode) => {
    const updated = { ...settings, mode };
    setSettings(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);

    const modeLabels: Record<QuestionValidationMode, string> = {
      trust: 'Confiança (Livre)',
      parent_approved: 'Confirmação Parental',
      ai_verified: 'Validação por IA (Gemini Vision)'
    };

    logFamilyAudit(
      'acordo_atualizado',
      `Alterou o modo de validação de questões manuais para: ${modeLabels[mode]}`
    );
  };

  const toggleNotify = () => {
    setSettings(prev => ({ ...prev, notifyOnSubmission: !prev.notifyOnSubmission }));
  };

  const toggleAlert = () => {
    setSettings(prev => ({ ...prev, inconsistencyAlertEnabled: !prev.inconsistencyAlertEnabled }));
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-indigo-100 rounded-2xl text-indigo-700">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900 font-display">
              Configurações de Validação e Antitrapaça
            </h3>
            <p className="text-xs text-slate-500">
              Defina como os exercícios manuais (caderno e livros) são validados e auditados
            </p>
          </div>
        </div>

        {savedSuccess && (
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full flex items-center space-x-1 animate-in fade-in">
            <Check className="w-3.5 h-3.5" />
            <span>Configurações Salvas</span>
          </span>
        )}
      </div>

      {/* Validation Mode Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Modo 1: Confiança */}
        <div
          onClick={() => handleModeChange('trust')}
          className={`p-4 rounded-2xl border-2 transition cursor-pointer relative flex flex-col justify-between ${
            settings.mode === 'trust'
              ? 'border-indigo-600 bg-indigo-50/40 ring-2 ring-indigo-200'
              : 'border-slate-200 bg-slate-50 hover:border-slate-300'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="p-2 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-black uppercase tracking-wider">
                Modo 1
              </span>
              {settings.mode === 'trust' && (
                <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                  <Check className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
            <h4 className="text-sm font-extrabold text-slate-900 mb-1 flex items-center space-x-1.5">
              <Shield className="w-4 h-4 text-emerald-600" />
              <span>Confiança (Padrão)</span>
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              O aluno lança livremente seus exercícios. Fortalece a autonomia e autorregulação.
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-200/60 text-[11px] font-bold text-slate-500">
            • Sem interrupções para os pais
          </div>
        </div>

        {/* Modo 2: Confirmação Parental */}
        <div
          onClick={() => handleModeChange('parent_approved')}
          className={`p-4 rounded-2xl border-2 transition cursor-pointer relative flex flex-col justify-between ${
            settings.mode === 'parent_approved'
              ? 'border-indigo-600 bg-indigo-50/40 ring-2 ring-indigo-200'
              : 'border-slate-200 bg-slate-50 hover:border-slate-300'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="p-2 bg-amber-100 text-amber-800 rounded-xl text-xs font-black uppercase tracking-wider">
                Modo 2
              </span>
              {settings.mode === 'parent_approved' && (
                <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                  <Check className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
            <h4 className="text-sm font-extrabold text-slate-900 mb-1 flex items-center space-x-1.5">
              <UserCheck className="w-4 h-4 text-amber-600" />
              <span>Aprovação Parental</span>
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Lançamentos ficam pendentes até que os pais aprovem no painel parental.
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-200/60 text-[11px] font-bold text-amber-700">
            • Controle total de dados
          </div>
        </div>

        {/* Modo 3: Validação por IA */}
        <div
          onClick={() => handleModeChange('ai_verified')}
          className={`p-4 rounded-2xl border-2 transition cursor-pointer relative flex flex-col justify-between ${
            settings.mode === 'ai_verified'
              ? 'border-indigo-600 bg-indigo-50/40 ring-2 ring-indigo-200'
              : 'border-slate-200 bg-slate-50 hover:border-slate-300'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="p-2 bg-indigo-100 text-indigo-800 rounded-xl text-xs font-black uppercase tracking-wider flex items-center space-x-1">
                <Sparkles className="w-3 h-3 text-indigo-600" />
                <span>Modo 3</span>
              </span>
              {settings.mode === 'ai_verified' && (
                <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                  <Check className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
            <h4 className="text-sm font-extrabold text-slate-900 mb-1 flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Validação por IA Gemini Vision</span>
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              O aluno tira foto da página do caderno/livro. A IA audita a resolução e aprova automaticamente se coerente.
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-200/60 text-[11px] font-bold text-indigo-700">
            • Auditoria automática por visão computacional
          </div>
        </div>
      </div>

      {/* Additional Checkboxes */}
      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={settings.notifyOnSubmission}
            onChange={toggleNotify}
            className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
          />
          <div className="flex items-center space-x-2">
            <Bell className="w-4 h-4 text-slate-500" />
            <span className="text-xs font-bold text-slate-800">
              Receber notificação a cada lançamento manual de exercícios
            </span>
          </div>
        </label>

        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={settings.inconsistencyAlertEnabled}
            onChange={toggleAlert}
            className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
          />
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-bold text-slate-800">
              Ativar alerta automático de inconsistência entre simulados/quizzes e lançamentos manuais
            </span>
          </div>
        </label>
      </div>
    </div>
  );
};
