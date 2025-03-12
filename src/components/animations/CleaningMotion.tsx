'use client';

import { useEffect, useRef } from 'react';

export default function CleaningMotion() {
  const svgRef = useRef<SVGSVGElement>(null);
  
  useEffect(() => {
    if (!svgRef.current) return;
    
    const wipePath = svgRef.current.querySelector('#wipe-path');
    const droplets = svgRef.current.querySelectorAll('.droplet');
    
    // Animation for the wipe motion
    if (wipePath instanceof SVGPathElement) {
      wipePath.style.strokeDasharray = `${wipePath.getTotalLength()}`;
      wipePath.style.strokeDashoffset = `${wipePath.getTotalLength()}`;
      
      const wipeAnimation = wipePath.animate(
        [
          { strokeDashoffset: `${wipePath.getTotalLength()}` },
          { strokeDashoffset: '0' }
        ],
        {
          duration: 2000,
          fill: 'forwards',
          easing: 'ease-in-out',
          iterations: Infinity
        }
      );
    }
    
    // Animation for the droplets
    droplets.forEach((droplet, index) => {
      droplet.animate(
        [
          { opacity: 0, transform: 'translateY(0)' },
          { opacity: 1, transform: 'translateY(5px)' },
          { opacity: 0, transform: 'translateY(15px)' }
        ],
        {
          duration: 1500,
          delay: index * 200,
          fill: 'forwards',
          easing: 'ease-in-out',
          iterations: Infinity
        }
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
      className="cleaning-motion"
    >
      {/* Cleaning cloth/wipe */}
      <path 
        id="wipe-path"
        d="M20,60 Q40,40 60,60 Q80,80 100,60" 
        stroke="#4FB3D9" 
        strokeWidth="8" 
        strokeLinecap="round"
        fill="none"
      />
      
      {/* Droplets */}
      <circle className="droplet" cx="30" cy="55" r="3" fill="#4FB3D9" />
      <circle className="droplet" cx="50" cy="60" r="2" fill="#4FB3D9" />
      <circle className="droplet" cx="70" cy="65" r="3" fill="#4FB3D9" />
      <circle className="droplet" cx="90" cy="60" r="2" fill="#4FB3D9" />
      
      {/* Surface being cleaned (subtle) */}
      <rect x="10" y="70" width="100" height="2" rx="1" fill="#E0E0E0" />
    </svg>
  );
}