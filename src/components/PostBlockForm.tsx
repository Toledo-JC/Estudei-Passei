import React, { useState } from 'react';
import { CheckCircle2, Star, BookOpen, Award, ArrowRight } from 'lucide-react';
import { DailyPlanBlock } from '../types';

interface PostBlockFormProps {
  block: DailyPlanBlock;
  actualMinutes: number;
  onSaveAndNext: (
    actualMinutes: number, 
    questionsDone?: number, 
    questionsCorrect?: number, 
    notes?: string
  ) => void;
}

export const PostBlockForm: React.FC<PostBlockFormProps> = ({
  block,
  actualMinutes,
  onSaveAndNext
}) => {
  const [mins, setMins] = useState<number>(actualMinutes || block.plannedMinutes);
  const [questionsDone, setQuestionsDone] = useState<string>('');
  const [questionsCorrect, setQuestionsCorrect] = useState<string>('');
  const [rating, setRating] = useState<number>(4);
  const [notes, setNotes] = useState<string>('');

  const isExercises = block.type === 'exercises' || block.type === 'quiz' || block.type === 'simulated';
  const isReading = block.type === 'reading';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const qDone = questionsDone ? parseInt(questionsDone, 10) : undefined;
    const qCorrect = questionsCorrect ? parseInt(questionsCorrect, 10) : undefined;

    onSaveAndNext(mins, qDone, qCorrect, notes.trim() || undefined);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl max-w-lg mx-auto space-y-6 animate-fadeIn">
      
      <div className="text-center space-y-2">
        <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-2xl border border-emerald-500/30 mx-auto flex items-center justify-center">
          <CheckCircle2 className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-extrabold text-white font-display">
          Bloco Concluído! 🎉
        </h2>
        <p className="text-xs sm:text-sm text-slate-400">
          <strong className="text-white">{block.subjectName}</strong> — {block.topicName || 'Sessão de Estudos'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Actual Minutes Spent */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Tempo Efetivo de Foco (Minutos)
          </label>
          <input
            type="number"
            min={1}
            max={300}
            value={mins}
            onChange={(e) => setMins(parseInt(e.target.value, 10) || 1)}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-indigo-500"
            required
          />
        </div>

        {/* If Exercises: Questions and Corrects */}
        {isExercises && (
          <div className="grid grid-cols-2 gap-3 p-4 bg-slate-800/60 border border-slate-700/80 rounded-2xl">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Questões Feitas
              </label>
              <input
                type="number"
                min={0}
                placeholder="Ex: 10"
                value={questionsDone}
                onChange={(e) => setQuestionsDone(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Número de Acertos
              </label>
              <input
                type="number"
                min={0}
                placeholder="Ex: 8"
                value={questionsCorrect}
                onChange={(e) => setQuestionsCorrect(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        )}

        {/* Self Assessment rating */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Autoavaliação de Compreensão do Tópico
          </label>
          <div className="flex items-center justify-between bg-slate-800/80 border border-slate-700 p-3 rounded-xl">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="p-1 transition transform hover:scale-110"
              >
                <Star
                  className={`w-6 h-6 ${
                    star <= rating 
                      ? 'fill-amber-400 text-amber-400' 
                      : 'text-slate-600'
                  }`}
                />
              </button>
            ))}
            <span className="text-xs font-bold text-amber-300 ml-2">
              {rating}/5
            </span>
          </div>
        </div>

        {/* Notes / Summary */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Anotação do que aprendeu ou pontos fracos (Opcional)
          </label>
          <textarea
            rows={2}
            placeholder={isReading ? "Ex: Li 12 páginas do capítulo de Revolução Francesa..." : "Ex: Dificuldade na fórmula de bhaskara..."}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold text-sm rounded-2xl transition shadow-lg shadow-emerald-500/20 flex items-center justify-center space-x-2"
        >
          <span>Registrar e Continuar</span>
          <ArrowRight className="w-4 h-4" />
        </button>

      </form>

    </div>
  );
};
