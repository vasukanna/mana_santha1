import React from 'react';
import { useApp } from '../context/AppContext';
import { ListingCard } from '../components/ListingCard';
import { Bookmark, ArrowLeft } from 'lucide-react';

export const SavedItemsScreen: React.FC = () => {
  const { lang, t, listings, savedIds, setActiveTab } = useApp();

  const savedListings = listings.filter(l => savedIds.includes(l.id));

  return (
    <div className="pb-24 pt-2">
      <div className="max-w-3xl mx-auto px-3 sm:px-4 space-y-4">
        {/* Header */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('home')}
            className="p-2 rounded-xl text-stone-600 hover:bg-stone-100"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-extrabold text-stone-900">
              {t.savedTitle}
            </h1>
            <p className="text-xs text-stone-500">
              {savedListings.length} {lang === 'te' ? 'వస్తువులు సేవ్ చేయబడ్డాయి' : 'saved items'}
            </p>
          </div>
        </div>

        {/* Saved Listings Grid */}
        {savedListings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {savedListings.map((item) => (
              <ListingCard key={item.id} listing={item} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-8 text-center border border-stone-200 max-w-md mx-auto my-8 shadow-xs">
            <div className="w-14 h-14 rounded-full bg-orange-100 text-orange-600 mx-auto flex items-center justify-center mb-3">
              <Bookmark className="w-7 h-7" />
            </div>
            <h3 className="font-extrabold text-stone-900 text-base mb-1">
              {t.noSavedItems}
            </h3>
            <p className="text-xs text-stone-500 mb-5 leading-relaxed">
              {lang === 'te'
                ? 'మీకు నచ్చిన పశువులు లేదా పంటల ప్రకటనలను సేవ్ చేసుకోవడానికి బుక్‌మార్క్ చిహ్నాన్ని నొక్కండి.'
                : 'Tap the bookmark icon on any listing to save it here for quick comparison.'}
            </p>
            <button
              onClick={() => setActiveTab('home')}
              className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md cursor-pointer"
            >
              {lang === 'te' ? 'సరుకు చూడండి' : 'Browse Marketplace'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
