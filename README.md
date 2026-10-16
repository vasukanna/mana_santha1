# SanthaKart (మన సంత - Mana Santha)
> **Everyone Connected. Every Need Met.**  
> *ప్రతి ఒక్కరూ అనుసంధానం. ప్రతి అవసరం నెరవేరుతుంది.*

SanthaKart is a mobile-first online rural and agricultural marketplace built with React, TypeScript, Tailwind CSS, and Firebase. It empowers farmers, traders, livestock owners, and rural buyers across Andhra Pradesh (including Nellore, Chittoor, Tirupati, Kadapa, Ongole, Bapatla, Anantapur, and all other 26 AP districts) to trade directly without middlemen.

---

## 🌟 Key Features

1. **Bilingual by Default (Telugu & English)**
   - Telugu (`తెలుగు`) is the default language.
   - 1-tap language toggle at the top of every screen.
   - High-contrast, large icons and big touch targets for easy usage by farmers and low-literacy users.

2. **Andhra Pradesh Geographic Coverage**
   - Priority coverage for **Nellore, Chittoor, Tirupati, Kadapa, Ongole (Prakasam), Bapatla, and Anantapur**, complete with hundreds of mandals and villages.
   - Full coverage for all remaining AP districts (Guntur, NTR, Krishna, Godavari, Rayalaseema, and Uttarandhra).

3. **12 Comprehensive Categories with Custom Fields**
   - **Livestock (పశువులు)**: Sheep, Goats, Buffalo, Cows/Bulls, Country Poultry, Eggs. *Fields: Breed, Age, Weight, Gender, Health, Milk yield.*
   - **Aqua (ఆక్వా)**: Fish, Shrimp, Fish seed, Feed. *Fields: Count/Size per kg, Water type, Harvest readiness.*
   - **Cereals & Millets (ధాన్యాలు)**: Paddy, Maize, Jowar, Bajra, Ragi. *Fields: Variety (BPT, RNR, Sona Masoori), Quantity, Grade, Organic.*
   - **Pulses (పప్పు ధాన్యాలు)**: Red gram, Black gram, Green gram, Bengal gram.
   - **Oilseeds (నూనెగింజలు)**: Groundnut (K6 Lepakshi), Sesame, Sunflower, Castor, Oil palm.
   - **Commercial Crops (వాణిజ్య పంటలు)**: Chilli, Cotton, Tobacco, Sugarcane, Turmeric, Cashew, Coconut, Cocoa.
   - **Fruits (పండ్లు)**: Mango, Banana, Citrus/Sweet Orange, Papaya, Guava, Watermelon, Pomegranate.
   - **Vegetables (కూరగాయలు)**: Tomato, Onion, Brinjal, Okra, Green chilli, Leafy veg, Flowers.
   - **Agri Inputs (ఉత్పాదకాలు)**: Fertilisers, Seeds, Pesticides, Vermicompost, Cattle feed.
   - **Machinery & Rentals (యంత్రాలు & అద్దెలు)**: Tractors, Tillers, Sprayers, Pumps, Harvester rentals, Labour contractors.
   - **Land & Lease (భూములు & కౌలు)**: Agri land sale, Crop lease, Farm sheds.
   - **Other Needs (ఇతర అవసరాలు)**: Used farm equipment, household items, services.

4. **1-Tap Direct Contact & Negotiation**
   - Instant Phone Call (`tel:`).
   - Direct WhatsApp message with pre-filled Telugu/English ad title and link.
   - Real-time in-app 1-to-1 chat with quick Telugu farmer replies.

5. **Free Launch Period & Paywall Logic**
   - Managed via `config/app` (`subscriptionEnabled: false` by default, `freeUntil: 2027-04-16`).
   - All 10 paid features (Featured boosts, verified seller badge, video upload, buyer alerts, seller analytics) are currently unlocked 100% free.
   - The paywall switch can be turned on from the Admin panel without requiring any app update!

6. **Safety & Play Store Compliance**
   - "Delete My Account" option permanently removes user data (Play Store mandatory policy).
   - Reporting system with admin review.
   - Verified seller checkmarks.

---

## 📱 Packaging as an Android App with Capacitor

To build an Android APK for Google Play Store:

```bash
# 1. Install Capacitor CLI and Android core
npm install @capacitor/core
npm install -D @capacitor/cli @capacitor/android

# 2. Initialize Capacitor
npx cap init "SanthaKart" "com.santhakart.app" --web-dir "dist"

# 3. Build production web assets
npm run build

# 4. Add Android platform
npx cap add android

# 5. Sync web build to Android project
npx cap sync android

# 6. Open in Android Studio to build APK or AAB
npx cap open android
```

---

## 🔒 Firebase Configuration & Deployment

1. **Authentication**: Google Sign-In is configured.
2. **Firestore Collections**:
   - `users`: User profiles, district, mandal, village, phone, verification status.
   - `listings`: Active, sold, and featured listings with category specs.
   - `chats`: Conversation threads.
   - `chats/{chatId}/messages`: Realtime message logs.
   - `reports`: User complaints and moderation queue.
   - `config/app`: App configuration and launch period dates.
   - `config/features`: Feature matrix with toggle flags and prices.
3. **Security Rules**:
   - Security rules are defined in `firestore.rules` and deployed to your Firebase project.
   - Users can only edit their own listings and profile.
   - Admins (`naren.papanaboina@gmail.com` and `vasu.kannaluri@gmail.com`) have full moderation and config editing rights.

---

## 📂 Project Structure

```
├── firebase-applet-config.json  # Firebase credentials
├── firebase-blueprint.json      # Firestore Blueprint IR
├── firestore.rules              # Hardened ABAC security rules
├── index.html                   # Mobile-first viewport, Telugu fonts
├── metadata.json                # AI Studio application metadata
├── package.json                 # Dependencies
├── src/
│   ├── App.tsx                  # Main app container & routing
│   ├── firebase.ts              # Firebase init, errors, and image compressor
│   ├── types.ts                 # TypeScript data contracts
│   ├── components/
│   │   ├── BrandLogo.tsx        # "MANA Santha" stall & sprout logo
│   │   ├── Header.tsx           # Brand header, district selector & language toggle
│   │   ├── BottomNav.tsx        # Capacitor bottom navigation
│   │   ├── ListingCard.tsx      # Card with call/WhatsApp 1-tap actions
│   │   └── CategoryIcon.tsx     # Dynamic category icons
│   ├── context/
│   │   └── AppContext.tsx       # Auth, listings, search, language state
│   ├── data/
│   │   ├── apLocations.ts       # Nellore, Chittoor, Tirupati, Kadapa, Ongole, etc.
│   │   ├── categories.ts        # 12 Categories and custom fields
│   │   ├── initialListings.ts   # Seed listings across AP districts
│   │   └── translations.ts      # Comprehensive Telugu & English dictionary
│   └── screens/
│       ├── HomeScreen.tsx       # Search, filter chips, categories, newest ads
│       ├── CategoriesScreen.tsx # 12 category explorer
│       ├── SellScreen.tsx       # Post listing flow with <1MB image compression
│       ├── ListingDetailScreen.tsx # Full spec view, seller card, 1-tap call/WA/chat
│       ├── ChatScreen.tsx       # Chat inbox
│       ├── ChatDetailScreen.tsx # 1-to-1 live chat with quick responses
│       ├── MyAdsScreen.tsx      # Active/sold tabs, leads tracker, 1-tap sold
│       ├── SavedItemsScreen.tsx # Wishlist
│       ├── ProfileScreen.tsx    # User profile, role, Play Store account deletion
│       ├── AdminScreen.tsx      # Protected panel: listings, reports, config
│       ├── SafetyPolicyScreen.tsx # Privacy & Terms
│       └── PremiumFeaturesModal.tsx # 10 paid features unlocked free
```
