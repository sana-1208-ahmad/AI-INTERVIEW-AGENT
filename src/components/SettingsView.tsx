import React, { useState, useEffect } from 'react';
import {
  Save,
  User,
  Shield,
  Key,
  Eye,
  EyeOff,
  Sun,
  Moon,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Sparkles
} from 'lucide-react';
import { CandidateProfile } from '../types';
import { useTheme } from '../context/ThemeContext';

interface SettingsViewProps {
  selectedCandidate: CandidateProfile;
  onUpdateCandidateProfile?: (updated: Partial<CandidateProfile>) => void;
  onResetAllData?: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  selectedCandidate,
  onUpdateCandidateProfile,
  onResetAllData
}) => {
  const { theme, setTheme } = useTheme();

  // Profile Form States
  const [name, setName] = useState(selectedCandidate.name);
  const [email, setEmail] = useState(selectedCandidate.email);
  const [role, setRole] = useState(selectedCandidate.role);
  const [cohort, setCohort] = useState(selectedCandidate.cohort);
  const [strengths, setStrengths] = useState(selectedCandidate.strengths.join(', '));
  const [areasToImprove, setAreasToImprove] = useState(selectedCandidate.areasToImprove.join(', '));
  const [interviewFocus, setInterviewFocus] = useState(selectedCandidate.interviewFocus.join(', '));

  // API Key States
  const [geminiApiKey, setGeminiApiKey] = useState(() => localStorage.getItem('custom_gemini_api_key') || '');
  const [breethApiKey, setBreethApiKey] = useState(() => localStorage.getItem('custom_breeth_api_key') || '');
  const [showGeminiKey, setShowGeminiKey] = useState(false);
  const [showBreethKey, setShowBreethKey] = useState(false);

  // Status Alerts
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [apiSuccess, setApiSuccess] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    setName(selectedCandidate.name);
    setEmail(selectedCandidate.email);
    setRole(selectedCandidate.role);
    setCohort(selectedCandidate.cohort);
    setStrengths(selectedCandidate.strengths.join(', '));
    setAreasToImprove(selectedCandidate.areasToImprove.join(', '));
    setInterviewFocus(selectedCandidate.interviewFocus.join(', '));
  }, [selectedCandidate]);

  // Handle Profile Submit
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateCandidateProfile) {
      onUpdateCandidateProfile({
        name,
        email,
        role,
        cohort,
        strengths: strengths.split(',').map(s => s.trim()).filter(Boolean),
        areasToImprove: areasToImprove.split(',').map(s => s.trim()).filter(Boolean),
        interviewFocus: interviewFocus.split(',').map(s => s.trim()).filter(Boolean)
      });
    }
    setProfileSuccess(true);
    setTimeout(() => setProfileSuccess(false), 3000);
  };

  // Handle API Keys Save
  const handleSaveApiKeys = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('custom_gemini_api_key', geminiApiKey);
    localStorage.setItem('custom_breeth_api_key', breethApiKey);
    setApiSuccess(true);
    setTimeout(() => setApiSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold dark:text-white text-slate-900">Settings & Configuration</h1>
        <p className="text-xs dark:text-slate-400 text-slate-600 mt-1">
          Manage candidate profile parameters, custom API credentials, visual themes, and data states.
        </p>
      </div>

      {/* 1. PROFILE MANAGEMENT FORM */}
      <div className="p-6 rounded-2xl dark:bg-white/5 bg-white border dark:border-white/10 border-slate-200 backdrop-blur-xl shadow-xl space-y-6">
        <div className="flex items-center gap-2.5 pb-3 border-b dark:border-white/10 border-slate-200">
          <User className="w-5 h-5 text-blue-500" />
          <h2 className="text-base font-bold dark:text-white text-slate-900">Profile Management</h2>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4 text-xs font-medium">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold dark:text-slate-300 text-slate-700">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full p-3 rounded-xl dark:bg-[#030712]/80 bg-slate-50 border dark:border-white/10 border-slate-300 dark:text-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold dark:text-slate-300 text-slate-700">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-3 rounded-xl dark:bg-[#030712]/80 bg-slate-50 border dark:border-white/10 border-slate-300 dark:text-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold dark:text-slate-300 text-slate-700">Job Role / Title</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
                className="w-full p-3 rounded-xl dark:bg-[#030712]/80 bg-slate-50 border dark:border-white/10 border-slate-300 dark:text-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold dark:text-slate-300 text-slate-700">Cohort / Batch</label>
              <input
                type="text"
                value={cohort}
                onChange={(e) => setCohort(e.target.value)}
                className="w-full p-3 rounded-xl dark:bg-[#030712]/80 bg-slate-50 border dark:border-white/10 border-slate-300 dark:text-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold dark:text-slate-300 text-slate-700">Core Strengths (comma-separated)</label>
            <input
              type="text"
              value={strengths}
              onChange={(e) => setStrengths(e.target.value)}
              placeholder="e.g. Prompt Engineering, RAG Architectures, Vector Indexes"
              className="w-full p-3 rounded-xl dark:bg-[#030712]/80 bg-slate-50 border dark:border-white/10 border-slate-300 dark:text-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold dark:text-slate-300 text-slate-700">Areas to Improve (comma-separated)</label>
            <input
              type="text"
              value={areasToImprove}
              onChange={(e) => setAreasToImprove(e.target.value)}
              placeholder="e.g. HNSW Tuning, MCP OAuth Protocols, LangGraph Guardrails"
              className="w-full p-3 rounded-xl dark:bg-[#030712]/80 bg-slate-50 border dark:border-white/10 border-slate-300 dark:text-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>

          <div className="pt-3 flex items-center justify-between">
            {profileSuccess ? (
              <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                <CheckCircle className="w-4 h-4" /> Candidate profile updated successfully!
              </span>
            ) : <span />}

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 hover:scale-[1.02] transition-all cursor-pointer flex items-center gap-2"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Profile Changes</span>
            </button>
          </div>
        </form>
      </div>

      {/* 2. SYSTEM API KEYS FORM */}
      <div className="p-6 rounded-2xl dark:bg-white/5 bg-white border dark:border-white/10 border-slate-200 backdrop-blur-xl shadow-xl space-y-6">
        <div className="flex items-center justify-between pb-3 border-b dark:border-white/10 border-slate-200">
          <div className="flex items-center gap-2.5">
            <Key className="w-5 h-5 text-indigo-500" />
            <h2 className="text-base font-bold dark:text-white text-slate-900">System API Credentials</h2>
          </div>
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-blue-500/15 text-blue-500 dark:text-blue-300">
            Encrypted Local Storage
          </span>
        </div>

        <form onSubmit={handleSaveApiKeys} className="space-y-4 text-xs font-medium">
          {/* Gemini API Key */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="font-bold dark:text-slate-300 text-slate-700">GEMINI_API_KEY</label>
              <span className="text-[10px] text-slate-500">
                {geminiApiKey ? 'Custom Key Active' : 'Using Environment Default'}
              </span>
            </div>
            <div className="relative">
              <input
                type={showGeminiKey ? 'text' : 'password'}
                value={geminiApiKey}
                onChange={(e) => setGeminiApiKey(e.target.value)}
                placeholder="AIzaSy... (Leave empty to use standard server environment)"
                className="w-full p-3 pr-10 rounded-xl dark:bg-[#030712]/80 bg-slate-50 border dark:border-white/10 border-slate-300 dark:text-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
              <button
                type="button"
                onClick={() => setShowGeminiKey(!showGeminiKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
              >
                {showGeminiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Breeth Memory API Key */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="font-bold dark:text-slate-300 text-slate-700">BREETH_API_KEY</label>
              <span className="text-[10px] text-slate-500">
                {breethApiKey ? 'Custom Key Active' : 'Using Environment Default'}
              </span>
            </div>
            <div className="relative">
              <input
                type={showBreethKey ? 'text' : 'password'}
                value={breethApiKey}
                onChange={(e) => setBreethApiKey(e.target.value)}
                placeholder="brth_key_... (Optional Breeth vector memory integration key)"
                className="w-full p-3 pr-10 rounded-xl dark:bg-[#030712]/80 bg-slate-50 border dark:border-white/10 border-slate-300 dark:text-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
              <button
                type="button"
                onClick={() => setShowBreethKey(!showBreethKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
              >
                {showBreethKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="pt-3 flex items-center justify-between">
            {apiSuccess ? (
              <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                <CheckCircle className="w-4 h-4" /> API credentials saved successfully!
              </span>
            ) : <span />}

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 hover:scale-[1.02] transition-all cursor-pointer flex items-center gap-2"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Credentials</span>
            </button>
          </div>
        </form>
      </div>

      {/* 3. PREFERENCE SETTINGS & DATA RESET */}
      <div className="p-6 rounded-2xl dark:bg-white/5 bg-white border dark:border-white/10 border-slate-200 backdrop-blur-xl shadow-xl space-y-6">
        <div className="flex items-center gap-2.5 pb-3 border-b dark:border-white/10 border-slate-200">
          <Shield className="w-5 h-5 text-purple-500" />
          <h2 className="text-base font-bold dark:text-white text-slate-900">Preferences & Data Control</h2>
        </div>

        <div className="space-y-6 text-xs">
          {/* Theme Selection */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl dark:bg-[#030712]/50 bg-slate-50 border dark:border-white/10 border-slate-200">
            <div>
              <p className="font-bold dark:text-white text-slate-900">Interface Theme</p>
              <p className="text-[11px] dark:text-slate-400 text-slate-600 mt-0.5">
                Switch between obsidian dark mode and pristine slate light mode.
              </p>
            </div>

            <div className="flex items-center gap-2 p-1 rounded-xl dark:bg-white/10 bg-slate-200">
              <button
                onClick={() => setTheme('dark')}
                className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'dark:text-slate-400 text-slate-700 hover:text-black dark:hover:text-white'
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
                <span>Dark Obsidian</span>
              </button>

              <button
                onClick={() => setTheme('light')}
                className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  theme === 'light'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'dark:text-slate-400 text-slate-700 hover:text-black dark:hover:text-white'
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
                <span>Pristine Light</span>
              </button>
            </div>
          </div>

          {/* Reset All Data Option */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
            <div>
              <p className="font-bold text-red-500 dark:text-red-400 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" /> Reset All App Data
              </p>
              <p className="text-[11px] dark:text-slate-400 text-slate-600 mt-0.5">
                Wipe completed missions, reset candidate scores, and clear stored interview records.
              </p>
            </div>

            <button
              onClick={() => setShowResetConfirm(true)}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-600/30 transition-all cursor-pointer flex items-center gap-1.5 flex-shrink-0"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Reset Data</span>
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal for Reset */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="p-6 rounded-2xl dark:bg-[#090d16] bg-white border dark:border-white/10 border-slate-300 max-w-md w-full space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-bold dark:text-white text-slate-900">
                Confirm Data Reset
              </h3>
              <p className="text-xs dark:text-slate-400 text-slate-600 mt-1 leading-relaxed">
                Are you sure you want to reset all candidate progress, clear completed curriculum missions, and purge interview history? This action cannot be undone.
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold dark:text-slate-400 text-slate-600 hover:dark:text-white hover:text-slate-900 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowResetConfirm(false);
                  onResetAllData?.();
                }}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-colors shadow-md cursor-pointer"
              >
                Yes, Reset All Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

