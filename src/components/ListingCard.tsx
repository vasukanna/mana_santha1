import React from 'react';
import { Listing } from '../types';
import { useApp } from '../context/AppContext';
import { Phone, MessageCircle, Bookmark, CheckCircle2, MapPin, Sparkles, Video, Share2 } from 'lucide-react';

interface ListingCardProps {
  listing: Listing;
  isCompact?: boolean;
}

export const ListingCard: React.FC<ListingCardProps> = ({ listing, isCompact = false }) => {
  const {
    lang,
    t,
    openListingDetail,
    savedIds,
    toggleSaveListing,
    incrementContactCount,
    showToast
  } = useApp();

  const isSaved = savedIds.includes(listing.id);
  const isSold = listing.status === 'sold';

  // Format price in Indian Rupee format
  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(listing.price);

  const handleCall = (e: React.MouseEvent) => {
    e.stopPropagation();
    incrementContactCount(listing.id, 'call');
    if (listing.sellerPhone) {
      window.location.href = `tel:${listing.sellerPhone}`;
    } else {
      showToast(lang === 'te' ? 'ఫోన్ నంబర్ అందుబాటులో లేదు' : 'Phone number not available');
    }
  };

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    incrementContactCount(listing.id, 'whatsapp');
    if (listing.sellerPhone) {
      const cleanPhone = listing.sellerPhone.replace(/\D/g, '');
      const phoneWithCode = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
      const message = lang === 'te'
        ? `నమస్తే ${listing.sellerName || 'రైతు మిత్రమా'}, నేను సంతకార్ట్ (Mana Santha) లో మీ ప్రకటన "${listing.title}" చూశాను. వివరాలు మాట్లాడటానికి సంప్రదిస్తున్నాను.`
        : `Hello ${listing.sellerName || 'Seller'}, I saw your listing "${listing.title}" on SanthaKart. I would like to inquire about it.`;
      const url = `https://wa.me/${phoneWithCode}?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank');
    } else {
      showToast(lang === 'te' ? 'వాట్సాప్ అందుబాటులో లేదు' : 'WhatsApp not available');
    }
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleSaveListing(listing.id);
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      try {
        await navigator.share({
          title: listing.title,
          text: `${listing.title} - ₹${listing.price} at ${listing.village || ''}, ${listing.district} on SanthaKart!`,
          url: window.location.href
        });
      } catch (err) {
        // user cancelled or share failed
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast(lang === 'te' ? 'లింక్ కాపీ చేయబడింది!' : 'Link copied to clipboard!');
    }
  };

  // Spec highlights
  const specText = listing.customFields?.breed
    ? `${listing.customFields.breed} ${listing.customFields.weight ? `• ${listing.customFields.weight} kg` : ''}`
    : listing.customFields?.variety
    ? `${listing.customFields.variety} ${listing.customFields.quantityAvailable ? `• ${listing.customFields.quantityAvailable}` : ''}`
    : listing.customFields?.machineModel
    ? `${listing.customFields.machineModel}`
    : listing.customFields?.landExtent
    ? `${listing.customFields.landExtent}`
    : listing.quantity || null;

  return (
    <div
      onClick={() => openListingDetail(listing)}
      className="bg-white rounded-2xl border border-stone-200/90 shadow-xs hover:shadow-md transition-all active:scale-[0.99] cursor-pointer overflow-hidden flex flex-col group relative"
    >
      {/* Top Image Container */}
      <div className="relative aspect-4/3 w-full bg-stone-100 overflow-hidden">
        <img
          src={listing.images && listing.images.length > 0 ? listing.images[0] : 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80'}
          alt={listing.title}
          loading="lazy"
          className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${isSold ? 'grayscale' : ''}`}
        />

        {/* Sold Overlay */}
        {isSold && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center">
            <span className="bg-red-600 text-white font-extrabold px-3 py-1 rounded-xl text-sm uppercase tracking-wider shadow-lg">
              {t.soldOutBadge}
            </span>
          </div>
        )}

        {/* Featured Tag */}
        {listing.featured && !isSold && (
          <div className="absolute top-2.5 left-2.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-lg flex items-center gap-1 shadow-md">
            <Sparkles className="w-3 h-3 text-yellow-200" />
            <span>{t.featuredBadge}</span>
          </div>
        )}

        {/* Video Badge */}
        {listing.video && (
          <div className="absolute bottom-2.5 left-2.5 bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
            <Video className="w-3 h-3 text-orange-400" />
            <span>30s Video</span>
          </div>
        )}

        {/* Top Right Save & Share Buttons */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
          <button
            onClick={handleShare}
            className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs text-stone-700 hover:text-orange-600 flex items-center justify-center shadow-md active:scale-90 transition-transform"
            title="Share"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleSave}
            className={`w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center shadow-md active:scale-90 transition-transform ${
              isSaved ? 'text-orange-600 fill-orange-600' : 'text-stone-700 hover:text-orange-600'
            }`}
            title="Save"
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-orange-600 text-orange-600' : ''}`} />
          </button>
        </div>

        {/* Price Overlay Banner */}
        <div className="absolute bottom-2.5 right-2.5 bg-stone-900/85 backdrop-blur-md text-white font-black text-sm sm:text-base px-2.5 py-1 rounded-xl shadow-md border border-white/20">
          {formattedPrice}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-3.5 flex-1 flex flex-col justify-between">
        <div>
          {/* Price details & Negotiable */}
          <div className="flex items-center justify-between gap-1 mb-1">
            <div className="flex items-center gap-1.5">
              {listing.negotiable ? (
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                  {t.negotiable}
                </span>
              ) : (
                <span className="text-[10px] font-medium text-stone-600 bg-stone-100 px-2 py-0.5 rounded-md">
                  {t.fixedPrice}
                </span>
              )}
            </div>

            {/* Seller verification check */}
            <div className="flex items-center gap-1 text-[11px] text-stone-600 font-medium truncate max-w-[140px]">
              <span className="truncate">{listing.sellerName || 'రైతు'}</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
            </div>
          </div>

          {/* Title */}
          <h3 className="font-bold text-stone-900 text-sm sm:text-base leading-snug line-clamp-2 group-hover:text-orange-700 transition-colors">
            {listing.title}
          </h3>

          {/* Key Spec Highlight */}
          {specText && (
            <div className="mt-1 text-xs font-semibold text-amber-800 bg-amber-50/80 px-2 py-0.5 rounded-md inline-block max-w-full truncate border border-amber-200/50">
              {specText}
            </div>
          )}

          {/* Location */}
          <div className="flex items-center gap-1 text-xs text-stone-500 mt-2">
            <MapPin className="w-3.5 h-3.5 text-orange-600 flex-shrink-0" />
            <span className="truncate">
              {[listing.village, listing.mandal, listing.district].filter(Boolean).join(', ')}
            </span>
          </div>
        </div>

        {/* 1-Tap Action Buttons (Call, WhatsApp) */}
        <div className="mt-3 pt-2.5 border-t border-stone-100 grid grid-cols-2 gap-2">
          {/* Call Button */}
          <button
            onClick={handleCall}
            className="flex items-center justify-center gap-1.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs py-2 px-3 rounded-xl shadow-xs active:scale-95 transition-all cursor-pointer"
          >
            <Phone className="w-3.5 h-3.5 fill-white" />
            <span>{t.callSeller}</span>
          </button>

          {/* WhatsApp Button */}
          <button
            onClick={handleWhatsApp}
            className="flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 px-3 rounded-xl shadow-xs active:scale-95 transition-all cursor-pointer"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-white" />
            <span>{t.whatsappSeller}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
