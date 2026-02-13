import { useState, useRef, useCallback, useEffect } from "react";

const AGENTS = {
  agent1: {
    id: "agent1",
    name: "Role Analyst",
    icon: "🔍",
    color: "#E8A838",
    description: "Reads & summarizes the job description",
  },
  agent2: {
    id: "agent2",
    name: "Culture Scout",
    icon: "🏢",
    color: "#4ECDC4",
    description: "Researches company culture from review sites",
  },
  agent3: {
    id: "agent3",
    name: "Fit Evaluator",
    icon: "⚖️",
    color: "#FF6B6B",
    description: "Maps alignment, gaps, advocate/auditor analysis & fit score",
  },
  agent4: {
    id: "agent4",
    name: "Cover Letter Writer",
    icon: "✉️",
    color: "#A78BFA",
    description: "Generates a tailored cover letter (.docx)",
  },
  agent5: {
    id: "agent5",
    name: "Resume Optimizer",
    icon: "📄",
    color: "#34D399",
    description: "Creates an optimized resume for the role (.docx)",
  },
};

const SYSTEM_PROMPT_BASE = `You are a career fit analyst operating with two voices:
- **Advocate**: Finds the best honest case for the candidacy — highlights transferable skills, reframes experience positively, identifies angles the candidate might miss.
- **Auditor**: Tells the hard truth — where they're underqualified, where the gap is real, where they'd be stretching credibility to apply.

Honesty rules:
- If they're not a fit, say so directly. Don't soften "this is a reach" into "you could potentially..."
- If uncertain about something, say "I'm uncertain" rather than guessing confidently.
- Never inflate scores or assessments to be encouraging.
- Don't fabricate company or experience details.
- Don't assume the resume covers everything — note if something seems missing.

Fit Score Scale:
- 0.0–0.3: Significant gaps. Applying is a long shot.
- 0.4–0.6: Partial fit. Gaps exist but may be addressable.
- 0.7–0.8: Strong fit. Minor gaps or growth areas.
- 0.9–1.0: Near-perfect alignment. (Be suspicious if you score this — recheck.)`;

const AGENT_PROMPTS = {
  agent1: (resume, jd) => ({
    system: `${SYSTEM_PROMPT_BASE}

You are Agent 1: Role Analyst. Your ONLY job is to provide a Quick Read summary of the job description in 2-3 sentences so the candidate can confirm you understood the role correctly. Be concise and accurate. Identify the key requirements, seniority level, and core responsibilities. Do NOT analyze fit yet — just summarize what the role is asking for.`,
    user: `Here is the job description:\n\n${jd}\n\nPlease provide your Quick Read summary of this role.`,
  }),

  agent2: (resume, jd, companyName) => ({
    system: `${SYSTEM_PROMPT_BASE}

You are Agent 2: Culture Scout. Your job is to create a summary of the corporate culture for the company mentioned in the job description. Use your knowledge to discuss what employees commonly report about the company culture, work-life balance, management style, and overall employee sentiment. If you don't have reliable information, say so directly. Structure your response as:

1. **Company Overview**: Brief company description
2. **Culture Highlights**: What employees tend to praise
3. **Culture Concerns**: Common criticisms or complaints
4. **Work-Life Balance**: General sentiment
5. **Management & Growth**: Leadership style and career development
6. **Uncertainty Note**: Anything you're uncertain about — suggest the candidate verify on Glassdoor, Indeed, Blind, etc.`,
    user: `Based on the job description below, research and summarize the corporate culture.\n\nJob Description:\n${jd}\n\nPlease provide your culture analysis.`,
  }),

  agent3: (resume, jd) => ({
    system: `${SYSTEM_PROMPT_BASE}

You are Agent 3: Fit Evaluator. This is the core analysis. You must provide ALL of the following sections with clear labels. When the Advocate and Auditor disagree, show BOTH perspectives clearly labeled.

Structure your response EXACTLY as follows:

## 📊 Alignment Map
Where the candidate's experience maps directly to JD requirements. Be specific — cite actual experience from the resume matching actual requirements from the JD.

## 🔴 Gap Map
Where the candidate is short. Be specific about what's missing and how wide the gap is. Rate each gap as: Minor (learnable in weeks), Moderate (months of ramp-up), or Significant (major skill/experience deficit).

## 💚 Advocate's Case
The best HONEST argument for why they should apply anyway. Highlight transferable skills, reframe experience positively, identify angles they might miss. This is NOT about sugarcoating — it's about finding genuine strengths.

## 🔴 Auditor's Check
The honest risks or concerns if they do apply. What could go wrong in an interview? Where would a hiring manager push back? What's the weakest part of the candidacy?

## 🎯 Fit Score: [X.X]
A single number from 0.0 to 1.0 with a one-sentence justification. Remember: never inflate to be encouraging.

## 📋 Next Steps
What they'd need to do to strengthen their candidacy (if worth pursuing). Be actionable and specific.`,
    user: `Here is my resume:\n\n${resume}\n\nHere is the job description:\n\n${jd}\n\nPlease provide your complete fit evaluation with all sections.`,
  }),

  agent4: (resume, jd, extraContext) => ({
    system: `${SYSTEM_PROMPT_BASE}

You are Agent 4: Cover Letter Writer. Write a professional, compelling cover letter based on the candidate's actual resume and the job description. 

Rules:
- Only reference skills and experiences that appear in the resume. Reframing is fine. Inventing is NOT.
- The tone should be confident but not arrogant.
- Highlight the strongest alignment points between resume and JD.
- Address potential gaps honestly through positive framing (not by hiding them).
- Keep it to roughly one page (3-4 paragraphs).
- Use a professional but personable tone.
- Do NOT use generic filler phrases like "I am excited to apply for..." — be specific and genuine.

Return the cover letter text ONLY — no meta-commentary. Format it as a professional letter with:
- Date
- Greeting (use "Dear Hiring Manager" if no name is known)
- Body paragraphs
- Professional closing`,
    user: `Here is my resume:\n\n${resume}\n\nHere is the job description:\n\n${jd}\n\n${extraContext ? `Additional context from fit analysis:\n${extraContext}\n\n` : ""}Please write my cover letter.`,
  }),

  agent5: (resume, jd, extraContext) => ({
    system: `${SYSTEM_PROMPT_BASE}

You are Agent 5: Resume Optimizer. Create an optimized version of the candidate's resume tailored for this specific job description.

Rules:
- ONLY use information that exists in the original resume. You may reword, reorder, and emphasize differently, but NEVER add experience, skills, or accomplishments that aren't in the original.
- Prioritize and reorder bullet points to highlight the most relevant experience for THIS role.
- Use keywords from the job description where they genuinely apply to existing experience.
- Adjust the professional summary/objective to target this specific role.
- If the resume has skills sections, reorder to put the most relevant skills first.
- Keep formatting clean and ATS-friendly.

Return the complete optimized resume content in a structured format with clear sections:
- Contact Info (use original)
- Professional Summary (tailored)
- Experience (reordered/reworded for relevance)
- Skills (prioritized for this role)
- Education
- Any other sections from the original

IMPORTANT: Return ONLY the resume content, no meta-commentary about what you changed.`,
    user: `Here is my current resume:\n\n${resume}\n\nHere is the job description I'm targeting:\n\n${jd}\n\n${extraContext ? `Key alignment points from fit analysis:\n${extraContext}\n\n` : ""}Please create my optimized resume.`,
  }),
};

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
        <span style={{ fontSize: 22 }}>{agent.icon}</span>
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
            boxShadow:
              status === "running" ? `0 0 8px ${agent.color}` : "none",
            animation: status === "running" ? "pulse 1.2s infinite" : "none",
          }}
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
  let color, label;
  if (s <= 0.3) { color = "#EF4444"; label = "Long Shot"; }
  else if (s <= 0.6) { color = "#F59E0B"; label = "Partial Fit"; }
  else if (s <= 0.8) { color = "#22C55E"; label = "Strong Fit"; }
  else { color = "#06B6D4"; label = "Near-Perfect"; }

  return (
    <div
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
    // Headers
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
    // Bullet points
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
    // Numbered lists
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
    // Empty lines
    if (line.trim() === "") return <div key={i} style={{ height: 8 }} />;
    // Regular text
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

export default function JobFitAnalyst() {
  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [agentStatuses, setAgentStatuses] = useState({
    agent1: "idle",
    agent2: "idle",
    agent3: "idle",
    agent4: "idle",
    agent5: "idle",
  });
  const [agentOutputs, setAgentOutputs] = useState({});
  const [activeAgent, setActiveAgent] = useState(null);
  const [fitScore, setFitScore] = useState(null);
  const [isRunningAll, setIsRunningAll] = useState(false);
  const [quickTake, setQuickTake] = useState(false);
  const resultsRef = useRef(null);

  const callAgent = useCallback(
    async (agentId, extraContext = "") => {
      if (!resume.trim() || !jobDescription.trim()) return;

      setAgentStatuses((prev) => ({ ...prev, [agentId]: "running" }));
      setActiveAgent(agentId);

      try {
        const promptFn = AGENT_PROMPTS[agentId];
        const { system, user } = promptFn(resume, jobDescription, extraContext);

        const response = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 4000,
            system,
            messages: [{ role: "user", content: user }],
          }),
        });

        const data = await response.json();
        const text = data.content
          ?.map((item) => (item.type === "text" ? item.text : ""))
          .filter(Boolean)
          .join("\n");

        if (text) {
          setAgentOutputs((prev) => ({ ...prev, [agentId]: text }));
          setAgentStatuses((prev) => ({ ...prev, [agentId]: "complete" }));

          // Extract fit score from Agent 3
          if (agentId === "agent3") {
            const scoreMatch = text.match(/Fit Score:\s*\[?([\d.]+)\]?/i);
            if (scoreMatch) setFitScore(scoreMatch[1]);
          }
          return text;
        } else {
          throw new Error("No response text");
        }
      } catch (err) {
        console.error(`Agent ${agentId} error:`, err);
        setAgentStatuses((prev) => ({ ...prev, [agentId]: "error" }));
        setAgentOutputs((prev) => ({
          ...prev,
          [agentId]: `Error: ${err.message}. Please try again.`,
        }));
        return null;
      }
    },
    [resume, jobDescription]
  );

  const runAllAgents = useCallback(async () => {
    if (!resume.trim() || !jobDescription.trim()) return;
    setIsRunningAll(true);
    setFitScore(null);
    setAgentOutputs({});
    setAgentStatuses({
      agent1: "idle",
      agent2: "idle",
      agent3: "idle",
      agent4: "idle",
      agent5: "idle",
    });

    // Phase 1: Run agents 1, 2, 3 in parallel
    const [a1Result, a2Result, a3Result] = await Promise.all([
      callAgent("agent1"),
      callAgent("agent2"),
      callAgent("agent3"),
    ]);

    // Phase 2: Run agents 4, 5 with context from agent 3
    const context = a3Result || "";
    await Promise.all([callAgent("agent4", context), callAgent("agent5", context)]);

    setIsRunningAll(false);
    setActiveAgent(null);
  }, [callAgent, resume, jobDescription]);

  const handleFileUpload = (setter) => (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setter(ev.target.result);
    reader.readAsText(file);
  };

  const inputReady = resume.trim() && jobDescription.trim();
  const anyRunning = Object.values(agentStatuses).some((s) => s === "running");

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
            background: "linear-gradient(90deg, #E8A838, #FF6B6B, #A78BFA, #4ECDC4, #34D399)",
            backgroundSize: "200% auto",
            animation: "gradientShift 6s ease infinite",
          }}
        />
        <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
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
            Multi-Agent Workflow
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
          Two voices — Advocate & Auditor — giving you the honest truth about your candidacy.
        </p>
      </div>

      <div style={{ padding: "24px 40px", maxWidth: 1200, margin: "0 auto" }}>
        {/* Input Section */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
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
                />
              </label>
            </div>
            <textarea
              value={resume}
              onChange={(e) => setResume(e.target.value)}
              placeholder="Paste your resume here or upload a .txt file..."
              rows={10}
            />
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
                />
              </label>
            </div>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here or upload a .txt file..."
              rows={10}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div
          style={{
            display: "flex",
            gap: 12,
            marginBottom: 28,
            alignItems: "center",
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
          >
            {anyRunning ? "⏳ Agents Working..." : "▶ Run Full Analysis"}
          </button>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginLeft: 8,
            }}
          >
            <input
              type="checkbox"
              id="quickTake"
              checked={quickTake}
              onChange={(e) => setQuickTake(e.target.checked)}
              style={{ accentColor: "#E8A838" }}
            />
            <label
              htmlFor="quickTake"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 12,
                color: "#888",
                cursor: "pointer",
              }}
            >
              Quick Take (Fit Score + Summary only)
            </label>
          </div>

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
            gridTemplateColumns: "repeat(5, 1fr)",
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
                  callAgent(
                    agent.id,
                    agent.id === "agent4" || agent.id === "agent5"
                      ? agentOutputs.agent3 || ""
                      : ""
                  );
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
                  }}
                >
                  <span style={{ fontSize: 20 }}>{agent.icon}</span>
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
                </div>
                <MarkdownRenderer text={output} />
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {Object.keys(agentOutputs).length === 0 && !anyRunning && (
          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
              color: "#333",
            }}
          >
            <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.5 }}>⚖️</div>
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
              activate all five agents.
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
