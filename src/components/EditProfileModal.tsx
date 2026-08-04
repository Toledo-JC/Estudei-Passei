import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { doc, updateDoc, setDoc } from 'firebase/firestore';
import { db, cleanFirestoreData } from '../lib/firebase';
import { UserProfile } from '../types';
import {
  User,
  X,
  Camera,
  GraduationCap,
  Users,
  Crown,
  Key,
  Copy,
  CheckCircle2,
  Share2,
  Send,
  AlertCircle,
  Save,
  ShieldCheck,
  Mail,
  Sparkles,
  Trash2,
  UserX
} from 'lucide-react';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
];

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose }) => {
  const {
    userProfile,
    familyGroup,
    familyStudents,
    familyParents,
    pendingInvitations,
    removeStudentFromFamily,
    resetUserProfileData,
    setUserProfile,
    joinFamilyWithCode,
    linkMemberByEmail,
    createFamilyInvitation,
    verifyAndAcceptPinCode,
    cancelInvitation,
    isDemoMode
  } = useAuth();

  const [name, setName] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [studentYear, setStudentYear] = useState('2º Ano do Ensino Médio');
  const [familyName, setFamilyName] = useState('');

  // Email & Code linking states
  const [emailToLink, setEmailToLink] = useState('');
  const [roleToLink, setRoleToLink] = useState<'student' | 'parent'>('student');
  const [isLinkingEmail, setIsLinkingEmail] = useState(false);

  const [codeToJoin, setCodeToJoin] = useState('');
  const [roleToJoin, setRoleToJoin] = useState<'student' | 'parent'>('student');
  const [isJoiningCode, setIsJoiningCode] = useState(false);

  // Security PIN states
  const [pinInput, setPinInput] = useState('');
  const [isVerifyingPin, setIsVerifyingPin] = useState(false);

  const [inviteEmailInput, setInviteEmailInput] = useState('');
  const [inviteRoleInput, setInviteRoleInput] = useState<'student' | 'parent'>('student');
  const [isGeneratingPin, setIsGeneratingPin] = useState(false);
  const [generatedPin, setGeneratedPin] = useState<{ pin: string; email: string; role: 'student' | 'parent' } | null>(null);
  const [copiedPin, setCopiedPin] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);
  const [studentToRemove, setStudentToRemove] = useState<UserProfile | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);

  const handleGenerateSecurityPin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmailInput.trim()) return;
    setIsGeneratingPin(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const newInv = await createFamilyInvitation(inviteEmailInput, inviteRoleInput);
      setGeneratedPin({
        pin: newInv.pinCode,
        email: newInv.invitedEmail,
        role: newInv.targetRole
      });
      setSuccessMsg(`PIN de Segurança de 6 dígitos gerado: ${newInv.pinCode}! Envie para ${newInv.invitedEmail}.`);
      setInviteEmailInput('');
    } catch (err: any) {
      setErrorMsg(err.message || 'Erro ao gerar PIN de Segurança.');
    } finally {
      setIsGeneratingPin(false);
    }
  };

  const handleVerifyPinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinInput.trim()) return;
    setIsVerifyingPin(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      await verifyAndAcceptPinCode(pinInput);
      setSuccessMsg('Segurança Confirmada! Sua conta foi vinculada à família com sucesso.');
      setPinInput('');
    } catch (err: any) {
      setErrorMsg(err.message || 'Erro ao validar o PIN de Segurança.');
    } finally {
      setIsVerifyingPin(false);
    }
  };

  const handleLinkByEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailToLink.trim()) return;
    setIsLinkingEmail(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      await linkMemberByEmail(emailToLink, roleToLink);
      setSuccessMsg(`Membro (${emailToLink}) vinculado com sucesso!`);
      setEmailToLink('');
    } catch (err: any) {
      setErrorMsg(err.message || 'Erro ao vincular membro por e-mail.');
    } finally {
      setIsLinkingEmail(false);
    }
  };

  const handleJoinByCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!codeToJoin.trim()) return;
    setIsJoiningCode(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      await joinFamilyWithCode(codeToJoin, roleToJoin);
      setSuccessMsg(`Você entrou na família com o código ${codeToJoin.toUpperCase()}!`);
      setCodeToJoin('');
    } catch (err: any) {
      setErrorMsg(err.message || 'Erro ao entrar na família pelo código.');
    } finally {
      setIsJoiningCode(false);
    }
  };

  useEffect(() => {
    if (userProfile) {
      setName(userProfile.name || '');
      setPhotoURL(userProfile.photoURL || '');
      setStudentYear(userProfile.studentYear || '2º Ano do Ensino Médio');
    }
    if (familyGroup) {
      setFamilyName(familyGroup.familyName || '');
    }
  }, [userProfile, familyGroup, isOpen]);

  if (!isOpen || !userProfile) return null;

  const isParent = userProfile.role === 'parent';

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('O nome não pode ficar em branco.');
      return;
    }

    setIsSaving(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      if (!isDemoMode && userProfile.uid) {
        // Save user updates to Firestore
        const userRef = doc(db, 'users', userProfile.uid);
        const updatePayload = cleanFirestoreData({
          name: name.trim(),
          photoURL: photoURL.trim() || null,
          studentYear: !isParent ? studentYear : undefined
        });
        await updateDoc(userRef, updatePayload);

        if (isParent && familyGroup?.id && familyName.trim()) {
          const famRef = doc(db, 'families', familyGroup.id);
          await updateDoc(famRef, {
            familyName: familyName.trim()
          });
        }
      }

      // Update local state in context
      setUserProfile({
        ...userProfile,
        name: name.trim(),
        photoURL: photoURL.trim() || undefined,
        studentYear: !isParent ? studentYear : userProfile.studentYear
      });

      setSuccessMsg('Perfil atualizado com sucesso!');
      setTimeout(() => {
        setSuccessMsg('');
        onClose();
      }, 1200);
    } catch (err: any) {
      console.error('Error updating profile:', err);
      setErrorMsg(err.message || 'Erro ao salvar alterações no perfil.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopyCode = () => {
    if (familyGroup?.familyCode) {
      navigator.clipboard.writeText(familyGroup.familyCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleShareInvite = () => {
    const code = familyGroup?.familyCode || 'FAM-2026';
    const inviteLink = `${window.location.origin}?inviteCode=${code}&role=student`;
    const message = `Olá! Criei nossa conta no app Estudei & Passei. Clique no link para cadastrar seu perfil de estudante:\n${inviteLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
      {/* Student Removal Confirmation Sub-Modal */}
      {studentToRemove && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 border border-slate-200 shadow-xl">
            <div className="flex items-center space-x-3 text-rose-600">
              <div className="p-3 bg-rose-100 rounded-2xl">
                <Trash2 className="w-6 h-6 text-rose-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Desvincular Estudante</h3>
                <p className="text-xs text-slate-500">Confirmação de Exclusão</p>
              </div>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed">
              Tem certeza de que deseja remover <strong className="text-slate-900">{studentToRemove.name}</strong> ({studentToRemove.email}) do grupo familiar?
            </p>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 leading-snug space-y-1">
              <span className="font-bold block">⚠️ Atenção:</span>
              <p>O vínculo com a conta do responsável será desfeito e os dados não aparecerão no seu painel.</p>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                disabled={isRemoving}
                onClick={() => setStudentToRemove(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={isRemoving}
                onClick={async () => {
                  try {
                    setIsRemoving(true);
                    await removeStudentFromFamily(studentToRemove.uid);
                    setStudentToRemove(null);
                  } catch (err: any) {
                    alert('Erro ao remover estudante: ' + err.message);
                  } finally {
                    setIsRemoving(false);
                  }
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow-sm"
              >
                {isRemoving ? 'Removendo...' : 'Confirmar e Desvincular'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in zoom-in-95">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-full bg-slate-800/60 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white font-extrabold text-lg">
              {photoURL ? (
                <img src={photoURL} alt="Foto" className="w-full h-full object-cover rounded-2xl" />
              ) : (
                <User className="w-6 h-6 text-white" />
              )}
            </div>
            <div>
              <span className="bg-indigo-500/30 text-indigo-200 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border border-indigo-400/30">
                {isParent ? 'Perfil do Responsável' : 'Perfil do Estudante'}
              </span>
              <h2 className="text-xl font-extrabold font-display text-white mt-1">
                Editar Perfil & Conta
              </h2>
              <p className="text-xs text-indigo-200">
                Atualize seus dados pessoais e gerencie o plano da sua família
              </p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <form onSubmit={handleSave} className="p-6 space-y-5">
          {errorMsg && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-center space-x-2 text-rose-800 text-xs font-semibold">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center space-x-2 text-emerald-800 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* User Name & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-extrabold text-slate-800 block">
                Nome Completo:
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome completo"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-extrabold text-slate-800 block">
                E-mail da Conta:
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  disabled
                  value={userProfile.email}
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-semibold text-slate-500 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Student Year or Family Name */}
          {!isParent ? (
            <div className="space-y-1">
              <label className="text-xs font-extrabold text-slate-800 block">
                Série / Ano Escolar Atual:
              </label>
              <select
                value={studentYear}
                onChange={(e) => setStudentYear(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="1º Ano do Ensino Médio">1º Ano do Ensino Médio</option>
                <option value="2º Ano do Ensino Médio">2º Ano do Ensino Médio</option>
                <option value="3º Ano do Ensino Médio">3º Ano do Ensino Médio / Medicina / Vestibular</option>
                <option value="9º Ano do Ensino Fundamental">9º Ano do Ensino Fundamental</option>
                <option value="Pré-Vestibular / ENEM">Pré-Vestibular / ENEM</option>
              </select>
            </div>
          ) : (
            <div className="space-y-1">
              <label className="text-xs font-extrabold text-slate-800 block">
                Nome da Família no Sistema:
              </label>
              <input
                type="text"
                value={familyName}
                onChange={(e) => setFamilyName(e.target.value)}
                placeholder="Ex: Família Toledo"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          )}

          {/* Avatar Options */}
          <div className="space-y-2">
            <label className="text-xs font-extrabold text-slate-800 block">
              Escolha uma foto ou avatar de perfil:
            </label>
            <div className="flex items-center space-x-2">
              {AVATAR_PRESETS.map((url, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setPhotoURL(url)}
                  className={`w-10 h-10 rounded-xl overflow-hidden border-2 transition ${
                    photoURL === url ? 'border-indigo-600 scale-105 shadow-md' : 'border-slate-200 hover:border-slate-400'
                  }`}
                >
                  <img src={url} alt={`Avatar ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
              <button
                type="button"
                onClick={() => setPhotoURL('')}
                className={`text-[10px] font-bold px-2.5 py-2 rounded-xl border transition ${
                  !photoURL ? 'bg-indigo-50 border-indigo-500 text-indigo-900' : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                Iniciais
              </button>
            </div>
          </div>

          {/* Family Members Section (Parents & Students) */}
          <div className="space-y-3 border-t border-slate-200 pt-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold text-slate-800 flex items-center space-x-1.5">
                <Users className="w-4 h-4 text-indigo-600" />
                <span>Membros Conectados na Família ({familyGroup?.familyName || 'Sua Família'}):</span>
              </label>
              <span className="text-[10px] bg-indigo-100 text-indigo-900 font-extrabold px-2 py-0.5 rounded-full">
                {familyParents.length} Responsáveis • {familyStudents.length} Filhos
              </span>
            </div>

            {/* Parents List */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-600 block">
                Responsáveis (Pais & Mães):
              </span>
              <div className="space-y-1.5">
                {familyParents.map((parent) => (
                  <div
                    key={parent.uid}
                    className="p-2.5 bg-amber-50/80 border border-amber-200 rounded-xl flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-2">
                      <div className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center font-extrabold text-xs">
                        {parent.name?.charAt(0) || 'P'}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-amber-950 block">{parent.name}</span>
                        <span className="text-[10px] text-amber-800">{parent.email}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-extrabold bg-amber-200 text-amber-900 px-2 py-0.5 rounded-md uppercase">
                      {parent.uid === userProfile.uid ? 'Você' : 'Co-Responsável (Mãe/Pai)'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Students List */}
            {isParent && (
              <div className="space-y-1.5 pt-2">
                <span className="text-[11px] font-bold text-slate-600 block">
                  Filhos / Alunos Dependentes ({familyStudents.length} de {userProfile?.maxStudentsAllowed || 5}):
                </span>
                {familyStudents.length > 0 ? (
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {familyStudents.map((st) => (
                      <div
                        key={st.uid}
                        className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-2"
                      >
                        <div>
                          <span className="text-xs font-bold text-slate-900 block">{st.name}</span>
                          <span className="text-[11px] text-slate-500">{st.studentYear || 'Ensino Médio'} • {st.email}</span>
                        </div>

                        <button
                          type="button"
                          onClick={() => setStudentToRemove(st)}
                          className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold transition flex items-center space-x-1 shrink-0"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                          <span>Desvincular</span>
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 font-medium">
                    Nenhum filho vinculado no momento. Digite o e-mail dela abaixo ou envie o Link de Convite.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Security PIN & Token Confirmation Section */}
          <div className="p-4 bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-2xl space-y-3 shadow-md border border-indigo-700/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 bg-amber-400 text-indigo-950 rounded-lg">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-extrabold text-white block">
                    Segurança de Vinculação (PIN de 6 Dígitos)
                  </span>
                  <p className="text-[10px] text-indigo-200">
                    Gere tokens de confirmação numéricos para autorizar a entrada de sua filha ou esposa de forma protegida.
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-black bg-amber-400 text-indigo-950 px-2 py-0.5 rounded-full uppercase">
                Segurança Ativa
              </span>
            </div>

            {/* Parent Form: Generate 6-Digit PIN */}
            {isParent && (
              <div className="p-3 bg-white/10 rounded-xl space-y-2.5 backdrop-blur-xs border border-white/10">
                <span className="text-[11px] font-extrabold text-amber-300 block">
                  🔑 1. Gerar Novo PIN de Segurança para Convidar (Mãe ou Filha):
                </span>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    value={inviteEmailInput}
                    onChange={(e) => setInviteEmailInput(e.target.value)}
                    placeholder="E-mail do familiar (Ex: esposa@email.com ou filha@email.com)"
                    className="flex-1 bg-slate-900/80 border border-indigo-400/50 rounded-xl px-3 py-1.5 text-xs font-medium text-white placeholder-indigo-300/60 focus:ring-2 focus:ring-amber-400"
                  />
                  <select
                    value={inviteRoleInput}
                    onChange={(e) => setInviteRoleInput(e.target.value as 'student' | 'parent')}
                    className="bg-indigo-950 border border-indigo-400/50 rounded-xl px-2.5 py-1.5 text-xs font-extrabold text-amber-300 focus:ring-2 focus:ring-amber-400"
                  >
                    <option value="student">Filha / Estudante</option>
                    <option value="parent">Esposa / Mãe (Co-Responsável)</option>
                  </select>
                  <button
                    type="button"
                    disabled={isGeneratingPin || !inviteEmailInput.trim()}
                    onClick={handleGenerateSecurityPin}
                    className="bg-amber-400 hover:bg-amber-300 text-indigo-950 disabled:opacity-50 text-xs font-black px-3.5 py-1.5 rounded-xl transition shadow-sm shrink-0 flex items-center justify-center space-x-1"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-indigo-950" />
                    <span>{isGeneratingPin ? 'Gerando...' : 'Gerar PIN'}</span>
                  </button>
                </div>

                {/* Display Generated PIN Banner if available */}
                {generatedPin && (
                  <div className="p-3 bg-amber-400/20 border border-amber-400/50 rounded-xl space-y-2 animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-amber-200">
                        PIN de Segurança Gerado com Sucesso:
                      </span>
                      <span className="text-[10px] text-indigo-200">
                        Enviado para {generatedPin.email}
                      </span>
                    </div>
                    <div className="flex items-center justify-between bg-slate-950/80 p-2.5 rounded-xl border border-amber-400/40">
                      <div className="flex items-center space-x-2">
                        <Key className="w-5 h-5 text-amber-400" />
                        <span className="text-xl font-black tracking-widest text-amber-300 font-mono">
                          {generatedPin.pin.slice(0, 3)} {generatedPin.pin.slice(3)}
                        </span>
                      </div>
                      <div className="flex gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(generatedPin.pin);
                            setCopiedPin(true);
                            setTimeout(() => setCopiedPin(false), 2000);
                          }}
                          className="px-2.5 py-1 bg-amber-400 hover:bg-amber-300 text-indigo-950 rounded-lg text-xs font-black transition flex items-center space-x-1"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>{copiedPin ? 'Copiado!' : 'Copiar PIN'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const link = `${window.location.origin}?inviteCode=${familyGroup?.familyCode}&pin=${generatedPin.pin}`;
                            const msg = `Olá! Criei seu acesso seguro no app Estudei & Passei.\n\nCódigo da Família: ${familyGroup?.familyCode}\nPIN de Segurança (6 dígitos): ${generatedPin.pin}\n\nEntre usando o link: ${link}`;
                            window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
                          }}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-black transition flex items-center space-x-1"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Enviar WhatsApp</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Validate PIN Form for recipient or member */}
            <div className="p-3 bg-white/10 rounded-xl space-y-2 border border-white/10">
              <span className="text-[11px] font-extrabold text-indigo-200 block">
                🔒 2. Confirmar ou Digitar PIN de Segurança de 6 Dígitos:
              </span>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ''))}
                  placeholder="Ex: 849201"
                  className="bg-slate-900/80 border border-indigo-400/50 rounded-xl px-3 py-1.5 text-xs font-mono font-black text-amber-300 tracking-widest text-center w-full sm:w-36 placeholder-indigo-300/50 focus:ring-2 focus:ring-amber-400"
                />
                <button
                  type="button"
                  disabled={isVerifyingPin || pinInput.trim().length !== 6}
                  onClick={handleVerifyPinSubmit}
                  className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-indigo-950 disabled:opacity-40 text-xs font-black px-3.5 py-1.5 rounded-xl transition shadow-sm flex items-center justify-center space-x-1"
                >
                  <ShieldCheck className="w-4 h-4 text-indigo-950" />
                  <span>{isVerifyingPin ? 'Validando PIN...' : 'Validar PIN e Confirmar Vinculação'}</span>
                </button>
              </div>
            </div>

            {/* List of Active Pending Invitations & PINs */}
            {pendingInvitations && pendingInvitations.filter(i => i.status === 'pending').length > 0 && (
              <div className="pt-2 space-y-1.5 border-t border-indigo-500/30">
                <span className="text-[11px] font-extrabold text-amber-300 block">
                  PINs e Convites Pendentes da Família ({pendingInvitations.filter(i => i.status === 'pending').length}):
                </span>
                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {pendingInvitations.filter(i => i.status === 'pending').map((inv) => (
                    <div
                      key={inv.id}
                      className="p-2.5 bg-slate-950/70 border border-indigo-500/30 rounded-xl flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <span className="font-bold text-white">{inv.invitedEmail}</span>
                          <span className="text-[9px] bg-indigo-800 text-amber-300 font-extrabold px-1.5 py-0.5 rounded-xs uppercase">
                            {inv.targetRole === 'parent' ? 'Mãe/Pai' : 'Filha/o'}
                          </span>
                        </div>
                        <span className="text-[10px] text-indigo-300 block">
                          PIN de Segurança: <strong className="font-mono text-amber-300 font-black">{inv.pinCode}</strong>
                        </span>
                      </div>

                      <div className="flex items-center space-x-1">
                        <button
                          type="button"
                          onClick={() => {
                            const link = `${window.location.origin}?inviteCode=${inv.familyCode}&pin=${inv.pinCode}`;
                            const msg = `Olá! Criei seu acesso seguro no app Estudei & Passei.\n\nCódigo da Família: ${inv.familyCode}\nPIN de Segurança: ${inv.pinCode}\n\nEntre usando o link: ${link}`;
                            window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
                          }}
                          className="p-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md text-[10px] font-bold"
                          title="Reenviar pelo WhatsApp"
                        >
                          <Send className="w-3 h-3" />
                        </button>

                        <button
                          type="button"
                          onClick={() => cancelInvitation(inv.id)}
                          className="p-1 bg-rose-900/60 hover:bg-rose-800 text-rose-200 rounded-md text-[10px] font-bold"
                          title="Cancelar Convite"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Direct Email Linking Card */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-indigo-600 shrink-0" />
              <div>
                <span className="text-xs font-extrabold text-slate-900 block">
                  Vincular Filha ou Esposa por E-mail
                </span>
                <p className="text-[10px] text-slate-500">
                  Se a sua filha ou esposa já criou a conta, digite o e-mail dela para associá-la à sua família agora.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-1">
              <input
                type="email"
                value={emailToLink}
                onChange={(e) => setEmailToLink(e.target.value)}
                placeholder="Ex: filha@email.com ou esposa@email.com"
                className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-medium text-slate-800"
              />

              <select
                value={roleToLink}
                onChange={(e) => setRoleToLink(e.target.value as 'student' | 'parent')}
                className="bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-800"
              >
                <option value="student">Filha / Estudante</option>
                <option value="parent">Esposa / Mãe (Co-Responsável)</option>
              </select>

              <button
                type="button"
                disabled={isLinkingEmail || !emailToLink.trim()}
                onClick={handleLinkByEmailSubmit}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-extrabold px-3 py-1.5 rounded-xl transition shadow-xs shrink-0"
              >
                {isLinkingEmail ? 'Vinculando...' : 'Vincular por E-mail'}
              </button>
            </div>
          </div>

          {/* Join Existing Family by Code */}
          <div className="p-3.5 bg-indigo-50/70 border border-indigo-200 rounded-2xl space-y-2">
            <div className="flex items-center space-x-2">
              <Key className="w-4 h-4 text-indigo-700 shrink-0" />
              <div>
                <span className="text-xs font-extrabold text-indigo-950 block">
                  Entrar em outra Família por Código
                </span>
                <p className="text-[10px] text-indigo-800">
                  Caso queira migrar ou se conectar ao código familiar criado por outra pessoa (ex: esposo/a).
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-1">
              <input
                type="text"
                value={codeToJoin}
                onChange={(e) => setCodeToJoin(e.target.value.toUpperCase())}
                placeholder="Ex: FAM-8921"
                className="flex-1 bg-white border border-indigo-300 rounded-xl px-3 py-1.5 text-xs font-extrabold text-indigo-900 uppercase"
              />

              <select
                value={roleToJoin}
                onChange={(e) => setRoleToJoin(e.target.value as 'student' | 'parent')}
                className="bg-white border border-indigo-300 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-800"
              >
                <option value="parent">Entrar como Mãe / Pai</option>
                <option value="student">Entrar como Filho / Aluno</option>
              </select>

              <button
                type="button"
                disabled={isJoiningCode || !codeToJoin.trim()}
                onClick={handleJoinByCodeSubmit}
                className="bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-extrabold px-3 py-1.5 rounded-xl transition shadow-xs shrink-0"
              >
                {isJoiningCode ? 'Entrando...' : 'Entrar no Código'}
              </button>
            </div>
          </div>

          {/* Subscription & Family Status Box */}
          <div className="p-4 bg-gradient-to-br from-indigo-50 to-slate-50 border border-indigo-200/80 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Crown className="w-5 h-5 text-amber-500" />
                <div>
                  <span className="text-xs font-extrabold text-indigo-950 block">
                    Plano Ativo: FAMILY PASS PRO
                  </span>
                  <p className="text-[11px] text-indigo-700">
                    Acesso unificado com suporte para até {userProfile.maxStudentsAllowed || 5} estudantes
                  </p>
                </div>
              </div>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300 font-extrabold px-2.5 py-1 rounded-full uppercase">
                {userProfile.subscriptionStatus === 'trial' ? 'Período Trial Pro' : 'Ativo'}
              </span>
            </div>

            {familyGroup && (
              <div className="pt-2.5 border-t border-indigo-200/60 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Key className="w-4 h-4 text-indigo-600" />
                    <span className="text-xs font-bold text-slate-800">
                      Código Familiar: <strong className="text-indigo-950 font-extrabold">{familyGroup.familyCode}</strong>
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="bg-white hover:bg-indigo-100 text-indigo-900 border border-indigo-300 text-[11px] font-extrabold px-3 py-1 rounded-xl transition flex items-center space-x-1"
                  >
                    <Copy className="w-3 h-3 text-indigo-600" />
                    <span>{copiedCode ? 'Copiado!' : 'Copiar Código'}</span>
                  </button>
                </div>

                {/* Dual Invite Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      const code = familyGroup.familyCode;
                      const link = `${window.location.origin}?inviteCode=${code}&role=student`;
                      const msg = `Olá! Criei nossa conta familiar (${familyGroup.familyName}) no Estudei & Passei. Clique no link para cadastrar seu perfil de filho/estudante:\n${link}`;
                      window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-extrabold px-3 py-2 rounded-xl transition flex items-center justify-center space-x-1.5 shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Convidar Filho (Estudante)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const code = familyGroup.familyCode;
                      const link = `${window.location.origin}?inviteCode=${code}&role=parent`;
                      const msg = `Olá! Criei nossa conta familiar (${familyGroup.familyName}) no Estudei & Passei. Clique no link para cadastrar seu perfil como segundo Responsável (Pai/Mãe):\n${link}`;
                      window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
                    }}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-extrabold px-3 py-2 rounded-xl transition flex items-center justify-center space-x-1.5 shadow-xs"
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>Convidar Outro Responsável</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Reset/Zero Profile Data Danger Zone */}
          <div className="p-4 bg-rose-50/60 border border-rose-200/80 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Trash2 className="w-4 h-4 text-rose-600 shrink-0" />
                <div>
                  <span className="text-xs font-bold text-rose-950 block">
                    Zerar e Restaurar Histórico de Estudos
                  </span>
                  <p className="text-[11px] text-rose-800">
                    Restaura as matérias, notas e provas para o estado inicial limpo, mantendo sua conta logada e sua família intacta.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={async () => {
                  if (window.confirm('Tem certeza de que deseja ZERAR todos os dados de estudos e avaliações? Sua conta permanecerá ativa e vinculada à sua família, mas os dados de matérias e histórico de estudos serão limpos.')) {
                    try {
                      setIsSaving(true);
                      await resetUserProfileData();
                      setSuccessMsg('Histórico do perfil zerado com sucesso!');
                      setTimeout(() => {
                        window.location.reload();
                      }, 1000);
                    } catch (err: any) {
                      setErrorMsg('Erro ao zerar perfil: ' + err.message);
                    } finally {
                      setIsSaving(false);
                    }
                  }
                }}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition shadow-xs shrink-0"
              >
                Zerar Perfil
              </button>
            </div>
          </div>

          {/* Submit Footer */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2 rounded-xl transition"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold px-5 py-2 rounded-xl transition shadow-md flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Salvando...' : 'Salvar Alterações'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
