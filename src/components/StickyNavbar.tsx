'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import OptimizedImage from './OptimizedImage';
import LanguageToggle from './LanguageToggle';
import { useLanguage } from '../context/LanguageContext';

interface NavItem {
  label: string;
  href: string;
  isButton?: boolean;
}

interface StickyNavbarProps {
  logoSrc: string;
  companyName: string;
  navItems: NavItem[];
  forceVisibleBackground?: boolean;
}

export default function StickyNavbar({
  logoSrc,
  companyName,
  navItems,
  forceVisibleBackground = false,
}: StickyNavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useLanguage();

  // Determine if we should show the visible background
  const shouldShowVisibleBackground = isScrolled || forceVisibleBackground;
  
  // Handle scroll event to change navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  return (
    <nav
      className={`
        fixed top-0 left-0 right-0 z-[100] transition-all duration-300
        ${shouldShowVisibleBackground
          ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-md py-2'
          : 'bg-transparent py-4'}
      `}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo and Company Name */}
        <Link href="/" className="flex items-center gap-3">
          <div className={`
            relative overflow-hidden rounded-lg shadow-lg transition-all duration-300
            ${shouldShowVisibleBackground ? 'w-12 h-12' : 'w-16 h-16'}
            border-2 border-[#4FB3D9] transform hover:scale-105
            pulse-glow
          `}>
            <OptimizedImage
              src={logoSrc}
              alt={`${companyName} logo`}
              width={64}
              height={64}
              className="object-cover w-full h-full"
              style={{ objectPosition: 'center' }}
              priority
            />
          </div>
          <span className={`
            font-bold text-lg transition-all duration-300
            ${shouldShowVisibleBackground ? 'text-primary' : 'text-white text-shadow-sm'}
          `}>
            <span className="text-[#4FB3D9] mr-1">✦</span>
            {companyName}
          </span>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item, index) => (
            item.isButton ? (
              <Link
                key={index}
                href={item.href}
                className={`
                  rounded-full px-5 py-2 font-medium transition-all duration-300
                  ${shouldShowVisibleBackground
                    ? 'bg-primary text-white hover:bg-primary/90'
                    : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border border-white/30'}
                `}
              >
                {t(`nav.${item.label}`)}
              </Link>
            ) : (
              <Link
                key={index}
                href={item.href}
                className={`
                  relative font-medium transition-colors duration-300 group
                  ${shouldShowVisibleBackground ? 'text-gray-800 dark:text-gray-200' : 'text-white'}
                `}
              >
                {t(`nav.${item.label}`)}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
              </Link>
            )
          ))}
          
          {/* Language Toggle */}
          <div className={`ml-2 ${shouldShowVisibleBackground ? '' : 'text-white'}`}>
            <LanguageToggle />
          </div>
        </div>

        {/* Mobile Menu Button and Language Toggle */}
        <div className="md:hidden flex items-center gap-3">
          {/* Language Toggle for Mobile */}
          <div className={shouldShowVisibleBackground ? '' : 'text-white'}>
            <LanguageToggle />
          </div>
          
          {/* Mobile Menu Button */}
          <button
            className="text-gray-800 dark:text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className={`transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-90' : ''}`}
            >
              {isMobileMenuOpen ? (
                <path 
                  d="M18 6L6 18M6 6L18 18" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              ) : (
                <path 
                  d="M4 6H20M4 12H20M4 18H20" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              )}
            </svg>
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <div 
        className={`
          md:hidden absolute top-full left-0 right-0 bg-white dark:bg-gray-900 shadow-lg
          transition-all duration-300 overflow-hidden
          ${isMobileMenuOpen ? 'max-h-96 border-b border-gray-200 dark:border-gray-800' : 'max-h-0'}
        `}
      >
        <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
          {navItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={`
                py-2 px-4 rounded-lg font-medium transition-colors
                ${item.isButton 
                  ? 'bg-primary/10 text-primary hover:bg-primary/20' 
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800'}
              `}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t(`nav.${item.label}`)}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}