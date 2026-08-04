import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Helper to initialize GenAI client securely
function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not defined in environment variables");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// -------------------------------------------------------------
// API ROUTES
// -------------------------------------------------------------

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "Estudei & Passei Ensino Médio API" });
});

app.get("/api/version", (_req, res) => {
  res.json({
    version: "1.3.0",
    buildTimestamp: "2026-07-28T08:53:00Z",
    commit: "v1.3.0-pwa-installable",
    service: "Estudei & Passei Ensino Médio"
  });
});

// 0. Diagnóstico Pedagógico do Aluno (IA Gemini)
app.post("/api/ai/diagnostic", async (req, res) => {
  try {
    const { studentName, subjects, evaluations, studyLogs, schoolConfig } = req.body;

    const ai = getGenAI();
    const prompt = `Você é o Coordenador Pedagógico e Especialista em Diagnóstico de Aprendizagem do "Estudei & Passei".
Analise o histórico completo do estudante "${studentName || "Aluno"}":

Média de Corte da Escola: ${schoolConfig?.passingScore || 6.0}

Disciplinas Cadastradas:
${JSON.stringify(subjects || [], null, 2)}

Notas em Avaliações Registradas:
${JSON.stringify(evaluations || [], null, 2)}

Sessões de Estudo Registradas (Tempo e Constância):
${JSON.stringify(studyLogs || [], null, 2)}

Sua missão:
1. Calcule e identifique as lacunas pedagógicas reais do estudante (matérias/tópicos com notas abaixo da média de corte ou com poucas horas estudadas).
2. Determine o ritmo/constância de aprendizado (Acelerado, Regular, Inconstante, ou Atencao Necessaria).
3. Crie um Plano de Revisão de 4 Semanas focado nas maiores vulnerabilidades identificadas.
4. Redija uma orientação acolhedora, pedagógica e prática direcionada aos PAIS (sem pânico, focada em incentivo e organização).

Retorne ESTRITAMENTE um JSON com a seguinte estrutura:
{
  "overallScore": 78,
  "learningPace": "Regular",
  "atRiskTopics": [
    {
      "subjectName": "Matemática",
      "topicName": "Funções Quadráticas",
      "severity": "alta",
      "recommendation": "Rever conceitos com 20 min de flashcards e resolução de 3 exercícios comentados."
    }
  ],
  "strengths": ["Boa constância em Biologia", "Excelente média em Humanas"],
  "fourWeekRevisionPlan": [
    {
      "weekNumber": 1,
      "title": "Semana 1: Fortalecimento de Exatas e Conceitos Base",
      "focusSubjects": ["Matemática", "Física"],
      "actionItems": ["Resolver 5 exercícios de Funções", "Fazer 15 min de leitura guiada em Física"]
    },
    {
      "weekNumber": 2,
      "title": "Semana 2: Consolidação e Simulação",
      "focusSubjects": ["Química", "Matemática"],
      "actionItems": ["Revisão com o Tutor Socrático IA", "Fazer 1 simulado curto de 5 questões"]
    },
    {
      "weekNumber": 3,
      "title": "Semana 3: Lapidação de Redação e Humanas",
      "focusSubjects": ["Redação", "História"],
      "actionItems": ["Treinar 1 estrutura de proposta de intervenção no ENEM"]
    },
    {
      "weekNumber": 4,
      "title": "Semana 4: Avaliação de Progresso e Ajustes",
      "focusSubjects": ["Geral"],
      "actionItems": ["Refazer teste de diagnóstico e celebrar evolução"]
    }
  ],
  "pedagogicalAdviceForParents": "Conselho pedagógico empático e prático para os pais..."
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("Erro no Diagnóstico IA:", error);
    res.status(500).json({ error: error?.message || "Erro ao gerar relatório de diagnóstico com a IA." });
  }
});


// 1. Tutor Socrático
app.post("/api/ai/tutor", async (req, res) => {
  try {
    const { question, subject, studentLevel } = req.body;
    if (!question) {
      return res.status(400).json({ error: "Sua pergunta não pode estar vazia." });
    }

    const ai = getGenAI();
    const prompt = `Você é o Tutor Socrático Inteligente do "Estudei & Passei Ensino Médio".
Disciplina: ${subject || "Geral"}
Ano Escolar do Aluno: ${studentLevel || "Ensino Médio"}
Pergunta do aluno: "${question}"

Sua missão:
1. Explique o conceito de forma clara, didática e motivadora.
2. Não dê apenas a resposta direta; use o método socrático fazendo 1 ou 2 perguntas instigantes ao final para guiar a reflexão do estudante.
3. Destaque os pontos mais cobrados no ENEM e vestibulares.
4. Responda formatado em Markdown limpo com tópicos, negritos e emojis pedagógicos moderados.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    res.json({ explanation: response.text || "Não foi possível gerar a explicação." });
  } catch (error: any) {
    console.error("Erro no Tutor Socrático:", error);
    res.status(500).json({ error: error?.message || "Erro interno no Tutor IA." });
  }
});

// 2. Gerador de Exercícios Inéditos
app.post("/api/ai/exercises", async (req, res) => {
  try {
    const { topic, subject, difficulty, count } = req.body;
    if (!topic) {
      return res.status(400).json({ error: "Informe o tópico para gerar os exercícios." });
    }

    const ai = getGenAI();
    const prompt = `Gere ${count || 3} questões inéditas e contextualizadas no estilo ENEM/Vestibular para:
Disciplina: ${subject || "Geral"}
Tópico: ${topic}
Nível de Dificuldade: ${difficulty || "Médio"}

Para cada questão, inclua:
- Enunciado claro com contexto real
- 5 alternativas (A, B, C, D, E)
- Gabarito comentado com explicação detalhada passo a passo.

Responda ESTRITAMENTE em formato JSON com esta estrutura:
{
  "exercises": [
    {
      "id": "ex-1",
      "statement": "Enunciado...",
      "options": ["A) ...", "B) ...", "C) ...", "D) ...", "E) ..."],
      "correctIndex": 0,
      "explanation": "Explicação do gabarito..."
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("Erro ao gerar exercícios:", error);
    res.status(500).json({ error: error?.message || "Erro ao gerar questões com a IA." });
  }
});

// 3. Correção de Redação ENEM por Texto ou Foto/Imagem (5 Competências)
app.post("/api/ai/essay-correction", async (req, res) => {
  try {
    const { essayTitle, essayText, imageBase64 } = req.body;
    if (!essayText && !imageBase64) {
      return res.status(400).json({ error: "Envie o texto da redação ou uma foto do manuscrito." });
    }

    const ai = getGenAI();
    let contents: any;

    const instructions = `Você é um Corretor Oficial de Redação do ENEM (Inep).
Tema/Título: "${essayTitle || "Tema Geral ENEM"}"

Avalie rigorosamente com base nas 5 Competências Oficiais do ENEM (cada uma valendo de 0 a 200 pontos, totalizando até 1000 pontos):
- Competência 1: Domínio da norma culta da língua escrita.
- Competência 2: Compreensão da proposta de redação e aplicação das áreas do conhecimento.
- Competência 3: Seleção, relação, organização e interpretação de informações/argumentos.
- Competência 4: Demonstração de conhecimento dos mecanismos linguísticos (coesão).
- Competência 5: Elaboração de proposta de intervenção para o problema abordado.

Forneça resposta ESTRITAMENTE em JSON com a estrutura:
{
  "totalScore": 880,
  "competencies": [
    { "number": 1, "name": "Norma Culta", "score": 160, "feedback": "..." },
    { "number": 2, "name": "Compreensão do Tema", "score": 180, "feedback": "..." },
    { "number": 3, "name": "Argumentação e Projeto de Texto", "score": 180, "feedback": "..." },
    { "number": 4, "name": "Coesão Linguística", "score": 180, "feedback": "..." },
    { "number": 5, "name": "Proposta de Intervenção", "score": 180, "feedback": "..." }
  ],
  "generalFeedback": "Análise geral do texto...",
  "strengths": ["Ponto forte 1", "Ponto forte 2"],
  "improvements": ["Sugestão 1", "Sugestão 2"]
}`;

    if (imageBase64) {
      // Clean base64 header if present
      const cleanData = imageBase64.replace(/^data:image\/\w+;base64,/, "");
      contents = {
        parts: [
          { inlineData: { mimeType: "image/jpeg", data: cleanData } },
          { text: instructions + `\n\nAnalise a imagem da redação manuscrita acima.` },
        ],
      };
    } else {
      contents = instructions + `\n\nRedação do Aluno:\n"${essayText}"`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents,
      config: {
        responseMimeType: "application/json",
      },
    });

    const result = JSON.parse(response.text || "{}");
    res.json(result);
  } catch (error: any) {
    console.error("Erro na correção de redação:", error);
    res.status(500).json({ error: error?.message || "Erro ao corrigir redação." });
  }
});

// 4. NotebookLM Studio - Resumo Estruturado e Audio Overview (Podcast Simulado)
app.post("/api/ai/notebook-overview", async (req, res) => {
  try {
    const { rawText, subject, topic } = req.body;
    if (!rawText) {
      return res.status(400).json({ error: "Forneça o texto da apostila ou anotações." });
    }

    const ai = getGenAI();
    const prompt = `Você atua como o motor inteligente NotebookLM para vestibulandos.
Disciplina: ${subject || "Geral"}
Tópico: ${topic || "Apostila/Notas"}
Conteúdo Bruto: "${rawText}"

Gere:
1. Resumo em Tópicos Chave (Bullet points executivos)
2. Glossário de Conceitos Fundamentais
3. Roteiro de Podcast Curto (Audio Overview) entre dois apresentadores (Alex e Mariana) debatendo os pontos mais cruciais de forma fluida e descontraída para revisão no trânsito.

Retorne em formato JSON:
{
  "structuredSummary": "...",
  "keyConcepts": [
    { "term": "...", "definition": "..." }
  ],
  "podcastScript": [
    { "speaker": "Alex", "line": "..." },
    { "speaker": "Mariana", "line": "..." }
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("Erro no NotebookLM Overview:", error);
    res.status(500).json({ error: error?.message || "Erro ao processar resumo NotebookLM." });
  }
});

// 5. YouTube Timestamps & Aulas Recomendadas
app.post("/api/ai/youtube-timestamps", async (req, res) => {
  try {
    const { topic, subject } = req.body;
    if (!topic) {
      return res.status(400).json({ error: "Informe a dúvida ou tópico." });
    }

    const ai = getGenAI();
    const prompt = `Como assistente educacional, forneça sugestões de canais consagrados do YouTube no Brasil (ex: Me Salva, Professor Jubilut, Biologia Total, Noslen, Ferretto, Ciência Todo Dia, etc.) e momentos/timestamps cirúrgicos para estudar:
Disciplina: ${subject || "Geral"}
Dúvida/Tópico Específico: ${topic}

Retorne um JSON com:
{
  "recommendations": [
    {
      "channel": "Nome do Canal",
      "videoTitle": "Título do Vídeo Recomendado",
      "timestamp": "04:15",
      "timestampSeconds": 255,
      "explanation": "Neste exato minuto o professor explica...",
      "searchQuery": "busca exata no youtube"
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("Erro nas recomendações do YouTube:", error);
    res.status(500).json({ error: error?.message || "Erro ao buscar timestamps do YouTube." });
  }
});

// 6. Scanner Inteligente de Sumário/Índice de Livro Didático por Foto ou Texto (IA)
app.post("/api/ai/scan-book-toc", async (req, res) => {
  try {
    const { imageBase64, rawText, defaultSubject } = req.body;
    if (!imageBase64 && !rawText) {
      return res.status(400).json({ error: "Envie uma foto do índice/sumário do livro ou o texto digitado." });
    }

    const ai = getGenAI();
    let contents: any;

    const instructions = `Você é o Scanner Educacional Especialista do "Estudei & Passei Ensino Médio".
Sua tarefa é analisar a foto do sumário/índice de um livro didático (ex: Poliedro, Bernoulli, FTD, Moderna, SAS, Positivo, etc.) ou o texto digitado do sumário.

Extraia a estrutura pedagógica completa para transformar em edital verticalizado do aluno.
Para cada capítulo, divida em tópicos de estudo bem definidos.

Retorne ESTRITAMENTE um JSON com este formato:
{
  "bookTitle": "Nome do Livro Didático / Coleção",
  "publisher": "Editora/Sistema de Ensino (ex: Poliedro, FTD, Bernoulli, Moderna)",
  "suggestedSubject": "Nome da Matéria (ex: Matemática, Física, Biologia, História)",
  "category": "Exatas" | "Humanas" | "Biológicas" | "Linguagens" | "Redação" | "Formação Geral",
  "chapters": [
    {
      "chapterNumber": 1,
      "chapterTitle": "Título do Capítulo/Módulo",
      "topics": [
        "Nome do Tópico de Estudo 1",
        "Nome do Tópico de Estudo 2"
      ]
    }
  ]
}`;

    if (imageBase64) {
      const cleanData = imageBase64.replace(/^data:image\/\w+;base64,/, "");
      contents = {
        parts: [
          { inlineData: { mimeType: "image/jpeg", data: cleanData } },
          { text: instructions + `\n\nAnalise a foto do sumário do livro acima.` },
        ],
      };
    } else {
      contents = instructions + `\n\nTexto do Sumário Digitado:\n"${rawText}"`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("Erro ao analisar sumário do livro com IA:", error);
    res.status(500).json({ error: error?.message || "Erro ao processar imagem do livro didático." });
  }
});

// 7. Scanner Inteligente de Grade Horária Escolar por Foto/PDF/Texto (IA)
app.post("/api/ai/parse-timetable", async (req, res) => {
  try {
    const { imageBase64, rawText, subjects } = req.body;
    if (!imageBase64 && !rawText) {
      return res.status(400).json({ error: "Envie uma foto da grade de horários ou o texto da tabela." });
    }

    const ai = getGenAI();
    let contents: any;

    const subjectsListText = (subjects || []).map((s: any) => `- ID: "${s.id}", Nome: "${s.name}"`).join("\n");

    const instructions = `Você é o leitor de grades escolares inteligente do "Estudei & Passei Ensino Médio".
Analise a imagem/PDF ou texto da grade de horários escolar e extraia os tempos de aula de cada dia da semana (Segunda a Sexta-feira).

Matérias cadastradas do aluno para correspondência de ID:
${subjectsListText}

Extraia a grade para cada dia (segunda, terca, quarta, quinta, sexta).
Para cada período de aula:
- periodNumber (1, 2, 3, 4, 5, 6...)
- startTime (ex: "07:15")
- endTime (ex: "08:00")
- subjectId (o ID da matéria que melhor corresponde entre as cadastradas)

Retorne ESTRITAMENTE em formato JSON com a estrutura:
{
  "timetable": [
    {
      "dayKey": "segunda",
      "dayName": "SEGUNDA-FEIRA",
      "periods": [
        { "id": "p-seg-1", "periodNumber": 1, "startTime": "07:15", "endTime": "08:00", "subjectId": "sub-mat" }
      ]
    },
    {
      "dayKey": "terca",
      "dayName": "TERÇA-FEIRA",
      "periods": [...]
    },
    {
      "dayKey": "quarta",
      "dayName": "QUARTA-FEIRA",
      "periods": [...]
    },
    {
      "dayKey": "quinta",
      "dayName": "QUINTA-FEIRA",
      "periods": [...]
    },
    {
      "dayKey": "sexta",
      "dayName": "SEXTA-FEIRA",
      "periods": [...]
    }
  ]
}`;

    if (imageBase64) {
      const cleanData = imageBase64.replace(/^data:(image\/\w+|application\/pdf);base64,/, "");
      const mimeType = imageBase64.includes("application/pdf") ? "application/pdf" : "image/jpeg";
      contents = {
        parts: [
          { inlineData: { mimeType, data: cleanData } },
          { text: instructions + `\n\nAnalise a imagem/PDF da grade de horários da escola fornecida acima.` },
        ],
      };
    } else {
      contents = instructions + `\n\nTexto da Grade:\n"${rawText}"`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("Erro ao analisar grade horária com IA:", error);
    res.status(500).json({ error: error?.message || "Erro ao processar imagem da grade de horários." });
  }
});

// 8. Gerador de Flashcards Inteligentes (IA Repetição Espaçada)
app.post("/api/ai/generate-flashcards", async (req, res) => {
  try {
    const { subject, topic, count } = req.body;
    if (!topic) {
      return res.status(400).json({ error: "Informe o tópico para gerar os flashcards." });
    }

    const ai = getGenAI();
    const prompt = `Gere ${count || 6} flashcards pedagógicos de alta qualidade para revisão de vestibular/ENEM.
Disciplina: ${subject || "Geral"}
Tópico/Matéria: "${topic}"

Para cada flashcard inclua:
- Pergunta ou conceito direto no lado da frente
- Resposta explicativa clara no verso com fórmulas ou palavras-chave
- Mnemônico ou gatilho de memorização rápido

Retorne ESTRITAMENTE em formato JSON:
{
  "deckTitle": "Deck: ${topic}",
  "cards": [
    {
      "id": "card-1",
      "question": "Pergunta ou conceito...",
      "answer": "Resposta completa e direta...",
      "mnemonic": "Gatilho mental / Dica de ouro...",
      "topic": "${topic}"
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("Erro ao gerar flashcards:", error);
    res.status(500).json({ error: error?.message || "Erro ao gerar flashcards com a IA." });
  }
});

// 9. Gerador de Resumos Estruturados com Transcrição de Áudio de Aula
app.post("/api/ai/generate-summary", async (req, res) => {
  try {
    const { subject, topic, rawContent } = req.body;
    if (!topic && !rawContent) {
      return res.status(400).json({ error: "Informe o tópico ou forneça anotações para gerar o resumo." });
    }

    const ai = getGenAI();
    const prompt = `Você é o Professor Especialista do "Estudei & Passei Ensino Médio".
Crie um material completo de estudo para:
Disciplina: ${subject || "Geral"}
Tópico: "${topic || "Apostila"}"
${rawContent ? `Anotações do Aluno: "${rawContent}"` : ""}

Gere:
1. Resumo Didático Estruturado em Markdown (com introdução, subtítulos, fórmulas/conceitos-chave e dicas para o ENEM).
2. 5 Pontos-Chave (Key Takeaways) inegociáveis para a prova.
3. Transcrição Corrida de Áudio de Aula (Audio Text): Um texto narrativo em linguagem falada, fluida, natural e extremamente didática (cerca de 250 a 400 palavras), perfeito para ser lido por sintose de voz (Text-to-Speech) no aplicativo enquanto o aluno faz caminhada ou relaxa.

Retorne ESTRITAMENTE em formato JSON:
{
  "title": "Resumo Completo: ${topic || subject}",
  "readingTimeMinutes": 5,
  "formattedMarkdown": "Markdown do resumo...",
  "keyTakeaways": ["Ponto 1", "Ponto 2", "Ponto 3", "Ponto 4", "Ponto 5"],
  "audioText": "Olá vestibulando! Hoje vamos revisar..."
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("Erro ao gerar resumo e áudio:", error);
    res.status(500).json({ error: error?.message || "Erro ao gerar resumo didático." });
  }
});

// 10. Gerador de Simulados Inéditos (ENEM/Vestibulares)
app.post("/api/ai/generate-simulado", async (req, res) => {
  try {
    const { targetExam, subject, count } = req.body;
    const examName = targetExam || "ENEM";
    const numQuestions = count || 5;

    const ai = getGenAI();
    const prompt = `Gere um Simulado Inédito Completo no estilo ${examName}.
Disciplina/Foco: ${subject || "Interdisciplinar / Geral"}
Quantidade de Questões: ${numQuestions}

Cada questão deve ser rigorosa, contextualizada e conter:
- Enunciado com texto base ou situação-problema
- 5 alternativas (A, B, C, D, E)
- Gabarito correto (0 a 4)
- Resolução e explicação detalhada do gabarito
- Área de conhecimento ("Exatas", "Humanas", "Biológicas", "Linguagens")
- Tópico específico

Retorne ESTRITAMENTE em JSON:
{
  "title": "Simulado Inédito ${examName} - ${subject || "Geral"}",
  "targetExam": "${examName}",
  "timeLimitMinutes": ${numQuestions * 3},
  "questions": [
    {
      "id": "q-1",
      "statement": "Enunciado...",
      "options": ["A) ...", "B) ...", "C) ...", "D) ...", "E) ..."],
      "correctIndex": 0,
      "explanation": "Explicação completa...",
      "area": "Exatas",
      "topic": "Tópico"
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("Erro ao gerar simulado com IA:", error);
    res.status(500).json({ error: error?.message || "Erro ao gerar simulado inédito." });
  }
});

// 11. Validação de Foto de Questões Manuais por IA (Gemini Vision Antitrapaça)
app.post("/api/ai/analyze-question-photo", async (req, res) => {
  try {
    const { imageBase64, claimedTotal, claimedCorrect, subjectName, topicName } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ error: "Envie a foto da folha ou caderno com as questões." });
    }

    const ai = getGenAI();
    const cleanData = imageBase64.replace(/^data:image\/\w+;base64,/, "");

    const prompt = `Você é o Auditor Educacional do "Estudei & Passei".
Sua função é verificar fotos de cadernos, apostilas ou livros físicos de estudantes para garantir a veracidade dos lançamentos de exercícios manuais.

Dados declarados pelo aluno:
- Matéria: ${subjectName || "Geral"}
- Tópico: ${topicName || "Geral"}
- Quantidade total declarada de questões feitas: ${claimedTotal || 10}
- Quantidade declarada de acertos: ${claimedCorrect || 8}

Analise a imagem minuciosamente:
1. Identifique se o conteúdo da foto refere-se a material de estudo (exercícios, manuscritos, apostila, cálculos ou anotações acadêmicas).
2. Estime quantas questões resolvidas parecem estar visíveis na imagem.
3. Verifique se há correções, vistos, notas, gabaritos ou marcações de acertos/erros (círculos em alternativas, certos em caneta vermelha/azul, etc).
4. Atribua um grau de confiança (0 a 100).
5. Forneça uma justificativa pedagógica e amigável.

Retorne ESTRITAMENTE em formato JSON com esta estrutura:
{
  "isStudyMaterial": true,
  "aiEstimatedQuestions": 12,
  "hasVisibleCorrections": true,
  "aiConfidence": 90,
  "aiFeedback": "Detectadas aproximadamente 12 questões resolvidas à mão com marcações de correção visíveis."
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: {
        parts: [
          { inlineData: { mimeType: "image/jpeg", data: cleanData } },
          { text: prompt },
        ],
      },
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("Erro ao analisar foto de questões manuais:", error);
    res.status(500).json({ error: error?.message || "Erro ao analisar imagem com a IA Gemini Vision." });
  }
});

// 12. Gerador de Quiz para Olimpíadas de Estudo da Turma
app.post("/api/ai/generate-olympiad-quiz", async (req, res) => {
  try {
    const { title, subjectName, questionCount } = req.body;
    const numQuestions = questionCount || 10;

    const ai = getGenAI();
    const prompt = `Gere um Quiz de Desafio para uma Olimpíada de Estudo entre alunos de Ensino Médio.
Título da Olimpíada: "${title || "Olimpíada de Estudos"}"
Matéria: "${subjectName || "Conhecimentos Gerais"}"
Quantidade de Questões: ${numQuestions}

Regras:
- As questões devem ser envolventes, desafiadoras e no estilo ENEM/Vestibulares.
- Cada questão precisa de 4 ou 5 alternativas e explicação do gabarito.

Retorne ESTRITAMENTE em JSON:
{
  "title": "${title || "Olimpíada de Estudos"}",
  "subjectName": "${subjectName || "Geral"}",
  "questions": [
    {
      "id": "q-olymp-1",
      "statement": "Enunciado da questão...",
      "options": ["A) ...", "B) ...", "C) ...", "D) ...", "E) ..."],
      "correctIndex": 0,
      "explanation": "Explicação pedagógica da resposta correta.",
      "topic": "Tópico"
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("Erro ao gerar quiz de olimpíada:", error);
    res.status(500).json({ error: error?.message || "Erro ao gerar questões da olimpíada com a IA." });
  }
});


// -------------------------------------------------------------
// VITE / STATIC SERVING
// -------------------------------------------------------------

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Servidor "Estudei & Passei Ensino Médio" rodando na porta ${PORT}`);
  });
}

startServer();
