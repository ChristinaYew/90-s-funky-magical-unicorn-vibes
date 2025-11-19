/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useCallback, useState, useEffect } from 'react';
import { ArrowUpTrayIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { speakGroovy, playDiscoSound } from '../services/audio';

interface InputAreaProps {
  onGenerate: (prompt: string, file?: File) => void;
  isGenerating: boolean;
  disabled?: boolean;
}

const CyclingText = () => {
    const words = [
        "a grilled cheese recipe",
        "a unicorn manifesto",
        "a messy napkin sketch",
        "a 90s rave flyer",
        "your cat's photo"
    ];
    const [index, setIndex] = useState(0);
    const [fade, setFade] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setFade(false); // fade out
            setTimeout(() => {
                setIndex(prev => (prev + 1) % words.length);
                setFade(true); // fade in
            }, 500);
        }, 3000);
        return () => clearInterval(interval);
    }, [words.length]);

    return (
        <span className={`inline-block whitespace-nowrap transition-all duration-500 transform ${fade ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-90'} text-yellow-400 font-black pb-1 border-b-4 border-pink-500 ml-2`}>
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
      playDiscoSound('error');
      speakGroovy("Whoops! Images or PDFs only, cool cat.");
      alert("Please upload an image or PDF.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        playDiscoSound('click');
        speakGroovy("Oh yeah, let's go baby boy!");
        handleFile(e.target.files[0]);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled || isGenerating) return;
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        playDiscoSound('success');
        speakGroovy("Oh yeah, let's go baby boy!");
        handleFile(e.dataTransfer.files[0]);
    }
  }, [disabled, isGenerating]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    if (!disabled && !isGenerating) {
        setIsDragging(true);
        // Throttle sound playing here if we wanted a hover effect, but pure CSS is safer for dragover
    }
  }, [disabled, isGenerating]);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto perspective-1000 px-4">
      <div 
        className={`relative group transition-all duration-300 ${isDragging ? 'scale-[1.02] rotate-1' : ''}`}
        onMouseEnter={() => playDiscoSound('hover')}
      >
        {/* Decorative Glow Background */}
        <div className={`absolute -inset-1 bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-600 rounded-[2.5rem] blur opacity-40 group-hover:opacity-75 transition duration-1000 group-hover:duration-200 ${isDragging ? 'opacity-100 animate-pulse' : ''}`}></div>

        <label
          className={`
            relative flex flex-col items-center justify-center
            h-72 md:h-[26rem]
            bg-[#130722] 
            rounded-[2rem] border-4 border-dashed
            cursor-pointer overflow-hidden
            transition-all duration-300
            ${isDragging 
              ? 'border-yellow-400 bg-[#2a1145]' 
              : 'border-purple-500/50 hover:border-pink-500 hover:bg-[#1c0b33]'
            }
            ${isGenerating ? 'pointer-events-none grayscale' : ''}
          `}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => playDiscoSound('click')}
        >
            {/* Funky Background Pattern */}
            <div className="absolute inset-0 opacity-[0.1] pointer-events-none" 
                 style={{
                    backgroundImage: 'radial-gradient(circle, #ff69b4 2px, transparent 2.5px)',
                    backgroundSize: '24px 24px',
                 }}>
            </div>
            
            {/* Decorative corners - 90s Style */}
            <div className={`absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-cyan-400 rounded-tl-3xl transition-all ${isDragging ? 'translate-x-2 translate-y-2' : ''}`}></div>
            <div className={`absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-pink-500 rounded-tr-3xl transition-all ${isDragging ? '-translate-x-2 translate-y-2' : ''}`}></div>
            <div className={`absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-yellow-400 rounded-bl-3xl transition-all ${isDragging ? 'translate-x-2 -translate-y-2' : ''}`}></div>
            <div className={`absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-purple-500 rounded-br-3xl transition-all ${isDragging ? '-translate-x-2 -translate-y-2' : ''}`}></div>

            <div className="relative z-10 flex flex-col items-center text-center space-y-8 p-8 w-full">
                <div className={`relative w-24 h-24 md:w-32 md:h-32 rounded-full flex items-center justify-center transition-transform duration-500 ${isDragging ? 'scale-110 rotate-12' : 'group-hover:scale-105'}`}>
                    <div className={`absolute inset-0 rounded-full bg-gradient-to-tr from-pink-500 to-yellow-500 blur-lg opacity-50 ${isGenerating ? 'animate-spin' : ''}`}></div>
                    <div className="absolute inset-0 rounded-full bg-[#0f0518] border-2 border-white/20 flex items-center justify-center z-10 overflow-hidden">
                        {isGenerating ? (
                            <SparklesIcon className="w-12 h-12 text-yellow-400 animate-bounce" />
                        ) : (
                            <ArrowUpTrayIcon className={`w-12 h-12 text-white transition-all duration-300 ${isDragging ? '-translate-y-2 text-cyan-400' : ''}`} />
                        )}
                        
                        {/* Equalizer Bars Effect */}
                        {!isGenerating && (
                            <div className="absolute bottom-4 flex space-x-1 h-8 items-end opacity-50">
                                <div className="w-1 bg-pink-500 animate-[bounce_1s_infinite] h-4"></div>
                                <div className="w-1 bg-cyan-500 animate-[bounce_1.2s_infinite] h-6"></div>
                                <div className="w-1 bg-yellow-500 animate-[bounce_0.8s_infinite] h-3"></div>
                                <div className="w-1 bg-purple-500 animate-[bounce_1.1s_infinite] h-5"></div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-4 w-full max-w-3xl">
                    <h3 className="text-2xl sm:text-4xl md:text-5xl text-white font-display tracking-tight">
                        Dunk <CyclingText />
                    </h3>
                    <p className="text-pink-300 text-lg font-medium tracking-wide max-w-lg mx-auto">
                        Drop your files like it's 1999. <br/>
                        <span className="text-white/60 text-sm">(PDFs & Images accepted by the Mafia)</span>
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
