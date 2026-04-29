import { useState } from "react";
import axiosInstance from "../utils/axiosConfig";
import { NavLink } from "react-router-dom";
import { tools } from "../data/tools";
import { addHistoryEntry } from "../utils/history";

const ScifiImages = () => {
  const [subject, setSubject] = useState("an explorer in a glass observatory suit");
  const [setting, setSetting] = useState("a floating city above a storm planet");
  const [palette, setPalette] = useState("teal, ember orange, silver");
  const [mood, setMood] = useState("mysterious but hopeful");
  const [imageSrc, setImageSrc] = useState("");
  const [promptText, setPromptText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async (event) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    const requestText = `Subject: ${subject}. Setting: ${setting}. Palette: ${palette}. Mood: ${mood}.`;
    setPromptText(requestText);

    try {
      const { data } = await axiosInstance.post("/api/v1/openai/scifiimage", {
        text: requestText,
      });

      const rawImage = data.image || data.result || "";
      const nextImage = rawImage
        ? rawImage.startsWith("data:image")
          ? rawImage
          : `data:image/png;base64,${rawImage}`
        : "";

      setImageSrc(nextImage);

      addHistoryEntry({
        tool: "Sci-fi Images",
        title: subject,
        preview: requestText.slice(0, 120),
      });
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to generate a sci-fi image right now.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="tool-page">
      <div className="tool-header">
        <span className="status-pill">Prompt design tool</span>
        <h1>Build better sci-fi images from one request.</h1>
        <p className="muted-copy">
          This page now sends your sci-fi concept to the backend image controller instead of only
          building local prompt variants.
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
                <span className="field-label">Subject</span>
                <input
                  className="text-input"
                  onChange={(event) => setSubject(event.target.value)}
                  value={subject}
                />
              </label>

              <label className="input-group">
                <span className="field-label">Setting</span>
                <input
                  className="text-input"
                  onChange={(event) => setSetting(event.target.value)}
                  value={setting}
                />
              </label>

              <div className="split-grid">
                <label className="input-group">
                  <span className="field-label">Palette</span>
                  <input
                    className="text-input"
                    onChange={(event) => setPalette(event.target.value)}
                    value={palette}
                  />
                </label>

                <label className="input-group">
                  <span className="field-label">Mood</span>
                  <input
                    className="text-input"
                    onChange={(event) => setMood(event.target.value)}
                    value={mood}
                  />
                </label>
              </div>

              <div className="panel-actions">
                <button className="btn btn-primary" disabled={isLoading} type="submit">
                  {isLoading ? "Generating..." : "Generate image"}
                </button>
              </div>
            </form>
          </section>

          <section className="tool-output">
            <span className="section-heading">Output</span>
            <h2 className="panel-title">Generated sci-fi image</h2>

            {error ? <div className="error-banner">{error}</div> : null}

            {imageSrc ? (
              <div className="panel-stack">
                <img
                  alt="Generated sci-fi concept"
                  src={imageSrc}
                  style={{ width: "100%", borderRadius: "22px", border: "1px solid rgba(148, 163, 184, 0.16)" }}
                />
                <div className="output-shell">{promptText}</div>
              </div>
            ) : (
              <div className="empty-state">
                <div>
                  <strong style={{ display: "block", marginBottom: "8px" }}>
                    No image generated yet
                  </strong>
                  <span className="small-note">Fill out the concept fields and generate one image.</span>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </section>
  );
};

export default ScifiImages;
