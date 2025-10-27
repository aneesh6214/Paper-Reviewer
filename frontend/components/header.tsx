"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

interface HeaderProps {
  onTryNowClick?: () => void;
  buttonText?: string;
  buttonHref?: string;
}

export default function Header({ onTryNowClick, buttonText = "Try Now", buttonHref = "/review" }: HeaderProps) {
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
          <div className="mx-auto max-w-[1600px] px-8 py-4 sm:py-6">
            <div className="flex items-center justify-between text-white">
              <Link href="/" className="flex items-center gap-2 hover:underline">
                <img src="/paper.svg" alt="Paper logo" width={22} height={22} className="block invert brightness-0" />
                <span className="text-[17px] font-bold tracking-tight">PREreview</span>
              </Link>
              <div className="flex justify-end">
                <Link href={buttonHref} className="rounded-full px-4 py-2 text-[13px] font-medium shadow-[inset_0_-4px_12px_rgba(0,0,0,0.05)] ring-1 ring-[var(--ring-white-20)] bg-[color:var(--bg-white-10)] hover:bg-[color:var(--bg-white-15)]">
                  {buttonText}
                </Link>
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
          <div className="mx-auto w-11/12 sm:w-10/12 md:w-7/12 lg:w-1/2 ring-1 ring-[var(--ring-black-10)] backdrop-blur-md bg-[color:var(--bg-white-90)] rounded-full px-4 py-2 shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
            <div className="flex items-center justify-between" style={{ color: 'var(--text-primary)' }}>
              <Link href="/" className="flex items-center gap-2 hover:underline">
                <img src="/paper.svg" alt="Paper logo" width={22} height={22} className="block" />
                <span className="text-[17px] font-bold tracking-tight">PREreview</span>
              </Link>
              <div className="flex justify-end">
                  <Link
                    href={buttonHref}
                    className="rounded-full px-4 py-2 text-[13px] font-medium shadow-[inset_0_-4px_12px_rgba(0,0,0,0.05)]"
                    style={{ backgroundColor: 'var(--progress-blue)', color: 'var(--color-white)'}}
                  >
                    {buttonText}
                  </Link>
              </div>
            </div>
          </div>
        </motion.nav>
      </div>
    </div>
  );
}