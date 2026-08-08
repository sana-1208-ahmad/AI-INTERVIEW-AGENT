import React from 'react';
import { MessageSquare, Sparkles, ArrowRight, FileQuestion } from 'lucide-react';
import { CandidateProfile, FinalReport } from '../types';

interface MyInterviewsViewProps {
  selectedCandidate: CandidateProfile;
  interviewRecords?: FinalReport[];
  onViewReport: (id?: string) => void;
  onStartNewInterview: () => void;
}

export const MyInterviewsView: React.FC<MyInterviewsViewProps> = ({
  selectedCandidate,
  interviewRecords = [],
  onViewReport,
  onStartNewInterview
}) => {
  const hasRecords = interviewRecords && interviewRecords.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold dark:text-white text-slate-900">My Interviews</h1>
          <p className="text-xs dark:text-slate-400 text-slate-600 mt-1">
            View all past technical interview attempts and evaluation reports for {selectedCandidate.name}.
          </p>
        </div>
        <button
          onClick={onStartNewInterview}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 border border-white/20 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] transition-all cursor-pointer flex items-center gap-1.5"
        >
          <Sparkles className="w-4 h-4" />
          <span>+ Start AI Technical Interview</span>
        </button>
      </div>

      {!hasRecords ? (
        /* Clean Empty State Card */
        <div className="p-12 rounded-2xl dark:bg-white/5 bg-white border dark:border-white/10 border-slate-200 backdrop-blur-xl shadow-xl flex flex-col items-center justify-center text-center space-y-4 max-w-2xl mx-auto my-8">
          <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
            <FileQuestion className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold dark:text-white text-slate-900">
              No Interview Records Found
            </h3>
            <p className="text-xs dark:text-slate-400 text-slate-600 max-w-md mx-auto leading-relaxed">
              No interview records found. Start an AI Technical Interview to view performance analytics.
            </p>
          </div>
          <button
            onClick={onStartNewInterview}
            className="mt-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white font-bold text-xs shadow-md shadow-blue-500/20 hover:scale-[1.02] transition-all cursor-pointer flex items-center gap-2"
          >
            <span>Start Technical Interview Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        /* Real Interview Records Table */
        <div className="p-6 rounded-2xl dark:bg-white/5 bg-white border dark:border-white/10 border-slate-200 backdrop-blur-xl shadow-xl space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b dark:border-white/10 border-slate-200 text-[11px] font-bold dark:text-slate-400 text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Candidate / Session</th>
                  <th className="py-3 px-4">Completed Date</th>
                  <th className="py-3 px-4">Overall Score</th>
                  <th className="py-3 px-4">Grade</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-white/10 divide-slate-200 text-xs font-semibold dark:text-slate-200 text-slate-800">
                {interviewRecords.map((item) => (
                  <tr key={item.interviewId} className="hover:dark:bg-white/5 hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-4 font-bold dark:text-white text-slate-900 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-blue-500" />
                      <span>{item.candidateName} - Technical Session</span>
                    </td>
                    <td className="py-4 px-4 dark:text-slate-400 text-slate-600">{item.completedAt}</td>
                    <td className="py-4 px-4 font-black text-blue-500">{item.overallScore}%</td>
                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-500 dark:text-blue-300 text-[11px] font-bold">
                        {item.gradeLabel}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => onViewReport(item.interviewId)}
                        className="px-3 py-1.5 rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-600 dark:text-blue-300 font-bold hover:bg-blue-500/30 transition-colors cursor-pointer"
                      >
                        View Report
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

