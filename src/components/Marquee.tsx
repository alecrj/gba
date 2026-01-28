"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";

interface MarqueeProps {
  children: React.ReactNode;
  speed?: number;
  direction?: "left" | "right";
  className?: string;
}

export default function Marquee({
  children,
  speed = 50,
  direction = "left",
  className = "",
}: MarqueeProps) {
  const marqueeRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const marquee = marqueeRef.current;
    const content = contentRef.current;
    if (!marquee || !content) return;

    const contentWidth = content.offsetWidth;
    const duration = contentWidth / speed;

    gsap.set(content, { x: direction === "left" ? 0 : -contentWidth / 2 });

    const tween = gsap.to(content, {
      x: direction === "left" ? -contentWidth / 2 : 0,
      duration,
      ease: "none",
      repeat: -1,
    });

    // Speed up on hover
    marquee.addEventListener("mouseenter", () => {
      gsap.to(tween, { timeScale: 2, duration: 0.5 });
    });

    marquee.addEventListener("mouseleave", () => {
      gsap.to(tween, { timeScale: 1, duration: 0.5 });
    });

    return () => {
      tween.kill();
    };
  }, [speed, direction]);

  return (
    <div
      ref={marqueeRef}
      className={`overflow-hidden whitespace-nowrap ${className}`}
    >
      <div ref={contentRef} className="inline-flex">
        {children}
        {children}
      </div>
    </div>
  );
}

interface MarqueeItemProps {
  text: string;
  className?: string;
}

export function MarqueeItem({ text, className = "" }: MarqueeItemProps) {
  return (
    <span className={`inline-flex items-center mx-4 ${className}`}>
      <span>{text}</span>
      <span className="mx-8 text-accent">✦</span>
    </span>
  );
}
