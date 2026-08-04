import { useState, useEffect } from 'react';
import { StudySessionLog, FamilyAgreement } from '../types';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';

export function useDailyProgress(studyLogs: StudySessionLog[], targetStudentUid?: string | null) {
  const { familyGroup, activeStudentUid, userProfile, isDemoMode } = useAuth();
  const effectiveStudentUid = targetStudentUid || activeStudentUid;

  const [agreement, setAgreement] = useState<FamilyAgreement | null>(null);
  const [loading, setLoading] = useState(true);

  // Today's date YYYY-MM-DD
  const todayStr = new Date().toISOString().split('T')[0];

  // Calculate today's total study minutes for this student
  const todayMinutes = studyLogs
    .filter((log) => log.date === todayStr)
    .reduce((acc, curr) => acc + (curr.minutes || 0), 0);

  // Sync Agreement from Firestore
  useEffect(() => {
    if (!effectiveStudentUid || !familyGroup?.id || isDemoMode) {
      setLoading(false);
      return;
    }

    const docRef = doc(db, 'families', familyGroup.id, 'agreements', effectiveStudentUid);
    const unsubscribe = onSnapshot(docRef, (snap) => {
      if (snap.exists()) {
        setAgreement(snap.data() as FamilyAgreement);
      } else {
        // Default initial agreement if none exists yet
        const defaultAgreement: FamilyAgreement = {
          id: `agr_${effectiveStudentUid}`,
          familyId: familyGroup.id,
          studentUid: effectiveStudentUid,
          dailyGoalMinutes: 60,
          parentNote: 'Estudar diariamente com foco e pausa Pomodoro.',
          status: 'pending_student',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          rewardIncentive: 'Passeio ou privilégio no fim de semana ao bater a meta semanal!'
        };
        setAgreement(defaultAgreement);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [effectiveStudentUid, familyGroup?.id, isDemoMode]);

  const saveAgreement = async (updated: Partial<FamilyAgreement>) => {
    if (!effectiveStudentUid || !familyGroup?.id) return;

    const full: FamilyAgreement = {
      ...(agreement || {
        id: `agr_${effectiveStudentUid}`,
        familyId: familyGroup.id,
        studentUid: effectiveStudentUid,
        dailyGoalMinutes: 60,
        createdAt: new Date().toISOString()
      }),
      ...updated,
      updatedAt: new Date().toISOString()
    };

    setAgreement(full);

    if (!isDemoMode) {
      try {
        const docRef = doc(db, 'families', familyGroup.id, 'agreements', effectiveStudentUid);
        await setDoc(docRef, full, { merge: true });
      } catch (err) {
        console.error('Error saving family agreement:', err);
      }
    }
  };

  const goalMinutes = agreement?.dailyGoalMinutes || 60;
  const progressPercent = Math.min(100, Math.round((todayMinutes / goalMinutes) * 100));
  const isGoalReached = todayMinutes >= goalMinutes;

  return {
    todayMinutes,
    goalMinutes,
    progressPercent,
    isGoalReached,
    agreement,
    saveAgreement,
    loading
  };
}
