// pages/vouchers/index.tsx
'use client';
import { useState, useEffect, useMemo, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowLeft, Gift, Star, Clock, MapPin, Tag, 
  Percent, QrCode, Check, X, Share2, Download,
  Home, Navigation, ShoppingBag, User, Eye,
  Calendar, Phone, MessageCircle, Store, Trophy,
  Zap, Target, Award, Crown, Heart, Info,
  Copy, ExternalLink, Bell, Filter, Search,
  Plus, Minus // <- Diese fehlten
} from 'lucide-react';

// Types
interface Voucher {
  id: string;
  title: string;
  description: string;
  discount: string;
  discountType: 'percentage' | 'fixed' | 'freebie';
  discountValue: number;
  validUntil: string;
  validFrom: string;
  store: VoucherStore;
  category: string;
  image: string;
  code: string;
  minPurchase?: number;
  maxDiscount?: number;
  used: boolean;
  usedAt?: Date;
  termsAndConditions: string[];
  popularity: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  tags: string[];
  qrCodeData: string;
}

interface VoucherStore {
  id: string;
  name: string;
  address: string;
  distance: number;
  rating: number;
  image: string;
  phone: string;
  isOpen: boolean;
  openUntil: string;
}

interface UserVoucherStats {
  totalVouchers: number;
  usedVouchers: number;
  totalSaved: number;
  favoriteStores: string[];
  voucherLevel: number;
  pointsEarned: number;
}

const VouchersPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('Alle');
  const [showUsedVouchers, setShowUsedVouchers] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
  const [showQRCode, setShowQRCode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [favoriteVouchers, setFavoriteVouchers] = useState<string[]>(['v1', 'v3']);
  const [notifications, setNotifications] = useState([
    { id: '1', message: 'Neuer 25% Gutschein bei Galerie Jaeschke verfügbar!', time: '2 Min' },
    { id: '2', message: 'Ihr Gutschein läuft morgen ab - jetzt einlösen!', time: '1 Std' }
  ]);

  // Realistic voucher data for Braunschweig
  const vouchers: Voucher[] = useMemo(() => [
    {
      id: 'v1',
      title: '25% auf Kunstwerke',
      description: 'Sparen Sie bei exklusiven Kunstwerken und hochwertigen Bilderrahmen',
      discount: '25%',
      discountType: 'percentage',
      discountValue: 25,
      validUntil: '2025-07-15',
      validFrom: '2025-06-01',
      store: {
        id: 'galerie-jaeschke',
        name: 'Galerie Jaeschke',
        address: 'Steinweg 26, 38100 Braunschweig',
        distance: 150,
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=300&h=200&fit=crop',
        phone: '+49 531 12345',
        isOpen: true,
        openUntil: '18:00'
      },
      category: 'Kunst & Kultur',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
      code: 'KUNST25',
      minPurchase: 50,
      maxDiscount: 100,
      used: false,
      termsAndConditions: [
        'Gültig auf alle Kunstwerke und Rahmen',
        'Mindestbestellwert: 50€',
        'Maximaler Rabatt: 100€',
        'Nicht kombinierbar mit anderen Angeboten',
        'Nur einmal pro Kunde einlösbar'
      ],
      popularity: 92,
      rarity: 'epic',
      tags: ['Bestseller', 'Limitiert', 'Lokal'],
      qrCodeData: 'BSMART_VOUCHER_KUNST25_v1'
    },
    {
      id: 'v2',
      title: '15% auf Mode',
      description: 'Exklusiver Rabatt auf das gesamte Sortiment bei Peek & Cloppenburg',
      discount: '15%',
      discountType: 'percentage',
      discountValue: 15,
      validUntil: '2025-06-30',
      validFrom: '2025-06-01',
      store: {
        id: 'peek-cloppenburg',
        name: 'Peek & Cloppenburg',
        address: 'Damm 21, 38100 Braunschweig',
        distance: 200,
        rating: 4.3,
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=200&fit=crop',
        phone: '+49 531 45678',
        isOpen: true,
        openUntil: '20:00'
      },
      category: 'Mode & Accessoires',
      image: 'https://images.unsplash.com/photo-1468902993886-47ba869a0713?w=400&h=300&fit=crop',
      code: 'MODE15',
      minPurchase: 75,
      used: true,
      usedAt: new Date(Date.now() - 86400000 * 2), // 2 days ago
      termsAndConditions: [
        'Gültig auf alle regulären Artikel',
        'Ausgenommen: Sale-Artikel',
        'Mindestbestellwert: 75€',
        'In allen Filialen einlösbar'
      ],
      popularity: 78,
      rarity: 'common',
      tags: ['Fashion', 'Beliebt'],
      qrCodeData: 'BSMART_VOUCHER_MODE15_v2'
    },
    {
      id: 'v3',
      title: 'Gratis Kaffee + Gebäck',
      description: 'Bei Kauf eines Hauptgerichts erhalten Sie Kaffee und Gebäck gratis',
      discount: 'Gratis',
      discountType: 'freebie',
      discountValue: 0,
      validUntil: '2025-06-25',
      validFrom: '2025-06-20',
      store: {
        id: 'cafe-extrablatt',
        name: 'Café Extrablatt',
        address: 'Kohlmarkt 13, 38100 Braunschweig',
        distance: 180,
        rating: 4.5,
        image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=300&h=200&fit=crop',
        phone: '+49 531 23456',
        isOpen: true,
        openUntil: '22:00'
      },
      category: 'Gastronomie',
      image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop',
      code: 'KAFFEE_FREI',
      used: false,
      termsAndConditions: [
        'Gültig bei Kauf eines Hauptgerichts ab 12€',
        'Gratis: 1 Kaffee + 1 Gebäck nach Wahl',
        'Nur für Verzehr vor Ort',
        'Nicht übertragbar'
      ],
      popularity: 89,
      rarity: 'rare',
      tags: ['Neu', 'Gastronomie', 'Gratis'],
      qrCodeData: 'BSMART_VOUCHER_KAFFEE_FREI_v3'
    },
    {
      id: 'v4',
      title: '20€ Rabatt',
      description: 'Sofortrabatt bei Schmuck und Uhren ab 100€ Einkaufswert',
      discount: '20€',
      discountType: 'fixed',
      discountValue: 20,
      validUntil: '2025-07-31',
      validFrom: '2025-06-15',
      store: {
        id: 'juwelier-hildebrandt',
        name: 'Juwelier Hildebrandt',
        address: 'Damm 19, 38100 Braunschweig',
        distance: 120,
        rating: 4.7,
        image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&h=200&fit=crop',
        phone: '+49 531 34567',
        isOpen: true,
        openUntil: '18:30'
      },
      category: 'Schmuck & Uhren',
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=300&fit=crop',
      code: 'SCHMUCK20',
      minPurchase: 100,
      used: false,
      termsAndConditions: [
        'Gültig ab 100€ Einkaufswert',
        'Gilt für Schmuck und Uhren',
        'Kostenlose Gravur inklusive',
        'Ausgenommen: bereits reduzierte Artikel'
      ],
      popularity: 73,
      rarity: 'common',
      tags: ['Schmuck', 'Hochwertig'],
      qrCodeData: 'BSMART_VOUCHER_SCHMUCK20_v4'
    },
    {
      id: 'v5',
      title: '30% auf Bücher',
      description: 'Großer Bücherrabatt bei der traditionsreichen Buchhandlung Neukirchen',
      discount: '30%',
      discountType: 'percentage',
      discountValue: 30,
      validUntil: '2025-06-28',
      validFrom: '2025-06-22',
      store: {
        id: 'buchhandlung-neukirchen',
        name: 'Buchhandlung Neukirchen',
        address: 'Schöppenstedter Str. 32, 38100 Braunschweig',
        distance: 280,
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=200&fit=crop',
        phone: '+49 531 23456',
        isOpen: true,
        openUntil: '19:00'
      },
      category: 'Bücher & Medien',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
      code: 'BUCH30',
      minPurchase: 25,
      maxDiscount: 50,
      used: false,
      termsAndConditions: [
        'Gültig auf alle Bücher',
        'Mindestbestellwert: 25€',
        'Maximaler Rabatt: 50€',
        'Ausgenommen: Schulbücher'
      ],
      popularity: 85,
      rarity: 'legendary',
      tags: ['Mega Deal', 'Bücher', 'Limitiert'],
      qrCodeData: 'BSMART_VOUCHER_BUCH30_v5'
    },
    {
      id: 'v6',
      title: 'Happy Hour 2+1',
      description: 'Zwei Getränke bestellen, drei erhalten - täglich von 17-19 Uhr',
      discount: '2+1',
      discountType: 'freebie',
      discountValue: 0,
      validUntil: '2025-12-31',
      validFrom: '2025-06-01',
      store: {
        id: 'ratskeller',
        name: 'Ratskeller Braunschweig',
        address: 'Altstadtmarkt 7, 38100 Braunschweig',
        distance: 100,
        rating: 4.6,
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=300&h=200&fit=crop',
        phone: '+49 531 56789',
        isOpen: true,
        openUntil: '23:00'
      },
      category: 'Gastronomie',
      image: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=400&h=300&fit=crop',
      code: 'HAPPY_HOUR',
      used: false,
      termsAndConditions: [
        'Gültig täglich 17:00-19:00 Uhr',
        'Gilt für alle alkoholfreien und alkoholischen Getränke',
        'Das günstigste Getränk ist gratis',
        'Pro Tisch maximal einmal einlösbar'
      ],
      popularity: 94,
      rarity: 'rare',
      tags: ['Happy Hour', 'Dauergültig', 'Beliebt'],
      qrCodeData: 'BSMART_VOUCHER_HAPPY_HOUR_v6'
    }
  ], []);

  const userStats: UserVoucherStats = useMemo(() => ({
    totalVouchers: vouchers.length,
    usedVouchers: vouchers.filter(v => v.used).length,
    totalSaved: 127.50,
    favoriteStores: ['galerie-jaeschke', 'cafe-extrablatt'],
    voucherLevel: 3,
    pointsEarned: 1250
  }), [vouchers]);

  // Filter logic
  const filteredVouchers = useMemo(() => {
    let filtered = vouchers;

    // Show/hide used vouchers
    if (!showUsedVouchers) {
      filtered = filtered.filter(v => !v.used);
    }

    // Category filter
    if (selectedCategory !== 'Alle') {
      filtered = filtered.filter(v => v.category === selectedCategory);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(v =>
        v.title.toLowerCase().includes(query) ||
        v.description.toLowerCase().includes(query) ||
        v.store.name.toLowerCase().includes(query) ||
        v.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Sort by expiration date (soon expiring first)
    filtered.sort((a, b) => {
      if (a.used && !b.used) return 1;
      if (!a.used && b.used) return -1;
      return new Date(a.validUntil).getTime() - new Date(b.validUntil).getTime();
    });

    return filtered;
  }, [vouchers, showUsedVouchers, selectedCategory, searchQuery]);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = ['Alle', ...new Set(vouchers.map(v => v.category))];
    return cats;
  }, [vouchers]);

  // Voucher management
  const useVoucher = useCallback((voucherId: string) => {
    // In real app, this would make an API call
    console.log(`Using voucher: ${voucherId}`);
    setSelectedVoucher(null);
    setShowQRCode(false);
  }, []);

  const toggleFavorite = useCallback((voucherId: string) => {
    setFavoriteVouchers(prev =>
      prev.includes(voucherId)
        ? prev.filter(id => id !== voucherId)
        : [...prev, voucherId]
    );
  }, []);

  const copyVoucherCode = useCallback((code: string) => {
    navigator.clipboard.writeText(code);
    // Show toast notification in real app
  }, []);

  const shareVoucher = useCallback((voucher: Voucher) => {
    if (navigator.share) {
      navigator.share({
        title: voucher.title,
        text: `${voucher.discount} bei ${voucher.store.name}`,
        url: window.location.href
      });
    }
  }, []);

  // Helper functions
  const getDaysUntilExpiry = (validUntil: string) => {
    const today = new Date();
    const expiry = new Date(validUntil);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'from-purple-500 to-pink-500';
      case 'epic': return 'from-blue-500 to-indigo-500';
      case 'rare': return 'from-yellow-500 to-orange-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getRarityBadge = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return { text: 'Legendär', color: 'bg-purple-100 text-purple-700' };
      case 'epic': return { text: 'Episch', color: 'bg-blue-100 text-blue-700' };
      case 'rare': return { text: 'Selten', color: 'bg-yellow-100 text-yellow-700' };
      default: return { text: 'Normal', color: 'bg-gray-100 text-gray-700' };
    }
  };

  // Components
  const StatusBar: React.FC = () => (
    <div className="flex justify-between items-center px-4 py-3 bg-gray-900 text-white text-sm">
      <span className="font-medium">BS.Smart Gutscheine</span>
      <div className="flex items-center gap-2">
        <span>14:32</span>
        <div className="flex items-center gap-1">
          <div className="w-1 h-3 bg-green-400 rounded"></div>
          <div className="w-1 h-3 bg-green-400 rounded"></div>
          <div className="w-1 h-3 bg-green-400 rounded"></div>
          <div className="w-1 h-3 bg-gray-600 rounded"></div>
        </div>
      </div>
    </div>
  );

  const SearchAndFilter: React.FC = () => (
    <div className="bg-white border-b border-gray-200 p-4">
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Gutscheine, Geschäfte oder Kategorien..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
        />
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-md transition-colors"
        >
          <Filter className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex gap-2 overflow-x-auto">
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

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={showUsedVouchers}
            onChange={(e) => setShowUsedVouchers(e.target.checked)}
            className="text-pink-500"
          />
          <span className="text-gray-600">Eingelöste</span>
        </label>
      </div>
    </div>
  );

  const QRCodeModal: React.FC = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm mx-auto">
        <div className="p-6 text-center">
          <h3 className="text-xl font-bold text-gray-800 mb-4">QR-Code Scanner</h3>
          
          {/* QR Code placeholder */}
          <div className="w-48 h-48 mx-auto mb-4 bg-gray-100 rounded-xl flex items-center justify-center">
            <div className="w-40 h-40 border-2 border-gray-300 rounded-lg grid grid-cols-8 grid-rows-8 gap-1 p-2">
              {[...Array(64)].map((_, i) => (
                <div
                  key={i}
                  className={`${Math.random() > 0.5 ? 'bg-black' : 'bg-white'} rounded-sm`}
                ></div>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <p className="text-gray-600 text-sm mb-2">
              Zeigen Sie diesen QR-Code an der Kasse vor
            </p>
            <div className="bg-gray-100 rounded-lg p-3">
              <div className="font-mono text-lg font-bold text-gray-800">{selectedVoucher?.code}</div>
              <div className="text-sm text-gray-600">Gutschein-Code</div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowQRCode(false)}
              className="flex-1 py-2 px-4 rounded-lg bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition-colors"
            >
              Abbrechen
            </button>
            <button
              onClick={() => {
                if (selectedVoucher) useVoucher(selectedVoucher.id);
              }}
              className="flex-1 py-2 px-4 rounded-lg bg-pink-500 text-white font-bold hover:bg-pink-600 transition-colors"
            >
              Einlösen
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // VoucherCard component must be defined before the main render
  const VoucherCard: React.FC<{ voucher: Voucher }> = ({ voucher }) => {
    const daysLeft = getDaysUntilExpiry(voucher.validUntil);
    const rarity = getRarityBadge(voucher.rarity);
    const isFavorite = favoriteVouchers.includes(voucher.id);
    const isExpiringSoon = daysLeft <= 3 && !voucher.used;

    return (
      <div 
        className={`bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer ${
          voucher.used ? 'opacity-60' : ''
        } ${isExpiringSoon ? 'ring-2 ring-red-200' : ''}`}
        onClick={() => setSelectedVoucher(voucher)}
      >
        {/* Card Header with Image */}
        <div className="relative h-32">
          <Image
            src={voucher.image}
            alt={voucher.title}
            fill
            className={`object-cover ${voucher.used ? 'grayscale' : ''}`}
          />
          
          {/* Overlay gradient */}
          <div className={`absolute inset-0 bg-gradient-to-t ${getRarityColor(voucher.rarity)} opacity-20`} />
          
          {/* Status badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${rarity.color}`}>
              {rarity.text}
            </span>
            {isExpiringSoon && (
              <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium animate-pulse">
                Läuft ab!
              </span>
            )}
          </div>

          {/* Favorite and Share */}
          <div className="absolute top-3 right-3 flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(voucher.id);
              }}
              className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'text-red-500 fill-current' : 'text-gray-600'}`} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                shareVoucher(voucher);
              }}
              className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
            >
              <Share2 className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          {/* Discount Badge */}
          <div className="absolute bottom-3 left-3">
            <div className="bg-white rounded-lg px-3 py-2 shadow-lg">
              <div className="text-2xl font-bold text-pink-600">{voucher.discount}</div>
              <div className="text-xs text-gray-600">Rabatt</div>
            </div>
          </div>

          {/* Used stamp */}
          {voucher.used && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="bg-green-500 text-white px-4 py-2 rounded-full font-bold text-lg transform rotate-12">
                EINGELÖST
              </div>
            </div>
          )}
        </div>

        {/* Card Content */}
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-gray-800 text-lg leading-tight">{voucher.title}</h3>
            <div className="text-right">
              <div className="text-sm font-medium text-gray-800">
                {voucher.store.distance}m
              </div>
            </div>
          </div>

          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{voucher.description}</p>

          {/* Store info */}
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 relative rounded-full overflow-hidden">
              <Image
                src={voucher.store.image}
                alt={voucher.store.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="font-medium text-gray-800 text-sm">{voucher.store.name}</div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Star className="w-3 h-3 text-yellow-500 fill-current" />
                <span>{voucher.store.rating}</span>
                <span>•</span>
                <Clock className="w-3 h-3" />
                <span>{voucher.store.isOpen ? `Bis ${voucher.store.openUntil}` : 'Geschlossen'}</span>
              </div>
            </div>
          </div>

          {/* Validity and conditions */}
          <div className="border-t border-gray-100 pt-3">
            <div className="flex justify-between items-center text-sm">
              <div className="text-gray-600">
                {voucher.used ? (
                  <span className="text-green-600">
                    Eingelöst am {voucher.usedAt?.toLocaleDateString('de-DE')}
                  </span>
                ) : (
                  <span className={daysLeft <= 3 ? 'text-red-600 font-medium' : 'text-gray-600'}>
                    Gültig bis {new Date(voucher.validUntil).toLocaleDateString('de-DE')}
                    {daysLeft <= 7 && daysLeft > 0 && (
                      <span className="ml-1">({daysLeft} Tag{daysLeft === 1 ? '' : 'e'})</span>
                    )}
                  </span>
                )}
              </div>
              {voucher.minPurchase && (
                <span className="text-xs text-gray-500">ab {voucher.minPurchase}€</span>
              )}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1 mt-2">
              {voucher.tags.slice(0, 2).map((tag, index) => (
                <span key={index} className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-gray-200 flex gap-2">                   
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedVoucher(voucher);;
                setShowQRCode(true);
              }}
              className="flex-1 py-2 px-3 bg-pink-500 text-white rounded-lg text-sm font-medium hover:bg-pink-600 transition-colors"
            >
              QR-Code
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                copyVoucherCode(voucher.code);
              }}
              className="flex-1 py-2 px-3 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              Code
            </button>
            {!voucher.used && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  useVoucher(voucher.id);
                }}
                className="flex-1 py-2 px-3 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
              >
                Einlösen
              </button>
            )}
          </div>
        </div>
      </div>
    );    
  };

  // Main render
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Gutscheine | BS.Smart</title>
      </Head>
      <StatusBar />
      <SearchAndFilter />
      
      {/* Stats Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-pink-600">{userStats.totalVouchers - userStats.usedVouchers}</div>
            <div className="text-xs text-gray-600">Verfügbar</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">{userStats.usedVouchers}</div>
            <div className="text-xs text-gray-600">Eingelöst</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-600">{userStats.totalSaved}€</div>
            <div className="text-xs text-gray-600">Gespart</div>
          </div>
        </div>
      </div>

      {/* Results info */}
      <div className="p-4 bg-white border-b border-gray-200">
        <p className="text-sm text-gray-600">
          {filteredVouchers.length} Gutschein{filteredVouchers.length === 1 ? '' : 'e'} gefunden
        </p>
      </div>

      {/* Voucher Grid */}
      <div className="p-4 grid grid-cols-1 gap-4 pb-20">
        {filteredVouchers.length > 0 ? (
          filteredVouchers.map((voucher: Voucher) => (
            <VoucherCard key={voucher.id} voucher={voucher} />
          ))
        ) : (
          <div className="text-center py-12">
            <Gift className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">Keine Gutscheine gefunden</h3>
            <p className="text-gray-600">Versuchen Sie andere Suchbegriffe oder Filter.</p>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 px-4 py-3 shadow-lg">
        <div className="flex justify-between items-center max-w-md mx-auto">
          <Link href="/" className="flex flex-col items-center gap-1 p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Home className="w-6 h-6 text-gray-600" />
            <span className="text-xs text-gray-600 font-medium">Home</span>
          </Link>
          
          <Link href="/navigation" className="flex flex-col items-center gap-1 p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Navigation className="w-6 h-6 text-gray-600" />
            <span className="text-xs text-gray-600 font-medium">Navigation</span>
          </Link>
          
          <Link href="/shopping" className="flex flex-col items-center gap-1 p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ShoppingBag className="w-6 h-6 text-gray-600" />
            <span className="text-xs text-gray-600 font-medium">Shopping</span>
          </Link>
          
          <div className="flex flex-col items-center gap-1 p-2 bg-pink-100 rounded-lg">
            <Gift className="w-6 h-6 text-pink-600" />
            <span className="text-xs text-pink-600 font-medium">Gutscheine</span>
          </div>
          
          <Link href="/profile" className="flex flex-col items-center gap-1 p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <User className="w-6 h-6 text-gray-600" />
            <span className="text-xs text-gray-600 font-medium">Profil</span>
          </Link>
        </div>
      </div>

      {/* Modals */}
      {selectedVoucher && showQRCode && <QRCodeModal />}
    </div>
  );
};

export default VouchersPage;