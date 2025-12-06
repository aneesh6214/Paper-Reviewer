"use client";

import React, { useEffect, useRef } from "react";
import type { Paragraph } from "./types";

type ResultsDocumentProps = {
  paragraphs: Paragraph[];
  selectedCommentId?: string | null;
  onSelectHighlight?: (id: string) => void;
};

export default function ResultsDocument({ paragraphs, selectedCommentId, onSelectHighlight }: ResultsDocumentProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll to the highlighted element when selectedCommentId changes
  useEffect(() => {
    if (!selectedCommentId || !containerRef.current) return;

    const highlightEl = containerRef.current.querySelector(`[data-highlight-id="${selectedCommentId}"]`);
    if (highlightEl) {
      highlightEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [selectedCommentId]);

  return (
    <div className="rounded-xl border overflow-hidden h-full flex flex-col" style={{ backgroundColor: 'var(--bg-white-80)', borderColor: 'var(--gray-200)' }}>
      <div ref={containerRef} className="p-4 space-y-4 overflow-y-auto">
        {paragraphs.map((p, idx) => (
          <p key={idx} className="text-sm leading-6" style={{ color: 'var(--text-primary)' }}>
            {p.map((chunk, i) => {
              if (!chunk.highlightId) return <span key={i}>{chunk.text}</span>;
              
              const isActive = selectedCommentId === chunk.highlightId;
              
              return (
                <span
                  key={i}
                  data-highlight-id={chunk.highlightId}
                  onClick={(e) => { e.stopPropagation(); onSelectHighlight?.(chunk.highlightId!); }}
                  className="cursor-pointer transition-all duration-200 ease-out"
                  style={{
                    backgroundColor: isActive ? 'var(--highlight-yellow-strong)' : 'var(--highlight-yellow)',
                    padding: '1px 3px',
                    borderRadius: '3px',
                    boxShadow: isActive ? '0 0 0 2px var(--highlight-yellow-strong)' : 'none',
                  }}
                >
                  {chunk.text}
                </span>
              );
            })}
          </p>
        ))}
      </div>
    </div>
  );
}


