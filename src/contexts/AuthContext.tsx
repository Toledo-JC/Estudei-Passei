import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  User as FirebaseUser
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  getDocs,
  onSnapshot
} from 'firebase/firestore';
import { auth, db, googleProvider, cleanFirestoreData } from '../lib/firebase';
import { UserProfile, FamilyGroup, FamilyInvitation, FamilyReward, FamilyAuditLog } from '../types';

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userProfile: UserProfile | null;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  familyGroup: FamilyGroup | null;
  loading: boolean;
  activeStudentUid: string | null;
  familyStudents: UserProfile[];
  familyParents: UserProfile[];
  familyAuditLogs: FamilyAuditLog[];
  rewards: FamilyReward[];
  pendingInvitations: FamilyInvitation[];
  setActiveStudentUid: (uid: string) => void;
  removeStudentFromFamily: (studentUid: string) => Promise<void>;
  resetUserProfileData: (targetUid?: string) => Promise<void>;
  joinFamilyWithCode: (code: string, newRole?: 'parent' | 'student') => Promise<void>;
  linkMemberByEmail: (emailToLink: string, targetRole: 'parent' | 'student') => Promise<void>;
  createFamilyInvitation: (emailToInvite: string, targetRole: 'parent' | 'student') => Promise<FamilyInvitation>;
  verifyAndAcceptPinCode: (pinCode: string) => Promise<void>;
  cancelInvitation: (invitationId: string) => Promise<void>;
  grantReward: (payload: {
    studentUid: string;
    type: 'star' | 'medal_bronze' | 'medal_silver' | 'medal_gold' | 'trophy';
    title: string;
    message: string;
    realReward?: string;
    trigger?: 'auto_daily_goal' | 'manual' | 'challenge_winner' | 'agreement_milestone';
  }) => Promise<void>;
  markRewardsAsViewed: (studentUid: string) => Promise<void>;
  getFamilyByCode: (code: string) => Promise<FamilyGroup | null>;
  logFamilyAudit: (action: FamilyAuditLog['action'], details: string, targetName?: string) => Promise<void>;
  login: (email: string, pass: string) => Promise<void>;
  register: (
    email: string,
    pass: string,
    name: string,
    role: 'parent' | 'student',
    familyCodeInput?: string,
    familyNameInput?: string,
    studentYearInput?: string
  ) => Promise<void>;
  loginWithGoogle: (
    role: 'parent' | 'student',
    familyCodeInput?: string,
    familyNameInput?: string,
    studentYearInput?: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  loginDemo: (role: 'parent' | 'student') => void;
  isDemoMode: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [familyGroup, setFamilyGroup] = useState<FamilyGroup | null>(null);
  const [familyStudents, setFamilyStudents] = useState<UserProfile[]>([]);
  const [familyParents, setFamilyParents] = useState<UserProfile[]>([]);
  const [activeStudentUid, setActiveStudentUid] = useState<string | null>(null);
  const [familyAuditLogs, setFamilyAuditLogs] = useState<FamilyAuditLog[]>([]);
  const [rewards, setRewards] = useState<FamilyReward[]>([]);
  const [pendingInvitations, setPendingInvitations] = useState<FamilyInvitation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);

  // Helper to generate unique Family Code (e.g. FAM-7492)
  const generateFamilyCode = () => {
    return 'FAM-' + Math.floor(1000 + Math.random() * 9000);
  };

  const logFamilyAudit = async (
    action: FamilyAuditLog['action'],
    details: string,
    targetName?: string
  ) => {
    const logId = `log_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    const newLog: FamilyAuditLog = {
      id: logId,
      familyId: familyGroup?.id || 'fam_default',
      actorUid: userProfile?.uid || 'user_sys',
      actorName: userProfile?.name || 'Responsável',
      action,
      targetName,
      details,
      timestamp: new Date().toISOString()
    };

    setFamilyAuditLogs(prev => [newLog, ...prev]);

    if (!isDemoMode && familyGroup?.id) {
      await setDoc(doc(db, 'familyAuditLogs', logId), cleanFirestoreData(newLog)).catch(console.error);
    }
  };

  const getFamilyByCode = async (code: string): Promise<FamilyGroup | null> => {
    if (!code) return null;
    const cleanCode = code.trim().toUpperCase();
    if (isDemoMode) {
      if (cleanCode === familyGroup?.familyCode || cleanCode === 'FAM-2026') {
        return familyGroup;
      }
      return null;
    }
    try {
      const qFam = query(collection(db, 'families'), where('familyCode', '==', cleanCode));
      const famSnap = await getDocs(qFam);
      if (!famSnap.empty) {
        const famDoc = famSnap.docs[0];
        return { id: famDoc.id, ...famDoc.data() } as FamilyGroup;
      }
    } catch (err) {
      console.error('Error fetching family by code:', err);
    }
    return null;
  };

  const grantReward = async (payload: {
    studentUid: string;
    type: 'star' | 'medal_bronze' | 'medal_silver' | 'medal_gold' | 'trophy';
    title: string;
    message: string;
    realReward?: string;
    trigger?: 'auto_daily_goal' | 'manual' | 'challenge_winner' | 'agreement_milestone';
  }) => {
    const rewardId = `rw_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    const newReward: FamilyReward = {
      id: rewardId,
      familyId: familyGroup?.id || 'fam_default',
      studentUid: payload.studentUid,
      type: payload.type,
      title: payload.title,
      message: payload.message,
      realReward: payload.realReward,
      grantedByUid: userProfile?.uid || 'parent_sys',
      grantedByName: userProfile?.name || 'Responsável',
      trigger: payload.trigger || 'manual',
      createdAt: new Date().toISOString(),
      viewedByStudent: false
    };

    setRewards(prev => [newReward, ...prev]);

    if (!isDemoMode && familyGroup?.id) {
      await setDoc(doc(db, 'rewards', rewardId), cleanFirestoreData(newReward)).catch(console.error);
    }

    const studentProfile = familyStudents.find(s => s.uid === payload.studentUid);
    await logFamilyAudit(
      'reward_granted',
      `Concedeu recompensa (${payload.type.toUpperCase()}): "${payload.title}" com mensagem: "${payload.message}".`,
      studentProfile?.name || 'Estudante'
    );
  };

  const markRewardsAsViewed = async (studentUid: string) => {
    setRewards(prev =>
      prev.map(r => (r.studentUid === studentUid ? { ...r, viewedByStudent: true } : r))
    );

    if (!isDemoMode) {
      const unread = rewards.filter(r => r.studentUid === studentUid && !r.viewedByStudent);
      for (const r of unread) {
        await updateDoc(doc(db, 'rewards', r.id), { viewedByStudent: true }).catch(() => {});
      }
    }
  };

  useEffect(() => {
    if (isDemoMode) {
      setLoading(false);
      return;
    }

    let unsubProfile: (() => void) | null = null;
    let unsubFamily: (() => void) | null = null;
    let unsubStudents: (() => void) | null = null;
    let unsubParents: (() => void) | null = null;
    let unsubInvitations: (() => void) | null = null;

    const unsubAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);

      if (unsubProfile) unsubProfile();
      if (unsubFamily) unsubFamily();
      if (unsubStudents) unsubStudents();
      if (unsubParents) unsubParents();
      if (unsubInvitations) unsubInvitations();

      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        unsubProfile = onSnapshot(userDocRef, async (userSnap) => {
          if (userSnap.exists()) {
            const profile = userSnap.data() as UserProfile;
            setUserProfile(profile);

            // Ensure parent has a family group and family code
            let targetFamilyId = profile.familyId;
            if (!targetFamilyId && profile.role === 'parent') {
              targetFamilyId = `fam_${user.uid.slice(0, 8)}_${Date.now()}`;
              const newFamilyCode = generateFamilyCode();
              const newFamily: FamilyGroup = {
                id: targetFamilyId,
                familyName: `Família ${(profile?.name || 'Estudei').split(' ')[0]}`,
                familyCode: newFamilyCode,
                parentUids: [user.uid],
                studentUids: [],
                createdAt: new Date().toISOString()
              };
              await setDoc(doc(db, 'families', targetFamilyId), newFamily);
              await updateDoc(doc(db, 'users', user.uid), { familyId: targetFamilyId });
            }

            if (targetFamilyId) {
              // Real-time listener for Family Group
              const famRef = doc(db, 'families', targetFamilyId);
              if (unsubFamily) unsubFamily();
              unsubFamily = onSnapshot(famRef, (famSnap) => {
                if (famSnap.exists()) {
                  setFamilyGroup(famSnap.data() as FamilyGroup);
                }
              });

              // Real-time listener for Family Parents (Pai & Mãe)
              const qParents = query(
                collection(db, 'users'),
                where('familyId', '==', targetFamilyId),
                where('role', '==', 'parent')
              );
              if (unsubParents) unsubParents();
              unsubParents = onSnapshot(qParents, (querySnap) => {
                const parents = querySnap.docs.map(d => d.data() as UserProfile);
                setFamilyParents(parents);
              });

              // Real-time listener for Family Students
              const qStudents = query(
                collection(db, 'users'),
                where('familyId', '==', targetFamilyId),
                where('role', '==', 'student')
              );
              if (unsubStudents) unsubStudents();
              unsubStudents = onSnapshot(qStudents, (querySnap) => {
                const students = querySnap.docs.map(d => d.data() as UserProfile);
                setFamilyStudents(students);

                if (profile.role === 'student') {
                  setActiveStudentUid(user.uid);
                } else {
                  setActiveStudentUid(prevUid => {
                    if (prevUid && students.some(s => s.uid === prevUid)) {
                      return prevUid;
                    }
                    return students.length > 0 ? students[0].uid : null;
                  });
                }
              });
              // Real-time listener for Family Invitations (sent or received)
              const qInv = query(
                collection(db, 'family_invitations'),
                where('familyId', '==', targetFamilyId)
              );
              if (unsubInvitations) unsubInvitations();
              unsubInvitations = onSnapshot(qInv, (querySnap) => {
                const invs = querySnap.docs.map(d => d.data() as FamilyInvitation);
                setPendingInvitations(invs);
              });
            }
          } else {
            setUserProfile(null);
            setFamilyGroup(null);
            setFamilyStudents([]);
            setFamilyParents([]);
            setPendingInvitations([]);
            setActiveStudentUid(null);
          }
          setLoading(false);
        }, (err) => {
          console.error('Error in profile snapshot:', err);
          setLoading(false);
        });
      } else {
        setUserProfile(null);
        setFamilyGroup(null);
        setFamilyStudents([]);
        setFamilyParents([]);
        setActiveStudentUid(null);
        setLoading(false);
      }
    });

    return () => {
      unsubAuth();
      if (unsubProfile) unsubProfile();
      if (unsubFamily) unsubFamily();
      if (unsubStudents) unsubStudents();
      if (unsubParents) unsubParents();
      if (unsubInvitations) unsubInvitations();
    };
  }, [isDemoMode]);

  const login = async (email: string, pass: string) => {
    setIsDemoMode(false);
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (err: any) {
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        throw new Error('E-mail ou senha incorretos. Por favor, tente novamente.');
      } else if (err.code === 'auth/invalid-email') {
        throw new Error('E-mail em formato inválido.');
      } else if (err.code === 'auth/too-many-requests') {
        throw new Error('Acesso bloqueado temporariamente por muitas tentativas. Tente mais tarde.');
      }
      throw new Error(err.message || 'Erro ao realizar login.');
    }
  };

  const register = async (
    email: string,
    pass: string,
    name: string,
    role: 'parent' | 'student',
    familyCodeInput?: string,
    familyNameInput?: string,
    studentYearInput?: string
  ) => {
    setIsDemoMode(false);
    let userCred;
    try {
      userCred = await createUserWithEmailAndPassword(auth, email, pass);
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        throw new Error('Este e-mail já está cadastrado no sistema. Tente fazer login ou use outro e-mail.');
      } else if (err.code === 'auth/weak-password') {
        throw new Error('A senha deve conter no mínimo 6 caracteres.');
      } else if (err.code === 'auth/invalid-email') {
        throw new Error('E-mail em formato inválido.');
      }
      throw new Error(err.message || 'Erro ao criar conta.');
    }

    const uid = userCred.user.uid;

    let targetFamilyId = '';
    let targetFamilyCode = '';

    if (familyCodeInput && familyCodeInput.trim().length > 0) {
      const cleanCode = familyCodeInput.trim().toUpperCase();
      // Find existing family by code
      const qFam = query(collection(db, 'families'), where('familyCode', '==', cleanCode));
      const famSnap = await getDocs(qFam);

      if (!famSnap.empty) {
        const famDoc = famSnap.docs[0];
        targetFamilyId = famDoc.id;
        targetFamilyCode = famDoc.data().familyCode;

        // Update family array
        const famRef = doc(db, 'families', targetFamilyId);
        if (role === 'parent') {
          await updateDoc(famRef, {
            parentUids: [...(famDoc.data().parentUids || []), uid]
          });
        } else {
          await updateDoc(famRef, {
            studentUids: [...(famDoc.data().studentUids || []), uid]
          });
        }
      } else {
        throw new Error(`Código Familiar "${cleanCode}" não foi encontrado! Verifique o código enviado pelo responsável.`);
      }
    } else {
      // Create new family group
      targetFamilyId = `fam_${Date.now()}`;
      targetFamilyCode = generateFamilyCode();

      const newFamily: FamilyGroup = {
        id: targetFamilyId,
        familyName: familyNameInput || `Família ${name.split(' ')[0]}`,
        familyCode: targetFamilyCode,
        parentUids: role === 'parent' ? [uid] : [],
        studentUids: role === 'student' ? [uid] : [],
        createdAt: new Date().toISOString()
      };

      await setDoc(doc(db, 'families', targetFamilyId), newFamily);
      setFamilyGroup(newFamily);
    }

    const newProfile: UserProfile = {
      uid,
      email,
      name,
      role,
      familyId: targetFamilyId,
      studentYear: studentYearInput || (role === 'student' ? '2º Ano do Ensino Médio' : undefined),
      createdAt: new Date().toISOString(),
      planType: 'family_pass',
      subscriptionStatus: 'trial',
      subscriptionValidUntil: new Date(Date.now() + 30 * 86400000).toISOString(),
      maxStudentsAllowed: 5
    };

    await setDoc(doc(db, 'users', uid), cleanFirestoreData(newProfile));
    setUserProfile(newProfile);

    if (role === 'student') {
      setActiveStudentUid(uid);
    }
  };

  const loginWithGoogle = async (
    role: 'parent' | 'student',
    familyCodeInput?: string,
    familyNameInput?: string,
    studentYearInput?: string
  ) => {
    setIsDemoMode(false);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const uid = user.uid;

      // Check if user profile already exists
      const userDocRef = doc(db, 'users', uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const profile = userDocSnap.data() as UserProfile;
        setUserProfile(profile);

        if (profile.familyId) {
          const famRef = doc(db, 'families', profile.familyId);
          const famSnap = await getDoc(famRef);
          if (famSnap.exists()) {
            const famData = famSnap.data() as FamilyGroup;
            setFamilyGroup(famData);

            const qStudents = query(
              collection(db, 'users'),
              where('familyId', '==', profile.familyId),
              where('role', '==', 'student')
            );
            const querySnap = await getDocs(qStudents);
            const students = querySnap.docs.map(d => d.data() as UserProfile);
            setFamilyStudents(students);

            if (profile.role === 'student') {
              setActiveStudentUid(uid);
            } else if (students.length > 0) {
              setActiveStudentUid(students[0].uid);
            }
          }
        }
        return;
      }

      // New user registration via Google
      let targetFamilyId = '';
      let targetFamilyCode = '';

      if (familyCodeInput && familyCodeInput.trim().length > 0) {
        const cleanCode = familyCodeInput.trim().toUpperCase();
        const qFam = query(collection(db, 'families'), where('familyCode', '==', cleanCode));
        const famSnap = await getDocs(qFam);

        if (!famSnap.empty) {
          const famDoc = famSnap.docs[0];
          targetFamilyId = famDoc.id;
          targetFamilyCode = famDoc.data().familyCode;

          const famRef = doc(db, 'families', targetFamilyId);
          if (role === 'parent') {
            await updateDoc(famRef, {
              parentUids: [...(famDoc.data().parentUids || []), uid]
            });
          } else {
            await updateDoc(famRef, {
              studentUids: [...(famDoc.data().studentUids || []), uid]
            });
          }
        } else {
          throw new Error(`Código Familiar "${cleanCode}" não foi encontrado! Verifique o código enviado pelo responsável.`);
        }
      } else {
        targetFamilyId = `fam_${Date.now()}`;
        targetFamilyCode = generateFamilyCode();

        const newFamily: FamilyGroup = {
          id: targetFamilyId,
          familyName: familyNameInput || `Família ${(user.displayName || 'Estudei').split(' ')[0]}`,
          familyCode: targetFamilyCode,
          parentUids: role === 'parent' ? [uid] : [],
          studentUids: role === 'student' ? [uid] : [],
          createdAt: new Date().toISOString()
        };

        await setDoc(doc(db, 'families', targetFamilyId), newFamily);
        setFamilyGroup(newFamily);
      }

      const newProfile: UserProfile = {
        uid,
        email: user.email || '',
        name: user.displayName || 'Usuário Google',
        role,
        familyId: targetFamilyId,
        studentYear: studentYearInput || (role === 'student' ? '2º Ano do Ensino Médio' : undefined),
        createdAt: new Date().toISOString(),
        photoURL: user.photoURL || undefined,
        planType: 'family_pass',
        subscriptionStatus: 'trial',
        subscriptionValidUntil: new Date(Date.now() + 30 * 86400000).toISOString(),
        maxStudentsAllowed: 5
      };

      await setDoc(doc(db, 'users', uid), cleanFirestoreData(newProfile));
      setUserProfile(newProfile);

      if (role === 'student') {
        setActiveStudentUid(uid);
      }
    } catch (err: any) {
      console.error('Google Login Error:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        throw new Error('A janela de login do Google foi fechada antes da conclusão.');
      } else if (err.code === 'auth/cancelled-popup-request') {
        throw new Error('Operação de login cancelada pelo usuário.');
      }
      throw new Error(err.message || 'Erro ao realizar login social com o Google.');
    }
  };

  const removeStudentFromFamily = async (studentUid: string) => {
    const targetStudent = familyStudents.find(s => s.uid === studentUid);
    const targetName = targetStudent?.name || 'Estudante';

    if (isDemoMode) {
      const remainingStudents = familyStudents.filter(s => s.uid !== studentUid);
      setFamilyStudents(remainingStudents);
      if (familyGroup) {
        setFamilyGroup({
          ...familyGroup,
          studentUids: (familyGroup.studentUids || []).filter(id => id !== studentUid)
        });
      }
      if (activeStudentUid === studentUid) {
        setActiveStudentUid(remainingStudents.length > 0 ? remainingStudents[0].uid : null);
      }
      await logFamilyAudit('member_removed', `Removeu ${targetName} do grupo familiar. Os dados foram arquivados.`, targetName);
      return;
    }

    try {
      // 1. Archive studentData document into archivedStudentData/{studentUid}
      const studentDataRef = doc(db, 'studentData', studentUid);
      const snap = await getDoc(studentDataRef);
      if (snap.exists()) {
        const archivedRef = doc(db, 'archivedStudentData', studentUid);
        await setDoc(archivedRef, {
          ...snap.data(),
          archivedAt: new Date().toISOString(),
          archivedByUid: userProfile?.uid,
          archivedByName: userProfile?.name
        }).catch(() => {});
        await deleteDoc(studentDataRef).catch(() => {});
      }

      // 2. Remove student UID from family group in Firestore
      if (familyGroup?.id) {
        const famRef = doc(db, 'families', familyGroup.id);
        const updatedStudentUids = (familyGroup.studentUids || []).filter(id => id !== studentUid);
        await updateDoc(famRef, { studentUids: updatedStudentUids });

        setFamilyGroup({
          ...familyGroup,
          studentUids: updatedStudentUids
        });
      }

      // 3. Clear familyId from student user profile in Firestore
      const studentUserRef = doc(db, 'users', studentUid);
      await updateDoc(studentUserRef, {
        familyId: null
      }).catch(() => {});

      // 4. Update local AuthContext state
      const remainingStudents = familyStudents.filter(s => s.uid !== studentUid);
      setFamilyStudents(remainingStudents);

      if (activeStudentUid === studentUid) {
        setActiveStudentUid(remainingStudents.length > 0 ? remainingStudents[0].uid : null);
      }

      // 5. Audit Log
      await logFamilyAudit('member_removed', `Desvinculou e arquivou dados do estudante ${targetName}.`, targetName);
    } catch (err: any) {
      console.error('Error removing student from family:', err);
      throw new Error(err.message || 'Erro ao remover estudante da família.');
    }
  };

  const resetUserProfileData = async (targetUid?: string) => {
    const uid = targetUid || userProfile?.uid;
    if (!uid) return;

    if (isDemoMode) {
      localStorage.removeItem('estudei_subjects');
      localStorage.removeItem('estudei_evaluations');
      localStorage.removeItem('estudei_studyLogs');
      localStorage.removeItem('estudei_spacedRevisions');
      localStorage.removeItem('estudei_studentTasks');
      localStorage.removeItem('estudei_schoolTimetable');
      await logFamilyAudit('profile_reset', 'Perfil e histórico de estudo zerados pelo usuário.');
      return;
    }

    try {
      const studentDataRef = doc(db, 'studentData', uid);
      await setDoc(studentDataRef, {
        studentUid: uid,
        familyId: familyGroup?.id || 'fam_default',
        subjects: [],
        timetable: {},
        studentTasks: [],
        evaluations: [],
        studyLogs: [],
        spacedRevisions: [],
        schoolConfig: {
          schoolType: 'trimestral',
          passingScore: 6.0,
          maxScore: 10.0,
          evalCategories: [
            { id: 'c1', name: 'Provas Principais (A1)', weightPercent: 70, description: 'Provas Bimestrais' },
            { id: 'c2', name: 'Atividades e Tarefas (A2)', weightPercent: 30, description: 'Trabalhos' }
          ]
        },
        updatedAt: new Date().toISOString()
      });

      localStorage.removeItem('estudei_subjects');
      localStorage.removeItem('estudei_evaluations');
      localStorage.removeItem('estudei_studyLogs');
      localStorage.removeItem('estudei_spacedRevisions');
      localStorage.removeItem('estudei_studentTasks');
      localStorage.removeItem('estudei_schoolTimetable');

      await logFamilyAudit('profile_reset', `Histórico de estudos e planejamento zerados para o perfil.`, userProfile?.name);
    } catch (err: any) {
      console.error('Error resetting profile data:', err);
      throw new Error('Erro ao zerar dados do perfil: ' + err.message);
    }
  };

  const joinFamilyWithCode = async (code: string, newRole?: 'parent' | 'student') => {
    if (!code || !code.trim()) {
      throw new Error('Informe o Código Familiar (ex: FAM-1234).');
    }
    const cleanCode = code.trim().toUpperCase();
    const targetRole = newRole || userProfile?.role || 'student';

    if (isDemoMode) {
      if (cleanCode === familyGroup?.familyCode || cleanCode === 'FAM-2026') {
        if (userProfile) {
          setUserProfile({ ...userProfile, role: targetRole, familyId: familyGroup?.id || 'fam_demo_123' });
        }
        await logFamilyAudit('invite_accepted', `Vincular-se à família via código ${cleanCode}.`, userProfile?.name);
        return;
      }
      throw new Error(`Código Familiar "${cleanCode}" não foi encontrado em modo demonstração.`);
    }

    if (!currentUser || !userProfile) {
      throw new Error('Você precisa estar autenticado para se vincular a uma família.');
    }

    const qFam = query(collection(db, 'families'), where('familyCode', '==', cleanCode));
    const famSnap = await getDocs(qFam);

    if (famSnap.empty) {
      throw new Error(`Código Familiar "${cleanCode}" não foi encontrado! Verifique o código enviado pelo responsável.`);
    }

    const famDoc = famSnap.docs[0];
    const targetFamilyId = famDoc.id;
    const famData = famDoc.data() as FamilyGroup;

    // Update family arrays
    const famRef = doc(db, 'families', targetFamilyId);
    if (targetRole === 'parent') {
      const updatedParents = Array.from(new Set([...(famData.parentUids || []), currentUser.uid]));
      await updateDoc(famRef, { parentUids: updatedParents });
    } else {
      const updatedStudents = Array.from(new Set([...(famData.studentUids || []), currentUser.uid]));
      await updateDoc(famRef, { studentUids: updatedStudents });
    }

    // Update user profile familyId and role
    const userRef = doc(db, 'users', currentUser.uid);
    await updateDoc(userRef, {
      familyId: targetFamilyId,
      role: targetRole
    });

    setUserProfile({
      ...userProfile,
      familyId: targetFamilyId,
      role: targetRole
    });

    await logFamilyAudit(
      'invite_accepted',
      `O usuário ${userProfile.name} (${userProfile.email}) vinculou-se à família ${famData.familyName} com a função de ${targetRole === 'parent' ? 'Responsável (Mãe/Pai)' : 'Estudante (Filho/a)'}.`,
      userProfile.name
    );
  };

  const linkMemberByEmail = async (emailToLink: string, targetRole: 'parent' | 'student') => {
    if (!emailToLink || !emailToLink.trim()) {
      throw new Error('Informe o e-mail do membro da família que deseja vincular.');
    }
    const cleanEmail = emailToLink.trim().toLowerCase();

    if (!familyGroup?.id) {
      throw new Error('Grupo familiar não localizado para realizar a vinculação.');
    }

    if (isDemoMode) {
      const dummyMember: UserProfile = {
        uid: `demo_user_${Date.now()}`,
        email: cleanEmail,
        name: targetRole === 'parent' ? 'Maria Toledo (Mãe / Co-Responsável)' : 'Ana Toledo (Filha / Estudante)',
        role: targetRole,
        familyId: familyGroup.id,
        createdAt: new Date().toISOString()
      };
      if (targetRole === 'parent') {
        setFamilyParents(prev => [...prev, dummyMember]);
      } else {
        setFamilyStudents(prev => [...prev, dummyMember]);
      }
      await logFamilyAudit('invite_accepted', `Vinculou ${cleanEmail} à família (${targetRole === 'parent' ? 'Mãe/Responsável' : 'Estudante'}).`, dummyMember.name);
      return;
    }

    // Query user by email in Firestore
    const qUser = query(collection(db, 'users'), where('email', '==', cleanEmail));
    const userSnap = await getDocs(qUser);

    if (userSnap.empty) {
      throw new Error(`Não encontramos nenhuma conta cadastrada com o e-mail "${cleanEmail}". Peça para a pessoa criar a conta no aplicativo primeiro ou envie o Link/Código Familiar.`);
    }

    const targetUserDoc = userSnap.docs[0];
    const targetUid = targetUserDoc.id;
    const targetUserData = targetUserDoc.data() as UserProfile;

    // Update target user's familyId and role
    const targetUserRef = doc(db, 'users', targetUid);
    await updateDoc(targetUserRef, {
      familyId: familyGroup.id,
      role: targetRole
    });

    // Update family group arrays
    const famRef = doc(db, 'families', familyGroup.id);
    if (targetRole === 'parent') {
      const updatedParents = Array.from(new Set([...(familyGroup.parentUids || []), targetUid]));
      await updateDoc(famRef, { parentUids: updatedParents });
    } else {
      const updatedStudents = Array.from(new Set([...(familyGroup.studentUids || []), targetUid]));
      await updateDoc(famRef, { studentUids: updatedStudents });
    }

    await logFamilyAudit(
      'invite_accepted',
      `O usuário ${targetUserData.name} (${cleanEmail}) foi vinculado com sucesso como ${targetRole === 'parent' ? 'Responsável (Mãe/Pai)' : 'Estudante (Filha/o)'}.`,
      targetUserData.name
    );
  };

  const createFamilyInvitation = async (emailToInvite: string, targetRole: 'parent' | 'student') => {
    if (!emailToInvite || !emailToInvite.trim()) {
      throw new Error('Informe o e-mail da pessoa que deseja convidar para a família.');
    }
    const cleanEmail = emailToInvite.trim().toLowerCase();
    if (!familyGroup) {
      throw new Error('Grupo familiar não encontrado.');
    }

    // Generate random 6-digit Security PIN code
    const pinCode = Math.floor(100000 + Math.random() * 900000).toString();
    const inviteId = `inv_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    const newInvite: FamilyInvitation = {
      id: inviteId,
      familyId: familyGroup.id,
      familyCode: familyGroup.familyCode,
      familyName: familyGroup.familyName,
      invitedEmail: cleanEmail,
      targetRole,
      pinCode,
      status: 'pending',
      createdByUid: currentUser?.uid || 'user_demo',
      createdByName: userProfile?.name || 'Responsável',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    };

    if (isDemoMode) {
      setPendingInvitations(prev => [newInvite, ...prev]);
      await logFamilyAudit(
        'invite_created',
        `Criou um Convite Seguro com PIN ${pinCode} para ${cleanEmail} (${targetRole === 'parent' ? 'Mãe/Responsável' : 'Filha/Estudante'}).`,
        cleanEmail
      );
      return newInvite;
    }

    await setDoc(doc(db, 'family_invitations', inviteId), newInvite);
    await logFamilyAudit(
      'invite_created',
      `Gerou Convite e Token de Segurança (PIN: ${pinCode}) para ${cleanEmail} (${targetRole === 'parent' ? 'Responsável' : 'Estudante'}).`,
      cleanEmail
    );
    return newInvite;
  };

  const verifyAndAcceptPinCode = async (pinCodeInput: string) => {
    if (!pinCodeInput || !pinCodeInput.trim()) {
      throw new Error('Digite o PIN de Segurança de 6 dígitos enviado pelo responsável.');
    }
    const cleanPin = pinCodeInput.trim().replace(/\D/g, '');
    if (cleanPin.length !== 6) {
      throw new Error('O PIN de Segurança precisa ter exatamente 6 dígitos numéricos.');
    }

    if (isDemoMode) {
      const inv = pendingInvitations.find(i => i.pinCode === cleanPin && i.status === 'pending');
      if (!inv && cleanPin !== '123456') {
        throw new Error(`PIN de Segurança "${cleanPin}" inválido ou expirado em modo demonstração.`);
      }
      const targetInv = inv || {
        id: 'inv_demo',
        familyId: familyGroup?.id || 'fam_demo_123',
        familyCode: familyGroup?.familyCode || 'FAM-2026',
        familyName: familyGroup?.familyName || 'Família Toledo',
        invitedEmail: userProfile?.email || 'usuario@estudei.com',
        targetRole: 'parent' as const,
        pinCode: '123456',
        status: 'pending' as const,
        createdByUid: 'parent_demo_1',
        createdByName: 'Roberto Toledo',
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 86400000).toISOString()
      };

      await joinFamilyWithCode(targetInv.familyCode, targetInv.targetRole);
      setPendingInvitations(prev => prev.map(p => p.id === targetInv.id ? { ...p, status: 'accepted' } : p));
      return;
    }

    if (!currentUser) {
      throw new Error('Você precisa estar logado para validar o PIN de Segurança.');
    }

    const qInv = query(
      collection(db, 'family_invitations'),
      where('pinCode', '==', cleanPin),
      where('status', '==', 'pending')
    );
    const snapInv = await getDocs(qInv);

    if (snapInv.empty) {
      throw new Error(`PIN de Segurança de 6 dígitos "${cleanPin}" não encontrado, já utilizado ou expirado.`);
    }

    const invDoc = snapInv.docs[0];
    const invData = invDoc.data() as FamilyInvitation;
    const targetFamilyId = invData.familyId;
    const targetRole = invData.targetRole;

    // Link in family document
    const famRef = doc(db, 'families', targetFamilyId);
    const famSnap = await getDoc(famRef);
    if (famSnap.exists()) {
      const famData = famSnap.data() as FamilyGroup;
      if (targetRole === 'parent') {
        const updatedParents = Array.from(new Set([...(famData.parentUids || []), currentUser.uid]));
        await updateDoc(famRef, { parentUids: updatedParents });
      } else {
        const updatedStudents = Array.from(new Set([...(famData.studentUids || []), currentUser.uid]));
        await updateDoc(famRef, { studentUids: updatedStudents });
      }
    }

    // Update current user profile
    const userRef = doc(db, 'users', currentUser.uid);
    await updateDoc(userRef, {
      familyId: targetFamilyId,
      role: targetRole
    });

    // Mark invitation as accepted
    await updateDoc(doc(db, 'family_invitations', invDoc.id), {
      status: 'accepted'
    });

    if (userProfile) {
      setUserProfile({
        ...userProfile,
        familyId: targetFamilyId,
        role: targetRole
      });
    }

    await logFamilyAudit(
      'invite_accepted',
      `Segurança Confirmada! O usuário ${userProfile?.name || currentUser.email} informou o PIN ${cleanPin} e vinculou-se à família ${invData.familyName} como ${targetRole === 'parent' ? 'Co-Responsável (Mãe/Pai)' : 'Estudante (Filha/o)'}.`,
      userProfile?.name
    );
  };

  const cancelInvitation = async (invitationId: string) => {
    if (isDemoMode) {
      setPendingInvitations(prev => prev.filter(i => i.id !== invitationId));
      return;
    }
    await deleteDoc(doc(db, 'family_invitations', invitationId));
  };

  const logout = async () => {
    setIsDemoMode(false);
    await firebaseSignOut(auth);
    setUserProfile(null);
    setFamilyGroup(null);
    setFamilyStudents([]);
    setFamilyParents([]);
    setActiveStudentUid(null);
  };

  const loginDemo = (role: 'parent' | 'student') => {
    setIsDemoMode(true);
    const demoFamilyId = 'fam_demo_123';
    const demoFamilyCode = 'FAM-2026';

    const demoFamily: FamilyGroup = {
      id: demoFamilyId,
      familyName: 'Família Toledo (Sandbox)',
      familyCode: demoFamilyCode,
      parentUids: ['parent_demo_1', 'parent_demo_2'],
      studentUids: ['student_demo_1', 'student_demo_2'],
      createdAt: new Date().toISOString()
    };

    const parentProfile: UserProfile = {
      uid: 'parent_demo_1',
      email: 'pais@estudei.com',
      name: 'Roberto Toledo (Pai / Responsável)',
      role: 'parent',
      familyId: demoFamilyId,
      createdAt: new Date().toISOString(),
      planType: 'family_pass',
      subscriptionStatus: 'active',
      subscriptionValidUntil: '2028-12-31T23:59:59.000Z',
      maxStudentsAllowed: 5
    };

    const motherProfile: UserProfile = {
      uid: 'parent_demo_2',
      email: 'mae@estudei.com',
      name: 'Maria Toledo (Mãe / Co-Responsável)',
      role: 'parent',
      familyId: demoFamilyId,
      createdAt: new Date().toISOString(),
      planType: 'family_pass',
      subscriptionStatus: 'active',
      subscriptionValidUntil: '2028-12-31T23:59:59.000Z',
      maxStudentsAllowed: 5
    };

    const studentProfile: UserProfile = {
      uid: 'student_demo_1',
      email: 'lucas@estudei.com',
      name: 'Lucas Toledo (Filho)',
      role: 'student',
      familyId: demoFamilyId,
      studentYear: '2º Ano do Ensino Médio',
      createdAt: new Date().toISOString(),
      planType: 'pro_student',
      subscriptionStatus: 'active',
      subscriptionValidUntil: '2028-12-31T23:59:59.000Z',
      maxStudentsAllowed: 1
    };

    const student2Profile: UserProfile = {
      uid: 'student_demo_2',
      email: 'sofia@estudei.com',
      name: 'Sofia Toledo (Filha)',
      role: 'student',
      familyId: demoFamilyId,
      studentYear: '9º Ano do Ensino Fundamental',
      createdAt: new Date().toISOString(),
      planType: 'pro_student',
      subscriptionStatus: 'active',
      subscriptionValidUntil: '2028-12-31T23:59:59.000Z',
      maxStudentsAllowed: 1
    };

    const demoLogs: FamilyAuditLog[] = [
      {
        id: 'log_demo_1',
        familyId: demoFamilyId,
        actorUid: 'parent_demo_1',
        actorName: 'Roberto Toledo (Demo)',
        action: 'invite_created',
        targetName: 'Familia',
        details: 'Código de convite familiar criado: FAM-2026',
        timestamp: new Date(Date.now() - 86400000 * 3).toISOString()
      },
      {
        id: 'log_demo_2',
        familyId: demoFamilyId,
        actorUid: 'student_demo_1',
        actorName: 'Lucas Toledo (Demo)',
        action: 'invite_accepted',
        targetName: 'Lucas Toledo (Demo)',
        details: 'Lucas Toledo entrou no grupo familiar.',
        timestamp: new Date(Date.now() - 86400000 * 2).toISOString()
      }
    ];

    const demoRewards: FamilyReward[] = [
      {
        id: 'rw_demo_1',
        familyId: demoFamilyId,
        studentUid: 'student_demo_1',
        type: 'star',
        title: 'Meta Diária Concluída! 🌟',
        message: 'Excelente foco e dedicação cumprindo o Acordo de Confiança!',
        grantedByUid: 'parent_demo_1',
        grantedByName: 'Roberto Toledo (Demo)',
        trigger: 'auto_daily_goal',
        createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
        viewedByStudent: true
      },
      {
        id: 'rw_demo_2',
        familyId: demoFamilyId,
        studentUid: 'student_demo_1',
        type: 'medal_gold',
        title: 'Medalha de Ouro em Matemática 🥇',
        message: 'Parabéns pela nota alta no simulado! Continue assim!',
        realReward: 'Sorvete no sábado + 1h de game',
        grantedByUid: 'parent_demo_1',
        grantedByName: 'Roberto Toledo (Demo)',
        trigger: 'manual',
        createdAt: new Date(Date.now() - 43200000).toISOString(),
        viewedByStudent: false
      }
    ];

    setFamilyGroup(demoFamily);
    setFamilyParents([parentProfile, motherProfile]);
    setFamilyStudents([studentProfile, student2Profile]);
    setFamilyAuditLogs(demoLogs);
    setRewards(demoRewards);

    if (role === 'parent') {
      setUserProfile(parentProfile);
      setActiveStudentUid('student_demo_1');
    } else {
      setUserProfile(studentProfile);
      setActiveStudentUid('student_demo_1');
    }
    setLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        setUserProfile,
        familyGroup,
        loading,
        activeStudentUid,
        familyStudents,
        familyParents,
        familyAuditLogs,
        rewards,
        pendingInvitations,
        setActiveStudentUid,
        removeStudentFromFamily,
        resetUserProfileData,
        joinFamilyWithCode,
        linkMemberByEmail,
        createFamilyInvitation,
        verifyAndAcceptPinCode,
        cancelInvitation,
        grantReward,
        markRewardsAsViewed,
        getFamilyByCode,
        logFamilyAudit,
        login,
        register,
        loginWithGoogle,
        logout,
        loginDemo,
        isDemoMode
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
