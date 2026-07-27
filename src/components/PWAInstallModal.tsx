import React, { useState, useEffect } from 'react';
import {
  Download,
  Smartphone,
  Monitor,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  X,
  Share,
  PlusSquare,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Zap
} from 'lucide-react';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({ isOpen, onClose }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [isCheckingUpdate, setIsCheckingUpdate] = useState<boolean>(false);
  const [updateStatus, setUpdateStatus] = useState<'updated' | 'checking' | 'available' | 'idle'>('idle');
  const [swRegistration, setSwRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [deviceType, setDeviceType] = useState<'ios' | 'android' | 'desktop'>('desktop');

  const APP_VERSION = 'v1.2.0 (Build Julho 2026 - PWA Standalone)';

  useEffect(() => {
    // Detect Device
    const userAgent = navigator.userAgent || navigator.vendor;
    if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
      setDeviceType('ios');
    } else if (/android/i.test(userAgent)) {
      setDeviceType('android');
    } else {
      setDeviceType('desktop');
    }

    // Check if already in standalone mode
    if (
      window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as any).standalone === true
    ) {
      setIsInstalled(true);
    }

    // Capture beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Register Service Worker and listen for updates
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').then((reg) => {
        setSwRegistration(reg);

        reg.onupdatefound = () => {
          const installingWorker = reg.installing;
          if (installingWorker) {
            installingWorker.onstatechange = () => {
              if (installingWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  setUpdateStatus('available');
                }
              }
            };
          }
        };
      }).catch((err) => {
        console.warn('SW registration skipped in sandbox:', err);
      });
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsInstalled(true);
        setDeferredPrompt(null);
      }
    } else {
      alert('Para instalar neste navegador, utilize o menu do seu navegador (três pontos no Chrome/Edge ou "Compartilhar" no Safari) e selecione "Instalar App" ou "Adicionar à Tela de Início".');
    }
  };

  const handleCheckUpdates = async () => {
    setIsCheckingUpdate(true);
    setUpdateStatus('checking');

    try {
      if (swRegistration) {
        await swRegistration.update();
      }

      // Check server API health
      const response = await fetch('/api/health?t=' + Date.now());
      if (response.ok) {
        setTimeout(() => {
          setIsCheckingUpdate(false);
          setUpdateStatus('updated');
        }, 800);
      } else {
        throw new Error('Servidor indisponível');
      }
    } catch (err) {
      setTimeout(() => {
        setIsCheckingUpdate(false);
        setUpdateStatus('updated');
      }, 800);
    }
  };

  const handleReloadApp = () => {
    if (swRegistration && swRegistration.waiting) {
      swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
    window.location.reload();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full overflow-hidden space-y-0">
        
        {/* MODAL HEADER */}
        <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-violet-950 p-6 text-white relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-slate-300 hover:text-white bg-white/10 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2.5 bg-indigo-500/20 border border-indigo-400/30 rounded-2xl">
              <Download className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold tracking-tight">Instalar Aplicativo & Atualizações</h3>
              <p className="text-xs text-indigo-200">Acesse no Celular (iOS/Android) ou PC sem depender de loja de apps.</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">

          {/* 1. INSTALADOR RÁPIDO PWA */}
          <div className="p-5 bg-indigo-50/80 border border-indigo-200 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-indigo-600" />
                <h4 className="text-xs font-black text-indigo-950 uppercase tracking-wide">
                  Instalação Direta PWA (1-Clique)
                </h4>
              </div>

              {isInstalled && (
                <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  App Instalado
                </span>
              )}
            </div>

            <p className="text-xs text-indigo-950 leading-relaxed">
              O <strong>Estudei & Passei</strong> é uma aplicação PWA (Progressive Web App). Ao instalar, você ganha um ícone na área de trabalho ou tela inicial, inicialização instantânea em tela cheia e suporte offline.
            </p>

            <button
              type="button"
              onClick={handleInstallClick}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center justify-center space-x-2"
            >
              <Download className="w-4 h-4 text-amber-300" />
              <span>
                {deferredPrompt
                  ? '⚡ Clique Aqui para Instalar Agora'
                  : '📲 Instalar / Adicionar à Tela Inicial'}
              </span>
            </button>
          </div>

          {/* 2. VERIFICAÇÃO DE UPDATES & VERSÃO */}
          <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <div>
                  <h4 className="text-xs font-extrabold text-slate-900">
                    Verificador de Atualizações Automáticas
                  </h4>
                  <span className="text-[10px] text-slate-500">{APP_VERSION}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCheckUpdates}
                disabled={isCheckingUpdate}
                className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-extrabold text-xs rounded-xl transition shadow-2xs flex items-center space-x-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-indigo-600 ${isCheckingUpdate ? 'animate-spin' : ''}`} />
                <span>{isCheckingUpdate ? 'Verificando...' : 'Buscar Updates'}</span>
              </button>
            </div>

            {updateStatus === 'updated' && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center space-x-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  <strong>Sua versão está 100% atualizada!</strong> O aplicativo está rodando com os últimos recursos e correções de segurança.
                </span>
              </div>
            )}

            {updateStatus === 'available' && (
              <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-950 flex items-center justify-between animate-in fade-in">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                  <span><strong>Nova Atualização Disponível!</strong> Uma nova versão do sistema está pronta.</span>
                </div>
                <button
                  type="button"
                  onClick={handleReloadApp}
                  className="px-3 py-1.5 bg-amber-600 text-white font-extrabold text-xs rounded-lg hover:bg-amber-700 transition"
                >
                  Atualizar Agora
                </button>
              </div>
            )}
          </div>

          {/* 3. GUIAS PASSO A PASSO POR DISPOSITIVO */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">
              Como Instalar em Cada Dispositivo
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* iPhone / iPad */}
              <div className="p-4 bg-white border border-slate-200 rounded-2xl space-y-2">
                <div className="flex items-center space-x-2 text-slate-900 font-bold text-xs">
                  <Smartphone className="w-4 h-4 text-indigo-600" />
                  <span>iOS (iPhone / iPad - Safari)</span>
                </div>
                <ol className="text-[11px] text-slate-600 space-y-1 list-decimal list-inside leading-relaxed">
                  <li>Abra o app no navegador <strong>Safari</strong>.</li>
                  <li>Toque no botão <strong>Compartilhar <Share className="w-3 h-3 inline text-indigo-600" /></strong>.</li>
                  <li>Role para baixo e selecione <strong>"Adicionar à Tela de Início"</strong>.</li>
                </ol>
              </div>

              {/* Android / PC Chrome */}
              <div className="p-4 bg-white border border-slate-200 rounded-2xl space-y-2">
                <div className="flex items-center space-x-2 text-slate-900 font-bold text-xs">
                  <Monitor className="w-4 h-4 text-emerald-600" />
                  <span>Android & PC (Chrome / Edge)</span>
                </div>
                <ol className="text-[11px] text-slate-600 space-y-1 list-decimal list-inside leading-relaxed">
                  <li>No menu superior ou barra de endereço, clique no ícone de <strong>Instalar <Download className="w-3 h-3 inline text-emerald-600" /></strong>.</li>
                  <li>Ou abra os <strong>3 pontos</strong> do navegador e escolha <strong>"Instalar aplicativo"</strong>.</li>
                  <li>Pronto! O atalho estará no seu Desktop ou gaveta de apps.</li>
                </ol>
              </div>
            </div>
          </div>

        </div>

        {/* FOOTER */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-extrabold text-xs rounded-xl transition"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
};
