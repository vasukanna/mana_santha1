import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { DEFAULT_CATEGORIES } from '../data/categories';
import { AP_DISTRICTS } from '../data/apLocations';
import { compressImage } from '../firebase';
import {
  Camera,
  UploadCloud,
  X,
  CheckCircle,
  Video,
  Sparkles,
  MapPin,
  Tag,
  AlertCircle,
  Image as ImageIcon,
  Play,
  Film,
  Phone,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp
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
    showToast,
    appConfig,
    setAuthModalOpen
  } = useApp();

  // Form State
  const [selectedCatId, setSelectedCatId] = useState<string>('livestock');
  const [selectedSubcatId, setSelectedSubcatId] = useState<string>('sheep');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [negotiable, setNegotiable] = useState(true);
  const [quantity, setQuantity] = useState('');
  
  // Media State: 3 to 4 Photos Max
  const [images, setImages] = useState<string[]>([]);
  const [videoUrl, setVideoUrl] = useState('');
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(false);

  // Hidden file input refs for Camera and Gallery
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const videoCameraInputRef = useRef<HTMLInputElement>(null);

  // Custom Fields (Optional Accordion)
  const [showAdvancedSpecs, setShowAdvancedSpecs] = useState(false);
  const [customFields, setCustomFields] = useState<Record<string, any>>({});

  // Location pre-filled from user profile or Nellore
  const [district, setDistrict] = useState(userProfile?.district || 'Nellore (SPSR Nellore)');
  const [mandal, setMandal] = useState(userProfile?.mandal || 'Kavali');
  const [village, setVillage] = useState(userProfile?.village || '');

  // Contact
  const [sellerName, setSellerName] = useState(userProfile?.name || currentUser?.displayName || '');
  const [sellerPhone, setSellerPhone] = useState(userProfile?.phone || '');

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Selected Category Object
  const currentCategoryObj = DEFAULT_CATEGORIES.find(c => c.id === selectedCatId) || DEFAULT_CATEGORIES[0];
  const currentDistrictObj = AP_DISTRICTS.find(d => d.name === district) || AP_DISTRICTS[0];
  const currentMandalObj = currentDistrictObj.mandals.find(m => m.name === mandal) || currentDistrictObj.mandals[0];

  // Handle Photo Upload (from Camera or Gallery) — Max 4 photos
  const processPhotoFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    if (images.length >= 4) {
      showToast(lang === 'te' ? 'గరిష్టంగా 4 ఫోటోలు మాత్రమే జోడించగలరు' : 'Maximum 4 photos allowed');
      return;
    }

    const availableSlots = 4 - images.length;
    const filesToProcess = Array.from(files).slice(0, availableSlots);

    setIsCompressing(true);
    try {
      const newCompressedImages: string[] = [];
      for (const file of filesToProcess) {
        const compressedBase64 = await compressImage(file, 0.85);
        newCompressedImages.push(compressedBase64);
      }
      setImages(prev => [...prev, ...newCompressedImages]);
      showToast(
        lang === 'te'
          ? `✅ ${newCompressedImages.length} ఫోటో(లు) విజయవంతంగా జోడించబడ్డాయి!`
          : `✅ Added ${newCompressedImages.length} photo(s)!`
      );
    } catch (err) {
      console.error('Error compressing photos:', err);
      showToast(lang === 'te' ? 'ఫోటో లోడ్ చేయడంలో సమస్య వచ్చింది.' : 'Failed to compress photo.');
    } finally {
      setIsCompressing(false);
    }
  };

  const handleCameraCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    processPhotoFiles(e.target.files);
    e.target.value = '';
  };

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    processPhotoFiles(e.target.files);
    e.target.value = '';
  };

  const removePhoto = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  // Handle Video file (Camera recording or video clip upload)
  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size (max 25MB)
    if (file.size > 25 * 1024 * 1024) {
      showToast(lang === 'te' ? 'వీడియో పరిమాణం 25MB కంటే తక్కువ ఉండాలి' : 'Video size must be under 25MB');
      return;
    }

    setIsVideoLoading(true);
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setVideoPreview(result);
      setVideoUrl(result);
      setIsVideoLoading(false);
      showToast(lang === 'te' ? '✅ వీడియో విజయవంతంగా జోడించబడింది!' : '✅ Video attached successfully!');
    };
    reader.onerror = () => {
      setIsVideoLoading(false);
      showToast(lang === 'te' ? 'వీడియో లోడ్ చేయడంలో విఫలమైంది' : 'Failed to load video');
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const removeVideo = () => {
    setVideoPreview(null);
    setVideoUrl('');
  };

  const handleCustomFieldChange = (fieldId: string, value: any) => {
    setCustomFields(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  // Submit Listing
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!currentUser) {
      showToast(lang === 'te' ? 'ప్రకటన పోస్ట్ చేయడానికి దయచేసి లాగిన్ అవ్వండి.' : 'Please sign in to publish an ad.');
      await loginWithGoogle();
      return;
    }

    if (!title.trim()) {
      setErrorMsg(lang === 'te' ? 'దయచేసి ప్రకటన శీర్షిక రాయండి' : 'Please enter listing title');
      return;
    }

    if (!price || isNaN(Number(price))) {
      setErrorMsg(lang === 'te' ? 'సరైన ధరను నమోదు చేయండి' : 'Please enter valid price');
      return;
    }

    if (!sellerPhone.trim() || sellerPhone.length < 10) {
      setErrorMsg(lang === 'te' ? 'కొనుగోలుదారులు సంప్రదించడానికి 10 అంకెల మొబైల్ నంబర్ అవసరం' : 'Please enter valid 10-digit mobile number');
      return;
    }

    if (!village.trim()) {
      setErrorMsg(lang === 'te' ? 'మీ గ్రామం లేదా ప్రాంతం పేరు రాయండి' : 'Please enter village or locality name');
      return;
    }

    // Default sample image if none provided
    const finalImages = images.length > 0
      ? images
      : ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80'];

    setSubmitting(true);
    try {
      const listingData = {
        sellerId: currentUser.uid,
        sellerName: sellerName || currentUser.displayName || 'రైతు మిత్రుడు',
        sellerPhone: sellerPhone.trim(),
        category: selectedCatId,
        subcategory: selectedSubcatId,
        title: title.trim(),
        description: description.trim(),
        price: Number(price),
        negotiable,
        quantity: quantity.trim(),
        images: finalImages,
        video: videoUrl.trim() || undefined,
        district,
        mandal,
        village: village.trim(),
        status: 'active' as const,
        featured: false,
        customFields
      };

      await createListing(listingData);
      showToast(lang === 'te' ? '🎉 మీ ప్రకటన సంతలో ప్రచురించబడింది!' : '🎉 Listing published to Santha!');
      setActiveTab('my_ads');
    } catch (err: any) {
      console.error('Submit error:', err);
      setErrorMsg(err.message || 'Error publishing listing');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pb-28 pt-2">
      <div className="max-w-2xl mx-auto px-3 sm:px-4 space-y-4">
        
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 rounded-3xl p-5 text-white shadow-md">
          <div className="flex items-center justify-between mb-1">
            <span className="bg-white/20 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
              100% {t.freeBadge}
            </span>
            <span className="text-[11px] font-bold text-orange-100 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-200" />
              <span>{lang === 'te' ? 'సులభమైన 4 దశల ప్రకటన' : 'Simple 4-Step Ad'}</span>
            </span>
          </div>
          <h1 className="text-xl font-extrabold tracking-tight">
            {t.postAdTitle}
          </h1>
          <p className="text-xs text-orange-100 mt-1">
            {lang === 'te'
              ? 'ఫోటోలు & వీడియోలతో మీ సరుకును క్షణాల్లో వేలాది మంది రైతులకు చూపించండి.'
              : 'Showcase your crops, cattle, or rentals with quick photos & video.'}
          </p>
        </div>

        {/* Not Logged In Warning */}
        {!currentUser && (
          <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 text-amber-700 shrink-0" />
              <div className="text-xs text-amber-950 font-medium">
                {lang === 'te'
                  ? 'ప్రకటన నమోదు చేయడానికి సైన్-ఇన్ అవ్వండి.'
                  : 'Sign in to post and manage your listings.'}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={loginWithGoogle}
                className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs px-3 py-1.5 rounded-xl shrink-0 cursor-pointer shadow-xs"
              >
                {t.googleSignIn}
              </button>
              <button
                onClick={() => setAuthModalOpen(true)}
                className="bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs px-2.5 py-1.5 rounded-xl shrink-0 cursor-pointer shadow-xs"
              >
                {lang === 'te' ? 'తక్షణ లాగిన్' : 'Quick Login'}
              </button>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3.5 rounded-2xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* STEP 1: CATEGORY & TITLE */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-stone-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-orange-600 text-white inline-flex items-center justify-center text-[11px] font-black">1</span>
                <span>{lang === 'te' ? 'విభాగం & ప్రకటన పేరు' : 'Category & Title'}</span>
              </label>
              <span className="text-[11px] text-orange-600 font-bold">
                {lang === 'te' ? currentCategoryObj.nameTe : currentCategoryObj.nameEn}
              </span>
            </div>

            {/* Category Select Pills */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
              {DEFAULT_CATEGORIES.map((cat) => {
                const isSelected = selectedCatId === cat.id;
                return (
                  <button
                    type="button"
                    key={cat.id}
                    onClick={() => {
                      setSelectedCatId(cat.id);
                      setSelectedSubcatId(cat.subcategories[0]?.id || '');
                      setCustomFields({});
                    }}
                    className={`px-3 py-2 rounded-xl text-xs font-bold shrink-0 border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-orange-600 bg-orange-50 text-orange-950 shadow-xs ring-1 ring-orange-500/20'
                        : 'border-stone-200 text-stone-700 hover:bg-stone-50 bg-stone-50/50'
                    }`}
                  >
                    <span>{lang === 'te' ? cat.nameTe : cat.nameEn}</span>
                  </button>
                );
              })}
            </div>

            {/* Subcategory Pills */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {currentCategoryObj.subcategories.map((sub) => {
                const isSubSelected = selectedSubcatId === sub.id;
                return (
                  <button
                    type="button"
                    key={sub.id}
                    onClick={() => setSelectedSubcatId(sub.id)}
                    className={`px-3 py-1 rounded-full text-xs transition-all font-semibold cursor-pointer ${
                      isSubSelected
                        ? 'bg-stone-900 text-white shadow-xs'
                        : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                    }`}
                  >
                    {lang === 'te' ? sub.nameTe : sub.nameEn}
                  </button>
                );
              })}
            </div>

            {/* Title */}
            <div className="pt-1">
              <label className="text-xs font-bold text-stone-700 block mb-1">
                {t.adTitle} *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={
                  selectedCatId === 'livestock'
                    ? (lang === 'te' ? 'ఉదా: నెల్లూరు జోడిపి పొట్టేళ్లు 12 సంఖ్య' : 'e.g. Nellore Jodipi Sheep 12 nos')
                    : selectedCatId === 'cereals'
                    ? (lang === 'te' ? 'ఉదా: BPT 5204 సోనా మసూరి వరి ధాన్యం 100 బస్తాలు' : 'e.g. Sona Masoori Paddy 100 bags')
                    : t.adTitlePlaceholder
                }
                className="w-full bg-stone-50 border border-stone-200 rounded-2xl p-3 text-sm text-stone-900 font-semibold focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                required
              />
            </div>
          </div>

          {/* STEP 2: PRICE & QUANTITY */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-stone-200 shadow-xs space-y-3">
            <label className="text-xs font-black text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-orange-600 text-white inline-flex items-center justify-center text-[11px] font-black">2</span>
              <span>{lang === 'te' ? 'ధర & పరిమాణం' : 'Price & Quantity'}</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  {t.priceLabel} *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-black text-stone-600 text-sm">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder={t.pricePlaceholder}
                    className="w-full bg-stone-50 border border-stone-200 rounded-2xl pl-8 pr-3 py-3 text-sm font-black text-stone-900 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  {lang === 'te' ? 'పరిమాణం / యూనిట్' : 'Quantity / Unit'}
                </label>
                <input
                  type="text"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder={lang === 'te' ? 'ఉదా: 10 బస్తాలు / 12 పొట్టేళ్లు / 1 ఎకరం' : 'e.g. 50 Bags / 1 Pair / 1 Acre'}
                  className="w-full bg-stone-50 border border-stone-200 rounded-2xl p-3 text-xs text-stone-800 font-medium focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>
            </div>

            {/* Negotiable Toggle */}
            <div className="flex items-center justify-between p-3 rounded-2xl border border-stone-200 bg-stone-50/70 hover:bg-stone-50 cursor-pointer" onClick={() => setNegotiable(!negotiable)}>
              <span className="text-xs font-bold text-stone-800">
                {t.isNegotiableLabel}
              </span>
              <input
                type="checkbox"
                checked={negotiable}
                onChange={() => {}}
                className="w-4 h-4 accent-orange-600 cursor-pointer"
              />
            </div>

            {/* Description */}
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">
                {t.adDescription}
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                placeholder={t.adDescriptionPlaceholder}
                className="w-full bg-stone-50 border border-stone-200 rounded-2xl p-3 text-xs text-stone-900 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>
          </div>

          {/* STEP 3: LOCATION & CONTACT */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-stone-200 shadow-xs space-y-3">
            <label className="text-xs font-black text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-orange-600 text-white inline-flex items-center justify-center text-[11px] font-black">3</span>
              <span>{lang === 'te' ? 'ప్రాంతం & మొబైల్ నంబర్' : 'Location & Contact'}</span>
            </label>

            {/* District & Mandal Dropdowns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  {t.filterDistrict} *
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
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs font-bold text-stone-900"
                >
                  {AP_DISTRICTS.map((d) => (
                    <option key={d.code} value={d.name}>
                      {lang === 'te' ? d.te : d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  {t.filterMandal} *
                </label>
                <select
                  value={mandal}
                  onChange={(e) => setMandal(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs font-bold text-stone-900"
                >
                  {currentDistrictObj.mandals.map((m) => (
                    <option key={m.name} value={m.name}>
                      {lang === 'te' ? m.te : m.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Village Input with quick suggestion buttons */}
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">
                {t.filterVillage} *
              </label>
              <input
                type="text"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                placeholder={lang === 'te' ? 'మీ ఊరు / గ్రామం పేరు రాయండి' : 'Enter village name'}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs font-semibold text-stone-900"
                required
              />

              {currentMandalObj?.villages && currentMandalObj.villages.length > 0 && (
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] text-stone-400 font-bold">
                    {lang === 'te' ? 'త్వరిత ఎంపిక:' : 'Quick Select:'}
                  </span>
                  {currentMandalObj.villages.slice(0, 6).map((v) => (
                    <button
                      type="button"
                      key={v.name}
                      onClick={() => setVillage(lang === 'te' ? v.te : v.name)}
                      className={`text-[11px] px-2 py-0.5 rounded-lg border transition-all cursor-pointer ${
                        village === (lang === 'te' ? v.te : v.name) || village === v.name
                          ? 'bg-orange-600 text-white border-orange-600 font-bold'
                          : 'bg-stone-100 hover:bg-orange-50 text-stone-700 border-stone-200'
                      }`}
                    >
                      {lang === 'te' ? v.te : v.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Phone (Required for buyer calls) */}
            <div className="pt-1">
              <label className="text-xs font-bold text-stone-700 block mb-1">
                {t.phoneRequired} *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={sellerPhone}
                  onChange={(e) => setSellerPhone(e.target.value)}
                  placeholder="9848012345"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-3 py-2.5 text-xs font-bold text-stone-900"
                  required
                />
              </div>
            </div>
          </div>

          {/* STEP 4: PHOTOS (3-4 OPTIONS) WITH DIRECT CAMERA & VIDEO CLIP */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-stone-200 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-orange-600 text-white inline-flex items-center justify-center text-[11px] font-black">4</span>
                <span>{lang === 'te' ? 'ఫోటోలు (3-4) & వీడియో' : 'Photos (3-4) & Video'}</span>
              </label>
              <span className="text-[11px] font-bold text-orange-600">
                {images.length}/4 {lang === 'te' ? 'ఫోటోలు' : 'Photos'}
              </span>
            </div>

            {/* Direct Action Buttons: Camera & Gallery */}
            <div className="grid grid-cols-2 gap-2.5">
              {/* Direct Camera Button (Opens device camera immediately) */}
              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                disabled={images.length >= 4}
                className="py-3 px-3 rounded-2xl bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-950 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 disabled:opacity-40"
              >
                <Camera className="w-5 h-5 text-orange-600" />
                <div className="text-left">
                  <div className="text-xs font-extrabold">{lang === 'te' ? 'కెమెరాతో తీయండి' : 'Open Camera'}</div>
                  <div className="text-[10px] text-orange-800/80">{lang === 'te' ? 'నేరుగా లైవ్ ఫోటో' : 'Take photo now'}</div>
                </div>
              </button>
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleCameraCapture}
                className="hidden"
              />

              {/* Gallery / File Picker */}
              <button
                type="button"
                onClick={() => galleryInputRef.current?.click()}
                disabled={images.length >= 4}
                className="py-3 px-3 rounded-2xl bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-900 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 disabled:opacity-40"
              >
                <ImageIcon className="w-5 h-5 text-stone-600" />
                <div className="text-left">
                  <div className="text-xs font-extrabold">{lang === 'te' ? 'గ్యాలరీ నుండి' : 'From Gallery'}</div>
                  <div className="text-[10px] text-stone-500">{lang === 'te' ? 'ఫోన్ ఫైల్స్ ఎంచుకోండి' : 'Upload photos'}</div>
                </div>
              </button>
              <input
                ref={galleryInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleGalleryUpload}
                className="hidden"
              />
            </div>

            {/* Photo Preview Slots (1 to 4) */}
            <div className="grid grid-cols-4 gap-2 pt-1">
              {[0, 1, 2, 3].map((idx) => {
                const img = images[idx];
                if (img) {
                  return (
                    <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-stone-200 shadow-xs">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removePhoto(idx)}
                        className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/70 text-white flex items-center justify-center text-xs font-bold cursor-pointer hover:bg-red-600 transition-colors"
                      >
                        ✕
                      </button>
                      <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-md">
                        #{idx + 1}
                      </span>
                    </div>
                  );
                }
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => cameraInputRef.current?.click()}
                    className="aspect-square rounded-2xl border-2 border-dashed border-stone-200 hover:border-orange-400 bg-stone-50 flex flex-col items-center justify-center text-stone-400 hover:text-orange-600 cursor-pointer transition-colors p-1"
                  >
                    <Camera className="w-4 h-4 mb-0.5" />
                    <span className="text-[10px] font-bold">ఫోటో #{idx + 1}</span>
                  </button>
                );
              })}
            </div>

            {isCompressing && (
              <div className="text-xs text-orange-600 font-semibold flex items-center gap-1.5 animate-pulse">
                <span>{lang === 'te' ? 'ఫోటో సైజు కుదించబడుతోంది (Compressing < 1MB)...' : 'Compressing image under 1MB...'}</span>
              </div>
            )}

            {/* VIDEO SECTION: CAMERA VIDEO & UPLOAD */}
            <div className="pt-3 border-t border-stone-100 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                  <Film className="w-4 h-4 text-orange-600" />
                  <span>{lang === 'te' ? 'వీడియో క్లిప్ (30 సెకన్లు - ఐచ్ఛికం)' : 'Video Clip (Optional Tour)'}</span>
                </label>
                {videoPreview && (
                  <button
                    type="button"
                    onClick={removeVideo}
                    className="text-[11px] font-bold text-red-600 hover:underline cursor-pointer"
                  >
                    {lang === 'te' ? 'వీడియో తొలగించండి' : 'Remove Video'}
                  </button>
                )}
              </div>

              {/* Video Preview if Recorded/Uploaded */}
              {videoPreview ? (
                <div className="rounded-2xl overflow-hidden border border-stone-200 bg-black aspect-video relative">
                  <video src={videoPreview} controls className="w-full h-full object-contain" />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {/* Record Video with Camera */}
                  <button
                    type="button"
                    onClick={() => videoCameraInputRef.current?.click()}
                    className="py-2.5 px-3 rounded-2xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-950 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
                  >
                    <Video className="w-4 h-4 text-orange-600" />
                    <span className="text-xs font-bold">
                      {lang === 'te' ? 'కెమెరా వీడియో రికార్డ్' : 'Record Video'}
                    </span>
                  </button>
                  <input
                    ref={videoCameraInputRef}
                    type="file"
                    accept="video/*"
                    capture="environment"
                    onChange={handleVideoFileChange}
                    className="hidden"
                  />

                  {/* Upload Video File */}
                  <button
                    type="button"
                    onClick={() => videoInputRef.current?.click()}
                    className="py-2.5 px-3 rounded-2xl bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-800 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
                  >
                    <Film className="w-4 h-4 text-stone-600" />
                    <span className="text-xs font-bold">
                      {lang === 'te' ? 'వీడియో ఫైల్ అప్‌లోడ్' : 'Upload Clip'}
                    </span>
                  </button>
                  <input
                    ref={videoInputRef}
                    type="file"
                    accept="video/mp4,video/webm,video/quicktime"
                    onChange={handleVideoFileChange}
                    className="hidden"
                  />
                </div>
              )}

              {/* Video URL Alternative (YouTube / Shorts) */}
              <div className="relative pt-1">
                <input
                  type="url"
                  value={videoUrl.startsWith('data:video') ? '' : videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder={lang === 'te' ? 'లేదా యూట్యూబ్ / షార్ట్స్ లింక్ ఉంటే ఇక్కడ పేస్ట్ చేయండి' : 'Or paste YouTube / Shorts video link'}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-800 placeholder:text-stone-400 focus:ring-2 focus:ring-orange-500/20"
                />
              </div>
            </div>
          </div>

          {/* OPTIONAL ACCORDION: CATEGORY SPECIFIC SPECS */}
          {currentCategoryObj.customFields.length > 0 && (
            <div className="bg-white rounded-3xl p-4 border border-stone-200 shadow-xs">
              <button
                type="button"
                onClick={() => setShowAdvancedSpecs(!showAdvancedSpecs)}
                className="w-full flex items-center justify-between text-left cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-stone-500" />
                  <span className="text-xs font-bold text-stone-800">
                    {lang === 'te'
                      ? `+ మరిన్ని ప్రత్యేక వివరాలు (${currentCategoryObj.nameTe}) - ఐచ్ఛికం`
                      : `+ Additional Specs (${currentCategoryObj.nameEn}) - Optional`}
                  </span>
                </div>
                {showAdvancedSpecs ? (
                  <ChevronUp className="w-4 h-4 text-stone-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-stone-500" />
                )}
              </button>

              {showAdvancedSpecs && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-stone-100 mt-3">
                  {currentCategoryObj.customFields.map((field) => {
                    const val = customFields[field.id] || '';

                    if (field.type === 'select') {
                      return (
                        <div key={field.id} className="space-y-1">
                          <label className="text-xs font-bold text-stone-700">
                            {lang === 'te' ? field.labelTe : field.labelEn}
                          </label>
                          <select
                            value={val}
                            onChange={(e) => handleCustomFieldChange(field.id, e.target.value)}
                            className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs text-stone-800 font-medium"
                          >
                            <option value="">{lang === 'te' ? '-- ఎంచుకోండి --' : '-- Select --'}</option>
                            {field.options?.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {lang === 'te' ? opt.labelTe : opt.labelEn}
                              </option>
                            ))}
                          </select>
                        </div>
                      );
                    }

                    return (
                      <div key={field.id} className="space-y-1">
                        <label className="text-xs font-bold text-stone-700">
                          {lang === 'te' ? field.labelTe : field.labelEn}
                        </label>
                        <input
                          type={field.type === 'number' ? 'number' : 'text'}
                          value={val}
                          onChange={(e) => handleCustomFieldChange(field.id, e.target.value)}
                          placeholder={lang === 'te' ? field.placeholderTe : field.placeholderEn}
                          className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs text-stone-800"
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting || isCompressing || isVideoLoading}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-black text-sm tracking-wide shadow-lg shadow-orange-600/30 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <CheckCircle className="w-5 h-5" />
              <span>{submitting ? t.savingAd : t.postListingButton}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
