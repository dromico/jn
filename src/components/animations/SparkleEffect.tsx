"use client";

import { useEffect, useRef } from "react";

export default function SparkleEffect() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const sparkles = svgRef.current.querySelectorAll(".sparkle");

    // Animation for the sparkles
    sparkles.forEach((sparkle, index) => {
      // Random duration between 1.5s and 2.5s
      const duration = 1500 + Math.random() * 1000;

      // Random delay for more natural effect
      const delay = index * 200 + Math.random() * 500;

      sparkle.animate(
        [
          { opacity: 0, transform: "scale(0)" },
          { opacity: 1, transform: "scale(1.2)" },
          { opacity: 0, transform: "scale(0)" },
        ],

        {
          duration,
          delay,
          fill: "forwards",
          easing: "ease-in-out",
          iterations: Infinity,
        },
      );
    });
  }, []);

  return (
    <svg
      ref={svgRef}
      width="120"
      height="120"
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="sparkle-effect"
      data-oid="4bx70md"
    >
      {/* Star-shaped sparkles */}
      <path
        className="sparkle"
        d="M30,30 L33,25 L36,30 L41,33 L36,36 L33,41 L30,36 L25,33 Z"
        fill="#FFD700"
        data-oid="1oltxj4"
      />

      <path
        className="sparkle"
        d="M60,20 L63,15 L66,20 L71,23 L66,26 L63,31 L60,26 L55,23 Z"
        fill="#FFD700"
        data-oid="2u73p16"
      />

      <path
        className="sparkle"
        d="M90,30 L93,25 L96,30 L101,33 L96,36 L93,41 L90,36 L85,33 Z"
        fill="#FFD700"
        data-oid="8l:moa0"
      />

      <path
        className="sparkle"
        d="M30,70 L33,65 L36,70 L41,73 L36,76 L33,81 L30,76 L25,73 Z"
        fill="#FFD700"
        data-oid="z68bl:3"
      />

      <path
        className="sparkle"
        d="M90,70 L93,65 L96,70 L101,73 L96,76 L93,81 L90,76 L85,73 Z"
        fill="#FFD700"
        data-oid="83begek"
      />

      <path
        className="sparkle"
        d="M60,90 L63,85 L66,90 L71,93 L66,96 L63,101 L60,96 L55,93 Z"
        fill="#FFD700"
        data-oid="9..8rnl"
      />

      {/* Smaller dot sparkles */}
      <circle
        className="sparkle"
        cx="45"
        cy="45"
        r="2"
        fill="#FFFFFF"
        data-oid="qk2.ky5"
      />
      <circle
        className="sparkle"
        cx="75"
        cy="45"
        r="2"
        fill="#FFFFFF"
        data-oid="c-asde4"
      />
      <circle
        className="sparkle"
        cx="45"
        cy="75"
        r="2"
        fill="#FFFFFF"
        data-oid="igwyzev"
      />
      <circle
        className="sparkle"
        cx="75"
        cy="75"
        r="2"
        fill="#FFFFFF"
        data-oid="d83cs8i"
      />
      <circle
        className="sparkle"
        cx="60"
        cy="60"
        r="3"
        fill="#FFFFFF"
        data-oid="akjmhj7"
      />
    </svg>
  );
}
