/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { ClockIcon, ArrowRightIcon, DocumentIcon, PhotoIcon, SparklesIcon } from '@heroicons/react/24/outline';

export interface Creation {
  id: string;
  name: string;
  html: string;
  originalImage?: string; // Base64 data URL
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
      <div className="flex items-center space-x-3 mb-4 px-2">
        <SparklesIcon className="w-4 h-4 text-yellow-400" />
        <h2 className="text-xs font-bold uppercase tracking-wider text-pink-300">Magical Archive</h2>
        <div className="h-px flex-1 bg-gradient-to-r from-pink-500/30 to-transparent"></div>
      </div>
      
      {/* Horizontal Scroll Container for Compact Layout */}
      <div className="flex overflow-x-auto space-x-4 pb-4 px-2 scrollbar-hide">
        {history.map((item) => {
          const isPdf = item.originalImage?.startsWith('data:application/pdf');
          return (
            <button
              key={item.id}
              onClick={() => onSelect(item)}
              className="group flex-shrink-0 relative flex flex-col text-left w-44 h-28 bg-[#1a0b2e]/60 hover:bg-[#2d124d] border border-purple-500/30 hover:border-pink-500 rounded-xl transition-all duration-200 overflow-hidden shadow-lg hover:shadow-pink-500/20 hover:-translate-y-1"
            >
              <div className="p-4 flex flex-col h-full">
                <div className="flex items-start justify-between mb-2">
                  <div className="p-1.5 bg-purple-900/50 rounded-lg group-hover:bg-pink-500/20 transition-colors border border-white/5">
                      {isPdf ? (
                          <DocumentIcon className="w-4 h-4 text-purple-300 group-hover:text-pink-300" />
                      ) : item.originalImage ? (
                          <PhotoIcon className="w-4 h-4 text-cyan-300 group-hover:text-white" />
                      ) : (
                          <SparklesIcon className="w-4 h-4 text-yellow-300" />
                      )}
                  </div>
                  <span className="text-[10px] font-mono text-purple-300/60 group-hover:text-pink-300">
                    {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                
                <div className="mt-auto">
                  <h3 className="text-sm font-bold text-zinc-200 group-hover:text-white truncate">
                    {item.name}
                  </h3>
                  <div className="flex items-center space-x-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">Resurrect</span>
                    <ArrowRightIcon className="w-3 h-3 text-cyan-400" />
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};