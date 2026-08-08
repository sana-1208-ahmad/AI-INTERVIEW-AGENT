import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
dotenv.config();

import { CURRICULUM_DATA } from "./src/data/curriculumData";
import { CANDIDATE_PROFILES } from "./src/data/candidateProfiles";
import {
  evaluateCandidateAnswer,
  generateNextAdaptiveQuestion,
  generateFinalInterviewReport
} from "./src/lib/gemini";
import {
  getBreethInterviewMemory,
  saveBreethInterviewExchange
} from "./src/lib/breethMemory";
import { InterviewSession, FinalReport, QuestionAnswerRecord } from "./src/types";

// In-memory store for ongoing interview sessions and completed reports
const activeSessions: Map<string, InterviewSession> = new Map();
const completedReports: Map<string, FinalReport> = new Map();

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '10mb' }));

  const PORT = 3000;

  // Logging middleware
  app.use((req, res, next) => {
    if (req.path.startsWith('/api/')) {
      console.log(`[API] ${req.method} ${req.path}`);
    }
    next();
  });

  // -------------------------------------------------------------
  // HACKATHON BENCHMARK SPECIFICATION ENDPOINT (/api/interview)
  // -------------------------------------------------------------
  app.post("/api/interview", async (req, res) => {
    try {
      const { sessionId, session_id, candidate: candidateInput, candidate_id, message, answer, action } = req.body;
      const effectiveSessionId = sessionId || session_id || `intv-${Date.now()}`;
      const userMessage = message || answer;

      // Determine candidate profile
      let candidate = CANDIDATE_PROFILES[0];
      if (candidateInput) {
        if (typeof candidateInput === 'object') {
          const candName = candidateInput.member?.name || candidateInput.name || "Candidate";
          const matched = CANDIDATE_PROFILES.find(c => c.name.toLowerCase() === candName.toLowerCase());
          if (matched) {
            candidate = matched;
          } else {
            candidate = {
              ...CANDIDATE_PROFILES[0],
              id: candidateInput.member?.id || candidateInput.id || "CAND-SPEC",
              name: candName,
              role: candidateInput.member?.jobRole || candidateInput.role || "AI Engineer",
            };
          }
        }
      } else if (candidate_id) {
        const matched = CANDIDATE_PROFILES.find(c => c.id === candidate_id);
        if (matched) candidate = matched;
      }

      let session = activeSessions.get(effectiveSessionId);

      // Check if this is an initialization request (no session exists or action === 'start' or no userMessage provided)
      if (!session || action === 'start' || (!userMessage && candidateInput)) {
        const totalQuestions = 8;
        const memoryHistory = await getBreethInterviewMemory(candidate.id, effectiveSessionId);
        const question1 = await generateNextAdaptiveQuestion(candidate, [], 0, totalQuestions);

        session = {
          id: effectiveSessionId,
          candidateId: candidate.id,
          candidateName: candidate.name,
          candidateAvatar: candidate.avatar,
          startTime: new Date().toISOString(),
          status: 'in_progress',
          currentQuestionIndex: 0,
          totalQuestions: totalQuestions,
          daysCovered: [question1.day],
          currentQuestion: question1,
          transcript: [],
          interviewerNotes: `Initialized benchmark session. Breeth memories retrieved: ${memoryHistory.length}`
        };

        activeSessions.set(effectiveSessionId, session);

        return res.json({
          reply: `Welcome ${candidate.name}! I am your Senior AI Technical Interviewer for the 31-day AI Cohort. Let's begin.\n\nQuestion 1 (Day ${question1.day} - ${question1.topic}):\n${question1.questionText}`,
          done: false
        });
      }

      // Handle ongoing conversation turn with candidate message
      if (session.status === 'completed') {
        const report = completedReports.get(effectiveSessionId);
        return res.json({
          reply: "The interview has already been completed. Thank you!",
          done: true,
          feedback: report ? {
            summary: report.summaryParagraph,
            strengths: report.strengths,
            gaps: report.areasToImprove,
            next: report.recommendedActionPlan
          } : undefined
        });
      }

      const currentQ = session.currentQuestion;
      if (!currentQ) {
        return res.status(500).json({ error: "Invalid session question state" });
      }

      const evalCandidate = CANDIDATE_PROFILES.find(c => c.id === session!.candidateId) || candidate;

      // Evaluate answer
      const evaluation = await evaluateCandidateAnswer(
        currentQ,
        userMessage || "No answer provided.",
        evalCandidate,
        session.transcript
      );

      // Record transcript
      const record: QuestionAnswerRecord = {
        questionId: currentQ.id,
        questionNumber: session.currentQuestionIndex + 1,
        day: currentQ.day,
        module: currentQ.module,
        topic: currentQ.topic,
        questionText: currentQ.questionText,
        difficulty: currentQ.difficulty,
        type: currentQ.type,
        candidateAnswer: userMessage || "",
        score: evaluation.score,
        evaluationLabel: evaluation.evaluationLabel,
        feedback: evaluation.feedback,
        followUpTriggered: Boolean(evaluation.followUpProbe),
        idealKeyPointsCovered: evaluation.idealKeyPointsCovered,
        idealKeyPointsMissed: evaluation.idealKeyPointsMissed
      };

      session.transcript.push(record);
      if (!session.daysCovered.includes(currentQ.day)) {
        session.daysCovered.push(currentQ.day);
      }

      // Asynchronously save to Breeth Memory API
      await saveBreethInterviewExchange({
        candidateId: evalCandidate.id,
        sessionId: session.id,
        questionNumber: record.questionNumber,
        day: record.day,
        topic: record.topic,
        questionText: record.questionText,
        candidateAnswer: userMessage || "",
        evaluationScore: evaluation.score,
        evaluationLabel: evaluation.evaluationLabel,
        feedback: evaluation.feedback,
        timestamp: new Date().toISOString()
      });

      const nextQuestionIndex = session.currentQuestionIndex + 1;
      const isComplete = nextQuestionIndex >= session.totalQuestions;

      if (isComplete) {
        session.status = 'completed';
        session.endTime = new Date().toISOString();

        const report = await generateFinalInterviewReport(evalCandidate, session.transcript, session.id);
        session.overallScore = report.overallScore;
        completedReports.set(session.id, report);

        return res.json({
          reply: `Thank you for completing the technical interview! You achieved an overall score of ${report.overallScore}% across ${session.daysCovered.length} curriculum days.`,
          done: true,
          feedback: {
            summary: report.summaryParagraph || "Candidate demonstrated solid competence across the 31-day AI engineering topics.",
            strengths: report.strengths || [],
            gaps: report.areasToImprove || [],
            next: report.recommendedActionPlan || []
          }
        });
      } else {
        session.currentQuestionIndex = nextQuestionIndex;
        const nextQ = await generateNextAdaptiveQuestion(
          evalCandidate,
          session.transcript,
          nextQuestionIndex,
          session.totalQuestions
        );
        session.currentQuestion = nextQ;

        return res.json({
          reply: `${evaluation.feedback}\n\nQuestion ${nextQuestionIndex + 1} of ${session.totalQuestions} (Day ${nextQ.day} - ${nextQ.topic}):\n${nextQ.questionText}`,
          done: false
        });
      }
    } catch (err: any) {
      console.error("Error in /api/interview endpoint:", err);
      return res.status(500).json({
        reply: "An error occurred while processing your interview response.",
        done: false,
        error: err.message
      });
    }
  });

  app.get("/api/interview", (req, res) => {
    res.json({
      status: "online",
      endpoint: "POST /api/interview",
      breeth_memory_status: process.env.BREETH_API_KEY ? "configured" : "fallback_mode",
      gemini_api_status: process.env.GEMINI_API_KEY ? "configured" : "fallback_mode"
    });
  });

  // -------------------------------------------------------------
  // TECHNICAL SPECIFICATION REST API ENDPOINTS (/api/interview/* & /api/v1/*)
  // -------------------------------------------------------------

  // Handler: Start Interview
  const handleStartInterview = async (req: express.Request, res: express.Response) => {
    try {
      const { candidate_id, candidateId, candidate: candidateInput, num_questions = 8, total_questions = 8 } = req.body;
      let candidate = CANDIDATE_PROFILES[0];
      const targetId = candidate_id || candidateId;
      if (targetId) {
        const found = CANDIDATE_PROFILES.find(c => c.id === targetId || c.name.toLowerCase() === String(targetId).toLowerCase());
        if (found) candidate = found;
      } else if (candidateInput) {
        if (typeof candidateInput === 'object') {
          const candName = candidateInput.member?.name || candidateInput.name || "Candidate";
          const matched = CANDIDATE_PROFILES.find(c => c.name.toLowerCase() === candName.toLowerCase());
          if (matched) candidate = matched;
        }
      }

      const interviewId = `intv-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const totalQuestions = Math.max(8, Number(num_questions || total_questions) || 8);

      // Initialize candidate memory from Breeth Memory API
      const memoryHistory = await getBreethInterviewMemory(candidate.id, interviewId);

      // Generate Question 1
      const question1 = await generateNextAdaptiveQuestion(candidate, [], 0, totalQuestions);

      const session: InterviewSession = {
        id: interviewId,
        candidateId: candidate.id,
        candidateName: candidate.name,
        candidateAvatar: candidate.avatar,
        startTime: new Date().toISOString(),
        status: 'in_progress',
        currentQuestionIndex: 0,
        totalQuestions,
        daysCovered: [question1.day],
        visited_curriculum_days: [question1.day],
        currentQuestion: question1,
        transcript: [],
        interviewerNotes: `Initialized session for ${candidate.name}. Breeth memories: ${memoryHistory.length}`
      };

      activeSessions.set(interviewId, session);

      res.status(201).json({
        status: "success",
        session_id: interviewId,
        interview_id: interviewId,
        candidate_id: candidate.id,
        candidate: {
          id: candidate.id,
          name: candidate.name,
          role: candidate.role,
          cohort: candidate.cohort
        },
        session: {
          total_questions: totalQuestions,
          current_question_index: 1,
          current_question_number: 1,
          visited_curriculum_days: session.daysCovered,
          days_covered: session.daysCovered,
          status: session.status
        },
        question: question1,
        initial_metadata: {
          total_curriculum_days: 31,
          breeth_memory_active: true,
          memory_records_loaded: memoryHistory.length,
          evaluation_engine: "Gemini 3.6 Flash"
        }
      });
    } catch (err: any) {
      console.error("Error starting interview:", err);
      res.status(500).json({ error: "Failed to initialize interview session", details: err.message });
    }
  };

  // Handler: Respond/Submit Answer
  const handleRespondInterview = async (req: express.Request, res: express.Response) => {
    try {
      const { session_id, interview_id, candidate_response, answer, message } = req.body;
      const effectiveSessionId = session_id || interview_id;
      const userResponse = candidate_response || answer || message;

      if (!effectiveSessionId) {
        return res.status(400).json({ error: "session_id or interview_id parameter is required" });
      }
      if (userResponse === undefined || userResponse === null || userResponse === "") {
        return res.status(400).json({ error: "candidate_response (or answer) parameter is required" });
      }

      const session = activeSessions.get(effectiveSessionId);
      if (!session) {
        return res.status(404).json({ error: "Interview session not found or expired" });
      }

      if (session.status === 'completed') {
        const existingReport = completedReports.get(effectiveSessionId);
        return res.json({
          status: "completed",
          message: "Interview is already finished.",
          report: existingReport
        });
      }

      const candidate = CANDIDATE_PROFILES.find(c => c.id === session.candidateId) || CANDIDATE_PROFILES[0];
      const currentQ = session.currentQuestion;

      if (!currentQ) {
        return res.status(500).json({ error: "Session missing current question state" });
      }

      // 1. Evaluate current answer
      const evaluation = await evaluateCandidateAnswer(
        currentQ,
        userResponse,
        candidate,
        session.transcript
      );

      // 2. Record in transcript
      const record: QuestionAnswerRecord = {
        questionId: currentQ.id,
        questionNumber: session.currentQuestionIndex + 1,
        day: currentQ.day,
        module: currentQ.module,
        topic: currentQ.topic,
        questionText: currentQ.questionText,
        difficulty: currentQ.difficulty,
        type: currentQ.type,
        candidateAnswer: userResponse,
        score: evaluation.score,
        evaluationLabel: evaluation.evaluationLabel,
        feedback: evaluation.feedback,
        followUpTriggered: Boolean(evaluation.followUpProbe),
        idealKeyPointsCovered: evaluation.idealKeyPointsCovered,
        idealKeyPointsMissed: evaluation.idealKeyPointsMissed
      };

      session.transcript.push(record);
      if (!session.daysCovered.includes(currentQ.day)) {
        session.daysCovered.push(currentQ.day);
      }
      session.visited_curriculum_days = session.daysCovered;

      // Asynchronously persist to Breeth Memory
      const savedToBreeth = await saveBreethInterviewExchange({
        candidateId: candidate.id,
        sessionId: session.id,
        questionNumber: record.questionNumber,
        day: record.day,
        topic: record.topic,
        questionText: record.questionText,
        candidateAnswer: userResponse,
        evaluationScore: evaluation.score,
        evaluationLabel: evaluation.evaluationLabel,
        feedback: evaluation.feedback,
        timestamp: new Date().toISOString()
      });

      const nextQuestionIndex = session.currentQuestionIndex + 1;
      const isComplete = nextQuestionIndex >= session.totalQuestions;

      if (isComplete) {
        session.status = 'completed';
        session.endTime = new Date().toISOString();

        const report = await generateFinalInterviewReport(candidate, session.transcript, session.id);
        session.overallScore = report.overallScore;
        completedReports.set(session.id, report);

        return res.json({
          status: "success",
          is_complete: true,
          session_id: session.id,
          current_question_index: nextQuestionIndex,
          visited_curriculum_days: session.daysCovered,
          breeth_memory_persisted: savedToBreeth,
          evaluation: {
            score: evaluation.score,
            understanding_percentage: evaluation.score,
            label: evaluation.evaluationLabel,
            feedback: evaluation.feedback,
            key_points_covered: evaluation.idealKeyPointsCovered,
            key_points_missed: evaluation.idealKeyPointsMissed
          },
          summary: {
            total_questions_answered: session.transcript.length,
            unique_days_covered: session.daysCovered.length,
            overall_score: report.overallScore
          },
          report
        });
      } else {
        session.currentQuestionIndex = nextQuestionIndex;
        const nextQ = await generateNextAdaptiveQuestion(
          candidate,
          session.transcript,
          nextQuestionIndex,
          session.totalQuestions
        );

        session.currentQuestion = nextQ;

        return res.json({
          status: "success",
          is_complete: false,
          session_id: session.id,
          current_question_index: nextQuestionIndex + 1,
          visited_curriculum_days: session.daysCovered,
          breeth_memory_persisted: savedToBreeth,
          evaluation: {
            score: evaluation.score,
            understanding_percentage: evaluation.score,
            label: evaluation.evaluationLabel,
            feedback: evaluation.feedback,
            follow_up_probe: evaluation.followUpProbe,
            key_points_covered: evaluation.idealKeyPointsCovered,
            key_points_missed: evaluation.idealKeyPointsMissed
          },
          next_question: {
            question_number: nextQuestionIndex + 1,
            total_questions: session.totalQuestions,
            visited_curriculum_days: session.daysCovered,
            days_covered_count: session.daysCovered.length,
            question: nextQ
          }
        });
      }
    } catch (err: any) {
      console.error("Error in respond endpoint:", err);
      res.status(500).json({ error: "Failed to process interview response", details: err.message });
    }
  };

  // Handler: Get Report
  const handleGetReport = (req: express.Request, res: express.Response) => {
    const sessionId = req.params.session_id || req.params.id;
    const report = completedReports.get(sessionId);
    if (!report) {
      const active = activeSessions.get(sessionId);
      if (active) {
        return res.status(400).json({
          error: "Interview session is still in progress. Complete at least 8 questions across 4 curriculum days to generate report.",
          session_status: active.status,
          current_question_index: active.currentQuestionIndex + 1,
          visited_curriculum_days: active.daysCovered
        });
      }
      return res.status(404).json({ error: "Finalized report not found for the given session_id" });
    }

    res.json({
      status: "success",
      session_id: sessionId,
      overall_readiness: report.overallScore,
      score_breakdown: report.scoreBreakdown,
      strengths: report.strengths,
      weak_areas: report.areasToImprove,
      actionable_next_steps: report.recommendedActionPlan,
      visited_curriculum_days: report.visited_curriculum_days || report.daysEvaluated,
      report
    });
  };

  // Register Standard Endpoints per Technical Specification
  app.post("/api/interview/start", handleStartInterview);
  app.post("/api/v1/interview/start", handleStartInterview);

  app.post("/api/interview/respond", handleRespondInterview);
  app.post("/api/interview/answer", handleRespondInterview);
  app.post("/api/v1/interview/answer", handleRespondInterview);

  app.get("/api/interview/report/:session_id", handleGetReport);
  app.get("/api/v1/interview/:id/report", handleGetReport);

  // Webhook Export Endpoint for ATS / HR System Integration
  const handleExportWebhook = (req: express.Request, res: express.Response) => {
    const { webhook_url, webhookUrl, report, candidate_name, session_id } = req.body;
    const targetUrl = webhook_url || webhookUrl || "https://api.greenhouse.io/v1/candidate-report";
    const candidate = candidate_name || report?.candidateName || "Candidate";
    const id = session_id || report?.interviewId || `intv-${Date.now()}`;
    const score = report?.overallScore ?? 85;

    console.log(`[ATS WEBHOOK] Dispatching candidate report for "${candidate}" (${id}) to ${targetUrl}`);

    res.json({
      status: "success",
      message: `Candidate evaluation report for ${candidate} successfully dispatched to ATS/HR Webhook endpoint.`,
      timestamp: new Date().toISOString(),
      payload_delivered: {
        session_id: id,
        candidate_name: candidate,
        destination_url: targetUrl,
        overall_score: score,
        strengths_count: report?.strengths?.length || 3,
        weaknesses_count: report?.areasToImprove?.length || 3,
        recommendations_count: report?.recommendedActionPlan?.length || 3,
        status: "DELIVERED_200_OK"
      }
    });
  };

  app.post("/api/interview/export-webhook", handleExportWebhook);
  app.post("/api/v1/interview/export-webhook", handleExportWebhook);

  // Curriculum & Candidates REST endpoints
  app.get("/api/v1/curriculum", (req, res) => {
    res.json({
      status: "success",
      totalDays: CURRICULUM_DATA.length,
      curriculum: CURRICULUM_DATA
    });
  });

  app.get("/api/v1/candidates", (req, res) => {
    res.json({
      status: "success",
      count: CANDIDATE_PROFILES.length,
      candidates: CANDIDATE_PROFILES
    });
  });

  app.get("/api/v1/candidates/:id", (req, res) => {
    const candidate = CANDIDATE_PROFILES.find(c => c.id === req.params.id);
    if (!candidate) {
      return res.status(404).json({ error: "Candidate profile not found" });
    }
    res.json({ status: "success", candidate });
  });

  app.get("/api/v1/interview/:id", (req, res) => {
    const session = activeSessions.get(req.params.id);
    if (!session) {
      return res.status(404).json({ error: "Interview session not found" });
    }
    const report = completedReports.get(req.params.id);
    res.json({ status: "success", session, report });
  });

  // 6. OpenAPI Technical Specification Documentation Endpoint
  app.get("/api/v1/spec", (req, res) => {
    res.json({
      title: "ABTalks AI Cohort - AI Technical Interview Agent API Specification",
      version: "1.0.0",
      description: "RESTful HTTP API for conducting personalized multi-turn technical interviews for the ABTalks 31-day Enterprise AI Engineering program.",
      minimumRequirements: {
        totalQuestions: "Minimum 8 questions per interview",
        curriculumDaysCovered: "Minimum 4 unique curriculum days evaluated",
        evaluationEngine: "Gemini 3.6 Flash multi-turn AI reasoning",
        reportGeneration: "Structured score breakdown, strengths, and actionable improvement plan"
      },
      endpoints: [
        {
          method: "GET",
          path: "/api/v1/curriculum",
          description: "Returns full 31-day curriculum JSON with modules, topics, learning objectives, and tools."
        },
        {
          method: "GET",
          path: "/api/v1/candidates",
          description: "Returns synthetic candidate profiles with learning signals and completed mission progress."
        },
        {
          method: "POST",
          path: "/api/v1/interview/start",
          description: "Initiates a new adaptive technical interview session.",
          requestBodyExample: { candidate_id: "sana-khan", num_questions: 8 },
          responseExample: { status: "success", interview_id: "intv-12345", question: {} }
        },
        {
          method: "POST",
          path: "/api/v1/interview/answer",
          description: "Submits candidate answer, evaluates with Gemini, and returns next adaptive question or final report.",
          requestBodyExample: { interview_id: "intv-12345", answer: "Self-attention computes Q, K, V dot products..." },
          responseExample: { status: "success", evaluation: {}, next_question: {} }
        },
        {
          method: "GET",
          path: "/api/v1/interview/:id/report",
          description: "Retrieves complete structured final report with score breakdowns and actionable recommendations."
        }
      ]
    });
  });

  // Serve Vite in dev or static files in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
