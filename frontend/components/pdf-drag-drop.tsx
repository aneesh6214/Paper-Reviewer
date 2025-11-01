"use client";

import { useState, useRef, DragEvent } from "react";
import { motion } from "framer-motion";

interface PDFDragDropProps {
  onFileSelect?: (file: File | null) => void;
  onConvert?: () => void;
  className?: string;
}

export default function PDFDragDrop({ onFileSelect, onConvert, className = "" }: PDFDragDropProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (file: File | null) => {
    setSelectedFile(file);
    onFileSelect?.(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleFileChange(file);
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type === 'application/pdf') {
      handleFileChange(files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`w-full ${className}`}>
      <div
        className="relative cursor-pointer rounded-2xl text-center transition-all duration-200 h-full flex flex-col justify-center border-2 border-dashed p-8"
        style={{
          borderColor: selectedFile ? 'var(--gray-300)' : isDragOver ? 'var(--blue-300)' : 'var(--gray-300)',
          backgroundColor: selectedFile ? 'var(--gray-100)' : isDragOver ? 'var(--blue-50)' : 'var(--bg-white-60)',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)'
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={handleInputChange}
        />
        
        {/* Always render the post-upload layout for consistent height */}
        <div className="relative h-full flex flex-col justify-center">
          {/* Invisible placeholder for consistent height */}
          <div className="invisible flex flex-col items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full" style={{ backgroundColor: 'var(--success-green-bg)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <p className="text-lg font-medium">Placeholder filename.pdf</p>
              <p className="text-sm">0.0 MB • Ready to review</p>
            </div>
            <button className="mt-6 rounded-full px-8 py-3 text-sm font-medium">
              Placeholder Button
            </button>
          </div>

          {/* Actual visible content - absolutely positioned to center */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              {selectedFile ? (
                <>
                  <div className="flex h-16 w-16 items-center justify-center rounded-full" style={{ backgroundColor: 'var(--success-green-bg)' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ color: 'var(--success-green)' }}>
                      <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-lg font-medium" style={{color: 'var(--text-primary)'}}>
                      {selectedFile.name}
                    </p>
                    <p className="text-sm" style={{color: 'var(--text-secondary)'}}>
                      {(selectedFile.size / 1024 / 1024).toFixed(1)} MB • Ready to review
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex h-16 w-16 items-center justify-center rounded-full" style={{ backgroundColor: 'var(--gray-100)' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ color: 'var(--gray-600)' }}>
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <polyline points="7,10 12,5 17,10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <line x1="12" y1="5" x2="12" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-lg font-medium" style={{color: 'var(--text-primary)'}}>
                      {isDragOver ? 'Drop your PDF here' : 'Upload your PDF'}
                    </p>
                    <p className="text-sm" style={{color: 'var(--text-secondary)'}}>
                      Drag and drop or click to browse
                    </p>
                  </div>
                </>
              )}
            </div>

            {selectedFile && (
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  if (onConvert) {
                    onConvert();
                  } else {
                    // Fallback to original behavior for landing page
                    window.location.href = '/review';
                  }
                }}
                className="inline-block mt-6 rounded-full px-8 py-3 text-sm font-medium shadow-[inset_0_-4px_12px_rgba(255,255,255,0.12)] hover:brightness-95 cursor-pointer"
                style={{backgroundColor: 'var(--progress-blue)', color: 'var(--color-white)'}}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {onConvert ? 'Confirm Upload' : 'Start Review'}
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
