import React, { useState, useEffect } from 'react';
import { Subject, HighSchoolSeries, BimesterNumber } from '../types';
import { useCurriculumTemplate } from '../hooks/useCurriculumTemplate';
import { GradeSelector } from './GradeSelector';
import { CurriculumReviewScreen } from './CurriculumReviewScreen';
import { Sparkles, Camera, Edit3, BookOpen, Layers, ArrowRight, CheckCircle2, RefreshCw } from 'lucide-react';

interface CurriculumSetupScreenProps {
  onCompleteSetup: (subjects: Subject[]) => void;
  onOpenBookScanner: () => void;
  initialSeries?: HighSchoolSeries;
  initialBimester?: BimesterNumber;
}

export const CurriculumSetupScreen: React.FC<CurriculumSetupScreenProps> = ({
  onCompleteSetup,
  onOpenBookScanner,
  initialSeries = '2nd',
  initialBimester = 2
}) => {
  const {
    selectedSeries,
    setSelectedSeries,
    selectedBimester,
    setSelectedBimester,
    markPreviousAsCompleted,
    setMarkPreviousAsCompleted,
    generateSubjects,
    subdivideSubject
  } = useCurriculumTemplate();

  useEffect(() => {
    if (initialSeries) setSelectedSeries(initialSeries);
    if (initialBimester) setSelectedBimester(initialBimester);
  }, [initialSeries, initialBimester]);

  const [setupMode, setSetupMode] = useState<'choose_option' | 'grade_selector' | 'curriculum_review'>('choose_option');
  const [activeSubjects, setActiveSubjects] = useState<Subject[]>([]);

  const handleStartSmartGrid = () => {
    setSetupMode('grade_selector');
  };

  const handleProceedToReview = () => {
    const generated = generateSubjects(selectedSeries, selectedBimester, markPreviousAsCompleted);
    setActiveSubjects(generated);
    setSetupMode('curriculum_review');
  };

  const handleConfirmAndFinish = () => {
    onCompleteSetup(activeSubjects);
  };

  const handleStartEmpty = () => {
    onCompleteSetup([]);
  };

  return (
    <div className="space-y-6">
      {/* MODE 1: CHOOSE OPTION */}
      {setupMode === 'choose_option' && (
        <div className="space-y-5 animate-in fade-in">
          <div>
            <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider block mb-1">
              Como deseja montar sua grade de matérias escolares?
            </span>
            <p className="text-xs text-slate-500">
              Escolha a forma mais ágil de carregar suas disciplinas e tópicos de estudo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Option A: Smart Default Grid */}
            <button
              type="button"
              onClick={handleStartSmartGrid}
              className="p-5 rounded-3xl border text-left bg-gradient-to-b from-indigo-50/80 to-indigo-100/30 border-indigo-300 hover:border-indigo-500 hover:shadow-lg transition space-y-3 relative group overflow-hidden"
            >
              <div className="absolute top-3 right-3 bg-indigo-600 text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-xs">
                Recomendado
              </div>

              <div className="p-3 bg-indigo-600 text-white rounded-2xl w-fit shadow-md group-hover:scale-105 transition">
                <Sparkles className="w-6 h-6 text-amber-300" />
              </div>

              <div>
                <h3 className="text-sm font-extrabold text-indigo-950 font-display">
                  Grade Padrão Inteligente
                </h3>
                <p className="text-xs text-indigo-800/80 leading-relaxed mt-1">
                  Carregue a grade nacional oficial (BNCC/ENEM) ajustada automaticamente para o seu ano (1º, 2º ou 3º EM) e bimestre atual.
                </p>
              </div>

              <div className="flex items-center text-xs font-extrabold text-indigo-700 pt-2 space-x-1">
                <span>Configurar em 2 cliques</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </div>
            </button>

            {/* Option B: Book TOC Scanner */}
            <button
              type="button"
              onClick={onOpenBookScanner}
              className="p-5 rounded-3xl border text-left bg-white border-slate-200 hover:border-indigo-400 hover:shadow-md transition space-y-3 group"
            >
              <div className="p-3 bg-amber-100 border border-amber-200 text-amber-800 rounded-2xl w-fit group-hover:scale-105 transition">
                <Camera className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-sm font-extrabold text-slate-900 font-display">
                  Escanear Sumário de Livro
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed mt-1">
                  Tire foto do sumário dos seus livros didáticos e nossa IA extrairá os capítulos e tópicos automaticamente.
                </p>
              </div>

              <div className="flex items-center text-xs font-bold text-amber-700 pt-2 space-x-1">
                <span>Usar Câmera / OCR</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </div>
            </button>

            {/* Option C: Empty / Manual */}
            <button
              type="button"
              onClick={handleStartEmpty}
              className="p-5 rounded-3xl border text-left bg-white border-slate-200 hover:border-slate-400 hover:shadow-md transition space-y-3 group"
            >
              <div className="p-3 bg-slate-100 border border-slate-200 text-slate-700 rounded-2xl w-fit group-hover:scale-105 transition">
                <Edit3 className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-sm font-extrabold text-slate-900 font-display">
                  Começar do Zero (Vazio)
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed mt-1">
                  Comece com o painel limpo e cadastre suas matérias e professores manualmente um a um.
                </p>
              </div>

              <div className="flex items-center text-xs font-bold text-slate-600 pt-2 space-x-1">
                <span>Criar Vazio</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </div>
            </button>
          </div>
        </div>
      )}

      {/* MODE 2: GRADE SELECTOR */}
      {setupMode === 'grade_selector' && (
        <div className="space-y-6 animate-in fade-in">
          <GradeSelector
            series={selectedSeries}
            onChangeSeries={setSelectedSeries}
            bimester={selectedBimester}
            onChangeBimester={setSelectedBimester}
            markPreviousCompleted={markPreviousAsCompleted}
            onToggleMarkPrevious={setMarkPreviousAsCompleted}
          />

          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setSetupMode('choose_option')}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl transition"
            >
              Alterar Modo de Configuração
            </button>

            <button
              type="button"
              onClick={handleProceedToReview}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold px-6 py-2.5 rounded-2xl flex items-center space-x-2 transition shadow-md"
            >
              <span>Avançar para Revisar Grade</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* MODE 3: CURRICULUM REVIEW SCREEN */}
      {setupMode === 'curriculum_review' && (
        <div className="animate-in fade-in">
          <CurriculumReviewScreen
            series={selectedSeries}
            currentBimester={selectedBimester}
            subjects={activeSubjects}
            onUpdateSubjects={setActiveSubjects}
            onConfirm={handleConfirmAndFinish}
            onBack={() => setSetupMode('grade_selector')}
            subdivideSubject={subdivideSubject}
          />
        </div>
      )}
    </div>
  );
};
