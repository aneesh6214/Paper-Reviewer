"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

interface HeaderProps {
  onTryNowClick?: () => void;
  buttonText?: string;
  buttonHref?: string;
  title?: string;
  onButtonClick?: () => void; // optional click handler for primary button
  showTitleHelpIcon?: boolean; // controls the small help icon next to title
}

export default function Header({ onTryNowClick, buttonText = "Coming Soon!", buttonHref = "#", title, onButtonClick, showTitleHelpIcon = true }: HeaderProps) {
  const [showPill, setShowPill] = useState(false);
  const isComingSoon = buttonText === "Coming Soon!";

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
                <span className="text-[17px] font-bold tracking-tight">PaperReviewer</span>
              </Link>
              {title && (
                <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-2">
                  <h1 className="text-2xl font-semibold text-white whitespace-nowrap">{title}</h1>
                  {showTitleHelpIcon && (
                    <button
                      onClick={() => {
                        // Dispatch custom event to show popup
                        window.dispatchEvent(new CustomEvent('showWelcomePopup'));
                      }}
                      className="cursor-pointer outline-none p-1 rounded-full transition-colors"
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      title="Show help"
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ color: 'white' }}
                      >
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M12 16v-4"/>
                        <path d="M12 8h.01"/>
                      </svg>
                    </button>
                  )}
                </div>
              )}
              <div className="flex justify-end">
                {isComingSoon ? (
                  <span className="rounded-full px-4 py-2 text-[13px] font-medium ring-1 ring-[var(--ring-white-20)] bg-[color:var(--bg-white-10)] cursor-default select-none">
                    {buttonText}
                  </span>
                ) : onButtonClick ? (
                  <button onClick={onButtonClick} className="rounded-full px-4 py-2 text-[13px] font-medium shadow-[inset_0_-4px_12px_rgba(0,0,0,0.05)] ring-1 ring-[var(--ring-white-20)] bg-[color:var(--bg-white-10)] hover:bg-[color:var(--bg-white-15)] cursor-pointer">{buttonText}</button>
                ) : (
                  <Link href={buttonHref} className="rounded-full px-4 py-2 text-[13px] font-medium shadow-[inset_0_-4px_12px_rgba(0,0,0,0.05)] ring-1 ring-[var(--ring-white-20)] bg-[color:var(--bg-white-10)] hover:bg-[color:var(--bg-white-15)]">{buttonText}</Link>
                )}
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
          <div className={`mx-auto ring-1 ring-[var(--ring-black-10)] backdrop-blur-md bg-[color:var(--bg-white-90)] rounded-full px-2 pl-4 py-2 shadow-[0_8px_30px_rgba(0,0,0,0.08)] ${title ? 'w-11/12 sm:w-10/12 md:w-8/12 lg:w-3/5' : 'w-11/12 sm:w-10/12 md:w-7/12 lg:w-1/2'}`}>
            <div className="flex items-center justify-between" style={{ color: 'var(--text-primary)' }}>
              <Link href="/" className="flex items-center gap-2 hover:underline">
                <img src="/paper.svg" alt="Paper logo" width={22} height={22} className="block" />
                <span className="text-[17px] font-bold tracking-tight">PaperReviewer</span>
              </Link>
              {title && (
                <div className="flex-1 text-center mx-8 flex items-center justify-center gap-2">
                  <h1 className="text-lg font-semibold whitespace-nowrap" style={{ color: 'var(--text-primary)' }}>{title}</h1>
                  {showTitleHelpIcon && (
                    <button
                      onClick={() => {
                        // Dispatch custom event to show popup
                        window.dispatchEvent(new CustomEvent('showWelcomePopup'));
                      }}
                      className="cursor-pointer outline-none p-1 rounded-full transition-colors"
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--gray-50)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      title="Show help"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M12 16v-4"/>
                        <path d="M12 8h.01"/>
                      </svg>
                    </button>
                  )}
                </div>
              )}
              <div className="flex justify-end">
                {isComingSoon ? (
                  <span
                    className="rounded-full px-4 py-2 text-[13px] font-medium"
                    style={{ backgroundColor: 'var(--progress-blue)', color: 'var(--color-white)' }}
                  >
                    {buttonText}
                  </span>
                ) : onButtonClick ? (
                  <button
                    onClick={onButtonClick}
                    className="rounded-full px-4 py-2 text-[13px] font-medium shadow-[inset_0_-4px_12px_rgba(0,0,0,0.05)] cursor-pointer"
                    style={{ backgroundColor: 'var(--progress-blue)', color: 'var(--color-white)'}}
                  >
                    {buttonText}
                  </button>
                ) : (
                  <Link
                    href={buttonHref}
                    className="rounded-full px-4 py-2 text-[13px] font-medium shadow-[inset_0_-4px_12px_rgba(0,0,0,0.05)]"
                    style={{ backgroundColor: 'var(--progress-blue)', color: 'var(--color-white)'}}
                  >
                    {buttonText}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </motion.nav>
      </div>
    </div>
  );
}