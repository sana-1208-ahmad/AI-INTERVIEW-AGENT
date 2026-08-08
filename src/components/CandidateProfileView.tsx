import React, { useState } from 'react';
import {
  CheckCircle,
  AlertTriangle,
  Target,
  Award,
  BookOpen,
  User,
  Users,
  Sparkles,
  ChevronRight,
  TrendingUp,
  FileCheck,
  UserPlus,
  Brain,
  ShieldCheck,
  Cpu,
  Layers,
  Server
} from 'lucide-react';
import { CandidateProfile } from '../types';
import { CandidateQuickSelector } from './CandidateQuickSelector';
import { BuildProfileModal } from './BuildProfileModal';

interface CandidateProfileViewProps {
  selectedCandidate: CandidateProfile;
  setSelectedCandidate: (candidate: CandidateProfile) => void;
  candidatesList: CandidateProfile[];
  onStartInterviewForCandidate: (candidateId: string) => void;
  onAddCandidate?: (candidate: CandidateProfile) => void;
}

export const CandidateProfileView: React.FC<CandidateProfileViewProps> = ({
  selectedCandidate,
  setSelectedCandidate,
  candidatesList,
  onStartInterviewForCandidate,
  onAddCandidate
}) => {
  const [isBuildModalOpen, setIsBuildModalOpen] = useState(false);

  const completed = selectedCandidate.completedDays.length;
  const skipped = selectedCandidate.skippedDays.length;
  const progressPct = Math.round((completed / 31) * 100);

  const signals = selectedCandidate.learningSignals || {
    ragMastery: 75,
    vectorDbProficiency: 60,
    promptEngineeringScore: 85,
    agenticAiScore: 70,
    mcpUnderstanding: 55,
    deploymentReadiness: 80
  };

  return (
    <div className="space-y-8">
      {/* View Title Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black dark:text-white text-slate-900 tracking-tight flex items-center gap-2">
            <span>Candidate Profiles &amp; Diagnostic Onboarding</span>
          </h1>
          <p className="text-xs dark:text-slate-400 text-slate-500 mt-1">
            Review candidate mission history, diagnostic learning signals, or build a custom candidate profile.
          </p>
        </div>

        <button
          onClick={() => setIsBuildModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>Build Custom Profile</span>
        </button>
      </div>

      {/* 1. CANDIDATE QUICK SELECTOR SHOWCASING CANDIDATE CARDS */}
      <CandidateQuickSelector
        candidatesList={candidatesList}
        selectedCandidate={selectedCandidate}
        onSelectCandidate={setSelectedCandidate}
        onStartInterview={onStartInterviewForCandidate}
      />

      {/* 2. SELECTED CANDIDATE DETAILED PROFILE HERO */}
      <div className="p-6 rounded-2xl dark:bg-white/5 bg-white dark:border-white/15 border-slate-200 border backdrop-blur-xl shadow-xl grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
        {/* Left Candidate Info */}
        <div className="flex items-center gap-4 lg:border-r dark:border-white/15 border-slate-200 lg:pr-6">
          <div className="relative shrink-0">
            <img
              src={selectedCandidate.avatar}
              alt={selectedCandidate.name}
              className="w-20 h-20 rounded-2xl object-cover ring-4 ring-blue-500/30 shadow-md"
            />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px] font-bold shadow-sm">
              AI
            </div>
          </div>
          <div>
            <h2 className="text-xl font-extrabold dark:text-white text-slate-900">{selectedCandidate.name}</h2>
            <p className="text-xs dark:text-slate-400 text-slate-500 mt-0.5">{selectedCandidate.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="px-2.5 py-0.5 rounded-full dark:bg-blue-500/20 bg-blue-50 dark:border-blue-500/30 border-blue-200 dark:text-blue-300 text-blue-700 text-[10px] font-bold border">
                {selectedCandidate.role}
              </span>
              <span className="px-2.5 py-0.5 rounded-full dark:bg-white/10 bg-slate-100 dark:text-slate-300 text-slate-700 text-[10px] font-bold border dark:border-white/10 border-slate-200">
                {selectedCandidate.cohort}
              </span>
            </div>
          </div>
        </div>

        {/* Center Interview Focus Tags */}
        <div className="lg:border-r dark:border-white/15 border-slate-200 lg:pr-6">
          <p className="text-xs font-bold dark:text-white text-slate-900 mb-2 flex items-center gap-1.5">
            <Target className="w-4 h-4 text-blue-500" />
            Interview Focus Areas
          </p>
          <div className="flex flex-wrap gap-1.5">
            {selectedCandidate.interviewFocus.map((focus, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-lg dark:bg-blue-500/10 bg-blue-50 dark:border-blue-500/20 border-blue-200 dark:text-blue-300 text-blue-700 text-xs font-semibold border"
              >
                {focus}
              </span>
            ))}
          </div>
        </div>

        {/* Right CTA */}
        <div className="flex flex-col items-start lg:items-end justify-center space-y-2">
          <button
            onClick={() => onStartInterviewForCandidate(selectedCandidate.id)}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 border border-white/20 text-white font-bold text-xs shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Launch Personalized Evaluation</span>
          </button>
          <p className="text-[11px] dark:text-slate-400 text-slate-500 text-center lg:text-right">
            Adapts dynamically to {selectedCandidate.name}&apos;s learning history
          </p>
        </div>
      </div>

      {/* 3. DIAGNOSTIC LEARNING SIGNALS CARD */}
      <div className="p-6 rounded-2xl dark:bg-white/5 bg-white dark:border-white/15 border-slate-200 border backdrop-blur-xl shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold dark:text-white text-slate-900 flex items-center gap-2">
            <Brain className="w-4 h-4 text-purple-500" />
            <span>Pre-Interview Diagnostic Signals &amp; Competency Vector</span>
          </h3>
          <span className="text-[11px] font-semibold dark:text-slate-400 text-slate-500">
            Computed prior to session launch
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          <div className="p-3.5 rounded-xl dark:bg-blue-500/10 bg-blue-50 dark:border-blue-500/20 border-blue-200 border text-center space-y-1">
            <p className="text-[10px] font-bold dark:text-blue-300 text-blue-700">RAG Mastery</p>
            <p className="text-xl font-black dark:text-blue-200 text-blue-800">{signals.ragMastery}%</p>
            <div className="w-full h-1.5 rounded-full dark:bg-white/10 bg-slate-200 overflow-hidden">
              <div className="h-full bg-blue-500" style={{ width: `${signals.ragMastery}%` }} />
            </div>
          </div>

          <div className="p-3.5 rounded-xl dark:bg-indigo-500/10 bg-indigo-50 dark:border-indigo-500/20 border-indigo-200 border text-center space-y-1">
            <p className="text-[10px] font-bold dark:text-indigo-300 text-indigo-700">Vector DBs</p>
            <p className="text-xl font-black dark:text-indigo-200 text-indigo-800">{signals.vectorDbProficiency}%</p>
            <div className="w-full h-1.5 rounded-full dark:bg-white/10 bg-slate-200 overflow-hidden">
              <div className="h-full bg-indigo-500" style={{ width: `${signals.vectorDbProficiency}%` }} />
            </div>
          </div>

          <div className="p-3.5 rounded-xl dark:bg-emerald-500/10 bg-emerald-50 dark:border-emerald-500/20 border-emerald-200 border text-center space-y-1">
            <p className="text-[10px] font-bold dark:text-emerald-300 text-emerald-700">Prompt Eng.</p>
            <p className="text-xl font-black dark:text-emerald-200 text-emerald-800">{signals.promptEngineeringScore}%</p>
            <div className="w-full h-1.5 rounded-full dark:bg-white/10 bg-slate-200 overflow-hidden">
              <div className="h-full bg-emerald-500" style={{ width: `${signals.promptEngineeringScore}%` }} />
            </div>
          </div>

          <div className="p-3.5 rounded-xl dark:bg-purple-500/10 bg-purple-50 dark:border-purple-500/20 border-purple-200 border text-center space-y-1">
            <p className="text-[10px] font-bold dark:text-purple-300 text-purple-700">Agentic AI</p>
            <p className="text-xl font-black dark:text-purple-200 text-purple-800">{signals.agenticAiScore}%</p>
            <div className="w-full h-1.5 rounded-full dark:bg-white/10 bg-slate-200 overflow-hidden">
              <div className="h-full bg-purple-500" style={{ width: `${signals.agenticAiScore}%` }} />
            </div>
          </div>

          <div className="p-3.5 rounded-xl dark:bg-pink-500/10 bg-pink-50 dark:border-pink-500/20 border-pink-200 border text-center space-y-1">
            <p className="text-[10px] font-bold dark:text-pink-300 text-pink-700">MCP Protocol</p>
            <p className="text-xl font-black dark:text-pink-200 text-pink-800">{signals.mcpUnderstanding}%</p>
            <div className="w-full h-1.5 rounded-full dark:bg-white/10 bg-slate-200 overflow-hidden">
              <div className="h-full bg-pink-500" style={{ width: `${signals.mcpUnderstanding}%` }} />
            </div>
          </div>

          <div className="p-3.5 rounded-xl dark:bg-amber-500/10 bg-amber-50 dark:border-amber-500/20 border-amber-200 border text-center space-y-1">
            <p className="text-[10px] font-bold dark:text-amber-300 text-amber-700">Deployment</p>
            <p className="text-xl font-black dark:text-amber-200 text-amber-800">{signals.deploymentReadiness}%</p>
            <div className="w-full h-1.5 rounded-full dark:bg-white/10 bg-slate-200 overflow-hidden">
              <div className="h-full bg-amber-500" style={{ width: `${signals.deploymentReadiness}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* 4. LEARNING PROGRESS METRICS */}
      <div className="p-6 rounded-2xl dark:bg-white/5 bg-white dark:border-white/15 border-slate-200 border backdrop-blur-xl shadow-xl space-y-4">
        <h3 className="text-sm font-bold dark:text-white text-slate-900 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-emerald-500" />
          <span>Curriculum Mastery &amp; Mission History</span>
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 items-center">
          {/* Radial Gauge */}
          <div className="col-span-2 md:col-span-1 flex flex-col items-center justify-center p-3 rounded-xl dark:bg-white/5 bg-slate-50 dark:border-white/15 border-slate-200 border">
            <div className="relative w-20 h-20">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" className="dark:stroke-white/10 stroke-slate-200" strokeWidth="10" fill="transparent" />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  className="stroke-blue-500"
                  strokeWidth="10"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - progressPct / 100)}`}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center font-black text-sm dark:text-white text-slate-900">
                {progressPct}%
              </div>
            </div>
            <span className="text-[10px] dark:text-slate-400 text-slate-500 font-medium mt-1">Completion</span>
          </div>

          <div className="p-4 rounded-xl dark:bg-emerald-500/10 bg-emerald-50 dark:border-emerald-500/20 border-emerald-200 border text-center">
            <p className="text-[11px] font-semibold dark:text-emerald-400 text-emerald-700">Missions Completed</p>
            <p className="text-2xl font-black dark:text-emerald-300 text-emerald-800 mt-1">{completed}</p>
          </div>

          <div className="p-4 rounded-xl dark:bg-amber-500/10 bg-amber-50 dark:border-amber-500/20 border-amber-200 border text-center">
            <p className="text-[11px] font-semibold dark:text-amber-400 text-amber-700">Missions Skipped</p>
            <p className="text-2xl font-black dark:text-amber-300 text-amber-800 mt-1">{skipped}</p>
          </div>

          <div className="p-4 rounded-xl dark:bg-blue-500/10 bg-blue-50 dark:border-blue-500/20 border-blue-200 border text-center">
            <p className="text-[11px] font-semibold dark:text-blue-400 text-blue-700">Interview Attempts</p>
            <p className="text-2xl font-black dark:text-blue-300 text-blue-800 mt-1">{selectedCandidate.attemptsCount}</p>
          </div>

          <div className="p-4 rounded-xl dark:bg-purple-500/10 bg-purple-50 dark:border-purple-500/20 border-purple-200 border text-center">
            <p className="text-[11px] font-semibold dark:text-purple-400 text-purple-700">Avg. Tech Score</p>
            <p className="text-2xl font-black dark:text-purple-300 text-purple-800 mt-1">{selectedCandidate.avgScore}%</p>
          </div>
        </div>
      </div>

      {/* 5. STRENGTHS & AREAS TO IMPROVE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="p-5 rounded-2xl dark:bg-white/5 bg-white dark:border-white/15 border-slate-200 border backdrop-blur-xl shadow-xl space-y-3">
          <h3 className="text-xs font-bold dark:text-emerald-400 text-emerald-700 uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            Verified Technical Strengths
          </h3>
          <ul className="space-y-2 text-xs font-medium dark:text-slate-200 text-slate-700">
            {selectedCandidate.strengths.map((str, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Areas to Improve */}
        <div className="p-5 rounded-2xl dark:bg-white/5 bg-white dark:border-white/15 border-slate-200 border backdrop-blur-xl shadow-xl space-y-3">
          <h3 className="text-xs font-bold dark:text-rose-400 text-rose-700 uppercase tracking-wider flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-rose-500" />
            Areas to Probe / Knowledge Gaps
          </h3>
          <ul className="space-y-2 text-xs font-medium dark:text-slate-200 text-slate-700">
            {selectedCandidate.areasToImprove.map((area, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">•</span>
                <span>{area}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* BUILD CUSTOM PROFILE MODAL */}
      <BuildProfileModal
        isOpen={isBuildModalOpen}
        onClose={() => setIsBuildModalOpen(false)}
        onCreateCandidate={(cand) => {
          if (onAddCandidate) {
            onAddCandidate(cand);
          }
          setSelectedCandidate(cand);
        }}
      />
    </div>
  );
};
