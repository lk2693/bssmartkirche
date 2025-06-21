'use client';

import { use, useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { 
  Car, MapPin, Search, Clock, Star, Navigation,
  Filter, CreditCard, Bookmark, History, Settings,
  AlertCircle, CheckCircle, XCircle, Info, Eye,
  Calendar, Timer, Zap, Shield, Wifi, Camera,
  Phone, MessageCircle, Heart, Share2, Bell,
  TrendingUp, Award, Users, Coffee, ShoppingBag,
  ArrowLeft, ChevronDown, ChevronUp, MoreVertical,
  Play, Pause, RotateCcw, Maximize2, Compass,
  Target, Route, Volume2, VolumeX, Home, Gift
} from 'lucide-react';

// Types
interface ParkingSpot {
  id: string;
  name: string;
  type: 'street' | 'garage' | 'lot' | 'private';
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  distance: number;
  walkingTime: number;
  totalSpaces: number;
  availableSpaces: number;
  occupancyRate: number;
  pricing: {
    hourly: number;
    daily?: number;
    monthly?: number;
  };
  maxDuration?: number; // in hours
  features: string[];
  rating?: number;
  reviewCount?: number;
  isOpen: boolean;
  openHours?: string;
  isFavorite: boolean;
  lastUpdated: Date;
  predictions: {
    nextHour: number;
    next2Hours: number;
    next4Hours: number;
  };
  amenities: string[];
  restrictions: string[];
  paymentMethods: string[];
  image: string;
}

interface Reservation {
  id: string;
  spotId: string;
  spotName: string;
  startTime: Date;
  endTime: Date;
  duration: number;
  cost: number;
  status: 'active' | 'upcoming' | 'completed' | 'cancelled';
  confirmationCode: string;
  spaceNumber?: string;
}

interface ParkingSession {
  id: string;
  spotId: string;
  spotName: string;
  startTime: Date;
  endTime?: Date;
  duration: number;
  cost: number;
  status: 'active' | 'completed';
  spaceNumber?: string;
  paymentMethod: string;
}

// Demo Data
const DEMO_PARKING_SPOTS: ParkingSpot[] = [
  {
    id: 'parkhaus-city',
    name: 'Parkhaus City-Galerie',
    type: 'garage',
    address: 'Bohlweg 38-39, 38100 Braunschweig',
    coordinates: { lat: 52.2631, lng: 10.5218 },
    distance: 120,
    walkingTime: 2,
    totalSpaces: 480,
    availableSpaces: 127,
    occupancyRate: 73,
    pricing: {
      hourly: 2.50,
      daily: 18.00,
      monthly: 89.00
    },
    maxDuration: 24,
    features: ['Überdacht', 'Videoüberwachung', 'Aufzug', 'Behindertengerecht'],
    rating: 4.3,
    reviewCount: 189,
    isOpen: true,
    openHours: '24/7',
    isFavorite: true,
    lastUpdated: new Date(),
    predictions: {
      nextHour: 98,
      next2Hours: 156,
      next4Hours: 203
    },
    amenities: ['WC', 'Waschanlage', 'E-Ladestationen', 'WLAN'],
    restrictions: ['Max. Höhe 2.0m'],
    paymentMethods: ['Karte', 'App', 'Bar'],
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop'
  },
  {
    id: 'schlossplatz',
    name: 'Parkplatz Schlossplatz',
    type: 'lot',
    address: 'Schlossplatz, 38100 Braunschweig',
    coordinates: { lat: 52.2589, lng: 10.5201 },
    distance: 350,
    walkingTime: 4,
    totalSpaces: 85,
    availableSpaces: 12,
    occupancyRate: 86,
    pricing: {
      hourly: 1.50,
      daily: 12.00
    },
    maxDuration: 8,
    features: ['Zentral', 'Historisch', 'Kurze Wege'],
    rating: 4.0,
    reviewCount: 67,
    isOpen: true,
    openHours: '06:00-22:00',
    isFavorite: false,
    lastUpdated: new Date(Date.now() - 300000),
    predictions: {
      nextHour: 8,
      next2Hours: 15,
      next4Hours: 28
    },
    amenities: ['Parkscheinautomat'],
    restrictions: ['Mo-Fr: Max. 4h', 'Sa-So: Unbegrenzt'],
    paymentMethods: ['Münzen', 'App'],
    image: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=400&h=300&fit=crop'
  },
  {
    id: 'hauptbahnhof-garage',
    name: 'Parkhaus Hauptbahnhof',
    type: 'garage',
    address: 'Willy-Brandt-Platz 1, 38102 Braunschweig',
    coordinates: { lat: 52.2521, lng: 10.5407 },
    distance: 850,
    walkingTime: 11,
    totalSpaces: 320,
    availableSpaces: 45,
    occupancyRate: 86,
    pricing: {
      hourly: 2.00,
      daily: 15.00,
      monthly: 75.00
    },
    features: ['Direkter Bahnhofszugang', 'Überdacht', 'Sicherheitsdienst'],
    rating: 4.1,
    reviewCount: 234,
    isOpen: true,
    openHours: '24/7',
    isFavorite: true,
    lastUpdated: new Date(Date.now() - 120000),
    predictions: {
      nextHour: 38,
      next2Hours: 67,
      next4Hours: 89
    },
    amenities: ['WC', 'Shops', 'Restaurants', 'E-Ladestationen'],
    restrictions: ['Max. Höhe 1.9m'],
    paymentMethods: ['Karte', 'App', 'Kontaktlos'],
    image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop'
  },
  {
    id: 'magniviertel',
    name: 'Magniviertel Straßenparkplätze',
    type: 'street',
    address: 'Magnitorwall, 38100 Braunschweig',
    coordinates: { lat: 52.2654, lng: 10.5234 },
    distance: 280,
    walkingTime: 3,
    totalSpaces: 45,
    availableSpaces: 8,
    occupancyRate: 82,
    pricing: {
      hourly: 1.20,
      daily: 8.00
    },
    maxDuration: 6,
    features: ['Altstadtnähe', 'Kostenlos So', 'Restaurants'],
    rating: 3.8,
    reviewCount: 42,
    isOpen: true,
    openHours: 'Mo-Sa 08:00-20:00',
    isFavorite: false,
    lastUpdated: new Date(Date.now() - 180000),
    predictions: {
      nextHour: 12,
      next2Hours: 18,
      next4Hours: 25
    },
    amenities: ['Parkscheinautomat'],
    restrictions: ['So: Kostenlos', 'Mo-Sa: Max. 3h'],
    paymentMethods: ['Münzen', 'App'],
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop'
  },
  {
    id: 'arkaden-parkhaus',
    name: 'Schloss-Arkaden Parkhaus',
    type: 'garage',
    address: 'Platz der Deutschen Einheit 1, 38100 Braunschweig',
    coordinates: { lat: 52.2561, lng: 10.5193 },
    distance: 620,
    walkingTime: 8,
    totalSpaces: 650,
    availableSpaces: 234,
    occupancyRate: 64,
    pricing: {
      hourly: 2.00,
      daily: 16.00,
      monthly: 85.00
    },
    features: ['Shopping-Center', 'Moderne Ausstattung', 'Restaurants'],
    rating: 4.4,
    reviewCount: 312,
    isOpen: true,
    openHours: '07:00-24:00',
    isFavorite: true,
    lastUpdated: new Date(Date.now() - 60000),
    predictions: {
      nextHour: 198,
      next2Hours: 167,
      next4Hours: 145
    },
    amenities: ['Shopping', 'Restaurants', 'WC', 'E-Ladestationen'],
    restrictions: ['3h kostenlos bei Einkauf'],
    paymentMethods: ['Karte', 'App', 'Kontaktlos'],
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop'
  },
  {
    id: 'beethovenstrasse',
    name: 'Beethovenstraße Parkplatz',
    type: 'street',
    address: 'Beethovenstraße, 38106 Braunschweig',
    coordinates: { lat: 52.2598, lng: 10.5156 },
    distance: 450,
    walkingTime: 6,
    totalSpaces: 38,
    availableSpaces: 3,
    occupancyRate: 92,
    pricing: {
      hourly: 1.00,
      daily: 6.00
    },
    maxDuration: 4,
    features: ['Günstig', 'Wohngebiet', 'Ruhig'],
    rating: 3.9,
    reviewCount: 28,
    isOpen: true,
    openHours: 'Mo-Sa 08:00-18:00',
    isFavorite: false,
    lastUpdated: new Date(Date.now() - 420000),
    predictions: {
      nextHour: 2,
      next2Hours: 5,
      next4Hours: 8
    },
    amenities: ['Parkscheinautomat'],
    restrictions: ['Mo-Fr: Max. 2h', 'Sa: Max. 4h', 'So: Kostenfrei'],
    paymentMethods: ['Münzen', 'App'],
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop'
  },
  {
    id: 'weststadt-center',
    name: 'Weststadt-Center Parkplatz',
    type: 'lot',
    address: 'Salzdahlumer Str. 196, 38126 Braunschweig',
    coordinates: { lat: 52.2445, lng: 10.4892 },
    distance: 1200,
    walkingTime: 15,
    totalSpaces: 180,
    availableSpaces: 67,
    occupancyRate: 63,
    pricing: {
      hourly: 1.00,
      daily: 8.00
    },
    features: ['Kostenlos 2h', 'Einkaufszentrum', 'Weitläufig'],
    rating: 4.2,
    reviewCount: 95,
    isOpen: true,
    openHours: '08:00-22:00',
    isFavorite: false,
    lastUpdated: new Date(Date.now() - 240000),
    predictions: {
      nextHour: 78,
      next2Hours: 89,
      next4Hours: 102
    },
    amenities: ['Shopping', 'Restaurants', 'Supermarkt'],
    restrictions: ['2h kostenlos bei Einkauf'],
    paymentMethods: ['Karte', 'App'],
    image: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=400&h=300&fit=crop'
  }
];

const DEMO_RESERVATIONS: Reservation[] = [
  {
    id: 'res-001',
    spotId: 'parkhaus-city',
    spotName: 'Parkhaus City-Galerie',
    startTime: new Date(Date.now() + 3600000), // in 1 hour
    endTime: new Date(Date.now() + 7200000), // in 2 hours
    duration: 1,
    cost: 2.50,
    status: 'upcoming',
    confirmationCode: 'PK7829',
    spaceNumber: 'E2-45'
  },
  {
    id: 'res-002',
    spotId: 'hauptbahnhof-garage',
    spotName: 'Parkhaus Hauptbahnhof',
    startTime: new Date(Date.now() - 1800000), // started 30 min ago
    endTime: new Date(Date.now() + 5400000), // ends in 1.5 hours
    duration: 2,
    cost: 4.00,
    status: 'active',
    confirmationCode: 'HB4512',
    spaceNumber: 'B1-23'
  },
  {
    id: 'res-003',
    spotId: 'arkaden-parkhaus',
    spotName: 'Schloss-Arkaden Parkhaus',
    startTime: new Date(Date.now() - 86400000 * 2), // 2 days ago
    endTime: new Date(Date.now() - 86400000 * 2 + 14400000), // completed
    duration: 4,
    cost: 8.00,
    status: 'completed',
    confirmationCode: 'SA9876',
    spaceNumber: 'A3-67'
  }
];

const DEMO_PARKING_SESSIONS: ParkingSession[] = [
  {
    id: 'session-001',
    spotId: 'hauptbahnhof-garage',
    spotName: 'Parkhaus Hauptbahnhof',
    startTime: new Date(Date.now() - 1800000), // started 30 min ago
    duration: 1.5,
    cost: 3.00,
    status: 'active',
    spaceNumber: 'B1-23',
    paymentMethod: 'App'
  },
  {
    id: 'session-002',
    spotId: 'parkhaus-city',
    spotName: 'Parkhaus City-Galerie',
    startTime: new Date(Date.now() - 86400000), // yesterday
    endTime: new Date(Date.now() - 86400000 + 10800000), // 3 hours
    duration: 3,
    cost: 7.50,
    status: 'completed',
    spaceNumber: 'D2-89',
    paymentMethod: 'Karte'
  }
];

const DEMO_TRAFFIC_EVENTS = [
  {
    id: 'event-001',
    title: 'Weihnachtsmarkt',
    location: 'Burgplatz',
    startDate: new Date(2024, 11, 15), // December 15, 2024
    endDate: new Date(2024, 11, 23),   // December 23, 2024
    impact: 'high',
    affectedParkingSpots: ['burgplatz', 'magniviertel'],
    description: 'Erhöhte Nachfrage nach Parkplätzen in der Innenstadt'
  },
  {
    id: 'event-002',
    title: 'Konzert im Staatstheater',
    location: 'Staatstheater Braunschweig',
    startDate: new Date(Date.now() + 7200000), // in 2 hours
    endDate: new Date(Date.now() + 14400000),  // in 4 hours
    impact: 'medium',
    affectedParkingSpots: ['parkhaus-city', 'schlossplatz'],
    description: 'Begrenzte Verfügbarkeit in der Innenstadt'
  },
  {
    id: 'event-003',
    title: 'Bauarbeiten Bohlweg',
    location: 'Bohlweg',
    startDate: new Date(Date.now() - 86400000 * 7), // started a week ago
    endDate: new Date(Date.now() + 86400000 * 14),  // ends in 2 weeks
    impact: 'low',
    affectedParkingSpots: ['parkhaus-city'],
    description: 'Leichte Beeinträchtigung der Zufahrt'
  }
];

const ParkingPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('Alle');
  const [sortBy, setSortBy] = useState<'distance' | 'availability' | 'price'>('distance');
  const [currentView, setCurrentView] = useState<'list' | 'map' | 'ar'>('list');
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null);
  const [showReservation, setShowReservation] = useState(false);
  const [activeSession, setActiveSession] = useState<ParkingSession | null>(null);
  const [favoritSpots, setFavoriteSpots] = useState<string[]>(['parkhaus-city', 'hauptbahnhof-garage', 'arkaden-parkhaus']);
  const [showFilters, setShowFilters] = useState(false);
  const [reservationDuration, setReservationDuration] = useState(2);
  const [isNavigating, setIsNavigating] = useState(false);

  // Use demo data directly
  const parkingSpots = DEMO_PARKING_SPOTS;
  const reservations = DEMO_RESERVATIONS;
  const parkingSessions = DEMO_PARKING_SESSIONS;
  const trafficEvents = DEMO_TRAFFIC_EVENTS;

  // Filter and sort parking spots
  const filteredAndSortedSpots = useMemo(() => {
    let filtered = parkingSpots;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(spot =>
        spot.name.toLowerCase().includes(query) ||
        spot.address.toLowerCase().includes(query) ||
        spot.features.some(feature => feature.toLowerCase().includes(query))
      );
    }

    // Type filter
    if (selectedFilter !== 'Alle') {
      const typeMap: { [key: string]: string } = {
        'Parkhäuser': 'garage',
        'Parkplätze': 'lot',
        'Straße': 'street',
        'Verfügbar': 'available'
      };
      
      if (selectedFilter === 'Verfügbar') {
        filtered = filtered.filter(spot => spot.availableSpaces > 5);
      } else {
        const mappedType = typeMap[selectedFilter];
        if (mappedType) {
          filtered = filtered.filter(spot => spot.type === mappedType);
        }
      }
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'distance':
          return a.distance - b.distance;
        case 'availability':
          return b.availableSpaces - a.availableSpaces;
        case 'price':
          return a.pricing.hourly - b.pricing.hourly;
        default:
          return 0;
      }
    });

    return filtered;
  }, [parkingSpots, searchQuery, selectedFilter, sortBy]);

  const filterOptions = ['Alle', 'Verfügbar', 'Parkhäuser', 'Parkplätze', 'Straße'];

  // Helper functions
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'garage': return '🏢';
      case 'lot': return '🅿️';
      case 'street': return '🛣️';
      case 'private': return '🔒';
      default: return '🅿️';
    }
  };

  const getOccupancyColor = (rate: number) => {
    if (rate < 50) return 'text-green-600 bg-green-100';
    if (rate < 80) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getAvailabilityText = (available: number, total: number) => {
    const rate = (available / total) * 100;
    if (rate > 20) return 'Gut verfügbar';
    if (rate > 10) return 'Begrenzt verfügbar';
    if (rate > 0) return 'Kaum verfügbar';
    return 'Belegt';
  };

  const toggleFavorite = useCallback((spotId: string) => {
    setFavoriteSpots(prev =>
      prev.includes(spotId)
        ? prev.filter(id => id !== spotId)
        : [...prev, spotId]
    );
  }, []);

  const startNavigation = useCallback((spot: ParkingSpot) => {
    setIsNavigating(true);
    setSelectedSpot(null);
    // In a real app, integrate with navigation system
    setTimeout(() => {
      alert(`Navigation zu ${spot.name} gestartet!`);
      setIsNavigating(false);
    }, 1000);
  }, []);

  const makeReservation = useCallback((spot: ParkingSpot, duration: number) => {
    const newReservation: Reservation = {
      id: `res-${Date.now()}`,
      spotId: spot.id,
      spotName: spot.name,
      startTime: new Date(Date.now() + 900000), // in 15 minutes
      endTime: new Date(Date.now() + 900000 + (duration * 3600000)),
      duration,
      cost: spot.pricing.hourly * duration,
      status: 'upcoming',
      confirmationCode: Math.random().toString(36).substr(2, 6).toUpperCase(),
      spaceNumber: `${Math.floor(Math.random() * 5) + 1}-${Math.floor(Math.random() * 50) + 1}`
    };
    
    setShowReservation(false);
    setSelectedSpot(null);
    alert(`Reservierung bestätigt! Code: ${newReservation.confirmationCode}`);
  }, []);

  // Components
  const StatusBar = () => (
    <div className="flex justify-between items-center px-4 py-3 bg-blue-600 text-white text-sm">
      <div className="flex items-center gap-2">
        <Car className="w-5 h-5" />
        <span className="font-medium">BS.Smart Parking</span>
        {isNavigating && (
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-200">Navigation</span>
          </div>
        )}
      </div>
      <div className="flex items-center gap-2">
        <span>14:32</span>
        <div className="flex items-center gap-1">
          <div className="w-1 h-3 bg-white rounded"></div>
          <div className="w-1 h-3 bg-white rounded"></div>
          <div className="w-1 h-3 bg-white rounded"></div>
          <div className="w-1 h-3 bg-white rounded"></div>
        </div>
      </div>
    </div>
  );

  const SearchAndFilters = () => (
    <div className="bg-white border-b border-gray-200 p-4">
      {/* Search Bar */}
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Parkplatz suchen..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Quick Filters */}
      <div className="flex items-center gap-2 mb-3">
        <div className="flex gap-2 overflow-x-auto flex-1">
          {filterOptions.map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-3 py-1 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${
                selectedFilter === filter
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="bg-gray-100 p-2 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <Filter className="w-5 h-5" />
        </button>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="bg-gray-50 p-3 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-gray-800">Sortieren nach:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white border border-gray-300 rounded-lg px-2 py-1 text-sm"
            >
              <option value="distance">Entfernung</option>
              <option value="availability">Verfügbarkeit</option>
              <option value="price">Preis</option>
            </select>
          </div>
        </div>
      )}

      {/* Results Summary */}
      <div className="flex justify-between items-center text-sm text-gray-600">
        <span>{filteredAndSortedSpots.length} Parkplätze gefunden</span>
        <span>
          🟢 {filteredAndSortedSpots.filter(s => s.occupancyRate < 50).length} gut verfügbar
        </span>
      </div>
    </div>
  );

  const QuickStats = () => (
    <div className="bg-white mx-4 my-3 p-4 rounded-xl shadow-sm border border-gray-100">
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {parkingSpots.reduce((sum, spot) => sum + spot.availableSpaces, 0)}
          </div>
          <div className="text-sm text-gray-600">Freie Plätze</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            €{parkingSpots.length > 0 ? Math.min(...parkingSpots.map(s => s.pricing.hourly)).toFixed(2) : '0.00'}
          </div>
          <div className="text-sm text-gray-600">Ab / Stunde</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">
            {reservations.filter(r => r.status === 'upcoming' || r.status === 'active').length}
          </div>
          <div className="text-sm text-gray-600">Aktive Buchungen</div>
        </div>
      </div>

      {/* Live Updates Banner */}
      {trafficEvents.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Bell className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">Live Updates</span>
          </div>
          <p className="text-xs text-blue-700">
            {trafficEvents[0]?.title}: {trafficEvents[0]?.description}
          </p>
        </div>
      )}
    </div>
  );

  const ParkingSpotCard = ({ spot }: { spot: ParkingSpot }) => (
    <div 
      className="bg-white mx-4 mb-3 p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer"
      onClick={() => setSelectedSpot(spot)}
    >
      <div className="flex gap-3">
        <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
          <img
            src={spot.image}
            alt={spot.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-1 left-1">
            <span className="text-lg">{getTypeIcon(spot.type)}</span>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-semibold text-gray-800 truncate">{spot.name}</h3>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(spot.id);
              }}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <Heart className={`w-4 h-4 ${favoritSpots.includes(spot.id) ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
            </button>
          </div>

          <p className="text-sm text-gray-600 mb-2 truncate">{spot.address}</p>

          <div className="flex items-center gap-3 mb-2">
            <span className="text-sm text-gray-500">📍 {spot.distance}m</span>
            <span className="text-sm text-gray-500">🚶 {spot.walkingTime} Min</span>
            <span className="text-sm font-medium text-blue-600">€{spot.pricing.hourly}/h</span>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${getOccupancyColor(spot.occupancyRate)}`}>
                {spot.availableSpaces} frei
              </div>
              <span className="text-xs text-gray-500">
                {getAvailabilityText(spot.availableSpaces, spot.totalSpaces)}
              </span>
            </div>

            {spot.rating && (
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-500 fill-current" />
                <span className="text-xs text-gray-600">{spot.rating}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const FavoriteSpots = () => {
    const favorites = parkingSpots.filter(spot => favoritSpots.includes(spot.id));
    
    if (favorites.length === 0) return null;

    return (
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-800 px-4 mb-3">⭐ Favoriten</h2>
        <div className="flex gap-3 px-4 overflow-x-auto">
          {favorites.map((spot) => (
            <div
              key={spot.id}
              className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 min-w-[200px] cursor-pointer hover:shadow-md transition-all"
              onClick={() => setSelectedSpot(spot)}
            >
              <h4 className="font-medium text-gray-800 mb-1 truncate">{spot.name}</h4>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-gray-500">{spot.distance}m</span>
                <div className={`px-2 py-1 rounded-full text-xs ${getOccupancyColor(spot.occupancyRate)}`}>
                  {spot.availableSpaces} frei
                </div>
              </div>
              <div className="text-sm font-medium text-blue-600">€{spot.pricing.hourly}/h</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const ActiveReservations = () => {
    const activeReservations = reservations.filter(r => r.status === 'upcoming' || r.status === 'active');
    const activeSessions = parkingSessions.filter(s => s.status === 'active');
    
    if (activeReservations.length === 0 && activeSessions.length === 0) return null;

    return (
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-800 px-4 mb-3">
          📅 Aktuelle Buchungen & Sessions
        </h2>
        <div className="space-y-3 px-4">
          {/* Active Sessions */}
          {activeSessions.map((session) => (
            <div key={session.id} className="bg-green-50 border border-green-200 p-4 rounded-xl">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold text-gray-800">{session.spotName}</h4>
                  <p className="text-sm text-green-700">🟢 Aktive Parkzeit</p>
                </div>
                <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
                  AKTIV
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-600">Gestartet:</span>
                  <div className="font-medium">{session.startTime.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}</div>
                </div>
                <div>
                  <span className="text-gray-600">Platz:</span>
                  <div className="font-medium">{session.spaceNumber}</div>
                </div>
                <div>
                  <span className="text-gray-600">Bisherige Kosten:</span>
                  <div className="font-medium">€{session.cost.toFixed(2)}</div>
                </div>
                <div>
                  <span className="text-gray-600">Zahlungsart:</span>
                  <div className="font-medium">{session.paymentMethod}</div>
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <button className="flex-1 bg-green-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors">
                  ⏰ Zeit verlängern
                </button>
                <button className="bg-white border border-green-200 text-green-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-50 transition-colors">
                  🚗 Beenden
                </button>
              </div>
            </div>
          ))}

          {/* Upcoming Reservations */}
          {activeReservations.map((reservation) => (
            <div key={reservation.id} className="bg-blue-50 border border-blue-200 p-4 rounded-xl">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold text-gray-800">{reservation.spotName}</h4>
                  <p className="text-sm text-blue-700">
                    {reservation.status === 'active' ? '🟢 Aktive Reservierung' : '🔵 Kommende Reservierung'}
                  </p>
                </div>
                <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium">
                  {reservation.confirmationCode}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-600">Start:</span>
                  <div className="font-medium">{reservation.startTime.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}</div>
                </div>
                <div>
                  <span className="text-gray-600">Ende:</span>
                  <div className="font-medium">{reservation.endTime.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}</div>
                </div>
                <div>
                  <span className="text-gray-600">Platz:</span>
                  <div className="font-medium">{reservation.spaceNumber || 'Wird zugewiesen'}</div>
                </div>
                <div>
                  <span className="text-gray-600">Kosten:</span>
                  <div className="font-medium">€{reservation.cost.toFixed(2)}</div>
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <button className="flex-1 bg-blue-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors">
                  🧭 Navigation
                </button>
                <button className="bg-white border border-blue-200 text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors">
                  Ändern
                </button>
                <button className="bg-white border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors">
                  Stornieren
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const ParkingSpotDetail = () => {
    if (!selectedSpot) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end z-50">
        <div className="bg-white rounded-t-2xl w-full max-h-[85vh] overflow-hidden">
          {/* Header */}
          <div className="relative">
            <img
              src={selectedSpot.image}
              alt={selectedSpot.name}
              className="w-full h-48 object-cover"
            />
            <button
              onClick={() => setSelectedSpot(null)}
              className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full"
            >
              <XCircle className="w-5 h-5" />
            </button>
            <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {getTypeIcon(selectedSpot.type)} {selectedSpot.type}
            </div>
          </div>

          {/* Content */}
          <div className="p-4 overflow-y-auto max-h-[calc(85vh-12rem)]">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{selectedSpot.name}</h2>
                <p className="text-gray-600">{selectedSpot.address}</p>
              </div>
              <button
                onClick={() => toggleFavorite(selectedSpot.id)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <Heart className={`w-6 h-6 ${favoritSpots.includes(selectedSpot.id) ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
              </button>
            </div>

            {/* Availability Status */}
            <div className="bg-gray-50 p-4 rounded-xl mb-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-800">Verfügbarkeit</h3>
                <span className="text-xs text-gray-500">
                  Aktualisiert: {selectedSpot.lastUpdated.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-2xl font-bold text-green-600">{selectedSpot.availableSpaces}</div>
                  <div className="text-sm text-gray-600">Freie Plätze</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-800">{selectedSpot.totalSpaces}</div>
                  <div className="text-sm text-gray-600">Gesamt</div>
                </div>
              </div>
              <div className="mt-3">
                <div className="flex justify-between text-sm mb-1">
                  <span>Auslastung</span>
                  <span>{selectedSpot.occupancyRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all ${
                      selectedSpot.occupancyRate < 50 ? 'bg-green-500' :
                      selectedSpot.occupancyRate < 80 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${selectedSpot.occupancyRate}%` }}
                  ></div>
                </div>
              </div>
            </div>

          {/* Predictions */}
            <div className="bg-blue-50 p-4 rounded-xl mb-4">
              <h3 className="font-semibold text-gray-800 mb-3">📊 Verfügbarkeits-Vorhersage</h3>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <div className="font-medium text-blue-600">{selectedSpot.predictions.nextHour}</div>
                  <div className="text-xs text-gray-600">in 1h</div>
                  <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                    <div 
                      className="bg-blue-500 h-1 rounded-full" 
                      style={{ width: `${(selectedSpot.predictions.nextHour / selectedSpot.totalSpaces) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="font-medium text-blue-600">{selectedSpot.predictions.next2Hours}</div>
                  <div className="text-xs text-gray-600">in 2h</div>
                  <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                    <div 
                      className="bg-blue-500 h-1 rounded-full" 
                      style={{ width: `${(selectedSpot.predictions.next2Hours / selectedSpot.totalSpaces) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="font-medium text-blue-600">{selectedSpot.predictions.next4Hours}</div>
                  <div className="text-xs text-gray-600">in 4h</div>
                  <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                    <div 
                      className="bg-blue-500 h-1 rounded-full" 
                      style={{ width: `${(selectedSpot.predictions.next4Hours / selectedSpot.totalSpaces) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              {/* Best time recommendation */}
              <div className="mt-3 p-2 bg-white rounded-lg border border-blue-200">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-gray-800">
                    Beste Zeit: {selectedSpot.predictions.next4Hours > selectedSpot.predictions.nextHour ? 'Jetzt' : 'In 4 Stunden'}
                  </span>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-white border border-gray-200 p-4 rounded-xl mb-4">
              <h3 className="font-semibold text-gray-800 mb-3">💰 Preise</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Pro Stunde</span>
                  <span className="font-semibold">€{selectedSpot.pricing.hourly.toFixed(2)}</span>
                </div>
                {selectedSpot.pricing.daily && (
                  <div className="flex justify-between">
                    <span>Tagespauschale</span>
                    <span className="font-semibold">€{selectedSpot.pricing.daily.toFixed(2)}</span>
                  </div>
                )}
                {selectedSpot.pricing.monthly && (
                  <div className="flex justify-between">
                    <span>Monatskarte</span>
                    <span className="font-semibold">€{selectedSpot.pricing.monthly.toFixed(2)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Information */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">📍 Entfernung</h4>
                <div className="text-sm text-gray-600">
                  <div>{selectedSpot.distance}m entfernt</div>
                  <div>🚶 {selectedSpot.walkingTime} Min zu Fuß</div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">🕐 Öffnungszeiten</h4>
                <div className="text-sm text-gray-600">
                  {selectedSpot.openHours || 'Nicht angegeben'}
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="mb-4">
              <h4 className="font-semibold text-gray-800 mb-2">✨ Ausstattung</h4>
              <div className="flex flex-wrap gap-2">
                {selectedSpot.features.map((feature) => (
                  <span
                    key={feature}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>

            {/* Amenities */}
            {selectedSpot.amenities.length > 0 && (
              <div className="mb-4">
                <h4 className="font-semibold text-gray-800 mb-2">🏢 Services</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedSpot.amenities.map((amenity) => (
                    <span
                      key={amenity}
                      className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Restrictions */}
            {selectedSpot.restrictions.length > 0 && (
              <div className="mb-6">
                <h4 className="font-semibold text-gray-800 mb-2">⚠️ Beschränkungen</h4>
                <div className="space-y-1">
                  {selectedSpot.restrictions.map((restriction, index) => (
                    <div key={index} className="text-sm text-orange-700 bg-orange-50 px-3 py-1 rounded">
                      {restriction}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Payment Methods */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-800 mb-2">💳 Zahlungsmethoden</h4>
              <div className="flex flex-wrap gap-2">
                {selectedSpot.paymentMethods.map((method) => (
                  <span
                    key={method}
                    className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                  >
                    {method}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="border-t border-gray-200 p-4 bg-white">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => startNavigation(selectedSpot)}
                className="bg-blue-500 text-white py-3 rounded-xl font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
              >
                <Navigation className="w-5 h-5" />
                Navigation
              </button>
              <button
                onClick={() => setShowReservation(true)}
                className="bg-green-500 text-white py-3 rounded-xl font-semibold hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                disabled={selectedSpot.availableSpaces === 0}
              >
                <Calendar className="w-5 h-5" />
                Reservieren
              </button>
            </div>
            <button
              onClick={() => alert('Parkvorgang gestartet!')}
              className="w-full bg-purple-500 text-white py-3 rounded-xl font-semibold hover:bg-purple-600 transition-colors mt-3 flex items-center justify-center gap-2"
            >
              <Car className="w-5 h-5" />
              Jetzt parken
            </button>
          </div>
        </div>
      </div>
    );
  };

  const ReservationModal = () => {
    if (!showReservation || !selectedSpot) return null;

    const totalCost = selectedSpot.pricing.hourly * reservationDuration;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl w-full max-w-md">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Reservierung</h2>
              <button
                onClick={() => setShowReservation(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-4">
              <h3 className="font-semibold text-gray-800 mb-1">{selectedSpot.name}</h3>
              <p className="text-sm text-gray-600">{selectedSpot.address}</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Parkdauer
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setReservationDuration(Math.max(1, reservationDuration - 1))}
                    className="bg-gray-100 hover:bg-gray-200 w-8 h-8 rounded-full flex items-center justify-center"
                  >
                    -
                  </button>
                  <span className="font-semibold text-lg">{reservationDuration}h</span>
                  <button
                    onClick={() => setReservationDuration(Math.min(8, reservationDuration + 1))}
                    className="bg-gray-100 hover:bg-gray-200 w-8 h-8 rounded-full flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex justify-between text-sm mb-1">
                  <span>Startzeit:</span>
                  <span className="font-medium">
                    {new Date(Date.now() + 900000).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Endzeit:</span>
                  <span className="font-medium">
                    {new Date(Date.now() + 900000 + (reservationDuration * 3600000)).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Stündlicher Preis:</span>
                  <span className="font-medium">€{selectedSpot.pricing.hourly.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-1 mt-2">
                  <div className="flex justify-between font-semibold">
                    <span>Gesamtkosten:</span>
                    <span>€{totalCost.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="text-xs text-gray-500">
                • Reservierung 15 Min vor der Zeit verfügbar
                • Kostenlose Stornierung bis 30 Min vorher
                • Platz wird automatisch zugewiesen
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowReservation(false)}
                className="flex-1 bg-gray-100 text-gray-800 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors"
              >
                Abbrechen
              </button>
              <button
                onClick={() => makeReservation(selectedSpot, reservationDuration)}
                className="flex-1 bg-green-500 text-white py-3 rounded-xl font-semibold hover:bg-green-600 transition-colors"
              >
                Reservieren
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
        
        <Link href="/navigation" className="flex flex-col items-center gap-1 p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <Navigation className="w-6 h-6 text-gray-600" />
          <span className="text-xs text-gray-600 font-medium">Navigation</span>
        </Link>
        
        <Link href="/shopping" className="flex flex-col items-center gap-1 p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ShoppingBag className="w-6 h-6 text-gray-600" />
          <span className="text-xs text-gray-600 font-medium">Shopping</span>
        </Link>
        
        <Link href="/vouchers" className="flex flex-col items-center gap-1 p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <Gift className="w-6 h-6 text-gray-600" />
          <span className="text-xs text-gray-600 font-medium">Gutscheine</span>
        </Link>
        
        <div className="flex flex-col items-center gap-1 p-2 bg-blue-100 rounded-lg">
          <Car className="w-6 h-6 text-blue-600" />
          <span className="text-xs text-blue-600 font-medium">Parking</span>
        </div>
      </div>
    </div>
  );

  const ListView = () => (
    <div className="flex-1 overflow-y-auto pb-20">
      <SearchAndFilters />
      <QuickStats />
      <FavoriteSpots />
      <ActiveReservations />
      
      <div className="px-4 mb-4">
        <h2 className="text-lg font-bold text-gray-800 mb-3">
          {searchQuery ? 'Suchergebnisse' : 'Parkplätze in der Nähe'}
        </h2>
      </div>

      {filteredAndSortedSpots.length > 0 ? (
        <div>
          {filteredAndSortedSpots.map((spot) => (
            <ParkingSpotCard key={spot.id} spot={spot} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 px-4">
          <Car className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">Keine Parkplätze gefunden</h3>
          <p className="text-gray-500">Versuchen Sie andere Suchbegriffe oder Filter</p>
        </div>
      )}
    </div>
  );

  const MapView = () => (
    <div className="flex-1 relative overflow-hidden">
      <div className="absolute inset-0 bg-gray-200">
        <img
          src="https://images.unsplash.com/photo-1486312338219-ce68e2c6c4d5?w=800&h=600&fit=crop"
          alt="Braunschweig Parking Map"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Map Markers */}
      {filteredAndSortedSpots.slice(0, 6).map((spot, index) => (
        <div
          key={spot.id}
          className={`absolute cursor-pointer transition-all hover:scale-110`}
          style={{
            left: `${15 + index * 12}%`,
            top: `${25 + index * 8}%`
          }}
          onClick={() => setSelectedSpot(spot)}
        >
          <div className={`p-2 rounded-full shadow-lg ${
            spot.availableSpaces > 10 ? 'bg-green-500' :
            spot.availableSpaces > 0 ? 'bg-yellow-500' : 'bg-red-500'
          } text-white font-bold text-sm`}>
            {spot.availableSpaces}
          </div>
          <div className="bg-white px-2 py-1 rounded shadow-md text-xs font-medium mt-1 min-w-max">
            {spot.name}
          </div>
        </div>
      ))}

      {/* Map Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <button className="bg-white p-2 rounded-lg shadow-md">
          <Target className="w-5 h-5" />
        </button>
        <button className="bg-white p-2 rounded-lg shadow-md">
          <Compass className="w-5 h-5" />
        </button>
      </div>

      <button
        onClick={() => setCurrentView('list')}
        className="absolute top-4 left-4 bg-white p-2 rounded-lg shadow-md"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>
    </div>
  );

  const ARView = () => (
    <div className="flex-1 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-400 via-sky-300 to-green-300">
        <img
          src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&h=600&fit=crop"
          alt="Braunschweig AR Parking View"
          className="w-full h-full object-cover opacity-80"
        />
      </div>

      {/* AR Overlays */}
      <div className="absolute inset-0">
        {/* AR Parking Markers */}
        {filteredAndSortedSpots.slice(0, 3).map((spot, index) => (
          <div
            key={spot.id}
            className="absolute bg-blue-500 text-white p-3 rounded-lg shadow-lg cursor-pointer hover:bg-blue-600 transition-colors"
            style={{
              left: `${30 + index * 20}%`,
              top: `${40 + index * 15}%`
            }}
            onClick={() => setSelectedSpot(spot)}
          >
            <div className="text-sm font-medium">{spot.name}</div>
            <div className="text-xs opacity-90">{spot.distance}m</div>
            <div className="text-xs">
              {spot.availableSpaces} Plätze frei
            </div>
          </div>
        ))}

        {/* AR Instructions */}
        <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-sm text-white p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold mb-1">AR-Parkplatzfinder</h3>
              <p className="text-sm opacity-90">Bewegen Sie Ihr Gerät, um Parkplätze zu finden</p>
            </div>
            <button
              onClick={() => setCurrentView('list')}
              className="bg-white text-black px-3 py-1 rounded-lg text-sm"
            >
              Beenden
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Main render
  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      <StatusBar />
      
      {currentView === 'list' && <ListView />}
      {currentView === 'map' && <MapView />}
      {currentView === 'ar' && <ARView />}
      
      <BottomNavigation />
      
      {selectedSpot && <ParkingSpotDetail />}
      {showReservation && <ReservationModal />}
    </div>
  );
};

export default ParkingPage;