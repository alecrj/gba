'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

type SoundType = 'blip' | 'select' | 'back' | 'boot' | 'secret';

export function useGameboySound() {
  const [soundEnabled, setSoundEnabled] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Initialize from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('gameboy-sound');
    if (stored === 'true') {
      setSoundEnabled(true);
    }
  }, []);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('gameboy-sound', String(soundEnabled));
  }, [soundEnabled]);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }
    return audioContextRef.current;
  }, []);

  const playSound = useCallback((type: SoundType) => {
    if (!soundEnabled) return;

    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = 'square';

    switch (type) {
      case 'blip':
        // Short navigation blip
        oscillator.frequency.setValueAtTime(880, now);
        oscillator.frequency.setValueAtTime(660, now + 0.03);
        gainNode.gain.setValueAtTime(0.1, now);
        gainNode.gain.exponentialDecayTo(0.01, now + 0.08);
        oscillator.start(now);
        oscillator.stop(now + 0.08);
        break;

      case 'select':
        // Higher pitch confirmation
        oscillator.frequency.setValueAtTime(523, now);
        oscillator.frequency.setValueAtTime(659, now + 0.05);
        oscillator.frequency.setValueAtTime(784, now + 0.1);
        gainNode.gain.setValueAtTime(0.1, now);
        gainNode.gain.exponentialDecayTo(0.01, now + 0.15);
        oscillator.start(now);
        oscillator.stop(now + 0.15);
        break;

      case 'back':
        // Descending tone
        oscillator.frequency.setValueAtTime(440, now);
        oscillator.frequency.setValueAtTime(330, now + 0.05);
        oscillator.frequency.setValueAtTime(220, now + 0.1);
        gainNode.gain.setValueAtTime(0.1, now);
        gainNode.gain.exponentialDecayTo(0.01, now + 0.12);
        oscillator.start(now);
        oscillator.stop(now + 0.12);
        break;

      case 'boot':
        // Classic startup chime
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        const gain2 = ctx.createGain();

        osc1.connect(gain1);
        osc2.connect(gain2);
        gain1.connect(ctx.destination);
        gain2.connect(ctx.destination);

        osc1.type = 'square';
        osc2.type = 'square';

        // Two-tone chime
        osc1.frequency.setValueAtTime(392, now); // G4
        osc2.frequency.setValueAtTime(523, now + 0.15); // C5

        gain1.gain.setValueAtTime(0.08, now);
        gain1.gain.exponentialDecayTo(0.01, now + 0.3);
        gain2.gain.setValueAtTime(0, now);
        gain2.gain.setValueAtTime(0.08, now + 0.15);
        gain2.gain.exponentialDecayTo(0.01, now + 0.5);

        osc1.start(now);
        osc1.stop(now + 0.3);
        osc2.start(now + 0.15);
        osc2.stop(now + 0.5);
        break;

      case 'secret':
        // Special fanfare for easter egg
        const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6
        notes.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.type = 'square';
          osc.frequency.setValueAtTime(freq, now + i * 0.1);
          gain.gain.setValueAtTime(0.08, now + i * 0.1);
          gain.gain.exponentialDecayTo(0.01, now + i * 0.1 + 0.2);
          osc.start(now + i * 0.1);
          osc.stop(now + i * 0.1 + 0.2);
        });
        break;
    }
  }, [soundEnabled, getAudioContext]);

  const toggleSound = useCallback(() => {
    setSoundEnabled(prev => !prev);
  }, []);

  return {
    soundEnabled,
    toggleSound,
    playBlip: () => playSound('blip'),
    playSelect: () => playSound('select'),
    playBack: () => playSound('back'),
    playBoot: () => playSound('boot'),
    playSecret: () => playSound('secret'),
  };
}

// Polyfill for exponentialDecayTo (not a real method, we simulate it)
declare global {
  interface AudioParam {
    exponentialDecayTo(value: number, endTime: number): void;
  }
}

if (typeof window !== 'undefined') {
  AudioParam.prototype.exponentialDecayTo = function(value: number, endTime: number) {
    this.exponentialRampToValueAtTime(Math.max(value, 0.0001), endTime);
  };
}
