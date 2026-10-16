import { AppConfig, PaidFeature } from '../types';

/**
 * =====================================================================
 * SANTHAKART SUBSCRIPTION & PRICING CONFIGURATION FILE
 * =====================================================================
 * Edit this file to customize:
 * 1. Default system configuration & launch trial date
 * 2. Subscription plans & tiers (Free, Farmer Pro, Trader / Dealer)
 * 3. Individual paid features and their prices
 * =====================================================================
 */

// 1. DEFAULT APP-LEVEL CONFIGURATION
export const DEFAULT_APP_CONFIG: AppConfig = {
  // Turn subscription paywall ON (true) or OFF (false)
  // When false, all features and post limits are 100% free for everyone
  subscriptionEnabled: false,

  // Free launch offer valid until date (Displayed on banners across the app)
  freeUntil: "2027-04-16",

  // Pricing defaults in Indian Rupees (₹)
  featuredPrice: 199,    // 7-day Top of Feed Boost
  premiumPrice: 499,     // Monthly Farmer Pro

  // Free Tier Limits (Active when subscriptionEnabled is true)
  freePostLimit: 10,     // Max active listings on free plan
  freePhotoLimit: 3,     // Max photos per listing on free plan
  allowVideoOnFree: false // Video tour enabled on free plan?
};

// 2. SUBSCRIPTION PLANS & TIERS
export interface SubscriptionPlan {
  id: 'free' | 'premium' | 'dealer';
  nameEn: string;
  nameTe: string;
  monthlyPrice: number;
  postLimit: number;
  photoLimit: number;
  videoAllowed: boolean;
  featuresEn: string[];
  featuresTe: string[];
  badgeColor: string;
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: "free",
    nameEn: "Rythu Free Plan",
    nameTe: "రైతు ఉచిత ప్లాన్",
    monthlyPrice: 0,
    postLimit: 10,
    photoLimit: 3,
    videoAllowed: false,
    featuresEn: [
      "Up to 10 active listings",
      "3 photos per listing",
      "Direct Call & WhatsApp buyer inquiries",
      "Standard marketplace search"
    ],
    featuresTe: [
      "10 లైవ్ ప్రకటనలు",
      "ఒక్కో ప్రకటనకు 3 ఫోటోలు",
      "నేరుగా కాల్ & వాట్సాప్ విచారణలు",
      "సాధారణ మార్కెట్ సెర్చ్"
    ],
    badgeColor: "stone"
  },
  {
    id: "premium",
    nameEn: "Farmer Pro (రైతు ప్రో)",
    nameTe: "రైతు ప్రో ప్లాన్",
    monthlyPrice: 299,
    postLimit: 30,
    photoLimit: 8,
    videoAllowed: true,
    featuresEn: [
      "Up to 30 active listings",
      "8 photos + 30-sec video tour",
      "Official Verified Seller green badge",
      "1 Free Featured Boost per month",
      "Daily AP Mandi Rate price alerts",
      "Call & lead analytics"
    ],
    featuresTe: [
      "30 లైవ్ ప్రకటనలు",
      "8 ఫోటోలు + 30-సెకన్ల వీడియో టూర్",
      "ధృవీకరించబడిన రైతు ఆకుపచ్చ బ్యాడ్జ్",
      "నెలకు 1 ఉచిత బూస్టెడ్ ప్రకటన",
      "రోజువారీ మార్కెట్ యార్డ్ రేట్ల అలర్ట్స్",
      "వ్యూస్ మరియు కాల్స్ ట్రాకర్"
    ],
    badgeColor: "orange"
  },
  {
    id: "dealer",
    nameEn: "Trader & Dealer (వ్యాపారి & డీలర్)",
    nameTe: "ట్రేడర్ & డీలర్ ప్లాన్",
    monthlyPrice: 799,
    postLimit: 100,
    photoLimit: 10,
    videoAllowed: true,
    featuresEn: [
      "Unlimited / 100 active listings",
      "Dedicated digital storefront & business profile",
      "Wholesale / bulk enquiry leads",
      "Priority customer helpline",
      "Top placement in district directory"
    ],
    featuresTe: [
      "100 ప్రకటనల వరకు కోటా",
      "ప్రత్యేక డిజిటల్ షాపు & ప్రొఫైల్ పేజీ",
      "హోల్‌సేల్ / లారీ లోడ్ బల్క్ విచారణలు",
      "ప్రాధాన్యత హెల్ప్‌లైన్ సపోర్ట్",
      "జిల్లా జాబితాలో మొదటి ప్రాధాన్యత"
    ],
    badgeColor: "emerald"
  }
];

// 3. INDIVIDUAL PAID FEATURES MATRIX
// Admin can toggle each on/off or edit price in the Admin Panel
export const ALL_PAID_FEATURES: PaidFeature[] = [
  {
    id: "f1",
    key: "featured_listing",
    nameEn: "Featured / Boosted Listing",
    nameTe: "ప్రత్యేక ప్రకటన (ఫీడ్ పైభాగంలో 7 రోజులు)",
    descEn: "Top of feed with golden badge for 7 days - 5x more buyer calls",
    descTe: "ఫీడ్ పైభాగంలో ప్రదర్శించబడుతుంది, 5 రెట్లు ఎక్కువ కాల్స్ వస్తాయి",
    price: 199,
    enabled: true,
    isUnlockedInFreeLaunch: true
  },
  {
    id: "f2",
    key: "verified_seller",
    nameEn: "Verified Farmer / Seller Badge",
    nameTe: "ధృవీకరించబడిన రైతు బ్యాడ్జ్",
    descEn: "Official green tick badge that builds trust and instant sales",
    descTe: "అమ్మకందారునికి నమ్మకమైన ఆకుపచ్చ టిక్ మార్క్ బ్యాడ్జ్",
    price: 299,
    enabled: true,
    isUnlockedInFreeLaunch: true
  },
  {
    id: "f3",
    key: "extra_posts",
    nameEn: "Extra Active Posts Quota",
    nameTe: "అదనపు యాక్టివ్ ప్రకటనల కోటా",
    descEn: "Post up to 50 active listings simultaneously",
    descTe: "ఒకేసారి 50 వరకు లైవ్ ప్రకటనలు ఉంచుకునే సౌకర్యం",
    price: 149,
    enabled: true,
    isUnlockedInFreeLaunch: true
  },
  {
    id: "f4",
    key: "video_tour",
    nameEn: "30-Sec Video Tour & 10 Photos",
    nameTe: "30-సెకన్ల వీడియో టూర్ & 10 ఫోటోలు",
    descEn: "Show full walk-around video of livestock, tractor or farm crop",
    descTe: "పశువు లేదా పొలం పూర్తి వీడియో చూపించే అవకాశం",
    price: 99,
    enabled: true,
    isUnlockedInFreeLaunch: true
  },
  {
    id: "f5",
    key: "bulk_wholesale",
    nameEn: "Bulk Wholesale Marketplace",
    nameTe: "హోల్‌సేల్ / బల్క్ ట్రేడ్ ఫీచర్",
    descEn: "Direct inquiries from verified wholesale traders and millers",
    descTe: "రైస్ మిల్లులు మరియు ట్రేడర్స్ నుండి నేరుగా లారీ లోడ్ విచారణలు",
    price: 399,
    enabled: true,
    isUnlockedInFreeLaunch: true
  },
  {
    id: "f6",
    key: "mandi_rates",
    nameEn: "Daily Mandi Rates & Alerts",
    nameTe: "రోజువారీ మార్కెట్ యార్డ్ ధరలు & అలర్ట్స్",
    descEn: "Daily AP market yard price notifications on WhatsApp & SMS",
    descTe: "గుంటూరు మిర్చి, మదనపల్లె టమోటా వంటి మార్కెట్ రేట్లు",
    price: 99,
    enabled: true,
    isUnlockedInFreeLaunch: true
  },
  {
    id: "f7",
    key: "seller_analytics",
    nameEn: "Seller Leads & Call Tracker",
    nameTe: "రైతు అనలిటిక్స్ (వ్యూస్, కాల్స్ & వాట్సాప్ లెక్కలు)",
    descEn: "See which buyers viewed your phone number and WhatsApp",
    descTe: "మీ ప్రకటన ఎంతమంది చూశారో, ఎవరు కాల్ చేసారో తెలుసుకోండి",
    price: 149,
    enabled: true,
    isUnlockedInFreeLaunch: true
  },
  {
    id: "f8",
    key: "dealer_profile",
    nameEn: "Agri Dealer & Nursery Business Page",
    nameTe: "డీలర్లు & నర్సరీల ప్రత్యేక బిజినెస్ పేజీ",
    descEn: "Dedicated storefront for fertiliser shops, nurseries & equipment",
    descTe: "ఎరువుల షాపులు, నర్సరీలు, యంత్రాల డీలర్లకు ప్రత్యేక డిజిటల్ షాపు",
    price: 599,
    enabled: true,
    isUnlockedInFreeLaunch: true
  }
];
