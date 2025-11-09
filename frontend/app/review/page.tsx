"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { marked } from "marked";
import Header from "../../components/header";
import InfoPopup from "../../components/info-popup";
import ScorecardsPanel, { ScorecardItem as ScorecardPanelItem } from "../../components/scorecards-panel";
import PdfPanel from "../../components/pdf-panel";
import { useRouter } from "next/navigation";

interface PendingPDFData {
  name: string;
  size: number;
  type: string;
  data: string; // base64
  timestamp: number;
}

interface ScorecardItem {
  id: string;
  title: string;
  content: string;
  isEditing?: boolean;
  isNumeric?: boolean;
}

type ConversionState = 'upload' | 'loading' | 'success' | 'error';

export default function ReviewPage() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [conversionState, setConversionState] = useState<ConversionState>('upload');
  const [isInitializing, setIsInitializing] = useState(false);
  const [hasMounted, setHasMounted] = useState(true);
  const [showWelcomePopup, setShowWelcomePopup] = useState(true);
  const [isEditingMarkdown, setIsEditingMarkdown] = useState(false);
  const [markdownContent, setMarkdownContent] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const loadingMessage = "Processing your document...";
  
  // Scorecard items with individual cards
  const [scorecardItems, setScorecardItems] = useState<ScorecardItem[]>([
    { 
      id: "coherence", 
      title: "Coherence", 
      content: "Evaluate the logical flow and consistency of arguments throughout the paper. Consider whether ideas connect smoothly and support the main thesis.",
      isEditing: false,
      isNumeric: true
    },
    { 
      id: "readability", 
      title: "Readability", 
      content: "Assess the clarity of writing, sentence structure, and overall accessibility to the target audience. Note any areas that may be difficult to follow.",
      isEditing: false,
      isNumeric: true
    },
    { 
      id: "contribution", 
      title: "Contribution", 
      content: "Are the questions being asked important? Does the paper bring a significant originality of ideas and/or execution? Are the results valuable to share with the broader ICLR community?",
      isEditing: false,
      isNumeric: false
    },
    { 
      id: "methodology", 
      title: "Methodology", 
      content: "Review the research methods, experimental design, and analytical approaches. Evaluate whether the methods are appropriate for the research questions.",
      isEditing: false
    },
  ]);

  const uploadInputRef = useRef<HTMLInputElement | null>(null);

  const handlePdfSelect = (file: File | null) => {
    if (file) {
      setSelectedFile(file);
      setFileName(file.name);
    }
  };

  const convertPdfToMarkdown = async (file: File) => {
    console.log('Starting PDF conversion for file:', file.name, file.size, 'bytes');
    setConversionState('loading');
    setErrorMessage("");
    
    const formData = new FormData();
    formData.append('file', file);
    
    console.log('FormData created, making request to backend...');
    
    try {
      const response = await fetch('http://localhost:8000/conversions/pdf-to-markdown', {
        method: 'POST',
        body: formData,
      });
      
      console.log('Response received:', response.status, response.statusText);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Response data:', data);
      
      if (data.success) {
        setMarkdownContent(data.markdown);
        setConversionState('success');
      } else {
        setErrorMessage(data.error || 'Failed to convert PDF');
        setConversionState('error');
      }
    } catch (err) {
      console.error('Conversion error:', err);
      const message = err instanceof Error ? err.message : typeof err === 'string' ? err : 'Unknown error';
      setErrorMessage(`We had trouble parsing your PDF. Error: ${message}.`);
      setConversionState('error');
    }
  };

  const handleConfirmUpload = () => {
    if (selectedFile) {
      convertPdfToMarkdown(selectedFile);
    }
  };

  const handleRetry = () => {
    setConversionState('upload');
    setSelectedFile(null);
    setFileName(null);
    setErrorMessage("");
  };

  const addScorecardItem = () => {
    const newId = `item-${Date.now()}`;
    setScorecardItems([...scorecardItems, { 
      id: newId, 
      title: "", 
      content: "",
      isEditing: true,
      isNumeric: false
    }]);
  };

  const removeScorecardItem = (id: string) => {
    setScorecardItems(scorecardItems.filter(item => item.id !== id));
  };

  const updateScorecardItem = (id: string, field: 'title' | 'content', value: string) => {
    setScorecardItems(scorecardItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const toggleScorecardEditing = (id: string) => {
    setScorecardItems(scorecardItems.map(item => 
      item.id === id ? { ...item, isEditing: !item.isEditing } : item
    ));
  };

  const toggleScorecardNumeric = (id: string) => {
    setScorecardItems(scorecardItems.map(item => 
      item.id === id ? { ...item, isNumeric: !item.isNumeric } : item
    ));
  };

  const anyScorecardEditing = scorecardItems.some(item => item.isEditing);
  const hasUnsavedMarkdown = conversionState === 'success' && isEditingMarkdown;
  const [showUnsavedWarning, setShowUnsavedWarning] = useState(false);

  const handleBeginReview = () => {
    if (anyScorecardEditing || hasUnsavedMarkdown) {
      setShowUnsavedWarning(true);
      return;
    }
    setShowUnsavedWarning(false);
    router.push('/results');
  };

  const handleCloseWarning = () => setShowUnsavedWarning(false);

  const handleUploadNew = () => {
    uploadInputRef.current?.click();
  };

  const handleUploadInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setFileName(file.name);
      convertPdfToMarkdown(file);
      // reset value so selecting same file again triggers change
      e.currentTarget.value = '';
    }
  };

  // Check for pending PDF upload from landing page
  useEffect(() => {
    setHasMounted(true);
    
    // Listen for custom event to show popup
    const handleShowPopup = () => {
      setShowWelcomePopup(true);
    };
    
    window.addEventListener('showWelcomePopup', handleShowPopup);
    
    const checkPendingUpload = async () => {
      const pendingData = localStorage.getItem('pendingPDFUpload');
      if (pendingData) {
        // Set initializing and loading states
        setIsInitializing(true);
        setConversionState('loading');
        
        try {
          const fileData: PendingPDFData = JSON.parse(pendingData);
          
          // Convert base64 back to File object
          const response = await fetch(fileData.data);
          const blob = await response.blob();
          const file = new File([blob], fileData.name, { type: fileData.type });
          
          // Set up the file and start conversion
          setSelectedFile(file);
          setFileName(file.name);
          
          // Clear the pending data
          localStorage.removeItem('pendingPDFUpload');
          
          // Auto-start conversion
          convertPdfToMarkdown(file);
        } catch (error) {
          console.error('Error processing pending PDF upload:', error);
          localStorage.removeItem('pendingPDFUpload');
          setConversionState('upload');
        } finally {
          setIsInitializing(false);
        }
      }
    };

    checkPendingUpload();
    
    // Cleanup event listener
    return () => {
      window.removeEventListener('showWelcomePopup', handleShowPopup);
    };
  }, []);

  return (
    <div className="relative min-h-dvh" style={{ color: 'var(--text-primary)' }}>
      {/* Welcome Popup */}
      <InfoPopup
        isOpen={showWelcomePopup}
        onClose={() => setShowWelcomePopup(false)}
        mediaSrc="/Placeholder Video.mp4"
        mediaAlt="Customizing Reviews"
        description="Use the scorecard on the left to define specific evaluation criteria for your paper. Upload your PDF on the right to begin the review process."
        buttonText="Ready"
        isVideo={true}
      />
      {/* Background Image */}
      <img 
        src="/landing-bg.jpg" 
        alt="Background" 
        className="absolute inset-0 -z-10 h-full w-full object-cover" 
      />
      
      {/* Header Gradient Overlay - only for header area */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-56 -z-0 bg-gradient-to-b from-[var(--overlay-strong)] via-[var(--overlay-mid)] to-transparent" />
      
      <Header 
        buttonText="Need Help?" 
        buttonHref="#" 
        title="Configure Your Review"
        showTitleHelpIcon={false}
        onButtonClick={() => window.dispatchEvent(new CustomEvent('showWelcomePopup'))}
      />
      
      <main className="relative z-10 mx-auto max-w-7xl px-8 pt-32 pb-16 h-screen overflow-hidden">

        {/* Two Column Layout: Scorecards (left) + PDF (right) */}
        <div className="grid h-[calc(100vh-180px)] gap-4" style={{ gridTemplateColumns: '420px 1fr' }}>
          {/* Scorecards Column */}
          <ScorecardsPanel
            items={scorecardItems as ScorecardPanelItem[]}
            onAdd={addScorecardItem}
            onRemove={removeScorecardItem}
            onToggleEdit={toggleScorecardEditing}
            onUpdate={updateScorecardItem}
            onToggleNumeric={toggleScorecardNumeric}
          />

          {/* PDF Upload/Preview */}
          <PdfPanel
            fileName={fileName}
            conversionState={conversionState}
            isEditingMarkdown={isEditingMarkdown}
            markdownContent={markdownContent}
            isInitializing={isInitializing}
            loadingMessage={loadingMessage}
            errorMessage={errorMessage}
            onToggleMarkdownEdit={() => setIsEditingMarkdown(!isEditingMarkdown)}
            onUploadNew={handleUploadNew}
            onUploadInputChange={handleUploadInputChange}
            uploadInputRef={uploadInputRef}
            onPdfSelect={handlePdfSelect}
            onConfirmUpload={handleConfirmUpload}
            onMarkdownChange={(value) => setMarkdownContent(value)}
            hasUnsavedEdits={hasUnsavedMarkdown}
            anyScorecardEditing={anyScorecardEditing}
            onBeginReview={handleBeginReview}
            onRetry={handleRetry}
          />
        </div>
      </main>
      {showUnsavedWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0,0,0,0.20)' }} />
          <div className="relative mx-4 rounded-lg border shadow-[0_12px_36px_rgba(0,0,0,0.18)] px-4 py-3 flex items-center gap-3" style={{ backgroundColor: 'var(--error-red-bg)', borderColor: 'var(--error-red)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--error-red)' }}>
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="13" />
              <line x1="12" y1="16" x2="12" y2="16" />
            </svg>
            <span className="text-sm" style={{ color: 'var(--error-red)' }}>Please save your changes before continuing!</span>
            <button onClick={handleCloseWarning} className="ml-2 p-1 rounded-full hover:bg-gray-100 cursor-pointer" title="Close" aria-label="Close">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--gray-600)' }}>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


