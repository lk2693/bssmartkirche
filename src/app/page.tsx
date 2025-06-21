"use client";
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { 
  MapPin, Navigation, Car, Camera, Star, 
  Clock, Wifi, Battery, Signal, ArrowLeft, QrCode,
  Heart, Share2, Info, Coffee, ShoppingBag, Plus,
  Minus, Check, User, Phone, MessageCircle, Gift,
  Clock3, MapPinIcon
} from 'lucide-react';

interface CartItems {
  [storeId: string]: {
    [itemId: string]: number;
  };
}

interface ReservationData {
  guests: number;
  date: string;
  time: string;
}

interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  price: string;
  distance: string;
  image: string;
  nextSlot: string;
  tables: string;
  speciality: string;
  address: string;
}

interface Store {
  id: string;
  name: string;
  category: string;
  distance: string;
  pickup: string;
  rating: number;
  items: StoreItem[];
  address: string;
  image: string;
  description: string;
}

interface StoreItem {
  id: string;
  name: string;
  price: number;
  available: boolean;
  originalPrice?: number;
  discount?: number;
}

interface Voucher {
  id: string;
  title: string;
  description: string;
  discount: string;
  validUntil: string;
  store: string;
  category: string;
  image: string;
  code: string;
  minPurchase?: number;
  used: boolean;
}

export default function BSSmartApp() {
  const [currentScreen, setCurrentScreen] = useState<string>('home');
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [favoriteSpots, setFavoriteSpots] = useState<string[]>(['burgplatz', 'schloss']);
  const [cartItems, setCartItems] = useState<CartItems>({});
  const [reservationData, setReservationData] = useState<ReservationData>({
    guests: 2,
    date: '',
    time: '19:00'
  });
  const [availableVouchers, setAvailableVouchers] = useState<Voucher[]>([
    {
      id: 'v1',
      title: '20% auf Kunstwerke',
      description: 'Sparen Sie bei exklusiven Kunstwerken und Rahmen',
      discount: '20%',
      validUntil: '30.06.2025',
      store: 'Galerie Jaeschke',
      category: 'Kunst',
      image: '/images/galerie-jaeschke.jpg',
      code: 'KUNST20',
      minPurchase: 50,
      used: false
    },
    {
      id: 'v2',
      title: '15% Rabatt',
      description: 'Auf das gesamte Sortiment',
      discount: '15%',
      validUntil: '25.06.2025',
      store: 'Peek & Cloppenburg',
      category: 'Mode',
      image: '/images/peek-cloppenburg.jpg',
      code: 'MODE15',
      used: false
    },
    {
      id: 'v3',
      title: 'Gratis Kaffee',
      description: 'Bei Kauf eines Hauptgerichts',
      discount: 'Gratis',
      validUntil: '22.06.2025',
      store: 'Café Extrablatt',
      category: 'Gastronomie',
      image: '/images/cafe-extrablatt.jpg',
      code: 'KAFFEE',
      used: false
    },
    {
      id: 'v4',
      title: '10€ Rabatt',
      description: 'Ab 80€ Einkaufswert',
      discount: '10€',
      validUntil: '28.06.2025',
      store: 'Saturn',
      category: 'Elektronik',
      image: '/images/saturn.jpg',
      code: 'TECH10',
      minPurchase: 80,
      used: false
    }
  ]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleFavorite = (spotId: string): void => {
    setFavoriteSpots(prev => 
      prev.includes(spotId) 
        ? prev.filter(id => id !== spotId)
        : [...prev, spotId]
    );
  };

  const addToCart = (storeId: string, item: StoreItem): void => {
    setCartItems(prev => ({
      ...prev,
      [storeId]: {
        ...prev[storeId],
        [item.id]: (prev[storeId]?.[item.id] || 0) + 1
      }
    }));
  };

  const updateCartQuantity = (storeId: string, itemId: string, quantity: number): void => {
    setCartItems(prev => ({
      ...prev,
      [storeId]: {
        ...prev[storeId],
        [itemId]: Math.max(0, quantity)
      }
    }));
  };

  const getTotalCartItems = (): number => {
    return Object.values(cartItems).reduce((total, store) => 
      total + Object.values(store).reduce((storeTotal, qty) => storeTotal + qty, 0), 0
    );
  };
  const StatusBar: React.FC = () => (
    <div className="flex justify-between items-center px-4 py-2 bg-gray-900 text-white text-sm">
      <span>{currentTime.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}</span>
      <div className="flex items-center gap-1">
        <Signal className="w-4 h-4" />
        <Wifi className="w-4 h-4" />
        <Battery className="w-4 h-4" />
      </div>
    </div>
  );

  interface HeaderProps {
    title: string;
    onBack?: () => void;
  }

  const Header: React.FC<HeaderProps> = ({ title, onBack }) => (
    <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-4 shadow-lg">
      <div className="flex items-center gap-3">
        {onBack && (
          <button onClick={onBack} className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
        )}
        <h1 className="text-xl font-bold">{title}</h1>
      </div>
    </div>
  );

  const HomeScreen: React.FC = () => (
    <div className="min-h-screen bg-gray-50">
      <Header title="BS.Smart" />
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 m-4 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-2">Willkommen in Braunschweig! 🦁</h2>
        <p className="opacity-90 mb-4">Entdecke die Löwenstadt digital</p>
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="w-4 h-4" />
          <span>Deine Position: Innenstadt</span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-4 mb-6">
        <h3 className="text-lg font-semibold mb-3 text-gray-800">Schnellzugriff</h3>
        <div className="grid grid-cols-2 gap-3">
          <QuickActionButton
            icon={<Navigation className="w-8 h-8 text-blue-500" />}
            label="Navigation"
            onClick={() => setCurrentScreen('navigation')}
          />
          <QuickActionButton
            icon={<Car className="w-8 h-8 text-green-500" />}
            label="Parkplätze"
            onClick={() => setCurrentScreen('parking')}
          />
          <QuickActionButton
            icon={<ShoppingBag className="w-8 h-8 text-orange-500" />}
            label="Shopping"
            onClick={() => setCurrentScreen('shopping')}
            badge={getTotalCartItems() > 0 ? getTotalCartItems() : undefined}
          />
          <QuickActionButton
            icon={<Gift className="w-8 h-8 text-pink-500" />}
            label="Gutscheine"
            onClick={() => setCurrentScreen('vouchers')}
            badge={availableVouchers.filter(v => !v.used).length}
          />
          <QuickActionButton
            icon={<Coffee className="w-8 h-8 text-red-500" />}
            label="Restaurants"
            onClick={() => setCurrentScreen('restaurants')}
          />
          <QuickActionButton
            icon={<Camera className="w-8 h-8 text-purple-500" />}
            label="AR Tour"
            onClick={() => setCurrentScreen('ar')}
          />
        </div>
      </div>

      {/* Live Info */}
      <div className="px-4 mb-6">
        <h3 className="text-lg font-semibold mb-3 text-gray-800">Live Informationen</h3>
        <div className="bg-white rounded-xl shadow-md p-4">
          <InfoRow label="Wetter" value="18°C ☀️" valueColor="text-blue-500" />
          <InfoRow label="ÖPNV Status" value="Pünktlich" valueColor="text-green-500" />
          <InfoRow label="Innenstadt" value="Mäßig besucht" valueColor="text-orange-500" />
        </div>
      </div>

      {/* Today's Highlights */}
      <div className="px-4">
        <h3 className="text-lg font-semibold mb-3 text-gray-800">Heute für dich</h3>
        <div className="space-y-3">
          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="flex gap-3">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🦁</span>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800">Löwen-Trail Challenge</h4>
                <p className="text-gray-600 text-sm mb-2">Finde alle 12 Löwen in der Innenstadt</p>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm text-gray-500">500 Punkte</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* New Voucher Highlight */}
          <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Gift className="w-5 h-5" />
              <h4 className="font-semibold">Neue Gutscheine verfügbar!</h4>
            </div>
            <p className="text-sm opacity-90 mb-3">Sparen Sie heute bis zu 20% in lokalen Geschäften</p>
            <button 
              onClick={() => setCurrentScreen('vouchers')}
              className="bg-white text-purple-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
            >
              Jetzt entdecken
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  interface QuickActionButtonProps {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    badge?: number;
  }

  const QuickActionButton: React.FC<QuickActionButtonProps> = ({ icon, label, onClick, badge }) => (
    <button 
      onClick={onClick}
      className="bg-white p-4 rounded-xl shadow-md flex flex-col items-center gap-2 hover:shadow-lg transition-all duration-200 hover:scale-105 relative"
    >
      {icon}
      <span className="font-medium text-gray-700">{label}</span>
      {badge && (
        <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
          {badge}
        </div>
      )}
    </button>
  );

  interface InfoRowProps {
    label: string;
    value: string;
    valueColor: string;
  }

  const InfoRow: React.FC<InfoRowProps> = ({ label, value, valueColor }) => (
    <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
      <span className="font-medium text-gray-700">{label}</span>
      <span className={`${valueColor} font-medium`}>{value}</span>
    </div>
  );

  interface VoucherCardProps {
    voucher: Voucher;
    onUse: () => void;
  }

  const VoucherCard: React.FC<VoucherCardProps> = ({ voucher, onUse }) => (
    <div className={`bg-white rounded-xl shadow-md overflow-hidden ${voucher.used ? 'opacity-60' : 'hover:shadow-lg'} transition-all`}>
      <div className="flex">
        <div className="w-24 h-24 bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center relative">
          <span className="text-white font-bold text-lg">{voucher.discount}</span>
          {voucher.used && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <Check className="w-8 h-8 text-white" />
            </div>
          )}
        </div>
        
        <div className="flex-1 p-4">
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-semibold text-gray-800">{voucher.title}</h4>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              voucher.category === 'Mode' ? 'bg-orange-100 text-orange-700' :
              voucher.category === 'Gastronomie' ? 'bg-red-100 text-red-700' :
              voucher.category === 'Elektronik' ? 'bg-blue-100 text-blue-700' :
              voucher.category === 'Kunst' ? 'bg-purple-100 text-purple-700' :
              'bg-gray-100 text-gray-700'
            }`}>
              {voucher.category}
            </span>
          </div>
          
          <p className="text-sm text-gray-600 mb-2">{voucher.description}</p>
          <p className="text-sm font-medium text-gray-800 mb-1">{voucher.store}</p>
          
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Clock3 className="w-3 h-3" />
                Gültig bis {voucher.validUntil}
              </span>
              {voucher.minPurchase && (
                <span className="mt-1 block">Ab {voucher.minPurchase}€ Einkaufswert</span>
              )}
            </div>
            
            {!voucher.used && (
              <button 
                onClick={onUse}
                className="bg-pink-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-pink-600 transition-colors"
              >
                Einlösen
              </button>
            )}
          </div>
          
          {voucher.used && (
            <div className="mt-2 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              ✓ Eingelöst
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const VouchersScreen: React.FC = () => (
    <div className="min-h-screen bg-gray-50">
      <Header title="Gutscheine &amp; Angebote" onBack={() => setCurrentScreen('home')} />
      
      {/* Stats */}
      <div className="px-4 py-4">
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-4 rounded-xl mb-4 shadow-lg">
          <h3 className="font-semibold text-lg mb-2">Ihre Gutscheine</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">{availableVouchers.filter(v => !v.used).length}</div>
              <div className="text-sm opacity-90">Verfügbar</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{availableVouchers.filter(v => v.used).length}</div>
              <div className="text-sm opacity-90">Eingelöst</div>
            </div>
            <div>
              <div className="text-2xl font-bold">127€</div>
              <div className="text-sm opacity-90">Gespart</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Categories */}
      <div className="px-4 py-4">
        <div className="flex gap-3 overflow-x-auto pb-2">
          {['Alle', 'Mode', 'Gastronomie', 'Elektronik', 'Kunst', 'Bücher'].map((category) => (
            <button key={category} className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${
              category === 'Alle' ? 'bg-pink-500 text-white' : 'bg-white border border-gray-300 hover:bg-gray-50'
            }`}>
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Vouchers */}
      <div className="px-4 pb-6">
        <h3 className="text-lg font-semibold mb-3 text-gray-800">Aktuelle Angebote</h3>
        <div className="space-y-4">
          {availableVouchers.map((voucher) => (
            <VoucherCard 
              key={voucher.id} 
              voucher={voucher}
              onUse={() => {
                setAvailableVouchers(prev =>
                  prev.map(v =>
                    v.id === voucher.id ? { ...v, used: true } : v
                  )
                );
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );

  const ShoppingScreen: React.FC = () => {
    const stores: Store[] = [
      {
        id: 'galerie-jaeschke',
        name: 'Galerie Jaeschke',
        category: 'Kunst & Rahmen',
        distance: '150m',
        pickup: '1 Std',
        rating: 4.9,
        address: 'Steinweg 26, 38100 Braunschweig',
        image: '/images/galerie-jaeschke-storefront.jpg',
        description: 'Seit 1985 Ihre Galerie für Kunst und hochwertige Bilderrahmen',
        items: [
          { id: 'painting', name: 'Braunschweig Stadtansicht', price: 189.99, available: true, originalPrice: 229.99, discount: 20 },
          { id: 'frame', name: 'Holzrahmen Premium', price: 45.99, available: true },
          { id: 'poster', name: 'Heinrich der Löwe Print', price: 24.99, available: true }
        ]
      },
      {
        id: 'peek',
        name: 'Peek & Cloppenburg',
        category: 'Mode',
        distance: '200m',
        pickup: '2 Std',
        rating: 4.5,
        address: 'Damm 21, 38100 Braunschweig',
        image: '/images/peek-cloppenburg-store.jpg',
        description: 'Fashion & Lifestyle im Herzen der Stadt',
        items: [
          { id: 'jacket', name: 'Winterjacke Herren', price: 76.49, available: true, originalPrice: 89.99, discount: 15 },
          { id: 'dress', name: 'Kleid Damen', price: 45.99, available: true },
          { id: 'shoes', name: 'Sneaker', price: 79.99, available: false }
        ]
      },
      {
        id: 'buchhandlung-neukirchen',
        name: 'Buchhandlung Neukirchen',
        category: 'Bücher',
        distance: '180m',
        pickup: '30 Min',
        rating: 4.8,
        address: 'Schöppenstedter Str. 32, 38100 Braunschweig',
        image: '/images/buchhandlung-neukirchen.jpg',
        description: 'Traditionelle Buchhandlung mit persönlicher Beratung',
        items: [
          { id: 'local-history', name: 'Braunschweig Geschichte', price: 18.99, available: true },
          { id: 'cookbook', name: 'Niedersächsische Küche', price: 24.99, available: true },
          { id: 'guide', name: 'Harz Wanderführer', price: 12.99, available: true }
        ]
      },
      {
        id: 'saturn',
        name: 'Saturn',
        category: 'Elektronik',
        distance: '250m',
        pickup: '1 Std',
        rating: 4.2,
        address: 'Schloss-Arkaden, 38100 Braunschweig',
        image: '/images/saturn-braunschweig.jpg',
        description: 'Technik & Entertainment Megastore',
        items: [
          { id: 'headphones', name: 'Bluetooth Kopfhörer', price: 119.99, available: true, originalPrice: 129.99, discount: 10 },
          { id: 'phone', name: 'Smartphone Case', price: 19.99, available: true },
          { id: 'charger', name: 'USB-C Ladekabel', price: 24.99, available: true }
        ]
      },
      {
        id: 'juwelier-hildebrandt',
        name: 'Juwelier Hildebrandt',
        category: 'Schmuck',
        distance: '120m',
        pickup: '2 Std',
        rating: 4.7,
        address: 'Damm 19, 38100 Braunschweig',
        image: '/images/juwelier-hildebrandt.jpg',
        description: 'Exklusiver Schmuck und Uhren seit 1923',
        items: [
          { id: 'watch', name: 'Armbanduhr Damen', price: 299.99, available: true },
          { id: 'necklace', name: 'Silberkette', price: 89.99, available: true },
          { id: 'ring', name: 'Ring mit Stein', price: 159.99, available: true }
        ]
      }
    ];

    return (
      <div className="min-h-screen bg-gray-50">
        <Header title="Click & Collect Shopping" onBack={() => setCurrentScreen('home')} />
        
        {/* Categories */}
        <div className="px-4 py-4">
          <div className="flex gap-3 overflow-x-auto pb-2">
            {['Alle', 'Mode', 'Elektronik', 'Bücher', 'Kunst', 'Schmuck'].map((category) => (
              <button key={category} className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${
                category === 'Alle' ? 'bg-orange-500 text-white' : 'bg-white border border-gray-300 hover:bg-gray-50'
              }`}>
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Stores */}
        <div className="px-4 pb-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-800">Lokale Geschäfte</h3>
          <div className="space-y-4">
            {stores.map((store) => (
              <StoreCard 
                key={store.id} 
                store={store} 
                cartItems={cartItems}
                addToCart={addToCart}
                updateCartQuantity={updateCartQuantity}
              />
            ))}
          </div>
        </div>
      </div>
    );
  };

  interface StoreCardProps {
    store: Store;
    cartItems: CartItems;
    addToCart: (storeId: string, item: StoreItem) => void;
    updateCartQuantity: (storeId: string, itemId: string, quantity: number) => void;
  }

  const StoreCard: React.FC<StoreCardProps> = ({ store, cartItems, addToCart, updateCartQuantity }) => (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Store Header with Image */}
      <div className="relative h-32 bg-gradient-to-r from-gray-300 to-gray-400">
        {/* Placeholder for real image */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 opacity-80"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h3 className="font-bold text-lg">{store.name}</h3>
            <p className="text-sm opacity-90">{store.category}</p>
          </div>
        </div>
        
        {/* Rating Badge */}
        <div className="absolute top-3 right-3 bg-white rounded-full px-2 py-1 flex items-center gap-1">
          <Star className="w-3 h-3 text-yellow-500 fill-current" />
          <span className="text-xs font-medium">{store.rating}</span>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <p className="text-sm text-gray-600 mb-1">{store.description}</p>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <MapPinIcon className="w-3 h-3" />
              <span>{store.distance} • {store.address}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-green-600 text-sm font-medium">
              Abholung in {store.pickup}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {store.items.map((item) => (
            <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
              <div className="flex-1">
                <h5 className="font-medium text-sm text-gray-800">{item.name}</h5>
                <div className="flex items-center gap-2">
                  {item.originalPrice && item.discount ? (
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-orange-600">{item.price.toFixed(2)}€</span>
                      <span className="text-xs text-gray-500 line-through">{item.originalPrice.toFixed(2)}€</span>
                        <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full">
                          -{item.discount}%
                        </span>
                      </div>
                  ) : (
                    <span className="font-bold text-orange-600">{item.price.toFixed(2)}€</span>
                  )}
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    item.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {item.available ? 'Verfügbar' : 'Ausverkauft'}
                  </span>
                </div>
              </div>
              
              {item.available && (
                <div className="flex items-center gap-2">
                  {cartItems[store.id]?.[item.id] > 0 ? (
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => updateCartQuantity(store.id, item.id, (cartItems[store.id][item.id] || 0) - 1)}
                        className="bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="text-sm font-medium">{cartItems[store.id][item.id]}</span>
                      <button 
                        onClick={() => addToCart(store.id, item)}
                        className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => addToCart(store.id, item)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors"
                    >
                      In den Warenkorb
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="mt-4">
          <button 
            onClick={() => setCurrentScreen('cart')}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg w-full hover:bg-orange-600 transition-colors"
          >
            Zum Warenkorb ({getTotalCartItems()})
          </button>
        </div>
      </div>
    </div>
  );

  const RestaurantsScreen: React.FC = () => {
    const restaurants: Restaurant[] = [
      {
        id: 'ratskeller',
        name: 'Ratskeller Braunschweig',
        cuisine: 'Deutsche Küche',
        rating: 4.6,
        price: '€€€',
        distance: '100m',
        image: '/images/ratskeller-braunschweig.jpg',
        nextSlot: '19:30',
        tables: '3 Tische frei',
        speciality: 'Traditionelle Küche',
        address: 'Altstadtmarkt 7, 38100 Braunschweig'
      },
      {
        id: 'extrablatt',
        name: 'Café Extrablatt',
        cuisine: 'Café & Bistro',
        rating: 4.3,
        price: '€€',
        distance: '180m',
        image: '/images/cafe-extrablatt-bs.jpg',
        nextSlot: '18:45',
        tables: '5 Tische frei',
        speciality: 'Frühstück & Kaffee',
        address: 'Kohlmarkt 13, 38100 Braunschweig'
      },
      {
        id: 'sakura',
        name: 'Sakura Sushi',
        cuisine: 'Japanisch',
        rating: 4.8,
        price: '€€€',
        distance: '220m',
        image: '/images/sakura-sushi-bs.jpg',
        nextSlot: '20:00',
        tables: '2 Tische frei',
        speciality: 'Sushi & Ramen',
        address: 'Steinweg 18, 38100 Braunschweig'
      },
      {
        id: 'restaurant-feldschlosschen',
        name: 'Restaurant Feldschlösschen',
        cuisine: 'Deutsche Küche',
        rating: 4.5,
        price: '€€',
        distance: '320m',
        image: '/images/feldschloesschen-bs.jpg',
        nextSlot: '18:15',
        tables: '7 Tische frei',
        speciality: 'Hausbrauerei & Regionale Küche',
        address: 'Hamburger Str. 267, 38114 Braunschweig'
      },
      {
        id: 'la-cantina',
        name: 'La Cantina',
        cuisine: 'Italienisch',
        rating: 4.4,
        price: '€€',
        distance: '150m',
        image: '/images/la-cantina-bs.jpg',
        nextSlot: '19:00',
        tables: '4 Tische frei',
        speciality: 'Pizza & Pasta',
        address: 'Wendenstraße 13, 38100 Braunschweig'
      }
    ];

    return (
      <div className="min-h-screen bg-gray-50">
        <Header title="Restaurant Reservierungen" onBack={() => setCurrentScreen('home')} />
        
        {/* Quick Filters */}
        <div className="px-4 py-4">
          <div className="flex gap-3 overflow-x-auto pb-2">
            {['Alle', 'Verfügbar', 'Deutsch', 'International', 'Vegetarisch'].map((filter) => (
              <button key={filter} className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${
                filter === 'Alle' ? 'bg-red-500 text-white' : 'bg-white border border-gray-300 hover:bg-gray-50'
              }`}>
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Restaurants */}
        <div className="px-4 pb-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-800">Heute verfügbar</h3>
          <div className="space-y-4">
            {restaurants.map((restaurant) => (
              <RestaurantCard 
                key={restaurant.id} 
                restaurant={restaurant}
                reservationData={reservationData}
                setReservationData={setReservationData}
              />
            ))}
          </div>
          
          {/* Special Offers */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">Heute besonders</h3>
            <div className="bg-gradient-to-r from-green-500 to-teal-500 text-white p-4 rounded-xl shadow-lg">
              <h4 className="font-bold text-lg mb-2">Happy Hour Special! 🍷</h4>
              <p className="mb-3 opacity-90">20% Rabatt auf alle Getränke von 17:00-19:00 Uhr</p>
              <div className="flex justify-between items-center">
                <span className="text-sm opacity-90">Gültig in 12 teilnehmenden Restaurants</span>
                <button className="bg-white text-green-600 px-4 py-2 rounded-lg font-medium text-sm hover:bg-gray-100 transition-colors">
                  Anzeigen
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  interface RestaurantCardProps {
    restaurant: Restaurant;
    reservationData: ReservationData;
    setReservationData: React.Dispatch<React.SetStateAction<ReservationData>>;
  }

  const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant, reservationData, setReservationData }) => (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Restaurant Header with Image */}
      <div className="relative h-32 bg-gradient-to-r from-gray-300 to-gray-400">
        <div className="absolute inset-0 bg-gradient-to-br from-red-400 to-orange-500 opacity-80"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h3 className="font-bold text-lg">{restaurant.name}</h3>
            <p className="text-sm opacity-90">{restaurant.cuisine}</p>
          </div>
        </div>
        
        <div className="absolute top-3 right-3 bg-white rounded-full px-2 py-1 flex items-center gap-1">
          <Star className="w-3 h-3 text-yellow-500 fill-current" />
          <span className="text-xs font-medium">{restaurant.rating}</span>
        </div>
        
        <div className="absolute bottom-3 left-3 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
          {restaurant.price}
        </div>
      </div>
      
      <div className="p-4">
        <div className="mb-3">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-sm text-gray-600 mb-1">{restaurant.speciality}</p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <MapPinIcon className="w-3 h-3" />
                <span>{restaurant.distance} • {restaurant.address}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-green-600 font-medium">Nächster Termin: {restaurant.nextSlot}</span>
            <span className="text-gray-500">{restaurant.tables}</span>
          </div>
        </div>
        
        {/* Reservation Section */}
        <div className="pt-3 border-t border-gray-200">
          <div className="flex items-center gap-4 mb-3">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-500" />
              <select 
                value={reservationData.guests}
                onChange={(e) => setReservationData(prev => ({...prev, guests: parseInt(e.target.value)}))}
                className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                {[1,2,3,4,5,6,7,8].map(num => (
                  <option key={num} value={num}>{num} Person{num > 1 ? 'en' : ''}</option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <select 
                value={reservationData.time}
                onChange={(e) => setReservationData(prev => ({...prev, time: e.target.value}))}
                className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                {['18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'].map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button className="flex-1 bg-red-500 text-white py-3 rounded-lg font-medium hover:bg-red-600 transition-colors">
              Jetzt reservieren
            </button>
            <button className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Phone className="w-5 h-5" />
            </button>
            <button className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <MessageCircle className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Navigation, Parking, Events, and AR screens remain the same as before
  const NavigationScreen: React.FC = () => (
    <div className="min-h-screen bg-gray-50">
      <Header title="Navigation" onBack={() => setCurrentScreen('home')} />
      
      {/* Map Area */}
      <div className="h-64 bg-gradient-to-br from-green-400 to-blue-500 relative m-4 rounded-xl overflow-hidden shadow-lg">
        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
          <div className="text-white text-center">
            <MapPin className="w-12 h-12 mx-auto mb-2" />
            <p className="font-semibold">AR Navigation aktiv</p>
            <p className="text-sm opacity-90">Folge den Pfeilen zum Ziel</p>
          </div>
        </div>
        
        {/* AR Elements */}
        <div className="absolute top-4 left-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
          850m zum Schloss
        </div>
        <div className="absolute bottom-4 right-4 bg-green-500 text-white p-2 rounded-full shadow-lg">
          <Navigation className="w-6 h-6" />
        </div>
      </div>

      {/* Popular Destinations */}
      <div className="px-4">
        <h3 className="text-lg font-semibold mb-3 text-gray-800">Beliebte Ziele</h3>
        <div className="space-y-3">
          {[
            { name: 'Burgplatz', distance: '200m', time: '3 Min', icon: '🏰', id: 'burgplatz' },
            { name: 'Schloss Richmond', distance: '850m', time: '11 Min', icon: '🏛️', id: 'schloss' },
            { name: 'Happy Rizzi House', distance: '600m', time: '8 Min', icon: '🎨', id: 'rizzi' },
            { name: 'Dom St. Blasii', distance: '300m', time: '4 Min', icon: '⛪', id: 'dom' }
          ].map((dest) => (
            <div key={dest.id} className="bg-white rounded-xl shadow-md p-4 flex items-center gap-4 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-xl">
                {dest.icon}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800">{dest.name}</h4>
                <p className="text-gray-600 text-sm">{dest.distance} • {dest.time} zu Fuß</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => toggleFavorite(dest.id)}
                  className={`p-2 rounded-lg transition-colors ${favoriteSpots.includes(dest.id) ? 'text-red-500' : 'text-gray-400 hover:text-red-400'}`}
                >
                  <Heart className={`w-5 h-5 ${favoriteSpots.includes(dest.id) ? 'fill-current' : ''}`} />
                </button>
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors">
                  Route
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const ParkingScreen: React.FC = () => (
    <div className="min-h-screen bg-gray-50">
      <Header title="Smart Parking" onBack={() => setCurrentScreen('home')} />
      
      {/* Current Status */}
      <div className="px-4 py-4">
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-xl mb-4 shadow-lg">
          <h3 className="font-semibold text-lg mb-2">Aktuelle Verfügbarkeit</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">143</div>
              <div className="text-sm opacity-90">Freie Plätze</div>
            </div>
            <div>
              <div className="text-2xl font-bold">2.50€</div>
              <div className="text-sm opacity-90">Ø Stundentarif</div>
            </div>
            <div>
              <div className="text-2xl font-bold">5 Min</div>
              <div className="text-sm opacity-90">Ø Fußweg</div>
            </div>
          </div>
        </div>
      </div>

      {/* Parking Areas */}
      <div className="px-4">
        <h3 className="text-lg font-semibold mb-3 text-gray-800">Parkhäuser & Plätze</h3>
        <div className="space-y-3">
          {[
            { name: 'Rathaus-Center', free: 45, total: 200, price: '2.00€/h', distance: '2 Min', status: 'available' },
            { name: 'Schloss-Arkaden', free: 12, total: 150, price: '2.50€/h', distance: '3 Min', status: 'limited' },
            { name: 'Parkplatz Bohlweg', free: 78, total: 120, price: '1.50€/h', distance: '5 Min', status: 'available' },
            { name: 'Tiefgarage Innenstadt', free: 8, total: 80, price: '3.00€/h', distance: '1 Min', status: 'limited' }
          ].map((parking, idx) => (
            <ParkingCard key={idx} parking={parking} />
          ))}
        </div>
      </div>
    </div>
  );

  interface ParkingData {
    name: string;
    free: number;
    total: number;
    price: string;
    distance: string;
    status: string;
  }

  interface ParkingCardProps {
    parking: ParkingData;
  }

  const ParkingCard: React.FC<ParkingCardProps> = ({ parking }) => (
    <div className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="font-semibold text-gray-800">{parking.name}</h4>
          <p className="text-gray-600 text-sm">{parking.distance} Fußweg</p>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
          parking.status === 'available' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
        }`}>
          {parking.status === 'available' ? 'Verfügbar' : 'Begrenzt'}
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${
            parking.free > 20 ? 'bg-green-500' : parking.free > 5 ? 'bg-orange-500' : 'bg-red-500'
          }`}></div>
          <span className="text-sm text-gray-700">{parking.free}/{parking.total} frei</span>
        </div>
        <span className="font-semibold text-blue-600">{parking.price}</span>
      </div>
      
      <div className="flex gap-2">
        <button className="flex-1 bg-blue-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors">
          Reservieren
        </button>
        <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">
          Route
        </button>
      </div>
    </div>
  );

  const EventsScreen: React.FC = () => (
    <div className="min-h-screen bg-gray-50">
      <Header title="Events & Veranstaltungen" onBack={() => setCurrentScreen('home')} />
      
      {/* Today's Events */}
      <div className="px-4 py-4">
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-xl mb-4 shadow-lg">
          <h3 className="font-semibold text-lg mb-2">Heute in Braunschweig</h3>
          <p className="opacity-90">5 Veranstaltungen • 3 in deiner Nähe</p>
        </div>
      </div>

      <div className="px-4 pb-6">
        <div className="space-y-4">
          {[
            {
              title: 'Wochenmarkt am Kohlmarkt',
              time: '08:00 - 14:00',
              location: 'Kohlmarkt',
              category: 'Markt',
              attendees: '200+',
              image: '🥕',
              color: 'green'
            },
            {
              title: 'Jazz im Schlosspark',
              time: '19:30 - 22:00',
              location: 'Schloss Richmond',
              category: 'Musik',
              attendees: '150',
              image: '🎷',
              color: 'blue'
            },
            {
              title: 'Stadtführung "Löwenspuren"',
              time: '15:00 - 16:30',
              location: 'Burgplatz',
              category: 'Tour',
              attendees: '25',
              image: '🦁',
              color: 'orange'
            },
            {
              title: 'Kunstausstellung Modern Art',
              time: '10:00 - 18:00',
              location: 'Städtisches Museum',
              category: 'Kultur',
              attendees: '80',
              image: '🎨',
              color: 'purple'
            }
          ].map((event, idx) => (
            <EventCard key={idx} event={event} />
          ))}
        </div>
      </div>
    </div>
  );

  interface Event {
    title: string;
    time: string;
    location: string;
    category: string;
    attendees: string;
    image: string;
    color: string;
  }

  interface EventCardProps {
    event: Event;
  }

  const EventCard: React.FC<EventCardProps> = ({ event }) => (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="flex">
        <div className={`w-20 h-20 bg-gradient-to-br from-${event.color}-400 to-${event.color}-600 flex items-center justify-center text-2xl`}>
          {event.image}
        </div>
        <div className="flex-1 p-4">
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-semibold text-sm text-gray-800">{event.title}</h4>
            <span className={`px-2 py-1 rounded-full text-xs bg-${event.color}-100 text-${event.color}-700`}>
              {event.category}
            </span>
          </div>
          <div className="text-gray-600 text-xs space-y-1">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <span>👥 {event.attendees} Teilnehmer</span>
            </div>
          </div>
        </div>
      </div>
      <div className="px-4 pb-4 flex gap-2">
        <button className="flex-1 bg-blue-500 text-white py-2 rounded-lg text-sm hover:bg-blue-600 transition-colors">
          Teilnehmen
        </button>
        <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">
          <Share2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  const ARScreen: React.FC = () => (
    <div className="min-h-screen bg-black text-white relative">
      <Header title="AR Stadttour" onBack={() => setCurrentScreen('home')} />
      
      {/* Camera View Simulation */}
      <div className="relative h-96 bg-gradient-to-b from-blue-300 to-green-300 overflow-hidden">
        {/* Simulated camera view */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-green-400 to-yellow-400 opacity-70"></div>
        
        {/* AR Overlays */}
        <div className="absolute top-20 left-8 bg-black bg-opacity-70 text-white p-3 rounded-lg max-w-xs">
          <h4 className="font-bold text-sm mb-1">🏰 Burgplatz</h4>
          <p className="text-xs opacity-90">Historischer Marktplatz aus dem 12. Jahrhundert. Hier fanden einst die großen Märkte statt.</p>
        </div>
        
        <div className="absolute bottom-20 right-8 bg-yellow-500 text-black p-2 rounded-full">
          <span className="text-xs font-bold">🦁 Löwe gefunden! +100 Punkte</span>
        </div>
        
        {/* AR Navigation Arrow */}
        <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2">
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center animate-pulse">
            <Navigation className="w-6 h-6 text-white" />
          </div>
          <p className="text-center text-xs mt-2 bg-black bg-opacity-50 px-2 py-1 rounded">350m</p>
        </div>
      </div>

      {/* AR Controls */}
      <div className="p-4 space-y-4">
        <div className="bg-gray-800 rounded-xl p-4">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Camera className="w-5 h-5" />
            AR Tour Fortschritt
          </h3>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Löwen gefunden</span>
              <span className="text-yellow-400 font-bold">7/12</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div className="bg-yellow-400 h-2 rounded-full" style={{width: '58%'}}></div>
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              <span>Punkte: 1,250</span>
              <span>Level: Löwen-Experte</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-4">
          <h3 className="font-semibold mb-3">Nächste Stationen</h3>
          <div className="space-y-2">
            {[
              { name: 'Heinrich der Löwe Denkmal', distance: '350m', points: '150' },
              { name: 'Löwen-Brunnen', distance: '500m', points: '200' },
              { name: 'Städtisches Museum', distance: '800m', points: '300' }
            ].map((station, idx) => (
              <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-700 last:border-b-0">
                <div>
                  <p className="text-sm font-medium">{station.name}</p>
                  <p className="text-xs text-gray-400">{station.distance}</p>
                </div>
                <span className="text-yellow-400 text-sm font-bold">+{station.points}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button className="flex-1 bg-blue-600 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors">
            Route zur nächsten Station
          </button>
          <button className="px-4 py-3 bg-gray-700 rounded-xl hover:bg-gray-600 transition-colors">
            <QrCode className="w-5 h-5" />
          </button>
          <button className="px-4 py-3 bg-gray-700 rounded-xl hover:bg-gray-600 transition-colors">
            <Info className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );

  const screens: Record<string, React.ReactElement> = {
    home: <HomeScreen />,
    navigation: <NavigationScreen />,
    parking: <ParkingScreen />,
    shopping: <ShoppingScreen />,
    restaurants: <RestaurantsScreen />,
    vouchers: <VouchersScreen />,
    events: <EventsScreen />,
    ar: <ARScreen />
  };

  return (
    <>
      <Head>
        <title>BS.Smart - Braunschweig Smart City App</title>
        <meta name="description" content="Die offizielle Smart City App für Braunschweig" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="max-w-sm w-full bg-white shadow-2xl rounded-3xl overflow-hidden">
          <StatusBar />
          {screens[currentScreen]}
        </div>
      </main>
    </>
  );
};
