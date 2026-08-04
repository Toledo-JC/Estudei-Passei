import React from 'react';
import { HighSchoolSeries, BimesterNumber } from '../types';
import { GraduationCap, Calendar, CheckSquare, Sparkles, Info } from 'lucide-react';
import { HIGH_SCHOOL_CURRICULUM_TEMPLATES } from '../data/curriculumTemplates';

interface GradeSelectorProps {
  series: HighSchoolSeries;
  onChangeSeries: (series: HighSchoolSeries) => void;
  bimester: BimesterNumber;
  onChangeBimester: (bimester: BimesterNumber) => void;
  markPreviousCompleted: boolean;
  onToggleMarkPrevious: (val: boolean) => void;
}

export const GradeSelector: React.FC<GradeSelectorProps> = ({
  series,
  onChangeSeries,
  bimester,
  onChangeBimester,
  markPreviousCompleted,
  onToggleMarkPrevious
}) => {
  const currentTemplate = HIGH_SCHOOL_CURRICULUM_TEMPLATES[series] || HIGH_SCHOOL_CURRICULUM_TEMPLATES['1st'];
  const totalSubjectsCount = currentTemplate.subjects.length;

  let totalTopicsCount = 0;
  let pastTopicsCount = 0;
  let currentTopicsCount = 0;
  let futureTopicsCount = 0;

  currentTemplate.subjects.forEach(sub => {
    sub.topics.forEach(t => {
      totalTopicsCount++;
      if (t.bimester < bimester) pastTopicsCount++;
      else if (t.bimester === bimester) currentTopicsCount++;
      else futureTopicsCount++;
    });
  });

  return (
    <div className="space-y-6">
      {/* Series selection cards */}
      <div className="space-y-2">
        <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
          <GraduationCap className="w-4 h-4 text-indigo-600" />
          <span>1. Selecione a Série do Ensino Médio:</span>
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {(['1st', '2nd', '3rd'] as HighSchoolSeries[]).map((sKey) => {
            const tmpl = HIGH_SCHOOL_CURRICULUM_TEMPLATES[sKey];
            const isSelected = series === sKey;

            return (
              <button
                key={sKey}
                type="button"
                onClick={() => onChangeSeries(sKey)}
                className={`p-4 rounded-2xl border text-left transition relative overflow-hidden ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md ring-2 ring-indigo-400/30 scale-[1.01]'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-100/80'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2">
                    <Sparkles className="w-4 h-4 text-amber-300" />
                  </div>
                )}
                <span className="text-xs font-black block">{tmpl.seriesLabel}</span>
                <span className={`text-[11px] block mt-1 ${isSelected ? 'text-indigo-100' : 'text-slate-500'}`}>
                  {tmpl.subjects.length} Matérias da BNCC
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bimester selection pills */}
      <div className="space-y-2">
        <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
          <Calendar className="w-4 h-4 text-indigo-600" />
          <span>2. Selecione o Bimestre Letivo Atual da Escola:</span>
        </label>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {([1, 2, 3, 4] as BimesterNumber[]).map((bNum) => {
            const isSelected = bimester === bNum;

            return (
              <button
                key={bNum}
                type="button"
                onClick={() => onChangeBimester(bNum)}
                className={`p-3 rounded-xl border text-center transition ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 font-black border-amber-500 shadow-sm'
                    : 'bg-white border-slate-200 text-slate-700 font-bold hover:border-slate-300'
                }`}
              >
                <span className="text-xs block">{bNum}º Bimestre</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Toggle past bimester topics completion */}
      <div className="p-4 bg-indigo-50/80 border border-indigo-200 rounded-2xl space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-indigo-100 rounded-xl shrink-0 mt-0.5">
              <CheckSquare className="w-4 h-4 text-indigo-700" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block">
                Marcar bimestres anteriores como "Já Estudados"?
              </span>
              <p className="text-[11px] text-slate-600 leading-snug mt-0.5">
                Ative esta opção se o aluno já concluiu o {bimester > 1 ? `${bimester - 1}º Bimestre` : 'início das aulas'}. Os tópicos passados serão marcados como concluídos e o foco inicial ficará nas matérias do {bimester}º Bimestre.
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
            <input
              type="checkbox"
              checked={markPreviousCompleted}
              onChange={(e) => onToggleMarkPrevious(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
          </label>
        </div>

        {/* Dynamic preview stats */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-indigo-100/80 text-center">
          <div className="bg-white/80 p-2 rounded-xl border border-indigo-100">
            <span className="text-[10px] text-slate-500 font-medium block">Etapas Anteriores</span>
            <span className="text-xs font-black text-slate-700 font-mono">
              {pastTopicsCount} tópicos {markPreviousCompleted && bimester > 1 ? '(Concluídos)' : '(Pendentes)'}
            </span>
          </div>

          <div className="bg-white/80 p-2 rounded-xl border border-indigo-200 ring-1 ring-indigo-300">
            <span className="text-[10px] text-indigo-700 font-bold block">Bimestre Atual ({bimester}º)</span>
            <span className="text-xs font-black text-indigo-950 font-mono">
              {currentTopicsCount} tópicos
            </span>
          </div>

          <div className="bg-white/80 p-2 rounded-xl border border-indigo-100">
            <span className="text-[10px] text-slate-500 font-medium block">Bimestres Futuros</span>
            <span className="text-xs font-black text-slate-700 font-mono">
              {futureTopicsCount} tópicos
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
