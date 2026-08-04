import React, { useState } from 'react';
import {
  GraduationCap,
  ShieldCheck,
  ShieldAlert,
  Play,
  Pause,
  RotateCcw,
  Clock,
  Sparkles,
  BookOpen,
  Calculator,
  Calendar,
  Brain,
  HelpCircle,
  Palette,
  Cloud,
  Layers,
  Camera,
  Menu,
  X,
  ChevronDown,
  Plus,
  Wrench,
  MessageSquare,
  Users,
  Download,
  LogOut,
  User,
  UserCheck,
  Award,
  Trophy
} from 'lucide-react';

import { ParentGuardSettings, ThemeId } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { StudentSwitcher } from './StudentSwitcher';
import { useStudyTimer } from '../contexts/StudyTimerContext';


interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  viewMode: 'student' | 'parent';
  setViewMode: (mode: 'student' | 'parent') => void;
  timerMinutes: number;
  timerSeconds: number;
  isTimerRunning: boolean;
  onToggleTimer: () => void;
  onResetTimer: () => void;
  parentSettings: ParentGuardSettings;
  currentTheme: ThemeId;
  recoveryCount?: number;
  onOpenThemeModal: () => void;
  onOpenDriveModal?: () => void;
  onOpenSubjectModal?: () => void;
  onOpenBookScannerModal?: () => void;
  onOpenQuickTaskModal?: () => void;
  onOpenSchoolPlatformsModal?: () => void;
  onOpenTimetableModal?: () => void;
  onOpenAuthModal?: () => void;
  onOpenEditProfileModal?: () => void;
  onOpenOnboardingModal?: () => void;
  onOpenPWAModal?: () => void;
  onOpenManualModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  viewMode,
  setViewMode,
  timerMinutes,
  timerSeconds,
  isTimerRunning,
  onToggleTimer,
  onResetTimer,
  parentSettings,
  currentTheme,
  recoveryCount = 0,
  onOpenThemeModal,
  onOpenDriveModal,
  onOpenSubjectModal,
  onOpenBookScannerModal,
  onOpenQuickTaskModal,
  onOpenSchoolPlatformsModal,
  onOpenTimetableModal,
  onOpenAuthModal,
  onOpenEditProfileModal,
  onOpenOnboardingModal,
  onOpenPWAModal,
  onOpenManualModal
}) => {
  const { userProfile, familyStudents, activeStudentUid, logout, isDemoMode } = useAuth();
  const {
    isTimerRunning: isContextTimerRunning,
    formattedTime: contextFormattedTime,
    timerMode: contextTimerMode,
    cycleBlockInfo: contextBlockInfo,
    activeSubjectName: contextSubjectName,
    toggleTimer: contextToggleTimer,
    resetTimer: contextResetTimer
  } = useStudyTimer();
  const [isToolsDropdownOpen, setIsToolsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const activeStudent = (familyStudents || []).find(s => s.uid === activeStudentUid) || ((familyStudents || []).length > 0 ? familyStudents[0] : null);
  const displayName = userProfile
    ? (userProfile.role === 'student'
        ? (userProfile.name || 'Estudante')
        : (activeStudent ? `Família (${activeStudent.name || 'Estudante'})` : (userProfile.name || 'Responsável')))
    : (isDemoMode ? parentSettings.studentName : 'Estudei & Passei');

  const displaySub = userProfile
    ? (userProfile.role === 'student'
        ? userProfile.studentYear || 'Estudante'
        : (activeStudent ? activeStudent.studentYear || 'Ensino Médio' : 'Conta do Responsável'))
    : (isDemoMode ? parentSettings.studentYear : 'Gestão de Estudos');

  const formatTime = (m: number, s: number) =>
    `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;

  // 5 Pillars + Conquistas + Ranking + Manual Navigation
  const navTabs = [
    { id: 'dashboard', label: 'Painel do Dia', icon: BookOpen },
    { id: 'active-study-hub', label: 'Estudar Agora & IA', icon: Sparkles, accent: true },
    { id: 'dual-planner', label: 'Meu Plano & Currículo', icon: Calendar },
    { id: 'grade-simulator', label: 'Simulador & Avaliações', icon: Calculator },
    { id: 'spaced-revision', label: 'Revisões & Apoio', icon: Brain },
    { id: 'achievements', label: 'Minhas Conquistas', icon: Award },
    { id: 'ranking', label: 'Ranking da Turma', icon: Trophy, accent: true },
    { id: 'manual', label: 'Manual & Guia de Uso', icon: HelpCircle }
  ];


  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-md">
      {/* Top Main Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Student Profile */}
          <div
            className="flex items-center space-x-2.5 cursor-pointer shrink-0"
            onClick={() => handleTabClick('dashboard')}
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-950 border border-indigo-500/40 overflow-hidden flex items-center justify-center shadow-lg shadow-indigo-500/20 shrink-0 group relative">
              <img
                src="/app-logo.jpg"
                alt="Logo Estudei & Passei"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-white absolute inset-0 m-auto -z-10" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-white font-display">
                  Estudei & Passei
                </span>
                <span className="hidden sm:inline-block bg-amber-400/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-400/30">
                  Família
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden md:block">
                {displayName} • {displaySub}
              </p>
            </div>
          </div>

          {/* Center/Right Desktop Controls */}
          <div className="hidden lg:flex items-center space-x-3">
            {/* Discrete Recovery Alert Pill */}
            {recoveryCount > 0 && (
              <button
                onClick={() => handleTabClick('grade-simulator')}
                className="bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition shadow-xs animate-pulse"
                title="Ver Tópicos em Modo Recuperação"
              >
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <span>⚠️ {recoveryCount} {recoveryCount === 1 ? 'tópico em atenção' : 'tópicos em atenção'}</span>
              </button>
            )}

            {/* Unified Compact Timer Badge */}
            <div className="flex items-center bg-slate-800/90 border border-slate-700/80 rounded-xl px-2.5 py-1.5 space-x-2 text-xs">
              <button
                onClick={() => handleTabClick('active-study-hub')}
                className="flex items-center space-x-1.5 hover:text-indigo-300 transition text-slate-200"
                title="Clique para abrir a Tela de Estudo"
              >
                <Clock className={`w-3.5 h-3.5 ${isContextTimerRunning ? 'text-emerald-400 animate-pulse' : 'text-indigo-400'}`} />
                <span className="font-mono text-xs font-extrabold text-emerald-400 tabular-nums">
                  {contextFormattedTime || formatTime(timerMinutes, timerSeconds)}
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-indigo-950/80 text-indigo-300 border border-indigo-800/60 max-w-[90px] truncate">
                  {contextTimerMode === 'cycle' && contextBlockInfo
                    ? `Ciclo (${contextBlockInfo.blockIndex + 1}/${contextBlockInfo.totalBlocks})`
                    : 'Manual'}
                </span>
              </button>

              <div className="flex items-center space-x-1 border-l border-slate-700/80 pl-1.5">
                <button
                  onClick={contextToggleTimer || onToggleTimer}
                  className={`p-1 rounded-lg text-white transition ${
                    isContextTimerRunning ? 'bg-amber-500 hover:bg-amber-600' : 'bg-indigo-600 hover:bg-indigo-700'
                  }`}
                  title={isContextTimerRunning ? 'Pausar Cronômetro' : 'Iniciar Estudo'}
                >
                  {isContextTimerRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                </button>
                <button
                  onClick={contextResetTimer || onResetTimer}
                  className="p-1 text-slate-400 hover:text-white rounded-lg transition"
                  title="Resetar Cronômetro"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Quick Action Button (+ Lembrete) */}
            {onOpenQuickTaskModal && (
              <button
                onClick={onOpenQuickTaskModal}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition shadow-sm"
              >
                <Plus className="w-4 h-4 text-amber-300" />
                <span>+ Lembrete/Prova</span>
              </button>
            )}

            {/* PWA Install Button */}
            {onOpenPWAModal && (
              <button
                onClick={onOpenPWAModal}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition shadow-sm border border-emerald-400/40"
                title="Instalar no Celular/PC e Verificar Atualizações"
              >
                <Download className="w-4 h-4 text-amber-300" />
                <span>Instalar App / Updates</span>
              </button>
            )}

            {/* Tools Dropdown Menu */}
            <div className="relative">
              <button
                onClick={() => setIsToolsDropdownOpen(!isToolsDropdownOpen)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition"
              >
                <Wrench className="w-3.5 h-3.5 text-indigo-400" />
                <span>Ferramentas & Integrações</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isToolsDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Tools Popover Menu */}
              {isToolsDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsToolsDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-2 z-50 space-y-1 animate-in fade-in zoom-in-95">
                    {onOpenTimetableModal && (
                      <button
                        onClick={() => {
                          onOpenTimetableModal();
                          setIsToolsDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:bg-slate-800 hover:text-white flex items-center space-x-2.5 transition"
                      >
                        <Clock className="w-4 h-4 text-amber-400" />
                        <span>Grade Horária das Aulas</span>
                      </button>
                    )}

                    {onOpenSubjectModal && (
                      <button
                        onClick={() => {
                          onOpenSubjectModal();
                          setIsToolsDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:bg-slate-800 hover:text-white flex items-center space-x-2.5 transition"
                      >
                        <Layers className="w-4 h-4 text-emerald-400" />
                        <span>Gerenciar Matérias da Escola</span>
                      </button>
                    )}

                    {onOpenSchoolPlatformsModal && (
                      <button
                        onClick={() => {
                          onOpenSchoolPlatformsModal();
                          setIsToolsDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:bg-slate-800 hover:text-white flex items-center space-x-2.5 transition"
                      >
                        <MessageSquare className="w-4 h-4 text-purple-400" />
                        <span>MS Teams & Google Classroom</span>
                      </button>
                    )}

                    {onOpenBookScannerModal && (
                      <button
                        onClick={() => {
                          onOpenBookScannerModal();
                          setIsToolsDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:bg-slate-800 hover:text-white flex items-center space-x-2.5 transition"
                      >
                        <Camera className="w-4 h-4 text-amber-400" />
                        <span>Escanear Sumário de Livro (IA)</span>
                      </button>
                    )}

                    {onOpenDriveModal && (
                      <button
                        onClick={() => {
                          onOpenDriveModal();
                          setIsToolsDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:bg-slate-800 hover:text-white flex items-center space-x-2.5 transition"
                      >
                        <Cloud className="w-4 h-4 text-blue-400" />
                        <span>Sincronização Google Drive</span>
                      </button>
                    )}

                    {onOpenPWAModal && (
                      <button
                        onClick={() => {
                          onOpenPWAModal();
                          setIsToolsDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-emerald-300 hover:bg-slate-800 flex items-center space-x-2.5 transition"
                      >
                        <Download className="w-4 h-4 text-emerald-400" />
                        <span>Instalar App (Celular/PC) & Updates</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setActiveTab('manual');
                        setIsToolsDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-extrabold text-amber-300 hover:bg-slate-800 flex items-center space-x-2.5 transition"
                    >
                      <BookOpen className="w-4 h-4 text-amber-400" />
                      <span>Manual do Usuário & Central de Ajuda</span>
                    </button>

                    {onOpenOnboardingModal && (
                      <button
                        onClick={() => {
                          onOpenOnboardingModal();
                          setIsToolsDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-amber-300 hover:bg-slate-800 flex items-center space-x-2.5 transition"
                      >
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <span>Assistente de Configuração (Wizard)</span>
                      </button>
                    )}

                    <div className="border-t border-slate-800 my-1" />

                    <button
                      onClick={() => {
                        onOpenThemeModal();
                        setIsToolsDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-indigo-300 hover:bg-indigo-950/50 flex items-center space-x-2.5 transition"
                    >
                      <Palette className="w-4 h-4 text-indigo-400" />
                      <span>Personalizar Temas & Layout</span>
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Account, Edit Profile & Logout Buttons */}
            {userProfile ? (
              <div className="flex items-center space-x-2">
                <button
                  onClick={onOpenEditProfileModal}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-2 transition"
                  title="Editar Perfil"
                >
                  {userProfile.photoURL ? (
                    <img src={userProfile.photoURL} alt="Foto" className="w-4 h-4 rounded-full object-cover" />
                  ) : (
                    <User className="w-3.5 h-3.5 text-indigo-400" />
                  )}
                  <span className="max-w-[100px] truncate">{(userProfile.name || 'Usuário').split(' ')[0]}</span>
                </button>

                {onOpenAuthModal && (
                  <button
                    onClick={onOpenAuthModal}
                    className="bg-emerald-900/40 hover:bg-emerald-900/60 text-emerald-200 border border-emerald-600/40 px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1 transition"
                    title="Código Familiar e Vínculos"
                  >
                    <Users className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Família</span>
                  </button>
                )}

                <button
                  onClick={async () => {
                    await logout();
                    if (onOpenAuthModal) onOpenAuthModal();
                  }}
                  className="bg-rose-900/40 hover:bg-rose-800/60 text-rose-200 border border-rose-700/50 px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition shadow-xs"
                  title="Encerrar Sessão e Sair"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-400" />
                  <span>Sair</span>
                </button>
              </div>
            ) : (
              onOpenAuthModal && (
                <button
                  onClick={onOpenAuthModal}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-3.5 py-1.5 rounded-xl text-xs flex items-center space-x-1.5 transition shadow-sm"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Entrar / Cadastrar</span>
                </button>
              )
            )}

            {/* Mode Switcher & Topbar Student Switcher - Exclusive to Parents / Demo Mode */}
            {userProfile?.role !== 'student' && (
              <div className="flex items-center space-x-2">
                <StudentSwitcher compact />
                <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700">
                  <button
                    onClick={() => setViewMode('student')}
                    className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                      viewMode === 'student'
                        ? 'bg-indigo-600 text-white shadow'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>Aluno</span>
                  </button>
                  <button
                    onClick={() => setViewMode('parent')}
                    className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                      viewMode === 'parent'
                        ? 'bg-amber-500 text-slate-950 font-bold shadow'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Pais</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Right Controls: Timer + Menu Toggle */}
          <div className="flex lg:hidden items-center space-x-2">
            {/* Compact Mobile Timer */}
            <div className="flex items-center bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 space-x-1 text-xs">
              <span className="font-mono font-bold text-emerald-400 text-xs">
                {formatTime(timerMinutes, timerSeconds)}
              </span>
              <button
                onClick={onToggleTimer}
                className="p-1 rounded bg-indigo-600 text-white"
              >
                {isTimerRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              </button>
            </div>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition"
              aria-label="Abrir Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Main Navigation Tabs */}
      {viewMode === 'student' && (
        <div className="hidden lg:block bg-slate-950/80 border-t border-slate-800/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-1 py-1.5">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${tab.accent ? 'text-amber-300' : ''}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Mobile Drawer / Slide-Down Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-slate-950 border-t border-slate-800 p-4 space-y-5 animate-in slide-in-from-top duration-200">
          {/* Mobile Profile & Mode Switcher */}
          <div className="p-3 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-white">{displayName}</p>
                <p className="text-[10px] text-slate-400">{displaySub}</p>
              </div>

              {userProfile?.role !== 'student' && (
                <div className="flex bg-slate-800 p-1 rounded-xl">
                  <button
                    onClick={() => setViewMode('student')}
                    className={`px-2.5 py-1 text-xs font-bold rounded-lg transition ${
                      viewMode === 'student' ? 'bg-indigo-600 text-white' : 'text-slate-400'
                    }`}
                  >
                    Aluno
                  </button>
                  <button
                    onClick={() => setViewMode('parent')}
                    className={`px-2.5 py-1 text-xs font-bold rounded-lg transition ${
                      viewMode === 'parent' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'
                    }`}
                  >
                    Pais
                  </button>
                </div>
              )}
            </div>

            {userProfile && (
              <div className="flex gap-2 pt-2 border-t border-slate-800">
                <button
                  onClick={() => {
                    if (onOpenEditProfileModal) onOpenEditProfileModal();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold py-1.5 px-3 rounded-xl flex items-center justify-center space-x-1.5 border border-slate-700"
                >
                  <User className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Editar Perfil</span>
                </button>

                <button
                  onClick={async () => {
                    await logout();
                    setIsMobileMenuOpen(false);
                    if (onOpenAuthModal) onOpenAuthModal();
                  }}
                  className="bg-rose-900/40 hover:bg-rose-800/60 text-rose-200 text-xs font-bold py-1.5 px-3 rounded-xl flex items-center justify-center space-x-1.5 border border-rose-700/50"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-400" />
                  <span>Sair</span>
                </button>
              </div>
            )}
          </div>

          {/* Navigation Tabs List for Mobile */}
          {viewMode === 'student' && (
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 px-1 block">
                Navegação Principal
              </span>
              {navTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabClick(tab.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-3 transition ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4 text-amber-300" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Quick Action Tools Grid for Mobile */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 px-1 block">
              Ferramentas Rápidas
            </span>

            <div className="grid grid-cols-2 gap-2">
              {onOpenPWAModal && (
                <button
                  onClick={() => {
                    onOpenPWAModal();
                    setIsMobileMenuOpen(false);
                  }}
                  className="p-2.5 bg-emerald-600/30 border border-emerald-500/40 rounded-xl text-xs font-bold text-emerald-200 flex items-center space-x-2"
                >
                  <Download className="w-4 h-4 text-amber-300" />
                  <span>Instalar / Updates</span>
                </button>
              )}

              {onOpenQuickTaskModal && (
                <button
                  onClick={() => {
                    onOpenQuickTaskModal();
                    setIsMobileMenuOpen(false);
                  }}
                  className="p-2.5 bg-indigo-600/30 border border-indigo-500/40 rounded-xl text-xs font-bold text-indigo-200 flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4 text-amber-300" />
                  <span>+ Lembrete</span>
                </button>
              )}

              {onOpenTimetableModal && (
                <button
                  onClick={() => {
                    onOpenTimetableModal();
                    setIsMobileMenuOpen(false);
                  }}
                  className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs font-bold text-slate-200 flex items-center space-x-2"
                >
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>Grade Aulas</span>
                </button>
              )}

              {onOpenSubjectModal && (
                <button
                  onClick={() => {
                    onOpenSubjectModal();
                    setIsMobileMenuOpen(false);
                  }}
                  className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs font-bold text-slate-200 flex items-center space-x-2"
                >
                  <Layers className="w-4 h-4 text-emerald-400" />
                  <span>Matérias</span>
                </button>
              )}

              {onOpenSchoolPlatformsModal && (
                <button
                  onClick={() => {
                    onOpenSchoolPlatformsModal();
                    setIsMobileMenuOpen(false);
                  }}
                  className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs font-bold text-slate-200 flex items-center space-x-2"
                >
                  <MessageSquare className="w-4 h-4 text-purple-400" />
                  <span>MS Teams</span>
                </button>
              )}

              {onOpenBookScannerModal && (
                <button
                  onClick={() => {
                    onOpenBookScannerModal();
                    setIsMobileMenuOpen(false);
                  }}
                  className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs font-bold text-slate-200 flex items-center space-x-2"
                >
                  <Camera className="w-4 h-4 text-amber-400" />
                  <span>Scan Livro</span>
                </button>
              )}

              {onOpenDriveModal && (
                <button
                  onClick={() => {
                    onOpenDriveModal();
                    setIsMobileMenuOpen(false);
                  }}
                  className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs font-bold text-slate-200 flex items-center space-x-2"
                >
                  <Cloud className="w-4 h-4 text-blue-400" />
                  <span>Drive Nuvem</span>
                </button>
              )}

              <button
                onClick={() => {
                  setActiveTab('manual');
                  setIsMobileMenuOpen(false);
                }}
                className="p-2.5 bg-amber-500/20 border border-amber-500/40 rounded-xl text-xs font-bold text-amber-200 flex items-center space-x-2"
              >
                <HelpCircle className="w-4 h-4 text-amber-300" />
                <span>📖 Manual do App</span>
              </button>
            </div>

            <button
              onClick={() => {
                onOpenThemeModal();
                setIsMobileMenuOpen(false);
              }}
              className="w-full mt-2 p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs font-bold text-indigo-300 flex items-center justify-center space-x-2"
            >
              <Palette className="w-4 h-4 text-indigo-400" />
              <span>Personalizar Temas & Layout</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

