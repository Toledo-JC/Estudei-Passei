import React, { useState } from 'react';
import { Users, X, Check, Copy, Share2, Sparkles, Trophy } from 'lucide-react';
import { ClassGroup, RankingCategory } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface CreateClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClassCreated: (newClass: ClassGroup) => void;
}

const CATEGORY_OPTIONS: { id: RankingCategory; label: string; icon: string }[] = [
  { id: 'hours', label: 'Horas de Estudo', icon: '⏱️' },
  { id: 'questions', label: 'Questões Resolvidas', icon: '📝' },
  { id: 'accuracy', label: 'Taxa de Acertos (%)', icon: '🎯' },
  { id: 'streak', label: 'Sequência diária (Streak)', icon: '🔥' },
  { id: 'simulations', label: 'Simulados Concluídos', icon: '🏆' }
];

export const CreateClassModal: React.FC<CreateClassModalProps> = ({
  isOpen,
  onClose,
  onClassCreated
}) => {
  const { user } = useAuth();
  const [className, setClassName] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<RankingCategory[]>(['hours', 'questions', 'accuracy', 'streak']);
  const [createdClass, setCreatedClass] = useState<ClassGroup | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  if (!isOpen) return null;

  const toggleCategory = (cat: RankingCategory) => {
    if (selectedCategories.includes(cat)) {
      if (selectedCategories.length === 1) return; // Keep at least one
      setSelectedCategories(selectedCategories.filter(c => c !== cat));
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = className.trim();
    if (!trimmed) {
      alert('Por favor, informe o nome da turma.');
      return;
    }

    const randomCode = `TURMA-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    const newGroup: ClassGroup = {
      id: `class-${Date.now()}`,
      name: trimmed,
      createdByUid: user?.uid || 'guest-user',
      createdByName: user?.displayName || 'Aluno',
      inviteCode: randomCode,
      categories: selectedCategories,
      createdAt: new Date().toISOString(),
      isActive: true,
      memberCount: 1
    };

    // Save to localStorage
    const STORAGE_KEY = 'estudei_class_groups';
    const existing = localStorage.getItem(STORAGE_KEY);
    let classesArray: ClassGroup[] = [];
    if (existing) {
      try { classesArray = JSON.parse(existing); } catch (e) { }
    }
    classesArray.unshift(newGroup);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(classesArray));

    setCreatedClass(newGroup);
    onClassCreated(newGroup);
  };

  const handleCopyInviteLink = () => {
    if (!createdClass) return;
    const inviteText = `Venha estudar comigo e competir na turma "${createdClass.name}" no Estudei & Passei!\nCódigo de acesso: ${createdClass.inviteCode}`;
    navigator.clipboard.writeText(inviteText);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-5 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-indigo-600/40 rounded-2xl border border-indigo-400/30">
              <Users className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="text-base font-extrabold font-display">Criar Nova Turma de Estudos</h3>
              <p className="text-xs text-indigo-200">
                Monte um grupo de estudos saudável entre amigos
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl bg-slate-800/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!createdClass ? (
          <form onSubmit={handleCreateClass} className="p-6 space-y-5">
            <div>
              <label className="block text-xs font-extrabold text-slate-700 mb-1">Nome da Turma *</label>
              <input
                type="text"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                placeholder="Ex: Feras do 3º Ano A / Rumo à Medicina"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 focus:outline-hidden focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-700 mb-2">
                Selecione as Métricas do Ranqueamento
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {CATEGORY_OPTIONS.map((cat) => {
                  const isSelected = selectedCategories.includes(cat.id);
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => toggleCategory(cat.id)}
                      className={`p-3 rounded-2xl border text-left text-xs font-extrabold flex items-center justify-between transition ${
                        isSelected
                          ? 'bg-indigo-50 border-indigo-600 text-indigo-950'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <span className="flex items-center space-x-2">
                        <span className="text-base">{cat.icon}</span>
                        <span>{cat.label}</span>
                      </span>
                      {isSelected && <Check className="w-4 h-4 text-indigo-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900">
              🔒 <strong>Garantia de Privacidade do Aluno:</strong> O ranqueamento exibe apenas codinomes anônimos e avatares escolhidos. Nomes reais, notas escolares e fotos nunca são expostos.
            </div>

            <div className="pt-2 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-2xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-extrabold shadow-sm transition"
              >
                Criar Turma
              </button>
            </div>
          </form>
        ) : (
          <div className="p-6 space-y-5 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <Check className="w-6 h-6" />
            </div>

            <div>
              <h4 className="text-base font-extrabold text-slate-900 font-display">
                Turma "{createdClass.name}" criada com sucesso!
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Compartilhe o código de acesso para que seus colegas entrem no grupo.
              </p>
            </div>

            <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-2xl space-y-2">
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block">Código da Turma</span>
              <span className="text-2xl font-black font-mono text-indigo-900 block tracking-wider">
                {createdClass.inviteCode}
              </span>
            </div>

            <div className="flex items-center justify-center space-x-3">
              <button
                onClick={handleCopyInviteLink}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-extrabold transition flex items-center space-x-2"
              >
                <Copy className="w-4 h-4" />
                <span>{copiedCode ? 'Copiado para Área de Transferência!' : 'Copiar Convite'}</span>
              </button>

              <button
                onClick={onClose}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-2xl text-xs font-bold transition"
              >
                Ir para o Ranqueamento
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
