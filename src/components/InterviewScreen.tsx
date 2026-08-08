import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Send,
  Code,
  ImageIcon,
  Clock,
  ArrowLeft,
  Brain,
  Award,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Layers,
  Bot,
  User,
  AlertCircle,
  ChevronRight,
  LogOut,
  Target,
  FileCheck,
  ShieldAlert,
  Play,
  Cpu
} from 'lucide-react';
import { InterviewSession, CandidateProfile } from '../types';

interface InterviewScreenProps {
  session: InterviewSession;
  onSubmitAnswer: (answerText: string) => Promise<void>;
  onEndInterview: (forceEnd?: boolean) => void;
  isLoading: boolean;
  selectedCandidate: CandidateProfile;
}

export const InterviewScreen: React.FC<InterviewScreenProps> = ({
  session,
  onSubmitAnswer,
  onEndInterview,
  isLoading,
  selectedCandidate
}) => {
  const [answerInput, setAnswerInput] = useState('');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [showPlannerModal, setShowPlannerModal] = useState(true);
  const [showHardStopModal, setShowHardStopModal] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!showPlannerModal) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [session.transcript, session.currentQuestionIndex, isLoading, showPlannerModal]);

  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleInsertCodeSnippet = () => {
    setAnswerInput(prev => prev + '\n```python\n# Enterprise implementation snippet:\ndef process_embedding_pipeline(query: str):\n    # 1. Vector Search top_k=5\n    pass\n```\n');
  };

  const handleInsertDiagram = () => {
    setAnswerInput(prev => prev + '\n[System Design Diagram: Client -> API Gateway -> Vector DB (Pinecone) -> Gemini 3.6 Flash]\n');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answerInput.trim() || isLoading) return;
    const currentText = answerInput;
    setAnswerInput('');
    await onSubmitAnswer(currentText);
  };

  const handleEndAttempt = () => {
    const answeredCount = session.transcript.length;
    const uniqueDaysCount = session.daysCovered.length;

    // Hard Validation Rule: Min 8 questions AND Min 4 unique curriculum days
    if (answeredCount < 8 || uniqueDaysCount < 4) {
      setShowHardStopModal(true);
    } else {
      onEndInterview(true);
    }
  };

  const currentQ = session.currentQuestion;
  const currentQNum = session.currentQuestionIndex + 1;

  const dayTitles: Record<number, string> = {
    1: 'VS Code & Python Setup',
    2: 'Local LLMs & Copilot',
    3: 'FastAPI & React Chatbot',
    4: 'Structured Data & SQL',
    5: 'Unstructured Data OCR',
    6: 'Knowledge Base Chunking',
    7: 'Embeddings & Vectors',
    8: 'Chroma & Pinecone DBs',
    10: 'Hybrid Retrieval Engine',
    11: 'RAG Pipeline & APIs',
    12: 'Prompt Engineering',
    13: 'Function Calling & Pydantic',
    14: 'LoRA & QLoRA Quantization',
    16: 'Chatbot Backend API',
    18: 'Streaming SSE Responses',
    20: 'Conversation Memory',
    21: 'LangChain & ReAct Agents',
    22: 'Multi-Agent CrewAI',
    24: 'Model Context Protocol (MCP)',
    27: 'Security & Guardrails',
    28: 'Docker & Kubernetes',
    29: 'Prometheus Observability',
    31: 'Capstone Project'
  };

  return (
    <div className="max-w-7xl mx-auto space-y-4 relative">
      {/* 1. PLANNER AGENT BLUEPRINT OVERLAY MODAL (Run before Q1) */}
      {showPlannerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-2xl rounded-3xl dark:bg-[#0b0f19] bg-white dark:border-white/15 border-slate-200 border shadow-2xl overflow-hidden p-6 space-y-6">
            <div className="flex items-center gap-3 border-b dark:border-white/10 border-slate-200 pb-4">
              <div className="p-3 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/20">
                <Brain className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                  Planner Agent Active • Session Blueprint Generated
                </span>
                <h2 className="text-xl font-black dark:text-white text-slate-900">
                  Adaptive Interview Plan for {selectedCandidate.name}
                </h2>
              </div>
            </div>

            {/* Candidate Diagnostic Inputs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-2xl dark:bg-white/5 bg-slate-50 dark:border-white/10 border-slate-200 border text-xs">
              <div>
                <p className="text-[10px] dark:text-slate-400 text-slate-500 font-bold">Candidate</p>
                <p className="font-extrabold dark:text-white text-slate-900">{selectedCandidate.name}</p>
              </div>
              <div>
                <p className="text-[10px] dark:text-slate-400 text-slate-500 font-bold">Target Role</p>
                <p className="font-extrabold dark:text-blue-400 text-blue-600">{selectedCandidate.role}</p>
              </div>
              <div>
                <p className="text-[10px] dark:text-slate-400 text-slate-500 font-bold">Completed Missions</p>
                <p className="font-extrabold dark:text-emerald-400 text-emerald-600">{selectedCandidate.completedDays.length} / 31 Days</p>
              </div>
              <div>
                <p className="text-[10px] dark:text-slate-400 text-slate-500 font-bold">Skipped Missions</p>
                <p className="font-extrabold dark:text-amber-400 text-amber-600">{selectedCandidate.skippedDays.length} Days</p>
              </div>
            </div>

            {/* Mapped Sequence Matrix */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-extrabold dark:text-slate-200 text-slate-800 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-purple-500" />
                  Interview Plan Sequence (8 Questions across 5+ Days)
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[10px] border border-emerald-500/30">
                  Hard Validation Certified
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-semibold">
                <div className="p-2.5 rounded-xl dark:bg-white/5 bg-slate-100 border dark:border-white/10 border-slate-200 flex items-center justify-between">
                  <span>Q1 • Day 12 Prompt Engineering</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">Easy</span>
                </div>
                <div className="p-2.5 rounded-xl dark:bg-white/5 bg-slate-100 border dark:border-white/10 border-slate-200 flex items-center justify-between">
                  <span>Q2 • Day 10 Hybrid Retrieval RRF</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">Medium</span>
                </div>
                <div className="p-2.5 rounded-xl dark:bg-white/5 bg-slate-100 border dark:border-white/10 border-slate-200 flex items-center justify-between">
                  <span>Q3 • Day 14 LoRA &amp; QLoRA Fine-tuning</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300">Hard</span>
                </div>
                <div className="p-2.5 rounded-xl dark:bg-white/5 bg-slate-100 border dark:border-white/10 border-slate-200 flex items-center justify-between">
                  <span>Q4 • Day 20 Multi-Agent Orchestration</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">Medium</span>
                </div>
                <div className="p-2.5 rounded-xl dark:bg-white/5 bg-slate-100 border dark:border-white/10 border-slate-200 flex items-center justify-between">
                  <span>Q5 • Day 22 Goal Decomposition &amp; ToT</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300">Hard</span>
                </div>
                <div className="p-2.5 rounded-xl dark:bg-white/5 bg-slate-100 border dark:border-white/10 border-slate-200 flex items-center justify-between">
                  <span>Q6 • Day 24 Model Context Protocol (MCP)</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300">Hard</span>
                </div>
                <div className="p-2.5 rounded-xl dark:bg-white/5 bg-slate-100 border dark:border-white/10 border-slate-200 flex items-center justify-between">
                  <span>Q7 • Day 28 Docker &amp; Kubernetes</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">Medium</span>
                </div>
                <div className="p-2.5 rounded-xl dark:bg-white/5 bg-slate-100 border dark:border-white/10 border-slate-200 flex items-center justify-between">
                  <span>Q8 • Day 31 Capstone Trade-off Defense</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">Mastery</span>
                </div>
              </div>
            </div>

            {/* Launch CTA */}
            <div className="pt-2 border-t dark:border-white/10 border-slate-200 flex items-center justify-between">
              <p className="text-[11px] dark:text-slate-400 text-slate-500">
                Breeth Memory &amp; Gemini 3.6 Flash ready for multi-turn evaluation
              </p>
              <button
                onClick={() => setShowPlannerModal(false)}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white font-black text-xs shadow-xl shadow-indigo-500/30 hover:scale-105 transition-all cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Begin Question 1 Evaluation →</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. HARD STOP VALIDATION MODAL */}
      {showHardStopModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-lg rounded-3xl dark:bg-[#0b0f19] bg-white dark:border-white/15 border-slate-200 border shadow-2xl overflow-hidden p-6 space-y-5">
            <div className="flex items-center gap-3 text-rose-500">
              <div className="p-3 rounded-2xl bg-rose-500/20 border border-rose-500/30">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black dark:text-white text-slate-900">
                  Hard Validation Stop
                </h3>
                <p className="text-xs text-rose-400 font-bold">
                  Problem Statement 2 Evaluation Criteria
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl dark:bg-rose-500/10 bg-rose-50 dark:border-rose-500/20 border-rose-200 border text-xs space-y-2 dark:text-slate-200 text-slate-800">
              <p className="font-semibold">
                Certification requires completing <strong>at least 8 questions</strong> across <strong>at least 4 distinct curriculum days</strong>.
              </p>
              <div className="grid grid-cols-2 gap-2 pt-2 text-center font-bold">
                <div className="p-2 rounded-xl dark:bg-black/30 bg-white border border-rose-500/30">
                  <p className="text-[10px] text-slate-400">Questions Answered</p>
                  <p className="text-base text-rose-400">{session.transcript.length} / 8 required</p>
                </div>
                <div className="p-2 rounded-xl dark:bg-black/30 bg-white border border-rose-500/30">
                  <p className="text-[10px] text-slate-400">Unique Days Covered</p>
                  <p className="text-base text-rose-400">{session.daysCovered.length} / 4 required</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t dark:border-white/10 border-slate-200">
              <button
                onClick={() => setShowHardStopModal(false)}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
              >
                Continue Interview (Recommended)
              </button>

              <button
                onClick={() => {
                  setShowHardStopModal(false);
                  onEndInterview(true);
                }}
                className="px-4 py-2.5 rounded-xl dark:bg-white/10 bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-rose-500 hover:text-white transition-all cursor-pointer"
              >
                Force End Session
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Header Bar */}
      <div className="p-4 rounded-2xl dark:bg-white/5 bg-white dark:border-white/15 border-slate-200 border backdrop-blur-xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={handleEndAttempt}
            className="p-2.5 rounded-xl dark:bg-white/10 bg-slate-100 dark:border-white/15 border-slate-200 border dark:text-slate-300 text-slate-700 hover:dark:bg-white/20 hover:bg-slate-200 transition-colors cursor-pointer"
            title="Exit Interview"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-base font-extrabold dark:text-white text-slate-900">
                Enterprise AI Technical Interview
              </span>
              <span className="px-3 py-1 rounded-full dark:bg-blue-500/20 bg-blue-100 dark:text-blue-300 text-blue-800 dark:border-blue-500/30 border-blue-200 border text-xs font-black shadow-sm">
                Question {currentQNum} of {session.totalQuestions}
              </span>
              {currentQ && (
                <span className="px-3 py-1 rounded-full bg-gradient-to-r from-purple-500/20 to-indigo-500/20 dark:text-purple-300 text-purple-800 dark:border-purple-500/40 border-purple-300 border text-xs font-black shadow-sm flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-500 animate-spin" />
                  Assessing Day {currentQ.day}: {currentQ.topic}
                </span>
              )}
            </div>
            <p className="text-xs dark:text-slate-400 text-slate-500 mt-1">
              Evaluating candidate <span className="font-extrabold dark:text-slate-200 text-slate-800">{selectedCandidate.name}</span> • Session ID: <span className="font-mono text-blue-500 font-bold">{session.id.slice(0, 10)}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Live Timer */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl dark:bg-white/10 bg-slate-100 dark:border-white/15 border-slate-200 border dark:text-slate-200 text-slate-800 text-xs font-mono font-bold">
            <Clock className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
            <span>{formatTime(elapsedSeconds)}</span>
          </div>

          {/* End & Generate Feedback Button */}
          <button
            onClick={handleEndAttempt}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 text-white font-bold text-xs shadow-lg shadow-rose-500/20 hover:shadow-rose-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>End &amp; Generate Feedback</span>
          </button>
        </div>
      </div>

      {/* DUAL-PANE LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT SIDEBAR PANE (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Active Candidate Profile Card */}
          <div className="p-5 rounded-2xl dark:bg-white/5 bg-white dark:border-white/15 border-slate-200 border backdrop-blur-xl shadow-xl space-y-4">
            <div className="flex items-center gap-3.5 pb-3 dark:border-white/10 border-slate-200 border-b">
              <img
                src={selectedCandidate.avatar}
                alt={selectedCandidate.name}
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-blue-500/40"
              />
              <div>
                <h3 className="text-base font-extrabold dark:text-white text-slate-900">
                  {selectedCandidate.name}
                </h3>
                <p className="text-xs font-medium dark:text-blue-400 text-blue-600">
                  {selectedCandidate.role}
                </p>
                <p className="text-[11px] dark:text-slate-400 text-slate-500 mt-0.5">
                  {selectedCandidate.cohort}
                </p>
              </div>
            </div>

            {/* Candidate Mission Stats */}
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="p-2.5 rounded-xl dark:bg-emerald-500/10 bg-emerald-50 dark:border-emerald-500/20 border-emerald-200 border">
                <p className="text-[10px] font-bold dark:text-emerald-400 text-emerald-700">Missions Passed</p>
                <p className="text-lg font-black dark:text-emerald-300 text-emerald-800">
                  {selectedCandidate.completedDays.length} / 31
                </p>
              </div>

              <div className="p-2.5 rounded-xl dark:bg-amber-500/10 bg-amber-50 dark:border-amber-500/20 border-amber-200 border">
                <p className="text-[10px] font-bold dark:text-amber-400 text-amber-700">Missions Skipped</p>
                <p className="text-lg font-black dark:text-amber-300 text-amber-800">
                  {selectedCandidate.skippedDays.length}
                </p>
              </div>
            </div>

            {/* Question Progress Bar */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold dark:text-slate-300 text-slate-700 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-blue-500" />
                  Interview Progress
                </span>
                <span className="font-extrabold dark:text-blue-400 text-blue-600">
                  Q{currentQNum} of {session.totalQuestions} ({Math.round((currentQNum / session.totalQuestions) * 100)}%)
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full dark:bg-white/10 bg-slate-200 overflow-hidden p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 rounded-full transition-all duration-500"
                  style={{ width: `${(currentQNum / session.totalQuestions) * 100}%` }}
                />
              </div>
            </div>

            {/* Covered Curriculum Days */}
            <div className="space-y-2 pt-2 dark:border-white/10 border-slate-200 border-t">
              <span className="text-xs font-bold dark:text-slate-300 text-slate-700 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-purple-500" />
                Covered Curriculum Days ({session.daysCovered.length}/4+ Required)
              </span>

              <div className="flex flex-wrap gap-1.5">
                {session.daysCovered.map((dayNum) => (
                  <span
                    key={dayNum}
                    className="px-2.5 py-1 rounded-lg text-xs font-bold dark:bg-purple-500/20 bg-purple-50 dark:text-purple-300 text-purple-700 dark:border-purple-500/30 border-purple-200 border flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3 h-3 text-purple-400" />
                    Day {dayNum}: {dayTitles[dayNum] || `Module Topic`}
                  </span>
                ))}
              </div>
            </div>

            {/* Focus Topics */}
            <div className="space-y-1.5 pt-2 dark:border-white/10 border-slate-200 border-t">
              <p className="text-[11px] font-bold dark:text-slate-400 text-slate-500 uppercase tracking-wider">
                Target Interview Focus
              </p>
              <div className="flex flex-wrap gap-1">
                {selectedCandidate.interviewFocus.map((focus, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-md text-[10px] font-medium dark:bg-white/5 bg-slate-100 dark:text-slate-300 text-slate-700 dark:border-white/10 border-slate-200 border"
                  >
                    {focus}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* AI Examiner Behavioral Guidance */}
          <div className="p-4 rounded-2xl dark:bg-blue-500/10 bg-blue-50 dark:border-blue-500/20 border-blue-200 border backdrop-blur-md text-xs space-y-2">
            <h4 className="font-bold dark:text-blue-300 text-blue-800 flex items-center gap-1.5">
              <Brain className="w-4 h-4 text-blue-500" />
              Adaptive Interview Memory
            </h4>
            <p className="dark:text-slate-300 text-slate-600 leading-relaxed text-[11px]">
              Every candidate answer is saved into Breeth Memory API. Gemini AI evaluates answer technical depth and adjusts follow-up difficulty in real time.
            </p>
          </div>
        </div>

        {/* RIGHT MAIN VIEW PANE (8 Cols) - CONVERSATIONAL CHAT BUBBLES */}
        <div className="lg:col-span-8 space-y-4">
          <div className="p-5 rounded-2xl dark:bg-white/5 bg-white dark:border-white/15 border-slate-200 border backdrop-blur-xl shadow-xl space-y-6 min-h-[500px] flex flex-col justify-between">

            {/* Conversation Stream */}
            <div className="space-y-6 overflow-y-auto max-h-[550px] pr-2">

              {/* Welcome Interviewer Message */}
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-md shadow-blue-500/20">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold dark:text-white text-slate-900">ABTalks Senior AI Interviewer</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full dark:bg-blue-500/20 bg-blue-100 dark:text-blue-300 text-blue-700 font-semibold">Gemini 3.6 Flash</span>
                  </div>
                  <div className="p-4 rounded-2xl rounded-tl-none dark:bg-blue-950/40 bg-blue-50/80 dark:border-blue-500/30 border-blue-200 border dark:text-slate-100 text-slate-800 text-xs leading-relaxed space-y-2">
                    <p>
                      Hello <strong>{selectedCandidate.name}</strong>! Welcome to your ABTalks AI Cohort Enterprise Technical Interview.
                    </p>
                    <p className="dark:text-slate-300 text-slate-600">
                      I have reviewed your learning journey ({selectedCandidate.completedDays.length} completed missions). I will evaluate your knowledge across 8 technical questions, probing deep into system architecture, code implementation, and design trade-offs.
                    </p>
                  </div>
                </div>
              </div>

              {/* Past Transcript History Turns */}
              {session.transcript.map((record, index) => (
                <React.Fragment key={index}>
                  {/* AI Question */}
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-md shadow-blue-500/20">
                      <Bot className="w-5 h-5" />
                    </div>
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold dark:text-white text-slate-900">
                          Question {record.questionNumber} (Day {record.day} - {record.topic})
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold dark:bg-purple-500/20 bg-purple-50 dark:text-purple-300 text-purple-700 dark:border-purple-500/30 border-purple-200 border">
                          {record.difficulty}
                        </span>
                      </div>
                      <div className="p-4 rounded-2xl rounded-tl-none dark:bg-white/5 bg-slate-100 dark:border-white/10 border-slate-200 border dark:text-white text-slate-900 text-xs font-semibold leading-relaxed">
                        {record.questionText}
                      </div>
                    </div>
                  </div>

                  {/* Candidate Answer Bubble */}
                  <div className="flex items-start gap-3 flex-row-reverse">
                    <img
                      src={selectedCandidate.avatar}
                      alt={selectedCandidate.name}
                      className="w-9 h-9 rounded-xl object-cover ring-2 ring-blue-500/40 shrink-0"
                    />
                    <div className="space-y-2 flex-1 max-w-[85%] text-right">
                      <span className="text-xs font-bold dark:text-slate-300 text-slate-700">
                        {selectedCandidate.name}&apos;s Answer
                      </span>
                      <div className="p-4 rounded-2xl rounded-tr-none bg-gradient-to-br from-blue-600 to-indigo-700 text-white text-xs text-left whitespace-pre-wrap leading-relaxed shadow-lg shadow-indigo-500/10">
                        {record.candidateAnswer}
                      </div>
                    </div>
                  </div>

                  {/* AI Examiner Evaluation Feedback Bubble */}
                  <div className="p-4 rounded-xl dark:bg-blue-500/10 bg-blue-50/80 dark:border-blue-500/20 border-blue-200 border text-xs space-y-2 ml-12">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold dark:text-blue-300 text-blue-800 flex items-center gap-1.5">
                        <FileCheck className="w-4 h-4 text-blue-500" />
                        Evaluation Result
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                        record.score >= 80 ? 'dark:bg-emerald-500/20 bg-emerald-100 dark:text-emerald-300 text-emerald-800' :
                        record.score >= 60 ? 'dark:bg-blue-500/20 bg-blue-100 dark:text-blue-300 text-blue-800' :
                        'dark:bg-amber-500/20 bg-amber-100 dark:text-amber-300 text-amber-800'
                      }`}>
                        Score: {record.score}% ({record.evaluationLabel})
                      </span>
                    </div>
                    <p className="dark:text-slate-200 text-slate-700">{record.feedback}</p>
                  </div>
                </React.Fragment>
              ))}

              {/* CURRENT ACTIVE QUESTION BUBBLE */}
              {currentQ && (
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-blue-500/30 animate-pulse">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold dark:text-white text-slate-900">
                          Active Question {currentQNum} of {session.totalQuestions}
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold dark:bg-blue-500/20 bg-blue-50 dark:text-blue-300 text-blue-700 dark:border-blue-500/30 border-blue-200 border">
                          Day {currentQ.day}: {currentQ.topic}
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold dark:bg-amber-500/20 bg-amber-50 dark:text-amber-300 text-amber-700 dark:border-amber-500/30 border-amber-200 border">
                        {currentQ.difficulty || 'Medium'}
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl rounded-tl-none dark:bg-white/10 bg-slate-50 dark:border-white/20 border-slate-300 border dark:text-white text-slate-900 text-xs font-semibold leading-relaxed shadow-md">
                      {currentQ.questionText}
                    </div>
                  </div>
                </div>
              )}

              <div ref={chatBottomRef} />
            </div>

            {/* INTERACTIVE ANSWER INPUT FORM */}
            <form onSubmit={handleSubmit} className="pt-4 dark:border-white/10 border-slate-200 border-t space-y-3">
              {/* Toolbar */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleInsertCodeSnippet}
                    className="px-3 py-1.5 rounded-xl dark:bg-white/10 bg-slate-100 dark:border-white/15 border-slate-200 border dark:hover:bg-white/20 hover:bg-slate-200 dark:text-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Code className="w-3.5 h-3.5 text-blue-500" />
                    <span>+ Code Snippet</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleInsertDiagram}
                    className="px-3 py-1.5 rounded-xl dark:bg-white/10 bg-slate-100 dark:border-white/15 border-slate-200 border dark:hover:bg-white/20 hover:bg-slate-200 dark:text-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-purple-500" />
                    <span>+ Architecture Flow</span>
                  </button>
                </div>

                <span className="text-[11px] dark:text-slate-400 text-slate-500 font-mono">
                  {answerInput.length} chars
                </span>
              </div>

              {/* Textarea */}
              <textarea
                value={answerInput}
                onChange={(e) => setAnswerInput(e.target.value)}
                placeholder="Type candidate's technical response here... Be thorough and include architectural trade-offs, vector similarity formulas, or Python code snippets..."
                rows={5}
                className="w-full p-4 rounded-xl dark:bg-[#030712]/90 bg-white dark:border-white/20 border-slate-300 border dark:text-white text-slate-900 text-xs font-sans placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-y shadow-inner"
              />

              {/* Action Submit */}
              <div className="flex items-center justify-between">
                <p className="text-[11px] dark:text-slate-400 text-slate-500">
                  Evaluated via Gemini 3.6 Flash &amp; saved to Breeth Memory API
                </p>

                <button
                  type="submit"
                  disabled={!answerInput.trim() || isLoading}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 border border-white/20 text-white font-bold text-xs shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 transition-all cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Gemini AI Evaluating...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Candidate Answer</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
