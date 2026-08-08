import { InterviewQuestion } from '../types';

export const SAMPLE_QUESTIONS: InterviewQuestion[] = [
  {
    id: "q-day1",
    day: 1,
    module: "Module 1: Foundations & LLM Architecture",
    topic: "AI Engineering Introduction & LLM Fundamentals",
    questionText: "Explain how self-attention works in transformer models, and what role the Key, Query, and Value matrices play during sequence processing.",
    difficulty: "Medium",
    type: "Conceptual",
    expectedKeyPoints: [
      "Query (Q) represents what the current token is searching for",
      "Key (K) represents what information each token contains",
      "Value (V) holds the actual representation passed forward",
      "Attention weight matrix is computed via softmax((Q * K^T) / sqrt(d_k))",
      "Weighted sum over V matrices produces context-aware token representation"
    ],
    sampleIdealAnswer: "In the Transformer architecture, self-attention allows each token to dynamically weight its relationship to every other token in the sequence. Queries (Q) represent the look-up requests, Keys (K) represent the indexed tags of tokens, and Values (V) contain the content. We compute attention scores by taking the dot product of Q and K, dividing by the square root of the key dimension for gradient stability, applying softmax to get probabilities, and multiplying by V."
  },
  {
    id: "q-day4",
    day: 4,
    module: "Module 1: Foundations & LLM Architecture",
    topic: "Prompt Engineering Basics & System Instructions",
    questionText: "What are system instructions in modern LLM APIs, and how do they differ from user messages in maintaining role boundaries and preventing prompt injection?",
    difficulty: "Easy",
    type: "Conceptual",
    expectedKeyPoints: [
      "System instructions set top-level behavior, persona constraints, and output boundaries",
      "Evaluated with higher privilege / authority than user messages in prompt formatting",
      "Prevents user text from hijacking the assistant persona",
      "Uses clear delimiters (XML tags, markdown fences) to isolate untrusted inputs"
    ],
    sampleIdealAnswer: "System instructions set persistent rules, persona attributes, and strict operational boundaries before any user input is processed. They carry higher priority in the model's instruction hierarchy compared to user messages. This separation prevents user inputs from overriding system logic or injecting malicious persona overrides."
  },
  {
    id: "q-day5",
    day: 5,
    module: "Module 1: Foundations & LLM Architecture",
    topic: "Advanced Prompting & Structured Outputs",
    questionText: "How do you enforce guaranteed JSON schema outputs from an LLM API, and why is schema-constrained generation superior to asking for JSON in plain text prompts?",
    difficulty: "Medium",
    type: "Coding",
    expectedKeyPoints: [
      "Uses API-native responseSchema or grammar-guided decoding",
      "Constrains output token logits at sampling time to match valid JSON syntax",
      "Eliminates JSON parsing errors, missing fields, or hallucinated extra text",
      "Integrates with TypeScript/Pydantic types for compile-time or runtime validation"
    ],
    sampleIdealAnswer: "Guaranteed JSON output is enforced at sampling time using constrained decoding or responseSchema parameters (e.g. in @google/genai or OpenAI structured outputs). The model's token selection logits are masked so only tokens adhering to the JSON schema grammar can be emitted. This guarantees syntactically valid JSON and eliminates raw string regex hacks."
  },
  {
    id: "q-day7",
    day: 7,
    module: "Module 2: RAG Systems & Vector Databases",
    topic: "Vector Databases - Pinecone & Qdrant",
    questionText: "How does the HNSW (Hierarchical Navigable Small World) index work in vector databases like Pinecone or Qdrant, and what are the trade-offs between indexing speed, memory, and recall accuracy?",
    difficulty: "Hard",
    type: "System Design",
    expectedKeyPoints: [
      "HNSW constructs a multi-layer graph hierarchy where upper layers enable long-distance skips",
      "Lower layers offer dense local search for high nearest-neighbor precision",
      "Trade-off: High RAM consumption due to maintaining graph edge linkages in memory",
      "Parameters m (max connections per node) and efConstruction/efSearch tune recall vs latency"
    ],
    sampleIdealAnswer: "HNSW builds a multi-layered graph where top layers have sparse long-range connections for fast coarse navigation, and bottom layers have dense short-range connections for exact nearest neighbor resolution. Higher M and efSearch parameters increase recall accuracy but cost significantly more RAM and index build time."
  },
  {
    id: "q-day10",
    day: 10,
    module: "Module 2: RAG Systems & Vector Databases",
    topic: "Hybrid Search & Sparse-Dense Fusion",
    questionText: "Explain the difference between dense embeddings and sparse vectors (like BM25). Why is Hybrid Search with Reciprocal Rank Fusion (RRF) effective for domain-specific RAG?",
    difficulty: "Medium",
    type: "Conceptual",
    expectedKeyPoints: [
      "Dense vectors capture deep semantic meaning and conceptual similarity",
      "Sparse vectors (BM25) excel at exact keyword matching, jargon, SKUs, and proper nouns",
      "RRF combines rank positions (1 / (k + rank)) without needing score normalization",
      "Hybrid search solves cases where semantic search misses precise technical acronyms or part numbers"
    ],
    sampleIdealAnswer: "Dense embeddings represent semantic intent in high-dimensional continuous space, while sparse vectors match specific keywords and exact strings. Hybrid search merges results using Reciprocal Rank Fusion (RRF), which ranks items based on their positional ranks across both lists rather than raw scores. This ensures domain acronyms or serial numbers are retrieved alongside semantic queries."
  },
  {
    id: "q-day12",
    day: 12,
    module: "Module 2: RAG Systems & Vector Databases",
    topic: "RAG Evaluation & Triad Metrics",
    questionText: "What are the three core metrics of the RAG Triad, and how would you diagnose a RAG system that has high Context Relevance but low Answer Faithfulness?",
    difficulty: "Hard",
    type: "Practical",
    expectedKeyPoints: [
      "RAG Triad consists of Context Relevance, Groundedness (Faithfulness), and Answer Relevance",
      "High Context Relevance means the retrieved context contains valid information",
      "Low Faithfulness means the generator is hallucinating facts NOT supported by retrieved context",
      "Fixes: Adjust generator temperature, enforce strict 'answer only using provided context' instructions, or shorten context window to avoid noise"
    ],
    sampleIdealAnswer: "The RAG Triad comprises Context Relevance (retrieval quality), Faithfulness/Groundedness (generation strictly supported by context), and Answer Relevance (response answers query). If Context Relevance is high but Faithfulness is low, the LLM is hallucinating or relying on pre-training bias rather than the context. We resolve this by tuning system instructions, lowering sampling temperature, and adding strict context attribution constraints."
  },
  {
    id: "q-day14",
    day: 14,
    module: "Module 3: Fine-Tuning & Model Alignment",
    topic: "LoRA & QLoRA Parameter-Efficient Fine-Tuning",
    questionText: "How does LoRA (Low-Rank Adaptation) reduce the trainable parameter count during LLM fine-tuning? Explain the matrix rank decomposition math simply.",
    difficulty: "Hard",
    type: "Conceptual",
    expectedKeyPoints: [
      "Freezes pretrained base model weights matrix W (dim d x k)",
      "Decomposes weight update delta W into two low-rank matrices A (d x r) and B (r x k)",
      "Rank r is much smaller than dimension d (e.g. r=8 or 16 vs d=4096)",
      "Reduces trainable parameter count by 99% and dramatically lowers VRAM requirements"
    ],
    sampleIdealAnswer: "LoRA freezes the original pretrained weights W of dimension d x k and injects two trainable low-rank matrices A (d x r) and B (r x k), where rank r is tiny (e.g. 8). Instead of updating d * k parameters, we only train (d*r + r*k) parameters. During inference, delta W = A * B can be merged directly into base weights with zero additional latency."
  },
  {
    id: "q-day18",
    day: 18,
    module: "Module 4: Agentic AI Systems",
    topic: "Agent Frameworks & ReAct Pattern",
    questionText: "Walk through the ReAct (Reasoning + Acting) execution loop in AI agents. What happens when an agent encounters an unhandled tool error?",
    difficulty: "Medium",
    type: "Conceptual",
    expectedKeyPoints: [
      "Loop alternates: Thought -> Action (Tool Call) -> Observation (Tool Output) -> Final Answer",
      "Thought step analyzes the goal and decides whether to invoke a tool or respond",
      "Observation feeds tool execution results back into agent context",
      "On tool error, observation captures error message so agent can reflect and self-correct on next turn"
    ],
    sampleIdealAnswer: "The ReAct loop interleaves Reasoning ('Thought') and Acting ('Action'). The agent formulates a thought on what tool to invoke, executes the tool, receives the output as an 'Observation', and loops until it reaches a final answer. If a tool errors, the exception is passed back as an Observation, enabling the agent to re-evaluate its plan and retry or try an alternative tool."
  },
  {
    id: "q-day19",
    day: 19,
    module: "Module 4: Agentic AI Systems",
    topic: "Tool Integration & Function Calling",
    questionText: "How does function calling work in the @google/genai SDK, and why is it essential to return tool outputs back to the model turn in multi-turn agent interactions?",
    difficulty: "Medium",
    type: "Coding",
    expectedKeyPoints: [
      "Provide tools array containing FunctionDeclaration with JSON parameters schema",
      "Model returns functionCalls array instead of text when tool is needed",
      "Application executes the real local function and constructs functionResponse part",
      "Sending functionResponse back allows model to read output and synthesize final response"
    ],
    sampleIdealAnswer: "Function calling provides the model with structured schemas via FunctionDeclaration. When the user asks a query requiring external data, the model returns a structured FunctionCall object with arguments. The client executes the function and sends a functionResponse part back to the model turn so it can contextualize the result and formulate the answer."
  },
  {
    id: "q-day20",
    day: 20,
    module: "Module 4: Agentic AI Systems",
    topic: "Multi-Agent Collaboration & Orchestration",
    questionText: "Compare the Orchestrator-Worker (Supervisor) multi-agent pattern with a Peer-to-Peer agent graph. When should you use each in complex AI systems?",
    difficulty: "Hard",
    type: "System Design",
    expectedKeyPoints: [
      "Supervisor pattern uses a central planner to route sub-tasks to specialized worker agents",
      "Worker agents return results to supervisor, which evaluates completeness",
      "Peer-to-Peer allows direct agent-to-agent handover based on dynamic state transitions",
      "Use Supervisor for structured deterministic workflows; Peer-to-Peer for open-ended research/debate"
    ],
    sampleIdealAnswer: "The Supervisor pattern uses a central agent to break down tasks, delegate to specialized worker agents, and aggregate results. This provides strong governance and deterministic flow. Peer-to-peer graphs allow agents to pass control directly to each other based on state conditions, ideal for iterative brainstorming, peer code review, or multi-perspective debate."
  },
  {
    id: "q-day24",
    day: 24,
    module: "Module 5: Model Context Protocol (MCP)",
    topic: "Model Context Protocol (MCP) Core Architecture",
    questionText: "What is Model Context Protocol (MCP), and what problem does it solve in connecting AI hosts (like Claude Desktop or IDEs) to local/remote enterprise tools?",
    difficulty: "Hard",
    type: "Conceptual",
    expectedKeyPoints: [
      "MCP is an open standard created by Anthropic for connecting AI models to context sources",
      "Solves the N x M custom integration problem between AI clients and data sources",
      "Defines standardized Client-Host-Server roles over STDIO and SSE JSON-RPC 2.0 transports",
      "Categorizes capabilities into Resources (readable data), Prompts (templates), and Tools (executable functions)"
    ],
    sampleIdealAnswer: "Model Context Protocol (MCP) is an open standard replacing fragmented custom API connectors with a unified protocol. It establishes a Client-Host-Server architecture using JSON-RPC 2.0. Host applications (like IDEs) connect to MCP servers that expose Resources (data attachments), Tools (actions), and Prompts, allowing any model to securely access enterprise context without custom glue code."
  },
  {
    id: "q-day25",
    day: 25,
    module: "Module 5: Model Context Protocol (MCP)",
    topic: "Building Custom MCP Servers",
    questionText: "How do you implement a custom MCP server in TypeScript/Python using FastMCP, and how do Resources differ from Tools in the MCP specification?",
    difficulty: "Hard",
    type: "Coding",
    expectedKeyPoints: [
      "Resources are passive, read-only context attachments identified by custom URI schemes (e.g. postgres://db/table)",
      "Tools are active executable functions that perform side-effects or perform actions",
      "FastMCP exposes decorators (@mcp.resource, @mcp.tool) for clean registration",
      "Communicates over stdio or SSE transport layer using JSON-RPC messages"
    ],
    sampleIdealAnswer: "In FastMCP, Resources are passive read-only context endpoints mapped to URIs (like file:// or database://) that hosts attach as context. Tools are active functions with typed input parameters that models invoke to perform side-effects. FastMCP uses TypeScript decorators or Python function wrappers to expose these endpoints cleanly over JSON-RPC."
  },
  {
    id: "q-day28",
    day: 28,
    module: "Module 6: AI Systems & Architecture",
    topic: "LLM Semantic Caching & Rate Limiting",
    questionText: "How does Semantic Caching work in LLM gateways, and how do you calculate vector similarity thresholds to prevent returning stale or incorrect cached responses?",
    difficulty: "Medium",
    type: "System Design",
    expectedKeyPoints: [
      "User query is vectorized and compared against cached query vectors in a vector database/Redis",
      "If Cosine Similarity > Threshold (e.g., 0.92), return cached completion instantly",
      "Significantly cuts latency (from seconds to milliseconds) and API costs to $0",
      "Threshold tuning is critical: too high misses valid cache hits; too low causes false positives"
    ],
    sampleIdealAnswer: "Semantic caching embeds incoming user queries and computes similarity against previously cached query vectors in Redis or vector store. If the distance satisfies a high cosine similarity threshold (e.g., 0.92+), the cached answer is returned immediately, bypassing LLM inference. This drops latency from seconds to under 20ms and slashes API costs."
  },
  {
    id: "q-day30",
    day: 30,
    module: "Module 7: Production AI & Capstone Deployment",
    topic: "Observability, Tracing & Evaluation in Production",
    questionText: "Why is distributed tracing essential for multi-agent RAG pipelines in production, and what key metrics should you monitor in LangSmith or Arize?",
    difficulty: "Medium",
    type: "Practical",
    expectedKeyPoints: [
      "Multi-turn agent pipelines involve multiple nested LLM calls, tool executions, and retrieval passes",
      "Distributed tracing captures execution trees with parent-child span IDs",
      "Key metrics: TTFT (Time to First Token), Total Latency, Token Cost per turn, RAG Triad scores, and Tool error rates",
      "Enables root cause debugging when an agent gets stuck in a loop or returns hallucinated output"
    ],
    sampleIdealAnswer: "Distributed tracing tracks multi-step agent execution trees by assigning trace and span IDs to every prompt, tool call, and vector retrieval. In platforms like LangSmith or Arize, we monitor latency bottlenecks, token cost per session, prompt version drift, tool failure rates, and real-time hallucination scores to maintain production reliability."
  }
];
