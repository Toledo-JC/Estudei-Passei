import React, { useState } from 'react';
import { Subject, StudySessionLog } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell, Legend } from 'recharts';
import { BarChart3, Clock, Flame, Calendar, Award, Info, Sparkles } from 'lucide-react';

interface WeeklyStudyChartProps {
  subjects: Subject[];
  studyLogs: StudySessionLog[];
  title?: string;
  subtitle?: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  'Exatas': '#4f46e5', // Indigo
  'Humanas': '#059669', // Emerald
  'Biológicas': '#d97706', // Amber
  'Linguagens': '#2563eb', // Blue
  'Redação': '#e11d48', // Rose
  'Formação Geral': '#7c3aed', // Purple
  'Itinerário': '#0891b2', // Cyan
};

const DAY_LABELS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export const WeeklyStudyChart: React.FC<WeeklyStudyChartProps> = ({
  subjects,
  studyLogs,
  title = 'Atividade de Estudos & Carga Horária por Matéria',
  subtitle = 'Acompanhe a distribuição de tempo dedicado a cada disciplina na semana.'
}) => {
  const [viewType, setViewType] = useState<'subject' | 'daily'>('subject');
  const [timeFilter, setTimeFilter] = useState<'7days' | 'all'>('7days');

  // Filter study logs by time
  const filteredLogs = React.useMemo(() => {
    if (timeFilter === 'all') return studyLogs;
    
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    return studyLogs.filter(log => {
      if (!log.date) return false;
      const logDate = new Date(log.date + 'T00:00:00');
      return logDate >= sevenDaysAgo;
    });
  }, [studyLogs, timeFilter]);

  // Aggregate by Subject
  const subjectChartData = React.useMemo(() => {
    const minutesMap: Record<string, number> = {};

    // Initialize map for all enabled subjects
    subjects.forEach(s => {
      if (s.enabled !== false) {
        minutesMap[s.id] = 0;
      }
    });

    filteredLogs.forEach(log => {
      if (minutesMap[log.subjectId] !== undefined) {
        minutesMap[log.subjectId] += log.minutes || 0;
      } else {
        minutesMap[log.subjectId] = log.minutes || 0;
      }
    });

    return subjects
      .filter(s => s.enabled !== false)
      .map(s => {
        const totalMin = minutesMap[s.id] || 0;
        const hours = parseFloat((totalMin / 60).toFixed(1));
        return {
          id: s.id,
          name: s.name.length > 14 ? `${s.name.slice(0, 12)}...` : s.name,
          fullName: s.name,
          category: s.category,
          minutes: totalMin,
          hours: hours,
          color: CATEGORY_COLORS[s.category] || s.color || '#6366f1'
        };
      })
      .sort((a, b) => b.minutes - a.minutes);
  }, [subjects, filteredLogs]);

  // Aggregate by Day of Week (Last 7 Days)
  const dailyChartData = React.useMemo(() => {
    const daysData: Array<{ day: string; dateStr: string; hours: number; minutes: number }> = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const dayNum = String(d.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${dayNum}`;
      const dayLabel = DAY_LABELS[d.getDay()];

      const dayLogs = studyLogs.filter(log => log.date === dateStr);
      const totalMin = dayLogs.reduce((acc, curr) => acc + (curr.minutes || 0), 0);

      daysData.push({
        day: `${dayLabel} (${dayNum}/${month})`,
        dateStr,
        hours: parseFloat((totalMin / 60).toFixed(1)),
        minutes: totalMin
      });
    }

    return daysData;
  }, [studyLogs]);

  // Stats calculation
  const totalMinutes = filteredLogs.reduce((acc, curr) => acc + (curr.minutes || 0), 0);
  const totalHours = (totalMinutes / 60).toFixed(1);
  
  const mostStudiedSubject = React.useMemo(() => {
    if (subjectChartData.length === 0) return null;
    const top = subjectChartData[0];
    return top && top.minutes > 0 ? top : null;
  }, [subjectChartData]);

  const activeDaysCount = React.useMemo(() => {
    return dailyChartData.filter(d => d.minutes > 0).length;
  }, [dailyChartData]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white p-3 rounded-xl border border-slate-700 shadow-xl text-xs space-y-1">
          <p className="font-bold text-indigo-300">{data.fullName || data.day}</p>
          {data.category && (
            <p className="text-[10px] text-slate-400">Categoria: {data.category}</p>
          )}
          <div className="flex items-center space-x-2 pt-1">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-mono font-extrabold text-amber-300">
              {data.hours}h ({data.minutes} minutos)
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-indigo-100 text-indigo-700 rounded-xl">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 font-display">
              {title}
            </h3>
          </div>
          <p className="text-xs text-slate-500">
            {subtitle}
          </p>
        </div>

        {/* View mode toggle & Time filter */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Time Filter Toggle */}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            <button
              onClick={() => setTimeFilter('7days')}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                timeFilter === '7days' ? 'bg-white text-indigo-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              7 Dias
            </button>
            <button
              onClick={() => setTimeFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                timeFilter === 'all' ? 'bg-white text-indigo-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Total
            </button>
          </div>

          {/* View Type Toggle */}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            <button
              onClick={() => setViewType('subject')}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                viewType === 'subject' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Por Matéria
            </button>
            <button
              onClick={() => setViewType('daily')}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                viewType === 'daily' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Evolução Diária
            </button>
          </div>
        </div>
      </div>

      {/* KPI Highlight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 bg-indigo-50/70 border border-indigo-100 rounded-2xl flex items-center space-x-3">
          <div className="p-2.5 bg-indigo-600 text-white rounded-xl shadow-xs">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-900/70 block">
              Tempo Total Estudado
            </span>
            <span className="text-lg font-black font-mono text-indigo-950">
              {totalHours} horas
            </span>
          </div>
        </div>

        <div className="p-3.5 bg-emerald-50/70 border border-emerald-100 rounded-2xl flex items-center space-x-3">
          <div className="p-2.5 bg-emerald-600 text-white rounded-xl shadow-xs">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-900/70 block">
              Foco Principal
            </span>
            <span className="text-xs font-bold text-emerald-950 truncate block max-w-[150px]">
              {mostStudiedSubject ? `${mostStudiedSubject.fullName} (${mostStudiedSubject.hours}h)` : 'Sem registros'}
            </span>
          </div>
        </div>

        <div className="p-3.5 bg-amber-50/70 border border-amber-100 rounded-2xl flex items-center space-x-3">
          <div className="p-2.5 bg-amber-500 text-slate-950 rounded-xl shadow-xs">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900/70 block">
              Dias Ativos na Semana
            </span>
            <span className="text-lg font-black font-mono text-amber-950">
              {activeDaysCount} de 7 dias
            </span>
          </div>
        </div>
      </div>

      {/* Main Bar Chart Container */}
      <div className="w-full h-72 pt-2">
        {totalMinutes === 0 ? (
          <div className="w-full h-full border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-6 text-center space-y-2 bg-slate-50/50">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-full">
              <Sparkles className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-800">Nenhum estudo registrado no período</h4>
            <p className="text-xs text-slate-500 max-w-sm">
              Inicie o cronômetro no painel ou registre sessões de estudo para ver o gráfico de barras preenchido automaticamente!
            </p>
          </div>
        ) : viewType === 'subject' ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={subjectChartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 25 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }}
                interval={0}
                angle={-15}
                textAnchor="end"
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#64748b' }}
                unit="h"
                allowDecimals={true}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="hours" radius={[8, 8, 0, 0]} maxBarSize={45}>
                {subjectChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={dailyChartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 25 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }}
                interval={0}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#64748b' }}
                unit="h"
                allowDecimals={true}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="hours" fill="#6366f1" radius={[8, 8, 0, 0]} maxBarSize={45}>
                {dailyChartData.map((entry, index) => (
                  <Cell
                    key={`cell-day-${index}`}
                    fill={entry.hours > 0 ? '#4f46e5' : '#cbd5e1'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Legend & Categories */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2 border-t border-slate-100 text-[11px] text-slate-600">
        {Object.entries(CATEGORY_COLORS).map(([category, color]) => (
          <div key={category} className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
            <span className="font-medium">{category}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
