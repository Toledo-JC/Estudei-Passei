import React, { useState, useRef } from 'react';
import { Subject, SchoolTimetable, DaySchoolSchedule, SchoolPeriodItem } from '../types';
import { Clock, Calendar, Plus, Trash2, CheckCircle2, X, RotateCcw, AlertCircle, Edit3, ArrowRight, Sparkles, Upload, FileText, Camera, Loader2 } from 'lucide-react';

interface SchoolTimetableModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjects: Subject[];
  timetable: SchoolTimetable;
  onUpdateTimetable: (updated: SchoolTimetable) => void;
}

export const SchoolTimetableModal: React.FC<SchoolTimetableModalProps> = ({
  isOpen,
  onClose,
  subjects,
  timetable,
  onUpdateTimetable
}) => {
  const [activeDayKey, setActiveDayKey] = useState<'segunda' | 'terca' | 'quarta' | 'quinta' | 'sexta'>('segunda');
  const [localTimetable, setLocalTimetable] = useState<SchoolTimetable>(timetable);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // AI Timetable OCR State
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [aiErrorMessage, setAiErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const enabledSubjects = subjects.filter(s => s.enabled !== false);
  const currentDayData = localTimetable.find(d => d.dayKey === activeDayKey) || {
    dayKey: activeDayKey,
    dayName: activeDayKey.toUpperCase(),
    periods: []
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsAiProcessing(true);
    setAiErrorMessage(null);

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64String = reader.result as string;

        const response = await fetch('/api/ai/parse-timetable', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageBase64: base64String,
            subjects: enabledSubjects
          })
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || 'Falha ao processar arquivo da grade escolar com IA.');
        }

        const data = await response.json();
        if (data.timetable && Array.isArray(data.timetable) && data.timetable.length > 0) {
          setLocalTimetable(data.timetable);
          setSaveSuccess(true);
          setTimeout(() => setSaveSuccess(false), 3000);
        } else {
          throw new Error('Nenhum horário identificado no arquivo enviado.');
        }
      };

      reader.readAsDataURL(file);
    } catch (err: any) {
      console.error('Erro ao digitalizar grade:', err);
      setAiErrorMessage(err.message || 'Erro ao processar imagem ou PDF.');
    } finally {
      setIsAiProcessing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handlePeriodSubjectChange = (periodId: string, newSubjectId: string) => {
    const updated = localTimetable.map((day) => {
      if (day.dayKey === activeDayKey) {
        return {
          ...day,
          periods: day.periods.map((p) => (p.id === periodId ? { ...p, subjectId: newSubjectId } : p))
        };
      }
      return day;
    });
    setLocalTimetable(updated);
  };

  const handlePeriodTimeChange = (periodId: string, field: 'startTime' | 'endTime', value: string) => {
    const updated = localTimetable.map((day) => {
      if (day.dayKey === activeDayKey) {
        return {
          ...day,
          periods: day.periods.map((p) => (p.id === periodId ? { ...p, [field]: value } : p))
        };
      }
      return day;
    });
    setLocalTimetable(updated);
  };

  const handleAddPeriod = () => {
    const periodCount = currentDayData.periods.length + 1;
    const lastPeriod = currentDayData.periods[currentDayData.periods.length - 1];
    
    let defaultStart = '07:15';
    let defaultEnd = '08:00';

    if (lastPeriod) {
      defaultStart = lastPeriod.endTime;
      // Add 45 minutes approx
      const [h, m] = lastPeriod.endTime.split(':').map(Number);
      const endMins = h * 60 + m + 45;
      const endH = Math.floor(endMins / 60);
      const endM = endMins % 60;
      defaultEnd = `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;
    }

    const newPeriod: SchoolPeriodItem = {
      id: `period-${Date.now()}`,
      periodNumber: periodCount,
      startTime: defaultStart,
      endTime: defaultEnd,
      subjectId: enabledSubjects[0]?.id || 'matematica'
    };

    const updated = localTimetable.map((day) => {
      if (day.dayKey === activeDayKey) {
        return {
          ...day,
          periods: [...day.periods, newPeriod]
        };
      }
      return day;
    });

    setLocalTimetable(updated);
  };

  const handleDeletePeriod = (periodId: string) => {
    const updated = localTimetable.map((day) => {
      if (day.dayKey === activeDayKey) {
        return {
          ...day,
          periods: day.periods.filter(p => p.id !== periodId)
        };
      }
      return day;
    });
    setLocalTimetable(updated);
  };

  const handleSaveAll = () => {
    onUpdateTimetable(localTimetable);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 max-w-3xl w-full p-6 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-indigo-100 border border-indigo-200 rounded-2xl">
              <Clock className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 font-display flex items-center space-x-2">
                <span>Grade Horária de Aulas da Escola</span>
                <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-amber-300">
                  Horário Flexível + IA
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Configure manualmente ou envie uma foto/PDF da grade para a IA preencher automaticamente.
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

        {/* AI AUTO IMPORT BANNER */}
        <div className="p-4 bg-gradient-to-r from-indigo-50 via-purple-50 to-amber-50 border border-indigo-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-xs mt-0.5 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-indigo-950 uppercase tracking-wide flex items-center space-x-1.5">
                <span>Criar Grade Automática via Imagem ou PDF</span>
              </h4>
              <p className="text-xs text-slate-600 leading-snug mt-0.5">
                Tire uma foto do horário impresso da escola ou envie o arquivo PDF. A IA identificará os tempos e matérias!
              </p>
            </div>
          </div>

          <div className="shrink-0 w-full sm:w-auto">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*,application/pdf"
              className="hidden"
            />
            <button
              type="button"
              disabled={isAiProcessing}
              onClick={() => fileInputRef.current?.click()}
              className={`w-full sm:w-auto px-4 py-2.5 rounded-xl font-extrabold text-xs transition flex items-center justify-center space-x-2 shadow-xs ${
                isAiProcessing
                  ? 'bg-slate-300 text-slate-600 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              {isAiProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Digitalizando com IA...</span>
                </>
              ) : (
                <>
                  <Camera className="w-4 h-4 text-amber-300" />
                  <Upload className="w-3.5 h-3.5 text-white" />
                  <span>Enviar Foto / PDF da Grade</span>
                </>
              )}
            </button>
          </div>
        </div>

        {aiErrorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center space-x-2 text-xs font-bold text-rose-700">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{aiErrorMessage}</span>
          </div>
        )}

        {/* Days selector tab */}
        <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 overflow-x-auto">
          {[
            { key: 'segunda', label: 'Segunda' },
            { key: 'terca', label: 'Terça' },
            { key: 'quarta', label: 'Quarta' },
            { key: 'quinta', label: 'Quinta' },
            { key: 'sexta', label: 'Sexta' }
          ].map((d) => (
            <button
              key={d.key}
              type="button"
              onClick={() => setActiveDayKey(d.key as any)}
              className={`flex-1 min-w-[80px] py-2 text-xs font-bold rounded-xl transition ${
                activeDayKey === d.key
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>

        {/* Day Periods list */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
              Tempos de Aula - {currentDayData.dayName} ({currentDayData.periods.length} períodos)
            </span>

            <button
              onClick={handleAddPeriod}
              className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1.5 rounded-xl border border-indigo-200 transition flex items-center space-x-1"
            >
              <Plus className="w-4 h-4 text-indigo-600" />
              <span>+ Adicionar Tempo de Aula</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {currentDayData.periods.length === 0 ? (
              <div className="p-6 text-center bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
                <p className="text-xs font-bold text-slate-500">Nenhum horário cadastrado para este dia.</p>
                <button
                  onClick={handleAddPeriod}
                  className="mt-2 text-xs text-indigo-600 font-bold hover:underline"
                >
                  Clique para adicionar o 1º Tempo de Aula
                </button>
              </div>
            ) : (
              currentDayData.periods.map((period, idx) => {
                const selectedSub = subjects.find(s => s.id === period.subjectId);

                return (
                  <div
                    key={period.id}
                    className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-center space-x-3 shrink-0">
                      <span className="w-7 h-7 rounded-xl bg-slate-200 text-slate-700 font-black text-xs flex items-center justify-center">
                        {idx + 1}º
                      </span>

                      <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-700">
                        <input
                          type="time"
                          value={period.startTime}
                          onChange={(e) => handlePeriodTimeChange(period.id, 'startTime', e.target.value)}
                          className="bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500"
                        />
                        <span>às</span>
                        <input
                          type="time"
                          value={period.endTime}
                          onChange={(e) => handlePeriodTimeChange(period.id, 'endTime', e.target.value)}
                          className="bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>

                    <div className="flex-1 min-w-[200px]">
                      <select
                        value={period.subjectId}
                        onChange={(e) => handlePeriodSubjectChange(period.id, e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500"
                      >
                        {enabledSubjects.map((s) => (
                          <option key={s.id} value={s.id}>
                            📚 {s.name} ({s.teacherName || 'Prof. N/I'})
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      onClick={() => handleDeletePeriod(period.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition self-end sm:self-center"
                      title="Excluir Período"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {saveSuccess && (
          <p className="text-xs text-emerald-700 font-bold bg-emerald-50 p-3 rounded-xl border border-emerald-200 flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Grade horária escolar atualizada com sucesso!</span>
          </p>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <p className="text-[11px] text-slate-400">
            💡 Dica: Os ciclos de estudo de tarde são recalculados automaticamente com base nestes horários.
          </p>

          <button
            onClick={handleSaveAll}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow transition flex items-center space-x-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Salvar Grade Horária Escolar</span>
          </button>
        </div>
      </div>
    </div>
  );
};
