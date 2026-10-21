import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  showTagline?: boolean;
  lang?: 'te' | 'en';
  isLight?: boolean;
  layout?: 'horizontal' | 'vertical';
  variant?: 'full' | 'emblem';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showTagline = true,
  lang = 'te',
  isLight = false,
  layout = 'vertical'
}) => {
  const logoHeights = {
    sm: 'h-10 sm:h-12',
    md: 'h-14 sm:h-16',
    lg: 'h-20 sm:h-24',
    xl: 'h-28 sm:h-32',
    hero: 'h-36 sm:h-44'
  };

  return (
    <div className="flex flex-col items-center text-center">
      {/* Official Santhalo Logo Image */}
      <div className={`relative flex items-center justify-center flex-shrink-0 transition-transform ${
        isLight ? 'bg-white rounded-2xl p-1.5 shadow-md shadow-orange-950/20 ring-2 ring-white/60' : ''
      }`}>
        <img
          src="/assets/aistudio/image_2c8a04ba.png"
          alt="Santhalo - Mana Santha Rural Market"
          className={`${logoHeights[size]} w-auto object-contain drop-shadow-xs`}
          onError={(e) => {
            // Fallback to /logo.png if needed
            (e.target as HTMLImageElement).src = '/logo.png';
          }}
        />
      </div>

      {/* "Everyone Connected. Every Need Met." under logo */}
      {showTagline && (
        <div className="mt-1 text-center">
          <span className={`text-[10.5px] sm:text-xs font-extrabold tracking-tight block whitespace-nowrap ${
            isLight ? 'text-orange-100 font-extrabold drop-shadow-xs' : 'text-stone-700'
          }`}>
            Everyone Connected. Every Need Met.
          </span>
        </div>
      )}
    </div>
  );
};
