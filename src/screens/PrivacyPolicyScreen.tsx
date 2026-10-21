import React from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, ShieldCheck, Lock, Trash2, AlertTriangle, UserX, Mail, Globe } from 'lucide-react';

export const PrivacyPolicyScreen: React.FC = () => {
  const { lang, setActiveTab } = useApp();

  return (
    <div className="pb-28 pt-2">
      <div className="max-w-2xl mx-auto px-3 sm:px-4 space-y-4">
        {/* Navigation Bar */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('profile')}
            className="p-2 rounded-xl text-stone-600 hover:bg-stone-100 cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-extrabold text-stone-900">
              {lang === 'te' ? 'గోప్యతా విధానం & నిబంధనలు' : 'Privacy Policy & Terms'}
            </h1>
            <p className="text-xs text-stone-500">
              Santhalo (santhalo.com) • Google Play Compliant
            </p>
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs space-y-5 text-xs text-stone-700 leading-relaxed">
          
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 flex items-center gap-2 text-emerald-900 font-bold text-xs">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>
              {lang === 'te'
                ? 'గూగుల్ ప్లే స్టోర్ భద్రతా ప్రమాణాలకు అనుగుణంగా రూపొందించబడింది.'
                : 'Fully compliant with Google Play Store User Safety & Data Protection standards.'}
            </span>
          </div>

          {/* Section 1: Data Collection */}
          <section className="space-y-1.5">
            <h2 className="text-sm font-extrabold text-stone-900 flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-emerald-600" />
              <span>{lang === 'te' ? '1. మేము సేకరించే సమాచారం (Information Collected)' : '1. Information We Collect'}</span>
            </h2>
            <p>
              {lang === 'te'
                ? 'ఖాతా నమోదు చేసుకునే సమయంలో పేరు, ఈమెయిల్, మొబైల్ నంబర్ మరియు జిల్లా/మండలం సేకరిస్తాము. ఈ సమాచారం కేవలం మార్కెట్ ప్రకటనలపై కొనుగోలుదారులు నేరుగా మిమ్మల్ని సంప్రదించడానికి మాత్రమే ఉపయోగించబడుతుంది.'
                : 'We collect name, email, phone number, and location (district/mandal/village) strictly to display contact details on your marketplace listings for direct farmer-buyer trade.'}
            </p>
          </section>

          {/* Section 2: Account Deletion */}
          <section className="space-y-1.5">
            <h2 className="text-sm font-extrabold text-stone-900 flex items-center gap-1.5">
              <Trash2 className="w-4 h-4 text-red-600" />
              <span>{lang === 'te' ? '2. ఖాతా & ప్రకటనల తొలగింపు (Account & Data Deletion)' : '2. Account & Data Deletion Rights'}</span>
            </h2>
            <p>
              {lang === 'te'
                ? 'వినియోగదారులకు తమ ఖాతాను మరియు మొత్తం డేటాను ఎప్పుడైనా తొలగించే పూర్తి హక్కు కలదు. ప్రొఫైల్ స్క్రీన్ లో "ఖాతా తొలగించండి (Delete Account)" బటన్ నొక్కడం ద్వారా మీ ఖాతా, అన్ని పోస్ట్ చేసిన ప్రకటనలు మరియు సందేశాలు ఫైర్‌బేస్ నుండి శాశ్వతంగా తొలగించబడతాయి.'
                : 'You have the right to delete your account at any time. Tapping "Delete Account" in your Profile permanently removes your Firebase Auth account, all posted marketplace listings, photos, and chat records.'}
            </p>
          </section>

          {/* Section 3: UGC Safety, Reporting & Blocking */}
          <section className="space-y-1.5">
            <h2 className="text-sm font-extrabold text-stone-900 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>{lang === 'te' ? '3. వినియోగదారుల భద్రత, ఫిర్యాదు & బ్లాక్ (UGC Safety)' : '3. Content Moderation, Reporting & User Blocking'}</span>
            </h2>
            <p>
              {lang === 'te'
                ? 'అభ్యంతరకరమైన లేదా మోసపూరిత కంటెంట్‌ను నివారించడానికి ప్రతి ప్రకటన మరియు చాట్‌లో "ఫిర్యాదు (Report)" మరియు "బ్లాక్ చేయండి (Block User)" బటన్లు అందించబడ్డాయి. ఫిర్యాదు అందిన 24 గంటలలోపు చర్యలు తీసుకోబడతాయి మరియు నిబంధనలు ఉల్లంఘించిన యూజర్లు శాశ్వతంగా తొలగించబడతారు.'
                : 'To prevent abuse, fraud, or inappropriate content, every listing and chat provides "Report" and "Block User" controls. Reports are reviewed within 24 hours, and abusive accounts are banned permanently.'}
            </p>
          </section>

          {/* Section 4: Contact & Grievance */}
          <section className="space-y-1.5 bg-stone-50 border border-stone-200 rounded-2xl p-3.5">
            <h2 className="text-xs font-extrabold text-stone-900 flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-orange-600" />
              <span>{lang === 'te' ? '4. సంప్రదింపు వివరాలు (Developer Contact)' : '4. Developer Contact'}</span>
            </h2>
            <p className="text-[11px] text-stone-600">
              Operator: Santhalo Team<br />
              Email: vasu.kannaluri@gmail.com<br />
              Website: <a href="https://santhalo.com" className="text-emerald-700 underline font-semibold">https://santhalo.com</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
