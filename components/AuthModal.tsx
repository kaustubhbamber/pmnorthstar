"use client";

import { useState, useEffect } from "react";
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

  // Capture the parent URL's ?next= param after mount. Using
  // typeof window inside JSX caused hydration mismatch — this
  // state is undefined on the server render and gets filled in
  // by the effect on the client, which React tolerates.
  const [googleHref, setGoogleHref] = useState("/api/auth/google/start");
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const next = params.get("next");
    if (next) {
      setGoogleHref(`/api/auth/google/start?next=${encodeURIComponent(next)}`);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  // Close on Escape, mirroring the backdrop click — without this the
  // dialog can't be dismissed from the keyboard.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleSubmit = async () => {
    // Guard against re-entry — the Enter key path (and a fast second
    // click) could otherwise fire concurrent signup/login requests.
    if (loading) return;
    setLoading(true);
    setError("");

    try {
      if (mode === "forgot") {
        const res = await fetch("/api/auth/forgot-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: form.email,
            name: form.name,
            newPassword: form.password,
          }),
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
    if (e.key === "Enter" && !loading) handleSubmit();
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
          role="dialog"
          aria-modal="true"
          className="relative w-full max-w-md rounded-2xl p-5 sm:p-8"
          style={{
            background: "var(--page-bg)",
            border: "1.5px solid var(--card-border)",
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

          {/* Logo + eyebrow */}
          <div className="mb-7">
            <div className="flex items-center gap-2.5 mb-5">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: "var(--brand-primary)" }}
              >
                <Star size={13} className="text-white fill-white" strokeWidth={1.5} />
              </div>
              <div className="flex items-baseline gap-0.5">
                <span className="font-display font-bold text-[17px]" style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}>north</span>
                <span className="font-display font-bold text-[17px]" style={{ color: "var(--brand-primary)", letterSpacing: "-0.02em" }}>star</span>
              </div>
            </div>
            <h2
              className="text-2xl font-bold mb-1"
              style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}
            >
              {mode === "forgot"
                ? "Reset password"
                : mode === "login"
                ? "Welcome back"
                : "Create account"}
            </h2>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              {mode === "forgot"
                ? "Verify your identity to set a new password."
                : mode === "login"
                ? "Sign in to access your saved resources."
                : "Optional — sign up to save and like content."}
            </p>
          </div>

          {/* Mode Toggle */}
          {mode !== "forgot" && (
            <div
              className="flex rounded-lg p-0.5 mb-6"
              style={{ border: "1.5px solid var(--card-border)" }}
            >
              {(["login", "signup"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => {
                    setMode(m);
                    setError("");
                  }}
                  className="flex-1 py-2 rounded-md text-xs font-mono uppercase tracking-wider transition-all"
                  style={{
                    background: mode === m ? "var(--text-primary)" : "transparent",
                    color: mode === m ? "var(--page-bg)" : "var(--text-muted)",
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
                Password reset!
              </p>
              <p className="text-xs mb-5" style={{ color: "var(--text-muted)" }}>
                Your password has been updated. You can now log in with your new password.
              </p>
              <button
                onClick={() => {
                  setMode("login");
                  setForgotSent(false);
                  setForm({ name: "", email: "", password: "" });
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
              {/* Continue with Google — primary path. Goes through
                  /api/auth/google/start which sets state cookie and
                  redirects to consent. We preserve any post-login
                  redirect via the parent URL's ?next= parameter. */}
              {mode !== "forgot" && (
                <>
                  <a
                    href={googleHref}
                    className="flex items-center justify-center gap-2.5 w-full py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-[1.01]"
                    style={{
                      background: "var(--card-bg)",
                      border: "1.5px solid var(--card-border)",
                      color: "var(--text-primary)",
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden="true">
                      <path
                        fill="#FFC107"
                        d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
                      />
                      <path
                        fill="#FF3D00"
                        d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"
                      />
                      <path
                        fill="#4CAF50"
                        d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
                      />
                      <path
                        fill="#1976D2"
                        d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
                      />
                    </svg>
                    Continue with Google
                  </a>

                  {/* Divider */}
                  <div className="flex items-center gap-3 my-4">
                    <div
                      className="flex-1 h-px"
                      style={{ background: "var(--card-border)" }}
                    />
                    <span
                      className="text-[10px] font-mono uppercase"
                      style={{
                        color: "var(--text-faint)",
                        letterSpacing: "0.14em",
                      }}
                    >
                      or with email
                    </span>
                    <div
                      className="flex-1 h-px"
                      style={{ background: "var(--card-border)" }}
                    />
                  </div>
                </>
              )}

              {/* Fields */}
              <div className="space-y-3">
                {/* Name — signup and forgot */}
                {(mode === "signup" || mode === "forgot") && (
                  <div>
                    <label
                      className="text-xs font-medium block mb-1.5"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {mode === "forgot" ? "Account Name" : "Full Name"}
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder={mode === "forgot" ? "Name on your account" : "Your name"}
                      value={form.name}
                      onChange={handleChange}
                      onKeyDown={handleKeyDown}
                      className="w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all"
                      style={{
                        background: "var(--card-bg)",
                        border: "1.5px solid var(--card-border)",
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
                      border: "1.5px solid var(--card-border)",
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

                {/* Password */}
                <div>
                    <label
                      className="text-xs font-medium block mb-1.5"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {mode === "forgot" ? "New Password" : "Password"}
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder={
                          mode === "signup" || mode === "forgot"
                            ? "Min. 8 characters"
                            : "Your password"
                        }
                        value={form.password}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        className="w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all pr-10"
                        style={{
                          background: "var(--card-bg)",
                          border: "1.5px solid var(--card-border)",
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
                    border: "1.5px solid rgba(243,18,60,0.2)",
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
                  ? "Reset Password"
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