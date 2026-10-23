import React, { useState, useEffect } from 'react';
import { Download, X, Share, Smartphone, PlusSquare } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const PWAInstallBanner: React.FC = () => {
  const { lang, setActiveTab } = useApp();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showBanner, setShowBanner] = useState<boolean>(false);
  const [isIos, setIsIos] = useState<boolean>(false);
  const [showIosTip, setShowIosTip] = useState<boolean>(false);

  useEffect(() => {
    // 1. Check if running in standalone PWA mode
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true ||
      document.referrer.includes('android-app://');

    if (isStandalone) {
      return;
    }

    // 2. Check if dismissed within last 7 days
    const dismissedTime = localStorage.getItem('santhalo_pwa_dismissed');
    if (dismissedTime) {
      const elapsed = Date.now() - Number(dismissedTime);
      const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
      if (elapsed < sevenDaysMs) {
        return;
      }
    }

    // 3. Detect iOS Safari
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(isIosDevice);

    if (isIosDevice) {
      // Show iOS banner tip after 3 seconds
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 3000);
      return () => clearTimeout(timer);
    }

    // 4. Android / Chrome beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for appinstalled
    window.addEventListener('appinstalled', () => {
      setShowBanner(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIos) {
      setShowIosTip(true);
      return;
    }

    if (!deferredPrompt) {
      setActiveTab('download');
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowBanner(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem('santhalo_pwa_dismissed', String(Date.now()));
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-16 sm:bottom-4 left-3 right-3 sm:left-auto sm:right-4 sm:max-w-md z-40 animate-in slide-in-from-bottom-5 duration-300">
      <div className="bg-stone-900/95 backdrop-blur-md text-white rounded-2xl p-3.5 shadow-2xl border border-stone-700/80">
        <div className="flex items-center justify-between gap-3">
          {/* Logo & Info */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-11 h-11 rounded-xl bg-white p-1 border border-stone-200 flex items-center justify-center shadow-md shrink-0">
              <img
                src="/logo.png"
                alt="Santhalo"
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/icon-192.png';
                }}
              />
            </div>
            <div className="min-w-0">
              <h4 className="font-extrabold text-xs sm:text-sm text-white truncate">
                {lang === 'te' ? 'సంతలో యాప్‌ను ఇన్‌స్టాల్ చేసుకోండి' : 'Install Santhalo App'}
              </h4>
              <p className="text-[11px] text-blue-200 truncate">
                {lang === 'te' ? 'వేగవంతమైన అనుభవం, ఆఫ్‌లైన్ సదుపాయం' : 'Fast, works offline, 100% free'}
              </p>
            </div>
          </div>

          {/* Action & Close */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleInstallClick}
              className="bg-orange-600 hover:bg-orange-500 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl active:scale-95 transition-all shadow-md flex items-center gap-1.5 cursor-pointer min-h-[44px]"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{lang === 'te' ? 'ఇన్‌స్టాల్' : 'Install'}</span>
            </button>
            <button
              onClick={handleDismiss}
              className="p-2 text-stone-400 hover:text-white rounded-lg cursor-pointer"
              aria-label="Dismiss banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* iOS Safari Tip Expanded Modal/Banner */}
        {showIosTip && (
          <div className="mt-2.5 pt-2.5 border-t border-stone-800 text-[11px] text-stone-200 space-y-1">
            <p className="font-bold text-emerald-400">
              {lang === 'te' ? 'ఐఫోన్ (iOS) ఇన్‌స్టాలేషన్ విధానం:' : 'iPhone Installation Tip:'}
            </p>
            <p className="flex items-center gap-1">
              1. {lang === 'te' ? 'సఫారి బ్రౌజర్‌లో షేర్' : 'In Safari, tap Share'} <Share className="w-3 h-3 inline text-emerald-400" />
            </p>
            <p className="flex items-center gap-1">
              2. {lang === 'te' ? "'Add to Home Screen' పై క్లిక్ చేయండి" : "Scroll down and tap 'Add to Home Screen'"} <PlusSquare className="w-3 h-3 inline text-emerald-400" />
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
