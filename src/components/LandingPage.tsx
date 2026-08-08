import React, { useState } from 'react';
import { TiltCard3D } from './TiltCard3D';
import neuralCore3dImg from '../assets/images/3d_neural_core_1786131174983.jpg';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Brain,
  Zap,
  Target,
  Award,
  BookOpen,
  Bot,
  Users,
  Code2,
  BarChart2,
  Cpu,
  Layers,
  ChevronRight,
  Menu,
  X,
  Activity,
  FileText,
  TrendingUp,
  Terminal,
  GitBranch,
  ArrowUpRight,
  Check,
  RotateCcw,
  Sliders,
  ShieldCheck,
  Compass,
  Play,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  MessageSquare
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onWatchDemo: () => void;
  onOpenTechSpec: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onGetStarted,
  onWatchDemo,
  onOpenTechSpec
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedAdaptiveState, setSelectedAdaptiveState] = useState<number>(0);
  const [activeCurriculumTab, setActiveCurriculumTab] = useState<number>(0);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [heroSkillIndex, setHeroSkillIndex] = useState<number>(0);

  const heroSkills = [
    "RAG Pipelines & Hybrid Vector Search",
    "Agentic Tool Calling & Memory",
    "Model Context Protocol (MCP)",
    "LLM Fine-Tuning & Evaluation",
    "Production AI Latency & Benchmarks"
  ];

  React.useEffect(() => {
    const timer = setInterval(() => {
      setHeroSkillIndex((prev) => (prev + 1) % heroSkills.length);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  const faqs = [
    {
      question: "What is ABTalks AI Cohort 31-Day AI Interviewer Agent?",
      answer: "ABTalks AI is an adaptive, curriculum-aware technical interview agent designed specifically for candidates in the 31-Day AI Engineering Cohort. It conducts context-driven technical interviews across LLM Architectures, RAG Systems, Fine-Tuning, Multi-Agent Systems, MCP (Model Context Protocol), and AI Evaluation."
    },
    {
      question: "How does the AI adapt its questions during the interview?",
      answer: "Unlike static quiz tools, ABTalks AI analyzes candidate context (selected track, completed curriculum days, past performance scores) and evaluates live answers in real-time. Depending on your response quality, it automatically probes deeper into edge cases, shifts difficulty, or guides you through technical trade-offs."
    },
    {
      question: "Can I test different candidate profiles or tracks?",
      answer: "Yes! The platform includes a Quick Candidate Switcher with predefined candidate personas like Rohan Sharma (RAG Specialist), Priya Patel (Fine-Tuning & Eval Engineer), or Ananya Verma (Full-Stack Agent Dev). You can also create and test custom candidate profiles with specific tracks and completed curriculum days."
    },
    {
      question: "What does the post-interview Performance Report include?",
      answer: "Upon completing an assessment, you receive a detailed breakdown featuring quantitative scores across Technical Depth, Problem Solving, AI Architecture & System Design, and Communication. It highlights key candidate strengths, identifies knowledge gaps, and provides an actionable 31-day curriculum study plan."
    },
    {
      question: "Does the platform support speech/voice audio input?",
      answer: "Yes! Candidates can answer questions using real-time voice speech-to-text input or written text. The AI processes audio transcriptions seamlessly, allowing you to practice articulate verbal technical explanations as if in a live technical screen."
    },
    {
      question: "Where can I view the technical specifications and prompt pipeline?",
      answer: "Click on 'Tech Spec' in the top bar at any time to open the Technical Specification modal, which details the 6-stage interview pipeline, system prompt design, evaluation rubrics, and JSON data schemas."
    }
  ];

  // Smooth scroll handler
  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const adaptiveStates = [
    {
      title: "Strong Answer",
      badge: "Deepening Rigor",
      color: "from-emerald-500 to-teal-600",
      candidateText: "I'd implement hybrid search combining dense BGE embeddings with BM25 sparse keyword scores using Reciprocal Rank Fusion (RRF), followed by a Cohere re-ranker stage to optimize recall within top-20 documents.",
      evalScore: 94,
      aiSignal: "Demonstrates advanced system architecture & ranking algorithm mastery.",
      nextQuestion: "Excellent logic. How would you handle index vector compression and HNSW graph memory allocation under strict 50ms latency constraints?",
      outcomeTag: "Let's go one level deeper."
    },
    {
      title: "Incomplete Answer",
      badge: "Targeting Gaps",
      color: "from-amber-500 to-orange-600",
      candidateText: "We use cosine similarity on OpenAI embeddings stored in Pinecone and fetch top 5 chunks to pass directly into the LLM prompt context window.",
      evalScore: 68,
      aiSignal: "Solid core concept, but omits chunk boundary overlap and re-ranking optimization.",
      nextQuestion: "Good baseline approach. What happens when key context spans across document chunk boundaries, and how do you mitigate context fragmentation?",
      outcomeTag: "Let's explore the missing part."
    },
    {
      title: "Weak Understanding",
      badge: "Diagnostic Scenario",
      color: "from-blue-500 to-indigo-600",
      candidateText: "We convert text to numbers using a database and query it using standard SQL SELECT statements with string matching.",
      evalScore: 42,
      aiSignal: "Confuses relational text queries with dense vector embeddings.",
      nextQuestion: "Let's approach it with a practical scenario: Imagine you have a document about 'quantum physics' and a search for 'subatomic particles'. Why wouldn't standard SQL string matching find this document, and how do vector embeddings bridge that semantic gap?",
      outcomeTag: "Let's approach it with a practical scenario."
    },
    {
      title: "Strong Reasoning",
      badge: "Production Design",
      color: "from-purple-500 to-pink-600",
      candidateText: "I'd use a hierarchical vector indexing pipeline with asynchronous embedding generation via Kafka workers, Redis cache for frequent queries, and fallback semantic cache.",
      evalScore: 91,
      aiSignal: "Exceptional production system engineering mind.",
      nextQuestion: "Impressive scaling strategy. Now, design the production architecture for continuous real-time embedding updates without locking the query index.",
      outcomeTag: "Now design the production architecture."
    }
  ];

  const curriculumModules = [
    { num: "01", title: "Prompt Engineering", desc: "Design reliable instructions, few-shot examples, and structured output schemas with LLMs.", icon: Terminal },
    { num: "02", title: "RAG Pipelines", desc: "Understand retrieval-augmented generation, chunking strategies, and grounded AI context systems.", icon: Layers },
    { num: "03", title: "Vector Databases", desc: "Work with embeddings, semantic search, similarity metrics (Cosine/Dot), and HNSW vector storage.", icon: Cpu },
    { num: "04", title: "Agentic AI", desc: "Build autonomous systems that reason, plan, execute tools, and handle multi-step tasks.", icon: Bot },
    { num: "05", title: "MCP Protocol", desc: "Connect AI systems with model context protocols, local tools, databases, and external APIs.", icon: Code2 },
    { num: "06", title: "AI Deployment", desc: "Move AI applications from local prototypes to production Cloud Run & microservices.", icon: Zap },
    { num: "07", title: "Production AI", desc: "Master evaluation frameworks, latency optimization, token budgeting, security, and fallback logic.", icon: ShieldCheck }
  ];

  return (
    <div className="min-h-screen dark:bg-[#050B24] bg-slate-50 dark:text-slate-100 text-slate-900 font-sans selection:bg-blue-500 selection:text-white relative overflow-hidden transition-colors duration-200">

      {/* BACKGROUND ORBITAL GLOWS & GRID PATTERN */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-40">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-blue-600/20 via-purple-600/10 to-transparent blur-[140px] rounded-full" />
        <div className="absolute top-[1200px] -left-40 w-[600px] h-[600px] bg-indigo-600/15 blur-[160px] rounded-full" />
        <div className="absolute top-[2800px] -right-40 w-[700px] h-[700px] bg-cyan-600/15 blur-[180px] rounded-full" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      {/* HERO SECTION */}
      <section className="relative z-10 pt-10 sm:pt-14 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
        <div className="text-center max-w-4xl mx-auto space-y-6 animate-fade-in-up">
          
          {/* Eyebrow with Animated Rotating Skill Badge */}
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-600 dark:text-blue-400 shadow-xl text-xs font-bold tracking-wider uppercase backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400 animate-pulse" />
              <span>ADAPTIVE AI TECHNICAL INTERVIEWER</span>
            </div>

            {/* Rotating Skill Animation */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full dark:bg-purple-950/60 bg-purple-100 border dark:border-purple-500/30 border-purple-300 text-purple-700 dark:text-purple-300 text-xs font-mono font-bold transition-all duration-500 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-purple-500 animate-ping" />
              <span>EVALUATING: {heroSkills[heroSkillIndex]}</span>
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] dark:text-white text-slate-900">
            Understand Your Skills.{' '}
            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-300 dark:to-purple-400 animate-gradient">
              Master Your Interview.
            </span>
          </h1>

          {/* Supporting Text */}
          <p className="text-base sm:text-xl dark:text-slate-300 text-slate-600 max-w-3xl mx-auto leading-relaxed font-normal">
            ABTalks AI turns your learning journey into a personalized technical interview experience — adapting every question to what you know, what you have learned, and where you want to go.
          </p>

          {/* Primary & Secondary CTAs */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onGetStarted}
              className="shimmer-btn flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white font-black text-sm sm:text-base border border-white/20 shadow-xl shadow-indigo-500/30 cursor-pointer"
            >
              <span>Start Your Assessment →</span>
            </button>

            <button
              onClick={() => scrollToSection('platform')}
              className="flex items-center gap-2.5 px-8 py-4 rounded-2xl dark:bg-[#0B132B]/80 bg-white border dark:border-white/15 border-slate-300 backdrop-blur-xl dark:text-slate-200 text-slate-800 font-bold text-sm sm:text-base hover:bg-slate-100 hover:dark:bg-white/10 hover:scale-[1.02] active:scale-[0.98] shadow-md transition-all cursor-pointer"
            >
              <Compass className="w-4 h-4 text-blue-500 dark:text-blue-400" />
              <span>Explore the Platform</span>
            </button>
          </div>

          {/* Trust Statement */}
          <p className="text-xs font-semibold dark:text-slate-400 text-slate-500 pt-2 flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
            <span>Built around real AI engineering skills, not random question banks.</span>
          </p>
        </div>

        {/* HERO VISUAL: 3D INTERACTIVE NEURAL CORE & CONNECTED UI NODES */}
        <div className="relative max-w-5xl mx-auto pt-6">
          <div className="relative rounded-3xl glass-panel-glow p-6 sm:p-8 shadow-2xl shadow-blue-900/40 overflow-hidden border border-white/15">
            
            {/* Ambient Background Glow behind visual core */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-gradient-to-tr from-purple-600/30 via-indigo-600/20 to-blue-500/20 blur-[100px] rounded-full pointer-events-none animate-pulse-glow" />

            {/* Top Bar Decoration */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6 relative z-10">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="text-xs font-mono text-slate-400 ml-2">ABTalks Engine // 3D Neural Evaluation Core</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-blue-400 font-mono">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span>MULTITURN_EVAL_ACTIVE</span>
              </div>
            </div>

            {/* Central Intelligence Visual Grid with 3D Animated Image */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
              
              {/* Node 1: Candidate Signal */}
              <div className="lg:col-span-3">
                <TiltCard3D maxTiltDegrees={12}>
                  <div className="p-4 rounded-2xl bg-[#020617]/90 border border-blue-500/30 space-y-3 shadow-xl hover:border-blue-400 transition-all">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold uppercase text-blue-400">01 CANDIDATE PROFILE</span>
                      <Users className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">Alex Chen</p>
                      <p className="text-xs text-slate-400">Target: GenAI Engineer</p>
                    </div>
                    <div className="space-y-1.5 pt-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-400">RAG Mastery</span>
                        <span className="text-emerald-400 font-bold">88%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-emerald-400 h-full w-[88%]" />
                      </div>
                    </div>
                  </div>
                </TiltCard3D>
              </div>

              {/* Node 2: Central 3D Animated Render Image */}
              <div className="lg:col-span-6">
                <TiltCard3D maxTiltDegrees={15} scaleOnHover={1.03}>
                  <div className="relative rounded-3xl overflow-hidden bg-[#03081c]/90 border border-blue-500/40 p-2 shadow-2xl shadow-indigo-500/30 group">
                    {/* Glowing background ambient light behind image */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 via-indigo-600/30 to-purple-600/20 blur-xl opacity-80 group-hover:opacity-100 transition-opacity" />
                    
                    {/* 3D Neural Image Container with Float Animation */}
                    <div className="relative rounded-2xl overflow-hidden border border-white/10 animate-float">
                      <img
                        src={neuralCore3dImg}
                        alt="3D AI Neural Core"
                        className="w-full h-[260px] sm:h-[300px] object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
                        referrerPolicy="no-referrer"
                      />

                      {/* Dark Gradient Overlay for readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-90" />

                      {/* Top Overlay Badge */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-[10px] font-mono font-bold uppercase tracking-widest shadow-lg">
                          <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
                          <span>3D AI NEURAL CORE</span>
                        </div>
                        <div className="px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[10px] font-mono font-bold backdrop-blur-md">
                          98.4% ACCURACY
                        </div>
                      </div>

                      {/* Bottom Overlay Info Bar */}
                      <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-black/70 backdrop-blur-md border border-white/15 flex items-center justify-between text-xs z-10 shadow-xl">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-blue-500/20 border border-blue-500/40 flex items-center justify-center">
                            <Brain className="w-4 h-4 text-blue-400" />
                          </div>
                          <div>
                            <p className="font-bold text-white text-xs">Dynamic Evaluation Engine</p>
                            <p className="text-[10px] text-slate-300 font-mono">Grounded in 31-Day Cohort Skills</p>
                          </div>
                        </div>
                        <span className="text-[11px] font-mono font-bold text-indigo-400 bg-indigo-500/20 px-2.5 py-1 rounded-lg border border-indigo-500/30">
                          3D RENDER
                        </span>
                      </div>
                    </div>
                  </div>
                </TiltCard3D>
              </div>

              {/* Node 3: AI Adaptive Output */}
              <div className="lg:col-span-3">
                <TiltCard3D maxTiltDegrees={12}>
                  <div className="p-4 rounded-2xl bg-[#020617]/90 border border-purple-500/30 space-y-3 shadow-xl hover:border-purple-400 transition-all">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold uppercase text-purple-400">02 DYNAMIC FOLLOW-UP</span>
                      <Zap className="w-4 h-4 text-purple-400" />
                    </div>
                    <p className="text-xs text-slate-200 leading-snug">
                      "Since you solved RAG chunking, how do you handle vector index re-ranking under 50ms?"
                    </p>
                    <div className="flex items-center gap-2 text-[10px] text-emerald-400 font-mono font-bold pt-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>ADAPTED FROM PREVIOUS RESPONSE</span>
                    </div>
                  </div>
                </TiltCard3D>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* SECTION 2 — WHY ABTALKS AI */}
      <section id="why-abtalks" className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-blue-500 dark:text-blue-400">WHY ABTALKS AI</span>
          <h2 className="text-3xl sm:text-5xl font-black dark:text-white text-slate-900">Your Interview Should Know You.</h2>
          <p className="dark:text-slate-300 text-slate-600 text-sm sm:text-base leading-relaxed">
            Traditional interview platforms ask everyone the same questions. ABTalks AI starts by understanding the person behind the answers.
          </p>
        </div>

        {/* 3 Large Number Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="p-8 rounded-3xl dark:bg-[#0B132B]/80 bg-white border dark:border-white/10 border-slate-200 shadow-lg hover-lift hover:border-blue-500/40 transition-all space-y-4 group backdrop-blur-xl">
            <span className="text-5xl font-black text-blue-500/30 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors font-mono">01</span>
            <h3 className="text-xl font-bold dark:text-white text-slate-900">Know Where You Stand</h3>
            <p className="dark:text-slate-300 text-slate-600 text-xs sm:text-sm leading-relaxed">
              Understand your current technical strengths, weak areas, experience level, and knowledge gaps through an intelligent assessment.
            </p>
          </div>

          <div className="p-8 rounded-3xl dark:bg-[#0B132B]/80 bg-white border dark:border-white/10 border-slate-200 shadow-lg hover-lift hover:border-indigo-500/40 transition-all space-y-4 group backdrop-blur-xl">
            <span className="text-5xl font-black text-indigo-500/30 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors font-mono">02</span>
            <h3 className="text-xl font-bold dark:text-white text-slate-900">Know Where You're Going</h3>
            <p className="dark:text-slate-300 text-slate-600 text-xs sm:text-sm leading-relaxed">
              Your target role shapes your preparation — whether you're aiming for AI Engineering, GenAI, ML, Full Stack, Backend, Data Science, or another technical career.
            </p>
          </div>

          <div className="p-8 rounded-3xl dark:bg-[#0B132B]/80 bg-white border dark:border-white/10 border-slate-200 shadow-lg hover-lift hover:border-purple-500/40 transition-all space-y-4 group backdrop-blur-xl">
            <span className="text-5xl font-black text-purple-500/30 group-hover:text-purple-500 dark:group-hover:text-purple-400 transition-colors font-mono">03</span>
            <h3 className="text-xl font-bold dark:text-white text-slate-900">Know What You've Learned</h3>
            <p className="dark:text-slate-300 text-slate-600 text-xs sm:text-sm leading-relaxed">
              Your curriculum progress, completed missions, skipped topics, attempts, and learning signals become part of your interview context.
            </p>
          </div>

        </div>
      </section>

      {/* SECTION 3 — THE JOURNEY */}
      <section id="how-it-works" className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-500 dark:text-indigo-400">THE ABTALKS JOURNEY</span>
          <h2 className="text-3xl sm:text-5xl font-black dark:text-white text-slate-900">From Learning to Interview Readiness.</h2>
          <p className="dark:text-slate-300 text-slate-600 text-sm sm:text-base leading-relaxed">
            Preparation shouldn't stop when the lesson ends. ABTalks AI connects learning, practice, assessment, and technical interviews into one continuous journey.
          </p>
        </div>

        {/* 6 Journey Stages Connected Path */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative">
          
          <div className="p-6 rounded-2xl dark:bg-[#07102D] bg-white border dark:border-white/10 border-slate-200 shadow-md hover-lift hover:border-blue-500/30 transition-all relative space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-lg bg-blue-500/20 text-blue-600 dark:text-blue-400 font-mono text-xs font-bold">01 — ASSESS</span>
              <Target className="w-5 h-5 text-blue-500 dark:text-blue-400" />
            </div>
            <p className="dark:text-slate-200 text-slate-700 text-xs sm:text-sm leading-relaxed">
              Tell us about your skills, education, experience, and career goals.
            </p>
          </div>

          <div className="p-6 rounded-2xl dark:bg-[#07102D] bg-white border dark:border-white/10 border-slate-200 shadow-md hover-lift hover:border-indigo-500/30 transition-all relative space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-mono text-xs font-bold">02 — UNDERSTAND</span>
              <Brain className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
            </div>
            <p className="dark:text-slate-200 text-slate-700 text-xs sm:text-sm leading-relaxed">
              AI analyzes your knowledge through personalized diagnostic questions.
            </p>
          </div>

          <div className="p-6 rounded-2xl dark:bg-[#07102D] bg-white border dark:border-white/10 border-slate-200 shadow-md hover-lift hover:border-purple-500/30 transition-all relative space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-600 dark:text-purple-400 font-mono text-xs font-bold">03 — LEARN</span>
              <BookOpen className="w-5 h-5 text-purple-500 dark:text-purple-400" />
            </div>
            <p className="dark:text-slate-200 text-slate-700 text-xs sm:text-sm leading-relaxed">
              Get focused learning recommendations based on your actual gaps.
            </p>
          </div>

          <div className="p-6 rounded-2xl dark:bg-[#07102D] bg-white border dark:border-white/10 border-slate-200 shadow-md hover-lift hover:border-pink-500/30 transition-all relative space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-lg bg-pink-500/20 text-pink-600 dark:text-pink-400 font-mono text-xs font-bold">04 — PRACTICE</span>
              <Code2 className="w-5 h-5 text-pink-500 dark:text-pink-400" />
            </div>
            <p className="dark:text-slate-200 text-slate-700 text-xs sm:text-sm leading-relaxed">
              Strengthen concepts through technical questions, scenarios, and hands-on challenges.
            </p>
          </div>

          <div className="p-6 rounded-2xl dark:bg-[#07102D] bg-white border dark:border-white/10 border-slate-200 shadow-md hover-lift hover:border-cyan-500/30 transition-all relative space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 font-mono text-xs font-bold">05 — INTERVIEW</span>
              <Bot className="w-5 h-5 text-cyan-500 dark:text-cyan-400" />
            </div>
            <p className="dark:text-slate-200 text-slate-700 text-xs sm:text-sm leading-relaxed">
              Enter a realistic multi-turn technical interview that adapts to every answer.
            </p>
          </div>

          <div className="p-6 rounded-2xl dark:bg-[#07102D] bg-white border dark:border-white/10 border-slate-200 shadow-md hover-lift hover:border-emerald-500/30 transition-all relative space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-mono text-xs font-bold">06 — IMPROVE</span>
              <Award className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
            </div>
            <p className="dark:text-slate-200 text-slate-700 text-xs sm:text-sm leading-relaxed">
              Receive structured feedback, skill scores, weaknesses, and your next recommended steps.
            </p>
          </div>

        </div>
      </section>

      {/* SECTION 4 — PERSONALIZATION */}
      <section id="platform" className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-purple-600 dark:text-purple-400">BUILT AROUND YOU</span>
          <h2 className="text-3xl sm:text-5xl font-black dark:text-white text-slate-900">One Platform. A Different Journey for Everyone.</h2>
          <p className="dark:text-slate-300 text-slate-600 text-sm sm:text-base leading-relaxed">
            Your career goal determines what matters most. ABTalks AI uses your profile and learning signals to prioritize the skills that move you closer to your target role.
          </p>
        </div>

        {/* Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          
          {/* Left: Fictional Candidate Profile */}
          <div className="p-6 sm:p-8 rounded-3xl dark:bg-[#07102D] bg-white border dark:border-white/15 border-slate-200 space-y-6 shadow-xl">
            <div className="flex items-center justify-between border-b dark:border-white/10 border-slate-200 pb-4">
              <div>
                <p className="text-xs font-mono text-blue-600 dark:text-blue-400 font-bold uppercase">CANDIDATE ASSESSMENT PROFILE</p>
                <h3 className="text-xl font-bold dark:text-white text-slate-900 mt-1">Alex Chen</h3>
              </div>
              <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-700 dark:text-blue-300 text-xs font-bold border border-blue-500/30">
                GenAI Engineer Path
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-xl dark:bg-white/5 bg-slate-50 border dark:border-white/5 border-slate-200">
                <span className="dark:text-slate-400 text-slate-500 block">Education</span>
                <span className="font-semibold dark:text-white text-slate-900">B.Tech — Computer Science</span>
              </div>
              <div className="p-3 rounded-xl dark:bg-white/5 bg-slate-50 border dark:border-white/5 border-slate-200">
                <span className="dark:text-slate-400 text-slate-500 block">Experience Level</span>
                <span className="font-semibold dark:text-white text-slate-900">Intermediate (2+ Yrs)</span>
              </div>
            </div>

            <div>
              <p className="text-xs font-bold dark:text-slate-300 text-slate-700 uppercase mb-2">Core Tech Stack</p>
              <div className="flex flex-wrap gap-2">
                <span className="px-2.5 py-1 rounded-lg dark:bg-slate-800 bg-slate-200 dark:text-slate-200 text-slate-800 font-medium text-xs">Python</span>
                <span className="px-2.5 py-1 rounded-lg dark:bg-slate-800 bg-slate-200 dark:text-slate-200 text-slate-800 font-medium text-xs">TypeScript</span>
                <span className="px-2.5 py-1 rounded-lg dark:bg-slate-800 bg-slate-200 dark:text-slate-200 text-slate-800 font-medium text-xs">React</span>
                <span className="px-2.5 py-1 rounded-lg dark:bg-slate-800 bg-slate-200 dark:text-slate-200 text-slate-800 font-medium text-xs">FastAPI</span>
              </div>
            </div>

            <div>
              <p className="text-xs font-bold dark:text-slate-300 text-slate-700 uppercase mb-2">31-Day Curriculum Learning Signals</p>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                  <span className="font-medium dark:text-slate-200 text-slate-800">Prompt Engineering</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold">Strong</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/30">
                  <span className="font-medium dark:text-slate-200 text-slate-800">RAG Pipelines</span>
                  <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-600 dark:text-blue-400 font-bold">Good</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30">
                  <span className="font-medium dark:text-slate-200 text-slate-800">Vector Databases</span>
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold">Weak (Focus)</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30">
                  <span className="font-medium dark:text-slate-200 text-slate-800">MCP Protocol</span>
                  <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-600 dark:text-purple-400 font-bold">Needs Practice</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl dark:bg-slate-800/80 bg-slate-100 border dark:border-white/5 border-slate-200">
                  <span className="font-medium dark:text-slate-400 text-slate-600">Production AI Deployment</span>
                  <span className="px-2 py-0.5 rounded dark:bg-slate-700 bg-slate-200 dark:text-slate-400 text-slate-600 font-bold">Not Started</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Personalized Path Roadmap */}
          <div className="p-6 sm:p-8 rounded-3xl dark:bg-[#020617] bg-slate-900 border dark:border-white/15 border-slate-700 space-y-6 shadow-xl">
            <div>
              <span className="text-xs font-mono font-bold text-purple-400 uppercase">DYNAMIC ROADMAP GENERATION</span>
              <h3 className="text-2xl font-bold text-white mt-1">Personalized AI Engineer Path</h3>
            </div>

            <div className="space-y-3 relative before:absolute before:left-[19px] before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-blue-500 before:via-purple-500 before:to-emerald-500">
              
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-bold text-xs">1</div>
                <div>
                  <p className="text-xs font-bold text-white">Prompt Engineering &amp; Structured Outputs</p>
                  <span className="text-[10px] text-emerald-400 font-semibold">Mastered</span>
                </div>
              </div>

              <div className="flex items-center gap-4 relative z-10">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/40 text-blue-400 flex items-center justify-center font-bold text-xs">2</div>
                <div>
                  <p className="text-xs font-bold text-white">RAG Architecture &amp; Hybrid Search</p>
                  <span className="text-[10px] text-blue-400 font-semibold">Competent</span>
                </div>
              </div>

              <div className="flex items-center gap-4 relative z-10 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/40 shadow-lg shadow-amber-500/10">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/60 text-amber-400 flex items-center justify-center font-bold text-xs">3</div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold text-amber-300">Vector Databases &amp; HNSW Indexing</p>
                    <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-amber-500/30 text-amber-200">RECOMMENDED FOCUS</span>
                  </div>
                  <span className="text-[10px] text-amber-400 font-semibold">Targeted for immediate interview practice</span>
                </div>
              </div>

              <div className="flex items-center gap-4 relative z-10">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-400 flex items-center justify-center font-bold text-xs">4</div>
                <div>
                  <p className="text-xs font-bold text-white">Agentic Workflows &amp; Tool Calling</p>
                  <span className="text-[10px] text-purple-400 font-semibold">Upcoming</span>
                </div>
              </div>

              <div className="flex items-center gap-4 relative z-10">
                <div className="w-10 h-10 rounded-xl bg-slate-800 border border-white/10 text-slate-400 flex items-center justify-center font-bold text-xs">5</div>
                <div>
                  <p className="text-xs font-bold text-slate-400">MCP Protocol &amp; Enterprise Integration</p>
                  <span className="text-[10px] text-slate-500">Upcoming</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* SECTION 5 — CURRICULUM */}
      <section id="curriculum" className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-600 dark:text-cyan-400">31-DAY AI ENGINEERING CURRICULUM</span>
          <h2 className="text-3xl sm:text-5xl font-black dark:text-white text-slate-900">Learn the Skills That Modern AI Engineers Need.</h2>
          <p className="dark:text-slate-300 text-slate-600 text-sm sm:text-base leading-relaxed">
            From LLM fundamentals to production systems, the curriculum gives the interviewer a real technical foundation to assess.
          </p>
        </div>

        {/* 7 Premium Curriculum Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {curriculumModules.map((item, idx) => {
            const IconComp = item.icon;
            return (
              <div
                key={item.num}
                className="p-6 rounded-2xl dark:bg-[#07102D] bg-white border dark:border-white/10 border-slate-200 shadow-md hover:border-blue-500/50 transition-all space-y-3 group hover:-translate-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">{item.num}</span>
                  <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 group-hover:bg-blue-500/20">
                    <IconComp className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-base font-bold dark:text-white text-slate-900 group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors">{item.title}</h3>
                <p className="dark:text-slate-300 text-slate-600 text-xs leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>

        <div className="text-center pt-4">
          <button
            onClick={onGetStarted}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold text-xs sm:text-sm shadow-xl hover:scale-[1.02] transition-all cursor-pointer inline-flex items-center gap-2"
          >
            <span>Explore Full Curriculum →</span>
          </button>
        </div>
      </section>

      {/* SECTION 6 — AI INTERVIEWER (MOST IMPORTANT) */}
      <section id="ai-interviewer" className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">THE AI INTERVIEWER</span>
          <h2 className="text-3xl sm:text-5xl font-black dark:text-white text-slate-900">Not a Question Bank. A Real Technical Conversation.</h2>
          <p className="dark:text-slate-300 text-slate-600 text-sm sm:text-base leading-relaxed">
            ABTalks AI doesn't follow a fixed script. It evaluates your answer, understands the gap, and decides what should come next.
          </p>
        </div>

        {/* LARGE INTERACTIVE INTERVIEW MOCKUP */}
        <div className="max-w-4xl mx-auto rounded-3xl dark:bg-[#07102D] bg-white border dark:border-white/15 border-slate-200 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl space-y-6">
          
          {/* Interview Header */}
          <div className="flex flex-wrap items-center justify-between border-b dark:border-white/10 border-slate-200 pb-4 gap-4">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-mono font-bold dark:text-slate-300 text-slate-700">INTERVIEW MODE</span>
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-500/20 px-2.5 py-0.5 rounded-full border border-blue-500/30">
                RAG &amp; VECTOR DATABASES
              </span>
            </div>
            <span className="text-xs font-mono font-bold dark:text-slate-400 text-slate-500">Question 04 / 08</span>
          </div>

          {/* Current Question */}
          <div className="p-5 rounded-2xl dark:bg-[#020617] bg-slate-900 border border-blue-500/30 space-y-2">
            <span className="text-[10px] font-mono font-bold uppercase text-blue-400">AI INTERVIEWER QUESTION</span>
            <p className="text-sm sm:text-base font-bold text-white leading-relaxed">
              "How would you design the retrieval pipeline for a RAG application serving 100,000 documents?"
            </p>
          </div>

          {/* Candidate Answer Box */}
          <div className="p-5 rounded-2xl dark:bg-white/5 bg-slate-50 border dark:border-white/10 border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-bold dark:text-slate-300 text-slate-700">YOUR RESPONSE</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">SUBMITTED</span>
            </div>
            <p className="text-xs sm:text-sm dark:text-slate-200 text-slate-800 leading-relaxed font-mono">
              "I'd use hybrid search combining dense BGE embeddings with BM25 keyword matching using Reciprocal Rank Fusion (RRF), followed by a Cohere re-ranker stage to optimize precision."
            </p>
          </div>

          {/* AI Evaluation */}
          <div className="p-5 rounded-2xl dark:bg-indigo-950/40 bg-indigo-50 border border-indigo-500/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold dark:text-indigo-300 text-indigo-700">REAL-TIME EVALUATION</span>
              <span className="text-sm font-black text-emerald-600 dark:text-emerald-400 bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-500/30">
                UNDERSTANDING 82%
              </span>
            </div>
            <p className="text-xs dark:text-slate-300 text-slate-700 leading-relaxed">
              <strong className="dark:text-indigo-200 text-indigo-900">AI SIGNAL:</strong> "Strong understanding of retrieval fundamentals. Needs deeper understanding of indexing and retrieval optimization."
            </p>
          </div>

          {/* Next Adaptive Question */}
          <div className="p-5 rounded-2xl dark:bg-gradient-to-r dark:from-purple-900/40 dark:to-blue-900/40 bg-purple-50 border border-purple-500/40 space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase dark:text-purple-300 text-purple-700 bg-purple-500/20 px-2.5 py-0.5 rounded border border-purple-500/30">
                ADAPTIVE FOLLOW-UP
              </span>
              <span className="text-[11px] dark:text-purple-300 text-purple-700 font-mono">Dynamic Branching</span>
            </div>
            <p className="text-xs sm:text-sm font-bold dark:text-white text-slate-900 leading-relaxed">
              "How would you choose between different vector indexing strategies (HNSW vs IVF-PQ) for this system?"
            </p>
          </div>

        </div>
      </section>

      {/* SECTION 7 — HOW ADAPTIVE INTERVIEWING WORKS */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">ADAPTIVE INTELLIGENCE</span>
          <h2 className="text-3xl sm:text-5xl font-black dark:text-white text-slate-900">Every Answer Changes What Comes Next.</h2>
          <p className="dark:text-slate-300 text-slate-600 text-sm sm:text-base leading-relaxed">
            The interviewer continuously adjusts depth, difficulty, topic selection, and follow-up questions based on the conversation.
          </p>
        </div>

        {/* 4 Connected State Interactive Demo */}
        <div className="space-y-6 max-w-4xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {adaptiveStates.map((st, idx) => (
              <button
                key={st.title}
                onClick={() => setSelectedAdaptiveState(idx)}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  selectedAdaptiveState === idx
                    ? 'bg-blue-600/20 border-blue-500 dark:text-white text-blue-900 font-bold shadow-lg'
                    : 'dark:bg-[#07102D] bg-white dark:border-white/10 border-slate-200 text-slate-600 hover:text-slate-900'
                }`}
              >
                <span className="text-[10px] font-mono font-bold block opacity-75">STATE 0{idx + 1}</span>
                <span className="text-xs font-bold block mt-0.5">{st.title}</span>
              </button>
            ))}
          </div>

          <div className="p-6 sm:p-8 rounded-3xl dark:bg-[#07102D] bg-white border dark:border-white/15 border-slate-200 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">{adaptiveStates[selectedAdaptiveState].title} Branch</span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${adaptiveStates[selectedAdaptiveState].color}`}>
                {adaptiveStates[selectedAdaptiveState].outcomeTag}
              </span>
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="p-4 rounded-xl dark:bg-[#020617] bg-slate-900 border dark:border-white/10 border-slate-700">
                <span className="text-slate-400 text-[10px] block font-mono">CANDIDATE RESPONSE</span>
                <p className="text-slate-200 mt-1">{adaptiveStates[selectedAdaptiveState].candidateText}</p>
              </div>

              <div className="p-4 rounded-xl dark:bg-blue-950/30 bg-blue-50 border border-blue-500/30 flex items-center justify-between">
                <div>
                  <span className="dark:text-slate-400 text-slate-500 text-[10px] block font-mono">AI EVALUATION SIGNAL</span>
                  <p className="dark:text-slate-200 text-slate-800 font-medium mt-0.5">{adaptiveStates[selectedAdaptiveState].aiSignal}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs dark:text-slate-400 text-slate-500">Score</span>
                  <p className="text-lg font-black text-emerald-600 dark:text-emerald-400">{adaptiveStates[selectedAdaptiveState].evalScore}%</p>
                </div>
              </div>

              <div className="p-4 rounded-xl dark:bg-purple-950/30 bg-purple-50 border border-purple-500/30">
                <span className="text-purple-600 dark:text-purple-400 text-[10px] block font-mono">ADAPTED FOLLOW-UP GENERATED</span>
                <p className="dark:text-white text-slate-900 font-bold mt-1">{adaptiveStates[selectedAdaptiveState].nextQuestion}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8 — TECHNICAL COVERAGE */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-600 dark:text-cyan-400">TECHNICAL DEPTH</span>
          <h2 className="text-3xl sm:text-5xl font-black dark:text-white text-slate-900">Evaluate Understanding. Not Memorization.</h2>
          <p className="dark:text-slate-300 text-slate-600 text-sm sm:text-base leading-relaxed">
            Every interview evaluates more than whether an answer is correct. It looks at how clearly the candidate explains concepts, reasons through problems, and applies knowledge to real engineering scenarios.
          </p>
        </div>

        {/* Radar Dimensions Visualization */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {[
            { label: "Conceptual Knowledge", val: "88%", desc: "Underlying LLM & vector principles" },
            { label: "Problem Solving", val: "84%", desc: "Debugging complex AI failures" },
            { label: "System Design", val: "78%", desc: "Architecting scalable RAG & agent loops" },
            { label: "Technical Depth", val: "82%", desc: "Understanding memory, state & protocols" },
            { label: "Practical Application", val: "85%", desc: "Writing clean functional prompt code" },
            { label: "Communication", val: "90%", desc: "Clear, concise engineering explanations" }
          ].map((dim) => (
            <div key={dim.label} className="p-5 rounded-2xl dark:bg-[#07102D] bg-white border dark:border-white/10 border-slate-200 shadow-md space-y-2">
              <span className="text-2xl font-black text-blue-600 dark:text-blue-400">{dim.val}</span>
              <p className="text-xs font-bold dark:text-white text-slate-900">{dim.label}</p>
              <p className="text-[11px] dark:text-slate-400 text-slate-600 leading-snug">{dim.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 9 — FINAL REPORT */}
      <section id="reports" className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-purple-600 dark:text-purple-400">ACTIONABLE FEEDBACK</span>
          <h2 className="text-3xl sm:text-5xl font-black dark:text-white text-slate-900">Know Exactly What to Improve.</h2>
          <p className="dark:text-slate-300 text-slate-600 text-sm sm:text-base leading-relaxed">
            Your interview ends with more than a score. It gives you a technical roadmap for what to do next.
          </p>
        </div>

        {/* Premium Report UI Mockup */}
        <div className="max-w-4xl mx-auto p-6 sm:p-8 rounded-3xl dark:bg-[#07102D] bg-white border dark:border-white/15 border-slate-200 space-y-6 shadow-2xl">
          <div className="flex flex-wrap items-center justify-between border-b dark:border-white/10 border-slate-200 pb-4 gap-4">
            <div>
              <span className="text-xs font-mono text-blue-600 dark:text-blue-400">TECHNICAL EVALUATION REPORT</span>
              <h3 className="text-xl font-bold dark:text-white text-slate-900">Senior AI Engineering Candidate</h3>
            </div>
            <div className="text-right">
              <span className="text-xs dark:text-slate-400 text-slate-500 block">Overall Readiness</span>
              <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">82%</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl dark:bg-white/5 bg-slate-50 border dark:border-white/5 border-slate-200">
              <span className="dark:text-slate-400 text-slate-500 block">Technical Knowledge</span>
              <span className="font-bold dark:text-white text-slate-900 text-sm">86%</span>
            </div>
            <div className="p-3 rounded-xl dark:bg-white/5 bg-slate-50 border dark:border-white/5 border-slate-200">
              <span className="dark:text-slate-400 text-slate-500 block">Problem Solving</span>
              <span className="font-bold dark:text-white text-slate-900 text-sm">81%</span>
            </div>
            <div className="p-3 rounded-xl dark:bg-white/5 bg-slate-50 border dark:border-white/5 border-slate-200">
              <span className="dark:text-slate-400 text-slate-500 block">System Design</span>
              <span className="font-bold dark:text-white text-slate-900 text-sm">74%</span>
            </div>
            <div className="p-3 rounded-xl dark:bg-white/5 bg-slate-50 border dark:border-white/5 border-slate-200">
              <span className="dark:text-slate-400 text-slate-500 block">Communication</span>
              <span className="font-bold dark:text-white text-slate-900 text-sm">89%</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="space-y-2 p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30">
              <p className="font-bold text-emerald-400 uppercase">Key Strengths Identified</p>
              <ul className="space-y-1.5 text-slate-200">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Strong RAG fundamentals</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Clear technical communication</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Good prompt engineering schema logic</li>
              </ul>
            </div>

            <div className="space-y-2 p-4 rounded-xl bg-amber-950/20 border border-amber-500/30">
              <p className="font-bold text-amber-400 uppercase">Recommended Focus Areas</p>
              <ul className="space-y-1.5 text-slate-200">
                <li className="flex items-center gap-2"><ArrowRight className="w-3.5 h-3.5 text-amber-400" /> Vector database indexing (HNSW vs IVF)</li>
                <li className="flex items-center gap-2"><ArrowRight className="w-3.5 h-3.5 text-amber-400" /> MCP protocol architecture</li>
                <li className="flex items-center gap-2"><ArrowRight className="w-3.5 h-3.5 text-amber-400" /> Production deployment latency</li>
              </ul>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-500/40 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-mono text-blue-300 font-bold uppercase block">NEXT RECOMMENDED STEP</span>
              <p className="text-xs font-bold text-white mt-0.5">
                "Strengthen vector retrieval and MCP fundamentals before attempting the advanced production interview."
              </p>
            </div>
            <button
              onClick={onGetStarted}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold text-xs shadow-md hover:scale-[1.02] transition-all cursor-pointer whitespace-nowrap"
            >
              View Full Sample Report →
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 10 — DIFFERENTIATOR */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">WHY IT'S DIFFERENT</span>
          <h2 className="text-3xl sm:text-5xl font-black dark:text-white text-slate-900">Preparation That Learns With You.</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 rounded-3xl dark:bg-[#07102D] bg-white border dark:border-white/10 border-slate-200 shadow-md space-y-3">
            <span className="text-3xl font-black text-blue-600 dark:text-blue-400 font-mono">01</span>
            <h3 className="text-lg font-bold dark:text-white text-slate-900">Curriculum-Aware</h3>
            <p className="dark:text-slate-300 text-slate-600 text-xs sm:text-sm leading-relaxed">
              Interview questions are grounded in the candidate's actual learning journey across the 31-day AI Engineering curriculum.
            </p>
          </div>

          <div className="p-8 rounded-3xl dark:bg-[#07102D] bg-white border dark:border-white/10 border-slate-200 shadow-md space-y-3">
            <span className="text-3xl font-black text-purple-600 dark:text-purple-400 font-mono">02</span>
            <h3 className="text-lg font-bold dark:text-white text-slate-900">Context-Aware</h3>
            <p className="dark:text-slate-300 text-slate-600 text-xs sm:text-sm leading-relaxed">
              Previous answers directly influence the direction, depth, and specific follow-ups of the ongoing technical conversation.
            </p>
          </div>

          <div className="p-8 rounded-3xl dark:bg-[#07102D] bg-white border dark:border-white/10 border-slate-200 shadow-md space-y-3">
            <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono">03</span>
            <h3 className="text-lg font-bold dark:text-white text-slate-900">Action-Oriented</h3>
            <p className="dark:text-slate-300 text-slate-600 text-xs sm:text-sm leading-relaxed">
              Every identified weakness becomes a concrete recommendation for what specific topic to learn or practice next.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 11 — STATS */}
      <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-y dark:border-white/10 border-slate-200">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
          <div className="space-y-1">
            <span className="text-4xl font-black text-blue-600 dark:text-blue-400">31</span>
            <p className="text-xs dark:text-slate-300 text-slate-600 font-medium">Days of Curriculum</p>
          </div>
          <div className="space-y-1">
            <span className="text-4xl font-black text-purple-600 dark:text-purple-400">8+</span>
            <p className="text-xs dark:text-slate-300 text-slate-600 font-medium">Adaptive Questions</p>
          </div>
          <div className="space-y-1">
            <span className="text-4xl font-black text-pink-600 dark:text-pink-400">4+</span>
            <p className="text-xs dark:text-slate-300 text-slate-600 font-medium">Areas Assessed</p>
          </div>
          <div className="space-y-1">
            <span className="text-4xl font-black text-cyan-600 dark:text-cyan-400">6</span>
            <p className="text-xs dark:text-slate-300 text-slate-600 font-medium">Intelligent Stages</p>
          </div>
          <div className="space-y-1 col-span-2 md:col-span-1">
            <span className="text-4xl font-black text-emerald-600 dark:text-emerald-400">100%</span>
            <p className="text-xs dark:text-slate-300 text-slate-600 font-medium">Personalized Context</p>
          </div>
        </div>
      </section>

      {/* SECTION 12 — ENTERPRISE / ARCHITECTURE */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">BUILT FOR MODERN AI ENGINEERING</span>
          <h2 className="text-3xl sm:text-5xl font-black dark:text-white text-slate-900">Intelligent Evaluation. Structured Engineering.</h2>
          <p className="dark:text-slate-300 text-slate-600 text-sm sm:text-base leading-relaxed">
            ABTalks AI combines curriculum-aware reasoning, candidate context, adaptive questioning, structured evaluation, and actionable feedback into one technical assessment experience.
          </p>
        </div>

        {/* Architecture Pipeline Flow */}
        <div className="p-6 sm:p-8 rounded-3xl dark:bg-[#07102D] bg-white border dark:border-white/15 border-slate-200 shadow-md overflow-x-auto">
          <div className="flex items-center justify-between min-w-[700px] gap-2 text-center text-xs font-bold">
            <div className="p-3 rounded-xl bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-500/30">Candidate Profile</div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
            <div className="p-3 rounded-xl bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30">Curriculum Intelligence</div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
            <div className="p-3 rounded-xl bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/30">Interview Planner</div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
            <div className="p-3 rounded-xl bg-pink-500/20 text-pink-700 dark:text-pink-300 border border-pink-500/30">Question Generator</div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
            <div className="p-3 rounded-xl bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30">Answer Evaluator</div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
            <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">Performance Report</div>
          </div>
        </div>
      </section>

      {/* SECTION — FAQ */}
      <section id="faq" className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12 scroll-mt-20">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-600 dark:text-blue-400 text-xs font-mono font-bold uppercase tracking-wider">
            <HelpCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black dark:text-white text-slate-900 tracking-tight">
            Got Questions? We Have Answers.
          </h2>
          <p className="dark:text-slate-300 text-slate-600 text-sm sm:text-base leading-relaxed">
            Everything you need to know about ABTalks AI Cohort 31-Day AI Interviewer Agent and how it transforms candidate evaluation.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={index}
                className="rounded-2xl dark:bg-[#07102D]/90 bg-white border dark:border-white/10 border-slate-200 transition-all overflow-hidden shadow-md"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-bold dark:text-white text-slate-900 text-base sm:text-lg hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-3.5">
                    <span className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30 flex items-center justify-center text-xs font-mono font-bold shrink-0">
                      0{index + 1}
                    </span>
                    <span className="leading-snug">{faq.question}</span>
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 pt-2 dark:text-slate-300 text-slate-600 text-sm sm:text-base leading-relaxed border-t dark:border-white/5 border-slate-100 dark:bg-blue-950/20 bg-blue-50/50">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 13 — FINAL CTA */}
      <section className="relative z-10 py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="relative rounded-3xl dark:bg-gradient-to-r dark:from-blue-900/60 dark:via-indigo-900/60 dark:to-purple-900/60 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 border border-white/20 p-10 sm:p-16 text-center space-y-8 backdrop-blur-2xl shadow-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-transparent pointer-events-none" />
          
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-blue-200 bg-blue-500/30 px-4 py-1.5 rounded-full border border-blue-400/40 inline-block">
            READY WHEN YOU ARE
          </span>

          <h2 className="text-3xl sm:text-6xl font-black text-white tracking-tight leading-tight max-w-3xl mx-auto">
            Your Next Interview Starts With Understanding You.
          </h2>

          <p className="text-blue-100 dark:text-slate-200 text-sm sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Stop preparing with random questions. Build the skills, test your understanding, discover your gaps, and become ready for the role you want.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={onGetStarted}
              className="shimmer-btn px-8 py-4 rounded-2xl bg-white text-slate-900 font-black text-sm sm:text-base shadow-2xl border border-white/20 hover:bg-slate-100 cursor-pointer"
            >
              <span>Start Your Assessment →</span>
            </button>
            <button
              onClick={() => scrollToSection('curriculum')}
              className="px-8 py-4 rounded-2xl bg-black/20 border border-white/30 text-white font-bold text-sm sm:text-base hover:bg-white/10 transition-all cursor-pointer"
            >
              <span>Explore Curriculum</span>
            </button>
          </div>

          <p className="text-xs font-mono font-bold text-blue-200/90 tracking-widest uppercase pt-4">
            Assess. Learn. Practice. Interview. Improve.
          </p>
        </div>
      </section>

      {/* FULL-SCREEN EXPANDED FOOTER */}
      <footer className="relative z-10 w-full border-t dark:border-white/10 border-slate-200 dark:bg-[#020617] bg-slate-900 pt-16 pb-12 px-6 sm:px-12 lg:px-20 xl:px-24 text-slate-300 dark:text-slate-400 text-xs shadow-2xl">
        <div className="max-w-[1800px] mx-auto space-y-12">
          
          {/* Top Row: Brand & Quick Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
            
            {/* Column 1: Brand & Bio */}
            <div className="space-y-4 lg:col-span-2 pr-0 lg:pr-8">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 p-0.5 flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <div className="w-full h-full dark:bg-[#050B24] bg-slate-900 rounded-[10px] flex items-center justify-center">
                    <Brain className="w-5 h-5 text-blue-400" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-lg text-white tracking-tight">ABTalks AI</span>
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">v3.6</span>
                  </div>
                  <p className="text-[10px] font-bold tracking-widest uppercase text-slate-400">INTELLIGENT COHORT EVALUATOR</p>
                </div>
              </div>

              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-lg">
                An adaptive AI engineering assessment platform that turns technical learning journeys into personalized interview readiness. Grounded in the 31-Day AI Engineering curriculum.
              </p>

              {/* Status Pill */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-mono font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>ALL SYSTEMS OPERATIONAL • GEMINI 2.5 FLASH ACTIVE</span>
              </div>
            </div>

            {/* Column 2: Platform Links */}
            <div className="space-y-3">
              <p className="font-bold text-white uppercase text-xs tracking-wider border-b border-white/10 pb-2">Platform</p>
              <ul className="space-y-2.5 font-medium text-slate-300">
                <li><button onClick={onGetStarted} className="hover:text-blue-400 transition-colors cursor-pointer text-left">Start AI Assessment</button></li>
                <li><button onClick={() => scrollToSection('platform')} className="hover:text-blue-400 transition-colors cursor-pointer text-left">Personalized Learning</button></li>
                <li><button onClick={() => scrollToSection('ai-interviewer')} className="hover:text-blue-400 transition-colors cursor-pointer text-left">Adaptive AI Interviewer</button></li>
                <li><button onClick={() => scrollToSection('reports')} className="hover:text-blue-400 transition-colors cursor-pointer text-left">Performance Reports</button></li>
                <li><button onClick={onGetStarted} className="hover:text-blue-400 transition-colors cursor-pointer text-left">Candidate Switcher</button></li>
              </ul>
            </div>

            {/* Column 3: Curriculum Tracks */}
            <div className="space-y-3">
              <p className="font-bold text-white uppercase text-xs tracking-wider border-b border-white/10 pb-2">31-Day Curriculum</p>
              <ul className="space-y-2.5 font-medium text-slate-300">
                <li><button onClick={() => scrollToSection('curriculum')} className="hover:text-blue-400 transition-colors cursor-pointer text-left">Day 1-7: LLM & Prompting</button></li>
                <li><button onClick={() => scrollToSection('curriculum')} className="hover:text-blue-400 transition-colors cursor-pointer text-left">Day 8-15: RAG & Vector DBs</button></li>
                <li><button onClick={() => scrollToSection('curriculum')} className="hover:text-blue-400 transition-colors cursor-pointer text-left">Day 16-22: Fine-Tuning & Eval</button></li>
                <li><button onClick={() => scrollToSection('curriculum')} className="hover:text-blue-400 transition-colors cursor-pointer text-left">Day 23-31: Agents & MCP</button></li>
              </ul>
            </div>

            {/* Column 4: Documentation & Specs */}
            <div className="space-y-3">
              <p className="font-bold text-white uppercase text-xs tracking-wider border-b border-white/10 pb-2">Resources & Specs</p>
              <ul className="space-y-2.5 font-medium text-slate-300">
                <li><button onClick={onOpenTechSpec} className="hover:text-blue-400 transition-colors cursor-pointer text-left flex items-center gap-1.5"><Code2 className="w-3.5 h-3.5 text-blue-400" /> Technical Specification</button></li>
                <li><button onClick={() => scrollToSection('how-it-works')} className="hover:text-blue-400 transition-colors cursor-pointer text-left">How It Works Architecture</button></li>
                <li><button onClick={() => scrollToSection('faq')} className="hover:text-blue-400 transition-colors cursor-pointer text-left flex items-center gap-1.5"><HelpCircle className="w-3.5 h-3.5 text-indigo-400" /> FAQ & Guidance</button></li>
                <li><button onClick={onWatchDemo} className="hover:text-blue-400 transition-colors cursor-pointer text-left flex items-center gap-1.5"><Play className="w-3.5 h-3.5 text-purple-400" /> Watch Interactive Demo</button></li>
              </ul>
            </div>

          </div>

          {/* Tech Stack Pills Bar */}
          <div className="pt-6 border-t border-white/5 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
              <span className="text-slate-400 font-bold uppercase">POWERED BY:</span>
              <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-slate-300">Google Gemini 2.5 Flash</span>
              <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-slate-300">React 18</span>
              <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-slate-300">TypeScript</span>
              <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-slate-300">Tailwind CSS</span>
            </div>

            <div className="flex items-center gap-4 text-xs font-semibold text-slate-300">
              <button onClick={onGetStarted} className="hover:text-white transition-colors cursor-pointer">Log In</button>
              <span>•</span>
              <button onClick={onGetStarted} className="hover:text-white transition-colors cursor-pointer">Get Started</button>
            </div>
          </div>

          {/* Bottom Copyright Bar */}
          <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
            <p>© 2026 ABTalks AI. Engineered for the 31-Day AI Engineering Cohort. All rights reserved.</p>
            <p className="font-mono text-slate-300">ABTALKS_COHORT_INTELLIGENCE_AGENT_v3.6</p>
          </div>

        </div>
      </footer>

    </div>
  );
};
