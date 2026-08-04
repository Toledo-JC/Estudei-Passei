import React, { createContext, useContext, useState } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

interface ToastContextType {
  showToast: (title: string, message?: string, type?: ToastType) => void;
  showSuccessToast: (title: string, message?: string) => void;
  showErrorToast: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (title: string, message?: string, type: ToastType = 'success') => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newToast: ToastMessage = { id, type, title, message };
    
    setToasts(prev => [...prev.slice(-4), newToast]); // keep at most 5

    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const showSuccessToast = (title: string, message?: string) => {
    showToast(title, message, 'success');
  };

  const showErrorToast = (title: string, message?: string) => {
    showToast(title, message, 'error');
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast, showSuccessToast, showErrorToast }}>
      {children}
      {/* Fixed Toast Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2 max-w-sm w-full px-4 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-2xl shadow-xl border flex items-start space-x-3 transition-all transform animate-in slide-in-from-bottom-5 duration-300 ${
              toast.type === 'success'
                ? 'bg-slate-900 border-emerald-500/50 text-white'
                : toast.type === 'error'
                ? 'bg-slate-900 border-rose-500/50 text-white'
                : toast.type === 'warning'
                ? 'bg-slate-900 border-amber-500/50 text-white'
                : 'bg-slate-900 border-indigo-500/50 text-white'
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
              {toast.type === 'error' && <XCircle className="w-5 h-5 text-rose-400" />}
              {toast.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-400" />}
              {toast.type === 'info' && <Info className="w-5 h-5 text-indigo-400" />}
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-extrabold font-display leading-snug">
                {toast.title}
              </h4>
              {toast.message && (
                <p className="text-[11px] text-slate-300 leading-normal mt-0.5 break-words">
                  {toast.message}
                </p>
              )}
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 text-slate-400 hover:text-white rounded-lg transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    // Return fallback no-op if context is missing
    return {
      showToast: (title: string, message?: string, type?: ToastType) => console.log(`[Toast ${type}]: ${title}`, message),
      showSuccessToast: (title: string, message?: string) => console.log(`[Toast Success]: ${title}`, message),
      showErrorToast: (title: string, message?: string) => console.error(`[Toast Error]: ${title}`, message)
    };
  }
  return context;
};
