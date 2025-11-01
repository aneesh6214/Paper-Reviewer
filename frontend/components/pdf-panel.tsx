"use client";

import React, { RefObject } from "react";
import PDFDragDrop from "./pdf-drag-drop";
import { marked } from "marked";

type ConversionState = 'upload' | 'loading' | 'success' | 'error';

type PdfPanelProps = {
  fileName: string | null;
  conversionState: ConversionState;
  isEditingMarkdown: boolean;
  markdownContent: string;
  isInitializing: boolean;
  loadingMessage: string;
  errorMessage: string;
  onToggleMarkdownEdit: () => void;
  onUploadNew: () => void;
  onUploadInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  uploadInputRef: RefObject<HTMLInputElement | null>;
  onPdfSelect: (file: File | null) => void;
  onConfirmUpload: () => void;
  onMarkdownChange: (value: string) => void;
  hasUnsavedEdits: boolean;
  anyScorecardEditing: boolean;
  onBeginReview: () => void;
};

export default function PdfPanel(props: PdfPanelProps) {
  const {
    fileName,
    conversionState,
    isEditingMarkdown,
    markdownContent,
    isInitializing,
    loadingMessage,
    errorMessage,
    onToggleMarkdownEdit,
    onUploadNew,
    onUploadInputChange,
    uploadInputRef,
    onPdfSelect,
    onConfirmUpload,
    onMarkdownChange,
    hasUnsavedEdits,
    anyScorecardEditing,
    onBeginReview,
  } = props;

  return (
    <div className="relative backdrop-blur-md rounded-lg overflow-hidden flex flex-col border" style={{ backgroundColor: 'var(--bg-white-80)', borderColor: 'var(--gray-200)' }}>
      {/* PDF Header */}
      <div className="px-5 min-h-16 flex items-center">
        <div className="flex items-center justify-between w-full">
          <h2 className="text-xl font-semibold text-[color:var(--text-primary)]">
            {fileName || "Upload PDF"}
          </h2>
          {conversionState === 'success' ? (
            <div className="flex items-center gap-2.5">
              <button
                onClick={onToggleMarkdownEdit}
                className={`rounded-full px-3.5 py-1.5 text-sm font-medium border transition-all duration-200 bg-white ${
                  isEditingMarkdown 
                    ? 'border-blue-300 text-blue-700 hover:bg-blue-50 cursor-pointer' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50 cursor-pointer'
                }`}
              >
                {isEditingMarkdown ? 'Save' : 'Edit'}
              </button>
              <button
                onClick={onUploadNew}
                className="rounded-full px-3.5 py-1.5 text-sm font-medium border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
              >
                Upload
              </button>
              <button
                className="rounded-full px-3.5 py-1.5 text-sm font-medium cursor-pointer"
                style={{ backgroundColor: 'var(--progress-blue)', color: 'var(--color-white)'}}
                onClick={onBeginReview}
              >
                Begin Review
              </button>
              <input ref={uploadInputRef} type="file" accept=".pdf" className="hidden" onChange={onUploadInputChange} />
            </div>
          ) : (
            <div />
          )}
        </div>
      </div>
      {/* full-page warning overlay handled at page level */}
      {/* Divider matching scorecards styling */}
      <div className="mx-4 border-b" style={{ borderColor: 'var(--progress-blue)' }} />

      {/* PDF Content Area */}
      <div className="flex-1 overflow-y-auto bg-transparent">
        {isInitializing ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: 'var(--blue-600)' }}></div>
              <div style={{ color: 'var(--gray-600)' }}>{loadingMessage}</div>
            </div>
          </div>
        ) : conversionState === 'upload' ? (
          <div className="h-full flex items-center justify-center p-4">
            <div className="w-full max-w-md h-64">
              <PDFDragDrop onFileSelect={onPdfSelect} onConvert={onConfirmUpload} className="h-full" />
            </div>
          </div>
        ) : conversionState === 'loading' ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: 'var(--blue-600)' }}></div>
              <div style={{ color: 'var(--gray-600)' }}>{loadingMessage}</div>
            </div>
          </div>
        ) : conversionState === 'error' ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center max-w-md">
              <div className="mb-4" style={{ color: 'var(--error-red)' }}>
                <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Error: Failed to convert PDF to markdown
              </div>
              <div className="mb-4 text-sm" style={{ color: 'var(--gray-600)' }}>{errorMessage}</div>
            </div>
          </div>
        ) : (
          <div className="h-full p-4">
            <div className="h-full border rounded-lg p-4 overflow-y-auto bg-white" style={{ borderColor: 'var(--gray-200)' }}>
              {isEditingMarkdown ? (
                <textarea
                  value={markdownContent}
                  onChange={(e) => onMarkdownChange(e.target.value)}
                  className="w-full h-full resize-none border-none outline-none text-sm text-[color:var(--text-primary)] bg-white font-mono"
                  placeholder="Edit your markdown content here..."
                />
              ) : (
                <div 
                  className="markdown-content text-sm"
                  dangerouslySetInnerHTML={{ 
                    __html: markdownContent ? marked(markdownContent) : '<p style="color: var(--gray-500); font-style: italic;">Your converted document will appear here...</p>' 
                  }}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


