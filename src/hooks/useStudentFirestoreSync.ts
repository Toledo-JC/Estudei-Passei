import React, { useEffect, useRef } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import {
  Subject,
  SchoolTimetable,
  StudentTaskItem,
  Evaluation,
  StudySessionLog,
  SpacedRevision,
  SchoolConfig
} from '../types';

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
  const { activeStudentUid, familyGroup, isDemoMode, userProfile } = useAuth();
  const isRemoteLoadingRef = useRef<boolean>(false);
  const checkedFirstLoadRef = useRef<boolean>(false);

  // Listen to remote changes for active student
  useEffect(() => {
    if (!activeStudentUid || isDemoMode) return;

    const docRef = doc(db, 'studentData', activeStudentUid);
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        isRemoteLoadingRef.current = true;

        if (data.subjects !== undefined) setSubjects(data.subjects);
        if (data.timetable !== undefined) setTimetable(data.timetable);
        if (data.studentTasks !== undefined) setStudentTasks(data.studentTasks);
        if (data.evaluations !== undefined) setEvaluations(data.evaluations);
        if (data.studyLogs !== undefined) setStudyLogs(data.studyLogs);
        if (data.spacedRevisions !== undefined) setSpacedRevisions(data.spacedRevisions);
        if (data.schoolConfig !== undefined) setSchoolConfig(data.schoolConfig);

        setTimeout(() => {
          isRemoteLoadingRef.current = false;
        }, 500);
      } else if (!checkedFirstLoadRef.current) {
        // Document does not exist yet: Fresh real account!
        checkedFirstLoadRef.current = true;
        // Start empty for fresh real account
        setSubjects([]);
        setStudentTasks([]);
        setEvaluations([]);
        setStudyLogs([]);
        setSpacedRevisions([]);

        if (onNewUserWithoutData) {
          onNewUserWithoutData();
        }
      }
    });

    return () => unsubscribe();
  }, [activeStudentUid, isDemoMode]);

  // Save changes to Firestore when state updates
  const saveToFirestore = async () => {
    if (!activeStudentUid || isDemoMode || isRemoteLoadingRef.current) return;

    try {
      const docRef = doc(db, 'studentData', activeStudentUid);
      await setDoc(docRef, {
        studentUid: activeStudentUid,
        familyId: familyGroup?.id || 'fam_default',
        subjects,
        timetable,
        studentTasks,
        evaluations,
        studyLogs,
        spacedRevisions,
        schoolConfig,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (err) {
      console.error('Error auto-saving to Firestore:', err);
    }
  };

  useEffect(() => {
    saveToFirestore();
  }, [subjects, timetable, studentTasks, evaluations, studyLogs, spacedRevisions, schoolConfig]);
}
