import React, { useState, useEffect } from 'react';
import { FamilyChallenge, UserProfile } from '../types';
import { Swords, Flame, Trophy, Plus, CheckCircle2, Clock, Award, Sparkles, Users, ArrowUpRight } from 'lucide-react';
import { collection, onSnapshot, addDoc, doc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'motion/react';

export const FamilyChallenges: React.FC = () => {
  const { familyGroup, familyStudents, userProfile, isDemoMode } = useAuth();
  const [challenges, setChallenges] = useState<FamilyChallenge[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Challenge Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'quiz_battle' | 'focus_time' | 'streak_master'>('focus_time');
  const [targetValue, setTargetValue] = useState(300);
  const [rewardBadgeName, setRewardBadgeName] = useState('Mestre do Foco');

  // Load real-time challenges from Firestore
  useEffect(() => {
    if (!familyGroup?.id || isDemoMode) {
      // Demo mock challenges
      setChallenges([
        {
          id: 'chal_demo_1',
          familyId: 'fam_demo_123',
          title: '🔥 Desafio dos Irmãos: 10 Horas de Foco na Semana',
          description: 'Acumular juntos 600 minutos de estudo para destravar a Badge Mestre do Foco!',
          type: 'focus_time',
          targetMinutes: 600,
          status: 'active',
          createdByUid: 'parent_demo_1',
          createdAt: new Date().toISOString(),
          endsAt: new Date(Date.now() + 7 * 86400000).toISOString(),
          rewardBadgeName: 'Mestre do Foco',
          participants: [
            { studentUid: 'student_demo_1', studentName: 'Lucas Toledo', progressValue: 320, completed: false },
            { studentUid: 'student_demo_2', studentName: 'Sofia Toledo', progressValue: 210, completed: false }
          ]
        }
      ]);
      return;
    }

    const colRef = collection(db, 'families', familyGroup.id, 'challenges');
    const unsubscribe = onSnapshot(colRef, (snap) => {
      const list = snap.docs.map((d) => ({ ...d.data(), id: d.id } as FamilyChallenge));
      setChallenges(list);
    });

    return () => unsubscribe();
  }, [familyGroup?.id, isDemoMode]);

  const handleCreateChallenge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const initialParticipants = (familyStudents || []).map((s) => ({
      studentUid: s.uid,
      studentName: s.name,
      progressValue: 0,
      completed: false
    }));

    const newChallenge: Omit<FamilyChallenge, 'id'> = {
      familyId: familyGroup?.id || 'fam_default',
      title: title.trim(),
      description: description.trim() || 'Desafio em família para reforçar a disciplina e o aprendizado.',
      type,
      targetMinutes: type === 'focus_time' ? Number(targetValue) : undefined,
      targetStreakDays: type === 'streak_master' ? Number(targetValue) : undefined,
      status: 'active',
      createdByUid: userProfile?.uid || 'user_anon',
      createdAt: new Date().toISOString(),
      endsAt: new Date(Date.now() + 7 * 86400000).toISOString(),
      rewardBadgeName: rewardBadgeName || 'Super Estudante',
      participants: initialParticipants
    };

    if (!isDemoMode && familyGroup?.id) {
      try {
        const colRef = collection(db, 'families', familyGroup.id, 'challenges');
        await addDoc(colRef, newChallenge);
      } catch (err) {
        console.error('Error creating challenge:', err);
      }
    } else {
      setChallenges((prev) => [{ ...newChallenge, id: `chal_${Date.now()}` }, ...prev]);
    }

    setTitle('');
    setDescription('');
    setIsModalOpen(false);
  };

  const handleUpdateProgress = async (challengeId: string, addedValue: number) => {
    if (!userProfile?.uid) return;

    const challenge = challenges.find((c) => c.id === challengeId);
    if (!challenge) return;

    const updatedParticipants = challenge.participants.map((p) => {
      if (p.studentUid === userProfile.uid) {
        const newVal = p.progressValue + addedValue;
        const target = challenge.targetMinutes || challenge.targetStreakDays || 100;
        return {
          ...p,
          progressValue: newVal,
          completed: newVal >= target
        };
      }
      return p;
    });

    if (!isDemoMode && familyGroup?.id) {
      try {
        const docRef = doc(db, 'families', familyGroup.id, 'challenges', challengeId);
        await updateDoc(docRef, { participants: updatedParticipants });
      } catch (err) {
        console.error('Error updating challenge progress:', err);
      }
    } else {
      setChallenges((prev) =>
        prev.map((c) => (c.id === challengeId ? { ...c, participants: updatedParticipants } : c))
      );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
      {/* Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-violet-900 via-purple-800 to-indigo-900 rounded-2xl p-5 text-white shadow-md">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-amber-400/20 rounded-2xl border border-amber-400/30">
            <Trophy className="w-7 h-7 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base font-extrabold font-display">Desafios & Quizzes entre Irmãos</h3>
              <span className="bg-amber-400 text-slate-950 font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase">
                Gamificação
              </span>
            </div>
            <p className="text-xs text-purple-200 mt-0.5">
              Metas colaborativas de estudo, quizzes de conhecimento e conquistas compartilhadas na família.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-extrabold px-4 py-2.5 rounded-xl shadow-md transition flex items-center justify-center space-x-2 shrink-0"
        >
          <Plus className="w-4 h-4 text-slate-950 stroke-[3]" />
          <span>Criar Novo Desafio</span>
        </button>
      </div>

      {/* Challenge List */}
      {challenges.length === 0 ? (
        <div className="text-center py-10 px-4 bg-slate-50 border border-dashed border-slate-300 rounded-2xl space-y-2">
          <Trophy className="w-10 h-10 text-slate-400 mx-auto" />
          <h4 className="text-sm font-bold text-slate-800">Nenhum Desafio Ativo</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Lance um desafio para os irmãos unirem forças ou competirem amigavelmente em horas de estudo!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {challenges.map((chal) => {
            const totalProgress = chal.participants.reduce((acc, curr) => acc + curr.progressValue, 0);
            const target = chal.targetMinutes || chal.targetStreakDays || 100;
            const collectivePercent = Math.min(100, Math.round((totalProgress / target) * 100));

            return (
              <div key={chal.id} className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
                      {chal.type === 'focus_time' ? '⏱️ Meta Coletiva' : chal.type === 'quiz_battle' ? '⚔️ Batalha Quiz' : '🔥 Ofensiva'}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900">{chal.title}</h4>
                  </div>
                  <span className="text-xs font-extrabold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200 flex items-center space-x-1">
                    <Award className="w-3.5 h-3.5 text-amber-500" />
                    <span>{chal.rewardBadgeName}</span>
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-snug">{chal.description}</p>

                {/* Progress bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] font-bold text-slate-700">
                    <span>Progresso Coletivo:</span>
                    <span className="font-mono">{totalProgress} / {target} min ({collectivePercent}%)</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-purple-600 to-indigo-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${collectivePercent}%` }}
                    />
                  </div>
                </div>

                {/* Participants */}
                <div className="space-y-2 pt-2 border-t border-slate-200">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Participantes ({chal.participants.length})
                  </span>
                  <div className="space-y-1.5">
                    {chal.participants.map((p, pIdx) => (
                      <div key={pIdx} className="flex items-center justify-between p-2 bg-white rounded-xl text-xs border border-slate-200">
                        <span className="font-bold text-slate-800">{p.studentName}</span>
                        <span className="font-mono font-extrabold text-indigo-700">{p.progressValue} min</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Log progress button */}
                <button
                  onClick={() => handleUpdateProgress(chal.id, 30)}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold py-2 rounded-xl transition flex items-center justify-center space-x-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Registrar +30 min no Desafio</span>
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal to Create Challenge */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2 text-indigo-900 font-extrabold text-sm">
                  <Trophy className="w-5 h-5 text-amber-500" />
                  <span>Criar Novo Desafio Familiar</span>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-xs font-bold">
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateChallenge} className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Título do Desafio:</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: Desafio dos 500 Minutos de Estudo"
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">Tipo de Desafio:</label>
                  <select
                    value={type}
                    onChange={(e: any) => setType(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="focus_time">⏱️ Meta de Minutos em Equipe</option>
                    <option value="quiz_battle">⚔️ Batalha de Quizzes</option>
                    <option value="streak_master">🔥 Ofensiva de Dias Consecutivos</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">Meta Numérica (ex: minutos ou dias):</label>
                  <input
                    type="number"
                    min={10}
                    max={3000}
                    value={targetValue}
                    onChange={(e) => setTargetValue(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">Nome do Badge de Recompensa:</label>
                  <input
                    type="text"
                    value={rewardBadgeName}
                    onChange={(e) => setRewardBadgeName(e.target.value)}
                    placeholder="Ex: Mestre do Foco, Campeão de Exatas..."
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">Descrição / Regras do Desafio:</label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Explique o objetivo para os filhos..."
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xs"
                  >
                    Lançar Desafio
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
