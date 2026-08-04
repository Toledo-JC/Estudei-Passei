import React, { useState, useEffect } from 'react';
import { Subject, QuestionLogEntry } from '../types';
import {
  Target,
  CheckCircle2,
  XCircle,
  BarChart3,
  Plus,
  Trash2,
  BookOpen,
  Filter,
  Sparkles,
  Search,
  Award,
  Calendar,
  AlertTriangle,
  FileText
} from 'lucide-react';

interface QuestionsTrackerProps {
  subjects: Subject[];
}

export const QuestionsTracker: React.FC<QuestionsTrackerProps> = ({ subjects }) => {
  // Persistence key
  const STORAGE_KEY = 'estudei_questions_log_entries';

  const [questionLogs, setQuestionLogs] = useState<QuestionLogEntry[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing question logs', e);
      }
    }
    // Default starter data if empty
    return [
      {
        id: 'q-log-1',
        subjectId: subjects[0]?.id || 'sub-mat',
        topic: 'Função Quadrática e Vértice da Parábola',
        date: new Date().toISOString().split('T')[0],
        totalQuestions: 15,
        correctAnswers: 12,
        wrongAnswers: 3,
        accuracyRate: 80,
        source: 'Livro Didático',
        notes: 'Errei 3 questões por falta de atenção no sinal do Delta ao calcular x1 e x2.',
        createdAt: new Date().toISOString()
      },
      {
        id: 'q-log-2',
        subjectId: subjects[1]?.id || 'sub-fis',
        topic: 'Óptica e Equação de Gauss',
        date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
        totalQuestions: 10,
        correctAnswers: 9,
        wrongAnswers: 1,
        accuracyRate: 90,
        source: 'QConcursos / Plataforma Online',
        notes: 'Revisar a convenção de sinais para espelho côncavo e convexo.',
        createdAt: new Date(Date.now() - 86400000).toISOString()
      }
    ];
  });

  // Save to localStorage when updated
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(questionLogs));
  }, [questionLogs]);

  // Form State
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(subjects[0]?.id || '');
  const [topicName, setTopicName] = useState<string>('');
  const [logDate, setLogDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [totalQuestions, setTotalQuestions] = useState<number | ''>(10);
  const [correctAnswers, setCorrectAnswers] = useState<number | ''>(8);
  const [source, setSource] = useState<string>('Lista de Exercícios');
  const [notes, setNotes] = useState<string>('');
  const [filterSubjectId, setFilterSubjectId] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showForm, setShowForm] = useState<boolean>(false);

  // Derived Calculations
  const numTotal = typeof totalQuestions === 'number' ? totalQuestions : 0;
  const numCorrect = typeof correctAnswers === 'number' ? correctAnswers : 0;
  const numWrong = Math.max(0, numTotal - numCorrect);
  const accuracyPct = numTotal > 0 ? Math.round((numCorrect / numTotal) * 100) : 0;

  // Selected Subject details
  const currentSubject = subjects.find(s => s.id === selectedSubjectId);

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubjectId || numTotal <= 0 || numCorrect < 0 || numCorrect > numTotal) {
      alert('Por favor, informe a matéria e valores válidos para total de questões e acertos.');
      return;
    }

    const newEntry: QuestionLogEntry = {
      id: `q-log-${Date.now()}`,
      subjectId: selectedSubjectId,
      topic: topicName.trim() || 'Geral / Vários Tópicos',
      date: logDate || new Date().toISOString().split('T')[0],
      totalQuestions: numTotal,
      correctAnswers: numCorrect,
      wrongAnswers: numWrong,
      accuracyRate: accuracyPct,
      source,
      notes: notes.trim(),
      createdAt: new Date().toISOString()
    };

    setQuestionLogs([newEntry, ...questionLogs]);
    
    // Reset Form
    setTopicName('');
    setTotalQuestions(10);
    setCorrectAnswers(8);
    setNotes('');
    setShowForm(false);
  };

  const handleDeleteEntry = (id: string) => {
    if (confirm('Deseja realmente excluir este registro de questões?')) {
      setQuestionLogs(questionLogs.filter(q => q.id !== id));
    }
  };

  // KPI Overall Metrics
  const totalQuestionsSum = questionLogs.reduce((acc, curr) => acc + curr.totalQuestions, 0);
  const totalCorrectSum = questionLogs.reduce((acc, curr) => acc + curr.correctAnswers, 0);
  const overallAccuracyPct = totalQuestionsSum > 0 ? Math.round((totalCorrectSum / totalQuestionsSum) * 100) : 0;

  // Filtered Logs List
  const filteredLogs = questionLogs.filter(log => {
    const matchesSubject = filterSubjectId === 'all' || log.subjectId === filterSubjectId;
    const sub = subjects.find(s => s.id === log.subjectId);
    const matchesSearch = searchTerm === '' ||
      (log.topic || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (sub?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.notes || '').toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSubject && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 text-white border border-indigo-900/50 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="p-2 bg-indigo-500/20 rounded-xl border border-indigo-400/30 text-amber-300">
                <Target className="w-5 h-5" />
              </span>
              <span className="text-xs font-black uppercase tracking-wider text-amber-300 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
                Central de Prática & Resolução
              </span>
            </div>
            <h2 className="text-2xl font-black font-display tracking-tight text-white">
              Registro de Questões Feitas & Acertos
            </h2>
            <p className="text-xs text-slate-300 max-w-xl">
              Registre os exercícios resolvidos, acompanhe sua taxa de acerto por matéria e mantenha seu caderno de erros atualizado para revisar antes das provas!
            </p>
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className="px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-2xl transition shadow-lg shadow-emerald-500/20 flex items-center justify-center space-x-2 shrink-0 transform hover:scale-105 active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>{showForm ? 'Fechar Formulário' : '+ Registrar Novas Questões'}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Header */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Questões */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center space-x-4">
          <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600 border border-indigo-100 shrink-0">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Respostas</p>
            <p className="text-2xl font-black text-slate-900 font-display">{totalQuestionsSum}</p>
            <p className="text-[10px] font-medium text-slate-500">questões registradas</p>
          </div>
        </div>

        {/* Card 2: Acertos Totais */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center space-x-4">
          <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600 border border-emerald-100 shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Acertos</p>
            <p className="text-2xl font-black text-emerald-600 font-display">{totalCorrectSum}</p>
            <p className="text-[10px] font-medium text-emerald-700">questões corretas</p>
          </div>
        </div>

        {/* Card 3: Taxa Geral */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center space-x-4">
          <div className={`p-3 rounded-xl shrink-0 border ${
            overallAccuracyPct >= 75
              ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
              : overallAccuracyPct >= 60
              ? 'bg-amber-50 text-amber-600 border-amber-100'
              : 'bg-rose-50 text-rose-600 border-rose-100'
          }`}>
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Taxa Média Acerto</p>
            <p className="text-2xl font-black text-slate-900 font-display">{overallAccuracyPct}%</p>
            <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-md ${
              overallAccuracyPct >= 75 ? 'bg-emerald-100 text-emerald-800' : overallAccuracyPct >= 60 ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
            }`}>
              {overallAccuracyPct >= 75 ? 'Ótimo Rendimento' : overallAccuracyPct >= 60 ? 'Atenção Regular' : 'Requer Revisão'}
            </span>
          </div>
        </div>

        {/* Card 4: Erros Registrados */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center space-x-4">
          <div className="p-3 bg-rose-50 rounded-xl text-rose-600 border border-rose-100 shrink-0">
            <XCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Erros Registrados</p>
            <p className="text-2xl font-black text-rose-600 font-display">{totalQuestionsSum - totalCorrectSum}</p>
            <p className="text-[10px] font-medium text-slate-500">para caderno de erros</p>
          </div>
        </div>
      </div>

      {/* FORM MODAL / COLLAPSIBLE CONTAINER */}
      {showForm && (
        <form onSubmit={handleAddEntry} className="bg-white p-6 rounded-3xl border border-indigo-200 shadow-xl space-y-5 animate-in slide-in-from-top-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <span className="p-1.5 bg-indigo-100 text-indigo-700 rounded-lg">
                <Plus className="w-4 h-4" />
              </span>
              <h3 className="text-base font-bold text-slate-900 font-display">
                Lançar Novo Bloco de Questões Resolvidas
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-medium">* Preencha os acertos para cálculo automático</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Subject Select */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Matéria *
              </label>
              <select
                value={selectedSubjectId}
                onChange={(e) => {
                  setSelectedSubjectId(e.target.value);
                  const sub = subjects.find(s => s.id === e.target.value);
                  if (sub && sub.topics && sub.topics.length > 0) {
                    setTopicName(sub.topics[0].name);
                  }
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >
                {subjects.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.category})
                  </option>
                ))}
              </select>
            </div>

            {/* Topic Select or Text */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tópico / Conteúdo
              </label>
              {currentSubject && currentSubject.topics && currentSubject.topics.length > 0 ? (
                <select
                  value={topicName}
                  onChange={(e) => setTopicName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">-- Selecione o Tópico ou Digite Abaixo --</option>
                  {currentSubject.topics.map(t => (
                    <option key={t.id} value={t.name}>
                      {t.name}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={topicName}
                  onChange={(e) => setTopicName(e.target.value)}
                  placeholder="Ex: Equação do 2º Grau"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              )}
            </div>

            {/* Date */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Data do Estudo
              </label>
              <input
                type="date"
                value={logDate}
                onChange={(e) => setLogDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Total Questions */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Qtd Total Feitas *
              </label>
              <input
                type="number"
                min="1"
                max="500"
                value={totalQuestions}
                onChange={(e) => setTotalQuestions(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            {/* Correct Answers */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nº de Acertos *
              </label>
              <input
                type="number"
                min="0"
                max={numTotal || 500}
                value={correctAnswers}
                onChange={(e) => setCorrectAnswers(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            {/* Source */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Origem / Material
              </label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Lista de Exercícios">Lista de Exercícios</option>
                <option value="Livro Didático">Livro Didático</option>
                <option value="QConcursos / Plataforma Online">QConcursos / Plataforma Online</option>
                <option value="Simulado Escola / Cursinho">Simulado Escola / Cursinho</option>
                <option value="ENEM / Prova Anterior">ENEM / Prova Anterior</option>
                <option value="Outro Material">Outro Material</option>
              </select>
            </div>

            {/* Live Calculation Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-around">
              <div className="text-center">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Erros</span>
                <span className="text-base font-black text-rose-600">{numWrong}</span>
              </div>
              <div className="h-8 w-px bg-slate-200" />
              <div className="text-center">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Aproveitamento</span>
                <span className={`text-base font-black ${
                  accuracyPct >= 75 ? 'text-emerald-600' : accuracyPct >= 60 ? 'text-amber-600' : 'text-rose-600'
                }`}>{accuracyPct}%</span>
              </div>
            </div>
          </div>

          {/* Notes / Caderno de Erros */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
              <span>Caderno de Erros / Anotações e Lições Aprendidas</span>
              <span className="text-[11px] text-slate-400 font-normal">Escreva pegadinhas ou dúvidas</span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="Ex: Confundi a fórmula do cálculo de área... Rever no livro página 45."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center space-x-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Salvar Registro de Questões</span>
            </button>
          </div>
        </form>
      )}

      {/* PERFORMANCE BY SUBJECT SUMMARY BARS */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 font-display flex items-center space-x-2">
          <BarChart3 className="w-4 h-4 text-indigo-600" />
          <span>Rendimento Médio por Matéria</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {subjects.map(s => {
            const logsForSub = questionLogs.filter(q => q.subjectId === s.id);
            const totalForSub = logsForSub.reduce((acc, curr) => acc + curr.totalQuestions, 0);
            const correctForSub = logsForSub.reduce((acc, curr) => acc + curr.correctAnswers, 0);
            const pct = totalForSub > 0 ? Math.round((correctForSub / totalForSub) * 100) : 0;

            if (totalForSub === 0) return null;

            return (
              <div key={s.id} className="p-3 bg-slate-50/80 border border-slate-200/60 rounded-2xl space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                  <span className="truncate max-w-[140px]">{s.name}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                    pct >= 75 ? 'bg-emerald-100 text-emerald-800' : pct >= 60 ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {pct}% acerto
                  </span>
                </div>

                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      pct >= 75 ? 'bg-emerald-500' : pct >= 60 ? 'bg-amber-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <p className="text-[10px] text-slate-500 font-medium">
                  {correctForSub} acertos de {totalForSub} questões feitas
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80">
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={filterSubjectId}
            onChange={(e) => setFilterSubjectId(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-48"
          >
            <option value="all">Todas as Matérias</option>
            {subjects.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar tópico ou anotação..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* QUESTION LOGS HISTORY LIST */}
      <div className="space-y-3">
        {filteredLogs.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-3xl border border-slate-200/80 text-slate-500 space-y-2">
            <Target className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-xs font-semibold">Nenhum registro de questões encontrado para os filtros selecionados.</p>
            <button
              onClick={() => setShowForm(true)}
              className="text-xs font-bold text-indigo-600 hover:underline"
            >
              Clique para registrar o primeiro bloco de exercícios
            </button>
          </div>
        ) : (
          filteredLogs.map(log => {
            const sub = subjects.find(s => s.id === log.subjectId);
            return (
              <div
                key={log.id}
                className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-indigo-200 transition space-y-3 relative group"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center space-x-2.5">
                    <span className="p-2 bg-indigo-50 text-indigo-700 rounded-xl font-black text-xs">
                      {sub?.name || 'Matéria'}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 font-display">
                        {log.topic || 'Exercícios Gerais'}
                      </h4>
                      <p className="text-[10px] text-slate-400 flex items-center space-x-2">
                        <span>Origem: {log.source || 'Prática'}</span>
                        <span>•</span>
                        <span>Data: {new Date(log.date + 'T00:00:00').toLocaleDateString('pt-BR')}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <span className={`text-xs font-black px-2.5 py-1 rounded-full border ${
                        log.accuracyRate >= 75
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : log.accuracyRate >= 60
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}>
                        {log.accuracyRate}% Acertos
                      </span>
                      <p className="text-[10px] text-slate-500 font-bold mt-1">
                        {log.correctAnswers} / {log.totalQuestions} questões
                      </p>
                    </div>

                    <button
                      onClick={() => handleDeleteEntry(log.id)}
                      className="p-1.5 text-slate-300 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                      title="Excluir Registro"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Caderno de Erros Notes */}
                {log.notes && (
                  <div className="bg-amber-50/60 border border-amber-200/80 rounded-xl p-3 text-xs text-amber-900 flex items-start space-x-2">
                    <FileText className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-extrabold text-[11px] block text-amber-950 uppercase tracking-wider">
                        Caderno de Erros / Observações:
                      </span>
                      <p className="text-slate-800 text-xs mt-0.5 leading-relaxed">{log.notes}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
