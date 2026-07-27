import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Eye, Sparkles, UserPlus, ArrowRight, Info } from 'lucide-react';

interface DemoModeBannerProps {
  onOpenAuthModal: () => void;
}

export const DemoModeBanner: React.FC<DemoModeBannerProps> = ({ onOpenAuthModal }) => {
  const { isDemoMode, userProfile } = useAuth();

  if (!isDemoMode && userProfile) return null;

  return (
    <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-slate-950 px-4 py-2 text-xs font-bold shadow-md flex items-center justify-between flex-wrap gap-2">
      <div className="flex items-center space-x-2">
        <span className="p-1 bg-slate-950/20 rounded-lg">
          <Eye className="w-4 h-4 text-slate-950" />
        </span>
        <div>
          <span className="font-extrabold font-display">MODO DEMONSTRATIVO (DADOS FICTÍCIOS DE EXEMPLO)</span>
          <span className="hidden sm:inline font-medium opacity-90 ml-2">
            — Você está visualizando um perfil de exemplo. Ao criar sua conta real, o sistema inicia limpo para você cadastrar seus dados.
          </span>
        </div>
      </div>

      <button
        onClick={onOpenAuthModal}
        className="bg-slate-950 hover:bg-slate-900 text-amber-300 px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center space-x-1.5 transition shadow-xs"
      >
        <UserPlus className="w-3.5 h-3.5 text-amber-400" />
        <span>Criar Minha Conta Real / Entrar</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
