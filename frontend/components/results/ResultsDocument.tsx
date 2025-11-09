"use client";

import React from "react";

type Paragraph = Array<{ text: string; highlightId?: string }>;

type ResultsDocumentProps = {
  paragraphs: Paragraph[];
  selectedCommentId?: string | null;
  onSelectHighlight?: (id: string) => void;
};

export default function ResultsDocument({ paragraphs, selectedCommentId, onSelectHighlight }: ResultsDocumentProps) {
  return (
    <div className="rounded-xl border overflow-hidden h-full flex flex-col" style={{ backgroundColor: 'var(--bg-white-80)', borderColor: 'var(--gray-200)' }}>
      <div className="p-4 space-y-4 overflow-y-auto">
        {paragraphs.map((p, idx) => (
          <p key={idx} className="text-sm leading-6" style={{ color: 'var(--text-primary)' }}>
            {p.map((chunk, i) => {
              if (!chunk.highlightId) return <span key={i}>{chunk.text}</span>;
              const active = selectedCommentId && selectedCommentId === chunk.highlightId;
              return (
                <span
                  key={i}
                  onClick={(e) => { e.stopPropagation(); onSelectHighlight?.(chunk.highlightId!); }}
                  className="cursor-pointer rounded-sm"
                  style={{
                    backgroundColor: active ? 'var(--highlight-yellow-strong)' : 'var(--highlight-yellow)',
                    padding: '0 2px',
                    borderRadius: '2px'
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


