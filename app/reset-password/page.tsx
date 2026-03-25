"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Star, Eye, EyeOff, Loader2, CheckCircle, XCircle } from "lucide-react";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!token) {
      setError("Invalid reset link. Please request a new one.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong");
        return;
      }

      setSuccess(true);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSubmit();
  };

  if (!token) {
    return (
      <div className="flex flex-col items-center text-center">
        <XCircle size={40} style={{ color: "var(--brand-primary)" }} />
        <h2 className="text-xl font-bold mt-4" style={{ color: "var(--text-primary)" }}>
          Invalid Reset Link
        </h2>
        <p className="text-sm mt-2" style={{ color: "var(--text-muted)" }}>
          This link is invalid or has expired.
        </p>
        <a
          href="/"
          className="mt-6 px-5 py-2.5 rounded-xl text-sm font-semibold text-white inline-block"
          style={{ background: "var(--brand-primary)" }}
        >
          Back to Home
        </a>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex flex-col items-center text-center">
        <CheckCircle size={40} style={{ color: "var(--success, #22c55e)" }} />
        <h2 className="text-xl font-bold mt-4" style={{ color: "var(--text-primary)" }}>
          Password Reset!
        </h2>
        <p className="text-sm mt-2" style={{ color: "var(--text-muted)" }}>
          Your password has been updated. You can now log in with your new password.
        </p>
        <a
          href="/"
          className="mt-6 px-5 py-2.5 rounded-xl text-sm font-semibold text-white inline-block"
          style={{ background: "var(--brand-primary)" }}
        >
          Go to Log In
        </a>
      </div>
    );
  }

  return (
    <>
      <h2 className="text-xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>
        Set new password
      </h2>
      <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
        Enter your new password below.
      </p>

      <div className="space-y-3">
        <div>
          <label className="text-xs font-medium block mb-1.5" style={{ color: "var(--text-muted)" }}>
            New Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Min. 8 characters"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              onKeyDown={handleKeyDown}
              className="w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all pr-10"
              style={{
                background: "var(--card-bg)",
                border: "1px solid var(--card-border)",
                color: "var(--text-primary)",
              }}
              onFocus={(e) => (e.target.style.borderColor = "var(--brand-primary)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--card-border)")}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
              style={{ color: "var(--text-muted)" }}
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        <div>
          <label className="text-xs font-medium block mb-1.5" style={{ color: "var(--text-muted)" }}>
            Confirm Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Re-enter password"
            value={confirmPassword}
            onChange={(e) => { setConfirmPassword(e.target.value); setError(""); }}
            onKeyDown={handleKeyDown}
            className="w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all"
            style={{
              background: "var(--card-bg)",
              border: "1px solid var(--card-border)",
              color: "var(--text-primary)",
            }}
            onFocus={(e) => (e.target.style.borderColor = "var(--brand-primary)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--card-border)")}
          />
        </div>
      </div>

      {error && (
        <div
          className="mt-4 px-3 py-2.5 rounded-xl text-sm"
          style={{
            background: "rgba(243,18,60,0.08)",
            border: "1px solid rgba(243,18,60,0.2)",
            color: "var(--brand-primary)",
          }}
        >
          {error}
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full mt-5 py-3 rounded-xl text-sm font-semibold transition-opacity flex items-center justify-center gap-2"
        style={{
          background: "var(--brand-primary)",
          color: "#ffffff",
          opacity: loading ? 0.7 : 1,
        }}
      >
        {loading && <Loader2 size={15} className="animate-spin" />}
        {loading ? "Resetting..." : "Reset Password"}
      </button>
    </>
  );
}

export default function ResetPasswordPage() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") setIsDark(true);
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
  }, [isDark]);

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "var(--page-bg)" }}
    >
      <div
        className="w-full max-w-md rounded-2xl p-5 sm:p-8"
        style={{
          background: "var(--page-bg)",
          border: "1px solid var(--card-border)",
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-8">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "var(--brand-primary)" }}
          >
            <Star size={16} className="text-white fill-white" />
          </div>
          <div className="flex items-baseline gap-0.5">
            <span className="font-bold text-lg tracking-tight" style={{ color: "var(--text-primary)" }}>
              North
            </span>
            <span className="font-bold text-lg tracking-tight" style={{ color: "var(--brand-primary)" }}>
              Star
            </span>
          </div>
        </div>

        <Suspense fallback={<div className="text-sm" style={{ color: "var(--text-muted)" }}>Loading...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
