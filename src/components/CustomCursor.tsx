"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const [cursorText, setCursorText] = useState("");
  const [isHovering, setIsHovering] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    const cursor = cursorRef.current;
    const cursorDot = cursorDotRef.current;
    if (!cursor || !cursorDot) return;

    // Hide on touch devices
    if (window.matchMedia("(hover: none)").matches) {
      setIsHidden(true);
      return;
    }

    const onMouseMove = (e: MouseEvent) => {
      gsap.to(cursorDot, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: "power2.out",
      });

      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.5,
        ease: "power3.out",
      });
    };

    const onMouseEnterInteractive = (e: Event) => {
      const target = e.target as HTMLElement;
      const text = target.dataset.cursorText || "";
      setCursorText(text);
      setIsHovering(true);

      gsap.to(cursor, {
        scale: text ? 2.5 : 1.5,
        duration: 0.3,
        ease: "power2.out",
      });
    };

    const onMouseLeaveInteractive = () => {
      setCursorText("");
      setIsHovering(false);

      gsap.to(cursor, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out",
      });
    };

    const onMouseLeaveWindow = () => {
      gsap.to([cursor, cursorDot], {
        opacity: 0,
        duration: 0.2,
      });
    };

    const onMouseEnterWindow = () => {
      gsap.to([cursor, cursorDot], {
        opacity: 1,
        duration: 0.2,
      });
    };

    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onMouseLeaveWindow);
    document.addEventListener("mouseenter", onMouseEnterWindow);

    // Add listeners to interactive elements
    const interactiveElements = document.querySelectorAll(
      'a, button, [data-cursor="pointer"], input, textarea'
    );

    interactiveElements.forEach((el) => {
      el.addEventListener("mouseenter", onMouseEnterInteractive);
      el.addEventListener("mouseleave", onMouseLeaveInteractive);
    });

    // MutationObserver to handle dynamically added elements
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            const newInteractive = node.querySelectorAll(
              'a, button, [data-cursor="pointer"], input, textarea'
            );
            newInteractive.forEach((el) => {
              el.addEventListener("mouseenter", onMouseEnterInteractive);
              el.addEventListener("mouseleave", onMouseLeaveInteractive);
            });

            if (
              node.matches('a, button, [data-cursor="pointer"], input, textarea')
            ) {
              node.addEventListener("mouseenter", onMouseEnterInteractive);
              node.addEventListener("mouseleave", onMouseLeaveInteractive);
            }
          }
        });
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeaveWindow);
      document.removeEventListener("mouseenter", onMouseEnterWindow);
      interactiveElements.forEach((el) => {
        el.removeEventListener("mouseenter", onMouseEnterInteractive);
        el.removeEventListener("mouseleave", onMouseLeaveInteractive);
      });
      observer.disconnect();
    };
  }, []);

  if (isHidden) return null;

  return (
    <>
      {/* Main cursor ring */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[10000] -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
        style={{ willChange: "transform" }}
      >
        <div
          className={`flex items-center justify-center rounded-full border transition-all duration-300 ${
            isHovering
              ? "w-20 h-20 border-accent bg-accent/10"
              : "w-10 h-10 border-foreground/30"
          }`}
        >
          {cursorText && (
            <span className="text-[10px] font-medium text-foreground uppercase tracking-wider">
              {cursorText}
            </span>
          )}
        </div>
      </div>

      {/* Cursor dot */}
      <div
        ref={cursorDotRef}
        className="fixed top-0 left-0 pointer-events-none z-[10001] -translate-x-1/2 -translate-y-1/2"
        style={{ willChange: "transform" }}
      >
        <div className="w-1.5 h-1.5 rounded-full bg-accent" />
      </div>
    </>
  );
}
