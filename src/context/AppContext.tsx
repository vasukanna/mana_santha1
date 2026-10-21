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
  getDocs,
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

export interface AuthUser {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL?: string | null;
}

interface AppContextType {
  lang: Language;
  setLang: (l: Language) => void;
  t: typeof translations['te'];
  currentUser: AuthUser | null;
  userProfile: UserProfile | null;
  authLoading: boolean;
  isAdmin: boolean;
  loginWithGoogle: () => Promise<void>;
  quickLogin: (type: 'farmer' | 'admin' | 'custom', customData?: Partial<UserProfile>) => Promise<void>;
  logout: () => Promise<void>;
  updateProfileData: (data: Partial<UserProfile>) => Promise<void>;
  deleteUserAccount: () => Promise<void>;
  blockedUserIds: string[];
  blockUser: (userId: string, userName?: string) => Promise<void>;
  unblockUser: (userId: string) => Promise<void>;
  isUserBlocked: (userId: string) => boolean;
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  authErrorDetail: { code?: string; message?: string } | null;
  setAuthErrorDetail: (detail: { code?: string; message?: string } | null) => void;

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
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authErrorDetail, setAuthErrorDetail] = useState<{ code?: string; message?: string } | null>(null);

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

  // Blocked Users (Google Play Safety Compliance)
  const [blockedUserIds, setBlockedUserIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('santhakart_blocked');
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

  // Listen for Auth changes & restore quick session if available
  useEffect(() => {
    try {
      const quickSession = localStorage.getItem('santhakart_quick_session');
      if (quickSession) {
        const parsed = JSON.parse(quickSession);
        if (parsed.user && parsed.profile) {
          setCurrentUser(parsed.user);
          setUserProfile(parsed.profile);
          setAuthLoading(false);
        }
      }
    } catch (e) {
      console.warn('Error reading quick session:', e);
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const snap = await getDoc(userDocRef);
          if (snap.exists()) {
            setUserProfile(snap.data() as UserProfile);
          } else {
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
          }
        } catch (error) {
          console.error("Error loading user profile:", error);
        }
      } else {
        const quickSession = localStorage.getItem('santhakart_quick_session');
        if (!quickSession) {
          setCurrentUser(null);
          setUserProfile(null);
        }
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

  // Google Sign-In with diagnosis modal fallback
  const loginWithGoogle = async () => {
    try {
      setAuthErrorDetail(null);
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      localStorage.removeItem('santhakart_quick_session');
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
      setAuthModalOpen(false);
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      const code = error?.code || 'auth/unknown';
      const msg = error?.message || 'Authentication error';
      setAuthErrorDetail({ code, message: msg });
      setAuthModalOpen(true);
      showToast(lang === 'te' ? 'గూగుల్ లాగిన్ లో సమస్య ఏర్పడింది. మార్గదర్శకాలను చూడండి.' : 'Google sign-in notice. Open settings to resolve.');
    }
  };

  // Quick Sign-In Bypass (Test / Farmer / Admin mode - zero domain restriction)
  const quickLogin = async (type: 'farmer' | 'admin' | 'custom', customData?: Partial<UserProfile>) => {
    let mockUser: AuthUser;
    let mockProfile: UserProfile;

    if (type === 'admin') {
      mockUser = {
        uid: 'admin_vasu_kannaluri',
        displayName: 'Vasu Kannaluri (Admin)',
        email: 'vasu.kannaluri@gmail.com',
        photoURL: null
      };
      mockProfile = {
        uid: mockUser.uid,
        name: 'Vasu Kannaluri',
        phone: '9440123456',
        email: 'vasu.kannaluri@gmail.com',
        district: 'Nellore (SPSR Nellore)',
        mandal: 'Nellore Urban',
        village: 'Chennavarappadu',
        role: 'both',
        plan: 'dealer',
        isVerified: true,
        isBanned: false,
        createdAt: new Date().toISOString()
      };
    } else if (type === 'farmer') {
      mockUser = {
        uid: 'farmer_venkateswarlu_nlr',
        displayName: 'వెంకటేశ్వర్లు రెడ్డి (Venkateswarlu)',
        email: 'farmer.nellore@santhakart.in',
        photoURL: null
      };
      mockProfile = {
        uid: mockUser.uid,
        name: 'వెంకటేశ్వర్లు రెడ్డి',
        phone: '9849234567',
        email: 'farmer.nellore@santhakart.in',
        district: 'Nellore (SPSR Nellore)',
        mandal: 'Sangam',
        village: 'Chennavarappadu',
        role: 'seller',
        plan: 'free',
        isVerified: true,
        isBanned: false,
        createdAt: new Date().toISOString()
      };
    } else {
      const name = customData?.name || 'రైతు మిత్రుడు';
      const phone = customData?.phone || '9440123456';
      const dist = customData?.district || 'Nellore (SPSR Nellore)';
      const role = customData?.role || 'both';
      const uid = `custom_${Date.now()}`;
      mockUser = {
        uid,
        displayName: name,
        email: `${uid}@santhakart.in`,
        photoURL: null
      };
      mockProfile = {
        uid,
        name,
        phone,
        email: mockUser.email || '',
        district: dist,
        mandal: customData?.mandal || 'Kavali',
        village: customData?.village || '',
        role,
        plan: 'free',
        isVerified: false,
        isBanned: false,
        createdAt: new Date().toISOString()
      };
    }

    setCurrentUser(mockUser);
    setUserProfile(mockProfile);
    localStorage.setItem('santhakart_quick_session', JSON.stringify({ user: mockUser, profile: mockProfile }));

    try {
      await setDoc(doc(db, 'users', mockUser.uid), mockProfile, { merge: true });
    } catch (e) {
      console.warn('Firestore fallback for user profile:', e);
    }

    showToast(lang === 'te' ? `${mockProfile.name} గా లాగిన్ అయ్యారు!` : `Signed in as ${mockProfile.name}!`);
    setAuthModalOpen(false);
  };

  // Sign out
  const logout = async () => {
    try {
      localStorage.removeItem('santhakart_quick_session');
      await fbSignOut(auth);
      setCurrentUser(null);
      setUserProfile(null);
      showToast(lang === 'te' ? 'లాగ్ అవుట్ అయ్యారు.' : 'Signed out successfully.');
    } catch (error) {
      console.error('Sign out error:', error);
      setCurrentUser(null);
      setUserProfile(null);
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

  // Delete User Account & Their Posts (Google Play Store Compliance)
  const deleteUserAccount = async () => {
    if (!currentUser) return;
    try {
      const userUid = currentUser.uid;

      // 1. Delete all listings posted by this user from Firestore
      try {
        const userListingsQ = query(collection(db, 'listings'), where('sellerId', '==', userUid));
        const snap = await getDocs(userListingsQ);
        for (const docItem of snap.docs) {
          await deleteDoc(docItem.ref);
        }
      } catch (listErr) {
        console.warn('Error purging user listings during account deletion:', listErr);
      }

      // Also remove local state listings
      setListings(prev => prev.filter(l => l.sellerId !== userUid));

      // 2. Delete user profile doc from Firestore
      try {
        const userDocRef = doc(db, 'users', userUid);
        await deleteDoc(userDocRef);
      } catch (docErr) {
        console.warn('Error deleting user document:', docErr);
      }

      // 3. Delete Firebase Auth user account if possible
      if (auth.currentUser) {
        try {
          await auth.currentUser.delete();
        } catch (authDelErr) {
          console.warn('Firebase Auth user delete warning:', authDelErr);
        }
      }

      // 4. Clear local session & sign out
      localStorage.removeItem('santhakart_quick_session');
      await fbSignOut(auth);
      setCurrentUser(null);
      setUserProfile(null);
      setActiveTab('home');
      showToast(
        lang === 'te'
          ? 'మీ ఖాతా మరియు పోస్ట్ చేసిన ప్రకటనలు శాశ్వతంగా తొలగించబడ్డాయి.'
          : 'Your account and all posted listings have been permanently deleted.'
      );
    } catch (error) {
      console.error('Account deletion error:', error);
      showToast('Error deleting account');
    }
  };

  // Block & Unblock Users (Google Play Safety Compliance)
  const blockUser = async (userId: string, userName?: string) => {
    if (!userId) return;
    const updated = Array.from(new Set([...blockedUserIds, userId]));
    setBlockedUserIds(updated);
    localStorage.setItem('santhakart_blocked', JSON.stringify(updated));
    showToast(
      lang === 'te'
        ? `${userName || 'యూజర్'} బ్లాక్ చేయబడ్డారు. వారి ప్రకటనలు మరియు సందేశాలు ఇకపై కనిపించవు.`
        : 'User blocked. Their listings and messages are now hidden.'
    );
  };

  const unblockUser = async (userId: string) => {
    const updated = blockedUserIds.filter(id => id !== userId);
    setBlockedUserIds(updated);
    localStorage.setItem('santhakart_blocked', JSON.stringify(updated));
    showToast(lang === 'te' ? 'యూజర్‌ను అన్‌బ్లాక్ చేసారు.' : 'User unblocked.');
  };

  const isUserBlocked = (userId: string) => {
    return blockedUserIds.includes(userId);
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
        quickLogin,
        logout,
        updateProfileData,
        deleteUserAccount,
        blockedUserIds,
        blockUser,
        unblockUser,
        isUserBlocked,
        authModalOpen,
        setAuthModalOpen,
        authErrorDetail,
        setAuthErrorDetail,

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
