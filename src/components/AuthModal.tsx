import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  GraduationCap,
  ShieldCheck,
  User,
  Mail,
  Lock,
  Users,
  Key,
  Sparkles,
  ArrowRight,
  X,
  CheckCircle2,
  Copy,
  AlertCircle,
  Share2,
  Send,
  Crown
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialInviteCode?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialInviteCode }) => {
  const { login, register, loginWithGoogle, loginDemo, userProfile, familyGroup, logout } = useAuth();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [role, setRole] = useState<'parent' | 'student'>('student');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [familyCode, setFamilyCode] = useState('');
  const [familyName, setFamilyName] = useState('');
  const [studentYear, setStudentYear] = useState('2º Ano do Ensino Médio');

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedInviteLink, setCopiedInviteLink] = useState(false);

  const [securityPin, setSecurityPin] = useState('');

  // Auto detect invite code & security pin from URL search params or props
  useEffect(() => {
    if (!isOpen) return;
    const urlParams = new URLSearchParams(window.location.search);
    const codeFromUrl = urlParams.get('inviteCode') || urlParams.get('invite') || initialInviteCode;
    const pinFromUrl = urlParams.get('pin');
    const roleFromUrl = urlParams.get('role');

    if (codeFromUrl) {
      setFamilyCode(codeFromUrl.toUpperCase());
      setMode('register');
      if (roleFromUrl === 'student' || roleFromUrl === 'parent') {
        setRole(roleFromUrl as 'student' | 'parent');
      } else {
        setRole('student');
      }
    }
    if (pinFromUrl) {
      setSecurityPin(pinFromUrl.replace(/\D/g, '').slice(0, 6));
    }
  }, [isOpen, initialInviteCode]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsSubmitting(true);

    try {
      if (mode === 'login') {
        if (!email || !password) {
          throw new Error('Preencha o e-mail e a senha.');
        }
        await login(email, password);
        onClose();
      } else {
        if (!email || !password || !name) {
          throw new Error('Preencha nome, e-mail e senha.');
        }
        await register(
          email,
          password,
          name,
          role,
          familyCode,
          familyName,
          studentYear
        );
        setSuccessMsg('Conta criada e vinculada com sucesso!');
        setTimeout(() => {
          onClose();
        }, 1200);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Ocorreu um erro na autenticação.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleAuth = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    setIsGoogleSubmitting(true);
    try {
      await loginWithGoogle(role, familyCode, familyName, studentYear);
      setSuccessMsg('Autenticação com Google realizada com sucesso!');
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Falha ao acessar com a Conta Google.');
    } finally {
      setIsGoogleSubmitting(false);
    }
  };

  const handleCopyFamilyCode = () => {
    if (familyGroup?.familyCode) {
      navigator.clipboard.writeText(familyGroup.familyCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const generateInviteLink = (targetRole: 'student' | 'parent' = 'student') => {
    const code = familyGroup?.familyCode || familyCode || 'FAM-2026';
    return `${window.location.origin}?inviteCode=${code}&role=${targetRole}`;
  };

  const handleCopyInviteLink = (targetRole: 'student' | 'parent' = 'student') => {
    const link = generateInviteLink(targetRole);
    navigator.clipboard.writeText(link);
    setCopiedInviteLink(true);
    setTimeout(() => setCopiedInviteLink(false), 2000);
  };

  const handleShareWhatsApp = (targetRole: 'student' | 'parent' = 'student') => {
    const link = generateInviteLink(targetRole);
    const message = targetRole === 'parent'
      ? `Olá! Criei nossa conta de responsável no app Estudei & Passei. Clique no link abaixo para entrar como co-responsável (Mãe/Pai):\n${link}`
      : `Olá! Criei nossa conta no app Estudei & Passei. Clique no link abaixo para criar seu perfil de estudante vinculado à família:\n${link}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in zoom-in-95">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-full bg-slate-800/60 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-3 mb-1">
            <div className="w-10 h-10 rounded-2xl bg-slate-950 border border-indigo-400/40 overflow-hidden flex items-center justify-center shadow-md shrink-0 relative">
              <img
                src="/app-logo.jpg"
                alt="Logo"
                className="w-full h-full object-cover"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
              <GraduationCap className="w-6 h-6 text-white absolute inset-0 m-auto -z-10" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold font-display">
                Conta & Isolamento Familiar
              </h2>
              <p className="text-xs text-indigo-200">
                Acesso unificado com Login Google e Convites vinculados (Pais e Filhos)
              </p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {/* Active Invite Link Banner */}
          {familyCode && mode === 'register' && (
            <div className="p-3.5 bg-indigo-50 border border-indigo-200 rounded-2xl flex items-center space-x-3 animate-in fade-in">
              <div className="p-2 bg-indigo-600 text-white rounded-xl shrink-0">
                <Share2 className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-extrabold text-indigo-950 block">
                  🎉 Convite de Responsável Detectado!
                </span>
                <p className="text-[11px] text-indigo-800 leading-tight">
                  Sua conta será vinculada automaticamente ao Grupo Familiar <strong className="font-extrabold text-indigo-950">{familyCode}</strong>.
                </p>
              </div>
            </div>
          )}

          {/* If already logged in: Show Account Status & Family Code */}
          {userProfile ? (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-emerald-800 flex items-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Conectado como: {userProfile.name}</span>
                  </span>
                  <span className="text-[10px] font-extrabold uppercase bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full">
                    {userProfile.role === 'parent' ? 'Pai / Responsável' : 'Estudante'}
                  </span>
                </div>
                <p className="text-xs text-slate-600">E-mail: {userProfile.email}</p>

                {/* Plan Badge */}
                <div className="pt-2 border-t border-emerald-200/60 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-700 flex items-center space-x-1">
                    <Crown className="w-3.5 h-3.5 text-amber-500" />
                    <span>Plano Atual: <strong className="text-slate-900 uppercase">{userProfile.planType || 'FAMILY PASS'}</strong> ({userProfile.subscriptionStatus === 'trial' ? 'Período Trial Pro' : 'Ativo'})</span>
                  </span>
                  <span className="text-[10px] bg-amber-100 text-amber-900 font-extrabold px-2 py-0.5 rounded-md">
                    Até {userProfile.maxStudentsAllowed || 5} Estudantes
                  </span>
                </div>
              </div>

              {familyGroup && (
                <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-indigo-900 block">
                        {familyGroup.familyName}
                      </span>
                      <p className="text-[11px] text-indigo-700">
                        Código Familiar: <strong className="font-extrabold text-indigo-950">{familyGroup.familyCode}</strong>
                      </p>
                    </div>

                    <button
                      onClick={handleCopyFamilyCode}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center space-x-1 transition shadow-xs shrink-0"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copiedCode ? 'Copiado!' : 'Copiar Código'}</span>
                    </button>
                  </div>

                  {/* Invite buttons for parent (Filho and Esposa/Mãe) */}
                  <div className="pt-2 border-t border-indigo-200/80 space-y-2">
                    <span className="text-[11px] font-extrabold text-indigo-950 block">
                      Compartilhar Convites Rápidos:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <button
                        onClick={() => handleShareWhatsApp('student')}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold py-2 px-3 rounded-xl transition flex items-center justify-center space-x-1.5 shadow-2xs"
                      >
                        <Send className="w-3.5 h-3.5 text-white" />
                        <span>👧 Convidar Filha (WhatsApp)</span>
                      </button>

                      <button
                        onClick={() => handleShareWhatsApp('parent')}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold py-2 px-3 rounded-xl transition flex items-center justify-center space-x-1.5 shadow-2xs"
                      >
                        <Send className="w-3.5 h-3.5 text-white" />
                        <span>👩 Convidar Esposa / Mãe</span>
                      </button>
                    </div>

                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => handleCopyInviteLink('student')}
                        className="flex-1 bg-white hover:bg-slate-50 text-indigo-900 border border-indigo-300 text-[11px] font-extrabold py-1.5 px-2 rounded-xl transition flex items-center justify-center space-x-1"
                      >
                        <Share2 className="w-3 h-3 text-indigo-600" />
                        <span>Copiar Link (Filha)</span>
                      </button>
                      <button
                        onClick={() => handleCopyInviteLink('parent')}
                        className="flex-1 bg-white hover:bg-slate-50 text-indigo-900 border border-indigo-300 text-[11px] font-extrabold py-1.5 px-2 rounded-xl transition flex items-center justify-center space-x-1"
                      >
                        <Share2 className="w-3 h-3 text-indigo-600" />
                        <span>Copiar Link (Mãe/Esposa)</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={logout}
                  className="text-xs font-bold text-rose-600 hover:text-rose-700 border border-rose-200 bg-rose-50 px-4 py-2 rounded-xl transition"
                >
                  Sair da Conta
                </button>
                <button
                  onClick={onClose}
                  className="bg-slate-900 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition hover:bg-slate-800"
                >
                  Continuar para o Sistema
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Tabs: Entrar vs Criar Conta */}
              <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrorMsg('');
                  }}
                  className={`flex-1 py-2 text-xs font-extrabold rounded-xl transition ${
                    mode === 'login'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Entrar na Minha Conta
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setErrorMsg('');
                  }}
                  className={`flex-1 py-2 text-xs font-extrabold rounded-xl transition ${
                    mode === 'register'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Criar Conta da Família
                </button>
              </div>

              {/* Role Selection (Parent or Student) */}
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-700 block">
                  Quem está acessando agora?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole('student')}
                    className={`p-3 rounded-2xl border text-left flex items-start space-x-2.5 transition ${
                      role === 'student'
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-900 ring-2 ring-indigo-500/20'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <GraduationCap className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-extrabold block">Sou Aluno / Filho</span>
                      <span className="text-[10px] text-slate-500 block leading-tight">
                        Acesso ao cronograma, notas e simulados
                      </span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('parent')}
                    className={`p-3 rounded-2xl border text-left flex items-start space-x-2.5 transition ${
                      role === 'parent'
                        ? 'bg-amber-50 border-amber-500 text-amber-950 ring-2 ring-amber-500/20'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <Users className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-extrabold block">Sou Pai / Mãe</span>
                      <span className="text-[10px] text-slate-500 block leading-tight">
                        Acompanhar progresso e boletim dos filhos
                      </span>
                    </div>
                  </button>
                </div>
              </div>

              {/* GOOGLE OAUTH SOCIAL LOGIN BUTTON */}
              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  disabled={isGoogleSubmitting}
                  onClick={handleGoogleAuth}
                  className="w-full bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-extrabold text-xs py-2.5 px-4 rounded-2xl transition shadow-2xs flex items-center justify-center space-x-2.5"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.27v3.15C3.25 21.3 7.31 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.27C.46 8.2.01 10.03.01 12c0 1.97.45 3.8 1.26 5.42l4.01-3.15z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.7 1.27 6.58l4.01 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                    />
                  </svg>
                  <span>{isGoogleSubmitting ? 'Conectando ao Google...' : 'Continuar com a Conta Google (OAuth)'}</span>
                </button>

                <div className="flex items-center my-2">
                  <div className="flex-1 border-t border-slate-200"></div>
                  <span className="px-3 text-[11px] font-bold text-slate-400 uppercase">ou com e-mail</span>
                  <div className="flex-1 border-t border-slate-200"></div>
                </div>
              </div>

              {/* Form inputs */}
              <form onSubmit={handleSubmit} className="space-y-3">
                {mode === 'register' && (
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">
                      Nome Completo:
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={role === 'parent' ? 'Ex: Roberto Toledo' : 'Ex: Lucas Toledo'}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">
                      E-mail:
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="seu@email.com"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">
                      Senha:
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Specific Registration Fields */}
                {mode === 'register' && (
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    {role === 'parent' ? (
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-700 block">
                            Nome do Grupo Familiar:
                          </label>
                          <input
                            type="text"
                            value={familyName}
                            onChange={(e) => setFamilyName(e.target.value)}
                            placeholder="Ex: Família Toledo"
                            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-medium text-slate-800"
                          />
                        </div>

                        <div className="space-y-1 pt-1 border-t border-slate-200">
                          <label className="text-xs font-bold text-indigo-900 block">
                            Código Familiar do Cônjuge (Se for entrar em uma família existente):
                          </label>
                          <div className="relative">
                            <Key className="w-4 h-4 text-indigo-500 absolute left-3 top-2.5" />
                            <input
                              type="text"
                              value={familyCode}
                              onChange={(e) => setFamilyCode(e.target.value.toUpperCase())}
                              placeholder="Ex: FAM-2026 (Deixe vazio para criar nova família)"
                              className="w-full bg-white border border-indigo-200 rounded-xl pl-9 pr-3 py-1.5 text-xs font-extrabold text-indigo-800 uppercase focus:ring-2 focus:ring-indigo-500"
                            />
                          </div>
                          <span className="text-[10px] text-slate-500 block">
                            Preencha se sua esposa ou marido já criou o grupo familiar. Se for o primeiro acesso da família, deixe em branco.
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-700 block">
                            Código Familiar (Fornecido pelos Pais/Responsáveis):
                          </label>
                          <div className="relative">
                            <Key className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                            <input
                              type="text"
                              value={familyCode}
                              onChange={(e) => setFamilyCode(e.target.value.toUpperCase())}
                              placeholder="Ex: FAM-2026"
                              className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-3 py-1.5 text-xs font-extrabold text-indigo-700 uppercase"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-indigo-900 block flex items-center justify-between">
                            <span>PIN de Segurança (6 dígitos - Se recebido):</span>
                            <span className="text-[10px] text-indigo-600 font-semibold">(Opcional)</span>
                          </label>
                          <div className="relative">
                            <ShieldCheck className="w-4 h-4 text-emerald-600 absolute left-3 top-2.5" />
                            <input
                              type="text"
                              maxLength={6}
                              value={securityPin}
                              onChange={(e) => setSecurityPin(e.target.value.replace(/\D/g, ''))}
                              placeholder="Ex: 849201"
                              className="w-full bg-white border border-indigo-300 rounded-xl pl-9 pr-3 py-1.5 text-xs font-mono font-bold text-indigo-900 tracking-widest"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-700 block">
                            Série / Ano Escolar:
                          </label>
                          <select
                            value={studentYear}
                            onChange={(e) => setStudentYear(e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-medium text-slate-800"
                          >
                            <option value="1º Ano do Ensino Médio">1º Ano do Ensino Médio</option>
                            <option value="2º Ano do Ensino Médio">2º Ano do Ensino Médio</option>
                            <option value="3º Ano do Ensino Médio">3º Ano do Ensino Médio</option>
                            <option value="9º Ano do Ensino Fundamental">9º Ano do Ensino Fundamental</option>
                          </select>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Feedback messages */}
                {errorMsg && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-bold flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {successMsg && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                    <span>{successMsg}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs py-3 rounded-2xl transition shadow-md flex items-center justify-center space-x-2"
                >
                  <span>{isSubmitting ? 'Acessando...' : mode === 'login' ? 'Entrar na Plataforma' : 'Criar e Vincular Conta'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Demo Mode Direct Quick Test */}
              <div className="pt-3 border-t border-slate-100 text-center space-y-2">
                <span className="text-[11px] font-bold text-slate-500 block">
                  Ou testar agora mesmo no Modo Exemplo (Sandbox Efêmero):
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      loginDemo('student');
                      onClose();
                    }}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-2 rounded-xl border border-slate-200 transition"
                  >
                    Entrar como Aluno Demo
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      loginDemo('parent');
                      onClose();
                    }}
                    className="flex-1 bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold py-2 rounded-xl border border-amber-300 transition"
                  >
                    Entrar como Pai Demo
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
