'use client';

import { useCallback, useEffect, useState } from 'react';

const DEVICE_WIDTH = 320;
const DEVICE_HEIGHT = 540;

export function useResponsiveScale(maxScale = 1.5) {
  const [scale, setScale] = useState(1);

  const updateScale = useCallback(() => {
    const vh = window.innerHeight;
    const vw = window.innerWidth;

    // Calculate scale based on viewport
    const paddingX = 32; // 16px each side
    const paddingY = 48; // 24px top/bottom

    const scaleX = (vw - paddingX) / DEVICE_WIDTH;
    const scaleY = (vh - paddingY) / DEVICE_HEIGHT;

    // Use the smaller scale to ensure it fits, cap at maxScale
    const newScale = Math.min(scaleX, scaleY, maxScale);
    setScale(Math.max(newScale, 0.5)); // Minimum 0.5x scale
  }, [maxScale]);

  useEffect(() => {
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [updateScale]);

  return scale;
}
