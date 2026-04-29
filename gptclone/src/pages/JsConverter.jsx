import { useState } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";
import { tools } from "../data/tools";
import { addHistoryEntry } from "../utils/history";
import { apiUrl } from "../utils/api";

const JsConverter = () => {
  const [idea, setIdea] = useState("Create a helper for transforming raw user notes into a cleaner object");
  const [style, setStyle] = useState("utility");
  const [name, setName] = useState("transformNotes");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async (event) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    const requestText = `Template type: ${style}\nFunction or component name: ${name}\nTask: ${idea}`;

    try {
      const { data } = await axios.post(apiUrl("/api/v1/openai/jsconverter"), {
        text: requestText,
      });

      const nextResult = data.code || data.result || data.message || "";
      setResult(nextResult);

      addHistoryEntry({
        tool: "JS Converter",
        title: name || "Generated snippet",
        preview: nextResult.slice(0, 120) || idea.slice(0, 120),
      });
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to generate code right now.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="tool-page">
      <div className="tool-header">
        <span className="status-pill">Code helper</span>
        <h1>Turn product ideas into JavaScript starters.</h1>
        <p className="muted-copy">
          This page now calls your backend controller instead of generating local placeholder code.
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
        </aside>

        <div className="panel-stack">
          <section className="tool-panel">
            <form className="input-grid" onSubmit={handleGenerate}>
              <label className="input-group">
                <span className="field-label">What should the code do?</span>
                <textarea
                  className="text-area"
                  onChange={(event) => setIdea(event.target.value)}
                  value={idea}
                />
              </label>

              <div className="split-grid">
                <label className="input-group">
                  <span className="field-label">Template type</span>
                  <select
                    className="select-input"
                    onChange={(event) => setStyle(event.target.value)}
                    value={style}
                  >
                    <option value="utility">Utility function</option>
                    <option value="async">Async API helper</option>
                    <option value="component">React component</option>
                  </select>
                </label>

                <label className="input-group">
                  <span className="field-label">Function or component name</span>
                  <input
                    className="text-input"
                    onChange={(event) => setName(event.target.value)}
                    value={name}
                  />
                </label>
              </div>

              <div className="panel-actions">
                <button className="btn btn-primary" disabled={isLoading} type="submit">
                  {isLoading ? "Generating..." : "Generate code"}
                </button>
              </div>
            </form>
          </section>

          <section className="tool-output">
            <span className="section-heading">Output</span>
            <h2 className="panel-title">Starter snippet</h2>

            {error ? <div className="error-banner">{error}</div> : null}

            {result ? (
              <pre className="code-block">{result}</pre>
            ) : (
              <div className="empty-state">
                <div>
                  <strong style={{ display: "block", marginBottom: "8px" }}>No code yet</strong>
                  <span className="small-note">Describe the logic and generate a starter snippet.</span>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </section>
  );
};

export default JsConverter;
