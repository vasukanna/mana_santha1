import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import {
  auth,
  db,
  googleProvider,
  OperationType,
  handleFirestoreError
} from '../firebase';
import { signInWithPopup, signOut as fbSignOut, onAuthStateChanged } from 'firebase/auth';
import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  where
} from 'firebase/firestore';
import { UserProfile, Listing, AppConfig, PaidFeature } from '../types';
import { Language, translations } from '../data/translations';
import { INITIAL_LISTINGS } from '../data/initialListings';

const ADMIN_EMAILS = [
  'naren.papanaboina@gmail.com',
  'vasu.kannaluri@gmail.com'
];

interface AppContextType {
  lang: Language;
  setLang: (l: Language) => void;
  t: typeof translations['te'];
  currentUser: User | null;
  userProfile: UserProfile | null;
  authLoading: boolean;
  isAdmin: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateProfileData: (data: Partial<UserProfile>) => Promise<void>;
  deleteUserAccount: () => Promise<void>;

  // Navigation
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedListing: Listing | null;
  openListingDetail: (listing: Listing) => void;
  activeChatId: string | null;
  openChatThread: (chatId: string) => void;

  // Listings
  listings: Listing[];
  listingsLoading: boolean;
  refreshListings: () => Promise<void>;
  createListing: (listingData: Omit<Listing, 'id' | 'createdAt'>) => Promise<string>;
  updateListingStatus: (listingId: string, status: 'active' | 'sold' | 'removed') => Promise<void>;
  deleteListing: (listingId: string) => Promise<void>;
  toggleFeatureListing: (listingId: string, featured: boolean) => Promise<void>;
  incrementContactCount: (listingId: string, type: 'call' | 'whatsapp') => Promise<void>;

  // Saved Listings
  savedIds: string[];
  toggleSaveListing: (listingId: string) => Promise<void>;

  // Filters
  selectedDistrict: string;
  setSelectedDistrict: (d: string) => void;
  selectedMandal: string;
  setSelectedMandal: (m: string) => void;
  selectedCategory: string;
  setSelectedCategory: (c: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  sortOption: 'newest' | 'price_asc' | 'price_desc';
  setSortOption: (s: 'newest' | 'price_asc' | 'price_desc') => void;
  onlyVerified: boolean;
  setOnlyVerified: (v: boolean) => void;

  // Config & Features
  appConfig: AppConfig;
  updateAppConfig: (cfg: Partial<AppConfig>) => Promise<void>;
  paidFeatures: PaidFeature[];
  togglePaidFeature: (key: string, enabled: boolean, price?: number) => void;

  // Toast
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

import { DEFAULT_APP_CONFIG, ALL_PAID_FEATURES } from '../config/subscriptionPlans';

const DEFAULT_CONFIG: AppConfig = DEFAULT_APP_CONFIG;
const DEFAULT_FEATURES: PaidFeature[] = ALL_PAID_FEATURES;

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Language (Telugu is default as requested)
  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem('santhakart_lang');
    return (saved === 'en' ? 'en' : 'te') as Language;
  });

  const setLang = (l: Language) => {
    setLangState(l);
    localStorage.setItem('santhakart_lang', l);
  };

  const t = translations[lang];

  // Auth & Profile
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Navigation
  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  // Listings
  const [listings, setListings] = useState<Listing[]>(INITIAL_LISTINGS);
  const [listingsLoading, setListingsLoading] = useState<boolean>(true);

  // Saved Listings
  const [savedIds, setSavedIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('santhakart_saved');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Filters
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [selectedMandal, setSelectedMandal] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOption, setSortOption] = useState<'newest' | 'price_asc' | 'price_desc'>('newest');
  const [onlyVerified, setOnlyVerified] = useState<boolean>(false);

  // Config & Features
  const [appConfig, setAppConfig] = useState<AppConfig>(DEFAULT_CONFIG);
  const [paidFeatures, setPaidFeatures] = useState<PaidFeature[]>(DEFAULT_FEATURES);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => (prev === msg ? null : prev));
    }, 3200);
  };

  // Determine if current user is admin
  const isAdmin = Boolean(
    currentUser?.email && ADMIN_EMAILS.includes(currentUser.email.toLowerCase())
  );

  // Listen for Auth changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const snap = await getDoc(userDocRef);
          if (snap.exists()) {
            setUserProfile(snap.data() as UserProfile);
          } else {
            // New user template
            const newProfile: UserProfile = {
              uid: user.uid,
              name: user.displayName || 'రైతు మిత్రుడు',
              phone: '',
              email: user.email || '',
              district: 'Nellore (SPSR Nellore)',
              village: '',
              mandal: '',
              role: 'both',
              plan: 'free',
              isVerified: ADMIN_EMAILS.includes((user.email || '').toLowerCase()),
              isBanned: false,
              createdAt: new Date().toISOString()
            };
            setUserProfile(newProfile);
            // Will prompt user to fill phone number & village
          }
        } catch (error) {
          console.error("Error loading user profile:", error);
        }
      } else {
        setUserProfile(null);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Listen for config from Firestore
  useEffect(() => {
    const configDocRef = doc(db, 'config', 'app');
    const unsubConfig = onSnapshot(configDocRef, (snap) => {
      if (snap.exists()) {
        setAppConfig(snap.data() as AppConfig);
      }
    }, (err) => {
      console.warn("Config listener notice (using default offline config):", err.message);
    });

    return () => unsubConfig();
  }, []);

  // Listen for Listings from Firestore
  useEffect(() => {
    const listingsCol = collection(db, 'listings');
    const q = query(listingsCol, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const loaded: Listing[] = [];
          snapshot.forEach((docSnap) => {
            loaded.push({ id: docSnap.id, ...(docSnap.data() as Omit<Listing, 'id'>) });
          });
          setListings(loaded);
        } else {
          // If Firestore is brand new/empty, show initial seed listings
          setListings(INITIAL_LISTINGS);
        }
        setListingsLoading(false);
      },
      (error) => {
        console.warn('Firestore listings fetch notice:', error.message);
        // Fallback to initial listings
        setListings(INITIAL_LISTINGS);
        setListingsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Google Sign-In
  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const userDocRef = doc(db, 'users', user.uid);
      const snap = await getDoc(userDocRef);

      if (!snap.exists()) {
        const initialProfile: UserProfile = {
          uid: user.uid,
          name: user.displayName || 'రైతు మిత్రుడు',
          phone: '',
          email: user.email || '',
          district: 'Nellore (SPSR Nellore)',
          mandal: 'Kavali',
          village: '',
          role: 'both',
          plan: 'free',
          isVerified: ADMIN_EMAILS.includes((user.email || '').toLowerCase()),
          isBanned: false,
          createdAt: new Date().toISOString()
        };
        await setDoc(userDocRef, initialProfile);
        setUserProfile(initialProfile);
        showToast(lang === 'te' ? 'లాగిన్ విజయవంతమైంది! దయచేసి మొబైల్ నంబర్ పూర్తి చేయండి.' : 'Welcome! Please update your mobile number.');
      } else {
        setUserProfile(snap.data() as UserProfile);
        showToast(lang === 'te' ? 'తిరిగి స్వాగతం!' : 'Welcome back!');
      }
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      showToast(lang === 'te' ? 'లాగిన్ లో సమస్య ఏర్పడింది. దయచేసి మళ్లీ ప్రయత్నించండి.' : 'Sign-in failed. Please try again.');
    }
  };

  // Sign out
  const logout = async () => {
    try {
      await fbSignOut(auth);
      setCurrentUser(null);
      setUserProfile(null);
      showToast(lang === 'te' ? 'లాగ్ అవుట్ అయ్యారు.' : 'Signed out successfully.');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  // Update Profile
  const updateProfileData = async (data: Partial<UserProfile>) => {
    if (!currentUser) return;
    try {
      const docRef = doc(db, 'users', currentUser.uid);
      await updateDoc(docRef, data);
      setUserProfile((prev) => (prev ? { ...prev, ...data } : null));
      showToast(lang === 'te' ? 'ప్రొఫైల్ వివరాలు భద్రపరచబడ్డాయి!' : 'Profile updated successfully!');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${currentUser.uid}`);
    }
  };

  // Delete User Account (Play Store Compliance)
  const deleteUserAccount = async () => {
    if (!currentUser) return;
    try {
      const userUid = currentUser.uid;
      // Mark listings as removed or delete user doc
      const userDocRef = doc(db, 'users', userUid);
      await deleteDoc(userDocRef);
      await fbSignOut(auth);
      setCurrentUser(null);
      setUserProfile(null);
      showToast(lang === 'te' ? 'మీ ఖాతా శాశ్వతంగా తొలగించబడింది.' : 'Your account has been deleted.');
    } catch (error) {
      console.error('Account deletion error:', error);
      showToast('Error deleting account');
    }
  };

  // Open Listing
  const openListingDetail = (listing: Listing) => {
    setSelectedListing(listing);
    setActiveTab('listing_detail');
    // Track views
    if (listing.id && !listing.id.startsWith('init_')) {
      try {
        const ref = doc(db, 'listings', listing.id);
        updateDoc(ref, { viewsCount: (listing.viewsCount || 0) + 1 });
      } catch (e) {
        // quiet ignore
      }
    }
  };

  // Open Chat
  const openChatThread = (chatId: string) => {
    setActiveChatId(chatId);
    setActiveTab('chat_detail');
  };

  // Create Listing
  const createListing = async (listingData: Omit<Listing, 'id' | 'createdAt'>): Promise<string> => {
    if (!currentUser) throw new Error('User not authenticated');
    
    // Check free post limit if subscription enabled
    if (appConfig.subscriptionEnabled) {
      const userListings = listings.filter(l => l.sellerId === currentUser.uid && l.status === 'active');
      if (userListings.length >= appConfig.freePostLimit) {
        throw new Error(`Free limit of ${appConfig.freePostLimit} active posts reached.`);
      }
    }

    try {
      const newDocRef = doc(collection(db, 'listings'));
      const newListing: Listing = {
        ...listingData,
        id: newDocRef.id,
        createdAt: new Date().toISOString(),
        viewsCount: 1,
        callsCount: 0,
        whatsappCount: 0
      };

      await setDoc(newDocRef, newListing);
      setListings(prev => [newListing, ...prev]);
      showToast(lang === 'te' ? 'మీ ప్రకటన విజయవంతంగా పోస్ట్ చేయబడింది!' : 'Your listing is live now!');
      return newDocRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'listings');
      throw error;
    }
  };

  // Update status (mark as sold, etc.)
  const updateListingStatus = async (listingId: string, status: 'active' | 'sold' | 'removed') => {
    try {
      if (!listingId.startsWith('init_')) {
        const ref = doc(db, 'listings', listingId);
        await updateDoc(ref, { status });
      }
      setListings(prev =>
        prev.map(item => (item.id === listingId ? { ...item, status } : item))
      );
      showToast(
        status === 'sold'
          ? (lang === 'te' ? 'అభినందనలు! ప్రకటన అమ్మినట్లు మార్చబడింది.' : 'Marked as sold!')
          : (lang === 'te' ? 'స్టేటస్ అప్‌డేట్ చేయబడింది.' : 'Status updated.')
      );
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `listings/${listingId}`);
    }
  };

  // Delete listing
  const deleteListing = async (listingId: string) => {
    try {
      if (!listingId.startsWith('init_')) {
        const ref = doc(db, 'listings', listingId);
        await deleteDoc(ref);
      }
      setListings(prev => prev.filter(item => item.id !== listingId));
      showToast(lang === 'te' ? 'ప్రకటన తొలగించబడింది.' : 'Listing deleted.');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `listings/${listingId}`);
    }
  };

  // Toggle Feature / Boost
  const toggleFeatureListing = async (listingId: string, featured: boolean) => {
    try {
      if (!listingId.startsWith('init_')) {
        const ref = doc(db, 'listings', listingId);
        await updateDoc(ref, { featured });
      }
      setListings(prev =>
        prev.map(item => (item.id === listingId ? { ...item, featured } : item))
      );
      showToast(
        featured
          ? (lang === 'te' ? 'ప్రకటన ప్రత్యేక జాబితాలోకి బూస్ట్ చేయబడింది!' : 'Listing boosted to featured!')
          : (lang === 'te' ? 'ప్రత్యేక జాబితా నుండి తొలగించబడింది.' : 'Un-featured.')
      );
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `listings/${listingId}`);
    }
  };

  // Increment Call or WhatsApp leads
  const incrementContactCount = async (listingId: string, type: 'call' | 'whatsapp') => {
    if (listingId.startsWith('init_')) return;
    try {
      const ref = doc(db, 'listings', listingId);
      const field = type === 'call' ? 'callsCount' : 'whatsappCount';
      const current = selectedListing ? (selectedListing[field] || 0) : 0;
      await updateDoc(ref, { [field]: current + 1 });
    } catch (e) {
      // ignore
    }
  };

  // Toggle Save / Wishlist
  const toggleSaveListing = async (listingId: string) => {
    let next: string[];
    if (savedIds.includes(listingId)) {
      next = savedIds.filter(id => id !== listingId);
      showToast(lang === 'te' ? 'సేవ్ చేసిన జాబితా నుండి తీసివేయబడింది.' : 'Removed from saved items');
    } else {
      next = [...savedIds, listingId];
      showToast(lang === 'te' ? 'ప్రకటన సేవ్ చేయబడింది! నా సేవ్స్ లో చూడవచ్చు.' : 'Saved to your wishlist!');
    }
    setSavedIds(next);
    localStorage.setItem('santhakart_saved', JSON.stringify(next));

    if (currentUser) {
      try {
        const saveDocRef = doc(db, 'savedItems', `${currentUser.uid}_${listingId}`);
        if (savedIds.includes(listingId)) {
          await deleteDoc(saveDocRef);
        } else {
          await setDoc(saveDocRef, {
            userId: currentUser.uid,
            listingId,
            createdAt: new Date().toISOString()
          });
        }
      } catch (err) {
        // silent
      }
    }
  };

  // Refresh Listings manually
  const refreshListings = async () => {
    setListingsLoading(true);
    setTimeout(() => {
      setListingsLoading(false);
      showToast(lang === 'te' ? 'తాజా ప్రకటనలు లోడ్ అయ్యాయి' : 'Feed refreshed');
    }, 600);
  };

  // Admin: Update App Config
  const updateAppConfig = async (cfg: Partial<AppConfig>) => {
    const newCfg = { ...appConfig, ...cfg };
    setAppConfig(newCfg);
    try {
      const ref = doc(db, 'config', 'app');
      await setDoc(ref, newCfg, { merge: true });
      showToast(lang === 'te' ? 'కాన్ఫిగరేషన్ అప్‌డేట్ అయ్యింది' : 'App configuration updated');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'config/app');
    }
  };

  // Admin: Toggle Paid Feature
  const togglePaidFeature = (key: string, enabled: boolean, price?: number) => {
    setPaidFeatures(prev =>
      prev.map(f =>
        f.key === key
          ? { ...f, enabled, ...(price !== undefined ? { price } : {}) }
          : f
      )
    );
    showToast(lang === 'te' ? 'ఫీచర్ స్థితి మార్చబడింది' : 'Feature updated');
  };

  return (
    <AppContext.Provider
      value={{
        lang,
        setLang,
        t,
        currentUser,
        userProfile,
        authLoading,
        isAdmin,
        loginWithGoogle,
        logout,
        updateProfileData,
        deleteUserAccount,

        activeTab,
        setActiveTab,
        selectedListing,
        openListingDetail,
        activeChatId,
        openChatThread,

        listings,
        listingsLoading,
        refreshListings,
        createListing,
        updateListingStatus,
        deleteListing,
        toggleFeatureListing,
        incrementContactCount,

        savedIds,
        toggleSaveListing,

        selectedDistrict,
        setSelectedDistrict,
        selectedMandal,
        setSelectedMandal,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        sortOption,
        setSortOption,
        onlyVerified,
        setOnlyVerified,

        appConfig,
        updateAppConfig,
        paidFeatures,
        togglePaidFeature,

        toastMessage,
        showToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
