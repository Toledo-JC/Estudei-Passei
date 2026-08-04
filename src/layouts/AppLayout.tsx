import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Clock,
  BookOpen,
  Brain,
  RefreshCw,
  Trophy,
  FileText,
  User,
  Sparkles,
  Settings,
  Wand2,
  Palette,
  Calendar,
  Layers,
  ChevronDown,
  Sun,
  Moon,
  LogOut,
  LogIn,
  Edit3,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { CompactTimer } from '../components/navbar/CompactTimer';
import { useAuth } from '../contexts/AuthContext';
import { OnboardingWizardModal } from '../components/OnboardingWizardModal';
import { ThemeSelectorModal } from '../components/ThemeSelectorModal';
import { SubjectManagerModal } from '../components/SubjectManagerModal';
import { SchoolTimetableModal } from '../components/SchoolTimetableModal';
import { BookTocScannerModal } from '../components/BookTocScannerModal';
import { AuthModal } from '../components/AuthModal';
import { EditProfileModal } from '../components/EditProfileModal';
import { initialSubjects, initialSchoolTimetable } from '../data/initialData';
import { Subject, SchoolTimetable, ThemeId, AppLayoutType, LayoutDensity, BookScanResult } from '../types';

export interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: React.ElementType;
}

export const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { id: 'study', label: 'Estudar Agora', path: '/study', icon: Clock },
  { id: 'planner', label: 'Meu Plano', path: '/planner', icon: BookOpen },
  { id: 'simulator', label: 'Simulador', path: '/simulator', icon: Brain },
  { id: 'reviews', label: 'Revisões', path: '/reviews', icon: RefreshCw },
  { id: 'ranking', label: 'Ranking', path: '/ranking', icon: Trophy },
  { id: 'manual', label: 'Manual', path: '/manual', icon: FileText }
];

export const AppLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [activeToolModal, setActiveToolModal] = useState<string | null>(null);

  // State e Efeito para Modo Claro / Escuro (Light / Dark mode)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('estudei_theme_mode');
    if (saved) return saved === 'dark';
    return document.documentElement.classList.contains('dark');
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('estudei_theme_mode', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('estudei_theme_mode', 'light');
    }
  }, [isDarkMode]);

  // States for Ferramentas modals
  const [subjects, setSubjects] = useState<Subject[]>(() => {
    const saved = localStorage.getItem('estudei_subjects');
    return saved ? JSON.parse(saved) : initialSubjects;
  });

  const [schoolTimetable, setSchoolTimetable] = useState<SchoolTimetable>(() => {
    const saved = localStorage.getItem('estudei_schoolTimetable');
    return saved ? JSON.parse(saved) : initialSchoolTimetable;
  });

  const [currentTheme, setCurrentTheme] = useState<ThemeId>(() => {
    const saved = localStorage.getItem('estudei_theme');
    return (saved as ThemeId) || 'modern-indigo';
  });

  const [currentLayout, setCurrentLayout] = useState<AppLayoutType>(() => {
    const saved = localStorage.getItem('estudei_layout');
    return (saved as AppLayoutType) || 'bento-grid';
  });

  const [currentDensity, setCurrentDensity] = useState<LayoutDensity>(() => {
    const saved = localStorage.getItem('estudei_density');
    return (saved as LayoutDensity) || 'comfortable';
  });

  const handleUpdateSubjects = (updated: Subject[]) => {
    setSubjects(updated);
    localStorage.setItem('estudei_subjects', JSON.stringify(updated));
  };

  const handleUpdateTimetable = (updated: SchoolTimetable) => {
    setSchoolTimetable(updated);
    localStorage.setItem('estudei_schoolTimetable', JSON.stringify(updated));
  };

  const handleSelectTheme = (theme: ThemeId) => {
    setCurrentTheme(theme);
    localStorage.setItem('estudei_theme', theme);
  };

  const handleSelectLayout = (layout: AppLayoutType) => {
    setCurrentLayout(layout);
    localStorage.setItem('estudei_layout', layout);
  };

  const handleSelectDensity = (density: LayoutDensity) => {
    setCurrentDensity(density);
    localStorage.setItem('estudei_density', density);
  };

  const navigate = useNavigate();
  const location = useLocation();
  const { userProfile, currentUser, logout, isDemoMode } = useAuth();

  // Profile and Auth States
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  // Regra de Rota Ativa
  const isItemActive = (path: string) => {
    if (path === '/dashboard' && (location.pathname === '/' || location.pathname === '/dashboard')) {
      return true;
    }
    return location.pathname === path;
  };

  const handleNavClick = (path: string) => {
    setIsMobileDrawerOpen(false);
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans antialiased">
      {/* 1. HEADER FIXO (TOPO) */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 z-40 px-4 flex items-center justify-between shadow-xs">
        {/* Lado Esquerdo: Hambúrguer + Logo */}
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => {
              if (window.innerWidth < 1024) {
                setIsMobileDrawerOpen(!isMobileDrawerOpen);
              } else {
                setIsSidebarCollapsed(!isSidebarCollapsed);
              }
            }}
            className="p-2 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
            title="Alternar Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div
            onClick={() => handleNavClick('/dashboard')}
            className="flex items-center space-x-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-800 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="font-display font-black text-base text-slate-900 dark:text-white leading-tight">
                Estudei <span className="text-indigo-600 dark:text-indigo-400">&</span> Passei
              </span>
              <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">
                Estudo Inteligente
              </span>
            </div>
          </div>
        </div>

        {/* Lado Direito: CompactTimer + Toggle Modo Claro/Escuro + Dropdown Ferramentas + Avatar */}
        <div className="flex items-center space-x-2">
          <CompactTimer onOpenStudyTab={() => handleNavClick('/study')} />

          {/* Botão Rápido de Tema (Claro / Escuro) */}
          <button
            type="button"
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition border border-slate-200 dark:border-slate-700 flex items-center justify-center cursor-pointer"
            title={isDarkMode ? "Mudar para Modo Claro" : "Mudar para Modo Escuro"}
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            )}
          </button>

          {/* Botão Ferramentas Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsToolsOpen(!isToolsOpen)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition border border-slate-200 dark:border-slate-700 cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5 text-indigo-500" />
              <span className="hidden sm:inline">Ferramentas</span>
              <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isToolsOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isToolsOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsToolsOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-2 z-50 space-y-1"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setIsDarkMode(!isDarkMode);
                        setIsToolsOpen(false);
                      }}
                      className="w-full flex items-center justify-between p-2.5 text-left rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 transition"
                    >
                      <div className="flex items-center space-x-2.5">
                        {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
                        <span>{isDarkMode ? 'Alternar p/ Modo Claro' : 'Alternar p/ Modo Escuro'}</span>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                        {isDarkMode ? 'Escuro' : 'Claro'}
                      </span>
                    </button>

                    <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />

                    <button
                      type="button"
                      onClick={() => {
                        setIsToolsOpen(false);
                        setActiveToolModal('wizard');
                      }}
                      className="w-full flex items-center space-x-2.5 p-2.5 text-left rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 transition"
                    >
                      <Wand2 className="w-4 h-4 text-indigo-500" />
                      <span>🪄 Assistente Inicial (Wizard)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsToolsOpen(false);
                        setActiveToolModal('themes');
                      }}
                      className="w-full flex items-center space-x-2.5 p-2.5 text-left rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 transition"
                    >
                      <Palette className="w-4 h-4 text-emerald-500" />
                      <span>🎨 Temas & Layouts</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsToolsOpen(false);
                        setActiveToolModal('subjects');
                      }}
                      className="w-full flex items-center space-x-2.5 p-2.5 text-left rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 transition"
                    >
                      <Layers className="w-4 h-4 text-amber-500" />
                      <span>📚 Gerenciar Matérias</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsToolsOpen(false);
                        setActiveToolModal('timetable');
                      }}
                      className="w-full flex items-center space-x-2.5 p-2.5 text-left rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 transition"
                    >
                      <Calendar className="w-4 h-4 text-rose-500" />
                      <span>📅 Grade Horária</span>
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Avatar e Menu do Usuário */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setIsProfileMenuOpen(!isProfileMenuOpen);
                setIsToolsOpen(false);
              }}
              className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700/80 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700/80 transition cursor-pointer"
              title="Menu do Perfil"
            >
              <div className="w-7 h-7 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-xs overflow-hidden shrink-0">
                {userProfile?.photoURL ? (
                  <img src={userProfile.photoURL} alt={userProfile.displayName} className="w-full h-full object-cover" />
                ) : (
                  userProfile?.displayName?.[0]?.toUpperCase() || <User className="w-4 h-4" />
                )}
              </div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200 hidden md:inline max-w-[110px] truncate pr-1">
                {userProfile?.displayName || 'Usuário'}
              </span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isProfileMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsProfileMenuOpen(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-3 z-50 space-y-2"
                  >
                    {/* Card de Identificação */}
                    <div className="flex items-center space-x-3 p-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
                      <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-sm overflow-hidden shrink-0">
                        {userProfile?.photoURL ? (
                          <img src={userProfile.photoURL} alt={userProfile.displayName} className="w-full h-full object-cover" />
                        ) : (
                          userProfile?.displayName?.[0]?.toUpperCase() || <User className="w-5 h-5" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {userProfile?.displayName || 'Usuário'}
                        </p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                          {userProfile?.email || (isDemoMode ? 'Modo Demonstração' : 'Sem e-mail')}
                        </p>
                        <div className="mt-1 flex items-center gap-1.5">
                          <span className="inline-block px-2 py-0.5 text-[9px] font-extrabold rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                            {userProfile?.role === 'parent' ? 'Pai / Responsável' : 'Estudante'}
                          </span>
                          {isDemoMode && (
                            <span className="inline-block px-1.5 py-0.5 text-[9px] font-bold rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300">
                              Demo
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          setIsEditProfileOpen(true);
                        }}
                        className="w-full flex items-center space-x-2.5 p-2.5 text-left rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 transition cursor-pointer"
                      >
                        <Edit3 className="w-4 h-4 text-indigo-500" />
                        <span>✏️ Editar Perfil & Foto</span>
                      </button>

                      {currentUser && !isDemoMode ? (
                        <button
                          type="button"
                          onClick={async () => {
                            setIsProfileMenuOpen(false);
                            await logout();
                          }}
                          className="w-full flex items-center space-x-2.5 p-2.5 text-left rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-semibold text-rose-600 dark:text-rose-400 transition cursor-pointer"
                        >
                          <LogOut className="w-4 h-4 text-rose-500" />
                          <span>🚪 Sair da Conta (Logout)</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setIsProfileMenuOpen(false);
                            setIsAuthModalOpen(true);
                          }}
                          className="w-full flex items-center space-x-2.5 p-2.5 text-left rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-xs font-semibold text-indigo-600 dark:text-indigo-400 transition cursor-pointer"
                        >
                          <LogIn className="w-4 h-4 text-indigo-500" />
                          <span>🔐 Entrar / Cadastrar Conta</span>
                        </button>
                      )}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* CONTAINER PRINCIPAL */}
      <div className="flex flex-1 pt-16">
        {/* 2. SIDEBAR DESKTOP (lg:) */}
        <motion.aside
          animate={{ width: isSidebarCollapsed ? 80 : 256 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
          className="hidden lg:flex flex-col fixed left-0 top-16 bottom-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-30 shadow-xs overflow-hidden"
        >
          <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const active = isItemActive(item.path);
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.path)}
                  className={`w-full flex items-center space-x-3 px-3.5 py-3 rounded-2xl font-bold text-xs transition-all relative ${
                    active
                      ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/60 shadow-2xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  title={isSidebarCollapsed ? item.label : undefined}
                >
                  <Icon className={`w-5 h-5 shrink-0 ${active ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'}`} />

                  {!isSidebarCollapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="truncate font-semibold tracking-wide"
                    >
                      {item.label}
                    </motion.span>
                  )}

                  {active && (
                    <div className="absolute right-2 w-1.5 h-6 bg-indigo-600 dark:bg-indigo-400 rounded-full" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Botão de Toggle (Seta no Rodapé) */}
          <div className="p-3 border-t border-slate-200 dark:border-slate-800 flex justify-end">
            <button
              type="button"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="w-full flex items-center justify-center space-x-2 py-2 px-3 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
            >
              {isSidebarCollapsed ? (
                <ChevronRight className="w-5 h-5" />
              ) : (
                <>
                  <ChevronLeft className="w-5 h-5" />
                  <span className="text-xs">Recolher Menu</span>
                </>
              )}
            </button>
          </div>
        </motion.aside>

        {/* 3. DRAWER MOBILE (Abaixo de lg:) */}
        <AnimatePresence>
          {isMobileDrawerOpen && (
            <>
              {/* Overlay Escuro com Backdrop Blur */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileDrawerOpen(false)}
                className="lg:hidden fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50"
              />

              {/* Gaveta vinda da Esquerda */}
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 250 }}
                className="lg:hidden fixed top-0 left-0 bottom-0 w-72 bg-white dark:bg-slate-900 z-50 shadow-2xl flex flex-col"
              >
                {/* Header Drawer */}
                <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black">
                      <Sparkles className="w-4 h-4 text-amber-300" />
                    </div>
                    <span className="font-display font-black text-sm text-slate-900 dark:text-white">
                      Estudei & Passei
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsMobileDrawerOpen(false)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-xl transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Lista de Itens do Menu */}
                <div className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto">
                  {/* Card de Usuário no Mobile Drawer */}
                  <div className="p-3 mb-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2.5">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-sm overflow-hidden shrink-0">
                        {userProfile?.photoURL ? (
                          <img src={userProfile.photoURL} alt={userProfile.displayName} className="w-full h-full object-cover" />
                        ) : (
                          userProfile?.displayName?.[0]?.toUpperCase() || <User className="w-5 h-5" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {userProfile?.displayName || 'Usuário'}
                        </p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                          {userProfile?.email || (isDemoMode ? 'Modo Demonstração' : 'Sem e-mail')}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200 dark:border-slate-700/80">
                      <button
                        type="button"
                        onClick={() => {
                          setIsMobileDrawerOpen(false);
                          setIsEditProfileOpen(true);
                        }}
                        className="flex items-center justify-center space-x-1.5 py-2 px-2 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 transition cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-indigo-500" />
                        <span>Editar</span>
                      </button>

                      {currentUser && !isDemoMode ? (
                        <button
                          type="button"
                          onClick={async () => {
                            setIsMobileDrawerOpen(false);
                            await logout();
                          }}
                          className="flex items-center justify-center space-x-1.5 py-2 px-2 bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-300 text-xs font-bold rounded-xl border border-rose-200 dark:border-rose-800 transition cursor-pointer"
                        >
                          <LogOut className="w-3.5 h-3.5 text-rose-500" />
                          <span>Sair</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setIsMobileDrawerOpen(false);
                            setIsAuthModalOpen(true);
                          }}
                          className="flex items-center justify-center space-x-1.5 py-2 px-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer"
                        >
                          <LogIn className="w-3.5 h-3.5 text-amber-300" />
                          <span>Entrar</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {navItems.map((item) => {
                    const active = isItemActive(item.path);
                    const Icon = item.icon;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleNavClick(item.path)}
                        className={`w-full flex items-center space-x-3 px-3.5 py-3 rounded-2xl text-xs font-bold transition-all ${
                          active
                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* 5. ÁREA DE CONTEÚDO (`<Outlet />`) */}
        <main
          className={`flex-1 transition-all duration-250 pb-20 lg:pb-8 ${
            isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'
          }`}
        >
          <div className="p-4 md:p-6 max-w-7xl mx-auto">
            {children || <Outlet />}
          </div>
        </main>
      </div>

      {/* 4. BOTTOM NAVIGATION MOBILE (Abaixo de lg:) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 z-40 px-3 py-2 flex items-center justify-around shadow-lg">
        {navItems.slice(0, 3).map((item) => {
          const active = isItemActive(item.path);
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNavClick(item.path)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all ${
                active
                  ? 'text-indigo-600 dark:text-indigo-400 font-extrabold'
                  : 'text-slate-500 dark:text-slate-400 font-medium hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Icon className={`w-6 h-6 ${active ? 'text-indigo-600 dark:text-indigo-400 scale-110' : ''}`} />
              <span className="text-[10px] mt-1 tracking-tight">{item.label}</span>
            </button>
          );
        })}

        {/* Ícone de Perfil / Mais */}
        <button
          type="button"
          onClick={() => setIsMobileDrawerOpen(true)}
          className="flex flex-col items-center justify-center py-1 px-3 rounded-2xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
        >
          <User className="w-6 h-6" />
          <span className="text-[10px] mt-1 tracking-tight">Perfil</span>
        </button>
      </div>

      {/* MODAIS DO MENU FERRAMENTAS */}
      {activeToolModal === 'wizard' && (
        <OnboardingWizardModal
          isOpen={true}
          onClose={() => setActiveToolModal(null)}
          onComplete={(data) => {
            handleUpdateSubjects(data.subjects);
            localStorage.setItem('estudei_schoolConfig', JSON.stringify(data.schoolConfig));
            setActiveToolModal(null);
          }}
        />
      )}

      {activeToolModal === 'themes' && (
        <ThemeSelectorModal
          isOpen={true}
          onClose={() => setActiveToolModal(null)}
          currentTheme={currentTheme}
          onSelectTheme={handleSelectTheme}
          currentLayout={currentLayout}
          onSelectLayout={handleSelectLayout}
          currentDensity={currentDensity}
          onSelectDensity={handleSelectDensity}
          isDarkMode={isDarkMode}
          onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        />
      )}

      {activeToolModal === 'subjects' && (
        <SubjectManagerModal
          isOpen={true}
          onClose={() => setActiveToolModal(null)}
          subjects={subjects}
          onUpdateSubjects={handleUpdateSubjects}
          onOpenBookScanner={() => setActiveToolModal('bookScanner')}
        />
      )}

      {activeToolModal === 'timetable' && (
        <SchoolTimetableModal
          isOpen={true}
          onClose={() => setActiveToolModal(null)}
          subjects={subjects}
          timetable={schoolTimetable}
          onUpdateTimetable={handleUpdateTimetable}
        />
      )}

      {activeToolModal === 'bookScanner' && (
        <BookTocScannerModal
          isOpen={true}
          onClose={() => setActiveToolModal('subjects')}
          subjects={subjects}
          onAddScannedSubjectOrTopics={(targetSubjectId, scannedData) => {
            if (targetSubjectId === 'new') {
              const newSub: Subject = {
                id: `sub_${Date.now()}`,
                name: scannedData.bookTitle || 'Nova Matéria',
                category: 'Formação Geral',
                color: 'indigo',
                enabled: true,
                examScopeTopicIds: [],
                topics: scannedData.extractedTopics.map((t, idx) => ({
                  id: `top_${Date.now()}_${idx}`,
                  name: t.title,
                  taught: false,
                  confidence: 3
                }))
              };
              handleUpdateSubjects([...subjects, newSub]);
            } else {
              const updated = subjects.map(s => {
                if (s.id === targetSubjectId) {
                  return {
                    ...s,
                    topics: [
                      ...s.topics,
                      ...scannedData.extractedTopics.map((t, idx) => ({
                        id: `top_${Date.now()}_${idx}`,
                        name: t.title,
                        taught: false,
                        confidence: 3
                      }))
                    ]
                  };
                }
                return s;
              });
              handleUpdateSubjects(updated);
            }
            setActiveToolModal('subjects');
          }}
        />
      )}

      {/* MODAL DE EDIÇÃO DE PERFIL */}
      {isEditProfileOpen && (
        <EditProfileModal
          isOpen={true}
          onClose={() => setIsEditProfileOpen(false)}
        />
      )}

      {/* MODAL DE AUTENTICAÇÃO / LOGIN / LOGOUT */}
      {isAuthModalOpen && (
        <AuthModal
          isOpen={true}
          onClose={() => setIsAuthModalOpen(false)}
        />
      )}
    </div>
  );
};

export default AppLayout;
