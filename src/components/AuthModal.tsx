import React, { useState } from 'react';
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
  AlertCircle
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, register, loginDemo, userProfile, familyGroup, logout } = useAuth();

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
  const [copiedCode, setCopiedCode] = useState(false);

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

  const handleCopyFamilyCode = () => {
    if (familyGroup?.familyCode) {
      navigator.clipboard.writeText(familyGroup.familyCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in zoom-in-95">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-full bg-slate-800/60"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-md">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold font-display">
                Conta & Isolamento Familiar
              </h2>
              <p className="text-xs text-indigo-200">
                Acesso seguro para Pais e Alunos com Código Familiar compartilhado
              </p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
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
              </div>

              {familyGroup && (
                <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-indigo-900 block">
                        {familyGroup.familyName}
                      </span>
                      <p className="text-[11px] text-indigo-700">
                        Compartilhe este código com seus filhos/pais para conectar na mesma família:
                      </p>
                    </div>

                    <button
                      onClick={handleCopyFamilyCode}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center space-x-1 transition shadow-xs shrink-0"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copiedCode ? 'Copiado!' : familyGroup.familyCode}</span>
                    </button>
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
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 block">
                          Nome do Grupo Familiar (Opcional):
                        </label>
                        <input
                          type="text"
                          value={familyName}
                          onChange={(e) => setFamilyName(e.target.value)}
                          placeholder="Ex: Família Toledo"
                          className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-medium text-slate-800"
                        />
                        <span className="text-[10px] text-slate-500 block">
                          Um Código Familiar único (ex: FAM-8921) será gerado para seus filhos entrarem.
                        </span>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-700 block">
                            Código Familiar (Fornecido pelos Pais):
                          </label>
                          <div className="relative">
                            <Key className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                            <input
                              type="text"
                              value={familyCode}
                              onChange={(e) => setFamilyCode(e.target.value)}
                              placeholder="Ex: FAM-2026 (ou deixe vazio para criar novo)"
                              className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-3 py-1.5 text-xs font-extrabold text-indigo-700 uppercase"
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
                  Ou testar agora mesmo com Dados Demonstrativos (Sem Senha):
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
