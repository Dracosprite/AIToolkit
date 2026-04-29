import { useState } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";
import { tools } from "../data/tools";
import { addHistoryEntry } from "../utils/history";
import { apiUrl } from "../utils/api";

const starterPrompts = [
  "Draft a launch message for our new app update.",
  "Help me turn rough notes into a project status update.",
  "Suggest three positioning angles for an AI study tool.",
];

const introMessage = () => ({
  id: "intro",
  role: "assistant",
  text: "Ask for ideas, copy help, or structure. This screen is set up like a real assistant workspace now.",
  time: new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  }),
});

const timeLabel = () =>
  new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

const ChatBot = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([introMessage()]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmed = input.trim();

    if (!trimmed || loading) {
      return;
    }

    const userMessage = {
      id: `${Date.now()}-user`,
      role: "user",
      text: trimmed,
      time: timeLabel(),
    };

    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");
    setError("");
    setLoading(true);

    try {
      const { data } = await axios.post(apiUrl("/api/v1/openai/chatbot"), {
        messages: updatedMessages.map((message) => ({
          role: message.role,
          content: message.text,
        })),
      });

      const assistantText =
        data.reply || data.result || data.message || "No response received from assistant.";

      setMessages([
        ...updatedMessages,
        {
          id: `${Date.now()}-assistant`,
          role: "assistant",
          text: assistantText,
          time: timeLabel(),
        },
      ]);

      addHistoryEntry({
        tool: "Chatbot",
        title: "Chat exchange",
        preview: trimmed.slice(0, 120),
      });
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to send message right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="chat-page">
      <div className="tool-header">
        <span className="status-pill">Conversation workspace</span>
        <h1>Chat in a proper assistant UI.</h1>
        <p className="muted-copy">
          This page is now wired for a real backend assistant endpoint instead of local placeholder
          replies.
        </p>
      </div>

      <div className="chat-layout">
        <aside className="chat-sidebar">
          <div>
            <span className="section-heading">Starter prompts</span>
            <h2 className="panel-title" style={{ marginTop: "8px" }}>
              Jump in faster
            </h2>
          </div>

          <div className="tool-list">
            {starterPrompts.map((prompt) => (
              <button
                key={prompt}
                className="tool-list-link"
                onClick={() => setInput(prompt)}
                type="button"
              >
                {prompt}
              </button>
            ))}
          </div>

          <div>
            <span className="section-heading">Other tools</span>
            <div className="tool-list" style={{ marginTop: "12px" }}>
              {tools
                .filter((tool) => tool.path !== "/chatbot")
                .map((tool) => (
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
          </div>
        </aside>

        <section className="chat-panel">
          <div className="toolbar-row" style={{ justifyContent: "space-between" }}>
            <div>
              <span className="section-heading">Thread</span>
              <h2 className="panel-title" style={{ marginTop: "8px" }}>
                Assistant conversation
              </h2>
            </div>
            <button
              className="secondary-btn"
              onClick={() => {
                setMessages([introMessage()]);
                setError("");
              }}
              type="button"
            >
              New chat
            </button>
          </div>

          {error ? <div className="error-banner">{error}</div> : null}

          <div className="chat-thread">
            {messages.map((message) => (
              <article
                key={message.id}
                className={`chat-message ${message.role === "user" ? "user" : "assistant"}`}
              >
                <div className="message-meta">
                  <strong>{message.role === "user" ? "You" : "Assistant"}</strong>
                  <span>{message.time}</span>
                </div>
                <div>{message.text}</div>
              </article>
            ))}

            {loading ? (
              <article className="chat-message assistant">
                <div className="message-meta">
                  <strong>Assistant</strong>
                  <span>{timeLabel()}</span>
                </div>
                <div>Thinking...</div>
              </article>
            ) : null}
          </div>

          <form className="input-grid" onSubmit={handleSubmit}>
            <label className="input-group">
              <span className="field-label">Message</span>
              <textarea
                className="text-area"
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask for a rewrite, idea list, positioning options, or a short draft."
                value={input}
              />
            </label>

            <div className="panel-actions">
              <button className="btn btn-primary" disabled={loading} type="submit">
                {loading ? "Sending..." : "Send"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </section>
  );
};

export default ChatBot;
