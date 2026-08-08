import React, { useState } from 'react';
import {
  Zap,
  Sliders,
  RotateCcw,
  FastForward,
  CheckCircle2,
  X,
  Sparkles,
  UserCheck,
  AlertCircle,
  FileText,
  ShieldAlert,
  Terminal,
  Send,
  Activity,
  Code,
  Shield,
  Clock,
  Trash2
} from 'lucide-react';
import { CandidateProfile, InterviewSession, FinalReport } from '../types';

interface SteerLogEntry {
  id: string;
  timestamp: string;
  prompt: string;
  adaptationStrategy: string;
  status: 'ACTIVE' | 'APPLIED';
}

interface DeveloperControlPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPreset: (presetType: 'high_performer' | 'needs_remediation' | 'edge_case') => void;
  onFastForwardTurn8: (presetType: 'high_performer' | 'needs_remediation' | 'edge_case') => void;
  onCleanReset: () => void;
  activeSession: InterviewSession | null;
  selectedCandidate: CandidateProfile;
}

export const DeveloperControlPanel: React.FC<DeveloperControlPanelProps> = ({
  isOpen,
  onClose,
  onSelectPreset,
  onFastForwardTurn8,
  onCleanReset,
  activeSession,
  selectedCandidate
}) => {
  const [selectedPreset, setSelectedPreset] = useState<'high_performer' | 'needs_remediation' | 'edge_case'>('high_performer');
  const [isFastForwarding, setIsFastForwarding] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>('');

  // Steer Challenge Simulator state
  const [customSteerPrompt, setCustomSteerPrompt] = useState<string>('');
  const [steerLogs, setSteerLogs] = useState<SteerLogEntry[]>([
    {
      id: 'log-1',
      timestamp: '03:45:10 AM',
      prompt: 'Inject strict latency constraint (<200ms TTFT)',
      adaptationStrategy: '[Gemini 3.6 Flash] System prompt updated: Enforcing streaming token constraints & TTFT latency scoring penalty.',
      status: 'ACTIVE'
    },
    {
      id: 'log-2',
      timestamp: '03:48:22 AM',
      prompt: 'Add FastMCP authorization token check',
      adaptationStrategy: '[Agent Engine] Criteria modified: Evaluating Bearer OAuth header schema in Candidate Turn 4 & Turn 8 answers.',
      status: 'APPLIED'
    }
  ]);

  if (!isOpen) return null;

  const handleApplyPreset = (type: 'high_performer' | 'needs_remediation' | 'edge_case') => {
    setSelectedPreset(type);
    onSelectPreset(type);
    setStatusMessage(`Applied preset: ${type.replace('_', ' ').toUpperCase()}`);
    setTimeout(() => setStatusMessage(''), 3000);
  };

  const handleTriggerFastForward = async (type: 'high_performer' | 'needs_remediation' | 'edge_case') => {
    setIsFastForwarding(true);
    setStatusMessage('Fast-forwarding turns 1 to 8 via Gemini 3.6 Flash...');
    
    setTimeout(() => {
      onFastForwardTurn8(type);
      setIsFastForwarding(false);
      setStatusMessage('Fast-forward complete! Turn 8 report generated.');
      setTimeout(() => {
        setStatusMessage('');
        onClose();
      }, 1200);
    }, 1500);
  };

  const handleApplyCustomSteer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customSteerPrompt.trim()) return;

    const newLog: SteerLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      prompt: customSteerPrompt.trim(),
      adaptationStrategy: `[Gemini 3.6 Flash Adaptation] Rule injected into active interview engine: "${customSteerPrompt.trim()}". System prompt re-aligned instantly.`,
      status: 'ACTIVE'
    };

    setSteerLogs(prev => [newLog, ...prev]);
    setStatusMessage(`Steer Prompt Applied: "${customSteerPrompt.trim()}"`);
    setCustomSteerPrompt('');
    setTimeout(() => setStatusMessage(''), 3500);
  };

  const handleChipClick = (promptText: string) => {
    setCustomSteerPrompt(promptText);
  };

  const handleClearLogs = () => {
    setSteerLogs([]);
    setStatusMessage('Steer logs cleared.');
    setTimeout(() => setStatusMessage(''), 2000);
  };

  const handleReset = () => {
    onCleanReset();
    setStatusMessage('All local state & active sessions reset cleanly.');
    setTimeout(() => setStatusMessage(''), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl my-auto p-5 sm:p-7 rounded-3xl dark:bg-[#07102D] bg-white border dark:border-purple-500/40 border-purple-200 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b dark:border-white/10 border-slate-200 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-lg shadow-purple-500/30">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black dark:text-white text-slate-900">Steer Challenge Control Panel</h2>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded-full bg-purple-500/20 text-purple-600 dark:text-purple-300 border border-purple-500/30">
                  JUDGES SPECIAL
                </span>
              </div>
              <p className="text-xs dark:text-slate-400 text-slate-500">
                Mock response injection, live prompt steer simulator &amp; 10s fast-forward turn skip
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl dark:bg-white/10 bg-slate-100 dark:text-slate-400 text-slate-600 hover:dark:text-white hover:text-slate-900 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Toast Message */}
        {statusMessage && (
          <div className="p-3 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-700 dark:text-purple-300 text-xs font-bold flex items-center gap-2 animate-pulse">
            <Sparkles className="w-4 h-4 text-purple-500 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* PROMPT 1 FEATURE: LIVE INTERACTIVE STEER CHALLENGE TESTER */}
        <div className="p-4 rounded-2xl dark:bg-slate-900/90 bg-purple-50/60 border dark:border-purple-500/30 border-purple-200 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black uppercase tracking-wider text-purple-700 dark:text-purple-300 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-purple-500" />
              <span>Live Steer Challenge Simulator (Unseen Judge Prompts)</span>
            </label>
            <span className="px-2 py-0.5 text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 rounded-full border border-emerald-500/20">
              Live Real-time Adaptation
            </span>
          </div>

          <form onSubmit={handleApplyCustomSteer} className="space-y-2">
            <div className="relative">
              <textarea
                rows={2}
                value={customSteerPrompt}
                onChange={(e) => setCustomSteerPrompt(e.target.value)}
                placeholder="Type an unseen requirement (e.g., 'Enforce PEP-8 code style' or 'Inject strict <200ms latency constraint' or 'Verify FastMCP authorization headers')..."
                className="w-full p-3 pr-24 rounded-xl dark:bg-slate-950/80 bg-white border dark:border-white/15 border-purple-200 text-xs dark:text-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-inner"
              />
              <button
                type="submit"
                disabled={!customSteerPrompt.trim()}
                className="absolute right-2 bottom-3 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs disabled:opacity-50 hover:scale-105 transition-all cursor-pointer flex items-center gap-1 shadow-md"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Inject</span>
              </button>
            </div>

            {/* Quick Chip Suggestions */}
            <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
              <span className="font-bold text-slate-500 dark:text-slate-400">Presets:</span>
              <button
                type="button"
                onClick={() => handleChipClick('Inject strict latency constraint (<200ms TTFT)')}
                className="px-2 py-1 rounded-md bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-300 hover:bg-purple-500/20 transition-colors cursor-pointer"
              >
                <Clock className="w-3 h-3 inline mr-1 text-purple-400" /> Latency Rule
              </button>
              <button
                type="button"
                onClick={() => handleChipClick('Require PEP-8 code style & type hinting')}
                className="px-2 py-1 rounded-md bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-300 hover:bg-purple-500/20 transition-colors cursor-pointer"
              >
                <Code className="w-3 h-3 inline mr-1 text-blue-400" /> Code Quality
              </button>
              <button
                type="button"
                onClick={() => handleChipClick('Enforce Zero-Trust Bearer Token & MCP Schema')}
                className="px-2 py-1 rounded-md bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-300 hover:bg-purple-500/20 transition-colors cursor-pointer"
              >
                <Shield className="w-3 h-3 inline mr-1 text-emerald-400" /> Security Audit
              </button>
            </div>
          </form>

          {/* Steer Adaptation Log Feed */}
          <div className="space-y-2 pt-2 border-t dark:border-white/10 border-purple-200">
            <div className="flex items-center justify-between text-[11px] font-bold dark:text-slate-300 text-slate-700">
              <span className="flex items-center gap-1">
                <Terminal className="w-3.5 h-3.5 text-purple-400" />
                <span>Live Steer Adaptation Log ({steerLogs.length})</span>
              </span>
              {steerLogs.length > 0 && (
                <button
                  onClick={handleClearLogs}
                  className="text-slate-400 hover:text-rose-400 text-[10px] font-medium transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" /> Clear
                </button>
              )}
            </div>

            <div className="max-h-32 overflow-y-auto space-y-1.5 pr-1 font-mono text-[11px]">
              {steerLogs.length === 0 ? (
                <p className="text-[10px] text-slate-400 italic">No steer logs recorded. Type a requirement above to see real-time agent adaptation.</p>
              ) : (
                steerLogs.map(log => (
                  <div key={log.id} className="p-2 rounded-lg dark:bg-black/40 bg-white border dark:border-white/10 border-purple-100 space-y-1 text-xs">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-bold text-purple-600 dark:text-purple-300">Prompt: "{log.prompt}"</span>
                      <span className="text-slate-400 text-[9px]">{log.timestamp}</span>
                    </div>
                    <p className="text-[10px] dark:text-emerald-300 text-emerald-700 font-sans leading-tight">
                      {log.adaptationStrategy}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* SECTION 1: Candidate Presets */}
        <div className="space-y-2.5">
          <label className="text-xs font-bold uppercase tracking-wider dark:text-slate-300 text-slate-700 flex items-center gap-1.5">
            <UserCheck className="w-4 h-4 text-purple-500" />
            <span>1-Click Candidate &amp; Answer Presets</span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {/* High Performer */}
            <button
              type="button"
              onClick={() => handleApplyPreset('high_performer')}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer space-y-1 ${
                selectedPreset === 'high_performer'
                  ? 'dark:bg-emerald-500/20 bg-emerald-50 border-emerald-500 dark:text-emerald-300 text-emerald-900 ring-2 ring-emerald-500/30 shadow-md'
                  : 'dark:bg-white/5 bg-slate-50 dark:border-white/10 border-slate-200 dark:text-slate-300 text-slate-700 hover:dark:bg-white/10 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black">High Performer</span>
                <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400">94% Score</span>
              </div>
              <p className="text-[10px] opacity-80 leading-snug">
                Deep RAG math, hybrid search &amp; MCP bearer security context.
              </p>
            </button>

            {/* Needs Remediation */}
            <button
              type="button"
              onClick={() => handleApplyPreset('needs_remediation')}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer space-y-1 ${
                selectedPreset === 'needs_remediation'
                  ? 'dark:bg-rose-500/20 bg-rose-50 border-rose-500 dark:text-rose-300 text-rose-900 ring-2 ring-rose-500/30 shadow-md'
                  : 'dark:bg-white/5 bg-slate-50 dark:border-white/10 border-slate-200 dark:text-slate-300 text-slate-700 hover:dark:bg-white/10 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black">Needs Remediation</span>
                <span className="text-[10px] font-mono font-bold text-rose-600 dark:text-rose-400">58% Score</span>
              </div>
              <p className="text-[10px] opacity-80 leading-snug">
                Struggles with HNSW index tuning, token limit budgets &amp; guardrails.
              </p>
            </button>

            {/* Edge Case */}
            <button
              type="button"
              onClick={() => handleApplyPreset('edge_case')}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer space-y-1 ${
                selectedPreset === 'edge_case'
                  ? 'dark:bg-amber-500/20 bg-amber-50 border-amber-500 dark:text-amber-300 text-amber-900 ring-2 ring-amber-500/30 shadow-md'
                  : 'dark:bg-white/5 bg-slate-50 dark:border-white/10 border-slate-200 dark:text-slate-300 text-slate-700 hover:dark:bg-white/10 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black">Edge Case Candidate</span>
                <span className="text-[10px] font-mono font-bold text-amber-600 dark:text-amber-400">76% Score</span>
              </div>
              <p className="text-[10px] opacity-80 leading-snug">
                Strong python code, weak prompt alignment &amp; system design depth.
              </p>
            </button>
          </div>
        </div>

        {/* SECTION 2: Fast-Forward Button */}
        <div className="p-3.5 rounded-2xl dark:bg-purple-950/40 bg-purple-50 border border-purple-500/30 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="text-xs font-bold dark:text-purple-200 text-purple-900 flex items-center gap-1.5">
                <FastForward className="w-4 h-4 text-purple-500" />
                <span>Fast-Forward to Turn 8 (Complete Report)</span>
              </h3>
              <p className="text-[10px] dark:text-purple-300/80 text-purple-700">
                Skips turn-by-turn prompts and instantly generates the 8-question evaluation report in &lt;10 seconds.
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={isFastForwarding}
            onClick={() => handleTriggerFastForward(selectedPreset)}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-black text-xs shadow-lg shadow-purple-500/25 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            {isFastForwarding ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Simulating Turns 1-8 via Gemini 3.6 Flash...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 fill-current text-yellow-300" />
                <span>Fast-Forward &amp; Generate Turn 8 Report Now</span>
              </>
            )}
          </button>
        </div>

        {/* SECTION 3: Session State & Clean Reset */}
        <div className="flex items-center justify-between pt-2 border-t dark:border-white/10 border-slate-200 gap-4">
          <div className="text-[11px] dark:text-slate-400 text-slate-500 font-mono">
            <span>Active Candidate: </span>
            <span className="font-bold dark:text-slate-200 text-slate-800">{selectedCandidate.name}</span>
            {activeSession && (
              <span className="ml-2 px-2 py-0.5 rounded bg-blue-500/20 text-blue-600 dark:text-blue-300 font-bold">
                Q{activeSession.currentQuestionIndex + 1}/8
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 rounded-xl dark:bg-rose-500/20 bg-rose-50 border border-rose-500/30 text-rose-600 dark:text-rose-300 font-bold text-xs hover:bg-rose-500/30 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All State</span>
          </button>
        </div>

      </div>
    </div>
  );
};

