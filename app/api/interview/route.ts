import { GoogleGenAI } from '@google/genai';

/**
 * PRODUCTION-READY NEXT.JS APP ROUTER & EXPRESS COMPATIBLE API ROUTE
 * Endpoint: /api/interview
 * 
 * Integrates Gemini 3.6 Flash (@google/genai) with Breeth Memory API (https://mcp.thebreeth.com/mcp)
 * for conducting multi-turn technical interviews for the ABTalks 31-day AI Cohort.
 */

// Helper to initialize GoogleGenAI client safely
function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is required');
  }
  return new GoogleGenAI({ apiKey });
}

// -------------------------------------------------------------
// BREETH MEMORY API INTEGRATION HELPERS
// -------------------------------------------------------------
async function queryBreethMemory(candidateId: string, sessionId: string) {
  const apiKey = process.env.BREETH_API_KEY;
  if (!apiKey) {
    console.warn('[Breeth] BREETH_API_KEY not configured. Proceeding with transient memory.');
    return [];
  }

  try {
    const mcpUrl = 'https://mcp.thebreeth.com/mcp';
    const response = await fetch(mcpUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'x-api-key': apiKey,
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: Date.now(),
        method: 'tools/call',
        params: {
          name: 'get_memory',
          arguments: {
            candidate_id: candidateId,
            session_id: sessionId,
          },
        },
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const content = data?.result?.content?.[0]?.text;
      return content ? JSON.parse(content) : [];
    }

    // REST fallback
    const restUrl = process.env.BREETH_API_URL || 'https://api.thebreeth.com/v1/memory/query';
    const restRes = await fetch(restUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ candidate_id: candidateId, session_id: sessionId }),
    });

    if (restRes.ok) {
      const restData = await restRes.json();
      return restData.memories || restData.items || [];
    }
  } catch (err: any) {
    console.error('[Breeth Memory] Query error:', err.message);
  }
  return [];
}

async function saveToBreethMemory(record: {
  candidateId: string;
  sessionId: string;
  questionNumber: number;
  day: number;
  topic: string;
  questionText: string;
  candidateAnswer: string;
  evaluationScore: number;
  evaluationLabel: string;
  feedback: string;
}) {
  const apiKey = process.env.BREETH_API_KEY;
  if (!apiKey) {
    return false;
  }

  try {
    const mcpUrl = 'https://mcp.thebreeth.com/mcp';
    const response = await fetch(mcpUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'x-api-key': apiKey,
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: Date.now(),
        method: 'tools/call',
        params: {
          name: 'add_memory',
          arguments: {
            candidate_id: record.candidateId,
            session_id: record.sessionId,
            content: `Q#${record.questionNumber} (Day ${record.day} - ${record.topic}): "${record.questionText}". Candidate Answer: "${record.candidateAnswer}". Score: ${record.evaluationScore}/100 (${record.evaluationLabel}). Feedback: ${record.feedback}`,
            tags: ['interview', `day-${record.day}`, record.topic],
          },
        },
      }),
    });

    if (response.ok) return true;

    // REST fallback
    const restUrl = process.env.BREETH_API_URL || 'https://api.thebreeth.com/v1/memory/store';
    await fetch(restUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        candidate_id: record.candidateId,
        session_id: record.sessionId,
        data: record,
      }),
    });
    return true;
  } catch (err: any) {
    console.error('[Breeth Memory] Save error:', err.message);
    return false;
  }
}

// -------------------------------------------------------------
// POST HANDLER (Start & Answer Multi-turn Loop)
// -------------------------------------------------------------
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action = 'answer', candidate_id = 'sana-khan', session_id, answer, current_question, transcript = [] } = body;

    const sessionId = session_id || `intv-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const ai = getGeminiClient();

    // ACTION: START NEW INTERVIEW
    if (action === 'start') {
      // 1. Retrieve prior candidate background memory from Breeth
      const pastMemories = await queryBreethMemory(candidate_id, 'history');

      // 2. Formulate initial adaptive question using Gemini
      const prompt = `You are an elite Senior AI Technical Interviewer evaluating candidates for the 31-day Enterprise AI Cohort.
Candidate ID: ${candidate_id}
Candidate Past Breeth Memory Context: ${JSON.stringify(pastMemories)}

Generate Question #1 targeting Day 1 (Model Architectures & Self-Attention).
Return JSON matching:
{
  "id": "q1",
  "day": 1,
  "module": "Module 1: Foundations & Transformers",
  "topic": "Attention Mechanism & Q/K/V Math",
  "questionText": "Explain how the scaled dot-product attention mechanism computes Query, Key, and Value matrices, and why scaling by sqrt(d_k) prevents vanishing gradients during softmax.",
  "difficulty": "Medium",
  "type": "Conceptual",
  "sampleIdealAnswer": "Q, K, V are linear projections of input embeddings. Softmax(QK^T / sqrt(d_k))V applies dot product similarity. Scaling prevents extremely large dot products from pushing softmax into regions with small gradients."
}`;

      const res = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' },
      });

      const firstQuestion = JSON.parse(res.text || '{}');

      return Response.json({
        status: 'success',
        session_id: sessionId,
        candidate_id,
        current_question_number: 1,
        total_questions: 8,
        question: firstQuestion,
        breeth_memory_retrieved: pastMemories.length > 0,
      });
    }

    // ACTION: SUBMIT ANSWER & MULTI-TURN EVALUATION
    if (!answer || !current_question) {
      return Response.json(
        { error: 'Parameters "answer" and "current_question" are required.' },
        { status: 400 }
      );
    }

    // 1. Retrieve accumulated interview memory from Breeth
    const breethHistory = await queryBreethMemory(candidate_id, sessionId);

    // 2. Evaluate candidate answer using Gemini 3.6 Flash
    const evalPrompt = `You are a Senior AI Interview Examiner evaluating an answer for the 31-day Enterprise AI Cohort.
Question #${current_question.number || transcript.length + 1} (Day ${current_question.day} - ${current_question.topic}):
"${current_question.questionText}"

Candidate's Submitted Answer:
"${answer}"

Past Breeth Memory Context:
${JSON.stringify(breethHistory)}

Evaluate accurately and return JSON:
{
  "score": number (0-100),
  "evaluationLabel": "Mastery" | "Strong" | "Adequate" | "Needs Revision",
  "feedback": "2-3 sentences of clear technical feedback",
  "followUpProbe": "Optional 1 sentence probing follow-up if answer was partial, else empty string",
  "idealKeyPointsCovered": ["Point 1", "Point 2"],
  "idealKeyPointsMissed": ["Missed Point"]
}`;

    const evalRes = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: evalPrompt,
      config: { responseMimeType: 'application/json' },
    });

    const evaluation = JSON.parse(evalRes.text || '{}');

    // 3. Persist Q&A exchange to Breeth Memory API
    const record = {
      candidateId: candidate_id,
      sessionId: sessionId,
      questionNumber: transcript.length + 1,
      day: current_question.day || 1,
      topic: current_question.topic || 'AI Engineering',
      questionText: current_question.questionText,
      candidateAnswer: answer,
      evaluationScore: evaluation.score || 75,
      evaluationLabel: evaluation.evaluationLabel || 'Strong',
      feedback: evaluation.feedback || 'Good attempt.',
    };

    const savedToBreeth = await saveToBreethMemory(record);

    const updatedTranscript = [
      ...transcript,
      { ...record, idealKeyPointsCovered: evaluation.idealKeyPointsCovered, idealKeyPointsMissed: evaluation.idealKeyPointsMissed }
    ];

    const isComplete = updatedTranscript.length >= 8;

    if (isComplete) {
      // Generate Structured Final Report
      const reportPrompt = `Generate a structured final interview report based on transcript:
${JSON.stringify(updatedTranscript)}

Return JSON:
{
  "overallScore": number (0-100),
  "gradeLabel": "Pass with Distinction" | "Pass" | "Conditional Pass" | "Needs Retake",
  "scoreBreakdown": {
    "technicalKnowledge": number,
    "conceptualUnderstanding": number,
    "problemSolving": number,
    "systemDesign": number,
    "communication": number
  },
  "strengths": ["Strength 1", "Strength 2"],
  "areasToImprove": ["Area 1", "Area 2"],
  "summaryParagraph": "Professional summary"
}`;

      const reportRes = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: reportPrompt,
        config: { responseMimeType: 'application/json' },
      });

      const finalReport = JSON.parse(reportRes.text || '{}');

      return Response.json({
        status: 'completed',
        session_id: sessionId,
        is_complete: true,
        evaluation,
        saved_to_breeth_memory: savedToBreeth,
        report: finalReport,
      });
    } else {
      // 4. Generate Realistic Adaptive Follow-up Question based on Breeth Memory & Curriculum
      const daysCovered = Array.from(new Set(updatedTranscript.map((t: any) => t.day)));
      const nextQNum = updatedTranscript.length + 1;

      const nextPrompt = `Formulate Question #${nextQNum} (of 8) for candidate ${candidate_id}.
Evaluated Transcript & Breeth Memory Context:
${JSON.stringify(updatedTranscript)}
Days Covered So Far: ${daysCovered.join(', ')}

Rules:
- Select a curriculum topic from Days 1-31 (ensure at least 4 unique days across 8 questions).
- Make the question adaptive: if candidate did well, increase difficulty to Hard/Design; if struggled, test foundational concepts.
- Provide a non-scripted, realistic scenario.

Return JSON:
{
  "id": "q${nextQNum}",
  "number": ${nextQNum},
  "day": number (1-31),
  "module": "Module Name",
  "topic": "Topic Name",
  "questionText": "Scenario-based technical question text",
  "difficulty": "Easy" | "Medium" | "Hard",
  "type": "Conceptual" | "Coding" | "Architecture"
}`;

      const nextRes = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: nextPrompt,
        config: { responseMimeType: 'application/json' },
      });

      const nextQuestion = JSON.parse(nextRes.text || '{}');

      return Response.json({
        status: 'success',
        session_id: sessionId,
        is_complete: false,
        evaluation,
        saved_to_breeth_memory: savedToBreeth,
        next_question: nextQuestion,
        transcript_length: updatedTranscript.length,
      });
    }
  } catch (error: any) {
    console.error('Interview API Route Error:', error);
    return Response.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  return Response.json({
    name: 'ABTalks AI Interview Agent API Route',
    version: '1.0.0',
    breeth_memory_status: process.env.BREETH_API_KEY ? 'configured' : 'missing (using local fallback)',
    gemini_api_status: process.env.GEMINI_API_KEY ? 'configured' : 'missing',
    endpoints: {
      POST: '/api/interview - Submit answer or start session (action: "start" | "answer")',
    },
  });
}
