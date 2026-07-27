export type PeriodType = 'bimestre' | 'trimestre';
export type RecoveryType = 'bimestral' | 'semestral' | 'ambas' | 'nenhuma';
export type RecoveryCalc = 'substitutiva' | 'media';

export type ThemeId = 'modern-indigo' | 'warm-minimalist' | 'dark-focus' | 'academic-editorial';
export type LayoutDensity = 'default' | 'compact' | 'focus';
export type AppLayoutType = 'bento-grid' | 'sidebar-split' | 'focus-stream' | 'kanban-board';

export interface LayoutOption {
  id: AppLayoutType;
  name: string;
  subtitle: string;
  description: string;
}

export interface ThemeOption {
  id: ThemeId;
  name: string;
  subtitle: string;
  previewBg: string;
  previewCard: string;
  previewAccent: string;
  description: string;
}

export interface EvalCategoryConfig {
  id: string;
  name: string;
  weightPercent: number; // e.g. 70 for 70%
  maxScore: number; // e.g. 10.0
  description: string;
}

export interface SchoolConfig {
  periodType: PeriodType;
  passingScore: number; // e.g. 6.0
  maxScorePerPeriod: number; // e.g. 10.0
  recoveryType: RecoveryType;
  recoveryCalculation: RecoveryCalc;
  evalCategories: EvalCategoryConfig[];
}

export interface TeacherTopic {
  id: string;
  name: string;
  taught: boolean;
  taughtDate?: string;
}

export interface Subject {
  id: string;
  name: string;
  category: 'Exatas' | 'Humanas' | 'Biológicas' | 'Linguagens' | 'Redação' | 'Formação Geral' | 'Itinerário';
  color: string;
  teacherName?: string;
  topics: TeacherTopic[];
  examScopeTopicIds: string[]; // Selected for imminent revision
  enabled?: boolean; // toggle subject on/off
  isCustom?: boolean; // custom created subject
  weight?: number; // weight in period evaluation
}

export interface GoogleDriveSyncInfo {
  isConfigured: boolean;
  studentGoogleAccount: string;
  parentEmails: string[];
  folderName: string; // "Estudei_EnsinoMedio_Data"
  folderId?: string;
  isSynced: boolean;
  lastSyncedAt?: string;
  connectedChildrenProfiles: Array<{
    id: string;
    studentName: string;
    studentYear: string;
    schoolName: string;
    guardianEmail: string;
    lastSyncedAt: string;
  }>;
  activeChildId: string;
}

export interface BookScanResult {
  bookTitle: string;
  publisher?: string;
  suggestedSubject: string;
  category: string;
  chapters: Array<{
    chapterNumber: number;
    chapterTitle: string;
    topics: string[];
  }>;
}

export interface Evaluation {
  id: string;
  subjectId: string;
  periodIndex: number; // 1, 2, 3, 4
  name: string;
  categoryName: string;
  maxScore: number;
  weight: number; // multiplier or percentage
  scoreObtained: number | null; // null if pending
  date: string;
  isRecovery?: boolean;
}

export interface StudySessionLog {
  id: string;
  subjectId: string;
  topic: string;
  minutes: number;
  date: string; // YYYY-MM-DD
  mode: 'escola' | 'enem';
}

export interface SpacedRevision {
  id: string;
  subjectId: string;
  topic: string;
  createdAt: string;
  steps: {
    days: 1 | 7 | 30;
    dueDate: string;
    completed: boolean;
  }[];
}

export interface StudentTaskItem {
  id: string;
  subjectId: string;
  title: string;
  type: 'prova' | 'trabalho' | 'tarefa' | 'lembrete' | 'projeto';
  date: string; // YYYY-MM-DD
  time?: string; // HH:mm
  priority: 'alta' | 'media' | 'normal';
  completed: boolean;
  notes?: string;
  syncedCalendar?: boolean;
  source?: 'manual' | 'msteams' | 'classroom' | 'scanner';
}

export interface SchoolPeriodItem {
  id: string;
  periodNumber: number; // 1º Período, 2º Período, etc.
  startTime: string; // e.g. "07:15"
  endTime: string;   // e.g. "08:00"
  subjectId: string;
}

export interface DaySchoolSchedule {
  dayKey: 'segunda' | 'terca' | 'quarta' | 'quinta' | 'sexta';
  dayName: string; // e.g. "Segunda-feira"
  periods: SchoolPeriodItem[];
}

export type SchoolTimetable = DaySchoolSchedule[];

export interface ParentGuardSettings {
  studentName: string;
  studentYear: string;
  schoolName: string;
  guardianEmail: string;
  lgpdAccepted: boolean;
  parentPin: string; // PIN for parent view confirmation
}

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  role: 'parent' | 'student';
  familyId: string;
  studentYear?: string;
  createdAt: string;
}

export interface FamilyGroup {
  id: string;
  familyName: string;
  familyCode: string;
  parentUids: string[];
  studentUids: string[];
  createdAt: string;
}

export interface EssayCorrectionResult {
  totalScore: number;
  competencies: {
    number: number;
    name: string;
    score: number;
    feedback: string;
  }[];
  generalFeedback: string;
  strengths: string[];
  improvements: string[];
}

export interface NotebookOverviewResult {
  structuredSummary: string;
  keyConcepts: { term: string; definition: string }[];
  podcastScript: { speaker: string; line: string }[];
}

export interface FlashcardItem {
  id: string;
  question: string;
  answer: string;
  mnemonic?: string;
  subjectId: string;
  topic: string;
  difficultyRating?: 'facil' | 'medio' | 'dificil';
  lastReviewedAt?: string;
  nextReviewAt?: string;
  reviewCount?: number;
}

export interface FlashcardDeck {
  id: string;
  title: string;
  subjectId: string;
  category: string;
  cards: FlashcardItem[];
  createdAt: string;
}

export interface QuizQuestion {
  id: string;
  statement: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  subjectId: string;
  topic: string;
}

export interface QuizSession {
  id: string;
  subjectId: string;
  topic: string;
  questions: QuizQuestion[];
  userAnswers: Record<number, number>; // questionIndex -> chosenOptionIndex
  score: number;
  totalQuestions: number;
  completedAt: string;
}

export interface StudySummaryItem {
  id: string;
  title: string;
  subjectId: string;
  topic: string;
  formattedMarkdown: string;
  keyTakeaways: string[];
  audioText: string;
  podcastConversation?: { speaker: string; line: string }[];
  readingTimeMinutes: number;
  createdAt: string;
}

export interface SimuladoQuestion {
  id: string;
  statement: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  subjectId: string;
  area: 'Exatas' | 'Humanas' | 'Biológicas' | 'Linguagens' | 'Redação';
  topic: string;
}

export interface SimuladoExam {
  id: string;
  title: string;
  targetExam: 'ENEM' | 'FUVEST' | 'UNICAMP' | 'UNESP' | 'Geral';
  timeLimitMinutes: number;
  questions: SimuladoQuestion[];
  createdAt: string;
}

export interface SimuladoResult {
  id: string;
  examId: string;
  title: string;
  score: number;
  totalQuestions: number;
  correctAnswersCount: number;
  timeSpentSeconds: number;
  triEstimatedScore: number; // e.g. 780
  areaBreakdown: Record<string, { total: number; correct: number; percentage: number }>;
  completedAt: string;
}
