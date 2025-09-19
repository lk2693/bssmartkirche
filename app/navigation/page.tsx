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
  Pause, RotateCcw, Maximize2, X
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

// Declare global google object to avoid TypeScript errors
declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

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
  const [map, setMap] = useState<any>(null);
  const [directionsService, setDirectionsService] = useState<any>(null);
  const [directionsRenderer, setDirectionsRenderer] = useState<any>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);

  // Mock destinations data
  const destinations = useMemo<Destination[]>(() => [
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
    }
  ], []);

  // Load Google Maps API
  useEffect(() => {
    const loadGoogleMaps = () => {
      if (window.google) {
        setIsGoogleMapsLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places,directions&callback=initMap`;
      script.async = true;
      script.defer = true;
      
      window.initMap = () => {
        setIsGoogleMapsLoaded(true);
      };

      script.onerror = () => {
        console.error('Failed to load Google Maps API');
      };

      document.head.appendChild(script);

      return () => {
        document.head.removeChild(script);
      };
    };

    loadGoogleMaps();
  }, []);

  // Initialize Google Maps when API is loaded and map mode is selected
  useEffect(() => {
    if (isGoogleMapsLoaded && currentMode === 'map' && !map) {
      initializeMap();
    }
  }, [isGoogleMapsLoaded, currentMode]);

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

  // Initialize Google Maps
  const initializeMap = useCallback(() => {
    if (typeof window !== 'undefined' && window.google && !map) {
      const mapElement = document.getElementById('google-map');
      if (!mapElement) return;

      const mapInstance = new window.google.maps.Map(mapElement, {
        center: { lat: userLocation.lat, lng: userLocation.lng },
        zoom: 15,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }]
          }
        ],
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      });

      const directionsServiceInstance = new window.google.maps.DirectionsService();
      const directionsRendererInstance = new window.google.maps.DirectionsRenderer({
        suppressMarkers: false,
        polylineOptions: {
          strokeColor: '#4F46E5',
          strokeWeight: 4,
        }
      });

      directionsRendererInstance.setMap(mapInstance);

      setMap(mapInstance);
      setDirectionsService(directionsServiceInstance);
      setDirectionsRenderer(directionsRendererInstance);
      setIsMapLoaded(true);

      // Add markers for destinations
      destinations.forEach(destination => {
        new window.google.maps.Marker({
          position: { lat: destination.coordinates.lat, lng: destination.coordinates.lng },
          map: mapInstance,
          title: destination.name,
          icon: {
            url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="8" fill="#4F46E5"/>
                <text x="12" y="16" text-anchor="middle" fill="white" font-size="8">${getCategoryIcon(destination.category)}</text>
              </svg>
            `)}`,
            scaledSize: new window.google.maps.Size(32, 32),
          }
        });
      });
    }
  }, [map, destinations, userLocation]);

  // Calculate real route using Google Maps
  const calculateRoute = useCallback((destination: Destination) => {
    if (!directionsService || !directionsRenderer || !window.google) {
      console.error('Google Maps services not available');
      return;
    }

    const travelModeMap = {
      walking: window.google.maps.TravelMode.WALKING,
      driving: window.google.maps.TravelMode.DRIVING,
      cycling: window.google.maps.TravelMode.BICYCLING,
      transit: window.google.maps.TravelMode.TRANSIT
    };

    directionsService.route({
      origin: { lat: userLocation.lat, lng: userLocation.lng },
      destination: { lat: destination.coordinates.lat, lng: destination.coordinates.lng },
      travelMode: travelModeMap[transportMode],
      avoidHighways: false,
      avoidTolls: false,
    }, (result: any, status: string) => {
      if (status === 'OK' && result) {
        directionsRenderer?.setDirections(result);
        
        const route = result.routes[0];
        const leg = route.legs[0];
        
        const mockRoute: RouteInfo = {
          destination,
          transportMode,
          distance: Math.round(leg.distance?.value || 0),
          duration: Math.round((leg.duration?.value || 0) / 60),
          steps: leg.steps?.map((step: any, index: number) => ({
            id: index.toString(),
            instruction: step.instructions.replace(/<[^>]*>/g, ''),
            direction: 'straight' as const,
            distance: step.distance?.value || 0,
            duration: Math.round((step.duration?.value || 0) / 60),
            streetName: step.instructions.split(' ')[0] || '',
          })) || [],
          trafficInfo: {
            level: 'low' as const,
            delays: 0,
            incidents: []
          },
          alternativeRoutes: result.routes.length - 1
        };

        setCurrentRoute(mockRoute);
        setIsNavigating(true);
        setCurrentMode('route');
        setCurrentStepIndex(0);
      } else {
        console.error('Directions request failed due to ' + status);
      }
    });
  }, [directionsService, directionsRenderer, userLocation, transportMode]);

  // Update start navigation to use Google Maps
  const startNavigation = useCallback((destination: Destination) => {
    if (isMapLoaded && window.google) {
      calculateRoute(destination);
    } else {
      // Fallback to mock data if Maps not loaded
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
    }
  }, [isMapLoaded, calculateRoute, transportMode]);

  const stopNavigation = useCallback(() => {
    setIsNavigating(false);
    setCurrentRoute(null);
    setArMarkers([]);
    setCurrentMode('search');
    setCurrentStepIndex(0);
    if (directionsRenderer) {
      directionsRenderer.setDirections({ routes: [] });
    }
  }, [directionsRenderer]);

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
  const StatusBar: React.FC = () => (
    <div className="flex justify-between items-center px-4 py-3 bg-gray-900 text-white text-sm">
      <span className="font-medium">14:32</span>
      <div className="flex items-center gap-1">
        <div className="w-1 h-3 bg-green-400 rounded"></div>
        <div className="w-1 h-3 bg-green-400 rounded"></div>
        <div className="w-1 h-3 bg-green-400 rounded"></div>
        <div className="w-1 h-3 bg-gray-600 rounded"></div>
      </div>
    </div>
  );

  const SearchAndFilter: React.FC = () => (
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

      {/* Transportation Mode Selector */}
      <div className="mt-4">
        <div className="grid grid-cols-4 gap-2">
          {[
            { mode: 'walking', icon: '🚶', label: 'Zu Fuß' },
            { mode: 'driving', icon: '🚗', label: 'Auto' },
            { mode: 'cycling', icon: '🚴', label: 'Rad' },
            { mode: 'transit', icon: '🚌', label: 'ÖPNV' }
          ].map(({ mode, icon, label }) => (
            <button
              key={mode}
              onClick={() => setTransportMode(mode as any)}
              className={`p-2 rounded-lg text-center transition-all ${
                transportMode === mode
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <div className="text-xl mb-1">{icon}</div>
              <div className="text-xs font-medium">{label}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const NavigationModeSelector: React.FC = () => (
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

  const DestinationCard: React.FC<{ destination: Destination; compact?: boolean }> = ({ destination, compact = false }) => (
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
          <Image
            src={destination.image}
            alt={destination.name}
            fill
            className="object-cover"
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

  // Content views for each mode
  const SearchView: React.FC = () => (
    <div className="p-4 space-y-6 pb-24">
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
  );

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

  const MapView: React.FC = () => (
    <div className="flex-1 relative">
      <div id="google-map" className="w-full h-full min-h-[400px]"></div>
      
      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-2">
        <div className="flex flex-col gap-2">
          <button
            onClick={() => map?.setMapTypeId('roadmap')}
            className={`p-2 rounded ${mapStyle === 'standard' ? 'bg-blue-500 text-white' : 'text-gray-600'}`}
          >
            <Map className="w-4 h-4" />
          </button>
          <button
            onClick={() => map?.setMapTypeId('satellite')}
            className={`p-2 rounded ${mapStyle === 'satellite' ? 'bg-blue-500 text-white' : 'text-gray-600'}`}
          >
            <Satellite className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              if (map && userLocation) {
                map.setCenter({ lat: userLocation.lat, lng: userLocation.lng });
                map.setZoom(15);
              }
            }}
            className="p-2 rounded text-gray-600 hover:bg-gray-100"
          >
            <Crosshair className="w-4 h-4" />
          </button>
        </div>
      </div>

      {isNavigating && currentRoute && (
        <div className="absolute bottom-4 left-4 right-4 bg-white rounded-lg shadow-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-gray-800">{currentRoute.destination.name}</h3>
            <button
              onClick={stopNavigation}
              className="text-red-500 hover:bg-red-50 p-1 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
            <span>{Math.round(currentRoute.distance / 1000 * 10) / 10} km</span>
            <span>•</span>
            <span>{currentRoute.duration} Min</span>
            <span>•</span>
            <span>{getTransportIcon(currentRoute.transportMode)}</span>
          </div>

          {currentRoute.steps.length > 0 && (
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <div className="text-lg">{getDirectionIcon(currentRoute.steps[currentStepIndex]?.direction || 'straight')}</div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">
                    {currentRoute.steps[currentStepIndex]?.instruction}
                  </p>
                  <p className="text-sm text-gray-600">
                    {Math.round((currentRoute.steps[currentStepIndex]?.distance || 0))}m
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const RouteView: React.FC = () => (
    <div className="flex-1 bg-gray-50">
      {currentRoute && (
        <div className="p-4">
          <div className="bg-white rounded-xl shadow-md p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-gray-800">Route nach</h2>
              <button
                onClick={stopNavigation}
                className="text-red-500 hover:bg-red-50 p-2 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 relative rounded-lg overflow-hidden">
                <Image
                  src={currentRoute.destination.image}
                  alt={currentRoute.destination.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">{currentRoute.destination.name}</h3>
                <p className="text-sm text-gray-600">{currentRoute.destination.address}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-blue-600">
                  {Math.round(currentRoute.distance / 1000 * 10) / 10} km
                </div>
                <div className="text-xs text-gray-600">Entfernung</div>
              </div>
              <div>
                <div className="text-lg font-bold text-green-600">{currentRoute.duration} Min</div>
                <div className="text-xs text-gray-600">Fahrzeit</div>
              </div>
              <div>
                <div className="text-lg">{getTransportIcon(currentRoute.transportMode)}</div>
                <div className="text-xs text-gray-600">Verkehrsmittel</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-4">
            <h3 className="font-bold text-gray-800 mb-3">Routendetails</h3>
            <div className="space-y-3">
              {currentRoute.steps.map((step, index) => (
                <div key={step.id} className="flex items-start gap-3">
                  <div className="text-gray-500">
                    {index + 1}.
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="text-gray-800 font-medium">
                        {step.instruction}
                      </div>
                      <div className="text-sm text-gray-500">
                        {Math.round(step.distance)}m
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>{step.duration} Min</span>
                      <span>•</span>
                      <span>{getDirectionIcon(step.direction)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Main render
  return (
    <>
      <Head>
        <title>Navigation - BS.Smart Braunschweig</title>
        <meta name="description" content="Intelligente Navigation durch Braunschweig mit AR, Live-Verkehrsinfos und optimalen Routen" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-md mx-auto bg-white shadow-2xl min-h-screen">
          <StatusBar />
          <SearchAndFilter />
          <NavigationModeSelector />
          
          {currentMode === 'search' && <SearchView />}
          {currentMode === 'ar' && <ARView />}
          {currentMode === 'map' && <MapView />}
          {currentMode === 'route' && <RouteView />}

          {/* Bottom Navigation */}
          <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white/95 backdrop-blur-md border-t border-gray-200 px-4 py-3 shadow-lg">
            <div className="flex justify-around items-center">
              <Link href="/" className="flex flex-col items-center gap-1 text-gray-400 hover:text-blue-500 transition-colors">
                <Home className="w-6 h-6" />
                <span className="text-xs font-medium">Home</span>
              </Link>
              
              <Link href="/navigation" className="flex flex-col items-center gap-1 text-blue-500">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <Navigation className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs font-medium">Navigation</span>
              </Link>
              
              <Link href="/shopping" className="flex flex-col items-center gap-1 text-gray-400 hover:text-orange-500 transition-colors">
                <ShoppingBag className="w-6 h-6" />
                <span className="text-xs font-medium">Shopping</span>
              </Link>
              
              <Link href="/vouchers" className="flex flex-col items-center gap-1 text-gray-400 hover:text-pink-500 transition-colors">
                <Gift className="w-6 h-6" />
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

export default NavigationPage;