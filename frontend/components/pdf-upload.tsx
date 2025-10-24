"use client";

import { useState } from "react";

interface PDFUploadProps {
  onFileSelect?: (file: File | null) => void;
  className?: string;
}

export default function PDFUpload({ onFileSelect, className = "" }: PDFUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    onFileSelect?.(file);
  };

  return (
    <div
      className={`flex w-full max-w-xl items-center gap-2 rounded-full border border-black/10 bg-white/75 p-2 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.08)] backdrop-blur-md ${className}`}
    >
      <label className="flex w-full cursor-pointer items-center gap-3 rounded-full bg-transparent px-4 py-3">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <polyline points="7,10 12,5 17,10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <line x1="12" y1="5" x2="12" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <input
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={handleFileChange}
        />
        <span className="text-[15px] truncate" style={{color: 'var(--upload-placeholder)'}}>
          {selectedFile ? selectedFile.name : "Upload your PDF..."}
        </span>
      </label>
      <button
        className="rounded-full px-4 py-3 mr-1 text-sm font-medium shadow-[inset_0_-4px_12px_rgba(255,255,255,0.12)] hover:bg-black"
        style={{backgroundColor: 'var(--button-primary)', color: 'var(--button-primary-text)'}}
      >
        Review
      </button>
    </div>
  );
}
