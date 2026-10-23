import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { AP_DISTRICTS } from '../data/apLocations';
import { APP_VERSION } from '../version';
import {
  User,
  Phone,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  LogOut,
  Trash2,
  FileText,
  Save,
  Globe,
  PlusCircle,
  Eye,
  Bookmark,
  Store,
  ShoppingBag,
  ExternalLink,
  MessageCircle,
  Check,
  ChevronRight,
  TrendingUp,
  Tag,
  Download
} from 'lucide-react';

export const ProfileScreen: React.FC = () => {
  const {
    lang,
    setLang,
    t,
    currentUser,
    userProfile,
    loginWithGoogle,
    logout,
    updateProfileData,
    deleteUserAccount,
    isAdmin,
    setActiveTab,
    appConfig,
    showToast,
    setAuthModalOpen,
    listings,
    savedIds,
    toggleSaveListing,
    openListingDetail,
    updateListingStatus,
    deleteListing,
    incrementContactCount
  } = useApp();

  const [name, setName] = useState(userProfile?.name || currentUser?.displayName || '');
  const [phone, setPhone] = useState(userProfile?.phone || '');
  const [district, setDistrict] = useState(userProfile?.district || 'Nellore (SPSR Nellore)');
  const [mandal, setMandal] = useState(userProfile?.mandal || 'Kavali');
  const [village, setVillage] = useState(userProfile?.village || '');
  const [role, setRole] = useState<'seller' | 'buyer' | 'both'>(userProfile?.role || 'both');
  
  // Active view tab inside profile: 'seller' | 'buyer' | 'details'
  const [activeProfileView, setActiveProfileView] = useState<'seller' | 'buyer' | 'details'>(
    userProfile?.role === 'buyer' ? 'buyer' : 'seller'
  );

  const [saving, setSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [listingToDelete, setListingToDelete] = useState<string | null>(null);

  const currentDistrictObj = useMemo(() => {
    return AP_DISTRICTS.find(d => d.name === district) || AP_DISTRICTS[0];
  }, [district]);

  // User's own listings (Seller listings)
  const myListings = useMemo(() => {
    if (!currentUser) return [];
    return listings.filter(l => 
      l.sellerId === currentUser.uid || 
      (userProfile?.phone && l.sellerPhone === userProfile.phone)
    );
  }, [listings, currentUser, userProfile]);

  // Saved listings (Buyer bookmarks)
  const savedListings = useMemo(() => {
    return listings.filter(l => savedIds.includes(l.id));
  }, [listings, savedIds]);

  // Seller metrics
  const sellerStats = useMemo(() => {
    const totalViews = myListings.reduce((sum, l) => sum + (l.viewsCount || 0), 0);
    const totalCalls = myListings.reduce((sum, l) => sum + (l.callsCount || 0) + (l.whatsappCount || 0), 0);
    const activeAds = myListings.filter(l => l.status === 'active').length;
    const soldAds = myListings.filter(l => l.status === 'sold').length;
    return { totalViews, totalCalls, activeAds, soldAds };
  }, [myListings]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      showToast(lang === 'te' ? 'దయచేసి 10 అంకెల మొబైల్ నంబర్ నమోదు చేయండి' : 'Please enter valid 10-digit mobile number');
      return;
    }

    setSaving(true);
    try {
      await updateProfileData({
        name: name.trim() || 'రైతు మిత్రుడు',
        phone: phone.trim(),
        district,
        mandal,
        village: village.trim(),
        role
      });
      showToast(lang === 'te' ? '✅ ప్రొఫైల్ విజయవంతంగా సేవ్ అయ్యింది' : '✅ Profile updated successfully');
    } catch (e) {
      // error handled in context
    } finally {
      setSaving(false);
    }
  };

  const handleRoleQuickToggle = async (newRole: 'seller' | 'buyer' | 'both') => {
    setRole(newRole);
    if (newRole === 'seller') setActiveProfileView('seller');
    if (newRole === 'buyer') setActiveProfileView('buyer');
    try {
      await updateProfileData({ role: newRole });
      showToast(
        newRole === 'seller'
          ? (lang === 'te' ? '🌾 అమ్మకందారుడు (Seller Mode) ఎంచుకోబడింది' : '🌾 Switched to Seller Mode')
          : newRole === 'buyer'
          ? (lang === 'te' ? '🛒 కొనుగోలుదారుడు (Buyer Mode) ఎంచుకోబడింది' : '🛒 Switched to Buyer Mode')
          : (lang === 'te' ? '🤝 అమ్మకం & కొనుగోలు (Both Modes) ఎంచుకోబడింది' : '🤝 Switched to Both Seller & Buyer')
      );
    } catch (e) {
      // ignore
    }
  };

  if (!currentUser) {
    return (
      <div className="pb-24 pt-8 px-4 max-w-md mx-auto text-center space-y-4">
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 text-white mx-auto flex items-center justify-center shadow-lg shadow-orange-500/30">
          <User className="w-10 h-10" />
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-stone-900">
            {t.loginTitle}
          </h2>
          <p className="text-xs text-stone-500 mt-1 leading-relaxed">
            {t.loginSubtitle}
          </p>
        </div>

        {/* Seller & Buyer Info Cards */}
        <div className="grid grid-cols-2 gap-2 text-left">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
              <Store className="w-4 h-4 text-orange-600" />
              <span>{lang === 'te' ? 'రైతు / అమ్మకందారు' : 'For Sellers'}</span>
            </div>
            <p className="text-[11px] text-amber-950/80 mt-1">
              {lang === 'te' ? 'వరి, మిర్చి, పశువులు, యంత్రాలు ఉచితంగా పోస్ట్ చేయండి' : 'Post crops, livestock, rentals 100% free'}
            </p>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
              <ShoppingBag className="w-4 h-4 text-emerald-600" />
              <span>{lang === 'te' ? 'కొనుగోలుదారు' : 'For Buyers'}</span>
            </div>
            <p className="text-[11px] text-emerald-950/80 mt-1">
              {lang === 'te' ? 'రైతులతో నేరుగా ఫోన్ & వాట్సాప్‌లో మాట్లాడండి' : 'Direct calls & WhatsApp with genuine farmers'}
            </p>
          </div>
        </div>

        <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-3.5 text-left space-y-1.5">
          <div className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-orange-600" />
            <span>{t.launchOfferTitle}</span>
          </div>
          <p className="text-xs text-amber-950/80">
            {lang === 'te'
              ? 'ప్రారంభ ఆఫర్ కింద ఖాతా తెరవడం మరియు ప్రకటనలు పోస్ట్ చేయడం 100% ఉచితం!'
              : 'Creating an account and posting listings is 100% free during our launch period!'}
          </p>
        </div>

        <div className="space-y-2 pt-1">
          <button
            onClick={loginWithGoogle}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm py-3.5 px-4 rounded-2xl shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
              <path d="M12.24 10.285V13.8h6.887C18.2 16.5 15.64 18.5 12.24 18.5c-3.59 0-6.5-2.91-6.5-6.5s2.91-6.5 6.5-6.5c1.61 0 3.09.59 4.23 1.57l2.6-2.6C17.45 2.87 15.01 2 12.24 2 6.58 2 2 6.58 2 12.25s4.58 10.25 10.24 10.25c6.04 0 10.03-4.25 10.03-10.21 0-.69-.07-1.35-.19-2.005H12.24z"/>
            </svg>
            <span>{t.googleSignIn}</span>
          </button>

          <button
            onClick={() => setAuthModalOpen(true)}
            className="w-full bg-white hover:bg-stone-50 border border-stone-300 text-stone-700 font-bold text-xs py-3 px-4 rounded-2xl active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <Sparkles className="w-4 h-4 text-orange-600" />
            <span>{lang === 'te' ? 'తక్షణ ప్రవేశం / డొమైన్ సహాయం (Quick Login / Help)' : 'Instant Quick Login / Domain Help'}</span>
          </button>

          <div className="text-center text-xs text-stone-400 font-semibold pt-2">
            Version {APP_VERSION}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-28 pt-2">
      <div className="max-w-2xl mx-auto px-3 sm:px-4 space-y-4">
        
        {/* Profile Header Card */}
        <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-orange-100 text-orange-700 font-black text-xl flex items-center justify-center shrink-0 border border-orange-200 shadow-inner">
                {currentUser.photoURL ? (
                  <img src={currentUser.photoURL} alt="" className="w-full h-full rounded-2xl object-cover" />
                ) : (
                  (currentUser.displayName || 'రై')[0]
                )}
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h2 className="font-extrabold text-stone-900 text-base">
                    {currentUser.displayName || name || 'రైతు మిత్రుడు'}
                  </h2>
                  {userProfile?.isVerified && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  )}
                </div>
                <div className="text-xs text-stone-500">
                  {currentUser.email || phone || 'User'}
                </div>
                <div className="text-[11px] text-stone-600 font-semibold mt-0.5 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-orange-600" />
                  <span>{village ? `${village}, ` : ''}{mandal ? `${mandal}, ` : ''}{district}</span>
                </div>
              </div>
            </div>

            {isAdmin && (
              <button
                onClick={() => setActiveTab('admin')}
                className="bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
              >
                <ShieldCheck className="w-4 h-4 text-amber-800" />
                <span>Admin</span>
              </button>
            )}
          </div>

          {/* Interactive Role Switcher Pill Bar */}
          <div className="pt-2 border-t border-stone-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wide">
                {lang === 'te' ? 'మీ ఖాతా పాత్ర (Account Role):' : 'Account Role:'}
              </span>
              <span className="text-[11px] font-bold text-orange-700">
                {role === 'seller' 
                  ? (lang === 'te' ? '🌾 అమ్మకందారుడు' : '🌾 Seller') 
                  : role === 'buyer' 
                  ? (lang === 'te' ? '🛒 కొనుగోలుదారుడు' : '🛒 Buyer') 
                  : (lang === 'te' ? '🤝 అమ్మకం & కొనుగోలు' : '🤝 Seller & Buyer')}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-1.5 bg-stone-100 p-1.5 rounded-2xl">
              <button
                type="button"
                onClick={() => handleRoleQuickToggle('seller')}
                className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  role === 'seller'
                    ? 'bg-white text-orange-700 shadow-xs ring-1 ring-orange-500/20'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Store className="w-3.5 h-3.5" />
                <span>{lang === 'te' ? 'అమ్మకందారుడు' : 'Seller'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleQuickToggle('buyer')}
                className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  role === 'buyer'
                    ? 'bg-white text-emerald-700 shadow-xs ring-1 ring-emerald-500/20'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>{lang === 'te' ? 'కొనుగోలుదారుడు' : 'Buyer'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleQuickToggle('both')}
                className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  role === 'both'
                    ? 'bg-white text-stone-900 shadow-xs ring-1 ring-stone-400/20'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <span>🤝 {lang === 'te' ? 'రెండునూ' : 'Both'}</span>
              </button>
            </div>
          </div>

          {/* Profile Views Navigation Tabs: Seller Hub / Buyer Hub / Edit Details */}
          <div className="flex items-center gap-2 border-b border-stone-100 pt-1">
            {(role === 'seller' || role === 'both') && (
              <button
                onClick={() => setActiveProfileView('seller')}
                className={`pb-2.5 text-xs font-extrabold flex items-center gap-1.5 cursor-pointer transition-all ${
                  activeProfileView === 'seller'
                    ? 'text-orange-600 border-b-2 border-orange-600'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                <Store className="w-3.5 h-3.5" />
                <span>{lang === 'te' ? '🌾 నా అమ్మకాలు (Seller Hub)' : '🌾 Seller Hub'}</span>
                <span className="text-[10px] bg-orange-100 text-orange-800 px-1.5 py-0.2 rounded-full font-bold">
                  {myListings.length}
                </span>
              </button>
            )}

            {(role === 'buyer' || role === 'both') && (
              <button
                onClick={() => setActiveProfileView('buyer')}
                className={`pb-2.5 text-xs font-extrabold flex items-center gap-1.5 cursor-pointer transition-all ${
                  activeProfileView === 'buyer'
                    ? 'text-emerald-600 border-b-2 border-emerald-600'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>{lang === 'te' ? '🛒 నా కొనుగోళ్లు (Buyer Hub)' : '🛒 Buyer Hub'}</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-full font-bold">
                  {savedListings.length}
                </span>
              </button>
            )}

            <button
              onClick={() => setActiveProfileView('details')}
              className={`pb-2.5 text-xs font-extrabold flex items-center gap-1.5 cursor-pointer transition-all ${
                activeProfileView === 'details'
                  ? 'text-stone-900 border-b-2 border-stone-900'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>{lang === 'te' ? 'ఖాతా వివరాలు (Edit Profile)' : 'Edit Profile'}</span>
            </button>
          </div>
        </div>

        {/* ----------------- 1. SELLER HUB VIEW ----------------- */}
        {activeProfileView === 'seller' && (
          <div className="space-y-4">
            {/* Seller Quick Performance Banner */}
            <div className="bg-gradient-to-br from-orange-500 to-amber-600 text-white rounded-3xl p-4 sm:p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🌾</span>
                  <div>
                    <h3 className="font-extrabold text-sm sm:text-base">
                      {lang === 'te' ? 'అమ్మకందారు డ్యాష్‌బోర్డు' : 'Seller Dashboard'}
                    </h3>
                    <p className="text-[11px] text-orange-100">
                      {lang === 'te' ? 'మీరు పోస్ట్ చేసిన ఉత్పత్తులు & కొనుగోలుదారుల కాల్స్' : 'Your posted listings and buyer inquiries'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('sell')}
                  className="bg-white hover:bg-orange-50 text-orange-700 font-extrabold text-xs py-2 px-3 rounded-xl shadow-xs active:scale-95 transition-all flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>{lang === 'te' ? '+ కొత్త ప్రకటన' : '+ Post Ad'}</span>
                </button>
              </div>

              {/* Seller Metrics */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/20 text-center">
                <div className="bg-white/10 rounded-2xl p-2.5 backdrop-blur-xs">
                  <div className="text-lg font-black">{sellerStats.activeAds}</div>
                  <div className="text-[10px] text-orange-100 font-semibold">{lang === 'te' ? 'చురుకైనవి' : 'Active Ads'}</div>
                </div>
                <div className="bg-white/10 rounded-2xl p-2.5 backdrop-blur-xs">
                  <div className="text-lg font-black">{sellerStats.totalViews}</div>
                  <div className="text-[10px] text-orange-100 font-semibold">{lang === 'te' ? 'మొత్తం వీక్షణలు' : 'Total Views'}</div>
                </div>
                <div className="bg-white/10 rounded-2xl p-2.5 backdrop-blur-xs">
                  <div className="text-lg font-black">{sellerStats.totalCalls}</div>
                  <div className="text-[10px] text-orange-100 font-semibold">{lang === 'te' ? 'కాల్స్ & వాట్సాప్' : 'Inquiries'}</div>
                </div>
              </div>
            </div>

            {/* My Listings List */}
            <div className="bg-white rounded-3xl p-4 sm:p-5 border border-stone-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                <h4 className="font-extrabold text-stone-900 text-sm">
                  {lang === 'te' ? 'నా అమ్మక ప్రకటనలు' : 'My Listings'} ({myListings.length})
                </h4>
                <button
                  onClick={() => setActiveTab('sell')}
                  className="text-xs font-bold text-orange-600 hover:text-orange-700 cursor-pointer flex items-center gap-1"
                >
                  <span>{lang === 'te' ? '+ కొత్తది వేయండి' : '+ Add New'}</span>
                </button>
              </div>

              {myListings.length === 0 ? (
                <div className="text-center py-8 space-y-3">
                  <div className="w-14 h-14 rounded-full bg-orange-50 text-orange-500 mx-auto flex items-center justify-center">
                    <Store className="w-7 h-7" />
                  </div>
                  <div>
                    <h5 className="font-bold text-stone-900 text-sm">
                      {lang === 'te' ? 'ఇంకా ఎటువంటి ప్రకటనలు పోస్ట్ చేయలేదు' : 'No listings posted yet'}
                    </h5>
                    <p className="text-xs text-stone-500 max-w-xs mx-auto mt-1">
                      {lang === 'te'
                        ? 'వరి, మిర్చి, గేదెలు, మేకలు, ట్రాక్టర్ అద్దె లేదా పొలం లీజు ప్రకటనను ఉచితంగా పోస్ట్ చేయండి.'
                        : 'Post paddy, chilli, cattle, tractor rental, or land lease ads for free.'}
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('sell')}
                    className="inline-flex items-center gap-1.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-xs active:scale-95 transition-all cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>{lang === 'te' ? 'ఇప్పుడే ప్రకటన వేయండి (100% ఉచితం)' : 'Post an Ad Now (100% Free)'}</span>
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-stone-100">
                  {myListings.map((item) => (
                    <div key={item.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3 cursor-pointer" onClick={() => openListingDetail(item)}>
                        <img
                          src={item.images[0] || 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?w=400'}
                          alt=""
                          className="w-16 h-16 rounded-xl object-cover shrink-0 border border-stone-200"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase ${
                              item.status === 'sold'
                                ? 'bg-stone-200 text-stone-700'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}>
                              {item.status === 'sold' ? (lang === 'te' ? 'అమ్మేసాము' : 'Sold') : (lang === 'te' ? 'చురుకుగా ఉంది' : 'Active')}
                            </span>
                            <span className="text-[11px] text-stone-400">
                              {item.mandal}, {item.district}
                            </span>
                          </div>
                          <h5 className="font-extrabold text-stone-900 text-xs sm:text-sm line-clamp-1 mt-0.5 hover:text-orange-600">
                            {item.title}
                          </h5>
                          <div className="text-xs font-black text-orange-700 mt-0.5">
                            ₹{item.price.toLocaleString('en-IN')}
                            {item.quantity ? ` / ${item.quantity}` : ''}
                          </div>
                        </div>
                      </div>

                      {/* Listing Actions */}
                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <button
                          onClick={() => updateListingStatus(item.id, item.status === 'sold' ? 'active' : 'sold')}
                          className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${
                            item.status === 'sold'
                              ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                              : 'border-stone-300 text-stone-700 hover:bg-stone-50'
                          }`}
                        >
                          {item.status === 'sold' 
                            ? (lang === 'te' ? 'రీ-లిస్ట్ చేయండి' : 'Relist') 
                            : (lang === 'te' ? 'అమ్మేసాము' : 'Mark Sold')}
                        </button>

                        <button
                          onClick={() => deleteListing(item.id)}
                          className="p-1.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 cursor-pointer"
                          title="Delete Listing"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ----------------- 2. BUYER HUB VIEW ----------------- */}
        {activeProfileView === 'buyer' && (
          <div className="space-y-4">
            {/* Buyer Quick Performance Banner */}
            <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-3xl p-4 sm:p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🛒</span>
                  <div>
                    <h3 className="font-extrabold text-sm sm:text-base">
                      {lang === 'te' ? 'కొనుగోలుదారు డ్యాష్‌బోర్డు' : 'Buyer Dashboard'}
                    </h3>
                    <p className="text-[11px] text-emerald-100">
                      {lang === 'te' ? 'సేవ్ చేసుకున్న పంటలు, పశువులు మరియు నేరుగా రైతుల ఫోన్లు' : 'Saved listings & direct farmer contact details'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('home')}
                  className="bg-white hover:bg-emerald-50 text-emerald-800 font-extrabold text-xs py-2 px-3 rounded-xl shadow-xs active:scale-95 transition-all flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <span>{lang === 'te' ? 'సంతలో వెతకండి' : 'Browse Santha'}</span>
                  <span>→</span>
                </button>
              </div>

              {/* Buyer Quick Info */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/20 text-center">
                <div className="bg-white/10 rounded-2xl p-2.5 backdrop-blur-xs">
                  <div className="text-lg font-black">{savedListings.length}</div>
                  <div className="text-[10px] text-emerald-100 font-semibold">{lang === 'te' ? 'సేవ్ చేసిన ప్రకటనలు' : 'Saved Listings'}</div>
                </div>
                <div className="bg-white/10 rounded-2xl p-2.5 backdrop-blur-xs">
                  <div className="text-lg font-black">0%</div>
                  <div className="text-[10px] text-emerald-100 font-semibold">{lang === 'te' ? 'దళారీ కమీషన్ (0% Brokerage)' : '0% Commission'}</div>
                </div>
              </div>
            </div>

            {/* Saved Listings / Watchlist */}
            <div className="bg-white rounded-3xl p-4 sm:p-5 border border-stone-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                <h4 className="font-extrabold text-stone-900 text-sm">
                  {lang === 'te' ? 'సేవ్ చేసుకున్న ప్రకటనలు' : 'Saved Listings'} ({savedListings.length})
                </h4>
                <button
                  onClick={() => setActiveTab('home')}
                  className="text-xs font-bold text-emerald-700 hover:underline cursor-pointer"
                >
                  {lang === 'te' ? 'మరిన్ని చూడండి →' : 'Explore more →'}
                </button>
              </div>

              {savedListings.length === 0 ? (
                <div className="text-center py-8 space-y-3">
                  <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
                    <Bookmark className="w-7 h-7" />
                  </div>
                  <div>
                    <h5 className="font-bold text-stone-900 text-sm">
                      {lang === 'te' ? 'మీరు ఇంకా ఏ ప్రకటనలను సేవ్ చేయలేదు' : 'No saved listings yet'}
                    </h5>
                    <p className="text-xs text-stone-500 max-w-xs mx-auto mt-1">
                      {lang === 'te'
                        ? 'సంతలో మీకు నచ్చిన గేదెలు, వరి ధాన్యం, మిర్చి, ట్రాక్టర్ల పై బుక్‌మార్క్ గుర్తును నొక్కండి.'
                        : 'Tap the bookmark icon on crops, buffaloes, or machinery to save them here for quick calls.'}
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('home')}
                    className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-xs active:scale-95 transition-all cursor-pointer"
                  >
                    <span>{lang === 'te' ? 'సంత మార్కెట్‌కు వెళ్లండి' : 'Go to Santha Market'}</span>
                    <span>→</span>
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-stone-100">
                  {savedListings.map((item) => (
                    <div key={item.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3 cursor-pointer" onClick={() => openListingDetail(item)}>
                        <img
                          src={item.images[0] || 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?w=400'}
                          alt=""
                          className="w-16 h-16 rounded-xl object-cover shrink-0 border border-stone-200"
                        />
                        <div>
                          <span className="text-[10px] text-stone-400 block">
                            {item.mandal}, {item.district}
                          </span>
                          <h5 className="font-extrabold text-stone-900 text-xs sm:text-sm line-clamp-1 hover:text-emerald-700">
                            {item.title}
                          </h5>
                          <div className="text-xs font-black text-orange-700 mt-0.5">
                            ₹{item.price.toLocaleString('en-IN')}
                            {item.quantity ? ` / ${item.quantity}` : ''}
                          </div>
                        </div>
                      </div>

                      {/* Direct Call & WhatsApp Buttons for Buyer */}
                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <a
                          href={`tel:${item.sellerPhone}`}
                          onClick={() => incrementContactCount(item.id, 'call')}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs cursor-pointer active:scale-95"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>{lang === 'te' ? 'కాల్' : 'Call'}</span>
                        </a>

                        <a
                          href={`https://wa.me/91${item.sellerPhone}?text=${encodeURIComponent(`నమస్కారం, మీ "${item.title}" గురించి సంతకార్ట్ (SanthaKart) లో చూసాను.`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => incrementContactCount(item.id, 'whatsapp')}
                          className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer active:scale-95"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                          <span>WhatsApp</span>
                        </a>

                        <button
                          onClick={() => toggleSaveListing(item.id)}
                          className="p-1.5 rounded-xl border border-stone-200 text-stone-400 hover:text-red-500 cursor-pointer"
                          title="Remove bookmark"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ----------------- 3. PROFILE DETAILS & FORM VIEW ----------------- */}
        {activeProfileView === 'details' && (
          <form onSubmit={handleSaveProfile} className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <h3 className="font-extrabold text-stone-900 text-sm">
                {t.profileSetupTitle}
              </h3>
              <span className="text-[11px] text-stone-400">
                {lang === 'te' ? 'ప్రకటనలు & సంప్రదింపుల కోసం' : 'Visible on ads'}
              </span>
            </div>

            {/* Name */}
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">
                {t.fullName}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs font-semibold text-stone-900"
              />
            </div>

            {/* Phone (Required) */}
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">
                {t.phoneRequired} *
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="9848012345"
                className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs font-bold text-stone-900"
                required
              />
            </div>

            {/* Role Selection Cards */}
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1.5">
                {t.selectRole}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  {
                    id: 'seller',
                    title: lang === 'te' ? '🌾 అమ్మకందారుడు (Seller)' : '🌾 Seller / Farmer',
                    desc: lang === 'te' ? 'పంటలు, పశువులు, యంత్రాలు అమ్మడానికి' : 'To sell crops, livestock, or machinery'
                  },
                  {
                    id: 'buyer',
                    title: lang === 'te' ? '🛒 కొనుగోలుదారుడు (Buyer)' : '🛒 Buyer / Trader',
                    desc: lang === 'te' ? 'వస్తువులు కొనడానికి లేదా లీజుకు' : 'To buy products, cattle, or hire machinery'
                  },
                  {
                    id: 'both',
                    title: lang === 'te' ? '🤝 రెండునూ (Both)' : '🤝 Both (Buy & Sell)',
                    desc: lang === 'te' ? 'అమ్మకం మరియు కొనుగోలు రెండూ చేయడానికి' : 'Engaged in both buying and selling'
                  }
                ].map((r) => (
                  <button
                    type="button"
                    key={r.id}
                    onClick={() => setRole(r.id as any)}
                    className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                      role === r.id
                        ? 'border-orange-600 bg-orange-50 text-orange-950 ring-2 ring-orange-500/20'
                        : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <div className="text-xs font-bold text-stone-900">{r.title}</div>
                    <div className="text-[10px] text-stone-500 mt-0.5 leading-snug">{r.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* District, Mandal, Village Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  {t.filterDistrict}
                </label>
                <select
                  value={district}
                  onChange={(e) => {
                    setDistrict(e.target.value);
                    const found = AP_DISTRICTS.find(d => d.name === e.target.value);
                    if (found && found.mandals.length > 0) {
                      setMandal(found.mandals[0].name);
                    }
                  }}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs font-semibold text-stone-900 notranslate"
                  translate="no"
                >
                  {AP_DISTRICTS.map((d) => (
                    <option key={d.code} value={d.name} translate="no" className="notranslate">
                      {lang === 'te' ? `${d.name} (${d.te})` : d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  {t.filterMandal} ({currentDistrictObj.mandals.length} {lang === 'te' ? 'మండలాలు' : 'mandals'})
                </label>
                <select
                  value={mandal}
                  onChange={(e) => setMandal(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs font-semibold text-stone-900 notranslate"
                  translate="no"
                >
                  {currentDistrictObj.mandals.map((m) => (
                    <option key={m.name} value={m.name} translate="no" className="notranslate">
                      {lang === 'te' ? `${m.name} (${m.te})` : m.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">
                {t.filterVillage}
              </label>
              <input
                type="text"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                placeholder={lang === 'te' ? 'మీ గ్రామం పేరు' : 'Village name'}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs font-semibold text-stone-900"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-3 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? '...' : t.saveProfile}</span>
            </button>
          </form>
        )}

        {/* Free Launch Period Preview Card */}
        <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/15 border border-orange-200 rounded-3xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-extrabold text-orange-950">
              <Sparkles className="w-4 h-4 text-orange-600" />
              <span>{t.premiumTitle}</span>
            </div>
            <span className="text-[10px] font-black bg-orange-600 text-white px-2 py-0.5 rounded-full uppercase">
              Free Until {appConfig.freeUntil}
            </span>
          </div>
          <p className="text-xs text-stone-600">
            {t.premiumSub}
          </p>
          <button
            onClick={() => setActiveTab('premium_features')}
            className="text-xs font-bold text-orange-700 hover:underline inline-flex items-center gap-1 pt-1 cursor-pointer"
          >
            <span>{t.tryPremium}</span>
            <span>→</span>
          </button>
        </div>

        {/* Language & Settings Options */}
        <div className="bg-white rounded-3xl p-3 border border-stone-200 shadow-xs divide-y divide-stone-100">
          {/* Language Switch */}
          <button
            onClick={() => setLang(lang === 'te' ? 'en' : 'te')}
            className="w-full p-3 flex items-center justify-between hover:bg-stone-50 rounded-2xl transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <Globe className="w-4 h-4 text-stone-500" />
              <span className="text-xs font-bold text-stone-800">
                {lang === 'te' ? 'యాప్ భాష మార్చండి (Change Language)' : 'Change Language to Telugu'}
              </span>
            </div>
            <span className="text-xs font-bold text-orange-600">
              {lang === 'te' ? 'English' : 'తెలుగు'}
            </span>
          </button>

          {/* Admin Role Explainer */}
          <button
            onClick={() => setActiveTab('admin')}
            className="w-full p-3 flex items-center justify-between hover:bg-stone-50 rounded-2xl transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span className="text-xs font-bold text-stone-800">
                {lang === 'te' ? 'అడ్మిన్ అధికారాలు & మార్కెట్ నియంత్రణ' : 'What is Admin Role? (Powers & Policies)'}
              </span>
            </div>
            <span className="text-[11px] font-bold text-orange-600">
              {isAdmin ? 'Manage' : 'Info'} →
            </span>
          </button>

          {/* Get the App / Download */}
          <button
            onClick={() => setActiveTab('download')}
            className="w-full p-3 flex items-center justify-between hover:bg-emerald-50/50 rounded-2xl transition-colors cursor-pointer min-h-[44px]"
          >
            <div className="flex items-center gap-2.5">
              <Download className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold text-stone-800">
                {lang === 'te' ? 'సంతలో యాప్‌ను డౌన్‌లోడ్ చేయండి' : 'Get the Santhalo App (Install / APK)'}
              </span>
            </div>
            <span className="text-xs font-bold text-emerald-600">Free →</span>
          </button>

          {/* Privacy Policy for Google Play */}
          <button
            onClick={() => setActiveTab('privacy')}
            className="w-full p-3 flex items-center justify-between hover:bg-stone-50 rounded-2xl transition-colors cursor-pointer min-h-[44px]"
          >
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold text-stone-800">
                {lang === 'te' ? 'గోప్యతా విధానం (Privacy Policy)' : 'Privacy Policy (Google Play)'}
              </span>
            </div>
            <span className="text-xs text-stone-400">→</span>
          </button>

          {/* Safety & Guidelines */}
          <button
            onClick={() => setActiveTab('safety_policy')}
            className="w-full p-3 flex items-center justify-between hover:bg-stone-50 rounded-2xl transition-colors cursor-pointer min-h-[44px]"
          >
            <div className="flex items-center gap-2.5">
              <FileText className="w-4 h-4 text-stone-500" />
              <span className="text-xs font-bold text-stone-800">
                {t.termsAndPrivacy}
              </span>
            </div>
            <span className="text-xs text-stone-400">→</span>
          </button>

          {/* Sign Out */}
          <button
            onClick={logout}
            className="w-full p-3 flex items-center justify-between hover:bg-stone-50 rounded-2xl text-stone-700 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <LogOut className="w-4 h-4 text-stone-500" />
              <span className="text-xs font-bold">{t.signOut}</span>
            </div>
          </button>
        </div>

        {/* Delete Account (Play Store Compliance) */}
        <div className="text-center pt-2">
          <button
            onClick={() => setShowDeleteModal(true)}
            className="text-xs font-bold text-red-600 hover:text-red-700 hover:underline inline-flex items-center gap-1 cursor-pointer p-2"
          >
            <Trash2 className="w-3.5 h-3.5 text-red-500" />
            <span>{t.deleteAccount}</span>
          </button>
        </div>

        {/* Current App Version */}
        <div className="text-center text-xs text-stone-400 font-semibold pt-4 pb-2">
          Version {APP_VERSION}
        </div>
      </div>

      {/* Delete Account Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full shadow-2xl border border-stone-200">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-stone-900 text-base mb-1">
              {t.deleteAccount}
            </h3>
            <p className="text-xs text-stone-600 mb-5 leading-relaxed">
              {t.deleteAccountConfirm}
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="py-2.5 rounded-xl border border-stone-300 font-bold text-xs text-stone-700 cursor-pointer"
              >
                {lang === 'te' ? 'రద్దు' : 'Cancel'}
              </button>
              <button
                onClick={deleteUserAccount}
                className="py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md cursor-pointer"
              >
                {lang === 'te' ? 'ఖాతా తొలగించండి' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
