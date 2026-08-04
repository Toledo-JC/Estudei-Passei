import React, { useState, useEffect } from 'react';
import { ClassGroup, ClassMember, RankingCategory, RankingPeriod } from '../types';
import { RankingCard } from './RankingCard';
import { NicknameAvatarPicker } from './NicknameAvatarPicker';
import { Users, Trophy, Sparkles, Plus, Search, ShieldCheck, Share2, Copy, Flame, Award, HeartHandshake, UserPlus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface ClassRankingProps {
  onCreateClassOpen: () => void;
  onJoinClassOpen: () => void;
  onOpenOlympiads?: (classGroup: ClassGroup) => void;
}

const DEFAULT_MOCK_MEMBERS: ClassMember[] = [
  {
    id: 'm1',
    classId: 'c1',
    uid: 'u1',
    nickname: 'CorujaSábia',
    avatar: '🦉',
    joinedAt: '2026-07-01',
    metrics: { weeklyHours: 22.4, totalQuestions: 310, accuracyRate: 91, currentStreak: 14, simulationsCompleted: 5, trend: 'up' }
  },
  {
    id: 'm2',
    classId: 'c1',
    uid: 'u2',
    nickname: 'MagoDasExatas',
    avatar: '🧙‍♂️',
    joinedAt: '2026-07-02',
    metrics: { weeklyHours: 19.8, totalQuestions: 280, accuracyRate: 88, currentStreak: 12, simulationsCompleted: 4, trend: 'up' }
  },
  {
    id: 'm3',
    classId: 'c1',
    uid: 'u3',
    nickname: 'FeraDoEnem',
    avatar: '🐯',
    joinedAt: '2026-07-03',
    metrics: { weeklyHours: 17.5, totalQuestions: 240, accuracyRate: 85, currentStreak: 10, simulationsCompleted: 3, trend: 'stable' }
  },
  {
    id: 'm4',
    classId: 'c1',
    uid: 'u4',
    nickname: 'AstronautaGênio',
    avatar: '🧑‍🚀',
    joinedAt: '2026-07-05',
    metrics: { weeklyHours: 14.2, totalQuestions: 195, accuracyRate: 82, currentStreak: 8, simulationsCompleted: 2, trend: 'down' }
  },
  {
    id: 'm5',
    classId: 'c1',
    uid: 'u5',
    nickname: 'NinjaFocado',
    avatar: '🥷',
    joinedAt: '2026-07-08',
    metrics: { weeklyHours: 11.0, totalQuestions: 150, accuracyRate: 79, currentStreak: 5, simulationsCompleted: 1, trend: 'stable' }
  }
];

export const ClassRanking: React.FC<ClassRankingProps> = ({
  onCreateClassOpen,
  onJoinClassOpen,
  onOpenOlympiads
}) => {
  const { user } = useAuth();
  const [classes, setClasses] = useState<ClassGroup[]>([]);
  const [activeClassId, setActiveClassId] = useState<string>('');
  const [members, setMembers] = useState<ClassMember[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<RankingCategory>('hours');
  const [selectedPeriod, setSelectedPeriod] = useState<RankingPeriod>('weekly');
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);

  // Current user's anonymous profile
  const [userNickname, setUserNickname] = useState(() => {
    return localStorage.getItem('estudei_user_nickname') || 'EstudanteFocado';
  });
  const [userAvatar, setUserAvatar] = useState(() => {
    return localStorage.getItem('estudei_user_avatar') || '🐯';
  });

  const loadClasses = () => {
    const STORAGE_KEY = 'estudei_class_groups';
    const saved = localStorage.getItem(STORAGE_KEY);
    let list: ClassGroup[] = [];
    if (saved) {
      try { list = JSON.parse(saved); } catch (e) { }
    }

    if (list.length === 0) {
      // Seed default sample class if none
      const sampleClass: ClassGroup = {
        id: 'c1',
        name: 'Feras do 3º Ano A - Vestibulares 2027',
        createdByUid: 'system',
        createdByName: 'Coordenadoria Pedagógica',
        inviteCode: 'TURMA-MED27',
        categories: ['hours', 'questions', 'accuracy', 'streak', 'simulations'],
        createdAt: new Date().toISOString(),
        isActive: true,
        memberCount: 5
      };
      list = [sampleClass];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    }

    setClasses(list);
    if (!activeClassId || !list.find(c => c.id === activeClassId)) {
      setActiveClassId(list[0].id);
    }
  };

  const loadClassMembers = (classId: string) => {
    const MEMBERS_KEY = `estudei_class_members_${classId}`;
    const saved = localStorage.getItem(MEMBERS_KEY);
    let list: ClassMember[] = [];
    if (saved) {
      try { list = JSON.parse(saved); } catch (e) { }
    }

    if (list.length === 0) {
      list = DEFAULT_MOCK_MEMBERS;
      localStorage.setItem(MEMBERS_KEY, JSON.stringify(list));
    }

    // Ensure current user is in list
    const currentUid = user?.uid || 'guest-user';
    const existing = list.find(m => m.uid === currentUid);
    if (existing) {
      existing.nickname = userNickname;
      existing.avatar = userAvatar;
    } else {
      const selfMember: ClassMember = {
        id: `m-self-${Date.now()}`,
        classId,
        uid: currentUid,
        nickname: userNickname,
        avatar: userAvatar,
        joinedAt: new Date().toISOString(),
        metrics: {
          weeklyHours: 16.2,
          totalQuestions: 220,
          accuracyRate: 86,
          currentStreak: 9,
          simulationsCompleted: 3,
          trend: 'up'
        }
      };
      list.push(selfMember);
    }

    setMembers(list);
  };

  useEffect(() => {
    loadClasses();
  }, []);

  useEffect(() => {
    if (activeClassId) {
      loadClassMembers(activeClassId);
    }
  }, [activeClassId, userNickname, userAvatar]);

  const handleSaveProfile = (nick: string, av: string) => {
    setUserNickname(nick);
    setUserAvatar(av);
    localStorage.setItem('estudei_user_nickname', nick);
    localStorage.setItem('estudei_user_avatar', av);
    setShowProfileEdit(false);
  };

  const activeClass = classes.find(c => c.id === activeClassId) || classes[0];

  // Sort members according to selected category
  const sortedMembers = [...members].sort((a, b) => {
    switch (selectedCategory) {
      case 'hours':
        return b.metrics.weeklyHours - a.metrics.weeklyHours;
      case 'questions':
        return b.metrics.totalQuestions - a.metrics.totalQuestions;
      case 'accuracy':
        return b.metrics.accuracyRate - a.metrics.accuracyRate;
      case 'streak':
        return b.metrics.currentStreak - a.metrics.currentStreak;
      case 'simulations':
        return b.metrics.simulationsCompleted - a.metrics.simulationsCompleted;
      default:
        return b.metrics.weeklyHours - a.metrics.weeklyHours;
    }
  });

  const filteredMembers = sortedMembers.filter(m =>
    m.nickname.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const topThree = sortedMembers.slice(0, 3);
  const currentUid = user?.uid || 'guest-user';

  const handleCopyCode = () => {
    if (!activeClass) return;
    navigator.clipboard.writeText(activeClass.inviteCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Healthy Competition Motivational Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 text-white border border-indigo-900/50 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 bg-indigo-500/20 border border-indigo-400/30 px-3 py-1 rounded-full text-xs font-bold text-indigo-300">
              <HeartHandshake className="w-3.5 h-3.5 text-amber-300" />
              <span>Cultura de Estudo Cooperativa</span>
            </div>
            <h2 className="text-xl md:text-2xl font-black font-display tracking-tight">
              Seu valor não está na sua posição, mas no seu esforço diário. 🚀
            </h2>
            <p className="text-xs text-indigo-200 max-w-xl leading-relaxed">
              Competir para crescer, não para se comparar. Todos os perfis são 100% anônimos com nicknames e avatares divertidos.
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => setShowProfileEdit(!showProfileEdit)}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-2xl text-xs font-extrabold transition flex items-center space-x-2"
            >
              <span className="text-base">{userAvatar}</span>
              <span>Meu Apelido: {userNickname}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal if toggled */}
      {showProfileEdit && (
        <NicknameAvatarPicker
          currentNickname={userNickname}
          currentAvatar={userAvatar}
          userRealName={user?.displayName || ''}
          onSave={handleSaveProfile}
        />
      )}

      {/* Class Selector & Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-slate-200 shadow-xs">
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 max-w-full">
          <Users className="w-5 h-5 text-indigo-600 shrink-0 ml-1" />
          <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider shrink-0 mr-1">Turmas:</span>

          {classes.map(c => (
            <button
              key={c.id}
              onClick={() => setActiveClassId(c.id)}
              className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition shrink-0 ${
                c.id === activeClassId
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {c.name} ({c.memberCount || 5})
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={onJoinClassOpen}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-2xl text-xs font-bold transition flex items-center space-x-1.5"
          >
            <UserPlus className="w-4 h-4 text-indigo-600" />
            <span>Entrar com Código</span>
          </button>

          <button
            onClick={onCreateClassOpen}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-extrabold transition flex items-center space-x-1.5 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Criar Turma</span>
          </button>
        </div>
      </div>

      {activeClass && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
          {/* Header of Active Class */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-black text-slate-900 font-display">
                  {activeClass.name}
                </h3>
                <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-[11px] font-extrabold">
                  Ativa
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Código de Acesso: <code className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">{activeClass.inviteCode}</code>
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleCopyCode}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center space-x-1"
              >
                <Share2 className="w-3.5 h-3.5 text-indigo-600" />
                <span>{copiedCode ? 'Código Copiado!' : 'Convidar Colegas'}</span>
              </button>

              {onOpenOlympiads && (
                <button
                  onClick={() => onOpenOlympiads(activeClass)}
                  className="px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-extrabold transition flex items-center space-x-1.5 shadow-xs"
                >
                  <Trophy className="w-4 h-4 text-slate-950" />
                  <span>Olimpíadas de Estudo</span>
                </button>
              )}
            </div>
          </div>

          {/* Metric Category Tabs */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 border-b border-slate-100">
            <button
              onClick={() => setSelectedCategory('hours')}
              className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition shrink-0 flex items-center space-x-1.5 ${
                selectedCategory === 'hours'
                  ? 'bg-indigo-50 text-indigo-950 border border-indigo-200 font-black'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span>⏱️ Horas de Estudo</span>
            </button>

            <button
              onClick={() => setSelectedCategory('questions')}
              className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition shrink-0 flex items-center space-x-1.5 ${
                selectedCategory === 'questions'
                  ? 'bg-indigo-50 text-indigo-950 border border-indigo-200 font-black'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span>📝 Questões Resolvidas</span>
            </button>

            <button
              onClick={() => setSelectedCategory('accuracy')}
              className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition shrink-0 flex items-center space-x-1.5 ${
                selectedCategory === 'accuracy'
                  ? 'bg-indigo-50 text-indigo-950 border border-indigo-200 font-black'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span>🎯 Taxa de Acertos %</span>
            </button>

            <button
              onClick={() => setSelectedCategory('streak')}
              className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition shrink-0 flex items-center space-x-1.5 ${
                selectedCategory === 'streak'
                  ? 'bg-indigo-50 text-indigo-950 border border-indigo-200 font-black'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span>🔥 Streak Diário</span>
            </button>

            <button
              onClick={() => setSelectedCategory('simulations')}
              className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition shrink-0 flex items-center space-x-1.5 ${
                selectedCategory === 'simulations'
                  ? 'bg-indigo-50 text-indigo-950 border border-indigo-200 font-black'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span>🏆 Simulados</span>
            </button>
          </div>

          {/* Top 3 Podium Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {/* 2nd Place Silver */}
            {topThree[1] && (
              <div className="p-5 bg-gradient-to-b from-slate-100 to-slate-50 rounded-3xl border border-slate-200 text-center flex flex-col items-center justify-center relative order-2 md:order-1">
                <span className="text-2xl mb-1">🥈</span>
                <div className="w-12 h-12 rounded-2xl bg-white border border-slate-300 flex items-center justify-center text-2xl shadow-xs mb-2">
                  {topThree[1].avatar}
                </div>
                <h4 className="text-sm font-extrabold text-slate-900 font-mono">
                  {topThree[1].nickname}
                </h4>
                <span className="text-xs font-black text-indigo-700 font-mono mt-1">
                  {selectedCategory === 'hours' && `${topThree[1].metrics.weeklyHours}h`}
                  {selectedCategory === 'questions' && `${topThree[1].metrics.totalQuestions} qst`}
                  {selectedCategory === 'accuracy' && `${topThree[1].metrics.accuracyRate}%`}
                  {selectedCategory === 'streak' && `${topThree[1].metrics.currentStreak}d`}
                  {selectedCategory === 'simulations' && `${topThree[1].metrics.simulationsCompleted} sim`}
                </span>
                <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase">2º Lugar</span>
              </div>
            )}

            {/* 1st Place Gold */}
            {topThree[0] && (
              <div className="p-6 bg-gradient-to-b from-amber-100 via-amber-50 to-amber-100/40 rounded-3xl border-2 border-amber-300 text-center flex flex-col items-center justify-center relative shadow-md order-1 md:order-2 -translate-y-1">
                <span className="text-3xl mb-1">🥇</span>
                <div className="w-14 h-14 rounded-2xl bg-white border-2 border-amber-400 flex items-center justify-center text-3xl shadow-sm mb-2">
                  {topThree[0].avatar}
                </div>
                <h4 className="text-base font-black text-amber-950 font-mono">
                  {topThree[0].nickname}
                </h4>
                <span className="text-sm font-black text-amber-800 font-mono mt-1">
                  {selectedCategory === 'hours' && `${topThree[0].metrics.weeklyHours}h de estudo`}
                  {selectedCategory === 'questions' && `${topThree[0].metrics.totalQuestions} questões`}
                  {selectedCategory === 'accuracy' && `${topThree[0].metrics.accuracyRate}% de precisão`}
                  {selectedCategory === 'streak' && `${topThree[0].metrics.currentStreak} dias seguidos 🔥`}
                  {selectedCategory === 'simulations' && `${topThree[0].metrics.simulationsCompleted} simulados`}
                </span>
                <span className="text-[10px] font-black text-amber-800 mt-1 uppercase tracking-widest bg-amber-200/80 px-3 py-0.5 rounded-full">
                  Líder Atual
                </span>
              </div>
            )}

            {/* 3rd Place Bronze */}
            {topThree[2] && (
              <div className="p-5 bg-gradient-to-b from-amber-500/10 to-amber-500/5 rounded-3xl border border-amber-200 text-center flex flex-col items-center justify-center relative order-3">
                <span className="text-2xl mb-1">🥉</span>
                <div className="w-12 h-12 rounded-2xl bg-white border border-amber-300 flex items-center justify-center text-2xl shadow-xs mb-2">
                  {topThree[2].avatar}
                </div>
                <h4 className="text-sm font-extrabold text-slate-900 font-mono">
                  {topThree[2].nickname}
                </h4>
                <span className="text-xs font-black text-amber-900 font-mono mt-1">
                  {selectedCategory === 'hours' && `${topThree[2].metrics.weeklyHours}h`}
                  {selectedCategory === 'questions' && `${topThree[2].metrics.totalQuestions} qst`}
                  {selectedCategory === 'accuracy' && `${topThree[2].metrics.accuracyRate}%`}
                  {selectedCategory === 'streak' && `${topThree[2].metrics.currentStreak}d`}
                  {selectedCategory === 'simulations' && `${topThree[2].metrics.simulationsCompleted} sim`}
                </span>
                <span className="text-[10px] font-bold text-amber-800 mt-1 uppercase">3º Lugar</span>
              </div>
            )}
          </div>

          {/* Search Input & Full Leaderboard */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                Classificação Geral ({members.length} Alunos)
              </h4>

              <div className="relative w-48">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar apelido..."
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-indigo-500"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              </div>
            </div>

            <div className="space-y-2">
              {filteredMembers.map((m, idx) => {
                const actualRank = sortedMembers.findIndex(sm => sm.id === m.id) + 1;
                return (
                  <RankingCard
                    key={m.id}
                    member={m}
                    rank={actualRank}
                    category={selectedCategory}
                    isCurrentUser={m.uid === currentUid}
                  />
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
