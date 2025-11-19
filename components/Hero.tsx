/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useEffect, useState } from 'react';
import { LightBulbIcon, TicketIcon, CloudIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import { SparklesIcon, FireIcon, MusicalNoteIcon, HeartIcon, StarIcon } from '@heroicons/react/24/solid';

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
      <div className={`relative w-24 h-32 md:w-32 md:h-44 rounded-xl backdrop-blur-md transition-all duration-1000 ${stage === 2 ? 'bg-zinc-900/60 border-pink-500 shadow-[0_0_30px_rgba(236,72,153,0.3)] scale-110 -translate-y-4 rotate-3' : 'bg-zinc-900/20 border-zinc-700 scale-100 border-2 border-dashed'}`}>
        
        {/* Label tag that appears in stage 2 */}
        <div className={`absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-black border-2 border-black text-[10px] md:text-xs font-black tracking-widest px-3 py-1 rotate-[-5deg] shadow-lg transition-all duration-500 ${stage === 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
            {label}
        </div>

        {/* Content Container */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          
          {/* Stage 1: Wireframe Drawing Effect */}
          <div className={`absolute transition-all duration-1000 ${stage === 1 ? 'opacity-100' : 'opacity-0'}`}>
             <InitialIcon className="w-10 h-10 md:w-14 md:h-14 text-zinc-500 stroke-1" />
             {/* Retro corner markers */}
             <div className="absolute -inset-3 border-2 border-zinc-700/30 opacity-50 rounded-lg"></div>
             <div className="absolute top-0 left-0 w-2 h-2 bg-pink-500"></div>
             <div className="absolute top-0 right-0 w-2 h-2 bg-cyan-400"></div>
             <div className="absolute bottom-0 left-0 w-2 h-2 bg-yellow-400"></div>
             <div className="absolute bottom-0 right-0 w-2 h-2 bg-purple-500"></div>
          </div>

          {/* Stage 2: Alive/Interactive */}
          <div className={`absolute transition-all duration-700 flex flex-col items-center ${stage === 2 ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-75 blur-sm'}`}>
             <div className="relative">
                 <div className="absolute inset-0 animate-ping opacity-20 rounded-full bg-white"></div>
                 <FinalIcon className={`w-12 h-12 md:w-16 md:h-16 ${colorClass} drop-shadow-lg`} />
             </div>
             
             {stage === 2 && (
               <div className="mt-4 flex items-center gap-2 px-3 py-1.5 bg-black/60 rounded-full border border-pink-500/50 backdrop-blur-xl">
                 <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
                 <div className="w-12 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div className={`h-full w-2/3 animate-[pulse_1s_infinite] ${colorClass.replace('text-', 'bg-')}`}></div>
                 </div>
               </div>
             )}
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
        {/* Top Left: Patent -> Validated */}
        <div className="hidden lg:block">
            <DrawingTransformation 
            initialIcon={LightBulbIcon} 
            finalIcon={SparklesIcon} 
            label="MAGIC"
            delay={0} 
            x="8%" 
            y="12%"
            rotation={-6} 
            colorClass="text-yellow-400"
            />
        </div>

        {/* Bottom Right: Board Game -> Playable */}
        <div className="hidden md:block">
            <DrawingTransformation 
            initialIcon={TicketIcon} 
            finalIcon={MusicalNoteIcon} 
            label="GROOVE"
            delay={3000} 
            x="85%" 
            y="65%"
            rotation={6} 
            colorClass="text-cyan-400"
            />
        </div>

        {/* Top Right: Data/Paper -> Dashboard */}
        <div className="hidden lg:block">
            <DrawingTransformation 
            initialIcon={CloudIcon} 
            finalIcon={FireIcon} 
            label="CHEESE"
            delay={6000} 
            x="82%" 
            y="15%"
            rotation={-3} 
            colorClass="text-orange-500"
            />
        </div>

        {/* Bottom Left: Sketch -> App */}
        <div className="hidden md:block">
            <DrawingTransformation 
            initialIcon={PencilSquareIcon} 
            finalIcon={HeartIcon} 
            label="LOVE"
            delay={4500} 
            x="6%" 
            y="68%"
            rotation={-8} 
            colorClass="text-pink-500"
            />
        </div>
      </div>

      {/* Hero Text Content */}
      <div className="text-center relative z-10 max-w-6xl mx-auto px-4 pt-12">
        <div className="inline-block mb-4 px-4 py-1 rounded-full border border-pink-500/50 bg-pink-500/10 text-pink-300 text-xs md:text-sm font-bold tracking-widest uppercase backdrop-blur-sm">
             ✨ The 90s called, they want their magic back ✨
        </div>
        
        <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 mb-8 leading-[1] drop-shadow-[0_5px_5px_rgba(0,0,0,0.5)]">
          Magical <br/>
          <span className="text-white stroke-black drop-shadow-none">Unicorn</span> <br/>
          Mafia.
        </h1>
        
        <p className="text-lg sm:text-2xl text-zinc-300 max-w-3xl mx-auto leading-relaxed font-medium">
          Bring your wildest ideas (or grilled cheese recipes) to life. <br className="hidden md:block"/>
          <span className="text-yellow-400">Gemini</span> sees the sparkle in your messy sketches.
        </p>
      </div>
    </>
  );
};