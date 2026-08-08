import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { ThemeProvider } from './context/ThemeContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { LandingPage } from './components/LandingPage';
import { DashboardView } from './components/DashboardView';
import { CandidateProfileView } from './components/CandidateProfileView';
import { CurriculumView } from './components/CurriculumView';
import { InterviewScreen } from './components/InterviewScreen';
import { InterviewReportView } from './components/InterviewReportView';
import { MyInterviewsView } from './components/MyInterviewsView';
import { AnalyticsView } from './components/AnalyticsView';
import { SettingsView } from './components/SettingsView';
import { TechSpecModal } from './components/TechSpecModal';
import { AuthModal } from './components/AuthModal';
import { DeveloperControlPanel } from './components/DeveloperControlPanel';

import { CANDIDATE_PROFILES } from './data/candidateProfiles';
import { CandidateProfile, InterviewSession, FinalReport } from './types';

export function AppContent() {
  const [currentView, setCurrentView] = useState<string>('landing');
  const [candidatesList, setCandidatesList] = useState<CandidateProfile[]>(CANDIDATE_PROFILES);
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateProfile>(CANDIDATE_PROFILES[0]);

  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<{
    name: string;
    email: string;
    role: string;
    avatar: string;
  } | null>(null);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');

  const [activeSession, setActiveSession] = useState<InterviewSession | null>(null);
  const [activeReport, setActiveReport] = useState<FinalReport | null>(null);
  const [interviewRecords, setInterviewRecords] = useState<FinalReport[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isTechSpecOpen, setIsTechSpecOpen] = useState<boolean>(false);
  const [isSteerPanelOpen, setIsSteerPanelOpen] = useState<boolean>(false);

  // Steer Challenge Preset Handler
  const handleSelectPreset = (presetType: 'high_performer' | 'needs_remediation' | 'edge_case') => {
    if (presetType === 'high_performer') {
      const cand = candidatesList.find(c => c.name.toLowerCase().includes('sana') || c.name.toLowerCase().includes('zobiya')) || candidatesList[0];
      setSelectedCandidate(cand);
    } else if (presetType === 'needs_remediation') {
      const cand = candidatesList[1] || candidatesList[0];
      setSelectedCandidate(cand);
    } else {
      const cand = candidatesList[2] || candidatesList[0];
      setSelectedCandidate(cand);
    }
  };

  // Fast-Forward to Turn 8 Handler
  const handleFastForwardTurn8 = (presetType: 'high_performer' | 'needs_remediation' | 'edge_case') => {
    let cand = selectedCandidate;
    if (presetType === 'high_performer') cand = candidatesList[0];
    else if (presetType === 'needs_remediation') cand = candidatesList[1] || candidatesList[0];
    else cand = candidatesList[2] || candidatesList[0];

    setSelectedCandidate(cand);

    let score = 94;
    let gradeLabel = "Excellent";
    let strengths = [
      "Deep technical mastery of RAG & HNSW vector indexing math",
      "Flawless FastMCP bearer authorization & tool schema definition",
      "Strong mathematical understanding of Reciprocal Rank Fusion"
    ];
    let areasToImprove = [
      "Minor edge case handling in multi-agent cyclic graph execution",
      "Optimization of memory layout for dynamic batch tokenization"
    ];
    let recommendedActionPlan = [
      "Deploy custom FastMCP server with authorization middleware to production",
      "Set up LangSmith tracing for TTFT and token cost monitoring"
    ];

    if (presetType === 'needs_remediation') {
      score = 58;
      gradeLabel = "Needs Remediation";
      strengths = [
        "Basic understanding of text embeddings and prompt structure",
        "Enthusiastic learning approach to AI engineering topics"
      ];
      areasToImprove = [
        "Struggles with HNSW graph distance metrics and memory overhead",
        "Incomplete implementation of MCP bearer authentication headers",
        "Lacks fallback handling for context window token limits"
      ];
      recommendedActionPlan = [
        "Re-do Day 5 Vector Indexing & Day 12 MCP Authorization labs",
        "Practice schema definition for JSON function calling tools"
      ];
    } else if (presetType === 'edge_case') {
      score = 76;
      gradeLabel = "Competent";
      strengths = [
        "Proficient PyTorch and model fine-tuning code syntax",
        "Solid communication during multi-turn technical discussion"
      ];
      areasToImprove = [
        "Lacks systematic prompt safety guardrails and input sanitization",
        "Partial knowledge of hybrid BM25 + dense vector search fusion"
      ];
      recommendedActionPlan = [
        "Integrate NeMo Guardrails or LlamaGuard for system safety",
        "Implement reciprocal rank fusion algorithms for search"
      ];
    }

    const mockReport: FinalReport = {
      interviewId: `intv-fastforward-${Date.now()}`,
      candidateName: cand.name,
      completedAt: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      overallScore: score,
      gradeLabel: gradeLabel,
      scoreBreakdown: {
        technicalKnowledge: score + 2 > 100 ? 98 : score + 2,
        conceptualUnderstanding: score - 3,
        problemSolving: score,
        systemDesign: score - 4,
        communication: score + 4 > 100 ? 96 : score + 4
      },
      strengths,
      areasToImprove,
      recommendedActionPlan,
      questionPerformance: Array.from({ length: 8 }, (_, i) => ({
        questionId: `q${i + 1}`,
        questionNumber: i + 1,
        day: [1, 5, 8, 12, 16, 21, 25, 30][i],
        module: `Module ${Math.floor(i / 2) + 1}`,
        topic: ["LLM Architecture", "Vector Databases", "RAG Pipeline", "FastMCP Tools", "Fine-Tuning", "Agent Loops", "Guardrails", "Deployment"][i],
        questionText: `Technical evaluation question ${i + 1} on AI cohort curriculum topic ${i + 1}.`,
        difficulty: i < 3 ? "Medium" : i < 6 ? "Hard" : "Expert",
        type: i % 2 === 0 ? "Conceptual" : "Code/Design",
        candidateAnswer: `Evaluated candidate answer demonstrating response logic for turn ${i + 1}.`,
        score: Math.min(100, Math.max(40, score + (i % 2 === 0 ? 3 : -3))),
        evaluationLabel: score >= 85 ? "Excellent" : score >= 70 ? "Good" : "Needs Review",
        feedback: `Detailed Gemini Flash evaluation for Turn ${i + 1}.`,
        followUpTriggered: i % 3 === 0,
        idealKeyPointsCovered: ["Core AI Engineering concept", "Production pattern"],
        idealKeyPointsMissed: presetType === 'needs_remediation' ? ["Edge case optimization"] : []
      })),
      daysEvaluated: [1, 5, 8, 12, 16, 21, 25, 30],
      summaryParagraph: `${cand.name} completed an 8-question fast-forward technical evaluation with an overall score of ${score}%. Evaluation verified via Gemini 3.6 Flash engine.`
    };

    setActiveReport(mockReport);
    setInterviewRecords(prev => [mockReport, ...prev]);
    setActiveSession(null);
    setCurrentView('report');

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  // Clean Reset Handler
  const handleCleanReset = () => {
    setActiveSession(null);
    setActiveReport(null);
    setInterviewRecords([]);
    setCurrentView('dashboard');
  };

  // Fetch Candidates from API on mount
  useEffect(() => {
    fetch('/api/v1/candidates')
      .then(res => res.json())
      .then(data => {
        if (data.candidates && Array.isArray(data.candidates)) {
          setCandidatesList(data.candidates);
          if (!selectedCandidate) setSelectedCandidate(data.candidates[0]);
        }
      })
      .catch(err => console.warn("Failed fetching candidates from API, using defaults:", err));
  }, []);

  // Handle Login Success
  const handleLoginSuccess = (user: { name: string; email: string; role: string; avatar: string }) => {
    setIsAuthenticated(true);
    setCurrentUser(user);
    if (currentView === 'landing') {
      setCurrentView('dashboard');
    }
  };

  // Handle Logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setCurrentView('landing');
  };

  // Open Auth Modal for Login
  const handleOpenLogin = () => {
    setAuthModalMode('login');
    setIsAuthModalOpen(true);
  };

  // Open Auth Modal for Signup
  const handleOpenSignup = () => {
    setAuthModalMode('signup');
    setIsAuthModalOpen(true);
  };

  // Start Interview Action
  const handleStartInterview = async (candidateId?: string) => {
    if (!isAuthenticated) {
      handleOpenLogin();
      return;
    }

    setIsLoading(true);
    const targetCandId = candidateId || selectedCandidate.id;
    try {
      const res = await fetch('/api/v1/interview/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidate_id: targetCandId, num_questions: 8 })
      });
      const data = await res.json();
      if (data.status === 'success' && data.interview_id) {
        // Construct session object
        const sessionObj: InterviewSession = {
          id: data.interview_id,
          candidateId: targetCandId,
          candidateName: selectedCandidate.name,
          candidateAvatar: selectedCandidate.avatar,
          startTime: new Date().toISOString(),
          status: 'in_progress',
          currentQuestionIndex: 0,
          totalQuestions: data.session.total_questions || 8,
          daysCovered: data.session.days_covered || [data.question.day],
          currentQuestion: data.question,
          transcript: [],
          interviewerNotes: `Interview active for ${selectedCandidate.name}. Evaluating technical competency.`
        };

        setActiveSession(sessionObj);
        setCurrentView('interview');
      }
    } catch (err) {
      console.error("Error starting interview via API:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Submit Answer Action
  const handleSubmitAnswer = async (answerText: string) => {
    if (!activeSession) return;
    setIsLoading(true);

    try {
      const res = await fetch('/api/v1/interview/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          interview_id: activeSession.id,
          answer: answerText
        })
      });

      const data = await res.json();

      if (data.status === 'success') {
        if (data.is_complete) {
          // Interview Completed!
          if (data.report) {
            setActiveReport(data.report);
            setInterviewRecords(prev => [data.report, ...prev]);
          }
          setActiveSession(null);
          setCurrentView('report');

          // Trigger Confetti!
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 }
          });
        } else {
          // Update Session for next question
          setActiveSession(prev => {
            if (!prev) return null;
            const updatedTranscript = [
              ...prev.transcript,
              {
                questionId: prev.currentQuestion?.id || 'q',
                questionNumber: prev.currentQuestionIndex + 1,
                day: prev.currentQuestion?.day || 1,
                module: prev.currentQuestion?.module || '',
                topic: prev.currentQuestion?.topic || '',
                questionText: prev.currentQuestion?.questionText || '',
                difficulty: prev.currentQuestion?.difficulty || 'Medium',
                type: prev.currentQuestion?.type || 'Conceptual',
                candidateAnswer: answerText,
                score: data.evaluation.score,
                evaluationLabel: data.evaluation.label,
                feedback: data.evaluation.feedback,
                followUpTriggered: Boolean(data.evaluation.follow_up_probe),
                idealKeyPointsCovered: data.evaluation.key_points_covered || [],
                idealKeyPointsMissed: data.evaluation.key_points_missed || []
              }
            ];

            const newDays = prev.daysCovered.includes(data.next_question.question.day)
              ? prev.daysCovered
              : [...prev.daysCovered, data.next_question.question.day];

            return {
              ...prev,
              currentQuestionIndex: data.next_question.question_number - 1,
              daysCovered: newDays,
              currentQuestion: data.next_question.question,
              transcript: updatedTranscript
            };
          });
        }
      }
    } catch (err) {
      console.error("Error submitting answer:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // View Report Action
  const handleViewReport = (reportId?: string) => {
    if (!isAuthenticated) {
      handleOpenLogin();
      return;
    }

    if (!activeReport) {
      // Create mock report if none active
      const mockRep: FinalReport = {
        interviewId: reportId || "intv-sample-1",
        candidateName: selectedCandidate.name,
        completedAt: "May 28, 2025 at 10:30 PM",
        overallScore: 85,
        gradeLabel: "Excellent",
        scoreBreakdown: {
          technicalKnowledge: 88,
          conceptualUnderstanding: 82,
          problemSolving: 85,
          systemDesign: 80,
          communication: 90
        },
        strengths: [
          "Strong understanding of Retrieval-Augmented Generation (RAG)",
          "Solid knowledge of vector embedding models & Pinecone HNSW indexing",
          "Clear problem-solving approach to hybrid search fusion"
        ],
        areasToImprove: [
          "Vector database index optimization and VRAM tuning",
          "MCP security authorization policies",
          "Production multi-agent guardrails and human-in-the-loop gates"
        ],
        recommendedActionPlan: [
          "Review Day 10 Hybrid Search & Reciprocal Rank Fusion math",
          "Build a custom FastMCP server with bearer authorization middleware",
          "Implement production LangSmith tracing to track TTFT and token cost"
        ],
        questionPerformance: [
          {
            questionId: "q1",
            questionNumber: 1,
            day: 12,
            module: "Module 2: RAG Systems & Vector Databases",
            topic: "RAG Fundamentals",
            questionText: "Explain how Retrieval-Augmented Generation (RAG) works and why it improves response quality.",
            difficulty: "Medium",
            type: "Conceptual",
            candidateAnswer: "Dense embeddings capture contextual meaning and allow top-k retrieval of documents before sending to LLM.",
            score: 90,
            evaluationLabel: "Excellent",
            feedback: "Outstanding explanation covering semantic retrieval and grounding.",
            followUpTriggered: false,
            idealKeyPointsCovered: ["Dense embeddings", "Top-K retrieval", "Hallucination reduction"],
            idealKeyPointsMissed: []
          }
        ],
        daysEvaluated: [12, 18, 24, 28],
        summaryParagraph: `${selectedCandidate.name} completed a multi-turn technical interview across 4 curriculum days with an overall score of 85%. She demonstrated strong technical command of modern AI engineering concepts.`
      };

      setActiveReport(mockRep);
    }
    setCurrentView('report');
  };

  return (
    <div className="min-h-screen dark:bg-[#030712] bg-slate-50 dark:text-slate-100 text-slate-900 transition-colors duration-200 flex flex-col font-sans relative overflow-x-hidden selection:bg-blue-500/30 selection:text-blue-200">
      {/* Ambient background glowing orbs */}
      <div className="fixed -top-40 -left-40 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed top-1/3 -right-40 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed -bottom-20 left-1/3 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Navigation Header */}
      <Header
        isAuthenticated={isAuthenticated}
        currentUser={currentUser}
        onOpenLogin={handleOpenLogin}
        onOpenSignup={handleOpenSignup}
        onLogout={handleLogout}
        currentView={currentView}
        setCurrentView={(view) => {
          if (!isAuthenticated && view !== 'landing') {
            handleOpenLogin();
          } else {
            setCurrentView(view);
          }
        }}
        selectedCandidate={selectedCandidate}
        setSelectedCandidate={setSelectedCandidate}
        candidatesList={candidatesList}
        onStartInterviewClick={() => handleStartInterview()}
        onOpenTechSpec={() => setIsTechSpecOpen(true)}
        onOpenSteerPanel={() => setIsSteerPanelOpen(true)}
      />

      {/* VIEW ROUTING */}
      {!isAuthenticated || currentView === 'landing' ? (
        <LandingPage
          onGetStarted={handleOpenLogin}
          onWatchDemo={() => {
            // Instant quick demo access
            handleLoginSuccess({
              name: 'Sarah Chen',
              email: 'sarah.chen@enterprise.ai',
              role: 'Director of AI Engineering',
              avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
            });
          }}
          onOpenTechSpec={() => setIsTechSpecOpen(true)}
        />
      ) : (
        <div className="flex-1 max-w-7xl w-full mx-auto flex">
          {/* Left Sidebar - Only in Authenticated Mode when not in live interview */}
          {currentView !== 'interview' && (
            <Sidebar
              currentView={currentView}
              setCurrentView={setCurrentView}
              selectedCandidate={selectedCandidate}
              onOpenTechSpec={() => setIsTechSpecOpen(true)}
            />
          )}

          {/* Main Content View Container */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
            {currentView === 'dashboard' && (
              <DashboardView
                selectedCandidate={selectedCandidate}
                setSelectedCandidate={setSelectedCandidate}
                candidatesList={candidatesList}
                interviewRecords={interviewRecords}
                onStartInterview={(candId) => handleStartInterview(candId)}
                onViewReport={handleViewReport}
                onNavigateToCurriculum={() => setCurrentView('curriculum')}
              />
            )}

            {currentView === 'candidates' && (
              <CandidateProfileView
                selectedCandidate={selectedCandidate}
                setSelectedCandidate={setSelectedCandidate}
                candidatesList={candidatesList}
                onStartInterviewForCandidate={(candId) => handleStartInterview(candId)}
                onAddCandidate={(newCand) => {
                  setCandidatesList(prev => [newCand, ...prev]);
                  setSelectedCandidate(newCand);
                }}
              />
            )}

            {currentView === 'curriculum' && (
              <CurriculumView
                selectedCandidate={selectedCandidate}
                onStartInterviewForDay={() => handleStartInterview()}
                onToggleDayStatus={(dayNum, status) => {
                  setCandidatesList(prevList =>
                    prevList.map(cand => {
                      if (cand.id !== selectedCandidate.id) return cand;
                      let newCompleted = cand.completedDays.filter(d => d !== dayNum);
                      let newSkipped = cand.skippedDays.filter(d => d !== dayNum);

                      if (status === 'completed') {
                        newCompleted.push(dayNum);
                      } else if (status === 'skipped') {
                        newSkipped.push(dayNum);
                      }

                      const updatedCand = {
                        ...cand,
                        completedDays: newCompleted.sort((a, b) => a - b),
                        skippedDays: newSkipped.sort((a, b) => a - b)
                      };

                      setSelectedCandidate(updatedCand);
                      return updatedCand;
                    })
                  );
                }}
              />
            )}

            {currentView === 'interview' && activeSession && (
              <InterviewScreen
                session={activeSession}
                onSubmitAnswer={handleSubmitAnswer}
                onEndInterview={() => setCurrentView('dashboard')}
                isLoading={isLoading}
                selectedCandidate={selectedCandidate}
              />
            )}

            {currentView === 'report' && activeReport && (
              <InterviewReportView
                report={activeReport}
                onBackToDashboard={() => setCurrentView('dashboard')}
              />
            )}

            {currentView === 'my-interviews' && (
              <MyInterviewsView
                selectedCandidate={selectedCandidate}
                interviewRecords={interviewRecords}
                onViewReport={handleViewReport}
                onStartNewInterview={() => handleStartInterview()}
              />
            )}

            {currentView === 'analytics' && (
              <AnalyticsView
                selectedCandidate={selectedCandidate}
                interviewRecords={interviewRecords}
                onStartNewInterview={() => handleStartInterview()}
              />
            )}

            {currentView === 'settings' && (
              <SettingsView
                selectedCandidate={selectedCandidate}
                onUpdateCandidateProfile={(updated) => {
                  setCandidatesList(prevList =>
                    prevList.map(cand => {
                      if (cand.id !== selectedCandidate.id) return cand;
                      const updatedCand = { ...cand, ...updated };
                      setSelectedCandidate(updatedCand);
                      return updatedCand;
                    })
                  );
                }}
                onResetAllData={() => {
                  setInterviewRecords([]);
                  setActiveReport(null);
                  setActiveSession(null);
                  setCandidatesList(prev =>
                    prev.map(cand => ({
                      ...cand,
                      completedDays: [],
                      skippedDays: [],
                      attemptsCount: 0,
                      avgScore: 0
                    }))
                  );
                  setSelectedCandidate(prev => ({
                    ...prev,
                    completedDays: [],
                    skippedDays: [],
                    attemptsCount: 0,
                    avgScore: 0
                  }));
                }}
              />
            )}
          </main>
        </div>
      )}

      {/* Technical Spec Modal */}
      <TechSpecModal
        isOpen={isTechSpecOpen}
        onClose={() => setIsTechSpecOpen(false)}
      />

      {/* Developer / Steer Challenge Control Panel Modal */}
      <DeveloperControlPanel
        isOpen={isSteerPanelOpen}
        onClose={() => setIsSteerPanelOpen(false)}
        onSelectPreset={handleSelectPreset}
        onFastForwardTurn8={handleFastForwardTurn8}
        onCleanReset={handleCleanReset}
        activeSession={activeSession}
        selectedCandidate={selectedCandidate}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        initialMode={authModalMode}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
