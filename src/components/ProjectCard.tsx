"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, useState } from "react";

interface ProjectCardProps {
  title: string;
  description: string;
  tags: string[];
  image: string;
  link?: string;
  index: number;
}

const gradients = [
  "from-orange-500/20 via-red-500/10 to-purple-500/20",
  "from-blue-500/20 via-cyan-500/10 to-teal-500/20",
  "from-purple-500/20 via-pink-500/10 to-rose-500/20",
  "from-emerald-500/20 via-green-500/10 to-lime-500/20",
];

export default function ProjectCard({
  title,
  description,
  tags,
  image,
  link = "#",
  index,
}: ProjectCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7.5deg", "-7.5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7.5deg", "7.5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  const gradientClass = gradients[index % gradients.length];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className="group relative"
    >
      <a href={link} className="block">
        <div className="relative overflow-hidden rounded-2xl bg-surface border border-border">
          {/* Gradient placeholder image */}
          <motion.div
            className="aspect-[16/10] relative overflow-hidden"
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/80 z-10" />
            <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass}`} />

            {/* Decorative elements */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="w-32 h-32 rounded-full bg-accent/10 blur-2xl"
                animate={{
                  scale: isHovered ? 1.5 : 1,
                  opacity: isHovered ? 0.3 : 0.1,
                }}
                transition={{ duration: 0.4 }}
              />
            </div>

            {/* Grid pattern */}
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px),
                                 linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)`,
                backgroundSize: "40px 40px",
              }}
            />

            {/* Mock UI elements */}
            <div className="absolute inset-4 flex flex-col gap-2 opacity-20">
              <div className="h-3 w-1/3 bg-white/30 rounded" />
              <div className="h-2 w-1/2 bg-white/20 rounded" />
              <div className="flex-1 mt-4 rounded-lg bg-white/5 border border-white/10" />
            </div>
          </motion.div>

          <div className="p-6 md:p-8">
            <div className="flex flex-wrap gap-2 mb-4">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-xs font-medium text-muted bg-background rounded-full border border-border"
                >
                  {tag}
                </span>
              ))}
            </div>

            <h3 className="text-xl md:text-2xl font-semibold mb-2 group-hover:text-accent transition-colors duration-300">
              {title}
            </h3>

            <p className="text-muted text-sm md:text-base leading-relaxed">
              {description}
            </p>

            <motion.div
              className="mt-6 flex items-center gap-2 text-accent font-medium"
              animate={{ x: isHovered ? 8 : 0 }}
              transition={{ duration: 0.3 }}
            >
              View Project
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
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </motion.div>
          </div>
        </div>
      </a>
    </motion.div>
  );
}
