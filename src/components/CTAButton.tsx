"use client";

import { useState } from "react";
import Link from "next/link";
import SparkleEffect from "./animations/SparkleEffect";

interface CTAButtonProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  withSparkle?: boolean;
}

export default function CTAButton({
  href,
  children,
  className = "",
  variant = "primary",
  size = "md",
  withSparkle = false,
}: CTAButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Base styles
  const baseStyles =
    "relative inline-flex items-center justify-center font-medium rounded-full transition-all duration-300 ease-in-out";

  // Size variations
  const sizeStyles = {
    sm: "text-sm px-4 py-2",
    md: "text-base px-6 py-3",
    lg: "text-lg px-8 py-4",
  };

  // Variant styles
  const variantStyles = {
    primary:
      "bg-primary text-white hover:bg-primary/90 shadow-lg hover:shadow-xl",
    secondary:
      "bg-white text-primary border-2 border-primary hover:bg-primary/10",
  };

  return (
    <div className="relative inline-block" data-oid="q7b_wyy">
      {withSparkle && isHovered && (
        <div
          className="absolute -top-12 -right-12 z-0 opacity-70 scale-75"
          data-oid="ke3l0y6"
        >
          <SparkleEffect data-oid="a:utjcr" />
        </div>
      )}

      <Link
        href={href}
        className={`
          ${baseStyles}
          ${sizeStyles[size]}
          ${variantStyles[variant]}
          ${className}
          ${withSparkle ? "overflow-visible" : "overflow-hidden"}
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        data-oid=":k51qs8"
      >
        {/* Button content */}
        <span className="relative z-10" data-oid="g.7o-ql">
          {children}
        </span>

        {/* Animated background on hover */}
        <span
          className={`
            absolute inset-0 z-0 rounded-full transition-transform duration-500 ease-out
            ${isHovered ? "scale-105" : "scale-0"}
            ${variant === "primary" ? "bg-primary/20" : "bg-primary/5"}
          `}
          data-oid="c0mgud_"
        />
      </Link>
    </div>
  );
}
