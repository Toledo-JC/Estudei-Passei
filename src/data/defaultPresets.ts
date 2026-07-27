import { Subject } from '../types';

export const MEC_HIGH_SCHOOL_PRESET_SUBJECTS: Subject[] = [
  {
    id: 'sub-mat',
    name: 'Matemática',
    category: 'Exatas',
    color: '#6366f1',
    topics: [
      { id: 'mat-1', name: 'Funções de 1º e 2º Grau', taught: false },
      { id: 'mat-2', name: 'Geometria Plana e Espacial', taught: false },
      { id: 'mat-3', name: 'Trigonometria e Análise Combinatória', taught: false }
    ],
    examScopeTopicIds: [],
    weight: 5,
    enabled: true,
    isCustom: false
  },
  {
    id: 'sub-fis',
    name: 'Física',
    category: 'Exatas',
    color: '#3b82f6',
    topics: [
      { id: 'fis-1', name: 'Cinemática e Dinâmica (Leis de Newton)', taught: false },
      { id: 'fis-2', name: 'Termodinâmica e Calorimetria', taught: false },
      { id: 'fis-3', name: 'Óptica Geométrica e Ondas', taught: false }
    ],
    examScopeTopicIds: [],
    weight: 4,
    enabled: true,
    isCustom: false
  },
  {
    id: 'sub-qui',
    name: 'Química',
    category: 'Exatas',
    color: '#06b6d4',
    topics: [
      { id: 'qui-1', name: 'Tabela Periódica e Ligações Químicas', taught: false },
      { id: 'qui-2', name: 'Estequiometria e Soluções', taught: false },
      { id: 'qui-3', name: 'Química Orgânica (Cadeias e Funções)', taught: false }
    ],
    examScopeTopicIds: [],
    weight: 4,
    enabled: true,
    isCustom: false
  },
  {
    id: 'sub-bio',
    name: 'Biologia',
    category: 'Biológicas',
    color: '#10b981',
    topics: [
      { id: 'bio-1', name: 'Citologia e Metabolismo Celular', taught: false },
      { id: 'bio-2', name: 'Genética Mendeliana e Biotecnologia', taught: false },
      { id: 'bio-3', name: 'Ecologia e Preservação Ambiental', taught: false }
    ],
    examScopeTopicIds: [],
    weight: 4,
    enabled: true,
    isCustom: false
  },
  {
    id: 'sub-his',
    name: 'História',
    category: 'Humanas',
    color: '#f59e0b',
    topics: [
      { id: 'his-1', name: 'História do Brasil: Colônia e Império', taught: false },
      { id: 'his-2', name: 'República Velha e Era Vargas', taught: false },
      { id: 'his-3', name: 'História Geral: Guerras Mundiais e Guerra Fria', taught: false }
    ],
    examScopeTopicIds: [],
    weight: 3,
    enabled: true,
    isCustom: false
  },
  {
    id: 'sub-geo',
    name: 'Geografia',
    category: 'Humanas',
    color: '#ea580c',
    topics: [
      { id: 'geo-1', name: 'Geografia Física e Climatologia', taught: false },
      { id: 'geo-2', name: 'Geopolítica e Globalização', taught: false },
      { id: 'geo-3', name: 'Urbanização e Agronegócio no Brasil', taught: false }
    ],
    examScopeTopicIds: [],
    weight: 3,
    enabled: true,
    isCustom: false
  },
  {
    id: 'sub-port',
    name: 'Português & Gramática',
    category: 'Linguagens',
    color: '#e11d48',
    topics: [
      { id: 'port-1', name: 'Sintaxe: Período Simples e Composto', taught: false },
      { id: 'port-2', name: 'Crase, Regência e Concordância', taught: false }
    ],
    examScopeTopicIds: [],
    weight: 4,
    enabled: true,
    isCustom: false
  },
  {
    id: 'sub-red',
    name: 'Redação ENEM & Vestibulares',
    category: 'Redação',
    color: '#8b5cf6',
    topics: [
      { id: 'red-1', name: 'Estrutura Dissertativo-Argumentativa', taught: false },
      { id: 'red-2', name: 'Proposta de Intervenção Detalhada (Competência 5)', taught: false }
    ],
    examScopeTopicIds: [],
    weight: 5,
    enabled: true,
    isCustom: false
  },
  {
    id: 'sub-lit',
    name: 'Literatura',
    category: 'Linguagens',
    color: '#a855f7',
    topics: [
      { id: 'lit-1', name: 'Escolas Literárias: Barroco ao Modernismo', taught: false },
      { id: 'lit-2', name: 'Análise de Obras Obrigatórias dos Vestibulares', taught: false }
    ],
    examScopeTopicIds: [],
    weight: 2,
    enabled: true,
    isCustom: false
  },
  {
    id: 'sub-filosoc',
    name: 'Filosofia & Sociologia',
    category: 'Humanas',
    color: '#14b8a6',
    topics: [
      { id: 'fil-1', name: 'Filosofia Antiga, Moderna e Contemporânea', taught: false },
      { id: 'soc-1', name: 'Cultura, Sociedade e Direitos Humanos', taught: false }
    ],
    examScopeTopicIds: [],
    weight: 2,
    enabled: true,
    isCustom: false
  },
  {
    id: 'sub-ing',
    name: 'Língua Estrangeira (Inglês)',
    category: 'Linguagens',
    color: '#0284c7',
    topics: [
      { id: 'ing-1', name: 'Interpretação Textual e Falsos Cognatos', taught: false }
    ],
    examScopeTopicIds: [],
    weight: 2,
    enabled: true,
    isCustom: false
  }
];
