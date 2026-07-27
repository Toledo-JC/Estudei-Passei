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
import { DemoModeBanner } from './components/DemoModeBanner';
import { OnboardingWizardModal } from './components/OnboardingWizardModal';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { useStudentFirestoreSync } from './hooks/useStudentFirestoreSync';

import {
  initialSchoolConfig,
  initialSubjects,
  initialEvaluations,
  initialStudyLogs,
  initialSpacedRevisions,
  initialParentSettings,
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
  Sparkles,
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
  // Navigation & Modals States
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [viewMode, setViewMode] = useState<'student' | 'parent'>('student');
  const [showConfigModal, setShowConfigModal] = useState<boolean>(false);
  const [showThemeModal, setShowThemeModal] = useState<boolean>(false);
  const [showDriveModal, setShowDriveModal] = useState<boolean>(false);
  const [showSubjectModal, setShowSubjectModal] = useState<boolean>(false);
  const [showBookScannerModal, setShowBookScannerModal] = useState<boolean>(false);
  const [showQuickTaskModal, setShowQuickTaskModal] = useState<boolean>(false);
  const [showSchoolPlatformsModal, setShowSchoolPlatformsModal] = useState<boolean>(false);
  const [showTimetableModal, setShowTimetableModal] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [showOnboardingModal, setShowOnboardingModal] = useState<boolean>(false);

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
  const [driveSyncInfo, setDriveSyncInfo] = useState<GoogleDriveSyncInfo>(() => {
    const saved = localStorage.getItem('estudei_driveSync');
    return saved ? JSON.parse(saved) : {
      isConfigured: true,
      studentGoogleAccount: 'lucas.toledo@gmail.com',
      parentEmails: ['responsavel@exemplo.com.br'],
      folderName: 'Estudei_EnsinoMedio_Data',
      isSynced: true,
      lastSyncedAt: 'Hoje às 10:30',
      connectedChildrenProfiles: [
        {
          id: 'child-1',
          studentName: 'Lucas Toledo',
          studentYear: '2º Ano do Ensino Médio',
          schoolName: 'Colégio Estudei & Passei',
          guardianEmail: 'responsavel@exemplo.com.br',
          lastSyncedAt: 'Hoje'
        },
        {
          id: 'child-2',
          studentName: 'Ana Toledo',
          studentYear: '3º Ano do Ensino Médio / Medicina',
          schoolName: 'Colégio Estudei & Passei',
          guardianEmail: 'responsavel@exemplo.com.br',
          lastSyncedAt: 'Ontem'
        }
      ],
      activeChildId: 'child-1'
    };
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

  // Core Data States with localStorage persistence
  const [schoolConfig, setSchoolConfig] = useState<SchoolConfig>(() => {
    const saved = localStorage.getItem('estudei_schoolConfig');
    return saved ? JSON.parse(saved) : initialSchoolConfig;
  });

  const [subjects, setSubjects] = useState<Subject[]>(() => {
    const saved = localStorage.getItem('estudei_subjects');
    return saved ? JSON.parse(saved) : initialSubjects;
  });

  const [evaluations, setEvaluations] = useState<Evaluation[]>(() => {
    const saved = localStorage.getItem('estudei_evaluations');
    return saved ? JSON.parse(saved) : initialEvaluations;
  });

  const [studyLogs, setStudyLogs] = useState<StudySessionLog[]>(() => {
    const saved = localStorage.getItem('estudei_studyLogs');
    return saved ? JSON.parse(saved) : initialStudyLogs;
  });

  const [spacedRevisions, setSpacedRevisions] = useState<SpacedRevision[]>(() => {
    const saved = localStorage.getItem('estudei_spacedRevisions');
    return saved ? JSON.parse(saved) : initialSpacedRevisions;
  });

  const [parentSettings, setParentSettings] = useState<ParentGuardSettings>(() => {
    const saved = localStorage.getItem('estudei_parentSettings');
    return saved ? JSON.parse(saved) : initialParentSettings;
  });

  // Timer States
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

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
    const child = driveSyncInfo.connectedChildrenProfiles.find(c => c.id === childId);
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

  // Handle onboarding completion
  const handleOnboardingComplete = (data: { subjects: Subject[]; schoolConfig: SchoolConfig }) => {
    if (data.subjects.length > 0) {
      setSubjects(data.subjects);
    }
    if (data.schoolConfig) {
      setSchoolConfig(data.schoolConfig);
    }
  };

  // Sync active student state with Firestore database
  useStudentFirestoreSync({
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

  return (
    <div className={`${themeRootClass} flex flex-col antialiased selection:bg-indigo-500 selection:text-white transition-colors duration-300`}>
      {/* Demo Mode Read-Only Banner */}
      <DemoModeBanner onOpenAuthModal={() => setShowAuthModal(true)} />

      {/* Top Header Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        viewMode={viewMode}
        setViewMode={setViewMode}
        timerMinutes={timerMins}
        timerSeconds={timerSecs}
        isTimerRunning={isTimerRunning}
        onToggleTimer={handleToggleTimer}
        onResetTimer={handleResetTimer}
        parentSettings={parentSettings}
        currentTheme={currentTheme}
        onOpenThemeModal={() => setShowThemeModal(true)}
        onOpenDriveModal={() => setShowDriveModal(true)}
        onOpenSubjectModal={() => setShowSubjectModal(true)}
        onOpenBookScannerModal={() => setShowBookScannerModal(true)}
        onOpenQuickTaskModal={() => setShowQuickTaskModal(true)}
        onOpenSchoolPlatformsModal={() => setShowSchoolPlatformsModal(true)}
        onOpenTimetableModal={() => setShowTimetableModal(true)}
        onOpenAuthModal={() => setShowAuthModal(true)}
        onOpenOnboardingModal={() => setShowOnboardingModal(true)}
      />

      {/* Auth & Family Isolation Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
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

      {/* Main Container */}
      <main className={`flex-1 w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 ${densityClass}`}>
        {/* VIEW MODE 1: PARENT DASHBOARD */}
        {viewMode === 'parent' ? (
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
              <div className="space-y-6">
                <DashboardLayoutManager
                  layoutType={currentLayout}
                  subjects={subjects}
                  evaluations={evaluations}
                  studyLogs={studyLogs}
                  schoolConfig={schoolConfig}
                  studentName={parentSettings.studentName}
                  showConfigModal={showConfigModal}
                  onToggleConfigModal={() => setShowConfigModal(!showConfigModal)}
                  onNavigateTab={(tab) => setActiveTab(tab)}
                  timerMinutes={timerMins}
                  timerSeconds={timerSecs}
                  isTimerRunning={isTimerRunning}
                  onToggleTimer={handleToggleTimer}
                  onResetTimer={handleResetTimer}
                  onLogStudySession={handleLogStudySession}
                  onUpdateSubjects={setSubjects}
                  onSaveConfig={(cfg) => setSchoolConfig(cfg)}
                />

                {/* Agenda Rápida do Aluno & MS Teams / Google Agenda */}
                <StudentTasksWidgetSection
                  tasks={studentTasks}
                  subjects={subjects}
                  onToggleCompleted={handleToggleTaskCompleted}
                  onDeleteTask={handleDeleteTask}
                  onOpenQuickTaskModal={() => setShowQuickTaskModal(true)}
                  onOpenSchoolPlatformsModal={() => setShowSchoolPlatformsModal(true)}
                />

                {/* Ciclo de Estudos Adaptativo & Aula Dada Hoje */}
                <AdaptiveStudyCycleSection
                  subjects={subjects}
                  timetable={schoolTimetable}
                  studentTasks={studentTasks}
                  onLogStudySession={(log) => setStudyLogs(prev => [ { ...log, id: `log-${Date.now()}` }, ...prev ])}
                  onOpenTimetableModal={() => setShowTimetableModal(true)}
                />
              </div>
            )}

            {/* TAB: CENTRAL DE IA & ESTUDOS ATIVOS (FUNDIDO) */}
            {(activeTab === 'active-study-hub' || activeTab === 'ai-hub') && (
              <ActiveStudyHubSection subjects={subjects} />
            )}

            {/* TAB 2: PLANEJAMENTO DUAL */}
            {activeTab === 'dual-planner' && (
              <DualPlannerSection
                subjects={subjects}
                onUpdateSubjects={setSubjects}
                onLogStudySession={handleLogStudySession}
              />
            )}

            {/* TAB 3: SIMULADOR DE NOTAS */}
            {activeTab === 'grade-simulator' && (
              <GradeManagerSection
                subjects={subjects}
                evaluations={evaluations}
                schoolConfig={schoolConfig}
                onUpdateEvaluations={setEvaluations}
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
          </>
        )}
      </main>

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
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}
