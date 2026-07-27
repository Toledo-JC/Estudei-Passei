import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  User as FirebaseUser
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  onSnapshot
} from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { UserProfile, FamilyGroup } from '../types';

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userProfile: UserProfile | null;
  familyGroup: FamilyGroup | null;
  loading: boolean;
  activeStudentUid: string | null;
  familyStudents: UserProfile[];
  setActiveStudentUid: (uid: string) => void;
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
  const [activeStudentUid, setActiveStudentUid] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);

  // Helper to generate unique Family Code (e.g. FAM-7492)
  const generateFamilyCode = () => {
    return 'FAM-' + Math.floor(1000 + Math.random() * 9000);
  };

  useEffect(() => {
    if (isDemoMode) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          // Fetch user profile from Firestore
          const userDocRef = doc(db, 'users', user.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const profile = userDocSnap.data() as UserProfile;
            setUserProfile(profile);

            // Fetch family group
            if (profile.familyId) {
              const famRef = doc(db, 'families', profile.familyId);
              const famSnap = await getDoc(famRef);
              if (famSnap.exists()) {
                const famData = famSnap.data() as FamilyGroup;
                setFamilyGroup(famData);

                // Fetch all students in this family group
                const qStudents = query(
                  collection(db, 'users'),
                  where('familyId', '==', profile.familyId),
                  where('role', '==', 'student')
                );
                const querySnap = await getDocs(qStudents);
                const students = querySnap.docs.map(d => d.data() as UserProfile);
                setFamilyStudents(students);

                if (profile.role === 'student') {
                  setActiveStudentUid(user.uid);
                } else if (students.length > 0) {
                  setActiveStudentUid(students[0].uid);
                }
              }
            }
          }
        } catch (err) {
          console.error('Error fetching user data from Firestore:', err);
        }
      } else {
        setUserProfile(null);
        setFamilyGroup(null);
        setFamilyStudents([]);
        setActiveStudentUid(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isDemoMode]);

  const login = async (email: string, pass: string) => {
    setIsDemoMode(false);
    await signInWithEmailAndPassword(auth, email, pass);
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
    const userCred = await createUserWithEmailAndPassword(auth, email, pass);
    const uid = userCred.user.uid;

    let targetFamilyId = '';
    let targetFamilyCode = '';

    if (familyCodeInput && familyCodeInput.trim().length > 0) {
      // Find existing family by code
      const qFam = query(collection(db, 'families'), where('familyCode', '==', familyCodeInput.trim().toUpperCase()));
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
        throw new Error('Código Familiar não encontrado! Verifique o código enviado pelos pais.');
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
      createdAt: new Date().toISOString()
    };

    await setDoc(doc(db, 'users', uid), newProfile);
    setUserProfile(newProfile);

    if (role === 'student') {
      setActiveStudentUid(uid);
    }
  };

  const logout = async () => {
    setIsDemoMode(false);
    await firebaseSignOut(auth);
    setUserProfile(null);
    setFamilyGroup(null);
  };

  const loginDemo = (role: 'parent' | 'student') => {
    setIsDemoMode(true);
    const demoFamilyId = 'fam_demo_123';
    const demoFamilyCode = 'FAM-2026';

    const demoFamily: FamilyGroup = {
      id: demoFamilyId,
      familyName: 'Família Toledo',
      familyCode: demoFamilyCode,
      parentUids: ['parent_demo_1'],
      studentUids: ['student_demo_1', 'student_demo_2'],
      createdAt: new Date().toISOString()
    };

    const parentProfile: UserProfile = {
      uid: 'parent_demo_1',
      email: 'pais@estudei.com',
      name: 'Roberto Toledo',
      role: 'parent',
      familyId: demoFamilyId,
      createdAt: new Date().toISOString()
    };

    const studentProfile: UserProfile = {
      uid: 'student_demo_1',
      email: 'lucas@estudei.com',
      name: 'Lucas Toledo',
      role: 'student',
      familyId: demoFamilyId,
      studentYear: '2º Ano do Ensino Médio',
      createdAt: new Date().toISOString()
    };

    const student2Profile: UserProfile = {
      uid: 'student_demo_2',
      email: 'sofia@estudei.com',
      name: 'Sofia Toledo',
      role: 'student',
      familyId: demoFamilyId,
      studentYear: '9º Ano do Ensino Fundamental',
      createdAt: new Date().toISOString()
    };

    setFamilyGroup(demoFamily);
    setFamilyStudents([studentProfile, student2Profile]);

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
        familyGroup,
        loading,
        activeStudentUid,
        familyStudents,
        setActiveStudentUid,
        login,
        register,
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
