"use client";

import { useState } from "react";
import { X, Eye, EyeOff, Star, Loader2 } from "lucide-react";

interface AuthModalProps {
  onClose: () => void;
  onSuccess: (user: { id: string; name: string; email: string }) => void;
}

export function AuthModal({ onClose, onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "signup" | "forgot">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [forgotSent, setForgotSent] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      if (mode === "forgot") {
        const res = await fetch("/api/auth/forgot-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: form.email }),
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error ?? "Something went wrong");
          return;
        }

        setForgotSent(true);
        return;
      }

      const endpoint =
        mode === "login"
          ? "/api/auth/login"
          : "/api/auth/signup";

      const body =
        mode === "login"
          ? { email: form.email, password: form.password }
          : { name: form.name, email: form.email, password: form.password };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong");
        return;
      }

      onSuccess(data.user);
      onClose();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[300] flex items-center justify-center p-4"
        style={{ background: "rgba(0,0,0,0.7)" }}
        onClick={onClose}
      >
        {/* Modal */}
        <div
          className="relative w-full max-w-md rounded-2xl p-5 sm:p-8"
          style={{
            background: "var(--page-bg)",
            border: "1px solid var(--card-border)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg transition-colors"
            style={{ color: "var(--text-muted)" }}
          >
            <X size={18} />
          </button>

          {/* Logo */}
          <div className="flex items-center gap-2.5 mb-8">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "var(--brand-primary)" }}
            >
              <Star size={16} className="text-white fill-white" />
            </div>
            <div className="flex items-baseline gap-0.5">
              <span
                className="font-bold text-lg tracking-tight"
                style={{ color: "var(--text-primary)" }}
              >
                North
              </span>
              <span
                className="font-bold text-lg tracking-tight"
                style={{ color: "var(--brand-primary)" }}
              >
                Star
              </span>
            </div>
          </div>

          {/* Title */}
          <h2
            className="text-xl font-bold mb-1"
            style={{ color: "var(--text-primary)" }}
          >
            {mode === "forgot"
              ? "Reset your password"
              : mode === "login"
              ? "Welcome back"
              : "Create your account"}
          </h2>
          <p
            className="text-sm mb-6"
            style={{ color: "var(--text-muted)" }}
          >
            {mode === "forgot"
              ? "Enter your email and we'll send you a reset link"
              : mode === "login"
              ? "Sign in to access your saved resources"
              : "Start saving and liking resources"}
          </p>

          {/* Mode Toggle */}
          {mode !== "forgot" && (
            <div
              className="flex rounded-xl p-1 mb-6"
              style={{
                background: "var(--card-bg)",
                border: "1px solid var(--card-border)",
              }}
            >
              {(["login", "signup"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => {
                    setMode(m);
                    setError("");
                  }}
                  className="flex-1 py-2 rounded-lg text-sm font-medium transition-all"
                  style={{
                    background:
                      mode === m ? "var(--brand-primary)" : "transparent",
                    color: mode === m ? "#ffffff" : "var(--text-muted)",
                  }}
                >
                  {m === "login" ? "Log In" : "Sign Up"}
                </button>
              ))}
            </div>
          )}

          {/* Forgot — success state */}
          {mode === "forgot" && forgotSent ? (
            <div className="text-center py-4">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: "var(--brand-soft)" }}
              >
                <Star size={20} style={{ color: "var(--brand-primary)" }} />
              </div>
              <p className="text-sm font-medium mb-1" style={{ color: "var(--text-primary)" }}>
                Check your email
              </p>
              <p className="text-xs mb-5" style={{ color: "var(--text-muted)" }}>
                If an account exists for {form.email}, you'll receive a password reset link shortly.
              </p>
              <button
                onClick={() => {
                  setMode("login");
                  setForgotSent(false);
                  setError("");
                }}
                className="text-xs font-semibold"
                style={{ color: "var(--brand-primary)" }}
              >
                Back to Log In
              </button>
            </div>
          ) : (
            <>
              {/* Fields */}
              <div className="space-y-3">
                {/* Name — signup only */}
                {mode === "signup" && (
                  <div>
                    <label
                      className="text-xs font-medium block mb-1.5"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Your name"
                      value={form.name}
                      onChange={handleChange}
                      onKeyDown={handleKeyDown}
                      className="w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all"
                      style={{
                        background: "var(--card-bg)",
                        border: "1px solid var(--card-border)",
                        color: "var(--text-primary)",
                      }}
                      onFocus={(e) =>
                        (e.target.style.borderColor = "var(--brand-primary)")
                      }
                      onBlur={(e) =>
                        (e.target.style.borderColor = "var(--card-border)")
                      }
                    />
                  </div>
                )}

                {/* Email */}
                <div>
                  <label
                    className="text-xs font-medium block mb-1.5"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    className="w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all"
                    style={{
                      background: "var(--card-bg)",
                      border: "1px solid var(--card-border)",
                      color: "var(--text-primary)",
                    }}
                    onFocus={(e) =>
                      (e.target.style.borderColor = "var(--brand-primary)")
                    }
                    onBlur={(e) =>
                      (e.target.style.borderColor = "var(--card-border)")
                    }
                  />
                </div>

                {/* Password — not shown in forgot mode */}
                {mode !== "forgot" && (
                  <div>
                    <label
                      className="text-xs font-medium block mb-1.5"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder={
                          mode === "signup"
                            ? "Min. 8 characters"
                            : "Your password"
                        }
                        value={form.password}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        className="w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all pr-10"
                        style={{
                          background: "var(--card-bg)",
                          border: "1px solid var(--card-border)",
                          color: "var(--text-primary)",
                        }}
                        onFocus={(e) =>
                          (e.target.style.borderColor = "var(--brand-primary)")
                        }
                        onBlur={(e) =>
                          (e.target.style.borderColor = "var(--card-border)")
                        }
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
                )}
              </div>

              {/* Forgot password link — login mode only */}
              {mode === "login" && (
                <div className="flex justify-end mt-2">
                  <button
                    onClick={() => {
                      setMode("forgot");
                      setError("");
                    }}
                    className="text-xs font-medium"
                    style={{ color: "var(--brand-primary)" }}
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              {/* Error */}
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

              {/* Submit */}
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
                {loading
                  ? "Please wait..."
                  : mode === "forgot"
                  ? "Send Reset Link"
                  : mode === "login"
                  ? "Log In"
                  : "Create Account"}
              </button>

              {/* Switch mode */}
              <p
                className="text-xs text-center mt-4"
                style={{ color: "var(--text-muted)" }}
              >
                {mode === "forgot" ? (
                  <>
                    Remember your password?{" "}
                    <button
                      onClick={() => {
                        setMode("login");
                        setError("");
                      }}
                      className="font-semibold"
                      style={{ color: "var(--brand-primary)" }}
                    >
                      Log In
                    </button>
                  </>
                ) : mode === "login" ? (
                  <>
                    Don&apos;t have an account?{" "}
                    <button
                      onClick={() => {
                        setMode("signup");
                        setError("");
                      }}
                      className="font-semibold"
                      style={{ color: "var(--brand-primary)" }}
                    >
                      Sign Up
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{" "}
                    <button
                      onClick={() => {
                        setMode("login");
                        setError("");
                      }}
                      className="font-semibold"
                      style={{ color: "var(--brand-primary)" }}
                    >
                      Log In
                    </button>
                  </>
                )}
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
}