import React, { useState } from 'react';
import { useStudentList } from '../hooks/useStudentList';
import { ChevronDown, Check, UserPlus, Users, Key, Sparkles, User, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface StudentSwitcherProps {
  onOpenInviteModal?: () => void;
  compact?: boolean;
}

export const StudentSwitcher: React.FC<StudentSwitcherProps> = ({ onOpenInviteModal, compact = false }) => {
  const { students, activeStudentUid, activeStudentProfile, switchActiveStudent, familyGroup, isDemoMode } = useStudentList();
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyCode = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (familyGroup?.familyCode) {
      navigator.clipboard.writeText(familyGroup.familyCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (students.length === 0 && !isDemoMode) {
    return (
      <div className="bg-amber-950/40 border border-amber-500/30 rounded-xl px-3 py-2 flex items-center justify-between text-amber-200 text-xs">
        <div className="flex items-center space-x-2">
          <Users className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="font-semibold">Nenhum filho vinculado</span>
        </div>
        {familyGroup?.familyCode && (
          <button
            onClick={handleCopyCode}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-[11px] font-extrabold px-2.5 py-1 rounded-lg transition"
          >
            {copied ? 'Código Copiado!' : `Código: ${familyGroup.familyCode}`}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="relative inline-block text-left w-full sm:w-auto">
      {/* Active Student Pill Selector Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full sm:w-auto flex items-center justify-between space-x-3 bg-slate-950 hover:bg-slate-900 border border-amber-400/40 text-white rounded-2xl px-3.5 py-2 shadow-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-amber-400/50 ${
          isOpen ? 'ring-2 ring-amber-400/50' : ''
        }`}
      >
        <div className="flex items-center space-x-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 font-black text-sm flex items-center justify-center shrink-0 shadow-xs">
            {activeStudentProfile?.photoURL ? (
              <img src={activeStudentProfile.photoURL} alt="" className="w-8 h-8 rounded-xl object-cover" />
            ) : (
              (activeStudentProfile?.name || 'A').charAt(0).toUpperCase()
            )}
          </div>
          <div className="text-left min-w-0">
            <span className="text-[10px] text-amber-300 font-extrabold uppercase tracking-wider block">
              Aluno Ativo
            </span>
            <span className="text-xs font-bold text-slate-100 truncate block">
              {activeStudentProfile?.name || 'Selecione um filho'}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-1 shrink-0 ml-2">
          <span className="text-[10px] bg-amber-400/20 text-amber-300 font-extrabold px-2 py-0.5 rounded-full border border-amber-400/30 hidden sm:inline-block">
            {students.length} {students.length === 1 ? 'filho' : 'filhos'}
          </span>
          <ChevronDown className={`w-4 h-4 text-amber-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {/* Floating Dropdown / Account Switcher Card */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop overlay */}
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              className="absolute left-0 sm:right-0 sm:left-auto mt-2 w-full sm:w-80 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-3 z-50 space-y-3"
            >
              <div className="flex items-center justify-between px-2 pt-1 border-b border-slate-800 pb-2">
                <div className="flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-extrabold text-slate-200 uppercase tracking-wider">
                    Alternar Aluno Visualizado
                  </span>
                </div>
                {familyGroup?.familyCode && (
                  <span className="text-[10px] text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded font-mono font-bold">
                    {familyGroup.familyCode}
                  </span>
                )}
              </div>

              {/* Students List */}
              <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                {students.map((st) => {
                  const isSelected = st.uid === activeStudentUid;
                  return (
                    <button
                      key={st.uid}
                      onClick={() => {
                        switchActiveStudent(st.uid);
                        setIsOpen(false);
                      }}
                      className={`w-full text-left p-2.5 rounded-xl transition flex items-center justify-between ${
                        isSelected
                          ? 'bg-gradient-to-r from-amber-500/20 to-indigo-600/20 border border-amber-400/50 text-white'
                          : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5 min-w-0">
                        <div
                          className={`w-7 h-7 rounded-lg text-xs font-black flex items-center justify-center shrink-0 ${
                            isSelected ? 'bg-amber-400 text-slate-950' : 'bg-slate-700 text-slate-300'
                          }`}
                        >
                          {(st.name || 'A').charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0 text-left">
                          <span className="text-xs font-bold block truncate text-slate-100">
                            {st.name}
                          </span>
                          <span className="text-[10px] text-slate-400 block truncate">
                            {st.studentYear || 'Ensino Médio'}
                          </span>
                        </div>
                      </div>

                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 ml-2">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Family Invite Code Bar */}
              {familyGroup?.familyCode && (
                <div className="pt-2 border-t border-slate-800 space-y-2">
                  <div className="bg-slate-950 p-2.5 rounded-xl flex items-center justify-between border border-slate-800">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">Código da Família:</span>
                      <span className="text-xs font-mono font-extrabold text-amber-300">{familyGroup.familyCode}</span>
                    </div>
                    <button
                      onClick={handleCopyCode}
                      className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-[11px] font-extrabold px-2.5 py-1 rounded-lg transition"
                    >
                      {copied ? 'Copiado!' : 'Copiar Código'}
                    </button>
                  </div>

                  {onOpenInviteModal && (
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        onOpenInviteModal();
                      }}
                      className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold py-2 px-3 rounded-xl flex items-center justify-center space-x-2 transition"
                    >
                      <UserPlus className="w-4 h-4 text-amber-300" />
                      <span>Convidar Outro Filho / Responsável</span>
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
