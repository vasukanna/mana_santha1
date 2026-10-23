import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BrandLogo } from './BrandLogo';
import { AP_DISTRICTS } from '../data/apLocations';
import { MapPin, Globe, Sparkles, Bookmark, ShieldCheck, ChevronDown, CheckCircle2, User, Download } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    lang,
    setLang,
    t,
    currentUser,
    selectedDistrict,
    setSelectedDistrict,
    selectedMandal,
    setSelectedMandal,
    setActiveTab,
    savedIds,
    isAdmin,
    appConfig
  } = useApp();

  const [showDistrictModal, setShowDistrictModal] = useState(false);

  const currentDistrictObj = AP_DISTRICTS.find(d => d.name === selectedDistrict);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-stone-100 shadow-xs">
        {/* Main Header Bar - Clean matching screenshots */}
        <div className="max-w-5xl mx-auto px-3 sm:px-4 py-2 flex items-center justify-between gap-2">
          {/* Brand Logo with Tagline */}
          <div
            onClick={() => setActiveTab('home')}
            className="cursor-pointer active:scale-98 transition-transform"
          >
            <BrandLogo size="md" showTagline={true} lang={lang} layout="vertical" />
          </div>

          {/* Right Action Pills matching screenshots */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* District Selector Pill */}
            <button
              onClick={() => setShowDistrictModal(true)}
              className="flex items-center gap-1 bg-white hover:bg-stone-50 text-stone-800 text-xs font-semibold px-2.5 sm:px-3 py-1.5 rounded-full border border-stone-300 active:scale-95 transition-all max-w-[130px] sm:max-w-[190px] shadow-xs cursor-pointer min-h-[38px]"
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-800 shrink-0" />
              <span className="truncate text-[11px] sm:text-xs">
                {selectedDistrict
                  ? (lang === 'te' ? currentDistrictObj?.te || selectedDistrict : currentDistrictObj?.name || selectedDistrict)
                  : (lang === 'te' ? 'ఆంధ్రప్రదేశ్ మొత్తం' : 'All Andhra Pradesh')}
              </span>
              <ChevronDown className="w-3 h-3 text-stone-500 shrink-0" />
            </button>

            {/* Language Selector Pill - Always visible matching screenshot */}
            <button
              onClick={() => setLang(lang === 'te' ? 'en' : 'te')}
              className="flex items-center gap-1.5 bg-white hover:bg-stone-50 text-emerald-800 text-xs font-bold px-2.5 sm:px-3 py-1.5 rounded-full border border-stone-300 active:scale-95 transition-all shadow-xs cursor-pointer min-h-[38px] shrink-0"
              title="భాష మార్చండి / Change Language"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-800 shrink-0" />
              <span className="font-extrabold">{lang === 'te' ? 'English' : 'తెలుగు'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* District Selection Modal */}
      {showDistrictModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden border border-stone-200">
            {/* Modal Header */}
            <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-gradient-to-r from-orange-50 to-amber-50">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-orange-600 text-white flex items-center justify-center shadow-sm">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-stone-900 text-base">
                    {lang === 'te' ? 'మీ జిల్లా & మండలం ఎంచుకోండి' : 'Choose Your District & Mandal'}
                  </h3>
                  <p className="text-xs text-stone-500 font-medium">
                    {lang === 'te' ? 'నెల్లూరు (సంగం, కోవూరు), చిత్తూరు, తిరుపతి తదితర ప్రాంతాలు' : 'Filter ads by AP rural locations'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowDistrictModal(false)}
                className="w-8 h-8 rounded-full bg-stone-200 hover:bg-stone-300 text-stone-700 flex items-center justify-center text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* District List with Priority Districts Highlighted */}
            <div className="p-4 overflow-y-auto space-y-3.5">
              {/* Reset to All AP Option */}
              <button
                onClick={() => {
                  setSelectedDistrict('');
                  setSelectedMandal('');
                  setShowDistrictModal(false);
                }}
                className={`w-full p-3.5 rounded-2xl text-left border flex items-center justify-between transition-all cursor-pointer ${
                  selectedDistrict === ''
                    ? 'border-orange-500 bg-orange-50 text-orange-950 font-bold ring-2 ring-orange-500/20'
                    : 'border-stone-200 hover:border-orange-300 bg-white text-stone-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                    AP
                  </div>
                  <div>
                    <div className="font-extrabold text-sm text-stone-900">
                      {lang === 'te' ? 'ఆంధ్రప్రదేశ్ మొత్తం (అన్ని జిల్లాలు)' : 'All Andhra Pradesh (Entire State)'}
                    </div>
                    <div className="text-xs text-stone-500">
                      {lang === 'te' ? 'రాష్ట్రవ్యాప్త ప్రకటనలు చూడండి' : 'View all ads from all AP districts'}
                    </div>
                  </div>
                </div>
                {selectedDistrict === '' && (
                  <CheckCircle2 className="w-5 h-5 text-orange-600" />
                )}
              </button>

              {/* Priority Districts Section */}
              <div className="pt-2">
                <div className="text-xs font-black text-orange-700 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-600"></span>
                  <span>{lang === 'te' ? 'ప్రధాన జిల్లాలు & మార్కెట్లు (Nellore, Chittoor, Tirupati, etc.)' : 'Priority Marketplace Districts'}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {AP_DISTRICTS.filter(d => d.isPriority).map((district) => {
                    const isSelected = selectedDistrict === district.name;
                    return (
                      <button
                        key={district.code}
                        onClick={() => {
                          setSelectedDistrict(district.name);
                          setSelectedMandal('');
                          setShowDistrictModal(false);
                        }}
                        className={`p-3.5 rounded-2xl text-left border transition-all flex flex-col justify-between cursor-pointer ${
                          isSelected
                            ? 'border-orange-600 bg-orange-50 ring-2 ring-orange-500/30 shadow-xs'
                            : 'border-stone-200 hover:border-orange-400 bg-white hover:bg-orange-50/20 shadow-xs'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full notranslate" translate="no">
                          <span className="font-extrabold text-sm text-stone-900 notranslate" translate="no">
                            {lang === 'te' ? `${district.name} (${district.te})` : district.name}
                          </span>
                          <span className="text-[10px] font-black bg-orange-100 text-orange-800 px-2 py-0.5 rounded-md notranslate" translate="no">
                            {district.mandals.length} {lang === 'te' ? 'మండలాలు' : 'Mandals'}
                          </span>
                        </div>
                        <span className="text-[11px] text-stone-500 mt-1.5 line-clamp-1 font-medium notranslate" translate="no">
                          {district.mandals.map(m => m.name).slice(0, 5).join(', ')}...
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Rest of AP Districts */}
              <div className="pt-3">
                <div className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
                  {lang === 'te' ? 'ఇతర ఆంధ్రప్రదేశ్ జిల్లాలు' : 'Other AP Districts'}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {AP_DISTRICTS.filter(d => !d.isPriority).map((district) => {
                    const isSelected = selectedDistrict === district.name;
                    return (
                      <button
                        key={district.code}
                        onClick={() => {
                          setSelectedDistrict(district.name);
                          setSelectedMandal('');
                          setShowDistrictModal(false);
                        }}
                        className={`p-2.5 rounded-xl text-left border text-xs transition-all cursor-pointer notranslate ${
                          isSelected
                            ? 'border-orange-600 bg-orange-50 font-bold text-orange-900'
                            : 'border-stone-200 hover:border-stone-300 text-stone-700 bg-white'
                        }`}
                        translate="no"
                      >
                        <div className="truncate font-semibold notranslate" translate="no">
                          {lang === 'te' ? `${district.name.split(' ')[0]} (${district.te.split(' ')[0]})` : district.name}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
