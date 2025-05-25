'use client';

import { useState, useEffect } from 'react';
import OptimizedImage from './OptimizedImage';

interface ServiceCardProps {
  src: string;
  alt: string;
  title: string;
  description: string;
  width?: number;
  height?: number;
  onClick?: () => void;
  priority?: boolean;
  className?: string;
}

/**
 * ServiceCard - A reusable card component for displaying service information with hover effects
 * 
 * Features:
 * - Image optimization with next/image
 * - Smooth hover transitions
 * - Loading state handling
 * - Error fallback
 * - Accessibility improvements
 */
export default function ServiceCard({
  src,
  alt,
  title,
  description,
  width = 400,
  height = 300,
  onClick,
  priority = false,
  className = '',
}: ServiceCardProps) {
  const [isImageError, setIsImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Since we can't use onLoad directly, we'll handle loading via CSS
  // and a timeout-based fallback
  useEffect(() => {
    // Set a reasonable timeout to assume the image has loaded
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // 1 second fallback
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`relative rounded-xl overflow-hidden group ${className} z-[90]`}
      role="article"
      aria-labelledby={`service-title-${title.replace(/\s+/g, '-').toLowerCase()}`}
      onClick={onClick}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) onClick();
      }}
      tabIndex={onClick ? 0 : undefined}
    >
      {/* Loading state indicator */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <span className="sr-only">Loading image...</span>
        </div>
      )}
      
      {/* Error fallback */}
      {isImageError ? (
        <div className="w-full h-64 bg-gray-200 flex items-center justify-center text-gray-500">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="48" 
            height="48" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <polyline points="21 15 16 10 5 21"></polyline>
          </svg>
          <span className="sr-only">Image failed to load</span>
        </div>
      ) : (
        <OptimizedImage
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
          objectFit="cover"
          priority={priority}
          // Use the CSS-based loading approach
          style={{ opacity: isLoading ? 0 : 1 }}
        />
      )}
      
      {/* Overlay with text that appears on hover */}
      <div 
        className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end"
        aria-hidden="true"
      >
        <div className="p-6 text-white">
          <h3 
            id={`service-title-${title.replace(/\s+/g, '-').toLowerCase()}`}
            className="font-bold text-xl mb-2"
          >
            {title}
          </h3>
          <p className="text-sm">{description}</p>
        </div>
      </div>
    </div>
  );
}