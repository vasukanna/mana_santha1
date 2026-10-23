import React, { useState, useEffect } from 'react';
import { RefreshCw, X, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const PWAUpdateBanner: React.FC = () => {
  const { lang } = useApp();
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);
  const [showBanner, setShowBanner] = useState<boolean>(false);

  useEffect(() => {
    if (!('serviceWorker' in navigator)) {
      return;
    }

    // Check if dismissed in this session
    const isDismissedThisSession = sessionStorage.getItem('santhalo_update_dismissed');

    let registration: ServiceWorkerRegistration | null = null;
    let refreshing = false;

    // Listen for controllerchange to reload once
    const handleControllerChange = () => {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    };

    navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange);

    const onNewWorkerWaiting = (worker: ServiceWorker) => {
      setWaitingWorker(worker);
      if (!isDismissedThisSession) {
        setShowBanner(true);
      }
    };

    const registerAndTrack = async () => {
      try {
        registration = await navigator.serviceWorker.register('/sw.js');

        // Check if there's already a waiting worker
        if (registration.waiting) {
          onNewWorkerWaiting(registration.waiting);
        }

        // Listen for new updates found
        registration.addEventListener('updatefound', () => {
          const installingWorker = registration?.installing;
          if (!installingWorker) return;

          installingWorker.addEventListener('statechange', () => {
            if (
              installingWorker.state === 'installed' &&
              navigator.serviceWorker.controller
            ) {
              onNewWorkerWaiting(installingWorker);
            }
          });
        });

        // 1. Check for updates on visibilitychange (when app returns to foreground)
        const handleVisibilityChange = () => {
          if (document.visibilityState === 'visible' && registration) {
            registration.update().catch(() => {});
          }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);

        // 2. Check for updates every 30 minutes
        const thirtyMinutesMs = 30 * 60 * 1000;
        const intervalId = setInterval(() => {
          if (registration) {
            registration.update().catch(() => {});
          }
        }, thirtyMinutesMs);

        return () => {
          document.removeEventListener('visibilitychange', handleVisibilityChange);
          clearInterval(intervalId);
        };
      } catch (err) {
        console.warn('Service worker registration failed:', err);
      }
    };

    if (document.readyState === 'complete') {
      registerAndTrack();
    } else {
      window.addEventListener('load', registerAndTrack);
    }

    return () => {
      navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange);
      window.removeEventListener('load', registerAndTrack);
    };
  }, []);

  const handleUpdateNow = () => {
    if (waitingWorker) {
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });
    }
  };

  const handleLater = () => {
    setShowBanner(false);
    // Dismiss for this session only; will prompt again on next app open
    sessionStorage.setItem('santhalo_update_dismissed', 'true');
  };

  if (!showBanner || !waitingWorker) {
    return null;
  }

  return (
    <div className="fixed bottom-20 sm:bottom-6 left-3 right-3 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-in slide-in-from-bottom-5 duration-300">
      {/* Green (#16a34a) rounded card with white text and large buttons (at least 44px) */}
      <div className="bg-[#16a34a] text-white rounded-3xl p-4 shadow-2xl border border-emerald-400/40">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0">
            <RefreshCw className="w-5 h-5 text-white animate-spin" style={{ animationDuration: '4s' }} />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-black text-sm text-white tracking-tight">
              {lang === 'te' ? 'కొత్త వెర్షన్ అందుబాటులో ఉంది' : 'New version available'}
            </h4>
            <p className="text-xs text-emerald-100 font-medium leading-tight">
              {lang === 'te'
                ? 'తాజా ఫీచర్లు & వేగవంతమైన అనుభవం కోసం అప్‌డేట్ చేయండి.'
                : 'Update now for the latest features & faster performance.'}
            </p>
          </div>
          <button
            onClick={handleLater}
            className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-xl cursor-pointer"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action buttons: minimum 44px tall */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleLater}
            className="bg-white/20 hover:bg-white/30 text-white font-bold text-xs py-2.5 px-3 rounded-xl active:scale-95 transition-all flex items-center justify-center cursor-pointer min-h-[44px]"
          >
            {lang === 'te' ? 'తర్వాత' : 'Later'}
          </button>
          <button
            onClick={handleUpdateNow}
            className="bg-white hover:bg-emerald-50 text-[#16a34a] font-black text-xs py-2.5 px-3 rounded-xl shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer min-h-[44px]"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{lang === 'te' ? 'ఇప్పుడే అప్‌డేట్ చేయండి' : 'Update now'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
