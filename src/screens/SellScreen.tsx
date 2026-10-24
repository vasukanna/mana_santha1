import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { DEFAULT_CATEGORIES } from '../data/categories';
import { loadApLocations, getLoadedDistricts, DEFAULT_DISTRICT_NAME, getVillagesForMandal } from '../data/locationService';
import { compressImage } from '../firebase';
import { CategoryIcon } from '../components/CategoryIcon';
import {
  Camera,
  Image as ImageIcon,
  Video,
  X,
  CheckCircle2,
  Phone,
  MapPin,
  Tag,
  AlertCircle,
  Clock,
  Check,
  Sparkles,
  Layers,
  IndianRupee,
  Navigation
} from 'lucide-react';

export const SellScreen: React.FC = () => {
  const {
    lang,
    t,
    currentUser,
    userProfile,
    loginWithGoogle,
    createListing,
    setActiveTab,
    showToast
  } = useApp();

  // Step 1: Select Category
  const [categoryId, setCategoryId] = useState<string>('cereals_grains');
  const [subcategoryId, setSubcategoryId] = useState<string>('paddy_rice');
  const [title, setTitle] = useState<string>('');
  const [showAllCategories, setShowAllCategories] = useState<boolean>(false);

  // Step 2: Price, Quantity & Description
  const [price, setPrice] = useState<string>('');
  const [priceUnit, setPriceUnit] = useState<string>('per quintal');
  const [negotiable, setNegotiable] = useState<boolean>(true);
  const [quantity, setQuantity] = useState<string>('');
  const [quantityUnit, setQuantityUnit] = useState<string>('quintals');
  const [description, setDescription] = useState<string>('');

  // Step 3: Location (Default SPSR Nellore)
  const [district, setDistrict] = useState<string>(DEFAULT_DISTRICT_NAME);
  const [mandal, setMandal] = useState<string>('Sangam');
  const [village, setVillage] = useState<string>('Chennavarappadu');
  const [otherVillageText, setOtherVillageText] = useState<string>('');
  const [villageSearch, setVillageSearch] = useState<string>('');

  // Step 4: Media & Phone
  const [images, setImages] = useState<string[]>([]);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [videoName, setVideoName] = useState<string>('');
  const [sellerPhone, setSellerPhone] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [compressing, setCompressing] = useState<boolean>(false);

  // Hidden file inputs
  const photoInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // Pre-fill phone from user profile
  useEffect(() => {
    if (userProfile?.phone && !sellerPhone) {
      setSellerPhone(userProfile.phone);
    }
  }, [userProfile, sellerPhone]);

  // Load AP locations lazily
  useEffect(() => {
    loadApLocations().then(() => {
      const districts = getLoadedDistricts();
      const currentD = districts.find(d => d.name === district) || districts[0];
      if (currentD && currentD.mandals.length > 0) {
        if (!currentD.mandals.some(m => m.name === mandal)) {
          setMandal(currentD.mandals[0].name);
        }
      }
    });
  }, [district]);

  // Current category object
  const currentCategory = useMemo(() => {
    return DEFAULT_CATEGORIES.find(c => c.id === categoryId) || DEFAULT_CATEGORIES[0];
  }, [categoryId]);

  const visibleCategories = showAllCategories ? DEFAULT_CATEGORIES : DEFAULT_CATEGORIES.slice(0, 6);

  // When category changes, set first subcategory
  const handleCategorySelect = (id: string) => {
    setCategoryId(id);
    const cat = DEFAULT_CATEGORIES.find(c => c.id === id);
    if (cat && cat.subcategories.length > 0) {
      setSubcategoryId(cat.subcategories[0].id);
    }
  };

  // Districts & Mandals from service
  const allDistricts = getLoadedDistricts();
  const currentDistrictObj = allDistricts.find(d => d.name === district) || allDistricts[0];
  const mandalsList = currentDistrictObj ? currentDistrictObj.mandals : [];
  const villagesList = useMemo(() => {
    return getVillagesForMandal(district, mandal);
  }, [district, mandal]);

  // Filtered villages
  const filteredVillages = useMemo(() => {
    if (!villageSearch.trim()) return villagesList;
    const q = villageSearch.toLowerCase().trim();
    return villagesList.filter(v => v.name.toLowerCase().includes(q) || v.te.includes(q));
  }, [villagesList, villageSearch]);

  // Image upload & compress handler (~1000px width, max 5 photos)
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (images.length >= 5) {
      showToast(lang === 'te' ? 'గరిష్టంగా 5 ఫోటోలు మాత్రమే అనుమతించబడతాయి.' : 'Maximum 5 photos allowed.');
      return;
    }

    setCompressing(true);
    const remainingSlots = 5 - images.length;
    const filesToProcess = Array.from(files).slice(0, remainingSlots);

    try {
      const compressedList: string[] = [];
      for (const file of filesToProcess) {
        if (file.type.startsWith('image/')) {
          const compressed = await compressImage(file, 0.85); // compresses to ~1000px width
          compressedList.push(compressed);
        }
      }
      setImages(prev => [...prev, ...compressedList]);
      showToast(lang === 'te' ? 'ఫోటో జోడించబడింది!' : 'Photo added!');
    } catch (err) {
      console.error('Compression error:', err);
      showToast(lang === 'te' ? 'ఫోటో అప్‌లోడ్ విఫలమైంది.' : 'Photo upload failed.');
    } finally {
      setCompressing(false);
      if (e.target) e.target.value = '';
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  // Video upload (max 30s and 20MB)
  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSizeBytes = 20 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      showToast(lang === 'te' ? 'వీడియో పరిమాణం 20MB కంటే తక్కువగా ఉండాలి.' : 'Video size must be under 20MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setVideoUrl(dataUrl);
      setVideoName(file.name);
      showToast(lang === 'te' ? 'వీడియో విజయవంతంగా జోడించబడింది!' : 'Video attached successfully!');
    };
    reader.readAsDataURL(file);
    if (e.target) e.target.value = '';
  };

  const removeVideo = () => {
    setVideoUrl('');
    setVideoName('');
  };

  // Step 1 status check
  const isStep1Complete = Boolean(categoryId && subcategoryId);
  // Step 2 status check
  const isStep2Complete = title.trim().length > 0 && title.length <= 60 && Boolean(price && Number(price) > 0);
  // Step 3 status check
  const isStep3Complete = Boolean(district && mandal && (village !== 'Other village' || otherVillageText.trim()));
  // Step 4 status check
  const isStep4Complete = Boolean((sellerPhone.trim() || userProfile?.phone) && images.length > 0);

  // Submit Listing with safe defaults and undefined protection
  const handleFinalSubmit = async () => {
    if (!title.trim()) {
      showToast(lang === 'te' ? 'దయచేసి దశ 2లో ప్రకటన శీర్షిక రాయండి.' : 'Please enter an ad title in Step 2.');
      document.getElementById('step-2')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    if (title.length > 60) {
      showToast(lang === 'te' ? 'శీర్షిక 60 అక్షరాల కంటే తక్కువగా ఉండాలి.' : 'Title must be 60 characters or less.');
      return;
    }
    if (!price || Number(price) <= 0) {
      showToast(lang === 'te' ? 'దయచేసి దశ 2లో సరైన ధర రాయండి.' : 'Please enter a valid price in Step 2.');
      document.getElementById('step-2')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    if (!district || !mandal) {
      showToast(lang === 'te' ? 'దయచేసి దశ 3లో జిల్లా మరియు మండలం ఎంచుకోండి.' : 'Please select District and Mandal in Step 3.');
      document.getElementById('step-3')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    const finalVillage = village === 'Other village' ? otherVillageText.trim() : village;
    if (!finalVillage) {
      showToast(lang === 'te' ? 'దయచేసి దశ 3లో మీ గ్రామం పేరు రాయండి.' : 'Please enter village name in Step 3.');
      document.getElementById('step-3')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    if (!sellerPhone.trim() && !userProfile?.phone) {
      showToast(lang === 'te' ? 'దయచేసి దశ 4లో మీ ఫోన్ నంబర్ నమోదు చేయండి.' : 'Please provide contact phone in Step 4.');
      document.getElementById('step-4')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    if (!currentUser) {
      setSubmitting(true);
      await loginWithGoogle();
      setSubmitting(false);
      return;
    }

    setSubmitting(true);
    try {
      const listingPayload = {
        title: title.trim(),
        category: categoryId,
        subcategory: subcategoryId,
        price: Number(price) || 0,
        priceUnit: priceUnit || 'per quintal',
        negotiable: Boolean(negotiable),
        quantity: quantity.trim() ? `${quantity.trim()} ${quantityUnit}` : '',
        quantityUnit: quantityUnit || '',
        description: description.trim() || '',
        district: district || DEFAULT_DISTRICT_NAME,
        mandal: mandal || '',
        village: finalVillage || '',
        images: images.length > 0 ? images : ['/assets/nellore_jodipi_1.jpg'],
        video: videoUrl || '',
        sellerPhone: sellerPhone.trim() || userProfile?.phone || '',
        sellerName: currentUser.displayName || userProfile?.name || 'రైతు మిత్రుడు',
        sellerId: currentUser.uid,
        status: 'active' as const,
        featured: false,
        customFields: {}
      };

      await createListing(listingPayload);
      setActiveTab('home');
    } catch (err) {
      console.error('Error creating listing:', err);
      showToast(lang === 'te' ? 'ప్రకటన పోస్టింగ్ విఫలమైంది. దయచేసి మళ్ళీ ప్రయత్నించండి.' : 'Failed to post ad. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pb-36 pt-2 px-3 sm:px-4 max-w-2xl mx-auto space-y-4">
      {/* 
        HEADER CARD:
        Logo + "Sell or Buy with SanthaLO" sentence 
      */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-950 rounded-3xl p-5 text-white shadow-xl border border-blue-700/50 relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-orange-500/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -left-8 -top-8 w-32 h-32 bg-blue-400/20 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left justify-between">
          {/* Logo with White Badge */}
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-2xl bg-white p-1.5 shadow-lg border border-white/60 flex items-center justify-center shrink-0">
              <img
                src="/logo.png"
                alt="Santhalo Logo"
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/icon-192.png';
                }}
              />
            </div>
            <div>
              <div className="inline-block bg-orange-500/90 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full mb-1">
                {lang === 'te' ? 'ఒకే పేజీలో 4 దశలు' : 'All 4 Steps on Single Page'}
              </div>
              <h1 className="text-lg sm:text-xl font-black text-white tracking-tight leading-snug">
                Sell or Buy with SanthaLO
              </h1>
              <p className="text-xs text-blue-200 font-medium">
                {lang === 'te'
                  ? 'సంతలో అమ్మండి లేదా కొనండి • మీ ప్రకటనను సులభంగా పోస్ట్ చేయండి'
                  : 'Your trusted local agricultural marketplace'}
              </p>
            </div>
          </div>

          <div className="hidden sm:flex flex-col items-end shrink-0">
            <span className="text-xs font-black px-3 py-1 bg-orange-500 text-white rounded-full shadow-sm">
              4 Steps Form
            </span>
          </div>
        </div>

        {/* Platform trust highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4">
          {[
            { en: 'Safe & Trusted', te: 'సురక్షితం & నమ్మకం', icon: CheckCircle2 },
            { en: 'Local Community', te: 'స్థానిక సమాజం', icon: MapPin },
            { en: 'Quick Posting', te: 'త్వరగా పోస్ట్ చేయండి', icon: Clock },
            { en: 'No Commission', te: 'కమీషన్ లేదు', icon: IndianRupee },
          ].map((item) => {
            const TrustIcon = item.icon;
            return (
              <div key={item.en} className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/10 px-2.5 py-2 text-[10px] sm:text-xs font-bold text-white">
                <TrustIcon className="w-3.5 h-3.5 text-orange-300 shrink-0" />
                <span>{lang === 'te' ? item.te : item.en}</span>
              </div>
            );
          })}
        </div>

        {/* 4-Step Visual Progress Bar */}
        <div className="grid grid-cols-4 gap-2 pt-4 mt-3 border-t border-blue-700/60">
          {[
            { num: 1, titleEn: 'Category', titleTe: 'కేటగిరీ', done: Boolean(categoryId && subcategoryId) },
            { num: 2, titleEn: 'Details', titleTe: 'వివరాలు', done: isStep2Complete && isStep1Complete },
            { num: 3, titleEn: 'Location', titleTe: 'ప్రాంతం', done: isStep3Complete },
            { num: 4, titleEn: 'Media', titleTe: 'మీడియా', done: isStep4Complete || images.length > 0 },
          ].map((s) => (
            <div key={s.num} className="space-y-1">
              <div className="flex items-center gap-1.5 justify-center">
                <span className={`w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center transition-colors ${
                  s.done ? 'bg-orange-500 text-white shadow-xs' : 'bg-blue-800 text-blue-200 border border-blue-600'
                }`}>
                  {s.done ? '✓' : s.num}
                </span>
                <span className="text-[11px] font-bold text-white hidden sm:inline">
                  {lang === 'te' ? s.titleTe : s.titleEn}
                </span>
              </div>
              <div className={`h-1.5 rounded-full transition-all ${
                s.done ? 'bg-orange-500' : 'bg-blue-800'
              }`} />
            </div>
          ))}
        </div>
      </div>

      {/* ALL 4 STEPS DISPLAYED ON A SINGLE PAGE */}

      {/* STEP 1: CATEGORY, SUB-CATEGORY & AD TITLE */}
      <section id="step-1" className="bg-white rounded-3xl p-5 border border-stone-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-blue-100 text-blue-900 font-black text-sm flex items-center justify-center">
              1
            </span>
            <div>
              <h2 className="text-sm font-black text-stone-900 uppercase tracking-tight">
                {lang === 'te' ? 'దశ 1: కేటగిరీ ఎంచుకోండి' : 'Step 1: Select Category'}
              </h2>
              <p className="text-[11px] text-stone-500">
                {lang === 'te' ? 'మీ ఉత్పత్తికి సరిపోయే కేటగిరీని ఎంచుకోండి' : 'Choose the category that best matches your product'}
              </p>
            </div>
          </div>
          {isStep1Complete && (
            <span className="flex items-center gap-1 text-xs font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200">
              <Check className="w-3.5 h-3.5" />
              <span>{lang === 'te' ? 'పూర్తయింది' : 'Ready'}</span>
            </span>
          )}
        </div>

        {/* Categories Grid */}
        <div>
          <label className="block text-xs font-black text-stone-800 uppercase tracking-wider mb-2">
            {lang === 'te' ? 'ప్రధాన కేటగిరీని ఎంచుకోండి' : 'Select Category'} *
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-60 overflow-y-auto pr-1">
            {visibleCategories.map((cat) => {
              const isSelected = categoryId === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleCategorySelect(cat.id)}
                  className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all cursor-pointer min-h-[50px] ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50 text-blue-950 ring-2 ring-blue-500/20 shadow-xs'
                      : 'border-stone-200 hover:border-blue-300 hover:bg-stone-50 text-stone-700'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    isSelected ? 'bg-white text-emerald-800' : 'bg-stone-100 text-stone-600'
                  }`}>
                    <CategoryIcon name={cat.id} className="w-6 h-6 object-contain" />
                  </div>
                  <span className="text-xs font-bold leading-tight">
                    {lang === 'te' ? cat.nameTe : cat.nameEn}
                  </span>
                </button>
              );
            })}
          </div>
          {DEFAULT_CATEGORIES.length > 6 && (
            <button
              type="button"
              onClick={() => setShowAllCategories((value) => !value)}
              className="mt-2 text-xs font-bold text-blue-800 hover:text-blue-950 underline underline-offset-2"
            >
              {showAllCategories
                ? (lang === 'te' ? 'తక్కువ చూపించు' : 'Show less')
                : (lang === 'te' ? 'అన్నీ చూడండి' : 'View all categories')}
            </button>
          )}
        </div>

        {/* Sub-category selector */}
        <div className="pt-2 border-t border-stone-100">
          <label className="block text-xs font-black text-stone-800 uppercase tracking-wider mb-2">
            {lang === 'te' ? 'ఉప-కేటగిరీ (రకం)' : 'Sub-Category'} *
          </label>
          <div className="flex flex-wrap gap-1.5">
            {currentCategory.subcategories.map((sub) => {
              const isSubSelected = subcategoryId === sub.id;
              return (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => setSubcategoryId(sub.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer min-h-[44px] ${
                    isSubSelected
                      ? 'bg-blue-900 text-white border-blue-900 shadow-xs'
                      : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  {lang === 'te' ? sub.nameTe : sub.nameEn}
                </button>
              );
            })}
          </div>
        </div>

      </section>

      {/* STEP 2: PRICE, QUANTITY & DESCRIPTION */}
      <section id="step-2" className="bg-white rounded-3xl p-5 border border-stone-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-orange-100 text-orange-900 font-black text-sm flex items-center justify-center">
              2
            </span>
            <div>
              <h2 className="text-sm font-black text-stone-900 uppercase tracking-tight">
                {lang === 'te' ? 'దశ 2: ఉత్పత్తి వివరాలు' : 'Step 2: Product Details'}
              </h2>
              <p className="text-[11px] text-stone-500">
                {lang === 'te' ? 'అంచనా ధర మరియు అందుబాటులో ఉన్న వివరాలు' : 'Add title, description, quantity and price'}
              </p>
            </div>
          </div>
          {isStep2Complete && (
            <span className="flex items-center gap-1 text-xs font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200">
              <Check className="w-3.5 h-3.5" />
              <span>{lang === 'te' ? 'పూర్తయింది' : 'Ready'}</span>
            </span>
          )}
        </div>

        {/* Ad Title */}
        <div className="pt-2 border-t border-stone-100">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-black text-stone-800 uppercase tracking-wider">
              {lang === 'te' ? 'ప్రకటన శీర్షిక (టైటిల్ - గరిష్టంగా 60 అక్షరాలు)' : 'Ad Title (Max 60 chars)'} *
            </label>
            <span className={`text-[11px] font-bold ${title.length > 55 ? 'text-orange-600' : 'text-stone-400'}`}>
              {title.length}/60
            </span>
          </div>
          <input
            type="text"
            value={title}
            maxLength={60}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={lang === 'te' ? 'ఉదా: షుగర్‌లెస్ వరి ధాన్యం లేదా కొబ్బరికాయలు' : 'e.g. Sugarless paddy or Nellore Jodipi rams'}
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-3 text-sm font-semibold text-stone-900 placeholder:text-stone-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 min-h-[46px]"
          />
          <p className="text-[11px] text-stone-500 mt-1">
            {lang === 'te'
              ? 'కేటగిరీ ముందుగానే నిర్ణయించబడింది. మీరు కేవలం మీ పంట లేదా వస్తువు పేరు రాయండి.'
              : 'Enter a clear product name so buyers can find your ad.'}
          </p>
        </div>
        
        {/* Price & Unit */}
        <div>
          <label className="block text-xs font-black text-stone-800 uppercase tracking-wider mb-1.5">
            {lang === 'te' ? 'అంచనా ధర (రూపాయల్లో)' : 'Approx Price (₹)'} *
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-black text-stone-500 text-sm">
                ₹
              </span>
              <input
                type="number"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder={lang === 'te' ? 'ఉదా: 2500' : 'e.g. 2500'}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl pl-8 pr-3 py-3 text-sm font-bold text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-orange-600 min-h-[46px]"
              />
            </div>

            {/* Price Unit Selector */}
            <select
              value={priceUnit}
              onChange={(e) => setPriceUnit(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-3 text-xs font-bold text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-orange-600 min-h-[46px]"
            >
              <option value="per kg">{lang === 'te' ? 'కేజీకి (Per kg)' : 'Per kg'}</option>
              <option value="per quintal">{lang === 'te' ? 'క్వింటాకి (Per quintal)' : 'Per quintal'}</option>
              <option value="per ton">{lang === 'te' ? 'టన్నుకి (Per ton)' : 'Per ton'}</option>
              <option value="per piece">{lang === 'te' ? 'ఒక్కంటికి / నంబరుకి (Per piece)' : 'Per piece'}</option>
              <option value="per acre">{lang === 'te' ? 'ఎకరానికి (Per acre)' : 'Per acre'}</option>
              <option value="total">{lang === 'te' ? 'మొత్తం వెల (Total Price)' : 'Total'}</option>
            </select>
          </div>

          <label className="mt-2.5 flex items-center gap-2 cursor-pointer text-xs font-semibold text-stone-700">
            <input
              type="checkbox"
              checked={negotiable}
              onChange={(e) => setNegotiable(e.target.checked)}
              className="w-4 h-4 accent-orange-600 rounded-xs"
            />
            <span>{lang === 'te' ? 'ధర చర్చించదగినది (బేరం / Negotiable)' : 'Price is negotiable'}</span>
          </label>
        </div>

        {/* Quantity Available */}
        <div className="pt-2 border-t border-stone-100">
          <label className="block text-xs font-black text-stone-800 uppercase tracking-wider mb-1.5">
            {lang === 'te' ? 'అందుబాటులో ఉన్న పరిమాణం' : 'Quantity Available'}
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder={lang === 'te' ? 'ఉదా: 50' : 'e.g. 50'}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-3 text-sm font-semibold text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-orange-600 min-h-[46px]"
            />
            <select
              value={quantityUnit}
              onChange={(e) => setQuantityUnit(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-3 text-xs font-bold text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-orange-600 min-h-[46px]"
            >
              <option value="quintals">{lang === 'te' ? 'క్వింటాళ్ళు (Quintals)' : 'Quintals'}</option>
              <option value="bags">{lang === 'te' ? 'బస్తాలు (Bags)' : 'Bags'}</option>
              <option value="tons">{lang === 'te' ? 'టన్నులు (Tons)' : 'Tons'}</option>
              <option value="kg">{lang === 'te' ? 'కేజీలు (Kg)' : 'Kg'}</option>
              <option value="acres">{lang === 'te' ? 'ఎకరాలు (Acres)' : 'Acres'}</option>
              <option value="pieces">{lang === 'te' ? 'సంఖ్య / జతలు (Count)' : 'Pieces'}</option>
            </select>
          </div>
        </div>

        {/* Short Description */}
        <div className="pt-2 border-t border-stone-100">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-black text-stone-800 uppercase tracking-wider">
              {lang === 'te' ? 'వివరాలు (ఐచ్ఛికం - గరిష్టంగా 500 అక్షరాలు)' : 'Description (Optional, max 500)'}
            </label>
            <span className={`text-[11px] font-bold ${description.length > 480 ? 'text-orange-600' : 'text-stone-400'}`}>
              {description.length}/500
            </span>
          </div>
          <textarea
            value={description}
            maxLength={500}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder={lang === 'te' ? 'నాణ్యత, వయస్సు లేదా ఇతర ముఖ్యమైన వివరాలు రాయండి...' : 'Mention quality, age, condition, or harvest date...'}
            className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3 text-xs font-medium text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-orange-600"
          />
        </div>
      </section>

      {/* STEP 3: LOCATION (DISTRICT, MANDAL, VILLAGE) */}
      <section id="step-3" className="bg-white rounded-3xl p-5 border border-stone-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-blue-100 text-blue-900 font-black text-sm flex items-center justify-center">
              3
            </span>
            <div>
              <h2 className="text-sm font-black text-stone-900 uppercase tracking-tight">
                {lang === 'te' ? 'దశ 3: మీ ప్రాంతం' : 'Step 3: Location'}
              </h2>
              <p className="text-[11px] text-stone-500">
                {lang === 'te' ? 'జిల్లా, మండలం మరియు మీ ఊరు ఎంచుకోండి' : 'District, Mandal & Village dependent dropdowns'}
              </p>
            </div>
          </div>
          {isStep3Complete && (
            <span className="flex items-center gap-1 text-xs font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200">
              <Check className="w-3.5 h-3.5" />
              <span>{lang === 'te' ? 'పూర్తయింది' : 'Ready'}</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 p-2.5 bg-blue-50 border border-blue-200 rounded-2xl text-blue-950 text-xs font-bold">
          <MapPin className="w-4 h-4 text-blue-700 shrink-0" />
          <span>
            {lang === 'te' 
              ? 'డిఫాల్ట్‌గా నెల్లూరు జిల్లా ఎంపిక చేయబడింది. అవసరమైతే ఇతర ఆంధ్రప్రదేశ్ జిల్లా ఎంచుకోండి.' 
              : 'SPSR Nellore is selected by default. Change to any AP district.'}
          </span>
        </div>

        {/* District Dropdown */}
        <div>
          <label className="block text-xs font-black text-stone-800 uppercase tracking-wider mb-1.5">
            {lang === 'te' ? 'జిల్లా (District)' : 'District'} *
          </label>
          <select
            value={district}
            onChange={(e) => {
              const newD = e.target.value;
              setDistrict(newD);
              const found = allDistricts.find(d => d.name === newD);
              if (found && found.mandals.length > 0) {
                setMandal(found.mandals[0].name);
              }
            }}
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-3 text-xs font-bold text-stone-900 notranslate min-h-[46px]"
            translate="no"
          >
            {allDistricts.map((d) => (
              <option key={d.code} value={d.name} translate="no" className="notranslate">
                {lang === 'te' ? `${d.name} (${d.te})` : d.name}
              </option>
            ))}
          </select>
        </div>

        {/* Mandal Dropdown */}
        <div>
          <label className="block text-xs font-black text-stone-800 uppercase tracking-wider mb-1.5">
            {lang === 'te' ? 'మండలం (Mandal)' : 'Mandal'} *
          </label>
          <select
            value={mandal}
            onChange={(e) => {
              setMandal(e.target.value);
              setVillageSearch('');
            }}
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-3 text-xs font-bold text-stone-900 notranslate min-h-[46px]"
            translate="no"
          >
            {mandalsList.map((m) => (
              <option key={m.name} value={m.name} translate="no" className="notranslate">
                {lang === 'te' ? `${m.name} (${m.te})` : m.name}
              </option>
            ))}
          </select>
        </div>

        {/* Village Selector & Search */}
        <div>
          <label className="block text-xs font-black text-stone-800 uppercase tracking-wider mb-1.5">
            {lang === 'te' ? 'గ్రామం / ఊరు (Village)' : 'Village'} *
          </label>
          <select
            value={village}
            onChange={(e) => setVillage(e.target.value)}
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-3 text-xs font-bold text-stone-900 notranslate min-h-[46px]"
            translate="no"
          >
            {filteredVillages.map((v) => (
              <option key={v.name} value={v.name} translate="no" className="notranslate">
                {lang === 'te' ? `${v.name} (${v.te})` : v.name}
              </option>
            ))}
          </select>

          {/* Other village text input if selected */}
          {village === 'Other village' && (
            <div className="mt-2.5">
              <label className="block text-[11px] font-bold text-blue-900 mb-1">
                {lang === 'te' ? 'మీ ఊరు / గ్రామం పేరు ఇక్కడ రాయండి:' : 'Type your village name here:'}
              </label>
              <input
                type="text"
                value={otherVillageText}
                onChange={(e) => setOtherVillageText(e.target.value)}
                placeholder={lang === 'te' ? 'ఉదా: కొత్తూరు పల్లె' : 'e.g. Kothuru Palle'}
                className="w-full bg-white border-2 border-orange-500 rounded-xl px-3.5 py-2.5 text-xs font-bold text-stone-900 focus:outline-hidden min-h-[44px]"
              />
            </div>
          )}
        </div>
      </section>

      {/* STEP 4: MEDIA (UP TO 5 PHOTOS + 1 VIDEO), PHONE & REVIEW */}
      <section id="step-4" className="bg-white rounded-3xl p-5 border border-stone-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-orange-100 text-orange-900 font-black text-sm flex items-center justify-center">
              4
            </span>
            <div>
              <h2 className="text-sm font-black text-stone-900 uppercase tracking-tight">
                {lang === 'te' ? 'దశ 4: ఫోటోలు & ఫోన్ నంబర్' : 'Step 4: Photos & Review'}
              </h2>
              <p className="text-[11px] text-stone-500">
                {lang === 'te' ? 'ఫోటోలు, చిన్న వీడియో మరియు సంప్రదింపు నంబర్' : 'Upload up to 5 photos, video and verify phone'}
              </p>
            </div>
          </div>
          {isStep4Complete && (
            <span className="flex items-center gap-1 text-xs font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200">
              <Check className="w-3.5 h-3.5" />
              <span>{lang === 'te' ? 'పూర్తయింది' : 'Ready'}</span>
            </span>
          )}
        </div>

        {/* Photo Upload: Max 3 */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-black text-stone-800 uppercase tracking-wider">
              {lang === 'te' ? 'ఫోటోలు (గరిష్టంగా 5)' : 'Photos (Maximum 5)'}
            </label>
            <span className="text-[11px] font-bold text-stone-500">
              {images.length}/5 {lang === 'te' ? 'ఫోటోలు' : 'photos'}
            </span>
          </div>

          <input
            ref={photoInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleImageUpload}
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleImageUpload}
          />

          {/* Upload Buttons */}
          {images.length < 5 && (
            <div className="grid grid-cols-2 gap-2 mb-3">
              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className="p-3 rounded-2xl border border-dashed border-orange-500 bg-orange-50/50 hover:bg-orange-100/50 text-orange-900 flex items-center justify-center gap-2 font-bold text-xs cursor-pointer min-h-[46px]"
              >
                <Camera className="w-4 h-4 text-orange-600" />
                <span>{lang === 'te' ? 'కెమెరాతో తీయండి' : 'Take Photo'}</span>
              </button>
              <button
                type="button"
                onClick={() => photoInputRef.current?.click()}
                className="p-3 rounded-2xl border border-stone-300 hover:border-stone-400 bg-stone-50 text-stone-700 flex items-center justify-center gap-2 font-bold text-xs cursor-pointer min-h-[46px]"
              >
                <ImageIcon className="w-4 h-4 text-stone-500" />
                <span>{lang === 'te' ? 'గ్యాలరీ నుండి' : 'From Gallery'}</span>
              </button>
            </div>
          )}

          {compressing && (
            <p className="text-xs text-orange-600 font-bold animate-pulse mb-2">
              {lang === 'te' ? 'ఫోటో ఆప్టిమైజ్ చేయబడుతోంది (1000px)...' : 'Optimizing photo for fast mobile loading...'}
            </p>
          )}

          {/* Previews */}
          {images.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {images.map((imgUrl, idx) => (
                <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-stone-200 group">
                  <img src={imgUrl} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-red-600 transition-colors cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Video Upload: Max 1 (30s / 20MB) */}
        <div className="pt-2 border-t border-stone-100">
          <label className="block text-xs font-black text-stone-800 uppercase tracking-wider mb-1.5">
            {lang === 'te' ? 'వీడియో (ఐచ్ఛికం, గరిష్టంగా 30 సెకన్లు / 20MB)' : 'Video (Optional, max 30s / 20MB)'}
          </label>
          <input
            ref={videoInputRef}
            type="file"
            accept="video/*"
            className="hidden"
            onChange={handleVideoUpload}
          />

          {!videoUrl ? (
            <button
              type="button"
              onClick={() => videoInputRef.current?.click()}
              className="w-full p-3 rounded-2xl border border-dashed border-stone-300 hover:border-blue-500 bg-stone-50 hover:bg-blue-50/40 text-stone-600 hover:text-blue-900 flex items-center justify-center gap-2 font-bold text-xs cursor-pointer min-h-[46px]"
            >
              <Video className="w-4 h-4 text-blue-600" />
              <span>{lang === 'te' ? 'వీడియో అప్‌లోడ్ చేయండి' : 'Attach Video (max 20MB)'}</span>
            </button>
          ) : (
            <div className="flex items-center justify-between p-2.5 bg-blue-50 border border-blue-200 rounded-2xl">
              <div className="flex items-center gap-2 min-w-0">
                <Video className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="text-xs font-bold text-blue-950 truncate">{videoName || 'Attached Video'}</span>
              </div>
              <button
                type="button"
                onClick={removeVideo}
                className="text-stone-400 hover:text-red-600 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Phone Number (prefilled from profile) */}
        <div className="pt-2 border-t border-stone-100">
          <label className="block text-xs font-black text-stone-800 uppercase tracking-wider mb-1.5">
            {lang === 'te' ? 'సంప్రదించాల్సిన ఫోన్ నంబర్' : 'Contact Phone Number'} *
          </label>
          <div className="relative">
            <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="tel"
              value={sellerPhone}
              onChange={(e) => setSellerPhone(e.target.value)}
              placeholder={lang === 'te' ? 'ఉదా: 9876543210' : 'e.g. 9876543210'}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl pl-10 pr-3.5 py-3 text-sm font-bold text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 min-h-[46px]"
            />
          </div>
        </div>

        {/* Quick Checklist */}
        <div className="pt-3 border-t border-stone-100">
          <h3 className="text-xs font-black uppercase tracking-wider text-stone-800 mb-2">
            {lang === 'te' ? 'త్వరిత తనిఖీ జాబితా' : 'Quick Checklist'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { labelEn: 'Category selected', labelTe: 'కేటగిరీ ఎంచుకున్నారు', done: Boolean(categoryId && subcategoryId) },
              { labelEn: 'Ad title added', labelTe: 'ప్రకటన శీర్షిక జోడించారు', done: Boolean(title.trim() && title.length <= 60) },
              { labelEn: 'Price entered', labelTe: 'ధర నమోదు చేశారు', done: Boolean(price && Number(price) > 0) },
              { labelEn: 'Location selected', labelTe: 'ప్రాంతం ఎంచుకున్నారు', done: Boolean(district && mandal && (village !== 'Other village' || otherVillageText.trim())) },
              { labelEn: 'Contact number added', labelTe: 'ఫోన్ నంబర్ జోడించారు', done: Boolean(sellerPhone.trim() || userProfile?.phone) },
              { labelEn: 'Photos added (optional)', labelTe: 'ఫోటోలు జోడించారు (ఐచ్ఛికం)', done: images.length > 0 },
            ].map((item) => (
              <div key={item.labelEn} className="flex items-center gap-2 text-xs">
                <CheckCircle2 className={`w-4 h-4 shrink-0 ${item.done ? 'text-emerald-600' : 'text-stone-300'}`} />
                <span className={item.done ? 'text-stone-800 font-semibold' : 'text-stone-500'}>
                  {lang === 'te' ? item.labelTe : item.labelEn}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Review Summary Box */}
        {(title || price) && (
          <div className="pt-2 border-t border-stone-100">
            <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200 text-xs space-y-1.5">
              <div className="font-black text-stone-900 flex items-center justify-between">
                <span className="truncate pr-2">{title || 'Ad Title'}</span>
                {price && (
                  <span className="text-orange-600 font-extrabold shrink-0">
                    ₹{price} / {priceUnit}
                  </span>
                )}
              </div>
              <div className="text-stone-600 flex items-center gap-1.5 text-[11px]">
                <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                <span className="truncate">
                  {village === 'Other village' ? (otherVillageText || 'Other village') : village}, {mandal}, {district.split(' ')[0]}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Submission guidance; action buttons are in the sticky bottom bar */}
        <p className="text-center text-[11px] text-stone-500 font-medium pt-3 border-t border-stone-100">
          {lang === 'te'
            ? 'మీ ప్రకటన ప్రచురణకు ముందు ధృవీకరించబడుతుంది. ఉచితంగా పోస్ట్ చేయండి • ఎటువంటి కమీషన్ లేదు.'
            : 'Your ad may be reviewed before publishing. Free to post • No commission.'}
        </p>
      </section>

      {/* Sticky bottom action bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-stone-200 bg-white/95 backdrop-blur-md px-3 py-3 shadow-[0_-8px_24px_rgba(0,0,0,0.08)]">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <button
            type="button"
            onClick={() => setActiveTab('home')}
            disabled={submitting}
            className="shrink-0 rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm font-bold text-stone-700 hover:bg-stone-50 disabled:opacity-50 min-h-[48px]"
          >
            {lang === 'te' ? 'వెనక్కి' : 'Back'}
          </button>
          <button
            type="button"
            disabled={submitting || compressing}
            onClick={handleFinalSubmit}
            className="flex-1 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white font-black text-base py-3 rounded-xl shadow-lg shadow-orange-600/20 flex items-center justify-center gap-2 min-h-[48px]"
          >
            {submitting ? (
              <span>{lang === 'te' ? 'ప్రకటన పోస్ట్ అవుతోంది...' : 'Posting Ad...'}</span>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5" />
                <span>{lang === 'te' ? 'ప్రకటన పోస్ట్ చేయండి' : 'Post Ad'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
