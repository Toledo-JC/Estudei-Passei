import React, { useState, useEffect } from 'react';
import { ClassOlympiad, OlympiadQuizQuestion } from '../types';
import { Clock, CheckCircle2, AlertCircle, ArrowRight, X, Sparkles, Loader2 } from 'lucide-react';

interface OlympiadQuizProps {
  olympiad: ClassOlympiad;
  userNickname: string;
  userAvatar: string;
  userUid: string;
  onFinishQuiz: (score: number, total: number, timeSpentSec: number) => void;
  onClose: () => void;
}

export const OlympiadQuiz: React.FC<OlympiadQuizProps> = ({
  olympiad,
  userNickname,
  userAvatar,
  userUid,
  onFinishQuiz,
  onClose
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [secondsLeft, setSecondsLeft] = useState((olympiad.durationMinutes || 10) * 60);
  const [startTime] = useState(Date.now());
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (isFinished) return;
    const timer = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleCompleteQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isFinished]);

  const questions = olympiad.questions || [];
  const currentQ = questions[currentIndex];

  const handleSelectOption = (optIdx: number) => {
    setSelectedAnswers(prev => ({ ...prev, [currentIndex]: optIdx }));
  };

  const handleCompleteQuiz = () => {
    setIsFinished(true);
    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        correctCount++;
      }
    });

    const elapsedSeconds = Math.round((Date.now() - startTime) / 1000);
    onFinishQuiz(correctCount, questions.length, elapsedSeconds);
  };

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  if (!currentQ) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-5 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{userAvatar}</span>
            <div>
              <h3 className="text-base font-extrabold font-display">{olympiad.title}</h3>
              <p className="text-xs text-indigo-200">
                Responda com atenção • Aluno: {userNickname}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="px-3 py-1.5 bg-amber-500/20 border border-amber-400/40 rounded-xl text-amber-300 font-mono text-xs font-black flex items-center space-x-1.5">
              <Clock className="w-4 h-4 text-amber-300" />
              <span>
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-xl bg-slate-800/60 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="bg-slate-100 h-1.5 w-full">
          <div
            className="bg-indigo-600 h-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>

        {/* Question Area */}
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span>Questão {currentIndex + 1} de {questions.length}</span>
            <span>{currentQ.topic}</span>
          </div>

          <h4 className="text-base font-extrabold text-slate-900 leading-snug">
            {currentQ.statement}
          </h4>

          <div className="space-y-2.5">
            {currentQ.options.map((opt, optIdx) => {
              const isSelected = selectedAnswers[currentIndex] === optIdx;
              return (
                <button
                  key={optIdx}
                  type="button"
                  onClick={() => handleSelectOption(optIdx)}
                  className={`w-full p-4 rounded-2xl text-left text-xs font-bold transition flex items-start space-x-3 border ${
                    isSelected
                      ? 'bg-indigo-50 border-indigo-600 text-indigo-950 ring-2 ring-indigo-200'
                      : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-black ${
                    isSelected ? 'bg-indigo-600 text-white border-indigo-600' : 'border-slate-300 bg-white text-slate-600'
                  }`}>
                    {String.fromCharCode(65 + optIdx)}
                  </div>
                  <span className="leading-relaxed">{opt}</span>
                </button>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex(prev => prev - 1)}
              className="px-4 py-2 bg-slate-100 text-slate-700 disabled:opacity-40 rounded-xl text-xs font-bold transition"
            >
              Anterior
            </button>

            {currentIndex < questions.length - 1 ? (
              <button
                type="button"
                onClick={() => setCurrentIndex(prev => prev + 1)}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-extrabold transition flex items-center space-x-1.5"
              >
                <span>Próxima</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleCompleteQuiz}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-sm transition flex items-center space-x-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Finalizar Olimpíada</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
