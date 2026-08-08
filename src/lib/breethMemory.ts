/**
 * Breeth Memory API Integration Helper
 * Provides persistent memory storage and retrieval for multi-turn AI interviews
 * Endpoint: https://mcp.thebreeth.com/mcp or Breeth REST API (https://api.thebreeth.com/v1/memory)
 */

export interface BreethMemoryItem {
  sessionId: string;
  candidateId: string;
  candidateName?: string;
  questionNumber: number;
  day: number;
  topic: string;
  questionText: string;
  candidateAnswer: string;
  evaluationScore: number;
  evaluationLabel: string;
  feedback: string;
  timestamp: string;
}

export interface BreethQueryContext {
  sessionId: string;
  candidateId: string;
  relevantPastAnswers?: BreethMemoryItem[];
  contextSummary?: string;
}

/**
 * Retrieve past interview memory / context for a candidate from Breeth Memory API
 */
export async function getBreethInterviewMemory(
  candidateId: string,
  sessionId: string
): Promise<BreethMemoryItem[]> {
  const apiKey = process.env.BREETH_API_KEY;
  if (!apiKey) {
    console.warn("[Breeth Memory] BREETH_API_KEY not set. Falling back to local context.");
    return [];
  }

  try {
    // Attempt REST API query endpoint first
    const restUrl = process.env.BREETH_API_URL || "https://api.thebreeth.com/v1/memory/query";
    const response = await fetch(restUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
        "x-api-key": apiKey,
      },
      body: JSON.stringify({
        candidate_id: candidateId,
        session_id: sessionId,
        query: `Technical interview memory history for candidate ${candidateId}`,
        limit: 15,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return data.memories || data.items || [];
    }

    // Secondary try: MCP JSON-RPC protocol endpoint if REST is alternate
    const mcpUrl = "https://mcp.thebreeth.com/mcp";
    const mcpResponse = await fetch(mcpUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: Date.now(),
        method: "tools/call",
        params: {
          name: "get_memory",
          arguments: {
            candidate_id: candidateId,
            session_id: sessionId,
          },
        },
      }),
    });

    if (mcpResponse.ok) {
      const mcpData = await mcpResponse.json();
      const content = mcpData?.result?.content?.[0]?.text;
      if (content) {
        return JSON.parse(content);
      }
    }

    console.log("[Breeth Memory] Memory query status:", response.status, "(using local session history)");
    return [];
  } catch (error: any) {
    console.log("[Breeth Memory] Remote memory query bypassed. Using local session history.");
    return [];
  }
}

/**
 * Write / save a candidate Q&A exchange and evaluation into Breeth Memory API
 */
export async function saveBreethInterviewExchange(
  memoryRecord: BreethMemoryItem
): Promise<boolean> {
  const apiKey = process.env.BREETH_API_KEY;
  if (!apiKey) {
    console.warn("[Breeth Memory] BREETH_API_KEY missing. Skipped remote Breeth persistence.");
    return false;
  }

  try {
    const restUrl = process.env.BREETH_API_URL || "https://api.thebreeth.com/v1/memory/store";
    const response = await fetch(restUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
        "x-api-key": apiKey,
      },
      body: JSON.stringify({
        candidate_id: memoryRecord.candidateId,
        session_id: memoryRecord.sessionId,
        memory_type: "interview_exchange",
        data: memoryRecord,
        metadata: {
          topic: memoryRecord.topic,
          day: memoryRecord.day,
          score: memoryRecord.evaluationScore,
        },
      }),
    });

    if (response.ok) {
      console.log(`[Breeth Memory] Saved exchange for Q${memoryRecord.questionNumber} successfully.`);
      return true;
    }

    // Try MCP JSON-RPC protocol endpoint as fallback
    const mcpUrl = "https://mcp.thebreeth.com/mcp";
    const mcpResponse = await fetch(mcpUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: Date.now(),
        method: "tools/call",
        params: {
          name: "add_memory",
          arguments: {
            content: `Interview Question #${memoryRecord.questionNumber} (Day ${memoryRecord.day} - ${memoryRecord.topic}): "${memoryRecord.questionText}". Candidate Answer: "${memoryRecord.candidateAnswer}". Score: ${memoryRecord.evaluationScore}/100 (${memoryRecord.evaluationLabel}). Feedback: ${memoryRecord.feedback}`,
            candidate_id: memoryRecord.candidateId,
            session_id: memoryRecord.sessionId,
            tags: ["interview", `day-${memoryRecord.day}`, memoryRecord.topic],
          },
        },
      }),
    });

    if (mcpResponse.ok) {
      console.log(`[Breeth Memory] Saved via MCP protocol for Q${memoryRecord.questionNumber}.`);
      return true;
    }

    console.log(`[Breeth Memory] Remote persistence status (${response.status}). In-memory history maintained.`);
    return false;
  } catch (error: any) {
    console.log("[Breeth Memory] Remote persistence bypassed. In-memory history maintained.");
    return false;
  }
}
