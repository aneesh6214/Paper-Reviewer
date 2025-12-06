"use client";

import React, { useEffect, useRef } from "react";
import type { FeedbackItem } from "./types";

type FeedbackPanelProps = {
  items: FeedbackItem[];
  selectedId: string | null;
  expanded: boolean;
  onSelect: (id: string) => void;
  onToggleExpand: (expand: boolean) => void;
};

const MAX_PREVIEW_CHARS = 180;

/** Renders text with show more/less toggle for long content */
function CommentText({ 
  text, 
  isSelected, 
  expanded, 
  onExpand 
}: { 
  text: string; 
  isSelected: boolean; 
  expanded: boolean; 
  onExpand: (expand: boolean) => void;
}) {
  const needsTruncation = text.length > MAX_PREVIEW_CHARS;
  
  if (!needsTruncation) {
    return <span>{text}</span>;
  }

  const showFullText = isSelected && expanded;
  const displayText = showFullText ? text : text.slice(0, MAX_PREVIEW_CHARS) + '…';
  const buttonLabel = isSelected ? (expanded ? 'Show less' : 'Show more') : 'Show more';

  return (
    <>
      <span>{displayText}</span>
      <div className="mt-1">
        <button 
          className="text-xs font-medium cursor-pointer" 
          style={{ color: 'var(--progress-blue)' }} 
          onClick={(e) => { e.stopPropagation(); onExpand(!expanded); }}
        >
          {buttonLabel}
        </button>
      </div>
    </>
  );
}

export default function FeedbackPanel({ items, selectedId, expanded, onSelect, onToggleExpand }: FeedbackPanelProps) {
  const containerRef = useRef<HTMLElement>(null);

  // Scroll to the selected comment when selection changes
  useEffect(() => {
    if (!selectedId || !containerRef.current) return;

    const commentEl = containerRef.current.querySelector(`[data-comment-id="${selectedId}"]`);
    if (commentEl) {
      commentEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [selectedId]);

  return (
    <aside ref={containerRef} className="h-full overflow-y-auto space-y-3">
      {items.map((item) => {
        const isSelected = item.id === selectedId;
        
        return (
          <div 
            key={item.id} 
            data-comment-id={item.id}
            className="rounded-lg border cursor-pointer transition-all duration-200"
            style={{ 
              borderColor: isSelected ? 'var(--progress-blue)' : 'var(--gray-200)', 
              backgroundColor: 'var(--color-white)',
              boxShadow: isSelected ? '0 0 0 1px var(--progress-blue)' : 'none',
            }} 
            onClick={(e) => { e.stopPropagation(); onSelect(item.id); }}
          >
            <div className="px-4 py-3">
              <div className="text-sm" style={{ color: 'var(--text-primary)' }}>
                <CommentText 
                  text={item.text}
                  isSelected={isSelected}
                  expanded={expanded}
                  onExpand={(exp) => { onSelect(item.id); onToggleExpand(exp); }}
                />
              </div>
              {isSelected && (
                <div className="mt-3 flex items-start gap-2">
                  <textarea
                    placeholder="Reply to feedback"
                    rows={1}
                    className="flex-1 rounded-lg px-3 py-2 text-sm border outline-none resize-none"
                    style={{ borderColor: 'var(--gray-200)', color: 'var(--text-primary)', overflow: 'hidden' }}
                    ref={(el) => { if (el) { el.style.height = 'auto'; el.style.height = `${el.scrollHeight}px`; } }}
                    onInput={(e) => { const el = e.currentTarget; el.style.height = 'auto'; el.style.height = `${el.scrollHeight}px`; }}
                  />
                  <button 
                    className="rounded-full px-3 py-2 text-xs font-medium cursor-pointer self-start" 
                    style={{ backgroundColor: 'var(--progress-blue)', color: 'var(--color-white)' }}
                  >
                    Send
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </aside>
  );
}


