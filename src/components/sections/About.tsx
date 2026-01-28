"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const technologies = [
  "React",
  "Next.js",
  "TypeScript",
  "React Native",
  "Node.js",
  "Python",
  "PostgreSQL",
  "Tailwind CSS",
  "AWS",
  "Firebase",
];

export default function About() {
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
    <section id="about" ref={sectionRef} className="section bg-surface/30">
      <div className="container">
        <div ref={contentRef} className="max-w-3xl">
          <p className="animate-item text-accent text-sm font-medium tracking-wide uppercase mb-4">
            About
          </p>

          <h2 className="animate-item heading-lg text-foreground mb-8">
            Building digital products that work
          </h2>

          <p className="animate-item text-body text-muted mb-6">
            I focus on creating clean, functional web and mobile applications.
            From startups to established businesses, I help bring ideas to life
            with modern technology and straightforward solutions.
          </p>

          <p className="animate-item text-body text-muted mb-12">
            My approach is simple: write clean code, build intuitive interfaces,
            and deliver products that perform well and are easy to maintain.
          </p>

          <div className="animate-item">
            <p className="text-sm text-muted uppercase tracking-wide mb-4">
              Technologies
            </p>
            <div className="flex flex-wrap gap-2">
              {technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-4 py-2 text-sm border border-border rounded-full hover:border-accent hover:text-accent transition-colors duration-200"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
