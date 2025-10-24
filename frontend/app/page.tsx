"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion } from "framer-motion";
import Header from "../components/header";
import PDFUpload from "../components/pdf-upload";
import PDFDragDrop from "../components/pdf-drag-drop";
import LogoMarquee from "../components/logo-marquee";
import FeatureShowcase from "../components/feature-showcase";

export default function Home() {
  const uploadRef = useRef<HTMLDivElement>(null);

  const handleFileSelect = (file: File | null) => {
    console.log("Selected file:", file);
    // Handle file selection logic here
  };

  const handleTryNow = () => {
    uploadRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div className="relative min-h-dvh bg-white font-sans" style={{color: 'var(--text-primary)'}}>
      {/* Global fixed header above all sections */}
      <Header onTryNowClick={handleTryNow} />
      {/* New full-bleed hero with background image and fades */}
      <section className="relative isolate overflow-hidden min-h-[85vh]">
        {/* Background image */}
        <img src="/landing-bg.jpg" alt="Hero background" className="absolute inset-0 -z-10 h-full w-full object-cover" />
        {/* Top black fade for header readability */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-56 -z-0 bg-gradient-to-b from-[var(--overlay-strong)] via-[var(--overlay-mid)] to-transparent" />
        {/* Bottom fade to page background */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-72 -z-0 bg-gradient-to-t from-[var(--color-white)] to-transparent" />

        {/* Hero content */}
        <div className="mx-auto max-w-5xl px-6 sm:px-8 pt-28 pb-36 text-center">
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
            className="mt-12"
          >
            <PDFDragDrop onFileSelect={handleFileSelect} />
          </motion.div>

          {/* Logo marquee */}
          <div className="mt-12">
            <LogoMarquee />
          </div>
        </div>
      </section>
      {/* Feature showcase replaces How it Works */}
      <section className="mx-auto mb-4 max-w-[1600px] px-6 md:px-16">
        <FeatureShowcase />
      </section>

      {/* Footer removed as requested */}
    </div>
  );
}
