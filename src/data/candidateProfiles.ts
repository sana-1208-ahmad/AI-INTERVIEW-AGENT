import { CandidateProfile } from '../types';

export const CANDIDATE_PROFILES: CandidateProfile[] = [
  {
    id: "CAND-002",
    name: "Alex Turner",
    email: "alex.turner@example.com",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    role: "Backend Software Engineer",
    cohort: "Cohort May 2025",
    completedDays: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 15, 16, 18, 19, 20, 22, 28, 31],
    skippedDays: [13, 14],
    attemptsCount: 22,
    avgScore: 78,
    strengths: [
      "Prompt Engineering Fundamentals & LLM API Integration",
      "Docker & Kubernetes Container Deployment",
      "FastAPI & Streaming SSE Responses"
    ],
    areasToImprove: [
      "Vector Database Index Optimization (HNSW vs IVF-PQ)",
      "Function Calling & Structured Outputs (Day 13 missed)",
      "Model Context Protocol (MCP) Security & Bearer Auth"
    ],
    interviewFocus: [
      "Vector Databases & Indexing Strategies",
      "Function Calling & Pydantic Validation",
      "Model Context Protocol (MCP)"
    ],
    learningSignals: {
      ragMastery: 72,
      vectorDbProficiency: 45,
      promptEngineeringScore: 85,
      agenticAiScore: 60,
      mcpUnderstanding: 35,
      deploymentReadiness: 90
    }
  },
  {
    id: "CAND-001",
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    role: "Senior Data Engineer",
    cohort: "Cohort May 2025",
    completedDays: [7, 8, 10, 12, 16, 22, 23, 28, 31],
    skippedDays: [29],
    attemptsCount: 15,
    avgScore: 86,
    strengths: [
      "Vector Database Architectures & Embeddings",
      "Multi-Agent Orchestration & Graph Workflows",
      "Docker Containerization & Kubernetes Cluster Operations"
    ],
    areasToImprove: [
      "Observability, Tracing & Prometheus Metrics (Day 29 skipped)",
      "Fine-Tuning LoRA & QLoRA Quantization",
      "Ultra-low latency SSE streaming optimizations"
    ],
    interviewFocus: [
      "Vector Search & Indexing Engine",
      "Multi-Agent Orchestration",
      "Observability & Tracing"
    ],
    learningSignals: {
      ragMastery: 88,
      vectorDbProficiency: 92,
      promptEngineeringScore: 80,
      agenticAiScore: 85,
      mcpUnderstanding: 78,
      deploymentReadiness: 82
    }
  },
  {
    id: "CAND-003",
    name: "Emily Chen",
    email: "emily.chen@example.com",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    role: "AI Engineer",
    cohort: "Cohort May 2025",
    completedDays: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31],
    skippedDays: [],
    attemptsCount: 10,
    avgScore: 96,
    strengths: [
      "End-to-End RAG Pipelines & Hybrid RRF Search",
      "Function Calling, Structured Outputs & LangChain Agents",
      "Model Context Protocol (MCP) Custom Server Development"
    ],
    areasToImprove: [
      "Edge vLLM Speculative Decoding",
      "Multi-Tenant Rate Limiting & Cost Management at Scale"
    ],
    interviewFocus: [
      "Advanced RAG Triad & Hybrid Search",
      "MCP Protocol & Custom Tool Servers",
      "Production Agent Architectures"
    ],
    learningSignals: {
      ragMastery: 98,
      vectorDbProficiency: 95,
      promptEngineeringScore: 96,
      agenticAiScore: 94,
      mcpUnderstanding: 92,
      deploymentReadiness: 90
    }
  },
  {
    id: "CAND-004",
    name: "David Miller",
    email: "david.miller@example.com",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    role: "Business Analyst",
    cohort: "Cohort May 2025",
    completedDays: [7, 8, 10, 12, 16, 20, 22, 23, 31],
    skippedDays: [28],
    attemptsCount: 30,
    avgScore: 65,
    strengths: [
      "Prompt Engineering & Requirement Definition",
      "Conversation Memory & Context Management",
      "High-level Multi-Agent Workflows"
    ],
    areasToImprove: [
      "Kubernetes Deployment & Docker Containerization (Day 28 skipped)",
      "Low-level Vector Math & HNSW Distance Functions",
      "Async Python & Technical API Implementations"
    ],
    interviewFocus: [
      "Prompt Engineering & Context Memory",
      "RAG Fundamentals",
      "Deployment & Infrastructure Basics"
    ],
    learningSignals: {
      ragMastery: 60,
      vectorDbProficiency: 50,
      promptEngineeringScore: 78,
      agenticAiScore: 62,
      mcpUnderstanding: 55,
      deploymentReadiness: 30
    }
  },
  {
    id: "CAND-005",
    name: "Michael Brown",
    email: "michael.brown@example.com",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    role: "DevOps Engineer",
    cohort: "Cohort May 2025",
    completedDays: [7, 8, 10, 12, 18, 22, 23, 28, 29, 31],
    skippedDays: [],
    attemptsCount: 18,
    avgScore: 85,
    strengths: [
      "Docker & Kubernetes Deployment Architecture",
      "Monitoring, Logging, Prometheus & Grafana Observability",
      "Streaming Responses & Server-Sent Events (SSE)"
    ],
    areasToImprove: [
      "Fine-Tuning LoRA / QLoRA Hyperparameter Tuning",
      "Advanced RAG Context Precision Metrics",
      "Complex Multi-Step Prompt Schemas"
    ],
    interviewFocus: [
      "Infrastructure & Containerization",
      "Observability & Tracing",
      "Model Context Protocol & APIs"
    ],
    learningSignals: {
      ragMastery: 75,
      vectorDbProficiency: 80,
      promptEngineeringScore: 70,
      agenticAiScore: 78,
      mcpUnderstanding: 82,
      deploymentReadiness: 98
    }
  },
  {
    id: "CAND-006",
    name: "Wendy Foster",
    email: "wendy.foster@example.com",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    role: "Marketing Manager",
    cohort: "Cohort May 2025",
    completedDays: [1, 7, 8, 12, 16, 17, 22, 31],
    skippedDays: [27, 28],
    attemptsCount: 32,
    avgScore: 58,
    strengths: [
      "Chatbot UI & Streamlit Frontend Development",
      "Prompt Engineering Fundamentals",
      "Creative Solution Prototyping"
    ],
    areasToImprove: [
      "Security, Guardrails & API Protection (Day 27 skipped)",
      "Docker & Kubernetes Containerization (Day 28 skipped)",
      "Vector Database Embeddings & Hybrid RRF Search"
    ],
    interviewFocus: [
      "Chatbot Frontend & API Basics",
      "Security & Guardrails",
      "Deployment Concepts"
    ],
    learningSignals: {
      ragMastery: 45,
      vectorDbProficiency: 40,
      promptEngineeringScore: 75,
      agenticAiScore: 50,
      mcpUnderstanding: 30,
      deploymentReadiness: 25
    }
  },
  {
    id: "CAND-007",
    name: "Ethan Brooks",
    email: "ethan.brooks@example.com",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
    role: "Computer Science Intern",
    cohort: "Cohort May 2025",
    completedDays: [1, 3, 7, 8, 12, 16, 22, 31],
    skippedDays: [27, 28],
    attemptsCount: 12,
    avgScore: 82,
    strengths: [
      "Python & React Development Foundations",
      "Quick Learning & High First-Try Success Rate",
      "Embeddings & Vector Database Concepts"
    ],
    areasToImprove: [
      "Production Deployment (Docker & K8s)",
      "Security, Privacy & Guardrails (Day 27 skipped)",
      "Enterprise Multi-Agent Systems"
    ],
    interviewFocus: [
      "React & Python AI Basics",
      "Embeddings & RAG Engine",
      "Security & Production Setup"
    ],
    learningSignals: {
      ragMastery: 80,
      vectorDbProficiency: 78,
      promptEngineeringScore: 84,
      agenticAiScore: 75,
      mcpUnderstanding: 60,
      deploymentReadiness: 45
    }
  },
  {
    id: "CAND-008",
    name: "Harold Whitfield",
    email: "harold.whitfield@example.com",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
    role: "Distinguished Engineer",
    cohort: "Cohort May 2025",
    completedDays: [1, 4, 5, 21, 22, 23, 27, 28, 31],
    skippedDays: [14, 15],
    attemptsCount: 22,
    avgScore: 90,
    strengths: [
      "Enterprise System Architecture & Security",
      "Docker & Kubernetes Container Management",
      "LangChain & Multi-Agent Orchestration"
    ],
    areasToImprove: [
      "Fine-Tuning with LoRA & QLoRA (Days 14 & 15 skipped)",
      "Dense Vector Indexing Mechanics",
      "Modern Frontend SSE Streaming Patterns"
    ],
    interviewFocus: [
      "Enterprise Agent Architecture",
      "Security & Infrastructure",
      "Fine-Tuning Concepts & Trade-offs"
    ],
    learningSignals: {
      ragMastery: 85,
      vectorDbProficiency: 82,
      promptEngineeringScore: 90,
      agenticAiScore: 92,
      mcpUnderstanding: 88,
      deploymentReadiness: 96
    }
  },
  {
    id: "CAND-009",
    name: "Zara Ahmadi",
    email: "zara.ahmadi@example.com",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    role: "AI Engineer",
    cohort: "Cohort May 2025",
    completedDays: [7, 8, 10, 12, 13, 21, 22, 23, 27, 31],
    skippedDays: [],
    attemptsCount: 10,
    avgScore: 95,
    strengths: [
      "Embeddings, Vector Search & RAG Engines",
      "Function Calling & Structured Outputs",
      "Model Context Protocol (MCP) & Agent Systems"
    ],
    areasToImprove: [
      "Large-scale Kubernetes Cluster Administration",
      "Ultra-low latency streaming optimizations"
    ],
    interviewFocus: [
      "End-to-End RAG Systems",
      "Agentic AI & MCP Protocol",
      "Security & Guardrails"
    ],
    learningSignals: {
      ragMastery: 96,
      vectorDbProficiency: 94,
      promptEngineeringScore: 95,
      agenticAiScore: 95,
      mcpUnderstanding: 93,
      deploymentReadiness: 88
    }
  },
  {
    id: "CAND-010",
    name: "Gerald Combs",
    email: "gerald.combs@example.com",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
    role: "IT Support Specialist",
    cohort: "Cohort May 2025",
    completedDays: [1, 7, 12, 16, 31],
    skippedDays: [27, 28],
    attemptsCount: 30,
    avgScore: 50,
    strengths: [
      "VS Code & Environment Setup",
      "Prompt Engineering Fundamentals",
      "Persistent Learning Effort"
    ],
    areasToImprove: [
      "Vector Databases Overview (Day 8 failed)",
      "Retrieval & Matching Engines (Day 10 failed)",
      "Multi-Agent Orchestration (Day 22 failed)"
    ],
    interviewFocus: [
      "Foundational AI Concepts",
      "Vector Search Mechanics",
      "Agent Workflows"
    ],
    learningSignals: {
      ragMastery: 40,
      vectorDbProficiency: 30,
      promptEngineeringScore: 65,
      agenticAiScore: 35,
      mcpUnderstanding: 25,
      deploymentReadiness: 20
    }
  }
];
