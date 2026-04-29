import { useState } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { apiUrl } from "../utils/api";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
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
      const response = await axios.post(apiUrl("/api/v1/auth/login"), formData);

      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        navigate(location.state?.from || "/");
      }
    } catch (submissionError) {
      setError(submissionError.response?.data?.message || "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-card">
        <div className="auth-copy">
          <span className="status-pill">Welcome back</span>
          <h1 style={{ marginTop: "16px" }}>Log in to your workspace.</h1>
          <p style={{ marginTop: "12px" }}>
            Pick up where you left off and head straight into the redesigned chat interface.
          </p>
        </div>

        {error ? <div className="error-banner">{error}</div> : null}

        <form onSubmit={handleSubmit}>
          <div className="input-grid">
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
              {isSubmitting ? "Signing in..." : "Login"}
            </button>
            <Link className="ghost-btn" to="/register">
              Create account
            </Link>
          </div>
        </form>

        <p className="auth-footer">
          New here?{" "}
          <Link className="text-link" to="/register">
            Register instead
          </Link>
          .
        </p>
      </div>
    </section>
  );
};

export default Login;
