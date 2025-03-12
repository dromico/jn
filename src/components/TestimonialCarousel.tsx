'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import SparkleEffect from './animations/SparkleEffect';

interface Testimonial {
  id: number;
  name: string;
  position: string;
  company: string;
  image?: string;
  quote: string;
}

interface TestimonialCarouselProps {
  testimonials: Testimonial[];
  autoplaySpeed?: number;
  className?: string;
}

export default function TestimonialCarousel({
  testimonials,
  autoplaySpeed = 5000,
  className = '',
}: TestimonialCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Handle automatic sliding
  useEffect(() => {
    if (autoplaySpeed <= 0) return;
    
    const startAutoplay = () => {
      autoplayTimerRef.current = setTimeout(() => {
        goToNext();
      }, autoplaySpeed);
    };
    
    startAutoplay();
    
    return () => {
      if (autoplayTimerRef.current) {
        clearTimeout(autoplayTimerRef.current);
      }
    };
  }, [activeIndex, autoplaySpeed]);
  
  const goToNext = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
    
    // Reset animation state after transition
    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };
  
  const goToPrev = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    
    // Reset animation state after transition
    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };
  
  const goToSlide = (index: number) => {
    if (isAnimating || index === activeIndex) return;
    
    setIsAnimating(true);
    setActiveIndex(index);
    
    // Reset animation state after transition
    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };
  
  // Pause autoplay on hover
  const handleMouseEnter = () => {
    if (autoplayTimerRef.current) {
      clearTimeout(autoplayTimerRef.current);
      autoplayTimerRef.current = null;
    }
  };
  
  // Resume autoplay on mouse leave
  const handleMouseLeave = () => {
    if (autoplaySpeed > 0 && !autoplayTimerRef.current) {
      autoplayTimerRef.current = setTimeout(() => {
        goToNext();
      }, autoplaySpeed);
    }
  };
  
  return (
    <div 
      className={`relative overflow-hidden rounded-xl ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Testimonial Slides */}
      <div className="relative w-full">
        {testimonials.map((testimonial, index) => (
          <div
            key={testimonial.id}
            className={`
              absolute top-0 left-0 w-full transition-all duration-500 ease-in-out
              ${index === activeIndex ? 'opacity-100 translate-x-0 z-10' : 'opacity-0 translate-x-full z-0'}
            `}
          >
            <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-xl shadow-lg">
              <div className="flex flex-col md:flex-row gap-6 items-center">
                {testimonial.image && (
                  <div className="relative flex-shrink-0">
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden">
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        width={96}
                        height={96}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="absolute -top-2 -right-2 scale-75">
                      <SparkleEffect />
                    </div>
                  </div>
                )}
                
                <div className="flex-1">
                  <div className="mb-4">
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10.667 13.333H5.33366C5.33366 8 9.33366 5.333 13.3337 5.333L12.0003 9.333C10.667 10 10.667 11.333 10.667 13.333ZM21.3337 13.333H16.0003C16.0003 8 20.0003 5.333 24.0003 5.333L22.667 9.333C21.3337 10 21.3337 11.333 21.3337 13.333ZM24.0003 13.333V18.667C24.0003 22.667 22.667 26.667 17.3337 26.667C17.3337 22.667 18.667 18.667 24.0003 18.667V13.333ZM13.3337 13.333V18.667C13.3337 22.667 12.0003 26.667 6.66699 26.667C6.66699 22.667 8.00033 18.667 13.3337 18.667V13.333Z" fill="#4FB3D9"/>
                    </svg>
                  </div>
                  
                  <p className="text-gray-700 dark:text-gray-300 italic mb-4">
                    "{testimonial.quote}"
                  </p>
                  
                  <div>
                    <h4 className="font-bold text-lg">{testimonial.name}</h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      {testimonial.position}, {testimonial.company}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Navigation Arrows */}
      <button
        onClick={goToPrev}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-full p-2 shadow-md z-20 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        aria-label="Previous testimonial"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      
      <button
        onClick={goToNext}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-full p-2 shadow-md z-20 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        aria-label="Next testimonial"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      
      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === activeIndex 
                ? 'bg-primary w-6' 
                : 'bg-gray-300 dark:bg-gray-600'
            }`}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}