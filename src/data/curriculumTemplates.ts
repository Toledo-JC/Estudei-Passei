import { HighSchoolCurriculumTemplate, HighSchoolSeries } from '../types';

export const HIGH_SCHOOL_CURRICULUM_TEMPLATES: Record<HighSchoolSeries, HighSchoolCurriculumTemplate> = {
  '1st': {
    series: '1st',
    seriesLabel: '1º Ano do Ensino Médio',
    subjects: [
      {
        id: 'math-1',
        name: 'Matemática',
        category: 'Exatas',
        color: 'indigo',
        topics: [
          // 1º Bimestre
          { id: 'm1-b1-1', name: 'Conjuntos Numéricos (N, Z, Q, R) e Operações', bimester: 1 },
          { id: 'm1-b1-2', name: 'Intervalos Reais e Notação de Conjuntos', bimester: 1 },
          { id: 'm1-b1-3', name: 'Conceito de Função, Dominio, Contradomínio e Imagem', bimester: 1 },
          { id: 'm1-b1-4', name: 'Gráficos e Análise do Comportamento de Funções', bimester: 1 },
          // 2º Bimestre
          { id: 'm1-b2-1', name: 'Função Afim (1º Grau), Zero da Função e Gráficos', bimester: 2 },
          { id: 'm1-b2-2', name: 'Inequações do 1º Grau e Sistemas', bimester: 2 },
          { id: 'm1-b2-3', name: 'Função Quadrática (2º Grau), Vértice e Máximos/Mínimos', bimester: 2 },
          { id: 'm1-b2-4', name: 'Inequações do 2º Grau e Estudo dos Sinais', bimester: 2 },
          // 3º Bimestre
          { id: 'm1-b3-1', name: 'Potenciação, Radiciação e Propriedades Operatórias', bimester: 3 },
          { id: 'm1-b3-2', name: 'Função Exponencial e Equações Exponenciais', bimester: 3 },
          { id: 'm1-b3-3', name: 'Conceito de Logaritmo e Propriedades', bimester: 3 },
          { id: 'm1-b3-4', name: 'Função Logarítmica e Aplicações Práticas (Escala Richter, Juros)', bimester: 3 },
          // 4º Bimestre
          { id: 'm1-b4-1', name: 'Sequências Numéricas e Padrões', bimester: 4 },
          { id: 'm1-b4-2', name: 'Progressão Aritmética (PA): Termo Geral e Soma', bimester: 4 },
          { id: 'm1-b4-3', name: 'Progressão Geométrica (PG): Termo Geral e Soma Finita/Infinita', bimester: 4 },
          { id: 'm1-b4-4', name: 'Matemática Financeira Inicial: Juros Simples e Compostos', bimester: 4 }
        ]
      },
      {
        id: 'port-1',
        name: 'Língua Portuguesa',
        category: 'Linguagens',
        color: 'rose',
        topics: [
          // 1º Bimestre
          { id: 'p1-b1-1', name: 'Linguagem, Comunicação e Funções da Linguagem', bimester: 1 },
          { id: 'p1-b1-2', name: 'Variedades Linguísticas e Preconceito Linguístico', bimester: 1 },
          { id: 'p1-b1-3', name: 'Fonologia, Acentuação Gráfica e Novo Acordo Ortográfico', bimester: 1 },
          { id: 'p1-b1-4', name: 'Tipos e Gêneros Textuais (Narrativo, Descritivo, Dissertativo)', bimester: 1 },
          // 2º Bimestre
          { id: 'p1-b2-1', name: 'Estrutura e Formação de Palavras (Prefixos e Sufixos)', bimester: 2 },
          { id: 'p1-b2-2', name: 'Classes Gramaticais 1: Substantivo, Adjetivo e Artigo', bimester: 2 },
          { id: 'p1-b2-3', name: 'Classes Gramaticais 2: Pronomes (Pessoais, Possessivos, Demonstrativos)', bimester: 2 },
          { id: 'p1-b2-4', name: 'Coesão Textual e Emprego dos Pronomes Relativos', bimester: 2 },
          // 3º Bimestre
          { id: 'p1-b3-1', name: 'Verbos: Modos, Tempos e Vozes Verbais', bimester: 3 },
          { id: 'p1-b3-2', name: 'Sintaxe da Oração: Sujeito e Predicado', bimester: 3 },
          { id: 'p1-b3-3', name: 'Complementos Verbais (OD e OI) e Predicativos', bimester: 3 },
          { id: 'p1-b3-4', name: 'Adjunto Adverbial, Adnominal e Agente da Passiva', bimester: 3 },
          // 4º Bimestre
          { id: 'p1-b4-1', name: 'Sintaxe do Período Composto por Coordenação', bimester: 4 },
          { id: 'p1-b4-2', name: 'Conectivos Coodenativos e Relações de Sentido', bimester: 4 },
          { id: 'p1-b4-3', name: 'Pontuação: Emprego da Vírgula e Ponto-e-Vírgula', bimester: 4 },
          { id: 'p1-b4-4', name: 'Semântica: Denotação, Conotação e Figuras de Linguagem', bimester: 4 }
        ]
      },
      {
        id: 'lit-1',
        name: 'Literatura',
        category: 'Linguagens',
        color: 'purple',
        topics: [
          // 1º Bimestre
          { id: 'l1-b1-1', name: 'Conceito de Literatura, Texto Literário vs Não Literário', bimester: 1 },
          { id: 'l1-b1-2', name: 'Gêneros Literários (Lírico, Épico e Dramático)', bimester: 1 },
          { id: 'l1-b1-3', name: 'Trovadorismo Português: Cantigas de Amigo, Amor e Escárnio', bimester: 1 },
          // 2º Bimestre
          { id: 'l1-b2-1', name: 'Humanismo: Teatro de Gil Vicente e Historiografia de Fernão Lopes', bimester: 2 },
          { id: 'l1-b2-2', name: 'Classicismo: Luís de Camões e "Os Lusíadas"', bimester: 2 },
          { id: 'l1-b2-3', name: 'Quinhentismo no Brasil: Carta de Caminha e Literatura de Catequese', bimester: 2 },
          // 3º Bimestre
          { id: 'l1-b3-1', name: 'Barroco em Portugal e no Brasil: Dualidade e Religiosidade', bimester: 3 },
          { id: 'l1-b3-2', name: 'Gregório de Matos (Boca do Inferno) e Padre Antônio Vieira', bimester: 3 },
          { id: 'l1-b3-3', name: 'Cultismo vs Conceptismo', bimester: 3 },
          // 4º Bimestre
          { id: 'l1-b4-1', name: 'Arcadismo / Neoclassicismo: Iluminismo e Bucolismo', bimester: 4 },
          { id: 'l1-b4-2', name: 'Arcadismo no Brasil: Inconfidência Mineira e Poetas Árcades', bimester: 4 },
          { id: 'l1-b4-3', name: 'Cláudio Manuel da Costa e Tomás Antônio Gonzaga ("Marília de Dirceu")', bimester: 4 }
        ]
      },
      {
        id: 'red-1',
        name: 'Redação',
        category: 'Redação',
        color: 'amber',
        topics: [
          // 1º Bimestre
          { id: 'r1-b1-1', name: 'Estrutura do Texto Dissertativo-Argumentativo ENEM', bimester: 1 },
          { id: 'r1-b1-2', name: 'Construção da Introdução: Contextualização e Tese', bimester: 1 },
          // 2º Bimestre
          { id: 'r1-b2-1', name: 'Desenvolvimento 1 e 2: Estratégias Argumentativas', bimester: 2 },
          { id: 'r1-b2-2', name: 'Uso de Repertório Sociocultural Legitimado e Produtivo', bimester: 2 },
          // 3º Bimestre
          { id: 'r1-b3-1', name: 'Proposta de Intervenção Completa (5 Elementos C5)', bimester: 3 },
          { id: 'r1-b3-2', name: 'Coesão Interparágrafos e Intraparágrafos (C4)', bimester: 3 },
          // 4º Bimestre
          { id: 'r1-b4-1', name: 'Análise de Redações Nota 1000 e Erros Recorrentes', bimester: 4 },
          { id: 'r1-b4-2', name: 'Simulação Prática de Redação com Tema Social', bimester: 4 }
        ]
      },
      {
        id: 'phys-1',
        name: 'Física',
        category: 'Exatas',
        color: 'cyan',
        topics: [
          // 1º Bimestre
          { id: 'f1-b1-1', name: 'Introdução à Física, Unidades do SI e Notação Científica', bimester: 1 },
          { id: 'f1-b1-2', name: 'Cinemática Escalar: Posição, Deslocamento e Velocidade Média', bimester: 1 },
          { id: 'f1-b1-3', name: 'Movimento Uniforme (MU) e Equação Horária', bimester: 1 },
          { id: 'f1-b1-4', name: 'Gráficos do Movimento Uniforme', bimester: 1 },
          // 2º Bimestre
          { id: 'f1-b2-1', name: 'Aceleração Média e Movimento Uniformemente Variado (MUV)', bimester: 2 },
          { id: 'f1-b2-2', name: 'Equações do MUV e Equação de Torricelli', bimester: 2 },
          { id: 'f1-b2-3', name: 'Queda Livre e Lançamento Vertical no Vácuo', bimester: 2 },
          { id: 'f1-b2-4', name: 'Vetores: Operações de Soma e Decomposição Vetorial', bimester: 2 },
          // 3º Bimestre
          { id: 'f1-b3-1', name: 'Movimento Circular Uniforme (MCU): Frequência e Período', bimester: 3 },
          { id: 'f1-b3-2', name: 'Introdução à Dinâmica e Primeira Lei de Newton (Inércia)', bimester: 3 },
          { id: 'f1-b3-3', name: 'Segunda Lei de Newton (F = m.a) e Força Peso', bimester: 3 },
          { id: 'f1-b3-4', name: 'Terceira Lei de Newton (Ação e Reação) e Força Normal', bimester: 3 },
          // 4º Bimestre
          { id: 'f1-b4-1', name: 'Força de Atrito (Estático e Cinético)', bimester: 4 },
          { id: 'f1-b4-2', name: 'Força Centripeta e Curvas em Rodovias', bimester: 4 },
          { id: 'f1-b4-3', name: 'Trabalho de uma Força e Potência Mecânica', bimester: 4 },
          { id: 'f1-b4-4', name: 'Energia Mecânica, Cinética, Potencial e Conservação', bimester: 4 }
        ]
      },
      {
        id: 'chem-1',
        name: 'Química',
        category: 'Exatas',
        color: 'emerald',
        topics: [
          // 1º Bimestre
          { id: 'q1-b1-1', name: 'Introdução à Química, Matéria, Corpo e Objeto', bimester: 1 },
          { id: 'q1-b1-2', name: 'Estados Físicos da Matéria e Mudanças de Estado', bimester: 1 },
          { id: 'q1-b1-3', name: 'Substâncias Puras e Misturas (Homogêneas e Heterogêneas)', bimester: 1 },
          { id: 'q1-b1-4', name: 'Métodos de Separação de Misturas (Filtração, Destilação, etc.)', bimester: 1 },
          // 2º Bimestre
          { id: 'q1-b2-1', name: 'Evolução dos Modelos Atômicos (Dalton, Thomson, Rutherford, Bohr)', bimester: 2 },
          { id: 'q1-b2-2', name: 'Estrutura Atômica: Prótons, Nêutrons, Elétrons e Isótopos', bimester: 2 },
          { id: 'q1-b2-3', name: 'Distribuição Eletrônica de Linus Pauling', bimester: 2 },
          { id: 'q1-b2-4', name: 'Tabela Periódica: Famílias, Períodos e Propriedades Periódicas', bimester: 2 },
          // 3º Bimestre
          { id: 'q1-b3-1', name: 'Ligações Químicas 1: Ligação Iônica e Propriedades dos Compostos', bimester: 3 },
          { id: 'q1-b3-2', name: 'Ligações Químicas 2: Ligação Covalente e Fórmulas de Lewis', bimester: 3 },
          { id: 'q1-b3-3', name: 'Ligações Químicas 3: Ligação Metálica', bimester: 3 },
          { id: 'q1-b3-4', name: 'Geometria Molecular e Polaridade das Moléculas', bimester: 3 },
          // 4º Bimestre
          { id: 'q1-b4-1', name: 'Forças Intermoleculares (Dipolo, Ligação de Hidrogênio, London)', bimester: 4 },
          { id: 'q1-b4-2', name: 'Funções Inorgânicas 1: Ácidos e Bases (Teoria de Arrhenius)', bimester: 4 },
          { id: 'q1-b4-3', name: 'Funções Inorgânicas 2: Sais e Óxidos', bimester: 4 },
          { id: 'q1-b4-4', name: 'Reações Químicas Inorgânicas e Balanceamento de Equações', bimester: 4 }
        ]
      },
      {
        id: 'bio-1',
        name: 'Biologia',
        category: 'Biológicas',
        color: 'emerald',
        topics: [
          // 1º Bimestre
          { id: 'b1-b1-1', name: 'Características dos Seres Vivos e Método Científico', bimester: 1 },
          { id: 'b1-b1-2', name: 'Composição Química da Célula: Água e Sais Minerais', bimester: 1 },
          { id: 'b1-b1-3', name: 'Carboidratos e Lipídios: Estrutura e Funções', bimester: 1 },
          { id: 'b1-b1-4', name: 'Proteínas, Enzimas e Ácidos Nucleicos (DNA e RNA)', bimester: 1 },
          // 2º Bimestre
          { id: 'b1-b2-1', name: 'Introdução à Citologia: Célula Procariótica vs Eucariótica', bimester: 2 },
          { id: 'b1-b2-2', name: 'Membrana Plasmática: Estrutura e Transportes (Ativo e Passivo)', bimester: 2 },
          { id: 'b1-b2-3', name: 'Citoplasma e Organelas Celulares Não Membranosas', bimester: 2 },
          { id: 'b1-b2-4', name: 'Organelas Membranosas e Sistema de Endomembranas', bimester: 2 },
          // 3º Bimestre
          { id: 'b1-b3-1', name: 'Bioenergética Celular 1: Respiração Celular Aeróbica', bimester: 3 },
          { id: 'b1-b3-2', name: 'Bioenergética Celular 2: Fermentação Lática e Alcoólica', bimester: 3 },
          { id: 'b1-b3-3', name: 'Bioenergética Celular 3: Fotossíntese e Quimiossíntese', bimester: 3 },
          { id: 'b1-b3-4', name: 'Núcleo Celular, Cromossomos e Cariótipo Humano', bimester: 3 },
          // 4º Bimestre
          { id: 'b1-b4-1', name: 'Ciclo Celular e Divisão por Mitose', bimester: 4 },
          { id: 'b1-b4-2', name: 'Divisão Celular por Meiose e Crossing-Over', bimester: 4 },
          { id: 'b1-b4-3', name: 'Histologia Animal 1: Tecido Epitelial e Tecido Conjuntivo', bimester: 4 },
          { id: 'b1-b4-4', name: 'Histologia Animal 2: Tecido Muscular e Tecido Nervoso', bimester: 4 }
        ]
      },
      {
        id: 'hist-1',
        name: 'História',
        category: 'Humanas',
        color: 'amber',
        topics: [
          // 1º Bimestre
          { id: 'h1-b1-1', name: 'Introdução aos Estudos Históricos e Fontes Históricas', bimester: 1 },
          { id: 'h1-b1-2', name: 'Pré-História, Origem da Humanidade e Neolítico', bimester: 1 },
          { id: 'h1-b1-3', name: 'Antiguidade Oriental: Mesopotâmia e Egito Antigo', bimester: 1 },
          { id: 'h1-b1-4', name: 'Grécia Antiga: Pólis Ateniense, Esparta e Democaria', bimester: 1 },
          // 2º Bimestre
          { id: 'h1-b2-1', name: 'Roma Antiga: Monarquia, República e Império', bimester: 2 },
          { id: 'h1-b2-2', name: 'Declínio do Império Romano e Formação do Feudalismo', bimester: 2 },
          { id: 'h1-b2-3', name: 'Idade Média Ocidental: Sociedade, Igreja e Cruzadas', bimester: 2 },
          { id: 'h1-b2-4', name: 'Crise do Feudalismo e Renascimento Comercial', bimester: 2 },
          // 3º Bimestre
          { id: 'h1-b3-1', name: 'Formação dos Estados Nacionais Modernos e Absolutismo', bimester: 3 },
          { id: 'h1-b3-2', name: 'Mercantilismo e Grandes Navegações Marítimas', bimester: 3 },
          { id: 'h1-b3-3', name: 'Renascimento Cultural e Científico', bimester: 3 },
          { id: 'h1-b3-4', name: 'Reformas Religiosas (Protestante e Contrareforma)', bimester: 3 },
          // 4º Bimestre
          { id: 'h1-b4-1', name: 'Povos Pré-Colombianos (Maias, Incas e Astecas)', bimester: 4 },
          { id: 'h1-b4-2', name: 'Brasil Colônia: Administração e Economia Açucareira', bimester: 4 },
          { id: 'h1-b4-3', name: 'Escravidão Africana e Resistência no Brasil Colonial', bimester: 4 },
          { id: 'h1-b4-4', name: 'Expansão Territorial, Bandeirantismo e Mineração no Século XVIII', bimester: 4 }
        ]
      },
      {
        id: 'geo-1',
        name: 'Geografia',
        category: 'Humanas',
        color: 'emerald',
        topics: [
          // 1º Bimestre
          { id: 'g1-b1-1', name: 'Orientação, Coordenadas Geográficas e Fusos Horários', bimester: 1 },
          { id: 'g1-b1-2', name: 'Cartografia: Escalas, Projeções e Leitura de Mapas', bimester: 1 },
          { id: 'g1-b1-3', name: 'Estrutura Interna da Terra e Tectônica de Placas', bimester: 1 },
          // 2º Bimestre
          { id: 'g1-b2-1', name: 'Agentes Internos e Externos do Relevo Terrestre', bimester: 2 },
          { id: 'g1-b2-2', name: 'Tipos de Solos e Problemas Ambientais de Erosão', bimester: 2 },
          { id: 'g1-b2-3', name: 'Atmosfera, Dinâmica dos Ventos e Tipos Climáticos', bimester: 2 },
          // 3º Bimestre
          { id: 'g1-b3-1', name: 'Domínios Morfoclimáticos e Biomas do Brasil', bimester: 3 },
          { id: 'g1-b3-2', name: 'Hidrografia: Bacias Hidrográficas do Brasil e Águas Subterrâneas', bimester: 3 },
          { id: 'g1-b3-3', name: 'Impactos Ambientais Globais e Mudanças Climáticas', bimester: 3 },
          // 4º Bimestre
          { id: 'g1-b4-1', name: 'Recursos Naturais e Matriz Energética Brasileira e Mundial', bimester: 4 },
          { id: 'g1-b4-2', name: 'Demografia: Crescimento Populacional e Transição Demográfica', bimester: 4 },
          { id: 'g1-b4-3', name: 'Migrações Internas e Internacionais no Século XXI', bimester: 4 }
        ]
      },
      {
        id: 'soc-1',
        name: 'Sociologia',
        category: 'Humanas',
        color: 'cyan',
        topics: [
          { id: 's1-b1-1', name: 'Surgimento da Sociologia e a Modernidade', bimester: 1 },
          { id: 's1-b1-2', name: 'Émile Durkheim: Fatos Sociais e Coesão Social', bimester: 1 },
          { id: 's1-b2-1', name: 'Karl Marx: Luta de Classes, Alienação e Capitalismo', bimester: 2 },
          { id: 's1-b2-2', name: 'Max Weber: Ação Social, Tipo Ideal e Burocracia', bimester: 2 },
          { id: 's1-b3-1', name: 'Cultura, Identidade e Diversidade Cultural', bimester: 3 },
          { id: 's1-b3-2', name: 'Etnocentrismo e Relativismo Cultural', bimester: 3 },
          { id: 's1-b4-1', name: 'Socialização Primária e Secundária e Instituições Sociais', bimester: 4 },
          { id: 's1-b4-2', name: 'Estratificação Social e Desigualdade no Brasil', bimester: 4 }
        ]
      },
      {
        id: 'filo-1',
        name: 'Filosofia',
        category: 'Humanas',
        color: 'purple',
        topics: [
          { id: 'fi1-b1-1', name: 'Origem da Filosofia na Grécia e Transição do Mito ao Logos', bimester: 1 },
          { id: 'fi1-b1-2', name: 'Filósofos Pré-Socráticos e a Busca pela Physis', bimester: 1 },
          { id: 'fi1-b2-1', name: 'Os Sofistas e a Arte da Retórica', bimester: 2 },
          { id: 'fi1-b2-2', name: 'Sócrates e o Método Dialético (Maiêutica)', bimester: 2 },
          { id: 'fi1-b3-1', name: 'Platão: Mundo das Ideias e o Mito da Caverna', bimester: 3 },
          { id: 'fi1-b3-2', name: 'Aristóteles: Metafísica, Ética e Lógica', bimester: 3 },
          { id: 'fi1-b4-1', name: 'Filosofia Helenística: Epicurismo, Estoicismo e Ceticismo', bimester: 4 },
          { id: 'fi1-b4-2', name: 'Introdução à Lógica Clássica e Argumentação Falaciosa', bimester: 4 }
        ]
      },
      {
        id: 'eng-1',
        name: 'Inglês',
        category: 'Linguagens',
        color: 'indigo',
        topics: [
          { id: 'e1-b1-1', name: 'Strategies for Reading Comprehension (Skimming and Scanning)', bimester: 1 },
          { id: 'e1-b1-2', name: 'Verb To Be and Simple Present Tense', bimester: 1 },
          { id: 'e1-b2-1', name: 'Present Continuous e Verbos de Ação', bimester: 2 },
          { id: 'e1-b2-2', name: 'Cognates and False Friends in Academic Texts', bimester: 2 },
          { id: 'e1-b3-1', name: 'Simple Past and Past Continuous', bimester: 3 },
          { id: 'e1-b3-2', name: 'Personal, Possessive, and Relative Pronouns', bimester: 3 },
          { id: 'e1-b4-1', name: 'Modal Verbs (Can, Could, May, Must, Should)', bimester: 4 },
          { id: 'e1-b4-2', name: 'Textual Genres: News, Memes, Infographics', bimester: 4 }
        ]
      }
    ]
  },
  '2nd': {
    series: '2nd',
    seriesLabel: '2º Ano do Ensino Médio',
    subjects: [
      {
        id: 'math-2',
        name: 'Matemática',
        category: 'Exatas',
        color: 'indigo',
        topics: [
          // 1º Bimestre
          { id: 'm2-b1-1', name: 'Trigonometria no Triângulo Retângulo', bimester: 1 },
          { id: 'm2-b1-2', name: 'Lei dos Senos e Lei dos Cossenos', bimester: 1 },
          { id: 'm2-b1-3', name: 'Ciclo Trigonométrico e Arcos Notáveis', bimester: 1 },
          { id: 'm2-b1-4', name: 'Funções Trigonométricas (Seno, Cosseno e Tangente)', bimester: 1 },
          // 2º Bimestre
          { id: 'm2-b2-1', name: 'Matrizes: Operações, Transposta e Inversa', bimester: 2 },
          { id: 'm2-b2-2', name: 'Determinantes de Ordem 2 e 3 (Regra de Sarrus)', bimester: 2 },
          { id: 'm2-b2-3', name: 'Sistemas Lineares e Método de Escalonamento', bimester: 2 },
          { id: 'm2-b2-4', name: 'Classificação de Sistemas Lineares (SPD, SPI, SI)', bimester: 2 },
          // 3º Bimestre
          { id: 'm2-b3-1', name: 'Princípio Fundamental da Contagem (PFC)', bimester: 3 },
          { id: 'm2-b3-2', name: 'Arranjos, Permutações e Combinações Simples', bimester: 3 },
          { id: 'm2-b3-3', name: 'Probabilidade Simples e Condicional', bimester: 3 },
          { id: 'm2-b3-4', name: 'Probabilidade da União e de Eventos Independentes', bimester: 3 },
          // 4º Bimestre
          { id: 'm2-b4-1', name: 'Geometria Espacial de Posição (Pontos, Retas e Planos)', bimester: 4 },
          { id: 'm2-b4-2', name: 'Prismas e Pirâmides: Área da Base, Lateral e Volume', bimester: 4 },
          { id: 'm2-b4-3', name: 'Cilindros, Cones e Esferas: Áreas e Volumes', bimester: 4 },
          { id: 'm2-b4-4', name: 'Estatística Descritiva: Média, Moda, Mediana e Variância', bimester: 4 }
        ]
      },
      {
        id: 'port-2',
        name: 'Língua Portuguesa',
        category: 'Linguagens',
        color: 'rose',
        topics: [
          // 1º Bimestre
          { id: 'p2-b1-1', name: 'Sintaxe do Período Composto por Subordinação Substantiva', bimester: 1 },
          { id: 'p2-b1-2', name: 'Orações Subordinadas Adjetivas (Explicativas e Restritivas)', bimester: 1 },
          { id: 'p2-b1-3', name: 'Orações Subordinadas Adverbiais (Causais, Concessivas, etc.)', bimester: 1 },
          // 2º Bimestre
          { id: 'p2-b2-1', name: 'Concordância Verbal: Regras Gerais e Casos Especiais', bimester: 2 },
          { id: 'p2-b2-2', name: 'Concordância Nominal e Palavras Especiais', bimester: 2 },
          { id: 'p2-b2-3', name: 'Regência Verbal e Nominal', bimester: 2 },
          // 3º Bimestre
          { id: 'p2-b3-1', name: 'O Uso da Crase: Casos Obrigatórios, Proibidos e Facultativos', bimester: 3 },
          { id: 'p2-b3-2', name: 'Colocação Pronominal (Próclise, Mesóclise e Ênclise)', bimester: 3 },
          { id: 'p2-b3-3', name: 'Semântica: Ambiguidade, Polissemia e Intertextualidade', bimester: 3 },
          // 4º Bimestre
          { id: 'p2-b4-1', name: 'Mecanismos de Coesão Sequencial e Referencial', bimester: 4 },
          { id: 'p2-b4-2', name: 'Estratégias de Argumentação em Artigos de Opinião e Ensaios', bimester: 4 }
        ]
      },
      {
        id: 'lit-2',
        name: 'Literatura',
        category: 'Linguagens',
        color: 'purple',
        topics: [
          // 1º Bimestre
          { id: 'l2-b1-1', name: 'Romantismo no Brasil: Contexto Histórico e 1ª Geração (Indianista)', bimester: 1 },
          { id: 'l2-b1-2', name: '2ª Geração Romântica (Ultrarromantismo / Mal do Século)', bimester: 1 },
          { id: 'l2-b1-3', name: '3ª Geração Romântica (Condoreira / Abolicionista - Castro Alves)', bimester: 1 },
          // 2º Bimestre
          { id: 'l2-b2-1', name: 'Prosa Romântica: Romances Urbanos, Indianistas e Regionalistas', bimester: 2 },
          { id: 'l2-b2-2', name: 'Realismo no Brasil: Machado de Assis e "Memórias Póstumas"', bimester: 2 },
          { id: 'l2-b2-3', name: 'Naturalismo: Aluísio Azevedo e "O Cortiço"', bimester: 2 },
          // 3º Bimestre
          { id: 'l2-b3-1', name: 'Parnasianismo: Rigor Formal e Arte pela Arte (Olavo Bilac)', bimester: 3 },
          { id: 'l2-b3-2', name: 'Simbolismo: Misticismo e Musicalidade (Cruz e Sousa)', bimester: 3 },
          // 4º Bimestre
          { id: 'l2-b4-1', name: 'Pré-Modernismo no Brasil: Euclides da Cunha ("Os Sertões")', bimester: 4 },
          { id: 'l2-b4-2', name: 'Lima Barreto ("Triste Fim de Policarpo Quaresma") e Monteiro Lobato', bimester: 4 }
        ]
      },
      {
        id: 'red-2',
        name: 'Redação',
        category: 'Redação',
        color: 'amber',
        topics: [
          { id: 'r2-b1-1', name: 'Domínio da Norma Culta da Língua Escrita (Competência 1 ENEM)', bimester: 1 },
          { id: 'r2-b2-1', name: 'Uso de Filosofia e Sociologia como Repertório (Competência 2)', bimester: 2 },
          { id: 'r2-b3-1', name: 'Projeto de Texto e Articulação de Argumentos (Competência 3)', bimester: 3 },
          { id: 'r2-b4-1', name: 'Oficina de Propostas de Intervenção Inovadoras (Competência 5)', bimester: 4 }
        ]
      },
      {
        id: 'phys-2',
        name: 'Física',
        category: 'Exatas',
        color: 'cyan',
        topics: [
          // Termologia e Óptica
          { id: 'f2-b1-1', name: 'Termometria: Escalas Celsius, Fahrenheit e Kelvin', bimester: 1 },
          { id: 'f2-b1-2', name: 'Dilatação Térmica dos Sólidos e Líquidos', bimester: 1 },
          { id: 'f2-b1-3', name: 'Calorimetria: Calor Sensível, Latente e Trocas de Calor', bimester: 1 },
          { id: 'f2-b2-1', name: 'Propagação do Calor: Condução, Convecção e Irradiação', bimester: 2 },
          { id: 'f2-b2-2', name: 'Gases Perfeitos e Leis da Termodinâmica', bimester: 2 },
          { id: 'f2-b3-1', name: 'Óptica Geométrica: Princípios e Espelhos Planos/Esféricos', bimester: 3 },
          { id: 'f2-b3-2', name: 'Refração da Luz, Lei de Snell e Lentes Esféricas', bimester: 3 },
          { id: 'f2-b4-1', name: 'Ondulatória: Tipos de Ondas, Frequência e Equação Fundamental', bimester: 4 },
          { id: 'f2-b4-2', name: 'Fenômenos Ondulatórios (Reflexão, Difração, Interferência, Doppler)', bimester: 4 }
        ]
      },
      {
        id: 'chem-2',
        name: 'Química',
        category: 'Exatas',
        color: 'emerald',
        topics: [
          // Físico-Química
          { id: 'q2-b1-1', name: 'Massa Atômica, Massa Molecular e Conceito de Mol', bimester: 1 },
          { id: 'q2-b1-2', name: 'Cálculos Estequiométricos Simples e com Rendimento/Pureza', bimester: 1 },
          { id: 'q2-b2-1', name: 'Soluções: Concentração Comum, Molaridade e Diluição', bimester: 2 },
          { id: 'q2-b2-2', name: 'Propriedades Coligativas', bimester: 2 },
          { id: 'q2-b3-1', name: 'Termoquímica: Reações Endotérmicas/Exotérmicas e Entalpia', bimester: 3 },
          { id: 'q2-b3-2', name: 'Lei de Hess e Energia de Ligação', bimester: 3 },
          { id: 'q2-b4-1', name: 'Cinética Química: Velocidade de Reação e Fatores de Influência', bimester: 4 },
          { id: 'q2-b4-2', name: 'Equilíbrio Químico, Kc, Kp e Princípio de Le Chatelier', bimester: 4 }
        ]
      },
      {
        id: 'bio-2',
        name: 'Biologia',
        category: 'Biológicas',
        color: 'emerald',
        topics: [
          // Botânica e Zoologia
          { id: 'b2-b1-1', name: 'Reino Plantae: Briófitas e Pteridófitas', bimester: 1 },
          { id: 'b2-b1-2', name: 'Gimnospermas e Angiospermas (Flor, Fruto e Semente)', bimester: 1 },
          { id: 'b2-b2-1', name: 'Anatomia e Fisiologia Vegetal (Xilema, Floema e Hormônios)', bimester: 2 },
          { id: 'b2-b2-2', name: 'Invertebrados 1: Poríferos, Cnidários, Platelmintos e Nematelmintos', bimester: 2 },
          { id: 'b2-b3-1', name: 'Invertebrados 2: Moluscos, Anelídeos, Artrópodes e Equinodermos', bimester: 3 },
          { id: 'b2-b3-2', name: 'Vertebrados: Peixes, Anfíbios, Répteis, Aves e Mamíferos', bimester: 3 },
          { id: 'b2-b4-1', name: 'Fisiologia Humana 1: Sistemas Digestório e Respiratório', bimester: 4 },
          { id: 'b2-b4-2', name: 'Fisiologia Humana 2: Sistemas Circulatório, Excretor e Endócrino', bimester: 4 }
        ]
      },
      {
        id: 'hist-2',
        name: 'História',
        category: 'Humanas',
        color: 'amber',
        topics: [
          { id: 'h2-b1-1', name: 'Iluminismo e Independência dos Estados Unidos', bimester: 1 },
          { id: 'h2-b1-2', name: 'Revolução Industrial e Suas Consequências Sociais', bimester: 1 },
          { id: 'h2-b2-1', name: 'Revolução Francesa e Era Napoleônica', bimester: 2 },
          { id: 'h2-b2-2', name: 'Processos de Independência na América Espanhola e Brasil', bimester: 2 },
          { id: 'h2-b3-1', name: 'Brasil Primeiro e Segundo Império (D. Pedro I e II)', bimester: 3 },
          { id: 'h2-b3-2', name: 'Guerra do Paraguai e Crise da Monarquia no Brasil', bimester: 3 },
          { id: 'h2-b4-1', name: 'Imperialismo / Neocolonialismo na África e Ásia', bimester: 4 },
          { id: 'h2-b4-2', name: 'Proclamação da República e República Velha no Brasil', bimester: 4 }
        ]
      },
      {
        id: 'geo-2',
        name: 'Geografia',
        category: 'Humanas',
        color: 'emerald',
        topics: [
          { id: 'g2-b1-1', name: 'Urbanização Mundial e no Brasil (Metropolização e Conurbação)', bimester: 1 },
          { id: 'g2-b1-2', name: 'Problemas Socioambientais Urbanos', bimester: 1 },
          { id: 'g2-b2-1', name: 'Geografia Agrária: Sistemas Agrícolas e Agronegócio no Brasil', bimester: 2 },
          { id: 'g2-b2-2', name: 'Estrutura Fundiária e Conflitos no Campo Brasileiro', bimester: 2 },
          { id: 'g2-b3-1', name: 'Industrialização: Fases e Modelos Industriais (Fordismo, Toyotismo)', bimester: 3 },
          { id: 'g2-b3-2', name: 'Industrialização Brasileira e Desconcentração Industrial', bimester: 3 },
          { id: 'g2-b4-1', name: 'Globalização, Blocos Econômicos e Redes de Transporte/Comunicação', bimester: 4 }
        ]
      },
      {
        id: 'soc-2',
        name: 'Sociologia',
        category: 'Humanas',
        color: 'cyan',
        topics: [
          { id: 's2-b1-1', name: 'Poder, Estado e Domínio Político em Weber', bimester: 1 },
          { id: 's2-b2-1', name: 'Cidadania, Direitos Humanos e Democracia no Brasil', bimester: 2 },
          { id: 's2-b3-1', name: 'Mundo do Trabalho: Reestruturação Produtiva e Precarização', bimester: 3 },
          { id: 's2-b4-1', name: 'Movimentos Sociais Contemporâneos e Redes Sociais', bimester: 4 }
        ]
      },
      {
        id: 'filo-2',
        name: 'Filosofia',
        category: 'Humanas',
        color: 'purple',
        topics: [
          { id: 'fi2-b1-1', name: 'Filosofia Medieval: Patrística (Santo Agostinho) e Escolástica (São Tomás)', bimester: 1 },
          { id: 'fi2-b2-1', name: 'Racionalismo (Descartes) vs Empirismo (Locke e Hume)', bimester: 2 },
          { id: 'fi2-b3-1', name: 'Filosofia Política Moderna: Maquiavel e os Contratualistas (Hobbes, Locke, Rousseau)', bimester: 3 },
          { id: 'fi2-b4-1', name: 'O Iluminismo e o Criticismo Kantiano (Immanuel Kant)', bimester: 4 }
        ]
      },
      {
        id: 'eng-2',
        name: 'Inglês',
        category: 'Linguagens',
        color: 'indigo',
        topics: [
          { id: 'e2-b1-1', name: 'Present Perfect Simple and Continuous', bimester: 1 },
          { id: 'e2-b2-1', name: 'Conditionals (Zero, First, and Second Conditional)', bimester: 2 },
          { id: 'e2-b3-1', name: 'Passive Voice in Technical and Scientific Texts', bimester: 3 },
          { id: 'e2-b4-1', name: 'Reported Speech and Linking Words / Connectors', bimester: 4 }
        ]
      }
    ]
  },
  '3rd': {
    series: '3rd',
    seriesLabel: '3º Ano do Ensino Médio',
    subjects: [
      {
        id: 'math-3',
        name: 'Matemática',
        category: 'Exatas',
        color: 'indigo',
        topics: [
          // Geometria Analítica e Polinômios
          { id: 'm3-b1-1', name: 'Geometria Analítica: Distância entre Pontos e Ponto Médio', bimester: 1 },
          { id: 'm3-b1-2', name: 'Estudo da Reta: Equação Geral, Reduzida e Paralelismo/Perpendicularismo', bimester: 1 },
          { id: 'm3-b1-3', name: 'Estudo da Circunferência: Equação Reduzida e Geral', bimester: 1 },
          { id: 'm3-b2-1', name: 'Números Complexos: Forma Algébrica e Trigonométrica', bimester: 2 },
          { id: 'm3-b2-2', name: 'Polinômios: Operações e Dispositivo Prático de Briot-Ruffini', bimester: 2 },
          { id: 'm3-b2-3', name: 'Equações Polinomiais e Relações de Girard', bimester: 2 },
          { id: 'm3-b3-1', name: 'Revisão Intensiva ENEM/Vestibulares: Razão, Proporção e Porcentagem', bimester: 3 },
          { id: 'm3-b3-2', name: 'Revisão Intensiva ENEM: Geometria Plana e Espacial APLICADA', bimester: 3 },
          { id: 'm3-b4-1', name: 'Análise de Gráficos e Tabelas para Provas Oficiais', bimester: 4 },
          { id: 'm3-b4-2', name: 'Simulados e Estratégias de Triagem TRI de Questões', bimester: 4 }
        ]
      },
      {
        id: 'port-3',
        name: 'Língua Portuguesa',
        category: 'Linguagens',
        color: 'rose',
        topics: [
          { id: 'p3-b1-1', name: 'Análise Sintática Completa e Figuras de Linguagem em Textos do ENEM', bimester: 1 },
          { id: 'p3-b1-2', name: 'Pontuação, Regência e Crase na Prática de Revisão', bimester: 1 },
          { id: 'p3-b2-1', name: 'Interpretação Avançada de Textos e Gêneros Jornalísticos e Publicitários', bimester: 2 },
          { id: 'p3-b3-1', name: 'Revisão de Gramática Aplicada à Redação', bimester: 3 },
          { id: 'p3-b4-1', name: 'Resolução Comentada de Provas Recentes do ENEM e Fuvest', bimester: 4 }
        ]
      },
      {
        id: 'lit-3',
        name: 'Literatura',
        category: 'Linguagens',
        color: 'purple',
        topics: [
          // Modernismo e Literatura Contemporânea
          { id: 'l3-b1-1', name: 'Vanguardas Europeias (Futurismo, Cubismo, Dadaísmo, Surrealismo)', bimester: 1 },
          { id: 'l3-b1-2', name: 'Semana de Arte Moderna de 1922 e 1ª Fase Modernista (Mário e Oswald de Andrade)', bimester: 1 },
          { id: 'l3-b2-1', name: '2ª Fase Modernista - Poesia (Carlos Drummond de Andrade, Vinicius, Cecília Meireles)', bimester: 2 },
          { id: 'l3-b2-2', name: '2ª Fase Modernista - Prosa de 30 (Graciliano Ramos, Jorge Amado, Érico Veríssimo)', bimester: 2 },
          { id: 'l3-b3-1', name: '3ª Fase Modernista (Clarice Lispector, Guimarães Rosa e João Cabral de Melo Neto)', bimester: 3 },
          { id: 'l3-b4-1', name: 'Literatura Contemporânea Brasileira e Obras Obrigatórias dos Vestibulares', bimester: 4 }
        ]
      },
      {
        id: 'red-3',
        name: 'Redação',
        category: 'Redação',
        color: 'amber',
        topics: [
          { id: 'r3-b1-1', name: 'Treinamento de Velocidade e Planejamento de Texto (30 min)', bimester: 1 },
          { id: 'r3-b2-1', name: 'Propostas com Temáticas Inéditas do eixos: Tecnologia, Meio Ambiente e Saúde', bimester: 2 },
          { id: 'r3-b3-1', name: 'Refinamento de Vocabulário e Eliminação de Marcas de Oralidade', bimester: 3 },
          { id: 'r3-b4-1', name: 'Maratona Final de Redações do ENEM e Principais Vestibulares', bimester: 4 }
        ]
      },
      {
        id: 'phys-3',
        name: 'Física',
        category: 'Exatas',
        color: 'cyan',
        topics: [
          // Eletricidade e Física Moderna
          { id: 'f3-b1-1', name: 'Eletrostática: Carga Elétrica, Processos de Eletrização e Lei de Coulomb', bimester: 1 },
          { id: 'f3-b1-2', name: 'Campo Elétrico, Potencial Elétrico e Trabalho da Força Elétrica', bimester: 1 },
          { id: 'f3-b2-1', name: 'Eletrodinâmica: Corrente Elétrica, Tensão e Resistência (Lei de Ohm)', bimester: 2 },
          { id: 'f3-b2-2', name: 'Circuitos Elétricos em Série, Paralelo e Misto', bimester: 2 },
          { id: 'f3-b2-3', name: 'Potência Elétrica e Consumo em kWh', bimester: 2 },
          { id: 'f3-b3-1', name: 'Eletromagnetismo: Imãs, Campo Magnético e Força Magnética', bimester: 3 },
          { id: 'f3-b3-2', name: 'Indução Eletromagnética e Lei de Faraday', bimester: 3 },
          { id: 'f3-b4-1', name: 'Introdução à Física Moderna: Efeito Fotoelétrico e Relatividade Restrita', bimester: 4 }
        ]
      },
      {
        id: 'chem-3',
        name: 'Química',
        category: 'Exatas',
        color: 'emerald',
        topics: [
          // Química Orgânica
          { id: 'q3-b1-1', name: 'Introdução à Química Orgânica: Postulados de Kekulé e Hibridização do Carbono', bimester: 1 },
          { id: 'q3-b1-2', name: 'Classificação de Cadeias Carbônicas', bimester: 1 },
          { id: 'q3-b1-3', name: 'Funções Orgânicas 1: Hidrocarbonetos (Alcanos, Alcenos, Alcinos, Aromáticos)', bimester: 1 },
          { id: 'q3-b2-1', name: 'Funções Orgânicas 2: Oxigenadas (Álcool, Enol, Fenol, Aldeído, Cetona, Ácido Carboxílico, Éster, Éter)', bimester: 2 },
          { id: 'q3-b2-2', name: 'Funções Orgânicas 3: Nitrogenadas (Amina, Amida, Nitrila)', bimester: 2 },
          { id: 'q3-b3-1', name: 'Isomeria Plana (Cadeia, Posição, Função, Metameria, Tautometria)', bimester: 3 },
          { id: 'q3-b3-2', name: 'Isomeria Espacial (Geométrica Cisc/Trans e Óptica)', bimester: 3 },
          { id: 'q3-b4-1', name: 'Reações Orgânicas (Substituição, Adição, Eliminação e Oxidação)', bimester: 4 },
          { id: 'q3-b4-2', name: 'Polímeros Sintéticos e Bioquímica Orgânica', bimester: 4 }
        ]
      },
      {
        id: 'bio-3',
        name: 'Biologia',
        category: 'Biológicas',
        color: 'emerald',
        topics: [
          // Genética, Evolução e Ecologia
          { id: 'b3-b1-1', name: 'Genética 1: Primeira Lei de Mendel e Heredogramas', bimester: 1 },
          { id: 'b3-b1-2', name: 'Grupos Sanguíneos (Sistema ABO e Fator Rh)', bimester: 1 },
          { id: 'b3-b1-3', name: 'Segunda Lei de Mendel e Linkage (Ligação Gênica)', bimester: 1 },
          { id: 'b3-b2-1', name: 'Herança Sexual e Genética Molecular (Biotecnologia e DNA Recombinante)', bimester: 2 },
          { id: 'b3-b2-2', name: 'Teorias Evolutivas: Lamarckismo, Darwinismo e Neodarwinismo', bimester: 2 },
          { id: 'b3-b2-3', name: 'Especiação e Evidências da Evolução', bimester: 2 },
          { id: 'b3-b3-1', name: 'Ecologia 1: Cadeias e Teias Alimentares, Fluxo de Energia e Pirâmides', bimester: 3 },
          { id: 'b3-b3-2', name: 'Relações Ecológicas Harmônicas e Desarmônicas', bimester: 3 },
          { id: 'b3-b3-3', name: 'Ciclos Biogeoquímicos (Água, Carbono, Nitrogênio e Oxigênio)', bimester: 3 },
          { id: 'b3-b4-1', name: 'Sucessão Ecológica e Grandes Problemas Ambientais (Eutrofização, Poluição)', bimester: 4 }
        ]
      },
      {
        id: 'hist-3',
        name: 'História',
        category: 'Humanas',
        color: 'amber',
        topics: [
          { id: 'h3-b1-1', name: 'Primeira Guerra Mundial e Revolução Russa de 1917', bimester: 1 },
          { id: 'h3-b1-2', name: 'Período Entre-Guerras, Crise de 1929 e Nazi-Fascismo', bimester: 1 },
          { id: 'h3-b2-1', name: 'Era Vargas no Brasil (1930 - 1945): Estado Novo e Trabalhismo', bimester: 2 },
          { id: 'h3-b2-2', name: 'Segunda Guerra Mundial e Criação da ONU', bimester: 2 },
          { id: 'h3-b3-1', name: 'Guerra Fria, Corrida Espacial e Descolonização da África e Ásia', bimester: 3 },
          { id: 'h3-b3-2', name: 'Período Democrático no Brasil (1945 - 1964) e Ditadura Militar (1964 - 1985)', bimester: 3 },
          { id: 'h3-b4-1', name: 'Redemocratização do Brasil, Constituição de 1988 e Brasil Contemporâneo', bimester: 4 }
        ]
      },
      {
        id: 'geo-3',
        name: 'Geografia',
        category: 'Humanas',
        color: 'emerald',
        topics: [
          { id: 'g3-b1-1', name: 'Geopolítica Mundial Contemporânea e Conflitos Internacionais', bimester: 1 },
          { id: 'g3-b1-2', name: 'A Nova Ordem Mundial e Múltiplos Polos de Poder', bimester: 1 },
          { id: 'g3-b2-1', name: 'Geografia Regional do Brasil (Norte, Nordeste, Centro-Oeste, Sudeste, Sul)', bimester: 2 },
          { id: 'g3-b3-1', name: 'Revisão Intensiva ENEM: Questões de Geografia Física e Humana', bimester: 3 },
          { id: 'g3-b4-1', name: 'Análise de Pirâmides Etárias, Gráficos e Mapas Temáticos', bimester: 4 }
        ]
      },
      {
        id: 'soc-3',
        name: 'Sociologia',
        category: 'Humanas',
        color: 'cyan',
        topics: [
          { id: 's3-b1-1', name: 'Sociologia Brasileira: Gilberto Freyre, Sérgio Buarque de Holanda e Florestan Fernandes', bimester: 1 },
          { id: 's3-b2-1', name: 'Indústria Cultural e Teoria Crítica da Escola de Frankfurt (Adorno e Horkheimer)', bimester: 2 },
          { id: 's3-b3-1', name: 'Violência, Segurança Pública e Direitos na Sociedade Brasileira', bimester: 3 },
          { id: 's3-b4-1', name: 'Revisão Sociologia no ENEM: Análise de Imagens, Memes e Questões', bimester: 4 }
        ]
      },
      {
        id: 'filo-3',
        name: 'Filosofia',
        category: 'Humanas',
        color: 'purple',
        topics: [
          { id: 'fi3-b1-1', name: 'Filosofia Contemporânea: Materialismo Histórico (Marx) e Positivismo (Comte)', bimester: 1 },
          { id: 'fi3-b2-1', name: 'Existencialismo: Nietzsche, Sartre e Simone de Beauvoir', bimester: 2 },
          { id: 'fi3-b3-1', name: 'Escola de Frankfurt, Bioética e Filosofia da Tecnologia (Hans Jonas, Foucault)', bimester: 3 },
          { id: 'fi3-b4-1', name: 'Revisão de Filosofia para o ENEM e Vestibulares', bimester: 4 }
        ]
      },
      {
        id: 'eng-3',
        name: 'Inglês',
        category: 'Linguagens',
        color: 'indigo',
        topics: [
          { id: 'e3-b1-1', name: 'ENEM Reading Comprehension Masterclass & False Friends', bimester: 1 },
          { id: 'e3-b2-1', name: 'Solving Multimodal Texts (Cartoons, Charts, Quotes, Poems)', bimester: 2 },
          { id: 'e3-b3-1', name: 'Grammar Highlights: Connectors, Pronouns, and Verb Tenses in Context', bimester: 3 },
          { id: 'e3-b4-1', name: 'Final Exam Marathon and Vocabulary Booster', bimester: 4 }
        ]
      }
    ]
  }
};
