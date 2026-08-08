import React from 'react';
import { UserCheck, CheckCircle2, XCircle, Award, Sparkles, Play, ArrowRight, User } from 'lucide-react';
import { CandidateProfile } from '../types';

interface CandidateQuickSelectorProps {
  candidatesList: CandidateProfile[];
  selectedCandidate: CandidateProfile;
  onSelectCandidate: (candidate: CandidateProfile) => void;
  onStartInterview: (candidateId: string) => void;
}

export const CandidateQuickSelector: React.FC<CandidateQuickSelectorProps> = ({
  candidatesList,
  selectedCandidate,
  onSelectCandidate,
  onStartInterview
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold dark:text-white text-slate-900 flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-blue-500" />
            <span>Candidate Quick Selector</span>
          </h2>
          <p className="text-xs dark:text-slate-400 text-slate-500 mt-0.5">
            Select an enterprise candidate to review their mission history and launch an adaptive interview.
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full dark:bg-blue-500/10 bg-blue-50 dark:text-blue-300 text-blue-600 dark:border-white/15 border-blue-200 border">
          {candidatesList.length} Active Profiles
        </span>
      </div>

      {/* Candidate Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {candidatesList.map((cand) => {
          const isSelected = selectedCandidate.id === cand.id;
          const completedCount = cand.completedDays.length;
          const skippedCount = cand.skippedDays.length;
          const progressPct = Math.round((completedCount / 31) * 100);

          return (
            <div
              key={cand.id}
              onClick={() => onSelectCandidate(cand)}
              className={`p-4 rounded-2xl border backdrop-blur-xl transition-all cursor-pointer relative group flex flex-col justify-between ${
                isSelected
                  ? 'dark:bg-blue-900/20 bg-blue-50/80 dark:border-blue-500/50 border-blue-400 shadow-lg shadow-blue-500/10 ring-2 ring-blue-500/40'
                  : 'dark:bg-white/5 bg-white dark:border-white/15 border-slate-200 hover:dark:border-white/30 hover:border-slate-300 dark:hover:bg-white/10 hover:bg-slate-50 shadow-sm'
              }`}
            >
              <div>
                {/* Header Row: Avatar, Name, Role */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={cand.avatar}
                      alt={cand.name}
                      className="w-11 h-11 rounded-xl object-cover ring-2 dark:ring-white/20 ring-slate-300 group-hover:scale-105 transition-transform"
                    />
                    <div>
                      <h3 className="text-sm font-bold dark:text-white text-slate-900 group-hover:text-blue-500 transition-colors flex items-center gap-1.5">
                        {cand.name}
                        {isSelected && (
                          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                        )}
                      </h3>
                      <p className="text-[11px] font-medium dark:text-slate-300 text-slate-600">
                        {cand.role}
                      </p>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${
                    cand.avgScore >= 85
                      ? 'dark:bg-emerald-500/20 bg-emerald-50 text-emerald-600 dark:text-emerald-300 dark:border-emerald-500/30 border-emerald-200'
                      : cand.avgScore >= 75
                      ? 'dark:bg-blue-500/20 bg-blue-50 text-blue-600 dark:text-blue-300 dark:border-blue-500/30 border-blue-200'
                      : 'dark:bg-amber-500/20 bg-amber-50 text-amber-600 dark:text-amber-300 dark:border-amber-500/30 border-amber-200'
                  }`}>
                    {cand.avgScore}% Avg
                  </span>
                </div>

                {/* Missions Metrics: Completed vs Skipped */}
                <div className="grid grid-cols-2 gap-2 my-3">
                  <div className="p-2 rounded-xl dark:bg-emerald-500/10 bg-emerald-50/60 dark:border-emerald-500/20 border-emerald-100 border flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <div className="overflow-hidden">
                      <p className="text-[10px] dark:text-emerald-400 text-emerald-700 font-semibold truncate">Completed</p>
                      <p className="text-xs font-black dark:text-emerald-300 text-emerald-800">{completedCount} Missions</p>
                    </div>
                  </div>

                  <div className="p-2 rounded-xl dark:bg-amber-500/10 bg-amber-50/60 dark:border-amber-500/20 border-amber-100 border flex items-center gap-2">
                    <XCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <div className="overflow-hidden">
                      <p className="text-[10px] dark:text-amber-400 text-amber-700 font-semibold truncate">Skipped</p>
                      <p className="text-xs font-black dark:text-amber-300 text-amber-800">{skippedCount} Missions</p>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1 mb-3">
                  <div className="flex justify-between text-[11px]">
                    <span className="dark:text-slate-400 text-slate-500">Curriculum Progress</span>
                    <span className="font-bold dark:text-slate-200 text-slate-700">{progressPct}% ({completedCount}/31 Days)</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full dark:bg-white/10 bg-slate-200 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-300"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                </div>

                {/* Interview Focus Tags */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {cand.interviewFocus.slice(0, 2).map((focus, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md text-[10px] font-medium dark:bg-white/5 bg-slate-100 dark:text-slate-300 text-slate-600 dark:border-white/10 border-slate-200 border truncate max-w-[150px]"
                    >
                      {focus}
                    </span>
                  ))}
                  {cand.interviewFocus.length > 2 && (
                    <span className="px-1.5 py-0.5 rounded-md text-[10px] font-medium dark:bg-white/5 bg-slate-100 dark:text-slate-400 text-slate-500">
                      +{cand.interviewFocus.length - 2}
                    </span>
                  )}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-2 dark:border-white/10 border-slate-200 border-t flex items-center justify-between gap-2">
                <span className="text-[10px] font-semibold dark:text-slate-400 text-slate-500 flex items-center gap-1">
                  <Award className="w-3 h-3 text-blue-400" />
                  {cand.attemptsCount} Attempts
                </span>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onStartInterview(cand.id);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Interview</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
