"use client";

import { useState } from "react";

interface EmailSignupProps {
  onSubmit?: (email: string) => void;
  className?: string;
}

export default function EmailSignup({ onSubmit, className = "" }: EmailSignupProps) {
  const [email, setEmail] = useState("");

  const handleSubmit = () => {
    const trimmed = email.trim();
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
    if (!isValid) return;
    onSubmit?.(trimmed);
    // For teaser: no backend yet. Keep a lightweight acknowledgement.
    try {
      console.log("Interest captured:", trimmed);
    } catch {}
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
          disabled={!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())}
          className="rounded-full px-5 sm:px-6 py-3 text-sm font-medium shadow-[inset_0_-4px_12px_rgba(255,255,255,0.12)] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          style={{ backgroundColor: 'var(--progress-blue)', color: 'var(--color-white)' }}
        >
          I&apos;m Interested
        </button>
      </div>
    </div>
  );
}


