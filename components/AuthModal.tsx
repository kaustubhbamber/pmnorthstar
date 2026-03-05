"use client";

import { useState } from "react";
import { X, Eye, EyeOff, Star, Loader2 } from "lucide-react";

interface AuthModalProps {
  onClose: () => void;
  onSuccess: (user: { id: string; name: string; email: string }) => void;
}

export function AuthModal({ onClose, onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: "rgba(0,0,0,0.7)" }}
        onClick={onClose}
      >
        {/* Modal */}
        <div
          className="relative w-full max-w-md rounded-2xl p-8"
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
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h2>
          <p
            className="text-sm mb-6"
            style={{ color: "var(--text-muted)" }}
          >
            {mode === "login"
              ? "Sign in to access your saved resources"
              : "Start saving and liking resources"}
          </p>

          {/* Mode Toggle */}
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

            {/* Password */}
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
          </div>

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
              : mode === "login"
              ? "Log In"
              : "Create Account"}
          </button>

          {/* Switch mode */}
          <p
            className="text-xs text-center mt-4"
            style={{ color: "var(--text-muted)" }}
          >
            {mode === "login"
              ? "Don't have an account? "
              : "Already have an account? "}
            <button
              onClick={() => {
                setMode(mode === "login" ? "signup" : "login");
                setError("");
              }}
              className="font-semibold"
              style={{ color: "var(--brand-primary)" }}
            >
              {mode === "login" ? "Sign Up" : "Log In"}
            </button>
          </p>
        </div>
      </div>
    </>
  );
}