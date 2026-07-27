import React, { useState } from 'react';
import { Subject, BookScanResult } from '../types';
import { Camera, Upload, BookOpen, Sparkles, CheckCircle2, X, FileText, Plus, Layers, ArrowRight, Loader2 } from 'lucide-react';

interface BookTocScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjects: Subject[];
  onAddScannedSubjectOrTopics: (
    targetSubjectId: string | 'new',
    scannedData: BookScanResult
  ) => void;
}

export const BookTocScannerModal: React.FC<BookTocScannerModalProps> = ({
  isOpen,
  onClose,
  subjects,
  onAddScannedSubjectOrTopics
}) => {
  const [activeTab, setActiveTab] = useState<'photo' | 'text'>('photo');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [rawText, setRawText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [scanResult, setScanResult] = useState<BookScanResult | null>(null);
  const [selectedSubjectTarget, setSelectedSubjectTarget] = useState<string>('new');

  if (!isOpen) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setErrorMsg('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage && !rawText.trim()) {
      setErrorMsg('Por favor, tire uma foto do sumário do livro ou cole o texto do índice.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/ai/scan-book-toc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: activeTab === 'photo' ? selectedImage : null,
          rawText: activeTab === 'text' ? rawText : null
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erro ao analisar foto do sumário.');
      }

      setScanResult(data);
    } catch (err: any) {
      setErrorMsg(err.message || 'Ocorreu uma falha ao conectar com a inteligência de escaneamento.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyToEdital = () => {
    if (!scanResult) return;
    onAddScannedSubjectOrTopics(selectedSubjectTarget, scanResult);
    onClose();
    // Reset state
    setScanResult(null);
    setSelectedImage(null);
    setRawText('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 max-w-3xl w-full p-6 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-indigo-100 border border-indigo-200 rounded-2xl">
              <Camera className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 font-display flex items-center space-x-2">
                <span>Scanner de Sumário de Livro Didático</span>
                <span className="bg-amber-100 text-amber-900 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-amber-300">
                  IA + Visão Computacional
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Tire foto do índice do seu livro (Poliedro, FTD, Bernoulli, Moderna) e crie o edital verticalizado em segundos.
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

        {!scanResult ? (
          <div className="space-y-5">
            {/* Mode selection tabs */}
            <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
              <button
                type="button"
                onClick={() => setActiveTab('photo')}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition flex items-center justify-center space-x-2 ${
                  activeTab === 'photo'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Camera className="w-4 h-4" />
                <span>Foto do Sumário / Capa</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('text')}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition flex items-center justify-center space-x-2 ${
                  activeTab === 'text'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Digitar / Colar Sumário</span>
              </button>
            </div>

            {/* Photo Mode */}
            {activeTab === 'photo' && (
              <div className="space-y-3">
                <div className="border-2 border-dashed border-slate-300 hover:border-indigo-500 rounded-2xl p-6 text-center transition bg-slate-50/50">
                  {selectedImage ? (
                    <div className="space-y-3">
                      <img
                        src={selectedImage}
                        alt="Foto do Sumário"
                        className="max-h-60 mx-auto rounded-xl shadow-md border border-slate-200 object-contain"
                      />
                      <div className="flex justify-center gap-3">
                        <label className="bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold px-4 py-2 rounded-xl cursor-pointer transition">
                          <span>Trocar Foto</span>
                          <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                        </label>
                      </div>
                    </div>
                  ) : (
                    <label className="cursor-pointer space-y-3 block">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mx-auto text-indigo-600">
                        <Upload className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-800 block">
                          Clique para selecionar ou arraste a foto do sumário
                        </span>
                        <span className="text-[11px] text-slate-500">
                          Funciona com fotos de livros didáticos, sistemas de ensino e apostilas de cursinho.
                        </span>
                      </div>
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                  )}
                </div>
              </div>
            )}

            {/* Text Mode */}
            {activeTab === 'text' && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">
                  Cole aqui a lista de capítulos ou o sumário do livro:
                </label>
                <textarea
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  rows={6}
                  placeholder="Exemplo:&#10;Capítulo 1: Funções de 1º e 2º Grau&#10;Capítulo 2: Trigonometria no Triângulo Retângulo&#10;Capítulo 3: Geometria Espacial e Prismas"
                  className="w-full bg-slate-50 border border-slate-300 rounded-2xl p-3.5 text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            )}

            {errorMsg && (
              <p className="text-xs text-rose-600 font-semibold bg-rose-50 p-3 rounded-xl border border-rose-200">
                {errorMsg}
              </p>
            )}

            {/* Analyze Button */}
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleAnalyze}
                disabled={isLoading}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs px-6 py-3 rounded-xl shadow transition flex items-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>O Gemini está extraindo os tópicos do livro...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Analisar Sumário com IA</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* RESULT PREVIEW MODE */
          <div className="space-y-6 animate-in fade-in">
            <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-900 uppercase tracking-wider flex items-center space-x-1.5">
                  <BookOpen className="w-4 h-4 text-indigo-600" />
                  <span>Estrutura Identificada pela IA</span>
                </span>
                <span className="text-[10px] bg-indigo-200 text-indigo-900 font-bold px-2.5 py-0.5 rounded-full">
                  {scanResult.publisher || 'Livro Didático'}
                </span>
              </div>

              <h3 className="text-base font-extrabold text-slate-900 font-display">
                {scanResult.bookTitle}
              </h3>

              <p className="text-xs text-slate-600">
                Matéria Sugerida: <strong>{scanResult.suggestedSubject}</strong> ({scanResult.category}) • Total de Capítulos: <strong>{scanResult.chapters.length}</strong>
              </p>
            </div>

            {/* Target Destination Selection */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                Onde você quer adicionar este edital do livro?
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className={`p-3 rounded-xl border cursor-pointer transition flex items-center space-x-2.5 ${
                  selectedSubjectTarget === 'new'
                    ? 'bg-indigo-600 text-white border-indigo-700 font-bold shadow-xs'
                    : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-100'
                }`}>
                  <input
                    type="radio"
                    name="targetSub"
                    checked={selectedSubjectTarget === 'new'}
                    onChange={() => setSelectedSubjectTarget('new')}
                    className="hidden"
                  />
                  <Plus className="w-4 h-4 shrink-0" />
                  <span className="text-xs">Criar Nova Disciplina ("{scanResult.suggestedSubject}")</span>
                </label>

                {subjects.map((sub) => (
                  <label
                    key={sub.id}
                    className={`p-3 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                      selectedSubjectTarget === sub.id
                        ? 'bg-indigo-600 text-white border-indigo-700 font-bold shadow-xs'
                        : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="targetSub"
                        checked={selectedSubjectTarget === sub.id}
                        onChange={() => setSelectedSubjectTarget(sub.id)}
                        className="hidden"
                      />
                      <span className="text-xs truncate">Anexar a: {sub.name}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Preview Chapters */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              <span className="text-xs font-bold uppercase text-slate-500 block">
                Capítulos e Tópicos Extraídos ({scanResult.chapters.flatMap(c => c.topics).length} tópicos no total)
              </span>

              {scanResult.chapters.map((chap, idx) => (
                <div key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                  <span className="text-xs font-bold text-slate-900 block">
                    Capítulo {chap.chapterNumber}: {chap.chapterTitle}
                  </span>
                  <ul className="list-disc list-inside text-[11px] text-slate-600 space-y-0.5">
                    {chap.topics.map((t, ti) => (
                      <li key={ti}>{t}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setScanResult(null)}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 px-4 py-2 rounded-xl transition"
              >
                Voltar e Tirar Outra Foto
              </button>

              <button
                type="button"
                onClick={handleApplyToEdital}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow transition flex items-center space-x-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Anexar Tópicos do Livro ao Cronograma</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
