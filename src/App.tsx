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
import { PremiumFeaturesModal } from './screens/PremiumFeaturesModal';
import { AuthModal } from './components/AuthModal';
import { testConnection } from './firebase';

const MainApp: React.FC = () => {
  const { activeTab, toastMessage } = useApp();

  // Test Firestore connection on boot
  useEffect(() => {
    testConnection();
  }, []);

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
      case 'premium_features':
        return <PremiumFeaturesModal />;
      default:
        return <HomeScreen />;
    }
  };

  const showHeader = activeTab !== 'chat_detail' && activeTab !== 'listing_detail';
  const showBottomNav = activeTab !== 'chat_detail';

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col antialiased">
      {/* Global Header */}
      {showHeader && <Header />}

      {/* Screen Content Container */}
      <main className="flex-1 w-full max-w-5xl mx-auto">
        {renderActiveScreen()}
      </main>

      {/* Capacitor-ready Bottom Navigation */}
      {showBottomNav && <BottomNav />}

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
