import { useState } from "react";
import axios from "axios";
import { apiUrl } from "../utils/api";

const InterviewPrep = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [questions, setQuestions] = useState([]);
  const [fileName, setFileName] = useState("");

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
      setError("");
      setQuestions([]);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      setError("Please select a file first");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    setError("");

    try {
      const { data } = await axios.post(
        apiUrl("/api/v1/interview/upload"),
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data.success) {
        const questionsText = data.code;
        const questionsList = questionsText
          .split("\n")
          .filter((q) => q.trim() && !q.match(/^\d+\.\s*$/))
          .map((q) => q.trim());
        setQuestions(questionsList);
      } else {
        setError(data.message || "Failed to generate questions");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error uploading resume");
      console.error("Upload error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="workspace">
      <div className="empty-state">
        <div className="empty-state-content">
          <h1>Interview Preparation</h1>
          <p>Upload your resume to generate interview questions</p>

          <form onSubmit={handleSubmit} className="interview-form">
            <div className="file-input-wrapper">
              <input
                type="file"
                id="resume-file"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.txt"
                disabled={loading}
                className="file-input"
              />
              <label htmlFor="resume-file" className="file-label">
                {fileName || "Choose Resume (PDF, DOC, DOCX, TXT)"}
              </label>
            </div>

            {error && <div className="error-message">{error}</div>}

            <button
              type="submit"
              disabled={!file || loading}
              className="primary-btn"
            >
              {loading ? "Generating Questions..." : "Generate Questions"}
            </button>
          </form>

          {questions.length > 0 && (
            <div className="questions-container">
              <h2>Interview Questions</h2>
              <div className="questions-list">
                {questions.map((question, index) => (
                  <div key={index} className="question-item">
                    <span className="question-number">{index + 1}.</span>
                    <p className="question-text">{question}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .interview-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          max-width: 600px;
          margin: 2rem auto;
        }

        .file-input-wrapper {
          position: relative;
        }

        .file-input {
          display: none;
        }

        .file-label {
          display: block;
          padding: 1rem;
          border: 2px dashed #ccc;
          border-radius: 8px;
          text-align: center;
          cursor: pointer;
          background: #f9f9f9;
          transition: all 0.3s ease;
          font-weight: 500;
        }

        .file-label:hover {
          border-color: #007bff;
          background: #f0f7ff;
        }

        .file-input:disabled + .file-label {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .error-message {
          color: #d32f2f;
          padding: 0.75rem 1rem;
          background: #ffebee;
          border-radius: 6px;
          font-size: 0.95rem;
        }

        .questions-container {
          margin-top: 2rem;
          max-width: 700px;
          margin-left: auto;
          margin-right: auto;
        }

        .questions-container h2 {
          margin-bottom: 1.5rem;
          color: #333;
        }

        .questions-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .question-item {
          display: flex;
          gap: 1rem;
          padding: 1rem;
          background: #f5f5f5;
          border-left: 4px solid #007bff;
          border-radius: 4px;
          animation: slideIn 0.3s ease;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .question-number {
          font-weight: 600;
          color: #007bff;
          min-width: 30px;
        }

        .question-text {
          margin: 0;
          color: #333;
          line-height: 1.5;
        }
      `}</style>
    </div>
  );
};

export default InterviewPrep;
