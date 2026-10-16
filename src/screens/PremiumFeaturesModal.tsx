import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  Video,
  ShieldCheck,
  TrendingUp,
  Store,
  Bell,
  Eye,
  Headphones
} from 'lucide-react';

export const PremiumFeaturesModal: React.FC = () => {
  const { lang, setActiveTab, appConfig, paidFeatures } = useApp();

  const featureIcons: Record<string, any> = {
    featured_listing: Sparkles,
    verified_seller: ShieldCheck,
    extra_posts: CheckCircle2,
    video_tour: Video,
    bulk_wholesale: Store,
    mandi_rates: Bell,
    seller_analytics: Eye,
    dealer_profile: Store,
    priority_support: Headphones
  };

  return (
    <div className="pb-28 pt-2">
      <div className="max-w-2xl mx-auto px-3 sm:px-4 space-y-4">
        {/* Header */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('profile')}
            className="p-2 rounded-xl text-stone-600 hover:bg-stone-100"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-extrabold text-stone-900">
              {lang === 'te' ? 'ప్రీమియం ఫీచర్లు' : 'Premium & Pro Features'}
            </h1>
            <p className="text-xs text-stone-500">
              SanthaKart Pro Suite
            </p>
          </div>
        </div>

        {/* Free Banner */}
        <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white rounded-3xl p-5 shadow-md space-y-2">
          <div className="flex items-center gap-2">
            <span className="bg-white/20 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
              100% FREE LAUNCH
            </span>
            <span className="text-xs font-bold text-orange-100">
              Valid Till {appConfig.freeUntil}
            </span>
          </div>
          <h2 className="text-xl font-black">
            {lang === 'te'
              ? 'ప్రారంభ ఆఫర్: అన్ని ప్రీమియం ఫీచర్లు మీకు ఉచితం!'
              : 'Launch Offer: All Paid Features Unlocked Free!'}
          </h2>
          <p className="text-xs text-orange-100 leading-relaxed">
            {lang === 'te'
              ? 'సాధారణంగా ప్రతి ఫీచర్‌కు చెల్లించాల్సి ఉంటుంది, కానీ ప్రారంభ వ్యవధిలో రైతులకు, వ్యాపారులకు పూర్తి ఉచితం.'
              : 'Normally these are paid addons, but during our Andhra Pradesh state launch, all limits are lifted for you!'}
          </p>
        </div>

        {/* Features List */}
        <div className="space-y-2.5">
          {paidFeatures.map((f) => {
            const Icon = featureIcons[f.key] || Sparkles;
            return (
              <div
                key={f.id}
                className="bg-white rounded-2xl p-4 border border-stone-200/90 shadow-xs flex items-start justify-between gap-3"
              >
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-stone-900 text-sm">
                      {lang === 'te' ? f.nameTe : f.nameEn}
                    </h3>
                    <p className="text-xs text-stone-500 mt-0.5">
                      {lang === 'te' ? f.descTe : f.descEn}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md uppercase">
                        {lang === 'te' ? 'ఉచితంగా యాక్టివ్' : 'Active Free'}
                      </span>
                      <span className="text-[10px] text-stone-400 line-through">
                        Value ₹{f.price}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
