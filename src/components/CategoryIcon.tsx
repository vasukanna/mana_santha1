import React from 'react';
import {
  Beef,
  Fish,
  Wheat,
  CircleDot,
  Droplets,
  Flame,
  Apple,
  Carrot,
  Sprout,
  Tractor,
  MapPin,
  PackageCheck,
  Tag
} from 'lucide-react';

interface CategoryIconProps {
  name: string;
  className?: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ name, className = 'w-5 h-5' }) => {
  switch (name) {
    case 'Beef':
      return <Beef className={className} />;
    case 'Fish':
      return <Fish className={className} />;
    case 'Wheat':
      return <Wheat className={className} />;
    case 'CircleDot':
      return <CircleDot className={className} />;
    case 'Droplets':
      return <Droplets className={className} />;
    case 'Flame':
      return <Flame className={className} />;
    case 'Apple':
      return <Apple className={className} />;
    case 'Carrot':
      return <Carrot className={className} />;
    case 'Sprout':
      return <Sprout className={className} />;
    case 'Tractor':
      return <Tractor className={className} />;
    case 'MapPin':
      return <MapPin className={className} />;
    case 'PackageCheck':
      return <PackageCheck className={className} />;
    default:
      return <Tag className={className} />;
  }
};
