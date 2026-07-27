import React, { useState } from 'react';
import { Subject, SchoolTimetable, StudentTaskItem, StudySessionLog } from '../types';
import {
  Clock,
  Sparkles,
  CheckCircle2,
  Play,
  Calendar,
  AlertCircle,
  Edit3,
  ArrowRight,
  RefreshCw,
  Zap,
  BookOpen,
  Sliders,
  Brain,
  Check,
  Plus,
  RotateCcw,
  Target,
  Layers,
  Settings,
  HelpCircle,
  BarChart2,
  Award,
  PieChart,
  X,
  ChevronRight,
  ChevronLeft,
  Filter,
  Flame,
  CheckSquare,
  ListTodo
} from 'lucide-react';

interface AdaptiveStudyCycleSectionProps {
  subjects: Subject[];
  timetable: SchoolTimetable;
  studentTasks: StudentTaskItem[];
  onLogStudySession: (log: Omit<StudySessionLog, 'id'>) => void;
  onOpenTimetableModal: () => void;
}

export const AdaptiveStudyCycleSection: React.FC<AdaptiveStudyCycleSectionProps> = ({
  subjects,
  timetable,
  studentTasks,
  onLogStudySession,
  onOpenTimetableModal
}) => {
  // Mode: 'today_school' (Sincronizado com Aulas da Escola) vs 'custom_weights' (Ciclo Personalizado por Dificuldade)
  const [cycleMode, setCycleMode] = useState<'today_school' | 'custom_weights'>('today_school');

  // Selected Day Key
  const [selectedDayKey, setSelectedDayKey] = useState<'segunda' | 'terca' | 'quarta' | 'quinta' | 'sexta' | 'sabado' | 'domingo'>('segunda');

  // Time & Duration Settings (Pedagogical Standards)
  const [homeStartTime, setHomeStartTime] = useState('14:00');
  const [blockDuration, setBlockDuration] = useState<number>(50); // 50 min Pomodoro standard
  const [breakDuration, setBreakDuration] = useState<number>(10); // 10 min break
  const [dailyQuestionsTarget, setDailyQuestionsTarget] = useState<number>(20); // 15-25 target
  const [spacedRevisionMins, setSpacedRevisionMins] = useState<number>(20); // 15-20 min daily spaced revision

  // Custom Difficulty Weights State (subjectId -> weight 1 to 5)
  const [subjectWeights, setSubjectWeights] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    subjects.forEach(s => {
      initial[s.id] = s.weight || 3;
    });
    return initial;
  });

  // Selected subjects for custom cycle
  const [selectedSubjectIds, setSelectedSubjectIds] = useState<string[]>(() =>
    subjects.filter(s => s.enabled !== false).map(s => s.id)
  );

  // Active view tab inside section
  const [activeSubTab, setActiveSubTab] = useState<'timeline' | 'weekly_agenda' | 'donut_chart' | 'customizer'>('timeline');

  // Interactive Wizard Modal State
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState<number>(1);

  // Execution State
  const [completedCycleIds, setCompletedCycleIds] = useState<string[]>([]);
  const [dailyQuestionsSolvedCount, setDailyQuestionsSolvedCount] = useState<number>(0);

  const enabledSubjects = subjects.filter(s => s.enabled !== false);
  const isWeekend = selectedDayKey === 'sabado' || selectedDayKey === 'domingo';

  // Find school subjects for current selected day
  const currentDayData = timetable.find(d => d.dayKey === selectedDayKey);
  const subjectsTaughtTodayIds = Array.from(
    new Set(currentDayData?.periods.map(p => p.subjectId) || [])
  );
  const subjectsTaughtToday = subjectsTaughtTodayIds
    .map(id => enabledSubjects.find(s => s.id === id))
    .filter(Boolean) as Subject[];

  const pendingTasks = studentTasks.filter(t => !t.completed);

  // Update subject difficulty weight
  const handleWeightChange = (subjectId: string, newWeight: number) => {
    setSubjectWeights(prev => ({ ...prev, [subjectId]: newWeight }));
  };

  // Toggle subject selection for custom cycle
  const handleToggleSubjectSelection = (subjectId: string) => {
    setSelectedSubjectIds(prev =>
      prev.includes(subjectId) ? prev.filter(id => id !== subjectId) : [...prev, subjectId]
    );
  };

  const handleSelectAllSubjects = () => {
    setSelectedSubjectIds(enabledSubjects.map(s => s.id));
  };

  const handleDeselectAllSubjects = () => {
    setSelectedSubjectIds([]);
  };

  const handleSelectCategorySubjects = (category: string) => {
    const catSubjectIds = enabledSubjects.filter(s => s.category === category).map(s => s.id);
    setSelectedSubjectIds(prev => Array.from(new Set([...prev, ...catSubjectIds])));
  };

  // Apply Focus Presets
  const applyFocusPreset = (preset: 'medicina' | 'direito' | 'exatas' | 'enem_equilibrado') => {
    setCycleMode('custom_weights');
    const newWeights: Record<string, number> = {};

    enabledSubjects.forEach(sub => {
      const cat = sub.category;
      const nameLower = sub.name.toLowerCase();

      if (preset === 'medicina') {
        if (cat === 'Biológicas' || cat === 'Exatas' || nameLower.includes('química') || nameLower.includes('biologia') || cat === 'Redação') {
          newWeights[sub.id] = 5;
        } else {
          newWeights[sub.id] = 2;
        }
      } else if (preset === 'direito') {
        if (cat === 'Humanas' || cat === 'Linguagens' || cat === 'Redação' || nameLower.includes('história') || nameLower.includes('filosofia')) {
          newWeights[sub.id] = 5;
        } else {
          newWeights[sub.id] = 2;
        }
      } else if (preset === 'exatas') {
        if (cat === 'Exatas' || nameLower.includes('matemática') || nameLower.includes('física') || nameLower.includes('química')) {
          newWeights[sub.id] = 5;
        } else {
          newWeights[sub.id] = 2;
        }
      } else {
        newWeights[sub.id] = 3;
      }
    });

    setSubjectWeights(newWeights);
    setSelectedSubjectIds(enabledSubjects.map(s => s.id));
  };

  // GENERATE CYCLE STEPS FOR A SPECIFIC DAY
  const generateStudyCycleForDay = (dayKey: 'segunda' | 'terca' | 'quarta' | 'quinta' | 'sexta' | 'sabado' | 'domingo') => {
    const steps: {
      id: string;
      timeSlot: string;
      type: 'teoria_pratica' | 'pausa' | 'tarefa' | 'revisao_espacada';
      subject?: Subject;
      title: string;
      description: string;
      durationMinutes: number;
      targetQuestions: number;
      brainHemisphere: 'Exatas/Raciocínio' | 'Humanas/Linguagens' | 'Pausa/Apoio';
    }[] = [];

    let currentMinutes = parseInt(homeStartTime.split(':')[0]) * 60 + parseInt(homeStartTime.split(':')[1]);

    const formatMins = (mins: number) => {
      const h = Math.floor(mins / 60) % 24;
      const m = mins % 60;
      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    };

    const isDayWeekend = dayKey === 'sabado' || dayKey === 'domingo';

    // Find school subjects for specified day
    const dayData = timetable.find(d => d.dayKey === dayKey);
    const daySchoolSubjectIds = Array.from(new Set(dayData?.periods.map(p => p.subjectId) || []));
    const daySchoolSubjects = daySchoolSubjectIds
      .map(id => enabledSubjects.find(s => s.id === id))
      .filter(Boolean) as Subject[];

    let targetSubjects: Subject[] = [];

    if (cycleMode === 'today_school') {
      if (daySchoolSubjects.length > 0) {
        targetSubjects = daySchoolSubjects;
      } else {
        targetSubjects = enabledSubjects.slice(0, isDayWeekend ? 4 : 3);
      }
    } else {
      const filtered = enabledSubjects.filter(s => selectedSubjectIds.includes(s.id));
      const sorted = [...filtered].sort((a, b) => {
        const wA = subjectWeights[a.id] || 3;
        const wB = subjectWeights[b.id] || 3;
        return wB - wA;
      });

      const maxSubjectsForDay = isDayWeekend ? 4 : 3;
      targetSubjects = sorted.slice(0, maxSubjectsForDay);

      const exatas = targetSubjects.filter(s => s.category === 'Exatas');
      const humanas = targetSubjects.filter(s => s.category !== 'Exatas');

      if (exatas.length > 0 && humanas.length > 0) {
        const interleaved: Subject[] = [];
        let i = 0;
        while (i < Math.max(exatas.length, humanas.length)) {
          if (exatas[i]) interleaved.push(exatas[i]);
          if (humanas[i]) interleaved.push(humanas[i]);
          i++;
        }
        targetSubjects = interleaved.slice(0, maxSubjectsForDay);
      }
    }

    const questionsPerSubject = Math.max(8, Math.round(dailyQuestionsTarget / Math.max(1, targetSubjects.length)));

    targetSubjects.forEach((sub, idx) => {
      const startStr = formatMins(currentMinutes);
      currentMinutes += blockDuration;
      const endStr = formatMins(currentMinutes);

      const isExatas = sub.category === 'Exatas';
      const weight = subjectWeights[sub.id] || 3;

      steps.push({
        id: `cycle-block-${dayKey}-${sub.id}-${idx}`,
        timeSlot: `${startStr} - ${endStr}`,
        type: 'teoria_pratica',
        subject: sub,
        title: `Bloco ${idx + 1}: ${sub.name}`,
        description: `35 min teoria/resumo + 15 min resolução prática (~${questionsPerSubject} questões). Prioridade: ${
          weight >= 4 ? 'Alta (Matéria Crítica)' : 'Regular'
        }.`,
        durationMinutes: blockDuration,
        targetQuestions: questionsPerSubject,
        brainHemisphere: isExatas ? 'Exatas/Raciocínio' : 'Humanas/Linguagens'
      });

      if (idx < targetSubjects.length - 1) {
        const breakStart = formatMins(currentMinutes);
        currentMinutes += breakDuration;
        const breakEnd = formatMins(currentMinutes);

        steps.push({
          id: `cycle-break-${dayKey}-${idx}`,
          timeSlot: `${breakStart} - ${breakEnd}`,
          type: 'pausa',
          title: `Pausa Consciente & Hidratação`,
          description: `Desconecte das telas e tome água. Alterne a atenção mental para consolidar a memória.`,
          durationMinutes: breakDuration,
          targetQuestions: 0,
          brainHemisphere: 'Pausa/Apoio'
        });
      }
    });

    if (pendingTasks.length > 0 && cycleMode === 'today_school') {
      const startStr = formatMins(currentMinutes);
      const duration = 30;
      currentMinutes += duration;
      const endStr = formatMins(currentMinutes);

      const topTask = pendingTasks[0];
      const taskSubject = enabledSubjects.find(s => s.id === topTask.subjectId);

      steps.push({
        id: `cycle-task-${topTask.id}`,
        timeSlot: `${startStr} - ${endStr}`,
        type: 'tarefa',
        subject: taskSubject,
        title: `Tarefa Escolar: ${topTask.title}`,
        description: `Entrega: ${topTask.date}. Resolva para envio no MS Teams / Google Classroom.`,
        durationMinutes: duration,
        targetQuestions: 0,
        brainHemisphere: 'Humanas/Linguagens'
      });

      currentMinutes += 5;
    }

    const revStart = formatMins(currentMinutes);
    currentMinutes += spacedRevisionMins;
    const revEnd = formatMins(currentMinutes);

    steps.push({
      id: `cycle-spaced-rev-${dayKey}`,
      timeSlot: `${revStart} - ${revEnd}`,
      type: 'revisao_espacada',
      title: `Revisão Espaçada Diária (1, 7 e 30 Dias)`,
      description: `Revisão rápida acumulada de flashcards, resumos e áudios do NotebookLM.`,
      durationMinutes: spacedRevisionMins,
      targetQuestions: 5,
      brainHemisphere: 'Humanas/Linguagens'
    });

    return steps;
  };

  const currentCycleSteps = generateStudyCycleForDay(selectedDayKey);

  // GENERATE FULL WEEKLY MATRIX FOR ALL DAYS
  const daysList: { key: 'segunda' | 'terca' | 'quarta' | 'quinta' | 'sexta' | 'sabado' | 'domingo'; label: string; sub: string }[] = [
    { key: 'segunda', label: 'Segunda', sub: 'Dia Letivo' },
    { key: 'terca', label: 'Terça', sub: 'Dia Letivo' },
    { key: 'quarta', label: 'Quarta', sub: 'Dia Letivo' },
    { key: 'quinta', label: 'Quinta', sub: 'Dia Letivo' },
    { key: 'sexta', label: 'Sexta', sub: 'Dia Letivo' },
    { key: 'sabado', label: 'Sábado', sub: 'Livre / Simulado' },
    { key: 'domingo', label: 'Domingo', sub: 'Livre / Redação' }
  ];

  const fullWeeklyCycle = daysList.map(d => ({
    ...d,
    steps: generateStudyCycleForDay(d.key)
  }));

  // CALCULATE SUBJECT & CATEGORY HOURS FOR DONUT CHART
  const calculateWeeklyCategoryDistribution = () => {
    const categoryMins: Record<string, { mins: number; color: string; subjects: string[] }> = {
      'Exatas': { mins: 0, color: '#3b82f6', subjects: [] },
      'Humanas': { mins: 0, color: '#f59e0b', subjects: [] },
      'Linguagens': { mins: 0, color: '#ec4899', subjects: [] },
      'Biológicas': { mins: 0, color: '#10b981', subjects: [] },
      'Redação/Revisão': { mins: 0, color: '#8b5cf6', subjects: [] }
    };

    let totalMins = 0;

    fullWeeklyCycle.forEach(day => {
      day.steps.forEach(step => {
        if (step.type === 'teoria_pratica' && step.subject) {
          const cat = step.subject.category || 'Humanas';
          if (!categoryMins[cat]) {
            categoryMins[cat] = { mins: 0, color: '#64748b', subjects: [] };
          }
          categoryMins[cat].mins += step.durationMinutes;
          if (!categoryMins[cat].subjects.includes(step.subject.name)) {
            categoryMins[cat].subjects.push(step.subject.name);
          }
          totalMins += step.durationMinutes;
        } else if (step.type === 'revisao_espacada') {
          categoryMins['Redação/Revisão'].mins += step.durationMinutes;
          totalMins += step.durationMinutes;
        }
      });
    });

    return { categoryMins, totalMins };
  };

  const { categoryMins, totalMins } = calculateWeeklyCategoryDistribution();

  // SVG DONUT SLICES COMPUTATION
  const renderDonutSlices = () => {
    if (totalMins === 0) return null;

    let accumulatedAngle = 0;
    const slices: { path: string; color: string; label: string; percentage: number; hours: string }[] = [];

    Object.entries(categoryMins).forEach(([cat, data]) => {
      if (data.mins <= 0) return;

      const percentage = (data.mins / totalMins) * 100;
      const angle = (data.mins / totalMins) * 360;

      const startAngle = accumulatedAngle;
      const endAngle = accumulatedAngle + angle;
      accumulatedAngle += angle;

      // Convert angles to radians
      const r = 80;
      const cx = 100;
      const cy = 100;

      const startRad = ((startAngle - 90) * Math.PI) / 180;
      const endRad = ((endAngle - 90) * Math.PI) / 180;

      const x1 = cx + r * Math.cos(startRad);
      const y1 = cy + r * Math.sin(startRad);
      const x2 = cx + r * Math.cos(endRad);
      const y2 = cy + r * Math.sin(endRad);

      const largeArc = angle > 180 ? 1 : 0;

      const path = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;

      const hrs = (data.mins / 60).toFixed(1);

      slices.push({
        path,
        color: data.color,
        label: cat,
        percentage,
        hours: `${hrs}h`
      });
    });

    return (
      <div className="relative w-52 h-52 mx-auto flex items-center justify-center shrink-0">
        <svg viewBox="0 0 200 200" className="w-full h-full transform -rotate-90 drop-shadow-sm">
          {slices.map((s, i) => (
            <path
              key={i}
              d={s.path}
              fill={s.color}
              className="transition-all duration-300 hover:opacity-85 hover:scale-105 transform origin-center cursor-pointer"
            />
          ))}
          {/* Inner cutout for donut hole */}
          <circle cx="100" cy="100" r="52" fill="#ffffff" />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
            Carga Semanal
          </span>
          <span className="text-xl font-black text-indigo-950 font-mono">
            {(totalMins / 60).toFixed(1)}h
          </span>
          <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 mt-0.5">
            Equilibrado
          </span>
        </div>
      </div>
    );
  };

  const handleMarkStepCompleted = (step: any) => {
    if (completedCycleIds.includes(step.id)) return;

    if (step.subject) {
      onLogStudySession({
        subjectId: step.subject.id,
        topic: step.title,
        minutes: step.durationMinutes,
        date: new Date().toISOString().split('T')[0],
        mode: step.type === 'revisao_espacada' ? 'revisao' : 'escola'
      });
    }

    if (step.targetQuestions > 0) {
      setDailyQuestionsSolvedCount(prev => prev + step.targetQuestions);
    }

    setCompletedCycleIds(prev => [...prev, step.id]);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
      {/* SECTION HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-tr from-amber-500 via-indigo-600 to-indigo-800 rounded-2xl text-white shadow-md">
            <Zap className="w-6 h-6 text-amber-300 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-extrabold text-slate-900 font-display">
                Ciclo de Estudos Adaptativo Inteligente
              </h3>
              <span className="bg-amber-100 text-amber-900 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-amber-300">
                Neuropedagogia ENEM
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Alternância de foco mental, pesos por dificuldade e distribuição de carga horária.
            </p>
          </div>
        </div>

        {/* ASSISTANT WIZARD BUTTON & TABS */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setWizardStep(1);
              setIsWizardOpen(true);
            }}
            className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-600 hover:to-indigo-700 text-white font-extrabold text-xs rounded-2xl shadow-xs transition flex items-center space-x-1.5"
          >
            <Sparkles className="w-4 h-4 text-amber-200" />
            <span>✨ Assistente de Montagem de Ciclo</span>
          </button>

          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
            <button
              type="button"
              onClick={() => setActiveSubTab('timeline')}
              className={`px-3 py-1.5 text-xs font-extrabold rounded-xl transition flex items-center space-x-1 ${
                activeSubTab === 'timeline'
                  ? 'bg-white text-indigo-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-indigo-600" />
              <span>Roteiro Diário</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSubTab('weekly_agenda')}
              className={`px-3 py-1.5 text-xs font-extrabold rounded-xl transition flex items-center space-x-1 ${
                activeSubTab === 'weekly_agenda'
                  ? 'bg-white text-indigo-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-indigo-600" />
              <span>Agenda da Semana</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSubTab('donut_chart')}
              className={`px-3 py-1.5 text-xs font-extrabold rounded-xl transition flex items-center space-x-1 ${
                activeSubTab === 'donut_chart'
                  ? 'bg-white text-indigo-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <PieChart className="w-3.5 h-3.5 text-amber-600" />
              <span>Gráfico Circular</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSubTab('customizer')}
              className={`px-3 py-1.5 text-xs font-extrabold rounded-xl transition flex items-center space-x-1 ${
                activeSubTab === 'customizer'
                  ? 'bg-white text-indigo-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sliders className="w-3.5 h-3.5 text-emerald-600" />
              <span>Pesos</span>
            </button>
          </div>
        </div>
      </div>

      {/* MODE TOGGLE: SCHOOL VS CUSTOM WEIGHTS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
        <button
          type="button"
          onClick={() => setCycleMode('today_school')}
          className={`p-3 rounded-xl text-left transition flex items-start space-x-3 ${
            cycleMode === 'today_school'
              ? 'bg-white text-slate-900 shadow-sm border border-slate-200 ring-2 ring-indigo-500/20'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
          <div>
            <span className="text-xs font-extrabold block">1. Sincronizado com Aulas da Escola</span>
            <span className="text-[11px] text-slate-500 leading-tight block">
              "Aula dada hoje, aula estudada hoje!" — Gera revisões automáticas das matérias assistidas na escola no dia.
            </span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setCycleMode('custom_weights')}
          className={`p-3 rounded-xl text-left transition flex items-start space-x-3 ${
            cycleMode === 'custom_weights'
              ? 'bg-white text-slate-900 shadow-sm border border-slate-200 ring-2 ring-amber-500/20'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Sliders className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="text-xs font-extrabold block">2. Ciclo Personalizado por Dificuldade (Pesos)</span>
            <span className="text-[11px] text-slate-500 leading-tight block">
              Prioriza matérias onde você tem mais dificuldade e distribui cargas por relevância no ENEM/Vestibulares.
            </span>
          </div>
        </button>
      </div>

      {/* FOCUS SELECTION & CUSTOMIZER BANNER WHEN IN CUSTOM WEIGHTS MODE */}
      {cycleMode === 'custom_weights' && (
        <div className="p-4 bg-amber-50/80 border border-amber-200/90 rounded-2xl space-y-3 animate-in fade-in">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h4 className="text-xs font-black text-amber-950 uppercase tracking-wide flex items-center gap-1.5">
                <Target className="w-4 h-4 text-amber-600" />
                <span>Escolha um Foco Sugerido ou Personalize Suas Matérias & Pesos</span>
              </h4>
              <p className="text-[11px] text-amber-900/80">
                Selecione um foco pré-definido abaixo ou clique no botão para escolher individualmente as matérias e seus pesos de dificuldade (1 a 5).
              </p>
            </div>

            <button
              type="button"
              onClick={() => setActiveSubTab('customizer')}
              className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs rounded-xl transition flex items-center space-x-1.5 shadow-xs"
            >
              <Sliders className="w-4 h-4" />
              <span>🎯 Personalizar Minhas Matérias & Pesos ({selectedSubjectIds.length} Selecionadas)</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <button
              type="button"
              onClick={() => applyFocusPreset('medicina')}
              className="p-2.5 bg-white hover:bg-amber-100/60 border border-amber-200 rounded-xl text-left transition shadow-2xs hover:shadow-xs"
            >
              <span className="text-xs font-bold text-slate-900 block">🩺 Medicina & Saúde</span>
              <span className="text-[10px] text-slate-500 block leading-tight mt-0.5">Biologia, Química e Exatas (Peso 5)</span>
            </button>

            <button
              type="button"
              onClick={() => applyFocusPreset('direito')}
              className="p-2.5 bg-white hover:bg-amber-100/60 border border-amber-200 rounded-xl text-left transition shadow-2xs hover:shadow-xs"
            >
              <span className="text-xs font-bold text-slate-900 block">⚖️ Direito & Humanas</span>
              <span className="text-[10px] text-slate-500 block leading-tight mt-0.5">História, Redação e Humanas (Peso 5)</span>
            </button>

            <button
              type="button"
              onClick={() => applyFocusPreset('exatas')}
              className="p-2.5 bg-white hover:bg-amber-100/60 border border-amber-200 rounded-xl text-left transition shadow-2xs hover:shadow-xs"
            >
              <span className="text-xs font-bold text-slate-900 block">💻 Engenharias & Exatas</span>
              <span className="text-[10px] text-slate-500 block leading-tight mt-0.5">Matemática e Física (Peso 5)</span>
            </button>

            <button
              type="button"
              onClick={() => applyFocusPreset('enem_equilibrado')}
              className="p-2.5 bg-white hover:bg-amber-100/60 border border-amber-200 rounded-xl text-left transition shadow-2xs hover:shadow-xs"
            >
              <span className="text-xs font-bold text-slate-900 block">📊 ENEM Equilibrado</span>
              <span className="text-[10px] text-slate-500 block leading-tight mt-0.5">Todas Disciplinas em Peso Médio (3)</span>
            </button>
          </div>
        </div>
      )}

      {/* SUB-TAB 1: ROTEIRO DE HOJE (TIMELINE) */}
      {activeSubTab === 'timeline' && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            {/* Day Selector */}
            <div className="space-y-1">
              <label className="text-[11px] font-extrabold text-slate-700 uppercase block">
                Dia do Ciclo:
              </label>
              <select
                value={selectedDayKey}
                onChange={(e) => setSelectedDayKey(e.target.value as any)}
                className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500"
              >
                <option value="segunda">Segunda-feira (Escola)</option>
                <option value="terca">Terça-feira (Escola)</option>
                <option value="quarta">Quarta-feira (Escola)</option>
                <option value="quinta">Quinta-feira (Escola)</option>
                <option value="sexta">Sexta-feira (Escola)</option>
                <option value="sabado">Sábado (Livre / Simulado)</option>
                <option value="domingo">Domingo (Livre / Redação)</option>
              </select>
            </div>

            {/* Start Time */}
            <div className="space-y-1">
              <label className="text-[11px] font-extrabold text-slate-700 uppercase block">
                Início em Casa:
              </label>
              <input
                type="time"
                value={homeStartTime}
                onChange={(e) => setHomeStartTime(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-800"
              />
            </div>

            {/* Block Duration */}
            <div className="space-y-1">
              <label className="text-[11px] font-extrabold text-slate-700 uppercase block">
                Bloco de Foco:
              </label>
              <select
                value={blockDuration}
                onChange={(e) => setBlockDuration(Number(e.target.value))}
                className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-800"
              >
                <option value={45}>45 minutos (Sugerido)</option>
                <option value={50}>50 minutos (Pomodoro Padrão)</option>
                <option value={60}>60 minutos (Aprofundado)</option>
              </select>
            </div>

            {/* Daily Questions Goal */}
            <div className="space-y-1">
              <label className="text-[11px] font-extrabold text-slate-700 uppercase block">
                Meta Questões/Dia:
              </label>
              <select
                value={dailyQuestionsTarget}
                onChange={(e) => setDailyQuestionsTarget(Number(e.target.value))}
                className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-800"
              >
                <option value={15}>15 questões / dia</option>
                <option value={20}>20 questões / dia (Recomendado)</option>
                <option value={25}>25 questões / dia (Alta performance)</option>
              </select>
            </div>
          </div>

          {/* Neurolearning Guidelines Banner */}
          <div className="p-4 bg-gradient-to-r from-amber-50 via-indigo-50 to-emerald-50 border border-slate-200 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start space-x-3">
              <Brain className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-800 space-y-0.5">
                <span className="font-extrabold text-indigo-950 uppercase tracking-wide block">
                  Regras de Neuroaprendizagem Aplicadas:
                </span>
                <p className="text-slate-600 leading-snug">
                  • Alternância de blocos entre Exatas/Raciocínio e Humanas/Linguagens.<br />
                  • Blocos de {blockDuration}m de foco total + {breakDuration}m de pausa para sinapses.<br />
                  • Bloco final diário de {spacedRevisionMins}m para Revisão Espaçada acumulada.
                </p>
              </div>
            </div>

            <div className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-center shrink-0 w-full md:w-auto shadow-xs">
              <span className="text-[10px] font-extrabold text-slate-500 uppercase block">
                Questões Concluídas Hoje
              </span>
              <span className="text-lg font-black text-emerald-600 font-mono">
                {dailyQuestionsSolvedCount} / {dailyQuestionsTarget}
              </span>
            </div>
          </div>

          {/* Timeline Execution List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider block">
                Roteiro Sequencial de Estudos ({currentCycleSteps.length} Etapas):
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                {isWeekend ? ' Modo Fim de Semana (3 a 4 matérias)' : ' Modo Dia Letivo (2 a 3 matérias)'}
              </span>
            </div>

            <div className="space-y-3 relative before:absolute before:inset-0 before:left-5 before:w-0.5 before:bg-slate-200">
              {currentCycleSteps.map((step, idx) => {
                const isDone = completedCycleIds.includes(step.id);
                const isPause = step.type === 'pausa';

                return (
                  <div
                    key={step.id}
                    className={`relative pl-12 p-4 rounded-2xl border transition ${
                      isPause
                        ? 'bg-slate-50 border-slate-200 border-dashed'
                        : isDone
                        ? 'bg-emerald-50/60 border-emerald-200 opacity-80'
                        : 'bg-white border-slate-200 hover:border-indigo-300 shadow-xs'
                    }`}
                  >
                    {/* Badge Number */}
                    <div
                      className={`absolute left-2.5 top-4 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black border transition ${
                        isPause
                          ? 'bg-slate-200 text-slate-600 border-slate-300'
                          : isDone
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-indigo-600 text-white border-indigo-600'
                      }`}
                    >
                      {isPause ? '☕' : isDone ? '✓' : idx + 1}
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-black text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200 font-mono">
                            🕒 {step.timeSlot}
                          </span>

                          <span className="text-xs font-extrabold text-slate-900">
                            {step.title}
                          </span>

                          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                            step.brainHemisphere === 'Exatas/Raciocínio' ? 'bg-sky-100 text-sky-800' :
                            step.brainHemisphere === 'Humanas/Linguagens' ? 'bg-amber-100 text-amber-800' :
                            'bg-slate-100 text-slate-700'
                          }`}>
                            {step.brainHemisphere}
                          </span>

                          {step.targetQuestions > 0 && (
                            <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200">
                              🎯 ~{step.targetQuestions} questões
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed">
                          {step.description}
                        </p>
                      </div>

                      {!isPause && (
                        <button
                          type="button"
                          onClick={() => handleMarkStepCompleted(step)}
                          disabled={isDone}
                          className={`shrink-0 text-xs font-extrabold px-4 py-2 rounded-xl transition flex items-center space-x-1.5 ${
                            isDone
                              ? 'bg-emerald-100 text-emerald-800 cursor-default'
                              : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                          }`}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>{isDone ? 'Concluído' : 'Concluir Bloco'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: AGENDA DA SEMANA (WEEKLY CALENDAR AGENDA GRID) */}
      {activeSubTab === 'weekly_agenda' && (
        <div className="space-y-6">
          <div className="p-4 bg-indigo-50/80 border border-indigo-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-indigo-600 shrink-0" />
              <div>
                <h4 className="text-xs font-black text-indigo-950 uppercase tracking-wide">
                  Agenda de Estudos da Semana Completa (Segunda a Domingo)
                </h4>
                <p className="text-xs text-slate-600">
                  Visualização da distribuição dos blocos diários de estudo, com horários e metas de questões.
                </p>
              </div>
            </div>

            <button
              onClick={onOpenTimetableModal}
              className="bg-white hover:bg-slate-50 text-indigo-700 border border-indigo-300 font-extrabold text-xs px-3.5 py-1.5 rounded-xl transition flex items-center space-x-1.5 shrink-0"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Ajustar Horário da Escola</span>
            </button>
          </div>

          {/* 7-DAY CALENDAR GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-3">
            {fullWeeklyCycle.map((day) => {
              const isSelected = selectedDayKey === day.key;

              return (
                <div
                  key={day.key}
                  onClick={() => {
                    setSelectedDayKey(day.key);
                    setActiveSubTab('timeline');
                  }}
                  className={`p-3.5 rounded-2xl border transition cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-indigo-50/90 border-indigo-400 ring-2 ring-indigo-500/20 shadow-sm'
                      : 'bg-slate-50 hover:bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="pb-2 border-b border-slate-200/80 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-black text-slate-900 block">{day.label}</span>
                        <span className="text-[9px] font-extrabold text-indigo-600 uppercase">{day.sub}</span>
                      </div>
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-indigo-600" />
                      )}
                    </div>

                    <div className="space-y-1.5">
                      {day.steps.filter(s => s.type !== 'pausa').map((s, idx) => (
                        <div
                          key={s.id}
                          className="p-1.5 bg-white rounded-lg border border-slate-200 text-[10px] space-y-0.5 shadow-2xs"
                        >
                          <span className="font-bold text-indigo-900 font-mono block">
                            {s.timeSlot.split(' - ')[0]}
                          </span>
                          <span className="font-extrabold text-slate-800 line-clamp-1 block">
                            {s.title}
                          </span>
                          {s.targetQuestions > 0 && (
                            <span className="text-[9px] text-emerald-700 font-bold block">
                              🎯 ~{s.targetQuestions} q.
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-200 text-center">
                    <span className="text-[10px] text-indigo-600 font-extrabold hover:underline block">
                      Ver Roteiro do Dia →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: GRÁFICO CIRCULAR / DONUT CHART */}
      {activeSubTab === 'donut_chart' && (
        <div className="space-y-6">
          <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-2xl flex items-center space-x-3">
            <PieChart className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <h4 className="text-xs font-black text-amber-950 uppercase tracking-wide">
                Distribuição da Carga Horária Semanal por Área de Conhecimento
              </h4>
              <p className="text-xs text-amber-900">
                Gráfico circular proporcional baseado nos pesos de dificuldade atribuídos a cada disciplina.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center bg-slate-50 p-6 rounded-3xl border border-slate-200">
            {/* Donut Chart Visual */}
            {renderDonutSlices()}

            {/* Breakdown Legend */}
            <div className="space-y-3">
              <h5 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                Detalhamento Semanal por Área:
              </h5>

              <div className="space-y-2">
                {Object.entries(categoryMins).map(([cat, data]) => {
                  if (data.mins <= 0) return null;
                  const pct = ((data.mins / Math.max(1, totalMins)) * 100).toFixed(1);
                  const hrs = (data.mins / 60).toFixed(1);

                  return (
                    <div
                      key={cat}
                      className="p-3 bg-white rounded-2xl border border-slate-200 flex items-center justify-between gap-3 shadow-2xs"
                    >
                      <div className="flex items-center space-x-2.5">
                        <span
                          className="w-3.5 h-3.5 rounded-full shrink-0"
                          style={{ backgroundColor: data.color }}
                        />
                        <div>
                          <span className="text-xs font-extrabold text-slate-900 block">{cat}</span>
                          <span className="text-[10px] text-slate-500 font-medium block">
                            {data.subjects.join(', ') || 'Geral'}
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs font-black text-slate-900 font-mono block">
                          {hrs} horas ({pct}%)
                        </span>
                        <span className="text-[10px] font-bold text-indigo-600 block">
                          ~{Math.round((data.mins / 50) * 15)} questões/sem
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: PERSONALIZAR PESOS DE DIFICULDADE & MATÉRIAS */}
      {activeSubTab === 'customizer' && (
        <div className="space-y-6">
          <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sliders className="w-5 h-5 text-amber-600" />
                <h4 className="text-xs font-extrabold text-amber-950 uppercase tracking-wide">
                  🎯 Personalização Total do Foco: Matérias e Pesos de Dificuldade
                </h4>
              </div>

              <span className="text-xs font-bold bg-amber-200/70 text-amber-950 px-3 py-1 rounded-full border border-amber-300">
                {selectedSubjectIds.length} de {subjects.length} matérias ativas no ciclo
              </span>
            </div>

            <p className="text-xs text-amber-900 leading-relaxed">
              Marque quais matérias entram no seu ciclo de estudos e atribua um peso de 1 a 5 baseado na sua <strong>dificuldade pessoal</strong> (1 = Fácil / Pouca Carga, 5 = Dificuldade Máxima / Foco Crítico). O algoritmo inteligente ajustará a frequência semanal de blocos de forma proporcional.
            </p>

            {/* Quick Bulk Selection Controls */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-amber-200/60">
              <span className="text-[11px] font-bold text-amber-950">Atalhos de Seleção:</span>
              <button
                type="button"
                onClick={handleSelectAllSubjects}
                className="px-2.5 py-1 text-[11px] font-bold bg-white text-slate-800 border border-amber-300 rounded-lg hover:bg-amber-100/50 transition"
              >
                Todas as Matérias
              </button>
              <button
                type="button"
                onClick={() => handleSelectCategorySubjects('Exatas')}
                className="px-2.5 py-1 text-[11px] font-bold bg-white text-slate-800 border border-amber-300 rounded-lg hover:bg-amber-100/50 transition"
              >
                + Apenas Exatas
              </button>
              <button
                type="button"
                onClick={() => handleSelectCategorySubjects('Humanas')}
                className="px-2.5 py-1 text-[11px] font-bold bg-white text-slate-800 border border-amber-300 rounded-lg hover:bg-amber-100/50 transition"
              >
                + Apenas Humanas
              </button>
              <button
                type="button"
                onClick={() => handleSelectCategorySubjects('Biológicas')}
                className="px-2.5 py-1 text-[11px] font-bold bg-white text-slate-800 border border-amber-300 rounded-lg hover:bg-amber-100/50 transition"
              >
                + Apenas Biológicas
              </button>
              <button
                type="button"
                onClick={handleDeselectAllSubjects}
                className="px-2.5 py-1 text-[11px] font-bold bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100 transition"
              >
                Limpar Seleção
              </button>
            </div>
          </div>

          {/* Subjects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {subjects.map((sub) => {
              const weight = subjectWeights[sub.id] || 3;
              const isSelected = selectedSubjectIds.includes(sub.id);

              const totalActiveWeightSum = selectedSubjectIds.reduce(
                (acc, id) => acc + (subjectWeights[id] || 3),
                0
              );
              const sharePct = isSelected
                ? Math.round((weight / Math.max(1, totalActiveWeightSum)) * 100)
                : 0;

              return (
                <div
                  key={sub.id}
                  className={`p-4 rounded-2xl border transition space-y-3 ${
                    isSelected
                      ? 'bg-white border-slate-200 shadow-xs'
                      : 'bg-slate-50 border-slate-200 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSubjectSelection(sub.id)}
                        className="w-4 h-4 rounded text-indigo-600 accent-indigo-600 cursor-pointer"
                      />
                      <span
                        className="w-3.5 h-3.5 rounded-full shrink-0"
                        style={{ backgroundColor: sub.color || '#6366f1' }}
                      />
                      <span className="text-xs font-extrabold text-slate-900">{sub.name}</span>
                    </div>

                    <div className="flex items-center space-x-1.5">
                      {isSelected && (
                        <span className="text-[10px] font-black text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                          ~{sharePct}% do Ciclo
                        </span>
                      )}
                      <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200">
                        {sub.category}
                      </span>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <div className="flex items-center justify-between text-[11px] font-bold">
                        <span className="text-slate-600">Dificuldade / Peso:</span>
                        <span className="text-indigo-600 font-black">
                          {weight === 1 ? '1 - Muito Fácil' :
                           weight === 2 ? '2 - Fácil' :
                           weight === 3 ? '3 - Médio' :
                           weight === 4 ? '4 - Dificuldade Alta' :
                           '5 - Dificuldade Máxima (Foco Crítico)'}
                        </span>
                      </div>

                      <div className="flex items-center space-x-1.5">
                        {[1, 2, 3, 4, 5].map((w) => (
                          <button
                            key={w}
                            type="button"
                            onClick={() => handleWeightChange(sub.id, w)}
                            className={`flex-1 py-1.5 text-xs font-black rounded-xl transition border ${
                              weight === w
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {w}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Action Bar */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div className="text-xs text-slate-600">
              Ao aplicar, seu ciclo será automaticamente atualizado com as matérias e pesos configurados acima.
            </div>

            <button
              type="button"
              onClick={() => {
                setCycleMode('custom_weights');
                setActiveSubTab('weekly_agenda');
              }}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center space-x-2"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-200" />
              <span>⚡ Gerar & Aplicar Ciclo Personalizado</span>
            </button>
          </div>
        </div>
      )}

      {/* INTERACTIVE WIZARD MODAL (ASSISTENTE DE MONTAGEM DE CICLO) */}
      {isWizardOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-2xl w-full p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Wizard Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-gradient-to-tr from-amber-500 to-indigo-600 text-white rounded-2xl shadow-sm">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 font-display flex items-center space-x-2">
                    <span>Assistente de Montagem de Ciclo Inteligente</span>
                    <span className="text-[10px] bg-indigo-100 text-indigo-800 font-black px-2 py-0.5 rounded-full">
                      Passo {wizardStep} de 3
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Responda ao questionário para a IA calibrar seu ciclo de estudos de alta performance.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsWizardOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* STEP 1: TIME & SCHEDULE */}
            {wizardStep === 1 && (
              <div className="space-y-4 animate-in fade-in">
                <div className="p-3.5 bg-indigo-50 border border-indigo-200 rounded-2xl space-y-1">
                  <span className="text-xs font-black text-indigo-950 uppercase tracking-wide block">
                    Passo 1: Horários & Disponibilidade Diária
                  </span>
                  <p className="text-xs text-slate-600">
                    Defina o horário de início dos estudos em casa após as aulas da escola e a duração dos blocos.
                  </p>
                </div>

                <div className="space-y-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <div className="space-y-1">
                    <label className="text-xs font-extrabold text-slate-700 block">
                      Horário de início dos estudos em casa (pós-escola / pós-almoço):
                    </label>
                    <input
                      type="time"
                      value={homeStartTime}
                      onChange={(e) => setHomeStartTime(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-extrabold text-slate-700 block">
                        Duração do Bloco Pomodoro:
                      </label>
                      <select
                        value={blockDuration}
                        onChange={(e) => setBlockDuration(Number(e.target.value))}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                      >
                        <option value={45}>45 minutos (Sugerido)</option>
                        <option value={50}>50 minutos (Pomodoro Padrão)</option>
                        <option value={60}>60 minutos (Aprofundado)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-extrabold text-slate-700 block">
                        Pausa Entre Blocos:
                      </label>
                      <select
                        value={breakDuration}
                        onChange={(e) => setBreakDuration(Number(e.target.value))}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                      >
                        <option value={10}>10 minutos (Ideal)</option>
                        <option value={15}>15 minutos</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: DIFFICULTY WEIGHTS */}
            {wizardStep === 2 && (
              <div className="space-y-4 animate-in fade-in">
                <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl space-y-1">
                  <span className="text-xs font-black text-amber-950 uppercase tracking-wide block">
                    Passo 2: Pesos de Dificuldade (1 = Fácil, 5 = Dificuldade Alta)
                  </span>
                  <p className="text-xs text-slate-600">
                    Atribua peso 5 para suas matérias críticas do ENEM. O algoritmo dará mais horários para elas.
                  </p>
                </div>

                <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                  {subjects.map((sub) => {
                    const weight = subjectWeights[sub.id] || 3;
                    return (
                      <div
                        key={sub.id}
                        className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-3"
                      >
                        <span className="text-xs font-extrabold text-slate-900">{sub.name}</span>

                        <div className="flex items-center space-x-1">
                          {[1, 2, 3, 4, 5].map((w) => (
                            <button
                              key={w}
                              type="button"
                              onClick={() => handleWeightChange(sub.id, w)}
                              className={`w-7 h-7 text-xs font-black rounded-lg transition ${
                                weight === w
                                  ? 'bg-amber-500 text-white shadow-xs'
                                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              {w}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 3: QUESTIONS & NEUROLOGY GOALS */}
            {wizardStep === 3 && (
              <div className="space-y-4 animate-in fade-in">
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-1">
                  <span className="text-xs font-black text-emerald-950 uppercase tracking-wide block">
                    Passo 3: Metas de Questões e Modo de Sincronização
                  </span>
                  <p className="text-xs text-slate-600">
                    Defina se deseja priorizar o acompanhamento das aulas da escola ou focar no ciclo de dificuldade.
                  </p>
                </div>

                <div className="space-y-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <div className="space-y-2">
                    <label className="text-xs font-extrabold text-slate-700 block">
                      Escolha o Modo Principal do Ciclo:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setCycleMode('today_school')}
                        className={`p-3 rounded-xl text-left border text-xs font-bold transition ${
                          cycleMode === 'today_school'
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'bg-white text-slate-700 border-slate-200'
                        }`}
                      >
                        📚 Sincronizado com Aulas da Escola
                      </button>
                      <button
                        type="button"
                        onClick={() => setCycleMode('custom_weights')}
                        className={`p-3 rounded-xl text-left border text-xs font-bold transition ${
                          cycleMode === 'custom_weights'
                            ? 'bg-amber-600 text-white border-amber-600'
                            : 'bg-white text-slate-700 border-slate-200'
                        }`}
                      >
                        🎯 Ciclo por Dificuldade (Pesos)
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-extrabold text-slate-700 block">
                      Meta Diária de Questões Solucionadas:
                    </label>
                    <select
                      value={dailyQuestionsTarget}
                      onChange={(e) => setDailyQuestionsTarget(Number(e.target.value))}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                    >
                      <option value={15}>15 questões / dia</option>
                      <option value={20}>20 questões / dia (Recomendado)</option>
                      <option value={25}>25 questões / dia (Alta performance)</option>
                      <option value={30}>30 questões / dia (Intensivo)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Wizard Navigation Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              {wizardStep > 1 ? (
                <button
                  type="button"
                  onClick={() => setWizardStep(prev => prev - 1)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition flex items-center space-x-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Anterior</span>
                </button>
              ) : <div />}

              {wizardStep < 3 ? (
                <button
                  type="button"
                  onClick={() => setWizardStep(prev => prev + 1)}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold rounded-xl transition flex items-center space-x-1 shadow-xs"
                >
                  <span>Próximo Passo</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setIsWizardOpen(false);
                    setActiveSubTab('weekly_agenda');
                  }}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-xl transition flex items-center space-x-2 shadow-md"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Gerar Ciclo Inteligente</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
