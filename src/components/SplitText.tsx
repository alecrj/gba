"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface SplitTextProps {
  children: string;
  className?: string;
  delay?: number;
  stagger?: number;
  animation?: "fade-up" | "fade-rotate" | "reveal";
  trigger?: "load" | "scroll";
}

export default function SplitText({
  children,
  className = "",
  delay = 0,
  stagger = 0.03,
  animation = "fade-up",
  trigger = "load",
}: SplitTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const charsRef = useRef<HTMLSpanElement[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    const chars = charsRef.current;
    if (!container || chars.length === 0) return;

    const getAnimationProps = () => {
      switch (animation) {
        case "fade-up":
          return { y: 60, opacity: 0, rotateX: -20 };
        case "fade-rotate":
          return { y: 40, opacity: 0, rotation: 10, scale: 0.9 };
        case "reveal":
          return { y: "100%", opacity: 1 };
        default:
          return { y: 60, opacity: 0 };
      }
    };

    gsap.set(chars, getAnimationProps());

    const animateChars = () => {
      gsap.to(chars, {
        y: 0,
        opacity: 1,
        rotateX: 0,
        rotation: 0,
        scale: 1,
        duration: 0.8,
        stagger,
        delay,
        ease: "power3.out",
      });
    };

    if (trigger === "load") {
      animateChars();
    } else {
      ScrollTrigger.create({
        trigger: container,
        start: "top 85%",
        onEnter: animateChars,
        once: true,
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === container) t.kill();
      });
    };
  }, [animation, delay, stagger, trigger]);

  const chars = children.split("");

  return (
    <div ref={containerRef} className={className} style={{ perspective: "1000px" }}>
      {chars.map((char, i) => (
        <span
          key={i}
          ref={(el) => {
            if (el) charsRef.current[i] = el;
          }}
          className="split-char"
          style={{ display: "inline-block" }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </div>
  );
}

interface SplitWordsProps {
  children: string;
  className?: string;
  delay?: number;
  stagger?: number;
  trigger?: "load" | "scroll";
}

export function SplitWords({
  children,
  className = "",
  delay = 0,
  stagger = 0.1,
  trigger = "scroll",
}: SplitWordsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wordsRef = useRef<HTMLSpanElement[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    const words = wordsRef.current;
    if (!container || words.length === 0) return;

    gsap.set(words, { y: "100%", opacity: 0 });

    const animateWords = () => {
      gsap.to(words, {
        y: "0%",
        opacity: 1,
        duration: 0.6,
        stagger,
        delay,
        ease: "power2.out",
      });
    };

    if (trigger === "load") {
      animateWords();
    } else {
      ScrollTrigger.create({
        trigger: container,
        start: "top 85%",
        onEnter: animateWords,
        once: true,
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === container) t.kill();
      });
    };
  }, [delay, stagger, trigger]);

  const words = children.split(" ");

  return (
    <div ref={containerRef} className={className}>
      {words.map((word, i) => (
        <span key={i} className="split-word inline-block overflow-hidden mr-[0.25em]">
          <span
            ref={(el) => {
              if (el) wordsRef.current[i] = el;
            }}
            className="inline-block"
          >
            {word}
          </span>
        </span>
      ))}
    </div>
  );
}
