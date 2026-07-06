import React from 'react';

interface LogoProps {
  variant?: 'full' | 'horizontal' | 'icon';
  className?: string;
  iconSize?: number; // Size for the icon part (width/height)
}

export default function Logo({ variant = 'full', className = '', iconSize = 48 }: LogoProps) {
  // SVG gradients and filter definitions to share
  const defs = (
    <defs>
      {/* Primary green gradient for the stylized 'e' */}
      <linearGradient id="logoGreenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4ade80" /> {/* vibrant light green */}
        <stop offset="50%" stopColor="#22c55e" /> {/* mid green */}
        <stop offset="100%" stopColor="#15803d" /> {/* dark green */}
      </linearGradient>

      {/* Tassel or highlights gradient */}
      <linearGradient id="logoGoldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fbbf24" />
        <stop offset="100%" stopColor="#d97706" />
      </linearGradient>

      {/* Pencil wood gradient */}
      <linearGradient id="pencilWoodGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffedd5" />
        <stop offset="100%" stopColor="#fed7aa" />
      </linearGradient>
    </defs>
  );

  // The main cute icon: stylized 'e' smiley face with graduation cap and pencil tip
  const renderIcon = (size: number) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="inline-block flex-shrink-0"
    >
      {defs}
      
      {/* 1. Spark lines on top right of the 'e' */}
      <g stroke="#22c55e" strokeWidth="4" strokeLinecap="round">
        <line x1="155" y1="52" x2="159" y2="40" />
        <line x1="168" y1="62" x2="178" y2="58" />
        <line x1="166" y1="76" x2="177" y2="78" />
      </g>

      {/* 2. White backdrop region inside the upper loop of 'e' to make the smiley face stand out on any background */}
      <path
        d="M 64,106 C 58,74 88,48 122,54 C 148,58 152,86 142,106 Z"
        fill="#ffffff"
      />

      {/* 3. Main 'e' letter body stroke */}
      {/* A friendly curved 'e' path: start at inner crossbar, loop around top, down to bottom, transition to pencil */}
      <path
        d="M 80,105 L 140,105 C 144,70 115,54 98,64 C 74,78 70,118 96,134 C 114,145 138,138 152,120"
        stroke="url(#logoGreenGradient)"
        strokeWidth="19"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* 4. Smiley Face inside the upper loop of 'e' */}
      {/* Eyes */}
      <circle cx="106" cy="85" r="4.5" fill="#14532d" />
      <circle cx="126" cy="85" r="4.5" fill="#14532d" />
      {/* Smiling mouth */}
      <path
        d="M 104,96 Q 116,106 128,96"
        stroke="#14532d"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* 5. Play Button in the lower-middle inner area of 'e' */}
      <polygon
        points="106,115 106,129 118,122"
        fill="#15803d"
      />

      {/* 6. Graduation Cap (Mortarboard) - placed on top-left of 'e' */}
      <g>
        {/* Cap Base (skullcap) */}
        <path
          d="M 68,54 L 68,66 C 68,76 102,76 102,66 L 102,54 Z"
          fill="#14532d"
        />
        {/* Cap Diamond Top */}
        <polygon
          points="46,50 85,32 124,50 85,68"
          fill="#064e3b"
          stroke="#22c55e"
          strokeWidth="1.5"
        />
        {/* Golden Tassel hook and hanging cord */}
        <path
          d="M 85,50 L 52,55 L 52,74"
          stroke="url(#logoGoldGradient)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Tassel Fringe Brush */}
        <polygon
          points="49,74 55,74 57,84 47,84"
          fill="url(#logoGoldGradient)"
        />
      </g>

      {/* 7. Pencil tip forming the lower-right tail of 'e' */}
      {/* In our main 'e' path, the tail ends at around (152, 120) pointing up-right */}
      <g transform="rotate(15 152 120)">
        {/* Wooden transition cone */}
        <polygon
          points="152,111 166,117 152,123"
          fill="url(#pencilWoodGradient)"
        />
        {/* Dark Lead tip */}
        <polygon
          points="161,115 166,117 161,119"
          fill="#374151"
        />
      </g>
    </svg>
  );

  if (variant === 'icon') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        {renderIcon(iconSize)}
      </div>
    );
  }

  if (variant === 'horizontal') {
    return (
      <div className={`flex items-center gap-3 text-left ${className}`}>
        {renderIcon(iconSize)}
        <div className="flex flex-col justify-center">
          <div className="flex items-end leading-none gap-0.5">
            <span className="font-display font-black text-[#15803d] text-2xl tracking-tight leading-none">
              Edust
            </span>
            {/* The letter 'i' with a beautiful leaf dot */}
            <span className="relative font-display font-black text-[#15803d] text-2xl tracking-tight leading-none inline-block">
              ı
              <span className="absolute -top-1.5 -left-[1px] text-[#22c55e]">
                {/* A miniature green leaf SVG */}
                <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
                  <path d="M1,9 C4,7 9,5 9,1 C5,1 3,4 1,9 Z" />
                </svg>
              </span>
            </span>
            <span className="font-display font-black text-[#15803d] text-2xl tracking-tight leading-none">
              ka
            </span>
          </div>
          <span className="text-[10px] text-gray-500 font-medium tracking-widest leading-none mt-1 uppercase">
            Premium Math Care
          </span>
        </div>
      </div>
    );
  }

  // Full detailed vertical logo variant (including Bengali tagline and curved swoosh)
  return (
    <div className={`flex flex-col items-center text-center p-4 max-w-[420px] mx-auto bg-white ${className}`}>
      {/* 1. Large cute logo icon */}
      <div className="mb-2">
        {renderIcon(180)}
      </div>

      {/* 2. Brand name with leaf on 'i' */}
      <div className="flex items-end justify-center font-display font-black text-[#14532d] text-5xl tracking-tight mb-2 select-none">
        <span>Edust</span>
        <span className="relative inline-block">
          ı
          <span className="absolute -top-3 -left-[2px] text-[#22c55e]">
            {/* Elegant Leaf vector replacing the dot */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2,22 C8,18 22,14 22,2 C12,2 6,8 2,22 Z" />
            </svg>
          </span>
        </span>
        <span>ka</span>
      </div>

      {/* 3. Hand-drawn look curved underline swoosh */}
      <div className="w-64 h-3 mb-3 text-[#15803d]">
        <svg viewBox="0 0 200 10" fill="none" className="w-full h-full">
          <path
            d="M 5,2 Q 100,10 195,2"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </div>

      {/* 4. Bengali Tagline with side decorations */}
      <div className="flex items-center gap-2 text-sm text-[#166534] font-medium font-sans">
        {/* Left decoration */}
        <span className="text-[#22c55e] font-bold text-xs select-none">❖ ❖</span>
        
        <span className="font-semibold tracking-wide">শিখি সহজে, এগোই আত্মবিশ্বাসে</span>
        
        {/* Right decoration */}
        <span className="text-[#22c55e] font-bold text-xs select-none">❖ ❖</span>
      </div>
    </div>
  );
}
