import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { FileQuestion, Sparkles, ArrowRight } from 'lucide-react';
import { CandidateProfile, FinalReport } from '../types';

interface AnalyticsViewProps {
  selectedCandidate: CandidateProfile;
  interviewRecords?: FinalReport[];
  onStartNewInterview?: () => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  selectedCandidate,
  interviewRecords = [],
  onStartNewInterview
}) => {
  const hasRecords = interviewRecords && interviewRecords.length > 0;

  // Compute trend data from actual interview records or candidate progress
  const trendData = hasRecords
    ? interviewRecords.map((rec, index) => ({
        date: rec.completedAt.split('at')[0] || `Session #${index + 1}`,
        score: rec.overallScore
      }))
    : [];

  const completedCount = selectedCandidate.completedDays.length;
  const skippedCount = selectedCandidate.skippedDays.length;
  const notStartedCount = Math.max(0, 31 - completedCount - skippedCount);

  const pieData = [
    { name: 'Completed', value: completedCount, color: '#10b981' },
    { name: 'In Progress', value: notStartedCount, color: '#3b82f6' },
    { name: 'Skipped', value: skippedCount, color: '#f59e0b' },
  ].filter(d => d.value > 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold dark:text-white text-slate-900">Performance Analytics</h1>
          <p className="text-xs dark:text-slate-400 text-slate-600 mt-1">
            Real-time assessment scores, topic distributions, and historical learning trends for {selectedCandidate.name}.
          </p>
        </div>
        {onStartNewInterview && (
          <button
            onClick={onStartNewInterview}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white font-bold text-xs shadow-md shadow-blue-500/20 hover:scale-[1.02] transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>+ New Assessment</span>
          </button>
        )}
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
          {onStartNewInterview && (
            <button
              onClick={onStartNewInterview}
              className="mt-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white font-bold text-xs shadow-md shadow-blue-500/20 hover:scale-[1.02] transition-all cursor-pointer flex items-center gap-2"
            >
              <span>Start AI Technical Interview</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      ) : (
        /* Dynamic Recharts Grid */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Line Chart */}
          <div className="lg:col-span-2 p-6 rounded-2xl dark:bg-white/5 bg-white border dark:border-white/10 border-slate-200 backdrop-blur-xl shadow-xl space-y-4">
            <h2 className="text-sm font-bold dark:text-white text-slate-900">Historical Evaluation Trend</h2>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
                  <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(3, 7, 18, 0.9)',
                      borderColor: 'rgba(255, 255, 255, 0.15)',
                      borderRadius: '0.75rem',
                      backdropFilter: 'blur(12px)',
                      color: '#fff',
                      fontSize: '12px'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ fill: '#60a5fa', r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Curriculum Distribution Chart */}
          <div className="p-6 rounded-2xl dark:bg-white/5 bg-white border dark:border-white/10 border-slate-200 backdrop-blur-xl shadow-xl space-y-4 flex flex-col items-center justify-between">
            <h2 className="text-sm font-bold dark:text-white text-slate-900 w-full text-left">
              Curriculum Mastery Ratio
            </h2>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-1.5 w-full text-xs">
              {pieData.map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="dark:text-slate-300 text-slate-700">{item.name}</span>
                  </div>
                  <span className="font-bold dark:text-white text-slate-900">{item.value} Days</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

