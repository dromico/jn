"use client";

import { useRef, useEffect, ReactNode } from "react";

interface ParallaxSectionProps {
  children: ReactNode;
  speed?: number; // Speed factor (1 = normal, < 1 = slower, > 1 = faster)
  className?: string;
  style?: React.CSSProperties;
}

export default function ParallaxSection({
  children,
  speed = 0.5,
  className = "",
  style = {},
}: ParallaxSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !contentRef.current) return;

    const section = sectionRef.current;
    const content = contentRef.current;

    // Initial position
    let initialOffset = 0;

    const handleScroll = () => {
      if (!section || !content) return;

      // Get the section's position relative to the viewport
      const rect = section.getBoundingClientRect();

      // Calculate how far the section is from the center of the viewport
      const distanceFromCenter =
        rect.top + rect.height / 2 - window.innerHeight / 2;

      // Apply parallax effect
      const parallaxOffset = distanceFromCenter * speed;

      // Apply transform with a subtle parallax effect
      content.style.transform = `translateY(${-parallaxOffset}px)`;
    };

    // Set initial position
    handleScroll();

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [speed]);

  return (
    <div
      ref={sectionRef}
      className={`relative overflow-hidden ${className}`}
      style={{ ...style }}
      data-oid="_6sv2y3"
    >
      <div
        ref={contentRef}
        className="transition-transform duration-200 ease-out"
        data-oid="bf7ek37"
      >
        {children}
      </div>
    </div>
  );
}
