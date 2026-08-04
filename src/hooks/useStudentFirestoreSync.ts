import React, { useEffect, useRef } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import {
  Subject,
  SchoolTimetable,
  StudentTaskItem,
  Evaluation,
  StudySessionLog,
  SpacedRevision,
  SchoolConfig
} from '../types';

const ensureArray = <T,>(val: any): T[] => {
  if (Array.isArray(val)) return val;
  if (val && typeof val === 'object') {
    return Object.values(val);
  }
  return [];
};

const sanitizeSubject = (s: any): Subject => ({
  id: String(s?.id || `sub_${Math.random().toString(36).substring(2, 9)}`),
  name: String(s?.name || 'Disciplina'),
  color: String(s?.color || '#4f46e5'),
  weight: Number(s?.weight) || 3,
  category: s?.category || 'Exatas',
  teacherName: s?.teacherName || '',
  enabled: s?.enabled !== false,
  isCustom: Boolean(s?.isCustom),
  parentSubjectId: s?.parentSubjectId ? String(s?.parentSubjectId) : undefined,
  topics: ensureArray(s?.topics).map((t: any) => ({
    id: String(t?.id || `top_${Math.random().toString(36).substring(2, 9)}`),
    name: String(t?.name || 'Tópico'),
    taught: Boolean(t?.taught),
    taughtDate: t?.taughtDate,
    bimester: t?.bimester ? Number(t?.bimester) as any : undefined,
    needsRecovery: Boolean(t?.needsRecovery),
    recoveryReason: t?.recoveryReason ? String(t.recoveryReason) : undefined
  })),
  examScopeTopicIds: ensureArray(s?.examScopeTopicIds).map(String)
});

const sanitizeTimetable = (tt: any): SchoolTimetable => {
  if (!tt) return [];
  const rawArray = Array.isArray(tt) ? tt : (typeof tt === 'object' ? Object.values(tt) : []);
  return rawArray.map((day: any) => ({
    dayKey: day?.dayKey || 'segunda',
    dayName: String(day?.dayName || 'Segunda-feira'),
    periods: ensureArray(day?.periods).map((p: any) => ({
      id: String(p?.id || `p_${Math.random().toString(36).substring(2, 9)}`),
      periodNumber: Number(p?.periodNumber) || 1,
      startTime: String(p?.startTime || '07:15'),
      endTime: String(p?.endTime || '08:00'),
      subjectId: String(p?.subjectId || '')
    }))
  }));
};

const sanitizeSchoolConfig = (cfg: any): SchoolConfig => {
  const defaultConfig: SchoolConfig = {
    periodType: 'trimestre',
    passingScore: 6.0,
    maxScorePerPeriod: 10.0,
    recoveryType: 'bimestral',
    recoveryCalculation: 'substitutiva',
    evalCategories: [
      { id: 'c1', name: 'Provas Principais (A1)', weightPercent: 70, maxScore: 10.0, description: 'Provas Bimestrais' },
      { id: 'c2', name: 'Atividades e Tarefas (A2)', weightPercent: 30, maxScore: 10.0, description: 'Trabalhos' }
    ]
  };

  if (!cfg || typeof cfg !== 'object') return defaultConfig;

  return {
    periodType: cfg.periodType || 'trimestre',
    passingScore: Number(cfg.passingScore) || 6.0,
    maxScorePerPeriod: Number(cfg.maxScorePerPeriod) || 10.0,
    recoveryType: cfg.recoveryType || 'bimestral',
    recoveryCalculation: cfg.recoveryCalculation || 'substitutiva',
    evalCategories: ensureArray(cfg.evalCategories).map((c: any) => ({
      id: String(c?.id || `cat_${Math.random()}`),
      name: String(c?.name || 'Avaliação'),
      weightPercent: Number(c?.weightPercent) || 100,
      maxScore: Number(c?.maxScore) || 10.0,
      description: String(c?.description || '')
    }))
  };
};

interface SyncDataProps {
  subjects: Subject[];
  setSubjects: React.Dispatch<React.SetStateAction<Subject[]>>;
  timetable: SchoolTimetable;
  setTimetable: React.Dispatch<React.SetStateAction<SchoolTimetable>>;
  studentTasks: StudentTaskItem[];
  setStudentTasks: React.Dispatch<React.SetStateAction<StudentTaskItem[]>>;
  evaluations: Evaluation[];
  setEvaluations: React.Dispatch<React.SetStateAction<Evaluation[]>>;
  studyLogs: StudySessionLog[];
  setStudyLogs: React.Dispatch<React.SetStateAction<StudySessionLog[]>>;
  spacedRevisions: SpacedRevision[];
  setSpacedRevisions: React.Dispatch<React.SetStateAction<SpacedRevision[]>>;
  schoolConfig: SchoolConfig;
  setSchoolConfig: React.Dispatch<React.SetStateAction<SchoolConfig>>;
  onNewUserWithoutData?: () => void;
}

export function useStudentFirestoreSync({
  subjects,
  setSubjects,
  timetable,
  setTimetable,
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
  onNewUserWithoutData
}: SyncDataProps) {
  const { activeStudentUid, currentUser, userProfile, familyGroup, isDemoMode } = useAuth();
  const { showSuccessToast, showErrorToast } = useToast();
  
  const isRemoteLoadingRef = useRef<boolean>(false);
  const hasLoadedRemoteRef = useRef<boolean>(false);

  // Target Student UID: activeStudentUid or currentUser's UID as fallback
  const targetUid = activeStudentUid || (userProfile?.role === 'student' ? currentUser?.uid : null);

  // Listen to remote changes for active student
  useEffect(() => {
    if (!targetUid || isDemoMode) {
      hasLoadedRemoteRef.current = false;
      return;
    }

    hasLoadedRemoteRef.current = false;
    const docRef = doc(db, 'studentData', targetUid);

    const unsubscribe = onSnapshot(docRef, async (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        isRemoteLoadingRef.current = true;

        if (data.subjects !== undefined) setSubjects(ensureArray(data.subjects).map(sanitizeSubject));
        if (data.timetable !== undefined) setTimetable(sanitizeTimetable(data.timetable));
        if (data.studentTasks !== undefined) setStudentTasks(ensureArray(data.studentTasks));
        if (data.evaluations !== undefined) setEvaluations(ensureArray(data.evaluations));
        if (data.studyLogs !== undefined) setStudyLogs(ensureArray(data.studyLogs));
        if (data.spacedRevisions !== undefined) setSpacedRevisions(ensureArray(data.spacedRevisions));
        if (data.schoolConfig !== undefined && data.schoolConfig) setSchoolConfig(sanitizeSchoolConfig(data.schoolConfig));

        hasLoadedRemoteRef.current = true;
        setTimeout(() => {
          isRemoteLoadingRef.current = false;
        }, 300);
      } else {
        // Document does not exist yet: Fresh real account!
        isRemoteLoadingRef.current = true;
        hasLoadedRemoteRef.current = true;

        try {
          await setDoc(docRef, {
            studentUid: targetUid,
            familyId: familyGroup?.id || 'fam_default',
            subjects: subjects || [],
            timetable: timetable || [],
            studentTasks: studentTasks || [],
            evaluations: evaluations || [],
            studyLogs: studyLogs || [],
            spacedRevisions: spacedRevisions || [],
            schoolConfig: schoolConfig,
            updatedAt: new Date().toISOString()
          }, { merge: true });
        } catch (err: any) {
          console.error('Error initializing student document:', err);
          showErrorToast('Erro ao criar registro de dados', err.message);
        }

        setTimeout(() => {
          isRemoteLoadingRef.current = false;
        }, 300);

        if (onNewUserWithoutData && subjects.length === 0) {
          onNewUserWithoutData();
        }
      }
    }, (err: any) => {
      console.error('Error listening to studentData snapshot:', err);
      showErrorToast('Falha na sincronização do banco de dados', err.message);
      hasLoadedRemoteRef.current = true; // Allow local saves even if snapshot listener fails
    });

    return () => unsubscribe();
  }, [targetUid, isDemoMode]);

  // Direct, force save helper exposed to window/custom callers
  const saveStudentDataNow = async (overrides?: Partial<{
    subjects: Subject[];
    timetable: SchoolTimetable;
    studentTasks: StudentTaskItem[];
    evaluations: Evaluation[];
    studyLogs: StudySessionLog[];
    spacedRevisions: SpacedRevision[];
    schoolConfig: SchoolConfig;
  }>, quiet = false) => {
    if (!targetUid || isDemoMode) {
      if (!quiet) {
        if (isDemoMode) {
          showSuccessToast('Modo Demonstração', 'Dados salvos localmente.');
        } else {
          showErrorToast('Nenhum aluno ativo selecionado', 'Selecione um aluno para salvar no banco de dados.');
        }
      }
      return;
    }

    try {
      const docRef = doc(db, 'studentData', targetUid);
      const payload = {
        studentUid: targetUid,
        familyId: familyGroup?.id || 'fam_default',
        subjects: overrides?.subjects ?? subjects,
        timetable: overrides?.timetable ?? timetable,
        studentTasks: overrides?.studentTasks ?? studentTasks,
        evaluations: overrides?.evaluations ?? evaluations,
        studyLogs: overrides?.studyLogs ?? studyLogs,
        spacedRevisions: overrides?.spacedRevisions ?? spacedRevisions,
        schoolConfig: overrides?.schoolConfig ?? schoolConfig,
        updatedAt: new Date().toISOString()
      };

      await setDoc(docRef, payload, { merge: true });
      if (!quiet) {
        showSuccessToast('Sucesso!', 'Dados e configurações gravados no Firestore.');
      }
    } catch (err: any) {
      console.error('Error saving to Firestore:', err);
      if (!quiet) {
        showErrorToast('Erro de gravação no Firestore', err.message || 'Falha ao salvar dados.');
      }
    }
  };

  // Auto save changes to Firestore when state updates
  useEffect(() => {
    if (!targetUid || isDemoMode || isRemoteLoadingRef.current || !hasLoadedRemoteRef.current) return;

    saveStudentDataNow(undefined, true);
  }, [subjects, timetable, studentTasks, evaluations, studyLogs, spacedRevisions, schoolConfig]);

  return { saveStudentDataNow };
}
