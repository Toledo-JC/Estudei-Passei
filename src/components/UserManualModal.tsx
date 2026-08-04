import React, { useState } from 'react';
import { 
  BookOpen, X, ShieldCheck, Heart, Sparkles, GraduationCap, 
  HelpCircle, Clock, Award, Users, CheckCircle2, ChevronDown, ChevronRight, Download, Search, AlertCircle, MessageSquare, Brain,
  ShieldAlert, Trophy, FileCheck
} from 'lucide-react';

interface UserManualModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserManualModal: React.FC<UserManualModalProps> = ({ isOpen, onClose }) => {
  const [activeChapter, setActiveChapter] = useState<'welcome' | 'ch1' | 'ch2' | 'ch3' | 'ch4' | 'ch5' | 'ch6' | 'ch7' | 'ch8' | 'ch9' | 'ch10' | 'ch11' | 'faq'>('welcome');
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleDownloadMarkdown = () => {
    const markdownContent = `# MANUAL DO USUÁRIO — ESTUDEI & PASSEI (EDIÇÃO FAMÍLIA)

## BOAS-VINDAS: NOSSA FILOSOFIA DE APOIO E INCENTIVO
Bem-vindo ao **Estudei & Passei**! Este aplicativo foi cuidadosamente concebido para servir como uma ponte de confiança entre pais e filhos durante os anos decisivos do Ensino Médio.
Nossa premissa fundamental é: **Apoiar, celebrar e guiar — nunca vigiar ou punir.**
Acreditamos que o aprendizado verdadeiro floresce quando o estudante desenvolve autonomia, autorregulação e disciplina consciente, respaldado por pais que vibram com cada vitória e oferecem suporte nos momentos de dúvida.

---

## CAPÍTULO 1: PRIMEIROS PASSOS E VÍNCULO FAMILIAR
1. **Perfil do Responsável (Pai/Mãe):** Crie sua conta com email/senha ou Google.
2. **Código Familiar:** Um código único (ex: FAM-8923) é gerado automaticamente para o seu grupo familiar.
3. **Convidando Filhos:** Envie o link pré-formatado via WhatsApp. Ao criar o perfil de estudante com esse código, o filho é vinculado instantaneamente.
4. **Múltiplos Responsáveis:** Um segundo pai/mãe pode entrar no mesmo grupo familiar usando o mesmo Código Familiar.

---

## CAPÍTULO 2: ESTUDANDO COM FOCO (O MODO DO ALUNO)
- **Técnica Pomodoro Adaptativa:** Blocos de 25 ou 50 minutos de estudos com micro-pausas programadas.
- **Registro de Qualidade:** Ao finalizar, avalie de 1 a 5 estrelas o quão bem absorveu o conteúdo.
- **Flashcards e Quizzes de Active Recall:** Teste seu conhecimento ativamente antes das provas.
- **Repetição Espaçada:** Revisões automáticas aos 1d, 7d e 30d para fixação no longo prazo.

---

## CAPÍTULO 3: A VISÃO DOS PAIS — ACOMPANHAMENTO SEM PRESSÃO
- **Seletor de Aluno Ativo (Conta-Switcher):** Alterna instantaneamente a visão entre os filhos da família.
- **Horas Líquidas de Estudo:** Veja a dedicação real, livre de distrações.
- **Reações Rápidas:** Envie incentivos com 1 clique (👏 Orgulhoso, 🚀 Mandou bem, 💪 Força total).

---

## CAPÍTULO 4: ACORDO DE CONFIANÇA FAMILIAR
Definam metas diárias em conjunto (ex: 90 minutos de estudo). O acordo é firmado quando o estudante aceita no seu painel. Cumprir o acordo gera selos de confiança e recompensas combinadas em família!

---

## CAPÍTULO 5: DESAFIOS EM FAMÍLIA (ENTRE IRMÃOS)
Estimule a constância saudável entre irmãos com desafios de Streak de Dias, Horas de Foco ou Resolução de Quizzes. O placar é atualizado em tempo real com mensagens motivacionais.

---

## CAPÍTULO 6: DIAGNÓSTICO DE LACUNAS POR IA
A IA (Google Gemini) analisa as notas, tempos e avaliações de qualidade para gerar um relatório analítico dos tópicos críticos.
*Aviso Importante: O diagnóstico é uma ferramenta de apoio analítico e não substitui a orientação dos professores.*

---

## CAPÍTULO 7: ROTINA DE ESTUDOS SAUDÁVEL
- **Regra dos 50/10:** Descanse a mente por 10 minutos a cada 50 de foco.
- **Sono Renovador:** Dormir de 7h a 9h consolida a memória de longo prazo.
- **Ambiente sem Distrações:** Mantenha o celular fora do alcance visual durante as sessões de foco.

---

## CAPÍTULO 8: EMBASAMENTO PEDAGÓGICO, TÉCNICAS E TÁTICAS DIDÁTICAS
O **Estudei & Passei** é fundamentado em neurociência cognitiva e metodologias ativas de aprendizagem:
1. **Recuperação Ativa (Active Recall):** Quizzes por IA e Flashcards fortalecem a recuperação da memória (Roediger & Karpicke).
2. **Repetição Espaçada:** Micro-revisões automáticas (24h, 7d, 30d) combatem a Curva de Ebbinghaus.
3. **Carga Cognitiva e Pomodoro:** Blocos curtos evitam a fadiga mental e a ansiedade (Sweller).
4. **Metacognição:** Avaliação de qualidade e reflexão pós-prova geram autorregulação (Flavell).
5. **Instrução Diferenciada e Modo Recuperação:** Suporte acolhedor a alunos com diferentes dificuldades (Tomlinson).
6. **Teoria da Autodeterminação:** Parceria familiar e acordo de confiança promovem motivação intrínseca (Deci & Ryan).

---

## FAQ — PERGUNTAS FREQUENTES
- **Os pais podem ver tudo o que o aluno digita?** Não! Os pais veem métricas consolidadas (tempo, matérias, notas) preservando a privacidade das anotações do aluno.
- **Como funciona o modo offline?** O aplicativo salva o progresso localmente e sincroniza com o servidor assim que a conexão retornar.
`;

    const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Manual_Usuario_Estudei_e_Passei.md';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-3 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-5xl text-slate-100 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden my-auto">
        
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-indigo-900/80 via-slate-900 to-amber-950/50 p-4 sm:p-6 border-b border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-lg shrink-0">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg sm:text-xl font-extrabold font-display text-white">
                  Manual do Usuário & Central de Ajuda
                </h2>
                <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                  Edição Família
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Guia completo para estudantes e responsáveis com foco em incentivo e autonomia.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleDownloadMarkdown}
              className="hidden sm:flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold px-3 py-2 rounded-xl border border-slate-700 transition"
              title="Baixar manual completo em formato Markdown"
            >
              <Download className="w-4 h-4" />
              <span>Baixar (MD)</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body Layout */}
        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
          
          {/* Sidebar Navigation */}
          <div className="w-full md:w-64 bg-slate-950/60 border-r border-slate-800 p-3 flex flex-col gap-1 overflow-y-auto shrink-0">
            <button
              onClick={() => setActiveChapter('welcome')}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-between ${
                activeChapter === 'welcome' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Heart className="w-4 h-4 shrink-0" />
                <span>Carta de Boas-Vindas</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            <button
              onClick={() => setActiveChapter('ch1')}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-between ${
                activeChapter === 'ch1' ? 'bg-indigo-600 text-white shadow' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 shrink-0 text-indigo-400" />
                <span>Cap 1: Vínculo Familiar</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            <button
              onClick={() => setActiveChapter('ch2')}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-between ${
                activeChapter === 'ch2' ? 'bg-indigo-600 text-white shadow' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center space-x-2">
                <GraduationCap className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>Cap 2: Estudando com Foco</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            <button
              onClick={() => setActiveChapter('ch3')}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-between ${
                activeChapter === 'ch3' ? 'bg-indigo-600 text-white shadow' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 shrink-0 text-amber-400" />
                <span>Cap 3: A Visão dos Pais</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            <button
              onClick={() => setActiveChapter('ch4')}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-between ${
                activeChapter === 'ch4' ? 'bg-indigo-600 text-white shadow' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-sky-400" />
                <span>Cap 4: Acordo de Confiança</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            <button
              onClick={() => setActiveChapter('ch5')}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-between ${
                activeChapter === 'ch5' ? 'bg-indigo-600 text-white shadow' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Award className="w-4 h-4 shrink-0 text-yellow-400" />
                <span>Cap 5: Desafios em Família</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            <button
              onClick={() => setActiveChapter('ch6')}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-between ${
                activeChapter === 'ch6' ? 'bg-indigo-600 text-white shadow' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 shrink-0 text-purple-400" />
                <span>Cap 6: Diagnóstico por IA</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            <button
              onClick={() => setActiveChapter('ch7')}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-between ${
                activeChapter === 'ch7' ? 'bg-indigo-600 text-white shadow' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 shrink-0 text-rose-400" />
                <span>Cap 7: Rotina Saudável</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            <button
              onClick={() => setActiveChapter('ch8')}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-between ${
                activeChapter === 'ch8' ? 'bg-indigo-600 text-white shadow' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Brain className="w-4 h-4 shrink-0 text-amber-400" />
                <span>Cap 8: Embasamento Pedagógico</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            <button
              onClick={() => setActiveChapter('ch9')}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-between ${
                activeChapter === 'ch9' ? 'bg-indigo-600 text-white shadow' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center space-x-2">
                <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
                <span>Cap 9: Validação & Antitrapaça</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            <button
              onClick={() => setActiveChapter('ch10')}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-between ${
                activeChapter === 'ch10' ? 'bg-indigo-600 text-white shadow' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Trophy className="w-4 h-4 shrink-0 text-amber-300" />
                <span>Cap 10: Ranking & Olimpíadas</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            <button
              onClick={() => setActiveChapter('ch11')}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-between ${
                activeChapter === 'ch11' ? 'bg-indigo-600 text-white shadow' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>Cap 11: Cronômetro Inteligente</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            <div className="my-2 border-t border-slate-800" />

            <button
              onClick={() => setActiveChapter('faq')}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-between ${
                activeChapter === 'faq' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center space-x-2">
                <HelpCircle className="w-4 h-4 shrink-0" />
                <span>Perguntas Frequentes (FAQ)</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>
          </div>

          {/* Main Reading Pane */}
          <div className="flex-1 p-5 sm:p-8 overflow-y-auto space-y-6 text-sm text-slate-200">
            
            {activeChapter === 'welcome' && (
              <div className="space-y-4">
                <div className="bg-amber-500/10 border border-amber-500/30 p-5 rounded-2xl space-y-3">
                  <div className="flex items-center space-x-2 text-amber-400 font-extrabold text-base">
                    <Heart className="w-5 h-5" />
                    <span>Carta de Apresentação: A Filosofia Estudei & Passei</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed text-xs sm:text-sm">
                    Prezada família e estudante,
                  </p>
                  <p className="text-slate-300 leading-relaxed text-xs sm:text-sm">
                    O Ensino Médio é uma das fases mais transformadoras e intensas da vida. Entre vestibulares, provas escolares e descobertas pessoais, a pressão pode facilmente transformar os estudos em motivo de atrito familiar.
                  </p>
                  <p className="text-slate-300 leading-relaxed text-xs sm:text-sm">
                    O **Estudei & Passei** foi construído com uma missão clara: **substituir a vigilância pelo incentivo**. Não queremos que os pais sejam fiscais do tempo, mas sim parceiros de jornada que celebram a constância e entendem os momentos de dificuldade.
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 pt-2">
                  <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60 space-y-2">
                    <h4 className="font-bold text-amber-400 text-sm flex items-center space-x-1.5">
                      <span>🎯</span>
                      <span>Para o Estudante: Autonomia</span>
                    </h4>
                    <p className="text-xs text-slate-300">
                      Você tem o controle total do seu planejamento. Monte seu horário, execute suas sessões com Pomodoro, responda aos quizzes da IA e acompanhe sua própria evolução.
                    </p>
                  </div>

                  <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60 space-y-2">
                    <h4 className="font-bold text-amber-400 text-sm flex items-center space-x-1.5">
                      <span>👨‍👩‍👧</span>
                      <span>Para os Pais: Tranquilidade</span>
                    </h4>
                    <p className="text-xs text-slate-300">
                      Veja os frutos do esforço em tempo real sem precisar perguntar a todo momento "já estudou hoje?". Envie mensagens de orgulho e firme acordos de confiança.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeChapter === 'ch1' && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-indigo-400 font-display flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>Capítulo 1: Primeiro Passos e Vínculo Familiar</span>
                </h3>

                <div className="space-y-3 text-xs sm:text-sm leading-relaxed">
                  <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 space-y-2">
                    <h4 className="font-bold text-white text-sm">1. Cadastro e Código Familiar</h4>
                    <p className="text-slate-300">
                      Ao criar sua conta como Responsável (Pai/Mãe), o sistema gera automaticamente o seu **Código Familiar** único (por exemplo: <span className="bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded font-mono font-bold">FAM-8923</span>).
                    </p>
                  </div>

                  <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 space-y-2">
                    <h4 className="font-bold text-white text-sm">2. Convidando Filhos via WhatsApp</h4>
                    <p className="text-slate-300">
                      No painel parental, clique em **📲 Convidar Filho no WhatsApp**. O aplicativo gera um link pré-formatado. Quando seu filho abrir o link e criar o perfil de estudante, a vinculação ocorre instantaneamente.
                    </p>
                  </div>

                  <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 space-y-2">
                    <h4 className="font-bold text-white text-sm">3. Múltiplos Responsáveis</h4>
                    <p className="text-slate-300">
                      Outros membros da família (outro pai, mãe ou tutor) também podem participar ativamente. Basta clicar em **👨‍👩‍👧 Convidar Outro Responsável** para compartilhar o código familiar.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeChapter === 'ch2' && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-emerald-400 font-display flex items-center space-x-2">
                  <GraduationCap className="w-5 h-5" />
                  <span>Capítulo 2: Estudando com Foco (O Modo do Aluno)</span>
                </h3>

                <div className="space-y-3 text-xs sm:text-sm">
                  <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 space-y-2">
                    <h4 className="font-bold text-white text-sm">⏳ Cronômetro Pomodoro e Foco Livre</h4>
                    <p className="text-slate-300">
                      Escolha blocos de 25 minutos (estudo inicial) ou 50 minutos (foco profundo). O aplicativo monitora o tempo mantendo o ambiente limpo de distrações.
                    </p>
                  </div>

                  <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 space-y-2">
                    <h4 className="font-bold text-white text-sm">⭐ Registro de Qualidade (1 a 5 estrelas)</h4>
                    <p className="text-slate-300">
                      Ao encerrar a sessão, registre quantas estrelas representa seu entendimento. Isso alimenta o **Algoritmo Adaptativo** que recalcula a prioridade das próximas matérias!
                    </p>
                  </div>

                  <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 space-y-2">
                    <h4 className="font-bold text-white text-sm">🧠 Flashcards e Quizzes IA (Active Recall)</h4>
                    <p className="text-slate-300">
                      A Inteligência Artificial lê seus tópicos e gera questões sob medida no formato de vestibulares (ENEM, FUVEST) para testar a retenção ativa da memória.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeChapter === 'ch3' && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-amber-400 font-display flex items-center space-x-2">
                  <ShieldCheck className="w-5 h-5" />
                  <span>Capítulo 3: A Visão dos Pais (Acompanhamento sem Pressão)</span>
                </h3>

                <div className="space-y-3 text-xs sm:text-sm">
                  <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 space-y-2">
                    <h4 className="font-bold text-white text-sm">👦 Seletor de Filho Ativo (Conta-Switcher)</h4>
                    <p className="text-slate-300">
                      Se você tem mais de um filho no Ensino Médio, use o **Seletor de Aluno Ativo** no topo da tela para alternar suavemente entre os relatórios sem precisar deslogar!
                    </p>
                  </div>

                  <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 space-y-2">
                    <h4 className="font-bold text-white text-sm">👏 Reações Rápidas e Encorajamento</h4>
                    <p className="text-slate-300">
                      Ao ver que seu filho concluiu um bloco de estudos ou atingiu uma meta, clique nos botões de reação para enviar uma notificação positiva direto no aplicativo dele.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeChapter === 'ch4' && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-sky-400 font-display flex items-center space-x-2">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Capítulo 4: Acordo de Confiança Familiar</span>
                </h3>

                <p className="text-slate-300 text-xs sm:text-sm">
                  Em vez de impor horários, sente-se com seu filho e estabeleçam um **Acordo de Confiança**.
                </p>

                <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 space-y-3 text-xs sm:text-sm">
                  <p className="font-bold text-amber-300">Como funciona o fluxo do Acordo:</p>
                  <ol className="list-decimal list-inside space-y-2 text-slate-300">
                    <li>O pai/mãe propõe a meta diária (ex: 90 minutos de estudo).</li>
                    <li>O estudante recebe a proposta e aceita com um toque.</li>
                    <li>O sistema rastreia o cumprimento diário e exibe o selo **Acordo em Dia** no topo do painel.</li>
                    <li>Recompensas acordadas (ex: passeio no final de semana) são combinadas em família!</li>
                  </ol>
                </div>
              </div>
            )}

            {activeChapter === 'ch5' && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-yellow-400 font-display flex items-center space-x-2">
                  <Award className="w-5 h-5" />
                  <span>Capítulo 5: Desafios Colaborativos entre Irmãos</span>
                </h3>

                <p className="text-slate-300 text-xs sm:text-sm">
                  Para famílias com 2 ou mais filhos cadastrados, os **Desafios entre Irmãos** promovem o engajamento através da competição amigável.
                </p>

                <div className="grid sm:grid-cols-3 gap-3">
                  <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 text-center space-y-1">
                    <span className="text-xl">🔥</span>
                    <h5 className="font-bold text-white text-xs">Desafio de Streak</h5>
                    <p className="text-[11px] text-slate-400">Quem mantém mais dias seguidos estudando</p>
                  </div>

                  <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 text-center space-y-1">
                    <span className="text-xl">⏱️</span>
                    <h5 className="font-bold text-white text-xs">Desafio de Horas</h5>
                    <p className="text-[11px] text-slate-400">Quem soma mais tempo líquido na semana</p>
                  </div>

                  <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 text-center space-y-1">
                    <span className="text-xl">🎯</span>
                    <h5 className="font-bold text-white text-xs">Desafio de Quizzes</h5>
                    <p className="text-[11px] text-slate-400">Maior pontuação acumulada em quizzes</p>
                  </div>
                </div>
              </div>
            )}

            {activeChapter === 'ch6' && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-purple-400 font-display flex items-center space-x-2">
                  <Sparkles className="w-5 h-5" />
                  <span>Capítulo 6: Diagnóstico de Lacunas por Inteligência Artificial</span>
                </h3>

                <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 space-y-3 text-xs sm:text-sm">
                  <p className="text-slate-300">
                    A IA do Google Gemini analisa o histórico de notas, autoavaliações de qualidade e tempo gasto para detectar tópicos que demandam atenção urgente antes das avaliações escolares.
                  </p>

                  <div className="bg-amber-500/10 border border-amber-500/30 p-3.5 rounded-xl text-amber-200 text-xs flex items-start space-x-2.5">
                    <AlertCircle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
                    <span>
                      <strong>Aviso pedagógico:</strong> O relatório gerado pela IA é uma ferramenta de suporte analítico para priorização e não substitui os conselhos de classe, orientadores ou professores do colégio.
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeChapter === 'ch7' && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-rose-400 font-display flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>Capítulo 7: Dicas para uma Rotina de Estudos Saudável</span>
                </h3>

                <div className="space-y-3 text-xs sm:text-sm">
                  <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 space-y-1">
                    <h4 className="font-bold text-white text-sm">💤 1. Higiene do Sono</h4>
                    <p className="text-slate-300">
                      Dormir menos de 7 horas prejudica a consolidação da memória no hipocampo. O sono é a fase onde o cérebro grava o que foi estudado!
                    </p>
                  </div>

                  <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 space-y-1">
                    <h4 className="font-bold text-white text-sm">💧 2. Hidratação e Pausas</h4>
                    <p className="text-slate-300">
                      Beba água durante as pausas do Pomodoro. Desconecte do celular no intervalo para descansar o córtex pré-frontal.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeChapter === 'ch8' && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-amber-400 font-display flex items-center space-x-2">
                  <Brain className="w-5 h-5" />
                  <span>Capítulo 8: Embasamento Pedagógico, Técnicas e Táticas Didáticas</span>
                </h3>

                <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-xl space-y-2 text-xs sm:text-sm text-slate-200">
                  <p className="font-semibold text-amber-300">Fundamentação Científica da Proposta Didática:</p>
                  <p className="text-slate-300 leading-relaxed">
                    O <strong>Estudei & Passei</strong> combina neurociência cognitiva, aprendizagem ativa e motivação intrínseca para apoiar estudantes de todos os perfis e níveis de facilidade ou dificuldade.
                  </p>
                </div>

                <div className="space-y-3 text-xs sm:text-sm">
                  <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 space-y-1">
                    <h4 className="font-bold text-emerald-400 text-xs sm:text-sm">1. Recuperação Ativa (Active Recall) — Roediger & Karpicke (2006)</h4>
                    <p className="text-slate-300">
                      Substitui a leitura passiva ineficiente por testes práticos (Quizzes IA, Flashcards). Resgatar ativamente o conteúdo fortalece as conexões neurais e fixa o aprendizado no longo prazo.
                    </p>
                  </div>

                  <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 space-y-1">
                    <h4 className="font-bold text-sky-400 text-xs sm:text-sm">2. Repetição Espaçada — Curva de Ebbinghaus</h4>
                    <p className="text-slate-300">
                      Garante revisões automáticas aos 1, 7 e 30 dias após o primeiro estudo de cada tópico, neutralizando o esquecimento natural antes dos vestibulares.
                    </p>
                  </div>

                  <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 space-y-1">
                    <h4 className="font-bold text-purple-400 text-xs sm:text-sm">3. Gestão de Carga Cognitiva — Sweller (Cognitive Load Theory)</h4>
                    <p className="text-slate-300">
                      Sessões Pomodoro de 25min ou 50min respeitam o limite da memória de trabalho, prevenindo o esgotamento mental e a ansiedade escolar.
                    </p>
                  </div>

                  <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 space-y-1">
                    <h4 className="font-bold text-amber-400 text-xs sm:text-sm">4. Metacognição e Autorregulação — Flavell & Zimmerman</h4>
                    <p className="text-slate-300">
                      O registro da nota de absorção (1 a 5 estrelas) e o acompanhamento de "O que errei mais?" estimulam o estudante a compreender como ele aprende e onde precisa ajustar a tática.
                    </p>
                  </div>

                  <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 space-y-1">
                    <h4 className="font-bold text-rose-400 text-xs sm:text-sm">5. Modo Recuperação Acolhedor & Instrução Diferenciada — Tomlinson</h4>
                    <p className="text-slate-300">
                      Ao obter notas abaixo do esperado, o sistema remapeia automaticamente os tópicos cobrados e traça um plano de estudo restaurativo personalizado sem punições.
                    </p>
                  </div>

                  <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 space-y-1">
                    <h4 className="font-bold text-indigo-400 text-xs sm:text-sm">6. Teoria da Autodeterminação — Deci & Ryan</h4>
                    <p className="text-slate-300">
                      O Acordo de Confiança Familiar e as reações positivas dos pais substituem a vigilância invasiva pelo fortalecimento da autonomia e do pertencimento.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeChapter === 'ch9' && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-rose-400 font-display flex items-center space-x-2">
                  <ShieldAlert className="w-5 h-5 text-rose-400" />
                  <span>Capítulo 9: Lançamento de Questões & Módulo Antitrapaça</span>
                </h3>

                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  Permite o registro manual de exercícios feitos em apostilas e livros físicos com total transparência e 3 níveis de validação configuráveis pelos pais:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 space-y-1">
                    <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded">Modo Confiança</span>
                    <p className="text-xs text-slate-300 mt-1">Lançamentos entram direto sem necessidade de aprovação.</p>
                  </div>

                  <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 space-y-1">
                    <span className="bg-amber-500/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded">Modo Parental</span>
                    <p className="text-xs text-slate-300 mt-1">Fica pendente para conferência do pai/mãe antes de contabilizar.</p>
                  </div>

                  <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 space-y-1">
                    <span className="bg-purple-500/20 text-purple-300 text-[10px] font-bold px-2 py-0.5 rounded">Validação IA Vision</span>
                    <p className="text-xs text-slate-300 mt-1">O aluno envia foto do caderno/livro e o Gemini Vision valida as questões.</p>
                  </div>
                </div>

                <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 space-y-1">
                  <h4 className="font-bold text-amber-300 text-xs sm:text-sm flex items-center space-x-1.5">
                    <FileCheck className="w-4 h-4 text-amber-400" />
                    <span>Índice de Confiabilidade Familiar</span>
                  </h4>
                  <p className="text-xs text-slate-300">
                    Métrica de transparência calculada automaticamente com base nas atividades validadas e auditadas.
                  </p>
                </div>
              </div>
            )}

            {activeChapter === 'ch10' && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-amber-300 font-display flex items-center space-x-2">
                  <Trophy className="w-5 h-5 text-amber-400" />
                  <span>Capítulo 10: Ranking de Turma Anônimo & Olimpíadas</span>
                </h3>

                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  Permite criar e participar de Turmas com Código de Convite (ex: TURMA-MED27) para estudar em grupo:
                </p>

                <div className="space-y-2 text-xs sm:text-sm">
                  <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 space-y-1">
                    <h4 className="font-bold text-white">🕵️ Anonimato & Privacidade Garantida</h4>
                    <p className="text-slate-300">
                      Nenhum aluno tem o nome real exposto. A competição utiliza apenas Codinomes (Apelidos) e Avatares.
                    </p>
                  </div>

                  <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 space-y-1">
                    <h4 className="font-bold text-amber-300">📊 5 Categoria de Ranking</h4>
                    <p className="text-slate-300">
                      Classificação por Horas Líquidas, Questões Resolvidas, Taxa de Acertos %, Streak Diário e Simulados.
                    </p>
                  </div>

                  <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 space-y-1">
                    <h4 className="font-bold text-yellow-300">🥇 Olimpíadas de Estudo da Turma</h4>
                    <p className="text-slate-300">
                      Desafios acadêmicos com quizzes de tempo limite gerados por IA em tempo real e Pódio de Medalhas.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeChapter === 'ch11' && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-emerald-400 font-display flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-emerald-400" />
                  <span>Capítulo 11: Assistente de Execução do Ciclo Adaptativo</span>
                </h3>

                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  O Cronômetro atua como a <strong>camada de execução guiada do Ciclo de Estudos Adaptativo</strong>. O motor adaptativo calcula o ciclo com base em pesos, revisões espaçadas e diário do professor, e o assistente conduz o aluno passo a passo:
                </p>

                <div className="space-y-3 text-xs sm:text-sm">
                  <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 space-y-1">
                    <h4 className="font-bold text-indigo-300">▶ 1. Iniciar Ciclo de Hoje</h4>
                    <p className="text-slate-300">
                      O aluno clica em "Iniciar Ciclo de Hoje". O cronômetro carrega automaticamente os blocos calculados pelo algoritmo (pesos 1-5, trilha dual, revisões e tarefas pendentes), ajustando tempos e pausas estratégicas.
                    </p>
                  </div>

                  <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 space-y-1">
                    <h4 className="font-bold text-purple-300">🤖 2. Detecção Automática na Plataforma</h4>
                    <p className="text-slate-300">
                      Ao resolver Quizzes, Flashcards ou ouvir resumos narrados (TTS), o sistema vincula e contabiliza o tempo e as respostas diretamente ao bloco do ciclo ativo.
                    </p>
                  </div>

                  <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 space-y-1">
                    <h4 className="font-bold text-amber-300">⚡ 3. Flexibilidade & Redistribuição</h4>
                    <p className="text-slate-300">
                      Permite pausar, estender +10 min ou pular um bloco. Blocos não concluídos são redistribuídos automaticamente para os dias seguintes pelo ciclo adaptativo.
                    </p>
                  </div>

                  <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 space-y-1">
                    <h4 className="font-bold text-emerald-300">📖 4. Estudo Externo & Registro</h4>
                    <p className="text-slate-300">
                      Estudos em livros e apostilas físicas podem ser registrados manualmente com validação por foto (IA Vision) ou conferência dos pais.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeChapter === 'faq' && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-amber-400 font-display flex items-center space-x-2">
                  <HelpCircle className="w-5 h-5" />
                  <span>Perguntas Frequentes (FAQ)</span>
                </h3>

                <div className="space-y-2">
                  {[
                    {
                      q: "Os pais conseguem ver o conteúdo detalhado das anotações do filho?",
                      a: "Não. Para garantir a privacidade do estudante e promover a autonomia, os pais visualizam apenas relatórios consolidados (horas de foco, matérias estudadas, notas de provas e diagnósticos de IA)."
                    },
                    {
                      q: "Como funciona a validação por foto da IA (Gemini Vision)?",
                      a: "Ao fazer um lançamento manual de exercícios do livro/caderno, o aluno pode enviar uma foto da folha. O modelo Gemini Vision lê a imagem, reconhece o texto e valida a resolução do exercício."
                    },
                    {
                      q: "O ranking da turma expõe o nome real dos estudantes?",
                      a: "Não! A competição é 100% anônima. Cada aluno utiliza um codinome divertido e um avatar, promovendo a motivação amigável sem expor a identidade dos estudantes."
                    },
                    {
                      q: "O que são as Olimpíadas da Turma e quem pode criar uma?",
                      a: "As Olimpíadas são desafios acadêmicos com quizzes de tempo limite gerados por IA. Qualquer integrante da turma pode propor uma olimpíada e disputar o Pódio de Medalhas com os colegas."
                    },
                    {
                      q: "Como adicionar um segundo filho à conta da família?",
                      a: "No painel parental, clique em 'Convidar Filho no WhatsApp' ou forneça o mesmo Código Familiar para ele inserir durante o cadastro inicial."
                    },
                    {
                      q: "O aplicativo funciona quando fico sem internet no celular?",
                      a: "Sim! O Estudei & Passei possui armazenamento local offline. Você pode rodar o cronômetro e registrar seus estudos. Assim que a internet se reconectar, tudo será sincronizado com a nuvem."
                    },
                    {
                      q: "Como funciona a repetição espaçada de revisões?",
                      a: "O aplicativo cria lembretes automáticos após 24 horas, 7 dias e 30 dias a partir da data de estudo de um tópico, garantindo fixação de longo prazo para os vestibulares."
                    }
                  ].map((faq, idx) => (
                    <div key={idx} className="bg-slate-800/80 border border-slate-700/80 rounded-xl overflow-hidden">
                      <button
                        onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                        className="w-full p-4 text-left font-bold text-xs sm:text-sm text-white flex items-center justify-between gap-3 hover:bg-slate-800 transition"
                      >
                        <span className="flex items-center space-x-2">
                          <MessageSquare className="w-4 h-4 text-amber-400 shrink-0" />
                          <span>{faq.q}</span>
                        </span>
                        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
                      </button>
                      {openFaq === idx && (
                        <div className="p-4 pt-0 text-xs text-slate-300 leading-relaxed border-t border-slate-700/50 bg-slate-900/50">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Footer info bar */}
        <div className="bg-slate-950 p-3 sm:p-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Estudei & Passei — Plataforma Educacional para Famílias Conectadas</span>
          </div>
          <button
            onClick={onClose}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-1.5 rounded-xl transition"
          >
            Entendi, Fechar Manual
          </button>
        </div>

      </div>
    </div>
  );
};
