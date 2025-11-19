/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { ArrowRightIcon, DocumentIcon, PhotoIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { playDiscoSound } from '../services/audio';

export interface Creation {
  id: string;
  name: string;
  html: string;
  originalImage?: string; 
  timestamp: Date;
}

interface CreationHistoryProps {
  history: Creation[];
  onSelect: (creation: Creation) => void;
}

export const CreationHistory: React.FC<CreationHistoryProps> = ({ history, onSelect }) => {
  if (history.length === 0) return null;

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex items-center space-x-3 mb-4 px-2 justify-center">
        <SparklesIcon className="w-5 h-5 text-yellow-400 animate-spin-slow" />
        <h2 className="text-sm font-display uppercase tracking-widest text-pink-300 drop-shadow-md">Hall of Fame</h2>
        <SparklesIcon className="w-5 h-5 text-yellow-400 animate-spin-slow" />
      </div>
      
      <div className="flex overflow-x-auto space-x-6 pb-6 px-4 justify-center scrollbar-hide">
        {history.map((item) => {
          const isPdf = item.originalImage?.startsWith('data:application/pdf');
          return (
            <button
              key={item.id}
              onClick={() => onSelect(item)}
              onMouseEnter={() => playDiscoSound('hover')}
              className="group flex-shrink-0 relative flex flex-col text-left w-48 h-32 bg-[#1a0b2e] hover:bg-[#2d124d] border-2 border-purple-500/50 hover:border-cyan-400 rounded-2xl transition-all duration-200 overflow-hidden shadow-[0_5px_0_rgba(147,51,234,0.5)] hover:shadow-[0_5px_0_rgba(34,211,238,0.8)] hover:-translate-y-1"
            >
              <div className="p-5 flex flex-col h-full">
                <div className="flex items-start justify-between mb-2">
                  <div className="p-2 bg-black/30 rounded-lg group-hover:bg-pink-500 transition-colors border border-white/10">
                      {isPdf ? (
                          <DocumentIcon className="w-5 h-5 text-purple-300 group-hover:text-white" />
                      ) : item.originalImage ? (
                          <PhotoIcon className="w-5 h-5 text-cyan-300 group-hover:text-white" />
                      ) : (
                          <SparklesIcon className="w-5 h-5 text-yellow-300 group-hover:text-white" />
                      )}
                  </div>
                  <span className="text-[10px] font-mono text-pink-400/60 group-hover:text-pink-300 bg-black/20 px-2 py-0.5 rounded-full">
                    {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                
                <div className="mt-auto">
                  <h3 className="text-sm font-bold text-white truncate font-display tracking-wide group-hover:text-cyan-300">
                    {item.name}
                  </h3>
                  <div className="flex items-center space-x-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[10px] text-yellow-400 font-bold uppercase tracking-wider">Party Time</span>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
