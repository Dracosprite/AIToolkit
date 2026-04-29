import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { tools } from "../data/tools";
import { readHistory } from "../utils/history";

const formatRelativeTime = (value) => {
  const minutes = Math.max(1, Math.round((Date.now() - new Date(value).getTime()) / 60000));

  if (minutes < 60) {
    return `${minutes} min ago`;
  }

  const hours = Math.round(minutes / 60);

  if (hours < 24) {
    return `${hours} hr ago`;
  }

  const days = Math.round(hours / 24);
  return `${days} day ago`;
};

const Homepage = () => {
  const isLoggedIn = Boolean(localStorage.getItem("token"));
  const [recentHistory, setRecentHistory] = useState([]);

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }

    setRecentHistory(readHistory());
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return (
      <div className="page">
        <section className="hero-grid">
          <div className="hero-copy">
            <span className="hero-badge">AI Tools Suite</span>
            <h1 className="page-title">Your personal AI workspace.</h1>
            <p className="page-subtitle">
              Write better, create faster, and get more done with our collection of free AI tools. 
              Sign in to access chat, summaries, content generation, and more.
            </p>

            <div className="cta-row">
              <Link className="btn btn-primary" to="/register">
                Create account
              </Link>
              <Link className="ghost-btn" to="/login">
                Sign in
              </Link>
            </div>
          </div>

          <aside className="feature-panel">
            <div>
              <span className="feature-eyebrow">What you can do</span>
              <h2>Powered by Groq, Hugging Face & Google</h2>
              <p>
                Fast, free AI tools to help with your work. No credit card required.
              </p>
            </div>

            <div className="feature-card-grid">
              <div className="feature-card">
                <strong>💬 Chat</strong>
                <span>Talk to an AI assistant for ideas and answers.</span>
              </div>
              <div className="feature-card">
                <strong>📝 Summarize</strong>
                <span>Quickly summarize any text in seconds.</span>
              </div>
              <div className="feature-card">
                <strong>✍️ Write</strong>
                <span>Generate paragraphs and content from prompts.</span>
              </div>
              <div className="feature-card">
                <strong>💻 Code</strong>
                <span>Convert ideas into JavaScript code instantly.</span>
              </div>
            </div>
          </aside>
        </section>
      </div>
    );
  }

  return (
    <div className="page">
      <section className="dashboard-grid">
        <div className="dashboard-main">
          <div className="panel-stack">
            <div className="tool-header">
              <span className="status-pill">Your workspace</span>
              <h1>Welcome back! Pick a tool to get started.</h1>
              <p className="muted-copy">
                Choose any tool below to access chat, write content, summarize text, generate code, or create images.
              </p>
            </div>

            <div className="stat-grid">
              <div className="stat-card">
                <strong>{tools.length}</strong>
                <span>Tools available</span>
              </div>
              <div className="stat-card">
                <strong>{recentHistory.length}</strong>
                <span>Recent items</span>
              </div>
              <div className="stat-card">
                <strong>Free</strong>
                <span>Always free to use</span>
              </div>
            </div>

            <div>
              <div className="toolbar-row" style={{ justifyContent: "space-between", marginBottom: "16px" }}>
                <div>
                  <span className="section-heading">Tools</span>
                  <h2 className="panel-title" style={{ marginTop: "8px" }}>
                    Pick a tool
                  </h2>
                </div>
              </div>

              <div className="tool-card-grid">
                {tools.map((tool) => (
                  <article className="tool-card" key={tool.path}>
                    <div className="tool-card-top">
                      <div className="tool-icon">{tool.icon}</div>
                      <span className="tool-tag">{tool.badge}</span>
                    </div>
                    <strong>{tool.name}</strong>
                    <span>{tool.description}</span>
                    <Link className="tool-link" to={tool.path}>
                      Open →
                    </Link>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>

        <aside className="dashboard-side">
          <div>
            <span className="section-heading">Recent activity</span>
            <h2 className="panel-title" style={{ marginTop: "8px" }}>
              Session history
            </h2>
          </div>

          <div className="history-grid">
            {recentHistory.length === 0 ? (
              <div className="empty-state">
                <div>
                  <strong style={{ display: "block", marginBottom: "8px" }}>Nothing saved yet</strong>
                  <span className="small-note">Run any tool once and it will appear here.</span>
                </div>
              </div>
            ) : (
              recentHistory.map((entry) => (
                <article className="history-card" key={entry.id}>
                  <strong>{entry.title}</strong>
                  <span>{entry.preview}</span>
                  <div className="history-meta" style={{ marginTop: "10px" }}>
                    {entry.tool} • {formatRelativeTime(entry.createdAt)}
                  </div>
                </article>
              ))
            )}
          </div>
        </aside>
      </section>
    </div>
  );
};

export default Homepage;
