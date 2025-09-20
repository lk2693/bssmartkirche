'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowLeft, Navigation, MapPin, Search, Star, 
  Clock, Compass, Eye, Target, Route, Car, 
  Bike, Users, Coffee, ShoppingBag, Camera,
  Home, Gift, User, Zap, Info, Heart, Share2,
  Navigation2, Crosshair, Volume2, VolumeX, Phone,
  MessageCircle, Layers, Satellite, Map,
  AlertTriangle, CheckCircle, XCircle,
  TrendingUp, Award, Crown, Settings, Bell,
  Calendar, Bookmark, History, Filter, SortAsc,
  ChevronDown, ChevronUp, MoreVertical, Play,
  Pause, RotateCcw, Maximize2, X, Ticket,
  Music, Theater, Gamepad2, Wine, Palette,
  TreePine, BookOpen, Building, Utensils,
  CalendarDays, ExternalLink, Download,
  Clock3, Euro, PartyPopper, MapPinIcon,
  Percent, Tag, Flame, Sparkles, Trophy,
  ArrowRight, QrCode, Repeat, ShoppingCart,
  Handshake, Target as TargetIcon, Lightbulb,
  TrendingDown, ChevronRight, BadgeCheck,
  Store, Palette as PaletteIcon, Coffee as CoffeeIcon,
  Scissors, Car as CarIcon, Gamepad, Shirt,
  Book, Monitor, Sofa, Sparkle
} from 'lucide-react';

// Types
interface Store {
  id: string;
  name: string;
  category: 'gallery' | 'bookstore' | 'fashion' | 'electronics' | 'furniture' | 'restaurant' | 'cafe' | 'wellness' | 'entertainment' | 'service';
  address: string;
  image: string;
  logo: string;
  rating: number;
  isPartner: boolean;
  partnerLevel: 'bronze' | 'silver' | 'gold' | 'premium';
}

interface CrossSellingRule {
  id: string;
  triggerStoreId: string;
  targetStoreId: string;
  minPurchaseAmount: number;
  voucherValue: number;
  voucherType: 'fixed' | 'percentage';
  validityDays: number;
  category: 'culture-food' | 'shopping-service' | 'theme-package' | 'premium-experience';
  description: string;
  isActive: boolean;
}

interface Voucher {
  id: string;
  title: string;
  description: string;
  store: Store;
  value: number;
  type: 'fixed' | 'percentage';
  category: 'food' | 'shopping' | 'wellness' | 'entertainment' | 'service' | 'cross-selling';
  image: string;
  validUntil: Date;
  minPurchase?: number;
  usageLimit?: number;
  usageCount: number;
  isUsed: boolean;
  isExpired: boolean;
  isFavorite: boolean;
  qrCode: string;
  terms: string[];
  
  // Cross-Selling specific
  sourceTransaction?: {
    storeId: string;
    storeName: string;
    amount: number;
    date: Date;
  };
  crossSellingRuleId?: string;
  discoveryBonus?: boolean;
  streakBonus?: number;
}

interface UserProgress {
  totalPurchases: number;
  partnersVisited: string[];
  currentStreak: number;
  maxStreak: number;
  loyaltyLevel: 'newcomer' | 'explorer' | 'regular' | 'vip' | 'champion';
  discoveryScore: number;
  monthlyChallenge?: {
    target: number;
    current: number;
    reward: string;
  };
}

const VouchersPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Alle');
  const [currentView, setCurrentView] = useState<'my-vouchers' | 'discover' | 'partnerships' | 'challenges'>('my-vouchers');
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
  const [showQRCode, setShowQRCode] = useState(false);
  const [favoriteVouchers, setFavoriteVouchers] = useState<string[]>(['restaurant-bonus', 'cafe-crosssell']);
  const [userLocation] = useState({ lat: 52.2625, lng: 10.5211 });
  const [showPartnershipDetails, setShowPartnershipDetails] = useState(false);
  const [selectedPartnership, setSelectedPartnership] = useState<CrossSellingRule | null>(null);

  // Mock User Progress
  const [userProgress] = useState<UserProgress>({
    totalPurchases: 1250,
    partnersVisited: ['galerie-moderne', 'buchhandlung-wagner', 'cafe-central', 'restaurant-italiano'],
    currentStreak: 5,
    maxStreak: 8,
    loyaltyLevel: 'regular',
    discoveryScore: 340,
    monthlyChallenge: {
      target: 5,
      current: 3,
      reward: '20€ Premium-Gutschein'
    }
  });

  // Mock Stores Data
  const stores = useMemo<Store[]>(() => [
    {
      id: 'galerie-moderne',
      name: 'Galerie Moderne',
      category: 'gallery',
      address: 'Bohlweg 42, 38100 Braunschweig',
      image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop',
      logo: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=100&h=100&fit=crop',
      rating: 4.8,
      isPartner: true,
      partnerLevel: 'gold'
    },
    {
      id: 'buchhandlung-wagner',
      name: 'Buchhandlung Wagner',
      category: 'bookstore',
      address: 'Damm 21, 38100 Braunschweig',
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop',
      logo: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=100&h=100&fit=crop',
      rating: 4.6,
      isPartner: true,
      partnerLevel: 'silver'
    },
    {
      id: 'restaurant-italiano',
      name: 'Ristorante Italiano',
      category: 'restaurant',
      address: 'Kohlmarkt 5, 38100 Braunschweig',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop',
      logo: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=100&h=100&fit=crop',
      rating: 4.7,
      isPartner: true,
      partnerLevel: 'premium'
    },
    {
      id: 'cafe-central',
      name: 'Café Central',
      category: 'cafe',
      address: 'Burgplatz 1, 38100 Braunschweig',
      image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop',
      logo: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=100&h=100&fit=crop',
      rating: 4.5,
      isPartner: true,
      partnerLevel: 'bronze'
    }
  ], []);

  // Mock Cross-Selling Rules
  const crossSellingRules = useMemo<CrossSellingRule[]>(() => [
    {
      id: 'gallery-to-restaurant',
      triggerStoreId: 'galerie-moderne',
      targetStoreId: 'restaurant-italiano',
      minPurchaseAmount: 100,
      voucherValue: 10,
      voucherType: 'fixed',
      validityDays: 30,
      category: 'culture-food',
      description: 'Kunst genießen → Kulinarik erleben',
      isActive: true
    },
    {
      id: 'bookstore-to-cafe',
      triggerStoreId: 'buchhandlung-wagner',
      targetStoreId: 'cafe-central',
      minPurchaseAmount: 25,
      voucherValue: 15,
      voucherType: 'percentage',
      validityDays: 14,
      category: 'culture-food',
      description: 'Lesen → Entspannen',
      isActive: true
    },
    {
      id: 'restaurant-to-gallery',
      triggerStoreId: 'restaurant-italiano',
      targetStoreId: 'galerie-moderne',
      minPurchaseAmount: 50,
      voucherValue: 20,
      voucherType: 'percentage',
      validityDays: 30,
      category: 'premium-experience',
      description: 'Genuss → Kultur',
      isActive: true
    }
  ], []);

  // Mock Vouchers with Cross-Selling
  const vouchers = useMemo<Voucher[]>(() => [
    {
      id: 'restaurant-bonus',
      title: '10€ Bonus bei Ristorante Italiano',
      description: 'Erhalten durch Kunstkauf in der Galerie Moderne',
      store: stores.find(s => s.id === 'restaurant-italiano')!,
      value: 10,
      type: 'fixed',
      category: 'cross-selling',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop',
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      minPurchase: 20,
      usageLimit: 1,
      usageCount: 0,
      isUsed: false,
      isExpired: false,
      isFavorite: true,
      qrCode: 'QR123456789',
      terms: ['Nicht mit anderen Aktionen kombinierbar', 'Gültig bis 30 Tage nach Erhalt'],
      sourceTransaction: {
        storeId: 'galerie-moderne',
        storeName: 'Galerie Moderne',
        amount: 150,
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      crossSellingRuleId: 'gallery-to-restaurant',
      discoveryBonus: true
    },
    {
      id: 'cafe-crosssell',
      title: '15% Rabatt im Café Central',
      description: 'Erhalten durch Buchkauf bei Wagner',
      store: stores.find(s => s.id === 'cafe-central')!,
      value: 15,
      type: 'percentage',
      category: 'cross-selling',
      image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop',
      validUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      usageLimit: 1,
      usageCount: 0,
      isUsed: false,
      isExpired: false,
      isFavorite: true,
      qrCode: 'QR987654321',
      terms: ['Mindestbestellwert 8€', 'Nur für Getränke gültig'],
      sourceTransaction: {
        storeId: 'buchhandlung-wagner',
        storeName: 'Buchhandlung Wagner',
        amount: 35,
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      },
      crossSellingRuleId: 'bookstore-to-cafe',
      streakBonus: 5
    },
    {
      id: 'wellness-regular',
      title: '20% Rabatt Wellness Center',
      description: 'Entspannung für Körper und Geist',
      store: {
        id: 'wellness-center',
        name: 'Wellness Center Braunschweig',
        category: 'wellness',
        address: 'Wellnessstraße 10',
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
        logo: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop',
        rating: 4.4,
        isPartner: false,
        partnerLevel: 'bronze'
      } as Store,
      value: 20,
      type: 'percentage',
      category: 'wellness',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
      validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      minPurchase: 50,
      usageLimit: 1,
      usageCount: 0,
      isUsed: false,
      isExpired: false,
      isFavorite: false,
      qrCode: 'QR555666777',
      terms: ['Nur für Massagen gültig', 'Voranmeldung erforderlich']
    }
  ], [stores]);

  // Filter vouchers
  const filteredVouchers = useMemo(() => {
    let filtered = vouchers;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(voucher =>
        voucher.title.toLowerCase().includes(query) ||
        voucher.description.toLowerCase().includes(query) ||
        voucher.store.name.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (selectedCategory !== 'Alle') {
      const categoryMap: { [key: string]: string } = {
        'Cross-Selling': 'cross-selling',
        'Restaurants': 'food',
        'Shopping': 'shopping',
        'Wellness': 'wellness',
        'Entertainment': 'entertainment'
      };
      const mappedCategory = categoryMap[selectedCategory];
      if (mappedCategory) {
        filtered = filtered.filter(voucher => voucher.category === mappedCategory);
      }
    }

    return filtered;
  }, [vouchers, searchQuery, selectedCategory]);

  const categories = ['Alle', 'Cross-Selling', 'Restaurants', 'Shopping', 'Wellness', 'Entertainment'];

  // Helper functions
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'cross-selling': return <Handshake className="w-4 h-4" />;
      case 'food': return <Utensils className="w-4 h-4" />;
      case 'shopping': return <ShoppingBag className="w-4 h-4" />;
      case 'wellness': return <Sparkles className="w-4 h-4" />;
      case 'entertainment': return <Gamepad2 className="w-4 h-4" />;
      case 'service': return <Settings className="w-4 h-4" />;
      default: return <Gift className="w-4 h-4" />;
    }
  };

  const getStoreIcon = (category: string) => {
    switch (category) {
      case 'gallery': return <PaletteIcon className="w-4 h-4" />;
      case 'bookstore': return <Book className="w-4 h-4" />;
      case 'restaurant': return <Utensils className="w-4 h-4" />;
      case 'cafe': return <CoffeeIcon className="w-4 h-4" />;
      case 'fashion': return <Shirt className="w-4 h-4" />;
      case 'electronics': return <Monitor className="w-4 h-4" />;
      case 'furniture': return <Sofa className="w-4 h-4" />;
      case 'wellness': return <Sparkles className="w-4 h-4" />;
      case 'entertainment': return <Gamepad className="w-4 h-4" />;
      case 'service': return <Settings className="w-4 h-4" />;
      default: return <Store className="w-4 h-4" />;
    }
  };

  const getPartnerLevelBadge = (level: string) => {
    switch (level) {
      case 'premium': return { color: 'bg-purple-500', text: 'Premium', icon: <Crown className="w-3 h-3" /> };
      case 'gold': return { color: 'bg-yellow-500', text: 'Gold', icon: <Award className="w-3 h-3" /> };
      case 'silver': return { color: 'bg-gray-400', text: 'Silver', icon: <Trophy className="w-3 h-3" /> };
      case 'bronze': return { color: 'bg-amber-600', text: 'Bronze', icon: <BadgeCheck className="w-3 h-3" /> };
      default: return { color: 'bg-gray-300', text: 'Partner', icon: <Handshake className="w-3 h-3" /> };
    }
  };

  const getLoyaltyLevelInfo = (level: string) => {
    switch (level) {
      case 'champion': return { color: 'text-purple-600', bg: 'bg-purple-100', icon: <Crown className="w-4 h-4" /> };
      case 'vip': return { color: 'text-yellow-600', bg: 'bg-yellow-100', icon: <Award className="w-4 h-4" /> };
      case 'regular': return { color: 'text-blue-600', bg: 'bg-blue-100', icon: <Trophy className="w-4 h-4" /> };
      case 'explorer': return { color: 'text-green-600', bg: 'bg-green-100', icon: <Compass className="w-4 h-4" /> };
      default: return { color: 'text-gray-600', bg: 'bg-gray-100', icon: <User className="w-4 h-4" /> };
    }
  };

  const formatTimeLeft = (date: Date) => {
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days < 0) return 'Abgelaufen';
    if (days === 0) return 'Läuft heute ab';
    if (days === 1) return 'Läuft morgen ab';
    return `${days} Tage gültig`;
  };

  const toggleFavorite = useCallback((voucherId: string) => {
    setFavoriteVouchers(prev =>
      prev.includes(voucherId)
        ? prev.filter(id => id !== voucherId)
        : [...prev, voucherId]
    );
  }, []);

  // Components

  const SearchAndFilter: React.FC = () => (
    <div className="bg-white border-b border-gray-200 p-4">
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Gutscheine suchen..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
        />
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-3 py-1 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${
              selectedCategory === category
                ? 'bg-pink-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );

  const ViewSelector: React.FC = () => (
    <div className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex justify-around">
        {[
          { view: 'my-vouchers', icon: Gift, label: 'Meine', active: currentView === 'my-vouchers' },
          { view: 'discover', icon: Compass, label: 'Entdecken', active: currentView === 'discover' },
          { view: 'partnerships', icon: Handshake, label: 'Partner', active: currentView === 'partnerships' },
          { view: 'challenges', icon: TargetIcon, label: 'Challenges', active: currentView === 'challenges' }
        ].map(({ view, icon: Icon, label, active }) => (
          <button
            key={view}
            onClick={() => setCurrentView(view as any)}
            className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
              active 
                ? 'text-pink-500 bg-pink-50' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Icon className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );

  const UserProgressCard: React.FC = () => {
    const loyaltyInfo = getLoyaltyLevelInfo(userProgress.loyaltyLevel);
    
    return (
      <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-full bg-white/20`}>
              {loyaltyInfo.icon}
            </div>
            <div>
              <h3 className="font-bold">Status: {userProgress.loyaltyLevel}</h3>
              <p className="text-sm opacity-90">{userProgress.discoveryScore} Discovery Punkte</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold">{userProgress.currentStreak}</div>
            <div className="text-xs opacity-90">Streak</div>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold">{userProgress.partnersVisited.length}</div>
            <div className="text-xs opacity-90">Partner besucht</div>
          </div>
          <div>
            <div className="text-lg font-bold">{userProgress.totalPurchases}€</div>
            <div className="text-xs opacity-90">Gesamtumsatz</div>
          </div>
          <div>
            <div className="text-lg font-bold">{userProgress.maxStreak}</div>
            <div className="text-xs opacity-90">Bester Streak</div>
          </div>
        </div>

        {userProgress.monthlyChallenge && (
          <div className="mt-3 p-3 bg-white/10 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Monats-Challenge</span>
              <span className="text-xs">{userProgress.monthlyChallenge.current}/{userProgress.monthlyChallenge.target}</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2 mb-2">
              <div 
                className="bg-white rounded-full h-2 transition-all" 
                style={{ width: `${(userProgress.monthlyChallenge.current / userProgress.monthlyChallenge.target) * 100}%` }}
              ></div>
            </div>
            <p className="text-xs opacity-90">Belohnung: {userProgress.monthlyChallenge.reward}</p>
          </div>
        )}
      </div>
    );
  };

  const VoucherCard: React.FC<{ voucher: Voucher; compact?: boolean }> = ({ voucher, compact = false }) => (
    <div 
      className={`bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all cursor-pointer ${
        compact ? 'p-3' : 'p-4'
      } ${voucher.isExpired ? 'opacity-50' : ''}`}
      onClick={() => setSelectedVoucher(voucher)}
    >
      <div className="flex gap-3">
        <div className={`relative rounded-lg overflow-hidden flex-shrink-0 ${
          compact ? 'w-16 h-16' : 'w-20 h-20'
        }`}>
          <Image
            src={voucher.image}
            alt={voucher.title}
            fill
            className="object-cover"
          />
          <div className="absolute top-1 left-1">
            {getCategoryIcon(voucher.category)}
          </div>
          {voucher.crossSellingRuleId && (
            <div className="absolute bottom-1 right-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs p-1 rounded">
              <Handshake className="w-3 h-3" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-1">
            <h4 className={`font-semibold text-gray-800 line-clamp-2 ${compact ? 'text-sm' : 'text-base'}`}>
              {voucher.title}
            </h4>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(voucher.id);
              }}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <Heart className={`w-4 h-4 ${favoriteVouchers.includes(voucher.id) ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
            </button>
          </div>

          {!compact && voucher.sourceTransaction && (
            <div className="flex items-center gap-1 text-xs text-pink-600 bg-pink-50 rounded-full px-2 py-1 mb-2 w-fit">
              <Sparkle className="w-3 h-3" />
              <span>Bonus von {voucher.sourceTransaction.storeName}</span>
            </div>
          )}

          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <span className="font-bold text-pink-600">
              {voucher.type === 'percentage' ? `${voucher.value}% Rabatt` : `${voucher.value}€ Gutschein`}
            </span>
            <span>•</span>
            <span>{voucher.store.name}</span>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className={`text-sm ${
                formatTimeLeft(voucher.validUntil).includes('Abgelaufen') 
                  ? 'text-red-600' 
                  : formatTimeLeft(voucher.validUntil).includes('heute')
                    ? 'text-orange-600'
                    : 'text-gray-600'
              }`}>
                {formatTimeLeft(voucher.validUntil)}
              </span>
              {voucher.discoveryBonus && (
                <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                  🎯 Discovery
                </span>
              )}
              {voucher.streakBonus && (
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  🔥 Streak +{voucher.streakBonus}
                </span>
              )}
            </div>

            <div className="flex gap-2">
              {voucher.isUsed ? (
                <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
                  Verwendet
                </span>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedVoucher(voucher);
                    setShowQRCode(true);
                  }}
                  className="bg-pink-500 text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-pink-600 transition-colors"
                >
                  Einlösen
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const CrossSellingPartnershipCard: React.FC<{ rule: CrossSellingRule }> = ({ rule }) => {
    const triggerStore = stores.find(s => s.id === rule.triggerStoreId);
    const targetStore = stores.find(s => s.id === rule.targetStoreId);
    
    if (!triggerStore || !targetStore) return null;

    return (
      <div className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-all cursor-pointer"
           onClick={() => {
             setSelectedPartnership(rule);
             setShowPartnershipDetails(true);
           }}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-gray-800">{rule.description}</h3>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>

        <div className="flex items-center gap-4">
          {/* Trigger Store */}
          <div className="flex items-center gap-2 flex-1">
            <div className="w-10 h-10 rounded-lg overflow-hidden relative">
              <Image src={triggerStore.logo} alt={triggerStore.name} fill className="object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm text-gray-800 truncate">{triggerStore.name}</div>
              <div className="text-xs text-gray-600">ab {rule.minPurchaseAmount}€ Einkauf</div>
            </div>
          </div>

          {/* Arrow */}
          <ArrowRight className="w-5 h-5 text-pink-500" />

          {/* Target Store */}
          <div className="flex items-center gap-2 flex-1">
            <div className="w-10 h-10 rounded-lg overflow-hidden relative">
              <Image src={targetStore.logo} alt={targetStore.name} fill className="object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm text-gray-800 truncate">{targetStore.name}</div>
              <div className="text-xs text-pink-600 font-medium">
                {rule.voucherType === 'percentage' ? `${rule.voucherValue}% Rabatt` : `${rule.voucherValue}€ Bonus`}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
          <span>Gültig {rule.validityDays} Tage</span>
          <span>•</span>
          <span className="capitalize">{rule.category.replace('-', ' → ')}</span>
        </div>
      </div>
    );
  };

  // Content Views
  const MyVouchersView: React.FC = () => (
    <div className="p-4 space-y-4 pb-24">
      <UserProgressCard />

      {/* Cross-Selling Vouchers */}
      {filteredVouchers.filter(v => v.category === 'cross-selling').length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Handshake className="w-5 h-5 text-pink-500" />
            <h3 className="text-lg font-bold text-gray-800">Cross-Selling Bonus</h3>
            <span className="bg-pink-100 text-pink-800 text-xs px-2 py-1 rounded-full">
              {filteredVouchers.filter(v => v.category === 'cross-selling').length}
            </span>
          </div>
          <div className="space-y-3">
            {filteredVouchers.filter(v => v.category === 'cross-selling').map((voucher) => (
              <VoucherCard key={voucher.id} voucher={voucher} />
            ))}
          </div>
        </div>
      )}

      {/* Regular Vouchers */}
      {filteredVouchers.filter(v => v.category !== 'cross-selling').length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Gift className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-bold text-gray-800">Meine Gutscheine</h3>
            <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
              {filteredVouchers.filter(v => v.category !== 'cross-selling').length}
            </span>
          </div>
          <div className="space-y-3">
            {filteredVouchers.filter(v => v.category !== 'cross-selling').map((voucher) => (
              <VoucherCard key={voucher.id} voucher={voucher} />
            ))}
          </div>
        </div>
      )}

      {filteredVouchers.length === 0 && (
        <div className="text-center py-12">
          <Gift className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-600 mb-2">Keine Gutscheine gefunden</h4>
          <p className="text-gray-500 mb-6">Entdecken Sie Angebote und sammeln Sie Gutscheine</p>
          <button
            onClick={() => setCurrentView('discover')}
            className="bg-pink-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-pink-600 transition-colors"
          >
            Gutscheine entdecken
          </button>
        </div>
      )}
    </div>
  );

  const DiscoverView: React.FC = () => (
    <div className="p-4 space-y-6 pb-24">
      {/* Featured Partnerships */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-yellow-500" />
          <h3 className="text-lg font-bold text-gray-800">Aktuelle Aktionen</h3>
        </div>
        
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-xl p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Flame className="w-5 h-5" />
            <h4 className="font-bold">Wochenend-Special</h4>
          </div>
          <p className="text-sm mb-3">Kaufen Sie Kunst für 100€+ und erhalten Sie 15€ Restaurant-Gutschein statt 10€!</p>
          <div className="flex items-center gap-2 text-xs">
            <Clock3 className="w-4 h-4" />
            <span>Noch 2 Tage gültig</span>
          </div>
        </div>
      </div>

      {/* Partner Stores */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-4">Partner-Geschäfte</h3>
        <div className="grid grid-cols-2 gap-3">
          {stores.filter(s => s.isPartner).map((store) => {
            const badge = getPartnerLevelBadge(store.partnerLevel);
            return (
              <div key={store.id} className="bg-white rounded-xl shadow-md p-3 hover:shadow-lg transition-all">
                <div className="relative w-full h-24 rounded-lg overflow-hidden mb-3">
                  <Image src={store.image} alt={store.name} fill className="object-cover" />
                  <div className={`absolute top-2 right-2 ${badge.color} text-white text-xs px-2 py-1 rounded-full flex items-center gap-1`}>
                    {badge.icon}
                    <span>{badge.text}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  {getStoreIcon(store.category)}
                  <h4 className="font-medium text-gray-800 text-sm truncate">{store.name}</h4>
                </div>
                <div className="flex items-center gap-1 mb-2">
                  <Star className="w-3 h-3 text-yellow-500 fill-current" />
                  <span className="text-xs text-gray-600">{store.rating}</span>
                </div>
                <button className="w-full bg-pink-500 text-white text-xs py-2 rounded-lg hover:bg-pink-600 transition-colors">
                  Details anzeigen
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* How it Works */}
      <div className="bg-gray-50 rounded-xl p-4">
        <h3 className="text-lg font-bold text-gray-800 mb-3">So funktioniert's</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-pink-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
            <div>
              <h4 className="font-medium text-gray-800">Einkaufen</h4>
              <p className="text-sm text-gray-600">Kaufen Sie bei einem Partner-Geschäft ein</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-pink-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
            <div>
              <h4 className="font-medium text-gray-800">QR-Code scannen</h4>
              <p className="text-sm text-gray-600">Scannen Sie den QR-Code an der Kasse</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-pink-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
            <div>
              <h4 className="font-medium text-gray-800">Bonus erhalten</h4>
              <p className="text-sm text-gray-600">Erhalten Sie automatisch Gutscheine für Partner-Geschäfte</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const PartnershipsView: React.FC = () => (
    <div className="p-4 space-y-6 pb-24">
      <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <Handshake className="w-6 h-6" />
          <h2 className="text-lg font-bold">Cross-Selling Partnerschaften</h2>
        </div>
        <p className="text-sm opacity-90">Entdecken Sie, wie Ihre Einkäufe zu Bonusgutscheinen werden</p>
      </div>

      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-4">Aktive Partnerschaften</h3>
        <div className="space-y-4">
          {crossSellingRules.filter(r => r.isActive).map((rule) => (
            <CrossSellingPartnershipCard key={rule.id} rule={rule} />
          ))}
        </div>
      </div>

      <div className="bg-blue-50 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className="w-5 h-5 text-blue-500" />
          <h3 className="font-bold text-gray-800">Tipp</h3>
        </div>
        <p className="text-sm text-gray-700">
          Besuchen Sie verschiedene Partner-Kategorien, um Ihren Discovery-Score zu erhöhen und 
          exklusive Bonus-Gutscheine freizuschalten!
        </p>
      </div>
    </div>
  );

  const ChallengesView: React.FC = () => (
    <div className="p-4 space-y-6 pb-24">
      <div className="bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <TargetIcon className="w-6 h-6" />
          <h2 className="text-lg font-bold">Challenges & Belohnungen</h2>
        </div>
        <p className="text-sm opacity-90">Erreichen Sie Ziele und verdienen Sie Extra-Gutscheine</p>
      </div>

      {/* Monthly Challenge */}
      {userProgress.monthlyChallenge && (
        <div className="bg-white rounded-xl shadow-md p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-800">Monats-Challenge</h3>
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
              {userProgress.monthlyChallenge.current}/{userProgress.monthlyChallenge.target}
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-3">Besuchen Sie 5 neue Partner-Geschäfte in diesem Monat</p>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
            <div 
              className="bg-green-500 rounded-full h-3 transition-all" 
              style={{ width: `${(userProgress.monthlyChallenge.current / userProgress.monthlyChallenge.target) * 100}%` }}
            ></div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Belohnung: {userProgress.monthlyChallenge.reward}</span>
            <span className="text-sm font-medium text-green-600">
              {userProgress.monthlyChallenge.target - userProgress.monthlyChallenge.current} noch zu schaffen
            </span>
          </div>
        </div>
      )}

      {/* Streak Challenge */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-gray-800">Streak Challenge</h3>
          <div className="flex items-center gap-1 text-orange-500">
            <Flame className="w-4 h-4" />
            <span className="font-bold">{userProgress.currentStreak}</span>
          </div>
        </div>
        <p className="text-sm text-gray-600 mb-3">Kaufen Sie 7 Tage hintereinander bei Partnern ein</p>
        <div className="grid grid-cols-7 gap-1 mb-3">
          {Array.from({ length: 7 }, (_, i) => (
            <div 
              key={i} 
              className={`h-8 rounded ${
                i < userProgress.currentStreak 
                  ? 'bg-orange-500' 
                  : 'bg-gray-200'
              }`}
            ></div>
          ))}
        </div>
        <div className="text-center">
          <span className="text-sm text-gray-600">
            {7 - userProgress.currentStreak} Tage bis zur Belohnung: 25€ Premium-Gutschein
          </span>
        </div>
      </div>

      {/* Discovery Challenge */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-gray-800">Discovery Explorer</h3>
          <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
            {userProgress.discoveryScore}/500
          </span>
        </div>
        <p className="text-sm text-gray-600 mb-3">Sammeln Sie Discovery-Punkte durch neue Partner</p>
        <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
          <div 
            className="bg-purple-500 rounded-full h-3 transition-all" 
            style={{ width: `${(userProgress.discoveryScore / 500) * 100}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Nächste Belohnung: VIP-Status</span>
          <span>{500 - userProgress.discoveryScore} Punkte</span>
        </div>
      </div>

      {/* Achievement Badges */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-4">Errungenschaften</h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: <PaletteIcon className="w-6 h-6" />, title: 'Kunstliebhaber', desc: '5 Galerien besucht', unlocked: true },
            { icon: <Book className="w-6 h-6" />, title: 'Bücherwurm', desc: '3 Buchhandlungen', unlocked: true },
            { icon: <Utensils className="w-6 h-6" />, title: 'Feinschmecker', desc: '10 Restaurants', unlocked: false },
            { icon: <Crown className="w-6 h-6" />, title: 'VIP Member', desc: '500 Discovery-Punkte', unlocked: false },
            { icon: <Flame className="w-6 h-6" />, title: 'Streak Master', desc: '14 Tage Streak', unlocked: false },
            { icon: <Award className="w-6 h-6" />, title: 'Partner-Champion', desc: 'Alle Partner besucht', unlocked: false }
          ].map((achievement, index) => (
            <div 
              key={index} 
              className={`bg-white rounded-xl shadow-md p-3 text-center ${
                achievement.unlocked ? 'border-2 border-yellow-400' : 'opacity-60'
              }`}
            >
              <div className={`mx-auto mb-2 ${
                achievement.unlocked ? 'text-yellow-500' : 'text-gray-400'
              }`}>
                {achievement.icon}
              </div>
              <h4 className="font-medium text-xs text-gray-800 mb-1">{achievement.title}</h4>
              <p className="text-xs text-gray-600">{achievement.desc}</p>
              {achievement.unlocked && (
                <div className="mt-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mx-auto" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Modals
  const VoucherDetailModal: React.FC = () => {
    if (!selectedVoucher) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50" onClick={() => setSelectedVoucher(null)}>
        <div 
          className="bg-white rounded-t-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Voucher Image */}
          <div className="relative h-48">
            <Image
              src={selectedVoucher.image}
              alt={selectedVoucher.title}
              fill
              className="object-cover"
            />
            <button
              onClick={() => setSelectedVoucher(null)}
              className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
            {selectedVoucher.crossSellingRuleId && (
              <div className="absolute top-4 left-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-3 py-1 rounded-lg text-sm font-medium flex items-center gap-2">
                <Handshake className="w-4 h-4" />
                Cross-Selling Bonus
              </div>
            )}
          </div>

          <div className="p-6">
            {/* Voucher Header */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{selectedVoucher.title}</h2>
              <div className="text-3xl font-bold text-pink-600 mb-2">
                {selectedVoucher.type === 'percentage' ? `${selectedVoucher.value}%` : `${selectedVoucher.value}€`}
              </div>
              <p className="text-gray-600">{selectedVoucher.description}</p>
            </div>

            {/* Source Transaction */}
            {selectedVoucher.sourceTransaction && (
              <div className="bg-pink-50 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkle className="w-5 h-5 text-pink-500" />
                  <h3 className="font-bold text-gray-800">Erhalten durch</h3>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                    <ShoppingCart className="w-5 h-5 text-pink-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">{selectedVoucher.sourceTransaction.storeName}</div>
                    <div className="text-sm text-gray-600">
                      {selectedVoucher.sourceTransaction.amount}€ am {selectedVoucher.sourceTransaction.date.toLocaleDateString('de-DE')}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Store Details */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-lg overflow-hidden relative">
                  <Image src={selectedVoucher.store.logo} alt={selectedVoucher.store.name} fill className="object-cover" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">{selectedVoucher.store.name}</h3>
                  <p className="text-sm text-gray-600">{selectedVoucher.store.address}</p>
                </div>
              </div>
              {selectedVoucher.store.isPartner && (
                <div className="flex items-center gap-2">
                  {(() => {
                    const badge = getPartnerLevelBadge(selectedVoucher.store.partnerLevel);
                    return (
                      <div className={`${badge.color} text-white text-xs px-2 py-1 rounded-full flex items-center gap-1`}>
                        {badge.icon}
                        <span>{badge.text} Partner</span>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>

            {/* Voucher Details */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3">
                <Clock3 className="w-5 h-5 text-gray-500" />
                <div>
                  <div className="font-medium text-gray-800">Gültig bis</div>
                  <div className="text-sm text-gray-600">
                    {selectedVoucher.validUntil.toLocaleDateString('de-DE')} • {formatTimeLeft(selectedVoucher.validUntil)}
                  </div>
                </div>
              </div>

              {selectedVoucher.minPurchase && (
                <div className="flex items-center gap-3">
                  <Euro className="w-5 h-5 text-gray-500" />
                  <div>
                    <div className="font-medium text-gray-800">Mindestbestellwert</div>
                    <div className="text-sm text-gray-600">{selectedVoucher.minPurchase}€</div>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <Repeat className="w-5 h-5 text-gray-500" />
                <div>
                  <div className="font-medium text-gray-800">Verwendung</div>
                  <div className="text-sm text-gray-600">
                    {selectedVoucher.usageLimit ? `${selectedVoucher.usageCount}/${selectedVoucher.usageLimit} mal verwendet` : 'Einmalig verwendbar'}
                  </div>
                </div>
              </div>
            </div>

            {/* Terms */}
            <div className="mb-6">
              <h4 className="font-bold text-gray-800 mb-2">Bedingungen</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                {selectedVoucher.terms.map((term, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-gray-400 mt-1">•</span>
                    <span>{term}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              {!selectedVoucher.isUsed && !selectedVoucher.isExpired && (
                <button
                  onClick={() => setShowQRCode(true)}
                  className="w-full bg-pink-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-pink-600 transition-colors flex items-center justify-center gap-2"
                >
                  <QrCode className="w-6 h-6" />
                  QR-Code anzeigen
                </button>
              )}

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => toggleFavorite(selectedVoucher.id)}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-colors ${
                    favoriteVouchers.includes(selectedVoucher.id)
                      ? 'bg-red-100 text-red-600'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${favoriteVouchers.includes(selectedVoucher.id) ? 'fill-current' : ''}`} />
                  {favoriteVouchers.includes(selectedVoucher.id) ? 'Favorit' : 'Merken'}
                </button>
                <button className="flex items-center justify-center gap-2 bg-gray-100 text-gray-600 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors">
                  <Share2 className="w-4 h-4" />
                  Teilen
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const QRCodeModal: React.FC = () => {
    if (!showQRCode || !selectedVoucher) return null;

    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setShowQRCode(false)}>
        <div 
          className="bg-white rounded-2xl p-8 max-w-sm w-full text-center"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => setShowQRCode(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>

          <h3 className="text-xl font-bold text-gray-800 mb-4">Gutschein einlösen</h3>
          
          {/* QR Code placeholder */}
          <div className="w-48 h-48 mx-auto mb-4 bg-gray-100 rounded-xl flex items-center justify-center">
            <QrCode className="w-24 h-24 text-gray-400" />
          </div>

          <p className="text-sm text-gray-600 mb-4">
            Zeigen Sie diesen QR-Code an der Kasse von {selectedVoucher.store.name} vor
          </p>

          <div className="bg-pink-50 rounded-lg p-3 mb-4">
            <div className="font-bold text-pink-600 text-lg">
              {selectedVoucher.type === 'percentage' ? `${selectedVoucher.value}% Rabatt` : `${selectedVoucher.value}€ Gutschein`}
            </div>
            {selectedVoucher.minPurchase && (
              <div className="text-sm text-gray-600">
                Mindestbestellwert: {selectedVoucher.minPurchase}€
              </div>
            )}
          </div>

          <p className="text-xs text-gray-500">
            Code: {selectedVoucher.qrCode}
          </p>
        </div>
      </div>
    );
  };

  const PartnershipDetailModal: React.FC = () => {
    if (!showPartnershipDetails || !selectedPartnership) return null;

    const triggerStore = stores.find(s => s.id === selectedPartnership.triggerStoreId);
    const targetStore = stores.find(s => s.id === selectedPartnership.targetStoreId);

    if (!triggerStore || !targetStore) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50" onClick={() => setShowPartnershipDetails(false)}>
        <div 
          className="bg-white rounded-t-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Partnership Details</h2>
              <button
                onClick={() => setShowPartnershipDetails(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Partnership Flow */}
            <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl p-4 mb-6">
              <h3 className="font-bold mb-3">{selectedPartnership.description}</h3>
              
              <div className="space-y-4">
                {/* Trigger Store */}
                <div className="flex items-center gap-3 bg-white/10 rounded-lg p-3">
                  <div className="w-12 h-12 rounded-lg overflow-hidden relative">
                    <Image src={triggerStore.logo} alt={triggerStore.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{triggerStore.name}</div>
                    <div className="text-sm opacity-90">Einkauf ab {selectedPartnership.minPurchaseAmount}€</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm opacity-90">1. Kaufen</div>
                  </div>
                </div>

                <div className="text-center">
                  <ArrowRight className="w-6 h-6 mx-auto" />
                </div>

                {/* Target Store */}
                <div className="flex items-center gap-3 bg-white/10 rounded-lg p-3">
                  <div className="w-12 h-12 rounded-lg overflow-hidden relative">
                    <Image src={targetStore.logo} alt={targetStore.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{targetStore.name}</div>
                    <div className="text-sm opacity-90">
                      {selectedPartnership.voucherType === 'percentage' 
                        ? `${selectedPartnership.voucherValue}% Rabatt` 
                        : `${selectedPartnership.voucherValue}€ Bonus`
                      }
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm opacity-90">2. Einlösen</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Store Details */}
            <div className="space-y-4 mb-6">
              <div>
                <h4 className="font-bold text-gray-800 mb-2">Auslöser-Geschäft</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg overflow-hidden relative">
                      <Image src={triggerStore.logo} alt={triggerStore.name} fill className="object-cover" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">{triggerStore.name}</div>
                      <div className="text-sm text-gray-600">{triggerStore.address}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span>{triggerStore.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {getStoreIcon(triggerStore.category)}
                      <span className="capitalize">{triggerStore.category}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-gray-800 mb-2">Bonus-Geschäft</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg overflow-hidden relative">
                      <Image src={targetStore.logo} alt={targetStore.name} fill className="object-cover" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">{targetStore.name}</div>
                      <div className="text-sm text-gray-600">{targetStore.address}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span>{targetStore.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {getStoreIcon(targetStore.category)}
                      <span className="capitalize">{targetStore.category}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Partnership Rules */}
            <div className="bg-blue-50 rounded-xl p-4 mb-6">
              <h4 className="font-bold text-gray-800 mb-3">Bedingungen</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>Mindest-Einkaufswert: {selectedPartnership.minPurchaseAmount}€</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>Gutschein-Wert: {selectedPartnership.voucherType === 'percentage' 
                    ? `${selectedPartnership.voucherValue}% Rabatt` 
                    : `${selectedPartnership.voucherValue}€ Bonus`}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>Gültigkeitsdauer: {selectedPartnership.validityDays} Tage</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>Kategorie: {selectedPartnership.category.replace('-', ' → ')}</span>
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => {
                  // Navigate to store or show directions
                  setShowPartnershipDetails(false);
                }}
                className="w-full bg-pink-500 text-white py-3 rounded-xl font-medium hover:bg-pink-600 transition-colors"
              >
                Zu {triggerStore.name} navigieren
              </button>
              <button
                onClick={() => setShowPartnershipDetails(false)}
                className="w-full bg-gray-100 text-gray-600 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors"
              >
                Verstanden
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Main render
  return (
    <>
      <Head>
        <title>Gutscheine - BS.Smart Braunschweig</title>
        <meta name="description" content="Entdecken Sie Gutscheine und Cross-Selling-Angebote in Braunschweig" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-md mx-auto bg-white shadow-2xl min-h-screen">
          <SearchAndFilter />
          <ViewSelector />
          
          {currentView === 'my-vouchers' && <MyVouchersView />}
          {currentView === 'discover' && <DiscoverView />}
          {currentView === 'partnerships' && <PartnershipsView />}
          {currentView === 'challenges' && <ChallengesView />}

          {/* Modals */}
          <VoucherDetailModal />
          <QRCodeModal />
          <PartnershipDetailModal />

          {/* Bottom Navigation */}
          <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white/95 backdrop-blur-md border-t border-gray-200 px-4 py-3 shadow-lg">
            <div className="flex justify-around items-center">
              <Link href="/" className="flex flex-col items-center gap-1 text-gray-400 hover:text-blue-500 transition-colors">
                <Home className="w-6 h-6" />
                <span className="text-xs font-medium">Home</span>
              </Link>
              
              <Link href="/navigation" className="flex flex-col items-center gap-1 text-gray-400 hover:text-blue-500 transition-colors">
                <Navigation className="w-6 h-6" />
                <span className="text-xs font-medium">Navigation</span>
              </Link>
              
              <Link href="/shopping" className="flex flex-col items-center gap-1 text-gray-400 hover:text-orange-500 transition-colors">
                <ShoppingBag className="w-6 h-6" />
                <span className="text-xs font-medium">Shopping</span>
              </Link>
              
              <Link href="/vouchers" className="flex flex-col items-center gap-1 text-pink-500">
                <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
                  <Gift className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs font-medium">Gutscheine</span>
              </Link>
              
              <Link href="/restaurants" className="flex flex-col items-center gap-1 text-gray-400 hover:text-red-500 transition-colors">
                <Coffee className="w-6 h-6" />
                <span className="text-xs font-medium">Restaurants</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VouchersPage;