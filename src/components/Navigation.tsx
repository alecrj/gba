"use client";

import { useState, useEffect } from "react";

const navItems = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "py-4 bg-background/90 backdrop-blur-sm border-b border-border"
          : "py-6 bg-transparent"
      }`}
    >
      <nav className="container flex items-center justify-between px-6 md:px-12 lg:px-16">
        <a href="#hero" className="text-xl font-bold">
          A<span className="text-accent">.</span>
        </a>

        <ul className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                className="text-sm text-muted hover:text-foreground transition-colors duration-200"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#contact"
          className="px-4 py-2 text-sm font-medium bg-foreground text-background rounded-full hover:bg-accent transition-colors duration-200"
        >
          Get in Touch
        </a>
      </nav>
    </header>
  );
}
