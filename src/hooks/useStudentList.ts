import { useAuth } from '../contexts/AuthContext';
import { UserProfile } from '../types';

export function useStudentList() {
  const { familyStudents, activeStudentUid, setActiveStudentUid, familyGroup, isDemoMode } = useAuth();

  const activeStudentProfile: UserProfile | null =
    (familyStudents || []).find((s) => s.uid === activeStudentUid) ||
    (familyStudents && familyStudents.length > 0 ? familyStudents[0] : null);

  const switchActiveStudent = (uid: string) => {
    if (!uid) return;
    setActiveStudentUid(uid);
  };

  return {
    students: familyStudents || [],
    activeStudentUid,
    activeStudentProfile,
    switchActiveStudent,
    familyGroup,
    isDemoMode,
    hasStudents: (familyStudents || []).length > 0,
  };
}
