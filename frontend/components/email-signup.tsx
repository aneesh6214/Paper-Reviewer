"use client";

import { useState } from "react";

interface EmailSignupProps {
  onSubmit?: (email: string) => void;
  className?: string;
}

export default function EmailSignup({ onSubmit, className = "" }: EmailSignupProps) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle");

  const handleSubmit = () => {
    const trimmed = email.trim();
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
    if (!isValid || isSubmitting) return;
    if (onSubmit) {
      onSubmit(trimmed);
      return;
    }
    setIsSubmitting(true);
    setStatus("idle");
    fetch("/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: trimmed })
    })
      .then(async (r) => {
        const data = await r.json().catch(() => ({} as any));
        if (r.ok && data?.success) {
          setEmail("");
          setStatus("sent");
        } else {
          setStatus("error");
        }
      })
      .catch(() => setStatus("error"))
      .finally(() => setIsSubmitting(false));
  };

  return (
    <div
      className={`w-full max-w-2xl mx-auto ring-1 ring-[var(--ring-black-10)] backdrop-blur-md bg-[color:var(--bg-white-90)] rounded-full px-3 py-2 shadow-[0_8px_30px_rgba(0,0,0,0.08)] ${className}`}
    >
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full bg-transparent outline-none px-4 py-3 text-[15px]"
            style={{ color: 'var(--text-primary)' }}
            aria-label="Email address"
          />
        </div>
        <button
          onClick={handleSubmit}
          disabled={!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) || isSubmitting || status === "sent"}
          className="rounded-full px-5 sm:px-6 py-3 text-sm font-medium shadow-[inset_0_-4px_12px_rgba(255,255,255,0.12)] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          style={{ backgroundColor: 'var(--progress-blue)', color: 'var(--color-white)' }}
        >
          {isSubmitting ? "Sending…" : status === "sent" ? "Sent!" : "I\u2019m Interested"}
        </button>
      </div>
      {status === "error" && (
        <div className="px-4 pt-1 text-xs" style={{ color: 'var(--error-red)' }}>
          Something went wrong. Please try again.
        </div>
      )}
    </div>
  );
}


