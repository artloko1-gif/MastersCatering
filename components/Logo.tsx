import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className = "h-12 w-auto" }) => {
  return (
    <svg 
      viewBox="0 0 240 70" 
      fill="currentColor" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Master's Catering Logo"
    >
      {/* Head */}
      <circle cx="36" cy="12" r="6" />
      
      {/* Bowtie */}
      <path d="M26 22 L36 28 L46 22 V30 L36 25 L26 30 Z" />
      
      {/* M Shape */}
      <path d="M4 68 L18 20 L36 55 L54 20 L68 68 H56 L48 40 L36 62 L24 40 L16 68 H4Z" />
      
      {/* Text: aster's */}
      <text 
        x="70" 
        y="53" 
        fontFamily='"Montserrat", sans-serif' 
        fontWeight="bold" 
        fontSize="38" 
        letterSpacing="-1"
      >
        aster's
      </text>
      
      {/* Text: Catering */}
      <text 
        x="72" 
        y="67" 
        fontFamily='"Montserrat", sans-serif' 
        fontWeight="400" 
        fontSize="13" 
        letterSpacing="0.5"
      >
        Catering
      </text>
    </svg>
  );
};