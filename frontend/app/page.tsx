"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion } from "framer-motion";
import Header from "../components/header";
import EmailSignup from "../components/email-signup";
import LogoMarquee from "../components/logo-marquee";
import FeatureShowcase from "../components/feature-showcase";

export default function Home() {
  const uploadRef = useRef<HTMLDivElement>(null);

  const handleTryNow = () => {
    uploadRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div className="relative min-h-dvh bg-white font-sans" style={{color: 'var(--text-primary)'}}>
      {/* Global fixed header above all sections */}
      <Header buttonHref="#" />
      {/* New full-bleed hero with background image and fades */}
      <section className="relative isolate overflow-hidden min-h-[85vh]">
        {/* Background wrapper with image and fades */}
        <div className="absolute inset-x-0 top-0 -z-10 h-[85vh] w-full">
          <img src="/landing-bg.jpg" alt="Hero background" className="absolute inset-0 h-full w-full object-cover" />
          {/* Top black fade for header readability */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-[var(--overlay-strong)] via-[var(--overlay-mid)] to-transparent" />
          {/* Subtle bottom fade - positioned relative to the 85vh container */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-white via-white/40 to-transparent" />
        </div>

        {/* Hero content */}
        <div className="relative z-10 mx-auto max-w-5xl px-6 sm:px-8 pt-28 pb-4 text-center">
          <motion.h1
            className="text-[88px] sm:text-[96px] font-medium tracking-tight text-white"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          >
            Instant Peer Reviews
          </motion.h1>
          <motion.p
            className="mt-8 text-xl sm:text-2xl leading-8 sm:leading-9 text-white/85"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          >
            Get a conference‑quality review of your academic paper in minutes.
            Upload, analyze, and improve with actionable, section‑by‑section feedback.
          </motion.p>
          <motion.div
            id="try"
            ref={uploadRef}
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.45 }}
            className="mt-12 mx-auto max-w-2xl"
          >
            <EmailSignup />
          </motion.div>
          <motion.p
            className="mt-4 text-xs sm:text-sm text-white/80"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.45 }}
          >
            By subscribing you agree to recieve updates from PaperGrader and to our{" "}
            <Link href="/privacy" className="underline decoration-white/60 underline-offset-4 hover:decoration-white">
              Privacy Policy
            </Link>
            .
          </motion.p>
          <div className="mt-16">
            <div className="mx-auto max-w-5xl">
              <LogoMarquee />
            </div>
            <div className="mt-16">
              <FeatureShowcase />
            </div>
          </div>
        </div>
      </section>
      <footer className="border-t border-black/10 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl flex-col gap-2 px-6 py-6 text-xs sm:flex-row sm:items-center sm:justify-between sm:text-sm" style={{ color: 'var(--text-secondary)' }}>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6">
            <a href="https://arxiv.org/abs/2412.11948" target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors">
              Powered by OpenReviewer
            </a>
            <span>Built with Llama</span>
          </div>
          <a href="mailto:mypapergrader@gmail.com" className="hover:text-black transition-colors">
            Contact Support
          </a>
        </div>
      </footer>
    </div>
  );
}
