"use client";

import React, { useState } from "react";
import type { ScoreCategory } from "./types";

type ScoreSummaryProps = {
  fileName?: string | null;
  grade?: string;
  categories: ScoreCategory[];
  onUploadNew?: () => void;
};

/** Info icon SVG for non-numeric categories */
function InfoIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}

/** Chevron icon for navigation */
function ChevronIcon({ direction, className }: { direction: 'left' | 'right'; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {direction === 'left' ? (
        <polyline points="15 18 9 12 15 6" />
      ) : (
        <polyline points="9 18 15 12 9 6" />
      )}
    </svg>
  );
}

/** Downward triangle indicator */
function TriangleDown({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 12 8" fill="currentColor">
      <path d="M6 8L0 0h12L6 8z" />
    </svg>
  );
}

/** Category icon badge - shows score number or info icon */
function CategoryBadge({ 
  category, 
  size = 'md', 
  isActive = false,
  onClick,
}: { 
  category: ScoreCategory; 
  size?: 'sm' | 'md';
  isActive?: boolean;
  onClick?: () => void;
}) {
  const sizeClasses = size === 'md' ? 'h-11 w-11 text-base' : 'h-8 w-8 text-sm';
  
  return (
    <div 
      onClick={onClick}
      className={`${sizeClasses} rounded-full border-2 flex items-center justify-center font-semibold transition-all duration-200 ${onClick ? 'cursor-pointer' : ''}`}
      style={{ 
        borderColor: isActive ? 'var(--progress-blue)' : 'var(--gray-300)', 
        color: 'var(--text-primary)', 
        backgroundColor: 'var(--color-white)',
        boxShadow: isActive ? '0 0 0 2px var(--progress-blue)' : 'none',
      }}
    >
      {category.isNumeric ? (
        category.score ?? '—'
      ) : (
        <InfoIcon className={size === 'md' ? 'w-5 h-5' : 'w-4 h-4'} />
      )}
    </div>
  );
}

export default function ScoreSummary({ fileName, grade = "A+", categories, onUploadNew }: ScoreSummaryProps) {
  const [expanded, setExpanded] = useState(false);
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  const activeCategory = categories[activeCardIndex];

  const goToPrev = () => {
    setActiveCardIndex((prev) => (prev > 0 ? prev - 1 : categories.length - 1));
  };

  const goToNext = () => {
    setActiveCardIndex((prev) => (prev < categories.length - 1 ? prev + 1 : 0));
  };

  return (
    <section>
      {/* Top bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="rounded-full px-4 py-2 text-sm border" style={{ backgroundColor: 'var(--bg-white-80)', borderColor: 'var(--gray-200)', color: 'var(--text-secondary)' }}>
          Now reviewing: <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{fileName || 'example.pdf'}</span>
        </div>
        <button onClick={onUploadNew} className="rounded-full px-4 py-2 text-sm font-medium border cursor-pointer" style={{ backgroundColor: 'var(--color-white)', color: 'var(--text-primary)', borderColor: 'var(--gray-200)' }}>
          Upload new paper
        </button>
      </div>

      {/* Grade + category strip */}
      <div className="relative mt-4">
        <div className="rounded-xl border" style={{ backgroundColor: 'var(--bg-white-80)', borderColor: 'var(--gray-200)' }}>
          {/* Main strip */}
          <div className="relative flex items-center justify-between gap-4 px-4 py-3">
            {/* Left: Grade */}
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-full flex items-center justify-center text-xl font-semibold" style={{ backgroundColor: 'var(--gray-100)', color: 'var(--text-primary)' }}>
                {grade}
              </div>
            </div>

            {/* Center: Category badges */}
            <div className={`absolute inset-0 flex items-center justify-center ${expanded ? '' : 'pointer-events-none'}`}>
              <div className="flex items-center gap-5">
                {categories.map((c, idx) => (
                  <CategoryBadge 
                    key={c.id} 
                    category={c} 
                    size="md" 
                    isActive={expanded && idx === activeCardIndex}
                    onClick={expanded ? () => setActiveCardIndex(idx) : undefined}
                  />
                ))}
              </div>
            </div>

            {/* Right: View more toggle with triangle below */}
            <div className="relative z-10 flex flex-col items-center gap-1">
              <button 
                onClick={() => setExpanded(!expanded)}
                className="text-sm cursor-pointer"
                style={{ color: 'var(--text-secondary)' }}
              >
                {expanded ? 'View Less' : 'View More'}
              </button>
              <TriangleDown 
                className={`w-2.5 h-1.5 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} 
              />
            </div>
          </div>
        </div>

        {/* Expanded cards view - absolutely positioned dropdown */}
        {expanded && (
          <div 
            className="absolute left-0 right-0 top-full mt-1 z-20 rounded-xl border px-4 py-3 shadow-lg"
            style={{ backgroundColor: 'var(--bg-white-90)', borderColor: 'var(--gray-200)' }}
          >
            {/* Card content with navigation */}
            <div className="flex items-stretch gap-3">
              {/* Left arrow */}
              <button 
                onClick={goToPrev}
                className="flex items-center justify-center w-8 rounded-lg cursor-pointer transition-colors"
                style={{ backgroundColor: 'var(--gray-100)', color: 'var(--text-secondary)' }}
              >
                <ChevronIcon direction="left" className="w-5 h-5" />
              </button>

              {/* Active card */}
              <div 
                className="flex-1 rounded-lg border p-4"
                style={{ backgroundColor: 'var(--color-white)', borderColor: 'var(--gray-200)' }}
              >
                {/* Card header: badge + title */}
                <div className="flex items-center gap-3 mb-3">
                  <CategoryBadge category={activeCategory} size="sm" />
                  <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                    {activeCategory.title}
                  </span>
                </div>

                {/* Card description */}
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {activeCategory.description || 'No description available for this category.'}
                </p>
              </div>

              {/* Right arrow */}
              <button 
                onClick={goToNext}
                className="flex items-center justify-center w-8 rounded-lg cursor-pointer transition-colors"
                style={{ backgroundColor: 'var(--gray-100)', color: 'var(--text-secondary)' }}
              >
                <ChevronIcon direction="right" className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}


