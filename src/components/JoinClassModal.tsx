import React, { useState } from 'react';
import { Users, X, Check, Search, AlertCircle } from 'lucide-react';
import { ClassGroup, ClassMember } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface JoinClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJoined: (classGroup: ClassGroup) => void;
}

export const JoinClassModal: React.FC<JoinClassModalProps> = ({
  isOpen,
  onClose,
  onJoined
}) => {
  const { user } = useAuth();
  const [inviteCodeInput, setInviteCodeInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanCode = inviteCodeInput.trim().toUpperCase();
    if (!cleanCode) {
      setErrorMsg('Por favor, informe o código da turma.');
      return;
    }

    // Search in localStorage
    const STORAGE_KEY = 'estudei_class_groups';
    const saved = localStorage.getItem(STORAGE_KEY);
    let classes: ClassGroup[] = [];
    if (saved) {
      try { classes = JSON.parse(saved); } catch (e) { }
    }

    const found = classes.find(c => c.inviteCode.toUpperCase() === cleanCode);
    if (!found) {
      setErrorMsg('Turma não encontrada. Verifique o código e tente novamente.');
      return;
    }

    // Save member registration in localStorage
    const MEMBERS_KEY = `estudei_class_members_${found.id}`;
    const savedMembers = localStorage.getItem(MEMBERS_KEY);
    let members: ClassMember[] = [];
    if (savedMembers) {
      try { members = JSON.parse(savedMembers); } catch (e) { }
    }

    // Check if already joined
    const currentUid = user?.uid || 'guest-user';
    const existing = members.find(m => m.uid === currentUid);
    if (!existing) {
      const newMember: ClassMember = {
        id: `mem-${Date.now()}`,
        classId: found.id,
        uid: currentUid,
        nickname: user?.displayName ? `${user.displayName.split(' ')[0]}Estudioso` : 'EstudanteFocado',
        avatar: '🐯',
        joinedAt: new Date().toISOString(),
        metrics: {
          weeklyHours: 14.5,
          totalQuestions: 180,
          accuracyRate: 84,
          currentStreak: 7,
          simulationsCompleted: 3,
          trend: 'up'
        }
      };
      members.push(newMember);
      localStorage.setItem(MEMBERS_KEY, JSON.stringify(members));

      // Increment member count in class
      found.memberCount = members.length;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(classes));
    }

    onJoined(found);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden my-8">
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-5 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-indigo-600/40 rounded-2xl border border-indigo-400/30">
              <Users className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="text-base font-extrabold font-display">Entrar em uma Turma</h3>
              <p className="text-xs text-indigo-200">
                Digite o código fornecido pelo criador da turma
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl bg-slate-800/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleJoin} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs font-bold flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-extrabold text-slate-700 mb-1">
              Código de Acesso da Turma *
            </label>
            <div className="relative">
              <input
                type="text"
                value={inviteCodeInput}
                onChange={(e) => setInviteCodeInput(e.target.value)}
                placeholder="Ex: TURMA-A982X"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-extrabold text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-indigo-500 uppercase tracking-wider font-mono"
                required
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div className="pt-3 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-2xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-extrabold shadow-sm transition flex items-center space-x-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Entrar na Turma</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
