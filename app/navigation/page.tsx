import { useState, useEffect, useMemo } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
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
  Pause, RotateCcw, Maximize2, X, ExternalLink
} from 'lucide-react';

const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

// Braunschweig destinations data (statisch, außerhalb der Komponente)
const destinations: Destination[] = [
  {
    id: 'dom',
    name: 'Dom St. Blasii',
    category: 'landmark',
    description: 'Romanischer Dom aus dem 12. Jahrhundert mit beeindruckender Architektur',
    address: 'Domplatz 5, 38100 Braunschweig',
    coordinates: { lat: 52.2618, lng: 10.5208 },
    distance: 300,
    walkingTime: 4,
    drivingTime: 2,
    rating: 4.8,
    reviewCount: 256,
    image: '/dom st blasii.jpeg',
    isOpen: true,
    openUntil: '18:00',
    features: ['Kirche', 'Romanik', 'Historisch', 'Architektur'],
    popularity: 88,
    isFavorite: true,
    visited: true,
    lastVisited: new Date(Date.now() - 86400000 * 7),
    highlight: true
  },
  {
    id: 'burg-dankwarderode',
    name: 'Burg Dankwarderode',
    category: 'landmark',
    description: 'Mittelalterliche Burg Heinrich des Löwen mit Museum und Kunstwerken',
    address: 'Burgplatz 4, 38100 Braunschweig',
    coordinates: { lat: 52.2627, lng: 10.5209 },
    distance: 80,
    walkingTime: 1,
    drivingTime: 1,
    rating: 4.6,
    reviewCount: 195,
    image: '/rizzi house.jpeg',
    isOpen: true,
    openUntil: '17:00',
    features: ['Burg', 'Museum', 'Mittelalter', 'Heinrich der Löwe'],
    popularity: 85,
    isFavorite: false,
    visited: false,
    highlight: true
  },
  {
    id: 'magniviertel',
    name: 'Magniviertel',
    category: 'entertainment',
    description: 'Historisches Viertel mit Fachwerkhäusern, Cafés und Boutiquen',
    address: 'Magnistraße, 38100 Braunschweig',
    coordinates: { lat: 52.2615, lng: 10.5185 },
    distance: 400,
    walkingTime: 5,
    drivingTime: 2,
    rating: 4.4,
    reviewCount: 89,
    image: '/magniviertel.webp',
    isOpen: true,
    features: ['Fachwerk', 'Cafés', 'Boutiquen', 'Historisch'],
    popularity: 71,
    isFavorite: false,
    visited: false,
    highlight: false
  }
];
interface Destination {
  id: string;
  name: string;
  category: 'landmark' | 'restaurant' | 'shop' | 'entertainment' | 'transport' | 'service';
  description: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  distance: number;
  walkingTime: number;
  drivingTime: number;
  rating?: number;
  reviewCount?: number;
  image: string;
  isOpen: boolean;
  openUntil?: string;
  features: string[];
  popularity: number;
  isFavorite: boolean;
  visited: boolean;
  lastVisited?: Date;
  highlight?: boolean;
}
    
function NavigationPage() {
      // --- State and hooks ---
      const [searchQuery, setSearchQuery] = useState('');
      const [selectedCategory, setSelectedCategory] = useState('Alle');
      const [currentMode, setCurrentMode] = useState<'search' | 'map' | 'ar' | 'route'>('search');
      const [recentSearches, setRecentSearches] = useState<string[]>([]);
      const [favoriteDestinations, setFavoriteDestinations] = useState<string[]>([]);
      const [userLocation, setUserLocation] = useState({ lat: 52.2625, lng: 10.5211 });
      const [transportMode, setTransportMode] = useState<'walking' | 'driving' | 'cycling' | 'transit'>('walking');

      // --- Helper functions ---
      const openGoogleMapsNavigation = (destination: Destination) => {
        const encodedAddress = encodeURIComponent(destination.address);
        const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}&travelmode=${transportMode === 'walking' ? 'walking' : transportMode === 'driving' ? 'driving' : transportMode === 'cycling' ? 'bicycling' : 'transit'}`;
        window.open(googleMapsUrl, '_blank');
      };

      const getCategoryColor = (category: string) => {
        switch (category) {
          case 'landmark': return '#4F46E5';
          case 'restaurant': return '#DC2626';
          case 'shop': return '#059669';
          case 'entertainment': return '#7C3AED';
          case 'transport': return '#EA580C';
          case 'service': return '#0891B2';
          default: return '#6B7280';
        }
      };

      const getCategoryIcon = (category: string) => {
        switch (category) {
          case 'landmark': return '🏛️';
          case 'restaurant': return '🍽️';
          case 'shop': return '🛍️';
          case 'entertainment': return '🎭';
          case 'transport': return '🚉';
          case 'service': return '🏢';
          default: return '📍';
        }
      };

      // --- Filtered destinations ---
      const filteredDestinations = useMemo(() => {
        let filtered = destinations;
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          filtered = filtered.filter(dest =>
            dest.name.toLowerCase().includes(query) ||
            dest.description.toLowerCase().includes(query) ||
            dest.address.toLowerCase().includes(query) ||
            dest.features.some(feature => feature.toLowerCase().includes(query))
          );
          filtered = [...filtered].sort((a, b) => a.distance - b.distance);
        }
        if (selectedCategory !== 'Alle') {
          const categoryMap: { [key: string]: string } = {
            'Sehenswürdigkeiten': 'landmark',
            'Restaurants': 'restaurant',
            'Shopping': 'shop',
            'Kultur': 'entertainment',
            'Transport': 'transport',
            'Services': 'service'
          };
          const mappedCategory = categoryMap[selectedCategory];
          if (mappedCategory) {
            filtered = filtered.filter(dest => dest.category === mappedCategory);
          }
        }
        filtered.sort((a, b) => a.distance - b.distance);
        return filtered;
      }, [searchQuery, selectedCategory]);

      const categories = ['Alle', 'Sehenswürdigkeiten', 'Restaurants', 'Shopping', 'Kultur', 'Transport'];

      // --- Components ---
      const SearchAndFilter = () => {
        return (
          <div className="bg-white border-b border-gray-200 p-4">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Wohin möchten Sie?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        );
      };

      const NavigationModeSelector = () => {
        return (
          <div className="bg-white border-b border-gray-200 p-4">
            <div className="grid grid-cols-4 gap-2">
              {[
                { mode: 'search' as const, icon: Search, label: 'Suchen' },
                { mode: 'map' as const, icon: Map, label: 'Karte' },
                { mode: 'ar' as const, icon: Camera, label: 'AR' },
                { mode: 'route' as const, icon: Navigation, label: 'Route' }
              ].map(({ mode, icon: Icon, label }) => (
                <button
                  key={mode}
                  onClick={() => setCurrentMode(mode)}
                  className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-colors ${
                    currentMode === mode 
                      ? 'bg-blue-50 text-blue-600' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-6 h-6" />
                  <span className="text-xs font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>
        );
      };

  const DestinationCard = ({ destination, compact = false }: { destination: Destination; compact?: boolean }) => {
    return (
      <div className={`bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow ${compact ? 'p-3' : ''}`}>
        <div className="flex gap-3">
          <div className={`relative rounded-lg overflow-hidden flex-shrink-0 ${compact ? 'w-16 h-16' : 'w-20 h-20'}`}>
            <Image
              src={destination.image}
              alt={destination.name}
              width={compact ? 64 : 80}
              height={compact ? 64 : 80}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">{getCategoryIcon(destination.category)}</span>
              <h4 className="font-semibold text-gray-900 truncate">{destination.name}</h4>
              {destination.highlight && (
                <span className="bg-yellow-400 text-white text-xs px-2 py-0.5 rounded ml-2">Highlight</span>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
              <span>{destination.address}</span>
              <span>•</span>
              <span>{destination.distance}m</span>
              <span>•</span>
              <span>{destination.walkingTime} Min</span>
            </div>
            <div className="flex gap-1 mb-1 flex-wrap">
              {destination.features.slice(0, 2).map((feature, index) => (
                <span key={index} className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">
                  {feature}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2">
              {destination.rating && (
                <span className="flex items-center gap-1 text-yellow-500 text-xs">
                  <Star className="w-4 h-4" />
                  {destination.rating.toFixed(1)}
                </span>
              )}
              {destination.reviewCount && (
                <span className="text-xs text-gray-400">({destination.reviewCount})</span>
              )}
              {destination.isOpen !== undefined && (
                <span className={`text-xs font-medium ml-2 ${destination.isOpen ? 'text-green-600' : 'text-red-500'}`}>
                  {destination.isOpen ? `Geöffnet${destination.openUntil ? ` bis ${destination.openUntil}` : ''}` : 'Geschlossen'}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center mt-3">
          <button
            onClick={() => openGoogleMapsNavigation(destination)}
            className="bg-blue-600 text-white text-xs px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1"
          >
            <Navigation2 className="w-4 h-4" />
            Route
          </button>
          <button
            onClick={() => {
              setFavoriteDestinations((prev) =>
                prev.includes(destination.id)
                  ? prev.filter((id) => id !== destination.id)
                  : [...prev, destination.id]
              );
            }}
            className={`text-xs px-3 py-2 rounded-lg flex items-center gap-1 transition-colors ${
              favoriteDestinations.includes(destination.id)
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-gray-100 text-gray-500 hover:bg-yellow-50'
            }`}
          >
            <Heart className={`w-4 h-4 ${favoriteDestinations.includes(destination.id) ? 'fill-yellow-400' : ''}`} />
            Favorit
          </button>
        </div>
      </div>
    );
  };

  // Move the search/favorites/results view into its own component
  const SearchView: React.FC = () => (
    <div>
      {favoriteDestinations.length > 0 && searchQuery === '' && (
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-3">Favoriten</h3>
          <div className="space-y-3">
            {destinations.filter(d => favoriteDestinations.includes(d.id)).map((destination) => (
              <DestinationCard key={destination.id} destination={destination} compact />
            ))}
          </div>
        </div>
      )}

      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-800">
            {searchQuery ? 'Suchergebnisse' : selectedCategory === 'Alle' ? 'In der Nähe' : selectedCategory}
          </h3>
          <span className="text-sm text-gray-500">
            {filteredDestinations.length} gefunden
          </span>
        </div>

        {filteredDestinations.length > 0 ? (
          <div className="space-y-3">
            {filteredDestinations.map((destination) => (
              <DestinationCard key={destination.id} destination={destination} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-600 mb-2">Keine Ergebnisse</h4>
            <p className="text-gray-500">Versuchen Sie andere Suchbegriffe</p>
          </div>
        )}
      </div>
    </div>
  );

  const MapView: React.FC = () => {
    // Nur ein MapContainer, garantiert volle Höhe, keine mehrfachen Renderings
    return (
      <div className="relative w-full" style={{ minHeight: '420px' }}>
        <MapContainer
          center={[52.2625, 10.5211]}
          zoom={15}
          scrollWheelZoom={true}
          className="w-full h-[420px] rounded-lg"
          style={{ height: '420px', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={19}
          />
          {/* User location marker */}
          <Marker 
            position={[userLocation.lat, userLocation.lng]}
          >
            <Popup closeButton={false} autoClose={false}>
              <div className="text-center">
                <strong>📍 Ihr Standort</strong>
              </div>
            </Popup>
          </Marker>
          {/* Destination markers */}
          {destinations.map((destination) => (
            <Marker 
              key={destination.id}
              position={[destination.coordinates.lat, destination.coordinates.lng]}
            >
              <Popup maxWidth={280} closeButton={true}>
                <div className="max-w-xs">
                  <div className="flex items-start gap-2 mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-sm">{destination.name}</h3>
                        {destination.highlight && (
                          <span className="bg-red-500 text-white text-xs px-1 py-0.5 rounded">
                            Highlight
                          </span>
                        )}
                        <span className="text-xs text-gray-500">{destination.distance}m</span>
                        <span className="text-xs text-gray-500">{destination.walkingTime} Min</span>
                      </div>
                      <div className="flex gap-1 mb-3 flex-wrap">
                        {destination.features.slice(0, 2).map((feature, index) => (
                          <span key={index} className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => openGoogleMapsNavigation(destination)}
                    className="w-full bg-blue-600 text-white text-sm px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-1"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Route starten
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    );
  };

  const ARView: React.FC = () => (
    <div className="flex-1 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-400 via-sky-300 to-green-300">
        <Image
          src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&h=600&fit=crop"
          alt="Braunschweig AR View"
          fill
          className="object-cover opacity-80"
        />
      </div>

      <div className="absolute inset-0">
        <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-full p-3">
          <Compass className="w-6 h-6 text-white" />
        </div>

        <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
          📍 Burgplatz
        </div>

        <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-sm text-white p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold mb-1">AR-Navigation</h3>
              <p className="text-sm opacity-90">Bewegen Sie Ihr Gerät, um Ziele zu finden</p>
            </div>
            <button
              onClick={() => setCurrentMode('search')}
              className="bg-white text-black px-3 py-1 rounded-lg text-sm"
            >
              Beenden
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const RouteView: React.FC = () => (
    <div className="flex-1 bg-gray-50 p-4">
      <div className="text-center py-8">
        <Navigation className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h4 className="text-lg font-medium text-gray-600 mb-2">Keine Route aktiv</h4>
        <p className="text-gray-500">Wählen Sie ein Ziel aus der Karte oder Suche</p>
      </div>
    </div>
  );

  return (
    <>
      <Head>
        <title>Navigation - BS.Smart</title>
        <meta name="description" content="Intelligente Navigation durch Braunschweig mit AR-Unterstützung" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link 
          rel="preload"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          as="style"
          onLoad={(e) => (e.target as HTMLLinkElement).rel = 'stylesheet'}
        />
        <noscript>
          <link 
            rel="stylesheet" 
            href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          />
        </noscript>
      </Head>

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-md mx-auto bg-white shadow-2xl min-h-screen">
          <SearchAndFilter />
          <NavigationModeSelector />
          
          {currentMode === 'search' && <SearchView />}
          {currentMode === 'ar' && <ARView />}
          {currentMode === 'map' && <MapView />}
          {currentMode === 'route' && <RouteView />}

          {/* Bottom Navigation */}
          <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white/95 backdrop-blur-md border-t border-gray-200 px-4 py-3 shadow-lg">
            <div className="flex justify-around">
              <Link href="/" className="flex flex-col items-center gap-1 text-blue-600">
                <Home className="w-6 h-6" />
                <span className="text-xs font-medium">Home</span>
              </Link>
              <Link href="/navigation" className="flex flex-col items-center gap-1 text-blue-600">
                <Navigation className="w-6 h-6" />
                <span className="text-xs font-medium">Navigation</span>
              </Link>
              <Link href="/events" className="flex flex-col items-center gap-1 text-gray-400 hover:text-blue-500 transition-colors">
                <Calendar className="w-6 h-6" />
                <span className="text-xs font-medium">Events</span>
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

export default NavigationPage;