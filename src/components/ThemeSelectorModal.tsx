import React from 'react';
import { ThemeId, LayoutDensity, AppLayoutType, ThemeOption, LayoutOption } from '../types';
import { Palette, LayoutGrid, CheckCircle2, Sparkles, X, Sun, Moon, BookOpen, Layers, Sidebar, Columns } from 'lucide-react';

interface ThemeSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: ThemeId;
  onSelectTheme: (theme: ThemeId) => void;
  currentLayout: AppLayoutType;
  onSelectLayout: (layout: AppLayoutType) => void;
  currentDensity: LayoutDensity;
  onSelectDensity: (density: LayoutDensity) => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export const layoutOptions: LayoutOption[] = [
  {
    id: 'bento-grid',
    name: '1. Grid Bento Executivo',
    subtitle: 'Painel Multi-Módulos em Mosaico',
    description: 'Organização em blocos independentes com banner de resumo e diário geral de aulas.'
  },
  {
    id: 'sidebar-split',
    name: '2. Navegação com Barra Lateral',
    subtitle: 'Sidebar Fixa + Palco Principal',
    description: 'Painel lateral com matérias e status de notas; palco principal para estudo ativo.'
  },
  {
    id: 'focus-stream',
    name: '3. Feed de Foco Contínuo',
    subtitle: 'Coluna Única Sem Distrações',
    description: 'Fluxo linear simplificado centralizando cronômetro ativo e meta do dia.'
  },
  {
    id: 'kanban-board',
    name: '4. Quadro Kanban Semanal',
    subtitle: 'Visualização por Colunas de Progresso',
    description: 'Organiza disciplinas e temas por status: Aulas Ministradas, Escopo de Prova e Revisão Espaçada.'
  }
];

export const themeOptions: ThemeOption[] = [
  {
    id: 'modern-indigo',
    name: 'Tema 1: Moderno & Elegante',
    subtitle: 'High-Tech Indigo & Slate',
    previewBg: 'bg-slate-900',
    previewCard: 'bg-indigo-600',
    previewAccent: 'bg-amber-400',
    description: 'Design contemporâneo de alta performance com contraste nítido e detalhes em azul índigo.'
  },
  {
    id: 'warm-minimalist',
    name: 'Tema 2: Minimalista Serenidade',
    subtitle: 'Warm Cream & Emerald Zen',
    previewBg: 'bg-stone-200',
    previewCard: 'bg-emerald-700',
    previewAccent: 'bg-amber-300',
    description: 'Cores quentes e suaves que reduzem a fadiga visual durante longas jornadas de estudo.'
  },
  {
    id: 'dark-focus',
    name: 'Tema 3: Cyber Dark Focus',
    subtitle: 'Midnight Dark & Neon Cyan',
    previewBg: 'bg-slate-950',
    previewCard: 'bg-cyan-500',
    previewAccent: 'bg-violet-500',
    description: 'Modo escuro imersivo com elementos de alto contraste para sessões noturnas sem distrações.'
  },
  {
    id: 'academic-editorial',
    name: 'Tema 4: Editorial Acadêmico',
    subtitle: 'Classic Navy & Vintage Paper',
    previewBg: 'bg-amber-100/60',
    previewCard: 'bg-sky-900',
    previewAccent: 'bg-rose-700',
    description: 'Aesthetic clássico de biblioteca universitária com tipografia elegante e acabamento formal.'
  }
];

export const ThemeSelectorModal: React.FC<ThemeSelectorModalProps> = ({
  isOpen,
  onClose,
  currentTheme,
  onSelectTheme,
  currentLayout,
  onSelectLayout,
  currentDensity,
  onSelectDensity,
  isDarkMode,
  onToggleDarkMode
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-3xl w-full p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto text-slate-900 dark:text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-indigo-100 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 rounded-2xl">
              <Palette className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white font-display">
                Estúdio de Layouts & Temas Personalizáveis
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Escolha a estrutura de tela (4 layouts diferentes) e o estilo visual (4 temas de cores).
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {onToggleDarkMode && (
              <button
                type="button"
                onClick={onToggleDarkMode}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition cursor-pointer"
              >
                {isDarkMode ? (
                  <>
                    <Sun className="w-4 h-4 text-amber-400" />
                    <span>Modo Claro</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4 text-indigo-500" />
                    <span>Modo Escuro</span>
                  </>
                )}
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* SECTION 1: 4 STRUCTURAL LAYOUTS */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center space-x-1.5">
            <LayoutGrid className="w-4 h-4 text-indigo-600" />
            <span>1. Escolha a Estrutura de Layout (4 Telas Diferentes)</span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {layoutOptions.map((l) => {
              const isSelected = currentLayout === l.id;

              return (
                <div
                  key={l.id}
                  onClick={() => onSelectLayout(l.id)}
                  className={`p-4 rounded-2xl border-2 transition cursor-pointer flex flex-col justify-between space-y-2 ${
                    isSelected
                      ? 'bg-indigo-50/90 border-indigo-600 shadow-md ring-2 ring-indigo-500/20'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">{l.name}</span>
                      <span className="text-[10px] text-indigo-700 font-semibold">{l.subtitle}</span>
                    </div>

                    {isSelected && (
                      <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0" />
                    )}
                  </div>

                  <p className="text-[11px] text-slate-600 leading-relaxed">{l.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION 2: 4 THEME PALETTES */}
        <div className="space-y-3 pt-3 border-t border-slate-100">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center space-x-1.5">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>2. Escolha o Estilo de Cores (4 Temas de Designer)</span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {themeOptions.map((t) => {
              const isSelected = currentTheme === t.id;

              return (
                <div
                  key={t.id}
                  onClick={() => onSelectTheme(t.id)}
                  className={`p-4 rounded-2xl border-2 transition cursor-pointer flex flex-col justify-between space-y-2 ${
                    isSelected
                      ? 'bg-indigo-50/90 border-indigo-600 shadow-md ring-2 ring-indigo-500/20'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">{t.name}</span>
                      <span className="text-[10px] text-slate-500 font-medium">{t.subtitle}</span>
                    </div>

                    {isSelected && (
                      <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0" />
                    )}
                  </div>

                  <div className="flex items-center space-x-2 bg-white p-2 rounded-xl border border-slate-200">
                    <div className={`w-6 h-6 rounded-lg ${t.previewBg} shadow-xs`} title="Fundo Base" />
                    <div className={`w-6 h-6 rounded-lg ${t.previewCard} shadow-xs`} title="Barra Principal" />
                    <div className={`w-6 h-6 rounded-lg ${t.previewAccent} shadow-xs`} title="Destaques" />
                    <span className="text-[10px] text-slate-400 font-mono ml-auto">Preview</span>
                  </div>

                  <p className="text-[11px] text-slate-600 leading-relaxed">{t.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer actions */}
        <div className="pt-4 border-t border-slate-100 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow transition"
          >
            Aplicar Layout & Tema Selecionados
          </button>
        </div>
      </div>
    </div>
  );
};
