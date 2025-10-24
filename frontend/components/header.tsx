"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

interface HeaderProps {
  className?: string;
  offset?: number | string; // distance from top of viewport to align header center
}

export default function Header({ className = "", offset = "3rem" }: HeaderProps) {
  const pathname = usePathname();

  const handleHomeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === "/") {
      e.preventDefault();
      try {
        window.history.replaceState(null, "", "/");
      } catch {}
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
  return (
    <div
      className={`pointer-events-none fixed inset-x-0 z-30 flex justify-center translate-y-[-50%] ${className}`}
      style={{ top: offset }}
    >
      <motion.div
        className="pointer-events-auto will-change-transform"
        initial={{ opacity: 0, y: -32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      >
        <nav
          className="flex items-center gap-16 rounded-full px-4 py-4 shadow-[0_4px_24px_rgba(0,0,0,0.06)] backdrop-blur-md"
          style={{ backgroundColor: 'var(--nav-bg)', border: '1px solid var(--nav-border)' }}
        >
          <Link href="/" onClick={handleHomeClick} className="flex items-center gap-1 ml-1">
            <img src="/paper.svg" alt="Paper logo" width={22} height={22} className="block" />
            <span className="text-[17px] font-medium tracking-tight">PREreview</span>
          </Link>
          <div className="hidden items-center gap-4 font-semibold sm:flex">
            <Link href="#how-it-works" className="text-[15px] transition-colors hover:opacity-100" style={{ color: 'var(--text-secondary)' }}>About</Link>
          </div>
          <div className="ml-5">
            <Link
              href="#cta"
              className="rounded-full px-4 py-2 text-[13px] font-medium shadow-[inset_0_-4px_12px_rgba(0,0,0,0.05)] ring-1 hover:bg-zinc-900/7"
              style={{ backgroundColor: 'rgba(24, 24, 27, 0.05)', color: 'var(--text-primary)', borderColor: 'var(--nav-border)' }}
            >
              Try Now
            </Link>
          </div>
        </nav>
      </motion.div>
    </div>
  );
}


