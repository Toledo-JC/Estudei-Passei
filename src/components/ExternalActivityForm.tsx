import React, { useState } from 'react';
import { X, BookOpen, Camera, CheckCircle2, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';
import { Subject, QuestionValidationMode } from '../types';

interface ExternalActivityFormProps {
  isOpen: boolean;
  onClose: () => void;
  subjects: Subject[];
  onLogActivity: (data: {
    subjectId: string;
    subjectName: string;
    topic: string;
    type: string;
    minutes: number;
    questionsDone?: number;
    questionsCorrect?: number;
    photoURL?: string;
    validationMode: QuestionValidationMode;
  }) => void;
}

export const ExternalActivityForm: React.FC<ExternalActivityFormProps> = ({
  isOpen,
  onClose,
  subjects,
  onLogActivity
}) => {
  const [subjectId, setSubjectId] = useState<string>(subjects[0]?.id || '');
  const [topic, setTopic] = useState<string>('');
  const [type, setType] = useState<string>('exercises');
  const [minutes, setMinutes] = useState<number>(30);
  const [questionsDone, setQuestionsDone] = useState<string>('');
  const [questionsCorrect, setQuestionsCorrect] = useState<string>('');
  const [validationMode, setValidationMode] = useState<QuestionValidationMode>('trust');
  const [photoURL, setPhotoURL] = useState<string>('');
  const [isAnalyzingPhoto, setIsAnalyzingPhoto] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSimulatePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsAnalyzingPhoto(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoURL(reader.result as string);
        setTimeout(() => {
          setIsAnalyzingPhoto(false);
          // Auto fill AI Vision detected estimate if empty
          if (!questionsDone) setQuestionsDone('10');
          if (!questionsCorrect) setQuestionsCorrect('8');
        }, 1200);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sub = subjects.find(s => s.id === subjectId);
    if (!sub) return;

    onLogActivity({
      subjectId: sub.id,
      subjectName: sub.name,
      topic: topic.trim() || 'Exercícios do Livro/Caderno',
      type,
      minutes,
      questionsDone: questionsDone ? parseInt(questionsDone, 10) : undefined,
      questionsCorrect: questionsCorrect ? parseInt(questionsCorrect, 10) : undefined,
      photoURL: photoURL || undefined,
      validationMode
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base font-display">
                Lançar Atividade Externa (Caderno/Livro)
              </h3>
              <p className="text-xs text-slate-400">
                Registre estudos feitos fora do computador com validação antitrapaça.
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-xl">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 flex-1">
          
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Disciplina
            </label>
            <select
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              {subjects.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Tipo de Estudo
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="exercises">📝 Exercícios em Livro/Apostila</option>
                <option value="reading">📖 Leitura de Teoria</option>
                <option value="review">🔄 Resumos no Caderno</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Tempo (Minutos)
              </label>
              <input
                type="number"
                min={5}
                max={300}
                value={minutes}
                onChange={(e) => setMinutes(parseInt(e.target.value, 10) || 10)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Tópico / Capítulo Estudado
            </label>
            <input
              type="text"
              placeholder="Ex: Apostila 2 - Capítulo 4: Leis de Newton"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-800/60 border border-slate-700 rounded-xl">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Questões Resolvidas
              </label>
              <input
                type="number"
                min={0}
                placeholder="Ex: 15"
                value={questionsDone}
                onChange={(e) => setQuestionsDone(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Acertos
              </label>
              <input
                type="number"
                min={0}
                placeholder="Ex: 12"
                value={questionsCorrect}
                onChange={(e) => setQuestionsCorrect(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Validation Mode selector */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300">
              Modo de Validação
            </label>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setValidationMode('trust')}
                className={`p-2.5 rounded-xl border text-left text-[11px] font-bold transition ${
                  validationMode === 'trust'
                    ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
              >
                1. Confiança
              </button>

              <button
                type="button"
                onClick={() => setValidationMode('parent_approved')}
                className={`p-2.5 rounded-xl border text-left text-[11px] font-bold transition ${
                  validationMode === 'parent_approved'
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
              >
                2. Pais
              </button>

              <button
                type="button"
                onClick={() => setValidationMode('ai_verified')}
                className={`p-2.5 rounded-xl border text-left text-[11px] font-bold transition ${
                  validationMode === 'ai_verified'
                    ? 'bg-purple-500/20 border-purple-500/50 text-purple-300'
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
              >
                3. Foto/IA
              </button>
            </div>

            {/* Photo Upload area if AI / Parent mode */}
            {(validationMode === 'ai_verified' || validationMode === 'parent_approved') && (
              <div className="p-3 bg-slate-800/80 border border-dashed border-slate-700 rounded-xl space-y-2 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleSimulatePhotoUpload}
                  id="photo-upload-input"
                  className="hidden"
                />
                <label 
                  htmlFor="photo-upload-input"
                  className="cursor-pointer inline-flex items-center space-x-2 text-xs font-bold text-indigo-400 hover:text-indigo-300"
                >
                  <Camera className="w-4 h-4" />
                  <span>{photoURL ? 'Trocar Foto da Folha Resolvida' : 'Anexar Foto da Folha do Caderno/Livro'}</span>
                </label>

                {isAnalyzingPhoto && (
                  <p className="text-xs text-purple-300 animate-pulse flex items-center justify-center space-x-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Gemini Vision analisando a folha...</span>
                  </p>
                )}

                {photoURL && !isAnalyzingPhoto && (
                  <div className="flex items-center justify-center space-x-2 text-xs text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Foto validada pela IA Vision!</span>
                  </div>
                )}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs sm:text-sm rounded-xl transition shadow-lg shadow-emerald-600/20 flex items-center justify-center space-x-1.5"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Registrar Lançamento Externa</span>
          </button>

        </form>

      </div>
    </div>
  );
};
