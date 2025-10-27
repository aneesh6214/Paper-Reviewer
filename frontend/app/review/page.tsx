"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { marked } from "marked";
import Header from "../../components/header";
import PDFDragDrop from "../../components/pdf-drag-drop";
import InfoPopup from "../../components/info-popup";

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
}

type ConversionState = 'upload' | 'loading' | 'success' | 'error';

export default function ReviewPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [conversionState, setConversionState] = useState<ConversionState>('upload');
  const [isInitializing, setIsInitializing] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
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
      content: "Evaluate the logical flow and consistency of arguments throughout the paper. Consider whether ideas connect smoothly and support the main thesis." 
    },
    { 
      id: "readability", 
      title: "Readability", 
      content: "Assess the clarity of writing, sentence structure, and overall accessibility to the target audience. Note any areas that may be difficult to follow." 
    },
    { 
      id: "methodology", 
      title: "Methodology", 
      content: "Review the research methods, experimental design, and analytical approaches. Evaluate whether the methods are appropriate for the research questions." 
    },
  ]);

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
    } catch (error) {
      console.error('Conversion error:', error);
      setErrorMessage(`Network error: ${error.message}. Please ensure the backend server is running on port 8000.`);
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
      content: "" 
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
      
      <Header buttonText="Begin Review" buttonHref="#" title="Configure Your Review" />
      
      <main className="relative z-10 mx-auto max-w-7xl px-8 pt-32 pb-16 h-screen overflow-hidden">

        {/* Two Column Layout - 35/65 ratio */}
        <div className="grid gap-6 h-[calc(100vh-180px)]" style={{ gridTemplateColumns: '35fr 65fr' }}>
          {/* Left Column - Scorecard */}
          <div className="bg-white/80 backdrop-blur-sm rounded-lg overflow-hidden flex flex-col">
            {/* Header with Add Button */}
            <div className="bg-white/90 backdrop-blur-sm p-4 border-b" style={{ borderColor: 'var(--gray-200)' }}>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-[color:var(--text-primary)]">Scorecard</h2>
                <button
                  onClick={addScorecardItem}
                  className="cursor-pointer outline-none"
                  title="Add New"
                >
                  <svg
                    className="transition-all duration-200"
                    style={{ 
                      stroke: 'var(--gray-400)',
                      fill: 'none'
                    }}
                    viewBox="0 0 24 24"
                    height="24px"
                    width="24px"
                    xmlns="http://www.w3.org/2000/svg"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.stroke = 'var(--gray-600)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.stroke = 'var(--gray-400)';
                    }}
                  >
                    <path
                      strokeWidth="1.5"
                      d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"
                    />
                    <path strokeWidth="1.5" d="M8 12H16"/>
                    <path strokeWidth="1.5" d="M12 16V8"/>
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {scorecardItems.map((item) => (
                <div key={item.id} className="bg-white border border-[color:var(--ring-black-10)] rounded-lg overflow-hidden">
                  {/* Card Header */}
                  <div className="flex items-center justify-between p-3 border-b border-[color:var(--ring-black-10)]">
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => updateScorecardItem(item.id, 'title', e.target.value)}
                      placeholder="Enter criterion name..."
                      className="font-medium bg-transparent border-none outline-none text-[color:var(--text-primary)] flex-1 cursor-text rounded px-2 transition-colors"
                      style={{
                        ':hover': { backgroundColor: 'var(--gray-50)' },
                        ':focus': { backgroundColor: 'var(--gray-50)' }
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--gray-100)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      onFocus={(e) => e.currentTarget.style.backgroundColor = 'var(--gray-100)'}
                      onBlur={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    />
                    <button
                      onClick={() => removeScorecardItem(item.id)}
                      className="cursor-pointer outline-none ml-2"
                      style={{ transform: 'rotate(45deg)' }}
                      title="Remove"
                    >
                      <svg
                        className="transition-all duration-200"
                        style={{ 
                          stroke: 'var(--gray-400)',
                          fill: 'none'
                        }}
                        viewBox="0 0 24 24"
                        height="22px"
                        width="22px"
                        xmlns="http://www.w3.org/2000/svg"
                        onMouseEnter={(e) => {
                          e.currentTarget.style.stroke = 'var(--gray-600)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.stroke = 'var(--gray-400)';
                        }}
                      >
                        <path
                          strokeWidth="1.5"
                          d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"
                        />
                        <path strokeWidth="1.5" d="M8 12H16"/>
                        <path strokeWidth="1.5" d="M12 16V8"/>
                      </svg>
                    </button>
                  </div>
                  
                  {/* Card Content */}
                  <div className="p-3 bg-white rounded-b-lg">
                    <textarea
                      value={item.content}
                      onChange={(e) => updateScorecardItem(item.id, 'content', e.target.value)}
                      placeholder="Enter specific instructions for scoring this category..."
                      className="w-full min-h-[80px] resize-none border-none outline-none text-sm text-[color:var(--text-primary)] bg-white cursor-text rounded p-2 transition-colors"
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--gray-100)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                      onFocus={(e) => e.currentTarget.style.backgroundColor = 'var(--gray-100)'}
                      onBlur={(e) => e.currentTarget.style.backgroundColor = 'white'}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - PDF Upload/Preview */}
          <div className="bg-white/80 backdrop-blur-sm rounded-lg overflow-hidden flex flex-col">
            {/* PDF Header */}
            <div className="bg-white/90 backdrop-blur-sm p-4 border-b" style={{ borderColor: 'var(--gray-200)' }}>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-[color:var(--text-primary)]">
                  {fileName || "Upload PDF"}
                </h2>
                <button
                  onClick={() => conversionState === 'success' && setIsEditingMarkdown(!isEditingMarkdown)}
                  disabled={conversionState !== 'success'}
                  className={`rounded-full px-3 py-1 text-xs font-medium border transition-all duration-200 ${
                    conversionState === 'success'
                      ? isEditingMarkdown 
                        ? 'bg-blue-100 border-blue-300 text-blue-700 hover:bg-blue-200 cursor-pointer' 
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50 cursor-pointer'
                      : 'border-transparent text-transparent cursor-default pointer-events-none'
                  }`}
                  aria-hidden={conversionState !== 'success'}
                >
                  {isEditingMarkdown ? 'Save' : 'Edit'}
                </button>
              </div>
            </div>

            {/* PDF Content Area */}
            <div className="flex-1 overflow-y-auto bg-white">
              {!hasMounted ? (
                <div className="h-full flex items-center justify-center p-4">
                  <div className="w-full max-w-md h-64">
                    <div className="h-full border-2 border-dashed rounded-2xl flex items-center justify-center" style={{ borderColor: 'var(--gray-300)', backgroundColor: 'var(--bg-white-60)' }}>
                      <div className="text-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full mx-auto mb-4" style={{ backgroundColor: 'var(--gray-100)' }}>
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ color: 'var(--gray-600)' }}>
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <polyline points="7,10 12,5 17,10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <line x1="12" y1="5" x2="12" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                          </svg>
                        </div>
                        <div>
                          <p className="text-lg font-medium" style={{ color: 'var(--text-primary)' }}>Upload your PDF</p>
                          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Drag and drop or click to browse</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : isInitializing ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: 'var(--blue-600)' }}></div>
                    <div style={{ color: 'var(--gray-600)' }}>{loadingMessage}</div>
                  </div>
                </div>
              ) : conversionState === 'upload' ? (
                <div className="h-full flex items-center justify-center p-4">
                  <div className="w-full max-w-md h-64">
                    <PDFDragDrop onFileSelect={handlePdfSelect} onConvert={handleConfirmUpload} className="h-full" />
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
                    <button
                      onClick={handleRetry}
                      className="px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer"
                      style={{ 
                        backgroundColor: 'var(--gray-600)', 
                        color: 'white' 
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--gray-700)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--gray-600)'}
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              ) : (
                <div className="h-full p-4">
                  <div className="h-full border rounded-lg p-4 overflow-y-auto" style={{ borderColor: 'var(--gray-200)' }}>
                    {isEditingMarkdown ? (
                      <textarea
                        value={markdownContent}
                        onChange={(e) => setMarkdownContent(e.target.value)}
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
        </div>
      </main>
    </div>
  );
}


