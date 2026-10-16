import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { db } from '../firebase';
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  onSnapshot
} from 'firebase/firestore';
import { ListingReport } from '../types';
import {
  ShieldCheck,
  Users,
  ShoppingBag,
  CheckCircle,
  AlertTriangle,
  Settings,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  ArrowLeft,
  Trash2,
  Check,
  Ban,
  Layers,
  Lock,
  HelpCircle,
  Award,
  DollarSign
} from 'lucide-react';

export const AdminScreen: React.FC = () => {
  const {
    lang,
    t,
    isAdmin,
    listings,
    deleteListing,
    toggleFeatureListing,
    updateListingStatus,
    appConfig,
    updateAppConfig,
    paidFeatures,
    togglePaidFeature,
    setActiveTab,
    showToast
  } = useApp();

  const [activeAdminTab, setActiveAdminTab] = useState<'stats' | 'listings' | 'reports' | 'config' | 'features'>('stats');
  const [reports, setReports] = useState<ListingReport[]>([]);
  const [loadingReports, setLoadingReports] = useState(false);
  const [showAdminRoleGuide, setShowAdminRoleGuide] = useState(false);

  // Editable config states
  const [subEnabled, setSubEnabled] = useState(appConfig.subscriptionEnabled);
  const [freeUntilDate, setFreeUntilDate] = useState(appConfig.freeUntil);
  const [postLimit, setPostLimit] = useState(appConfig.freePostLimit || 10);
  const [photoLimit, setPhotoLimit] = useState(appConfig.freePhotoLimit || 3);
  const [featuredPrice, setFeaturedPrice] = useState(appConfig.featuredPrice || 199);

  // Load Reports from Firestore
  useEffect(() => {
    if (!isAdmin) return;
    setLoadingReports(true);
    const reportsCol = collection(db, 'reports');
    const unsub = onSnapshot(reportsCol, (snap) => {
      const list: ListingReport[] = [];
      snap.forEach((d) => {
        list.push({ id: d.id, ...(d.data() as Omit<ListingReport, 'id'>) });
      });
      setReports(list);
      setLoadingReports(false);
    }, (err) => {
      console.warn("Reports fetch notice:", err.message);
      setLoadingReports(false);
    });

    return () => unsub();
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <div className="pb-24 pt-12 px-4 max-w-md mx-auto text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 mx-auto flex items-center justify-center shadow-md">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-black text-stone-900">
          {lang === 'te' ? 'అడ్మిన్ యాక్సెస్ మాత్రమే' : 'Admin Access Only'}
        </h2>
        <p className="text-xs text-stone-500 leading-relaxed">
          {lang === 'te'
            ? 'ఈ ప్యానెల్ కేవలం అధీకృత అడ్మిన్లకు మాత్రమే (naren.papanaboina@gmail.com / vasu.kannaluri@gmail.com).'
            : 'Restricted to authorized administrator emails (naren.papanaboina@gmail.com / vasu.kannaluri@gmail.com).'}
        </p>
        <button
          onClick={() => setActiveTab('home')}
          className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs px-5 py-2.5 rounded-2xl shadow-md cursor-pointer"
        >
          {lang === 'te' ? 'సంత హోమ్ కి వెళ్లండి' : 'Back to Marketplace'}
        </button>
      </div>
    );
  }

  // Stats calculation
  const totalListings = listings.length;
  const activeListings = listings.filter(l => l.status === 'active').length;
  const soldListings = listings.filter(l => l.status === 'sold').length;
  const featuredCount = listings.filter(l => l.featured).length;

  const handleSaveConfig = async () => {
    await updateAppConfig({
      subscriptionEnabled: subEnabled,
      freeUntil: freeUntilDate,
      freePostLimit: Number(postLimit),
      freePhotoLimit: Number(photoLimit),
      featuredPrice: Number(featuredPrice)
    });
  };

  const handleResolveReport = async (reportId: string, status: 'resolved' | 'dismissed') => {
    try {
      const ref = doc(db, 'reports', reportId);
      await updateDoc(ref, { status });
      showToast(`Report marked as ${status}`);
    } catch (e) {
      // quiet
    }
  };

  return (
    <div className="pb-28 pt-2">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 space-y-4">
        {/* Admin Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-stone-900 text-white p-4 sm:p-5 rounded-3xl shadow-lg border border-stone-800">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('home')}
              className="p-2 rounded-2xl bg-stone-800 hover:bg-stone-700 text-stone-300 cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                <h1 className="text-base sm:text-lg font-black tracking-tight">
                  {t.adminDashboard}
                </h1>
              </div>
              <p className="text-xs text-stone-400">
                Super Admin: naren.papanaboina@gmail.com & vasu.kannaluri@gmail.com
              </p>
            </div>
          </div>

          {/* What is Admin Role Explainer Trigger */}
          <button
            onClick={() => setShowAdminRoleGuide(true)}
            className="flex items-center gap-1.5 bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/30 text-xs font-bold px-3 py-1.5 rounded-xl cursor-pointer active:scale-95 transition-all"
          >
            <HelpCircle className="w-4 h-4" />
            <span>{lang === 'te' ? 'అడ్మిన్ పాత్ర & అధికారాల వివరాలు' : 'What is Admin Role?'}</span>
          </button>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto bg-stone-200/80 p-1 rounded-2xl text-xs font-bold scrollbar-none">
          {[
            { id: 'stats', label: lang === 'te' ? 'గణాంకాలు (Stats)' : 'Stats', icon: Users },
            { id: 'listings', label: lang === 'te' ? 'ప్రకటనలు (Ads)' : 'Listings', icon: ShoppingBag },
            { id: 'reports', label: `ఫిర్యాదులు (${reports.length})`, icon: AlertTriangle },
            { id: 'config', label: 'లాంచ్ & పేవాల్', icon: Settings },
            { id: 'features', label: 'ఫీచర్లు & ధరలు', icon: Sparkles }
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeAdminTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveAdminTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                  active
                    ? 'bg-white text-orange-700 font-extrabold shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: STATS */}
        {activeAdminTab === 'stats' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white p-4 rounded-3xl border border-stone-200 shadow-xs">
                <div className="text-stone-500 text-xs font-semibold">{t.totalListings}</div>
                <div className="text-2xl font-black text-stone-900 mt-1">{totalListings}</div>
                <div className="text-[11px] text-emerald-600 font-bold mt-0.5">{activeListings} Active</div>
              </div>

              <div className="bg-white p-4 rounded-3xl border border-stone-200 shadow-xs">
                <div className="text-stone-500 text-xs font-semibold">{t.totalSold}</div>
                <div className="text-2xl font-black text-emerald-700 mt-1">{soldListings}</div>
                <div className="text-[11px] text-stone-400 mt-0.5">Successful trades</div>
              </div>

              <div className="bg-white p-4 rounded-3xl border border-stone-200 shadow-xs">
                <div className="text-stone-500 text-xs font-semibold">Featured Boosts</div>
                <div className="text-2xl font-black text-amber-600 mt-1">{featuredCount}</div>
                <div className="text-[11px] text-stone-400 mt-0.5">Top of feed</div>
              </div>

              <div className="bg-white p-4 rounded-3xl border border-stone-200 shadow-xs">
                <div className="text-stone-500 text-xs font-semibold">{t.totalReports}</div>
                <div className="text-2xl font-black text-red-600 mt-1">{reports.length}</div>
                <div className="text-[11px] text-stone-400 mt-0.5">Moderation items</div>
              </div>
            </div>

            {/* Launch Status Card */}
            <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/20 border border-orange-200 rounded-3xl p-5 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-orange-600" />
                  <h3 className="font-extrabold text-stone-900 text-sm">
                    {lang === 'te' ? 'ఉచిత ప్రారంభ ఆఫర్ స్థితి (Free Launch Status)' : 'Free Launch Period Status'}
                  </h3>
                </div>
                <span className={`text-xs font-black px-3 py-1 rounded-full ${
                  appConfig.subscriptionEnabled ? 'bg-amber-600 text-white' : 'bg-emerald-600 text-white'
                }`}>
                  {appConfig.subscriptionEnabled ? 'PAYWALL ACTIVE' : 'FREE MODE (ACTIVE)'}
                </span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                {lang === 'te'
                  ? `ప్రస్తుతం ఆంధ్రప్రదేశ్ రైతులందరికీ అన్ని ప్రీమియం ఫీచర్లు ఉచితం. గడువు: ${appConfig.freeUntil}. పేవాల్ బటన్ నొక్కితే ఎప్పుడైనా సబ్‌స్క్రిప్షన్ ఆన్ చేయవచ్చు.`
                  : `All paid limits are lifted. Free until ${appConfig.freeUntil}. Toggle subscription paywall ON anytime from the settings tab.`}
              </p>
            </div>
          </div>
        )}

        {/* TAB 2: LISTINGS MODERATION */}
        {activeAdminTab === 'listings' && (
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-stone-200 shadow-xs space-y-3">
            <h3 className="text-sm font-extrabold text-stone-900">
              {lang === 'te' ? `ప్రకటనల ఆమోదం & తొలగింపు (${listings.length})` : `Listing Moderation (${listings.length})`}
            </h3>

            <div className="divide-y divide-stone-100 max-h-[600px] overflow-y-auto">
              {listings.map((l) => (
                <div key={l.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={l.images?.[0] || ''}
                      alt=""
                      className="w-12 h-12 rounded-xl object-cover border border-stone-200 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-extrabold text-stone-900 truncate">
                        {l.title}
                      </div>
                      <div className="text-[11px] text-stone-500 truncate">
                        ₹{l.price.toLocaleString()} • {l.sellerName} • {l.district} ({l.mandal})
                      </div>
                      <div className="text-[10px] text-stone-400">
                        Status: <span className="font-bold uppercase text-orange-600">{l.status}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => toggleFeatureListing(l.id, !l.featured)}
                      className={`p-2 rounded-xl text-xs font-bold cursor-pointer ${
                        l.featured ? 'bg-amber-100 text-amber-800' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                      }`}
                      title="Toggle Feature"
                    >
                      <Sparkles className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => deleteListing(l.id)}
                      className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 cursor-pointer"
                      title="Remove Listing"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: USER REPORTS */}
        {activeAdminTab === 'reports' && (
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-stone-200 shadow-xs space-y-3">
            <h3 className="text-sm font-extrabold text-stone-900">
              {lang === 'te' ? `వినియోగదారుల ఫిర్యాదులు (${reports.length})` : `User Reports (${reports.length})`}
            </h3>

            {reports.length === 0 ? (
              <div className="p-8 text-center text-xs text-stone-500">
                {lang === 'te' ? 'ఎటువంటి పెండింగ్ ఫిర్యాదులు లేవు.' : 'No active complaints or reports submitted.'}
              </div>
            ) : (
              <div className="divide-y divide-stone-100">
                {reports.map((r) => (
                  <div key={r.id} className="py-3 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-red-600 uppercase">
                        Reason: {r.reason}
                      </span>
                      <span className="text-[10px] text-stone-400">
                        {new Date(r.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="text-xs font-bold text-stone-900">
                      Listing: {r.listingTitle}
                    </div>

                    {r.details && (
                      <p className="text-xs text-stone-600 bg-stone-50 p-2 rounded-xl">
                        "{r.details}"
                      </p>
                    )}

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => handleResolveReport(r.id, 'resolved')}
                        className="px-3 py-1 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold hover:bg-emerald-100 cursor-pointer"
                      >
                        {lang === 'te' ? 'పరిష్కరించబడింది' : 'Resolve'}
                      </button>
                      <button
                        onClick={() => handleResolveReport(r.id, 'dismissed')}
                        className="px-3 py-1 bg-stone-100 text-stone-600 rounded-xl text-xs font-bold hover:bg-stone-200 cursor-pointer"
                      >
                        {lang === 'te' ? 'రద్దు' : 'Dismiss'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: CONFIG & PAYWALL SETTINGS */}
        {activeAdminTab === 'config' && (
          <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs space-y-4">
            <h3 className="text-sm font-extrabold text-stone-900 flex items-center gap-2">
              <Settings className="w-4 h-4 text-orange-600" />
              <span>{lang === 'te' ? 'లాంచ్ వ్యవధి & పేవాల్ కాన్ఫిగరేషన్' : 'Launch Period & Paywall Controls'}</span>
            </h3>

            {/* Subscription Switch */}
            <div className="p-4 rounded-2xl border border-stone-200 bg-stone-50 flex items-center justify-between">
              <div>
                <div className="font-bold text-xs text-stone-900">
                  {lang === 'te' ? 'సబ్‌స్క్రిప్షన్ పేవాల్ ఆన్ చేయండి' : 'Enable Subscriptions & Paywall'}
                </div>
                <div className="text-[11px] text-stone-500">
                  {lang === 'te' ? 'ఆఫ్ లో ఉంటే అన్ని ప్రకటనలు మరియు వీడియోలు పూర్తి ఉచితం.' : 'When OFF, all limits are lifted 100% free.'}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSubEnabled(!subEnabled)}
                className={`p-1 rounded-full transition-colors cursor-pointer ${
                  subEnabled ? 'text-orange-600' : 'text-stone-400'
                }`}
              >
                {subEnabled ? <ToggleRight className="w-9 h-9" /> : <ToggleLeft className="w-9 h-9" />}
              </button>
            </div>

            {/* Free Until Date */}
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">
                {lang === 'te' ? 'ఉచిత ఆఫర్ గడువు తేదీ (Free Until Date)' : 'Free Launch Offer Valid Until Date'}
              </label>
              <input
                type="text"
                value={freeUntilDate}
                onChange={(e) => setFreeUntilDate(e.target.value)}
                placeholder="2027-04-16"
                className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs font-bold"
              />
            </div>

            {/* Free Limits */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Free Post Limit
                </label>
                <input
                  type="number"
                  value={postLimit}
                  onChange={(e) => setPostLimit(Number(e.target.value))}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Free Photos / Ad
                </label>
                <input
                  type="number"
                  value={photoLimit}
                  onChange={(e) => setPhotoLimit(Number(e.target.value))}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Boosted Ad Price (₹)
                </label>
                <input
                  type="number"
                  value={featuredPrice}
                  onChange={(e) => setFeaturedPrice(Number(e.target.value))}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs font-bold"
                />
              </div>
            </div>

            <button
              onClick={handleSaveConfig}
              className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-2xl shadow-md cursor-pointer"
            >
              {lang === 'te' ? 'కాన్ఫిగరేషన్ సేవ్ చేయండి' : 'Save Configuration to Firestore (config/app)'}
            </button>
          </div>
        )}

        {/* TAB 5: PAID FEATURES TOGGLES */}
        {activeAdminTab === 'features' && (
          <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs space-y-3">
            <h3 className="text-sm font-extrabold text-stone-900">
              {lang === 'te' ? 'ప్రీమియం ఫీచర్లు & ధరల నియంత్రణ' : 'Paid Features & Pricing Matrix'}
            </h3>
            <p className="text-xs text-stone-500">
              {lang === 'te'
                ? 'ప్రతి ఫీచర్‌ను అడ్మిన్ ఆన్/ఆఫ్ చేయవచ్చు మరియు ధరను నిర్ణయించవచ్చు.'
                : 'Each feature can be toggled on/off and priced individually by admin.'}
            </p>

            <div className="divide-y divide-stone-100">
              {paidFeatures.map((f) => (
                <div key={f.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="flex-1">
                    <div className="text-xs font-extrabold text-stone-900">
                      {f.nameEn} ({f.nameTe})
                    </div>
                    <div className="text-[11px] text-stone-500">
                      {f.descEn}
                    </div>
                    <div className="text-[10px] text-emerald-600 font-bold mt-0.5">
                      Launch status: 100% UNLOCKED FREE
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-black text-stone-800">
                      ₹{f.price}
                    </span>

                    <button
                      onClick={() => togglePaidFeature(f.key, !f.enabled)}
                      className={`p-1 rounded-full cursor-pointer ${
                        f.enabled ? 'text-emerald-600' : 'text-stone-300'
                      }`}
                    >
                      {f.enabled ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8" />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* WHAT IS ADMIN ROLE EXPLAINER MODAL */}
      {showAdminRoleGuide && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[85vh] overflow-y-auto p-5 sm:p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-6 h-6 text-amber-700" />
                </div>
                <div>
                  <h3 className="font-extrabold text-stone-900 text-base">
                    {lang === 'te' ? 'అడ్మిన్ పాత్ర ఏమిటి? (What is Admin Role?)' : 'What is the Admin Role?'}
                  </h3>
                  <p className="text-xs text-stone-500">
                    Administrator Powers & Responsibilities
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowAdminRoleGuide(false)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-stone-700 leading-relaxed">
              <div className="p-3 rounded-2xl bg-orange-50 border border-orange-200/80">
                <span className="font-extrabold text-orange-950 block text-sm mb-1">
                  1. {lang === 'te' ? 'మార్కెట్ నాణ్యత & ప్రకటనల ఆమోదం (Listings Moderation)' : 'Listings Moderation'}
                </span>
                <p>
                  {lang === 'te'
                    ? 'రాష్ట్రవ్యాప్తంగా పోస్ట్ చేయబడిన అన్ని పశువులు, ధాన్యాలు, యంత్రాల ప్రకటనలను పరిశీలించవచ్చు. నకిలీ లేదా అనుచితమైన ప్రకటనలను ఒకే ట్యాప్‌తో తొలగించవచ్చు.'
                    : 'Review all ads across AP, approve genuine agricultural listings, and remove fraudulent or spam ads in 1 tap.'}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200/80">
                <span className="font-extrabold text-amber-950 block text-sm mb-1">
                  2. {lang === 'te' ? 'ప్రత్యేక ప్రకటనల బూస్ట్ (Featured Ads)' : 'Promoting & Boosting Listings'}
                </span>
                <p>
                  {lang === 'te'
                    ? 'మంచి రైతులకు సహాయం చేయడానికి వారి ప్రకటనను ఫీడ్ పైభాగంలో (Top of Feed) ఉంచవచ్చు.'
                    : 'Boost any verified listing to the top of the home feed for maximum buyer visibility.'}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-red-50 border border-red-200/80">
                <span className="font-extrabold text-red-950 block text-sm mb-1">
                  3. {lang === 'te' ? 'ఫిర్యాదుల పరిష్కారం & నిషేధాలు (Reports & User Bans)' : 'Reports & User Bans'}
                </span>
                <p>
                  {lang === 'te'
                    ? 'కొనుగోలుదారులు చేసిన ఫిర్యాదులను (తప్పుడు ధర, మోసం, ఇప్పటికే అమ్మినవి) పరిశీలించి, మోసగాళ్లను శాశ్వతంగా బ్యాన్ చేయవచ్చు.'
                    : 'Investigate user reports, handle disputes, and ban fraudulent accounts permanently.'}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200/80">
                <span className="font-extrabold text-emerald-950 block text-sm mb-1">
                  4. {lang === 'te' ? 'ధృవీకరించబడిన బ్యాడ్జ్ ప్రదానం (Verified Seller Badge)' : 'Granting Verified Badges'}
                </span>
                <p>
                  {lang === 'te'
                    ? 'నిజమైన రైతులకు మరియు ప్రామాణిక వ్యాపారులకు ఆకుపచ్చ టిక్ మార్క్ (Verified Badge) ఇవ్వవచ్చు.'
                    : 'Award the trusted green checkmark badge to authentic farmers and licensed dealers.'}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-stone-100 border border-stone-200">
                <span className="font-extrabold text-stone-900 block text-sm mb-1">
                  5. {lang === 'te' ? 'పేవాల్ & ధరల నియంత్రణ (Paywall & Feature Pricing)' : 'Paywall & Feature Pricing'}
                </span>
                <p>
                  {lang === 'te'
                    ? 'ఉచిత ప్రారంభ ఆఫర్ గడువు తేదీని మార్చడం, పేవాల్‌ను ఎప్పుడు ఆన్ చేయాలో నిర్ణయించడం, మరియు ప్రతి ప్రీమియం ఫీచర్ ధరను మార్చడం అడ్మిన్ నియంత్రణలో ఉంటుంది.'
                    : 'Control subscription activation, extend free launch dates, and change pricing matrix without requiring any app update.'}
                </p>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setShowAdminRoleGuide(false)}
                className="w-full py-3 bg-stone-900 hover:bg-black text-white font-bold text-xs rounded-2xl cursor-pointer"
              >
                {lang === 'te' ? 'అర్థమైంది (Close)' : 'Understood'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
