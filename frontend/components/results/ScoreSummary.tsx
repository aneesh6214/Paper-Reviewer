"use client";

import React from "react";

export type ScoreCategory = {
  id: string;
  title: string;
  score?: number; // undefined for non-numeric
};

type ScoreSummaryProps = {
  fileName?: string | null;
  grade?: string; // e.g., "A+"
  categories: ScoreCategory[];
  onUploadNew?: () => void;
};

export default function ScoreSummary({ fileName, grade = "A+", categories, onUploadNew }: ScoreSummaryProps) {
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
      <div className="mt-4 rounded-xl border" style={{ backgroundColor: 'var(--bg-white-80)', borderColor: 'var(--gray-200)' }}>
        <div className="relative flex items-center justify-between gap-4 px-4 py-3">
          {/* Left: Grade */}
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-full flex items-center justify-center text-xl font-semibold" style={{ backgroundColor: 'var(--gray-100)', color: 'var(--text-primary)' }}>{grade}</div>
          </div>

          {/* Center: Categories */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="flex items-center gap-6">
              {categories.map((c) => (
                <div key={c.id} className="flex flex-col items-center min-w-[72px]">
                  <div className="h-8 w-8 rounded-full border-2 flex items-center justify-center text-sm font-semibold" style={{ borderColor: 'var(--gray-300)', color: 'var(--text-primary)', backgroundColor: 'var(--color-white)' }}>
                    {c.score ?? '—'}
                  </div>
                  <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{c.title}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: View more */}
          <button className="text-sm rounded-full px-3 py-1 border cursor-pointer" style={{ borderColor: 'var(--gray-200)', color: 'var(--text-secondary)', backgroundColor: 'var(--color-white)' }}>
            View More
          </button>
        </div>
      </div>
    </section>
  );
}


