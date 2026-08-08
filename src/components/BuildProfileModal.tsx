import React, { useState } from 'react';
import {
  UserPlus,
  X,
  Sparkles,
  GraduationCap,
  Briefcase,
  Target,
  Check,
  Brain,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { CandidateProfile } from '../types';
import { CURRICULUM_DATA } from '../data/curriculumData';

interface BuildProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateCandidate: (candidate: CandidateProfile) => void;
}

export const BuildProfileModal: React.FC<BuildProfileModalProps> = ({
  isOpen,
  onClose,
  onCreateCandidate
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [education, setEducation] = useState('BS Computer Science');
  const [experience, setExperience] = useState('Mid-Level (2-5 yrs)');
  const [targetRole, setTargetRole] = useState('AI Engineer');
  const [selectedDays, setSelectedDays] = useState<number[]>([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 18, 19, 20]);
  const [strengthsText, setStrengthsText] = useState('Prompt Engineering, RAG Systems, Python Async');
  const [gapsText, setGapsText] = useState('Model Context Protocol (MCP) Security, Vector DB Indexing');

  if (!isOpen) return null;

  const toggleDay = (dayNum: number) => {
    setSelectedDays(prev =>
      prev.includes(dayNum)
        ? prev.filter(d => d !== dayNum)
        : [...prev, dayNum].sort((a, b) => a - b)
    );
  };

  const handleSelectModule = (modNumber: number) => {
    const modDays = CURRICULUM_DATA.filter(c => c.module.includes(`Module ${modNumber}`)).map(c => c.day);
    setSelectedDays(prev => Array.from(new Set([...prev, ...modDays])).sort((a, b) => a - b));
  };

  const handleSelectAll = () => {
    setSelectedDays(CURRICULUM_DATA.map(c => c.day));
  };

  const handleClearAll = () => {
    setSelectedDays([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const completedDays = selectedDays.sort((a, b) => a - b);
    const skippedDays = CURRICULUM_DATA.map(c => c.day).filter(d => !completedDays.includes(d));

    // Compute Learning Signals
    const hasRag = completedDays.filter(d => [6, 7, 8, 9, 10, 11, 12].includes(d)).length;
    const hasVector = completedDays.filter(d => [7, 8, 10].includes(d)).length;
    const hasPrompt = completedDays.filter(d => [4, 5, 13].includes(d)).length;
    const hasAgent = completedDays.filter(d => [18, 19, 20, 21, 22, 23].includes(d)).length;
    const hasMcp = completedDays.filter(d => [24, 25, 26].includes(d)).length;
    const hasDeploy = completedDays.filter(d => [27, 28, 29, 30].includes(d)).length;

    const ragMastery = Math.min(100, Math.round((hasRag / 7) * 100));
    const vectorDbProficiency = Math.min(100, Math.round((hasVector / 3) * 100));
    const promptEngineeringScore = Math.min(100, Math.round((hasPrompt / 3) * 100));
    const agenticAiScore = Math.min(100, Math.round((hasAgent / 6) * 100));
    const mcpUnderstanding = Math.min(100, Math.round((hasMcp / 3) * 100));
    const deploymentReadiness = Math.min(100, Math.round((hasDeploy / 4) * 100));

    const newCandidate: CandidateProfile = {
      id: `CAND-CUSTOM-${Date.now().toString().slice(-4)}`,
      name: name.trim(),
      email: email.trim() || `${name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      avatar: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 1000)}?w=150&auto=format&fit=crop&q=80`,
      role: targetRole,
      cohort: "Custom Onboarded",
      completedDays,
      skippedDays,
      attemptsCount: 0,
      avgScore: Math.round((completedDays.length / 31) * 85 + 15),
      strengths: strengthsText.split(',').map(s => s.trim()).filter(Boolean),
      areasToImprove: gapsText.split(',').map(g => g.trim()).filter(Boolean),
      interviewFocus: [
        targetRole,
        hasRag > 3 ? "Advanced RAG" : "RAG Fundamentals",
        hasMcp > 0 ? "Model Context Protocol" : "Agentic AI"
      ],
      learningSignals: {
        ragMastery,
        vectorDbProficiency,
        promptEngineeringScore,
        agenticAiScore,
        mcpUnderstanding,
        deploymentReadiness
      }
    };

    onCreateCandidate(newCandidate);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="w-full max-w-2xl rounded-3xl dark:bg-[#0b0f19] bg-white dark:border-white/15 border-slate-200 border shadow-2xl overflow-hidden my-8 space-y-0">
        
        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
              <UserPlus className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight">Build Custom Candidate Profile</h2>
              <p className="text-xs text-blue-100">
                Onboard a new candidate &amp; compute diagnostic AI learning signals
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Row 1: Name & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold dark:text-slate-300 text-slate-700 mb-1.5">
                Candidate Full Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex Turner"
                className="w-full px-3.5 py-2.5 rounded-xl dark:bg-white/5 bg-slate-100 dark:border-white/15 border-slate-300 border text-xs font-semibold dark:text-white text-slate-900 focus:ring-2 focus:ring-blue-500/50 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold dark:text-slate-300 text-slate-700 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex.turner@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl dark:bg-white/5 bg-slate-100 dark:border-white/15 border-slate-300 border text-xs font-semibold dark:text-white text-slate-900 focus:ring-2 focus:ring-blue-500/50 outline-none"
              />
            </div>
          </div>

          {/* Row 2: Education, Experience & Target Role */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold dark:text-slate-300 text-slate-700 mb-1.5 flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5 text-blue-400" />
                <span>Education</span>
              </label>
              <select
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl dark:bg-[#030712] bg-slate-100 dark:border-white/15 border-slate-300 border text-xs font-semibold dark:text-white text-slate-900 outline-none"
              >
                <option value="BS Computer Science">BS Computer Science</option>
                <option value="MS AI & Data Science">MS AI &amp; Data Science</option>
                <option value="PhD Machine Learning">PhD Machine Learning</option>
                <option value="Coding Bootcamp Graduate">Coding Bootcamp</option>
                <option value="Self-Taught Engineer">Self-Taught Engineer</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold dark:text-slate-300 text-slate-700 mb-1.5 flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5 text-purple-400" />
                <span>Experience</span>
              </label>
              <select
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl dark:bg-[#030712] bg-slate-100 dark:border-white/15 border-slate-300 border text-xs font-semibold dark:text-white text-slate-900 outline-none"
              >
                <option value="Entry Level (0-2 yrs)">Entry Level (0-2 yrs)</option>
                <option value="Mid-Level (2-5 yrs)">Mid-Level (2-5 yrs)</option>
                <option value="Senior Lead (5-10 yrs)">Senior Lead (5-10 yrs)</option>
                <option value="Principal Architect (10+ yrs)">Principal Architect (10+ yrs)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold dark:text-slate-300 text-slate-700 mb-1.5 flex items-center gap-1">
                <Target className="w-3.5 h-3.5 text-emerald-400" />
                <span>Target Role</span>
              </label>
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl dark:bg-[#030712] bg-slate-100 dark:border-white/15 border-slate-300 border text-xs font-semibold dark:text-white text-slate-900 outline-none"
              >
                <option value="AI Engineer">AI Engineer</option>
                <option value="GenAI Systems Architect">GenAI Systems Architect</option>
                <option value="Backend Software Engineer">Backend Software Engineer</option>
                <option value="MLOps Engineer">MLOps Engineer</option>
                <option value="Full Stack AI Engineer">Full Stack AI Engineer</option>
              </select>
            </div>
          </div>

          {/* Row 3: Completed Curriculum Days Selection */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold dark:text-slate-200 text-slate-800 flex items-center gap-1.5">
                <Brain className="w-4 h-4 text-blue-500" />
                <span>Completed Curriculum Missions ({selectedDays.length}/31 Days)</span>
              </label>

              <div className="flex items-center gap-2 text-[10px] font-bold">
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors"
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectModule(1)}
                  className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 transition-colors"
                >
                  Mod 1
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectModule(2)}
                  className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30 transition-colors"
                >
                  Mod 2 (RAG)
                </button>
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Grid of 31 Days */}
            <div className="grid grid-cols-6 sm:grid-cols-10 gap-1.5 max-h-40 overflow-y-auto p-2 rounded-xl dark:bg-white/5 bg-slate-100 dark:border-white/10 border-slate-300 border">
              {CURRICULUM_DATA.map((c) => {
                const isChecked = selectedDays.includes(c.day);
                return (
                  <button
                    type="button"
                    key={c.day}
                    onClick={() => toggleDay(c.day)}
                    className={`p-1.5 rounded-lg text-[10px] font-extrabold transition-all border text-center ${
                      isChecked
                        ? 'bg-blue-600 text-white border-blue-400 shadow-sm'
                        : 'dark:bg-white/5 bg-white text-slate-500 dark:border-white/10 border-slate-200 hover:border-slate-400'
                    }`}
                    title={`Day ${c.day}: ${c.topic}`}
                  >
                    D{c.day}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Row 4: Strengths & Knowledge Gaps */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold dark:text-slate-300 text-slate-700 mb-1.5">
                Technical Strengths (Comma Separated)
              </label>
              <textarea
                value={strengthsText}
                onChange={(e) => setStrengthsText(e.target.value)}
                rows={2}
                className="w-full p-2.5 rounded-xl dark:bg-white/5 bg-slate-100 dark:border-white/15 border-slate-300 border text-xs font-semibold dark:text-white text-slate-900 outline-none resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold dark:text-slate-300 text-slate-700 mb-1.5">
                Target Areas to Probe / Gaps (Comma Separated)
              </label>
              <textarea
                value={gapsText}
                onChange={(e) => setGapsText(e.target.value)}
                rows={2}
                className="w-full p-2.5 rounded-xl dark:bg-white/5 bg-slate-100 dark:border-white/15 border-slate-300 border text-xs font-semibold dark:text-white text-slate-900 outline-none resize-none"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 dark:border-white/10 border-slate-200 border-t flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl dark:bg-white/10 bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-300 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 border border-white/20 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Compute Signals &amp; Create Profile</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
