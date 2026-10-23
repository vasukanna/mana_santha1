import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { DEFAULT_CATEGORIES, normalizeCategoryId } from '../data/categories';
import { AP_DISTRICTS } from '../data/apLocations';
import { getMandalsForDistrict } from '../data/locationService';
import { ListingCard } from '../components/ListingCard';
import { CategoryIcon } from '../components/CategoryIcon';
import {
  Search,
  SlidersHorizontal,
  X,
  RotateCw,
  ChevronRight,
  Sprout,
  ChevronLeft,
  Globe
} from 'lucide-react';

export const HomeScreen: React.FC = () => {
  const {
    lang,
    setLang,
    t,
    listings,
    listingsLoading,
    refreshListings,
    selectedDistrict,
    setSelectedDistrict,
    selectedMandal,
    setSelectedMandal,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    sortOption,
    setSortOption,
    onlyVerified,
    setOnlyVerified,
    setActiveTab,
    blockedUserIds
  } = useApp();

  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showSearchBox, setShowSearchBox] = useState(false);
  const [visibleCount, setVisibleCount] = useState<number>(20);

  // Available mandals for current district
  const districtMandals = useMemo(() => {
    return selectedDistrict ? getMandalsForDistrict(selectedDistrict) : [];
  }, [selectedDistrict]);

  // Filter & Sort Logic
  const filteredListings = useMemo(() => {
    return listings
      .filter((listing) => {
        // Exclude blocked users (Google Play Safety)
        if (blockedUserIds && blockedUserIds.includes(listing.sellerId)) {
          return false;
        }

        // Exclude expired listings
        if (listing.status === 'expired') {
          return false;
        }

        // District filter
        if (selectedDistrict && listing.district !== selectedDistrict) {
          if (!listing.district.toLowerCase().includes(selectedDistrict.toLowerCase())) {
            return false;
          }
        }

        // Mandal filter
        if (selectedMandal && listing.mandal !== selectedMandal) {
          if (!listing.mandal.toLowerCase().includes(selectedMandal.toLowerCase())) {
            return false;
          }
        }

        // Category filter (normalized)
        if (selectedCategory) {
          const normListingCat = normalizeCategoryId(listing.category);
          const normSelectedCat = normalizeCategoryId(selectedCategory);
          if (normListingCat !== normSelectedCat) {
            return false;
          }
        }

        // Verified seller filter
        if (onlyVerified && !listing.sellerName) {
          return false;
        }

        // Text search
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchTitle = listing.title.toLowerCase().includes(q);
          const matchDesc = (listing.description || '').toLowerCase().includes(q);
          const matchLoc = (listing.village + ' ' + listing.mandal + ' ' + listing.district).toLowerCase().includes(q);
          const matchSub = (listing.subcategory || '').toLowerCase().includes(q);
          return matchTitle || matchDesc || matchLoc || matchSub;
        }

        return true;
      })
      .sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;

        if (sortOption === 'price_asc') {
          return a.price - b.price;
        }
        if (sortOption === 'price_desc') {
          return b.price - a.price;
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [listings, selectedDistrict, selectedMandal, selectedCategory, onlyVerified, searchQuery, sortOption, blockedUserIds]);

  const featuredListings = useMemo(() => {
    return filteredListings.slice(0, 8);
  }, [filteredListings]);

  const paginatedListings = useMemo(() => {
    return filteredListings.slice(0, visibleCount);
  }, [filteredListings, visibleCount]);

  return (
    <div className="pb-24 pt-2">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 space-y-4">
        
        {/* 
          1. HERO BRAND BANNER:
          Matches EXACT 2nd image UI requested by user (image_cf60b49a.png / image_1419f159.png)
        */}
        <div className="relative rounded-3xl overflow-hidden shadow-xs border border-emerald-200/60 select-none bg-emerald-50">
          <img
            src="/assets/santha_banner_full_hd.png"
            alt="One Santha. Endless Connections. Buy and sell livestock, grains, produce and farm machinery near you."
            className="w-full h-auto object-cover block select-none pointer-events-none"
          />

          {/* 1. Clickable touch target for 'Post an Ad' button in banner */}
          <button
            onClick={() => setActiveTab('sell')}
            className="absolute left-[3%] bottom-[10%] w-[30%] h-[27%] rounded-full cursor-pointer focus:outline-hidden hover:bg-white/15 active:scale-95 transition-all"
            title={lang === 'te' ? 'ప్రకటన పోస్ట్ చేయండి' : 'Post an Ad'}
            aria-label="Post an Ad"
          />

          {/* 2. Clickable touch target for 'Explore Listings' button in banner */}
          <button
            onClick={() => {
              const el = document.getElementById('featured-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="absolute left-[34%] bottom-[10%] w-[27%] h-[27%] rounded-full cursor-pointer focus:outline-hidden hover:bg-black/10 active:scale-95 transition-all"
            title={lang === 'te' ? 'జాబితాలు చూడండి' : 'Explore Listings'}
            aria-label="Explore Listings"
          />
        </div>

        {/* Optional Search & Filters bar */}
        {(showSearchBox || searchQuery) && (
          <div className="flex items-center gap-2 animate-in fade-in duration-200">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={lang === 'te' ? 'వరి ధాన్యం, కొబ్బరి, టమోటాలు, ట్రాక్టర్ వెతకండి...' : 'Search paddy, coconuts, tomatoes, tractors...'}
                className="w-full bg-white border border-stone-300 rounded-full pl-10 pr-9 py-2 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 shadow-2xs min-h-[40px]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-1 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <button
              onClick={() => setShowFilterModal(true)}
              className={`p-2 rounded-full border transition-all active:scale-95 flex items-center justify-center cursor-pointer shadow-2xs min-h-[40px] min-w-[40px] ${
                sortOption !== 'newest' || onlyVerified || selectedMandal
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
              }`}
              title="Filters"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>

            <button
              onClick={refreshListings}
              className="p-2 bg-white text-stone-700 border border-stone-300 hover:bg-stone-50 rounded-full transition-all active:scale-95 flex items-center justify-center cursor-pointer shadow-2xs min-h-[40px] min-w-[40px]"
              title="Refresh"
            >
              <RotateCw className={`w-4 h-4 ${listingsLoading ? 'animate-spin text-emerald-600' : ''}`} />
            </button>
          </div>
        )}

        {/* 
          2. SHOP BY CATEGORY SECTION:
          Matches 12 categories in 6-column x 2-row layout from screenshot (image_891783a8.png)
        */}
        <div className="space-y-2">
          {/* Header Row: 🍃 Shop by Category and View All -> */}
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm sm:text-base font-black text-stone-900 tracking-tight flex items-center gap-1.5">
              <span className="text-emerald-700">🍃</span>
              <span>{lang === 'te' ? 'కేటగిరీల వారిగా కొనండి' : 'Shop by Category'}</span>
            </h2>

            <button
              onClick={() => setActiveTab('categories')}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-0.5 cursor-pointer"
            >
              <span>{lang === 'te' ? 'అన్నీ చూడండి' : 'View All'}</span>
              <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>

          {/* 12 Category Tiles: 6 columns x 2 rows matching screenshot */}
          <div className="grid grid-cols-6 gap-1.5 sm:gap-2.5">
            {DEFAULT_CATEGORIES.slice(0, 12).map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(isSelected ? '' : cat.id)}
                  className={`flex flex-col items-center p-1 sm:p-1.5 rounded-2xl transition-all cursor-pointer group ${
                    isSelected ? 'ring-2 ring-emerald-600 bg-emerald-50/70 shadow-2xs' : 'hover:bg-stone-50'
                  }`}
                >
                  {/* Squircle Tile with soft tinted background */}
                  <div className={`w-11 h-11 sm:w-13 sm:h-13 rounded-2xl flex items-center justify-center mb-1 group-hover:scale-105 transition-transform ${cat.bgColor || 'bg-stone-50'} shadow-2xs border border-stone-100`}>
                    <CategoryIcon name={cat.id} className="w-8 h-8 sm:w-9 sm:h-9 object-contain" />
                  </div>
                  {/* Category Label below in 2 lines centered */}
                  <span className="text-[10px] sm:text-[11px] font-bold text-stone-800 text-center leading-tight line-clamp-2 h-7 sm:h-8 flex items-center justify-center">
                    {lang === 'te' ? cat.nameTe.split(' ')[0] : cat.nameEn}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Filters Pill Bar if filtered */}
        {(selectedCategory || selectedDistrict || selectedMandal || searchQuery) && (
          <div className="flex items-center gap-2 flex-wrap text-xs bg-stone-100 p-2 rounded-2xl border border-stone-200">
            <span className="font-bold text-stone-600">{lang === 'te' ? 'ఫిల్టర్లు:' : 'Filters:'}</span>
            {selectedCategory && (
              <span className="bg-white border border-stone-300 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1 text-[11px]">
                <span>{DEFAULT_CATEGORIES.find(c => c.id === selectedCategory)?.nameEn || selectedCategory}</span>
                <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedCategory('')} />
              </span>
            )}
            {selectedDistrict && (
              <span className="bg-white border border-stone-300 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1 text-[11px]">
                <span>{selectedDistrict}</span>
                <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedDistrict('')} />
              </span>
            )}
            <button
              onClick={() => {
                setSelectedCategory('');
                setSelectedDistrict('');
                setSelectedMandal('');
                setSearchQuery('');
              }}
              className="text-emerald-700 font-bold ml-auto hover:underline cursor-pointer text-[11px]"
            >
              {lang === 'te' ? 'అన్నీ తొలగించండి' : 'Clear All'}
            </button>
          </div>
        )}

        {/* 
          3. FEATURED LISTINGS SECTION:
          Matches ⭐ Featured Listings and View All -> from screenshot (image_891783a8.png)
        */}
        <div id="featured-section" className="space-y-2.5 pt-1">
          {/* Header Row: ⭐ Featured Listings and View All -> */}
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm sm:text-base font-black text-stone-900 tracking-tight flex items-center gap-1.5">
              <span className="text-orange-500">⭐</span>
              <span>{lang === 'te' ? 'ప్రముఖ ప్రకటనలు' : 'Featured Listings'}</span>
            </h2>

            <button
              onClick={() => {
                const el = document.getElementById('all-listings');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-0.5 cursor-pointer"
            >
              <span>{lang === 'te' ? 'అన్నీ చూడండి' : 'View All'}</span>
              <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>

          {/* Skeleton Loaders */}
          {listingsLoading && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-2xl p-2.5 border border-stone-200 space-y-2 animate-pulse">
                  <div className="aspect-4/3 bg-slate-200 rounded-xl w-full" />
                  <div className="h-3.5 bg-slate-200 rounded-md w-3/4" />
                  <div className="h-3 bg-slate-200 rounded-md w-1/2" />
                </div>
              ))}
            </div>
          )}

          {/* Horizontal scroll on mobile / 3-column grid on desktop matching screenshot */}
          {!listingsLoading && featuredListings.length > 0 && (
            <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-none sm:grid sm:grid-cols-3 sm:overflow-visible">
              {featuredListings.slice(0, 3).map((listing) => (
                <div key={listing.id} className="min-w-[195px] sm:min-w-0 flex-1">
                  <ListingCard listing={listing} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 
          4. SUPPORT LOCAL FARMERS BANNER:
          Matches the green bottom card from screenshot (image_891783a8.png)
        */}
        <div className="bg-gradient-to-r from-emerald-50 via-green-50 to-emerald-100/70 border border-emerald-200/80 rounded-2xl p-3 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100/90 text-emerald-800 flex items-center justify-center shrink-0">
              <Sprout className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <h3 className="font-extrabold text-stone-900 text-xs sm:text-sm tracking-tight leading-tight">
                {lang === 'te' ? 'స్థానిక రైతులకు మద్దతు ఇవ్వండి' : 'Support Local Farmers'}
              </h3>
              <p className="text-[10px] sm:text-xs text-stone-600 font-medium leading-tight">
                {lang === 'te' ? 'స్థానికంగా కొనండి • నేరుగా అమ్మండి • కలిసి ఎదగండి' : 'Buy Local • Sell Local • Grow Together'}
              </p>
            </div>
          </div>
          
          {/* Right graphic matching screenshot */}
          <div className="shrink-0 flex items-center pl-2">
            <span className="text-xl sm:text-2xl select-none">🚜🌾</span>
          </div>
        </div>

        {/* 
          5. ALL ADS / MORE ADS FEED:
          Ensures the marketplace is completely functional and browseable
        */}
        <div id="all-listings" className="space-y-3 pt-2">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs sm:text-sm font-extrabold text-stone-700 uppercase tracking-wider">
              {lang === 'te' ? 'అన్ని ప్రకటనలు' : 'Nearby Rural Market Feed'}
            </h3>
            <span className="text-xs text-stone-500 font-semibold">
              {filteredListings.length} {lang === 'te' ? 'ప్రకటనలు' : 'Ads'}
            </span>
          </div>

          {/* Grid for remaining ads */}
          {!listingsLoading && paginatedListings.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 sm:gap-3">
              {paginatedListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!listingsLoading && paginatedListings.length === 0 && (
            <div className="bg-white rounded-2xl p-6 text-center border border-stone-200 space-y-2.5 max-w-sm mx-auto">
              <div className="text-3xl">🌾</div>
              <h3 className="font-extrabold text-stone-900 text-sm">
                {lang === 'te' ? 'ప్రకటనలు ఏవీ లేవు' : 'No listings found'}
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                {lang === 'te'
                  ? 'మీరు ఎంచుకున్న ఫిల్టర్లతో ప్రకటనలు లేవు.'
                  : 'Try selecting a different category or clearing filters.'}
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('');
                  setSelectedDistrict('');
                  setSelectedMandal('');
                  setSearchQuery('');
                }}
                className="bg-emerald-600 text-white font-bold text-xs py-2 px-4 rounded-xl shadow-xs"
              >
                {lang === 'te' ? 'అన్ని ప్రకటనలు చూడండి' : 'View All Ads'}
              </button>
            </div>
          )}

          {/* Load More Button */}
          {!listingsLoading && paginatedListings.length < filteredListings.length && (
            <div className="pt-2 text-center">
              <button
                onClick={() => setVisibleCount(prev => prev + 20)}
                className="bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-300 font-extrabold text-xs py-2.5 px-5 rounded-xl shadow-2xs transition-all active:scale-95 cursor-pointer min-h-[40px]"
              >
                {lang === 'te' ? 'మరిన్ని ప్రకటనలు చూడండి' : 'Load More Listings'}
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-5 space-y-4 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <h3 className="font-extrabold text-stone-900 text-base">
                {lang === 'te' ? 'ఫిల్టర్లు & అమరిక' : 'Filter & Sort'}
              </h3>
              <button
                onClick={() => setShowFilterModal(false)}
                className="w-8 h-8 rounded-full bg-stone-100 text-stone-600 flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Sort Order */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700">
                {lang === 'te' ? 'అమరిక క్రమం' : 'Sort By'}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'newest', label: lang === 'te' ? 'తాజావి' : 'Newest' },
                  { id: 'price_asc', label: lang === 'te' ? 'ధర: తక్కువ' : 'Price: Low' },
                  { id: 'price_desc', label: lang === 'te' ? 'ధర: ఎక్కువ' : 'Price: High' }
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSortOption(s.id as any)}
                    className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      sortOption === s.id
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Mandal Selector if District selected */}
            {selectedDistrict && districtMandals.length > 0 && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">
                  {lang === 'te' ? `${selectedDistrict} మండలము` : `Mandal in ${selectedDistrict}`}
                </label>
                <select
                  value={selectedMandal}
                  onChange={(e) => setSelectedMandal(e.target.value)}
                  className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs font-semibold text-stone-800"
                >
                  <option value="">{lang === 'te' ? 'అన్ని మండలాలు' : 'All Mandals'}</option>
                  {districtMandals.map((m) => (
                    <option key={m.name} value={m.name}>
                      {lang === 'te' ? m.te || m.name : m.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Actions */}
            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={() => {
                  setSelectedCategory('');
                  setSelectedMandal('');
                  setSortOption('newest');
                  setOnlyVerified(false);
                }}
                className="flex-1 py-2.5 rounded-xl border border-stone-200 text-stone-600 font-bold text-xs hover:bg-stone-50 cursor-pointer"
              >
                {lang === 'te' ? 'రీసెట్ చేయండి' : 'Reset'}
              </button>
              <button
                onClick={() => setShowFilterModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-xs hover:bg-emerald-700 cursor-pointer"
              >
                {lang === 'te' ? 'ఫిల్టర్లు వర్తింపజేయి' : 'Apply Filters'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
