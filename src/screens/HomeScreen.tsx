import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { DEFAULT_CATEGORIES } from '../data/categories';
import { AP_DISTRICTS } from '../data/apLocations';
import { ListingCard } from '../components/ListingCard';
import { CategoryIcon } from '../components/CategoryIcon';
import { BrandLogo } from '../components/BrandLogo';
import {
  Search,
  Filter,
  Sparkles,
  RotateCw,
  SlidersHorizontal,
  X,
  CheckCircle,
  HelpCircle,
  TrendingUp,
  Tag,
  MapPin,
  PlusCircle,
  ShieldCheck
} from 'lucide-react';

export const HomeScreen: React.FC = () => {
  const {
    lang,
    t,
    listings,
    listingsLoading,
    refreshListings,
    selectedDistrict,
    setSelectedDistrict,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    sortOption,
    setSortOption,
    onlyVerified,
    setOnlyVerified,
    setActiveTab,
    appConfig
  } = useApp();

  const [showFilterModal, setShowFilterModal] = useState(false);

  // Filter & Sort Logic
  const filteredListings = useMemo(() => {
    return listings
      .filter((listing) => {
        // District filter
        if (selectedDistrict && listing.district !== selectedDistrict) {
          if (!listing.district.toLowerCase().includes(selectedDistrict.toLowerCase())) {
            return false;
          }
        }

        // Category filter
        if (selectedCategory && listing.category !== selectedCategory) {
          return false;
        }

        // Verified seller filter
        if (onlyVerified && !listing.sellerName) {
          return false;
        }

        // Text search
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchTitle = listing.title.toLowerCase().includes(q);
          const matchDesc = listing.description.toLowerCase().includes(q);
          const matchLoc = (listing.village + ' ' + listing.mandal + ' ' + listing.district).toLowerCase().includes(q);
          const matchSub = (listing.subcategory || '').toLowerCase().includes(q);
          return matchTitle || matchDesc || matchLoc || matchSub;
        }

        return true;
      })
      .sort((a, b) => {
        // Boost featured first
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;

        if (sortOption === 'price_asc') {
          return a.price - b.price;
        }
        if (sortOption === 'price_desc') {
          return b.price - a.price;
        }
        // Newest default
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [listings, selectedDistrict, selectedCategory, onlyVerified, searchQuery, sortOption]);

  // Featured listings slice
  const featuredListings = useMemo(() => {
    return listings.filter(l => l.featured && l.status === 'active').slice(0, 4);
  }, [listings]);

  // Priority districts shortcut list
  const priorityDistricts = AP_DISTRICTS.filter(d => d.isPriority);

  return (
    <div className="pb-24 pt-1">
      <div className="max-w-5xl mx-auto px-3 sm:px-4 space-y-4">
        
        {/* BIG HERO BRAND BANNER - ATTRACTIVE & CLEAN */}
        <div className="relative overflow-hidden bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 rounded-3xl p-5 sm:p-7 text-white shadow-lg shadow-orange-500/20 border border-orange-400/40">
          {/* Subtle background decorative shapes */}
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -left-10 -top-10 w-36 h-36 bg-amber-300/20 rounded-full blur-xl pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-center justify-between gap-4 text-center sm:text-left">
            {/* Big Brand Logo Emblem */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <BrandLogo size="lg" showTagline={false} lang={lang} isLight={true} />
              <div className="sm:border-l sm:border-white/25 sm:pl-4">
                <div className="inline-block bg-white/20 backdrop-blur-xs text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full mb-1">
                  {lang === 'te' ? 'ఆంధ్రప్రదేశ్ ప్రత్యక్ష గ్రామీణ సంత' : "Andhra Pradesh's Premier Agri Market"}
                </div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight leading-snug">
                  {lang === 'te' ? 'మన సంతలో కొనండి • అమ్మండి' : 'Trade Directly at Mana Santha'}
                </h1>
                <p className="text-xs text-orange-100 font-medium max-w-md mt-0.5">
                  {lang === 'te'
                    ? 'నెల్లూరు (సంగం, కోవూరు), చిత్తూరు, తిరుపతి, కడప, ఒంగోలు, బాపట్ల, అనంతపురం రైతులు & వ్యాపారుల వేదిక.'
                    : 'Livestock, paddy, aqua, vegetables & machinery across Nellore, Chittoor, Kadapa & AP.'}
                </p>
              </div>
            </div>

            {/* Post Ad Quick Button */}
            <button
              onClick={() => setActiveTab('sell')}
              className="bg-white hover:bg-orange-50 text-orange-700 font-black text-xs sm:text-sm px-5 py-3 rounded-2xl shadow-lg active:scale-95 transition-all flex items-center gap-2 shrink-0 cursor-pointer border border-white"
            >
              <PlusCircle className="w-5 h-5 text-orange-600" />
              <span>{t.navSell}</span>
            </button>
          </div>
        </div>

        {/* Search Bar & Filter Controls */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full bg-white border border-stone-200/90 rounded-2xl pl-11 pr-9 py-3 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-0.5 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            onClick={() => setShowFilterModal(true)}
            className={`p-3 rounded-2xl border transition-all active:scale-95 flex items-center justify-center cursor-pointer shadow-xs ${
              sortOption !== 'newest' || onlyVerified
                ? 'bg-orange-600 text-white border-orange-600 shadow-sm'
                : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
            }`}
            title="Filters"
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>

          <button
            onClick={refreshListings}
            className="p-3 bg-white text-stone-700 border border-stone-200 hover:bg-stone-50 rounded-2xl transition-all active:scale-95 flex items-center justify-center cursor-pointer shadow-xs"
            title="Refresh Feed"
          >
            <RotateCw className={`w-5 h-5 ${listingsLoading ? 'animate-spin text-orange-600' : ''}`} />
          </button>
        </div>

        {/* Priority District Quick Scroll Bar */}
        <div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            {/* All AP */}
            <button
              onClick={() => setSelectedDistrict('')}
              className={`px-3.5 py-2 rounded-full whitespace-nowrap font-extrabold transition-all shrink-0 cursor-pointer ${
                selectedDistrict === ''
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-white border border-stone-200 hover:bg-stone-100 text-stone-700'
              }`}
            >
              {t.allDistricts}
            </button>

            {/* Nellore, Chittoor, Tirupati, Kadapa, Ongole, Bapatla, Anantapur */}
            {priorityDistricts.map((d) => {
              const active = selectedDistrict === d.name;
              return (
                <button
                  key={d.code}
                  onClick={() => setSelectedDistrict(active ? '' : d.name)}
                  className={`px-3.5 py-2 rounded-full whitespace-nowrap font-extrabold transition-all shrink-0 cursor-pointer ${
                    active
                      ? 'bg-orange-600 text-white shadow-xs ring-2 ring-orange-500/20'
                      : 'bg-white border border-stone-200 text-stone-800 hover:border-orange-300 hover:bg-orange-50/20'
                  }`}
                >
                  {lang === 'te' ? d.te : d.name.split(' ')[0]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Category Icons Horizontal Bar */}
        <div className="bg-white rounded-3xl p-3.5 border border-stone-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-2.5 px-1">
            <h2 className="text-sm font-black text-stone-900 tracking-tight flex items-center gap-1.5">
              <span>{t.navCategories}</span>
              <span className="text-xs font-semibold text-stone-500">
                ({DEFAULT_CATEGORIES.length})
              </span>
            </h2>

            <button
              onClick={() => setActiveTab('categories')}
              className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-0.5 cursor-pointer"
            >
              <span>{lang === 'te' ? 'అన్నీ చూడండి' : 'View All'}</span>
              <span>→</span>
            </button>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {/* All category pill */}
            <button
              onClick={() => setSelectedCategory('')}
              className={`flex flex-col items-center justify-center p-2 rounded-2xl min-w-[70px] border transition-all shrink-0 cursor-pointer ${
                selectedCategory === ''
                  ? 'bg-orange-50 border-orange-500 text-orange-950 font-black shadow-xs ring-1 ring-orange-500/30'
                  : 'bg-stone-50 border-stone-200/80 text-stone-700 hover:border-stone-300'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center mb-1">
                <Tag className="w-5 h-5" />
              </div>
              <span className="text-[11px] truncate w-full text-center">
                {lang === 'te' ? 'అన్నీ' : 'All'}
              </span>
            </button>

            {/* Each Category */}
            {DEFAULT_CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(isSelected ? '' : cat.id)}
                  className={`flex flex-col items-center justify-center p-2 rounded-2xl min-w-[76px] max-w-[86px] border transition-all shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-orange-50 border-orange-600 text-orange-950 font-black ring-2 ring-orange-500/20 shadow-xs'
                      : 'bg-stone-50 border-stone-200/80 text-stone-700 hover:border-orange-300 hover:bg-orange-50/20'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-1 ${
                    isSelected ? 'bg-orange-600 text-white' : 'bg-white text-stone-700 shadow-xs'
                  }`}>
                    <CategoryIcon name={cat.icon} className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] truncate w-full text-center font-bold leading-tight">
                    {lang === 'te' ? cat.nameTe.split(' ')[0] : cat.nameEn.split(' ')[0]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Featured Listings Carousel (if any) */}
        {featuredListings.length > 0 && !selectedCategory && !searchQuery && (
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-orange-600" />
                <h2 className="text-sm font-black text-stone-900">
                  {lang === 'te' ? 'ప్రత్యేక ప్రకటనలు (టాప్ సంత)' : 'Featured Listings'}
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {featuredListings.map(item => (
                <ListingCard key={item.id} listing={item} isCompact={true} />
              ))}
            </div>
          </div>
        )}

        {/* Main Feed Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black text-stone-900">
                {lang === 'te' ? 'తాజా ప్రకటనలు' : 'Newest in Market'}
              </h2>
              <span className="text-xs font-bold bg-white text-stone-700 px-2.5 py-0.5 rounded-full border border-stone-200">
                {filteredListings.length} {t.resultsFound}
              </span>
            </div>

            {/* Active filters pill */}
            {(selectedDistrict || selectedCategory || searchQuery || onlyVerified) && (
              <button
                onClick={() => {
                  setSelectedDistrict('');
                  setSelectedCategory('');
                  setSearchQuery('');
                  setOnlyVerified(false);
                }}
                className="text-xs text-orange-600 font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>{t.clearFilters}</span>
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Listings Grid */}
          {filteredListings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
              {filteredListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="bg-white rounded-3xl border border-stone-200 p-8 text-center max-w-md mx-auto my-6 shadow-xs">
              <div className="w-16 h-16 rounded-full bg-orange-100 text-orange-600 mx-auto flex items-center justify-center mb-3">
                <Tag className="w-8 h-8" />
              </div>
              <h3 className="font-extrabold text-stone-900 text-base mb-1">
                {t.noListingsFound}
              </h3>
              <p className="text-xs text-stone-500 mb-5 leading-relaxed">
                {t.noListingsSub}
              </p>
              <button
                onClick={() => setActiveTab('sell')}
                className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm px-5 py-2.5 rounded-xl shadow-md active:scale-95 transition-all cursor-pointer"
              >
                {t.navSell}
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl border border-stone-200 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 mb-4">
              <h3 className="font-extrabold text-stone-900 text-base flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-orange-600" />
                <span>{lang === 'te' ? 'ఫిల్టర్లు & సార్టింగ్' : 'Filters & Sorting'}</span>
              </h3>
              <button
                onClick={() => setShowFilterModal(false)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {/* Sort By */}
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-2">
                  {t.sortBy}
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { id: 'newest', label: t.sortNewest },
                    { id: 'price_asc', label: t.sortPriceLowHigh },
                    { id: 'price_desc', label: t.sortPriceHighLow }
                  ].map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSortOption(s.id as any)}
                      className={`p-3 rounded-xl text-left text-xs font-semibold border flex items-center justify-between cursor-pointer ${
                        sortOption === s.id
                          ? 'border-orange-600 bg-orange-50 text-orange-950 font-bold'
                          : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      <span>{s.label}</span>
                      {sortOption === s.id && <CheckCircle className="w-4 h-4 text-orange-600" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Verified Sellers Toggle */}
              <div className="pt-2 border-t border-stone-100">
                <label
                  onClick={() => setOnlyVerified(!onlyVerified)}
                  className="flex items-center justify-between p-3 rounded-xl border border-stone-200 cursor-pointer hover:bg-stone-50"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                    <span className="text-xs font-bold text-stone-900">
                      {t.verifiedOnly}
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={onlyVerified}
                    onChange={() => {}}
                    className="w-4 h-4 accent-orange-600"
                  />
                </label>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setSortOption('newest');
                    setOnlyVerified(false);
                    setShowFilterModal(false);
                  }}
                  className="w-full py-2.5 rounded-xl border border-stone-300 text-stone-700 font-bold text-xs hover:bg-stone-50 cursor-pointer"
                >
                  {t.clearFilters}
                </button>
                <button
                  onClick={() => setShowFilterModal(false)}
                  className="w-full py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md cursor-pointer"
                >
                  {t.applyFilters}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
