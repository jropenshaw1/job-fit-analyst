import { useState, useRef, useCallback } from "react";

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
  agent6: {
    id: "agent6",
    name: "Interview Prep",
    icon: "🎯",
    color: "#F97316",
    description: "Builds interview question guide with STAR responses",
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

**Agent 1: Role Analyst**
Quick Read (2-3 sentences): What is this role asking for? Key reqs, seniority, core work. Confirm understanding — don't analyze fit yet.`,
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
Professional letter. Use ONLY what's in resume — reframe ok, invent NOT. Address gaps via positive frame. Confident not arrogant. 3-4 paragraphs. Skip generic filler.

Format: Date, greeting, body, closing.`,
    user: `Resume:\n${resume}\n\nJob:\n${jd}${context ? `\n\nFit context:\n${context}` : ""}`,
  }),

  agent5: (resume, jd, context) => ({
    system: `${SYSTEM_PROMPT_BASE}

**Agent 5: Resume Optimizer**
Tailor for THIS role. ONLY use existing info — reword/reorder ok, add NOTHING. Prioritize relevance. Match JD keywords where genuine. ATS-friendly format.

Sections: Contact | Summary (tailored) | Experience (prioritized) | Skills (reordered) | Education`,
    user: `Current resume:\n${resume}\n\nTarget job:\n${jd}${context ? `\n\nAlignment notes:\n${context}` : ""}`,
  }),

  agent6: (resume, jd, context) => ({
    system: `${SYSTEM_PROMPT_BASE}

**Agent 6: Interview Prep**

## 🎯 Strategy (2-3 lines)
Core narrative. What to lead with.

## 💬 Likely Questions & How to Answer
Top 5-7 questions this role will ask. For each: the question, honest response strategy (don't BS, but reframe positively), what NOT to say.

## 🏢 Company/Culture Questions
3-4 intelligent questions informed by the Culture Scout findings that show the candidate has done their homework.

## 🎭 Role-Play Scenarios
2-3 situational/behavioral questions specific to this role type. Provide the question and suggested approach.

## ⚠️ Landmines to Avoid
2-3 specific things this candidate should NOT say or do in the interview based on their background and the Auditor's concerns.

## 🚀 Closing Strong
Suggested talking points for "Why this company?" and "Why this role?" that connect authentically to the candidate's actual background.

Be SPECIFIC. Use actual details from the resume. Don't give generic interview advice.`,
    user: `Here is my resume:\n\n${resume}\n\nHere is the job description:\n\n${jd}\n\n${context ? `Context from fit analysis:\n${context}\n\n` : ""}Please create my interview preparation guide.`,
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
            width: "100%",
          }}
        />
      )}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
        <span style={{ fontSize: 22 }}>{agent.icon}</span>
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 14, color: "#F0F0F0" }}>
          {agent.name}
        </span>
      </div>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#888", margin: 0, lineHeight: 1.4 }}>
        {agent.description}
      </p>
      <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 6 }}>
        <div
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: statusColors[status],
            boxShadow: status === "running" ? `0 0 8px ${agent.color}` : "none",
          }}
        />
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: statusColors[status] }}>
          {statusLabels[status]}
        </span>
      </div>
    </div>
  );
}

function FitScoreBadge({ score }) {
  const num = parseFloat(score);
  const color = num >= 0.7 ? "#22C55E" : num >= 0.4 ? "#E8A838" : "#EF4444";
  const label = num >= 0.7 ? "Strong Fit" : num >= 0.4 ? "Partial Fit" : "Long Shot";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#0D0D0D", border: `1.5px solid ${color}40`, borderRadius: 12, padding: "8px 16px" }}>
      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 24, fontWeight: 800, color }}>{score}</span>
      <div>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#888" }}>Fit Score</div>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, color }}>{label}</div>
      </div>
    </div>
  );
}

function MarkdownRenderer({ text }) {
  if (!text) return null;

  const renderLine = (line, i) => {
    if (line.startsWith("## ")) {
      return (
        <h2 key={i} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 700, color: "#E8A838", margin: "20px 0 8px", borderBottom: "1px solid #1E1E1E", paddingBottom: 6 }}>
          {line.slice(3)}
        </h2>
      );
    }
    if (line.startsWith("### ")) {
      return (
        <h3 key={i} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, color: "#A0A0A0", margin: "14px 0 6px" }}>
          {line.slice(4)}
        </h3>
      );
    }
    if (line.startsWith("- ") || line.startsWith("* ")) {
      return (
        <div key={i} style={{ display: "flex", gap: 8, marginBottom: 4 }}>
          <span style={{ color: "#E8A838", flexShrink: 0 }}>•</span>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#C0C0C0", lineHeight: 1.6 }}>
            {renderInline(line.slice(2))}
          </span>
        </div>
      );
    }
    if (line.trim() === "") return <div key={i} style={{ height: 8 }} />;
    return (
      <p key={i} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#C0C0C0", lineHeight: 1.7, margin: "4px 0" }}>
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
        parts.push(<strong key={key++} style={{ color: "#F0F0F0", fontWeight: 600 }}>{boldMatch[1]}</strong>);
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
    agent1: "idle", agent2: "idle", agent3: "idle",
    agent4: "idle", agent5: "idle", agent6: "idle",
  });
  const [agentOutputs, setAgentOutputs] = useState({});
  const [activeAgent, setActiveAgent] = useState(null);
  const [fitScore, setFitScore] = useState(null);
  const [isRunningAll, setIsRunningAll] = useState(false);
  const [quickTake, setQuickTake] = useState(false);
  const resultsRef = useRef(null);

  const inputReady = resume.trim().length > 0 && jobDescription.trim().length > 0;
  const anyRunning = Object.values(agentStatuses).some((s) => s === "running");

  // ─── FIX 1: Guard on resolved user string ────────────────────────────────
  // Prevents empty content from reaching the API regardless of how the agent
  // was triggered. Agent 2's user message is built solely from ${jd}, making
  // it the only agent that resolves to near-empty content when jd is blank.
  const callAgent = useCallback(
    async (agentId, extraContext = "") => {
      // Hard stop: both inputs must be non-empty
      if (!resume.trim() || !jobDescription.trim()) return;

      setAgentStatuses((prev) => ({ ...prev, [agentId]: "running" }));
      setActiveAgent(agentId);

      try {
        const promptFn = AGENT_PROMPTS[agentId];
        const { system, user } = promptFn(resume, jobDescription, extraContext);

        // ── FIX 1: Catch empty resolved user content before API call ──────
        if (!user || !user.trim()) {
          throw new Error(
            "Prompt resolved to empty content. Ensure both resume and job description are filled in before running."
          );
        }
        // ──────────────────────────────────────────────────────────────────

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

        if (data.error) {
          throw new Error(data.error.message || "API returned an error");
        }

        const text = data.content
          ?.map((item) => (item.type === "text" ? item.text : ""))
          .filter(Boolean)
          .join("\n");

        if (!text || !text.trim()) {
          throw new Error("No response text received from API");
        }

        setAgentOutputs((prev) => ({ ...prev, [agentId]: text }));
        setAgentStatuses((prev) => ({ ...prev, [agentId]: "complete" }));

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
        console.error(`Agent ${agentId} error:`, err);
        setAgentStatuses((prev) => ({ ...prev, [agentId]: "error" }));
        setAgentOutputs((prev) => ({
          ...prev,
          [agentId]: `❌ **Error**: ${err.message}\n\nPlease check your inputs and try again.`,
        }));
      }
    },
    [resume, jobDescription]
  );

  const runFullAnalysis = async () => {
    if (!inputReady || anyRunning) return;

    setIsRunningAll(true);
    setAgentOutputs({});
    setFitScore(null);
    setActiveAgent(null);
    setAgentStatuses({
      agent1: "idle", agent2: "idle", agent3: "idle",
      agent4: "idle", agent5: "idle", agent6: "idle",
    });

    try {
      if (quickTake) {
        await callAgent("agent3");
      } else {
        // Phase 1: parallel
        const [, , fitContext] = await Promise.all([
          callAgent("agent1"),
          callAgent("agent2"),
          callAgent("agent3"),
        ]);
        // Phase 2: sequential, using fit context
        await callAgent("agent4", fitContext || "");
        await callAgent("agent5", fitContext || "");
        await callAgent("agent6", fitContext || "");
      }
    } finally {
      setIsRunningAll(false);
    }
  };

  // ─── FIX 2: Card-level click guard ───────────────────────────────────────
  // isDisabled already controls opacity/cursor, but onClick={undefined} on the
  // div does not fully prevent synthetic events in all React versions. This
  // handler adds an explicit early return so no card can fire callAgent when
  // inputs are not ready.
  const handleCardClick = (agentId) => {
    if (!inputReady || anyRunning) return; // ← FIX 2: hard stop at handler level

    if (agentStatuses[agentId] === "complete") {
      setActiveAgent(agentId);
    } else if (agentStatuses[agentId] === "idle" || agentStatuses[agentId] === "error") {
      const extraContext =
        agentId === "agent4" || agentId === "agent5" || agentId === "agent6"
          ? agentOutputs.agent3 || ""
          : "";
      callAgent(agentId, extraContext);
    }
  };
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div style={{ background: "#080808", minHeight: "100vh", padding: "32px 24px", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        textarea:focus { outline: none; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #111; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }
      `}</style>

      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: 32, textAlign: "center" }}>
          <h1 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 28, fontWeight: 800, color: "#F0F0F0", margin: 0, letterSpacing: "-0.02em" }}>
            Job Fit Analyst
          </h1>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#555", marginTop: 6 }}>
            Advocate 💚 · Auditor 🔴 · No inflation · No fabrication
          </p>
        </div>

        {/* Input Area */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
          {[
            { label: "Your Resume", key: "resume", value: resume, setter: setResume, placeholder: "Paste your resume here..." },
            { label: "Job Description", key: "jd", value: jobDescription, setter: setJobDescription, placeholder: "Paste the job description here..." },
          ].map(({ label, key, value, setter, placeholder }) => (
            <div key={key}>
              <label style={{ display: "block", fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, color: "#888", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {label}
              </label>
              <textarea
                value={value}
                onChange={(e) => setter(e.target.value)}
                placeholder={placeholder}
                style={{
                  width: "100%", height: 200, background: "#0D0D0D",
                  border: `1.5px solid ${value.trim() ? "#22C55E40" : "#1E1E1E"}`,
                  borderRadius: 12, padding: "14px 16px",
                  fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#C0C0C0",
                  resize: "vertical", transition: "border-color 0.2s",
                }}
              />
            </div>
          ))}
        </div>

        {/* Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
          <button
            onClick={runFullAnalysis}
            disabled={!inputReady || anyRunning}
            style={{
              background: inputReady && !anyRunning
                ? "linear-gradient(135deg, #E8A838, #D4942E)"
                : "#1A1A1A",
              color: inputReady && !anyRunning ? "#000" : "#555",
              border: "none", borderRadius: 10, padding: "12px 28px",
              fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600,
              cursor: inputReady && !anyRunning ? "pointer" : "default",
              transition: "all 0.2s",
            }}
          >
            {anyRunning ? "⏳ Agents Working..." : "▶ Run Full Analysis"}
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input
              type="checkbox"
              id="quickTake"
              checked={quickTake}
              onChange={(e) => setQuickTake(e.target.checked)}
              style={{ accentColor: "#E8A838" }}
            />
            <label htmlFor="quickTake" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#888", cursor: "pointer" }}>
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
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 10, marginBottom: 28 }}>
          {Object.values(AGENTS).map((agent) => (
            <AgentCard
              key={agent.id}
              agent={agent}
              status={agentStatuses[agent.id]}
              isActive={activeAgent === agent.id}
              isDisabled={!inputReady || anyRunning}
              onClick={() => handleCardClick(agent.id)}
            />
          ))}
        </div>

        {/* Input not ready hint */}
        {!inputReady && (
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#444", textAlign: "center", marginBottom: 20 }}>
            Fill in both resume and job description to enable agents.
          </p>
        )}

        {/* Results */}
        <div ref={resultsRef}>
          {Object.entries(agentOutputs).map(([agentId, output]) => {
            const agent = AGENTS[agentId];
            if (!agent) return null;
            const isVisible = !activeAgent || activeAgent === agentId;

            return (
              <div
                key={agentId}
                style={{
                  display: isVisible ? "block" : "none",
                  background: "#0D0D0D",
                  border: "1.5px solid #1E1E1E",
                  borderRadius: 14,
                  padding: "24px 28px",
                  marginBottom: 16,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                  <span style={{ fontSize: 20 }}>{agent.icon}</span>
                  <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 700, color: agent.color, margin: 0 }}>
                    {agent.name}
                  </h2>
                </div>
                <MarkdownRenderer text={output} />
              </div>
            );
          })}

          {Object.keys(agentOutputs).length === 0 && !anyRunning && (
            <div style={{ textAlign: "center", padding: "60px 0", color: "#333" }}>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14 }}>
                Fill in both fields and click <strong style={{ color: "#E8A838" }}>Run Full Analysis</strong>, or click individual agent cards.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
