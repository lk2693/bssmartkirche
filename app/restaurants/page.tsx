// pages/restaurants/index.tsx
'use client';
import { useState, useEffect, useMemo, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowLeft, Coffee, Star, Clock, MapPin, User, 
  Phone, MessageCircle, Heart, Share2, Filter,
  Search, Calendar, ChevronDown, ChevronUp, Check,
  X, Home, Navigation, ShoppingBag, Gift, Users,
  Utensils, Wine, Car, Wifi, CreditCard, Volume2,
  Info, Award, TrendingUp, Zap, Target, Crown,
  Eye, ThumbsUp, Camera, BookOpen, Bell, Settings, Percent
} from 'lucide-react';

// Types
interface Restaurant {
  id: string;
  name: string;
  description: string;
  cuisine: string;
  priceRange: '€' | '€€' | '€€€' | '€€€€';
  rating: number;
  reviewCount: number;
  distance: number;
  address: string;
  phone: string;
  email: string;
  website: string;
  images: {
    cover: string;
    gallery: string[];
  };
  features: string[];
  specialties: string[];
  atmosphere: string[];
  openingHours: {
    [key: string]: { open: string; close: string; closed?: boolean };
  };
  currentStatus: 'open' | 'closing_soon' | 'closed';
  nextSlot: string;
  availableTables: number;
  averageWaitTime: number;
  coordinates: {
    lat: number;
    lng: number;
  };
  menu: {
    highlights: MenuItem[];
    categories: string[];
  };
  offers: RestaurantOffer[];
  reservationPolicy: string[];
  reviews: Review[];
}

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  isSignature: boolean;
  allergies: string[];
}

interface RestaurantOffer {
  id: string;
  title: string;
  description: string;
  validUntil: string;
  conditions: string;
}

interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

interface Reservation {
  id: string;
  restaurantId: string;
  date: string;
  time: string;
  guests: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  specialRequests?: string;
  contactInfo: {
    name: string;
    phone: string;
    email: string;
  };
}

interface FilterOptions {
  cuisine: string;
  priceRange: string;
  rating: number;
  distance: number;
  openNow: boolean;
  hasAvailability: boolean;
  features: string[];
}

const RestaurantsPage: React.FC = () => {
  // State hooks INSIDE the component
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<FilterOptions>({
    cuisine: 'Alle',
    priceRange: 'Alle',
    rating: 0,
    distance: 1000,
    openNow: false,
    hasAvailability: false,
    features: []
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [favoriteRestaurants, setFavoriteRestaurants] = useState<string[]>(['ratskeller', 'sakura']);
  const [reservationData, setReservationData] = useState({
    date: new Date().toISOString().split('T')[0],
    time: '19:00',
    guests: 2,
    specialRequests: '',
    contactInfo: {
      name: 'Max Mustermann',
      phone: '+49 531 123456',
      email: 'max.mustermann@email.de'
    }
  });
  const [currentReservations, setCurrentReservations] = useState<Reservation[]>([]);

  // Realistic restaurant data for Braunschweig
  const restaurants: Restaurant[] = useMemo(() => [
    {
      id: 'ratskeller',
      name: 'Ratskeller Braunschweig',
      description: 'Traditionelle deutsche Küche in historischem Ambiente. Seit 1896 verwöhnen wir unsere Gäste mit regionalen Spezialitäten.',
      cuisine: 'Deutsch',
      priceRange: '€€€',
      rating: 4.6,
      reviewCount: 387,
      distance: 100,
      address: 'Altstadtmarkt 7, 38100 Braunschweig',
      phone: '+49 531 56789',
      email: 'info@ratskeller-bs.de',
      website: 'www.ratskeller-braunschweig.de',
      images: {
        cover: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=400&fit=crop',
        gallery: [
          'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=300&fit=crop'
        ]
      },
      features: ['Historisches Ambiente', 'Deutsche Küche', 'Biergarten', 'Gruppen', 'Parkplätze'],
      specialties: ['Braunschweiger Mumme', 'Wildschwein', 'Hausgemachte Würste', 'Saisonale Gerichte'],
      atmosphere: ['Gemütlich', 'Traditionell', 'Familienfreundlich'],
      openingHours: {
        'Mo': { open: '11:30', close: '23:00' },
        'Di': { open: '11:30', close: '23:00' },
        'Mi': { open: '11:30', close: '23:00' },
        'Do': { open: '11:30', close: '23:00' },
        'Fr': { open: '11:30', close: '24:00' },
        'Sa': { open: '11:30', close: '24:00' },
        'So': { open: '11:30', close: '22:00' }
      },
      currentStatus: 'open',
      nextSlot: '19:30',
      availableTables: 8,
      averageWaitTime: 15,
      coordinates: { lat: 52.2625, lng: 10.5211 },
      menu: {
        highlights: [
          {
            id: 'm1',
            name: 'Braunschweiger Mumme-Braten',
            description: 'Schweineschulter in Mumme-Marinade mit Rotkohl und Klößen',
            price: 18.90,
            category: 'Hauptgerichte',
            isSignature: true,
            allergies: ['Gluten']
          },
          {
            id: 'm2',
            name: 'Wildschwein mit Preiselbeeren',
            description: 'Regional geschossenes Wildschwein mit hausgemachten Spätzle',
            price: 24.50,
            category: 'Hauptgerichte',
            isSignature: true,
            allergies: ['Gluten']
          }
        ],
        categories: ['Vorspeisen', 'Hauptgerichte', 'Desserts', 'Getränke']
      },
      offers: [
        {
          id: 'o1',
          title: 'Happy Hour',
          description: '20% auf alle Getränke von 17-19 Uhr',
          validUntil: '2025-12-31',
          conditions: 'Nicht kombinierbar'
        }
      ],
      reservationPolicy: [
        'Reservierungen bis zu 4 Wochen im Voraus',
        'Stornierung bis 24h vorher kostenfrei',
        'Bei Verspätung über 15 Min kann Tisch weitergegeben werden',
        'Gruppen ab 8 Personen: Menüvorauswahl erforderlich'
      ],
      reviews: [
        {
          id: 'r1',
          userName: 'Familie Schmidt',
          rating: 5,
          comment: 'Hervorragende deutsche Küche! Das Ambiente ist einzigartig und der Service sehr freundlich.',
          date: '2025-06-18',
          verified: true
        }
      ]
    },
    {
      id: 'sakura',
      name: 'Sakura Sushi & Ramen',
      description: 'Authentische japanische Küche mit frischem Sushi und hausgemachten Ramen. Täglich frische Zutaten direkt importiert.',
      cuisine: 'Japanisch',
      priceRange: '€€€',
      rating: 4.8,
      reviewCount: 234,
      distance: 220,
      address: 'Steinweg 18, 38100 Braunschweig',
      phone: '+49 531 789123',
      email: 'info@sakura-bs.de',
      website: 'www.sakura-braunschweig.de',
      images: {
        cover: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&h=400&fit=crop',
        gallery: [
          'https://images.unsplash.com/photo-1553621042-f6e147245754?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=400&h=300&fit=crop'
        ]
      },
      features: ['Sushi Bar', 'Ramen', 'Sake Selection', 'Modern', 'Vegetarisch'],
      specialties: ['Chirashi Bowl', 'Tonkotsu Ramen', 'Omakase', 'Mochi Eis'],
      atmosphere: ['Modern', 'Stilvoll', 'Ruhig'],
      openingHours: {
        'Mo': { open: '', close: '', closed: true },
        'Di': { open: '17:00', close: '22:30' },
        'Mi': { open: '17:00', close: '22:30' },
        'Do': { open: '17:00', close: '22:30' },
        'Fr': { open: '17:00', close: '23:00' },
        'Sa': { open: '17:00', close: '23:00' },
        'So': { open: '17:00', close: '22:00' }
      },
      currentStatus: 'open',
      nextSlot: '20:00',
      availableTables: 3,
      averageWaitTime: 25,
      coordinates: { lat: 52.2618, lng: 10.5208 },
      menu: {
        highlights: [
          {
            id: 'm3',
            name: 'Omakase Premium',
            description: 'Chef\'s Choice - 12 Gänge Sushi Degustation',
            price: 89.00,
            category: 'Sushi',
            isSignature: true,
            allergies: ['Fisch', 'Sesam']
          },
          {
            id: 'm4',
            name: 'Tonkotsu Ramen',
            description: 'Traditionelle Schweineknochen-Brühe mit Chashu und Ajitsuke-Ei',
            price: 16.50,
            category: 'Ramen',
            isSignature: true,
            allergies: ['Gluten', 'Ei']
          }
        ],
        categories: ['Sushi', 'Ramen', 'Vorspeisen', 'Desserts', 'Getränke']
      },
      offers: [
        {
          id: 'o2',
          title: 'Ramen Tuesday',
          description: 'Alle Ramen-Varianten für 12€',
          validUntil: '2025-12-31',
          conditions: 'Nur dienstags'
        }
      ],
      reservationPolicy: [
        'Reservierungen empfohlen',
        'Omakase: 24h Vorlauf erforderlich',
        'Sushi Bar: keine Reservierung möglich',
        'Allergien bitte bei Reservierung angeben'
      ],
      reviews: [
        {
          id: 'r2',
          userName: 'Sushi Lover',
          rating: 5,
          comment: 'Bestes Sushi in Braunschweig! Sehr authentisch und frisch.',
          date: '2025-06-15',
          verified: true
        }
      ]
    },
    {
      id: 'la-cantina',
      name: 'La Cantina Italiana',
      description: 'Familiäre italienische Trattoria mit hausgemachter Pasta und Steinofen-Pizza. Echte italienische Tradition seit 1987.',
      cuisine: 'Italienisch',
      priceRange: '€€',
      rating: 4.4,
      reviewCount: 456,
      distance: 150,
      address: 'Wendenstraße 13, 38100 Braunschweig',
      phone: '+49 531 234567',
      email: 'info@lacantina-bs.de',
      website: 'www.lacantina-braunschweig.de',
      images: {
        cover: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=400&fit=crop',
        gallery: [
          'https://images.unsplash.com/photo-1544148103-0773bf10d330?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=400&h=300&fit=crop'
        ]
      },
      features: ['Steinofen-Pizza', 'Hausgemachte Pasta', 'Terrasse', 'Familienfreundlich', 'Italienische Weine'],
      specialties: ['Pizza Margherita', 'Pasta alla Nonna', 'Tiramisu', 'Italienische Weine'],
      atmosphere: ['Familiär', 'Gemütlich', 'Italienisch'],
      openingHours: {
        'Mo': { open: '', close: '', closed: true },
        'Di': { open: '17:30', close: '22:30' },
        'Mi': { open: '17:30', close: '22:30' },
        'Do': { open: '17:30', close: '22:30' },
        'Fr': { open: '17:30', close: '23:00' },
        'Sa': { open: '17:30', close: '23:00' },
        'So': { open: '17:30', close: '22:00' }
      },
      currentStatus: 'open',
      nextSlot: '18:45',
      availableTables: 12,
      averageWaitTime: 10,
      coordinates: { lat: 52.2640, lng: 10.5225 },
      menu: {
        highlights: [
          {
            id: 'm5',
            name: 'Pizza Quattro Stagioni',
            description: 'Klassische italienische Pizza mit Artischocken, Pilzen, Schinken und Oliven',
            price: 14.90,
            category: 'Pizza',
            isSignature: true,
            allergies: ['Gluten']
          },
          {
            id: 'm6',
            name: 'Osso Buco alla Milanese',
            description: 'Geschmorte Kalbshaxe mit Risotto und Gremolata',
            price: 28.50,
            category: 'Hauptgerichte',
            isSignature: true,
            allergies: []
          }
        ],
        categories: ['Antipasti', 'Pizza', 'Pasta', 'Hauptgerichte', 'Desserts']
      },
      offers: [
        {
          id: 'o3',
          title: 'Pizza & Pasta Deal',
          description: 'Vorspeise + Hauptgang für 19.90€',
          validUntil: '2025-06-30',
          conditions: 'Bis 19:00 Uhr'
        }
      ],
      reservationPolicy: [
        'Terrasse: nur bei gutem Wetter',
        'Gruppen ab 6 Personen: Voranmeldung erbeten',
        'Kinderstühle verfügbar',
        'Hunde auf der Terrasse willkommen'
      ],
      reviews: [
        {
          id: 'r3',
          userName: 'Pizza Fan',
          rating: 4,
          comment: 'Sehr gute Pizza aus dem Steinofen. Freundlicher Service und faire Preise.',
          date: '2025-06-12',
          verified: true
        }
      ]
    },
    {
      id: 'burger-house',
      name: 'Burger House Brunswick',
      description: 'Premium Burger-Restaurant mit regionalen Zutaten. Hausgemachte Patties und kreative Burger-Kreationen.',
      cuisine: 'American',
      priceRange: '€€',
      rating: 4.3,
      reviewCount: 289,
      distance: 320,
      address: 'Hamburger Str. 45, 38114 Braunschweig',
      phone: '+49 531 345678',
      email: 'info@burgerhouse-bs.de',
      website: 'www.burgerhouse-brunswick.de',
      images: {
        cover: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=400&fit=crop',
        gallery: [
          'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=400&h=300&fit=crop'
        ]
      },
      features: ['Craft Beer', 'Hausgemachte Patties', 'Vegetarisch', 'Vegan', 'Modern'],
      specialties: ['Brunswick Classic', 'Pulled Pork Burger', 'Sweet Potato Fries', 'Craft Beer'],
      atmosphere: ['Modern', 'Lässig', 'Trendig'],
      openingHours: {
        'Mo': { open: '17:00', close: '23:00' },
        'Di': { open: '17:00', close: '23:00' },
        'Mi': { open: '17:00', close: '23:00' },
        'Do': { open: '17:00', close: '23:00' },
        'Fr': { open: '17:00', close: '24:00' },
        'Sa': { open: '12:00', close: '24:00' },
        'So': { open: '12:00', close: '22:00' }
      },
      currentStatus: 'open',
      nextSlot: '18:15',
      availableTables: 15,
      averageWaitTime: 8,
      coordinates: { lat: 52.2580, lng: 10.5180 },
      menu: {
        highlights: [
          {
            id: 'm7',
            name: 'Brunswick Classic',
            description: 'Angus Beef Patty mit Bacon, Cheddar und hausgemachter BBQ-Sauce',
            price: 15.90,
            category: 'Burger',
            isSignature: true,
            allergies: ['Gluten']
          },
          {
            id: 'm8',
            name: 'Vegan Beyond Burger',
            description: 'Plant-based Patty mit Avocado und veganem Käse',
            price: 14.50,
            category: 'Burger',
            isSignature: false,
            allergies: ['Gluten', 'Soja']
          }
        ],
        categories: ['Burger', 'Sides', 'Salate', 'Desserts', 'Getränke']
      },
      offers: [
        {
          id: 'o4',
          title: 'Student Deal',
          description: 'Burger + Fries + Drink für 12.90€',
          validUntil: '2025-12-31',
          conditions: 'Mit gültigem Studentenausweis'
        }
      ],
      reservationPolicy: [
        'Reservierungen ab 4 Personen',
        'Walk-ins willkommen',
        'Happy Hour: 17-19 Uhr',
        'Kindergerichte verfügbar'
      ],
      reviews: [
        {
          id: 'r4',
          userName: 'Burger Lover',
          rating: 4,
          comment: 'Sehr gute Burger mit frischen Zutaten. Die Sweet Potato Fries sind ein Traum!',
          date: '2025-06-10',
          verified: true
        }
      ]
    },
    {
      id: 'feldschloesschen',
      name: 'Restaurant Feldschlösschen',
      description: 'Traditionelle Hausbrauerei mit regionaler Küche. Seit 1890 brauen wir unser eigenes Bier nach historischen Rezepten.',
      cuisine: 'Deutsch',
      priceRange: '€€',
      rating: 4.5,
      reviewCount: 198,
      distance: 450,
      address: 'Hamburger Str. 267, 38114 Braunschweig',
      phone: '+49 531 456789',
      email: 'info@feldschloesschen-bs.de',
      website: 'www.feldschloesschen-braunschweig.de',
      images: {
        cover: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=400&fit=crop',
        gallery: [
          'https://images.unsplash.com/photo-1571043733612-5d2a8c7e7e1b?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1549144511-f099e773c147?w=400&h=300&fit=crop'
        ]
      },
      features: ['Hausbrauerei', 'Biergarten', 'Regionale Küche', 'Gruppen', 'Parkplätze'],
      specialties: ['Hausgebrautes Bier', 'Schweinebraten', 'Himmel & Erde', 'Brauerei-Tour'],
      atmosphere: ['Rustikal', 'Gemütlich', 'Traditionell'],
      openingHours: {
        'Mo': { open: '16:00', close: '23:00' },
        'Di': { open: '16:00', close: '23:00' },
        'Mi': { open: '16:00', close: '23:00' },
        'Do': { open: '16:00', close: '23:00' },
        'Fr': { open: '16:00', close: '24:00' },
        'Sa': { open: '11:00', close: '24:00' },
        'So': { open: '11:00', close: '22:00' }
      },
      currentStatus: 'open',
      nextSlot: '19:00',
      availableTables: 6,
      averageWaitTime: 20,
      coordinates: { lat: 52.2590, lng: 10.5160 },
      menu: {
        highlights: [
          {
            id: 'm9',
            name: 'Braumeister-Teller',
            description: 'Schweinebraten mit Sauerkraut, Klößen und hausgebrautem Bier',
            price: 16.80,
            category: 'Hauptgerichte',
            isSignature: true,
            allergies: ['Gluten']
          },
          {
            id: 'm10',
            name: 'Bier-Verkostung',
            description: '4 hausgebraute Biersorten mit Erklärung',
            price: 12.50,
            category: 'Getränke',
            isSignature: true,
            allergies: ['Gluten']
          }
        ],
        categories: ['Vorspeisen', 'Hauptgerichte', 'Desserts', 'Hausgebraute Biere']
      },
      offers: [
        {
          id: 'o5',
          title: 'Brauerei-Tour',
          description: 'Führung + Verkostung + 3-Gang-Menü für 35€',
          validUntil: '2025-09-30',
          conditions: 'Samstags um 15:00 Uhr, Anmeldung erforderlich'
        }
      ],
      reservationPolicy: [
        'Brauerei-Touren: Voranmeldung erforderlich',
        'Biergarten: nur bei gutem Wetter',
        'Gruppen ab 10 Personen: Menüvorauswahl',
        'Kostenlose Parkplätze'
      ],
      reviews: [
        {
          id: 'r5',
          userName: 'Bier-Kenner',
          rating: 5,
          comment: 'Tolles hausgebrautes Bier und authentische Atmosphäre. Die Brauerei-Tour ist sehr zu empfehlen!',
          date: '2025-06-08',
          verified: true
        }
      ]
    }
  ], []);

  const toggleFavorite = useCallback((restaurantId: string) => {
    setFavoriteRestaurants(prev =>
      prev.includes(restaurantId)
        ? prev.filter(id => id !== restaurantId)
        : [...prev, restaurantId]
    );
  }, []);

  // Helper functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'text-green-600';
      case 'closing_soon': return 'text-orange-600';
      case 'closed': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusText = (restaurant: Restaurant) => {
    switch (restaurant.currentStatus) {
      case 'open': return `Geöffnet bis ${getCurrentDayHours(restaurant)?.close || '24:00'}`;
      case 'closing_soon': return 'Schließt bald';
      case 'closed': return 'Geschlossen';
      default: return 'Status unbekannt';
    }
  };

  const getCurrentDayHours = (restaurant: Restaurant) => {
    const days = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
    const today = days[new Date().getDay()];
    return restaurant.openingHours[today];
  };

  const getPriceRangeText = (priceRange: string) => {
    switch (priceRange) {
      case '€': return 'Günstig (bis 15€)';
      case '€€': return 'Mittel (15-25€)';
      case '€€€': return 'Gehoben (25-40€)';
      case '€€€€': return 'Luxus (über 40€)';
      default: return priceRange;
    }
  };

  // Components
  
  // (Removed duplicate SearchAndFilter component declaration)

  // ReservationModal is already defined above. (Removed duplicate declaration)

  /* Duplicate RestaurantDetailModal removed to fix redeclaration error. */



  // Filter and search logic
  const filteredRestaurants = useMemo(() => {
    let filtered = restaurants;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(restaurant =>
        restaurant.name.toLowerCase().includes(query) ||
        restaurant.cuisine.toLowerCase().includes(query) ||
        restaurant.description.toLowerCase().includes(query) ||
        restaurant.specialties.some(specialty => specialty.toLowerCase().includes(query))
      );
    }

    // Cuisine filter
    if (selectedFilters.cuisine !== 'Alle') {
      filtered = filtered.filter(r => r.cuisine === selectedFilters.cuisine);
    }

    // Price range filter
    if (selectedFilters.priceRange !== 'Alle') {
      filtered = filtered.filter(r => r.priceRange === selectedFilters.priceRange);
    }

    // Rating filter
    if (selectedFilters.rating > 0) {
      filtered = filtered.filter(r => r.rating >= selectedFilters.rating);
    }

    // Distance filter
    filtered = filtered.filter(r => r.distance <= selectedFilters.distance);

    // Open now filter
    if (selectedFilters.openNow) {
      filtered = filtered.filter(r => r.currentStatus === 'open');
    }

    // Has availability filter
    if (selectedFilters.hasAvailability) {
      filtered = filtered.filter(r => r.availableTables > 0);
    }

    // Features filter
    if (selectedFilters.features.length > 0) {
      filtered = filtered.filter(r =>
        selectedFilters.features.every(feature => r.features.includes(feature))
      );
    }

    // Sort by rating (default)
    filtered.sort((a, b) => b.rating - a.rating);

    return filtered;
  }, [restaurants, searchQuery, selectedFilters]);

  // Get unique cuisines
  const cuisines = useMemo(() => {
    const cuisineSet = new Set(['Alle', ...restaurants.map(r => r.cuisine)]);
    return Array.from(cuisineSet);
  }, [restaurants]);

  // Get unique features
  const allFeatures = useMemo(() => {
    const featureSet = new Set(restaurants.flatMap(r => r.features));
    return Array.from(featureSet);
  }, [restaurants]);

  // Reservation management
  const makeReservation = useCallback(() => {
    if (!selectedRestaurant) return;

    const newReservation: Reservation = {
      id: `res_${Date.now()}`,
      restaurantId: selectedRestaurant.id,
      date: reservationData.date,
      time: reservationData.time,
      guests: reservationData.guests,
      status: 'pending',
      specialRequests: reservationData.specialRequests,
      contactInfo: reservationData.contactInfo
    };

    setCurrentReservations(prev => [...prev, newReservation]);
    setShowReservationModal(false);
    setSelectedRestaurant(null);

    // Simulate confirmation after 2 seconds
    setTimeout(() => {
      setCurrentReservations(prev =>
        prev.map(res =>
          res.id === newReservation.id
            ? { ...res, status: 'confirmed' }
            : res
        )
      );
    }, 2000);
  }, [selectedRestaurant, reservationData]);

  // Components
  const StatusBar: React.FC = () => (
    <div className="flex justify-between items-center px-4 py-3 bg-gray-900 text-white text-sm">
      <span className="font-medium">BS.Smart Restaurants</span>
      <div className="flex items-center gap-2">
        <span>19:15</span>
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
          placeholder="Restaurant, Küche oder Gericht suchen..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
        />
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-md transition-colors"
        >
          <Filter className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Quick filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {cuisines.map((cuisine) => (
          <button
            key={cuisine}
            onClick={() => setSelectedFilters(prev => ({ ...prev, cuisine }))}
            className={`px-3 py-1 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${
              selectedFilters.cuisine === cuisine
                ? 'bg-red-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {cuisine}
          </button>
        ))}
      </div>

      {/* Extended filters */}
      {showFilters && (
        <div className="mt-4 p-4 bg-gray-50 rounded-xl space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Preisklasse</label>
            <div className="flex gap-2">
              {['Alle', '€', '€€', '€€€', '€€€€'].map((price) => (
                <button
                  key={price}
                  onClick={() => setSelectedFilters(prev => ({ ...prev, priceRange: price }))}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedFilters.priceRange === price
                      ? 'bg-red-500 text-white'
                      : 'bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {price}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mindestbewertung: {selectedFilters.rating === 0 ? 'Alle' : `${selectedFilters.rating}+ Sterne`}
            </label>
            <input
              type="range"
              min="0"
              max="5"
              step="0.5"
              value={selectedFilters.rating}
              onChange={(e) => setSelectedFilters(prev => ({ ...prev, rating: parseFloat(e.target.value) }))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Entfernung: bis {selectedFilters.distance}m
            </label>
            <input
              type="range"
              min="100"
              max="1000"
              step="50"
              value={selectedFilters.distance}
              onChange={(e) => setSelectedFilters(prev => ({ ...prev, distance: parseInt(e.target.value) }))}
              className="w-full"
            />
          </div>

          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedFilters.openNow}
                onChange={(e) => setSelectedFilters(prev => ({ ...prev, openNow: e.target.checked }))}
                className="text-red-500"
              />
              <span className="text-sm">Jetzt geöffnet</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedFilters.hasAvailability}
                onChange={(e) => setSelectedFilters(prev => ({ ...prev, hasAvailability: e.target.checked }))}
                className="text-red-500"
              />
              <span className="text-sm">Verfügbare Tische</span>
            </label>
          </div>
        </div>
      )}
    </div>
  );

  const RestaurantCard: React.FC<{ restaurant: Restaurant }> = ({ restaurant }) => {
    const isFavorite = favoriteRestaurants.includes(restaurant.id);
    const todayHours = getCurrentDayHours(restaurant);

    return (
      <div 
        className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer"
        onClick={() => setSelectedRestaurant(restaurant)}
      >
        {/* Header Image */}
        <div className="relative h-48">
          <Image
            src={restaurant.images.cover}
            alt={restaurant.name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          
          {/* Status badge */}
          <div className="absolute top-3 left-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              restaurant.currentStatus === 'open' ? 'bg-green-500 text-white' :
              restaurant.currentStatus === 'closing_soon' ? 'bg-orange-500 text-white' :
              'bg-red-500 text-white'
            }`}>
              {getStatusText(restaurant)}
            </span>
          </div>

          {/* Favorite and Share */}
          <div className="absolute top-3 right-3 flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(restaurant.id);
              }}
              className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'text-red-500 fill-current' : 'text-gray-600'}`} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                // Share functionality
              }}
              className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
            >
              <Share2 className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          {/* Restaurant info overlay */}
          <div className="absolute bottom-3 left-3 text-white">
            <h3 className="text-xl font-bold mb-1">{restaurant.name}</h3>
            <div className="flex items-center gap-2 text-sm">
              <span>{restaurant.cuisine}</span>
              <span>•</span>
              <span>{restaurant.priceRange}</span>
              <span>•</span>
              <span>{restaurant.distance}m</span>
            </div>
          </div>

          {/* Availability badge */}
          {restaurant.availableTables > 0 && restaurant.currentStatus === 'open' && (
            <div className="absolute bottom-3 right-3">
              <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                {restaurant.availableTables} Tische frei
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Rating and reviews */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="font-semibold">{restaurant.rating}</span>
                <span className="text-gray-500 text-sm">({restaurant.reviewCount})</span>
              </div>
              <span className="text-gray-300">•</span>
              <span className="text-sm text-gray-600">{getPriceRangeText(restaurant.priceRange)}</span>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-gray-800">
                Nächster Tisch: {restaurant.nextSlot}
              </div>
              <div className="text-xs text-gray-500">
                ⏱ ~{restaurant.averageWaitTime} Min Wartezeit
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{restaurant.description}</p>

          {/* Features */}
          <div className="flex flex-wrap gap-1 mb-3">
            {restaurant.features.slice(0, 3).map((feature, index) => (
              <span key={index} className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                {feature}
              </span>
            ))}
            {restaurant.features.length > 3 && (
              <span className="text-gray-500 text-xs px-2 py-1">
                +{restaurant.features.length - 3} weitere
              </span>
            )}
          </div>

          {/* Special offers */}
          {restaurant.offers.length > 0 && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-2 mb-3">
              <div className="flex items-center gap-1 mb-1">
                <Percent className="w-3 h-3 text-orange-600" />
                <span className="text-xs font-medium text-orange-600">Aktuelles Angebot</span>
              </div>
              <p className="text-xs text-orange-700">{restaurant.offers[0].title}</p>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedRestaurant(restaurant);
                setShowReservationModal(true);
              }}
              className="flex-1 bg-red-500 text-white py-2 rounded-lg font-medium hover:bg-red-600 transition-colors"
            >
              Tisch reservieren
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                window.open(`tel:${restaurant.phone}`, '_self');
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Phone className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                // Navigation functionality
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <MapPin className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const ReservationModal: React.FC = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end">
      <div className="bg-white rounded-t-2xl w-full max-h-[75vh] overflow-y-auto">
        <div className="p-3">
          {/* Header - viel kompakter */}
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-gray-800">Tisch reservieren</h2>
            <button
              onClick={() => setShowReservationModal(false)}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {selectedRestaurant && (
            <>
              {/* Restaurant info - sehr kompakt */}
              <div className="bg-gray-50 rounded-lg p-2 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 relative rounded-md overflow-hidden flex-shrink-0">
                    <Image
                      src={selectedRestaurant.images.cover}
                      alt={selectedRestaurant.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800 text-xs truncate">{selectedRestaurant.name}</h3>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Star className="w-2.5 h-2.5 text-yellow-500 fill-current" />
                      <span>{selectedRestaurant.rating}</span>
                      <span>•</span>
                      <span>{selectedRestaurant.distance}m</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reservierungsformular - sehr kompakt */}
              <div className="space-y-2">
                {/* Datum und Zeit in einer Zeile */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Datum</label>
                    <input
                      type="date"
                      value={reservationData.date}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setReservationData(prev => ({ ...prev, date: e.target.value }))}
                      className="w-full p-1.5 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Uhrzeit</label>
                    <select
                      value={reservationData.time}
                      onChange={(e) => setReservationData(prev => ({ ...prev, time: e.target.value }))}
                      className="w-full p-1.5 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
                    >
                      {['17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30'].map(time => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Personen - kompakter */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Personen</label>
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => setReservationData(prev => ({ ...prev, guests: Math.max(1, prev.guests - 1) }))}
                      className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors text-sm"
                    >
                      −
                    </button>
                    <span className="text-base font-bold text-gray-800 min-w-[1.5rem] text-center">
                      {reservationData.guests}
                    </span>
                    <button
                      onClick={() => setReservationData(prev => ({ ...prev, guests: Math.min(12, prev.guests + 1) }))}
                      className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors text-sm"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Besondere Wünsche - kompakter */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Wünsche (optional)</label>
                  <textarea
                    value={reservationData.specialRequests}
                    onChange={(e) => setReservationData(prev => ({ ...prev, specialRequests: e.target.value }))}
                    placeholder="Allergien, Hochstuhl..."
                    rows={1}
                    className="w-full p-1.5 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>

                {/* Kontaktdaten - kompakter */}
                <div className="space-y-1">
                  <h4 className="text-xs font-medium text-gray-800">Kontakt</h4>
                  <input
                    type="text"
                    placeholder="Name"
                    value={reservationData.contactInfo.name}
                    onChange={(e) => setReservationData(prev => ({
                      ...prev,
                      contactInfo: { ...prev.contactInfo, name: e.target.value }
                    }))}
                    className="w-full p-1.5 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                  <div className="grid grid-cols-2 gap-1">
                    <input
                      type="tel"
                      placeholder="Telefon"
                      value={reservationData.contactInfo.phone}
                      onChange={(e) => setReservationData(prev => ({
                        ...prev,
                        contactInfo: { ...prev.contactInfo, phone: e.target.value }
                      }))}
                      className="w-full p-1.5 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
                    />
                    <input
                      type="email"
                      placeholder="E-Mail"
                      value={reservationData.contactInfo.email}
                      onChange={(e) => setReservationData(prev => ({
                        ...prev,
                        contactInfo: { ...prev.contactInfo, email: e.target.value }
                      }))}
                      className="w-full p-1.5 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
                    />
                  </div>
                </div>

                {/* Hinweise - sehr kompakt */}
                <div className="bg-blue-50 border border-blue-200 rounded-md p-2">
                  <p className="text-xs text-blue-700">
                    <strong>Wichtig:</strong> Stornierung bis 24h vorher kostenfrei. 
                    Bei Verspätung über 15 Min kann Tisch weitergegeben werden.
                  </p>
                </div>

                {/* Submit button - kompakter */}
                <button
                  onClick={makeReservation}
                  className="w-full bg-red-500 text-white py-2 rounded-md font-bold hover:bg-red-600 transition-colors text-sm"
                >
                  Jetzt reservieren
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );

  const RestaurantDetailModal: React.FC = () => {
    if (!selectedRestaurant) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end">
        <div className="bg-white rounded-t-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header with image gallery */}
          <div className="relative h-64">
            <Image
              src={selectedRestaurant.images.cover}
              alt={selectedRestaurant.name}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            
            <button
              onClick={() => setSelectedRestaurant(null)}
              className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="absolute bottom-4 left-4 text-white">
              <h2 className="text-3xl font-bold mb-2">{selectedRestaurant.name}</h2>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{selectedRestaurant.cuisine}</span>
                <span>•</span>
                <span className="text-lg">{selectedRestaurant.priceRange}</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span className="font-semibold">{selectedRestaurant.rating}</span>
                <span>({selectedRestaurant.reviewCount} Bewertungen)</span>
              </div>
            </div>
          </div>

          <div className="p-4 space-y-6">
            {/* Quick actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowReservationModal(true)}
                className="flex-1 bg-red-500 text-white py-3 rounded-xl font-bold hover:bg-red-600 transition-colors"
              >
                Tisch reservieren
              </button>
              <button className="px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                <Phone className="w-5 h-5" />
              </button>
              <button className="px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                <MapPin className="w-5 h-5" />
              </button>
              <button className="px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
            </div>

            {/* Description */}
            <div>
              <h3 className="font-bold text-gray-800 mb-2">Über das Restaurant</h3>
              <p className="text-gray-600">{selectedRestaurant.description}</p>
            </div>

            {/* Opening hours */}
            <div>
              <h3 className="font-bold text-gray-800 mb-3">Öffnungszeiten</h3>
              <div className="bg-gray-50 rounded-xl p-4">
                {Object.entries(selectedRestaurant.openingHours).map(([day, hours]) => (
                  <div key={day} className="flex justify-between items-center py-1">
                    <span className="font-medium text-gray-700">{day}</span>
                    <span className="text-gray-600">
                      {hours.closed ? 'Geschlossen' : `${hours.open} - ${hours.close}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Features and specialties */}
            <div>
              <h3 className="font-bold text-gray-800 mb-3">Besonderheiten</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Ausstattung</h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedRestaurant.features.map((feature, index) => (
                      <span key={index} className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Spezialitäten</h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedRestaurant.specialties.map((specialty, index) => (
                      <span key={index} className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Menu highlights */}
            <div>
              <h3 className="font-bold text-gray-800 mb-3">Menü-Highlights</h3>
              <div className="space-y-3">
                {selectedRestaurant.menu.highlights.map((item) => (
                  <div key={item.id} className="border border-gray-200 rounded-xl p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-gray-800">{item.name}</h4>
                      <div className="text-right">
                        <span className="font-bold text-red-600">{item.price.toFixed(2)}€</span>
                        {item.isSignature && (
                          <div className="text-xs text-orange-600 font-medium">Signature Dish</div>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                    {item.allergies.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {item.allergies.map((allergy, index) => (
                          <span key={index} className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs">
                            {allergy}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div>
              <h3 className="font-bold text-gray-800 mb-3">Bewertungen</h3>
              <div className="space-y-3">
                {selectedRestaurant.reviews.map((review) => (
                  <div key={review.id} className="border border-gray-200 rounded-xl p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-800">{review.userName}</span>
                        {review.verified && (
                          <Check className="w-4 h-4 text-green-500" />
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < review.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{review.comment}</p>
                    <span className="text-xs text-gray-500">{new Date(review.date).toLocaleDateString('de-DE')}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact information */}
            <div>
              <h3 className="font-bold text-gray-800 mb-3">Kontakt & Anfahrt</h3>
              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-gray-600" />
                  <div>
                    <div className="font-medium text-gray-800">{selectedRestaurant.address}</div>
                    <div className="text-sm text-gray-600">{selectedRestaurant.distance}m entfernt</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-800">{selectedRestaurant.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-800">{selectedRestaurant.email}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const StatsCard: React.FC = () => (
    <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl p-4 mb-6">
      <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
        <Utensils className="w-6 h-6" />
        Ihre Restaurant-Statistik
      </h3>
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-2xl font-bold">{currentReservations.length}</div>
          <div className="text-sm text-red-100">Reservierungen</div>
        </div>
        <div>
          <div className="text-2xl font-bold">{favoriteRestaurants.length}</div>
          <div className="text-sm text-red-100">Favoriten</div>
        </div>
        <div>
          <div className="text-2xl font-bold">4.7</div>
          <div className="text-sm text-red-100">Ø Bewertung</div>
        </div>
      </div>
    </div>
  );

  const RecommendationsCard: React.FC = () => (
    <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl p-4 mb-6">
      <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
        <Award className="w-6 h-6" />
        Empfehlung des Tages
      </h3>
      <p className="text-orange-100 text-sm mb-3">
        Basierend auf Ihren Vorlieben und aktuellen Angeboten
      </p>
      <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/30 rounded-lg flex items-center justify-center">
            <span className="text-2xl">🍜</span>
          </div>
          <div className="flex-1">
            <h4 className="font-semibold">Sakura Sushi & Ramen</h4>
            <p className="text-sm text-orange-100">Ramen Tuesday - Alle Ramen für 12€</p>
          </div>
          <button className="bg-white text-orange-600 px-3 py-1 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
            Ansehen
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Head>
        <title>Restaurants - BS.Smart Braunschweig</title>
        <meta name="description" content="Entdecken Sie die besten Restaurants in Braunschweig und reservieren Sie Ihren Tisch" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-md mx-auto bg-white shadow-2xl min-h-screen">
          <StatusBar />
          
          {/* Header */}
          <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white p-4">
            <div className="flex items-center justify-between mb-3">
              <Link href="/">
                <button className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
                  <ArrowLeft className="w-6 h-6" />
                </button>
              </Link>
              
              <h1 className="text-xl font-bold">🍽️ Restaurants</h1>
              
              <div className="flex items-center gap-2">
                <Link href="/restaurants/reservations">
                  <button className="relative p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
                    <Calendar className="w-5 h-5" />
                    {currentReservations.length > 0 && (
                      <div className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {currentReservations.length}
                      </div>
                    )}
                  </button>
                </Link>
                <Link href="/restaurants/favorites">
                  <button className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
                    <Heart className="w-5 h-5" />
                  </button>
                </Link>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-red-100 text-sm">
                {filteredRestaurants.length} Restaurants • {filteredRestaurants.filter(r => r.currentStatus === 'open').length} geöffnet
              </p>
            </div>
          </div>

          <SearchAndFilter />

          {/* Main Content */}
          <div className="pb-20">
            <div className="p-4 space-y-6">
              <StatsCard />
              <RecommendationsCard />

              {/* Restaurants List */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold text-gray-800">
                    {selectedFilters.cuisine === 'Alle' ? 'Alle Restaurants' : `${selectedFilters.cuisine} Restaurants`}
                  </h2>
                  <span className="text-sm text-gray-500">
                    {filteredRestaurants.length} verfügbar
                  </span>
                </div>

                {filteredRestaurants.length > 0 ? (
                  <div className="space-y-4">
                    {filteredRestaurants.map((restaurant) => (
                      <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Coffee className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-600 mb-2">Keine Restaurants gefunden</h3>
                    <p className="text-gray-500 mb-4">
                      {searchQuery ? 'Versuchen Sie andere Suchbegriffe' : 'Ändern Sie Ihre Filter-Einstellungen'}
                    </p>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedFilters({
                          cuisine: 'Alle',
                          priceRange: 'Alle',
                          rating: 0,
                          distance: 1000,
                          openNow: false,
                          hasAvailability: false,
                          features: []
                        });
                      }}
                      className="bg-red-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-red-600 transition-colors"
                    >
                      Filter zurücksetzen
                    </button>
                  </div>
                )}
              </div>

              {/* Tips */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h3 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                  <Info className="w-5 h-5" />
                  Restaurant-Tipps
                </h3>
                <ul className="space-y-1 text-sm text-blue-700">
                  <li>• Reservierungen sind kostenlos und unverbindlich</li>
                  <li>• Bei Verspätung über 15 Min kann der Tisch weitergegeben werden</li>
                  <li>• Allergien und besondere Wünsche bei Reservierung angeben</li>
                  <li>• Happy Hour Angebote bis 19:00 Uhr in vielen Restaurants</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Modals */}
          {selectedRestaurant && !showReservationModal && <RestaurantDetailModal />}
          {showReservationModal && <ReservationModal />}

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
              
              <Link href="/shopping" className="flex flex-col items-center gap-1 text-gray-400 hover:text-orange-500 transition-colors">
                <ShoppingBag className="w-6 h-6" />
                <span className="text-xs">Shopping</span>
              </Link>
              
              <Link href="/vouchers" className="flex flex-col items-center gap-1 text-gray-400 hover:text-pink-500 transition-colors">
                <Gift className="w-6 h-6" />
                <span className="text-xs">Gutscheine</span>
              </Link>
              
              <Link href="/restaurants" className="flex flex-col items-center gap-1 text-red-500">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                  <Coffee className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs font-medium">Restaurants</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RestaurantsPage;

