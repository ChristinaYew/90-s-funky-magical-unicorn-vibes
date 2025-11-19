/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useEffect, useState, useRef } from 'react';
import { ArrowDownTrayIcon, PlusIcon, ViewColumnsIcon, DocumentIcon, CodeBracketIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Creation } from './CreationHistory';

interface LivePreviewProps {
  creation: Creation | null;
  isLoading: boolean;
  isFocused: boolean;
  onReset: () => void;
}

// Add type definition for the global pdfjsLib
declare global {
  interface Window {
    pdfjsLib: any;
  }
}

const LoadingStep = ({ text, active, completed }: { text: string, active: boolean, completed: boolean }) => (
    <div className={`flex items-center space-x-3 transition-all duration-500 ${active || completed ? 'opacity-100 translate-x-0' : 'opacity-30 translate-x-4'}`}>
        <div className={`w-5 h-5 flex items-center justify-center rounded-full border ${completed ? 'border-green-500 bg-green-500/20 text-green-400' : active ? 'border-pink-500 bg-pink-500/20 text-pink-400' : 'border-zinc-700 text-zinc-700'}`}>
            {completed ? (
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
            ) : active ? (
                <div className="w-2 h-2 bg-pink-500 rounded-full animate-ping"></div>
            ) : (
                <div className="w-1.5 h-1.5 bg-zinc-700 rounded-full"></div>
            )}
        </div>
        <span className={`font-mono text-xs tracking-wide uppercase ${active ? 'text-pink-200 font-bold' : completed ? 'text-green-400/50 line-through' : 'text-zinc-600'}`}>{text}</span>
    </div>
  );

const PdfRenderer = ({ dataUrl }: { dataUrl: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const renderPdf = async () => {
      if (!window.pdfjsLib) {
        setError("PDF library not initialized");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Load the document
        const loadingTask = window.pdfjsLib.getDocument(dataUrl);
        const pdf = await loadingTask.promise;
        
        // Get the first page
        const page = await pdf.getPage(1);
        
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext('2d');
        
        // Calculate scale to make it look good (High DPI)
        const viewport = page.getViewport({ scale: 2.0 });

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        await page.render(renderContext).promise;
        setLoading(false);
      } catch (err) {
        console.error("Error rendering PDF:", err);
        setError("Could not render PDF preview.");
        setLoading(false);
      }
    };

    renderPdf();
  }, [dataUrl]);

  if (error) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-zinc-500 p-6 text-center">
            <DocumentIcon className="w-12 h-12 mb-3 opacity-50 text-red-400" />
            <p className="text-sm mb-2 text-red-400/80">{error}</p>
        </div>
    );
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center">
        {loading && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="w-8 h-8 border-4 border-pink-500/30 border-t-pink-500 rounded-full animate-spin"></div>
            </div>
        )}
        <canvas 
            ref={canvasRef} 
            className={`max-w-full max-h-full object-contain shadow-2xl border border-pink-500/20 rounded-lg transition-opacity duration-500 ${loading ? 'opacity-0' : 'opacity-100'}`}
        />
    </div>
  );
};

export const LivePreview: React.FC<LivePreviewProps> = ({ creation, isLoading, isFocused, onReset }) => {
    const [loadingStep, setLoadingStep] = useState(0);
    const [showSplitView, setShowSplitView] = useState(false);

    // Handle loading animation steps
    useEffect(() => {
        if (isLoading) {
            setLoadingStep(0);
            const interval = setInterval(() => {
                setLoadingStep(prev => (prev < 3 ? prev + 1 : prev));
            }, 2000); 
            return () => clearInterval(interval);
        } else {
            setLoadingStep(0);
        }
    }, [isLoading]);

    // Default to Split View when a new creation with an image is loaded
    useEffect(() => {
        if (creation?.originalImage) {
            setShowSplitView(true);
        } else {
            setShowSplitView(false);
        }
    }, [creation]);

    const handleExport = () => {
        if (!creation) return;
        const dataStr = JSON.stringify(creation, null, 2);
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${creation.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_artifact.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

  return (
    <div
      className={`
        fixed z-40 flex flex-col
        rounded-2xl overflow-hidden border-2 border-pink-500/30 bg-[#0f0518] shadow-[0_0_50px_rgba(0,0,0,0.5)]
        transition-all duration-700 cubic-bezier(0.2, 0.8, 0.2, 1)
        ${isFocused
          ? 'inset-2 md:inset-4 opacity-100 scale-100'
          : 'top-1/2 left-1/2 w-[90%] h-[60%] -translate-x-1/2 -translate-y-1/2 opacity-0 scale-95 pointer-events-none'
        }
      `}
    >
      {/* Funky Header */}
      <div className="bg-gradient-to-r from-[#1a0b2e] to-[#2d1b4e] px-4 py-3 flex items-center justify-between border-b border-pink-500/20 shrink-0">
        {/* Left: Controls */}
        <div className="flex items-center space-x-3 w-32">
           <div className="flex space-x-2 group/controls">
                <button 
                  onClick={onReset}
                  className="w-3.5 h-3.5 rounded-full bg-zinc-700 group-hover/controls:bg-red-500 hover:!bg-red-600 transition-colors flex items-center justify-center focus:outline-none"
                  title="Close Preview"
                >
                  <XMarkIcon className="w-2.5 h-2.5 text-black opacity-0 group-hover/controls:opacity-100" />
                </button>
                <div className="w-3.5 h-3.5 rounded-full bg-zinc-700 group-hover/controls:bg-yellow-400 transition-colors"></div>
                <div className="w-3.5 h-3.5 rounded-full bg-zinc-700 group-hover/controls:bg-green-400 transition-colors"></div>
           </div>
        </div>
        
        {/* Center: Title */}
        <div className="flex items-center space-x-2 text-pink-300">
            <span className="text-[12px] font-bold uppercase tracking-widest drop-shadow-md">
                {isLoading ? '✨ Summoning Magic...' : creation ? creation.name : 'Preview Mode'}
            </span>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center justify-end space-x-1 w-32">
            {!isLoading && creation && (
                <>
                    {creation.originalImage && (
                         <button 
                            onClick={() => setShowSplitView(!showSplitView)}
                            title={showSplitView ? "Show App Only" : "Compare with Original"}
                            className={`p-1.5 rounded-md transition-all ${showSplitView ? 'bg-pink-500 text-white' : 'text-pink-400 hover:text-white hover:bg-pink-500/20'}`}
                        >
                            <ViewColumnsIcon className="w-4 h-4" />
                        </button>
                    )}

                    <button 
                        onClick={handleExport}
                        title="Export Artifact (JSON)"
                        className="text-cyan-400 hover:text-white transition-colors p-1.5 rounded-md hover:bg-cyan-500/20"
                    >
                        <ArrowDownTrayIcon className="w-4 h-4" />
                    </button>

                    <button 
                        onClick={onReset}
                        title="New Upload"
                        className="ml-2 flex items-center space-x-1 text-xs font-bold bg-white text-black hover:bg-pink-100 px-3 py-1.5 rounded-full transition-colors"
                    >
                        <PlusIcon className="w-3 h-3" />
                        <span className="hidden sm:inline">New</span>
                    </button>
                </>
            )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative w-full flex-1 bg-[#0c0512] flex overflow-hidden">
        {isLoading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 w-full">
             {/* Magical Loading State */}
             <div className="w-full max-w-md space-y-8 relative">
                <div className="flex flex-col items-center">
                    <div className="relative w-16 h-16 mb-6">
                         <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-pink-500 border-l-purple-500 animate-spin"></div>
                         <div className="absolute inset-2 rounded-full border-4 border-transparent border-b-cyan-400 border-r-yellow-400 animate-spin-slow"></div>
                         <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-2xl animate-bounce">🦄</span>
                         </div>
                    </div>
                    <h3 className="text-white font-bold text-xl tracking-tight text-center">Consulting the Oracle</h3>
                    <p className="text-pink-400/60 text-sm mt-2 text-center">Interpreting your vibes...</p>
                </div>

                {/* Rainbow Progress Bar */}
                <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 animate-[loading_2s_ease-in-out_infinite] w-full translate-x-[-100%]"></div>
                </div>

                 {/* Fun Steps */}
                 <div className="border border-pink-500/20 bg-[#1a0b2e]/80 rounded-xl p-6 space-y-4 backdrop-blur-lg shadow-xl">
                     <LoadingStep text="Melting the cheese..." active={loadingStep === 0} completed={loadingStep > 0} />
                     <LoadingStep text="Applying glitter filters..." active={loadingStep === 1} completed={loadingStep > 1} />
                     <LoadingStep text="Summoning HTML unicorns..." active={loadingStep === 2} completed={loadingStep > 2} />
                     <LoadingStep text="Polishing pixels..." active={loadingStep === 3} completed={loadingStep > 3} />
                 </div>
             </div>
          </div>
        ) : creation?.html ? (
          <>
            {/* Split View: Left Panel (Original Image) */}
            {showSplitView && creation.originalImage && (
                <div className="w-full md:w-1/2 h-1/2 md:h-full border-b md:border-b-0 md:border-r border-pink-900/30 bg-[#150824] relative flex flex-col shrink-0">
                    <div className="absolute top-4 left-4 z-10 bg-black/60 backdrop-blur text-pink-300 text-[10px] font-bold uppercase px-2 py-1 rounded border border-pink-500/30 shadow-lg">
                        Original Input
                    </div>
                    <div className="w-full h-full p-6 flex items-center justify-center overflow-hidden">
                        {creation.originalImage.startsWith('data:application/pdf') ? (
                            <PdfRenderer dataUrl={creation.originalImage} />
                        ) : (
                            <img 
                                src={creation.originalImage} 
                                alt="Original Input" 
                                className="max-w-full max-h-full object-contain shadow-2xl border-2 border-white/10 rounded-lg rotate-1"
                            />
                        )}
                    </div>
                </div>
            )}

            {/* App Preview Panel */}
            <div className={`relative h-full bg-white transition-all duration-500 ${showSplitView && creation.originalImage ? 'w-full md:w-1/2 h-1/2 md:h-full' : 'w-full'}`}>
                 <iframe
                    title="Gemini Live Preview"
                    srcDoc={creation.html}
                    className="w-full h-full"
                    sandbox="allow-scripts allow-forms allow-popups allow-modals allow-same-origin"
                />
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};