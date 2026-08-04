import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { SchoolConfigSection } from './components/SchoolConfigSection';
import { DualPlannerSection } from './components/DualPlannerSection';
import { DailyTimerSection } from './components/DailyTimerSection';
import { GradeManagerSection } from './components/GradeManagerSection';
import { AITutorSection } from './components/AITutorSection';
import { SpacedRevisionSection } from './components/SpacedRevisionSection';
import { ParentDashboardSection } from './components/ParentDashboardSection';
import { ThemeSelectorModal } from './components/ThemeSelectorModal';
import { DashboardLayoutManager } from './components/DashboardLayoutManager';
import { GoogleDriveSyncModal } from './components/GoogleDriveSyncModal';
import { SubjectManagerModal } from './components/SubjectManagerModal';
import { BookTocScannerModal } from './components/BookTocScannerModal';
import { QuickAddTaskModal } from './components/QuickAddTaskModal';
import { SchoolPlatformsIntegrationModal } from './components/SchoolPlatformsIntegrationModal';
import { StudentTasksWidgetSection } from './components/StudentTasksWidgetSection';
import { SchoolTimetableModal } from './components/SchoolTimetableModal';
import { AdaptiveStudyCycleSection } from './components/AdaptiveStudyCycleSection';
import { ActiveStudyHubSection } from './components/ActiveStudyHubSection';
import { AuthModal } from './components/AuthModal';
import { EditProfileModal } from './components/EditProfileModal';
import { DemoModeBanner } from './components/DemoModeBanner';
import { OnboardingWizardModal } from './components/OnboardingWizardModal';
import { PWAInstallModal } from './components/PWAInstallModal';
import { UserManualModal } from './components/UserManualModal';
import { RecoveryBanner } from './components/RecoveryBanner';
import { ExamPrepPlan } from './components/ExamPrepPlan';
import { UpcomingExamsAlertModal } from './components/UpcomingExamsAlertModal';
import { UserManualPage } from './components/UserManualPage';
import { AchievementsWall } from './components/AchievementsWall';
import { ClassRanking } from './components/ClassRanking';
import { CreateClassModal } from './components/CreateClassModal';
import { JoinClassModal } from './components/JoinClassModal';
import { OlympiadManager } from './components/OlympiadManager';
import { DailyPlanProgress } from './components/DailyPlanProgress';
import { CycleDashboard } from './components/CycleDashboard';
import { DailyPlanGeneratorModal } from './components/DailyPlanGeneratorModal';
import { StudySession } from './components/StudySession';
import { CycleSession } from './components/CycleSession';
import { ExternalActivityForm } from './components/ExternalActivityForm';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AppLayout } from './layouts/AppLayout';
import { StudyScreen } from './pages/StudyScreen';
import { Dashboard } from './pages/Dashboard';
import { ClassGroup } from './types';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { StudyTimerProvider } from './contexts/StudyTimerContext';

import { useStudentFirestoreSync } from './hooks/useStudentFirestoreSync';
import { useDailyPlan } from './hooks/useDailyPlan';
import { useActivityTracker } from './hooks/useActivityTracker';
import { Sparkles, RefreshCw, X } from 'lucide-react';

import {
  initialSchoolConfig,
  initialSubjects,
  initialEvaluations,
  initialStudyLogs,
  initialSpacedRevisions,
  initialParentSettings,
  cleanParentSettings,
  initialSchoolTimetable
} from './data/initialData';

import {
  SchoolConfig,
  Subject,
  Evaluation,
  StudySessionLog,
  SpacedRevision,
  ParentGuardSettings,
  ThemeId,
  LayoutDensity,
  AppLayoutType,
  GoogleDriveSyncInfo,
  BookScanResult,
  StudentTaskItem,
  SchoolTimetable
} from './types';

import {
  BookOpen,
  GraduationCap,
  Calculator,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Award,
  ChevronRight,
  Brain,
  Sliders,
  Flame,
  Palette
} from 'lucide-react';

function MainAppContent() {
  const { userProfile, familyStudents, activeStudentUid, isDemoMode } = useAuth();

  // Navigation & Modals States
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  useEffect(() => {
    const rawPath = location.pathname.replace('/', '');
    if (rawPath === 'study') {
      setActiveTab('study');
    } else if (rawPath === 'planner') {
      setActiveTab('dual-planner');
    } else if (rawPath === 'simulator') {
      setActiveTab('grade-simulator');
    } else if (rawPath === 'reviews') {
      setActiveTab('spaced-revision');
    } else if (rawPath === 'ranking') {
      setActiveTab('ranking');
    } else if (rawPath === 'manual') {
      setActiveTab('manual');
    } else if (rawPath === 'dashboard' || rawPath === '') {
      setActiveTab('dashboard');
    }
  }, [location.pathname]);
  const [viewMode, setViewMode] = useState<'student' | 'parent'>('student');

  // Guard role-based viewMode exclusivity (Students cannot access Parent view)
  useEffect(() => {
    if (userProfile?.role === 'student') {
      if (viewMode !== 'student') setViewMode('student');
    } else if (userProfile?.role === 'parent') {
      if (!sessionStorage.getItem('estudei_view_mode_set')) {
        setViewMode('parent');
        sessionStorage.setItem('estudei_view_mode_set', 'true');
      }
    }
  }, [userProfile?.role, viewMode]);
  const [showConfigModal, setShowConfigModal] = useState<boolean>(false);
  const [showThemeModal, setShowThemeModal] = useState<boolean>(false);
  const [showDriveModal, setShowDriveModal] = useState<boolean>(false);
  const [showSubjectModal, setShowSubjectModal] = useState<boolean>(false);
  const [showBookScannerModal, setShowBookScannerModal] = useState<boolean>(false);
  const [showQuickTaskModal, setShowQuickTaskModal] = useState<boolean>(false);
  const [showSchoolPlatformsModal, setShowSchoolPlatformsModal] = useState<boolean>(false);
  const [showTimetableModal, setShowTimetableModal] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState<boolean>(false);
  const [showOnboardingModal, setShowOnboardingModal] = useState<boolean>(false);
  const [showPWAModal, setShowPWAModal] = useState<boolean>(false);
  const [showManualModal, setShowManualModal] = useState<boolean>(false);
  const [showCreateClassModal, setShowCreateClassModal] = useState<boolean>(false);
  const [showJoinClassModal, setShowJoinClassModal] = useState<boolean>(false);
  const [activeOlympiadClassGroup, setActiveOlympiadClassGroup] = useState<ClassGroup | null>(null);
  const [updateAvailable, setUpdateAvailable] = useState<boolean>(false);

  const [latestServerVersion, setLatestServerVersion] = useState<string>('1.3.0');

  // Service Worker and Version Checker for updates / new commits
  useEffect(() => {
    let isMounted = true;

    const checkServerVersion = async () => {
      try {
        const res = await fetch('/api/version?t=' + Date.now());
        if (res.ok) {
          const data = await res.json();
          const serverVer = data.version || '1.3.0';
          if (isMounted) setLatestServerVersion(serverVer);

          const storedVersion = localStorage.getItem('estudei_app_version');
          const dismissedVersion = sessionStorage.getItem('dismissed_update_version');

          if (!storedVersion) {
            localStorage.setItem('estudei_app_version', serverVer);
          } else if (storedVersion !== serverVer && dismissedVersion !== serverVer) {
            if (isMounted) setUpdateAvailable(true);
          }
        }
      } catch (e) {
        // Silent catch
      }
    };

    const timer = setTimeout(checkServerVersion, 2000);
    const interval = setInterval(checkServerVersion, 600000); // 10 min

    return () => {
      isMounted = false;
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  const handleReloadApp = () => {
    if (latestServerVersion) {
      localStorage.setItem('estudei_app_version', latestServerVersion);
      sessionStorage.setItem('dismissed_update_version', latestServerVersion);
    }
    setUpdateAvailable(false);
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const registration of registrations) {
          registration.unregister();
        }
        window.location.reload();
      }).catch(() => {
        window.location.reload();
      });
    } else {
      window.location.reload();
    }
  };

  const handleDismissUpdate = () => {
    setUpdateAvailable(false);
    if (latestServerVersion) {
      sessionStorage.setItem('dismissed_update_version', latestServerVersion);
    }
  };

  // School Timetable State (Grade Horária Escolar Semanal)
  const [schoolTimetable, setSchoolTimetable] = useState<SchoolTimetable>(() => {
    const saved = localStorage.getItem('estudei_schoolTimetable');
    if (saved) return JSON.parse(saved);
    return initialSchoolTimetable;
  });

  // Student Tasks & Reminders State (Provas, Trabalhos, Exercícios, MS Teams)
  const [studentTasks, setStudentTasks] = useState<StudentTaskItem[]>(() => {
    const saved = localStorage.getItem('estudei_tasks');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 't-1',
        subjectId: 'sub-fisica',
        title: 'Prova Bimestral de Óptica e Termodinâmica',
        type: 'prova',
        date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
        time: '08:00',
        priority: 'alta',
        completed: false,
        notes: 'Capítulos 3 e 4 do Livro Didático. Trazer calculadora.',
        syncedCalendar: true,
        source: 'manual'
      },
      {
        id: 't-2',
        subjectId: 'sub-historia',
        title: 'Entrega do Trabalho sobre Era Vargas no MS Teams',
        type: 'trabalho',
        date: new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0],
        time: '23:59',
        priority: 'alta',
        completed: false,
        notes: 'Anexar PDF na aba Tarefas do MS Teams da Turma.',
        syncedCalendar: true,
        source: 'msteams'
      },
      {
        id: 't-3',
        subjectId: 'sub-matematica',
        title: 'Exercícios de Geometria Analítica (Lista 2)',
        type: 'tarefa',
        date: new Date(Date.now() + 86400000 * 1).toISOString().split('T')[0],
        time: '14:00',
        priority: 'media',
        completed: false,
        notes: 'Páginas 112 e 113.',
        syncedCalendar: false,
        source: 'manual'
      }
    ];
  });

  // Google Drive & Ecosystem Sync State
  const cleanDriveSyncInfo: GoogleDriveSyncInfo = {
    isConfigured: false,
    studentGoogleAccount: '',
    parentEmails: [],
    folderName: 'Estudei_Passei_Data',
    isSynced: false,
    lastSyncedAt: 'Nunca',
    connectedChildrenProfiles: [],
    activeChildId: ''
  };

  const [driveSyncInfo, setDriveSyncInfo] = useState<GoogleDriveSyncInfo>(() => {
    const saved = localStorage.getItem('estudei_driveSync');
    return saved ? JSON.parse(saved) : cleanDriveSyncInfo;
  });

  // Theme & Layout Preferences
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
    return (saved as LayoutDensity) || 'default';
  });

  // Core Data States with localStorage persistence (Clean defaults for real users)
  const [schoolConfig, setSchoolConfig] = useState<SchoolConfig>(() => {
    const saved = localStorage.getItem('estudei_schoolConfig');
    return saved ? JSON.parse(saved) : initialSchoolConfig;
  });

  const [subjects, setSubjects] = useState<Subject[]>(() => {
    const saved = localStorage.getItem('estudei_subjects');
    return saved ? JSON.parse(saved) : [];
  });

  const [evaluations, setEvaluations] = useState<Evaluation[]>(() => {
    const saved = localStorage.getItem('estudei_evaluations');
    return saved ? JSON.parse(saved) : [];
  });

  const [studyLogs, setStudyLogs] = useState<StudySessionLog[]>(() => {
    const saved = localStorage.getItem('estudei_studyLogs');
    return saved ? JSON.parse(saved) : [];
  });

  const [spacedRevisions, setSpacedRevisions] = useState<SpacedRevision[]>(() => {
    const saved = localStorage.getItem('estudei_spacedRevisions');
    return saved ? JSON.parse(saved) : [];
  });

  const [parentSettings, setParentSettings] = useState<ParentGuardSettings>(() => {
    const saved = localStorage.getItem('estudei_parentSettings');
    return saved ? JSON.parse(saved) : cleanParentSettings;
  });

  // Smart Study Timer & Daily Plan Hook
  const handleAddStudyLog = (log: StudySessionLog) => {
    setStudyLogs(prev => [log, ...prev]);
  };

  const {
    dailyPlan,
    generateDailyPlan,
    markBlockCompleted,
    addBlock: addDailyPlanBlock,
    removeBlock: removeDailyPlanBlock,
    setDailyPlan
  } = useDailyPlan({
    subjects,
    studentTasks,
    spacedRevisions,
    evaluations,
    studyLogs,
    onAddStudyLog: handleAddStudyLog
  });

  const { startActivity, finishActivity } = useActivityTracker({
    onAutoTrackCompleted: handleAddStudyLog,
    activePlanBlock: dailyPlan?.blocks.find(b => !b.completed)
  });

  // Smart Timer Modal States
  const [showStudySessionModal, setShowStudySessionModal] = useState<boolean>(false);
  const [studySessionBlockIndex, setStudySessionBlockIndex] = useState<number>(0);
  const [isStudySessionFreeMode, setIsStudySessionFreeMode] = useState<boolean>(false);
  const [showDailyPlanEditorModal, setShowDailyPlanEditorModal] = useState<boolean>(false);
  const [showExternalActivityModal, setShowExternalActivityModal] = useState<boolean>(false);

  // Populate Demo Data if Demo Mode is explicitly toggled
  useEffect(() => {
    if (isDemoMode) {
      setSubjects(initialSubjects);
      setEvaluations(initialEvaluations);
      setStudyLogs(initialStudyLogs);
      setSpacedRevisions(initialSpacedRevisions);
      setParentSettings({
        studentName: 'Lucas Toledo (Demo)',
        studentYear: '2º Ano do Ensino Médio',
        schoolName: 'Colégio Estudei & Passei (Demo)',
        guardianEmail: 'responsavel@exemplo.com.br',
        lgpdAccepted: true,
        parentPin: '1234'
      });
    }
  }, [isDemoMode]);

  const activeStudentProfile = (familyStudents || []).find(s => s.uid === activeStudentUid);
  const activeStudentName = userProfile
    ? (userProfile.role === 'student'
        ? (userProfile.name || 'Estudante')
        : (activeStudentProfile?.name || ((familyStudents || []).length > 0 ? (familyStudents[0]?.name || 'Estudante') : 'Estudante')))
    : (isDemoMode ? 'Lucas Toledo (Demo)' : 'Estudante');

  // Timer States
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  // Auto open auth modal if URL contains invite code parameter
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('inviteCode') || params.get('invite')) {
      setShowAuthModal(true);
    }
  }, []);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('estudei_schoolConfig', JSON.stringify(schoolConfig));
  }, [schoolConfig]);

  useEffect(() => {
    localStorage.setItem('estudei_subjects', JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem('estudei_evaluations', JSON.stringify(evaluations));
  }, [evaluations]);

  useEffect(() => {
    localStorage.setItem('estudei_studyLogs', JSON.stringify(studyLogs));
  }, [studyLogs]);

  useEffect(() => {
    localStorage.setItem('estudei_spacedRevisions', JSON.stringify(spacedRevisions));
  }, [spacedRevisions]);

  useEffect(() => {
    localStorage.setItem('estudei_parentSettings', JSON.stringify(parentSettings));
  }, [parentSettings]);

  useEffect(() => {
    localStorage.setItem('estudei_driveSync', JSON.stringify(driveSyncInfo));
  }, [driveSyncInfo]);

  useEffect(() => {
    localStorage.setItem('estudei_studentTasks', JSON.stringify(studentTasks));
  }, [studentTasks]);

  useEffect(() => {
    localStorage.setItem('estudei_schoolTimetable', JSON.stringify(schoolTimetable));
  }, [schoolTimetable]);

  useEffect(() => {
    localStorage.setItem('estudei_theme', currentTheme);
  }, [currentTheme]);

  useEffect(() => {
    localStorage.setItem('estudei_layout', currentLayout);
  }, [currentLayout]);

  useEffect(() => {
    localStorage.setItem('estudei_density', currentDensity);
  }, [currentDensity]);

  // Export / Import JSON Backup Functions
  const handleExportBackupJSON = () => {
    const dataObj = {
      schoolConfig,
      subjects,
      evaluations,
      studyLogs,
      spacedRevisions,
      parentSettings,
      driveSyncInfo,
      exportedAt: new Date().toISOString()
    };
    const jsonStr = JSON.stringify(dataObj, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Estudei_Passei_Backup_${parentSettings.studentName.replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportBackupJSON = (jsonDataStr: string) => {
    try {
      const parsed = JSON.parse(jsonDataStr);
      if (parsed.subjects) setSubjects(parsed.subjects);
      if (parsed.schoolConfig) setSchoolConfig(parsed.schoolConfig);
      if (parsed.evaluations) setEvaluations(parsed.evaluations);
      if (parsed.studyLogs) setStudyLogs(parsed.studyLogs);
      if (parsed.spacedRevisions) setSpacedRevisions(parsed.spacedRevisions);
      if (parsed.parentSettings) setParentSettings(parsed.parentSettings);
      if (parsed.driveSyncInfo) setDriveSyncInfo(parsed.driveSyncInfo);
      if (parsed.studentTasks) setStudentTasks(parsed.studentTasks);
      alert('Backup do sistema restaurado com sucesso!');
    } catch (err) {
      alert('Arquivo de backup inválido ou corrompido.');
    }
  };

  // Student Tasks & Reminders Handlers
  const handleAddTask = (newTask: StudentTaskItem) => {
    setStudentTasks(prev => [newTask, ...prev]);
  };

  const handleAddMultipleTasks = (newTasks: StudentTaskItem[]) => {
    setStudentTasks(prev => [...newTasks, ...prev]);
  };

  const handleToggleTaskCompleted = (taskId: string) => {
    setStudentTasks(prev =>
      prev.map(t => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleDeleteTask = (taskId: string) => {
    setStudentTasks(prev => prev.filter(t => t.id !== taskId));
  };

  // Handler for adding scanned book TOC topics to a new or existing subject
  const handleAddScannedSubjectOrTopics = (
    targetSubjectId: string | 'new',
    scannedData: BookScanResult
  ) => {
    const newTopicsToAdd = scannedData.chapters.flatMap((chap, cIdx) =>
      chap.topics.map((topName, tIdx) => ({
        id: `scanned-${Date.now()}-${cIdx}-${tIdx}`,
        name: `[Cap. ${chap.chapterNumber}] ${topName}`,
        taught: false
      }))
    );

    if (targetSubjectId === 'new') {
      const newSub: Subject = {
        id: `scanned-sub-${Date.now()}`,
        name: scannedData.bookTitle || scannedData.suggestedSubject || 'Livro Didático',
        category: (scannedData.category as any) || 'Formação Geral',
        color: 'indigo',
        teacherName: 'Prof. da Escola',
        topics: newTopicsToAdd,
        examScopeTopicIds: newTopicsToAdd.slice(0, 3).map(t => t.id),
        enabled: true,
        isCustom: true
      };
      setSubjects(prev => [...prev, newSub]);
    } else {
      setSubjects(prev =>
        prev.map(sub => {
          if (sub.id === targetSubjectId) {
            return {
              ...sub,
              topics: [...sub.topics, ...newTopicsToAdd]
            };
          }
          return sub;
        })
      );
    }
  };

  // Switch Active Child Profile Handler
  const handleSwitchActiveChildProfile = (childId: string) => {
    const child = (driveSyncInfo?.connectedChildrenProfiles || []).find(c => c.id === childId);
    if (child) {
      setParentSettings(prev => ({
        ...prev,
        studentName: child.studentName,
        studentYear: child.studentYear,
        schoolName: child.schoolName
      }));
    }
  };

  // Determine root container classes based on currentTheme
  let themeRootClass = 'min-h-screen bg-slate-100 text-slate-800 font-sans';
  if (currentTheme === 'warm-minimalist') {
    themeRootClass = 'min-h-screen bg-amber-50/60 text-stone-800 font-sans';
  } else if (currentTheme === 'dark-focus') {
    themeRootClass = 'min-h-screen bg-slate-950 text-slate-100 font-sans';
  } else if (currentTheme === 'academic-editorial') {
    themeRootClass = 'min-h-screen bg-stone-100 text-stone-900 font-serif';
  }

  // Determine main layout width & density
  let densityClass = 'max-w-7xl space-y-8';
  if (currentDensity === 'compact') {
    densityClass = 'max-w-5xl space-y-5';
  } else if (currentDensity === 'focus') {
    densityClass = 'max-w-3xl space-y-6';
  }

  // Timer Tick
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds(s => s + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const timerMins = Math.floor(timerSeconds / 60);
  const timerSecs = timerSeconds % 60;

  const handleToggleTimer = () => setIsTimerRunning(!isTimerRunning);
  const handleResetTimer = () => {
    setIsTimerRunning(false);
    setTimerSeconds(0);
  };

  // Log study session helper
  const handleLogStudySession = (
    subjectId: string,
    topic: string,
    minutes: number,
    mode: 'escola' | 'enem'
  ) => {
    const newLog: StudySessionLog = {
      id: `log-${Date.now()}`,
      subjectId,
      topic,
      minutes,
      date: new Date().toISOString().split('T')[0],
      mode
    };
    setStudyLogs(prev => [newLog, ...prev]);
  };

  // Sync active student state with Firestore database
  const { saveStudentDataNow } = useStudentFirestoreSync({
    subjects,
    setSubjects,
    timetable: schoolTimetable,
    setTimetable: setSchoolTimetable,
    studentTasks,
    setStudentTasks,
    evaluations,
    setEvaluations,
    studyLogs,
    setStudyLogs,
    spacedRevisions,
    setSpacedRevisions,
    schoolConfig,
    setSchoolConfig,
    onNewUserWithoutData: () => setShowOnboardingModal(true)
  });

  // Handle onboarding completion
  const handleOnboardingComplete = async (data: { subjects: Subject[]; schoolConfig: SchoolConfig }) => {
    let nextSubjects = subjects;
    let nextConfig = schoolConfig;
    if (data.subjects.length > 0) {
      setSubjects(data.subjects);
      nextSubjects = data.subjects;
    }
    if (data.schoolConfig) {
      setSchoolConfig(data.schoolConfig);
      nextConfig = data.schoolConfig;
    }
    await saveStudentDataNow({
      subjects: nextSubjects,
      schoolConfig: nextConfig
    });
  };

  return (
    <div className={`${themeRootClass} flex flex-col antialiased selection:bg-indigo-500 selection:text-white transition-colors duration-300`}>
      {/* Update Available Top Alert Banner */}
      {updateAvailable && (
        <div className="bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-slate-950 px-4 py-2 text-xs font-bold flex items-center justify-between shadow-lg sticky top-0 z-50 animate-in slide-in-from-top">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-slate-950 animate-pulse shrink-0" />
            <span>
              <strong>🚀 Nova atualização / commit disponível!</strong> O aplicativo possui novas melhorias prontas para uso.
            </span>
          </div>
          <div className="flex items-center space-x-2 shrink-0">
            <button
              type="button"
              onClick={handleReloadApp}
              className="px-3 py-1 bg-slate-950 text-white rounded-lg text-[11px] font-black hover:bg-slate-800 transition shadow-sm flex items-center space-x-1"
            >
              <RefreshCw className="w-3 h-3 text-amber-300" />
              <span>Atualizar Agora (1-Clique)</span>
            </button>
            <button
              type="button"
              onClick={handleDismissUpdate}
              className="text-slate-900 hover:text-slate-700 p-1"
              title="Fechar aviso"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Demo Mode Read-Only Banner */}
      <DemoModeBanner onOpenAuthModal={() => setShowAuthModal(true)} />

      {/* User Manual & Help Center Modal */}
      <UserManualModal
        isOpen={showManualModal}
        onClose={() => setShowManualModal(false)}
      />

      {/* PWA Install & Update Checker Modal */}
      <PWAInstallModal
        isOpen={showPWAModal}
        onClose={() => setShowPWAModal(false)}
      />

      {/* Auth & Family Isolation Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={showEditProfileModal}
        onClose={() => setShowEditProfileModal(false)}
      />

      {/* Initial Setup Onboarding Wizard */}
      <OnboardingWizardModal
        isOpen={showOnboardingModal}
        onClose={() => setShowOnboardingModal(false)}
        onComplete={handleOnboardingComplete}
      />

      {/* School Timetable Editor Modal */}
      <SchoolTimetableModal
        isOpen={showTimetableModal}
        onClose={() => setShowTimetableModal(false)}
        subjects={subjects}
        timetable={schoolTimetable}
        onUpdateTimetable={(updated) => setSchoolTimetable(updated)}
      />

      {/* Quick Add Task Modal */}
      <QuickAddTaskModal
        isOpen={showQuickTaskModal}
        onClose={() => setShowQuickTaskModal(false)}
        subjects={subjects}
        onAddTask={handleAddTask}
      />

      {/* School Platforms Integration Modal */}
      <SchoolPlatformsIntegrationModal
        isOpen={showSchoolPlatformsModal}
        onClose={() => setShowSchoolPlatformsModal(false)}
        subjects={subjects}
        onAddMultipleTasks={handleAddMultipleTasks}
      />

      {/* Theme & Layout Customization Modal */}
      <ThemeSelectorModal
        isOpen={showThemeModal}
        onClose={() => setShowThemeModal(false)}
        currentTheme={currentTheme}
        onSelectTheme={(t) => setCurrentTheme(t)}
        currentLayout={currentLayout}
        onSelectLayout={(l) => setCurrentLayout(l)}
        currentDensity={currentDensity}
        onSelectDensity={(d) => setCurrentDensity(d)}
      />

      {/* Google Drive & Family Sync Modal */}
      <GoogleDriveSyncModal
        isOpen={showDriveModal}
        onClose={() => setShowDriveModal(false)}
        syncInfo={driveSyncInfo}
        onUpdateSyncInfo={setDriveSyncInfo}
        parentSettings={parentSettings}
        onUpdateParentSettings={setParentSettings}
        onExportBackupJSON={handleExportBackupJSON}
        onImportBackupJSON={handleImportBackupJSON}
        onSwitchActiveChildProfile={handleSwitchActiveChildProfile}
      />

      {/* Dynamic Subject & Course Manager Modal */}
      <SubjectManagerModal
        isOpen={showSubjectModal}
        onClose={() => setShowSubjectModal(false)}
        subjects={subjects}
        onUpdateSubjects={setSubjects}
        onOpenBookScanner={() => setShowBookScannerModal(true)}
      />

      {/* AI Book Table of Contents Scanner Modal */}
      <BookTocScannerModal
        isOpen={showBookScannerModal}
        onClose={() => setShowBookScannerModal(false)}
        subjects={subjects.filter(s => s.enabled !== false)}
        onAddScannedSubjectOrTopics={handleAddScannedSubjectOrTopics}
      />

      {/* Pop-Up Alert de Provas Próximas */}
      <UpcomingExamsAlertModal
        evaluations={evaluations}
        subjects={subjects}
        studentTasks={studentTasks}
        onNavigateToEvaluations={() => setActiveTab('grade-simulator')}
      />

      {/* Main Unified App Layout */}
      <AppLayout
        activeTab={activeTab}
        onNavigateTab={(tab) => setActiveTab(tab)}
        recoveryCount={subjects.reduce((acc, sub) => acc + (sub.topics || []).filter(t => t.needsRecovery).length, 0)}
        onOpenQuickTaskModal={() => setShowQuickTaskModal(true)}
        onOpenSubjectModal={() => setShowSubjectModal(true)}
        onOpenTimetableModal={() => setShowTimetableModal(true)}
        onOpenSchoolPlatformsModal={() => setShowSchoolPlatformsModal(true)}
        onOpenBookScannerModal={() => setShowBookScannerModal(true)}
        onOpenPWAModal={() => setShowPWAModal(true)}
        onOpenThemeModal={() => setShowThemeModal(true)}
        onOpenManualModal={() => setShowManualModal(true)}
      >
        {activeTab === 'manual' ? (
          <UserManualPage onNavigateTab={(tab) => setActiveTab(tab)} />
        ) : viewMode === 'parent' ? (
          <ParentDashboardSection
            subjects={subjects}
            evaluations={evaluations}
            studyLogs={studyLogs}
            parentSettings={parentSettings}
            schoolConfig={schoolConfig}
          />
        ) : (
          /* VIEW MODE 2: STUDENT APPLICATION */
          <>
            {/* TABS CONTROLLER */}
            {activeTab === 'dashboard' && (
              <Dashboard />
            )}

            {/* TAB: CENTRAL DE IA & ESTUDOS ATIVOS (FUNDIDO) */}
            {(activeTab === 'study' || activeTab === 'active-study-hub' || activeTab === 'ai-hub') && (
              <StudyScreen />
            )}

            {/* TAB 2: PLANEJAMENTO DUAL */}
            {activeTab === 'dual-planner' && (
              <DualPlannerSection
                subjects={subjects}
                onUpdateSubjects={setSubjects}
                onLogStudySession={handleLogStudySession}
              />
            )}

            {/* TAB 3: SIMULADOR DE NOTAS E AVALIAÇÕES INTELIGENTES */}
            {activeTab === 'grade-simulator' && (
              <GradeManagerSection
                subjects={subjects}
                evaluations={evaluations}
                schoolConfig={schoolConfig}
                studentTasks={studentTasks}
                spacedRevisions={spacedRevisions}
                onUpdateEvaluations={setEvaluations}
                onUpdateSubjects={setSubjects}
                onUpdateStudentTasks={setStudentTasks}
                onUpdateSpacedRevisions={setSpacedRevisions}
                onNavigateTab={(tab) => setActiveTab(tab)}
              />
            )}

            {/* TAB 5: REVISÃO ESPAÇADA */}
            {activeTab === 'spaced-revision' && (
              <SpacedRevisionSection
                subjects={subjects}
                revisions={spacedRevisions}
                onUpdateRevisions={setSpacedRevisions}
              />
            )}

            {/* TAB 6: CONQUISTAS E PREMIAÇÕES FAMILIARES */}
            {activeTab === 'achievements' && (
              <AchievementsWall />
            )}

            {/* TAB 7: RANKING DA TURMA E OLIMPÍADAS */}
            {activeTab === 'ranking' && (
              <ClassRanking
                onCreateClassOpen={() => setShowCreateClassModal(true)}
                onJoinClassOpen={() => setShowJoinClassModal(true)}
                onOpenOlympiads={(classGroup) => setActiveOlympiadClassGroup(classGroup)}
              />
            )}
          </>
        )}
      </AppLayout>

      {/* Class Modals */}
      {showCreateClassModal && (
        <CreateClassModal
          onClose={() => setShowCreateClassModal(false)}
          onClassCreated={(newClass) => {
            setShowCreateClassModal(false);
          }}
        />
      )}

      {showJoinClassModal && (
        <JoinClassModal
          onClose={() => setShowJoinClassModal(false)}
          onJoined={() => {
            setShowJoinClassModal(false);
          }}
        />
      )}

      {activeOlympiadClassGroup && (
        <OlympiadManager
          classGroup={activeOlympiadClassGroup}
          onClose={() => setActiveOlympiadClassGroup(null)}
        />
      )}

      {/* MODAL DE EXECUÇÃO DO CICLO DE ESTUDOS ADAPTATIVO */}
      {showStudySessionModal && (
        <CycleSession
          isOpen={showStudySessionModal}
          onClose={() => setShowStudySessionModal(false)}
          dailyCycle={dailyPlan}
          initialBlockIndex={studySessionBlockIndex}
          isFreeMode={isStudySessionFreeMode}
          subjects={subjects}
          onMarkBlockCompleted={(blockId, mins, qDone, qCorrect, notes) => {
            markBlockCompleted(blockId, mins, qDone, qCorrect, notes);
          }}
          onAddFreeLog={(log) => setStudyLogs(prev => [log, ...prev])}
        />
      )}

      {showDailyPlanEditorModal && (
        <DailyPlanGeneratorModal
          isOpen={showDailyPlanEditorModal}
          onClose={() => setShowDailyPlanEditorModal(false)}
          dailyPlan={dailyPlan}
          subjects={subjects}
          onGeneratePlan={() => generateDailyPlan()}
          onAddBlock={(blk) => addDailyPlanBlock(blk)}
          onRemoveBlock={(blkId) => removeDailyPlanBlock(blkId)}
          onUpdatePlan={(updatedPlan) => setDailyPlan(updatedPlan)}
        />
      )}

      {showExternalActivityModal && (
        <ExternalActivityForm
          isOpen={showExternalActivityModal}
          onClose={() => setShowExternalActivityModal(false)}
          subjects={subjects}
          onLogActivity={(data) => {
            const newLog: StudySessionLog = {
              id: `extlog_${Date.now()}`,
              subjectId: data.subjectId,
              subjectName: data.subjectName,
              topic: data.topic,
              minutes: data.minutes,
              date: new Date().toISOString().split('T')[0],
              mode: 'escola',
              type: data.type as any,
              questionsDone: data.questionsDone,
              questionsCorrect: data.questionsCorrect,
              timestamp: new Date().toISOString()
            };
            setStudyLogs(prev => [newLog, ...prev]);
          }}
        />
      )}


      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 text-xs py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <GraduationCap className="w-5 h-5 text-indigo-400" />
            <span className="font-bold text-white font-display">Estudei & Passei Ensino Médio</span>
            <span>— Edição Família</span>
          </div>

          <p className="text-slate-500 text-center sm:text-right">
            Planejamento Dual • Gestão Escolar Preditiva • IA Socrática • Conforme LGPD
          </p>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <StudyTimerProvider>
          <BrowserRouter>
            <MainAppContent />
          </BrowserRouter>
        </StudyTimerProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
