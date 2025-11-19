/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useCallback, useState, useEffect } from 'react';
import { ArrowUpTrayIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';

interface InputAreaProps {
  onGenerate: (prompt: string, file?: File) => void;
  isGenerating: boolean;
  disabled?: boolean;
}

const CyclingText = () => {
    const words = [
        "a napkin sketch",
        "a grilled cheese recipe",
        "a unicorn sanctuary",
        "a disco floor plan",
        "a retro synthesizer",
        "a messy desk photo"
    ];
    const [index, setIndex] = useState(0);
    const [fade, setFade] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setFade(false); // fade out
            setTimeout(() => {
                setIndex(prev => (prev + 1) % words.length);
                setFade(true); // fade in
            }, 500); // Wait for fade out
        }, 3000); // Slower cycle to read longer text
        return () => clearInterval(interval);
    }, [words.length]);

    return (
        <span className={`inline-block whitespace-nowrap transition-all duration-500 transform ${fade ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-90'} text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-500 font-black pb-1 border-b-4 border-purple-500/50`}>
            {words[index]}
        </span>
    );
};

export const InputArea: React.FC<InputAreaProps> = ({ onGenerate, isGenerating, disabled = false }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file: File) => {
    if (file.type.startsWith('image/') || file.type === 'application/pdf') {
      onGenerate("", file);
    } else {
      alert("Please upload an image or PDF.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        handleFile(e.target.files[0]);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled || isGenerating) return;
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [disabled, isGenerating]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    if (!disabled && !isGenerating) {
        setIsDragging(true);
    }
  }, [disabled, isGenerating]);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto perspective-1000">
      <div 
        className={`relative group transition-all duration-300 ${isDragging ? 'scale-[1.02] rotate-1' : ''}`}
      >
        <label
          className={`
            relative flex flex-col items-center justify-center
            h-64 sm:h-72 md:h-[24rem]
            bg-[#130722]/80 
            backdrop-blur-md
            rounded-3xl border-2 border-dashed
            cursor-pointer overflow-hidden
            transition-all duration-300
            ${isDragging 
              ? 'border-pink-500 bg-[#2a1145] shadow-[0_0_40px_rgba(236,72,153,0.4)]' 
              : 'border-purple-700 hover:border-pink-500 hover:bg-[#1c0b33] hover:shadow-[0_0_20px_rgba(168,85,247,0.2)]'
            }
            ${isGenerating ? 'pointer-events-none grayscale' : ''}
          `}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
            {/* Funky Background Pattern */}
            <div className="absolute inset-0 opacity-[0.07] pointer-events-none" 
                 style={{
                    backgroundImage: 'linear-gradient(45deg, #ff69b4 25%, transparent 25%, transparent 75%, #ff69b4 75%, #ff69b4), linear-gradient(45deg, #ff69b4 25%, transparent 25%, transparent 75%, #ff69b4 75%, #ff69b4)',
                    backgroundSize: '40px 40px',
                    backgroundPosition: '0 0, 20px 20px'
                 }}>
            </div>
            
            {/* Decorative corners */}
            <div className={`absolute top-6 left-6 w-3 h-3 bg-cyan-400 rounded-full shadow-[0_0_10px_#22d3ee] transition-all duration-300 ${isDragging ? 'scale-150' : ''}`}></div>
            <div className={`absolute top-6 right-6 w-3 h-3 bg-pink-500 rounded-full shadow-[0_0_10px_#ec4899] transition-all duration-300 ${isDragging ? 'scale-150' : ''}`}></div>
            <div className={`absolute bottom-6 left-6 w-3 h-3 bg-yellow-400 rounded-full shadow-[0_0_10px_#facc15] transition-all duration-300 ${isDragging ? 'scale-150' : ''}`}></div>
            <div className={`absolute bottom-6 right-6 w-3 h-3 bg-purple-500 rounded-full shadow-[0_0_10px_#a855f7] transition-all duration-300 ${isDragging ? 'scale-150' : ''}`}></div>

            <div className="relative z-10 flex flex-col items-center text-center space-y-6 md:space-y-8 p-6 md:p-8 w-full">
                <div className={`relative w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center transition-transform duration-500 ${isDragging ? 'scale-125 rotate-12' : 'group-hover:-translate-y-2'}`}>
                    <div className={`absolute inset-0 rounded-full bg-gradient-to-tr from-pink-600 to-purple-600 blur-lg opacity-70 ${isGenerating ? 'animate-pulse' : ''}`}></div>
                    <div className="absolute inset-0 rounded-full bg-zinc-900/90 border border-white/10 flex items-center justify-center z-10">
                        {isGenerating ? (
                            <SparklesIcon className="w-10 h-10 md:w-12 md:h-12 text-yellow-400 animate-spin-slow" />
                        ) : (
                            <ArrowUpTrayIcon className={`w-10 h-10 md:w-12 md:h-12 text-white transition-all duration-300 ${isDragging ? '-translate-y-1 text-pink-400' : ''}`} />
                        )}
                    </div>
                </div>

                <div className="space-y-2 md:space-y-4 w-full max-w-3xl">
                    <h3 className="flex flex-col items-center justify-center text-xl sm:text-3xl md:text-5xl text-white leading-none font-bold tracking-tight gap-4">
                        <span>Transform</span>
                        {/* Fixed height container to prevent layout shifts */}
                        <div className="h-10 sm:h-12 md:h-16 flex items-center justify-center w-full">
                           <CyclingText />
                        </div>
                        <span>into magic.</span>
                    </h3>
                    <p className="text-pink-200/60 text-sm sm:text-lg font-medium tracking-wide max-w-lg mx-auto">
                        <span className="hidden md:inline">Drag & drop your messy ideas.</span>
                        <span className="md:hidden">Tap to upload.</span> We'll add the disco ball.
                    </p>
                </div>
            </div>

            <input
                type="file"
                accept="image/*,application/pdf"
                className="hidden"
                onChange={handleFileChange}
                disabled={isGenerating || disabled}
            />
        </label>
      </div>
    </div>
  );
};