import React, { useState } from 'react';
import { Subject, StudentTaskItem } from '../types';
import { buildGoogleCalendarUrl, createGoogleCalendarApiEvent } from '../lib/googleCalendar';
import { Plus, Calendar as CalendarIcon, Clock, AlertCircle, CheckCircle2, X, Sparkles, BookOpen, ExternalLink, Tag, ShieldCheck } from 'lucide-react';

interface QuickAddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjects: Subject[];
  onAddTask: (task: StudentTaskItem) => void;
  googleAccessToken?: string | null;
}

export const QuickAddTaskModal: React.FC<QuickAddTaskModalProps> = ({
  isOpen,
  onClose,
  subjects,
  onAddTask,
  googleAccessToken
}) => {
  const [taskTitle, setTaskTitle] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(subjects[0]?.id || '');
  const [taskType, setTaskType] = useState<StudentTaskItem['type']>('prova');
  const [taskDate, setTaskDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [taskTime, setTaskTime] = useState<string>('09:00');
  const [taskPriority, setTaskPriority] = useState<StudentTaskItem['priority']>('alta');
  const [taskNotes, setTaskNotes] = useState('');
  const [syncGoogleCalendar, setSyncGoogleCalendar] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const activeSubjects = (subjects || []).filter(s => s.enabled !== false);
  const selectedSubject = (subjects || []).find(s => s.id === selectedSubjectId) || activeSubjects[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    setIsSubmitting(true);

    const newTask: StudentTaskItem = {
      id: `task-${Date.now()}`,
      subjectId: selectedSubjectId || activeSubjects[0]?.id || 'general',
      title: taskTitle.trim(),
      type: taskType,
      date: taskDate,
      time: taskTime,
      priority: taskPriority,
      completed: false,
      notes: taskNotes.trim(),
      syncedCalendar: syncGoogleCalendar,
      source: 'manual'
    };

    let calendarApiSuccess = false;

    if (syncGoogleCalendar) {
      if (googleAccessToken) {
        const res = await createGoogleCalendarApiEvent(newTask, selectedSubject?.name || 'Escola', googleAccessToken);
        if (res.success) {
          calendarApiSuccess = true;
        }
      }

      // If no token or as direct fallback, open Google Calendar web template link in new tab if user wants
      if (!calendarApiSuccess) {
        const calUrl = buildGoogleCalendarUrl(newTask, selectedSubject?.name);
        window.open(calUrl, '_blank');
      }
    }

    onAddTask(newTask);
    setIsSubmitting(false);
    setSuccessMsg('Compromisso/Lembrete adicionado com sucesso!');

    setTimeout(() => {
      setSuccessMsg('');
      onClose();
      // Reset form
      setTaskTitle('');
      setTaskNotes('');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-indigo-100 border border-indigo-200 rounded-2xl">
              <CalendarIcon className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 font-display flex items-center space-x-2">
                <span>Adicionar Rápido</span>
                <span className="bg-indigo-100 text-indigo-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                  Provas & Trabalhos
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Lembretes rápidos com envio direto para o Google Agenda.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {successMsg ? (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center space-x-2 animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Type selector pills */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">Tipo de Compromisso:</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'prova', label: '📝 Prova', color: 'bg-rose-100 text-rose-800 border-rose-300' },
                  { id: 'trabalho', label: '📂 Trabalho', color: 'bg-indigo-100 text-indigo-800 border-indigo-300' },
                  { id: 'tarefa', label: '✏️ Tarefa', color: 'bg-amber-100 text-amber-800 border-amber-300' },
                  { id: 'lembrete', label: '🔔 Lembrete', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' }
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTaskType(t.id as any)}
                    className={`py-2 px-2.5 rounded-xl border text-xs font-bold transition text-center ${
                      taskType === t.id
                        ? `${t.color} font-extrabold shadow-2xs`
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Título do Lembrete / Conteúdo *</label>
              <input
                type="text"
                required
                placeholder="Ex: Prova Bimestral de Geometria ou Entrega do Trabalho de Física"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
            </div>

            {/* Subject and Priority */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Matéria Relacionada:</label>
                <select
                  value={selectedSubjectId}
                  onChange={(e) => setSelectedSubjectId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-indigo-500"
                >
                  {activeSubjects.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name} ({sub.category})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Prioridade:</label>
                <select
                  value={taskPriority}
                  onChange={(e) => setTaskPriority(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="alta">🔴 Alta (Urgente / Peso Alto)</option>
                  <option value="media">🟡 Média (Normal)</option>
                  <option value="normal">🟢 Baixa (Apenas Acompanhamento)</option>
                </select>
              </div>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Data da Entrega / Exame:</label>
                <input
                  type="date"
                  required
                  value={taskDate}
                  onChange={(e) => setTaskDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Horário Previsto:</label>
                <input
                  type="time"
                  value={taskTime}
                  onChange={(e) => setTaskTime(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800"
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Observações ou Regras (Opcional):</label>
              <textarea
                value={taskNotes}
                onChange={(e) => setTaskNotes(e.target.value)}
                rows={2}
                placeholder="Ex: Levar régua e calculadora científica; vale 2,0 pontos de nota atitudinal."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Google Calendar Sync Option */}
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <CalendarIcon className="w-5 h-5 text-blue-600 shrink-0" />
                <div>
                  <span className="text-xs font-bold text-blue-900 block">
                    Sincronizar no Google Agenda
                  </span>
                  <span className="text-[10px] text-blue-700">
                    Cria o evento e gera alertas automaticos 1 dia antes da data.
                  </span>
                </div>
              </div>

              <input
                type="checkbox"
                checked={syncGoogleCalendar}
                onChange={(e) => setSyncGoogleCalendar(e.target.checked)}
                className="w-5 h-5 text-blue-600 rounded-md border-slate-300 focus:ring-blue-500 cursor-pointer"
              />
            </div>

            {/* Submit Actions */}
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow transition flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Cadastrar e Agendar no Sistema</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
