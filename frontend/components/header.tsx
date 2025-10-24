"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

interface HeaderProps {
  onTryNowClick?: () => void;
}

export default function Header({ onTryNowClick }: HeaderProps) {
  const [showPill, setShowPill] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const threshold = 160; // reveal pill after passing hero title area
      setShowPill(window.scrollY > threshold);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleTryNow = (e: React.MouseEvent) => {
    e.preventDefault();
    onTryNowClick?.();
  };

  return (
    <div className="fixed inset-x-0 top-0 z-50">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-50 bg-gradient-to-b from-[var(--overlay-transparent)] to-transparent" />
      <div className="relative">
        {/* Wide transparent state over hero */}
        <motion.nav
          initial={{ opacity: 1 }}
          animate={{ opacity: showPill ? 0 : 1 }}
          transition={{ duration: 0.1, ease: 'linear' }}
          className={`absolute inset-x-0 top-0 z-40 ${showPill ? 'pointer-events-none' : 'pointer-events-auto'}`}
          style={{ willChange: 'opacity' }}
        >
          <div className="mx-auto max-w-[1600px] px-4 py-4 sm:py-6">
            <div className="grid grid-cols-3 items-center text-white">
              <div className="flex items-center gap-2">
                <img src="/paper.svg" alt="Paper logo" width={22} height={22} className="block invert brightness-0" />
                <Link href="/" className="text-[17px] font-medium tracking-tight">PREreview</Link>
              </div>
              <div className="flex justify-center">
                <Link href="/about" className="text-[15px] font-semibold opacity-90 hover:opacity-100">About</Link>
              </div>
              <div className="flex justify-end">
                <a href="#try" onClick={handleTryNow} className="rounded-full px-4 py-2 text-[13px] font-medium shadow-[inset_0_-4px_12px_rgba(0,0,0,0.05)] ring-1 ring-[var(--ring-white-20)] bg-[color:var(--bg-white-10)] hover:bg-[color:var(--bg-white-15)]">
                  Try Now
                </a>
              </div>
            </div>
          </div>
        </motion.nav>

        {/* Compact pill state */}
        <motion.nav
          initial={{ opacity: 0 }}
          animate={{ opacity: showPill ? 1 : 0 }}
          transition={{ duration: 0.1, ease: 'linear' }}
          className={`absolute inset-x-0 top-2 sm:top-3 z-50 ${showPill ? 'pointer-events-auto' : 'pointer-events-none'}`}
          style={{ willChange: 'opacity' }}
        >
          <div className="mx-auto w-11/12 sm:w-10/12 md:w-7/12 lg:w-1/2 ring-1 ring-[var(--ring-black-10)] backdrop-blur-md bg-[color:var(--bg-white-90)] rounded-full px-2 py-2 shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
            <div className="grid pl-2 grid-cols-3 items-center" style={{ color: 'var(--text-primary)' }}>
              <div className="flex items-center gap-2">
                <img src="/paper.svg" alt="Paper logo" width={22} height={22} className="block" />
                <Link href="/" className="text-[17px] font-medium tracking-tight">PREreview</Link>
              </div>
                <div className="flex justify-center">
                  <Link href="/about" className="text-[15px] font-semibold opacity-90 hover:opacity-100">About</Link>
              </div>
              <div className="flex justify-end">
                <a
                  href="#try"
                  onClick={handleTryNow}
                  className="rounded-full px-4 py-2 text-[13px] font-medium shadow-[inset_0_-4px_12px_rgba(0,0,0,0.05)] ring-1 ring-[var(--ring-black-10)] bg-[color:var(--bg-black-5)] hover:bg-black/10"
                >
                  Try Now
                </a>
              </div>
            </div>
          </div>
        </motion.nav>
      </div>
    </div>
  );
}