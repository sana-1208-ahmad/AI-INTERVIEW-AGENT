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
  previousHistory: QuestionAnswerRecord[],
  steerConstraint?: string
): Promise<{
  score: number; // 0 - 100
  evaluationLabel: 'Excellent' | 'Good Answer' | 'Partial Answer' | 'Needs Improvement';
  feedback: string;
  idealKeyPointsCovered: string[];
  idealKeyPointsMissed: string[];
  errorsIdentified: string[];
  penaltyApplied: boolean;
  followUpProbe?: string;
}> {
  const ai = getAiClient();

  if (ai) {
    try {
      const prompt = `You are a Senior AI Lead and Technical Interviewer conducting a multi-turn adaptive technical interview for candidate ${candidate.name}.
Your job is to evaluate the candidate's answer like a REAL, CONSTRUCTIVE, SENIOR HUMAN TECHNICAL INTERVIEWER.

Question Topic: Day ${question.day} - ${question.topic} (${question.module})
Question Text: "${question.questionText}"
Expected Key Points to cover:
${question.expectedKeyPoints.map((kp, idx) => `${idx + 1}. ${kp}`).join('\n')}

Candidate's Submitted Answer:
"${candidateAnswer}"

SENIOR INTERVIEWER EVALUATION DIRECTIVES:
1. HUMAN CONVERSATIONAL ACKNOWLEDGMENT:
   - Speak like a real senior technical interviewer.
   - If Correct: "That's correct. You clearly understand [concept]..."
   - If Partially Correct: "You're on the right track, but missing [missing concept]..."
   - If Incorrect or Short ("no", "I don't know", "not sure"): "That's not quite correct. You haven't demonstrated the core pattern yet. [Explain core correct behavior]. This is an area I'd recommend revising before proceeding."
2. DIRECT, CONSTRUCTIVE FEEDBACK:
   - Be constructive yet firm. Explain what was right, what was wrong, and the correct engineering behavior.
   - Do NOT use robotic system jargon like "Score Penalty Applied" or "Branching Algorithm" in the feedback text.
3. SCORING & TIER CLASSIFICATION:
   - 80 - 100%: "Excellent" or "Good Answer" (Candidate demonstrated strong understanding of core concepts)
   - 45 - 79%: "Partial Answer" (Candidate covered some key points but missed important aspects)
   - 0 - 44%: "Needs Improvement" (Candidate's answer was incorrect, incomplete, off-topic, or too short like "no")
4. EXPLICIT MISSING CONCEPTS & ERRORS:
   - "idealKeyPointsCovered": Key points covered well.
   - "idealKeyPointsMissed": Key points missed or stated incorrectly.
   - "errorsIdentified": Explicit list of technical inaccuracies or missing essential concepts.
${steerConstraint ? `5. ACTIVE JUDGE STEER CONSTRAINT INJECTED: "${steerConstraint}". Verify if candidate's response satisfies this constraint.` : ''}

Return JSON adhering strictly to this structure:
{
  "score": number between 0 and 100,
  "evaluationLabel": "Excellent" or "Good Answer" or "Partial Answer" or "Needs Improvement",
  "errorsIdentified": ["list of exact technical errors or false claims found"],
  "penaltyApplied": boolean (true if score capped under 45% due to errors/short answer, false otherwise),
  "feedback": "2-3 conversational, senior-interviewer sentences explaining what was correct, what was missing, and recommended revision action.",
  "idealKeyPointsCovered": ["list of expected key points covered well"],
  "idealKeyPointsMissed": ["list of expected key points missed or stated incorrectly"],
  "followUpProbe": "Natural follow-up statement or question probing the missing concept or building towards deeper application"
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
              errorsIdentified: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Explicit list of exact technical errors or false claims" },
              penaltyApplied: { type: Type.BOOLEAN, description: "True if penalty capped score under 40%" },
              feedback: { type: Type.STRING, description: "Direct, zero-sycophancy technical feedback" },
              idealKeyPointsCovered: { type: Type.ARRAY, items: { type: Type.STRING } },
              idealKeyPointsMissed: { type: Type.ARRAY, items: { type: Type.STRING } },
              followUpProbe: { type: Type.STRING, description: "Probing follow-up question" }
            },
            required: ["score", "evaluationLabel", "errorsIdentified", "penaltyApplied", "feedback", "idealKeyPointsCovered", "idealKeyPointsMissed"]
          }
        }
      });

      if (response.text) {
        const parsed = JSON.parse(response.text.trim());
        const rawErrors: string[] = Array.isArray(parsed.errorsIdentified) ? parsed.errorsIdentified : (Array.isArray(parsed.errors_identified) ? parsed.errors_identified : []);
        let penaltyApplied = Boolean(parsed.penaltyApplied || parsed.penalty_applied || rawErrors.length > 0 || (typeof parsed.score === 'number' && parsed.score < 40));
        let finalScore = typeof parsed.score === 'number' ? parsed.score : 70;

        if (rawErrors.length > 0 || penaltyApplied) {
          finalScore = Math.min(39, Math.max(0, finalScore));
          penaltyApplied = true;
        }

        const validLabel = (finalScore < 40)
          ? 'Needs Improvement'
          : (['Excellent', 'Good Answer', 'Partial Answer', 'Needs Improvement'].includes(parsed.evaluationLabel)
            ? parsed.evaluationLabel
            : (finalScore >= 85 ? 'Excellent' : finalScore >= 70 ? 'Good Answer' : 'Partial Answer'));

        return {
          score: finalScore,
          evaluationLabel: validLabel,
          feedback: parsed.feedback || (penaltyApplied
            ? `Technical penalty applied: Candidate answer contained incorrect statements regarding ${question.topic}.`
            : "Direct technical feedback provided."),
          idealKeyPointsCovered: parsed.idealKeyPointsCovered || [],
          idealKeyPointsMissed: parsed.idealKeyPointsMissed || question.expectedKeyPoints,
          errorsIdentified: rawErrors,
          penaltyApplied,
          followUpProbe: parsed.followUpProbe || undefined
        };
      }
    } catch (err) {
      console.log("[Evaluation Engine] Using local heuristic scoring engine with penalty guardrails.");
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
  const isShortOrOff = candidateAnswer.trim().length < 15 || matchedCount === 0;
  
  const errorsIdentified: string[] = isShortOrOff
    ? [`Candidate answer failed to provide correct technical details for ${question.topic}`, `Answer lacked essential required concepts (${missed.slice(0, 2).join(', ')})`]
    : [];
  
  const penaltyApplied = isShortOrOff || rawScore < 40;
  const finalScore = penaltyApplied ? Math.min(35, rawScore) : rawScore;

  let label: 'Excellent' | 'Good Answer' | 'Partial Answer' | 'Needs Improvement' = 'Needs Improvement';
  if (finalScore >= 85) label = 'Excellent';
  else if (finalScore >= 70) label = 'Good Answer';
  else if (finalScore >= 45) label = 'Partial Answer';

  return {
    score: finalScore,
    evaluationLabel: label,
    feedback: penaltyApplied
      ? `That's not quite correct. You haven't demonstrated the core pattern for ${question.topic} yet. In production, ${question.expectedKeyPoints[0] || question.topic} requires clear execution mechanics. I'd recommend revising this topic before moving forward.`
      : `Solid technical response addressing ${covered.length} expected key points for ${question.topic}.`,
    idealKeyPointsCovered: covered.length > 0 ? covered : [],
    idealKeyPointsMissed: missed,
    errorsIdentified,
    penaltyApplied,
    followUpProbe: penaltyApplied
      ? `Can you clarify the fundamental difference between ${question.expectedKeyPoints[0] || 'core concepts'} and standard approaches?`
      : undefined
  };
}

export async function generateNextAdaptiveQuestion(
  candidate: CandidateProfile,
  askedQuestionsHistory: QuestionAnswerRecord[],
  questionIndex: number,
  targetTotalQuestions: number = 8,
  steerConstraint?: string
): Promise<InterviewQuestion> {
  const askedDays = new Set(askedQuestionsHistory.map(q => q.day));
  const askedQuestionTexts = new Set(askedQuestionsHistory.map(q => q.questionText.toLowerCase()));

  // Minimum requirement: Cover at least 4 different curriculum days across 8 questions
  const requiredUniqueDaysCount = 4;
  const daysLeftToAsk = targetTotalQuestions - questionIndex;
  const daysStillNeeded = requiredUniqueDaysCount - askedDays.size;
  const forceNewDay = daysStillNeeded > 0 && daysLeftToAsk <= daysStillNeeded;

  let targetDayNum: number;
  let branchingDirective = "";
  let lastScore = 75;

  if (askedQuestionsHistory.length > 0) {
    const lastRecord = askedQuestionsHistory[askedQuestionsHistory.length - 1];
    lastScore = lastRecord.score;

    // Count how many consecutive turns have been spent on the same day
    let consecutiveSameDayCount = 0;
    for (let i = askedQuestionsHistory.length - 1; i >= 0; i--) {
      if (askedQuestionsHistory[i].day === lastRecord.day) {
        consecutiveSameDayCount++;
      } else {
        break;
      }
    }

    const isWeakOrPartial = lastRecord.score < 65 ||
      lastRecord.evaluationLabel === 'Needs Improvement' ||
      lastRecord.evaluationLabel === 'Partial Answer' ||
      (lastRecord.errorsIdentified && lastRecord.errorsIdentified.length > 0);

    // TOPIC CONTINUITY RULE:
    // If the candidate gave a weak/partial answer AND we haven't asked 3 times on this topic AND we don't need to force a new day for minimum curriculum coverage:
    // STAY ON THE SAME DAY!
    if (isWeakOrPartial && consecutiveSameDayCount < 3 && !forceNewDay) {
      targetDayNum = lastRecord.day;
      const missedConcepts = lastRecord.idealKeyPointsMissed && lastRecord.idealKeyPointsMissed.length > 0
        ? lastRecord.idealKeyPointsMissed.join(', ')
        : 'foundational mechanics';

      branchingDirective = `SAME TOPIC PROBING DIRECTIVE: The candidate gave an incomplete or incorrect answer on Day ${lastRecord.day} (${lastRecord.topic}) [Attempt ${consecutiveSameDayCount} of max 3]. Do NOT switch to a different curriculum day yet. STAY ON Day ${lastRecord.day} (${lastRecord.topic}). Ask a targeted, simpler foundational follow-up question specifically probing their missing concept (${missedConcepts}) or asking them to explain the basic mechanics of ${lastRecord.topic} before advancing.`;
    } else if (isWeakOrPartial && consecutiveSameDayCount >= 3) {
      // Failed 3 times on the same topic -> Mark knowledge gap and transition to a new day
      let candidateTargetDays = candidate.completedDays.filter(d => !askedDays.has(d));
      if (candidateTargetDays.length === 0 || forceNewDay) {
        const unvisitedGlobal = CURRICULUM_DATA.map(d => d.day).filter(d => !askedDays.has(d));
        candidateTargetDays = unvisitedGlobal.length > 0 ? unvisitedGlobal : CURRICULUM_DATA.map(d => d.day);
      }
      targetDayNum = candidateTargetDays[Math.floor(Math.random() * candidateTargetDays.length)];

      branchingDirective = `MAX ATTEMPTS TRANSITION DIRECTIVE: Candidate struggled with Day ${lastRecord.day} (${lastRecord.topic}) after ${consecutiveSameDayCount} attempts. Acknowledge that this topic will be flagged as a knowledge gap for revision, and smoothly transition to a new curriculum day (Day ${targetDayNum}).`;
    } else {
      // Strong answer or completed topic -> Advance to new curriculum day
      let candidateTargetDays = candidate.completedDays.filter(d => !askedDays.has(d));
      if (candidateTargetDays.length === 0 || forceNewDay) {
        const unvisitedGlobal = CURRICULUM_DATA.map(d => d.day).filter(d => !askedDays.has(d));
        candidateTargetDays = unvisitedGlobal.length > 0 ? unvisitedGlobal : CURRICULUM_DATA.map(d => d.day);
      }
      targetDayNum = candidateTargetDays[Math.floor(Math.random() * candidateTargetDays.length)];

      if (lastRecord.score >= 85) {
        branchingDirective = `HIGH MASTERY DIRECTIVE: Candidate scored ${lastRecord.score}% on Day ${lastRecord.day} (${lastRecord.topic}). Transition to Day ${targetDayNum} with an advanced, scenario-based question probing production constraints and engineering trade-offs.`;
      } else {
        branchingDirective = `STANDARD PROGRESSION DIRECTIVE: Transition to Day ${targetDayNum} with a balanced technical question examining core engineering mechanics and practical scenarios.`;
      }
    }
  } else {
    // Turn 1: Select initial question
    const candidateTargetDays = candidate.completedDays.length > 0 ? candidate.completedDays : [1, 5, 8, 12, 18, 20];
    targetDayNum = candidateTargetDays[Math.floor(Math.random() * candidateTargetDays.length)];
    branchingDirective = `INITIAL QUESTION DIRECTIVE: Welcome candidate ${candidate.name} and ask an opening technical question for Day ${targetDayNum}.`;
  }

  const curriculumObj = CURRICULUM_DATA.find(c => c.day === targetDayNum) || CURRICULUM_DATA[0];

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
${steerConstraint ? `\nACTIVE JUDGE STEER CONSTRAINT INJECTED: "${steerConstraint}". Frame this question to explicitly test the candidate's understanding and capability regarding this constraint.` : ''}

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
          difficulty: (lastScore < 50 ? 'Easy' : (['Easy', 'Medium', 'Hard'].includes(parsed.difficulty) ? parsed.difficulty : (lastScore > 80 ? 'Hard' : 'Medium'))) as any,
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

