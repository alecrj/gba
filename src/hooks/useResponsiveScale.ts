'use client';

import { useCallback, useEffect, useState } from 'react';

const DEVICE_WIDTH = 320;
const DEVICE_HEIGHT = 540;

export function useResponsiveScale(maxScale = 1.5) {
  const [scale, setScale] = useState(1);

  const updateScale = useCallback(() => {
    const vh = window.innerHeight;
    const vw = window.innerWidth;

    // Mobile-first: tighter padding on mobile, more on desktop
    const isMobile = vw < 768;
    const paddingX = isMobile ? 16 : 32;
    const paddingY = isMobile ? 24 : 48;

    const scaleX = (vw - paddingX) / DEVICE_WIDTH;
    const scaleY = (vh - paddingY) / DEVICE_HEIGHT;

    // Use the smaller scale to ensure it fits
    // On mobile, allow up to 1.2x; on desktop up to maxScale
    const maxAllowed = isMobile ? Math.min(maxScale, 1.3) : maxScale;
    const newScale = Math.min(scaleX, scaleY, maxAllowed);

    // Minimum 0.6x on mobile, 0.5x on desktop
    const minScale = isMobile ? 0.6 : 0.5;
    setScale(Math.max(newScale, minScale));
  }, [maxScale]);

  useEffect(() => {
    updateScale();
    window.addEventListener('resize', updateScale);
    // Also listen for orientation change on mobile
    window.addEventListener('orientationchange', updateScale);
    return () => {
      window.removeEventListener('resize', updateScale);
      window.removeEventListener('orientationchange', updateScale);
    };
  }, [updateScale]);

  return scale;
}
