/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useEffect, useState, useRef } from 'react';
import { ArrowDownTrayIcon, PlusIcon, ViewColumnsIcon, DocumentIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Creation } from './CreationHistory';
import { playDiscoSound, speakGroovy } from '../services/audio';

interface LivePreviewProps {
  creation: Creation | null;
  isLoading: boolean;
  isFocused: boolean;
  onReset: () => void;
}

declare global {
  interface Window {
    pdfjsLib: any;
  }
}

const LoadingStep = ({ text, active, completed }: { text: string, active: boolean, completed: boolean }) => (
    <div className={`flex items-center space-x-3 transition-all duration-500 ${active || completed ? 'opacity-100 translate-x-0' : 'opacity-30 translate-x-4'}`}>
        <div className={`w-6 h-6 flex items-center justify-center rounded-full border-2 ${completed ? 'border-green-400 bg-green-400/20 text-green-400' : active ? 'border-pink-500 bg-pink-500/20 text-pink-400' : 'border-zinc-700 text-zinc-700'}`}>
            {completed ? (
                <span className="text-xs">✓</span>
            ) : active ? (
                <div className="w-2 h-2 bg-pink-500 rounded-full animate-ping"></div>
            ) : (
                <div className="w-1.5 h-1.5 bg-zinc-700 rounded-full"></div>
            )}
        </div>
        <span className={`font-display text-sm tracking-wider ${active ? 'text-pink-300' : completed ? 'text-green-400/70' : 'text-zinc-600'}`}>{text}</span>
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
        const loadingTask = window.pdfjsLib.getDocument(dataUrl);
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(1);
        const canvas = canvasRef.current;
        if (!canvas) return;
        const context = canvas.getContext('2d');
        const viewport = page.getViewport({ scale: 2.0 });
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        const renderContext = { canvasContext: context, viewport: viewport };
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

  if (error) return <div className="text-red-400 p-6 text-center">{error}</div>;

  return (
    <div className="relative w-full h-full flex items-center justify-center">
        {loading && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="w-8 h-8 border-4 border-pink-500/30 border-t-pink-500 rounded-full animate-spin"></div>
            </div>
        )}
        <canvas ref={canvasRef} className="max-w-full max-h-full object-contain shadow-2xl border-2 border-white/10 rounded-lg" />
    </div>
  );
};

export const LivePreview: React.FC<LivePreviewProps> = ({ creation, isLoading, isFocused, onReset }) => {
    const [loadingStep, setLoadingStep] = useState(0);
    const [showSplitView, setShowSplitView] = useState(false);

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

    useEffect(() => {
        if (creation?.originalImage) {
            setShowSplitView(true);
        } else {
            setShowSplitView(false);
        }
    }, [creation]);

    const handleExport = () => {
        if (!creation) return;
        playDiscoSound('success');
        speakGroovy("Take it to the bank!");
        const dataStr = JSON.stringify(creation, null, 2);
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${creation.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_disco.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleResetInternal = () => {
        playDiscoSound('click');
        speakGroovy("Next order!");
        onReset();
    };

    const handleToggleSplit = () => {
        playDiscoSound('click');
        setShowSplitView(!showSplitView);
    };

  return (
    <div
      className={`
        fixed z-40 flex flex-col
        rounded-2xl overflow-hidden border-4 border-pink-500 bg-[#0f0518] shadow-[0_0_100px_rgba(236,72,153,0.4)]
        transition-all duration-700 cubic-bezier(0.2, 0.8, 0.2, 1)
        ${isFocused
          ? 'inset-2 md:inset-6 opacity-100 scale-100'
          : 'top-1/2 left-1/2 w-[90%] h-[60%] -translate-x-1/2 -translate-y-1/2 opacity-0 scale-95 pointer-events-none'
        }
      `}
    >
      {/* Disco Header */}
      <div className="bg-gradient-to-r from-purple-900 to-pink-900 px-4 py-3 flex items-center justify-between border-b-2 border-pink-500 shrink-0">
        <div className="flex items-center space-x-3 w-32">
           <div className="flex space-x-2 group/controls" onMouseEnter={() => playDiscoSound('hover')}>
                <button onClick={handleResetInternal} className="w-4 h-4 rounded-full bg-zinc-800 hover:bg-red-500 transition-colors flex items-center justify-center">
                  <XMarkIcon className="w-3 h-3 text-white" />
                </button>
                <div className="w-4 h-4 rounded-full bg-zinc-800 hover:bg-yellow-400 transition-colors"></div>
                <div className="w-4 h-4 rounded-full bg-zinc-800 hover:bg-green-400 transition-colors"></div>
           </div>
        </div>
        
        <div className="flex items-center justify-center text-pink-200 font-display tracking-widest text-sm md:text-lg uppercase">
            {isLoading ? '🦄 Casting Spells...' : creation ? creation.name : 'Waiting for Input'}
        </div>

        <div className="flex items-center justify-end space-x-2 w-32">
            {!isLoading && creation && (
                <>
                    {creation.originalImage && (
                         <button onClick={handleToggleSplit} onMouseEnter={() => playDiscoSound('hover')} className={`p-2 rounded-lg transition-all ${showSplitView ? 'bg-pink-500 text-white' : 'text-pink-400 hover:bg-pink-900'}`}>
                            <ViewColumnsIcon className="w-5 h-5" />
                        </button>
                    )}
                    <button onClick={handleExport} onMouseEnter={() => playDiscoSound('hover')} className="text-cyan-400 hover:bg-cyan-900/50 p-2 rounded-lg transition-colors">
                        <ArrowDownTrayIcon className="w-5 h-5" />
                    </button>
                    <button onClick={handleResetInternal} onMouseEnter={() => playDiscoSound('hover')} className="ml-2 flex items-center space-x-1 text-xs font-bold bg-white text-black hover:bg-yellow-300 px-4 py-2 rounded-full transition-colors uppercase">
                        <PlusIcon className="w-4 h-4" />
                        <span className="hidden sm:inline">New</span>
                    </button>
                </>
            )}
        </div>
      </div>

      {/* Main Stage */}
      <div className="relative w-full flex-1 bg-[#130722] flex overflow-hidden">
        {isLoading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 w-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]">
             <div className="w-full max-w-md space-y-8 relative z-10">
                <div className="flex flex-col items-center">
                    <div className="text-6xl animate-bounce mb-4">🦄</div>
                    <h3 className="text-white font-display text-2xl tracking-tight text-center text-glow">Consulting the Unicorn Oracle</h3>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-4 bg-zinc-900 rounded-full overflow-hidden border-2 border-white/20">
                    <div className="h-full bg-gradient-to-r from-pink-500 via-yellow-400 to-cyan-500 animate-[loading_2s_ease-in-out_infinite] w-full translate-x-[-100%]"></div>
                </div>

                 <div className="bg-black/40 rounded-xl p-8 space-y-4 backdrop-blur-md border border-pink-500/30">
                     <LoadingStep text="Heating up the grill..." active={loadingStep === 0} completed={loadingStep > 0} />
                     <LoadingStep text="Sprinkling magic dust..." active={loadingStep === 1} completed={loadingStep > 1} />
                     <LoadingStep text="Teaching pixels to dance..." active={loadingStep === 2} completed={loadingStep > 2} />
                     <LoadingStep text="Finalizing the vibe..." active={loadingStep === 3} completed={loadingStep > 3} />
                 </div>
             </div>
          </div>
        ) : creation?.html ? (
          <>
            {showSplitView && creation.originalImage && (
                <div className="w-full md:w-1/2 h-1/2 md:h-full border-b md:border-b-0 md:border-r-2 border-pink-900 bg-[#0f0518] relative flex flex-col shrink-0">
                    <div className="absolute top-4 left-4 z-10 bg-pink-500 text-white text-[10px] font-bold uppercase px-3 py-1 rounded-full shadow-lg">
                        Input
                    </div>
                    <div className="w-full h-full p-8 flex items-center justify-center overflow-hidden">
                        {creation.originalImage.startsWith('data:application/pdf') ? (
                            <PdfRenderer dataUrl={creation.originalImage} />
                        ) : (
                            <img src={creation.originalImage} alt="Input" className="max-w-full max-h-full object-contain shadow-[0_0_30px_rgba(255,255,255,0.1)] border-4 border-white rounded-xl rotate-[-2deg]" />
                        )}
                    </div>
                </div>
            )}
            <div className={`relative h-full bg-white transition-all duration-500 ${showSplitView && creation.originalImage ? 'w-full md:w-1/2 h-1/2 md:h-full' : 'w-full'}`}>
                 <iframe title="Preview" srcDoc={creation.html} className="w-full h-full" sandbox="allow-scripts allow-forms allow-popups allow-modals allow-same-origin" />
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};
