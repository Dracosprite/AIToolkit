import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { apiUrl } from "../utils/api";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    setFormData((previousData) => ({
      ...previousData,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await axios.post(apiUrl("/api/v1/auth/register"), formData);

      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        navigate("/");
      }
    } catch (submissionError) {
      setError(submissionError.response?.data?.message || "Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-card">
        <div className="auth-copy">
          <span className="status-pill">Create your account</span>
          <h1 style={{ marginTop: "16px" }}>Launch your AI workspace in minutes.</h1>
          <p style={{ marginTop: "12px" }}>
            Register once and you will land straight inside the upgraded chat interface.
          </p>
        </div>

        {error ? <div className="error-banner">{error}</div> : null}

        <form onSubmit={handleSubmit}>
          <div className="input-grid">
            <label className="input-group">
              <span className="field-label">Username</span>
              <input
                className="text-input"
                name="username"
                onChange={handleChange}
                required
                type="text"
                value={formData.username}
              />
            </label>

            <label className="input-group">
              <span className="field-label">Email</span>
              <input
                className="text-input"
                name="email"
                onChange={handleChange}
                required
                type="email"
                value={formData.email}
              />
            </label>

            <label className="input-group">
              <span className="field-label">Password</span>
              <input
                className="text-input"
                name="password"
                onChange={handleChange}
                required
                type="password"
                value={formData.password}
              />
            </label>
          </div>

          <div className="auth-actions">
            <button className="btn btn-primary" disabled={isSubmitting} type="submit">
              {isSubmitting ? "Creating..." : "Register"}
            </button>
            <Link className="ghost-btn" to="/login">
              Login instead
            </Link>
          </div>
        </form>

        <p className="auth-footer">
          Already have an account?{" "}
          <Link className="text-link" to="/login">
            Go to login
          </Link>
          .
        </p>
      </div>
    </section>
  );
};

export default Register;
