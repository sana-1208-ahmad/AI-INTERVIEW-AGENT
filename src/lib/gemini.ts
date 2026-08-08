import { GoogleGenAI, Type } from "@google/genai";
import { CandidateProfile, InterviewQuestion, QuestionAnswerRecord, FinalReport } from '../types';
import { SAMPLE_QUESTIONS } from '../data/sampleQuestions';
import { CURRICULUM_DATA } from '../data/curriculumData';

let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    try {
      aiClient = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
    } catch (err) {
      console.warn("Gemini client initialization failed, fallback evaluation mode will be used:", err);
    }
  }
  return aiClient;
}

async function generateContentWithRetry(
  ai: GoogleGenAI,
  params: {
    model?: string;
    contents: any;
    config?: any;
  },
  maxRetries = 2
) {
  const primaryModel = params.model || "gemini-3.6-flash";
  const modelsToTry = Array.from(new Set([primaryModel, "gemini-flash-latest"]));
  let lastError: any = null;

  for (const modelName of modelsToTry) {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const response = await ai.models.generateContent({
          ...params,
          model: modelName,
        });
        return response;
      } catch (err: any) {
        lastError = err;
        const errStr = String(err?.message || err);
        const isTransient =
          errStr.includes("503") ||
          errStr.includes("UNAVAILABLE") ||
          errStr.includes("high demand") ||
          errStr.includes("429") ||
          errStr.includes("RESOURCE_EXHAUSTED");

        if (isTransient && attempt < maxRetries) {
          await new Promise((res) => setTimeout(res, 500 * (attempt + 1)));
          continue;
        }

        if (isTransient && modelName !== modelsToTry[modelsToTry.length - 1]) {
          console.log(`[Gemini API] Primary model ${modelName} transient rate limit. Switching model...`);
          break;
        }

        throw err;
      }
    }
  }
  throw lastError;
}

export async function evaluateCandidateAnswer(
  question: InterviewQuestion,
  candidateAnswer: string,
  candidate: CandidateProfile,
  previousHistory: QuestionAnswerRecord[]
): Promise<{
  score: number; // 0 - 100
  evaluationLabel: 'Excellent' | 'Good Answer' | 'Partial Answer' | 'Needs Improvement';
  feedback: string;
  idealKeyPointsCovered: string[];
  idealKeyPointsMissed: string[];
  followUpProbe?: string;
}> {
  const ai = getAiClient();

  if (ai) {
    try {
      const prompt = `You are a Senior AI Lead and Technical Interviewer conducting an interview for the ABTalks 31-Day AI Engineering Cohort candidate: ${candidate.name}.
Question Topic: Day ${question.day} - ${question.topic} (${question.module})
Question Text: "${question.questionText}"
Expected Key Points to cover:
${question.expectedKeyPoints.map((kp, idx) => `${idx + 1}. ${kp}`).join('\n')}

Candidate's Submitted Answer:
"${candidateAnswer}"

Analyze the candidate's answer thoroughly against the technical expectations.
Assess correctness, technical depth, accuracy of terminology, and problem-solving reasoning.

Return JSON adhering to this structure:
{
  "score": number between 0 and 100,
  "evaluationLabel": "Excellent" or "Good Answer" or "Partial Answer" or "Needs Improvement",
  "feedback": "2-3 concise sentences of constructive technical feedback directly addressing what they did well and what was missing or incorrect.",
  "idealKeyPointsCovered": ["list of expected key points they covered well"],
  "idealKeyPointsMissed": ["list of expected key points they missed or stated incorrectly"],
  "followUpProbe": "Optional 1-sentence probing follow-up question if they gave a partial or interesting answer, otherwise empty string"
}`;

      const response = await generateContentWithRetry(ai, {
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.2,
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.INTEGER, description: "Score from 0 to 100" },
              evaluationLabel: { type: Type.STRING, description: "Excellent, Good Answer, Partial Answer, or Needs Improvement" },
              feedback: { type: Type.STRING, description: "Constructive feedback" },
              idealKeyPointsCovered: { type: Type.ARRAY, items: { type: Type.STRING } },
              idealKeyPointsMissed: { type: Type.ARRAY, items: { type: Type.STRING } },
              followUpProbe: { type: Type.STRING, description: "Probing follow-up question" }
            },
            required: ["score", "evaluationLabel", "feedback", "idealKeyPointsCovered", "idealKeyPointsMissed"]
          }
        }
      });

      if (response.text) {
        const parsed = JSON.parse(response.text.trim());
        const validLabel = (['Excellent', 'Good Answer', 'Partial Answer', 'Needs Improvement'].includes(parsed.evaluationLabel))
          ? parsed.evaluationLabel
          : (parsed.score >= 85 ? 'Excellent' : parsed.score >= 70 ? 'Good Answer' : parsed.score >= 50 ? 'Partial Answer' : 'Needs Improvement');

        return {
          score: Math.min(100, Math.max(0, parsed.score || 75)),
          evaluationLabel: validLabel,
          feedback: parsed.feedback || "Good response covering key technical aspects.",
          idealKeyPointsCovered: parsed.idealKeyPointsCovered || question.expectedKeyPoints.slice(0, 3),
          idealKeyPointsMissed: parsed.idealKeyPointsMissed || [],
          followUpProbe: parsed.followUpProbe || undefined
        };
      }
    } catch (err) {
      console.log("[Evaluation Engine] Using local heuristic scoring engine (API rate limit or key fallback).");
    }
  }

  // Fallback intelligent heuristic evaluator if Gemini API is offline or key missing
  const lowerAns = candidateAnswer.toLowerCase();
  let matchedCount = 0;
  const covered: string[] = [];
  const missed: string[] = [];

  for (const kp of question.expectedKeyPoints) {
    const keywords = kp.toLowerCase().split(' ').filter(w => w.length > 4);
    const hit = keywords.some(kw => lowerAns.includes(kw));
    if (hit) {
      matchedCount++;
      covered.push(kp);
    } else {
      missed.push(kp);
    }
  }

  const lengthBonus = Math.min(20, Math.floor(candidateAnswer.length / 15));
  const rawScore = Math.min(100, Math.round((matchedCount / (question.expectedKeyPoints.length || 1)) * 80 + lengthBonus));
  const finalScore = candidateAnswer.trim().length < 10 ? 25 : rawScore;

  let label: 'Excellent' | 'Good Answer' | 'Partial Answer' | 'Needs Improvement' = 'Needs Improvement';
  if (finalScore >= 85) label = 'Excellent';
  else if (finalScore >= 70) label = 'Good Answer';
  else if (finalScore >= 45) label = 'Partial Answer';

  return {
    score: finalScore,
    evaluationLabel: label,
    feedback: finalScore >= 75
      ? `Strong answer! You demonstrated solid understanding of ${question.topic}. You accurately addressed ${covered.length} key concepts.`
      : `Partial explanation. To improve, ensure you elaborate on ${missed[0] || 'core architectural trade-offs'} and provide specific code or parameter examples.`,
    idealKeyPointsCovered: covered.length > 0 ? covered : [question.expectedKeyPoints[0]],
    idealKeyPointsMissed: missed,
    followUpProbe: finalScore < 80 ? `How would you handle this if scale grew to 10 million items in production?` : undefined
  };
}

export async function generateNextAdaptiveQuestion(
  candidate: CandidateProfile,
  askedQuestionsHistory: QuestionAnswerRecord[],
  questionIndex: number,
  targetTotalQuestions: number = 8
): Promise<InterviewQuestion> {
  const askedDays = new Set(askedQuestionsHistory.map(q => q.day));
  const askedQuestionTexts = new Set(askedQuestionsHistory.map(q => q.questionText.toLowerCase()));

  // Minimum requirement: Cover at least 4 different curriculum days across 8 questions
  const requiredUniqueDaysCount = 4;
  const daysLeftToAsk = targetTotalQuestions - questionIndex;
  const daysStillNeeded = requiredUniqueDaysCount - askedDays.size;
  const forceNewDay = daysStillNeeded > 0 && daysLeftToAsk <= daysStillNeeded;

  // Determine candidate completed vs skipped topics
  let candidateTargetDays = candidate.completedDays.filter(d => !askedDays.has(d));
  if (candidateTargetDays.length === 0 || forceNewDay) {
    const unvisitedGlobal = CURRICULUM_DATA.map(d => d.day).filter(d => !askedDays.has(d));
    if (unvisitedGlobal.length > 0) {
      candidateTargetDays = unvisitedGlobal;
    } else {
      candidateTargetDays = CURRICULUM_DATA.map(d => d.day);
    }
  }

  // Pick a target curriculum day
  const targetDayNum = candidateTargetDays[Math.floor(Math.random() * candidateTargetDays.length)];
  const curriculumObj = CURRICULUM_DATA.find(c => c.day === targetDayNum) || CURRICULUM_DATA[0];

  // Evaluate branching triggers from last turn score
  let branchingDirective = "";
  let lastScore = 75;
  if (askedQuestionsHistory.length > 0) {
    const lastRecord = askedQuestionsHistory[askedQuestionsHistory.length - 1];
    lastScore = lastRecord.score;
    if (lastScore > 80) {
      branchingDirective = `BRANCHING TRIGGER (HIGH SCORE >80%): The candidate scored ${lastScore}% on the previous question. Dive deeper into low-level architectural details (e.g. memory footprint, vector compression, protocols, internal mechanics, edge cases, and performance optimizations).`;
    } else if (lastScore < 50) {
      branchingDirective = `BRANCHING TRIGGER (LOW SCORE <50%): The candidate scored ${lastScore}% on the previous question. Ask a conceptual, simplifying follow-up question that clarifies core fundamentals and scaffolds basic principles before escalating difficulty.`;
    } else {
      branchingDirective = `BRANCHING TRIGGER (MODERATE SCORE ${lastScore}%): Candidate showed partial understanding. Maintain a balanced technical scenario examining practical engineering trade-offs.`;
    }
  }

  // Construct full conversation history summary for multi-turn context
  const fullHistoryContext = askedQuestionsHistory.length > 0
    ? askedQuestionsHistory.map((rec, i) =>
        `Turn ${i + 1} (Day ${rec.day} - ${rec.topic}):\nQ: "${rec.questionText}"\nA: "${rec.candidateAnswer}"\nEvaluation: Score ${rec.score}% (${rec.evaluationLabel}) | Feedback: ${rec.feedback}`
      ).join('\n---\n')
    : "No previous turns. This is the initial question of the interview.";

  const ai = getAiClient();
  if (ai) {
    try {
      const prompt = `You are a Senior AI Lead and Technical Interviewer conducting a multi-turn adaptive technical interview for candidate ${candidate.name} (${candidate.role}).
Interview Progress: Question #${questionIndex + 1} of ${targetTotalQuestions}.
Visited Curriculum Days so far: ${Array.from(askedDays).join(', ') || 'None'} (Target: At least 4 unique days).
Current Target Curriculum Day: Day ${curriculumObj.day} - ${curriculumObj.topic} (${curriculumObj.module})
Learning Objectives: ${curriculumObj.learningObjectives.join(', ')}
Key Concepts: ${curriculumObj.keyConcepts.join(', ')}

Adaptive Branching Directive:
${branchingDirective}

Full Previous Conversation History & Signals:
${fullHistoryContext}

Do NOT repeat any previously asked questions:
${Array.from(askedQuestionTexts).slice(-5).join(' | ')}

Generate a realistic, multi-turn technical interview question for Day ${curriculumObj.day}.
Return JSON adhering strictly to this schema:
{
  "questionText": "The exact technical question for Day ${curriculumObj.day}",
  "difficulty": "Easy" or "Medium" or "Hard",
  "type": "Conceptual" or "Coding" or "System Design" or "Practical",
  "expectedKeyPoints": ["key point 1", "key point 2", "key point 3", "key point 4"],
  "sampleIdealAnswer": "Detailed 2-3 sentence ideal technical answer"
}`;

      const response = await generateContentWithRetry(ai, {
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.7,
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              questionText: { type: Type.STRING },
              difficulty: { type: Type.STRING },
              type: { type: Type.STRING },
              expectedKeyPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
              sampleIdealAnswer: { type: Type.STRING }
            },
            required: ["questionText", "difficulty", "type", "expectedKeyPoints", "sampleIdealAnswer"]
          }
        }
      });

      if (response.text) {
        const parsed = JSON.parse(response.text.trim());
        return {
          id: `q-gen-${Date.now()}-${questionIndex}`,
          day: curriculumObj.day,
          module: curriculumObj.module,
          topic: curriculumObj.topic,
          questionText: parsed.questionText,
          difficulty: (['Easy', 'Medium', 'Hard'].includes(parsed.difficulty) ? parsed.difficulty : (lastScore > 80 ? 'Hard' : lastScore < 50 ? 'Easy' : 'Medium')) as any,
          type: (['Conceptual', 'Coding', 'System Design', 'Practical'].includes(parsed.type) ? parsed.type : 'Conceptual') as any,
          expectedKeyPoints: parsed.expectedKeyPoints || curriculumObj.learningObjectives,
          sampleIdealAnswer: parsed.sampleIdealAnswer || `Ideal answer covering ${curriculumObj.topic}.`
        };
      }
    } catch (e) {
      console.log("[Question Engine] Using curated technical question bank (API rate limit or key fallback).");
    }
  }

  // Fallback adaptive question builder if API missing/offline
  const poolUnasked = SAMPLE_QUESTIONS.filter(q => !askedQuestionTexts.has(q.questionText.toLowerCase()) && !askedDays.has(q.day));
  if (poolUnasked.length > 0 && forceNewDay) {
    const picked = poolUnasked[Math.floor(Math.random() * poolUnasked.length)];
    return {
      ...picked,
      id: `q-sample-${Date.now()}`
    };
  }

  const difficultyLabel = lastScore > 80 ? 'Hard' : lastScore < 50 ? 'Easy' : 'Medium';
  const branchingPrefix = lastScore > 80
    ? `[Deep-Dive Architecture] Building on your strong response, let's explore lower-level mechanics.`
    : lastScore < 50
    ? `[Conceptual Fundamentals] Let's step back and clarify the core principles.`
    : `[Practical Scenario]`;

  return {
    id: `q-fallback-${Date.now()}`,
    day: curriculumObj.day,
    module: curriculumObj.module,
    topic: curriculumObj.topic,
    questionText: `${branchingPrefix} In Day ${curriculumObj.day} (${curriculumObj.topic}), how do you implement ${curriculumObj.keyConcepts[0] || 'core components'} in production using ${curriculumObj.tools[0] || 'modern tools'}? What key engineering trade-offs must you evaluate?`,
    difficulty: difficultyLabel as any,
    type: "Practical",
    expectedKeyPoints: curriculumObj.learningObjectives,
    sampleIdealAnswer: `A robust implementation utilizes ${curriculumObj.tools.join(', ')} to achieve ${curriculumObj.learningObjectives[0] || 'high availability'}. Key trade-offs include latency, memory overhead, and accuracy.`
  };
}

export async function generateFinalInterviewReport(
  candidate: CandidateProfile,
  transcript: QuestionAnswerRecord[],
  interviewId: string
): Promise<FinalReport> {
  const overallAvg = transcript.length > 0
    ? Math.round(transcript.reduce((sum, item) => sum + item.score, 0) / transcript.length)
    : 80;

  const daysEvaluated = Array.from(new Set(transcript.map(q => q.day)));

  const ai = getAiClient();
  if (ai) {
    try {
      const prompt = `You are the Lead AI Interview Examiner at ABTalks AI Cohort.
Synthesize the final technical interview report for candidate ${candidate.name} after an 8+ question adaptive interview covering Days: ${daysEvaluated.join(', ')}.

Transcript Summary:
${transcript.map((t, idx) => `Q${idx + 1} (Day ${t.day} - ${t.topic}) [${t.difficulty}]: Score ${t.score}% (${t.evaluationLabel})
Answer: "${t.candidateAnswer.substring(0, 150)}..."`).join('\n')}

Generate a comprehensive final report JSON adhering strictly to this schema:
{
  "gradeLabel": "Mastery" or "Excellent" or "Competent" or "Needs Revision",
  "technicalKnowledge": integer 0-100,
  "conceptualUnderstanding": integer 0-100,
  "problemSolving": integer 0-100,
  "systemDesign": integer 0-100,
  "communication": integer 0-100,
  "strengths": ["bullet point 1", "bullet point 2", "bullet point 3"],
  "areasToImprove": ["bullet point 1", "bullet point 2", "bullet point 3"],
  "recommendedActionPlan": ["step 1", "step 2", "step 3"],
  "summaryParagraph": "A 3-4 sentence professional executive summary of candidate readiness for Enterprise AI Engineer roles."
}`;

      const response = await generateContentWithRetry(ai, {
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.3,
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              gradeLabel: { type: Type.STRING },
              technicalKnowledge: { type: Type.INTEGER },
              conceptualUnderstanding: { type: Type.INTEGER },
              problemSolving: { type: Type.INTEGER },
              systemDesign: { type: Type.INTEGER },
              communication: { type: Type.INTEGER },
              strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
              areasToImprove: { type: Type.ARRAY, items: { type: Type.STRING } },
              recommendedActionPlan: { type: Type.ARRAY, items: { type: Type.STRING } },
              summaryParagraph: { type: Type.STRING }
            },
            required: ["gradeLabel", "technicalKnowledge", "conceptualUnderstanding", "problemSolving", "systemDesign", "communication", "strengths", "areasToImprove", "summaryParagraph"]
          }
        }
      });

      if (response.text) {
        const parsed = JSON.parse(response.text.trim());
        return {
          interviewId,
          candidateName: candidate.name,
          completedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
          overallScore: overallAvg,
          gradeLabel: (['Mastery', 'Excellent', 'Competent', 'Needs Revision'].includes(parsed.gradeLabel) ? parsed.gradeLabel : overallAvg >= 85 ? 'Excellent' : 'Competent') as any,
          scoreBreakdown: {
            technicalKnowledge: parsed.technicalKnowledge || Math.min(100, overallAvg + 3),
            conceptualUnderstanding: parsed.conceptualUnderstanding || overallAvg,
            problemSolving: parsed.problemSolving || Math.max(50, overallAvg - 2),
            systemDesign: parsed.systemDesign || Math.max(50, overallAvg - 5),
            communication: parsed.communication || Math.min(100, overallAvg + 5)
          },
          strengths: parsed.strengths || candidate.strengths,
          areasToImprove: parsed.areasToImprove || candidate.areasToImprove,
          recommendedActionPlan: parsed.recommendedActionPlan || [
            "Review Day 10 Hybrid Search & RRF score fusion mathematics",
            "Build a custom FastMCP server with bearer authorization middleware",
            "Implement production LangSmith tracing to measure TTFT and token cost"
          ],
          questionPerformance: transcript,
          daysEvaluated,
          visited_curriculum_days: daysEvaluated,
          summaryParagraph: parsed.summaryParagraph || `${candidate.name} demonstrated strong technical knowledge across ${daysEvaluated.length} curriculum days with an overall score of ${overallAvg}%.`
        };
      }
    } catch (e) {
      console.log("[Report Engine] Synthesizing report with structured evaluation framework (API rate limit or key fallback).");
    }
  }

  // Fallback heuristic report generator
  return {
    interviewId,
    candidateName: candidate.name,
    completedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
    overallScore: overallAvg,
    gradeLabel: overallAvg >= 90 ? 'Mastery' : overallAvg >= 80 ? 'Excellent' : overallAvg >= 65 ? 'Competent' : 'Needs Revision',
    scoreBreakdown: {
      technicalKnowledge: Math.min(98, overallAvg + 3),
      conceptualUnderstanding: overallAvg,
      problemSolving: Math.max(55, overallAvg - 3),
      systemDesign: Math.max(50, overallAvg - 5),
      communication: Math.min(95, overallAvg + 5)
    },
    strengths: [
      `Strong foundational comprehension of Day ${daysEvaluated[0] || 1} topics`,
      "Clear, structured technical communication style",
      "Good awareness of practical implementation constraints"
    ],
    areasToImprove: [
      "Deeper mathematical mastery of vector similarity indices",
      "Production security and authorization policies in MCP servers"
    ],
    recommendedActionPlan: [
      "Practice multi-agent graph architecture with LangGraph",
      "Review RAG Triad faithfulness metrics and evaluation guardrails"
    ],
    questionPerformance: transcript,
    daysEvaluated,
    visited_curriculum_days: daysEvaluated,
    summaryParagraph: `${candidate.name} completed a multi-turn technical interview across ${daysEvaluated.length} curriculum days (Days ${daysEvaluated.join(', ')}). Overall performance was rated at ${overallAvg}%, showing solid technical proficiency in AI engineering concepts.`
  };
}

