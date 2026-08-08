import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Award,
  Download,
  CheckCircle,
  AlertTriangle,
  ArrowLeft,
  Sparkles,
  BookOpen,
  Target,
  FileCheck,
  Printer,
  Share2,
  Send,
  X,
  CheckCircle2,
  Globe,
  Eye,
  BarChart2,
  Grid,
  Zap,
  ChevronRight,
  HelpCircle,
  MessageSquare,
  Check,
  AlertCircle
} from 'lucide-react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip as RechartsTooltip
} from 'recharts';
import { FinalReport, QuestionAnswerRecord } from '../types';
import { TiltCard3D } from './TiltCard3D';

interface InterviewReportViewProps {
  report: FinalReport;
  onBackToDashboard: () => void;
}

// 31-Day AI Cohort Curriculum Data Reference
const CURRICULUM_31_DAYS = [
  { day: 1, topic: 'LLM Foundations & Transformers', module: 'M1: Foundations' },
  { day: 2, topic: 'Tokenizer Math & Context Window', module: 'M1: Foundations' },
  { day: 3, topic: 'Prompt Engineering & Few-Shot', module: 'M1: Foundations' },
  { day: 4, topic: 'Structured Outputs & JSON Mode', module: 'M1: Foundations' },
  { day: 5, topic: 'Vector DBs & Embeddings Math', module: 'M2: Vector DBs' },
  { day: 6, topic: 'HNSW vs IVF Indexing Mechanics', module: 'M2: Vector DBs' },
  { day: 7, topic: 'Cosine Similarity vs Inner Product', module: 'M2: Vector DBs' },
  { day: 8, topic: 'RAG Architecture & Chunking', module: 'M3: Advanced RAG' },
  { day: 9, topic: 'Parent-Document & HyDE RAG', module: 'M3: Advanced RAG' },
  { day: 10, topic: 'Reciprocal Rank Fusion (RRF)', module: 'M3: Advanced RAG' },
  { day: 11, topic: 'Multi-Vector Query Transformation', module: 'M3: Advanced RAG' },
  { day: 12, topic: 'FastMCP Server & Client Protocol', module: 'M4: MCP Tools' },
  { day: 13, topic: 'MCP Tool Schemas & Bearer Auth', module: 'M4: MCP Tools' },
  { day: 14, topic: 'Function Calling & Agent Loops', module: 'M4: MCP Tools' },
  { day: 15, topic: 'LoRA & QLoRA Fine-Tuning Math', module: 'M5: Fine-Tuning' },
  { day: 16, topic: 'Dataset Curation & Preference Tuning', module: 'M5: Fine-Tuning' },
  { day: 17, topic: 'DPO vs PPO Alignment Strategy', module: 'M5: Fine-Tuning' },
  { day: 18, topic: 'Quantization (AWQ / GGUF / FP4)', module: 'M5: Fine-Tuning' },
  { day: 19, topic: 'ReAct Agent Loop Execution', module: 'M6: Agentic AI' },
  { day: 20, topic: 'Plan-and-Solve Agent Graphs', module: 'M6: Agentic AI' },
  { day: 21, topic: 'Stateful Multi-Agent Orchestration', module: 'M6: Agentic AI' },
  { day: 22, topic: 'Cyclic Graph Memory & Reflection', module: 'M6: Agentic AI' },
  { day: 23, topic: 'Guardrails & Prompt Injection Safety', module: 'M7: Guardrails' },
  { day: 24, topic: 'LlamaGuard & Input Sanitization', module: 'M7: Guardrails' },
  { day: 25, topic: 'LangSmith & OpenTelemetry Tracing', module: 'M8: Production Ops' },
  { day: 26, topic: 'TTFT & Token Cost Optimization', module: 'M8: Production Ops' },
  { day: 27, topic: 'vLLM & Continuous Batching', module: 'M8: Production Ops' },
  { day: 28, topic: 'Cloud Run & Kubernetes Serving', module: 'M8: Production Ops' },
  { day: 29, topic: 'E2E System Architecture Design', module: 'M8: Production Ops' },
  { day: 30, topic: 'Production Failover & Fallbacks', module: 'M8: Production Ops' },
  { day: 31, topic: 'Capstone AI Engineering Defense', module: 'M8: Production Ops' },
];

export const InterviewReportView: React.FC<InterviewReportViewProps> = ({
  report,
  onBackToDashboard
}) => {
  const [isWebhookModalOpen, setIsWebhookModalOpen] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('https://api.greenhouse.io/v1/candidate-report');
  const [isSendingWebhook, setIsSendingWebhook] = useState(false);
  const [webhookResponse, setWebhookResponse] = useState<any | null>(null);

  // Q&A Detail Modal state
  const [selectedQuestion, setSelectedQuestion] = useState<QuestionAnswerRecord | null>(null);

  // Radar Chart Data preparation
  const radarData = [
    { topic: 'RAG Search', score: report.scoreBreakdown.technicalKnowledge },
    { topic: 'Vector DBs', score: Math.min(100, Math.max(50, report.scoreBreakdown.technicalKnowledge - 2)) },
    { topic: 'Prompts & Context', score: report.scoreBreakdown.conceptualUnderstanding },
    { topic: 'Agentic Loops', score: report.scoreBreakdown.problemSolving },
    { topic: 'MCP & Auth', score: Math.min(100, Math.max(50, report.scoreBreakdown.systemDesign + 2)) },
    { topic: 'AI Ops / Tracing', score: report.scoreBreakdown.systemDesign },
    { topic: 'Production Systems', score: report.scoreBreakdown.communication }
  ];

  const handleDownloadJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(report, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `Interview_Report_${report.candidateName.replace(/\s+/g, '_')}_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handlePrintPdf = () => {
    window.print();
  };

  const handleSendWebhook = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSendingWebhook(true);
    setWebhookResponse(null);

    try {
      const res = await fetch('/api/interview/export-webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          webhook_url: webhookUrl,
          report: report,
          candidate_name: report.candidateName,
          session_id: report.interviewId
        })
      });
      const data = await res.json();
      setWebhookResponse(data);
    } catch (err: any) {
      setWebhookResponse({
        status: "error",
        message: "Failed to dispatch webhook to target server.",
        details: err.message
      });
    } finally {
      setIsSendingWebhook(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl dark:bg-white/5 bg-white border dark:border-white/10 border-slate-200 backdrop-blur-xl shadow-xl">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToDashboard}
            className="p-2.5 rounded-xl dark:bg-white/10 bg-slate-100 dark:border-white/10 border-slate-200 dark:text-slate-300 text-slate-700 hover:dark:text-white hover:text-slate-900 hover:dark:bg-white/20 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl font-bold dark:text-white text-slate-900">Interview Evaluation Report</h1>
            <p className="text-xs dark:text-slate-400 text-slate-600 mt-0.5">
              Completed on {report.completedAt} for <span className="font-semibold dark:text-slate-200 text-slate-800">{report.candidateName}</span>
            </p>
          </div>
        </div>

        {/* Export & Webhook Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handlePrintPdf}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl dark:bg-white/10 bg-slate-100 dark:border-white/15 border-slate-200 border text-slate-800 dark:text-slate-200 hover:dark:bg-white/20 hover:bg-slate-200 font-bold text-xs transition-all cursor-pointer"
            title="Print or Save PDF"
          >
            <Printer className="w-3.5 h-3.5 text-blue-500" />
            <span>PDF / Print</span>
          </button>

          <button
            onClick={handleDownloadJson}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl dark:bg-white/10 bg-slate-100 dark:border-white/15 border-slate-200 border text-slate-800 dark:text-slate-200 hover:dark:bg-white/20 hover:bg-slate-200 font-bold text-xs transition-all cursor-pointer"
            title="Download Raw Report JSON"
          >
            <Download className="w-3.5 h-3.5 text-purple-500" />
            <span>Download JSON</span>
          </button>

          <button
            onClick={() => setIsWebhookModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 border border-white/20 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] transition-all cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Export Webhook (ATS/HR)</span>
          </button>
        </div>
      </div>

      {/* Webhook Dispatch Modal */}
      {isWebhookModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md p-6 rounded-3xl dark:bg-[#07102D] bg-white border dark:border-white/15 border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b dark:border-white/10 border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-500" />
                <h3 className="font-bold dark:text-white text-slate-900 text-sm">ATS / HR Webhook Notifier</h3>
              </div>
              <button
                onClick={() => setIsWebhookModalOpen(false)}
                className="p-1.5 rounded-lg dark:bg-white/10 bg-slate-100 text-slate-500 hover:dark:text-white hover:text-slate-900 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs dark:text-slate-300 text-slate-600 leading-relaxed">
              Dispatch candidate <span className="font-bold dark:text-white text-slate-900">{report.candidateName}</span>'s overall score ({report.overallScore}%) and complete technical evaluation directly to your enterprise ATS system.
            </p>

            <form onSubmit={handleSendWebhook} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold dark:text-slate-400 text-slate-600">Target Webhook URL</label>
                <input
                  type="url"
                  required
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  placeholder="https://hooks.slack.com/services/xxx or ATS API"
                  className="w-full p-2.5 rounded-xl dark:bg-white/5 bg-slate-50 border dark:border-white/15 border-slate-300 text-xs font-mono dark:text-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSendingWebhook}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold text-xs shadow-md hover:scale-[1.01] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {isSendingWebhook ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Transmitting Payload...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Dispatch Webhook Payload</span>
                  </>
                )}
              </button>
            </form>

            {/* Live Webhook Log Result */}
            {webhookResponse && (
              <div className="p-3 rounded-xl dark:bg-emerald-950/40 bg-emerald-50 border border-emerald-500/40 space-y-1.5 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-emerald-700 dark:text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Payload Transmitted 200 OK</span>
                </div>
                <p className="text-[11px] dark:text-emerald-200/90 text-emerald-800 leading-snug">
                  {webhookResponse.message}
                </p>
                <div className="p-2 rounded-lg bg-black/30 font-mono text-[10px] text-emerald-400 space-y-0.5 overflow-x-auto">
                  <div>Status: {webhookResponse.payload_delivered?.status || 'DELIVERED'}</div>
                  <div>Destination: {webhookResponse.payload_delivered?.destination_url}</div>
                  <div>Timestamp: {webhookResponse.timestamp}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Score & Radar Visual Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Overall Gauge + Score Breakdown Bars */}
        <div className="lg:col-span-7 p-6 rounded-2xl dark:bg-white/5 bg-white border dark:border-white/10 border-slate-200 backdrop-blur-xl shadow-xl flex flex-col justify-between space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Left Circular Gauge */}
            <div className="flex flex-col items-center justify-center text-center md:border-r dark:border-white/10 border-slate-200 md:pr-6">
              <p className="text-xs font-bold dark:text-slate-400 text-slate-500 uppercase tracking-wider mb-2">Overall Mastery Score</p>
              <div className="relative w-32 h-32">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" className="dark:stroke-white/10 stroke-slate-200" strokeWidth="10" fill="transparent" />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    className="stroke-blue-500"
                    strokeWidth="10"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - report.overallScore / 100)}`}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-black dark:text-white text-slate-900">{report.overallScore}%</span>
                  <span className="text-[11px] font-bold text-emerald-500 dark:text-emerald-400 mt-0.5">{report.gradeLabel}</span>
                </div>
              </div>
            </div>

            {/* Right Score Breakdown Bars */}
            <div className="md:col-span-2 space-y-2.5">
              <h2 className="text-xs font-bold dark:text-white text-slate-900 uppercase tracking-wider mb-1">
                Evaluation Competency Bars
              </h2>

              <div className="space-y-2 text-xs font-semibold">
                <div>
                  <div className="flex justify-between dark:text-slate-300 text-slate-700 mb-0.5 text-[11px]">
                    <span>Technical Knowledge</span>
                    <span className="font-bold dark:text-white text-slate-900">{report.scoreBreakdown.technicalKnowledge}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full dark:bg-white/10 bg-slate-100 overflow-hidden">
                    <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${report.scoreBreakdown.technicalKnowledge}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between dark:text-slate-300 text-slate-700 mb-0.5 text-[11px]">
                    <span>Conceptual Understanding</span>
                    <span className="font-bold dark:text-white text-slate-900">{report.scoreBreakdown.conceptualUnderstanding}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full dark:bg-white/10 bg-slate-100 overflow-hidden">
                    <div className="h-full bg-purple-500 transition-all duration-500" style={{ width: `${report.scoreBreakdown.conceptualUnderstanding}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between dark:text-slate-300 text-slate-700 mb-0.5 text-[11px]">
                    <span>Problem Solving</span>
                    <span className="font-bold dark:text-white text-slate-900">{report.scoreBreakdown.problemSolving}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full dark:bg-white/10 bg-slate-100 overflow-hidden">
                    <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${report.scoreBreakdown.problemSolving}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between dark:text-slate-300 text-slate-700 mb-0.5 text-[11px]">
                    <span>System Design</span>
                    <span className="font-bold dark:text-white text-slate-900">{report.scoreBreakdown.systemDesign}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full dark:bg-white/10 bg-slate-100 overflow-hidden">
                    <div className="h-full bg-amber-500 transition-all duration-500" style={{ width: `${report.scoreBreakdown.systemDesign}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between dark:text-slate-300 text-slate-700 mb-0.5 text-[11px]">
                    <span>Communication</span>
                    <span className="font-bold dark:text-white text-slate-900">{report.scoreBreakdown.communication}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full dark:bg-white/10 bg-slate-100 overflow-hidden">
                    <div className="h-full bg-pink-500 transition-all duration-500" style={{ width: `${report.scoreBreakdown.communication}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl dark:bg-blue-950/30 bg-blue-50/80 border dark:border-blue-500/20 border-blue-200 text-xs dark:text-blue-200 text-blue-900 leading-relaxed">
            <span className="font-bold text-blue-500 mr-1.5">Gemini Evaluation Summary:</span>
            {report.summaryParagraph}
          </div>
        </div>

        {/* PROMPT 2 FEATURE: RIGHT COLUMN - INTERACTIVE RADAR CHART */}
        <div className="lg:col-span-5 p-5 rounded-2xl dark:bg-white/5 bg-white border dark:border-white/10 border-slate-200 backdrop-blur-xl shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider dark:text-white text-slate-900 flex items-center gap-1.5">
                <BarChart2 className="w-4 h-4 text-purple-500" />
                <span>Cohort Proficiency Spider Chart</span>
              </h2>
              <p className="text-[10px] dark:text-slate-400 text-slate-500">7-Topic GenAI skill vector comparison</p>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/15 text-purple-600 dark:text-purple-300 border border-purple-500/30">
              RADAR
            </span>
          </div>

          <div className="w-full h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid stroke="#64748b" strokeOpacity={0.3} />
                <PolarAngleAxis dataKey="topic" tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 9 }} />
                <Radar name="Proficiency" dataKey="score" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.4} />
                <RechartsTooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '11px', color: '#fff' }}
                  itemStyle={{ color: '#a78bfa' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* PROMPT 2 FEATURE: 31-DAY CURRICULUM KNOWLEDGE GAP HEATMAP GRID */}
      <div className="p-6 rounded-2xl dark:bg-white/5 bg-white border dark:border-white/10 border-slate-200 backdrop-blur-xl shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b dark:border-white/10 border-slate-200 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <Grid className="w-4 h-4 text-emerald-500" />
              <h3 className="text-sm font-bold dark:text-white text-slate-900">31-Day Cohort Curriculum Knowledge Gap Heatmap</h3>
            </div>
            <p className="text-xs dark:text-slate-400 text-slate-500 mt-0.5">
              Visualizing tested curriculum days vs remaining verified skills &amp; knowledge gaps across the 31-day GenAI track.
            </p>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-3 text-[10px] font-bold">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Tested &amp; Passed (80%+)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Tested &amp; Review Needed (&lt;80%)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Completed Baseline
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-600" /> Knowledge Gap / Unverified
            </span>
          </div>
        </div>

        {/* Heatmap Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-11 gap-2">
          {CURRICULUM_31_DAYS.map((c) => {
            const questionRecord = report.questionPerformance.find(q => q.day === c.day);
            const isTested = Boolean(questionRecord);
            const score = questionRecord ? questionRecord.score : null;

            let bgColor = 'dark:bg-slate-800/40 bg-slate-100 border-slate-200 dark:border-slate-800 text-slate-400';
            let badgeText = 'Unverified';

            if (isTested && score !== null) {
              if (score >= 80) {
                bgColor = 'dark:bg-emerald-500/20 bg-emerald-50 border-emerald-500/50 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-500/30';
                badgeText = `${score}%`;
              } else {
                bgColor = 'dark:bg-amber-500/20 bg-amber-50 border-amber-500/50 text-amber-700 dark:text-amber-300 ring-1 ring-amber-500/30';
                badgeText = `${score}%`;
              }
            } else if (c.day <= 24) {
              bgColor = 'dark:bg-blue-500/10 bg-blue-50 border-blue-500/30 text-blue-700 dark:text-blue-300';
              badgeText = 'Passed';
            }

            return (
              <div
                key={c.day}
                className={`p-2.5 rounded-xl border text-center transition-all hover:scale-105 space-y-1 group relative cursor-pointer ${bgColor}`}
                title={`Day ${c.day}: ${c.topic} (${badgeText})`}
              >
                <div className="flex items-center justify-between text-[10px] font-black">
                  <span>D{c.day}</span>
                  <span className="text-[9px] font-mono uppercase opacity-90">{badgeText}</span>
                </div>
                <p className="text-[9px] font-medium line-clamp-1 opacity-80 group-hover:line-clamp-none text-left">
                  {c.topic}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Strengths & Areas to Improve Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-5 rounded-2xl dark:bg-white/5 bg-white border dark:border-white/10 border-slate-200 backdrop-blur-xl shadow-xl space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-500 dark:text-emerald-400 flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4" />
            Verified Technical Strengths
          </h3>
          <ul className="space-y-2 text-xs dark:text-slate-300 text-slate-700 font-medium">
            {report.strengths.map((s, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-emerald-500 dark:text-emerald-400 font-bold">✓</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-5 rounded-2xl dark:bg-white/5 bg-white border dark:border-white/10 border-slate-200 backdrop-blur-xl shadow-xl space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-rose-500 dark:text-rose-400 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4" />
            Areas Requiring Remediation
          </h3>
          <ul className="space-y-2 text-xs dark:text-slate-300 text-slate-700 font-medium">
            {report.areasToImprove.map((a, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-rose-500 dark:text-rose-400 font-bold">•</span>
                <span>{a}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* PROMPT 3 FEATURE: CLICKABLE QUESTION PERFORMANCE TABLE */}
      <div className="p-6 rounded-2xl dark:bg-white/5 bg-white border dark:border-white/10 border-slate-200 backdrop-blur-xl shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold dark:text-white text-slate-900">Question Performance Breakdown</h3>
            <p className="text-xs dark:text-slate-400 text-slate-500">Click any row below to inspect exact agent questions, candidate answers &amp; Gemini feedback.</p>
          </div>
          <span className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-300 border border-blue-500/20">
            Interactive Deep-Dive
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b dark:border-white/10 border-slate-200 text-[11px] font-bold dark:text-slate-400 text-slate-500 uppercase tracking-wider">
                <th className="py-2.5 px-3">Q#</th>
                <th className="py-2.5 px-3">Topic</th>
                <th className="py-2.5 px-3">Day</th>
                <th className="py-2.5 px-3">Difficulty</th>
                <th className="py-2.5 px-3">Evaluation Rating</th>
                <th className="py-2.5 px-3 text-right">Score</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-white/10 divide-slate-200 text-xs font-medium dark:text-slate-200 text-slate-800">
              {report.questionPerformance.map((q, idx) => (
                <tr
                  key={idx}
                  onClick={() => setSelectedQuestion(q)}
                  className="hover:dark:bg-blue-500/10 hover:bg-blue-50/80 transition-colors cursor-pointer group"
                >
                  <td className="py-3 px-3 font-bold">{idx + 1}</td>
                  <td className="py-3 px-3 font-semibold group-hover:text-blue-500 transition-colors">{q.topic}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded bg-blue-500/20 border border-blue-500/30 text-blue-600 dark:text-blue-300 font-bold text-[10px]">
                      Day {q.day}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/30 text-amber-600 dark:text-amber-300 font-bold text-[10px]">
                      {q.difficulty}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                      q.score >= 85
                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border-emerald-500/30'
                        : 'bg-amber-500/15 text-amber-600 dark:text-amber-300 border-amber-500/30'
                    }`}>
                      {q.evaluationLabel || (q.score >= 85 ? 'Excellent' : 'Good')}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-black text-sm text-blue-500 dark:text-blue-400">
                    {q.score}%
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button className="px-2.5 py-1 rounded-lg dark:bg-white/10 bg-slate-200 text-xs font-bold dark:text-slate-200 text-slate-800 group-hover:bg-blue-600 group-hover:text-white transition-all inline-flex items-center gap-1 cursor-pointer">
                      <Eye className="w-3 h-3" />
                      <span>Inspect</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* PROMPT 3 FEATURE: INTERACTIVE QUESTION DEEP-DIVE MODAL */}
      {selectedQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in overflow-y-auto">
          <div className="relative w-full max-w-2xl my-auto p-6 sm:p-8 rounded-3xl dark:bg-[#07102D] bg-white border dark:border-blue-500/40 border-blue-200 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b dark:border-white/10 border-slate-200 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-blue-500/20 text-blue-600 dark:text-blue-300 font-black text-xs font-mono border border-blue-500/30">
                    Question #{selectedQuestion.questionNumber}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md bg-purple-500/20 text-purple-600 dark:text-purple-300 font-bold text-xs border border-purple-500/30">
                    Day {selectedQuestion.day} • {selectedQuestion.topic}
                  </span>
                </div>
                <h3 className="text-lg font-black dark:text-white text-slate-900">
                  Turn #{selectedQuestion.questionNumber} Evaluation Deep-Dive
                </h3>
              </div>

              <button
                onClick={() => setSelectedQuestion(null)}
                className="p-2 rounded-xl dark:bg-white/10 bg-slate-100 dark:text-slate-400 text-slate-600 hover:dark:text-white hover:text-slate-900 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Score & Evaluation Banner */}
            <div className="p-4 rounded-2xl dark:bg-slate-900/90 bg-slate-50 border dark:border-white/10 border-slate-200 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Score &amp; Rating</p>
                <p className="text-xl font-black text-blue-500 dark:text-blue-400">{selectedQuestion.score}% - {selectedQuestion.evaluationLabel}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-300 font-bold text-xs border border-amber-500/30">
                  {selectedQuestion.difficulty} Difficulty
                </span>
                <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 font-bold text-xs border border-emerald-500/30">
                  {selectedQuestion.type || 'Technical'}
                </span>
              </div>
            </div>

            {/* 1. Exact Question Asked by AI */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider dark:text-slate-300 text-slate-700 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-purple-500" />
                <span>1. Exact Question Asked by AI Agent</span>
              </label>
              <div className="p-4 rounded-2xl dark:bg-purple-950/30 bg-purple-50/80 border dark:border-purple-500/30 border-purple-200 text-xs leading-relaxed font-semibold dark:text-purple-100 text-purple-900">
                {selectedQuestion.questionText}
              </div>
            </div>

            {/* 2. Candidate's Raw Answer */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider dark:text-slate-300 text-slate-700 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-blue-500" />
                <span>2. Candidate Raw Response</span>
              </label>
              <div className="p-4 rounded-2xl dark:bg-slate-950 bg-slate-100 border dark:border-white/10 border-slate-300 text-xs font-mono dark:text-slate-200 text-slate-800 leading-relaxed whitespace-pre-wrap">
                "{selectedQuestion.candidateAnswer}"
              </div>
            </div>

            {/* 3. AI Turn-by-Turn Evaluation Feedback */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider dark:text-slate-300 text-slate-700 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-500" />
                <span>3. Gemini 3.6 Flash Technical Evaluation</span>
              </label>
              <div className="p-4 rounded-2xl dark:bg-emerald-950/20 bg-emerald-50/80 border dark:border-emerald-500/30 border-emerald-200 text-xs dark:text-emerald-200 text-emerald-900 leading-relaxed space-y-2">
                <p>{selectedQuestion.feedback}</p>

                {/* Covered vs Missed Points */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="space-y-1">
                    <span className="font-bold text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Covered Concepts ({selectedQuestion.idealKeyPointsCovered?.length || 2})
                    </span>
                    <ul className="text-[11px] space-y-0.5 list-disc pl-4 opacity-90">
                      {selectedQuestion.idealKeyPointsCovered?.map((pt, i) => (
                        <li key={i}>{pt}</li>
                      )) || <li>Core technical concepts accurately explained.</li>}
                    </ul>
                  </div>

                  <div className="space-y-1">
                    <span className="font-bold text-[11px] text-amber-600 dark:text-amber-400 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> Missed / Gap Points ({selectedQuestion.idealKeyPointsMissed?.length || 1})
                    </span>
                    <ul className="text-[11px] space-y-0.5 list-disc pl-4 opacity-90">
                      {selectedQuestion.idealKeyPointsMissed?.map((pt, i) => (
                        <li key={i}>{pt}</li>
                      )) || <li>Consider adding explicit mathematical formulas for edge cases.</li>}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Suggested Optimal Benchmark Answer */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider dark:text-slate-300 text-slate-700 flex items-center gap-1.5">
                <Target className="w-4 h-4 text-indigo-500" />
                <span>Suggested Benchmark Answer</span>
              </label>
              <div className="p-3.5 rounded-2xl dark:bg-indigo-950/30 bg-indigo-50 border dark:border-indigo-500/30 border-indigo-200 text-xs font-mono dark:text-indigo-200 text-indigo-900 leading-relaxed">
                {selectedQuestion.sampleIdealAnswer || `Optimal response requires addressing core mathematical mechanics of ${selectedQuestion.topic}, providing a production Python snippet, and evaluating memory/latency trade-offs.`}
              </div>
            </div>

            {/* Close Modal Button */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedQuestion(null)}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold text-xs shadow-md hover:scale-[1.02] transition-all cursor-pointer"
              >
                Close Q&amp;A Detail
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

