import React from 'react';
import { Listing } from '../types';
import { useApp } from '../context/AppContext';
import { Heart, MapPin, User, Store, Settings, Video } from 'lucide-react';

interface ListingCardProps {
  listing: Listing;
  compact?: boolean;
}

export const ListingCard: React.FC<ListingCardProps> = ({ listing, compact = false }) => {
  const {
    lang,
    t,
    openListingDetail,
    savedIds,
    toggleSaveListing
  } = useApp();

  const isSaved = savedIds.includes(listing.id);
  const isSold = listing.status === 'sold';

  // Format price in Indian Rupee format
  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(listing.price);

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleSaveListing(listing.id);
  };

  // Determine seller badge type and icon
  const sellerType = listing.customFields?.sellerType || (listing.sellerName?.includes('రైతు') ? 'Farmer Direct' : 'Local Seller');
  const badgeLabel = listing.customFields?.badge || (listing.featured ? 'Best Quality' : 'Fresh Stock');

  const renderSellerIcon = () => {
    if (sellerType.toLowerCase().includes('farmer')) {
      return <User className="w-3 h-3 text-emerald-800" />;
    }
    if (sellerType.toLowerCase().includes('machine')) {
      return <Settings className="w-3 h-3 text-emerald-800" />;
    }
    return <Store className="w-3 h-3 text-emerald-800" />;
  };

  // Clean location format: Nellore, AP / Chittoor, AP / Guntur, AP
  const formatLocation = () => {
    const dist = listing.district.replace(/\(.*\)/, '').trim();
    if (listing.mandal && listing.mandal !== dist) {
      return `${listing.mandal}, ${dist}`;
    }
    return `${dist}, AP`;
  };

  return (
    <div
      onClick={() => openListingDetail(listing)}
      className="bg-white rounded-2xl border border-stone-200/90 shadow-xs hover:shadow-md transition-all active:scale-[0.98] cursor-pointer overflow-hidden flex flex-col group relative"
    >
      {/* Top Image Container */}
      <div className="relative aspect-4/3 w-full bg-stone-100 overflow-hidden">
        <img
          src={listing.images && listing.images.length > 0 ? listing.images[0] : '/assets/nellore_jodipi_1.jpg'}
          alt={listing.title}
          loading="lazy"
          className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${isSold ? 'grayscale' : ''}`}
        />

        {/* Sold Overlay */}
        {isSold && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-20">
            <span className="bg-red-600 text-white font-extrabold px-3 py-1 rounded-xl text-xs uppercase tracking-wider shadow-lg">
              {t.soldOutBadge}
            </span>
          </div>
        )}

        {/* Top-left Stock/Quality Pill Badge matching screenshot */}
        {!isSold && (
          <div className="absolute top-2 left-2 z-10">
            <span className="bg-emerald-600/95 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-xs">
              {badgeLabel}
            </span>
          </div>
        )}

        {/* Video Badge */}
        {listing.video && (
          <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-1 z-10">
            <Video className="w-3 h-3 text-orange-400" />
            <span>Video</span>
          </div>
        )}

        {/* Top Right Save Heart Icon Button matching screenshot */}
        <div className="absolute top-2 right-2 z-10">
          <button
            onClick={handleSave}
            className={`w-7 h-7 rounded-full bg-white/95 backdrop-blur-xs flex items-center justify-center shadow-xs border border-stone-200/80 active:scale-90 transition-transform cursor-pointer ${
              isSaved ? 'text-rose-500 fill-rose-500' : 'text-stone-500 hover:text-rose-500'
            }`}
            title="Save Ad"
          >
            <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>
        </div>
      </div>

      {/* Card Content matching screenshot */}
      <div className="p-2.5 sm:p-3 flex-1 flex flex-col justify-between space-y-1">
        <div>
          {/* Title */}
          <h3 className="font-extrabold text-stone-900 text-xs sm:text-[13px] leading-snug line-clamp-1 group-hover:text-emerald-700 transition-colors">
            {listing.title}
          </h3>

          {/* Price in Bold Green with Unit matching screenshot: ₹1,450 / bag */}
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-[#16a34a] font-black text-sm sm:text-base tracking-tight">
              {formattedPrice}
            </span>
            {listing.priceUnit && (
              <span className="text-[11px] font-medium text-stone-500">
                / {listing.priceUnit}
              </span>
            )}
          </div>

          {/* Location with Pin: Nellore, AP */}
          <div className="flex items-center gap-1 text-[11px] font-medium text-stone-500 mt-0.5">
            <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
            <span className="truncate">{formatLocation()}</span>
          </div>

          {/* Seller Type Badge: Farmer Direct / Local Seller */}
          <div className="mt-1.5 flex items-center">
            <span className="inline-flex items-center gap-1 text-[10px] sm:text-[10.5px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200/70 px-2 py-0.5 rounded-md">
              {renderSellerIcon()}
              <span className="truncate">{sellerType}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
