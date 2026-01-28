'use client';

import { useCallback, useEffect, useState } from 'react';

const KONAMI_CODE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
];

export function useKonamiCode(onActivate: () => void) {
  const [sequence, setSequence] = useState<string[]>([]);
  const [activated, setActivated] = useState(false);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (activated) return;

    const key = e.key.toLowerCase() === 'b' ? 'b' :
                e.key.toLowerCase() === 'a' ? 'a' : e.key;

    setSequence(prev => {
      const newSequence = [...prev, key].slice(-KONAMI_CODE.length);

      // Check if sequence matches
      const matches = newSequence.every((k, i) => {
        const expected = KONAMI_CODE[KONAMI_CODE.length - newSequence.length + i];
        return k === expected || k.toLowerCase() === expected?.toLowerCase();
      });

      if (matches && newSequence.length === KONAMI_CODE.length) {
        setActivated(true);
        onActivate();
      }

      return newSequence;
    });
  }, [activated, onActivate]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const reset = useCallback(() => {
    setSequence([]);
    setActivated(false);
  }, []);

  return { activated, reset };
}
