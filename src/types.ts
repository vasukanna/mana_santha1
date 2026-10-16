export interface UserProfile {
  uid: string;
  name: string;
  phone: string;
  email?: string;
  village?: string;
  mandal?: string;
  district: string;
  role: 'seller' | 'buyer' | 'both';
  plan: 'free' | 'premium' | 'dealer';
  planExpiry?: string;
  isVerified?: boolean;
  isBanned?: boolean;
  createdAt: string;
}

export interface Listing {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerPhone: string;
  category: string;
  subcategory: string;
  title: string;
  description: string;
  price: number;
  negotiable: boolean;
  quantity?: string;
  images: string[];
  video?: string;
  district: string;
  mandal: string;
  village: string;
  status: 'active' | 'sold' | 'removed';
  featured: boolean;
  customFields?: Record<string, any>;
  createdAt: string;
  viewsCount?: number;
  callsCount?: number;
  whatsappCount?: number;
}

export interface ChatThread {
  id: string;
  listingId: string;
  listingTitle: string;
  listingImage?: string;
  listingPrice?: number;
  sellerId: string;
  buyerId: string;
  participants: string[];
  participantNames: Record<string, string>;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount?: Record<string, number>;
}

export interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  text: string;
  createdAt: string;
}

export interface ListingReport {
  id: string;
  reporterId: string;
  reporterName: string;
  listingId: string;
  listingTitle: string;
  reportedUserId: string;
  reason: string;
  details?: string;
  status: 'pending' | 'resolved' | 'dismissed';
  createdAt: string;
}

export interface AppConfig {
  subscriptionEnabled: boolean;
  freeUntil: string;
  featuredPrice: number;
  premiumPrice: number;
  freePostLimit: number;
  freePhotoLimit: number;
  allowVideoOnFree: boolean;
}

export interface PaidFeature {
  id: string;
  key: string;
  nameEn: string;
  nameTe: string;
  descEn: string;
  descTe: string;
  price: number;
  enabled: boolean;
  isUnlockedInFreeLaunch: boolean;
}
