import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  confirmPasswordReset,
  verifyPasswordResetCode,
} from "firebase/auth";
import { auth } from "../component/firebase";

export default function ChangePassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [accountEmail, setAccountEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [checkingCode, setCheckingCode] = useState(true);
  const [isCodeValid, setIsCodeValid] = useState(false);
  const [loading, setLoading] = useState(false);

  const resetCode = searchParams.get("oobCode");

  useEffect(() => {
    async function validateResetCode() {
      if (!resetCode) {
        setError("This password reset link is invalid or incomplete.");
        setCheckingCode(false);
        return;
      }

      try {
        const email = await verifyPasswordResetCode(auth, resetCode);
        setAccountEmail(email);
        setError("");
        setIsCodeValid(true);
      } catch (err) {
        setError(friendlyError(err.code));
        setIsCodeValid(false);
      } finally {
        setCheckingCode(false);
      }
    }

    validateResetCode();
  }, [resetCode]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      setError("Please fill in both password fields.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!resetCode) {
      setError("This password reset link is invalid.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await confirmPasswordReset(auth, resetCode, newPassword);
      setSuccess("Password changed successfully. Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(friendlyError(err.code));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-10">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md px-10 py-10 relative">
        <Link
          to="/login"
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </Link>

        <div className="flex justify-center mb-4">
          <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="5" y="11" width="14" height="10" rx="2" />
            <path d="M8 11V8a4 4 0 1 1 8 0v3" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 text-center mb-1">Change Password</h1>
        <p className="text-gray-500 text-sm text-center mb-7">
          {accountEmail ? `Set a new password for ${accountEmail}` : "Use the reset link from your email to continue"}
        </p>

        {checkingCode ? (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 text-sm rounded-lg px-4 py-3">
            Verifying reset link...
          </div>
        ) : (
          <>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-2.5 mb-5">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-600 text-sm rounded-lg px-4 py-2.5 mb-5">
                {success}
              </div>
            )}

            {!success && isCodeValid && (
              <form onSubmit={handleSubmit}>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
                <input
                  type="password"
                  placeholder="At least 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-5"
                />

                <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
                <input
                  type="password"
                  placeholder="Repeat your new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-6"
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 rounded-lg transition-colors text-sm"
                >
                  {loading ? "Saving..." : "Change Password"}
                </button>
              </form>
            )}

            <p className="text-center text-sm text-gray-500 mt-5">
              Back to{" "}
              <Link to="/login" className="text-blue-600 hover:underline font-medium">
                Login
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

function friendlyError(code) {
  switch (code) {
    case "auth/expired-action-code":
      return "This password reset link has expired. Please request a new one.";
    case "auth/invalid-action-code":
      return "This password reset link is invalid. Please request a new one.";
    case "auth/user-disabled":
      return "This account has been disabled.";
    case "auth/weak-password":
      return "Password must be at least 6 characters.";
    default:
      return "Something went wrong. Please try again.";
  }
}
