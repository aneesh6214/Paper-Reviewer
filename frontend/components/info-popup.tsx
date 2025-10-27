"use client";

import { useState, useEffect } from "react";

interface InfoPopupProps {
  isOpen: boolean;
  onClose: () => void;
  mediaSrc: string;
  mediaAlt: string;
  description: string;
  buttonText?: string;
  isVideo?: boolean;
}

export default function InfoPopup({
  isOpen,
  onClose,
  mediaSrc,
  mediaAlt,
  description,
  buttonText = "Ready",
  isVideo = false
}: InfoPopupProps) {
  const [mediaWidth, setMediaWidth] = useState<number>(0);

  // Close popup on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when popup is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-[100] p-16" 
      style={{ 
        backdropFilter: 'blur(30px)',
        WebkitBackdropFilter: 'blur(30px)',
        backgroundColor: 'rgba(0, 0, 0, 0.4)'
      }}
    >
      <div className="flex flex-col items-center max-w-4xl">
        {/* Media (Image or Video) */}
        {isVideo ? (
          <video
            src={mediaSrc}
            className="max-w-full h-auto rounded-2xl shadow-lg mb-6"
            autoPlay
            loop
            muted
            playsInline
            onLoadedMetadata={(e) => {
              const video = e.target as HTMLVideoElement;
              setMediaWidth(video.offsetWidth);
            }}
          />
        ) : (
          <img 
            src={mediaSrc}
            alt={mediaAlt}
            className="max-w-full h-auto rounded-2xl shadow-lg mb-6"
            onLoad={(e) => {
              const img = e.target as HTMLImageElement;
              setMediaWidth(img.offsetWidth);
            }}
          />
        )}
        
        {/* Description Box */}
        <div 
          className="rounded-2xl p-6 flex items-center gap-6" 
          style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            width: mediaWidth > 0 ? `${mediaWidth}px` : 'auto'
          }}
        >
          <p className="flex-1 text-base leading-relaxed" style={{ color: 'var(--text-primary)' }}>
            {description}
          </p>
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-full font-medium transition-colors cursor-pointer whitespace-nowrap flex items-center gap-2"
            style={{
              backgroundColor: 'var(--progress-blue)',
              color: 'var(--color-white)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          >
            <span>{buttonText}</span>
            <svg 
              fill="currentColor" 
              viewBox="0 0 24 24" 
              width="18"
              height="18"
            >
              <path
                clipRule="evenodd"
                d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 10.28a.75.75 0 000-1.06l-3-3a.75.75 0 10-1.06 1.06l1.72 1.72H8.25a.75.75 0 000 1.5h5.69l-1.72 1.72a.75.75 0 101.06 1.06l3-3z"
                fillRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}