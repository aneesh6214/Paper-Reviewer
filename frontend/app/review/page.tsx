"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Header from "../../components/header";
import PDFDragDrop from "../../components/pdf-drag-drop";

export default function ReviewPage() {
  const [fileName, setFileName] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showMarkdownModal, setShowMarkdownModal] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Paper markdown (converted by backend in future). Prefill with placeholder.
  const [paperMarkdown, setPaperMarkdown] = useState<string>(() => (
`# Your Paper (Markdown)

> Paste and refine the converted markdown here before review.

## Abstract
Short summary…

## Introduction
…
`
  ));

  // Scorecard markdown editable inline before submission
  const [scorecardMd, setScorecardMd] = useState<string>(() => (
`# Scorecard

## Originality
Score: 4/5
Notes: …

## Clarity
Score: 4/5
Notes: …

## Methodology
Score: 3/5
Notes: …

## Overall
Score: 4/5
Decision: Weak Accept
`
  ));

  // If we land without file, prompt for upload
  useEffect(() => {
    if (!fileName) setShowUploadModal(true);
  }, [fileName]);

  const handlePdfSelect = (file: File | null) => {
    if (file) {
      setFileName(file.name);
      setShowUploadModal(false);
    }
  };

  const markdownModal = (
    <AnimatePresence>
      {showMarkdownModal && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="mx-4 w-full max-w-4xl rounded-2xl bg-white p-4 sm:p-6 shadow-[0_24px_60px_rgba(0,0,0,0.18)]"
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                Review Markdown
              </h3>
              <button
                className="rounded-full px-3 py-1 text-sm"
                style={{ backgroundColor: 'var(--bg-black-10)' }}
                onClick={() => setShowMarkdownModal(false)}
              >
                Close
              </button>
            </div>
            <textarea
              value={paperMarkdown}
              onChange={(e) => setPaperMarkdown(e.target.value)}
              className="mt-4 h-[60vh] w-full resize-none rounded-xl border border-[color:var(--ring-black-10)] bg-[color:var(--bg-white-80)] p-4 font-mono text-sm outline-none"
            />
            <div className="mt-3 flex justify-end">
              <button
                className="rounded-full px-4 py-2 text-sm font-medium"
                style={{ backgroundColor: 'var(--progress-blue)', color: 'var(--color-white)' }}
                onClick={() => setShowMarkdownModal(false)}
              >
                Save & Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const uploadModal = (
    <AnimatePresence>
      {showUploadModal && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="mx-4 w-full max-w-2xl rounded-2xl bg-white p-4 sm:p-6 shadow-[0_24px_60px_rgba(0,0,0,0.18)]"
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                Upload your PDF
              </h3>
              <button
                className="rounded-full px-3 py-1 text-sm"
                style={{ backgroundColor: 'var(--bg-black-10)' }}
                onClick={() => setShowUploadModal(false)}
              >
                Close
              </button>
            </div>
            <div className="mt-4">
              <PDFDragDrop onFileSelect={handlePdfSelect} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="relative min-h-dvh bg-white" style={{ color: 'var(--text-primary)' }}>
      <Header />
      <main className="mx-auto max-w-5xl px-6 sm:px-8 pt-28 pb-16">
        {/* Top meta row */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            {fileName ? (
              <span>Document: <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{fileName}</span></span>
            ) : (
              <span>No document selected</span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              className="rounded-full px-4 py-2 text-sm font-medium"
              style={{ backgroundColor: 'var(--progress-blue)', color: 'var(--color-white)' }}
              onClick={() => setShowMarkdownModal(true)}
            >
              Review Markdown
            </button>
            <button
              className="rounded-full px-4 py-2 text-sm font-medium"
              style={{ backgroundColor: 'var(--progress-blue)', color: 'var(--color-white)' }}
              onClick={() => setIsSubmitted(true)}
            >
              Send for Review
            </button>
            <button
              className="rounded-full px-3 py-2 text-sm"
              style={{ backgroundColor: 'var(--bg-black-10)' }}
              onClick={() => setShowUploadModal(true)}
            >
              Change file
            </button>
          </div>
        </div>

        {/* Scorecard */}
        <section className="rounded-2xl border border-[color:var(--ring-black-10)] bg-[color:var(--bg-white-80)] p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Scorecard</h2>
            {!isSubmitted && (
              <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Editable before submission
              </span>
            )}
          </div>
          {!isSubmitted ? (
            <textarea
              value={scorecardMd}
              onChange={(e) => setScorecardMd(e.target.value)}
              className="min-h-[320px] w-full resize-vertical rounded-xl border border-[color:var(--ring-black-10)] bg-white p-4 font-mono text-sm outline-none"
            />
          ) : (
            <div className="whitespace-pre-wrap rounded-xl bg-white p-4 font-mono text-sm">
              {scorecardMd}
            </div>
          )}
        </section>
      </main>

      {markdownModal}
      {uploadModal}
    </div>
  );
}


