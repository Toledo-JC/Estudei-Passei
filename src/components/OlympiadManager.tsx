import React, { useState, useEffect } from 'react';
import { ClassGroup, ClassOlympiad } from '../types';
import { OlympiadQuiz } from './OlympiadQuiz';
import { OlympiadPodium } from './OlympiadPodium';
import { Trophy, Plus, Sparkles, Clock, CheckCircle2, Award, Loader2, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface OlympiadManagerProps {
  classGroup: ClassGroup;
  onClose: () => void;
}

export const OlympiadManager: React.FC<OlympiadManagerProps> = ({
  classGroup,
  onClose
}) => {
  const { user } = useAuth();
  const [olympiads, setOlympiads] = useState<ClassOlympiad[]>([]);
  const [activeQuizOlympiad, setActiveQuizOlympiad] = useState<ClassOlympiad | null>(null);
  const [activePodiumOlympiad, setActivePodiumOlympiad] = useState<ClassOlympiad | null>(null);
  
  // Create New Olympiad Form State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [title, setTitle] = useState('');
  const [subjectName, setSubjectName] = useState('Matemática e Raciocínio Lógico');
  const [questionCount, setQuestionCount] = useState(5);
  const [durationMinutes, setDurationMinutes] = useState(10);
  const [isGenerating, setIsGenerating] = useState(false);

  const [userNickname] = useState(() => localStorage.getItem('estudei_user_nickname') || 'EstudanteFocado');
  const [userAvatar] = useState(() => localStorage.getItem('estudei_user_avatar') || '🐯');

  const STORAGE_KEY = `estudei_olympiads_${classGroup.id}`;

  const loadOlympiads = () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    let list: ClassOlympiad[] = [];
    if (saved) {
      try { list = JSON.parse(saved); } catch (e) { }
    }

    if (list.length === 0) {
      // Seed initial sample Olympiad
      const sample: ClassOlympiad = {
        id: `olymp-${Date.now()}`,
        classId: classGroup.id,
        title: 'I Olimpíada Interdisciplinar de Matemática e Lógica',
        subjectId: 'sub-mat',
        subjectName: 'Matemática e Raciocínio Lógico',
        durationMinutes: 10,
        questionCount: 5,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 86400000 * 7).toISOString(),
        status: 'active',
        questions: [
          {
            id: 'q1',
            statement: 'Um vestibulando resolveu 20 questões no primeiro dia e aumentou 5 questões a cada dia. Quantas questões ele resolveu no 5º dia?',
            options: ['A) 35 questões', 'B) 40 questões', 'C) 45 questões', 'D) 50 questões'],
            correctIndex: 1,
            explanation: 'Progressão Aritmética: a5 = a1 + 4*r = 20 + 4*5 = 40.',
            topic: 'Progressão Aritmética'
          },
          {
            id: 'q2',
            statement: 'Se a probabilidade de acertar uma questão no chute é de 20%, qual a probabilidade de errar?',
            options: ['A) 50%', 'B) 70%', 'C) 80%', 'D) 90%'],
            correctIndex: 2,
            explanation: 'Probabilidade complementar: 100% - 20% = 80%.',
            topic: 'Probabilidade'
          }
        ],
        createdByUid: 'system',
        results: [
          { memberUid: 'u1', nickname: 'CorujaSábia', avatar: '🦉', score: 5, totalQuestions: 5, timeSpentSeconds: 140, completedAt: '2026-07-29' },
          { memberUid: 'u2', nickname: 'MagoDasExatas', avatar: '🧙‍♂️', score: 4, totalQuestions: 5, timeSpentSeconds: 180, completedAt: '2026-07-30' }
        ]
      };
      list = [sample];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    }

    setOlympiads(list);
  };

  useEffect(() => {
    loadOlympiads();
  }, [classGroup.id]);

  const handleCreateOlympiadWithAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Informe o título da Olimpíada.');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch('/api/ai/generate-olympiad-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          subjectName,
          questionCount
        })
      });

      const data = await response.json();
      const generatedQuestions = data.questions || [];

      const newOlympiad: ClassOlympiad = {
        id: `olymp-${Date.now()}`,
        classId: classGroup.id,
        title,
        subjectId: 'sub-custom',
        subjectName,
        durationMinutes,
        questionCount: generatedQuestions.length || questionCount,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 86400000 * 7).toISOString(),
        status: 'active',
        questions: generatedQuestions,
        createdByUid: user?.uid || 'guest-user',
        results: []
      };

      const updated = [newOlympiad, ...olympiads];
      setOlympiads(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

      setShowCreateModal(false);
      setTitle('');
    } catch (error) {
      console.error('Erro ao gerar olimpíada com a IA:', error);
      alert('Ocorreu um erro ao gerar o quiz com a IA. Tente novamente.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveResult = (score: number, total: number, timeSpentSec: number) => {
    if (!activeQuizOlympiad) return;

    const currentUid = user?.uid || 'guest-user';
    const updated = olympiads.map(ol => {
      if (ol.id === activeQuizOlympiad.id) {
        const results = ol.results || [];
        const existingIdx = results.findIndex(r => r.memberUid === currentUid);

        const resultEntry = {
          memberUid: currentUid,
          nickname: userNickname,
          avatar: userAvatar,
          score,
          totalQuestions: total,
          timeSpentSeconds: timeSpentSec,
          completedAt: new Date().toISOString()
        };

        if (existingIdx >= 0) {
          results[existingIdx] = resultEntry;
        } else {
          results.push(resultEntry);
        }

        return { ...ol, results };
      }
      return ol;
    });

    setOlympiads(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    const finishedOlympiad = updated.find(ol => ol.id === activeQuizOlympiad.id);
    setActiveQuizOlympiad(null);
    if (finishedOlympiad) {
      setActivePodiumOlympiad(finishedOlympiad);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-5 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-amber-500/30 rounded-2xl border border-amber-400/30 text-amber-300">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-extrabold font-display">Olimpíadas da Turma</h3>
              <p className="text-xs text-indigo-200">
                Desafios acadêmicos cooperativos em {classGroup.name}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl bg-slate-800/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
              Desafios Disponíveis
            </h4>

            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-extrabold transition flex items-center space-x-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Propor Nova Olimpíada</span>
            </button>
          </div>

          {/* List of Olympiads */}
          <div className="space-y-3">
            {olympiads.map(ol => {
              const currentUid = user?.uid || 'guest-user';
              const userResult = ol.results?.find(r => r.memberUid === currentUid);

              return (
                <div
                  key={ol.id}
                  className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="px-2.5 py-0.5 bg-amber-100 text-amber-900 rounded-full text-[10px] font-extrabold uppercase">
                        {ol.subjectName}
                      </span>
                      <span className="text-[11px] font-bold text-slate-500">
                        {ol.questionCount} Questões • {ol.durationMinutes} min
                      </span>
                    </div>

                    <h5 className="text-sm font-extrabold text-slate-900 font-display">
                      {ol.title}
                    </h5>

                    {userResult && (
                      <span className="text-xs font-bold text-emerald-700 flex items-center space-x-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Seu resultado: {userResult.score}/{userResult.totalQuestions} acertos ({userResult.timeSpentSeconds}s)</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      onClick={() => setActivePodiumOlympiad(ol)}
                      className="px-3.5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold transition flex items-center space-x-1"
                    >
                      <Trophy className="w-3.5 h-3.5 text-amber-600" />
                      <span>Pódio</span>
                    </button>

                    <button
                      onClick={() => setActiveQuizOlympiad(ol)}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-extrabold transition shadow-xs"
                    >
                      {userResult ? 'Refazer Desafio' : 'Participar'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Create Modal Form */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 border border-slate-200 shadow-xl">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-black text-slate-900 font-display">
                  Propor Nova Olimpíada com IA
                </h4>
                <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateOlympiadWithAI} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Título do Desafio *</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: Desafio de Física Moderna & Relatividade"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Matéria / Área</label>
                  <select
                    value={subjectName}
                    onChange={(e) => setSubjectName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                  >
                    <option value="Matemática e Raciocínio Lógico">Matemática e Raciocínio Lógico</option>
                    <option value="Física e Química">Física e Química</option>
                    <option value="Biologia e Meio Ambiente">Biologia e Meio Ambiente</option>
                    <option value="História e Geografia">História e Geografia</option>
                    <option value="Língua Portuguesa e Literatura">Língua Portuguesa e Literatura</option>
                    <option value="Atualidades e Conhecimentos Gerais">Atualidades e Conhecimentos Gerais</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Qtd. Questões</label>
                    <select
                      value={questionCount}
                      onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                    >
                      <option value={5}>5 questões (Rápido)</option>
                      <option value={10}>10 questões (Padrão)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Tempo Limite</label>
                    <select
                      value={durationMinutes}
                      onChange={(e) => setDurationMinutes(parseInt(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                    >
                      <option value={5}>5 minutos</option>
                      <option value={10}>10 minutos</option>
                      <option value={15}>15 minutos</option>
                    </select>
                  </div>
                </div>

                <div className="pt-3 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    disabled={isGenerating}
                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold rounded-xl transition flex items-center space-x-1.5 disabled:opacity-50"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Gerando Questões IA...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-amber-300" />
                        <span>Gerar e Criar Desafio</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Active Quiz Overlay */}
        {activeQuizOlympiad && (
          <OlympiadQuiz
            olympiad={activeQuizOlympiad}
            userNickname={userNickname}
            userAvatar={userAvatar}
            userUid={user?.uid || 'guest-user'}
            onFinishQuiz={handleSaveResult}
            onClose={() => setActiveQuizOlympiad(null)}
          />
        )}

        {/* Active Podium Overlay */}
        {activePodiumOlympiad && (
          <OlympiadPodium
            olympiad={activePodiumOlympiad}
            onClose={() => setActivePodiumOlympiad(null)}
          />
        )}
      </div>
    </div>
  );
};
