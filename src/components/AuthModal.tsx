import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BrandLogo } from './BrandLogo';
import { AP_DISTRICTS } from '../data/apLocations';
import {
  X,
  AlertTriangle,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  UserCheck,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    authModalOpen,
    setAuthModalOpen,
    authErrorDetail,
    setAuthErrorDetail,
    loginWithGoogle,
    quickLogin,
    lang,
    t
  } = useApp();

  const [copied, setCopied] = useState(false);
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customPhone, setCustomPhone] = useState('');
  const [customDistrict, setCustomDistrict] = useState('Nellore (SPSR Nellore)');
  const [customRole, setCustomRole] = useState<'seller' | 'buyer' | 'both'>('both');

  if (!authModalOpen) return null;

  const currentDomain = typeof window !== 'undefined' ? window.location.hostname : '';
  const firebaseConsoleUrl = 'https://console.firebase.google.com/project/plated-quartet-kc70r/authentication/settings';

  const handleCopyDomain = () => {
    if (currentDomain) {
      navigator.clipboard.writeText(currentDomain);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;
    quickLogin('custom', {
      name: customName.trim(),
      phone: customPhone.trim() || '9440123456',
      district: customDistrict,
      role: customRole
    });
    setAuthModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="relative bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BrandLogo size="sm" showTagline={false} lang={lang} isLight={true} />
            <div>
              <h3 className="font-extrabold text-base tracking-tight">
                {lang === 'te' ? 'సంతకార్ట్ ఖాతా ప్రవేశం' : 'Sign in to SanthaKart'}
              </h3>
              <p className="text-[11px] text-orange-100 font-medium">
                {lang === 'te' ? 'రైతులు, వ్యాపారులు మరియు కొనుగోలుదారుల వేదిక' : 'Connect with AP farmers and buyers'}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setAuthModalOpen(false);
              setAuthErrorDetail(null);
            }}
            className="p-1.5 rounded-full hover:bg-white/20 text-white/90 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-stone-800 text-xs">
          
          {/* Detailed Diagnosis if Auth Failed (e.g. Unauthorized Domain or Popup Blocked) */}
          {authErrorDetail && (
            <div className="bg-amber-50 border border-amber-300 rounded-2xl p-3.5 space-y-2.5">
              <div className="flex items-start gap-2 text-amber-900">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-xs text-amber-950">
                    {lang === 'te' ? 'గూగుల్ లాగిన్ డొమైన్ అనుమతి అవసరం' : 'Google Auth Notice: Domain Not Authorized'}
                  </h4>
                  <p className="text-[11px] text-amber-900 mt-0.5 leading-relaxed">
                    {lang === 'te'
                      ? 'మీరు నెట్లిఫై లో డొమైన్ జోడించినట్లయితే (ఉదా. your-site.netlify.app లేదా santhakart.in), ఆ డొమైన్‌ను ఫైర్‌బేస్ కన్సోల్‌లో కూడా "Authorized Domains" లో చేర్చాలి.'
                      : 'Added domain in Netlify? Netlify serves your website, but Google Sign-In requires your Netlify or custom domain to be authorized in Firebase Console.'}
                  </p>
                </div>
              </div>

              {/* Current Domain Box & Copy Button */}
              <div className="bg-white rounded-xl p-2.5 border border-amber-300 flex items-center justify-between gap-2 shadow-xs">
                <div className="truncate">
                  <span className="text-[10px] uppercase font-bold text-stone-500 block">
                    {lang === 'te' ? 'మీ ప్రస్తుత డొమైన్ (కాపీ చేయండి):' : 'Your Current Active Domain (Copy this):'}
                  </span>
                  <code className="text-xs font-mono font-black text-amber-950 truncate select-all">
                    {currentDomain}
                  </code>
                </div>
                <button
                  onClick={handleCopyDomain}
                  className="bg-amber-900 hover:bg-amber-950 text-white font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shrink-0 active:scale-95 transition-all cursor-pointer shadow-xs"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-300" />
                      <span className="text-emerald-100 font-bold">{lang === 'te' ? 'కాపీ అయింది!' : 'Copied!'}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-amber-200" />
                      <span>{lang === 'te' ? 'కాపీ' : 'Copy'}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Step-by-Step Instructions */}
              <div className="text-[11px] text-stone-700 bg-amber-100/70 p-3 rounded-xl space-y-1.5 border border-amber-200">
                <p className="font-extrabold text-amber-950">
                  {lang === 'te' ? 'ఫైర్‌బేస్ లో నెట్లిఫై డొమైన్ ఆమోదించడానికి 2 దశలు:' : '2 Steps to Authorize your Netlify Domain in Firebase:'}
                </p>
                <p className="leading-snug">
                  1. {lang === 'te' ? 'పై బటన్ ద్వారా మీ డొమైన్ కాపీ చేసుకొని క్రింది లింక్ నొక్కండి' : 'Copy the domain above, then click the button below.'}
                </p>
                <p className="leading-snug">
                  2. {lang === 'te' ? '"Authorized domains" జాబితాలో "Add domain" నొక్కి మీ నెట్లిఫై డొమైన్ పేస్ట్ చేయండి' : 'Under "Authorized domains", click "Add domain" and paste your Netlify/custom domain.'}
                </p>
                
                <a
                  href={firebaseConsoleUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 bg-amber-900 hover:bg-amber-950 text-white font-bold text-[11px] px-3.5 py-2 rounded-xl mt-1 active:scale-95 transition-all shadow-sm"
                >
                  <span>{lang === 'te' ? 'ఫైర్‌బేస్ ఆథరైజ్డ్ డొమైన్స్ తెరవండి' : 'Open Firebase Authorized Domains'}</span>
                  <ExternalLink className="w-3 h-3 text-amber-300" />
                </a>
              </div>
            </div>
          )}

          {/* Primary Action 1: Google Sign In Button */}
          <div>
            <button
              onClick={loginWithGoogle}
              className="w-full bg-white hover:bg-stone-50 text-stone-800 border-2 border-stone-200 font-bold text-xs sm:text-sm py-3 px-4 rounded-2xl shadow-xs active:scale-95 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"/>
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
              </svg>
              <span>{t.googleSignIn}</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center my-3">
            <div className="border-t border-stone-200 w-full" />
            <span className="bg-white px-3 text-[10px] font-bold text-stone-600 uppercase tracking-wider absolute">
              {lang === 'te' ? 'లేదా తక్షణ ప్రవేశం (పరిశీలన కొరకు)' : 'OR INSTANT ACCESS (TEST / DEMO)'}
            </span>
          </div>

          {/* Instant Quick Login Options */}
          <div className="space-y-2">
            <div className="text-[11px] font-bold text-stone-700 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-orange-600" />
              <span>
                {lang === 'te' ? 'ఎటువంటి డొమైన్ సెటప్ లేకుండా వెంటనే పరీక్షించండి:' : 'Test directly without domain configuration:'}
              </span>
            </div>

            {/* Quick Farmer Login Button */}
            <button
              onClick={() => {
                quickLogin('farmer');
                setAuthModalOpen(false);
              }}
              className="w-full bg-gradient-to-r from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 border border-emerald-300 text-emerald-950 p-3 rounded-2xl flex items-center justify-between text-left active:scale-95 transition-all cursor-pointer group shadow-xs"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-extrabold text-xs text-emerald-950 flex items-center gap-1.5">
                    <span>{lang === 'te' ? 'రైతు / అమ్మకందారుగా ప్రవేశించండి' : 'Quick Login as AP Farmer / Seller'}</span>
                    <span className="bg-emerald-600 text-white text-[9px] px-1.5 py-0.2 rounded font-black">
                      Verified
                    </span>
                  </div>
                  <div className="text-[10px] text-emerald-700 font-medium">
                    వెంకటేశ్వర్లు రెడ్డి • నెల్లూరు (సావలీ) • 9440123456
                  </div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-emerald-600 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Quick Admin Login Button */}
            <button
              onClick={() => {
                quickLogin('admin');
                setAuthModalOpen(false);
              }}
              className="w-full bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 border border-amber-300 text-amber-950 p-3 rounded-2xl flex items-center justify-between text-left active:scale-95 transition-all cursor-pointer group shadow-xs"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center font-black">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-extrabold text-xs text-amber-950 flex items-center gap-1.5">
                    <span>{lang === 'te' ? 'అడ్మిన్ గా ప్రవేశించండి (Vasu)' : 'Login as Admin (Vasu Kannaluri)'}</span>
                    <span className="bg-amber-600 text-white text-[9px] px-1.5 py-0.2 rounded font-black">
                      Super Admin
                    </span>
                  </div>
                  <div className="text-[10px] text-amber-800 font-medium truncate">
                    vasu.kannaluri@gmail.com • పూర్తి అడ్మిన్ అధికారాలు
                  </div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-amber-600 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Custom Farmer Details Toggle */}
            {!showCustomForm ? (
              <button
                onClick={() => setShowCustomForm(true)}
                className="w-full text-center py-2 text-[11px] font-bold text-orange-600 hover:text-orange-700 hover:underline cursor-pointer"
              >
                {lang === 'te' ? '+ మీ స్వంత పేరు, మొబైల్ నంబర్ తో ప్రవేశించండి' : '+ Enter custom farmer name & mobile number'}
              </button>
            ) : (
              <form onSubmit={handleCustomSubmit} className="bg-stone-50 border border-stone-200 rounded-2xl p-3 space-y-2 mt-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[11px] text-stone-700">
                    {lang === 'te' ? 'కస్టమ్ వివరాలు నమోదు చేయండి:' : 'Enter Custom Farmer Details:'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowCustomForm(false)}
                    className="text-stone-400 hover:text-stone-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-stone-500 block mb-0.5">
                    {lang === 'te' ? 'మీ పేరు *' : 'Farmer Name *'}
                  </label>
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="ఉదా: రాఘవయ్య"
                    className="w-full bg-white border border-stone-200 rounded-xl p-2 text-xs font-semibold"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-stone-500 block mb-0.5">
                    {lang === 'te' ? 'ఫోన్ నంబర్ *' : 'Phone Number *'}
                  </label>
                  <input
                    type="tel"
                    value={customPhone}
                    onChange={(e) => setCustomPhone(e.target.value)}
                    placeholder="9440123456"
                    className="w-full bg-white border border-stone-200 rounded-xl p-2 text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-stone-500 block mb-0.5">
                    {lang === 'te' ? 'జిల్లా *' : 'District *'}
                  </label>
                  <select
                    value={customDistrict}
                    onChange={(e) => setCustomDistrict(e.target.value)}
                    className="w-full bg-white border border-stone-200 rounded-xl p-2 text-xs font-semibold"
                  >
                    {AP_DISTRICTS.map((d) => (
                      <option key={d.name} value={d.name}>
                        {lang === 'te' ? d.te : d.name}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 rounded-xl text-xs active:scale-95 transition-all shadow-xs"
                >
                  {lang === 'te' ? 'ప్రారంభించండి' : 'Continue'}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-stone-50 p-3 text-center border-t border-stone-100 text-[10px] text-stone-500">
          {lang === 'te'
            ? 'సంతకార్ట్ - ఆంధ్రప్రదేశ్ ప్రత్యక్ష గ్రామీణ మార్కెట్'
            : 'SanthaKart - Direct Agricultural Marketplace for Andhra Pradesh'}
        </div>
      </div>
    </div>
  );
};
