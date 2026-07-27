import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { MEC_HIGH_SCHOOL_PRESET_SUBJECTS } from '../data/defaultPresets';
import { Subject, SchoolConfig } from '../types';
import {
  Sparkles,
  GraduationCap,
  Users,
  BookOpen,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Key,
  Copy,
  Plus,
  Trash2,
  Award,
  Calendar,
  Layers,
  X
} from 'lucide-react';

interface OnboardingWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: {
    subjects: Subject[];
    schoolConfig: SchoolConfig;
  }) => void;
}

export const OnboardingWizardModal: React.FC<OnboardingWizardModalProps> = ({
  isOpen,
  onClose,
  onComplete
}) => {
  const { userProfile, familyGroup, familyStudents } = useAuth();

  const isParent = userProfile?.role === 'parent';

  const [step, setStep] = useState<number>(1);

  // Parent Step State: Children
  const [childrenList, setChildrenList] = useState<Array<{ name: string; year: string }>>([
    { name: 'Lucas Toledo', year: '2º Ano do Ensino Médio' }
  ]);
  const [newChildName, setNewChildName] = useState('');
  const [newChildYear, setNewChildYear] = useState('2º Ano do Ensino Médio');

  // Subjects Setup State
  const [subjectsChoice, setSubjectsChoice] = useState<'mec' | 'empty' | 'custom'>('mec');
  const [customSubjects, setCustomSubjects] = useState<Subject[]>(MEC_HIGH_SCHOOL_PRESET_SUBJECTS);

  // School Rules State
  const [passingScore, setPassingScore] = useState<number>(6.0);
  const [regime, setRegime] = useState<'bimestral' | 'trimestral'>('bimestral');
  const [weeklyTargetHours, setWeeklyTargetHours] = useState<number>(20);

  const [copiedCode, setCopiedCode] = useState(false);

  if (!isOpen) return null;

  const handleAddChild = () => {
    if (!newChildName.trim()) return;
    setChildrenList(prev => [...prev, { name: newChildName.trim(), year: newChildYear }]);
    setNewChildName('');
  };

  const handleRemoveChild = (index: number) => {
    setChildrenList(prev => prev.filter((_, i) => i !== index));
  };

  const handleCopyCode = () => {
    if (familyGroup?.familyCode) {
      navigator.clipboard.writeText(familyGroup.familyCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleFinish = () => {
    const finalSubjects = subjectsChoice === 'empty' ? [] : customSubjects;
    const finalConfig: SchoolConfig = {
      periodType: regime === 'bimestral' ? 'bimestre' : 'trimestre',
      passingScore,
      maxScorePerPeriod: 10.0,
      recoveryType: 'bimestral',
      recoveryCalculation: 'substitutiva',
      evalCategories: [
        { id: 'cat-provas', name: 'Provas Bimestrais / Trimestrais', weightPercent: 60, maxScore: 10.0, description: 'Avaliações de conteúdo' },
        { id: 'cat-trabalhos', name: 'Trabalhos & MS Teams / Classroom', weightPercent: 30, maxScore: 10.0, description: 'Projetos e entregas' },
        { id: 'cat-atitude', name: 'Participação & Lição de Casa', weightPercent: 10, maxScore: 10.0, description: 'Engajamento diário' }
      ]
    };

    onComplete({
      subjects: finalSubjects,
      schoolConfig: finalConfig
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in zoom-in-95">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 p-6 text-white relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-500 flex items-center justify-center text-slate-950 font-black shadow-lg">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <span className="bg-amber-400/20 text-amber-300 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border border-amber-400/30">
                  Assistente de Configuração Inicial
                </span>
                <h2 className="text-xl font-extrabold font-display text-white mt-1">
                  Bem-vindo ao Estudei & Passei!
                </h2>
                <p className="text-xs text-slate-300">
                  {isParent
                    ? 'Configure a conta da sua família em 3 passos simples.'
                    : 'Monte sua grade de matérias e metas escolares para começar.'}
                </p>
              </div>
            </div>

            {/* Step Indicators */}
            <div className="hidden sm:flex items-center space-x-2 bg-slate-800/80 px-3 py-1.5 rounded-2xl border border-slate-700/80 text-xs font-bold">
              <span className={step >= 1 ? 'text-amber-400 font-extrabold' : 'text-slate-500'}>1</span>
              <span className="text-slate-600">•</span>
              <span className={step >= 2 ? 'text-amber-400 font-extrabold' : 'text-slate-500'}>2</span>
              <span className="text-slate-600">•</span>
              <span className={step >= 3 ? 'text-amber-400 font-extrabold' : 'text-slate-500'}>3</span>
            </div>
          </div>
        </div>

        {/* Wizard Steps Content */}
        <div className="p-6 space-y-6">
          {/* STEP 1: PARENT OR STUDENT IDENTIFICATION */}
          {step === 1 && (
            <div className="space-y-5">
              {isParent ? (
                <>
                  <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-2xl space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-xs font-extrabold text-indigo-900 block">
                          Passo 1: Compartilhar Código Familiar
                        </span>
                        <p className="text-xs text-indigo-700 mt-0.5">
                          Seus filhos usam esse código ao se cadastrar para que a conta deles seja conectada automaticamente ao seu painel.
                        </p>
                      </div>
                      <div className="bg-indigo-600 text-white px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center space-x-1.5 shrink-0 shadow-sm">
                        <Key className="w-3.5 h-3.5 text-amber-300" />
                        <span>{familyGroup?.familyCode || 'FAM-2026'}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleCopyCode}
                      className="w-full bg-white hover:bg-indigo-100/50 text-indigo-900 border border-indigo-300 text-xs font-bold py-2 rounded-xl flex items-center justify-center space-x-1.5 transition"
                    >
                      <Copy className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{copiedCode ? 'Código Copiado com Sucesso!' : 'Copiar Código e Enviar para Filhos'}</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-extrabold text-slate-800 block">
                      Cadastrar Filhos / Alunos Monitorados:
                    </label>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newChildName}
                        onChange={(e) => setNewChildName(e.target.value)}
                        placeholder="Nome do(a) filho(a) (ex: Lucas Toledo)"
                        className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800"
                      />
                      <select
                        value={newChildYear}
                        onChange={(e) => setNewChildYear(e.target.value)}
                        className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800"
                      >
                        <option value="1º Ano do Ensino Médio">1º Ano E.M.</option>
                        <option value="2º Ano do Ensino Médio">2º Ano E.M.</option>
                        <option value="3º Ano do Ensino Médio">3º Ano E.M.</option>
                        <option value="9º Ano do Ensino Fundamental">9º Ano E.F.</option>
                      </select>
                      <button
                        type="button"
                        onClick={handleAddChild}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center space-x-1 transition"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Adicionar</span>
                      </button>
                    </div>

                    <div className="space-y-2">
                      {childrenList.map((child, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between bg-slate-50 border border-slate-200 p-3 rounded-2xl"
                        >
                          <div className="flex items-center space-x-2.5">
                            <GraduationCap className="w-4 h-4 text-indigo-600" />
                            <div>
                              <span className="text-xs font-extrabold text-slate-800 block">{child.name}</span>
                              <span className="text-[10px] text-slate-500">{child.year}</span>
                            </div>
                          </div>
                          {childrenList.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveChild(idx)}
                              className="p-1 text-slate-400 hover:text-rose-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-2xl space-y-2">
                    <span className="text-xs font-extrabold text-indigo-900 block">
                      Passo 1: Olá, Estudante! 👋
                    </span>
                    <p className="text-xs text-indigo-700">
                      O Estudei & Passei foi criado para organizar seu estudo diário, notas e revisões sem estresse.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-extrabold text-slate-800 block">
                      Qual é a sua série / ano escolar atual?
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {['1º Ano do Ensino Médio', '2º Ano do Ensino Médio', '3º Ano do Ensino Médio'].map((yr) => (
                        <button
                          key={yr}
                          type="button"
                          onClick={() => setNewChildYear(yr)}
                          className={`p-3 rounded-2xl border text-left transition ${
                            newChildYear === yr
                              ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                              : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                          }`}
                        >
                          <GraduationCap className="w-4 h-4 mb-1" />
                          <span className="text-xs font-extrabold block">{yr}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* STEP 2: SUBJECTS PRESET OR CUSTOM */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <span className="text-xs font-extrabold text-slate-800 block mb-1">
                  Passo 2: Grade de Matérias Escolares
                </span>
                <p className="text-xs text-slate-500">
                  {isParent
                    ? 'Escolha se deseja preencher a grade de matérias dos filhos agora ou deixar para eles cadastrarem.'
                    : 'Deseja iniciar com a grade oficial do Ensino Médio (MEC) ou cadastrar do zero?'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setSubjectsChoice('mec');
                    setCustomSubjects(MEC_HIGH_SCHOOL_PRESET_SUBJECTS);
                  }}
                  className={`p-4 rounded-2xl border text-left space-y-2 transition ${
                    subjectsChoice === 'mec'
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-950 ring-2 ring-indigo-500/20'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <BookOpen className="w-5 h-5 text-indigo-600" />
                    <span className="text-[10px] font-bold bg-indigo-200 text-indigo-900 px-2 py-0.5 rounded-full">
                      Recomendado
                    </span>
                  </div>
                  <span className="text-xs font-extrabold block">
                    Carregar Grade Padrão MEC (11 Matérias)
                  </span>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    Matemática, Física, Química, Biologia, História, Geografia, Português, Redação, Literatura, Filosofia e Inglês.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSubjectsChoice('empty');
                    setCustomSubjects([]);
                  }}
                  className={`p-4 rounded-2xl border text-left space-y-2 transition ${
                    subjectsChoice === 'empty'
                      ? 'bg-amber-50 border-amber-500 text-amber-950 ring-2 ring-amber-500/20'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Layers className="w-5 h-5 text-amber-600" />
                  </div>
                  <span className="text-xs font-extrabold block">
                    Começar do Zero (Vazio)
                  </span>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    {isParent
                      ? 'O aplicativo começará limpo para que os próprios filhos adicionem as matérias da escola deles.'
                      : 'Cadastre suas matérias manualmente uma a uma conforme a sua escola.'}
                  </p>
                </button>
              </div>

              {subjectsChoice === 'mec' && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <span className="text-xs font-bold text-slate-700 block">
                    Matérias que serão inseridas automaticamente ({customSubjects.length}):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {customSubjects.map((sub) => (
                      <span
                        key={sub.id}
                        className="text-[11px] font-bold bg-white border border-slate-200 px-2.5 py-1 rounded-lg text-slate-800"
                      >
                        {sub.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: SCHOOL RULES & PASSING SCORE */}
          {step === 3 && (
            <div className="space-y-5">
              <div>
                <span className="text-xs font-extrabold text-slate-800 block mb-1">
                  Passo 3: Média Escolar & Metas de Estudo
                </span>
                <p className="text-xs text-slate-500">
                  Defina as regras da escola para ativação dos alertas de recuperação automática.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <label className="text-xs font-extrabold text-slate-800 block flex items-center justify-between">
                    <span>Média de Aprovação da Escola:</span>
                    <span className="text-indigo-600 font-mono text-sm">{passingScore.toFixed(1)}</span>
                  </label>
                  <input
                    type="range"
                    min="5.0"
                    max="8.0"
                    step="0.5"
                    value={passingScore}
                    onChange={(e) => setPassingScore(parseFloat(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                  <p className="text-[10px] text-slate-500">
                    Se a média do aluno em qualquer matéria for menor que {passingScore.toFixed(1)}, o sistema marca a matéria como "Pontos de Atenção".
                  </p>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <label className="text-xs font-extrabold text-slate-800 block">
                    Regime de Avaliações Escolar:
                  </label>
                  <div className="flex bg-white p-1 rounded-xl border border-slate-300">
                    <button
                      type="button"
                      onClick={() => setRegime('bimestral')}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${
                        regime === 'bimestral' ? 'bg-indigo-600 text-white' : 'text-slate-600'
                      }`}
                    >
                      Bimestral (4 Etapas)
                    </button>
                    <button
                      type="button"
                      onClick={() => setRegime('trimestral')}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${
                        regime === 'trimestral' ? 'bg-indigo-600 text-white' : 'text-slate-600'
                      }`}
                    >
                      Trimestral (3 Etapas)
                    </button>
                  </div>
                </div>
              </div>

              {!isParent && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <label className="text-xs font-extrabold text-slate-800 block flex items-center justify-between">
                    <span>Meta de Horas de Estudo Semanal:</span>
                    <span className="text-indigo-600 font-mono text-sm">{weeklyTargetHours}h / semana</span>
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="40"
                    step="5"
                    value={weeklyTargetHours}
                    onChange={(e) => setWeeklyTargetHours(parseInt(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                  <p className="text-[10px] text-slate-500">
                    Carga horária líquida dividida entre seus blocos no cronograma adaptativo.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Navigation Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl flex items-center space-x-1.5 transition"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Anterior</span>
              </button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl flex items-center space-x-1.5 transition shadow-md"
              >
                <span>Próximo Passo</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinish}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold px-6 py-2.5 rounded-2xl flex items-center space-x-2 transition shadow-md"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Concluir e Abrir Sistema</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
