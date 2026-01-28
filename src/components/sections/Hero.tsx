"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const titleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const name = nameRef.current;
    const title = titleRef.current;
    const cta = ctaRef.current;

    if (!name || !title || !cta) return;

    // Simple, clean entrance animation
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.fromTo(
      name,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.8 }
    )
      .fromTo(
        title,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6 },
        "-=0.4"
      )
      .fromTo(
        cta,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6 },
        "-=0.3"
      );
  }, []);

  return (
    <section
      id="hero"
      ref={containerRef}
      className="min-h-screen flex flex-col justify-center px-6 md:px-12 lg:px-16"
    >
      <div className="container">
        <h1 ref={nameRef} className="heading-xl text-foreground mb-6">
          ALEC
        </h1>

        <p ref={titleRef} className="text-body text-muted max-w-lg mb-12">
          Web and mobile developer crafting clean, performant digital experiences.
        </p>

        <div ref={ctaRef} className="flex flex-wrap gap-4">
          <a
            href="#work"
            className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background rounded-full text-sm font-medium hover:bg-accent transition-colors duration-200"
          >
            View Work
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </a>

          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-6 py-3 border border-border rounded-full text-sm font-medium hover:border-foreground transition-colors duration-200"
          >
            Get in Touch
          </a>
        </div>
      </div>
    </section>
  );
}
