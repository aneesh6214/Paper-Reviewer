"use client";

import React from "react";

export type ScorecardItem = {
  id: string;
  title: string;
  content: string;
  isEditing?: boolean;
  isNumeric?: boolean;
};

type ScorecardsPanelProps = {
  items: ScorecardItem[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  onToggleEdit: (id: string) => void;
  onUpdate: (id: string, field: "title" | "content", value: string) => void;
  onToggleNumeric: (id: string) => void;
};

export default function ScorecardsPanel({ items, onAdd, onRemove, onToggleEdit, onUpdate, onToggleNumeric }: ScorecardsPanelProps) {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Unified scroll container with LEFT gutter column for the scrollbar */}
      <div className="h-full overflow-y-auto clean-scrollbar" style={{ direction: 'rtl' }}>
        <div className="grid" style={{ gridTemplateColumns: '1fr 28px' }}>
          {/* Content column (visual right due to rtl reversal) */}
          <div style={{ direction: 'ltr' }}>
            {/* Scorecard Header */}
            <div className="rounded-xl border px-5 py-3 shadow-sm" style={{ backgroundColor: 'var(--bg-white-80)', borderColor: 'var(--gray-200)' }}>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>Scorecard</h2>
                  <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{items.length} categories</p>
                </div>
                <button
                  onClick={onAdd}
                  className="h-10 w-10 rounded-full flex items-center justify-center cursor-pointer"
                  style={{ backgroundColor: 'var(--progress-blue)', color: 'var(--color-white)' }}
                  aria-label="Add category"
                  title="Add category"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Scorecards List */}
            <div className="mt-3 space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border shadow-sm px-4 py-3"
                  style={{
                    backgroundColor: item.isEditing ? 'var(--color-white)' : 'var(--bg-white-75)',
                    borderColor: item.isEditing ? 'var(--blue-300)' : 'var(--gray-200)'
                  }}
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Circular number (optional) */}
                      {item.isNumeric && (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 shrink-0" style={{ borderColor: 'var(--progress-blue)', backgroundColor: 'transparent', color: 'var(--progress-blue)' }}>
                          <span className="font-semibold">5</span>
                        </div>
                      )}
                      {item.isEditing ? (
                        <input
                          value={item.title}
                          onChange={(e) => onUpdate(item.id, 'title', e.target.value)}
                          className="w-full bg-transparent outline-none text-xl font-semibold"
                          style={{ color: 'var(--text-primary)' }}
                          placeholder="Category title"
                        />
                      ) : (
                        <h3 className="text-xl font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                          {item.title || 'Untitled'}
                        </h3>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {/* Numeric badge toggle */}
                      <button
                        onClick={() => onToggleNumeric(item.id)}
                        className="p-2 rounded-full hover:bg-gray-100 cursor-pointer"
                        aria-label={item.isNumeric ? 'Remove numeric badge' : 'Make numeric'}
                        title={item.isNumeric ? 'Remove numeric badge' : 'Make numeric'}
                        style={{ color: item.isNumeric ? 'var(--progress-blue)' : 'var(--gray-600)' }}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="4" y1="9" x2="20" y2="9" />
                          <line x1="4" y1="15" x2="20" y2="15" />
                          <line x1="9" y1="4" x2="9" y2="20" />
                          <line x1="15" y1="4" x2="15" y2="20" />
                        </svg>
                      </button>
                      {/* Edit toggle */}
                      <button
                        onClick={() => onToggleEdit(item.id)}
                        className="p-2 rounded-full hover:bg-gray-100 cursor-pointer"
                        aria-label={item.isEditing ? 'Save' : 'Edit'}
                        title={item.isEditing ? 'Save' : 'Edit'}
                        style={{ color: 'var(--gray-600)' }}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 20h9" />
                          <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
                        </svg>
                      </button>
                      {/* Remove */}
                      <button
                        onClick={() => onRemove(item.id)}
                        className="p-2 rounded-full hover:bg-gray-100 cursor-pointer"
                        aria-label="Remove"
                        title="Remove"
                        style={{ color: 'var(--gray-600)' }}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="mt-2 mb-2 border-b" style={{ borderColor: 'var(--progress-blue)' }} />

                  {/* Content */}
                  {item.isEditing ? (
                    <textarea
                      ref={(el) => {
                        if (el) {
                          el.style.height = 'auto';
                          el.style.height = `${el.scrollHeight}px`;
                        }
                      }}
                      value={item.content}
                      onChange={(e) => {
                        onUpdate(item.id, 'content', e.target.value);
                        const el = e.target as HTMLTextAreaElement;
                        el.style.height = 'auto';
                        el.style.height = `${el.scrollHeight}px`;
                      }}
                      onInput={(e) => {
                        const el = e.currentTarget;
                        el.style.height = 'auto';
                        el.style.height = `${el.scrollHeight}px`;
                      }}
                      className="w-full resize-none outline-none bg-transparent whitespace-pre-wrap"
                      rows={1}
                      style={{ color: 'var(--text-primary)', overflow: 'hidden' }}
                      placeholder="Write notes for this category..."
                    />
                  ) : (
                    <p className="text-sm whitespace-pre-wrap" style={{ color: 'var(--text-primary)' }}>
                      {item.content || 'Add your evaluation notes here.'}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
          {/* Left gutter column - dedicated space for the scrollbar */}
          <div />
        </div>
      </div>
    </div>
  );
}


