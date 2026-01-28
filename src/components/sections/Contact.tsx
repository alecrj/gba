"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    const elements = content.querySelectorAll(".animate-item");

    elements.forEach((el, i) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay: i * 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            once: true,
          },
        }
      );
    });
  }, []);

  return (
    <section id="contact" ref={sectionRef} className="section">
      <div className="container">
        <div ref={contentRef} className="max-w-2xl">
          <p className="animate-item text-accent text-sm font-medium tracking-wide uppercase mb-4">
            Contact
          </p>

          <h2 className="animate-item heading-lg text-foreground mb-6">
            Let&apos;s work together
          </h2>

          <p className="animate-item text-body text-muted mb-8">
            Have a project in mind? I&apos;m always open to discussing new
            opportunities.
          </p>

          <a
            href="mailto:hello@example.com"
            className="animate-item inline-block text-2xl md:text-3xl font-semibold text-foreground hover:text-accent transition-colors duration-200 mb-12"
          >
            hello@example.com
          </a>

          <div className="animate-item flex gap-6">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted hover:text-foreground transition-colors duration-200"
            >
              GitHub
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted hover:text-foreground transition-colors duration-200"
            >
              LinkedIn
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted hover:text-foreground transition-colors duration-200"
            >
              Twitter
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
