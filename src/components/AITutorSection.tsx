import React, { useState } from 'react';
import { Subject } from '../types';
import { TooltipHelp } from './TooltipHelp';
import { Sparkles, MessageSquare, FileText, BookOpen, Youtube, Play, Pause, Send, Camera, Upload, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';

interface AITutorSectionProps {
  subjects: Subject[];
}

export const AITutorSection: React.FC<AITutorSectionProps> = ({ subjects }) => {
  const [activeTab, setActiveTab] = useState<'tutor' | 'essay' | 'exercises' | 'notebook' | 'youtube'>('tutor');

  // 1. Tutor Socrático
  const [tutorQuestion, setTutorQuestion] = useState('');
  const [tutorSubject, setTutorSubject] = useState((subjects || [])[0]?.name || 'Matemática');
  const [tutorResponse, setTutorResponse] = useState('');
  const [isTutorLoading, setIsTutorLoading] = useState(false);

  // 2. Corretor de Redação
  const [essayTitle, setEssayTitle] = useState('O papel da inteligência artificial na sociedade brasileira');
  const [essayText, setEssayText] = useState('');
  const [essayImageBase64, setEssayImageBase64] = useState<string | null>(null);
  const [essayResult, setEssayResult] = useState<any | null>(null);
  const [isEssayLoading, setIsEssayLoading] = useState(false);

  // 3. Gerador de Exercícios
  const [exerciseTopic, setExerciseTopic] = useState('Função Quadrática e Ponto de Mínimo');
  const [exerciseSubject, setExerciseSubject] = useState('Matemática');
  const [exercisesResult, setExercisesResult] = useState<any[] | null>(null);
  const [isExercisesLoading, setIsExercisesLoading] = useState(false);

  // 4. NotebookLM Studio
  const [notebookRawText, setNotebookRawText] = useState('');
  const [notebookResult, setNotebookResult] = useState<any | null>(null);
  const [isNotebookLoading, setIsNotebookLoading] = useState(false);
  const [isPlayingPodcast, setIsPlayingPodcast] = useState(false);

  // 5. YouTube Timestamps
  const [ytTopic, setYtTopic] = useState('Como calcular a vertente de uma parábola e aceleração escalar');
  const [ytResult, setYtResult] = useState<any[] | null>(null);
  const [isYtLoading, setIsYtLoading] = useState(false);

  // Handle Tutor Question submit
  const handleTutorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tutorQuestion.trim()) return;

    setIsTutorLoading(true);
    setTutorResponse('');
    try {
      const res = await fetch('/api/ai/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: tutorQuestion,
          subject: tutorSubject,
          studentLevel: 'Ensino Médio'
        })
      });
      const data = await res.json();
      setTutorResponse(data.explanation || 'Não foi possível gerar a explicação.');
    } catch (err: any) {
      setTutorResponse(`Erro ao conectar ao Tutor IA: ${err?.message || 'Erro desconhecido'}`);
    } finally {
      setIsTutorLoading(false);
    }
  };

  // Handle Essay Submission
  const handleEssaySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!essayText && !essayImageBase64) return;

    setIsEssayLoading(true);
    setEssayResult(null);
    try {
      const res = await fetch('/api/ai/essay-correction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          essayTitle,
          essayText,
          imageBase64: essayImageBase64
        })
      });
      const data = await res.json();
      setEssayResult(data);
    } catch (err: any) {
      alert(`Erro na correção da redação: ${err?.message}`);
    } finally {
      setIsEssayLoading(false);
    }
  };

  // Handle Image Upload for Essay
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setEssayImageBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Handle Exercise Generator
  const handleGenerateExercises = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!exerciseTopic.trim()) return;

    setIsExercisesLoading(true);
    setExercisesResult(null);
    try {
      const res = await fetch('/api/ai/exercises', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: exerciseTopic,
          subject: exerciseSubject,
          difficulty: 'Médio',
          count: 3
        })
      });
      const data = await res.json();
      setExercisesResult(data.exercises || []);
    } catch (err: any) {
      alert(`Erro ao gerar exercícios: ${err?.message}`);
    } finally {
      setIsExercisesLoading(false);
    }
  };

  // Handle NotebookLM Overview
  const handleGenerateNotebook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notebookRawText.trim()) return;

    setIsNotebookLoading(true);
    setNotebookResult(null);
    try {
      const res = await fetch('/api/ai/notebook-overview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawText: notebookRawText,
          subject: 'Geral',
          topic: 'Apostila de Revisão'
        })
      });
      const data = await res.json();
      setNotebookResult(data);
    } catch (err: any) {
      alert(`Erro no NotebookLM: ${err?.message}`);
    } finally {
      setIsNotebookLoading(false);
    }
  };

  // Handle YouTube Timestamps
  const handleSearchYouTube = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ytTopic.trim()) return;

    setIsYtLoading(true);
    setYtResult(null);
    try {
      const res = await fetch('/api/ai/youtube-timestamps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: ytTopic,
          subject: 'Geral'
        })
      });
      const data = await res.json();
      setYtResult(data.recommendations || []);
    } catch (err: any) {
      alert(`Erro ao buscar timestamps do YouTube: ${err?.message}`);
    } finally {
      setIsYtLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 flex-wrap gap-3">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl">
            <Sparkles className="w-6 h-6 text-amber-500" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 font-display">
              IA Multimodal Estudei (Gemini + NotebookLM)
            </h2>
            <p className="text-xs text-slate-500">
              Tutor Socrático, Corretor de Redação ENEM, Resumos NotebookLM e Videoaulas com Timestamps.
            </p>
          </div>
        </div>

        {/* AI Navigation Subtabs */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 overflow-x-auto">
          <button
            onClick={() => setActiveTab('tutor')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
              activeTab === 'tutor' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Tutor Socrático</span>
          </button>

          <button
            onClick={() => setActiveTab('essay')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
              activeTab === 'essay' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-amber-300" />
            <span>Redação ENEM (Foto/Texto)</span>
          </button>

          <button
            onClick={() => setActiveTab('exercises')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
              activeTab === 'exercises' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Exercícios Inéditos</span>
          </button>

          <button
            onClick={() => setActiveTab('notebook')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
              activeTab === 'notebook' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>NotebookLM Podcast</span>
          </button>

          <button
            onClick={() => setActiveTab('youtube')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
              activeTab === 'youtube' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Youtube className="w-3.5 h-3.5 text-rose-400" />
            <span>YouTube Timestamps</span>
          </button>
        </div>
      </div>

      {/* 1. TAB: TUTOR SOCRÁTICO */}
      {activeTab === 'tutor' && (
        <div className="space-y-4">
          <form onSubmit={handleTutorSubmit} className="space-y-3">
            <div className="flex gap-2">
              <select
                value={tutorSubject}
                onChange={(e) => setTutorSubject(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
              >
                {subjects.map(s => (
                  <option key={s.id} value={s.name}>{s.name}</option>
                ))}
              </select>

              <input
                type="text"
                value={tutorQuestion}
                onChange={(e) => setTutorQuestion(e.target.value)}
                placeholder="Pergunte ao Tutor Socrático (ex: Por que o delta negativo impede raízes reais?)..."
                className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500"
              />

              <button
                type="submit"
                disabled={isTutorLoading}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-5 py-2 rounded-xl shadow transition flex items-center space-x-1.5"
              >
                {isTutorLoading ? <span>Pensando...</span> : <><Send className="w-3.5 h-3.5" /><span>Tutorar</span></>}
              </button>
            </div>
          </form>

          {tutorResponse && (
            <div className="p-5 bg-slate-900 text-slate-100 rounded-2xl border border-slate-800 space-y-3 animate-in fade-in">
              <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold border-b border-slate-800 pb-2">
                <Sparkles className="w-4 h-4" />
                <span>Explicação Socrática Inteligente (Gemini AI)</span>
              </div>
              <div className="text-xs leading-relaxed font-sans whitespace-pre-wrap text-slate-200">
                {tutorResponse}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. TAB: CORRETOR DE REDAÇÃO ENEM */}
      {activeTab === 'essay' && (
        <div className="space-y-6">
          <form onSubmit={handleEssaySubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Tema da Redação</label>
              <input
                type="text"
                value={essayTitle}
                onChange={(e) => setEssayTitle(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Opção A: Digite o Texto</label>
                <textarea
                  rows={8}
                  value={essayText}
                  onChange={(e) => setEssayText(e.target.value)}
                  placeholder="Cole ou digite aqui sua redação com introdução, desenvolvimento e proposta de intervenção..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-800 font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Opção B: Foto da Folha Manuscrita</label>
                <div className="border-2 border-dashed border-slate-300 bg-slate-50 rounded-xl p-4 text-center space-y-3">
                  <Camera className="w-8 h-8 text-slate-400 mx-auto" />
                  <p className="text-xs text-slate-500">Envie a imagem da sua folha oficial de redação</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="text-xs text-slate-500 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700"
                  />
                  {essayImageBase64 && (
                    <img src={essayImageBase64} alt="Preview" className="max-h-32 mx-auto rounded-lg shadow-sm border mt-2" />
                  )}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isEssayLoading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow transition flex items-center space-x-2"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{isEssayLoading ? 'Corrigindo Redação no Inep AI...' : 'Corrigir Redação (5 Competências)'}</span>
            </button>
          </form>

          {/* Result displaying 5 competencies */}
          {essayResult && (
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-5 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-display">Nota Final da Redação</h3>
                  <p className="text-xs text-slate-500">Avaliação oficial pelas 5 Competências do ENEM</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-indigo-700 font-mono">
                    {essayResult.totalScore || 0} / 1000
                  </span>
                </div>
              </div>

              {/* Competencies breakdown */}
              <div className="space-y-3">
                {essayResult.competencies?.map((comp: any, idx: number) => (
                  <div key={idx} className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-slate-900">Competência {comp.number}: {comp.name}</span>
                      <span className="text-indigo-700 font-mono">{comp.score} / 200 pts</span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">{comp.feedback}</p>
                  </div>
                ))}
              </div>

              {/* General Feedback */}
              <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl text-xs space-y-2">
                <span className="font-bold text-indigo-950 block">Análise Geral & Recomendações</span>
                <p className="text-indigo-900">{essayResult.generalFeedback}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. TAB: EXERCÍCIOS INÉDITOS */}
      {activeTab === 'exercises' && (
        <div className="space-y-4">
          <form onSubmit={handleGenerateExercises} className="flex gap-2">
            <input
              type="text"
              value={exerciseTopic}
              onChange={(e) => setExerciseTopic(e.target.value)}
              placeholder="Tópico para gerar questões inéditas..."
              className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800"
            />
            <button
              type="submit"
              disabled={isExercisesLoading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-5 py-2 rounded-xl shadow transition"
            >
              {isExercisesLoading ? 'Gerando...' : 'Gerar 3 Questões Inéditas'}
            </button>
          </form>

          {exercisesResult && (
            <div className="space-y-4">
              {exercisesResult.map((ex: any, idx: number) => (
                <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <span className="text-xs font-bold text-indigo-700 uppercase">Questão #{idx + 1}</span>
                  <p className="text-xs text-slate-900 font-medium leading-relaxed">{ex.statement}</p>
                  <div className="space-y-1 pl-2">
                    {ex.options?.map((opt: string, oIdx: number) => (
                      <p key={oIdx} className="text-xs text-slate-700">{opt}</p>
                    ))}
                  </div>
                  <div className="pt-2 border-t border-slate-200 text-xs text-emerald-800 bg-emerald-50 p-2.5 rounded-lg">
                    <strong>Gabarito Comentado:</strong> {ex.explanation}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 4. TAB: NOTEBOOKLM PODCAST */}
      {activeTab === 'notebook' && (
        <div className="space-y-4">
          <form onSubmit={handleGenerateNotebook} className="space-y-3">
            <textarea
              rows={5}
              value={notebookRawText}
              onChange={(e) => setNotebookRawText(e.target.value)}
              placeholder="Cole aqui o texto da apostila ou anotações extensas..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-800"
            />
            <button
              type="submit"
              disabled={isNotebookLoading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow transition flex items-center space-x-2"
            >
              <BookOpen className="w-4 h-4" />
              <span>{isNotebookLoading ? 'Sintetizando Podcast...' : 'Gerar Resumo & Audio Podcast (NotebookLM)'}</span>
            </button>
          </form>

          {notebookResult && (
            <div className="p-5 bg-slate-900 text-white rounded-2xl space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-amber-400">Audio Overview — Roteiro de Podcast Curto</span>
                <button
                  type="button"
                  onClick={() => setIsPlayingPodcast(!isPlayingPodcast)}
                  className="bg-amber-500 text-slate-950 font-bold text-xs px-3 py-1.5 rounded-lg flex items-center space-x-1"
                >
                  {isPlayingPodcast ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isPlayingPodcast ? 'Pausar Reprodução' : 'Ouvir Audio Overview'}</span>
                </button>
              </div>

              {/* Podcast Script lines */}
              <div className="space-y-2 text-xs">
                {notebookResult.podcastScript?.map((p: any, idx: number) => (
                  <div key={idx} className="p-2.5 bg-slate-800/80 rounded-xl">
                    <strong className={p.speaker === 'Alex' ? 'text-indigo-400' : 'text-amber-300'}>
                      {p.speaker}:
                    </strong>{' '}
                    <span className="text-slate-200">{p.line}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5. TAB: YOUTUBE TIMESTAMPS */}
      {activeTab === 'youtube' && (
        <div className="space-y-4">
          <form onSubmit={handleSearchYouTube} className="flex gap-2">
            <input
              type="text"
              value={ytTopic}
              onChange={(e) => setYtTopic(e.target.value)}
              placeholder="Digite sua dúvida específica..."
              className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800"
            />
            <button
              type="submit"
              disabled={isYtLoading}
              className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-5 py-2 rounded-xl shadow transition flex items-center space-x-1.5"
            >
              <Youtube className="w-4 h-4" />
              <span>{isYtLoading ? 'Buscando...' : 'Buscar Minuto Exato'}</span>
            </button>
          </form>

          {ytResult && (
            <div className="space-y-3">
              {ytResult.map((yt: any, idx: number) => (
                <div key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">{yt.videoTitle}</span>
                    <span className="text-[11px] text-slate-500">Canal: {yt.channel}</span>
                    <p className="text-[11px] text-slate-600 mt-1">{yt.explanation}</p>
                  </div>
                  <a
                    href={`https://www.youtube.com/results?search_query=${encodeURIComponent(yt.searchQuery)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-rose-100 hover:bg-rose-200 text-rose-800 font-extrabold text-xs px-3 py-1.5 rounded-lg shrink-0 flex items-center space-x-1"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Minuto {yt.timestamp}</span>
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
