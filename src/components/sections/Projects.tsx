"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const projects = [
  {
    num: "01",
    title: "FinTech Mobile App",
    description: "Mobile banking solution with real-time transactions and biometric security.",
    tags: ["React Native", "Node.js", "PostgreSQL"],
  },
  {
    num: "02",
    title: "E-Commerce Platform",
    description: "Full-stack e-commerce with inventory management and seamless checkout.",
    tags: ["Next.js", "TypeScript", "Prisma"],
  },
  {
    num: "03",
    title: "SaaS Dashboard",
    description: "Analytics dashboard with interactive charts and team collaboration.",
    tags: ["React", "D3.js", "Firebase"],
  },
  {
    num: "04",
    title: "Health & Fitness App",
    description: "Workout and nutrition tracking with personalized recommendations.",
    tags: ["Flutter", "Python", "TensorFlow"],
  },
];

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const cards = cardsRef.current;

    cards.forEach((card, i) => {
      if (!card) return;

      gsap.fromTo(
        card,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            once: true,
          },
        }
      );
    });
  }, []);

  return (
    <section id="work" ref={sectionRef} className="section">
      <div className="container">
        <div className="mb-16 md:mb-24">
          <p className="text-accent text-sm font-medium tracking-wide uppercase mb-4">
            Selected Work
          </p>
          <h2 className="heading-lg text-foreground">
            Recent projects
          </h2>
        </div>

        <div className="space-y-8 md:space-y-12">
          {projects.map((project, index) => (
            <article
              key={project.num}
              ref={(el) => {
                if (el) cardsRef.current[index] = el;
              }}
              className="group"
            >
              <a href="#" className="block">
                <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-12 p-6 md:p-8 rounded-2xl border border-border bg-surface/50 hover:border-accent/50 transition-colors duration-300">
                  {/* Number */}
                  <span className="text-5xl md:text-6xl font-bold text-border group-hover:text-accent/30 transition-colors duration-300">
                    {project.num}
                  </span>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="heading-md text-foreground mb-3 group-hover:text-accent transition-colors duration-300">
                      {project.title}
                    </h3>

                    <p className="text-body text-muted mb-6 max-w-xl">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 text-xs text-muted border border-border rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="hidden md:flex items-center justify-center w-12 h-12 rounded-full border border-border group-hover:border-accent group-hover:bg-accent transition-all duration-300">
                    <svg
                      className="w-5 h-5 text-muted group-hover:text-background transition-colors duration-300 -rotate-45 group-hover:rotate-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </div>
                </div>
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
