import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth, googleProvider } from "../component/firebase";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [resetSent, setResetSent] = useState(false);

  // ── Email / Password Login ──────────────────────────────────────────────
  async function handleLogin() {
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err) {
      setError(friendlyError(err.code));
    } finally {
      setLoading(false);
    }
  }

  // ── Google Login ────────────────────────────────────────────────────────
  async function handleGoogle() {
    setLoading(true);
    setError("");
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/");
    } catch (err) {
      setError(friendlyError(err.code));
    } finally {
      setLoading(false);
    }
  }

  // ── Forgot Password ─────────────────────────────────────────────────────
  async function handleForgot() {
    if (!email) {
      setError("Enter your email first, then click Forgot Password.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email, {
        url: `${window.location.origin}/change-password`,
        handleCodeInApp: true,
      });
      setResetSent(true);
      setError("");
    } catch (err) {
      setError(friendlyError(err.code));
    }
  }

  // ── Enter key support ───────────────────────────────────────────────────
  function handleKey(e) {
    if (e.key === "Enter") handleLogin();
  }

  return (
    <div className="min-h-screen  flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md px-10 py-10 relative">

        {/* Close button — goes back home */}
        <Link
          to="/"
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </Link>

        {/* Person Icon */}
        <div className="flex justify-center mb-4">
          <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="4"/>
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
          </svg>
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-1">Welcome Back</h1>
        <p className="text-gray-500 text-sm text-center mb-7">Please login to your account</p>

        {/* Error / Success messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-2.5 mb-5">
            {error}
          </div>
        )}
        {resetSent && (
          <div className="bg-green-50 border border-green-200 text-green-600 text-sm rounded-lg px-4 py-2.5 mb-5">
            Password reset email sent! Check your inbox and open the link to set a new password.
          </div>
        )}

        {/* Email */}
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={handleKey}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-5"
        />

        {/* Password */}
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKey}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-6"
        />

        {/* Login Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 rounded-lg transition-colors text-sm"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-gray-200"/>
          <span className="text-gray-400 text-xs">or</span>
          <div className="flex-1 h-px bg-gray-200"/>
        </div>

        {/* Google Button */}
        <button
          onClick={handleGoogle}
          disabled={loading}
          className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 rounded-lg transition-colors text-sm flex items-center justify-center gap-3"
        >
          {/* Google SVG */}
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#4285F4" d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 5.1 29.6 3 24 3 12.9 3 4 11.9 4 23s8.9 20 20 20c11 0 19.7-7.7 19.7-20 0-1.3-.1-2.7-.2-4z"/>
            <path fill="#34A853" d="M6.3 14.7l7 5.1C15.1 16.1 19.2 13 24 13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 5.1 29.6 3 24 3c-7.6 0-14.1 4.5-17.7 11.7z"/>
            <path fill="#FBBC05" d="M24 43c5.8 0 10.9-1.9 14.9-5.2l-6.9-5.7C29.9 33.8 27.1 35 24 35c-6 0-11.1-4-12.9-9.5l-7 5.4C7.9 38.6 15.3 43 24 43z"/>
            <path fill="#EA4335" d="M44.5 20H24v8.5h11.8c-.8 2.6-2.5 4.8-4.7 6.3l6.9 5.7C42.2 36.8 45 30.3 45 23c0-1.3-.1-2.7-.5-3z"/>
          </svg>
          Continue with Google
        </button>

        {/* Forgot password */}
        <div className="text-center mt-5">
          <button
            onClick={handleForgot}
            className="text-sm text-gray-500 border border-gray-300 rounded px-3 py-1 hover:bg-gray-50 transition-colors"
          >
            Forgot password?
          </button>
        </div>

        {/* Sign up link */}
        <p className="text-center text-sm text-gray-500 mt-4">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-600 hover:underline font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

// ── Map Firebase error codes to readable messages ──────────────────────────
function friendlyError(code) {
  switch (code) {
    case "auth/user-not-found":       return "No account found with this email.";
    case "auth/wrong-password":       return "Incorrect password. Try again.";
    case "auth/invalid-email":        return "Please enter a valid email address.";
    case "auth/too-many-requests":    return "Too many attempts. Please try again later.";
    case "auth/invalid-credential":   return "Invalid email or password.";
    case "auth/popup-closed-by-user": return "Google sign-in was cancelled.";
    default:                          return "Something went wrong. Please try again.";
  }
}
