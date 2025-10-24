"use client";

import { useState, useRef, DragEvent } from "react";
import { motion, useAnimationFrame } from "framer-motion";

interface PDFDragDropProps {
  onFileSelect?: (file: File | null) => void;
  className?: string;
}

export default function PDFDragDrop({ onFileSelect, className = "" }: PDFDragDropProps) {
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

  // Animate CSS variable --angle for the outlined button border spin
  const containerRef = useRef<HTMLDivElement>(null);
  useAnimationFrame((t: number) => {
    const el = containerRef.current;
    if (!el) return;
    const deg = (t / 3000) * 360; // 3s full rotation
    el.style.setProperty("--angle", `${deg}deg`);
  });

  return (
    <div ref={containerRef} className={`w-full max-w-3xl mx-auto ${className}`}>
      <div
        className={`
          relative cursor-pointer rounded-2xl text-center transition-all duration-200
          ${selectedFile
            ? 'border-2 border-gray-300 bg-gray-100 p-16'
            : `border-2 border-dashed p-16 ${isDragOver ? 'border-blue-400 bg-blue-50/50' : 'border-gray-300 bg-white/60 hover:border-gray-400 hover:bg-white/80'}`}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        style={{
          backdropFilter: 'blur(12px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)'
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={handleInputChange}
        />
        
        <div className="flex flex-col items-center gap-4">
          {selectedFile ? (
            <>
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-green-600">
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
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-gray-600">
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
            className="animated-outline mt-6 rounded-full px-8 py-3 text-sm font-medium shadow-[inset_0_-4px_12px_rgba(255,255,255,0.12)] hover:bg-black"
            style={{backgroundColor: 'var(--button-primary)', color: 'var(--button-primary-text)'}}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Review Paper
          </motion.button>
        )}
      </div>
    </div>
  );
}
