import { useState } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";
import { tools } from "../data/tools";
import { apiUrl } from "../utils/api";
import { addHistoryEntry } from "../utils/history";

const defaultText = `The engineering team shipped the new onboarding flow this week. Activation improved, but support tickets rose because password reset messaging was unclear. Next sprint we want to refine the error copy, cut extra form fields, and add an admin analytics view.`;

const Summary = () => {
  const [text, setText] = useState(defaultText);
  const [summary, setSummary] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setCopied(false);
    setIsLoading(true);

    try {
      const response = await axios.post(apiUrl("/api/v1/openai/summary"), { text });
      const nextSummary =
        typeof response.data === "string" ? response.data.trim() : JSON.stringify(response.data);

      setSummary(nextSummary);
      addHistoryEntry({
        tool: "Summary",
        title: "Generated summary",
        preview: nextSummary.slice(0, 120),
      });
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to generate a summary.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!summary) {
      return;
    }

    await navigator.clipboard.writeText(summary);
    setCopied(true);
  };

  return (
    <section className="tool-page">
      <div className="tool-header">
        <span className="status-pill">Backend-connected tool</span>
        <h1>Summarize long text in one clean screen.</h1>
        <p className="muted-copy">
          This page uses your live Express route at <code>/api/v1/openai/summary</code>, so it is
          not just mock UI.
        </p>
      </div>

      <div className="tool-layout">
        <aside className="chat-sidebar">
          <div>
            <span className="section-heading">Tool switcher</span>
            <h2 className="panel-title" style={{ marginTop: "8px" }}>
              More workspaces
            </h2>
          </div>

          <div className="tool-list">
            {tools.map((tool) => (
              <NavLink
                key={tool.path}
                className={({ isActive }) =>
                  isActive ? "tool-list-link active" : "tool-list-link"
                }
                to={tool.path}
              >
                {tool.name}
              </NavLink>
            ))}
          </div>

          <div className="output-shell">
            <strong>Best for</strong>
            <span>
              Meeting recaps, article compression, product notes, or turning rough input into
              something fast to scan.
            </span>
          </div>
        </aside>

        <div className="panel-stack">
          <section className="tool-panel">
            <form className="input-grid" onSubmit={handleSubmit}>
              <label className="input-group">
                <span className="field-label">Source text</span>
                <textarea
                  className="text-area"
                  onChange={(event) => setText(event.target.value)}
                  value={text}
                />
              </label>

              <div className="panel-actions">
                <button className="btn btn-primary" disabled={isLoading} type="submit">
                  {isLoading ? "Summarizing..." : "Generate summary"}
                </button>
                <button
                  className="secondary-btn"
                  onClick={() => {
                    setText(defaultText);
                    setSummary("");
                    setError("");
                    setCopied(false);
                  }}
                  type="button"
                >
                  Reset
                </button>
              </div>
            </form>
          </section>

          <section className="tool-output">
            <div className="toolbar-row" style={{ justifyContent: "space-between" }}>
              <div>
                <span className="section-heading">Output</span>
                <h2 className="panel-title" style={{ marginTop: "8px" }}>
                  Summary result
                </h2>
              </div>

              <button className="secondary-btn" onClick={handleCopy} type="button">
                Copy
              </button>
            </div>

            {error ? <div className="error-banner">{error}</div> : null}
            {copied ? <div className="success-banner">Summary copied to clipboard.</div> : null}

            {summary ? (
              <div className="output-shell">{summary}</div>
            ) : (
              <div className="empty-state">
                <div>
                  <strong style={{ display: "block", marginBottom: "8px" }}>No summary yet</strong>
                  <span className="small-note">Paste text on the left and generate one.</span>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </section>
  );
};

export default Summary;
