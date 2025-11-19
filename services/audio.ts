/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Utility for 90s Disco Sound Effects

const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
let audioCtx: AudioContext | null = null;

const getAudioContext = () => {
  if (!audioCtx && AudioContextClass) {
    audioCtx = new AudioContextClass();
  }
  return audioCtx;
};

export const playDiscoSound = (type: 'click' | 'hover' | 'success' | 'start' | 'error' | 'magic') => {
  const ctx = getAudioContext();
  if (!ctx) return;

  // Resume context if suspended (browser policy)
  if (ctx.state === 'suspended') {
    ctx.resume().catch(() => {});
  }

  const now = ctx.currentTime;

  if (type === 'success') {
    // Funky Major Arpeggio
    playNote(ctx, 523.25, now, 0.1, 'triangle'); // C5
    playNote(ctx, 659.25, now + 0.1, 0.1, 'triangle'); // E5
    playNote(ctx, 783.99, now + 0.2, 0.1, 'triangle'); // G5
    playNote(ctx, 1046.50, now + 0.3, 0.4, 'square'); // C6
    return;
  }

  if (type === 'magic') {
    // Sparkle sound
    for(let i=0; i<10; i++) {
        playNote(ctx, 800 + (i*100), now + (i*0.03), 0.05, 'sine');
    }
    return;
  }

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.connect(gain);
  gain.connect(ctx.destination);

  switch (type) {
    case 'click':
      // High pitched "UI" blip (retro computer)
      osc.type = 'square';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.05);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
      break;

    case 'hover':
      // Very short tick
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      gain.gain.setValueAtTime(0.02, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.03);
      osc.start(now);
      osc.stop(now + 0.03);
      break;

    case 'start':
      // Rev up sound
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(100, now);
      osc.frequency.linearRampToValueAtTime(600, now + 0.4);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.4);
      osc.start(now);
      osc.stop(now + 0.4);
      break;

    case 'error':
      // Low buzz
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.linearRampToValueAtTime(100, now + 0.3);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
      break;
  }
};

function playNote(ctx: AudioContext, freq: number, time: number, duration: number, type: OscillatorType) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    osc.connect(gain);
    gain.connect(ctx.destination);
    gain.gain.setValueAtTime(0.05, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);
    osc.start(time);
    osc.stop(time + duration);
}

export const speakGroovy = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Attempt to make it sound a bit more "hyped"
    utterance.rate = 1.2; 
    utterance.pitch = 1.1;
    utterance.volume = 1.0;

    window.speechSynthesis.speak(utterance);
};
