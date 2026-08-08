import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users,
  Activity,
  Award,
  Sparkles,
  Search,
  ChevronDown,
  Play,
  TrendingUp,
  FileText,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  UserCheck,
  Zap,
  Filter,
  ExternalLink,
  Cpu,
  ShieldCheck,
  Server,
  Database
} from 'lucide-react';
import { CandidateProfile, FinalReport } from '../types';
import { TiltCard3D } from './TiltCard3D';

interface DashboardViewProps {
  selectedCandidate: CandidateProfile;
  setSelectedCandidate?: (candidate: CandidateProfile) => void;
  candidatesList?: CandidateProfile[];
  interviewRecords?: FinalReport[];
  onStartInterview: (candidateId?: string) => void;
  onViewReport: (reportId?: string) => void;
  onNavigateToCurriculum: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  selectedCandidate,
  setSelectedCandidate,
  candidatesList = [],
  interviewRecords = [],
  onStartInterview,
  onViewReport,
  onNavigateToCurriculum
}) => {
  // Dropdown open & search state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close candidate dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter candidates by search term
  const filteredCandidates = candidatesList.filter((cand) =>
    cand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cand.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cand.interviewFocus.some((f) => f.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Default initial recent evaluations table seed data
  const defaultEvaluations = [
    {
      id: 'intv-001',
      candidateName: 'Alex Chen',
      candidateAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      role: 'GenAI Systems Engineer',
      candidateId: candidatesList[0]?.id || 'cand-1',
      daysCovered: '4 Days (Days 12, 18, 24, 28)',
      score: 88,
      gradeLabel: 'Excellent',
      status: 'Completed',
      evaluatedAt: '2 hours ago'
    },
    {
      id: 'intv-002',
      candidateName: 'Sarah Lin',
      candidateAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      role: 'Senior LLM Architect',
      candidateId: candidatesList[1]?.id || 'cand-2',
      daysCovered: '5 Days (Days 1, 5, 10, 15, 20)',
      score: 92,
      gradeLabel: 'Top Tier',
      status: 'Completed',
      evaluatedAt: 'Yesterday at 4:15 PM'
    },
    {
      id: 'intv-003',
      candidateName: 'Marcus Vance',
      candidateAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      role: 'RAG Infrastructure Lead',
      candidateId: candidatesList[2]?.id || 'cand-3',
      daysCovered: '3 Days (Days 3, 7, 14)',
      score: 78,
      gradeLabel: 'Pass',
      status: 'Completed',
      evaluatedAt: 'May 26, 2025'
    },
    {
      id: 'intv-004',
      candidateName: 'Elena Rostova',
      candidateAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      role: 'AI Agent Security Lead',
      candidateId: candidatesList[3]?.id || 'cand-4',
      daysCovered: '4 Days (Days 2, 8, 16, 22)',
      score: 84,
      gradeLabel: 'Strong',
      status: 'In Progress',
      evaluatedAt: 'Live Session'
    }
  ];

  // Map real interview records into table format if present
  const liveTableItems = interviewRecords.map((rec) => ({
    id: rec.interviewId,
    candidateName: rec.candidateName,
    candidateAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    role: 'GenAI Technical Candidate',
    candidateId: selectedCandidate.id,
    daysCovered: rec.daysEvaluated
      ? `${rec.daysEvaluated.length} Days (${rec.daysEvaluated.map((d) => `Day ${d}`).join(', ')})`
      : '4 Days (Adaptive)',
    score: rec.overallScore,
    gradeLabel: rec.gradeLabel,
    status: 'Completed',
    evaluatedAt: rec.completedAt
  }));

  // Combine live records first, then fill with default sample records for a complete dataset
  const combinedEvaluations = [...liveTableItems, ...defaultEvaluations].slice(0, 5);

  return (
    <div className="space-y-6">
      {/* 1. TOP DASHBOARD HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b dark:border-slate-800 border-slate-200">
        <div>
          <h1 className="text-2xl font-black dark:text-white text-slate-900 tracking-tight flex items-center gap-2">
            Enterprise Interview Dashboard
          </h1>
          <p className="text-xs dark:text-slate-400 text-slate-500 mt-1">
            Real-time pipeline metrics, searchable candidate quick launch, and technical evaluation records.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full dark:bg-emerald-500/10 bg-emerald-50 text-emerald-600 dark:text-emerald-400 border dark:border-emerald-500/20 border-emerald-200 text-xs font-bold font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            AI EVALUATION ENGINE ONLINE
          </span>
        </div>
      </div>

      {/* 2. AI ENGINE MATRIX & SYSTEM PERFORMANCE STATUS */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-2xl dark:bg-slate-900/60 bg-white dark:border-slate-800 border-slate-200 border backdrop-blur-xl shadow-sm text-xs"
      >
        <div className="flex items-center gap-2.5 px-2">
          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Cpu className="w-3.5 h-3.5" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">LLM Engine</p>
            <p className="font-mono font-bold dark:text-white text-slate-900 text-[11px] flex items-center gap-1">
              Gemini 3.6 Flash
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 px-2 border-l dark:border-slate-800 border-slate-200">
          <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Database className="w-3.5 h-3.5" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Memory Index</p>
            <p className="font-mono font-bold dark:text-white text-slate-900 text-[11px]">
              Breeth Store (31 Days)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 px-2 border-l dark:border-slate-800 border-slate-200">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Activity className="w-3.5 h-3.5" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Inference TTFT</p>
            <p className="font-mono font-bold text-emerald-400 text-[11px]">
              142 ms (Real-time)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 px-2 border-l dark:border-slate-800 border-slate-200">
          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Steerability</p>
            <p className="font-mono font-bold dark:text-white text-slate-900 text-[11px]">
              FastMCP Ready
            </p>
          </div>
        </div>
      </motion.div>

      {/* 3. THREE HIGH-LEVEL METRIC KPI CARDS WITH 3D TILT */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* KPI 1: Total Active Candidates */}
        <TiltCard3D maxTiltDegrees={4}>
          <div className="p-6 rounded-2xl dark:bg-slate-800/50 bg-white dark:border-slate-700/50 border-slate-200 border backdrop-blur-xl shadow-lg hover:dark:border-slate-600 hover:border-slate-300 transition-all flex flex-col justify-between space-y-4 h-full">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider dark:text-slate-400 text-slate-500">
                Total Active Candidates
              </span>
              <div className="p-3 rounded-xl dark:bg-blue-500/20 bg-blue-50 text-blue-500 dark:border-blue-500/30 border-blue-200 border">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black dark:text-white text-slate-900 tracking-tight">128</span>
                <span className="text-xs font-bold text-emerald-500 flex items-center gap-0.5">
                  <TrendingUp className="w-3.5 h-3.5" />
                  +12% this week
                </span>
              </div>
              <p className="text-[11px] dark:text-slate-400 text-slate-500 mt-1">
                Active engineering candidates in evaluation pipeline
              </p>
            </div>
          </div>
        </TiltCard3D>

        {/* KPI 2: In-Progress Interviews */}
        <TiltCard3D maxTiltDegrees={4}>
          <div className="p-6 rounded-2xl dark:bg-slate-800/50 bg-white dark:border-slate-700/50 border-slate-200 border backdrop-blur-xl shadow-lg hover:dark:border-slate-600 hover:border-slate-300 transition-all flex flex-col justify-between space-y-4 h-full">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider dark:text-slate-400 text-slate-500">
                In-Progress Interviews
              </span>
              <div className="p-3 rounded-xl dark:bg-purple-500/20 bg-purple-50 text-purple-500 dark:border-purple-500/30 border-purple-200 border">
                <Activity className="w-5 h-5 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black dark:text-white text-slate-900 tracking-tight">14</span>
                <span className="inline-flex items-center gap-1 text-[11px] font-extrabold px-2 py-0.5 rounded-full dark:bg-emerald-500/20 bg-emerald-50 text-emerald-600 dark:text-emerald-300 border dark:border-emerald-500/30 border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Live Sessions
                </span>
              </div>
              <p className="text-[11px] dark:text-slate-400 text-slate-500 mt-1">
                Adaptive multi-turn AI interviews taking place now
              </p>
            </div>
          </div>
        </TiltCard3D>

        {/* KPI 3: Average Candidate Benchmark */}
        <TiltCard3D maxTiltDegrees={4}>
          <div className="p-6 rounded-2xl dark:bg-slate-800/50 bg-white dark:border-slate-700/50 border-slate-200 border backdrop-blur-xl shadow-lg hover:dark:border-slate-600 hover:border-slate-300 transition-all flex flex-col justify-between space-y-4 h-full">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider dark:text-slate-400 text-slate-500">
                Average Candidate Benchmark
              </span>
              <div className="p-3 rounded-xl dark:bg-emerald-500/20 bg-emerald-50 text-emerald-500 dark:border-emerald-500/30 border-emerald-200 border">
                <Award className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black dark:text-white text-slate-900 tracking-tight">84.6%</span>
                <span className="text-xs font-bold text-blue-500">
                  Top 15% Cohort
                </span>
              </div>
              <p className="text-[11px] dark:text-slate-400 text-slate-500 mt-1">
                Mean score grounded across 31-day AI engineering curriculum
              </p>
            </div>
          </div>
        </TiltCard3D>
      </div>

      {/* 3. SLEEK QUICK LAUNCH INTERVIEW BAR */}
      <div className="p-6 rounded-2xl dark:bg-slate-800/50 bg-white dark:border-slate-700/50 border-slate-200 border backdrop-blur-xl shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 text-white shadow-md">
              <Zap className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h2 className="text-sm font-bold dark:text-white text-slate-900">
                Quick Launch Technical Interview
              </h2>
              <p className="text-xs dark:text-slate-400 text-slate-500">
                Select a candidate profile from the pipeline to launch an adaptive AI interview session immediately.
              </p>
            </div>
          </div>

          <span className="hidden sm:inline-flex text-[11px] font-mono text-blue-400 dark:bg-blue-500/10 bg-blue-50 px-2.5 py-1 rounded-lg border dark:border-blue-500/20 border-blue-200">
            AUTONOMOUS PROBING ACTIVE
          </span>
        </div>

        {/* SEARCHABLE SINGLE-LINE DROPDOWN & CTA */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 pt-1">
          {/* Custom Searchable Single-line Select */}
          <div className="relative flex-1" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full px-4 py-3 rounded-xl dark:bg-slate-900/90 bg-slate-50 dark:border-slate-700 border-slate-300 border hover:dark:border-blue-500/60 hover:border-blue-400 text-left transition-all flex items-center justify-between gap-3 shadow-inner cursor-pointer"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <img
                  src={selectedCandidate.avatar}
                  alt={selectedCandidate.name}
                  className="w-8 h-8 rounded-lg object-cover ring-2 ring-blue-500/40 shrink-0"
                />
                <div className="truncate">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold dark:text-white text-slate-900">{selectedCandidate.name}</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md dark:bg-blue-500/20 bg-blue-100 dark:text-blue-300 text-blue-700 border dark:border-blue-500/30 border-blue-200">
                      {selectedCandidate.role}
                    </span>
                  </div>
                  <p className="text-[11px] dark:text-slate-400 text-slate-500 truncate">
                    Focus: {selectedCandidate.interviewFocus.join(', ')}
                  </p>
                </div>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Panel */}
            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 z-50 rounded-2xl dark:bg-slate-900 bg-white dark:border-slate-700 border-slate-200 border shadow-2xl p-3 space-y-2 max-h-72 overflow-y-auto backdrop-blur-2xl">
                {/* Search Input Field */}
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search candidate by name, role, or skill..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl dark:bg-slate-800 bg-slate-100 dark:border-slate-700 border-slate-200 border text-xs dark:text-white text-slate-900 focus:outline-none focus:border-blue-500"
                    autoFocus
                  />
                </div>

                {/* Candidate List */}
                <div className="space-y-1">
                  {filteredCandidates.length === 0 ? (
                    <p className="text-xs text-center text-slate-400 py-3">No candidates found matching search.</p>
                  ) : (
                    filteredCandidates.map((cand) => {
                      const isSelected = selectedCandidate.id === cand.id;
                      return (
                        <div
                          key={cand.id}
                          onClick={() => {
                            if (setSelectedCandidate) setSelectedCandidate(cand);
                            setIsDropdownOpen(false);
                          }}
                          className={`p-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-between gap-3 ${
                            isSelected
                              ? 'dark:bg-blue-600/20 bg-blue-50 dark:border-blue-500/40 border-blue-200 border'
                              : 'hover:dark:bg-slate-800 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center gap-3 overflow-hidden">
                            <img
                              src={cand.avatar}
                              alt={cand.name}
                              className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-700 shrink-0"
                            />
                            <div className="truncate">
                              <p className="text-xs font-bold dark:text-white text-slate-900">{cand.name}</p>
                              <p className="text-[10px] dark:text-slate-400 text-slate-500 truncate">{cand.role}</p>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="text-xs font-black text-emerald-500 font-mono">{cand.avgScore}%</span>
                            <span className="block text-[10px] dark:text-slate-400 text-slate-500">{cand.completedDays.length}/31 Days</span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Primary CTA Button */}
          <button
            onClick={() => onStartInterview(selectedCandidate.id)}
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white font-black text-xs sm:text-sm border border-white/20 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2.5 shrink-0"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Start Interview</span>
          </button>
        </div>
      </div>

      {/* 4. CLEAN, MINIMAL RECENT EVALUATIONS TABLE */}
      <div className="p-6 rounded-2xl dark:bg-slate-800/50 bg-white dark:border-slate-700/50 border-slate-200 border backdrop-blur-xl shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold dark:text-white text-slate-900 flex items-center gap-2">
              <FileText className="w-4.5 h-4.5 text-blue-500" />
              <span>Recent Evaluations</span>
            </h2>
            <p className="text-xs dark:text-slate-400 text-slate-500 mt-0.5">
              Summary of completed technical sessions, scores, and curriculum coverage.
            </p>
          </div>

          <button
            onClick={onNavigateToCurriculum}
            className="text-xs font-semibold text-blue-500 hover:text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Explore Curriculum</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* TABLE CONTAINER */}
        <div className="overflow-x-auto rounded-xl border dark:border-slate-700/60 border-slate-200 shadow-sm">
          <table className="w-full text-left text-xs border-collapse min-w-[960px]">
            <thead>
              <tr className="dark:bg-slate-900/80 bg-slate-100 border-b dark:border-slate-700/60 border-slate-200 text-[11px] font-bold uppercase tracking-wider dark:text-slate-400 text-slate-600">
                <th className="py-3 px-4 min-w-[200px] align-middle">Candidate Name</th>
                <th className="py-3 px-4 min-w-[210px] align-middle">Role</th>
                <th className="py-3 px-4 min-w-[180px] align-middle">Curriculum Days Covered</th>
                <th className="py-3 px-4 min-w-[120px] align-middle">Score</th>
                <th className="py-3 px-4 min-w-[130px] align-middle">Status</th>
                <th className="py-3 px-4 min-w-[120px] text-right align-middle">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y dark:divide-slate-700/50 divide-slate-200">
              {combinedEvaluations.map((row) => {
                const isCompleted = row.status === 'Completed';
                return (
                  <tr
                    key={row.id}
                    className="hover:dark:bg-slate-800/60 hover:bg-slate-50 transition-colors align-middle"
                  >
                    {/* Candidate Name & Avatar */}
                    <td className="py-3.5 px-4 font-semibold dark:text-white text-slate-900 align-middle min-w-[200px]">
                      <div className="flex items-center gap-3">
                        <img
                          src={row.candidateAvatar}
                          alt={row.candidateName}
                          className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-700/50 shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-xs dark:text-white text-slate-900 truncate whitespace-nowrap">{row.candidateName}</p>
                          <p className="text-[10px] dark:text-slate-400 text-slate-500 whitespace-nowrap font-medium">{row.evaluatedAt}</p>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="py-3.5 px-4 align-middle min-w-[210px]">
                      <span className="inline-block px-2.5 py-1 rounded-lg dark:bg-blue-500/10 bg-blue-50 dark:text-blue-300 text-blue-700 font-semibold text-[11px] border dark:border-blue-500/20 border-blue-200 whitespace-nowrap">
                        {row.role}
                      </span>
                    </td>

                    {/* Curriculum Days Covered */}
                    <td className="py-3.5 px-4 font-medium text-xs align-middle min-w-[180px]">
                      <span className="dark:text-slate-200 text-slate-700 whitespace-nowrap">{row.daysCovered}</span>
                    </td>

                    {/* Score */}
                    <td className="py-3.5 px-4 align-middle min-w-[120px]">
                      <div className="flex items-center gap-2 whitespace-nowrap">
                        <span className="font-black text-sm text-blue-500 font-mono">{row.score}%</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border whitespace-nowrap ${
                          row.score >= 85
                            ? 'dark:bg-emerald-500/20 bg-emerald-50 text-emerald-600 dark:text-emerald-300 border-emerald-500/30'
                            : 'dark:bg-blue-500/20 bg-blue-50 text-blue-600 dark:text-blue-300 border-blue-500/30'
                        }`}>
                          {row.gradeLabel}
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 align-middle min-w-[130px]">
                      {isCompleted ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full dark:bg-emerald-500/10 bg-emerald-50 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold border border-emerald-500/20 whitespace-nowrap">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                          <span>Completed</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full dark:bg-blue-500/10 bg-blue-50 text-blue-600 dark:text-blue-400 text-[11px] font-bold border border-blue-500/20 whitespace-nowrap">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping shrink-0" />
                          <span>In Progress</span>
                        </span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-right align-middle min-w-[120px]">
                      {isCompleted ? (
                        <button
                          onClick={() => onViewReport(row.id)}
                          className="px-3 py-1.5 rounded-lg dark:bg-white/10 bg-slate-100 dark:border-white/15 border-slate-200 border hover:dark:bg-white/20 hover:bg-slate-200 text-xs font-semibold dark:text-slate-200 text-slate-800 transition-all cursor-pointer inline-flex items-center gap-1 whitespace-nowrap"
                        >
                          <span>View Report</span>
                          <ExternalLink className="w-3 h-3 text-blue-400 shrink-0" />
                        </button>
                      ) : (
                        <button
                          onClick={() => onStartInterview(row.candidateId)}
                          className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs font-bold shadow-md hover:scale-[1.02] transition-all cursor-pointer inline-flex items-center gap-1 whitespace-nowrap"
                        >
                          <Play className="w-3 h-3 fill-current shrink-0" />
                          <span>Resume Interview</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
