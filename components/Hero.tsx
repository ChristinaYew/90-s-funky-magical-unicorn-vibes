/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useEffect, useState } from 'react';
import { LightBulbIcon, TicketIcon, CloudIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import { SparklesIcon, FireIcon, MusicalNoteIcon, HeartIcon } from '@heroicons/react/24/solid';

// Component that simulates drawing a wireframe then filling it with life
const DrawingTransformation = ({ 
  initialIcon: InitialIcon, 
  finalIcon: FinalIcon, 
  label,
  delay, 
  x, 
  y,
  rotation = 0,
  colorClass = "text-pink-500"
}: { 
  initialIcon: React.ElementType, 
  finalIcon: React.ElementType, 
  label: string,
  delay: number,
  x: string,
  y: string,
  rotation?: number,
  colorClass?: string
}) => {
  const [stage, setStage] = useState(0); // 0: Hidden, 1: Drawing, 2: Alive

  useEffect(() => {
    const cycle = () => {
      setStage(0);
      setTimeout(() => setStage(1), 500); // Start drawing
      setTimeout(() => setStage(2), 3500); // Come alive
    };

    // Initial delay
    const startTimeout = setTimeout(() => {
      cycle();
      // Repeat cycle
      const interval = setInterval(cycle, 9000);
      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(startTimeout);
  }, [delay]);

  return (
    <div 
      className="absolute transition-all duration-1000 ease-in-out z-0 pointer-events-none"
      style={{ top: y, left: x, transform: `rotate(${rotation}deg)` }}
    >
      <div className={`relative w-28 h-36 md:w-36 md:h-48 rounded-2xl backdrop-blur-md transition-all duration-1000 ${stage === 2 ? 'bg-black/60 border-2 border-yellow-400 shadow-[5px_5px_0px_#ec4899] scale-110 -translate-y-4 rotate-3' : 'bg-white/5 border-white/20 scale-100 border-2 border-dashed'}`}>
        
        {/* Label tag that appears in stage 2 */}
        <div className={`absolute -top-4 left-1/2 -translate-x-1/2 bg-cyan-400 text-black border-2 border-black text-[10px] md:text-xs font-black tracking-widest px-3 py-1 rotate-[-5deg] shadow-lg transition-all duration-500 ${stage === 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
            {label}
        </div>

        {/* Content Container */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          
          {/* Stage 1: Wireframe Drawing Effect */}
          <div className={`absolute transition-all duration-1000 ${stage === 1 ? 'opacity-100' : 'opacity-0'}`}>
             <InitialIcon className="w-12 h-12 md:w-16 md:h-16 text-zinc-600 stroke-1" />
          </div>

          {/* Stage 2: Alive/Interactive */}
          <div className={`absolute transition-all duration-700 flex flex-col items-center ${stage === 2 ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-75 blur-sm'}`}>
             <div className="relative animate-bounce-slight">
                 <div className="absolute inset-0 animate-ping opacity-40 rounded-full bg-pink-500"></div>
                 <FinalIcon className={`w-14 h-14 md:w-20 md:h-20 ${colorClass} drop-shadow-[0_4px_0_rgba(0,0,0,0.5)]`} />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Hero: React.FC = () => {
  return (
    <>
      {/* Background Transformation Elements - Fixed to Viewport */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="hidden lg:block">
            <DrawingTransformation 
            initialIcon={LightBulbIcon} 
            finalIcon={SparklesIcon} 
            label="DISCO"
            delay={0} 
            x="10%" 
            y="15%"
            rotation={-12} 
            colorClass="text-yellow-400"
            />
        </div>

        <div className="hidden md:block">
            <DrawingTransformation 
            initialIcon={TicketIcon} 
            finalIcon={MusicalNoteIcon} 
            label="FUNKY"
            delay={3000} 
            x="80%" 
            y="60%"
            rotation={12} 
            colorClass="text-cyan-400"
            />
        </div>

        <div className="hidden lg:block">
            <DrawingTransformation 
            initialIcon={CloudIcon} 
            finalIcon={FireIcon} 
            label="CHEESE"
            delay={6000} 
            x="75%" 
            y="10%"
            rotation={-6} 
            colorClass="text-orange-500"
            />
        </div>

        <div className="hidden md:block">
            <DrawingTransformation 
            initialIcon={PencilSquareIcon} 
            finalIcon={HeartIcon} 
            label="LOVE"
            delay={4500} 
            x="15%" 
            y="70%"
            rotation={-8} 
            colorClass="text-pink-500"
            />
        </div>
      </div>

      {/* Hero Text Content */}
      <div className="text-center relative z-10 max-w-6xl mx-auto px-4 pt-16 pb-8">
        <div className="inline-block mb-6 px-6 py-2 rounded-full border-2 border-cyan-400 bg-black/50 text-cyan-300 text-sm md:text-base font-bold tracking-widest uppercase shadow-[0_0_20px_rgba(6,182,212,0.4)] animate-pulse">
             ✨ Welcome to the Funky Zone ✨
        </div>
        
        <h1 className="font-display text-6xl sm:text-7xl md:text-9xl lg:text-[10rem] font-black tracking-tighter mb-8 leading-[0.9] drop-shadow-[5px_5px_0px_rgba(236,72,153,0.8)] transform hover:scale-[1.02] transition-transform duration-300">
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-pink-400 to-purple-600">Unicorn</span><br/>
          <span className="text-white stroke-black drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">Mafia</span>
        </h1>
        
        <p className="text-xl sm:text-3xl text-pink-200/90 max-w-3xl mx-auto leading-relaxed font-medium font-display">
          We serve <span className="text-yellow-400 underline decoration-wavy decoration-2 underline-offset-4">Grilled Cheese</span> & 
          <span className="text-cyan-400 underline decoration-wavy decoration-2 underline-offset-4 ml-2">Web Apps</span>.
          <br className="hidden md:block"/>
          Drop your boring sketch and watch it dance.
        </p>
      </div>
    </>
  );
};