import { useState } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";
import { tools } from "../data/tools";
import { addHistoryEntry } from "../utils/history";
import { apiUrl } from "../utils/api";

const ParagraphGenrater = () => {
  const [topic, setTopic] = useState("AI note-taking for students");
  const [tone, setTone] = useState("professional");
  const [goal, setGoal] = useState("marketing");
  const [length, setLength] = useState("medium");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async (event) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    const requestText = `Topic: ${topic}\nTone: ${tone}\nGoal: ${goal}\nLength: ${length}`;

    try {
      const { data } = await axios.post(apiUrl("/api/v1/openai/paragraphgenrater"), {
        text: requestText,
      });

      const nextResult = data.paragraph || data.result || data.message || "";
      setResult(nextResult);

      addHistoryEntry({
        tool: "Paragraph Generator",
        title: topic,
        preview: nextResult.slice(0, 120) || topic.slice(0, 120),
      });
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to generate a paragraph right now.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="tool-page">
      <div className="tool-header">
        <span className="status-pill">Writing tool</span>
        <h1>Generate better paragraphs from simple inputs.</h1>
        <p className="muted-copy">
          This page now uses your backend paragraph controller instead of frontend-only generation.
        </p>
      </div>

      <div className="tool-layout">
        <aside className="chat-sidebar">
          <div>
            <span className="section-heading">Tool switcher</span>
            <h2 className="panel-title" style={{ marginTop: "8px" }}>
              Explore more
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
                <span className="field-label">Topic</span>
                <input
                  className="text-input"
                  onChange={(event) => setTopic(event.target.value)}
                  value={topic}
                />
              </label>

              <div className="split-grid">
                <label className="input-group">
                  <span className="field-label">Tone</span>
                  <select
                    className="select-input"
                    onChange={(event) => setTone(event.target.value)}
                    value={tone}
                  >
                    <option value="professional">Professional</option>
                    <option value="persuasive">Persuasive</option>
                    <option value="friendly">Friendly</option>
                  </select>
                </label>

                <label className="input-group">
                  <span className="field-label">Goal</span>
                  <select
                    className="select-input"
                    onChange={(event) => setGoal(event.target.value)}
                    value={goal}
                  >
                    <option value="marketing">Marketing</option>
                    <option value="education">Education</option>
                    <option value="product">Product update</option>
                  </select>
                </label>
              </div>

              <label className="input-group">
                <span className="field-label">Length</span>
                <select
                  className="select-input"
                  onChange={(event) => setLength(event.target.value)}
                  value={length}
                >
                  <option value="short">Short</option>
                  <option value="medium">Medium</option>
                  <option value="long">Long</option>
                </select>
              </label>

              <div className="panel-actions">
                <button className="btn btn-primary" disabled={isLoading} type="submit">
                  {isLoading ? "Generating..." : "Generate paragraph"}
                </button>
              </div>
            </form>
          </section>

          <section className="tool-output">
            <span className="section-heading">Output</span>
            <h2 className="panel-title">Generated paragraph</h2>

            {error ? <div className="error-banner">{error}</div> : null}

            {result ? (
              <div className="output-shell">{result}</div>
            ) : (
              <div className="empty-state">
                <div>
                  <strong style={{ display: "block", marginBottom: "8px" }}>Nothing generated yet</strong>
                  <span className="small-note">Choose a topic and generate a paragraph.</span>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </section>
  );
};

export default ParagraphGenrater;
