import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import { apiUrl } from "../utils/api";

const primaryLinks = [
  { to: "/", label: "Home" },
  { to: "/chatbot", label: "Chat" },
  { to: "/summary", label: "Summary" },
  { to: "/paragraph-generator", label: "Paragraphs" },
  { to: "/js-converter", label: "JS Lab" },
  { to: "/scifi-images", label: "Sci-fi" },
  { to: "/interview-prep", label: "Interview" },
];

const navClassName = ({ isActive }) =>
  isActive ? "nav-link active" : "nav-link";

const Navbar = () => {
  const navigate = useNavigate();
  const isLoggedIn = Boolean(localStorage.getItem("token"));

  const handleLogout = async () => {
    try {
      await axios.post(apiUrl("/api/v1/auth/logout"));
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  return (
    <nav className="topbar">
      <NavLink className="brand" to="/">
        <span className="brand-mark">AI</span>
        <span className="brand-copy">
          <span className="brand-title">AI Tools</span>
          <span className="brand-subtitle">Free workspace</span>
        </span>
      </NavLink>

      <div className="nav-links">
        {(isLoggedIn ? primaryLinks : primaryLinks.slice(0, 1)).map((link) => (
          <NavLink key={link.to} className={navClassName} to={link.to}>
            {link.label}
          </NavLink>
        ))}
        {!isLoggedIn ? (
          <>
            <NavLink className={navClassName} to="/login">
              Login
            </NavLink>
            <NavLink className={navClassName} to="/register">
              Register
            </NavLink>
          </>
        ) : null}
      </div>

      <div className="nav-actions">
        <div className="topbar-status">
          <span className={`status-dot ${isLoggedIn ? "" : "guest"}`}></span>
          <span>{isLoggedIn ? "Signed in" : "Guest mode"}</span>
        </div>

        {isLoggedIn ? (
          <button className="secondary-btn" onClick={handleLogout} type="button">
            Logout
          </button>
        ) : null}
      </div>
    </nav>
  );
};

export default Navbar;
