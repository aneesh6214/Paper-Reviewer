"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Header from "../components/header";
import PDFUpload from "../components/pdf-upload";
import PDFDragDrop from "../components/pdf-drag-drop";
import LogoMarquee from "../components/logo-marquee";

export default function Home() {
  const handleFileSelect = (file: File | null) => {
    console.log("Selected file:", file);
    // Handle file selection logic here
  };

  return (
    <div className="relative min-h-dvh bg-white font-sans" style={{color: 'var(--text-primary)'}}>
      {/* Hero surface */}
      <main className="mx-auto mt-12 max-w-[1600px] px-4 pb-12">
        <div className="relative">
          {/* Header fixed near top: center aligns with hero top */}
          <Header offset="3rem" />

          <section
            className="hero-surface relative isolate overflow-hidden rounded-3xl border border-black/[0.06] p-10 sm:p-20 min-h-[96vh]"
          >
          {/* white to blue radial gradient centered on heading using CSS variables */}
          <div className="pointer-events-none absolute inset-0 -z-10" style={{background: 'radial-gradient(circle at 50% 35%, var(--hero-gradient-center) 0%, var(--hero-gradient-edge) 64%)'}} />

          <div className="mx-auto max-w-3xl text-center pt-16">
            <motion.h1
              className="text-7xl font-medium tracking-tight"
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
            >
              {/* <div className="font-semibold">Lightning Fast</div> Academic Paper Reviews */}
              Instant Paper Reviews
            </motion.h1>

            <motion.p
              className="mt-8 text-lg leading-7"
              style={{color: 'var(--text-secondary)'}}
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
            >
              Get a conference-quality review of your academic paper in minutes.
            </motion.p>

            {/* PDF upload */}
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
              className="mt-12"
            >
              <PDFDragDrop 
                onFileSelect={handleFileSelect}
              />
            </motion.div>

            {/* Logo marquee */}
            <div className="mt-16">
              <LogoMarquee />
            </div>
          </div>

          </section>
        </div>
      </main>
      {/* How it Works Section */}
      <section id="how-it-works" className="mx-auto mb-8 max-w-[1600px] px-8 md:px-16">
        <div className="flex items-end justify-between gap-6">
          <div>
            <span
              className="inline-flex items-center rounded-full px-6 py-3 text-base font-semibold shadow-sm"
              style={{ background: 'var(--hiw-pill-bg)', color: 'var(--hiw-pill-text)', border: '1px solid var(--nav-border)'}}
            >
              How it Works
            </span>
            <h2 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl" style={{color: 'var(--text-primary)'}}>
              Conference‑Grade Reviews, Instantly
            </h2>
          </div>
          <p className="max-w-xl text-base leading-7 text-right" style={{color: 'var(--text-secondary)'}}>
          Powered by llama-openreviewer-8b. PREreview uses AI trained on top quality conference papers to analyze and critique your paper.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-3">
          {/* Card 1 */}
          <div className="relative rounded-3xl p-9 pt-24" style={{background: 'var(--card1-bg)', border: '1px solid var(--nav-border)'}}>
            {/* number badge */}
            <div className="absolute left-6 top-6">
              <span className="flex h-14 w-14 items-center justify-center rounded-full text-2xl font-semibold" style={{background: 'var(--nav-bg)', color: 'var(--card-badge-text)', border: '1px solid var(--nav-border)'}}>01</span>
            </div>
            <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-2xl" style={{background: 'var(--nav-bg)', border: '1px solid var(--nav-border)'}}>
              {/* icon placeholder */}
              <span className="h-10 w-10 rounded" style={{background: 'var(--card-icon-bg)'}} />
            </div>
            <h3 className="text-2xl font-semibold" style={{color: 'var(--text-primary)'}}>PDF Upload</h3>
            <p className="mt-3 text-sm leading-6" style={{color: 'var(--text-secondary)'}}>
              Submit your draft as a PDF. We’ll automatically convert it to clean, editable Markdown so you can make quick revisions before review.
            </p>
          </div>

          {/* Card 2 */}
          <div className="relative rounded-3xl p-9 pt-24" style={{background: 'var(--card2-bg)', border: '1px solid var(--nav-border)'}}>
            {/* number badge */}
            <div className="absolute left-6 top-6">
              <span className="flex h-14 w-14 items-center justify-center rounded-full text-2xl font-semibold" style={{background: 'var(--nav-bg)', color: 'var(--card-badge-text)', border: '1px solid var(--nav-border)'}}>02</span>
            </div>
            <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-2xl" style={{background: 'var(--nav-bg)', border: '1px solid var(--nav-border)'}}>
              <span className="h-10 w-10 rounded" style={{background: 'var(--card-icon-bg)'}} />
            </div>
            <h3 className="text-2xl font-semibold" style={{color: 'var(--text-primary)'}}>Conference-Quality Scoring</h3>
            <p className="mt-3 text-sm leading-6" style={{color: 'var(--text-secondary)'}}>
            Our reviewer model analyzes your paper and generates a structured scorecard covering originality, clarity, methodology, and overall quality.
            </p>
          </div>

          {/* Card 3 */}
          <div className="relative rounded-3xl p-9 pt-24" style={{background: 'var(--card3-bg)', border: '1px solid var(--nav-border)'}}>
            {/* number badge */}
            <div className="absolute left-6 top-6">
              <span className="flex h-14 w-14 items-center justify-center rounded-full text-2xl font-semibold" style={{background: 'var(--nav-bg)', color: 'var(--card-badge-text)', border: '1px solid var(--nav-border)'}}>03</span>
            </div>
            <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-2xl" style={{background: 'var(--nav-bg)', border: '1px solid var(--nav-border)'}}>
              <span className="h-10 w-10 rounded" style={{background: 'var(--card-icon-bg)'}} />
            </div>
            <h3 className="text-2xl font-semibold" style={{color: 'var(--text-primary)'}}>Actionable Feedback</h3>
            <p className="mt-3 text-sm leading-6" style={{color: 'var(--text-secondary)'}}>
            View section-by-section feedback with actionable suggestions to improve your writing, strengthen your arguments, and refine presentation.
            </p>
          </div>
        </div>
      </section>

      {/* Global footer pill at bottom */}
      <footer className="mx-auto max-w-[1600px] px-4 sm:px-8 md:px-16 pb-10">
        <div className="opacity-75 flex justify-center">
          <div className="flex items-center gap-4 rounded-full bg-white/90 px-5 py-3 text-sm shadow-[0_10px_30px_rgba(0,0,0,0.08)] ring-1 ring-black/5 backdrop-blur-md">
            <span style={{color: 'var(--text-secondary)'}}>
              Built with <span className="font-semibold" style={{color: 'var(--text-primary)'}}>llama</span>
            </span>
            <span className="h-4 w-px bg-black/10" />
            <span className="font-medium" style={{color: 'var(--text-primary)'}}>Open-Source</span>
            <span className="h-4 w-px bg-black/10" />
            <a href="https://github.com/your-org/your-repo" target="_blank" rel="noreferrer" className="underline-offset-2 hover:underline" style={{color: 'var(--text-primary)'}}>
              View on GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
