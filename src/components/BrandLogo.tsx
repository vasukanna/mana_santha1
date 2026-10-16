import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  showTagline?: boolean;
  lang?: 'te' | 'en';
  isLight?: boolean;
  layout?: 'horizontal' | 'vertical';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showTagline = true,
  lang = 'te',
  isLight = false,
  layout = 'horizontal'
}) => {
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-11 h-11',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20',
    hero: 'w-24 h-24 sm:w-28 sm:h-28'
  };

  const titleSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
    hero: 'text-3xl sm:text-4xl'
  };

  const isVertical = layout === 'vertical' || size === 'hero';

  return (
    <div className={`flex ${isVertical ? 'flex-col items-center text-center' : 'items-center'} gap-2.5 sm:gap-3`}>
      {/* Brand Icon Matching Mana Santha Logo from Image */}
      <div className={`relative ${iconSizes[size]} flex-shrink-0 flex items-center justify-center rounded-full bg-gradient-to-tr from-amber-600 via-orange-500 to-amber-500 p-1.5 shadow-lg shadow-orange-500/25 ring-3 ring-orange-400/20`}>
        <div className="w-full h-full rounded-full border-2 border-white/80 flex items-center justify-center p-1 bg-gradient-to-b from-orange-500 to-orange-600 shadow-inner">
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full drop-shadow-md text-white"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Canopy / Market stall roof */}
            <path
              d="M14 42 L86 42 L77 20 L23 20 Z"
              fill="white"
            />
            {/* Scalloped striped awning */}
            <path
              d="M14 42 Q23 50 32 42 Q41 50 50 42 Q59 50 68 42 Q77 50 86 42"
              stroke="white"
              strokeWidth="5"
              strokeLinecap="round"
              fill="#ea580c"
            />
            {/* Canopy Stripes */}
            <path d="M30 20 L26 42" stroke="#ea580c" strokeWidth="2.5" strokeOpacity="0.4" />
            <path d="M44 20 L44 42" stroke="#ea580c" strokeWidth="2.5" strokeOpacity="0.4" />
            <path d="M56 20 L56 42" stroke="#ea580c" strokeWidth="2.5" strokeOpacity="0.4" />
            <path d="M70 20 L74 42" stroke="#ea580c" strokeWidth="2.5" strokeOpacity="0.4" />

            {/* Pillars */}
            <rect x="21" y="44" width="6" height="26" rx="2" fill="white" />
            <rect x="73" y="44" width="6" height="26" rx="2" fill="white" />

            {/* Produce Counter Base */}
            <rect x="13" y="68" width="74" height="14" rx="4" fill="white" />
            <rect x="16" y="71" width="68" height="3" rx="1.5" fill="#f97316" fillOpacity="0.3" />

            {/* Two-leaf Sprout growing from center */}
            <path
              d="M50 67 C50 54 41 51 36 50 C43 58 46 64 49 67 Z"
              fill="#22c55e"
            />
            <path
              d="M50 67 C50 52 61 49 66 48 C59 57 54 63 51 67 Z"
              fill="#16a34a"
            />

            {/* Market produce items / fruits on counter */}
            <circle cx="26" cy="63" r="5" fill="#f97316" />
            <circle cx="36" cy="64" r="4" fill="#fbbf24" />
            <circle cx="64" cy="64" r="4" fill="#fbbf24" />
            <circle cx="74" cy="63" r="5" fill="#f97316" />
          </svg>
        </div>
      </div>

      {/* Brand Text */}
      <div className={`flex flex-col leading-tight ${isVertical ? 'items-center text-center' : 'items-start'}`}>
        <div className="flex items-baseline gap-1.5">
          <span className={`font-black tracking-[0.25em] text-orange-600 uppercase ${
            size === 'sm' ? 'text-[9px]' : size === 'hero' ? 'text-sm sm:text-base' : size === 'lg' ? 'text-xs' : 'text-[11px]'
          }`}>
            MANA
          </span>
          <span className={`font-black tracking-tight font-serif ${titleSizes[size]} ${isLight ? 'text-white' : 'text-stone-900'}`}>
            Santha<span className="text-orange-600 font-sans">Kart</span>
          </span>
        </div>
        
        {showTagline && (
          <div className={`flex items-center gap-1.5 mt-0.5 ${isVertical ? 'justify-center text-center' : ''}`}>
            <span className={`font-semibold tracking-tight ${isLight ? 'text-orange-100' : 'text-stone-600'} ${
              size === 'sm' ? 'text-[9px]' : size === 'hero' ? 'text-xs sm:text-sm font-medium text-stone-600' : 'text-[11px]'
            }`}>
              {lang === 'te' ? 'మన సంత • ప్రతి ఒక్కరూ అనుసంధానం' : 'Everyone Connected. Every Need Met.'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
