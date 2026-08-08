import { CurriculumDay } from '../types';

export const CURRICULUM_DATA: CurriculumDay[] = [
  {
    day: 1,
    module: "Module 1: Foundations & LLM Architecture",
    topic: "AI Engineering Introduction & LLM Fundamentals",
    description: "Understanding LLM architecture, tokenization, transformer self-attention, context windows, and modern model families.",
    learningObjectives: [
      "Explain transformer architecture and self-attention mechanism",
      "Understand tokenization algorithms (BPE, WordPiece)",
      "Analyze context window limitations and KV cache memory footprint"
    ],
    tools: ["PyTorch", "HuggingFace Transformers", "Tiktoken", "@google/genai"],
    difficulty: "Beginner",
    keyConcepts: ["Self-Attention", "Tokenization", "KV Cache", "Context Window"]
  },
  {
    day: 2,
    module: "Module 1: Foundations & LLM Architecture",
    topic: "Python for AI & Async Programming",
    description: "Building resilient async pipelines, concurrency, rate limiting, and exception handling for LLM API integrations.",
    learningObjectives: [
      "Master asyncio and concurrent LLM requests",
      "Implement exponential backoff and circuit breaker patterns",
      "Structure typed Python dataclasses and Pydantic schemas"
    ],
    tools: ["Python 3.11+", "Asyncio", "Pydantic v2", "Tenacity"],
    difficulty: "Beginner",
    keyConcepts: ["Asyncio", "Rate Limiting", "Exponential Backoff", "Pydantic Schemas"]
  },
  {
    day: 3,
    module: "Module 1: Foundations & LLM Architecture",
    topic: "APIs & LLM Integration Patterns",
    description: "Direct REST and SDK integrations with Gemini, OpenAI, and Anthropic APIs. Streaming SSE responses.",
    learningObjectives: [
      "Integrate @google/genai and manage client sessions",
      "Handle Server-Sent Events (SSE) streaming output in web servers",
      "Measure latency metrics (TTFT, tokens/sec)"
    ],
    tools: ["@google/genai", "Express.js", "FastAPI", "Server-Sent Events"],
    difficulty: "Beginner",
    keyConcepts: ["SSE Streaming", "TTFT (Time To First Token)", "SDK Session Management", "API Gateway"]
  },
  {
    day: 4,
    module: "Module 1: Foundations & LLM Architecture",
    topic: "Prompt Engineering Basics & System Instructions",
    description: "Core prompt engineering techniques: Few-shot prompting, persona framing, system role boundaries, and chain-of-thought.",
    learningObjectives: [
      "Craft deterministic system instructions for specific personas",
      "Apply few-shot exemplar formatting to guide output structure",
      "Mitigate prompt injection and role leakage"
    ],
    tools: ["Gemini AI Studio", "Promptfoo", "Tiktoken"],
    difficulty: "Beginner",
    keyConcepts: ["Few-Shot Learning", "System Instructions", "Prompt Injection Defense", "Delimiter Strategies"]
  },
  {
    day: 5,
    module: "Module 1: Foundations & LLM Architecture",
    topic: "Advanced Prompting & Structured Outputs",
    description: "Constrained generation, JSON Schema enforcement, function signatures, and step-by-step reasoning prompts.",
    learningObjectives: [
      "Enforce strict JSON schema outputs using responseSchema parameters",
      "Use XML tags and delimiters to separate user context from instructions",
      "Construct multi-step chain-of-thought reasoning pipelines"
    ],
    tools: ["@google/genai Type Schema", "Zod", "Instructor"],
    difficulty: "Intermediate",
    keyConcepts: ["Structured JSON Schema", "Chain-of-Thought (CoT)", "Constrained Generation", "Zod Validation"]
  },
  {
    day: 6,
    module: "Module 2: RAG Systems & Vector Databases",
    topic: "Embeddings & Dense Vector Representations",
    description: "Text embedding models, high-dimensional vector spaces, similarity metrics (Cosine, Euclidean, Dot Product).",
    learningObjectives: [
      "Understand embedding vector spaces and semantic distance",
      "Compare Cosine Similarity, Dot Product, and L2 Distance",
      "Select optimal embedding models (gemini-embedding-2-preview, text-embedding-3)"
    ],
    tools: ["gemini-embedding-2-preview", "NumPy", "Scikit-Learn"],
    difficulty: "Intermediate",
    keyConcepts: ["Cosine Similarity", "Dense Vectors", "Dimensionality Reduction", "Semantic Search"]
  },
  {
    day: 7,
    module: "Module 2: RAG Systems & Vector Databases",
    topic: "Vector Databases - Pinecone & Qdrant",
    description: "Architecture of vector databases, HNSW indexing, inverted file indexes (IVF), and metadata filtering.",
    learningObjectives: [
      "Set up Pinecone and Qdrant clusters with metadata payloads",
      "Understand HNSW (Hierarchical Navigable Small World) graphs",
      "Implement payload filtering and namespaces for multi-tenant data"
    ],
    tools: ["Pinecone", "Qdrant", "ChromaDB"],
    difficulty: "Intermediate",
    keyConcepts: ["HNSW Index", "Metadata Filtering", "Multi-Tenancy Namespaces", "Vector Upsert"]
  },
  {
    day: 8,
    module: "Module 2: RAG Systems & Vector Databases",
    topic: "Document Processing & Chunking Strategies",
    description: "Strategies for breaking down unstructured documents: Fixed-size, sentence-level, semantic chunking, and parent-child indexing.",
    learningObjectives: [
      "Evaluate trade-offs between fixed-size and semantic chunking",
      "Implement parent-child document chunking for rich context retrieval",
      "Extract structured data from PDF, Markdown, and HTML sources"
    ],
    tools: ["LangChain TextSplitters", "LlamaIndex Parser", "Unstructured.io"],
    difficulty: "Intermediate",
    keyConcepts: ["Semantic Chunking", "Parent-Child Retrieval", "Chunk Overlap", "PDF Parsing"]
  },
  {
    day: 9,
    module: "Module 2: RAG Systems & Vector Databases",
    topic: "Core RAG Architecture & Context Retrieval",
    description: "End-to-end Naive RAG pipeline: Ingestion, indexing, query vectorization, top-k retrieval, prompt synthesis.",
    learningObjectives: [
      "Build a complete RAG pipeline from scratch",
      "Formulate context augmentation prompts with retrieved chunks",
      "Debug retrieval quality issues like hallucinations and lost-in-the-middle"
    ],
    tools: ["@google/genai", "Pinecone", "LangChain"],
    difficulty: "Intermediate",
    keyConcepts: ["Top-K Retrieval", "Context Augmentation", "Lost in the Middle", "Hallucination Reduction"]
  },
  {
    day: 10,
    module: "Module 2: RAG Systems & Vector Databases",
    topic: "Hybrid Search & Sparse-Dense Fusion",
    description: "Combining keyword search (BM25, TF-IDF) with dense vector search using Reciprocal Rank Fusion (RRF).",
    learningObjectives: [
      "Understand Sparse vs Dense vector representations",
      "Implement Reciprocal Rank Fusion (RRF) algorithm",
      "Configure BM25 alongside dense vector indexes in Qdrant/Pinecone"
    ],
    tools: ["Qdrant Hybrid Search", "BM25 Encoder", "RRF Algorithm"],
    difficulty: "Advanced",
    keyConcepts: ["Sparse vs Dense Vectors", "BM25", "Reciprocal Rank Fusion (RRF)", "Hybrid Search"]
  },
  {
    day: 11,
    module: "Module 2: RAG Systems & Vector Databases",
    topic: "Re-Ranking & Query Transformation",
    description: "Cross-encoder re-rankers, query expansion, HyDE (Hypothetical Document Embeddings), and sub-query routing.",
    learningObjectives: [
      "Deploy Cohere/BGE Cross-Encoders for second-pass re-ranking",
      "Implement HyDE to generate hypothetical answers before vector search",
      "Transform user queries into multi-perspective sub-queries"
    ],
    tools: ["Cohere Rerank API", "BGE Reranker", "LlamaIndex HyDE"],
    difficulty: "Advanced",
    keyConcepts: ["Cross-Encoder Re-Ranking", "HyDE", "Query Expansion", "Sub-Query Decomposition"]
  },
  {
    day: 12,
    module: "Module 2: RAG Systems & Vector Databases",
    topic: "RAG Evaluation & Triad Metrics",
    description: "Evaluating RAG pipelines with Ragas: Faithfulness, Answer Relevance, Context Precision, and Context Recall.",
    learningObjectives: [
      "Measure RAG Triad: Context Relevance, Groundedness, Answer Relevance",
      "Use Ragas evaluation framework with synthetic ground-truth datasets",
      "Automate regression testing for RAG prompt and index updates"
    ],
    tools: ["Ragas Framework", "TruLens", "DeepEval"],
    difficulty: "Advanced",
    keyConcepts: ["RAG Triad", "Faithfulness", "Context Precision", "Synthetic Test Datasets"]
  },
  {
    day: 13,
    module: "Module 3: Fine-Tuning & Model Alignment",
    topic: "Dataset Curation & Synthetic Data Generation",
    description: "Building high-quality instruction tuning datasets using LLM self-instruct, deduplication, and quality filtering.",
    learningObjectives: [
      "Generate synthetic instruction-response pairs with Gemini 3.6 Flash",
      "Clean, deduplicate, and format JSONL datasets for fine-tuning",
      "Verify data diversity and mitigate distribution bias"
    ],
    tools: ["Datasets / HuggingFace", "MinHash LSH", "JSONL Tools"],
    difficulty: "Intermediate",
    keyConcepts: ["Instruction Tuning Dataset", "Self-Instruct", "MinHash Deduplication", "JSONL"]
  },
  {
    day: 14,
    module: "Module 3: Fine-Tuning & Model Alignment",
    topic: "LoRA & QLoRA Parameter-Efficient Fine-Tuning",
    description: "Low-Rank Adaptation (LoRA), 4-bit quantization (QLoRA), target modules, adapter weight saving and merging.",
    learningObjectives: [
      "Calculate low-rank decomposition matrices (Rank r, Alpha scaling)",
      "Configure QLoRA with NF4 quantization for low VRAM training",
      "Merge adapter weights back into base model checkpoints"
    ],
    tools: ["PEFT", "BitsAndBytes", "TRL / HuggingFace"],
    difficulty: "Advanced",
    keyConcepts: ["LoRA Rank & Alpha", "4-bit Quantization (NF4)", "Adapter Merging", "VRAM Optimization"]
  },
  {
    day: 15,
    module: "Module 3: Fine-Tuning & Model Alignment",
    topic: "RLHF, DPO & Model Alignment",
    description: "Direct Preference Optimization (DPO), Reinforcement Learning from Human Feedback (RLHF), and preference pairs.",
    learningObjectives: [
      "Understand reward modeling vs Direct Preference Optimization (DPO)",
      "Format preference dataset pairs (prompt, chosen, rejected)",
      "Evaluate KL divergence regularization to prevent mode collapse"
    ],
    tools: ["TRL DPOTrainer", "HuggingFace Datasets"],
    difficulty: "Advanced",
    keyConcepts: ["DPO (Direct Preference Optimization)", "Preference Pairs", "KL Divergence", "Model Alignment"]
  },
  {
    day: 16,
    module: "Module 3: Fine-Tuning & Model Alignment",
    topic: "Model Distillation & Quantization",
    description: "Knowledge distillation from teacher (e.g., Gemini Pro) to student models, GGUF, AWQ, and GPTQ quantization.",
    learningObjectives: [
      "Distill domain expertise from large models into compact local SLMs",
      "Compare GGUF, AWQ, and EXL2 quantization techniques",
      "Deploy local quantized models on edge runtime using Ollama/vLLM"
    ],
    tools: ["Ollama", "vLLM", "llama.cpp", "AutoAWQ"],
    difficulty: "Intermediate",
    keyConcepts: ["Teacher-Student Distillation", "GGUF Quantization", "AWQ", "vLLM Inference"]
  },
  {
    day: 17,
    module: "Module 3: Fine-Tuning & Model Alignment",
    topic: "Model Benchmarking & Evaluation Frameworks",
    description: "Evaluating fine-tuned models on standard benchmarks (MMLU, GSM8K, HumanEval) and custom domain rubrics.",
    learningObjectives: [
      "Run automated evaluations with LM Evaluation Harness",
      "Design LLM-as-a-Judge pairwise evaluation rubrics",
      "Analyze model drift, toxicity, and safety guardrails"
    ],
    tools: ["LM Evaluation Harness", "G-Eval", "Promptfoo"],
    difficulty: "Intermediate",
    keyConcepts: ["LLM-as-a-Judge", "MMLU / HumanEval", "Pairwise Evaluation", "Model Drift"]
  },
  {
    day: 18,
    module: "Module 4: Agentic AI Systems",
    topic: "Agent Frameworks & ReAct Pattern",
    description: "Reasoning and Acting (ReAct) paradigm, thought-action-observation loops, and autonomous agent state machines.",
    learningObjectives: [
      "Implement a ReAct agent loop from first principles",
      "Parse thought, action, and action input patterns dynamically",
      "Prevent infinite agent loops with step limits and fallback handlers"
    ],
    tools: ["LangChain Agents", "LlamaIndex ReactAgent", "Custom ReAct Loop"],
    difficulty: "Intermediate",
    keyConcepts: ["ReAct Paradigm", "Thought-Action-Observation", "Agent Step Limits", "State Machines"]
  },
  {
    day: 19,
    module: "Module 4: Agentic AI Systems",
    topic: "Tool Integration & Function Calling",
    description: "Exposing external APIs, databases, and custom functions as typed tools to LLMs using FunctionDeclaration schemas.",
    learningObjectives: [
      "Define type-safe tool declarations using FunctionDeclaration",
      "Handle tool execution returns and feed results back to model turn",
      "Safely validate tool parameters before execution"
    ],
    tools: ["@google/genai FunctionDeclaration", "FastAPI Tools", "Pydantic"],
    difficulty: "Intermediate",
    keyConcepts: ["Function Calling Schema", "Tool Execution Loop", "Tool Argument Validation", "API Integration"]
  },
  {
    day: 20,
    module: "Module 4: Agentic AI Systems",
    topic: "Multi-Agent Collaboration & Orchestration",
    description: "Orchestrator-Worker patterns, supervisor models, debate frameworks, and task breakdown graph architectures.",
    learningObjectives: [
      "Architect supervisor-directed multi-agent collaboration workflows",
      "Manage message passing and shared context state between agents",
      "Build cyclic and acyclic agent graphs with state branching"
    ],
    tools: ["LangGraph", "AutoGen", "CrewAI"],
    difficulty: "Advanced",
    keyConcepts: ["Supervisor Agent", "Orchestrator-Worker Pattern", "State Graphs", "Agent Inter-Communication"]
  },
  {
    day: 21,
    module: "Module 4: Agentic AI Systems",
    topic: "Agent Memory & Long-Term Persistence",
    description: "Short-term buffer memory, summary memory, episodic memory, and long-term vector store memory for agents.",
    learningObjectives: [
      "Implement sliding window conversation buffers and automatic summarization",
      "Store and query episodic long-term memory in vector databases",
      "Isolate multi-session memory namespaces per candidate/user"
    ],
    tools: ["Zep Memory", "LangChain ConversationSummary", "Redis"],
    difficulty: "Intermediate",
    keyConcepts: ["Episodic Memory", "Sliding Window Buffer", "Conversation Summarization", "State Persistence"]
  },
  {
    day: 22,
    module: "Module 4: Agentic AI Systems",
    topic: "Autonomous Planning & Goal Decomposition",
    description: "Hierarchical planning, Tree of Thoughts (ToT), self-reflection, and course correction during agent task execution.",
    learningObjectives: [
      "Implement sub-goal decomposition for complex multi-step user tasks",
      "Incorporate reflection steps for agent self-correction",
      "Apply Tree-of-Thoughts exploration for complex problem solving"
    ],
    tools: ["Tree of Thoughts Framework", "Reflexion Pattern"],
    difficulty: "Advanced",
    keyConcepts: ["Sub-goal Decomposition", "Self-Reflection (Reflexion)", "Tree of Thoughts (ToT)", "Course Correction"]
  },
  {
    day: 23,
    module: "Module 4: Agentic AI Systems",
    topic: "Agent Safety, Guardrails & Human-in-the-Loop",
    description: "Output validation guardrails, prompt injection shields, tool permission policies, and human approval checkpoints.",
    learningObjectives: [
      "Configure input/output guardrail filters with NeMo Guardrails or Guardrails AI",
      "Implement Human-in-the-Loop (HITL) approval gates for sensitive tool actions",
      "Detect and neutralize indirect prompt injections in retrieved context"
    ],
    tools: ["NeMo Guardrails", "Guardrails AI", "Llama Guard"],
    difficulty: "Advanced",
    keyConcepts: ["Human-in-the-Loop (HITL)", "Input/Output Guardrails", "Indirect Prompt Injection", "Permission Scopes"]
  },
  {
    day: 24,
    module: "Module 5: Model Context Protocol (MCP)",
    topic: "Model Context Protocol (MCP) Core Architecture",
    description: "Introduction to Anthropic / Linux Foundation Model Context Protocol (MCP): Client, Host, Server architecture and JSON-RPC 2.0 protocol.",
    learningObjectives: [
      "Understand MCP Server-Client architecture and JSON-RPC transport",
      "Distinguish between Resources, Prompts, and Tools in MCP specification",
      "Set up STDIO and SSE transports for MCP servers"
    ],
    tools: ["FastMCP Python/TS SDK", "MCP Inspector", "JSON-RPC 2.0"],
    difficulty: "Advanced",
    keyConcepts: ["MCP Architecture", "JSON-RPC 2.0", "Resources vs Tools", "STDIO & SSE Transports"]
  },
  {
    day: 25,
    module: "Module 5: Model Context Protocol (MCP)",
    topic: "Building Custom MCP Servers",
    description: "Developing custom MCP servers to expose internal enterprise databases, file systems, and tools to LLM applications.",
    learningObjectives: [
      "Build custom Python or TypeScript MCP servers using FastMCP",
      "Expose database tables as readable MCP Resources with URI schemes",
      "Implement dynamic tool registrations and schema validation"
    ],
    tools: ["FastMCP", "@modelcontextprotocol/sdk", "TypeScript"],
    difficulty: "Advanced",
    keyConcepts: ["FastMCP SDK", "Resource URIs", "Dynamic Tool Registration", "MCP Host Client"]
  },
  {
    day: 26,
    module: "Module 5: Model Context Protocol (MCP)",
    topic: "MCP Security, Authorization & Enterprise Integration",
    description: "Securing MCP connections, OAuth integration, context sanitization, and enterprise deployment of MCP servers.",
    learningObjectives: [
      "Implement bearer token authorization for SSE MCP servers",
      "Audit tool calls and parameter boundaries for compliance",
      "Connect enterprise IDEs and AI agent hosts to containerized MCP servers"
    ],
    tools: ["OAuth 2.0", "Docker", "FastMCP Security Middleware"],
    difficulty: "Advanced",
    keyConcepts: ["MCP Bearer Auth", "Context Sanitization", "Enterprise Security", "Host Authorization"]
  },
  {
    day: 27,
    module: "Module 6: AI Systems & Architecture",
    topic: "Latency Optimization & Streaming Architecture",
    description: "Optimizing end-to-end inference latency: TTFT reduction, speculative decoding, chunk streaming, and WebSockets.",
    learningObjectives: [
      "Analyze latency bottlenecks across token generation pipeline",
      "Implement speculative decoding and draft model acceleration concepts",
      "Build high-throughput streaming backends with WebSocket / SSE"
    ],
    tools: ["vLLM Speculative Decoding", "WebSockets", "FastAPI"],
    difficulty: "Advanced",
    keyConcepts: ["TTFT (Time To First Token)", "Speculative Decoding", "WebSocket Streaming", "Batching"]
  },
  {
    day: 28,
    module: "Module 6: AI Systems & Architecture",
    topic: "LLM Semantic Caching & Rate Limiting",
    description: "Reducing API costs and response times with semantic caching (GPTCache/Redis) and distributed rate limiters.",
    learningObjectives: [
      "Build a semantic cache using vector embeddings and similarity thresholds",
      "Implement distributed token-bucket rate limiters in Redis",
      "Handle cache invalidation and dynamic similarity scoring"
    ],
    tools: ["Redis", "GPTCache", "Upstash"],
    difficulty: "Intermediate",
    keyConcepts: ["Semantic Caching", "Similarity Threshold", "Token Bucket Rate Limiting", "Cache Invalidation"]
  },
  {
    day: 29,
    module: "Module 6: AI Systems & Architecture",
    topic: "Enterprise AI Infrastructure & System Design",
    description: "Designing fault-tolerant, scalable LLM application architectures for enterprise security, multi-tenancy, and privacy.",
    learningObjectives: [
      "Design end-to-end multi-tenant LLM gateway architectures",
      "Implement PII redaction and data loss prevention (DLP) filters",
      "Architect cloud fallback routes across multiple LLM providers"
    ],
    tools: ["Cloud Run", "Kong API Gateway", "Presidio PII Masking"],
    difficulty: "Advanced",
    keyConcepts: ["Multi-Tenant Gateway", "PII Redaction", "Provider Fallbacks", "System Design"]
  },
  {
    day: 30,
    module: "Module 7: Production AI & Capstone Deployment",
    topic: "Observability, Tracing & Evaluation in Production",
    description: "Monitoring LLM applications in production: OpenTelemetry tracing, LangSmith/Arize, feedback loops, and token cost tracking.",
    learningObjectives: [
      "Set up distributed tracing for complex multi-step agent graphs",
      "Track latency, token usage, and cost per request/user",
      "Collect user implicit/explicit feedback to trigger automated evaluations"
    ],
    tools: ["LangSmith", "Arize Phoenix", "OpenTelemetry"],
    difficulty: "Intermediate",
    keyConcepts: ["Distributed Tracing", "Token Cost Analytics", "LangSmith", "Feedback Loop"]
  },
  {
    day: 31,
    module: "Module 7: Production AI & Capstone Deployment",
    topic: "Production Capstone & Technical Interview Readiness",
    description: "Comprehensive synthesis of the 31-day cohort: Architecture walkthroughs, system trade-offs, and technical defense.",
    learningObjectives: [
      "Articulate architectural trade-offs in technical engineering interviews",
      "Defend design decisions regarding RAG vs Fine-tuning vs Agentic approaches",
      "Demonstrate mastery across all 31 days of the enterprise AI program"
    ],
    tools: ["System Architecture Specs", "AI Interview Agent"],
    difficulty: "Advanced",
    keyConcepts: ["Architectural Defense", "RAG vs Fine-tuning Trade-offs", "Production Readiness", "Cohort Capstone"]
  }
];
