'use client';

import Link from 'next/link';
import { use, useState, useEffect, useMemo, useCallback } from 'react';
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
  Pause, RotateCcw, Maximize2
} from 'lucide-react';

// Types
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
}

interface RouteInfo {
  destination: Destination;
  transportMode: 'walking' | 'driving' | 'cycling' | 'transit';
  distance: number;
  duration: number;
  steps: RouteStep[];
  trafficInfo?: TrafficInfo;
  alternativeRoutes: number;
}

interface RouteStep {
  id: string;
  instruction: string;
  direction: 'straight' | 'left' | 'right' | 'slight_left' | 'slight_right' | 'sharp_left' | 'sharp_right';
  distance: number;
  duration: number;
  streetName: string;
  landmark?: string;
}

interface TrafficInfo {
  level: 'low' | 'medium' | 'high';
  delays: number;
  incidents: TrafficIncident[];
}

interface TrafficIncident {
  id: string;
  type: 'construction' | 'accident' | 'closure' | 'event';
  severity: 'low' | 'medium' | 'high';
  description: string;
  location: string;
  estimated_delay: number;
}

interface ARMarker {
  id: string;
  type: 'destination' | 'poi' | 'direction' | 'warning';
  position: { x: number; y: number };
  content: string;
  distance: number;
  isVisible: boolean;
}

// Mock data promise for modern React patterns
const createDestinationsPromise = () => {
  return new Promise<Destination[]>((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 'burgplatz',
          name: 'Burgplatz',
          category: 'landmark',
          description: 'Historischer Marktplatz mit Heinrich-der-Löwe-Denkmal im Herzen der Altstadt',
          address: 'Burgplatz, 38100 Braunschweig',
          coordinates: { lat: 52.2625, lng: 10.5211 },
          distance: 50,
          walkingTime: 2,
          drivingTime: 1,
          rating: 4.7,
          reviewCount: 342,
          image: 'https://images.unsplash.com/photo-1571043733612-5d2a8c7e7e1b?w=400&h=300&fit=crop',
          isOpen: true,
          features: ['Historisch', 'Zentral', 'Sehenswürdigkeit', 'Fotomotiv'],
          popularity: 95,
          isFavorite: true,
          visited: true,
          lastVisited: new Date(Date.now() - 86400000 * 3)
        },
        {
          id: 'schloss',
          name: 'Schloss Richmond',
          category: 'landmark',
          description: 'Barockes Schloss mit englischem Landschaftspark und Museum',
          address: 'Museumstraße 1, 38100 Braunschweig',
          coordinates: { lat: 52.2580, lng: 10.5180 },
          distance: 850,
          walkingTime: 11,
          drivingTime: 4,
          rating: 4.5,
          reviewCount: 187,
          image: 'https://images.unsplash.com/photo-1549144511-f099e773c147?w=400&h=300&fit=crop',
          isOpen: true,
          openUntil: '17:00',
          features: ['Museum', 'Park', 'Barock', 'Kultur'],
          popularity: 82,
          isFavorite: true,
          visited: false
        },
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
          image: 'https://images.unsplash.com/photo-1520637736862-4d197d17c11a?w=400&h=300&fit=crop',
          isOpen: true,
          openUntil: '18:00',
          features: ['Kirche', 'Romanik', 'Historisch', 'Architektur'],
          popularity: 88,
          isFavorite: true,
          visited: true,
          lastVisited: new Date(Date.now() - 86400000 * 7)
        },
        {
          id: 'happy-rizzi',
          name: 'Happy Rizzi House',
          category: 'landmark',
          description: 'Buntes Kunsthaus des amerikanischen Künstlers James Rizzi',
          address: 'Ackerhof 1, 38100 Braunschweig',
          coordinates: { lat: 52.2640, lng: 10.5225 },
          distance: 600,
          walkingTime: 8,
          drivingTime: 3,
          rating: 4.3,
          reviewCount: 124,
          image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop',
          isOpen: true,
          features: ['Kunst', 'Modern', 'Bunt', 'Einzigartig'],
          popularity: 76,
          isFavorite: false,
          visited: false
        },
        {
          id: 'hauptbahnhof',
          name: 'Hauptbahnhof Braunschweig',
          category: 'transport',
          description: 'Zentraler Verkehrsknotenpunkt mit Verbindungen in alle Richtungen',
          address: 'Willy-Brandt-Platz 1, 38102 Braunschweig',
          coordinates: { lat: 52.2521, lng: 10.5407 },
          distance: 1200,
          walkingTime: 15,
          drivingTime: 6,
          image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=300&fit=crop',
          isOpen: true,
          features: ['Bahnhof', 'ICE', 'Regional', 'Zentral'],
          popularity: 70,
          isFavorite: false,
          visited: true,
          lastVisited: new Date(Date.now() - 86400000 * 1)
        },
        {
          id: 'ratskeller',
          name: 'Ratskeller Braunschweig',
          category: 'restaurant',
          description: 'Traditionelles Restaurant mit deutscher Küche im historischen Rathaus',
          address: 'Altstadtmarkt 7, 38100 Braunschweig',
          coordinates: { lat: 52.2625, lng: 10.5211 },
          distance: 100,
          walkingTime: 2,
          drivingTime: 1,
          rating: 4.6,
          reviewCount: 387,
          image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop',
          isOpen: true,
          openUntil: '23:00',
          features: ['Restaurant', 'Deutsch', 'Historisch', 'Zentral'],
          popularity: 84,
          isFavorite: false,
          visited: true,
          lastVisited: new Date(Date.now() - 86400000 * 5)
        },
        {
          id: 'schloss-arkaden',
          name: 'Schloss-Arkaden',
          category: 'shop',
          description: 'Einkaufszentrum mit über 130 Geschäften und Restaurants',
          address: 'Platz der Deutschen Einheit 1, 38100 Braunschweig',
          coordinates: { lat: 52.2561, lng: 10.5193 },
          distance: 950,
          walkingTime: 12,
          drivingTime: 5,
          rating: 4.2,
          reviewCount: 543,
          image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
          isOpen: true,
          openUntil: '20:00',
          features: ['Shopping', 'Mall', 'Restaurants', 'Parkhaus'],
          popularity: 78,
          isFavorite: false,
          visited: false
        },
        {
          id: 'staatstheater',
          name: 'Staatstheater Braunschweig',
          category: 'entertainment',
          description: 'Traditionsreiches Theater mit Oper, Schauspiel und Ballett',
          address: 'Am Theater, 38100 Braunschweig',
          coordinates: { lat: 52.2645, lng: 10.5198 },
          distance: 450,
          walkingTime: 6,
          drivingTime: 3,
          rating: 4.7,
          reviewCount: 298,
          image: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=400&h=300&fit=crop',
          isOpen: true,
          openUntil: '22:30',
          features: ['Theater', 'Oper', 'Kultur', 'Historisch'],
          popularity: 72,
          isFavorite: false,
          visited: false
        },
        {
          id: 'museum',
          name: 'Städtisches Museum',
          category: 'entertainment',
          description: 'Museum zur Stadtgeschichte mit wechselnden Ausstellungen',
          address: 'Steintorwall 14, 38100 Braunschweig',
          coordinates: { lat: 52.2635, lng: 10.5165 },
          distance: 520,
          walkingTime: 7,
          drivingTime: 3,
          rating: 4.4,
          reviewCount: 156,
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
          isOpen: true,
          openUntil: '17:00',
          features: ['Museum', 'Geschichte', 'Ausstellungen', 'Bildung'],
          popularity: 65,
          isFavorite: false,
          visited: false
        }
      ]);
    }, 100);
  });
};

const NavigationPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Alle');
  const [currentMode, setCurrentMode] = useState<'search' | 'ar' | 'map' | 'route'>('search');
  const [transportMode, setTransportMode] = useState<'walking' | 'driving' | 'cycling' | 'transit'>('walking');
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [currentRoute, setCurrentRoute] = useState<RouteInfo | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [mapStyle, setMapStyle] = useState<'standard' | 'satellite' | 'traffic'>('standard');
  const [favoriteDestinations, setFavoriteDestinations] = useState<string[]>(['burgplatz', 'schloss', 'dom']);
  const [recentSearches, setRecentSearches] = useState<string[]>(['Burgplatz', 'Schloss Richmond', 'Saturn']);
  const [userLocation, setUserLocation] = useState({ lat: 52.2625, lng: 10.5211 });
  const [arMarkers, setArMarkers] = useState<ARMarker[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Modern React pattern with suspense-like data fetching
  const [destinationsPromise] = useState(() => createDestinationsPromise());
  const destinations = useMemo(() => {
    try {
      return use(destinationsPromise);
    } catch (error) {
      // Return fallback data if promise is still pending
      return [];
    }
  }, [destinationsPromise]);

  // Filter destinations
  const filteredDestinations = useMemo(() => {
    let filtered = destinations;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(dest =>
        dest.name.toLowerCase().includes(query) ||
        dest.description.toLowerCase().includes(query) ||
        dest.address.toLowerCase().includes(query) ||
        dest.features.some(feature => feature.toLowerCase().includes(query))
      );
    }

    // Category filter
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

    // Sort by distance
    filtered.sort((a, b) => a.distance - b.distance);

    return filtered;
  }, [destinations, searchQuery, selectedCategory]);

  // Categories
  const categories = ['Alle', 'Sehenswürdigkeiten', 'Restaurants', 'Shopping', 'Kultur', 'Transport'];

  // Navigation simulation
  const startNavigation = useCallback((destination: Destination) => {
    const mockRoute: RouteInfo = {
      destination,
      transportMode,
      distance: destination.distance,
      duration: transportMode === 'walking' ? destination.walkingTime : destination.drivingTime,
      steps: [
        {
          id: '1',
          instruction: 'Gehen Sie 200m geradeaus',
          direction: 'straight',
          distance: 200,
          duration: 2,
          streetName: 'Bohlweg',
          landmark: 'Rathaus passieren'
        },
        {
          id: '2',
          instruction: 'Biegen Sie links ab',
          direction: 'left',
          distance: 150,
          duration: 2,
          streetName: 'Damm'
        },
        {
          id: '3',
          instruction: 'Biegen Sie rechts ab zum Ziel',
          direction: 'right',
          distance: Math.max(destination.distance - 350, 50),
          duration: Math.max(destination.walkingTime - 4, 1),
          streetName: destination.address.split(',')[0]
        }
      ],
      trafficInfo: {
        level: 'low',
        delays: 0,
        incidents: []
      },
      alternativeRoutes: 2
    };

    setCurrentRoute(mockRoute);
    setIsNavigating(true);
    setCurrentMode('route');
    setCurrentStepIndex(0);

    // Simulate AR markers
    const markers: ARMarker[] = [
      {
        id: 'dest1',
        type: 'destination',
        position: { x: 50, y: 40 },
        content: destination.name,
        distance: destination.distance,
        isVisible: true
      },
      {
        id: 'dir1',
        type: 'direction',
        position: { x: 30, y: 60 },
        content: '200m geradeaus',
        distance: 200,
        isVisible: true
      }
    ];
    setArMarkers(markers);
  }, [transportMode]);

  const stopNavigation = useCallback(() => {
    setIsNavigating(false);
    setCurrentRoute(null);
    setArMarkers([]);
    setCurrentMode('search');
    setCurrentStepIndex(0);
  }, []);

  const toggleFavorite = useCallback((destinationId: string) => {
    setFavoriteDestinations(prev =>
      prev.includes(destinationId)
        ? prev.filter(id => id !== destinationId)
        : [...prev, destinationId]
    );
  }, []);

  const addToRecentSearches = useCallback((query: string) => {
    setRecentSearches(prev => {
      const filtered = prev.filter(search => search !== query);
      return [query, ...filtered].slice(0, 5);
    });
  }, []);

  // Helper functions
  const getTransportIcon = (mode: string) => {
    switch (mode) {
      case 'walking': return '🚶';
      case 'driving': return '🚗';
      case 'cycling': return '🚴';
      case 'transit': return '🚌';
      default: return '🚶';
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

  const getDirectionIcon = (direction: string) => {
    switch (direction) {
      case 'left': return '↰';
      case 'right': return '↱';
      case 'straight': return '↑';
      case 'slight_left': return '↖';
      case 'slight_right': return '↗';
      case 'sharp_left': return '↙';
      case 'sharp_right': return '↘';
      default: return '↑';
    }
  };

  // Components
  const StatusBar = () => (
    <div className="flex justify-between items-center px-4 py-3 bg-gray-900 text-white text-sm">
      <div className="flex items-center gap-2">
        <span className="font-medium">BS.Smart Navigation</span>
        {isNavigating && (
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-400">Aktiv</span>
          </div>
        )}
      </div>
      <div className="flex items-center gap-2">
        <span>14:32</span>
        <div className="flex items-center gap-1">
          <div className="w-1 h-3 bg-green-400 rounded"></div>
          <div className="w-1 h-3 bg-green-400 rounded"></div>
          <div className="w-1 h-3 bg-green-400 rounded"></div>
          <div className="w-1 h-3 bg-green-400 rounded"></div>
        </div>
      </div>
    </div>
  );

  const SearchView = () => (
    <div className="flex-1 overflow-y-auto pb-20">
      {/* Search Bar */}
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

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${
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

      <div className="p-4 space-y-6">
        {/* Transport Mode */}
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-3">Fortbewegung</h3>
          <div className="grid grid-cols-4 gap-3">
            {[
              { mode: 'walking', icon: '🚶', label: 'Zu Fuß' },
              { mode: 'driving', icon: '🚗', label: 'Auto' },
              { mode: 'cycling', icon: '🚴', label: 'Rad' },
              { mode: 'transit', icon: '🚌', label: 'ÖPNV' }
            ].map(({ mode, icon, label }) => (
              <button
                key={mode}
                onClick={() => setTransportMode(mode as any)}
                className={`p-3 rounded-xl text-center transition-all ${
                  transportMode === mode
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-white border border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="text-2xl mb-1">{icon}</div>
                <div className="text-xs font-medium">{label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Searches */}
        {recentSearches.length > 0 && searchQuery === '' && (
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-3">Zuletzt gesucht</h3>
            <div className="space-y-2">
              {recentSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => setSearchQuery(search)}
                  className="w-full flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <History className="w-5 h-5 text-gray-400" />
                  <span className="flex-1 text-left text-gray-800">{search}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Favorites */}
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

        {/* Destinations List */}
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
    </div>
  );

  const DestinationCard = ({ destination, compact = false }: { destination: Destination; compact?: boolean }) => (
    <div 
      className={`bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all cursor-pointer ${
        compact ? 'p-3' : 'p-4'
      }`}
      onClick={() => setSelectedDestination(destination)}
    >
      <div className="flex gap-3">
        <div className={`relative rounded-lg overflow-hidden flex-shrink-0 ${
          compact ? 'w-12 h-12' : 'w-16 h-16'
        }`}>
          <img
            src={destination.image}
            alt={destination.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-1 left-1">
            <span className="text-lg">{getCategoryIcon(destination.category)}</span>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-1">
            <h4 className={`font-semibold text-gray-800 truncate ${compact ? 'text-sm' : 'text-base'}`}>
              {destination.name}
            </h4>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(destination.id);
              }}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <Heart className={`w-4 h-4 ${destination.isFavorite ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
            </button>
          </div>

          {!compact && (
            <p className="text-gray-600 text-sm mb-2 line-clamp-1">{destination.description}</p>
          )}

          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <span>{destination.distance}m</span>
            <span>•</span>
            <span>{getTransportIcon(transportMode)} {
              transportMode === 'walking' ? destination.walkingTime : destination.drivingTime
            } Min</span>
            {destination.rating && (
              <>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-500 fill-current" />
                  <span>{destination.rating}</span>
                </div>
              </>
            )}
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              {destination.isOpen ? (
                <span className="text-green-600 text-sm font-medium">
                  Geöffnet {destination.openUntil && `bis ${destination.openUntil}`}
                </span>
              ) : (
                <span className="text-red-600 text-sm font-medium">Geschlossen</span>
              )}
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                startNavigation(destination);
                addToRecentSearches(destination.name);
              }}
              className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
            >
              Route
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const ARView = () => (
    <div className="flex-1 relative overflow-hidden">
      {/* Camera simulation */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-400 via-sky-300 to-green-300">
        <img
          src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&h=600&fit=crop"
          alt="Braunschweig AR View"
          className="w-full h-full object-cover opacity-80"
        />
      </div>

      {/* AR Overlays */}
      <div className="absolute inset-0">
        {/* Compass */}
        <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-full p-3">
          <Compass className="w-6 h-6 text-white" />
        </div>

        {/* Current location */}
        <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
          📍 Burgplatz
        </div>

        {/* AR Markers */}
        {arMarkers.map((marker) => (
          <div
            key={marker.id}
            className="absolute bg-blue-500 text-white px-3 py-2 rounded-lg shadow-lg"
            style={{
              left: `${marker.position.x}%`,
              top: `${marker.position.y}%`
            }}
          >
            <div className="text-sm font-medium">{marker.content}</div>
            <div className="text-xs opacity-90">{marker.distance}m</div>
          </div>
        ))}

        {/* AR Instructions overlay */}
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

  const MapView = () => (
    <div className="flex-1 relative overflow-hidden">
      {/* Map simulation */}
      <div className="absolute inset-0 bg-gray-200">
        <img
          src="https://images.unsplash.com/photo-1486312338219-ce68e2c6c4d5?w=800&h=600&fit=crop"
          alt="Braunschweig Map"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Map Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <button
          onClick={() => setMapStyle(mapStyle === 'standard' ? 'satellite' : 'standard')}
          className="bg-white p-2 rounded-lg shadow-md"
        >
          <Layers className="w-5 h-5" />
        </button>
        <button className="bg-white p-2 rounded-lg shadow-md">
          <Crosshair className="w-5 h-5" />
        </button>
      </div>

      {/* Map Markers */}
      {destinations.slice(0, 5).map((dest, index) => (
        <div
          key={dest.id}
          className="absolute bg-red-500 text-white p-2 rounded-full shadow-lg cursor-pointer hover:bg-red-600"
          style={{
            left: `${20 + index * 15}%`,
            top: `${30 + index * 10}%`
          }}
          onClick={() => setSelectedDestination(dest)}
        >
          <MapPin className="w-4 h-4" />
        </div>
      ))}

      {/* Back button */}
      <button
        onClick={() => setCurrentMode('search')}
        className="absolute top-4 left-4 bg-white p-2 rounded-lg shadow-md"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>
    </div>
  );

  const RouteView = () => {
    if (!currentRoute) return null;

    const currentStep = currentRoute.steps[currentStepIndex];

    return (
      <div className="flex-1 flex flex-col">
        {/* Route Header */}
        <div className="bg-blue-500 text-white p-4">
          <div className="flex items-center justify-between mb-3">
            <button onClick={stopNavigation}>
              <XCircle className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-2">
              <button onClick={() => setVoiceEnabled(!voiceEnabled)}>
                {voiceEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </button>
              <button onClick={() => setCurrentMode('ar')}>
                <Camera className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-xl font-bold mb-2">{currentRoute.destination.name}</h2>
            <div className="flex items-center justify-center gap-4 text-sm">
              <span>{getTransportIcon(currentRoute.transportMode)} {currentRoute.duration} Min</span>
              <span>📍 {currentRoute.distance}m</span>
              <span>🕐 Ankunft 14:{32 + currentRoute.duration}</span>
            </div>
          </div>
        </div>

        {/* Current Step */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-3 rounded-full">
              <span className="text-2xl">{getDirectionIcon(currentStep.direction)}</span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-gray-800">{currentStep.instruction}</h3>
              <p className="text-gray-600">{currentStep.streetName}</p>
              {currentStep.landmark && (
                <p className="text-sm text-blue-600 mt-1">💡 {currentStep.landmark}</p>
              )}
            </div>
            <div className="text-right text-sm text-gray-500">
              <div>{currentStep.distance}m</div>
              <div>{currentStep.duration} Min</div>
            </div>
          </div>
        </div>

        {/* Route Progress */}
        <div className="bg-gray-50 p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Schritt {currentStepIndex + 1} von {currentRoute.steps.length}</span>
            <span className="text-sm text-gray-500">
              {Math.round((currentStepIndex + 1) / currentRoute.steps.length * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStepIndex + 1) / currentRoute.steps.length * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Route Steps List */}
        <div className="flex-1 overflow-y-auto p-4">
          <h4 className="font-semibold mb-3">Alle Schritte</h4>
          <div className="space-y-3">
            {currentRoute.steps.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                  index === currentStepIndex 
                    ? 'bg-blue-50 border border-blue-200' 
                    : index < currentStepIndex 
                      ? 'bg-green-50 border border-green-200' 
                      : 'bg-white border border-gray-200'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  index === currentStepIndex 
                    ? 'bg-blue-500 text-white' 
                    : index < currentStepIndex 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-200 text-gray-600'
                }`}>
                  {index < currentStepIndex ? '✓' : index + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{step.instruction}</p>
                  <p className="text-sm text-gray-600">{step.streetName}</p>
                </div>
                <div className="text-sm text-gray-500">
                  {step.distance}m
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setCurrentStepIndex(Math.max(0, currentStepIndex - 1))}
              disabled={currentStepIndex === 0}
              className={`px-4 py-2 rounded-lg font-medium ${
                currentStepIndex === 0 
                  ? 'bg-gray-100 text-gray-400' 
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              ← Zurück
            </button>
            <button
              onClick={() => setCurrentStepIndex(Math.min(currentRoute.steps.length - 1, currentStepIndex + 1))}
              disabled={currentStepIndex === currentRoute.steps.length - 1}
              className={`px-4 py-2 rounded-lg font-medium ${
                currentStepIndex === currentRoute.steps.length - 1 
                  ? 'bg-gray-100 text-gray-400' 
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              Weiter →
            </button>
          </div>
        </div>
      </div>
    );
  };

  const DestinationDetail = () => {
    if (!selectedDestination) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end z-50">
        <div className="bg-white rounded-t-2xl w-full max-h-[80vh] overflow-hidden">
          {/* Header */}
          <div className="relative">
            <img
              src={selectedDestination.image}
              alt={selectedDestination.name}
              className="w-full h-48 object-cover"
            />
            <button
              onClick={() => setSelectedDestination(null)}
              className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full"
            >
              <XCircle className="w-5 h-5" />
            </button>
            <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {getCategoryIcon(selectedDestination.category)} {selectedDestination.category}
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{selectedDestination.name}</h2>
                <p className="text-gray-600">{selectedDestination.address}</p>
              </div>
              <button
                onClick={() => toggleFavorite(selectedDestination.id)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <Heart className={`w-6 h-6 ${selectedDestination.isFavorite ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
              </button>
            </div>

            <p className="text-gray-700 mb-4">{selectedDestination.description}</p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="font-semibold text-lg">{selectedDestination.distance}m</div>
                <div className="text-sm text-gray-500">Entfernung</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-lg">{selectedDestination.walkingTime} Min</div>
                <div className="text-sm text-gray-500">Zu Fuß</div>
              </div>
              {selectedDestination.rating && (
                <div className="text-center">
                  <div className="font-semibold text-lg flex items-center justify-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    {selectedDestination.rating}
                  </div>
                  <div className="text-sm text-gray-500">{selectedDestination.reviewCount} Bewertungen</div>
                </div>
              )}
            </div>

            {/* Features */}
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Eigenschaften</h3>
              <div className="flex flex-wrap gap-2">
                {selectedDestination.features.map((feature) => (
                  <span
                    key={feature}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center gap-4 mb-6">
              {selectedDestination.isOpen ? (
                <span className="text-green-600 font-medium">
                  ✅ Geöffnet {selectedDestination.openUntil && `bis ${selectedDestination.openUntil}`}
                </span>
              ) : (
                <span className="text-red-600 font-medium">❌ Geschlossen</span>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  startNavigation(selectedDestination);
                  setSelectedDestination(null);
                }}
                className="flex-1 bg-blue-500 text-white py-3 rounded-xl font-semibold hover:bg-blue-600 transition-colors"
              >
                🧭 Navigation starten
              </button>
              <button className="bg-gray-100 text-gray-800 px-4 py-3 rounded-xl hover:bg-gray-200 transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
              <button className="bg-gray-100 text-gray-800 px-4 py-3 rounded-xl hover:bg-gray-200 transition-colors">
                <Phone className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const BottomNavigation = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 px-4 py-3 shadow-lg">
      <div className="flex justify-around items-center max-w-md mx-auto">
        <Link href="/" className="flex flex-col items-center gap-1 p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <Home className="w-6 h-6 text-gray-600" />
          <span className="text-xs text-gray-600 font-medium">Home</span>
        </Link>
        
        <div className="flex flex-col items-center gap-1 p-2 bg-blue-100 rounded-lg">
          <Navigation className="w-6 h-6 text-blue-600" />
          <span className="text-xs text-blue-600 font-medium">Navigation</span>
        </div>
        
        <Link href="/shopping" className="flex flex-col items-center gap-1 p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ShoppingBag className="w-6 h-6 text-gray-600" />
          <span className="text-xs text-gray-600 font-medium">Shopping</span>
        </Link>
        
        <Link href="/vouchers" className="flex flex-col items-center gap-1 p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <Gift className="w-6 h-6 text-gray-600" />
          <span className="text-xs text-gray-600 font-medium">Gutscheine</span>
        </Link>
        
        <Link href="/restaurants" className="flex flex-col items-center gap-1 p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <Coffee className="w-6 h-6 text-gray-600" />
          <span className="text-xs text-gray-600 font-medium">Restaurants</span>
        </Link>
      </div>
    </div>
  );

  // Zusätzliche Navigation für die spezifischen Navigation-Modi
  const NavigationModeSelector = () => (
    <div className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex justify-around">
        {[
          { mode: 'search', icon: Search, label: 'Suchen', active: currentMode === 'search' },
          { mode: 'ar', icon: Camera, label: 'AR', active: currentMode === 'ar' },
          { mode: 'map', icon: Map, label: 'Karte', active: currentMode === 'map' },
          { mode: 'route', icon: Target, label: 'Route', active: currentMode === 'route' || isNavigating }
        ].map(({ mode, icon: Icon, label, active }) => (
          <button
            key={mode}
            onClick={() => setCurrentMode(mode as any)}
            disabled={mode === 'route' && !isNavigating}
            className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
              active 
                ? 'text-blue-500 bg-blue-50' 
                : mode === 'route' && !isNavigating 
                  ? 'text-gray-300' 
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

  // Main render
  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      <StatusBar />
      <NavigationModeSelector />
      
      {currentMode === 'search' && <SearchView />}
      {currentMode === 'ar' && <ARView />}
      {currentMode === 'map' && <MapView />}
      {currentMode === 'route' && <RouteView />}
      
      <BottomNavigation />
      
      {selectedDestination && <DestinationDetail />}
    </div>
  );
};

export default NavigationPage;