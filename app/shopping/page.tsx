// pages/shopping/index.tsx
'use client';
import { useState, useEffect, useMemo, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowLeft, ShoppingBag, Search, Filter, Star, 
  Clock, MapPin, Heart, Share2, Plus, Minus,
  Check, X, Info, Truck, Store, Tag, Percent,
  Home, Navigation, Camera, Gift, User, Grid,
  List, SortAsc, Eye, Phone, MessageCircle,
  ShoppingCart, CreditCard, Zap, Award, Target
} from 'lucide-react';

// Types
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image: string;
  category: string;
  inStock: boolean;
  stockCount: number;
  rating: number;
  reviewCount: number;
  tags: string[];
  storeId: string;
}

interface Store {
  id: string;
  name: string;
  description: string;
  address: string;
  distance: number;
  rating: number;
  reviewCount: number;
  image: string;
  coverImage: string;
  categories: string[];
  pickupTime: string;
  isOpen: boolean;
  openUntil: string;
  phone: string;
  email: string;
  specialOffers: string[];
  products: Product[];
  coordinates: {
    lat: number;
    lng: number;
  };
}

interface CartItem {
  productId: string;
  storeId: string;
  quantity: number;
  product: Product;
  store: Store;
}

interface FilterOptions {
  category: string;
  priceRange: [number, number];
  inStockOnly: boolean;
  hasDiscount: boolean;
  rating: number;
  distance: number;
}

const ShoppingPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Alle');
  const [sortBy, setSortBy] = useState<'relevance' | 'price' | 'rating' | 'distance'>('relevance');
  const [showFilters, setShowFilters] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favoriteProducts, setFavoriteProducts] = useState<string[]>(['painting-1', 'book-1']);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderStatus, setOrderStatus] = useState<'cart' | 'checkout' | 'processing' | 'confirmed' | 'ready'>('cart');
  const [userInfo, setUserInfo] = useState({
    name: 'Max Mustermann',
    email: 'max.mustermann@email.de',
    phone: '+49 531 123456'
  });

  // Realistic stores data for Braunschweig
  const stores: Store[] = useMemo(() => [
    {
      id: 'galerie-jaeschke',
      name: 'Galerie Jaeschke',
      description: 'Seit 1985 Ihre Galerie für Kunst und hochwertige Bilderrahmen',
      address: 'Steinweg 26, 38100 Braunschweig',
      distance: 150,
      rating: 4.9,
      reviewCount: 127,
      image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop',
      coverImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=400&fit=crop',
      categories: ['Kunst', 'Rahmen', 'Deko'],
      pickupTime: '1-2 Std',
      isOpen: true,
      openUntil: '18:00',
      phone: '+49 531 12345',
      email: 'info@galerie-jaeschke.de',
      specialOffers: ['20% auf Rahmen', 'Gratis Beratung'],
      coordinates: { lat: 52.2625, lng: 10.5211 },
      products: [
        {
          id: 'painting-1',
          name: 'Braunschweig Stadtansicht',
          description: 'Handgemalte Stadtansicht von Braunschweig mit Dom und Burg',
          price: 189.99,
          originalPrice: 229.99,
          discount: 17,
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
          category: 'Kunst',
          inStock: true,
          stockCount: 3,
          rating: 4.8,
          reviewCount: 23,
          tags: ['Lokal', 'Handgemalt', 'Einzigartig'],
          storeId: 'galerie-jaeschke'
        },
        {
          id: 'frame-1',
          name: 'Holzrahmen Premium Eiche',
          description: 'Hochwertiger Bilderrahmen aus Eiche, verschiedene Größen',
          price: 45.99,
          originalPrice: 59.99,
          discount: 23,
          image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop',
          category: 'Rahmen',
          inStock: true,
          stockCount: 12,
          rating: 4.7,
          reviewCount: 56,
          tags: ['Nachhaltig', 'Handwerk', 'Premium'],
          storeId: 'galerie-jaeschke'
        },
        {
          id: 'poster-1',
          name: 'Heinrich der Löwe Print',
          description: 'Hochwertiger Kunstdruck des berühmten Braunschweiger Wappens',
          price: 24.99,
          image: 'https://images.unsplash.com/photo-1571043733612-5d2a8c7e7e1b?w=400&h=300&fit=crop',
          category: 'Kunst',
          inStock: true,
          stockCount: 8,
          rating: 4.5,
          reviewCount: 34,
          tags: ['Braunschweig', 'Geschichte', 'Souvenir'],
          storeId: 'galerie-jaeschke'
        }
      ]
    },
    {
      id: 'buchhandlung-neukirchen',
      name: 'Buchhandlung Neukirchen',
      description: 'Traditionelle Buchhandlung mit persönlicher Beratung seit 1923',
      address: 'Schöppenstedter Str. 32, 38100 Braunschweig',
      distance: 280,
      rating: 4.8,
      reviewCount: 189,
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop',
      coverImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop',
      categories: ['Bücher', 'E-Books', 'Geschenke'],
      pickupTime: '30 Min',
      isOpen: true,
      openUntil: '19:00',
      phone: '+49 531 23456',
      email: 'info@neukirchen-books.de',
      specialOffers: ['Vorbesteller-Rabatt', 'Lesezirkel'],
      coordinates: { lat: 52.2610, lng: 10.5185 },
      products: [
        {
          id: 'book-1',
          name: 'Braunschweig - Eine Stadtgeschichte',
          description: 'Umfassendes Werk über die Geschichte der Löwenstadt',
          price: 24.95,
          image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=300&fit=crop',
          category: 'Bücher',
          inStock: true,
          stockCount: 15,
          rating: 4.9,
          reviewCount: 67,
          tags: ['Lokal', 'Geschichte', 'Sachbuch'],
          storeId: 'buchhandlung-neukirchen'
        },
        {
          id: 'cookbook-1',
          name: 'Niedersächsische Küche',
          description: 'Traditionelle Rezepte aus der Region',
          price: 19.99,
          originalPrice: 24.99,
          discount: 20,
          image: 'https://images.unsplash.com/photo-1589985024055-e6b1b8b52bb6?w=400&h=300&fit=crop',
          category: 'Bücher',
          inStock: true,
          stockCount: 7,
          rating: 4.6,
          reviewCount: 42,
          tags: ['Regional', 'Kochen', 'Tradition'],
          storeId: 'buchhandlung-neukirchen'
        },
        {
          id: 'guide-1',
          name: 'Harz Wanderführer 2025',
          description: 'Der ultimative Guide für Wanderungen im Harz',
          price: 16.95,
          image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=300&fit=crop',
          category: 'Bücher',
          inStock: true,
          stockCount: 11,
          rating: 4.7,
          reviewCount: 89,
          tags: ['Outdoor', 'Wandern', 'Regional'],
          storeId: 'buchhandlung-neukirchen'
        }
      ]
    },
    {
      id: 'juwelier-hildebrandt',
      name: 'Juwelier Hildebrandt',
      description: 'Exklusiver Schmuck und Uhren seit 1923',
      address: 'Damm 19, 38100 Braunschweig',
      distance: 120,
      rating: 4.7,
      reviewCount: 94,
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=300&fit=crop',
      coverImage: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800&h=400&fit=crop',
      categories: ['Schmuck', 'Uhren', 'Geschenke'],
      pickupTime: '2-3 Std',
      isOpen: true,
      openUntil: '18:30',
      phone: '+49 531 34567',
      email: 'service@hildebrandt-juwelier.de',
      specialOffers: ['Gratis Gravur', 'Wertgutachten'],
      coordinates: { lat: 52.2630, lng: 10.5220 },
      products: [
        {
          id: 'watch-1',
          name: 'Armbanduhr Damen Silber',
          description: 'Elegante Damenuhr aus 925er Silber mit Saphirglas',
          price: 299.99,
          originalPrice: 349.99,
          discount: 14,
          image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=300&fit=crop',
          category: 'Uhren',
          inStock: true,
          stockCount: 5,
          rating: 4.8,
          reviewCount: 28,
          tags: ['Elegant', 'Silber', 'Wasserdicht'],
          storeId: 'juwelier-hildebrandt'
        },
        {
          id: 'necklace-1',
          name: 'Silberkette mit Anhänger',
          description: 'Handgefertigte Silberkette mit Löwen-Anhänger',
          price: 89.99,
          image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=300&fit=crop',
          category: 'Schmuck',
          inStock: true,
          stockCount: 8,
          rating: 4.6,
          reviewCount: 35,
          tags: ['Handgemacht', 'Löwe', 'Braunschweig'],
          storeId: 'juwelier-hildebrandt'
        }
      ]
    },
    {
      id: 'peek-cloppenburg',
      name: 'Peek & Cloppenburg',
      description: 'Fashion & Lifestyle im Herzen der Stadt',
      address: 'Damm 21, 38100 Braunschweig',
      distance: 200,
      rating: 4.3,
      reviewCount: 567,
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
      coverImage: 'https://images.unsplash.com/photo-1468902993886-47ba869a0713?w=800&h=400&fit=crop',
      categories: ['Mode', 'Accessoires', 'Schuhe'],
      pickupTime: '2-4 Std',
      isOpen: true,
      openUntil: '20:00',
      phone: '+49 531 45678',
      email: 'service@peek-cloppenburg.de',
      specialOffers: ['15% auf Mode', 'Gratis Styling'],
      coordinates: { lat: 52.2635, lng: 10.5215 },
      products: [
        {
          id: 'jacket-1',
          name: 'Winterjacke Herren Navy',
          description: 'Warme Winterjacke aus nachhaltigen Materialien',
          price: 159.99,
          originalPrice: 199.99,
          discount: 20,
          image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=300&fit=crop',
          category: 'Mode',
          inStock: true,
          stockCount: 23,
          rating: 4.4,
          reviewCount: 156,
          tags: ['Nachhaltig', 'Wasserdicht', 'Winter'],
          storeId: 'peek-cloppenburg'
        },
        {
          id: 'dress-1',
          name: 'Kleid Damen Elegant',
          description: 'Elegantes Abendkleid für besondere Anlässe',
          price: 89.99,
          image: 'https://images.unsplash.com/photo-1566479179817-c0d5e82c7b90?w=400&h=300&fit=crop',
          category: 'Mode',
          inStock: true,
          stockCount: 12,
          rating: 4.7,
          reviewCount: 89,
          tags: ['Elegant', 'Party', 'Premium'],
          storeId: 'peek-cloppenburg'
        }
      ]
    }
  ], []);

  // Get all products from all stores
  const allProducts = useMemo(() => {
    return stores.flatMap(store => 
      store.products.map(product => ({
        ...product,
        store: store
      }))
    );
  }, [stores]);

  // Filter and search logic
  const filteredProducts = useMemo(() => {
    let filtered = allProducts;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Category filter
    if (selectedCategory !== 'Alle') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Sort products
    switch (sortBy) {
      case 'price':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'distance':
        filtered.sort((a, b) => a.store.distance - b.store.distance);
        break;
      default:
        // Keep original order (relevance)
        break;
    }

    return filtered;
  }, [allProducts, searchQuery, selectedCategory, sortBy]);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = ['Alle', ...new Set(allProducts.map(p => p.category))];
    return cats;
  }, [allProducts]);

  // Cart management
  const addToCart = useCallback((product: Product & { store: Store }) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.productId === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prev, {
          productId: product.id,
          storeId: product.storeId,
          quantity: 1,
          product: product,
          store: product.store
        }];
      }
    });
  }, []);

  const updateCartQuantity = useCallback((productId: string, quantity: number) => {
    setCart(prev => {
      if (quantity <= 0) {
        return prev.filter(item => item.productId !== productId);
      }
      return prev.map(item =>
        item.productId === productId
          ? { ...item, quantity }
          : item
      );
    });
  }, []);

  const getCartItemQuantity = useCallback((productId: string) => {
    const item = cart.find(item => item.productId === productId);
    return item ? item.quantity : 0;
  }, [cart]);

  const getCartTotal = useCallback(() => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  }, [cart]);

  const toggleFavorite = useCallback((productId: string) => {
    setFavoriteProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  }, []);

  const handleCheckout = useCallback(() => {
    setShowCart(false);
    setShowCheckout(true);
    setOrderStatus('checkout');
  }, []);

  const processOrder = useCallback(() => {
    setOrderStatus('processing');
    
    // Simulate order processing
    setTimeout(() => {
      setOrderStatus('confirmed');
      
      // Clear cart after successful order
      setTimeout(() => {
        setCart([]);
        setShowCheckout(false);
        setOrderStatus('cart');
      }, 3000);
    }, 2000);
  }, []);

  const generateOrderNumber = () => {
    return `BS${Date.now().toString().slice(-6)}`;
  };

  // Components

  const SearchBar: React.FC = () => (
    <div className="px-4 py-3 bg-white border-b border-gray-200">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Produkte, Geschäfte oder Kategorien..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-md transition-colors"
        >
          <Filter className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    </div>
  );

  const CategoryTabs: React.FC = () => (
    <div className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${
              selectedCategory === category
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );

  const ProductCard: React.FC<{ product: Product & { store: Store } }> = ({ product }) => {
    const cartQuantity = getCartItemQuantity(product.id);
    const isFavorite = favoriteProducts.includes(product.id);

    return (
      <div className={`bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-200 ${
        viewMode === 'list' ? 'flex' : ''
      }`}>
        <div className={`relative ${viewMode === 'list' ? 'w-32 h-32' : 'h-48'}`}>
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
          />
          
          {/* Discount badge */}
          {product.discount && (
            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold">
              -{product.discount}%
            </div>
          )}
          
          {/* Favorite button */}
          <button
            onClick={() => toggleFavorite(product.id)}
            className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'text-red-500 fill-current' : 'text-gray-600'}`} />
          </button>

          {/* Stock indicator */}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                Ausverkauft
              </span>
            </div>
          )}
        </div>

        <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-gray-800 text-sm leading-tight">
              {product.name}
            </h3>
            {viewMode === 'grid' && (
              <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                <Share2 className="w-4 h-4 text-gray-600" />
              </button>
            )}
          </div>

          {viewMode === 'grid' && (
            <p className="text-gray-600 text-xs mb-3 line-clamp-2">
              {product.description}
            </p>
          )}

          {/* Store info */}
          <div className="flex items-center gap-2 mb-2">
            <Store className="w-3 h-3 text-gray-500" />
            <span className="text-xs text-gray-600">{product.store.name}</span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs text-gray-600">{product.store.distance}m</span>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-yellow-500 fill-current" />
              <span className="text-xs text-gray-600">{product.rating}</span>
              <span className="text-xs text-gray-400">({product.reviewCount})</span>
            </div>
            <Clock className="w-3 h-3 text-gray-500" />
            <span className="text-xs text-gray-600">{product.store.pickupTime}</span>
          </div>

          {/* Tags */}
          {viewMode === 'grid' && (
            <div className="flex flex-wrap gap-1 mb-3">
              {product.tags.slice(0, 2).map((tag, index) => (
                <span key={index} className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Price and actions */}
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-orange-600">
                  {product.price.toFixed(2)}€
                </span>
                {product.originalPrice && (
                  <span className="text-xs text-gray-500 line-through">
                    {product.originalPrice.toFixed(2)}€
                  </span>
                )}
              </div>
              {product.stockCount <= 5 && product.inStock && (
                <span className="text-xs text-red-600">Nur noch {product.stockCount} verfügbar</span>
              )}
            </div>

            {product.inStock && (
              <div className="flex items-center gap-2">
                {cartQuantity > 0 ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateCartQuantity(product.id, cartQuantity - 1)}
                      className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-medium text-sm">{cartQuantity}</span>
                    <button
                      onClick={() => updateCartQuantity(product.id, cartQuantity + 1)}
                      className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => addToCart(product)}
                    className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors"
                  >
                    In den Warenkorb
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const CartModal: React.FC = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end">
      <div className="bg-white rounded-t-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              Warenkorb ({cart.length} {cart.length === 1 ? 'Artikel' : 'Artikel'})
            </h2>
            <button
              onClick={() => setShowCart(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {cart.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">Warenkorb ist leer</h3>
              <p className="text-gray-500 mb-4">Fügen Sie Produkte hinzu, um mit dem Einkauf zu beginnen</p>
              <button
                onClick={() => setShowCart(false)}
                className="bg-orange-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-orange-600 transition-colors"
              >
                Weiter einkaufen
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Group by store */}
              {Object.entries(
                cart.reduce((groups, item) => {
                  const storeId = item.storeId;
                  if (!groups[storeId]) {
                    groups[storeId] = [];
                  }
                  groups[storeId].push(item);
                  return groups;
                }, {} as Record<string, CartItem[]>)
              ).map(([storeId, items]) => {
                const store = stores.find(s => s.id === storeId)!;
                const storeTotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

                return (
                  <div key={storeId} className="border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-3 pb-3 border-b border-gray-100">
                      <div className="w-12 h-12 relative rounded-lg overflow-hidden">
                        <Image
                          src={store.image}
                          alt={store.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">{store.name}</h4>
                        <p className="text-sm text-gray-600">Abholung in {store.pickupTime}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-800">{storeTotal.toFixed(2)}€</div>
                        <div className="text-xs text-gray-500">{items.length} Artikel</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {items.map((item) => (
                        <div key={item.productId} className="flex items-center gap-3">
                          <div className="w-16 h-16 relative rounded-lg overflow-hidden">
                            <Image
                              src={item.product.image}
                              alt={item.product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-800 text-sm">{item.product.name}</h5>
                            <p className="text-xs text-gray-600">{item.product.price.toFixed(2)}€</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
                              className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center font-medium text-sm">{item.quantity}</span>
                            <button
                              onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                              className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}

              {/* Order Summary */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-bold text-gray-800 mb-3">Bestellübersicht</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Zwischensumme</span>
                    <span className="font-medium">{getCartTotal().toFixed(2)}€</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Click & Collect</span>
                    <span className="font-medium text-green-600">Kostenlos</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 flex justify-between">
                    <span className="font-bold text-gray-800">Gesamt</span>
                    <span className="font-bold text-orange-600 text-lg">{getCartTotal().toFixed(2)}€</span>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <button 
                onClick={handleCheckout}
                className="w-full bg-orange-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-orange-600 transition-colors"
              >
                Click & Collect bestellen
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const StoreCard: React.FC<{ store: Store }> = ({ store }) => (
    <div 
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all cursor-pointer"
      onClick={() => setSelectedStore(store)}
    >
      <div className="relative h-32">
        <Image
          src={store.coverImage}
          alt={store.name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-3 left-3 text-white">
          <h3 className="font-bold">{store.name}</h3>
          <p className="text-sm opacity-90">{store.distance}m entfernt</p>
        </div>
        <div className="absolute top-3 right-3">
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
            store.isOpen ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
          }`}>
            {store.isOpen ? `Bis ${store.openUntil}` : 'Geschlossen'}
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span className="text-sm font-medium">{store.rating}</span>
            <span className="text-sm text-gray-500">({store.reviewCount})</span>
          </div>
          <span className="text-gray-300">•</span>
          <Clock className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">{store.pickupTime}</span>
        </div>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{store.description}</p>

        <div className="flex flex-wrap gap-1 mb-3">
          {store.categories.slice(0, 3).map((category, index) => (
            <span key={index} className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
              {category}
            </span>
          ))}
        </div>

        {store.specialOffers.length > 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-2">
            <div className="flex items-center gap-1 mb-1">
              <Percent className="w-3 h-3 text-orange-600" />
              <span className="text-xs font-medium text-orange-600">Aktuelle Angebote</span>
            </div>
            <p className="text-xs text-orange-700">{store.specialOffers[0]}</p>
          </div>
        )}
      </div>
    </div>
  );

  // CheckoutModal component
  const CheckoutModal: React.FC = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end">
      <div className="bg-white rounded-t-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4">
          {orderStatus === 'checkout' && (
            <>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">Bestellung abschließen</h2>
                <button
                  onClick={() => setShowCheckout(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Order Summary */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <h3 className="font-bold text-gray-800 mb-3">Bestellübersicht</h3>
                {Object.entries(
                  cart.reduce((groups, item) => {
                    const storeId = item.storeId;
                    if (!groups[storeId]) {
                      groups[storeId] = [];
                    }
                    groups[storeId].push(item);
                    return groups;
                  }, {} as Record<string, CartItem[]>)
                ).map(([storeId, items]) => {
                  const store = stores.find(s => s.id === storeId)!;
                  return (
                    <div key={storeId} className="mb-4 last:mb-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Store className="w-4 h-4 text-gray-600" />
                        <span className="font-medium text-gray-800">{store.name}</span>
                        <span className="text-sm text-gray-500">• Abholung in {store.pickupTime}</span>
                      </div>
                      {items.map((item) => (
                        <div key={item.productId} className="flex justify-between items-center py-1 pl-6">
                          <span className="text-sm text-gray-700">{item.quantity}x {item.product.name}</span>
                          <span className="text-sm font-medium text-gray-800">
                            {(item.product.price * item.quantity).toFixed(2)}€
                          </span>
                        </div>
                      ))}
                    </div>
                  );
                })}
                <div className="border-t border-gray-200 pt-3 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-800">Gesamtsumme</span>
                    <span className="font-bold text-orange-600 text-lg">{getCartTotal().toFixed(2)}€</span>
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div className="mb-6">
                <h3 className="font-bold text-gray-800 mb-3">Ihre Kontaktdaten</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={userInfo.name}
                      onChange={(e) => setUserInfo(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">E-Mail</label>
                    <input
                      type="email"
                      value={userInfo.email}
                      onChange={(e) => setUserInfo(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                    <input
                      type="tel"
                      value={userInfo.phone}
                      onChange={(e) => setUserInfo(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="mb-6">
                <h3 className="font-bold text-gray-800 mb-3">Zahlungsart</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                    <input type="radio" name="payment" defaultChecked className="text-orange-500" />
                    <CreditCard className="w-5 h-5 text-gray-600" />
                    <span className="font-medium">Vor Ort bezahlen</span>
                    <span className="text-sm text-gray-500 ml-auto">Bar oder Karte</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer opacity-60">
                    <input type="radio" name="payment" disabled />
                    <Phone className="w-5 h-5 text-gray-400" />
                    <span className="font-medium text-gray-400">Online bezahlen</span>
                    <span className="text-sm text-gray-400 ml-auto">Bald verfügbar</span>
                  </label>
                </div>
              </div>

              {/* Terms */}
              <div className="mb-6">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="mt-1 text-orange-500" />
                  <span className="text-sm text-gray-600">
                    Ich akzeptiere die <span className="text-orange-500 underline">AGB</span> und <span className="text-orange-500 underline">Datenschutzbestimmungen</span>
                  </span>
                </label>
              </div>

              {/* Place Order Button */}
              <button
                onClick={processOrder}
                className="w-full bg-orange-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-orange-600 transition-colors"
              >
                Jetzt bestellen • {getCartTotal().toFixed(2)}€
              </button>
            </>
          )}

          {orderStatus === 'processing' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Bestellung wird verarbeitet...</h3>
              <p className="text-gray-600">Bitte warten Sie einen Moment</p>
            </div>
          )}

          {orderStatus === 'confirmed' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Bestellung erfolgreich!</h3>
              <p className="text-gray-600 mb-4">
                Bestellnummer: <span className="font-mono font-bold">{generateOrderNumber()}</span>
              </p>
              
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                <h4 className="font-bold text-green-800 mb-2">Was passiert jetzt?</h4>
                <div className="space-y-2 text-sm text-green-700">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Sie erhalten eine Bestätigungs-E-Mail</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Geschäfte bereiten Ihre Bestellung vor</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Sie erhalten eine SMS bei Abholbereitschaft</span>
                  </div>
                </div>
              </div>

              {/* Pickup Info */}
              <div className="space-y-3">
                {Object.entries(
                  cart.reduce((groups, item) => {
                    const storeId = item.storeId;
                    if (!groups[storeId]) {
                      groups[storeId] = [];
                    }
                    groups[storeId].push(item);
                    return groups;
                  }, {} as Record<string, CartItem[]>)
                ).map(([storeId, items]) => {
                  const store = stores.find(s => s.id === storeId)!;
                  return (
                    <div key={storeId} className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Store className="w-4 h-4 text-gray-600" />
                        <span className="font-medium text-gray-800">{store.name}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{store.address}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-gray-500" />
                          <span className="text-gray-600">Bereit in {store.pickupTime}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-gray-500" />
                          <span className="text-gray-600">{store.phone}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Store Detail Modal component - Mobile optimized
  const StoreDetailModal: React.FC = () => (
    selectedStore && (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end">
        <div className="bg-white rounded-t-2xl w-full max-h-[85vh] overflow-y-auto">
          <div className="p-3">
            {/* Header - Compact */}
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-gray-800 truncate pr-2">{selectedStore.name}</h2>
              <button
                onClick={() => setSelectedStore(null)}
                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Store Header - Smaller */}
            <div className="relative h-32 rounded-lg overflow-hidden mb-3">
              <Image
                src={selectedStore.coverImage}
                alt={selectedStore.name}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-2 left-2 text-white">
                <h3 className="text-sm font-bold">{selectedStore.name}</h3>
                <p className="text-xs opacity-90">{selectedStore.distance}m entfernt</p>
              </div>
              <div className="absolute top-2 right-2">
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  selectedStore.isOpen ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                }`}>
                  {selectedStore.isOpen ? `Bis ${selectedStore.openUntil}` : 'Geschlossen'}
                </div>
              </div>
            </div>

            {/* Store Info - Compact */}
            <div className="space-y-3 mb-4">
              <p className="text-gray-600 text-sm line-clamp-2">{selectedStore.description}</p>
              
              {/* Rating and pickup time - Single line */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-500 fill-current" />
                  <span className="font-medium">{selectedStore.rating}</span>
                  <span className="text-gray-500 text-xs">({selectedStore.reviewCount})</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-gray-500" />
                  <span className="text-gray-600 text-xs">Abholung in {selectedStore.pickupTime}</span>
                </div>
              </div>

              {/* Contact info - Compact */}
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs">
                  <MapPin className="w-3 h-3 text-gray-500" />
                  <span className="text-gray-600 truncate">{selectedStore.address}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Phone className="w-3 h-3 text-gray-500" />
                  <span className="text-gray-600">{selectedStore.phone}</span>
                </div>
              </div>

              {/* Categories - Compact */}
              <div className="flex flex-wrap gap-1">
                {selectedStore.categories.slice(0, 3).map((category, index) => (
                  <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                    {category}
                  </span>
                ))}
              </div>

              {/* Special Offers - Compact */}
              {selectedStore.specialOffers.length > 0 && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-2">
                  <div className="flex items-center gap-1 mb-1">
                    <Percent className="w-3 h-3 text-orange-600" />
                    <span className="text-xs font-medium text-orange-600">Angebote</span>
                  </div>
                  <div className="space-y-0.5">
                    {selectedStore.specialOffers.slice(0, 2).map((offer, index) => (
                      <p key={index} className="text-xs text-orange-700">• {offer}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Store Products - Compact */}
            <div>
              <h3 className="text-base font-bold text-gray-800 mb-3 flex items-center justify-between">
                <span>Produkte ({selectedStore.products.length})</span>
                <span className="text-xs font-normal text-gray-500">Zum Warenkorb hinzufügen</span>
              </h3>
              <div className="space-y-3">
                {selectedStore.products.map((product) => {
                  const cartQuantity = getCartItemQuantity(product.id);
                  return (
                    <div key={product.id} className="bg-gray-50 rounded-lg p-3">
                      <div className="flex gap-3">
                        <div className="w-16 h-16 relative rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                          {product.discount && (
                            <div className="absolute top-0 left-0 bg-red-500 text-white px-1 py-0.5 text-xs font-bold rounded-tl-lg rounded-br-lg">
                              -{product.discount}%
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-800 text-sm truncate">{product.name}</h4>
                          <p className="text-xs text-gray-600 line-clamp-2 mb-1">{product.description}</p>
                          
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-yellow-500 fill-current" />
                              <span className="text-xs text-gray-600">{product.rating}</span>
                            </div>
                            {product.inStock ? (
                              <span className="text-xs text-green-600">Verfügbar</span>
                            ) : (
                              <span className="text-xs text-red-600">Ausverkauft</span>
                            )}
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <div className="flex items-center gap-1">
                                <span className="font-bold text-orange-600 text-sm">
                                  {product.price.toFixed(2)}€
                                </span>
                                {product.originalPrice && (
                                  <span className="text-xs text-gray-500 line-through">
                                    {product.originalPrice.toFixed(2)}€
                                  </span>
                                )}
                              </div>
                            </div>

                            {product.inStock && (
                              <div className="flex items-center gap-1">
                                {cartQuantity > 0 ? (
                                  <>
                                    <button
                                      onClick={() => updateCartQuantity(product.id, cartQuantity - 1)}
                                      className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center hover:bg-gray-400 transition-colors"
                                    >
                                      <Minus className="w-3 h-3" />
                                    </button>
                                    <span className="w-6 text-center font-medium text-xs">{cartQuantity}</span>
                                    <button
                                      onClick={() => updateCartQuantity(product.id, cartQuantity + 1)}
                                      className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors"
                                    >
                                      <Plus className="w-3 h-3" />
                                    </button>
                                  </>
                                ) : (
                                  <button
                                    onClick={() => addToCart({ ...product, store: selectedStore })}
                                    className="bg-orange-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-orange-600 transition-colors"
                                  >
                                    +
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );

  return (
    <>
      <Head>
        <title>Shopping - BS.Smart Braunschweig</title>
        <meta name="description" content="Click & Collect Shopping bei lokalen Händlern in Braunschweig" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-md mx-auto bg-white shadow-2xl min-h-screen">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4">
            <div className="flex items-center justify-between mb-3">
              <Link href="/">
                <button className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
                  <ArrowLeft className="w-6 h-6" />
                </button>
              </Link>
              
              <h1 className="text-xl font-bold">🛍️ Shopping</h1>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                  className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                >
                  {viewMode === 'grid' ? <List className="w-5 h-5" /> : <Grid className="w-5 h-5" />}
                </button>
                <button
                  onClick={() => setShowCart(true)}
                  className="relative p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                >
                  <ShoppingBag className="w-5 h-5" />
                  {cart.length > 0 && (
                    <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cart.length}
                    </div>
                  )}
                </button>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-orange-100 text-sm">
                Click & Collect bei {stores.length} lokalen Partnern
              </p>
            </div>
          </div>

          <SearchBar />
          <CategoryTabs />

          {/* Results info and sorting */}
          <div className="bg-white border-b border-gray-200 px-4 py-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'Produkt' : 'Produkte'} gefunden
              </span>
              <div className="flex items-center gap-2">
                <SortAsc className="w-4 h-4 text-gray-500" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="text-sm border-none bg-transparent focus:outline-none"
                >
                  <option value="relevance">Relevanz</option>
                  <option value="price">Preis</option>
                  <option value="rating">Bewertung</option>
                  <option value="distance">Entfernung</option>
                </select>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="pb-20">
            {searchQuery === '' && selectedCategory === 'Alle' ? (
              // Show stores overview when no search/filter
              <div className="p-4 space-y-6">
                {/* Featured stores */}
                <div>
                  <h2 className="text-lg font-bold text-gray-800 mb-4">Lokale Partner</h2>
                  <div className="space-y-4">
                    {stores.map((store) => (
                      <StoreCard key={store.id} store={store} />
                    ))}
                  </div>
                </div>

                {/* Quick stats */}
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl p-4">
                  <h3 className="font-bold text-lg mb-2">Ihre Shopping-Statistik</h3>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold">23</div>
                      <div className="text-sm text-blue-100">Bestellungen</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">127€</div>
                      <div className="text-sm text-blue-100">Gespart</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Show products grid/list
              <div className={`p-4 grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2' : ''}`}>
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>

          {/* Cart Modal */}
          {showCart && <CartModal />}

          {/* Checkout Modal */}
          {showCheckout && <CheckoutModal />}

          {/* Store Detail Modal */}
          {selectedStore && <StoreDetailModal />}

          {/* Bottom Navigation */}
          <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white/95 backdrop-blur-md border-t border-gray-200 px-4 py-3 shadow-lg">
            <div className="flex justify-around items-center">
              <Link href="/" className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-600 transition-colors">
                <Home className="w-6 h-6" />
                <span className="text-xs">Home</span>
              </Link>
              
              <Link href="/navigation" className="flex flex-col items-center gap-1 text-gray-400 hover:text-blue-500 transition-colors">
                <Navigation className="w-6 h-6" />
                <span className="text-xs">Navigation</span>
              </Link>
              
              <Link href="/shopping" className="flex flex-col items-center gap-1 text-orange-500">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs font-medium">Shopping</span>
              </Link>
              
              <Link href="/vouchers" className="flex flex-col items-center gap-1 text-gray-400 hover:text-pink-500 transition-colors">
                <Gift className="w-6 h-6" />
                <span className="text-xs">Gutscheine</span>
              </Link>
              
              <Link href="/profile" className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-600 transition-colors">
                <User className="w-6 h-6" />
                <span className="text-xs">Profil</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShoppingPage;