import { SchoolConfig, Subject, Evaluation, StudySessionLog, SpacedRevision, ParentGuardSettings, SchoolTimetable } from '../types';

export const initialSchoolConfig: SchoolConfig = {
  periodType: 'bimestre',
  passingScore: 6.0,
  maxScorePerPeriod: 10.0,
  recoveryType: 'bimestral',
  recoveryCalculation: 'substitutiva',
  evalCategories: [
    {
      id: 'cat-1',
      name: 'Provas Principais (A1)',
      weightPercent: 70,
      maxScore: 10.0,
      description: 'Avaliações formais individuais escritas aplicadas em sala.'
    },
    {
      id: 'cat-2',
      name: 'Trabalhos & Projetos (A2)',
      weightPercent: 30,
      maxScore: 10.0,
      description: 'Atividades em grupo, pesquisas, seminários e dever de casa.'
    }
  ]
};

export const initialSubjects: Subject[] = [
  {
    id: 'matematica',
    name: 'Matemática & Suas Tecnologias',
    category: 'Exatas',
    color: 'emerald',
    teacherName: '',
    enabled: true,
    topics: [
      { id: 'm1', name: 'Função Quadrática e Ponto de Mínimo/Máximo', taught: true, taughtDate: '2026-07-10' },
      { id: 'm2', name: 'Progressão Aritmética e Geométrica (PA e PG)', taught: true, taughtDate: '2026-07-18' },
      { id: 'm3', name: 'Geometria Plana: Áreas e Teorema de Pitágoras', taught: true, taughtDate: '2026-07-22' },
      { id: 'm4', name: 'Geometria Espacial: Prismas e Cilindros', taught: false },
      { id: 'm5', name: 'Estatística: Média, Moda e Desvio Padrão (ENEM)', taught: false },
    ],
    examScopeTopicIds: ['m1', 'm2', 'm3']
  },
  {
    id: 'fisica',
    name: 'Física',
    category: 'Exatas',
    color: 'cyan',
    teacherName: '',
    enabled: true,
    topics: [
      { id: 'f1', name: 'Cinemática: MUV e Lançamento Vertical', taught: true, taughtDate: '2026-07-05' },
      { id: 'f2', name: 'Leis de Newton e Força de Atrito', taught: true, taughtDate: '2026-07-15' },
      { id: 'f3', name: 'Trabalho, Energia Mecânica e Conservação', taught: false },
      { id: 'f4', name: 'Termodinâmica e Leis dos Gases', taught: false },
    ],
    examScopeTopicIds: ['f1', 'f2']
  },
  {
    id: 'quimica',
    name: 'Química',
    category: 'Exatas',
    color: 'teal',
    teacherName: '',
    enabled: true,
    topics: [
      { id: 'q1', name: 'Ligações Químicas e Geometria Molecular', taught: true, taughtDate: '2026-07-08' },
      { id: 'q2', name: 'Funções Inorgânicas: Ácidos, Bases e Sais', taught: true, taughtDate: '2026-07-20' },
      { id: 'q3', name: 'Estequiometria e Rendimento de Reações', taught: false },
    ],
    examScopeTopicIds: ['q1', 'q2']
  },
  {
    id: 'biologia',
    name: 'Biologia',
    category: 'Biológicas',
    color: 'green',
    teacherName: '',
    enabled: true,
    topics: [
      { id: 'b1', name: 'Citologia: Membrana Plasmática e Organelas', taught: true, taughtDate: '2026-07-04' },
      { id: 'b2', name: 'Ecologia: Cadeias Alimentares e Ciclos Biogeoquímicos', taught: true, taughtDate: '2026-07-19' },
      { id: 'b3', name: 'Genética Mendeliana e Biotecnologia', taught: false },
    ],
    examScopeTopicIds: ['b1', 'b2']
  },
  {
    id: 'historia',
    name: 'História do Brasil e Geral',
    category: 'Humanas',
    color: 'amber',
    teacherName: '',
    enabled: true,
    topics: [
      { id: 'h1', name: 'Brasil Império: Primeiro e Segundo Reinado', taught: true, taughtDate: '2026-07-12' },
      { id: 'h2', name: 'Primeira e Segunda Guerra Mundial', taught: true, taughtDate: '2026-07-21' },
      { id: 'h3', name: 'Ditadura Militar no Brasil (1964-1985)', taught: false },
    ],
    examScopeTopicIds: ['h1', 'h2']
  },
  {
    id: 'geografia',
    name: 'Geografia & Geopolítica',
    category: 'Humanas',
    color: 'amber',
    teacherName: '',
    enabled: true,
    topics: [
      { id: 'g1', name: 'Cartografia, Fuso Horário e Projeções', taught: true, taughtDate: '2026-07-11' },
      { id: 'g2', name: 'Urbanização Brasileira e Regiões de Influência', taught: true, taughtDate: '2026-07-20' },
      { id: 'g3', name: 'Geopolítica Mundial e Blocos Econômicos', taught: false },
    ],
    examScopeTopicIds: ['g1', 'g2']
  },
  {
    id: 'filosofia',
    name: 'Filosofia',
    category: 'Humanas',
    color: 'purple',
    teacherName: '',
    enabled: true,
    topics: [
      { id: 'fil1', name: 'Filosofia Antiga: Sócrates, Platão e Aristóteles', taught: true, taughtDate: '2026-07-09' },
      { id: 'fil2', name: 'Iluminismo, Contratualismo e Política', taught: false },
    ],
    examScopeTopicIds: ['fil1']
  },
  {
    id: 'sociologia',
    name: 'Sociologia',
    category: 'Humanas',
    color: 'purple',
    teacherName: '',
    enabled: true,
    topics: [
      { id: 'soc1', name: 'Clássicos da Sociologia: Durkheim, Marx e Weber', taught: true, taughtDate: '2026-07-14' },
      { id: 'soc2', name: 'Cultura, Identidade e Diversidade Social', taught: false },
    ],
    examScopeTopicIds: ['soc1']
  },
  {
    id: 'gramatica',
    name: 'Gramática & Interpretação de Texto',
    category: 'Linguagens',
    color: 'indigo',
    teacherName: '',
    enabled: true,
    topics: [
      { id: 'gr1', name: 'Análise Sintática e Regência Verbal/Nominal', taught: true, taughtDate: '2026-07-16' },
      { id: 'gr2', name: 'Crase e Pontuação no Texto', taught: true, taughtDate: '2026-07-22' },
      { id: 'gr3', name: 'Funções da Linguagem e Figuras de Linguagem', taught: false },
    ],
    examScopeTopicIds: ['gr1', 'gr2']
  },
  {
    id: 'literatura',
    name: 'Literatura Brasileira & Portuguesa',
    category: 'Linguagens',
    color: 'indigo',
    teacherName: 'Profa. Regina',
    enabled: true,
    topics: [
      { id: 'lit1', name: 'Modernismo no Brasil: 1ª e 2ª Geração', taught: true, taughtDate: '2026-07-13' },
      { id: 'lit2', name: 'Realismo e Machado de Assis', taught: false },
    ],
    examScopeTopicIds: ['lit1']
  },
  {
    id: 'portugues_redacao',
    name: 'Redação Dissertativa-Argumentativa (ENEM)',
    category: 'Redação',
    color: 'indigo',
    teacherName: 'Profa. Cláudia',
    enabled: true,
    topics: [
      { id: 'p1', name: 'Estrutura do Texto Dissertativo-Argumentativo ENEM', taught: true, taughtDate: '2026-07-02' },
      { id: 'p2', name: 'Repertório Curinga e Proposta de Intervenção Detalhada', taught: true, taughtDate: '2026-07-14' },
      { id: 'p3', name: 'Sintaxe: Concordância Verbal e Nominal', taught: true, taughtDate: '2026-07-23' },
    ],
    examScopeTopicIds: ['p1', 'p2', 'p3']
  },
  {
    id: 'ingles',
    name: 'Língua Inglesa',
    category: 'Linguagens',
    color: 'sky',
    teacherName: 'Teacher James',
    enabled: true,
    topics: [
      { id: 'ing1', name: 'Reading Comprehension & False Friends (ENEM)', taught: true, taughtDate: '2026-07-15' },
      { id: 'ing2', name: 'Linking Words & Connectors', taught: false },
    ],
    examScopeTopicIds: ['ing1']
  },
  {
    id: 'espanhol',
    name: 'Língua Espanhola',
    category: 'Linguagens',
    color: 'rose',
    teacherName: 'Profa. Pilar',
    enabled: false, // Desativada por padrão (pode ser ativada na gestão de matérias)
    topics: [
      { id: 'esp1', name: 'Interpretación de Textos y Heterosemánticos', taught: false },
      { id: 'esp2', name: 'Conectores y Conjugación Verbal', taught: false },
    ],
    examScopeTopicIds: []
  },
  {
    id: 'artes',
    name: 'Artes & Expressão',
    category: 'Linguagens',
    color: 'rose',
    teacherName: 'Profa. Renata',
    enabled: true,
    topics: [
      { id: 'art1', name: 'Vanguardas Europeias no Século XX', taught: true, taughtDate: '2026-07-17' },
      { id: 'art2', name: 'Arte Contemporânea Brasileira e Patrimônio', taught: false },
    ],
    examScopeTopicIds: ['art1']
  },
  {
    id: 'ed_fisica',
    name: 'Educação Física & Saúde',
    category: 'Biológicas',
    color: 'emerald',
    teacherName: 'Prof. André',
    enabled: true,
    topics: [
      { id: 'edf1', name: 'Anatomia do Movimento, Nutrição e Ergonomia', taught: true, taughtDate: '2026-07-10' },
    ],
    examScopeTopicIds: []
  },
  {
    id: 'atualidades',
    name: 'Atualidades & Geopolítica ENEM',
    category: 'Humanas',
    color: 'amber',
    teacherName: 'Prof. Sérgio',
    enabled: true,
    topics: [
      { id: 'atu1', name: 'Transição Energética e Mudanças Climáticas', taught: true, taughtDate: '2026-07-21' },
      { id: 'atu2', name: 'Inteligência Artificial e o Futuro do Trabalho', taught: false },
    ],
    examScopeTopicIds: ['atu1']
  },
  {
    id: 'projeto_vida',
    name: 'Projeto de Vida & Itinerários Formativos',
    category: 'Itinerário',
    color: 'cyan',
    teacherName: 'Profa. Juliana',
    enabled: true,
    topics: [
      { id: 'pj1', name: 'Orientação Vocacional, Metas e Gestão do Tempo', taught: true, taughtDate: '2026-07-05' },
    ],
    examScopeTopicIds: []
  },
  {
    id: 'ed_financeira',
    name: 'Educação Financeira & Empreendedorismo',
    category: 'Formação Geral',
    color: 'emerald',
    teacherName: 'Prof. Mário',
    enabled: false, // Desativada por padrão
    topics: [
      { id: 'edf1', name: 'Orçamento Pessoal, Juros Compostos e Investimentos', taught: false },
    ],
    examScopeTopicIds: []
  }
];

export const initialSchoolTimetable: SchoolTimetable = [
  {
    dayKey: 'segunda',
    dayName: 'Segunda-feira',
    periods: [
      { id: 'p-seg-1', periodNumber: 1, startTime: '07:15', endTime: '08:00', subjectId: 'matematica' },
      { id: 'p-seg-2', periodNumber: 2, startTime: '08:00', endTime: '08:45', subjectId: 'matematica' },
      { id: 'p-seg-3', periodNumber: 3, startTime: '08:45', endTime: '09:30', subjectId: 'fisica' },
      { id: 'p-seg-4', periodNumber: 4, startTime: '09:50', endTime: '10:35', subjectId: 'biologia' },
      { id: 'p-seg-5', periodNumber: 5, startTime: '10:35', endTime: '11:20', subjectId: 'historia' },
      { id: 'p-seg-6', periodNumber: 6, startTime: '11:20', endTime: '12:05', subjectId: 'gramatica' },
    ]
  },
  {
    dayKey: 'terca',
    dayName: 'Terça-feira',
    periods: [
      { id: 'p-ter-1', periodNumber: 1, startTime: '07:15', endTime: '08:00', subjectId: 'quimica' },
      { id: 'p-ter-2', periodNumber: 2, startTime: '08:00', endTime: '08:45', subjectId: 'quimica' },
      { id: 'p-ter-3', periodNumber: 3, startTime: '08:45', endTime: '09:30', subjectId: 'geografia' },
      { id: 'p-ter-4', periodNumber: 4, startTime: '09:50', endTime: '10:35', subjectId: 'portugues_redacao' },
      { id: 'p-ter-5', periodNumber: 5, startTime: '10:35', endTime: '11:20', subjectId: 'portugues_redacao' },
      { id: 'p-ter-6', periodNumber: 6, startTime: '11:20', endTime: '12:05', subjectId: 'filosofia' },
    ]
  },
  {
    dayKey: 'quarta',
    dayName: 'Quarta-feira',
    periods: [
      { id: 'p-qua-1', periodNumber: 1, startTime: '07:15', endTime: '08:00', subjectId: 'fisica' },
      { id: 'p-qua-2', periodNumber: 2, startTime: '08:00', endTime: '08:45', subjectId: 'fisica' },
      { id: 'p-qua-3', periodNumber: 3, startTime: '08:45', endTime: '09:30', subjectId: 'matematica' },
      { id: 'p-qua-4', periodNumber: 4, startTime: '09:50', endTime: '10:35', subjectId: 'literatura' },
      { id: 'p-qua-5', periodNumber: 5, startTime: '10:35', endTime: '11:20', subjectId: 'sociologia' },
      { id: 'p-qua-6', periodNumber: 6, startTime: '11:20', endTime: '12:05', subjectId: 'ingles' },
    ]
  },
  {
    dayKey: 'quinta',
    dayName: 'Quinta-feira',
    periods: [
      { id: 'p-qui-1', periodNumber: 1, startTime: '07:15', endTime: '08:00', subjectId: 'biologia' },
      { id: 'p-qui-2', periodNumber: 2, startTime: '08:00', endTime: '08:45', subjectId: 'biologia' },
      { id: 'p-qui-3', periodNumber: 3, startTime: '08:45', endTime: '09:30', subjectId: 'quimica' },
      { id: 'p-qui-4', periodNumber: 4, startTime: '09:50', endTime: '10:35', subjectId: 'historia' },
      { id: 'p-qui-5', periodNumber: 5, startTime: '10:35', endTime: '11:20', subjectId: 'geografia' },
      { id: 'p-qui-6', periodNumber: 6, startTime: '11:20', endTime: '12:05', subjectId: 'artes' },
    ]
  },
  {
    dayKey: 'sexta',
    dayName: 'Sexta-feira',
    periods: [
      { id: 'p-sex-1', periodNumber: 1, startTime: '07:15', endTime: '08:00', subjectId: 'matematica' },
      { id: 'p-sex-2', periodNumber: 2, startTime: '08:00', endTime: '08:45', subjectId: 'portugues_redacao' },
      { id: 'p-sex-3', periodNumber: 3, startTime: '08:45', endTime: '09:30', subjectId: 'atualidades' },
      { id: 'p-sex-4', periodNumber: 4, startTime: '09:50', endTime: '10:35', subjectId: 'projeto_vida' },
      { id: 'p-sex-5', periodNumber: 5, startTime: '10:35', endTime: '11:20', subjectId: 'ed_fisica' },
    ]
  }
];

export const initialEvaluations: Evaluation[] = [
  // 1º Bimestre (Concluído)
  {
    id: 'eval-m1',
    subjectId: 'matematica',
    periodIndex: 1,
    name: 'Prova Bimestral A1',
    categoryName: 'Provas Principais (A1)',
    maxScore: 10.0,
    weight: 0.7,
    scoreObtained: 8.5,
    date: '2026-03-25'
  },
  {
    id: 'eval-m2',
    subjectId: 'matematica',
    periodIndex: 1,
    name: 'Trabalho de Geometria A2',
    categoryName: 'Trabalhos & Projetos (A2)',
    maxScore: 10.0,
    weight: 0.3,
    scoreObtained: 9.0,
    date: '2026-04-10'
  },
  // 2º Bimestre (Em Andamento)
  {
    id: 'eval-m3',
    subjectId: 'matematica',
    periodIndex: 2,
    name: 'Prova A1 de Funções',
    categoryName: 'Provas Principais (A1)',
    maxScore: 10.0,
    weight: 0.7,
    scoreObtained: 5.0, // Alerta! Nota abaixo da média no A1 de Física/Matemática
    date: '2026-06-12'
  },
  {
    id: 'eval-m4',
    subjectId: 'matematica',
    periodIndex: 2,
    name: 'Trabalho de Funções Quadráticas A2',
    categoryName: 'Trabalhos & Projetos (A2)',
    maxScore: 10.0,
    weight: 0.3,
    scoreObtained: null, // Pendente! Simulador vai calcular quanto precisa tirar
    date: '2026-08-05'
  },
  {
    id: 'eval-f1',
    subjectId: 'fisica',
    periodIndex: 2,
    name: 'Prova A1 de Cinemática',
    categoryName: 'Provas Principais (A1)',
    maxScore: 10.0,
    weight: 0.7,
    scoreObtained: 4.5, // Alerta
    date: '2026-06-15'
  },
  {
    id: 'eval-f2',
    subjectId: 'fisica',
    periodIndex: 2,
    name: 'Trabalho A2 de Leis de Newton',
    categoryName: 'Trabalhos & Projetos (A2)',
    maxScore: 10.0,
    weight: 0.3,
    scoreObtained: null,
    date: '2026-08-10'
  },
  {
    id: 'eval-p1',
    subjectId: 'portugues_redacao',
    periodIndex: 2,
    name: 'Redação Modelo ENEM #1',
    categoryName: 'Provas Principais (A1)',
    maxScore: 10.0,
    weight: 0.7,
    scoreObtained: 9.2,
    date: '2026-06-20'
  }
];

export const initialStudyLogs: StudySessionLog[] = [
  { id: 'log-1', subjectId: 'matematica', topic: 'Exercícios de Função Quadrática', minutes: 50, date: '2026-07-24', mode: 'escola' },
  { id: 'log-2', subjectId: 'portugues_redacao', topic: 'Treino de Proposta de Intervenção', minutes: 60, date: '2026-07-25', mode: 'enem' },
  { id: 'log-3', subjectId: 'fisica', topic: 'Revisão de Leis de Newton', minutes: 45, date: '2026-07-26', mode: 'escola' },
  { id: 'log-4', subjectId: 'biologia', topic: 'Resumo sobre Ecologia e Cadeias Alimentares', minutes: 35, date: '2026-07-27', mode: 'enem' },
];

export const initialSpacedRevisions: SpacedRevision[] = [
  {
    id: 'rev-1',
    subjectId: 'matematica',
    topic: 'Função Quadrática e Vértice da Parábola',
    createdAt: '2026-07-20',
    steps: [
      { days: 1, dueDate: '2026-07-21', completed: true },
      { days: 7, dueDate: '2026-07-27', completed: false }, // Hoje!
      { days: 30, dueDate: '2026-08-19', completed: false }
    ]
  },
  {
    id: 'rev-2',
    subjectId: 'fisica',
    topic: 'Leis de Newton e Atrito Estático vs Dinâmico',
    createdAt: '2026-07-22',
    steps: [
      { days: 1, dueDate: '2026-07-23', completed: true },
      { days: 7, dueDate: '2026-07-29', completed: false },
      { days: 30, dueDate: '2026-08-21', completed: false }
    ]
  }
];

export const cleanParentSettings: ParentGuardSettings = {
  studentName: '',
  studentYear: '',
  schoolName: '',
  guardianEmail: '',
  lgpdAccepted: false,
  parentPin: ''
};

export const initialParentSettings: ParentGuardSettings = cleanParentSettings;
