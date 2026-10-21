import React, { useState } from 'react';
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
  AlertCircle
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
    openListingDetail,
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
  const [videoUrl, setVideoUrl] = useState('');
  
  // Custom Fields
  const [customFields, setCustomFields] = useState<Record<string, any>>({});

  // Location
  const [district, setDistrict] = useState(userProfile?.district || 'Nellore (SPSR Nellore)');
  const [mandal, setMandal] = useState(userProfile?.mandal || 'Kavali');
  const [village, setVillage] = useState(userProfile?.village || '');

  // Contact
  const [sellerName, setSellerName] = useState(userProfile?.name || currentUser?.displayName || '');
  const [sellerPhone, setSellerPhone] = useState(userProfile?.phone || '');

  // Images (compressed base64 data URLs)
  const [images, setImages] = useState<string[]>([]);
  const [isCompressing, setIsCompressing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Selected Category Object
  const currentCategoryObj = DEFAULT_CATEGORIES.find(c => c.id === selectedCatId) || DEFAULT_CATEGORIES[0];
  const currentDistrictObj = AP_DISTRICTS.find(d => d.name === district) || AP_DISTRICTS[0];
  const currentMandalObj = currentDistrictObj.mandals.find(m => m.name === mandal) || currentDistrictObj.mandals[0];

  // Handle Photo Selection with automatic client-side compression (< 1MB)
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Check limits
    const maxPhotos = appConfig.freePhotoLimit || 5;
    if (images.length + files.length > 8) {
      showToast(lang === 'te' ? 'గరిష్టంగా 8 ఫోటోలు మాత్రమే అనుమతించబడతాయి' : 'Maximum 8 photos allowed');
      return;
    }

    setIsCompressing(true);
    try {
      const newCompressedImages: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        // Compress using Canvas down to max 0.85MB
        const compressedBase64 = await compressImage(file, 0.85);
        newCompressedImages.push(compressedBase64);
      }
      setImages(prev => [...prev, ...newCompressedImages]);
      showToast(lang === 'te' ? `${newCompressedImages.length} ఫోటోలు విజయవంతంగా జోడించబడ్డాయి!` : 'Photos compressed and added successfully!');
    } catch (err) {
      console.error('Error compressing photos:', err);
      showToast(lang === 'te' ? 'ఫోటోలు లోడ్ చేయడంలో సమస్య వచ్చింది.' : 'Failed to compress photo.');
    } finally {
      setIsCompressing(false);
    }
  };

  const removePhoto = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
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

      const newId = await createListing(listingData);
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
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-amber-600 rounded-3xl p-5 text-white shadow-md">
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
              {t.freeBadge}
            </span>
            <span className="text-xs font-semibold text-orange-100">
              {t.launchOfferTitle}
            </span>
          </div>
          <h1 className="text-xl font-extrabold tracking-tight">
            {t.postAdTitle}
          </h1>
          <p className="text-xs text-orange-100 mt-1">
            {lang === 'te'
              ? 'ఆంధ్రప్రదేశ్ లోని వేలాది మంది కొనుగోలుదారులకు మీ సరుకును క్షణాల్లో చూపించండి.'
              : 'Reach thousands of direct buyers across AP mandals and villages.'}
          </p>
        </div>

        {/* Not Logged In Prompt */}
        {!currentUser && (
          <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 text-amber-700 shrink-0" />
              <div className="text-xs text-amber-950 font-medium">
                {lang === 'te'
                  ? 'ప్రకటన నమోదు చేయడానికి గూగుల్ ద్వారా సైన్-ఇన్ అవ్వండి.'
                  : 'Sign in with Google to post and manage your listings.'}
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
          {/* STEP 1: CATEGORY & SUBCATEGORY */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-stone-200 shadow-xs space-y-3">
            <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block">
              1. {t.selectCategory}
            </label>

            {/* Category Select Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
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
                    className={`p-2.5 rounded-2xl text-left border text-xs flex items-center gap-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-orange-600 bg-orange-50 text-orange-950 font-bold ring-1 ring-orange-500/30'
                        : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <span className="truncate">
                      {lang === 'te' ? cat.nameTe : cat.nameEn}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Subcategories */}
            <div className="pt-2">
              <label className="text-xs font-bold text-stone-600 block mb-1.5">
                {t.selectSubcategory}
              </label>
              <div className="flex flex-wrap gap-1.5">
                {currentCategoryObj.subcategories.map((sub) => {
                  const isSubSelected = selectedSubcatId === sub.id;
                  return (
                    <button
                      type="button"
                      key={sub.id}
                      onClick={() => setSelectedSubcatId(sub.id)}
                      className={`px-3 py-1.5 rounded-full text-xs transition-all font-semibold cursor-pointer ${
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
            </div>
          </div>

          {/* STEP 2: CATEGORY SPECIFIC FIELDS */}
          {currentCategoryObj.customFields.length > 0 && (
            <div className="bg-white rounded-3xl p-4 sm:p-5 border border-stone-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                  2. {lang === 'te' ? 'కేటగిరీ ప్రత్యేక వివరాలు' : 'Category Specific Details'}
                </label>
                <span className="text-[11px] text-orange-600 font-bold">
                  {lang === 'te' ? currentCategoryObj.nameTe : currentCategoryObj.nameEn}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                          className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs text-stone-800 font-medium focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
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
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs text-stone-800 placeholder:text-stone-400 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: GENERAL LISTING INFO */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-stone-200 shadow-xs space-y-3.5">
            <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block">
              3. {lang === 'te' ? 'ధర & సాధారణ వివరాలు' : 'Price & Listing Information'}
            </label>

            {/* Title */}
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">
                {t.adTitle} *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t.adTitlePlaceholder}
                className="w-full bg-stone-50 border border-stone-200 rounded-2xl p-3 text-sm text-stone-900 font-semibold focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                required
              />
            </div>

            {/* Price & Negotiable */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  {t.priceLabel} *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-stone-500 text-sm">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder={t.pricePlaceholder}
                    className="w-full bg-stone-50 border border-stone-200 rounded-2xl pl-8 pr-3 py-3 text-sm font-bold text-stone-900 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
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
                  placeholder={lang === 'te' ? 'ఉదా: 50 బస్తాలు / 1 టన్ను / 1 జత' : 'e.g. 50 Bags / 1 Pair'}
                  className="w-full bg-stone-50 border border-stone-200 rounded-2xl p-3 text-xs text-stone-800 font-medium focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>
            </div>

            {/* Negotiable Toggle */}
            <div className="pt-1">
              <label
                onClick={() => setNegotiable(!negotiable)}
                className="flex items-center justify-between p-3 rounded-2xl border border-stone-200 bg-stone-50/70 hover:bg-stone-50 cursor-pointer"
              >
                <span className="text-xs font-bold text-stone-800">
                  {t.isNegotiableLabel}
                </span>
                <input
                  type="checkbox"
                  checked={negotiable}
                  onChange={() => {}}
                  className="w-4 h-4 accent-orange-600"
                />
              </label>
            </div>

            {/* Description */}
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">
                {t.adDescription}
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder={t.adDescriptionPlaceholder}
                className="w-full bg-stone-50 border border-stone-200 rounded-2xl p-3 text-xs text-stone-900 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>
          </div>

          {/* STEP 4: PHOTOS & VIDEO (Auto-compressed < 1MB) */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-stone-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                4. {t.uploadPhotos}
              </label>
              <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                Auto Compress &lt; 1MB
              </span>
            </div>

            {/* Upload Area */}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
              {images.map((img, idx) => (
                <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-stone-200 group">
                  <img src={img} alt="Uploaded" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removePhoto(idx)}
                    className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/70 text-white flex items-center justify-center text-xs"
                  >
                    ✕
                  </button>
                </div>
              ))}

              {/* Add Photo Button */}
              {images.length < 8 && (
                <label className="aspect-square rounded-2xl border-2 border-dashed border-stone-300 hover:border-orange-500 bg-stone-50 hover:bg-orange-50/20 flex flex-col items-center justify-center cursor-pointer transition-all p-2 text-center">
                  <Camera className="w-6 h-6 text-orange-600 mb-1" />
                  <span className="text-[11px] font-bold text-stone-700 leading-tight">
                    {lang === 'te' ? 'ఫోటో తీయండి' : 'Add Photo'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {isCompressing && (
              <div className="text-xs text-orange-600 font-semibold flex items-center gap-1.5 animate-pulse">
                <span>{lang === 'te' ? 'ఫోటో సైజు కుదించబడుతోంది (Compressing)...' : 'Compressing image under 1MB...'}</span>
              </div>
            )}

            {/* Optional Video Input */}
            <div className="pt-2">
              <label className="text-xs font-bold text-stone-700 block mb-1">
                {t.videoUploadLabel}
              </label>
              <div className="relative">
                <Video className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://youtube.com/shorts/... or video link"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-3 py-2 text-xs focus:ring-2 focus:ring-orange-500/20"
                />
              </div>
            </div>
          </div>

          {/* STEP 5: LOCATION & CONTACT */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-stone-200 shadow-xs space-y-3">
            <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block">
              5. {lang === 'te' ? 'ప్రాంతం & సంప్రదింపు వివరాలు' : 'Location & Seller Details'}
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

            {/* Village Input */}
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">
                {t.filterVillage} *
              </label>
              <input
                type="text"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                placeholder={lang === 'te' ? 'మీ ఊరు / గ్రామం పేరు రాయండి (ఉదా: చెన్నవరప్పాడు, పడుగుపాడు)' : 'Enter village name'}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs font-semibold text-stone-900"
                required
              />

              {/* 1-Tap Village Suggestion Chips from selected mandal */}
              {currentMandalObj?.villages && currentMandalObj.villages.length > 0 && (
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] text-stone-400 font-bold">
                    {lang === 'te' ? 'త్వరిత ఎంపిక:' : 'Quick Select:'}
                  </span>
                  {currentMandalObj.villages.map((v) => (
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

            {/* Seller Name & Phone (Required) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  {t.fullName}
                </label>
                <input
                  type="text"
                  value={sellerName}
                  onChange={(e) => setSellerName(e.target.value)}
                  placeholder="మీ పేరు"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs font-semibold text-stone-900"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  {t.phoneRequired} *
                </label>
                <input
                  type="tel"
                  value={sellerPhone}
                  onChange={(e) => setSellerPhone(e.target.value)}
                  placeholder="9848012345"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs font-bold text-stone-900"
                  required
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting || isCompressing}
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
