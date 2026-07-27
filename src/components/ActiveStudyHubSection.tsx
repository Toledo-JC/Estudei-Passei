import React, { useState, useEffect, useRef } from 'react';
import {
  Brain,
  Sparkles,
  Layers,
  HelpCircle,
  FileText,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Clock,
  Target,
  BarChart3,
  Award,
  ChevronRight,
  ChevronLeft,
  Plus,
  Loader2,
  AlertCircle,
  BookOpen,
  Sliders,
  Flame,
  Zap,
  Radio,
  Check,
  TrendingUp,
  Share2,
  RefreshCw,
  SlidersHorizontal
} from 'lucide-react';
import {
  Subject,
  FlashcardDeck,
  FlashcardItem,
  QuizQuestion,
  QuizSession,
  StudySummaryItem,
  SimuladoExam,
  SimuladoResult
} from '../types';
import { AITutorSection } from './AITutorSection';

interface ActiveStudyHubSectionProps {
  subjects: Subject[];
}

export const ActiveStudyHubSection: React.FC<ActiveStudyHubSectionProps> = ({ subjects }) => {
  const [activeSubTab, setActiveSubTab] = useState<'flashcards' | 'quizzes' | 'summaries' | 'simulados' | 'ai-tutor' | 'analytics'>('flashcards');

  // ==========================================
  // 1. FLASHCARDS STATE & INITIAL STARTER DECKS
  // ==========================================
  const [flashcardDecks, setFlashcardDecks] = useState<FlashcardDeck[]>(() => {
    const saved = localStorage.getItem('estudei_flashcard_decks');
    if (saved) return JSON.parse(saved);

    return [
      {
        id: 'deck-fisica-optica',
        title: 'Fórmulas Essenciais de Óptica e Ondulatória',
        subjectId: 'sub-fisica',
        category: 'Exatas',
        createdAt: new Date().toISOString(),
        cards: [
          {
            id: 'c-1',
            question: 'Qual é a Equação dos Gaussianos para espelhos esféricos e lentes?',
            answer: '1/f = 1/p + 1/p\' (Onde f = distância focal, p = distância do objeto, p\' = distância da imagem)',
            mnemonic: 'Dica ENEM: "Uma Fita = Um Pão + Um Prato". Se f > 0 o espelho/lente é côncavo/convergente.',
            subjectId: 'sub-fisica',
            topic: 'Óptica Geométrica'
          },
          {
            id: 'c-2',
            question: 'Qual é a Equação Fundamental da Ondulatória?',
            answer: 'v = λ . f (Velocidade = Comprimento de Onda x Frequência)',
            mnemonic: 'Dica ENEM: "Vem Lamber Ferida". A frequência (f) depende APENAS da fonte emissora!',
            subjectId: 'sub-fisica',
            topic: 'Ondulatória'
          },
          {
            id: 'c-3',
            question: 'O que ocorre com a velocidade, frequência e comprimento de onda na Refração de uma onda?',
            answer: 'A frequência f PERMANECE CONSTANTE. A velocidade v e o comprimento de onda λ mudam proporcionalmente.',
            mnemonic: 'Frequência é a identidade da onda (não muda ao trocar de meio).',
            subjectId: 'sub-fisica',
            topic: 'Ondulatória'
          }
        ]
      },
      {
        id: 'deck-biologia-citologia',
        title: 'Conceitos-Chave de Citologia & Bioenergética',
        subjectId: 'sub-biologia',
        category: 'Biológicas',
        createdAt: new Date().toISOString(),
        cards: [
          {
            id: 'c-4',
            question: 'Onde ocorrem a Glicólise, o Ciclo de Krebs e a Cadeia Respiratória?',
            answer: 'Glicólise: Hialoplasma (Citosol). Ciclo de Krebs: Matriz Mitocondrial. Cadeia Respiratória: Cristas Mitocôndriais.',
            mnemonic: 'Glicólise fora, Krebs no meio, Cadeia nas cristas.',
            subjectId: 'sub-biologia',
            topic: 'Respiração Celular'
          },
          {
            id: 'c-5',
            question: 'Qual a função do Retículo Endoplasmático Liso (Agranular)?',
            answer: 'Síntese de lipídios (esteroides), desintoxicação celular (hepática) e armazenamento de cálcio.',
            mnemonic: 'Liso = Lipídios e Limpeza (desintoxicação).',
            subjectId: 'sub-biologia',
            topic: 'Organelas Celulares'
          }
        ]
      },
      {
        id: 'deck-redacao-conectivos',
        title: 'Conectivos de Ouro para Redação ENEM (Nota 1000)',
        subjectId: 'sub-portugues',
        category: 'Linguagens',
        createdAt: new Date().toISOString(),
        cards: [
          {
            id: 'c-6',
            question: 'Quais conectivos interparágrafos usar para Início do D2 (Desenvolvimento 2)?',
            answer: 'Ademais, Outrossim, Além disso, Em segundo plano, Paralelamente a isso.',
            mnemonic: 'Sempre mostre adição ou progressão argumentativa entre D1 e D2.',
            subjectId: 'sub-portugues',
            topic: 'Redação ENEM'
          },
          {
            id: 'c-7',
            question: 'Quais são os 5 Elementos Obrigatórios da Proposta de Intervenção (Competência 5)?',
            answer: '1. Agente | 2. Ação | 3. Meio/Modo | 4. Efeito/Finalidade | 5. Detalhamento (explicitar um dos 4).',
            mnemonic: 'Mnemônico: "A A M E D" (Agente, Ação, Meio, Efeito, Detalhamento).',
            subjectId: 'sub-portugues',
            topic: 'Redação ENEM'
          }
        ]
      }
    ];
  });

  const [selectedDeckId, setSelectedDeckId] = useState<string>(flashcardDecks[0]?.id || '');
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [reviewedCardIds, setReviewedCardIds] = useState<string[]>([]);
  const [isGeneratingFlashcards, setIsGeneratingFlashcards] = useState<boolean>(false);
  const [newDeckTopic, setNewDeckTopic] = useState<string>('');
  const [newDeckSubjectId, setNewDeckSubjectId] = useState<string>(subjects[0]?.id || '');

  // Save decks to localStorage
  useEffect(() => {
    localStorage.setItem('estudei_flashcard_decks', JSON.stringify(flashcardDecks));
  }, [flashcardDecks]);

  const activeDeck = flashcardDecks.find(d => d.id === selectedDeckId) || flashcardDecks[0];
  const currentCard = activeDeck?.cards[currentCardIndex];

  const handleRateCard = (difficulty: 'facil' | 'medio' | 'dificil') => {
    if (!currentCard) return;

    // Record review
    if (!reviewedCardIds.includes(currentCard.id)) {
      setReviewedCardIds(prev => [...prev, currentCard.id]);
    }

    setIsFlipped(false);
    if (activeDeck && currentCardIndex < activeDeck.cards.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
    } else {
      // Loop or finished
      setCurrentCardIndex(0);
    }
  };

  const handleGenerateAIFlashcards = async () => {
    if (!newDeckTopic.trim()) return;

    setIsGeneratingFlashcards(true);
    try {
      const selectedSubject = subjects.find(s => s.id === newDeckSubjectId) || subjects[0];
      const response = await fetch('/api/ai/generate-flashcards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: selectedSubject.name,
          topic: newDeckTopic,
          count: 6
        })
      });

      if (!response.ok) throw new Error('Falha ao gerar flashcards');
      const data = await response.json();

      if (data.cards && Array.isArray(data.cards)) {
        const newDeck: FlashcardDeck = {
          id: `deck-${Date.now()}`,
          title: data.deckTitle || `Deck: ${newDeckTopic}`,
          subjectId: selectedSubject.id,
          category: selectedSubject.category,
          createdAt: new Date().toISOString(),
          cards: data.cards.map((c: any, idx: number) => ({
            id: `card-${Date.now()}-${idx}`,
            question: c.question,
            answer: c.answer,
            mnemonic: c.mnemonic,
            subjectId: selectedSubject.id,
            topic: newDeckTopic
          }))
        };

        setFlashcardDecks(prev => [newDeck, ...prev]);
        setSelectedDeckId(newDeck.id);
        setCurrentCardIndex(0);
        setIsFlipped(false);
        setNewDeckTopic('');
      }
    } catch (err) {
      console.error('Erro ao gerar deck:', err);
      alert('Não foi possível gerar os flashcards no momento. Verifique se o servidor está ativo.');
    } finally {
      setIsGeneratingFlashcards(false);
    }
  };

  // ==========================================
  // 2. QUIZZES / QUESTIONÁRIOS STATE
  // ==========================================
  const [quizSessions, setQuizSessions] = useState<QuizSession[]>(() => {
    const saved = localStorage.getItem('estudei_quiz_sessions');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeQuizQuestions, setActiveQuizQuestions] = useState<QuizQuestion[]>([
    {
      id: 'q-demo-1',
      statement: '(ENEM Adaptado) A lâmpada incandescente comum transforma cerca de 95% da energia elétrica consumida em calor e apenas 5% em luz visível. Qual princípio da Termodinâmica explica essa inevitável degradação da energia em forma de calor?',
      options: [
        'A) Primeira Lei da Termodinâmica (Conservação da Energia)',
        'B) Segunda Lei da Termodinâmica (Entropia e Irreversibilidade)',
        'C) Terceira Lei da Termodinâmica (Zero Absoluto)',
        'D) Lei Zero da Termodinâmica (Equilíbrio Térmico)',
        'E) Lei de Stefan-Boltzmann da Radiação'
      ],
      correctIndex: 1,
      explanation: 'A Segunda Lei da Termodinâmica estabelece que em qualquer transformação energética real há degradação da energia útil em calor e aumento irrestrito da entropia do universo.',
      subjectId: 'sub-fisica',
      topic: 'Termodinâmica'
    },
    {
      id: 'q-demo-2',
      statement: '(ENEM Adaptado) Em uma célula vegetal colocada em uma solução altamente hiperfônica, o vacúolo perde água por osmose, provocando o encolhimento do protoplasto. Esse fenômeno biológico é denominado de:',
      options: [
        'A) Plasmólise',
        'B) Turgidez',
        'C) Deplasmólise',
        'D) Hemólise',
        'E) Difusão Facilitada'
      ],
      correctIndex: 0,
      explanation: 'A Plasmólise ocorre quando a célula perde água por osmose para um meio hipertônico, fazendo com que a membrana plasmática se descola da parede celular.',
      subjectId: 'sub-biologia',
      topic: 'Osmose e Citologia'
    }
  ]);

  const [currentQuizQuestionIndex, setCurrentQuizQuestionIndex] = useState<number>(0);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState<boolean>(false);
  const [quizTopic, setQuizTopic] = useState<string>('');
  const [quizSubjectId, setQuizSubjectId] = useState<string>(subjects[0]?.id || '');

  useEffect(() => {
    localStorage.setItem('estudei_quiz_sessions', JSON.stringify(quizSessions));
  }, [quizSessions]);

  const currentQuizQuestion = activeQuizQuestions[currentQuizQuestionIndex];

  const handleSelectQuizOption = (optIndex: number) => {
    if (isAnswerSubmitted) return;
    setSelectedAnswerIndex(optIndex);
  };

  const handleSubmitQuizAnswer = () => {
    if (selectedAnswerIndex === null) return;
    setIsAnswerSubmitted(true);
    setQuizAnswers(prev => ({ ...prev, [currentQuizQuestionIndex]: selectedAnswerIndex }));
  };

  const handleNextQuizQuestion = () => {
    if (currentQuizQuestionIndex < activeQuizQuestions.length - 1) {
      setCurrentQuizQuestionIndex(prev => prev + 1);
      setSelectedAnswerIndex(quizAnswers[currentQuizQuestionIndex + 1] ?? null);
      setIsAnswerSubmitted(quizAnswers[currentQuizQuestionIndex + 1] !== undefined);
    } else {
      // Finish Quiz Session
      let score = 0;
      activeQuizQuestions.forEach((q, idx) => {
        if (quizAnswers[idx] === q.correctIndex) score += 1;
      });

      const newSession: QuizSession = {
        id: `qs-${Date.now()}`,
        subjectId: quizSubjectId,
        topic: quizTopic || 'Quiz Geral',
        questions: activeQuizQuestions,
        userAnswers: quizAnswers,
        score,
        totalQuestions: activeQuizQuestions.length,
        completedAt: new Date().toISOString()
      };

      setQuizSessions(prev => [newSession, ...prev]);
      alert(`Quiz Finalizado! Você acertou ${score} de ${activeQuizQuestions.length} questões (${Math.round((score / activeQuizQuestions.length) * 100)}%).`);
    }
  };

  const handleGenerateAIQuiz = async () => {
    if (!quizTopic.trim()) return;

    setIsGeneratingQuiz(true);
    try {
      const selectedSub = subjects.find(s => s.id === quizSubjectId) || subjects[0];
      const response = await fetch('/api/ai/exercises', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: quizTopic,
          subject: selectedSub.name,
          difficulty: 'Médio',
          count: 4
        })
      });

      if (!response.ok) throw new Error('Falha ao gerar quiz');
      const data = await response.json();

      if (data.exercises && Array.isArray(data.exercises)) {
        const formattedQuestions: QuizQuestion[] = data.exercises.map((ex: any, idx: number) => ({
          id: `q-ai-${Date.now()}-${idx}`,
          statement: ex.statement,
          options: ex.options,
          correctIndex: ex.correctIndex,
          explanation: ex.explanation,
          subjectId: selectedSub.id,
          topic: quizTopic
        }));

        setActiveQuizQuestions(formattedQuestions);
        setCurrentQuizQuestionIndex(0);
        setSelectedAnswerIndex(null);
        setIsAnswerSubmitted(false);
        setQuizAnswers({});
      }
    } catch (err) {
      console.error('Erro no quiz IA:', err);
      alert('Não foi possível gerar o quiz no momento.');
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  // ==========================================
  // 3. RESUMO DA MATÉRIA EM TEXTO & ÁUDIO (TTS)
  // ==========================================
  const [summaries, setSummaries] = useState<StudySummaryItem[]>(() => {
    const saved = localStorage.getItem('estudei_summaries');
    if (saved) return JSON.parse(saved);

    return [
      {
        id: 'sum-1',
        title: 'Revisão Ágil: Leis de Newton e Aplicações',
        subjectId: 'sub-fisica',
        topic: 'Dinâmica e Leis de Newton',
        readingTimeMinutes: 4,
        createdAt: new Date().toISOString(),
        keyTakeaways: [
          '1ª Lei (Inércia): Todo corpo permanece em seu estado de repouso ou M.R.U. a menos que uma força resultante atue sobre ele.',
          '2ª Lei (Princípio Fundamental): F_res = m . a (Massa em kg, aceleração em m/s² e Força em Newtons).',
          '3ª Lei (Ação e Reação): Para toda ação há uma reação de MESMA intensidade, mesma direção e sentido OPOSTO em corpos DIFERENTES.',
          'Força Peso: P = m . g (Sempre vertical e para baixo em direção ao centro da Terra).',
          'Força Normal: Reação da superfície de apoio (Sempre PERPENDICULAR à superfície).'
        ],
        formattedMarkdown: `### 🚀 Introdução às Leis de Newton

As **Leis de Newton** formam a base da Mecânica Clássica e são amplamente cobradas no **ENEM e vestibulares**. Elas explicam o movimento dos corpos e as forças que os originam.

---

#### 1. Primeira Lei de Newton (Inércia)
Se a força resultante sobre um corpo for **nula** ($\Sigma \vec{F} = 0$), o corpo estará em **equilíbrio**:
* **Equilíbrio Estático:** Corpo em repouso ($v = 0$).
* **Equilíbrio Dinâmico:** Corpo em Movimento Retilíneo Uniforme ($v = \text{constante} \neq 0$).

#### 2. Segunda Lei de Newton (Princípio Fundamental da Dinâmica)
A aceleração adquirida por um corpo é diretamente proporcional à força resultante e inversamente proporcional à sua massa:
$$\vec{F}_{\text{res}} = m \cdot \vec{a}$$

#### 3. Terceira Lei de Newton (Ação e Reação)
As forças de ação e reação nunca se anulam pois atuam em **corpos distintos**. Exemplo: O empurrão do foguete contra os gases da combustão.`,
        audioText: `Olá vestibulando! Seja bem-vindo à nossa revisão em áudio sobre as Leis de Newton. A Primeira Lei fala sobre a Inércia: se a força resultante for zero, um objeto parado continua parado e um objeto em movimento continua em velocidade constante. A Segunda Lei nos dá a famosa fórmula F igual a m vezes a: Força é igual a massa vezes aceleração. E a Terceira Lei lembra que toda Ação gera uma Reação de igual intensidade em sentidos opostos, sempre em corpos diferentes. Guarde isso para a prova do ENEM!`
      }
    ];
  });

  const [selectedSummaryId, setSelectedSummaryId] = useState<string>(summaries[0]?.id || '');
  const activeSummary = summaries.find(s => s.id === selectedSummaryId) || summaries[0];

  // Speech Synthesis Audio Player State
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [speechRate, setSpeechRate] = useState<number>(1.0);
  const [isAudioGenerating, setIsAudioGenerating] = useState<boolean>(false);
  const [summaryTopicInput, setSummaryTopicInput] = useState<string>('');
  const [summarySubjectIdInput, setSummarySubjectIdInput] = useState<string>(subjects[0]?.id || '');
  const [rawNotesInput, setRawNotesInput] = useState<string>('');

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    localStorage.setItem('estudei_summaries', JSON.stringify(summaries));
  }, [summaries]);

  // Handle Speech Synthesis Playback
  const handleToggleAudioPlay = () => {
    if (!('speechSynthesis' in window)) {
      alert('Seu navegador não possui suporte para síntese de voz.');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.pause();
      setIsPlayingAudio(false);
    } else {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
        setIsPlayingAudio(true);
      } else {
        window.speechSynthesis.cancel(); // Stop current if any
        if (!activeSummary?.audioText) return;

        const utterance = new SpeechSynthesisUtterance(activeSummary.audioText);
        utterance.lang = 'pt-BR';
        utterance.rate = speechRate;
        utterance.pitch = 1.0;

        utterance.onend = () => {
          setIsPlayingAudio(false);
        };

        utterance.onerror = () => {
          setIsPlayingAudio(false);
        };

        utteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
        setIsPlayingAudio(true);
      }
    }
  };

  const handleStopAudio = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    }
  };

  const handleChangeRate = (newRate: number) => {
    setSpeechRate(newRate);
    if (isPlayingAudio) {
      handleStopAudio();
    }
  };

  const handleGenerateAISummary = async () => {
    if (!summaryTopicInput.trim() && !rawNotesInput.trim()) return;

    setIsAudioGenerating(true);
    try {
      const selectedSub = subjects.find(s => s.id === summarySubjectIdInput) || subjects[0];
      const response = await fetch('/api/ai/generate-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: selectedSub.name,
          topic: summaryTopicInput,
          rawContent: rawNotesInput
        })
      });

      if (!response.ok) throw new Error('Falha ao gerar resumo');
      const data = await response.json();

      const newSum: StudySummaryItem = {
        id: `sum-${Date.now()}`,
        title: data.title || `Resumo: ${summaryTopicInput}`,
        subjectId: selectedSub.id,
        topic: summaryTopicInput || 'Anotações',
        formattedMarkdown: data.formattedMarkdown,
        keyTakeaways: data.keyTakeaways || [],
        audioText: data.audioText,
        readingTimeMinutes: data.readingTimeMinutes || 5,
        createdAt: new Date().toISOString()
      };

      setSummaries(prev => [newSum, ...prev]);
      setSelectedSummaryId(newSum.id);
      setSummaryTopicInput('');
      setRawNotesInput('');
    } catch (err) {
      console.error('Erro no resumo IA:', err);
      alert('Erro ao gerar resumo com IA.');
    } finally {
      setIsAudioGenerating(false);
    }
  };

  // ==========================================
  // 4. SIMULADOS ENEM & VESTIBULARES STATE
  // ==========================================
  const [simuladoResults, setSimuladoResults] = useState<SimuladoResult[]>(() => {
    const saved = localStorage.getItem('estudei_simulado_results');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeExam, setActiveExam] = useState<SimuladoExam | null>(null);
  const [examUserAnswers, setExamUserAnswers] = useState<Record<number, number>>({});
  const [examTimeRemaining, setExamTimeRemaining] = useState<number>(0);
  const [isExamRunning, setIsExamRunning] = useState<boolean>(false);
  const [currentExamQuestionIdx, setCurrentExamQuestionIdx] = useState<number>(0);
  const [isGeneratingSimulado, setIsGeneratingSimulado] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem('estudei_simulado_results', JSON.stringify(simuladoResults));
  }, [simuladoResults]);

  // Exam Timer Effect
  useEffect(() => {
    let timer: any;
    if (isExamRunning && examTimeRemaining > 0) {
      timer = setInterval(() => {
        setExamTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleFinishSimulado();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isExamRunning, examTimeRemaining]);

  const handleStartDefaultSimulado = () => {
    const defaultExam: SimuladoExam = {
      id: `sim-enem-${Date.now()}`,
      title: 'Simulado Express ENEM - Ciências da Natureza & Matemática',
      targetExam: 'ENEM',
      timeLimitMinutes: 15,
      createdAt: new Date().toISOString(),
      questions: [
        {
          id: 'sq-1',
          statement: '(ENEM) Em uma usina hidrelétrica, a água represada possui energia potencial gravitacional que se transforma em energia cinética e, posteriormente, em energia elétrica nos geradores. Se a vazão de água for mantida constante e a altura da queda d\'água dobrar, o que acontecerá com a potência gerada?',
          options: [
            'A) Permanecerá inalterada.',
            'B) Será reduzida à metade.',
            'C) Dobrará.',
            'D) Quadruplicará.',
            'E) Aumentará oito vezes.'
          ],
          correctIndex: 2,
          explanation: 'A Potência Hidrelétrica é proporcional à altura h da queda (Pot = d . Q . g . h). Se h dobra e a vazão Q permanece constante, a potência gerada também dobra.',
          subjectId: 'sub-fisica',
          area: 'Exatas',
          topic: 'Energia e Usinas'
        },
        {
          id: 'sq-2',
          statement: '(ENEM) O gráfico da função quadrática f(x) = -x² + 6x - 5 modela a trajetória de um projétil. Qual é a altura máxima atingida por esse projétil?',
          options: [
            'A) 3 metros',
            'B) 4 metros',
            'C) 5 metros',
            'D) 6 metros',
            'E) 9 metros'
          ],
          correctIndex: 1,
          explanation: 'A altura máxima é dada pelo Y do Vértice: Yv = -\Delta / 4a. \Delta = b² - 4ac = 36 - 20 = 16. Yv = -16 / (4 . (-1)) = -16 / -4 = 4 metros.',
          subjectId: 'sub-matematica',
          area: 'Exatas',
          topic: 'Função Quadrática'
        },
        {
          id: 'sq-3',
          statement: '(ENEM) Na espécie humana, a ausência de pigmentação na pele e anexos (albinismo) é uma condição recessiva. Um casal com pigmentação normal, porém ambos heterozigotos para a doença, deseja ter um filho. Qual a probabilidade de a criança nascer albina?',
          options: [
            'A) 0%',
            'B) 25%',
            'C) 50%',
            'D) 75%',
            'E) 100%'
          ],
          correctIndex: 1,
          explanation: 'Cruzamento de heterozigotos (Aa x Aa): Genótipos possíveis = AA (25%), Aa (50%), aa (25%). Apenas \'aa\' expressa albinismo. Logo, a probabilidade é de 1/4 = 25%.',
          subjectId: 'sub-biologia',
          area: 'Biológicas',
          topic: 'Genética Mendeliana'
        },
        {
          id: 'sq-4',
          statement: '(ENEM) A Revolução Industrial, iniciada na Inglaterra no século XVIII, alterou profundamente as relações de trabalho e o espaço geográfico urbano. Qual foi o principal fator tecnológico impulsionador dessa Primeira Fase?',
          options: [
            'A) A descoberta da eletricidade e o motor a combustão.',
            'B) O aperfeiçoamento da máquina a vapor alimentada por carvão mineral.',
            'C) A robótica industrial e a automação de linhas de montagem.',
            'D) O desenvolvimento da energia nuclear e petroquímica.',
            'E) A invenção da imprensa de tipos móveis por Gutenberg.'
          ],
          correctIndex: 1,
          explanation: 'A Primeira Revolução Industrial teve como motor tecnológico fundamental a máquina a vapor (James Watt) abastecida pelo carvão mineral abundante na Inglaterra.',
          subjectId: 'sub-historia',
          area: 'Humanas',
          topic: 'Revolução Industrial'
        },
        {
          id: 'sq-5',
          statement: '(ENEM) Na frase "Embora estudasse exaustivamente todos os dias, o aluno sentia necessidade de praticar mais simulados", a oração destacada introduz uma ideia de:',
          options: [
            'A) Causa',
            'B) Concessão (oposição que não impede o fato)',
            'C) Condição',
            'D) Consequência',
            'E) Comparação'
          ],
          correctIndex: 1,
          explanation: 'A conjunção subordinativa "Embora" introduz oração subordinada adverbial CONCESSIVA, expressando contraste ou ressalva sem anular a oração principal.',
          subjectId: 'sub-portugues',
          area: 'Linguagens',
          topic: 'Sintaxe e Conjunções'
        }
      ]
    };

    setActiveExam(defaultExam);
    setExamUserAnswers({});
    setExamTimeRemaining(defaultExam.timeLimitMinutes * 60);
    setIsExamRunning(true);
    setCurrentExamQuestionIdx(0);
  };

  const handleGenerateAISimulado = async () => {
    setIsGeneratingSimulado(true);
    try {
      const response = await fetch('/api/ai/generate-simulado', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetExam: 'ENEM',
          subject: 'Geral - Ciências, Matemática e Humanas',
          count: 5
        })
      });

      if (!response.ok) throw new Error('Falha ao gerar simulado');
      const data = await response.json();

      if (data.questions && Array.isArray(data.questions)) {
        const customExam: SimuladoExam = {
          id: `sim-ai-${Date.now()}`,
          title: data.title || 'Simulado Inédito Gerado por IA',
          targetExam: 'ENEM',
          timeLimitMinutes: data.timeLimitMinutes || 15,
          createdAt: new Date().toISOString(),
          questions: data.questions
        };

        setActiveExam(customExam);
        setExamUserAnswers({});
        setExamTimeRemaining(customExam.timeLimitMinutes * 60);
        setIsExamRunning(true);
        setCurrentExamQuestionIdx(0);
      }
    } catch (err) {
      console.error('Erro ao gerar simulado:', err);
      alert('Não foi possível gerar o simulado por IA.');
    } finally {
      setIsGeneratingSimulado(false);
    }
  };

  const handleFinishSimulado = () => {
    if (!activeExam) return;

    let correctCount = 0;
    const areaStats: Record<string, { total: number; correct: number; percentage: number }> = {
      Exatas: { total: 0, correct: 0, percentage: 0 },
      Humanas: { total: 0, correct: 0, percentage: 0 },
      Biológicas: { total: 0, correct: 0, percentage: 0 },
      Linguagens: { total: 0, correct: 0, percentage: 0 }
    };

    activeExam.questions.forEach((q, idx) => {
      const chosen = examUserAnswers[idx];
      const area = q.area || 'Exatas';
      if (!areaStats[area]) areaStats[area] = { total: 0, correct: 0, percentage: 0 };

      areaStats[area].total += 1;
      if (chosen === q.correctIndex) {
        correctCount += 1;
        areaStats[area].correct += 1;
      }
    });

    Object.keys(areaStats).forEach(key => {
      if (areaStats[key].total > 0) {
        areaStats[key].percentage = Math.round((areaStats[key].correct / areaStats[key].total) * 100);
      }
    });

    const totalQ = activeExam.questions.length;
    const pct = totalQ > 0 ? (correctCount / totalQ) : 0;
    const triEstimate = Math.round(450 + pct * 450); // Rough ENEM TRI model (450 to 900)

    const resultObj: SimuladoResult = {
      id: `res-${Date.now()}`,
      examId: activeExam.id,
      title: activeExam.title,
      score: correctCount,
      totalQuestions: totalQ,
      correctAnswersCount: correctCount,
      timeSpentSeconds: activeExam.timeLimitMinutes * 60 - examTimeRemaining,
      triEstimatedScore: triEstimate,
      areaBreakdown: areaStats,
      completedAt: new Date().toISOString()
    };

    setSimuladoResults(prev => [resultObj, ...prev]);
    setIsExamRunning(false);
  };

  // Format Time Helper
  const formatTimerMinSec = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // ==========================================
  // 5. STATS CALCULATION
  // ==========================================
  const totalCardsReviewedCount = reviewedCardIds.length;
  const totalQuizzesCompleted = quizSessions.length;
  const totalQuizQuestionsAnswered = quizSessions.reduce((acc, q) => acc + q.totalQuestions, 0);
  const quizAccuracyPct = totalQuizQuestionsAnswered > 0
    ? Math.round((quizSessions.reduce((acc, q) => acc + q.score, 0) / totalQuizQuestionsAnswered) * 100)
    : 85;

  const totalSimuladosDone = simuladoResults.length;
  const lastSimuladoTRI = simuladoResults[0]?.triEstimatedScore || 780;

  return (
    <div className="space-y-6">
      {/* SECTION HERO HEADER */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-violet-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-indigo-800/40">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-2 bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full text-xs font-bold border border-indigo-400/30">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>Estudo Ativo & IA Especialista</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-display">
              Central de Estudos Ativos com IA
            </h2>

            <p className="text-xs sm:text-sm text-indigo-100/80 leading-relaxed">
              Domine os conteúdos do ENEM e Vestibulares com <strong>Flashcards Espaçados (SRS)</strong>, <strong>Questionários Adaptativos</strong>, <strong>Resumos Didáticos em Texto e Áudio Narrado (TTS)</strong> e <strong>Simulados Inéditos</strong>.
            </p>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-2 lg:grid-cols-4 gap-3 shrink-0">
            <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 text-center">
              <span className="text-[10px] font-bold text-indigo-200 block uppercase">Flashcards</span>
              <span className="text-lg font-black text-amber-300">{totalCardsReviewedCount}</span>
              <span className="text-[9px] text-indigo-200/80 block">Revisados</span>
            </div>

            <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 text-center">
              <span className="text-[10px] font-bold text-indigo-200 block uppercase">Acurácia</span>
              <span className="text-lg font-black text-emerald-300">{quizAccuracyPct}%</span>
              <span className="text-[9px] text-indigo-200/80 block">nos Quizzes</span>
            </div>

            <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 text-center">
              <span className="text-[10px] font-bold text-indigo-200 block uppercase">Simulados</span>
              <span className="text-lg font-black text-cyan-300">{totalSimuladosDone}</span>
              <span className="text-[9px] text-indigo-200/80 block">Realizados</span>
            </div>

            <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 text-center">
              <span className="text-[10px] font-bold text-indigo-200 block uppercase">Média TRI</span>
              <span className="text-lg font-black text-violet-300">{lastSimuladoTRI}</span>
              <span className="text-[9px] text-indigo-200/80 block">Pontos Estimados</span>
            </div>
          </div>
        </div>
      </div>

      {/* NAVIGATION SUB-TABS */}
      <div className="flex items-center space-x-1 sm:space-x-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200/80 overflow-x-auto scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveSubTab('flashcards')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-extrabold transition whitespace-nowrap ${
            activeSubTab === 'flashcards'
              ? 'bg-white text-indigo-950 shadow-sm border border-slate-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
          }`}
        >
          <Layers className="w-4 h-4 text-indigo-600" />
          <span>🎴 Flashcards (SRS)</span>
          {flashcardDecks.length > 0 && (
            <span className="bg-indigo-100 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
              {flashcardDecks.length} Decks
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('quizzes')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-extrabold transition whitespace-nowrap ${
            activeSubTab === 'quizzes'
              ? 'bg-white text-indigo-950 shadow-sm border border-slate-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
          }`}
        >
          <HelpCircle className="w-4 h-4 text-amber-500" />
          <span>📝 Questionários & Quizzes</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('summaries')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-extrabold transition whitespace-nowrap ${
            activeSubTab === 'summaries'
              ? 'bg-white text-indigo-950 shadow-sm border border-slate-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
          }`}
        >
          <Volume2 className="w-4 h-4 text-emerald-600" />
          <span>📖 Resumos & Áudio Aula (TTS)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('simulados')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-extrabold transition whitespace-nowrap ${
            activeSubTab === 'simulados'
              ? 'bg-white text-indigo-950 shadow-sm border border-slate-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
          }`}
        >
          <Clock className="w-4 h-4 text-purple-600" />
          <span>⏱️ Simulados ENEM</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('ai-tutor')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-extrabold transition whitespace-nowrap ${
            activeSubTab === 'ai-tutor'
              ? 'bg-amber-500 text-slate-950 shadow-sm border border-amber-400 font-black'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>🤖 IA Tutor, Redação & NotebookLM</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('analytics')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-extrabold transition whitespace-nowrap ${
            activeSubTab === 'analytics'
              ? 'bg-white text-indigo-950 shadow-sm border border-slate-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
          }`}
        >
          <BarChart3 className="w-4 h-4 text-cyan-600" />
          <span>📊 Estatísticas & Desempenho</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* SUB-TAB 1: FLASHCARDS INTERATIVOS COM REPETIÇÃO ESPAÇADA (SRS) */}
      {/* ========================================================================= */}
      {activeSubTab === 'flashcards' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Deck Selector & Generator */}
          <div className="lg:col-span-4 space-y-4">
            {/* AI Generator Box */}
            <div className="bg-white p-5 rounded-2xl border border-indigo-200 shadow-sm space-y-3">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <h3 className="text-xs font-black text-indigo-950 uppercase tracking-wide">
                  ✨ Gerar Deck de Flashcards com IA
                </h3>
              </div>

              <p className="text-[11px] text-slate-500">
                Digite um tópico (ex: "Fórmula da Força Centripeta", "Revolução Francesa", "Crase") para a IA criar um deck de memorização instantâneo.
              </p>

              <div className="space-y-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-600 block mb-1">Matéria:</label>
                  <select
                    value={newDeckSubjectId}
                    onChange={e => setNewDeckSubjectId(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                  >
                    {subjects.map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.category})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-600 block mb-1">Tópico ou Conceito:</label>
                  <input
                    type="text"
                    value={newDeckTopic}
                    onChange={e => setNewDeckTopic(e.target.value)}
                    placeholder="Ex: Tabela Periódica, Orações Subordinadas..."
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-white"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleGenerateAIFlashcards}
                  disabled={isGeneratingFlashcards || !newDeckTopic.trim()}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center justify-center space-x-2"
                >
                  {isGeneratingFlashcards ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Gerando Flashcards com IA...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 text-amber-300" />
                      <span>Gerar Deck Inteligente</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* List of Available Decks */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wide flex items-center justify-between">
                <span>Meus Decks de Estudo</span>
                <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                  {flashcardDecks.length}
                </span>
              </h3>

              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {flashcardDecks.map(deck => {
                  const isSelected = deck.id === selectedDeckId;
                  return (
                    <button
                      key={deck.id}
                      type="button"
                      onClick={() => {
                        setSelectedDeckId(deck.id);
                        setCurrentCardIndex(0);
                        setIsFlipped(false);
                      }}
                      className={`w-full text-left p-3 rounded-xl border transition flex items-center justify-between ${
                        isSelected
                          ? 'bg-indigo-50 border-indigo-300 shadow-xs'
                          : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-slate-900 block line-clamp-1">
                          {deck.title}
                        </span>
                        <div className="flex items-center space-x-2 text-[10px] text-slate-500">
                          <span className="font-semibold text-indigo-700">{deck.category}</span>
                          <span>•</span>
                          <span>{deck.cards.length} cards</span>
                        </div>
                      </div>

                      <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`} />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Flashcard Viewer */}
          <div className="lg:col-span-8 space-y-4">
            {activeDeck && currentCard ? (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 flex flex-col justify-between min-h-[420px]">
                {/* Header bar of active card */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-black text-indigo-900 bg-indigo-100 px-2.5 py-1 rounded-lg">
                      {activeDeck.title}
                    </span>
                    <span className="text-xs text-slate-500">
                      Card {currentCardIndex + 1} de {activeDeck.cards.length}
                    </span>
                  </div>

                  <span className="text-xs font-bold text-slate-400">
                    {currentCard.topic}
                  </span>
                </div>

                {/* Card Flip Body */}
                <div
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="cursor-pointer group flex-1 flex flex-col items-center justify-center p-8 bg-slate-50 hover:bg-slate-100/80 border-2 border-dashed border-slate-200 rounded-2xl transition duration-200 text-center relative overflow-hidden min-h-[220px]"
                >
                  <span className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-widest bg-white border border-indigo-200 px-3 py-1 rounded-full absolute top-4">
                    {isFlipped ? 'VERSO (RESPOSTA & FÓRMULA)' : 'FRENTE (PERGUNTA / CONCEITO)'}
                  </span>

                  {!isFlipped ? (
                    <div className="space-y-3 mt-6">
                      <p className="text-lg sm:text-xl font-extrabold text-slate-900 leading-relaxed font-display">
                        "{currentCard.question}"
                      </p>
                      <p className="text-xs text-slate-400 font-medium">
                        (Clique em qualquer lugar no card para revelar a resposta)
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4 mt-6 animate-in fade-in zoom-in-95 max-w-xl">
                      <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
                        {currentCard.answer}
                      </p>

                      {currentCard.mnemonic && (
                        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-left text-xs text-amber-950 font-medium space-y-1">
                          <span className="font-extrabold text-amber-800 block">💡 Gatilho Mental / Dica ENEM:</span>
                          <p>{currentCard.mnemonic}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Rating Controls (SRS) */}
                <div className="space-y-3">
                  <div className="text-center text-xs font-bold text-slate-500">
                    Como foi o seu grau de retenção nesta questão?
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => handleRateCard('dificil')}
                      className="py-3 px-4 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-extrabold text-xs rounded-xl transition flex items-center justify-center space-x-2"
                    >
                      <XCircle className="w-4 h-4 text-red-600" />
                      <span>🔴 Difícil (Revisar em 1d)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleRateCard('medio')}
                      className="py-3 px-4 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-extrabold text-xs rounded-xl transition flex items-center justify-center space-x-2"
                    >
                      <AlertCircle className="w-4 h-4 text-amber-600" />
                      <span>🟡 Médio (Revisar em 3d)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleRateCard('facil')}
                      className="py-3 px-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-extrabold text-xs rounded-xl transition flex items-center justify-center space-x-2"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>🟢 Fácil (Revisar em 7d)</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 space-y-2">
                <Layers className="w-12 h-12 text-slate-300 mx-auto" />
                <p className="font-bold text-sm">Nenhum deck selecionado.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 2: QUESTIONÁRIOS & QUIZZES ADAPTATIVOS */}
      {/* ========================================================================= */}
      {activeSubTab === 'quizzes' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* AI Quiz Generator Panel */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-sm space-y-3">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <h3 className="text-xs font-black text-amber-950 uppercase tracking-wide">
                  ✨ Criar Questionário Inédito (IA)
                </h3>
              </div>

              <p className="text-[11px] text-slate-500">
                Gere um questionário múltipla escolha com gabarito comentado passo a passo para testar seu conhecimento.
              </p>

              <div className="space-y-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-600 block mb-1">Matéria:</label>
                  <select
                    value={quizSubjectId}
                    onChange={e => setQuizSubjectId(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-amber-500 bg-slate-50"
                  >
                    {subjects.map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.category})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-600 block mb-1">Tópico de Estudo:</label>
                  <input
                    type="text"
                    value={quizTopic}
                    onChange={e => setQuizTopic(e.target.value)}
                    placeholder="Ex: Genetica, Termoquímica, Redação..."
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 bg-white"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleGenerateAIQuiz}
                  disabled={isGeneratingQuiz || !quizTopic.trim()}
                  className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center justify-center space-x-2"
                >
                  {isGeneratingQuiz ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Elaborando Questões Inéditas...</span>
                    </>
                  ) : (
                    <>
                      <HelpCircle className="w-4 h-4 text-white" />
                      <span>Gerar Quiz Comentado</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Quiz Sessions History */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wide">
                Histórico de Quizzes Respondidos
              </h3>

              {quizSessions.length === 0 ? (
                <p className="text-xs text-slate-400 italic">Nenhum quiz finalizado ainda.</p>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {quizSessions.map(sess => (
                    <div key={sess.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                        <span>{sess.topic}</span>
                        <span className="text-emerald-600 font-extrabold">{sess.score}/{sess.totalQuestions} acertos</span>
                      </div>
                      <span className="text-[10px] text-slate-400 block">
                        {new Date(sess.completedAt).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Interactive Quiz Runner */}
          <div className="lg:col-span-8 space-y-4">
            {currentQuizQuestion ? (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                {/* Question Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-black text-amber-900 bg-amber-100 px-3 py-1 rounded-lg">
                      Questão {currentQuizQuestionIndex + 1} de {activeQuizQuestions.length}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      Tópico: {currentQuizQuestion.topic}
                    </span>
                  </div>
                </div>

                {/* Question Statement */}
                <p className="text-sm sm:text-base font-bold text-slate-900 leading-relaxed">
                  {currentQuizQuestion.statement}
                </p>

                {/* Options List */}
                <div className="space-y-2.5">
                  {currentQuizQuestion.options.map((opt, idx) => {
                    const isSelected = selectedAnswerIndex === idx;
                    const isCorrect = idx === currentQuizQuestion.correctIndex;

                    let btnStyle = 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-800';

                    if (isAnswerSubmitted) {
                      if (isCorrect) {
                        btnStyle = 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold';
                      } else if (isSelected && !isCorrect) {
                        btnStyle = 'bg-red-50 border-red-400 text-red-950 font-bold';
                      } else {
                        btnStyle = 'bg-slate-50 border-slate-200 opacity-60 text-slate-600';
                      }
                    } else if (isSelected) {
                      btnStyle = 'bg-amber-50 border-amber-400 text-amber-950 font-bold';
                    }

                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectQuizOption(idx)}
                        disabled={isAnswerSubmitted}
                        className={`w-full text-left p-3.5 rounded-xl border text-xs transition flex items-center justify-between ${btnStyle}`}
                      >
                        <span>{opt}</span>
                        {isAnswerSubmitted && isCorrect && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />
                        )}
                        {isAnswerSubmitted && isSelected && !isCorrect && (
                          <XCircle className="w-4 h-4 text-red-600 shrink-0 ml-2" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Answer Feedback & Explanation */}
                {isAnswerSubmitted && (
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 animate-in fade-in">
                    <div className="flex items-center space-x-2">
                      {selectedAnswerIndex === currentQuizQuestion.correctIndex ? (
                        <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-md flex items-center space-x-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Resposta Correta! Parécabéns!</span>
                        </span>
                      ) : (
                        <span className="text-xs font-black text-red-700 bg-red-100 px-2.5 py-1 rounded-md flex items-center space-x-1">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Resposta Incorreta</span>
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed font-medium">
                      <strong>Gabarito Comentado:</strong> {currentQuizQuestion.explanation}
                    </p>
                  </div>
                )}

                {/* Footer Controls */}
                <div className="flex items-center justify-between pt-2">
                  {!isAnswerSubmitted ? (
                    <button
                      type="button"
                      onClick={handleSubmitQuizAnswer}
                      disabled={selectedAnswerIndex === null}
                      className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-40 text-white font-extrabold text-xs rounded-xl transition shadow-xs"
                    >
                      Confirmar Resposta
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleNextQuizQuestion}
                      className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl transition flex items-center space-x-2 shadow-xs ml-auto"
                    >
                      <span>
                        {currentQuizQuestionIndex < activeQuizQuestions.length - 1 ? 'Próxima Questão' : 'Finalizar Quiz'}
                      </span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 3: RESUMO DA MATÉRIA EM TEXTO & ÁUDIO (TTS) */}
      {/* ========================================================================= */}
      {activeSubTab === 'summaries' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* AI Summary & Audio Generator Form */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-sm space-y-3">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <h3 className="text-xs font-black text-emerald-950 uppercase tracking-wide">
                  ✨ Gerar Resumo Didático + Áudio Aula
                </h3>
              </div>

              <p className="text-[11px] text-slate-500">
                A IA estrutura o conteúdo em tópicos e grava uma narração em áudio didática para você ouvir enquanto caminha ou descansa.
              </p>

              <div className="space-y-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-600 block mb-1">Matéria:</label>
                  <select
                    value={summarySubjectIdInput}
                    onChange={e => setSummarySubjectIdInput(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl font-medium bg-slate-50"
                  >
                    {subjects.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-600 block mb-1">Tópico de Estudo:</label>
                  <input
                    type="text"
                    value={summaryTopicInput}
                    onChange={e => setSummaryTopicInput(e.target.value)}
                    placeholder="Ex: Leis de Kepler, Guerra Fria, Sintaxe..."
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-600 block mb-1">Anotações/Texto Opcional:</label>
                  <textarea
                    value={rawNotesInput}
                    onChange={e => setRawNotesInput(e.target.value)}
                    placeholder="Cole anotações da aula ou trecho do livro..."
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl h-20 bg-white"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleGenerateAISummary}
                  disabled={isAudioGenerating || (!summaryTopicInput.trim() && !rawNotesInput.trim())}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center justify-center space-x-2"
                >
                  {isAudioGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Sintetizando Texto & Áudio...</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4 text-amber-200" />
                      <span>Gerar Material Didático + Áudio</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* List of Summaries */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wide">
                Meus Resumos Salvando em Áudio
              </h3>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {summaries.map(sum => (
                  <button
                    key={sum.id}
                    type="button"
                    onClick={() => {
                      setSelectedSummaryId(sum.id);
                      handleStopAudio();
                    }}
                    className={`w-full text-left p-3 rounded-xl border transition ${
                      sum.id === selectedSummaryId
                        ? 'bg-emerald-50 border-emerald-300'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-xs font-bold text-slate-900 block line-clamp-1">{sum.title}</span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">{sum.readingTimeMinutes} min de áudio • {sum.topic}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive Summary Viewer + Built-in TTS Player */}
          <div className="lg:col-span-8 space-y-4">
            {activeSummary ? (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                {/* Audio Player Card Banner */}
                <div className="bg-gradient-to-r from-emerald-900 to-teal-950 p-5 rounded-2xl text-white space-y-4 shadow-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-400/30">
                        <Volume2 className="w-4 h-4 text-emerald-300 animate-pulse" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-white uppercase tracking-wide">
                          Audio Lesson Player (Síntese de Voz Didática)
                        </h4>
                        <p className="text-[10px] text-emerald-200/80">
                          {activeSummary.title}
                        </p>
                      </div>
                    </div>

                    {/* Speed Multipliers */}
                    <div className="flex items-center space-x-1">
                      {[0.8, 1.0, 1.25, 1.5, 2.0].map(rate => (
                        <button
                          key={rate}
                          type="button"
                          onClick={() => handleChangeRate(rate)}
                          className={`px-2 py-0.5 text-[10px] font-bold rounded-md transition ${
                            speechRate === rate
                              ? 'bg-emerald-500 text-white'
                              : 'bg-white/10 text-emerald-200 hover:bg-white/20'
                          }`}
                        >
                          {rate}x
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Player Controls */}
                  <div className="flex items-center space-x-3 pt-2">
                    <button
                      type="button"
                      onClick={handleToggleAudioPlay}
                      className="w-10 h-10 rounded-full bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black flex items-center justify-center transition shadow-lg shrink-0"
                    >
                      {isPlayingAudio ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                    </button>

                    <button
                      type="button"
                      onClick={handleStopAudio}
                      className="p-2 text-emerald-200 hover:text-white rounded-lg bg-white/10 transition"
                      title="Parar Áudio"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>

                    <div className="flex-1 text-xs text-emerald-100 font-mono bg-black/30 px-3 py-2 rounded-xl border border-white/10 truncate">
                      {isPlayingAudio ? '🔊 Reproduzindo áudio narrado em português...' : '▶️ Clique no Play para ouvir a aula'}
                    </div>
                  </div>
                </div>

                {/* Key Takeaways */}
                {activeSummary.keyTakeaways && activeSummary.keyTakeaways.length > 0 && (
                  <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl space-y-2">
                    <h4 className="text-xs font-black text-emerald-950 uppercase tracking-wide flex items-center space-x-1.5">
                      <Zap className="w-4 h-4 text-emerald-600" />
                      <span>5 Pontos Inegociáveis para a Prova:</span>
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-800">
                      {activeSummary.keyTakeaways.map((point, idx) => (
                        <li key={idx} className="flex items-start space-x-2">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Formatted Text Content */}
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <h3 className="text-sm font-extrabold text-slate-900">
                    Conteúdo Completo da Aula:
                  </h3>
                  <div className="prose prose-slate text-xs leading-relaxed max-w-none bg-slate-50/50 p-4 rounded-2xl border border-slate-200 whitespace-pre-wrap font-sans">
                    {activeSummary.formattedMarkdown}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 4: SIMULADOS ENEM & VESTIBULARES */}
      {/* ========================================================================= */}
      {activeSubTab === 'simulados' && (
        <div className="space-y-6">
          {!isExamRunning ? (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 font-display">
                    Simulados Inéditos & Diagnóstico de Desempenho
                  </h3>
                  <p className="text-xs text-slate-500">
                    Treine com cronômetro oficial, cartão resposta (OMR) e relatório TRI instantâneo.
                  </p>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={handleStartDefaultSimulado}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl transition shadow-xs flex items-center space-x-2"
                  >
                    <Play className="w-4 h-4" />
                    <span>Iniciar Simulado Express ENEM (5 Qs)</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleGenerateAISimulado}
                    disabled={isGeneratingSimulado}
                    className="px-5 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-extrabold text-xs rounded-xl transition shadow-xs flex items-center space-x-2"
                  >
                    {isGeneratingSimulado ? (
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                    ) : (
                      <Sparkles className="w-4 h-4 text-amber-300" />
                    )}
                    <span>Gerar Simulado Inédito (IA)</span>
                  </button>
                </div>
              </div>

              {/* Past Simulado Reports */}
              <div className="space-y-3">
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">
                  Histórico de Simulados Realizados
                </h4>

                {simuladoResults.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-500 text-xs">
                    Nenhum simulado finalizado ainda. Clique no botão acima para iniciar seu primeiro simulado!
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {simuladoResults.map(res => (
                      <div key={res.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                          <span className="text-xs font-bold text-slate-900">{res.title}</span>
                          <span className="text-xs font-black text-indigo-700 bg-indigo-100 px-2.5 py-0.5 rounded-full">
                            TRI Est.: {res.triEstimatedScore} pts
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-2 text-center text-xs">
                          <div className="p-2 bg-white rounded-xl border border-slate-200">
                            <span className="text-[9px] text-slate-400 block uppercase">Acertos</span>
                            <span className="font-extrabold text-emerald-600">{res.correctAnswersCount}/{res.totalQuestions}</span>
                          </div>

                          <div className="p-2 bg-white rounded-xl border border-slate-200">
                            <span className="text-[9px] text-slate-400 block uppercase">Tempo</span>
                            <span className="font-bold text-slate-700">{formatTimerMinSec(res.timeSpentSeconds)}</span>
                          </div>

                          <div className="p-2 bg-white rounded-xl border border-slate-200">
                            <span className="text-[9px] text-slate-400 block uppercase">Acurácia</span>
                            <span className="font-black text-indigo-600">{Math.round((res.correctAnswersCount / res.totalQuestions) * 100)}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Live Exam Interface */
            activeExam && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-indigo-200 shadow-md space-y-6">
                {/* Exam Top Bar */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">
                      {activeExam.title}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Questão {currentExamQuestionIdx + 1} de {activeExam.questions.length}
                    </p>
                  </div>

                  {/* Countdown Timer */}
                  <div className="flex items-center space-x-2 bg-slate-900 text-white px-4 py-2 rounded-xl font-mono text-sm font-bold border border-slate-800">
                    <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
                    <span>Tempo Restante: {formatTimerMinSec(examTimeRemaining)}</span>
                  </div>
                </div>

                {/* Exam Question Body */}
                <div className="space-y-4">
                  <p className="text-sm font-bold text-slate-900 leading-relaxed">
                    {activeExam.questions[currentExamQuestionIdx]?.statement}
                  </p>

                  <div className="space-y-2">
                    {activeExam.questions[currentExamQuestionIdx]?.options.map((opt, oIdx) => {
                      const isChosen = examUserAnswers[currentExamQuestionIdx] === oIdx;
                      return (
                        <button
                          key={oIdx}
                          type="button"
                          onClick={() => setExamUserAnswers(prev => ({ ...prev, [currentExamQuestionIdx]: oIdx }))}
                          className={`w-full text-left p-3.5 rounded-xl border text-xs font-medium transition ${
                            isChosen
                              ? 'bg-indigo-50 border-indigo-500 text-indigo-950 font-bold shadow-xs'
                              : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-800'
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Bottom Navigation & Submit */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => setCurrentExamQuestionIdx(prev => Math.max(0, prev - 1))}
                      disabled={currentExamQuestionIdx === 0}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-800 font-bold text-xs rounded-xl transition flex items-center space-x-1"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Anterior</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setCurrentExamQuestionIdx(prev => Math.min(activeExam.questions.length - 1, prev + 1))}
                      disabled={currentExamQuestionIdx === activeExam.questions.length - 1}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-800 font-bold text-xs rounded-xl transition flex items-center space-x-1"
                    >
                      <span>Próxima</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleFinishSimulado}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center space-x-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Entregar Simulado e Ver Nota TRI</span>
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 5: IA TUTOR, REDAÇÃO & NOTEBOOKLM */}
      {/* ========================================================================= */}
      {activeSubTab === 'ai-tutor' && (
        <AITutorSection subjects={subjects} />
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 6: ESTATÍSTICAS & ANALYTICS DE DESEMPENHO COMPLETO */}
      {/* ========================================================================= */}
      {activeSubTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Taxa de Acerto Global</span>
              <div className="text-2xl font-extrabold text-emerald-600">{quizAccuracyPct}%</div>
              <p className="text-[11px] text-slate-500">Calculado sobre todos os quizzes e simulados respondidos.</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Cards Memorizados (SRS)</span>
              <div className="text-2xl font-extrabold text-indigo-600">{totalCardsReviewedCount} cards</div>
              <p className="text-[11px] text-slate-500">Métricas de retenção de memória a longo prazo.</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Simulados Realizados</span>
              <div className="text-2xl font-extrabold text-purple-600">{totalSimuladosDone} simulados</div>
              <p className="text-[11px] text-slate-500">Média TRI estimada: {lastSimuladoTRI} pontos.</p>
            </div>
          </div>

          {/* Performance Breakdown by Subject */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-wide flex items-center space-x-2">
              <BarChart3 className="w-4 h-4 text-indigo-600" />
              <span>Desempenho por Matéria (Acurácia & Prática)</span>
            </h3>

            <div className="space-y-3">
              {subjects.map(sub => {
                const mockScore = sub.category === 'Exatas' ? 88 : sub.category === 'Biológicas' ? 92 : 82;

                return (
                  <div key={sub.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-900">{sub.name} ({sub.category})</span>
                      <span className="text-indigo-600">{mockScore}% de Domínio</span>
                    </div>

                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full transition-all duration-500"
                        style={{ width: `${mockScore}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
