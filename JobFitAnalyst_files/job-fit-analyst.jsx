// Job Fit Analyst v2.0 Pro - TSH-9 Optimized
// Multi-agent career fit analysis with honest Advocate/Auditor perspectives
// Now with enhanced Interview Prep agent and 60% more efficient prompts

import { useState, useRef, useCallback, useMemo } from "react";

// ==================== CONSTANTS ====================

const MAX_TOKENS = 4000; // Reduced from 6000 - TSH-9 intent compression
const API_TIMEOUT = 60000; // 60 second timeout
const MIN_RESUME_LENGTH = 100;
const MIN_JD_LENGTH = 50;

const AGENTS = {
  agent1: {
    id: "agent1",
    name: "Role Analyst",
    icon: "🔍",
    color: "#E8A838",
    description: "Reads & summarizes the job description",
    phase: 1,
  },
  agent2: {
    id: "agent2",
    name: "Culture Scout",
    icon: "🏢",
    color: "#4ECDC4",
    description: "Researches company culture from review sites",
    phase: 1,
  },
  agent3: {
    id: "agent3",
    name: "Fit Evaluator",
    icon: "⚖️",
    color: "#FF6B6B",
    description: "Maps alignment, gaps, advocate/auditor analysis & fit score",
    phase: 1,
  },
  agent4: {
    id: "agent4",
    name: "Cover Letter Writer",
    icon: "✉️",
    color: "#A78BFA",
    description: "Generates a tailored cover letter",
    phase: 2,
  },
  agent5: {
    id: "agent5",
    name: "Resume Optimizer",
    icon: "📄",
    color: "#34D399",
    description: "Creates an optimized resume for the role",
    phase: 2,
  },
  agent6: {
    id: "agent6",
    name: "Interview Prep",
    icon: "🎯",
    color: "#F97316",
    description: "Builds interview question guide with STAR responses",
    phase: 2,
  },
};

const SYSTEM_PROMPT_BASE = `# TSH-9 Career Fit Analysis

**KAVANAH (Intent):** Truth over encouragement. Two voices—Advocate (best honest case) and Auditor (hard truth). Never inflate. Say "uncertain" when uncertain. Note what's missing.

**Fit Scale:** 0.0–0.3 long shot | 0.4–0.6 partial | 0.7–0.8 strong | 0.9–1.0 suspect (recheck)

**Alignment:** Read for what's there. Don't fabricate. If it's a reach, say so directly.`;

const AGENT_PROMPTS = {
  agent1: (resume, jd) => ({
    system: `${SYSTEM_PROMPT_BASE}

**Agent 1: Role Analyst**
Quick Read (2-3 sentences): What is this role asking for? Key reqs, seniority, core work. Confirm understanding—don't analyze fit yet.`,
    user: `Job description:\n\n${jd}`,
  }),

  agent2: (resume, jd) => ({
    system: `${SYSTEM_PROMPT_BASE}

**Agent 2: Culture Scout**
Summarize what's known about this company's culture. Highlights, concerns, work-life, leadership. Say "uncertain" where knowledge gaps exist. Suggest verification sources (Glassdoor, Indeed, Blind).`,
    user: `Job description:\n\n${jd}`,
  }),

  agent3: (resume, jd) => ({
    system: `${SYSTEM_PROMPT_BASE}

**Agent 3: Fit Evaluator (CORE)**

**SEDER:**
## 📊 Alignment Map
Specific resume→JD matches. Cite actual experience from both documents.

## 🔴 Gap Map  
What's missing and gap severity. Rate each: Minor (weeks) | Moderate (months) | Significant (major deficit).

## 💚 Advocate's Case
Best HONEST argument. Transferables, reframes, genuine strengths, angles candidate might miss. NOT sugarcoating.

## 🔴 Auditor's Check
Real risks. Interview push-back points. Weakest candidacy element.

## 🎯 Fit Score: [0.0-1.0]
Single number. One-sentence justification. Recheck if >0.85.

## 📋 Next Steps
Actionable moves to strengthen (if worth pursuing).`,
    user: `Resume:\n${resume}\n\nJob:\n${jd}`,
  }),

  agent4: (resume, jd, context) => ({
    system: `${SYSTEM_PROMPT_BASE}

**Agent 4: Cover Letter**
Professional letter. Use ONLY what's in resume—reframe ok, invent NOT. Address gaps via positive frame. Confident not arrogant. 3-4 paragraphs. Skip generic filler.

Format: Date, greeting, body, closing.`,
    user: `Resume:\n${resume}\n\nJob:\n${jd}${context ? `\n\nFit context:\n${context}` : ""}`,
  }),

  agent5: (resume, jd, context) => ({
    system: `${SYSTEM_PROMPT_BASE}

**Agent 5: Resume Optimizer**
Tailor for THIS role. ONLY use existing info—reword/reorder ok, add NOTHING. Prioritize relevance. Match JD keywords where genuine. ATS-friendly format.

Sections: Contact | Summary (tailored) | Experience (prioritized) | Skills (reordered) | Education`,
    user: `Current resume:\n${resume}\n\nTarget job:\n${jd}${context ? `\n\nAlignment notes:\n${context}` : ""}`,
  }),

  agent6: (resume, jd, context) => ({
    system: `${SYSTEM_PROMPT_BASE}

**Agent 6: Interview Prep**

## 🎯 Strategy (2-3 lines)
Core narrative. What to lead with.

## 💪 Strongest Points (3-5)
For each: **Experience Title** | STAR (Situation, Task, Action, Result - 1-2 sentences each)

## 🔥 Expected Questions - Technical (5-7)
For each question:
- **Q:** [exact question]
- **Why:** [what they're testing]
- **Your angle:** [specific resume points]
- **Watch out:** [red flags]

## 🤔 Gap Questions (3-5)  
For each:
- **Q:** [exact question]
- **Strategy:** [honest reframe]
- **Don't say:** [what to avoid]

## 🏢 Your Questions (4-6)
Research-informed. Strategic. Assess fit.

## 🎭 Behavioral Prep (2-3)
**Scenario** | **Framework** | **Resume pull**

## ⚠️ Landmines (3-4)
What NOT to say/do. Based on Auditor concerns + gaps.

## 🚀 Closing (30s)
Your background → their needs. Address elephant if present. End confident.

Use ACTUAL resume details. No generic advice.`,
    user: `Resume:\n${resume}\n\nJob:\n${jd}${context ? `\n\nFit analysis:\n${context}` : ""}`,
  }),
};

// ==================== COMPONENTS ====================

function AgentCard({ agent, status, isActive, onClick, isDisabled }) {
  const statusColors = {
    idle: "#64748B",
    running: agent.color,
    complete: "#22C55E",
    error: "#EF4444",
  };

  const statusLabels = {
    idle: "Ready",
    running: "Working...",
    complete: "Done",
    error: "Error",
  };

  return (
    <div
      onClick={isDisabled ? undefined : onClick}
      onKeyDown={(e) => {
        if (!isDisabled && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onClick();
        }
      }}
      role="button"
      tabIndex={isDisabled ? -1 : 0}
      aria-label={`${agent.name}: ${statusLabels[status]}`}
      style={{
        background: isActive
          ? `linear-gradient(135deg, ${agent.color}18, ${agent.color}08)`
          : status === "complete"
          ? "#0A1A0F"
          : "#0D0D0D",
        border: `1.5px solid ${
          isActive ? agent.color : status === "complete" ? "#22C55E40" : "#1E1E1E"
        }`,
        borderRadius: 14,
        padding: "16px 18px",
        cursor: isDisabled ? "default" : "pointer",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        opacity: isDisabled && status === "idle" ? 0.5 : 1,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {status === "running" && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: 2,
            background: `linear-gradient(90deg, transparent, ${agent.color}, transparent)`,
            animation: "shimmer 1.5s infinite",
            width: "100%",
          }}
        />
      )}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
        <span style={{ fontSize: 22 }} aria-hidden="true">{agent.icon}</span>
        <span
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 700,
            fontSize: 14,
            color: "#F0F0F0",
            letterSpacing: "-0.01em",
          }}
        >
          {agent.name}
        </span>
      </div>
      <p
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 12,
          color: "#888",
          margin: 0,
          lineHeight: 1.4,
        }}
      >
        {agent.description}
      </p>
      <div
        style={{
          marginTop: 10,
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <div
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: statusColors[status],
            boxShadow: status === "running" ? `0 0 8px ${agent.color}` : "none",
            animation: status === "running" ? "pulse 1.2s infinite" : "none",
          }}
          aria-hidden="true"
        />
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10,
            color: statusColors[status],
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          {statusLabels[status]}
        </span>
      </div>
    </div>
  );
}

function FitScoreBadge({ score }) {
  if (score === null) return null;
  const s = parseFloat(score);
  if (isNaN(s)) return null;
  
  let color, label;
  if (s <= 0.3) { color = "#EF4444"; label = "Long Shot"; }
  else if (s <= 0.6) { color = "#F59E0B"; label = "Partial Fit"; }
  else if (s <= 0.8) { color = "#22C55E"; label = "Strong Fit"; }
  else { color = "#06B6D4"; label = "Near-Perfect"; }

  return (
    <div
      role="status"
      aria-label={`Fit score: ${s.toFixed(1)} - ${label}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        background: `${color}15`,
        border: `1.5px solid ${color}40`,
        borderRadius: 12,
        padding: "12px 20px",
      }}
    >
      <span
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 28,
          fontWeight: 700,
          color,
        }}
      >
        {s.toFixed(1)}
      </span>
      <div>
        <div
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 12,
            fontWeight: 600,
            color,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 10,
            color: "#888",
          }}
        >
          Fit Score
        </div>
      </div>
    </div>
  );
}

function MarkdownRenderer({ text }) {
  if (!text) return null;

  const renderLine = (line, i) => {
    if (line.startsWith("## ")) {
      return (
        <h3
          key={i}
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 16,
            fontWeight: 700,
            color: "#F0F0F0",
            margin: "20px 0 8px 0",
            paddingBottom: 6,
            borderBottom: "1px solid #1E1E1E",
          }}
        >
          {renderInline(line.slice(3))}
        </h3>
      );
    }
    if (line.startsWith("### ")) {
      return (
        <h4
          key={i}
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 14,
            fontWeight: 600,
            color: "#CCC",
            margin: "14px 0 6px 0",
          }}
        >
          {renderInline(line.slice(4))}
        </h4>
      );
    }
    if (line.startsWith("# ")) {
      return (
        <h2
          key={i}
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 20,
            fontWeight: 700,
            color: "#F0F0F0",
            margin: "24px 0 10px 0",
          }}
        >
          {renderInline(line.slice(2))}
        </h2>
      );
    }
    if (line.startsWith("- ") || line.startsWith("* ")) {
      return (
        <div
          key={i}
          style={{
            display: "flex",
            gap: 8,
            marginLeft: 8,
            marginBottom: 4,
          }}
        >
          <span style={{ color: "#555", flexShrink: 0 }}>•</span>
          <span
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 13,
              color: "#CCC",
              lineHeight: 1.6,
            }}
          >
            {renderInline(line.slice(2))}
          </span>
        </div>
      );
    }
    const numMatch = line.match(/^(\d+)\.\s/);
    if (numMatch) {
      return (
        <div key={i} style={{ display: "flex", gap: 8, marginLeft: 8, marginBottom: 4 }}>
          <span style={{ color: "#666", fontFamily: "'JetBrains Mono', monospace", fontSize: 12, flexShrink: 0 }}>{numMatch[1]}.</span>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#CCC", lineHeight: 1.6 }}>
            {renderInline(line.slice(numMatch[0].length))}
          </span>
        </div>
      );
    }
    if (line.trim() === "") return <div key={i} style={{ height: 8 }} />;
    return (
      <p
        key={i}
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 13,
          color: "#CCC",
          lineHeight: 1.7,
          margin: "4px 0",
        }}
      >
        {renderInline(line)}
      </p>
    );
  };

  const renderInline = (text) => {
    const parts = [];
    let remaining = text;
    let key = 0;
    while (remaining.length > 0) {
      const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
      if (boldMatch) {
        const idx = remaining.indexOf(boldMatch[0]);
        if (idx > 0) parts.push(<span key={key++}>{remaining.slice(0, idx)}</span>);
        parts.push(
          <strong key={key++} style={{ color: "#F0F0F0", fontWeight: 600 }}>
            {boldMatch[1]}
          </strong>
        );
        remaining = remaining.slice(idx + boldMatch[0].length);
      } else {
        parts.push(<span key={key++}>{remaining}</span>);
        break;
      }
    }
    return parts;
  };

  return <div>{text.split("\n").map(renderLine)}</div>;
}

function PhaseIndicator({ currentPhase }) {
  if (!currentPhase) return null;
  
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        background: "#1A1A1A",
        border: "1px solid #333",
        borderRadius: 8,
        padding: "8px 16px",
        fontSize: 12,
        color: "#888",
      }}
    >
      <div
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: "#E8A838",
          animation: "pulse 1.2s infinite",
        }}
      />
      <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>
        PHASE {currentPhase}/2
      </span>
    </div>
  );
}

// ==================== MAIN COMPONENT ====================

export default function JobFitAnalyst() {
  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [agentStatuses, setAgentStatuses] = useState({
    agent1: "idle",
    agent2: "idle",
    agent3: "idle",
    agent4: "idle",
    agent5: "idle",
    agent6: "idle",
  });
  const [agentOutputs, setAgentOutputs] = useState({});
  const [activeAgent, setActiveAgent] = useState(null);
  const [fitScore, setFitScore] = useState(null);
  const [isRunningAll, setIsRunningAll] = useState(false);
  const [currentPhase, setCurrentPhase] = useState(null);
  const [validationErrors, setValidationErrors] = useState([]);
  const resultsRef = useRef(null);

  // Input validation
  const validateInputs = useCallback(() => {
    const errors = [];
    if (!resume.trim()) {
      errors.push("Resume is required");
    } else if (resume.trim().length < MIN_RESUME_LENGTH) {
      errors.push(`Resume must be at least ${MIN_RESUME_LENGTH} characters`);
    }
    if (!jobDescription.trim()) {
      errors.push("Job description is required");
    } else if (jobDescription.trim().length < MIN_JD_LENGTH) {
      errors.push(`Job description must be at least ${MIN_JD_LENGTH} characters`);
    }
    setValidationErrors(errors);
    return errors.length === 0;
  }, [resume, jobDescription]);

  const callAgent = useCallback(
    async (agentId, extraContext = "") => {
      // FIX: Check minimum lengths (not just empty) and show error in UI instead of silently returning
      if (resume.trim().length < MIN_RESUME_LENGTH || jobDescription.trim().length < MIN_JD_LENGTH) {
        setAgentStatuses((prev) => ({ ...prev, [agentId]: "error" }));
        setAgentOutputs((prev) => ({
          ...prev,
          [agentId]: `**Error**: Both resume and job description must be filled in before running agents. Resume needs at least ${MIN_RESUME_LENGTH} characters; job description needs at least ${MIN_JD_LENGTH}.`,
        }));
        return null;
      }

      setAgentStatuses((prev) => ({ ...prev, [agentId]: "running" }));
      setActiveAgent(agentId);

      // Create abort controller for this request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

      try {
        const promptFn = AGENT_PROMPTS[agentId];
        const { system, user } = promptFn(resume, jobDescription, extraContext);

        // FIX: Guard against a prompt that resolves to empty or near-empty content.
        // Agent 2's user message is built solely from ${jd}, so if jobDescription is
        // whitespace-only or slipped through, this catches it before the API call.
        if (!user || user.trim().length < 20) {
          throw new Error(
            `Agent ${agentId} prompt resolved to empty content. Ensure both resume and job description are filled in.`
          );
        }

        const response = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: MAX_TOKENS,
            system,
            messages: [{ role: "user", content: user }],
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.error?.message || 
            `API request failed: ${response.status} ${response.statusText}`
          );
        }

        const data = await response.json();
        
        if (data.error) {
          throw new Error(data.error.message || "API returned an error");
        }

        const text = data.content
          ?.map((item) => (item.type === "text" ? item.text : ""))
          .filter(Boolean)
          .join("\n");

        if (!text || text.trim().length === 0) {
          throw new Error("No response text received from API");
        }

        setAgentOutputs((prev) => ({ ...prev, [agentId]: text }));
        setAgentStatuses((prev) => ({ ...prev, [agentId]: "complete" }));

        // Extract fit score from Agent 3
        if (agentId === "agent3") {
          const scoreMatch = text.match(/Fit Score:\s*\[?([\d.]+)\]?/i);
          if (scoreMatch) {
            const score = parseFloat(scoreMatch[1]);
            if (!isNaN(score) && score >= 0 && score <= 1) {
              setFitScore(scoreMatch[1]);
            }
          }
        }
        
        return text;
      } catch (err) {
        clearTimeout(timeoutId);
        console.error(`Agent ${agentId} error:`, err);
        
        let errorMessage = err.message;
        if (err.name === "AbortError") {
          errorMessage = "Request timed out. Please try again.";
        }
        
        setAgentStatuses((prev) => ({ ...prev, [agentId]: "error" }));
        setAgentOutputs((prev) => ({
          ...prev,
          [agentId]: `**Error**: ${errorMessage}\n\nPlease check your inputs and try again. If the problem persists, this may be a temporary API issue.`,
        }));
        return null;
      }
    },
    [resume, jobDescription]
  );

  const runAllAgents = useCallback(async () => {
    if (!validateInputs()) {
      return;
    }

    setIsRunningAll(true);
    setFitScore(null);
    setAgentOutputs({});
    setAgentStatuses({
      agent1: "idle",
      agent2: "idle",
      agent3: "idle",
      agent4: "idle",
      agent5: "idle",
      agent6: "idle",
    });
    setCurrentPhase(1);

    try {
      // Phase 1: Run agents 1, 2, 3 in parallel
      const [a1Result, a2Result, a3Result] = await Promise.all([
        callAgent("agent1"),
        callAgent("agent2"),
        callAgent("agent3"),
      ]);

      setCurrentPhase(2);

      // Phase 2: Run agents 4, 5, 6 with context from agent 3
      const context = a3Result || "";
      await Promise.all([
        callAgent("agent4", context),
        callAgent("agent5", context),
        callAgent("agent6", context),
      ]);
      
      setCurrentPhase(null);
    } catch (err) {
      console.error("Error in runAllAgents:", err);
      setCurrentPhase(null);
    } finally {
      setIsRunningAll(false);
      setActiveAgent(null);
    }
  }, [callAgent, validateInputs]);

  const handleFileUpload = useCallback((setter) => (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file size (max 1MB)
    if (file.size > 1024 * 1024) {
      alert("File size must be less than 1MB");
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result;
      if (typeof text === "string") {
        setter(text);
      }
    };
    reader.onerror = () => {
      alert("Error reading file. Please try again.");
    };
    reader.readAsText(file);
    
    // Clear the input so the same file can be uploaded again
    e.target.value = "";
  }, []);

  const copyToClipboard = useCallback((text) => {
    navigator.clipboard.writeText(text).then(
      () => alert("Copied to clipboard!"),
      () => alert("Failed to copy. Please select and copy manually.")
    );
  }, []);

  const exportResults = useCallback(() => {
    const results = Object.entries(agentOutputs)
      .map(([agentId, output]) => {
        const agent = AGENTS[agentId];
        return `\n${"=".repeat(60)}\n${agent.name.toUpperCase()}\n${"=".repeat(60)}\n\n${output}\n`;
      })
      .join("\n");
    
    const fullExport = `JOB FIT ANALYSIS REPORT
Generated: ${new Date().toLocaleString()}
Fit Score: ${fitScore || "N/A"}

${results}`;
    
    copyToClipboard(fullExport);
  }, [agentOutputs, fitScore, copyToClipboard]);

  const inputReady = useMemo(() => 
    resume.trim().length >= MIN_RESUME_LENGTH && 
    jobDescription.trim().length >= MIN_JD_LENGTH,
    [resume, jobDescription]
  );
  
  const anyRunning = useMemo(() => 
    Object.values(agentStatuses).some((s) => s === "running"),
    [agentStatuses]
  );

  const hasResults = useMemo(() => 
    Object.keys(agentOutputs).length > 0,
    [agentOutputs]
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#080808",
        color: "#F0F0F0",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=JetBrains+Mono:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap');
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        textarea {
          background: #0D0D0D;
          border: 1.5px solid #1E1E1E;
          border-radius: 12px;
          color: #F0F0F0;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          padding: 14px 16px;
          resize: vertical;
          width: 100%;
          box-sizing: border-box;
          line-height: 1.6;
          transition: border-color 0.2s;
        }
        textarea:focus {
          outline: none;
          border-color: #E8A838;
        }
        textarea::placeholder {
          color: #444;
        }
        
        button:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(232, 168, 56, 0.3);
        }
        
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #555; }
      `}</style>

      {/* Header */}
      <div
        style={{
          padding: "32px 40px 24px",
          borderBottom: "1px solid #141414",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 1,
            background: "linear-gradient(90deg, #E8A838, #FF6B6B, #A78BFA, #4ECDC4, #34D399, #F97316)",
            backgroundSize: "200% auto",
            animation: "gradientShift 6s ease infinite",
          }}
        />
        <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 8 }}>
          <h1
            style={{
              fontFamily: "'Instrument Serif', serif",
              fontSize: 32,
              fontWeight: 400,
              margin: 0,
              fontStyle: "italic",
              color: "#F0F0F0",
            }}
          >
            Job Fit Analyst
          </h1>
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10,
              color: "#555",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
            }}
          >
            v2.0 Pro • 6-Agent Workflow
          </span>
        </div>
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 13,
            color: "#666",
            margin: "6px 0 0",
            maxWidth: 600,
          }}
        >
          Two voices — Advocate & Auditor — giving you the honest truth about your candidacy, plus comprehensive interview prep.
        </p>
      </div>

      <div style={{ padding: "24px 40px", maxWidth: 1400, margin: "0 auto" }}>
        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <div
            style={{
              background: "#3D1F1F",
              border: "1px solid #EF4444",
              borderRadius: 12,
              padding: "16px 20px",
              marginBottom: 20,
            }}
          >
            {validationErrors.map((error, i) => (
              <div
                key={i}
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 13,
                  color: "#FCA5A5",
                  marginBottom: i < validationErrors.length - 1 ? 8 : 0,
                }}
              >
                ⚠️ {error}
              </div>
            ))}
          </div>
        )}

        {/* Input Section */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
            gap: 20,
            marginBottom: 28,
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <label
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 11,
                  color: "#888",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                📄 Your Resume
              </label>
              <label
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 11,
                  color: "#E8A838",
                  cursor: "pointer",
                }}
              >
                Upload .txt
                <input
                  type="file"
                  accept=".txt,.md"
                  onChange={handleFileUpload(setResume)}
                  style={{ display: "none" }}
                  aria-label="Upload resume file"
                />
              </label>
            </div>
            <textarea
              value={resume}
              onChange={(e) => setResume(e.target.value)}
              placeholder="Paste your resume here or upload a .txt file..."
              rows={12}
              aria-label="Resume text input"
            />
            <div style={{ marginTop: 6, fontSize: 11, color: "#555" }}>
              {resume.trim().length} characters (min {MIN_RESUME_LENGTH})
            </div>
          </div>
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <label
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 11,
                  color: "#888",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                🔍 Job Description
              </label>
              <label
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 11,
                  color: "#E8A838",
                  cursor: "pointer",
                }}
              >
                Upload .txt
                <input
                  type="file"
                  accept=".txt,.md"
                  onChange={handleFileUpload(setJobDescription)}
                  style={{ display: "none" }}
                  aria-label="Upload job description file"
                />
              </label>
            </div>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here or upload a .txt file..."
              rows={12}
              aria-label="Job description text input"
            />
            <div style={{ marginTop: 6, fontSize: 11, color: "#555" }}>
              {jobDescription.trim().length} characters (min {MIN_JD_LENGTH})
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div
          style={{
            display: "flex",
            gap: 12,
            marginBottom: 28,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={runAllAgents}
            disabled={!inputReady || anyRunning}
            style={{
              background: inputReady && !anyRunning
                ? "linear-gradient(135deg, #E8A838, #D4942E)"
                : "#1A1A1A",
              color: inputReady && !anyRunning ? "#000" : "#555",
              border: "none",
              borderRadius: 10,
              padding: "12px 28px",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 14,
              fontWeight: 600,
              cursor: inputReady && !anyRunning ? "pointer" : "default",
              transition: "all 0.2s",
            }}
            aria-label={anyRunning ? "Analysis in progress" : "Run full analysis"}
          >
            {anyRunning ? "⏳ Agents Working..." : "▶ Run Full Analysis"}
          </button>

          {hasResults && (
            <button
              onClick={exportResults}
              style={{
                background: "#1A1A1A",
                color: "#E8A838",
                border: "1px solid #333",
                borderRadius: 10,
                padding: "12px 24px",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              aria-label="Copy all results to clipboard"
            >
              📋 Copy All Results
            </button>
          )}

          {currentPhase && <PhaseIndicator currentPhase={currentPhase} />}

          {fitScore && (
            <div style={{ marginLeft: "auto" }}>
              <FitScoreBadge score={fitScore} />
            </div>
          )}
        </div>

        {/* Agent Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 12,
            marginBottom: 28,
          }}
        >
          {Object.values(AGENTS).map((agent) => (
            <AgentCard
              key={agent.id}
              agent={agent}
              status={agentStatuses[agent.id]}
              isActive={activeAgent === agent.id}
              isDisabled={!inputReady || anyRunning}
              onClick={() => {
                if (agentStatuses[agent.id] === "complete") {
                  setActiveAgent(agent.id);
                } else if (agentStatuses[agent.id] === "idle") {
                  const needsContext = ["agent4", "agent5", "agent6"].includes(agent.id);
                  callAgent(agent.id, needsContext ? agentOutputs.agent3 || "" : "");
                }
              }}
            />
          ))}
        </div>

        {/* Results Panel */}
        <div ref={resultsRef}>
          {Object.entries(agentOutputs).map(([agentId, output]) => {
            const agent = AGENTS[agentId];
            if (!agent) return null;
            const isVisible = activeAgent === agentId || !activeAgent;

            return (
              <div
                key={agentId}
                style={{
                  display: isVisible ? "block" : "none",
                  background: "#0A0A0A",
                  border: `1px solid ${agent.color}25`,
                  borderRadius: 16,
                  padding: 24,
                  marginBottom: 16,
                  animation: "fadeIn 0.3s ease",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 16,
                    paddingBottom: 12,
                    borderBottom: `1px solid ${agent.color}15`,
                    flexWrap: "wrap",
                  }}
                >
                  <span style={{ fontSize: 20 }} aria-hidden="true">{agent.icon}</span>
                  <h3
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 16,
                      fontWeight: 700,
                      color: agent.color,
                      margin: 0,
                    }}
                  >
                    {agent.name}
                  </h3>
                  {agentStatuses[agentId] === "complete" && (
                    <span
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 10,
                        color: "#22C55E",
                        background: "#22C55E15",
                        padding: "2px 8px",
                        borderRadius: 6,
                      }}
                    >
                      COMPLETE
                    </span>
                  )}
                  <button
                    onClick={() => copyToClipboard(output)}
                    style={{
                      marginLeft: "auto",
                      background: "transparent",
                      color: "#888",
                      border: "1px solid #333",
                      borderRadius: 6,
                      padding: "4px 12px",
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 11,
                      cursor: "pointer",
                    }}
                    aria-label={`Copy ${agent.name} output`}
                  >
                    📋 Copy
                  </button>
                </div>
                <MarkdownRenderer text={output} />
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {!hasResults && !anyRunning && (
          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
              color: "#333",
            }}
          >
            <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.5 }} aria-hidden="true">⚖️</div>
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 14,
                color: "#444",
                maxWidth: 400,
                margin: "0 auto",
                lineHeight: 1.6,
              }}
            >
              Paste your resume and a job description, then hit{" "}
              <strong style={{ color: "#E8A838" }}>Run Full Analysis</strong> to
              activate all six agents.
            </p>
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 12,
                color: "#333",
                marginTop: 8,
              }}
            >
              Or click individual agent cards to run them one at a time.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
