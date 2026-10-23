import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomeScreen } from './screens/HomeScreen';
import { CategoriesScreen } from './screens/CategoriesScreen';
import { SellScreen } from './screens/SellScreen';
import { ChatScreen } from './screens/ChatScreen';
import { ChatDetailScreen } from './screens/ChatDetailScreen';
import { MyAdsScreen } from './screens/MyAdsScreen';
import { ListingDetailScreen } from './screens/ListingDetailScreen';
import { SavedItemsScreen } from './screens/SavedItemsScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { AdminScreen } from './screens/AdminScreen';
import { SafetyPolicyScreen } from './screens/SafetyPolicyScreen';
import { PrivacyPolicyScreen } from './screens/PrivacyPolicyScreen';
import { DownloadScreen } from './screens/DownloadScreen';
import { PremiumFeaturesModal } from './screens/PremiumFeaturesModal';
import { AuthModal } from './components/AuthModal';
import { PWAInstallBanner } from './components/PWAInstallBanner';
import { PWAUpdateBanner } from './components/PWAUpdateBanner';
import { testConnection } from './firebase';

const MainApp: React.FC = () => {
  const { activeTab, setActiveTab, toastMessage } = useApp();

  // Test Firestore connection on boot & handle /privacy and /download routes
  useEffect(() => {
    testConnection();
    const path = window.location.pathname;
    if (path === '/privacy' || path === '/privacy.html') {
      setActiveTab('privacy');
    } else if (path === '/download' || path === '/download.html') {
      setActiveTab('download');
    }
  }, [setActiveTab]);

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen />;
      case 'categories':
        return <CategoriesScreen />;
      case 'sell':
        return <SellScreen />;
      case 'chats':
        return <ChatScreen />;
      case 'chat_detail':
        return <ChatDetailScreen />;
      case 'my_ads':
        return <MyAdsScreen />;
      case 'listing_detail':
        return <ListingDetailScreen />;
      case 'saved':
        return <SavedItemsScreen />;
      case 'profile':
        return <ProfileScreen />;
      case 'admin':
        return <AdminScreen />;
      case 'safety_policy':
        return <SafetyPolicyScreen />;
      case 'privacy':
      case 'privacy_policy':
        return <PrivacyPolicyScreen />;
      case 'download':
        return <DownloadScreen />;
      case 'premium_features':
        return <PremiumFeaturesModal />;
      default:
        return <HomeScreen />;
    }
  };

  const showHeader = activeTab !== 'chat_detail' && activeTab !== 'listing_detail' && activeTab !== 'privacy' && activeTab !== 'download';
  const showBottomNav = activeTab !== 'chat_detail';

  return (
    <div className="min-h-screen bg-[#faf8f5] flex flex-col antialiased">
      {/* Global Header */}
      {showHeader && <Header />}

      {/* Screen Content Container */}
      <main className="flex-1 w-full max-w-5xl mx-auto">
        {renderActiveScreen()}
      </main>

      {/* Mobile Bottom Navigation */}
      {showBottomNav && <BottomNav />}

      {/* PWA Install Banner (Android & iOS) */}
      <PWAInstallBanner />

      {/* PWA Update Notification Banner */}
      <PWAUpdateBanner />

      {/* Global Auth Troubleshooting & Sign-In Modal */}
      <AuthModal />

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 bg-stone-900/95 backdrop-blur-md text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-xl border border-white/10 animate-in fade-in slide-in-from-top-4 duration-200 max-w-sm text-center">
          {toastMessage}
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
