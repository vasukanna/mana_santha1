import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  FileText,
  Eye,
  Phone,
  MessageCircle,
  Sparkles,
  CheckCircle,
  RotateCw,
  Trash2,
  PlusCircle,
  AlertCircle
} from 'lucide-react';

export const MyAdsScreen: React.FC = () => {
  const {
    lang,
    t,
    listings,
    currentUser,
    loginWithGoogle,
    updateListingStatus,
    deleteListing,
    toggleFeatureListing,
    openListingDetail,
    setActiveTab,
    showToast
  } = useApp();

  const [filterTab, setFilterTab] = useState<'all' | 'active' | 'sold'>('active');

  if (!currentUser) {
    return (
      <div className="pb-24 pt-8 px-4 max-w-md mx-auto text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-orange-100 text-orange-600 mx-auto flex items-center justify-center">
          <FileText className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-extrabold text-stone-900">
          {t.myAdsTitle}
        </h2>
        <p className="text-xs text-stone-500">
          {lang === 'te'
            ? 'మీరు పోస్ట్ చేసిన ప్రకటనలను నిర్వహించడానికి గూగుల్ ద్వారా సైన్-ఇన్ అవ్వండి.'
            : 'Sign in to manage, edit, mark sold, or boost your marketplace ads.'}
        </p>
        <button
          onClick={loginWithGoogle}
          className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm px-6 py-3 rounded-2xl shadow-md active:scale-95 transition-all cursor-pointer"
        >
          {t.googleSignIn}
        </button>
      </div>
    );
  }

  // Filter listings by current user sellerId
  const myListings = listings.filter(l => l.sellerId === currentUser.uid);

  const displayedListings = myListings.filter(l => {
    if (filterTab === 'active') return l.status === 'active';
    if (filterTab === 'sold') return l.status === 'sold';
    return true;
  });

  return (
    <div className="pb-24 pt-2">
      <div className="max-w-3xl mx-auto px-3 sm:px-4 space-y-4">
        {/* Header with Post button */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-extrabold text-stone-900">
              {t.myAdsTitle}
            </h1>
            <p className="text-xs text-stone-500">
              {myListings.length} {lang === 'te' ? 'మొత్తం ప్రకటనలు' : 'Total listings posted'}
            </p>
          </div>

          <button
            onClick={() => setActiveTab('sell')}
            className="flex items-center gap-1.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold px-3 py-2 rounded-xl shadow-xs active:scale-95 transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{t.navSell}</span>
          </button>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex bg-stone-200/80 p-1 rounded-2xl text-xs font-bold text-stone-700">
          {(['active', 'sold', 'all'] as const).map((tab) => {
            const labels = {
              active: t.tabActive,
              sold: t.tabSold,
              all: t.tabAll
            };
            const count = tab === 'all'
              ? myListings.length
              : myListings.filter(l => l.status === tab).length;

            return (
              <button
                key={tab}
                onClick={() => setFilterTab(tab)}
                className={`flex-1 py-2 text-center rounded-xl transition-all cursor-pointer ${
                  filterTab === tab
                    ? 'bg-white text-orange-700 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {labels[tab]} ({count})
              </button>
            );
          })}
        </div>

        {/* Listings List */}
        {displayedListings.length > 0 ? (
          <div className="space-y-3">
            {displayedListings.map((item) => {
              const isSold = item.status === 'sold';

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl p-3.5 sm:p-4 border border-stone-200 shadow-xs space-y-3"
                >
                  <div className="flex gap-3">
                    {/* Thumbnail */}
                    <div
                      onClick={() => openListingDetail(item)}
                      className="w-20 h-20 rounded-2xl bg-stone-100 overflow-hidden shrink-0 border border-stone-200 cursor-pointer relative"
                    >
                      <img
                        src={item.images?.[0] || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=200&q=80'}
                        alt=""
                        className={`w-full h-full object-cover ${isSold ? 'grayscale' : ''}`}
                      />
                      {isSold && (
                        <span className="absolute inset-0 bg-black/60 flex items-center justify-center text-[10px] font-black text-white">
                          SOLD
                        </span>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-sm sm:text-base font-black text-stone-900">
                          ₹{item.price.toLocaleString()}
                        </span>
                        {item.featured && (
                          <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-amber-600" />
                            <span>{t.featuredBadge}</span>
                          </span>
                        )}
                      </div>

                      <h3
                        onClick={() => openListingDetail(item)}
                        className="font-extrabold text-stone-900 text-xs sm:text-sm line-clamp-1 hover:text-orange-600 cursor-pointer mt-0.5"
                      >
                        {item.title}
                      </h3>

                      <div className="text-[11px] text-stone-500 mt-1 truncate">
                        📍 {[item.village, item.mandal, item.district].filter(Boolean).join(', ')}
                      </div>

                      {/* Leads / Analytics Metrics */}
                      <div className="flex items-center gap-3 mt-2 text-[11px] font-semibold text-stone-600 bg-stone-50 px-2.5 py-1 rounded-xl w-fit">
                        <span className="flex items-center gap-1" title="Views">
                          <Eye className="w-3.5 h-3.5 text-stone-400" />
                          <span>{item.viewsCount || 1}</span>
                        </span>
                        <span className="flex items-center gap-1 text-orange-700" title="Calls">
                          <Phone className="w-3 h-3 text-orange-600" />
                          <span>{item.callsCount || 0}</span>
                        </span>
                        <span className="flex items-center gap-1 text-emerald-700" title="WhatsApp clicks">
                          <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{item.whatsappCount || 0}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 1-Tap Management Action Bar */}
                  <div className="pt-2 border-t border-stone-100 flex flex-wrap items-center justify-between gap-1.5 text-xs">
                    <div className="flex items-center gap-1.5">
                      {!isSold ? (
                        <button
                          onClick={() => updateListingStatus(item.id, 'sold')}
                          className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold hover:bg-emerald-100 active:scale-95 transition-all cursor-pointer flex items-center gap-1"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>{t.markAsSold}</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => updateListingStatus(item.id, 'active')}
                          className="px-3 py-1.5 rounded-xl bg-orange-50 text-orange-800 border border-orange-300 font-bold hover:bg-orange-100 active:scale-95 transition-all cursor-pointer flex items-center gap-1"
                        >
                          <RotateCw className="w-3.5 h-3.5" />
                          <span>{t.relistAd}</span>
                        </button>
                      )}

                      {/* Boost to Featured Button */}
                      {!item.featured && !isSold && (
                        <button
                          onClick={() => toggleFeatureListing(item.id, true)}
                          className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-300 font-bold hover:bg-amber-100 active:scale-95 transition-all cursor-pointer flex items-center gap-1"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                          <span>{lang === 'te' ? 'టాప్‌కి బూస్ట్ చేయండి (ఉచితం)' : 'Boost to Top (Free)'}</span>
                        </button>
                      )}
                    </div>

                    {/* Delete Button */}
                    <button
                      onClick={() => {
                        if (window.confirm(t.confirmDelete)) {
                          deleteListing(item.id);
                        }
                      }}
                      className="p-1.5 text-stone-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                      title={t.deleteAd}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-8 text-center border border-stone-200 max-w-md mx-auto my-6 shadow-xs">
            <div className="w-14 h-14 rounded-full bg-orange-100 text-orange-600 mx-auto flex items-center justify-center mb-3">
              <FileText className="w-7 h-7" />
            </div>
            <h3 className="font-extrabold text-stone-900 text-base mb-1">
              {lang === 'te' ? 'ఈ విభాగంలో ప్రకటనలు లేవు' : 'No ads found in this tab'}
            </h3>
            <p className="text-xs text-stone-500 mb-5">
              {lang === 'te'
                ? 'మీ సరుకును సులభంగా అమ్మడానికి కొత్త ప్రకటనను పోస్ట్ చేయండి.'
                : 'Post your livestock, harvest or farm equipment in under 2 minutes.'}
            </p>
            <button
              onClick={() => setActiveTab('sell')}
              className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md cursor-pointer"
            >
              {t.navSell}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
