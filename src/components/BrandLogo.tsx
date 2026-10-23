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
  isLight = false,
  layout = 'vertical'
}) => {
  const logoHeights = {
    sm: 'h-9 sm:h-10',
    md: 'h-11 sm:h-12',
    lg: 'h-16 sm:h-20',
    xl: 'h-24 sm:h-28',
    hero: 'h-32 sm:h-40'
  };

  return (
    <div className={`flex flex-col ${layout === 'vertical' ? 'items-start text-left' : 'items-center text-center'}`}>
      <img
        src="/assets/santhalo_header_logo.png"
        alt="Santhalo - Everyone Connected. Every Need Met."
        className={`${logoHeights[size]} w-auto object-contain transition-transform`}
        onError={(e) => {
          (e.target as HTMLImageElement).src = '/assets/aistudio/image_2c8a04ba.png';
        }}
      />
    </div>
  );
};
