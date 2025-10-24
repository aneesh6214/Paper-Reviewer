"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Feature = {
  id: string;
  title: string;
  description: string;
  imageSrc: string;
};

const AUTOPLAY_MS = 4000;

export default function FeatureShowcase() {
  const features: Feature[] = useMemo(() => [
    {
      id: "upload",
      title: "Upload PDF",
      description: "Drop your paper and we auto‑parse it for review.",
      imageSrc: "/placeholder.webp",
    },
    {
      id: "score",
      title: "Conference Scoring",
      description: "Get clear, rubric‑based scores like major venues.",
      imageSrc: "/placeholder.webp",
    },
    {
      id: "feedback",
      title: "Actionable Feedback",
      description: "Structured suggestions to improve each section.",
      imageSrc: "/placeholder.webp",
    },
  ], []);

  const [active, setActive] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActive((i) => (i + 1) % features.length);
    }, AUTOPLAY_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [features.length]);

  const onSelect = (idx: number) => {
    setActive(idx);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setActive((i) => (i + 1) % features.length);
      }, AUTOPLAY_MS);
    }
  };

  return (
    <div id="about" className="mx-auto max-w-5xl px-6 sm:px-8 scroll-mt-24">
      {/* Boxes (table-style connected grid) */}
      <div className="rounded-2xl border border-[color:var(--ring-black-10)] overflow-hidden bg-[color:var(--bg-white-80)] relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-black/10">
          {features.map((f, idx) => {
            const isActive = idx === active;
            return (
              <button
                key={f.id}
                onClick={() => onSelect(idx)}
                className="relative text-left w-full h-full p-5 transition-colors transition-transform hover:bg-white hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:-translate-y-[1px] focus-visible:outline-none cursor-pointer"
              >
                <div className="text-base font-semibold tracking-tight" style={{color: 'var(--text-primary)'}}>{f.title}</div>
                <div className="mt-2 text-sm" style={{color: 'var(--text-secondary)'}}>
                  {f.description}
                </div>
                {/* Duration bar fixed to bottom so text layout doesn't shift */}
                {isActive && (
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1 bg-[color:var(--bg-black-10)] overflow-hidden">
                    <motion.div
                      key={`progress-${f.id}`}
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: AUTOPLAY_MS / 1000, ease: 'linear' }}
                    className="h-full bg-[color:var(--progress-blue)]"
                    />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Image */}
      <div className="mx-auto w-full">
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl">
          <AnimatePresence mode="wait">
            <motion.img
              key={features[active].id}
              src={features[active].imageSrc}
              alt={features[active].title}
              className="absolute inset-0 h-full w-full object-contain"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            />
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}


