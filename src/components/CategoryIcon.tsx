import React, { useState } from 'react';

interface CategoryIconProps {
  name: string;
  className?: string;
  useImageOnly?: boolean;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ name, className = 'w-10 h-10' }) => {
  const [imageError, setImageError] = useState(false);

  // Map category ID to asset image filename
  const iconImageMap: Record<string, string> = {
    cereals_grains: '/assets/categories/cereals_grains.png',
    grains_millets: '/assets/categories/cereals_grains.png',
    Wheat: '/assets/categories/cereals_grains.png',
    cereals: '/assets/categories/cereals_grains.png',

    pulses: '/assets/categories/pulses.png',
    CircleDot: '/assets/categories/pulses.png',

    oilseeds: '/assets/categories/oilseeds.png',
    Droplets: '/assets/categories/oilseeds.png',

    fruits_vegetables: '/assets/categories/fruits_vegetables.png',
    vegetables_fruits: '/assets/categories/fruits_vegetables.png',
    Apple: '/assets/categories/fruits_vegetables.png',

    livestock_poultry: '/assets/categories/livestock_poultry.png',
    livestock: '/assets/categories/livestock_poultry.png',
    PawPrint: '/assets/categories/livestock_poultry.png',

    aqua_fisheries: '/assets/categories/aqua_fisheries.png',
    aqua: '/assets/categories/aqua_fisheries.png',
    Fish: '/assets/categories/aqua_fisheries.png',

    agri_inputs: '/assets/categories/agri_inputs.png',
    fertilisers_pesticides: '/assets/categories/agri_inputs.png',
    FlaskConical: '/assets/categories/agri_inputs.png',
    inputs: '/assets/categories/agri_inputs.png',

    machinery_rentals: '/assets/categories/machinery_rentals.png',
    machinery_tools: '/assets/categories/machinery_rentals.png',
    Tractor: '/assets/categories/machinery_rentals.png',
    machinery: '/assets/categories/machinery_rentals.png',

    irrigation_water: '/assets/categories/irrigation_water.png',
    irrigation: '/assets/categories/irrigation_water.png',
    Waves: '/assets/categories/irrigation_water.png',

    fodder_byproducts: '/assets/categories/fodder_byproducts.png',
    fodder: '/assets/categories/fodder_byproducts.png',
    Sprout: '/assets/categories/fodder_byproducts.png',
    seeds_plants: '/assets/categories/fodder_byproducts.png',

    land_lease: '/assets/categories/land_lease.png',
    land_rent: '/assets/categories/land_lease.png',
    land: '/assets/categories/land_lease.png',
    Landmark: '/assets/categories/land_lease.png',

    other_rural: '/assets/categories/other_rural.png',
    labour_services: '/assets/categories/other_rural.png',
    Users: '/assets/categories/other_rural.png',
    other: '/assets/categories/other_rural.png'
  };

  const imageSrc = iconImageMap[name];

  if (imageSrc && !imageError) {
    return (
      <img
        src={imageSrc}
        alt={name}
        className={`${className} object-contain rounded-xl`}
        onError={() => setImageError(true)}
        loading="lazy"
      />
    );
  }

  // High-fidelity SVG Fallbacks
  switch (name) {
    // 1. Cereals & Grains
    case 'Wheat':
    case 'cereals':
    case 'grains_millets':
    case 'cereals_grains':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
          <circle cx="32" cy="32" r="30" fill="#FEF3C7" />
          <path d="M22 42C22 42 24 30 38 20" stroke="#D97706" strokeWidth="3" strokeLinecap="round" />
          <path d="M38 20C38 20 40 14 44 14C44 18 38 20 38 20Z" fill="#F59E0B" />
          <path d="M34 24C34 24 38 22 40 18C37 18 34 24 34 24Z" fill="#FBBF24" />
          <path d="M30 28C30 28 34 26 36 22C33 22 30 28 30 28Z" fill="#F59E0B" />
          <path d="M26 33C26 33 30 31 32 27C29 27 26 33 26 33Z" fill="#FBBF24" />
          <ellipse cx="32" cy="46" rx="16" ry="6" fill="#F59E0B" />
          <path d="M16 46C16 54 23 56 32 56C41 56 48 54 48 46" fill="#D97706" />
        </svg>
      );

    // 2. Pulses
    case 'CircleDot':
    case 'pulses':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
          <circle cx="32" cy="32" r="30" fill="#FEF9C3" />
          <path d="M14 38C14 48 22 54 32 54C42 54 50 48 50 38H14Z" fill="#B45309" />
          <ellipse cx="32" cy="38" rx="18" ry="7" fill="#F59E0B" />
          <circle cx="26" cy="36" r="2.5" fill="#FEF08A" />
          <circle cx="32" cy="34" r="2.5" fill="#FEF08A" />
          <circle cx="38" cy="37" r="2.5" fill="#FEF08A" />
          <circle cx="35" cy="39" r="2" fill="#FDE047" />
          <circle cx="28" cy="39" r="2" fill="#FDE047" />
        </svg>
      );

    // 3. Oilseeds
    case 'Droplets':
    case 'oilseeds':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
          <circle cx="32" cy="32" r="30" fill="#FEF08A" />
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
            <ellipse
              key={deg}
              cx="32"
              cy="32"
              rx="4"
              ry="14"
              fill="#EAB308"
              transform={`rotate(${deg} 32 32)`}
            />
          ))}
          <circle cx="32" cy="32" r="10" fill="#78350F" />
          <circle cx="32" cy="32" r="8" fill="#451A03" stroke="#92400E" strokeWidth="1" strokeDasharray="2 2" />
        </svg>
      );

    // 4. Fruits & Vegetables
    case 'Apple':
    case 'vegetables_fruits':
    case 'fruits_vegetables':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
          <circle cx="32" cy="32" r="30" fill="#FFE4E6" />
          <circle cx="30" cy="36" r="14" fill="#DC2626" />
          <circle cx="40" cy="40" r="10" fill="#EA580C" />
          <ellipse cx="27" cy="32" rx="4" ry="2" fill="#F87171" opacity="0.6" />
          <path d="M30 22C30 18 28 14 26 12C32 14 34 18 34 22" stroke="#15803D" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M26 22C24 20 20 22 22 24C26 24 26 22 26 22Z" fill="#16A34A" />
          <path d="M34 22C36 20 40 22 38 24C34 24 34 22 34 22Z" fill="#16A34A" />
        </svg>
      );

    // 5. Livestock & Poultry
    case 'PawPrint':
    case 'livestock':
    case 'livestock_poultry':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
          <circle cx="32" cy="32" r="30" fill="#FFEDD5" />
          <path d="M20 24C16 18 18 12 20 10C24 14 24 20 24 24" fill="#78350F" />
          <path d="M44 24C48 18 46 12 44 10C40 14 40 20 40 24" fill="#78350F" />
          <ellipse cx="14" cy="28" rx="7" ry="4" fill="#C2410C" transform="rotate(-20 14 28)" />
          <ellipse cx="50" cy="28" rx="7" ry="4" fill="#C2410C" transform="rotate(20 50 28)" />
          <path d="M22 22C22 18 42 18 42 22C46 28 44 38 42 42C40 46 24 46 22 42C20 38 18 28 22 22Z" fill="#EA580C" />
          <ellipse cx="32" cy="28" rx="6" ry="7" fill="#FFF7ED" />
          <ellipse cx="32" cy="42" rx="10" ry="7" fill="#FBCFE8" />
          <circle cx="28" cy="42" r="2" fill="#9D174D" />
          <circle cx="36" cy="42" r="2" fill="#9D174D" />
          <circle cx="25" cy="27" r="2.5" fill="#1C1917" />
          <circle cx="39" cy="27" r="2.5" fill="#1C1917" />
        </svg>
      );

    // 6. Aqua & Fisheries
    case 'Fish':
    case 'aqua':
    case 'aqua_fisheries':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
          <circle cx="32" cy="32" r="30" fill="#E0F2FE" />
          <path d="M46 32L54 24V40L46 32Z" fill="#0284C7" />
          <ellipse cx="30" cy="32" rx="18" ry="11" fill="#0EA5E9" />
          <ellipse cx="30" cy="34" rx="15" ry="7" fill="#38BDF8" />
          <path d="M30 21L34 16L32 21Z" fill="#0284C7" />
          <path d="M30 43L34 48L32 43Z" fill="#0284C7" />
          <circle cx="20" cy="30" r="2.5" fill="#082F49" />
          <circle cx="19" cy="29" r="1" fill="#FFFFFF" />
        </svg>
      );

    // 7. Agri Inputs
    case 'FlaskConical':
    case 'fertilisers_pesticides':
    case 'inputs':
    case 'agri_inputs':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
          <circle cx="32" cy="32" r="30" fill="#DCFCE7" />
          <path d="M22 26C22 22 42 22 42 26L46 50C46 54 18 54 18 50L22 26Z" fill="#B45309" />
          <path d="M20 25C20 23 44 23 44 25C44 27 20 27 20 25Z" fill="#92400E" />
          <circle cx="32" cy="38" r="7" fill="#FEF3C7" />
          <path d="M32 42V34C32 34 36 34 36 38" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" />
          <path d="M32 37C30 36 28 37 28 39" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    // 8. Machinery & Rentals
    case 'Tractor':
    case 'machinery':
    case 'machinery_tools':
    case 'machinery_rentals':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
          <circle cx="32" cy="32" r="30" fill="#ECFCCB" />
          <rect x="24" y="24" width="22" height="14" rx="2" fill="#15803D" />
          <rect x="34" y="20" width="10" height="8" rx="1" fill="#166534" />
          <rect x="18" y="29" width="8" height="9" rx="1" fill="#16A34A" />
          <rect x="16" y="20" width="3" height="10" fill="#1E293B" />
          <circle cx="42" cy="40" r="10" fill="#1E293B" />
          <circle cx="42" cy="40" r="6" fill="#FACC15" />
          <circle cx="42" cy="40" r="2.5" fill="#0F172A" />
          <circle cx="20" cy="43" r="6" fill="#1E293B" />
          <circle cx="20" cy="43" r="3.5" fill="#FACC15" />
        </svg>
      );

    // 9. Irrigation & Water Solutions
    case 'irrigation':
    case 'irrigation_water':
    case 'Waves':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
          <circle cx="32" cy="32" r="30" fill="#E0F2FE" />
          <rect x="28" y="24" width="8" height="26" rx="2" fill="#0284C7" />
          <rect x="22" y="20" width="20" height="6" rx="2" fill="#0369A1" />
          <path d="M36 28H44C46 28 48 30 48 32V36" stroke="#0284C7" strokeWidth="4" strokeLinecap="round" />
          <circle cx="48" cy="42" r="2.5" fill="#38BDF8" />
          <circle cx="46" cy="48" r="2" fill="#38BDF8" />
        </svg>
      );

    // 10. Fodder & By-products
    case 'Sprout':
    case 'seeds_plants':
    case 'fodder':
    case 'fodder_byproducts':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
          <circle cx="32" cy="32" r="30" fill="#DCFCE7" />
          <ellipse cx="32" cy="48" rx="14" ry="5" fill="#92400E" />
          <path d="M32 46V28" stroke="#15803D" strokeWidth="3" strokeLinecap="round" />
          <path d="M32 34C32 26 22 24 22 30C22 36 32 34 32 34Z" fill="#16A34A" />
          <path d="M32 30C32 22 42 20 42 26C42 32 32 30 32 30Z" fill="#22C55E" />
        </svg>
      );

    // 11. Land & Farm Lease
    case 'Landmark':
    case 'land':
    case 'land_rent':
    case 'land_lease':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
          <circle cx="32" cy="32" r="30" fill="#ECFCCB" />
          <path d="M16 42L28 32H44L48 48H14L16 42Z" fill="#84CC16" />
          <path d="M26 32L24 48" stroke="#4D7C0F" strokeWidth="1.5" />
          <path d="M34 32L34 48" stroke="#4D7C0F" strokeWidth="1.5" />
          <circle cx="34" cy="22" r="7" fill="#EA580C" />
          <path d="M34 29L34 34" stroke="#EA580C" strokeWidth="3" strokeLinecap="round" />
          <circle cx="34" cy="22" r="3" fill="#FFFFFF" />
        </svg>
      );

    // 12. Other Rural Needs
    case 'Users':
    case 'labour_services':
    case 'other':
    case 'other_rural':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
          <circle cx="32" cy="32" r="30" fill="#FEF3C7" />
          <path d="M16 36L26 28L34 34L28 42L16 36Z" fill="#EA580C" />
          <path d="M48 36L38 28L30 34L36 42L48 36Z" fill="#15803D" />
          <circle cx="32" cy="34" r="5" fill="#FBBF24" />
        </svg>
      );

    default:
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
          <circle cx="32" cy="32" r="30" fill="#F1F5F9" />
          <circle cx="32" cy="32" r="10" fill="#64748B" />
        </svg>
      );
  }
};
