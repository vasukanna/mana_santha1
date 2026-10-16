import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AP_DISTRICTS } from '../data/apLocations';
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
  Lock
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
    showToast
  } = useApp();

  const [name, setName] = useState(userProfile?.name || currentUser?.displayName || '');
  const [phone, setPhone] = useState(userProfile?.phone || '');
  const [district, setDistrict] = useState(userProfile?.district || 'Nellore (SPSR Nellore)');
  const [mandal, setMandal] = useState(userProfile?.mandal || 'Kavali');
  const [village, setVillage] = useState(userProfile?.village || '');
  const [role, setRole] = useState<'seller' | 'buyer' | 'both'>(userProfile?.role || 'both');
  
  const [saving, setSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const currentDistrictObj = AP_DISTRICTS.find(d => d.name === district) || AP_DISTRICTS[0];

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
    } catch (e) {
      // error handled in context
    } finally {
      setSaving(false);
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

        <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 text-left space-y-2">
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

        <button
          onClick={loginWithGoogle}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm py-3.5 px-4 rounded-2xl shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
            <path d="M12.24 10.285V13.8h6.887C18.2 16.5 15.64 18.5 12.24 18.5c-3.59 0-6.5-2.91-6.5-6.5s2.91-6.5 6.5-6.5c1.61 0 3.09.59 4.23 1.57l2.6-2.6C17.45 2.87 15.01 2 12.24 2 6.58 2 2 6.58 2 12.25s4.58 10.25 10.24 10.25c6.04 0 10.03-4.25 10.03-10.21 0-.69-.07-1.35-.19-2.005H12.24z"/>
          </svg>
          <span>{t.googleSignIn}</span>
        </button>
      </div>
    );
  }

  return (
    <div className="pb-28 pt-2">
      <div className="max-w-2xl mx-auto px-3 sm:px-4 space-y-4">
        {/* Profile Card Header */}
        <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-orange-100 text-orange-700 font-black text-xl flex items-center justify-center shrink-0 border border-orange-200">
              {currentUser.photoURL ? (
                <img src={currentUser.photoURL} alt="" className="w-full h-full rounded-2xl object-cover" />
              ) : (
                (currentUser.displayName || 'రై')[0]
              )}
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="font-extrabold text-stone-900 text-base">
                  {currentUser.displayName || 'రైతు మిత్రుడు'}
                </h2>
                {userProfile?.isVerified && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                )}
              </div>
              <div className="text-xs text-stone-500">
                {currentUser.email}
              </div>
              <div className="text-[11px] text-orange-700 font-semibold mt-0.5">
                {userProfile?.district} • {role === 'seller' ? t.roleSeller : role === 'buyer' ? t.roleBuyer : t.roleBoth}
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

        {/* Edit Profile Form */}
        <form onSubmit={handleSaveProfile} className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs space-y-3.5">
          <div className="flex items-center justify-between pb-2 border-b border-stone-100">
            <h3 className="font-extrabold text-stone-900 text-sm">
              {t.profileSetupTitle}
            </h3>
            <span className="text-[11px] text-stone-400">
              {lang === 'te' ? 'కొనుగోలుదారుల కోసం' : 'Visible on ads'}
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

          {/* Role Selection */}
          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1.5">
              {t.selectRole}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'seller', label: t.roleSeller },
                { id: 'buyer', label: t.roleBuyer },
                { id: 'both', label: t.roleBoth }
              ].map((r) => (
                <button
                  type="button"
                  key={r.id}
                  onClick={() => setRole(r.id as any)}
                  className={`p-2 rounded-xl text-center text-xs font-bold border transition-all cursor-pointer ${
                    role === r.id
                      ? 'border-orange-600 bg-orange-50 text-orange-950 ring-1 ring-orange-500/20'
                      : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  {r.label.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* District, Mandal, Village */}
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
                className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs font-semibold text-stone-900"
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
                {t.filterMandal}
              </label>
              <select
                value={mandal}
                onChange={(e) => setMandal(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs font-semibold text-stone-900"
              >
                {currentDistrictObj.mandals.map((m) => (
                  <option key={m.name} value={m.name}>
                    {lang === 'te' ? m.te : m.name}
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
              placeholder={lang === 'te' ? 'మీ ఊరు పేరు' : 'Village name'}
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

          {/* Privacy & Terms */}
          <button
            onClick={() => setActiveTab('safety_policy')}
            className="w-full p-3 flex items-center justify-between hover:bg-stone-50 rounded-2xl transition-colors cursor-pointer"
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
                className="py-2.5 rounded-xl border border-stone-300 font-bold text-xs text-stone-700"
              >
                {lang === 'te' ? 'రద్దు' : 'Cancel'}
              </button>
              <button
                onClick={deleteUserAccount}
                className="py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md"
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
