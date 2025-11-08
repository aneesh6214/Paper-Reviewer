"use client";

import React from "react";

export type FeedbackItem = {
  id: string;
  text: string; // full body text
};

type FeedbackPanelProps = {
  items: FeedbackItem[];
  selectedId: string | null;
  expanded: boolean; // for the selected item only
  onSelect: (id: string) => void;
  onToggleExpand: (expand: boolean) => void;
};

const MAX_PREVIEW_CHARS = 180;

function renderWithShowMore(text: string, selected: boolean, expanded: boolean, onExpand: (expand: boolean) => void) {
  const needsShowMore = text.length > MAX_PREVIEW_CHARS;
  if (!needsShowMore) return { content: <span>{text}</span>, control: null };
  if (!selected) {
    const preview = text.slice(0, MAX_PREVIEW_CHARS) + '…';
    return {
      content: <span>{preview}</span>,
      control: (
        <div className="mt-1">
          <button className="text-xs font-medium cursor-pointer" style={{ color: 'var(--progress-blue)' }} onClick={(e) => { e.stopPropagation(); onExpand(true); }}>
            Show more
          </button>
        </div>
      )
    };
  }
  // selected
  const contentStr = expanded ? text : text.slice(0, MAX_PREVIEW_CHARS) + '…';
  const label = expanded ? 'Show less' : 'Show more';
  return {
    content: <span>{contentStr}</span>,
    control: (
      <div className="mt-1">
        <button className="text-xs font-medium cursor-pointer" style={{ color: 'var(--progress-blue)' }} onClick={(e) => { e.stopPropagation(); onExpand(!expanded); }}>
          {label}
        </button>
      </div>
    )
  };
}

export default function FeedbackPanel({ items, selectedId, expanded, onSelect, onToggleExpand }: FeedbackPanelProps) {
  return (
    <aside className="h-full overflow-y-auto space-y-3">
      {items.map((it) => {
        const isSelected = it.id === selectedId;
        const { content, control } = renderWithShowMore(it.text, isSelected, expanded, (exp) => { onSelect(it.id); onToggleExpand(exp); });
        return (
          <div key={it.id} className="rounded-lg border cursor-pointer" style={{ borderColor: isSelected ? 'var(--progress-blue)' : 'var(--gray-200)', backgroundColor: 'var(--color-white)' }} onClick={(e) => { e.stopPropagation(); onSelect(it.id); }}>
            <div className="px-4 py-3">
              <div className="text-sm" style={{ color: 'var(--text-primary)' }}>
                {content}
                {control}
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
                  <button className="rounded-full px-3 py-2 text-xs font-medium cursor-pointer self-start" style={{ backgroundColor: 'var(--progress-blue)', color: 'var(--color-white)' }}>Send</button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </aside>
  );
}


