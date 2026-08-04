import React, { useState } from 'react';
import { 
  BookOpen, ShieldCheck, Heart, Sparkles, GraduationCap, 
  HelpCircle, Clock, Award, Users, CheckCircle2, ChevronRight, Download, ChevronDown, MessageSquare, AlertCircle, Search, Brain,
  ShieldAlert, Trophy, Camera, FileCheck
} from 'lucide-react';

interface UserManualPageProps {
  onNavigateTab?: (tab: string) => void;
}

export const UserManualPage: React.FC<UserManualPageProps> = ({ onNavigateTab }) => {
  const [activeChapter, setActiveChapter] = useState<'welcome' | 'ch1' | 'ch2' | 'ch3' | 'ch4' | 'ch5' | 'ch6' | 'ch7' | 'ch8' | 'ch9' | 'ch10' | 'ch11' | 'faq'>('welcome');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

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
O **Estudei & Passei** é sustentado pelas neurociências da aprendizagem (Active Recall, Spaced Repetition, Carga Cognitiva, Metacognição e Teoria da Autodeterminação).

---

## CAPÍTULO 9: LANÇAMENTO DE QUESTÕES E MÓDULO ANTITRAPAÇA
- **Lançamento de Livros & Cadernos Físicos:** O aluno pode registrar exercícios resolvidos manualmente em apostilas.
- **3 Modos de Validação Parental:**
  1. *Confiança Plena:* Lançamentos são registrados diretamente no histórico.
  2. *Aprovação Parental:* Fica pendente para revisão do pai/mãe antes de contabilizar.
  3. *Validação por IA Vision (Gemini):* O aluno tira uma foto da página resolvida e a IA lê e valida as questões e respostas com visão computacional!
- **Índice de Confiabilidade da Família:** Percentual de transparência e auditoria de atividades em tempo real.

---

## CAPÍTULO 10: RANKING DA TURMA E OLIMPÍADAS DE ESTUDO
- **Turmas de Estudo:** Alunos podem criar ou entrar em turmas de colegas com Código de Convite (ex: TURMA-MED27).
- **100% Anônimo:** Proteção total contra comparações tóxicas. Cada aluno escolhe um Codinome (Apelido) e Avatar divertido.
- **Ranking em 5 Categorias:** Horas de Estudo, Questões Resolvidas, Taxa de Acertos %, Streak Diário e Simulados.
- **Olimpíadas da Turma:** Competia acadêmica cooperativa com quizzes de tempo limitado gerados por IA e Pódio de Medalhas (Ouro, Prata e Bronze).

---

## FAQ — PERGUNTAS FREQUENTES
- **Os pais podem ver tudo o que o aluno digita?** Não! Os pais veem métricas consolidadas preservando a privacidade do aluno.
- **Como funciona a validação por foto da IA (Gemini Vision)?** O aluno envia uma foto da página de exercícios resolvida e o modelo multimodal Gemini analisa a imagem para confirmar o volume de questões e taxa de acertos.
- **O ranking da turma expõe o nome real dos alunos?** Não. A competição é 100% anônima via apelidos e avatares personalizados.
`;

    const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Manual_Usuario_Estudei_e_Passei.md';
    link.click();
    URL.revokeObjectURL(url);
  };

  const chapters = [
    { id: 'welcome', label: 'Carta de Boas-Vindas', icon: Heart, color: 'text-rose-400' },
    { id: 'ch1', label: 'Cap 1: Vínculo Familiar', icon: Users, color: 'text-indigo-400' },
    { id: 'ch2', label: 'Cap 2: Estudando com Foco', icon: GraduationCap, color: 'text-emerald-400' },
    { id: 'ch3', label: 'Cap 3: A Visão dos Pais', icon: ShieldCheck, color: 'text-amber-400' },
    { id: 'ch4', label: 'Cap 4: Acordo de Confiança', icon: CheckCircle2, color: 'text-sky-400' },
    { id: 'ch5', label: 'Cap 5: Desafios em Família', icon: Award, color: 'text-yellow-400' },
    { id: 'ch6', label: 'Cap 6: Diagnóstico de IA', icon: Sparkles, color: 'text-purple-400' },
    { id: 'ch7', label: 'Cap 7: Rotina Saudável', icon: Clock, color: 'text-pink-400' },
    { id: 'ch8', label: 'Cap 8: Embasamento Pedagógico', icon: Brain, color: 'text-amber-400' },
    { id: 'ch9', label: 'Cap 9: Validação & Antitrapaça', icon: ShieldAlert, color: 'text-rose-400' },
    { id: 'ch10', label: 'Cap 10: Ranking & Olimpíadas', icon: Trophy, color: 'text-amber-300' },
    { id: 'ch11', label: 'Cap 11: Cronômetro Inteligente', icon: Clock, color: 'text-emerald-400' },
    { id: 'faq', label: 'Perguntas Frequentes (FAQ)', icon: HelpCircle, color: 'text-sky-300' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-indigo-500/10 to-transparent pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 text-slate-950 flex items-center justify-center font-bold shadow-lg shadow-amber-500/20 shrink-0">
              <BookOpen className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-extrabold font-display text-white">
                  Manual do Usuário & Guia de Orientação
                </h1>
                <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-extrabold px-2.5 py-0.5 rounded-full">
                  Edição Família
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
                Aprenda a utilizar todas as funcionalidades do aplicativo para fortalecer o aprendizado do estudante com incentivo, autonomia e parceria familiar.
              </p>
            </div>
          </div>

          <button
            onClick={handleDownloadMarkdown}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold px-4 py-2.5 rounded-xl shadow-lg shadow-amber-500/20 flex items-center space-x-2 transition shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>Baixar Manual em Markdown</span>
          </button>
        </div>
      </div>

      {/* Main Page Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Sidebar Chapter Selector */}
        <div className="lg:col-span-1 bg-slate-900/90 border border-slate-800 rounded-2xl p-3 h-fit space-y-1">
          <span className="text-[10px] text-slate-400 font-extrabold uppercase px-3 py-1 block tracking-wider">
            Capítulos do Manual
          </span>
          {chapters.map((ch) => {
            const IconComponent = ch.icon;
            const isActive = activeChapter === ch.id;
            return (
              <button
                key={ch.id}
                onClick={() => setActiveChapter(ch.id as any)}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-between ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-2.5 truncate">
                  <IconComponent className={`w-4 h-4 shrink-0 ${isActive ? 'text-slate-950' : ch.color}`} />
                  <span className="truncate">{ch.label}</span>
                </div>
                <ChevronRight className={`w-3.5 h-3.5 shrink-0 opacity-60 ${isActive ? 'text-slate-950' : ''}`} />
              </button>
            );
          })}
        </div>

        {/* Chapter Content Pane */}
        <div className="lg:col-span-3 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6 text-slate-200">
          
          {activeChapter === 'welcome' && (
            <div className="space-y-5">
              <div className="bg-amber-500/10 border border-amber-500/30 p-6 rounded-2xl space-y-3">
                <div className="flex items-center space-x-2 text-amber-400 font-extrabold text-lg">
                  <Heart className="w-6 h-6" />
                  <span>Carta de Apresentação: A Filosofia Estudei & Passei</span>
                </div>
                <p className="text-slate-300 leading-relaxed text-sm">
                  Prezada família e estudante,
                </p>
                <p className="text-slate-300 leading-relaxed text-sm">
                  O Ensino Médio é uma das fases mais transformadoras da vida. Entre vestibulares, exames escolares e descobertas pessoais, a pressão pode facilmente transformar a rotina de estudos em um campo de tensão familiar.
                </p>
                <p className="text-slate-300 leading-relaxed text-sm">
                  O **Estudei & Passei** foi construído com uma diretriz clara: **substituir a vigilância pelo incentivo**. Não queremos que os pais atuem como fiscais de horários, mas sim como parceiros de jornada que celebram a constância e oferecem apoio seguro nos momentos de maior desafio.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80 space-y-2">
                  <h4 className="font-bold text-amber-400 text-base flex items-center space-x-2">
                    <span>🎯</span>
                    <span>Para o Estudante: Autonomia e Foco</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Você conduz seu planejamento. Organize suas matérias, utilize o cronômetro Pomodoro de alta concentração, teste seus conhecimentos com quizzes da IA e acompanhe a evolução do seu aprendizado sem cobranças tóxicas.
                  </p>
                </div>

                <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80 space-y-2">
                  <h4 className="font-bold text-amber-400 text-base flex items-center space-x-2">
                    <span>👨‍👩‍👧</span>
                    <span>Para os Pais: Acompanhamento Saudável</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Acompanhe a dedicação e constância do seu filho em tempo real com métricas consolidadas de horas líquidas, sem precisar perguntar repetidamente "já estudou hoje?". Envie mensagens de orgulho e estabeleçam acordos combinados.
                  </p>
                </div>
              </div>

              {onNavigateTab && (
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => onNavigateTab('dashboard')}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-5 py-2.5 rounded-xl transition text-xs flex items-center space-x-2 shadow-lg"
                  >
                    <span>Ir para o Painel Principal</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {activeChapter === 'ch1' && (
            <div className="space-y-5">
              <h3 className="text-xl font-extrabold text-indigo-400 font-display flex items-center space-x-2">
                <Users className="w-6 h-6" />
                <span>Capítulo 1: Primeiros Passos e Vínculo Familiar</span>
              </h3>

              <div className="space-y-4 text-sm leading-relaxed">
                <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-2">
                  <h4 className="font-bold text-white text-base">1. Cadastro e Geração do Código Familiar</h4>
                  <p className="text-slate-300">
                    Ao criar sua conta como Responsável (Pai/Mãe), o sistema atribui um **Código Familiar** único à sua família (por exemplo: <span className="bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded font-mono font-bold">FAM-8923</span>).
                  </p>
                </div>

                <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-2">
                  <h4 className="font-bold text-white text-base">2. Convidando Filhos via WhatsApp ou Link Direto</h4>
                  <p className="text-slate-300">
                    No Painel dos Pais, clique no botão **📲 Convidar Filho no WhatsApp**. O aplicativo abrirá uma mensagem pré-formatada no WhatsApp do seu filho contendo o link de cadastro. Ao acessar, o filho é vinculado instantaneamente à sua família.
                  </p>
                </div>

                <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-2">
                  <h4 className="font-bold text-white text-base">3. Vinculação de Outros Responsáveis</h4>
                  <p className="text-slate-300">
                    Outro pai, mãe ou guardião pode se conectar à mesma família clicando em **👨‍👩‍👧 Convidar Outro Responsável**. Ao inserir o código familiar no cadastro de responsável, ambos passam a visualizar os avanços dos estudos em tempo real.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeChapter === 'ch2' && (
            <div className="space-y-5">
              <h3 className="text-xl font-extrabold text-emerald-400 font-display flex items-center space-x-2">
                <GraduationCap className="w-6 h-6" />
                <span>Capítulo 2: Estudando com Foco (O Modo do Aluno)</span>
              </h3>

              <div className="space-y-4 text-sm leading-relaxed">
                <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-2">
                  <h4 className="font-bold text-white text-base">⏳ Cronômetro Pomodoro de Foco Líquido</h4>
                  <p className="text-slate-300">
                    Utilize blocos de 25 minutos (foco padrão) ou 50 minutos (estudo aprofundado). As pausas curtas garantem que seu cérebro recupere a capacidade de absorção antes da próxima matéria.
                  </p>
                </div>

                <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-2">
                  <h4 className="font-bold text-white text-base">⭐ Avaliação de Qualidade da Sessão</h4>
                  <p className="text-slate-300">
                    Ao finalizar o tempo, avalie com 1 a 5 estrelas o seu grau de compreensão. Essa autoavaliação alimenta o **Algoritmo Adaptativo** do aplicativo, recomendando o tempo ideal de estudo nas próximas semanas.
                  </p>
                </div>

                <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-2">
                  <h4 className="font-bold text-white text-base">🧠 Flashcards e Quizzes com Recuperação Ativa (Active Recall)</h4>
                  <p className="text-slate-300">
                    A Inteligência Artificial do app formula quizzes com base nos conteúdos cadastrados. Resolver questões força o cérebro a recuperar ativamente as informações, a forma mais comprovada cientificamente de retenção para vestibulares.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeChapter === 'ch3' && (
            <div className="space-y-5">
              <h3 className="text-xl font-extrabold text-amber-400 font-display flex items-center space-x-2">
                <ShieldCheck className="w-6 h-6" />
                <span>Capítulo 3: A Visão dos Pais (Acompanhamento sem Pressão)</span>
              </h3>

              <div className="space-y-4 text-sm leading-relaxed">
                <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-2">
                  <h4 className="font-bold text-white text-base">👦 Seletor de Aluno Ativo (Conta-Switcher)</h4>
                  <p className="text-slate-300">
                    Se sua família tem mais de um filho cadastrado no Ensino Médio, alterne a visualização instantaneamente usando o **Seletor de Aluno Ativo** no topo do painel. Cada filho possui seu painel isolado de horas, matérias e diagnósticos.
                  </p>
                </div>

                <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-2">
                  <h4 className="font-bold text-white text-base">👏 Micro-mensagens de Orgulho e Incentivo</h4>
                  <p className="text-slate-300">
                    Ao notar que seu filho concluiu metas ou manteve a constância (streak), envie reações rápidas com 1 toque. Essa comunicação reforça a sensação de apoio positivo sem interferir no espaço pessoal do jovem.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeChapter === 'ch4' && (
            <div className="space-y-5">
              <h3 className="text-xl font-extrabold text-sky-400 font-display flex items-center space-x-2">
                <CheckCircle2 className="w-6 h-6" />
                <span>Capítulo 4: Acordo de Confiança Familiar</span>
              </h3>

              <p className="text-slate-300 text-sm">
                O **Acordo de Confiança** substitui cobranças por metas transparentes combinadas em conjunto entre pais e filhos.
              </p>

              <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-3 text-sm">
                <p className="font-bold text-amber-300 text-base">Passo a passo do Acordo:</p>
                <ol className="list-decimal list-inside space-y-2 text-slate-300">
                  <li>O responsável propõe uma meta diária saudável (exemplo: 90 minutos de estudo líquido).</li>
                  <li>O estudante visualiza a proposta em seu painel e clica em **Aceitar Acordo de Confiança**.</li>
                  <li>O aplicativo acompanha a evolução diária e exibe o indicador **Acordo Cumprido**.</li>
                  <li>A família pode combinar recompensas saudáveis (ex: passeios, tempo livre extra) para celebrar o cumprimento semanal!</li>
                </ol>
              </div>
            </div>
          )}

          {activeChapter === 'ch5' && (
            <div className="space-y-5">
              <h3 className="text-xl font-extrabold text-yellow-400 font-display flex items-center space-x-2">
                <Award className="w-6 h-6" />
                <span>Capítulo 5: Desafios Colaborativos entre Irmãos</span>
              </h3>

              <p className="text-slate-300 text-sm">
                Os **Desafios entre Irmãos** transformam a rotina de estudos em uma experiência motivadora e divertida para famílias com dois ou mais filhos.
              </p>

              <div className="grid sm:grid-cols-3 gap-4 pt-2">
                <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 text-center space-y-2">
                  <span className="text-3xl">🔥</span>
                  <h5 className="font-bold text-white text-sm">Desafio de Streak</h5>
                  <p className="text-xs text-slate-400">Premia quem mantém o maior número de dias consecutivos estudando.</p>
                </div>

                <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 text-center space-y-2">
                  <span className="text-3xl">⏱️</span>
                  <h5 className="font-bold text-white text-sm">Desafio de Horas</h5>
                  <p className="text-xs text-slate-400">Soma as horas líquidas de foco dedicadas durante a semana.</p>
                </div>

                <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 text-center space-y-2">
                  <span className="text-3xl">🎯</span>
                  <h5 className="font-bold text-white text-sm">Desafio de Quizzes</h5>
                  <p className="text-xs text-slate-400">Contabiliza os pontos obtidos nos exercícios e simulados.</p>
                </div>
              </div>
            </div>
          )}

          {activeChapter === 'ch6' && (
            <div className="space-y-5">
              <h3 className="text-xl font-extrabold text-purple-400 font-display flex items-center space-x-2">
                <Sparkles className="w-6 h-6" />
                <span>Capítulo 6: Diagnóstico de Lacunas por IA (Google Gemini)</span>
              </h3>

              <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-3 text-sm">
                <p className="text-slate-300">
                  O módulo de IA cruza os dados de horas dedicadas, histórico de notas e classificações de dificuldade para gerar um **Relatório de Diagnóstico Analítico**, mapeando tópicos críticos que precisam de revisão urgente antes das provas.
                </p>

                <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-xl text-amber-200 text-xs flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 shrink-0 text-amber-400 mt-0.5" />
                  <span className="leading-relaxed">
                    <strong>Importante:</strong> O diagnóstico da IA é uma ferramenta complementar de orientação analítica. Ele não substitui o parecer pedagógico dos professores, coordenadores e conselhos da escola.
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeChapter === 'ch7' && (
            <div className="space-y-5">
              <h3 className="text-xl font-extrabold text-pink-400 font-display flex items-center space-x-2">
                <Clock className="w-6 h-6" />
                <span>Capítulo 7: Orientação para uma Rotina Saudável</span>
              </h3>

              <div className="space-y-4 text-sm leading-relaxed">
                <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-1">
                  <h4 className="font-bold text-white text-base">💤 1. Higiene do Sono e Consolidação de Memória</h4>
                  <p className="text-slate-300">
                    Estudar durante a madrugada sem dormir impede que o cérebro consolide o aprendizado na memória de longo prazo. Garanta de 7h a 9h de sono reparador.
                  </p>
                </div>

                <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-1">
                  <h4 className="font-bold text-white text-base">📱 2. Desconexão nas Pausas</h4>
                  <p className="text-slate-300">
                    Durante os intervalos do Pomodoro, evite rolar redes sociais. Levante-se, beba água e alongue o corpo para descansar o cérebro de verdade.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeChapter === 'ch8' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-amber-500/10 border border-amber-500/30 p-6 rounded-2xl space-y-3">
                <div className="flex items-center space-x-2 text-amber-400 font-extrabold text-xl">
                  <Brain className="w-7 h-7 shrink-0 text-amber-400" />
                  <span>Capítulo 8: Embasamento Pedagógico, Técnicas e Táticas Didáticas</span>
                </div>
                <p className="text-slate-200 leading-relaxed text-sm">
                  O <strong>Estudei & Passei</strong> foi arquitetado com rigoroso embasamento em neurociência cognitiva, psicologia educacional e metodologias ativas de aprendizagem. Nosso propósito é garantir que qualquer estudante — independentemente do seu nível inicial, ritmo ou dificuldades específicas — seja guiado de forma personalizada e eficiente.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-3">
                  <div className="flex items-center space-x-2 text-emerald-400 font-bold text-base">
                    <span className="bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-lg text-xs">Pilar 1</span>
                    <span>Prática de Recuperação Ativa (Active Recall)</span>
                  </div>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                    Fundamentado pelos estudos clássicos de <strong>Roediger & Karpicke (2006)</strong>. Reler resumos ou grifar textos gera a falsa ilusão de competência (efeito de fluência). O sistema obriga o cérebro a resgatar ativamente a informação através de <strong>Flashcards, Quizzes por IA e Exercícios de Fixação</strong>, fortalecendo as sinapses e a retenção de longo prazo para exames competitivos como ENEM e vestibulares.
                  </p>
                </div>

                <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-3">
                  <div className="flex items-center space-x-2 text-sky-400 font-bold text-base">
                    <span className="bg-sky-500/20 text-sky-300 px-2.5 py-1 rounded-lg text-xs">Pilar 2</span>
                    <span>Curva do Esquecimento e Repetição Espaçada</span>
                  </div>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                    Baseado na descoberta de <strong>Hermann Ebbinghaus</strong>. Sem revisões planejadas, o cérebro descarta até 80% do conteúdo estudado em 30 dias. Nosso algoritmo programa automaticamente micro-sessões de revisão nos momentos ideais de consolidação (<strong>24 horas, 7 dias e 30 dias</strong>), transformando a memória de curto prazo em conhecimento permanente.
                  </p>
                </div>

                <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-3">
                  <div className="flex items-center space-x-2 text-purple-400 font-bold text-base">
                    <span className="bg-purple-500/20 text-purple-300 px-2.5 py-1 rounded-lg text-xs">Pilar 3</span>
                    <span>Teoria da Carga Cognitiva & Pomodoro Adaptativo</span>
                  </div>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                    Inspirado na <strong>Cognitive Load Theory de John Sweller</strong>. O cérebro do estudante possui capacidade limitada na memória de trabalho. Dividir o estudo em blocos de foco pleno (25 ou 50 minutos) com intervalos estruturados previne o esgotamento mental (burnout escolar), otimiza a atenção sustentada e reduz drasticamente a ansiedade.
                  </p>
                </div>

                <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-3">
                  <div className="flex items-center space-x-2 text-amber-400 font-bold text-base">
                    <span className="bg-amber-500/20 text-amber-300 px-2.5 py-1 rounded-lg text-xs">Pilar 4</span>
                    <span>Metacognição e Monitoramento da Aprendizagem</span>
                  </div>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                    Baseado nas pesquisas de <strong>John Flavell e Barry Zimmerman</strong> sobre autorregulação da aprendizagem. Ao registrar a nota de absorção (1 a 5 estrelas) e responder à pergunta reflexiva "O que errei mais?", o estudante desenvolve a consciência crítica sobre seus pontos cegos, aprendendo a planejar a própria rota de estudos.
                  </p>
                </div>

                <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-3">
                  <div className="flex items-center space-x-2 text-rose-400 font-bold text-base">
                    <span className="bg-rose-500/20 text-rose-300 px-2.5 py-1 rounded-lg text-xs">Pilar 5</span>
                    <span>Instrução Diferenciada & Modo Recuperação</span>
                  </div>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                    Apoiado pelos princípios de <strong>Carol Ann Tomlinson</strong>. Cada aluno possui diferentes necessidades e ritmos. Quando o desempenho em uma avaliação fica abaixo da média, o sistema ativa o <strong>Modo Recuperação Acolhedor</strong>: remapeia automaticamente os tópicos específicos cobrados, gera listas de reforço e traça um plano de estudo restaurativo, sem estigmatização ou punição.
                  </p>
                </div>

                <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-3">
                  <div className="flex items-center space-x-2 text-indigo-400 font-bold text-base">
                    <span className="bg-indigo-500/20 text-indigo-300 px-2.5 py-1 rounded-lg text-xs">Pilar 6</span>
                    <span>Teoria da Autodeterminação & Parceria Familiar</span>
                  </div>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                    Sustentado pela <strong>Self-Determination Theory de Deci & Ryan</strong>. A motivação duradoura depende do atendimento de três necessidades psicológicas básicas: <em>Autonomia, Competência e Pertencimento</em>. O <strong>Acordo de Confiança Familiar</strong> e as reações positivas dos pais substituem a vigilância invasiva pela celebração de conquistas e incentivo genuíno.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeChapter === 'ch9' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-rose-500/10 via-indigo-500/10 to-rose-500/10 border border-rose-500/30 p-6 rounded-2xl space-y-3">
                <div className="flex items-center space-x-2 text-rose-400 font-extrabold text-xl">
                  <ShieldAlert className="w-7 h-7 shrink-0 text-rose-400" />
                  <span>Capítulo 9: Lançamento de Questões & Módulo Antitrapaça</span>
                </div>
                <p className="text-slate-200 leading-relaxed text-sm">
                  Nem todos os exercícios são feitos no computador. Alunos leem apostilas e resolvem listas em cadernos físicos. O <strong>Estudei & Passei</strong> permite o lançamento manual de questões com total transparência e 3 níveis de validação configuráveis no Painel dos Pais.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-3">
                  <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
                    <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded text-xs font-mono font-bold">Modo 1</span>
                    <span>Confiança Plena</span>
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    Ideal para estudantes com alta autonomia. Os lançamentos manuais entram diretamente no histórico de acertos e no cálculo de horas sem necessidade de aprovação.
                  </p>
                </div>

                <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-3">
                  <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm">
                    <span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded text-xs font-mono font-bold">Modo 2</span>
                    <span>Aprovação Parental</span>
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    Cada lote de questões de livros/cadernos cadastrado pelo aluno fica marcado como <em>Pendente de Validação</em> no Painel dos Pais para conferência rápida e aprovação.
                  </p>
                </div>

                <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-3">
                  <div className="flex items-center space-x-2 text-purple-400 font-bold text-sm">
                    <span className="bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded text-xs font-mono font-bold">Modo 3</span>
                    <span>Validação por IA Vision</span>
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    O aluno tira foto da folha do caderno ou apostila com a câmera. O modelo multimodal <strong>Google Gemini Vision</strong> lê a imagem, reconhece o gabarito e valida automaticamente as questões resolvidas.
                  </p>
                </div>
              </div>

              <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-2">
                <h4 className="font-bold text-amber-300 text-sm flex items-center space-x-2">
                  <FileCheck className="w-4 h-4 text-amber-400" />
                  <span>Índice de Confiabilidade da Família</span>
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Calculado automaticamente com base na proporção de atividades validadas por testes da IA ou aprovadas pelos pais. Mantém um ambiente transparente, motivando a honestidade acadêmica sem desconfiança contínua.
                </p>
              </div>
            </div>
          )}

          {activeChapter === 'ch10' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-amber-500/10 border border-amber-500/30 p-6 rounded-2xl space-y-3">
                <div className="flex items-center space-x-2 text-amber-300 font-extrabold text-xl">
                  <Trophy className="w-7 h-7 shrink-0 text-amber-400" />
                  <span>Capítulo 10: Ranking de Turma Anônimo & Olimpíadas de Estudo</span>
                </div>
                <p className="text-slate-200 leading-relaxed text-sm">
                  Estudar com colegas estimula o hábito e combate a procrastinação. O módulo de **Turmas** permite que vestibulandos compitam com amigos de escola ou cursinho em uma cultura 100% cooperativa.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-3">
                  <h4 className="font-bold text-white text-sm flex items-center space-x-2">
                    <span>🕵️</span>
                    <span>Privacidade Absoluta e Anonimato</span>
                  </h4>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    Nenhum aluno é exposto com nome real. Ao entrar na turma, você escolhe um <strong>Codinome/Apelido divertido</strong> (ex: <em>🦉 CorujaSábia</em> ou <em>🧙‍♂️ MagoDasExatas</em>) e um avatar. Isso elimina comparações destrutivas e mantém a graça da competição.
                  </p>
                </div>

                <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-3">
                  <h4 className="font-bold text-white text-sm flex items-center space-x-2">
                    <span>📊</span>
                    <span>Classificação em 5 Categorias</span>
                  </h4>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    O ranking valoriza múltiplos perfis de estudo: <strong>Horas Líquidas, Questões Resolvidas, Taxa de Acertos %, Streak de Dias Seguidos e Simulados Concluídos</strong>.
                  </p>
                </div>
              </div>

              <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-3">
                <h4 className="font-bold text-amber-300 text-sm flex items-center space-x-2">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <span>Olimpíadas da Turma (Desafios em Tempo Real)</span>
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Qualquer membro da turma pode propor uma <strong>Olimpíada com IA</strong> em disciplinas específicas (ex: <em>Física e Química</em> ou <em>Raciocínio Lógico</em>). A IA gera um quiz inédito com tempo limite. Os resultados alimentam o <strong>Pódio de Medalhas (🥇 Ouro, 🥈 Prata, 🥉 Bronze)</strong> com critérios de desempate por tempo!
                </p>
              </div>
            </div>
          )}

          {activeChapter === 'ch11' && (
            <div className="space-y-5">
              <h3 className="text-xl font-extrabold text-emerald-400 font-display flex items-center space-x-2">
                <Clock className="w-6 h-6 text-emerald-400" />
                <span>Capítulo 11: Assistente de Execução do Ciclo Adaptativo</span>
              </h3>

              <p className="text-slate-300 text-sm leading-relaxed">
                O <strong>Cronômetro / Assistente de Execução</strong> é a camada prática que executa o <strong>Ciclo de Estudos Adaptativo</strong> já calculado pelo motor pedagógico (pesos 1-5, trilha dual, revisões e tarefas pendentes):
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-2">
                  <h4 className="font-bold text-indigo-300 text-base">▶ 1. Botão "Iniciar Ciclo de Hoje"</h4>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Localizado no topo do dashboard, inicia a sequência exata de blocos do ciclo do dia com contagem regressiva, avisos sonoros de 5 min e pausas estratégicas.
                  </p>
                </div>

                <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-2">
                  <h4 className="font-bold text-purple-300 text-base">🤖 2. Detecção Automática na Plataforma</h4>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Quizzes, Flashcards, Simulados e Resumos em Áudio (TTS) feitos na plataforma são automaticamente identificados e vinculados ao bloco ativo do ciclo.
                  </p>
                </div>

                <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-2">
                  <h4 className="font-bold text-amber-300 text-base">⚡ 3. Flexibilidade & Reagendamento</h4>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    O aluno pode pausar, adicionar +10 min ou pular blocos. Matérias não concluídas no dia são redistribuídas automaticamente para os dias subsequentes.
                  </p>
                </div>

                <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-2">
                  <h4 className="font-bold text-emerald-300 text-base">📖 4. Estudo Externo & Validação</h4>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Permite registrar estudos de apostilas e livros do colégio com validação por foto (IA Vision) ou liberação do responsável.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeChapter === 'faq' && (
            <div className="space-y-5">
              <h3 className="text-xl font-extrabold text-amber-400 font-display flex items-center space-x-2">
                <HelpCircle className="w-6 h-6" />
                <span>Perguntas Frequentes (FAQ)</span>
              </h3>

              <div className="space-y-3">
                {[
                  {
                    q: "Os pais têm acesso às anotações pessoais do estudante?",
                    a: "Não. Para preservar a privacidade do jovem e promover a maturidade nos estudos, os pais visualizam apenas dados consolidados (tempo de estudo, matérias, notas e diagnósticos), mantendo o conteúdo dos cadernos totalmente privado."
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
                    q: "Como conectar mais de um filho ao aplicativo?",
                    a: "No Painel dos Pais, utilize a opção 'Convidar Filho no WhatsApp' ou forneça o seu Código Familiar para o outro filho inserir durante o cadastro inicial."
                  },
                  {
                    q: "O aplicativo funciona em locais sem conexão de internet?",
                    a: "Sim! O Estudei & Passei possui armazenamento local offline. Todas as sessões salvas offline entram em uma fila segura e sincronizam com a nuvem assim que você se reconectar."
                  },
                  {
                    q: "O que é a Repetição Espaçada e como ela me ajuda?",
                    a: "O app programa automaticamente revisões curtas de 1 dia, 7 dias e 30 dias após você estudar um assunto, combatendo a Curva do Esquecimento de Ebbinghaus para você chegar afiado nos exames!"
                  }
                ].map((faq, idx) => (
                  <div key={idx} className="bg-slate-800/80 border border-slate-700/80 rounded-2xl overflow-hidden">
                    <button
                      onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                      className="w-full p-4 text-left font-bold text-sm text-white flex items-center justify-between gap-3 hover:bg-slate-800 transition"
                    >
                      <span className="flex items-center space-x-2.5">
                        <MessageSquare className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>{faq.q}</span>
                      </span>
                      <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
                    </button>
                    {openFaq === idx && (
                      <div className="p-4 pt-0 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-700/50 bg-slate-900/50">
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
    </div>
  );
};
