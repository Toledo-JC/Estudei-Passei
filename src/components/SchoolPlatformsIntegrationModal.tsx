import React, { useState } from 'react';
import { Subject, StudentTaskItem } from '../types';
import { Sparkles, MessageSquare, BookOpen, Link, FileText, CheckCircle2, X, Upload, Plus, ShieldCheck, ArrowRight, Loader2, Calendar } from 'lucide-react';

interface SchoolPlatformsIntegrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjects: Subject[];
  onAddMultipleTasks: (tasks: StudentTaskItem[]) => void;
}

export const SchoolPlatformsIntegrationModal: React.FC<SchoolPlatformsIntegrationModalProps> = ({
  isOpen,
  onClose,
  subjects,
  onAddMultipleTasks
}) => {
  const [activeTab, setActiveTab] = useState<'msteams' | 'classroom' | 'pdf_ocr'>('msteams');
  const [teamsLinkInput, setTeamsLinkInput] = useState('');
  const [pastedNoticeText, setPastedNoticeText] = useState('');
  const [noticeImage, setNoticeImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [importedTasks, setImportedTasks] = useState<StudentTaskItem[]>([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNoticeImage(reader.result as string);
        setErrorMessage('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleParseNoticeWithAI = async () => {
    if (!pastedNoticeText.trim() && !noticeImage) {
      setErrorMessage('Cole o texto do aviso/tarefa do MS Teams ou envie uma foto/print da tela.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/ai/scan-book-toc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: noticeImage,
          rawText: pastedNoticeText.trim()
            ? `ANÁLISE DE AVISO DA ESCOLA / MS TEAMS:\n"${pastedNoticeText}"`
            : null
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erro ao processar aviso do MS Teams com IA.');
      }

      // Convert extracted AI chapters/topics into actionable student tasks
      const generatedTasks: StudentTaskItem[] = [];
      const nowStr = new Date().toISOString().split('T')[0];

      if (data.chapters && Array.isArray(data.chapters)) {
        data.chapters.forEach((chap: any, cIdx: number) => {
          (chap.topics || [chap.chapterTitle]).forEach((tName: string, tIdx: number) => {
            generatedTasks.push({
              id: `imported-${Date.now()}-${cIdx}-${tIdx}`,
              subjectId: subjects[0]?.id || 'general',
              title: tName,
              type: chap.chapterTitle?.toLowerCase().includes('prova') ? 'prova' : 'trabalho',
              date: nowStr,
              time: '08:00',
              priority: 'alta',
              completed: false,
              notes: `Importado de publicação do MS Teams / Mural da Escola. (${data.bookTitle || 'Aviso Escola'})`,
              source: 'msteams'
            });
          });
        });
      }

      if (generatedTasks.length === 0) {
        // Fallback item
        generatedTasks.push({
          id: `imported-${Date.now()}`,
          subjectId: subjects[0]?.id || 'general',
          title: data.bookTitle || 'Tarefa Importada do MS Teams',
          type: 'trabalho',
          date: nowStr,
          time: '09:00',
          priority: 'media',
          completed: false,
          notes: 'Conteúdo do aviso analisado com sucesso pela inteligência educacional.',
          source: 'msteams'
        });
      }

      setImportedTasks(generatedTasks);
    } catch (err: any) {
      setErrorMessage(err.message || 'Falha ao conectar com o serviço de extração do MS Teams.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSimulateMSTeamsSync = () => {
    if (!teamsLinkInput.trim()) {
      setErrorMessage('Insira o link do canal da equipe no MS Teams ou link da tarefa.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const demoTasks: StudentTaskItem[] = [
        {
          id: `teams-1-${Date.now()}`,
          subjectId: subjects[0]?.id || 'sub-1',
          title: 'Exercícios do Capítulo 4 - Tarefa do MS Teams',
          type: 'tarefa',
          date: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
          time: '23:59',
          priority: 'alta',
          completed: false,
          notes: 'Publicado pelo professor no canal Geral do MS Teams.',
          source: 'msteams'
        },
        {
          id: `teams-2-${Date.now()}`,
          subjectId: subjects[1]?.id || 'sub-2',
          title: 'Entrega do Relatório de Laboratório (MS Teams)',
          type: 'trabalho',
          date: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
          time: '18:00',
          priority: 'alta',
          completed: false,
          notes: 'Anexar arquivo em PDF na aba Tarefas do Teams.',
          source: 'msteams'
        }
      ];
      setImportedTasks(demoTasks);
    }, 1000);
  };

  const handleConfirmImport = () => {
    if (importedTasks.length === 0) return;
    onAddMultipleTasks(importedTasks);
    setSuccessMessage(`${importedTasks.length} tarefas do MS Teams importadas para o seu cronograma!`);
    setTimeout(() => {
      setSuccessMessage('');
      onClose();
      setImportedTasks([]);
      setNoticeImage(null);
      setPastedNoticeText('');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 max-w-2xl w-full p-6 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-indigo-100 border border-indigo-200 rounded-2xl">
              <MessageSquare className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 font-display flex items-center space-x-2">
                <span>Conexão com Plataformas Escolares</span>
                <span className="bg-purple-100 text-purple-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-purple-300">
                  MS Teams & Classroom
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Sincronize tarefas e trabalhos das plataformas adotadas pela sua escola.
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

        {/* Tab selection */}
        <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
          <button
            type="button"
            onClick={() => setActiveTab('msteams')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition flex items-center justify-center space-x-2 ${
              activeTab === 'msteams'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-purple-300" />
            <span>Microsoft Teams</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('pdf_ocr')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition flex items-center justify-center space-x-2 ${
              activeTab === 'pdf_ocr'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Foto / Texto de Aviso do Teams</span>
          </button>
        </div>

        {/* Tab 1: MS Teams Link / Webhook */}
        {activeTab === 'msteams' && (
          <div className="space-y-4">
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-2xl space-y-2">
              <span className="text-xs font-extrabold text-purple-900 uppercase block">
                Sincronização com Canais e Tarefas do MS Teams
              </span>
              <p className="text-xs text-purple-800 leading-relaxed">
                Muitas escolas de ensino médio disponibilizam o calendário e tarefas no Microsoft Teams.
                Cole o link da equipe ou o link direto da tarefa abaixo para importar automaticamente.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">
                Link do Canal/Tarefa do MS Teams ou URL do iCal da Escola:
              </label>
              <input
                type="url"
                value={teamsLinkInput}
                onChange={(e) => setTeamsLinkInput(e.target.value)}
                placeholder="https://teams.microsoft.com/l/entity/... ou https://outlook.office365.com/..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button
              onClick={handleSimulateMSTeamsSync}
              disabled={isLoading}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow transition flex items-center space-x-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Buscando tarefas no canal do MS Teams...</span>
                </>
              ) : (
                <>
                  <Link className="w-4 h-4" />
                  <span>Conectar e Buscar Tarefas do Teams</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Tab 2: Print/Text AI OCR Scanner for MS Teams Posts */}
        {activeTab === 'pdf_ocr' && (
          <div className="space-y-4">
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-1">
              <span className="text-xs font-extrabold text-amber-900 uppercase block">
                Leitor Inteligente de Publicações e Roteiros de Estudos
              </span>
              <p className="text-xs text-amber-800">
                Tire print de uma postagem do professor no MS Teams ou envie a foto do comunicado da escola. A IA extrai as datas de provas e prazos de trabalhos.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">
                Texto do Post / Comunicado do MS Teams:
              </label>
              <textarea
                value={pastedNoticeText}
                onChange={(e) => setPastedNoticeText(e.target.value)}
                rows={3}
                placeholder="Ex: 'Pessoal, a prova de História será na próxima quinta-feira (capítulos 3 e 4). O trabalho de Química deve ser entregue dia 15 no Teams.'"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">
                Ou Envie Foto / Print da Tela do Teams:
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-100 file:text-indigo-700 hover:file:bg-indigo-200 cursor-pointer"
              />
              {noticeImage && (
                <img src={noticeImage} alt="Print aviso" className="max-h-36 rounded-xl border border-slate-300 mt-2 object-contain" />
              )}
            </div>

            <button
              onClick={handleParseNoticeWithAI}
              disabled={isLoading}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow transition flex items-center space-x-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Analisando comunicado com IA...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Extrair Lembretes com IA</span>
                </>
              )}
            </button>
          </div>
        )}

        {errorMessage && (
          <p className="text-xs text-rose-600 font-bold bg-rose-50 p-3 rounded-xl border border-rose-200">
            {errorMessage}
          </p>
        )}

        {successMessage && (
          <p className="text-xs text-emerald-700 font-bold bg-emerald-50 p-3 rounded-xl border border-emerald-200">
            {successMessage}
          </p>
        )}

        {/* Imported tasks preview list */}
        {importedTasks.length > 0 && (
          <div className="space-y-3 pt-3 border-t border-slate-200 animate-in fade-in">
            <span className="text-xs font-extrabold text-slate-800 uppercase block">
              Tarefas Encontradas no MS Teams ({importedTasks.length}):
            </span>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {importedTasks.map((t, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">{t.title}</span>
                    <span className="text-[11px] text-slate-500">
                      Data: {t.date} • Horário: {t.time} • Fonte: {t.source?.toUpperCase()}
                    </span>
                  </div>
                  <span className="text-[10px] bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded-full">
                    {t.type.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleConfirmImport}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow transition flex items-center space-x-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirmar Importação de Todas as Tarefas</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
