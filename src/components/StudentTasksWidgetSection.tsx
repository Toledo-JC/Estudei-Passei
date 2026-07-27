import React, { useState } from 'react';
import { Subject, StudentTaskItem } from '../types';
import { buildGoogleCalendarUrl } from '../lib/googleCalendar';
import { Calendar, Plus, CheckCircle2, Clock, AlertCircle, Trash2, ExternalLink, MessageSquare, Sparkles, Filter, CheckSquare, Square, Tag } from 'lucide-react';

interface StudentTasksWidgetSectionProps {
  tasks: StudentTaskItem[];
  subjects: Subject[];
  onToggleCompleted: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onOpenQuickTaskModal: () => void;
  onOpenSchoolPlatformsModal: () => void;
}

export const StudentTasksWidgetSection: React.FC<StudentTasksWidgetSectionProps> = ({
  tasks,
  subjects,
  onToggleCompleted,
  onDeleteTask,
  onOpenQuickTaskModal,
  onOpenSchoolPlatformsModal
}) => {
  const [filterType, setFilterType] = useState<string>('all');

  const filteredTasks = tasks.filter((t) => {
    if (filterType === 'all') return true;
    if (filterType === 'pending') return !t.completed;
    if (filterType === 'completed') return t.completed;
    return t.type === filterType;
  });

  const pendingCount = tasks.filter(t => !t.completed).length;

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-indigo-100 border border-indigo-200 rounded-2xl">
            <Calendar className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900 font-display flex items-center space-x-2">
              <span>Agenda Rápida do Estudante & Lembretes</span>
              {pendingCount > 0 && (
                <span className="bg-rose-100 text-rose-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-rose-300">
                  {pendingCount} Pendentes
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-500">
              Acompanhe provas, trabalhos do MS Teams e tarefas com lembretes no Google Agenda.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={onOpenQuickTaskModal}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-xs transition flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4 text-amber-300" />
            <span>+ Adicionar Rápido</span>
          </button>

          <button
            onClick={onOpenSchoolPlatformsModal}
            className="bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 text-xs font-bold px-3.5 py-2 rounded-xl transition flex items-center space-x-1.5"
          >
            <MessageSquare className="w-4 h-4 text-purple-600" />
            <span>MS Teams / Mural</span>
          </button>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap items-center gap-1.5">
        {[
          { id: 'all', label: 'Todas' },
          { id: 'pending', label: '⏳ Pendentes' },
          { id: 'prova', label: '📝 Provas' },
          { id: 'trabalho', label: '📂 Trabalhos (Teams)' },
          { id: 'tarefa', label: '✏️ Tarefas' },
          { id: 'completed', label: '✅ Concluídas' }
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilterType(f.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              filterType === f.id
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Tasks List */}
      {filteredTasks.length === 0 ? (
        <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-200 rounded-2xl space-y-2">
          <Calendar className="w-8 h-8 text-slate-300 mx-auto" />
          <p className="text-xs font-bold text-slate-600">Nenhum compromisso encontrado neste filtro.</p>
          <p className="text-[11px] text-slate-400">Clique em "+ Adicionar Rápido" para agendar uma prova ou trabalho.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredTasks.map((task) => {
            const subject = subjects.find(s => s.id === task.subjectId);
            const calUrl = buildGoogleCalendarUrl(task, subject?.name);

            return (
              <div
                key={task.id}
                className={`p-3.5 rounded-2xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  task.completed
                    ? 'bg-slate-50 border-slate-200 opacity-60'
                    : task.priority === 'alta'
                    ? 'bg-rose-50/50 border-rose-200'
                    : 'bg-white border-slate-200 hover:border-indigo-300'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <button
                    onClick={() => onToggleCompleted(task.id)}
                    className="mt-0.5 text-slate-400 hover:text-indigo-600 transition"
                  >
                    {task.completed ? (
                      <CheckSquare className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <Square className="w-5 h-5" />
                    )}
                  </button>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-xs font-bold ${task.completed ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                        {task.title}
                      </span>

                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                        task.type === 'prova' ? 'bg-rose-100 text-rose-800' :
                        task.type === 'trabalho' ? 'bg-indigo-100 text-indigo-800' :
                        task.type === 'tarefa' ? 'bg-amber-100 text-amber-800' :
                        'bg-emerald-100 text-emerald-800'
                      }`}>
                        {task.type.toUpperCase()}
                      </span>

                      {task.source === 'msteams' && (
                        <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded-md flex items-center space-x-1">
                          <MessageSquare className="w-3 h-3 text-purple-600" />
                          <span>MS Teams</span>
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                      <span className="font-semibold text-slate-700">
                        📚 {subject?.name || 'Escola'}
                      </span>
                      <span>📅 {task.date}</span>
                      {task.time && <span>⏰ {task.time}</span>}
                      {task.priority === 'alta' && (
                        <span className="text-rose-600 font-bold">🔴 Prioridade Alta</span>
                      )}
                    </div>

                    {task.notes && (
                      <p className="text-[11px] text-slate-600 bg-slate-100/70 px-2.5 py-1 rounded-lg italic">
                        "{task.notes}"
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2 self-end sm:self-center shrink-0">
                  <a
                    href={calUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-[11px] font-bold px-3 py-1.5 rounded-xl transition flex items-center space-x-1"
                    title="Abrir no Google Agenda"
                  >
                    <Calendar className="w-3.5 h-3.5 text-blue-600" />
                    <span>Google Agenda</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  <button
                    onClick={() => onDeleteTask(task.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                    title="Excluir Lembrete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
