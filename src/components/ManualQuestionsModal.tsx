import React, { useState } from 'react';
import { Subject, QuestionValidationMode, ManualQuestionLog } from '../types';
import { BookOpen, CheckCircle2, Target, X, Save, Sparkles, Camera, ShieldCheck, UserCheck, AlertTriangle, Image as ImageIcon, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface ManualQuestionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjects: Subject[];
  initialSubjectId?: string;
  initialTopic?: string;
}

export const ManualQuestionsModal: React.FC<ManualQuestionsModalProps> = ({
  isOpen,
  onClose,
  subjects,
  initialSubjectId = '',
  initialTopic = ''
}) => {
  const { logFamilyAudit, user } = useAuth();
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(initialSubjectId || subjects[0]?.id || '');
  const [topicName, setTopicName] = useState<string>(initialTopic || '');
  const [logDate, setLogDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [totalQuestions, setTotalQuestions] = useState<number | ''>(15);
  const [correctAnswers, setCorrectAnswers] = useState<number | ''>(12);
  const [source, setSource] = useState<string>('Livro Didático da Escola');
  const [notes, setNotes] = useState<string>('');
  
  // Photo & AI Verification State
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string>('');
  const [aiErrorMsg, setAiErrorMsg] = useState<string>('');

  // Read Parent Validation Settings
  const getValidationMode = (): QuestionValidationMode => {
    const saved = localStorage.getItem('estudei_validation_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.mode) return parsed.mode;
      } catch (e) { }
    }
    return 'trust'; // default
  };

  const validationMode = getValidationMode();

  if (!isOpen) return null;

  const numTotal = typeof totalQuestions === 'number' ? totalQuestions : 0;
  const numCorrect = typeof correctAnswers === 'number' ? correctAnswers : 0;
  const numWrong = Math.max(0, numTotal - numCorrect);
  const accuracyPct = numTotal > 0 ? Math.round((numCorrect / numTotal) * 100) : 0;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      alert('A foto deve ter no máximo 8MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setImageBase64(base64);
      setImagePreview(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveManualQuestions = async (e: React.FormEvent) => {
    e.preventDefault();
    setAiErrorMsg('');

    if (!selectedSubjectId || numTotal <= 0 || numCorrect < 0 || numCorrect > numTotal) {
      alert('Por favor, selecione a matéria e preencha um número válido de questões e acertos.');
      return;
    }

    const currentSub = subjects.find(s => s.id === selectedSubjectId);
    let finalStatus: 'approved' | 'pending' = 'approved';
    let aiFeedbackText = '';
    let aiConfidenceVal = 100;
    let aiEstCount = numTotal;

    // IF AI Verified mode or photo is attached, run Gemini Vision audit
    if ((validationMode === 'ai_verified' || imageBase64) && imageBase64) {
      setIsAnalyzing(true);
      try {
        const response = await fetch('/api/ai/analyze-question-photo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageBase64,
            claimedTotal: numTotal,
            claimedCorrect: numCorrect,
            subjectName: currentSub?.name || 'Geral',
            topicName: topicName || 'Geral'
          })
        });

        if (!response.ok) {
          throw new Error('Falha na comunicação com a API de auditoria de visão.');
        }

        const data = await response.json();
        aiFeedbackText = data.aiFeedback || 'Imagem auditada pela IA Gemini Vision.';
        aiConfidenceVal = data.aiConfidence || 85;
        aiEstCount = data.aiEstimatedQuestions || numTotal;

        // Anti-cheat comparison rule:
        // Difference between claimed total and AI estimated visible count
        const diffRatio = Math.abs(numTotal - aiEstCount) / Math.max(numTotal, 1);

        if (data.isStudyMaterial && diffRatio <= 0.25) {
          // Coherent photo -> Auto approve
          finalStatus = 'approved';
        } else {
          // Discrepant photo or not study material -> Flag for parent approval
          finalStatus = 'pending';
          aiFeedbackText = `Atenção: A IA detectou cerca de ${aiEstCount} questões visíveis, diferente dos ${numTotal} declarados. Encaminhado para revisão dos pais.`;
        }
      } catch (error: any) {
        console.error('Erro na auditoria da imagem:', error);
        if (validationMode === 'ai_verified') {
          finalStatus = 'pending';
          aiFeedbackText = 'Não foi possível analisar a imagem automaticamente. Enviado para aprovação dos pais.';
        }
      } finally {
        setIsAnalyzing(false);
      }
    } else if (validationMode === 'parent_approved') {
      finalStatus = 'pending';
    } else {
      finalStatus = 'approved';
    }

    const newEntry: ManualQuestionLog = {
      id: `q-manual-${Date.now()}`,
      studentUid: user?.uid || 'guest-student',
      studentName: user?.displayName || 'Estudante',
      subjectId: selectedSubjectId,
      subjectName: currentSub?.name,
      topic: topicName || 'Exercícios do Livro/Caderno',
      date: logDate,
      totalQuestions: numTotal,
      correctAnswers: numCorrect,
      wrongAnswers: numWrong,
      accuracyRate: accuracyPct,
      source: source || 'Livro / Caderno',
      notes,
      photoURL: imagePreview || undefined,
      validationMode,
      validationStatus: finalStatus,
      validatedByUid: finalStatus === 'approved' ? (validationMode === 'ai_verified' ? 'ai' : user?.uid) : undefined,
      aiConfidence: aiConfidenceVal,
      aiEstimatedQuestions: aiEstCount,
      aiFeedback: aiFeedbackText || undefined,
      createdAt: new Date().toISOString()
    };

    // Save to localStorage questions log
    const STORAGE_KEY = 'estudei_questions_log_entries';
    const existing = localStorage.getItem(STORAGE_KEY);
    let logsArray: ManualQuestionLog[] = [];
    if (existing) {
      try { logsArray = JSON.parse(existing); } catch (e) { logsArray = []; }
    }
    logsArray.unshift(newEntry);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(logsArray));

    // Log Family Audit Event
    logFamilyAudit(
      'questoes_respostas',
      `Lançamento manual (${finalStatus === 'approved' ? 'Aprovado' : 'Pendente de validação'}): ${numTotal} questões de ${currentSub?.name || 'Matéria'} (${accuracyPct}% acertos). Modo: ${validationMode}`
    );

    if (finalStatus === 'approved') {
      setSuccessMsg('Exercícios manuais contabilizados e validados com sucesso!');
    } else {
      setSuccessMsg('Exercícios salvos e enviados para confirmação dos pais no painel parental.');
    }

    setTimeout(() => {
      setSuccessMsg('');
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-5 text-white relative flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-indigo-600/40 rounded-2xl border border-indigo-400/30">
              <BookOpen className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="text-base font-extrabold font-display">Lançar Questões do Livro ou Caderno</h3>
              <p className="text-xs text-indigo-200">
                Contabilize exercícios feitos à mão na plataforma
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

        {/* Validation Mode Indicator Badge */}
        <div className="px-6 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
          <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
            Modo de Validação Ativo:
          </span>
          {validationMode === 'trust' && (
            <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-bold text-[11px] flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Modo Confiança (Direto)</span>
            </span>
          )}
          {validationMode === 'parent_approved' && (
            <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 rounded-full font-bold text-[11px] flex items-center space-x-1">
              <UserCheck className="w-3.5 h-3.5" />
              <span>Aprovação Parental Requerida</span>
            </span>
          )}
          {validationMode === 'ai_verified' && (
            <span className="px-2.5 py-0.5 bg-indigo-100 text-indigo-800 rounded-full font-bold text-[11px] flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Auditoria por IA Gemini Vision</span>
            </span>
          )}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSaveManualQuestions} className="p-6 space-y-4">
          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 text-xs font-bold flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Matéria Estudada *</label>
              <select
                value={selectedSubjectId}
                onChange={(e) => setSelectedSubjectId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-hidden focus:border-indigo-500"
                required
              >
                {subjects.map(sub => (
                  <option key={sub.id} value={sub.id}>{sub.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Data dos Exercícios</label>
              <input
                type="date"
                value={logDate}
                onChange={(e) => setLogDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-hidden focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Tópico ou Capítulo do Livro</label>
            <input
              type="text"
              value={topicName}
              onChange={(e) => setTopicName(e.target.value)}
              placeholder="Ex: Cap. 4 - Leis de Newton / Exercícios de Fixação"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-indigo-500"
            />
          </div>

          {/* Quantities */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 bg-indigo-50/50 border border-indigo-100 rounded-2xl">
            <div>
              <label className="block text-[11px] font-extrabold text-slate-700 mb-1">Total de Questões</label>
              <input
                type="number"
                min="1"
                value={totalQuestions}
                onChange={(e) => setTotalQuestions(e.target.value === '' ? '' : parseInt(e.target.value))}
                className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-hidden focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-extrabold text-emerald-800 mb-1">Acertos</label>
              <input
                type="number"
                min="0"
                max={numTotal}
                value={correctAnswers}
                onChange={(e) => setCorrectAnswers(e.target.value === '' ? '' : parseInt(e.target.value))}
                className="w-full px-3 py-1.5 bg-white border border-emerald-300 text-emerald-950 rounded-xl text-sm font-bold focus:outline-hidden focus:border-emerald-500"
                required
              />
            </div>

            <div className="col-span-2 sm:col-span-1 flex flex-col justify-center bg-white p-2 border border-slate-200 rounded-xl text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Taxa de Acerto</span>
              <span className={`text-sm font-extrabold font-mono ${accuracyPct >= 70 ? 'text-emerald-600' : 'text-amber-600'}`}>
                {accuracyPct}% ({numCorrect}/{numTotal})
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Fonte / Material</label>
            <select
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-hidden focus:border-indigo-500"
            >
              <option value="Livro Didático da Escola">Livro Didático da Escola</option>
              <option value="Apostila / Caderno">Apostila / Caderno</option>
              <option value="Lista de Exercícios do Professor">Lista de Exercícios do Professor</option>
              <option value="Provas Antigas / Simulado no Papel">Provas Antigas / Simulado no Papel</option>
              <option value="Outros Exercícios Manuais">Outros Exercícios Manuais</option>
            </select>
          </div>

          {/* Photo Upload Area (Required for AI Verified mode, optional for others) */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                <Camera className="w-4 h-4 text-indigo-600" />
                <span>Foto da Página Resolvida {validationMode === 'ai_verified' ? '(Obrigatória p/ IA)' : '(Opcional)'}</span>
              </label>
            </div>

            <div className="flex items-center space-x-3">
              <label className="px-3 py-2 bg-white border border-slate-300 hover:border-indigo-500 rounded-xl text-xs font-bold text-slate-700 cursor-pointer transition flex items-center space-x-1.5 shadow-2xs">
                <ImageIcon className="w-4 h-4 text-indigo-600" />
                <span>Anexar / Tirar Foto</span>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>

              {imagePreview && (
                <div className="flex items-center space-x-2">
                  <img
                    src={imagePreview}
                    alt="Preview da resolução"
                    className="w-10 h-10 object-cover rounded-lg border border-slate-300"
                  />
                  <button
                    type="button"
                    onClick={() => { setImageBase64(null); setImagePreview(null); }}
                    className="text-[11px] font-bold text-rose-600 hover:underline"
                  >
                    Remover
                  </button>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Anotações / Dúvidas Encontradas (Opcional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="Ex: Errei a questão 8 por erro de conta de fração. Levar para tirar dúvida..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-indigo-500"
            />
          </div>

          {/* Footer buttons */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isAnalyzing}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-extrabold shadow-sm transition flex items-center space-x-1.5 disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Auditando Foto com IA...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Contabilizar Exercícios</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
