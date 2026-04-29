import "./App.css";
import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

const Homepage = lazy(() => import("./pages/Homepage"));
const Login = lazy(() => import("./pages/login"));
const Register = lazy(() => import("./pages/register.jsx"));
const Summary = lazy(() => import("./pages/Summary"));
const ChatBot = lazy(() => import("./pages/ChatBot"));
const ParagraphGenrater = lazy(() => import("./pages/ParagraphGenrater"));
const JsConverter = lazy(() => import("./pages/JsConverter"));
const ScifiImages = lazy(() => import("./pages/ScifiImages"));
const InterviewPrep = lazy(() => import("./pages/InterviewPrep"));

function App() {
  return (
    <div className="app-shell">
      <div className="app-content">
        <Navbar />
        <Suspense fallback={<div className="empty-state">Loading workspace...</div>}>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/summary" element={<Summary />} />
              <Route path="/chatbot" element={<ChatBot />} />
              <Route path="/paragraph-generator" element={<ParagraphGenrater />} />
              <Route path="/js-converter" element={<JsConverter />} />
              <Route path="/scifi-images" element={<ScifiImages />} />
              <Route path="/interview-prep" element={<InterviewPrep />} />
            </Route>

            <Route path="*" element={<Navigate replace to="/" />} />
          </Routes>
        </Suspense>
      </div>
    </div>
  );
}

export default App;
