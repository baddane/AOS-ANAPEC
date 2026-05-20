/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface AnapecLogoProps {
  className?: string;
}

export default function AnapecLogo({ className = "w-14 h-14" }: AnapecLogoProps) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 200 200" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      id="anapec-brand-logo-svg"
    >
      {/* Outer crisp circle container */}
      <circle cx="100" cy="100" r="98" fill="white" stroke="#DFB035" strokeWidth="2.5" />
      
      {/* SVG Path anchors for curved text wrapped around: */}
      {/* Top arc path for "★ ANAPEC ★" */}
      <path id="anc-top" d="M 46 64 A 65 65 0 0 1 154 64" fill="none" />
      
      {/* Right/Bottom arc path for "Association des Oeuvres Sociales" */}
      <path id="anc-french" d="M 154 64 A 72 72 0 0 1 114 171" fill="none" />
      
      {/* Left/Bottom arc path for "جمعية الأعمال الاجتماعية" */}
      {/* Curved upwards for correct Arabic line alignment */}
      <path id="anc-arabic" d="M 33 118 A 72 72 0 0 1 54 54" fill="none" />

      {/* Main Indigo-blue center circle */}
      <circle cx="100" cy="100" r="64" fill="#4A69B1" />

      {/* Gold custom brushstroke swoosh inside blue circle */}
      <path 
        d="M 68 144 C 74 136, 114 104, 139 71 C 142 67, 144 68, 142 73 C 117 109, 78 141, 71 146 C 69 147, 67 146, 68 144 Z" 
        fill="#DFB035" 
      />

      {/* 4 Cascading Human figures in support/solidarity, matching the uploaded logo */}
      {/* Figure 1 (Largest, top) */}
      <circle cx="120" cy="58" r="8" fill="white" />
      <path d="M 115 66 C 94 67, 74 84, 69 110 C 76 97, 87 90, 104 88 C 108 87, 113 87, 116 85 C 119 83, 121 80, 121 76 C 121 71, 118 67, 115 66 Z" fill="white" />

      {/* Figure 2 (Medium-Large, middle) */}
      <circle cx="144" cy="106" r="6.5" fill="white" />
      <path d="M 140 112.5 C 124 113.5, 108 124, 104 139 C 109 131, 117 127, 131 126 C 134 125, 138 125, 140 123.5 C 142 122, 143 120, 143 117 C 143 114, 141 113, 140 112.5 Z" fill="white" />

      {/* Figure 3 (Medium-Small, below) */}
      <circle cx="125" cy="142" r="5" fill="white" />
      <path d="M 122 147 C 111 148, 99 156, 96 168 C 100 162, 106 159, 116 158 C 118 157.5, 121 157, 122.5 156 C 124 155, 124.5 153.5, 124.5 151 C 124.5 148.5, 123 147.5, 122 147 Z" fill="white" />

      {/* Figure 4 (Smallest, bottom) */}
      <circle cx="98" cy="164" r="3.5" fill="white" />
      <path d="M 96 167.5 C 89 168, 81 174, 79 183 C 81 178.5, 86 176, 92 175.5 C 94 175, 96 174.5, 97 173.5 C 98 172.5, 98.5 171.5, 98.5 170 C 98.5 168, 97 167.5, 96 167.5 Z" fill="white" />

      {/* Circular texts wrapped along path anchors */}
      {/* Top Text: ANAPEC with asterisk-like points */}
      <text fontFamily="sans-serif" fontWeight="900" fontSize="12" fill="#1E293B">
        <textPath href="#anc-top" startOffset="50%" textAnchor="middle">
          ★ ANAPEC ★
        </textPath>
      </text>

      {/* French description Text: "Association des Oeuvres Sociales" */}
      <text fontFamily="sans-serif" fontWeight="700" fontSize="8.2" fill="#334155">
        <textPath href="#anc-french" startOffset="0%">
          Association des Oeuvres Sociales
        </textPath>
      </text>

      {/* Arabic description Text: "جمعية الأعمال الاجتماعية" */}
      <text fontFamily="sans-serif, Arial" fontWeight="bold" fontSize="12" fill="#1E293B" direction="rtl">
        <textPath href="#anc-arabic" startOffset="50%" textAnchor="middle">
          جمعية الأعمال الإجتماعية
        </textPath>
      </text>
    </svg>
  );
}
