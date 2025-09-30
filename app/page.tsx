'use client';
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { 
  MapPin, Navigation, Calendar, Car, Camera, Star, 
  Clock, Wifi, Battery, Signal, QrCode, Gift,
  Heart, Share2, Info, Coffee, ShoppingBag, Bell,
  User, Settings, TrendingUp, Zap, Award, Target,
  ChevronRight, Play, Pause, Volume2, CloudSun,
  Thermometer, Wind, Eye, Crown, Home
} from 'lucide-react';

// Types
interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  icon: string;
  feels_like?: number;
  pressure?: number;
  visibility?: number;
}

interface LiveData {
  busDelays: number;
  parkingSpaces: number;
  cityBusyness: 'low' | 'medium' | 'high';
  eventsToday: number;
  airQuality: number;
}

interface UserStats {
  points: number;
  visits: number;
  savings: number;
  level: number;
  weeklyTrend: {
    points: number;
    visits: number;
    savings: number;
  };
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  progress: number;
  maxProgress: number;
  icon: string;
  reward: string;
  category: 'exploration' | 'shopping' | 'dining' | 'social';
}

interface FeaturedEvent {
  id: string;
  title: string;
  subtitle: string;
  time: string;
  location: string;
  image: string;
  category: string;
  attendees: number;
  price: string;
}

interface NearbyPlace {
  id: string;
  name: string;
  type: 'restaurant' | 'shop' | 'attraction';
  distance: number;
  rating: number;
  image: string;
  openUntil: string;
  specialOffer?: string;
}

interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  cta: string;
  ctaLink: string;
  gradient: string;
}

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  category: 'local' | 'traffic' | 'events' | 'construction';
  publishedAt: string;
  source: string;
  urgent: boolean;
  location?: {
    street: string;
    coordinates?: { lat: number; lng: number };
  };
  duration?: {
    start: string;
    end?: string;
  };
}

interface BaustellenData {
  id: string;
  title: string;
  street: string;
  description: string;
  startDate: string;
  endDate?: string;
  type: 'vollsperrung' | 'teilsperrung' | 'umleitung' | 'ampel';
  coordinates?: { lat: number; lng: number };
  source: string;
}

// Optimized Weather Hook with caching and debouncing
const useWeatherData = () => {
  const [weather, setWeather] = useState<WeatherData>({
    temperature: 18,
    condition: 'Leicht bewölkt',
    humidity: 65,
    windSpeed: 12,
    icon: '🌤️'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFetch, setLastFetch] = useState<number>(0);
  const fetchTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const isMountedRef = useRef(true);

  // Cache weather data for 30 minutes
  const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes
  const UPDATE_INTERVAL = 20 * 60 * 1000; // 20 minutes

  const fetchWeather = useCallback(async (force = false) => {
    const now = Date.now();
    
    // Check if we need to fetch (force or cache expired)
    if (!force && now - lastFetch < CACHE_DURATION) {
      return;
    }

    if (!isMountedRef.current) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Use the new weather API endpoint for better Vercel compatibility
      const response = await fetch('/api/weather', {
        next: { revalidate: 1800 } // Cache for 30 minutes
      });

      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }

      const weatherData = await response.json();
      
      if (!isMountedRef.current) return;
      
      // Use the data directly from our API
      const newWeatherData = {
        temperature: weatherData.temperature,
        condition: weatherData.condition,
        humidity: weatherData.humidity,
        windSpeed: weatherData.windSpeed,
        icon: weatherData.icon
      };

      // Only update if weather data actually changed significantly
      setWeather(prev => {
        const tempChanged = Math.abs(prev.temperature - newWeatherData.temperature) >= 1;
        const conditionChanged = prev.condition !== newWeatherData.condition;
        const humidityChanged = Math.abs(prev.humidity - newWeatherData.humidity) >= 5;
        const windChanged = Math.abs(prev.windSpeed - newWeatherData.windSpeed) >= 2;

        if (tempChanged || conditionChanged || humidityChanged || windChanged) {
          return newWeatherData;
        }
        return prev;
      });
      
      setLastFetch(now);
      
    } catch (err) {
      if (isMountedRef.current) {
        setError('Wetter offline');
        
        // Keep existing data, don't fallback to random values
        // This prevents the jumping
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [lastFetch]);

  useEffect(() => {
    isMountedRef.current = true;
    
    // Initial fetch
    fetchWeather();
    
    // Set up interval for updates
    const interval = setInterval(() => {
      if (isMountedRef.current) {
        fetchWeather();
      }
    }, UPDATE_INTERVAL);

    return () => {
      isMountedRef.current = false;
      clearInterval(interval);
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
      }
    };
  }, [fetchWeather]);

  // Manual refresh function
  const refreshWeather = useCallback(() => {
    fetchWeather(true);
  }, [fetchWeather]);

  return { weather, loading, error, refreshWeather };
};

// Optimized Live Data Hook
const useLiveData = () => {
  const [liveData, setLiveData] = useState<LiveData>({
    busDelays: 2,
    parkingSpaces: 143,
    cityBusyness: 'medium',
    eventsToday: 5,
    airQuality: 85
  });
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    
    const updateLiveData = () => {
      if (!isMountedRef.current) return;
      
      setLiveData(prev => {
        // Generate smaller, more realistic changes
        const busDelayChange = (Math.random() - 0.5) * 0.5; // Max ±0.25 minutes
        const parkingChange = Math.floor((Math.random() - 0.5) * 6); // Max ±3 spaces
        
        const newBusDelays = Math.max(0, Math.min(10, prev.busDelays + busDelayChange));
        const newParkingSpaces = Math.max(50, Math.min(200, prev.parkingSpaces + parkingChange));

        // Only update if changes are significant enough
        if (
          Math.abs(newBusDelays - prev.busDelays) < 0.1 &&
          Math.abs(newParkingSpaces - prev.parkingSpaces) < 1
        ) {
          return prev;
        }

        return {
          ...prev,
          busDelays: Math.round(newBusDelays * 10) / 10, // Round to 1 decimal
          parkingSpaces: Math.round(newParkingSpaces)
        };
      });
    };

    // Less frequent updates to prevent jumping
    const interval = setInterval(updateLiveData, 45000); // Every 45 seconds
    
    return () => {
      isMountedRef.current = false;
      clearInterval(interval);
    };
  }, []);

  return liveData;
};

// Stable User Stats Hook
const useUserStats = () => {
  const [stats, setStats] = useState<UserStats>({
    points: 1847,
    visits: 23,
    savings: 89,
    level: 7,
    weeklyTrend: {
      points: 127,
      visits: 3,
      savings: 15
    }
  });
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    
    const interval = setInterval(() => {
      if (!isMountedRef.current) return;
      
      setStats(prev => {
        // Very slow point accumulation to prevent jumping
        const pointsIncrease = Math.random() < 0.1 ? Math.floor(Math.random() * 3) + 1 : 0;
        
        if (pointsIncrease === 0) {
          return prev;
        }
        
        return {
          ...prev,
          points: prev.points + pointsIncrease
        };
      });
    }, 120000); // Every 2 minutes

    return () => {
      isMountedRef.current = false;
      clearInterval(interval);
    };
  }, []);

  return stats;
};

const HomePage: React.FC = () => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [selectedTab, setSelectedTab] = useState<'today' | 'nearby' | 'trending'>('today');
  
  // Use optimized hooks
  const liveData = useLiveData();
  const userStats = useUserStats();

  // Stable time updates
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000); // Update every minute instead of every second
    return () => clearInterval(timer);
  }, []);

  // Memoize static data with proper dependencies
  const achievements = useMemo(() => [
    {
      id: 'lions',
      title: 'Löwen-Sammler',
      description: 'Entdecke alle Heinrich-der-Löwe Statuen',
      progress: 7,
      maxProgress: 12,
      icon: '🦁',
      reward: '500 Punkte + Löwen-Badge',
      category: 'exploration' as const
    },
    {
      id: 'local-hero',
      title: 'Local Hero',
      description: 'Unterstütze 10 lokale Geschäfte',
      progress: 6,
      maxProgress: 10,
      icon: '🏪',
      reward: '50€ Gutschein-Paket',
      category: 'shopping' as const
    },
    {
      id: 'foodie',
      title: 'Braunschweiger Feinschmecker',
      description: 'Probiere Spezialitäten aus 8 Restaurants',
      progress: 4,
      maxProgress: 8,
      icon: '🍽️',
      reward: 'VIP-Restaurantführung',
      category: 'dining' as const
    }
  ], []);

  const featuredEvents = useMemo(() => [
    {
      id: 'klassik-braunschweig',
      title: 'Löwenstadt Klassik',
      subtitle: 'Klassische Konzerte & Aufführungen',
      time: '20:00',
      location: 'Staatstheater Braunschweig',
      image: '/klassik braunschweig.png',
      category: 'Klassik',
      attendees: 250,
      price: '25€'
    },
    {
      id: 'jazz-schloss',
      title: 'Jazz unter Sternen',
      subtitle: 'Live im Schlosspark Richmond',
      time: '19:30',
      location: 'Schloss Richmond',
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=200&fit=crop',
      category: 'Musik',
      attendees: 150,
      price: '15€'
    },
    {
      id: 'market-kohlmarkt',
      title: 'Wochenmarkt Kohlmarkt',
      subtitle: 'Frische Produkte aus der Region',
      time: '08:00',
      location: 'Kohlmarkt',
      image: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=400&h=200&fit=crop',
      category: 'Markt',
      attendees: 300,
      price: 'Frei'
    },
    {
      id: 'city-tour',
      title: 'Löwenstadt Entdeckertour',
      subtitle: 'Digitale Schnitzeljagd',
      time: '10:00',
      location: 'Burgplatz Start',
      image: 'https://images.unsplash.com/photo-1549144511-f099e773c147?w=400&h=200&fit=crop',
      category: 'Tour',
      attendees: 50,
      price: '8€'
    }
  ], []);

  const nearbyPlaces = useMemo<NearbyPlace[]>(() => [
    {
      id: 'galerie-jaeschke',
      name: 'Galerie Jaeschke',
      type: 'shop' as const,
      distance: 150,
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=300&h=200&fit=crop',
      openUntil: '18:00',
      specialOffer: '20% auf Rahmen'
    },
    {
      id: 'ratskeller',
      name: 'Ratskeller Braunschweig',
      type: 'restaurant' as const,
      distance: 80,
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=300&h=200&fit=crop',
      openUntil: '22:00',
      specialOffer: 'Happy Hour bis 19:00'
    },
    {
      id: 'dom-blasii',
      name: 'Dom St. Blasii',
      type: 'attraction' as const,
      distance: 220,
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&h=200&fit=crop',
      openUntil: '17:00'
    }
  ], []);

  // Stable callbacks

  const getBusynessColor = useCallback((level: string) => {
    switch (level) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-orange-600';
      case 'high': return 'text-red-600';
      default: return 'text-gray-600';
    }
  }, []);

  const getBusynessText = useCallback((level: string) => {
    switch (level) {
      case 'low': return 'Ruhig';
      case 'medium': return 'Mäßig besucht';
      case 'high': return 'Sehr belebt';
      default: return 'Unbekannt';
    }
  }, []);

  // Stable components

  // Optimized Weather Widget
  const WeatherWidget: React.FC = React.memo(() => {
    const { weather, loading, error } = useWeatherData();
    
    return (
      <div className="bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 text-white p-4 rounded-2xl shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-bold text-lg">Braunschweig</h3>
            <p className="text-blue-100 text-sm">
              {loading ? 'Laden...' : error ? 'Offline' : 'Jetzt gerade'}
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">
              {weather.temperature}°
            </div>
            <div className="text-blue-100 text-sm">{weather.condition}</div>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{weather.humidity}%</span>
            </div>
            <div className="flex items-center gap-1">
              <Wind className="w-4 h-4" />
              <span>{weather.windSpeed}km/h</span>
            </div>
          </div>
          <div className="text-2xl">{weather.icon}</div>
        </div>
        
        {error && (
          <div className="mt-2 text-xs text-blue-200 opacity-75">
            Offline-Modus aktiv
          </div>
        )}
      </div>
    );
  });

  // Hero Slider Component
  const HeroSlider: React.FC = React.memo(() => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const slideInterval = useRef<NodeJS.Timeout | null>(null);

    const heroSlides: HeroSlide[] = [
      {
        id: 'dom',
        title: 'Dom St. Blasii',
        subtitle: 'Wahrzeichen der Stadt',
        description: 'Entdecken Sie das beeindruckende romanische Bauwerk aus dem 12. Jahrhundert',
        image: '/dom st blasii.jpeg',
        cta: 'Mehr erfahren',
        ctaLink: '/stadtfuehrungen',
        gradient: 'from-amber-500 to-orange-600'
      },
      {
        id: 'rizzi',
        title: 'Happy Rizzi House',
        subtitle: 'Bunte Moderne',
        description: 'Erleben Sie moderne Kunst in der historischen Altstadt von Braunschweig',
        image: '/rizzi house.jpeg',
        cta: 'Besuchen',
        ctaLink: '/events',
        gradient: 'from-purple-500 to-indigo-600'
      },
      {
        id: 'braunschweig',
        title: 'Braunschweig Panorama',
        subtitle: 'Löwenstadt entdecken',
        description: 'Erleben Sie die wunderschöne Skyline der historischen Löwenstadt',
        image: '/Braunschweig.png',
        cta: 'Erkunden',
        ctaLink: '/navigation',
        gradient: 'from-blue-500 to-indigo-600'
      },
      {
        id: 'magniviertel',
        title: 'Magniviertel',
        subtitle: 'Kultureller Mittelpunkt',
        description: 'Shoppen, schlemmen und entspannen im historischen Fachwerkviertel',
        image: '/magniviertel.webp',
        cta: 'Erkunden',
        ctaLink: '/shopping',
        gradient: 'from-green-500 to-emerald-600'
      }
    ];

    const nextSlide = useCallback(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, [heroSlides.length]);

    const prevSlide = useCallback(() => {
      setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
    }, [heroSlides.length]);

    const goToSlide = useCallback((index: number) => {
      setCurrentSlide(index);
    }, []);

    // Auto-play functionality
    useEffect(() => {
      if (isPlaying) {
        slideInterval.current = setInterval(nextSlide, 5000);
      } else if (slideInterval.current) {
        clearInterval(slideInterval.current);
      }

      return () => {
        if (slideInterval.current) {
          clearInterval(slideInterval.current);
        }
      };
    }, [isPlaying, nextSlide]);

    const togglePlayPause = () => {
      setIsPlaying(!isPlaying);
    };

    const currentHeroSlide = heroSlides[currentSlide];

    return (
      <div className="relative h-64 rounded-2xl overflow-hidden shadow-xl mb-6">
        {/* Background Image and Gradient */}
        <div className="absolute inset-0">
          <Image
            src={currentHeroSlide.image}
            alt={currentHeroSlide.title}
            fill
            className="object-cover transition-all duration-700 ease-in-out"
            priority
          />
          <div className={`absolute inset-0 bg-gradient-to-r ${currentHeroSlide.gradient} opacity-75`}></div>
          <div className="absolute inset-0 bg-black/20"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-end p-6 text-white">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-yellow-300" />
              <span className="text-sm font-medium text-yellow-100">{currentHeroSlide.subtitle}</span>
            </div>
            <h2 className="text-2xl font-bold leading-tight">{currentHeroSlide.title}</h2>
            <p className="text-white/90 text-sm leading-relaxed">{currentHeroSlide.description}</p>
            
            <Link 
              href={currentHeroSlide.ctaLink}
              className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 
                         px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 
                         border border-white/30 mt-3 z-30 relative"
              onClick={(e) => {
                e.stopPropagation(); // Verhindert Konflikte mit Slider-Events
              }}
            >
              {currentHeroSlide.cta}
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          <button
            onClick={togglePlayPause}
            className="bg-black/30 backdrop-blur-sm hover:bg-black/50 p-2 rounded-full 
                       text-white transition-all duration-200"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-4 left-6 z-20 flex gap-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'w-8 bg-white' 
                  : 'w-2 bg-white/50 hover:bg-white/70'
              }`}
              aria-label={`Zu Slide ${index + 1} wechseln`}
            />
          ))}
        </div>

        {/* Touch/Swipe Areas */}
        <button
          onClick={prevSlide}
          className="absolute left-0 top-0 h-full w-1/3 z-10 opacity-0"
          aria-label="Vorheriger Slide"
        />
        <button
          onClick={nextSlide}
          className="absolute right-0 top-0 h-full w-1/3 z-10 opacity-0"
          aria-label="Nächster Slide"
        />
      </div>
    );
  });

  // Function to fetch real construction data from Braunschweig sources
  const fetchBraunschweigBaustellen = async (): Promise<BaustellenData[]> => {
    try {
      // In production, replace with real APIs:
      // 1. Stadt Braunschweig RSS: https://www.braunschweig.de/rss/verkehr.xml
      // 2. OpenData Niedersachsen: https://opendata.niedersachsen.de
      // 3. HERE Traffic API: https://traffic.ls.hereapi.com/traffic/6.3/incidents.json
      
      // Simulating real API call with actual Braunschweig street data
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const realBaustellenData: BaustellenData[] = [
        {
          id: 'bs-001',
          title: 'Kanalbauarbeiten Hamburger Straße',
          street: 'Hamburger Straße',
          description: 'Vollsperrung zwischen Ringgleis und Campestraße wegen Kanalsanierung',
          startDate: '2024-03-10',
          endDate: '2024-04-15',
          type: 'vollsperrung',
          coordinates: { lat: 52.2688, lng: 10.5267 },
          source: 'Stadt Braunschweig Tiefbauamt'
        },
        {
          id: 'bs-002',
          title: 'Straßensanierung Steinweg',
          street: 'Steinweg',
          description: 'Halbseitige Sperrung für Fahrbahndeckenerneuerung',
          startDate: '2024-03-18',
          endDate: '2024-03-25',
          type: 'teilsperrung',
          coordinates: { lat: 52.2634, lng: 10.5178 },
          source: 'Stadtverwaltung Braunschweig'
        },
        {
          id: 'bs-003',
          title: 'Ampelanlage defekt Wolfenbütteler Straße',
          street: 'Wolfenbütteler Straße / Ecke Rebenring',
          description: 'Ampelanlage außer Betrieb, Verkehrsregelung durch Polizei',
          startDate: '2024-03-19',
          type: 'ampel',
          coordinates: { lat: 52.2701, lng: 10.5156 },
          source: 'Polizei Braunschweig'
        },
        {
          id: 'bs-004',
          title: 'Umleitungsempfehlung A39',
          street: 'A39 Braunschweig-Nord',
          description: 'Bauarbeiten an Brücke, Umleitung über B248 empfohlen',
          startDate: '2024-03-15',
          endDate: '2024-05-30',
          type: 'umleitung',
          coordinates: { lat: 52.2944, lng: 10.5364 },
          source: 'Niedersächsisches Landesamt für Straßenbau'
        },
        {
          id: 'bs-005',
          title: 'Leitungsarbeiten Bohlweg',
          street: 'Bohlweg',
          description: 'Stadtwerke erneuern Fernwärmeleitung, einspurig befahrbar',
          startDate: '2024-03-20',
          endDate: '2024-04-02',
          type: 'teilsperrung',
          coordinates: { lat: 52.2675, lng: 10.5142 },
          source: 'Stadtwerke Braunschweig'
        }
      ];
      
      return realBaustellenData;
    } catch (error) {
      console.error('Error fetching Baustellen data:', error);
      return [];
    }
  };

  // Convert Baustellen data to NewsItems
  const convertBaustellenToNews = (baustellen: BaustellenData[]): NewsItem[] => {
    return baustellen.map(baustelle => ({
      id: baustelle.id,
      title: baustelle.title,
      summary: baustelle.description,
      category: 'construction' as const,
      publishedAt: new Date(baustelle.startDate).toISOString(),
      source: baustelle.source,
      urgent: baustelle.type === 'vollsperrung' || baustelle.type === 'ampel',
      location: {
        street: baustelle.street,
        coordinates: baustelle.coordinates
      },
      duration: {
        start: baustelle.startDate,
        end: baustelle.endDate
      }
    }));
  };

  // RSS Feed fetching function - Enhanced with real-world simulation
  const fetchBraunschweigRSSFeed = async (): Promise<NewsItem[]> => {
    try {
      // This simulates fetching from braunschweig.de RSS feed
      // In production: const response = await fetch('https://www.braunschweig.de/rss.xml');
      
      const mockRSSNews: NewsItem[] = [
        {
          id: 'rss-1',
          title: 'Stadt Braunschweig erweitert Digitalisierungsstrategie',
          summary: 'Mit neuen Smart City Projekten will die Stadt die digitale Infrastruktur bis 2025 ausbauen. Schwerpunkte sind IoT-Sensoren und Bürgerdienste.',
          category: 'local',
          publishedAt: '2025-09-19T09:30:00Z',
          source: 'Stadt Braunschweig',
          urgent: false
        },
        {
          id: 'rss-2',
          title: 'Bürgerbeteiligung für neuen Stadtpark startet',
          summary: 'Bürgerinnen und Bürger können ab sofort ihre Ideen für die Gestaltung des Parks am Westbahnhof einbringen. Online-Portal ist freigeschaltet.',
          category: 'local',
          publishedAt: '2025-09-18T14:15:00Z',
          source: 'Stadt Braunschweig',
          urgent: false
        },
        {
          id: 'rss-3',
          title: 'Kulturprogramm Herbst 2025 präsentiert',
          summary: 'Staatstheater, Kunstmuseum und weitere Kultureinrichtungen stellen ihr Herbstprogramm vor. Highlights: Wagner-Zyklus und Designausstellung.',
          category: 'events',
          publishedAt: '2025-09-17T11:00:00Z',
          source: 'Kultur Braunschweig',
          urgent: false
        },
        {
          id: 'rss-4',
          title: 'Neue Förderung für nachhaltiges Wohnen',
          summary: 'Die Stadt startet ein Förderprogramm für energieeffiziente Sanierungen in der Innenstadt. Bis zu 20.000€ Zuschuss möglich.',
          category: 'local',
          publishedAt: '2025-09-16T10:45:00Z',
          source: 'Stadt Braunschweig',
          urgent: false
        },
        {
          id: 'rss-5',
          title: 'Löwenstadtlauf 2025 - Anmeldung gestartet',
          summary: 'Der beliebte Braunschweiger Marathon findet am 15. Oktober statt. Neue Streckenführung durch die historische Altstadt.',
          category: 'events',
          publishedAt: '2025-09-15T12:20:00Z',
          source: 'Sport Braunschweig',
          urgent: false
        },
        {
          id: 'rss-6',
          title: 'Weihnachtsmarkt 2025 wird erweitert',
          summary: 'Der traditionelle Weihnachtsmarkt wird in diesem Jahr um den Kohlmarkt erweitert. Handwerkermarkt und Kinderbereich neu dazu.',
          category: 'events',
          publishedAt: '2025-09-14T16:40:00Z',
          source: 'Braunschweig Marketing',
          urgent: false
        }
      ];

      // Simulate API delay and potential network issues
      await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));
      
      // Simulate occasional network errors (5% chance)
      if (Math.random() < 0.05) {
        throw new Error('Network timeout');
      }
      
      return mockRSSNews;
    } catch (error) {
      console.error('Error fetching RSS feed:', error);
      // Return minimal fallback data
      return [
        {
          id: 'fallback-1',
          title: 'Nachrichten momentan nicht verfügbar',
          summary: 'Die Verbindung zum Nachrichtendienst konnte nicht hergestellt werden. Bitte versuchen Sie es später erneut.',
          category: 'local',
          publishedAt: new Date().toISOString(),
          source: 'System',
          urgent: false
        }
      ];
    }
  };

  // Tab-based Newsfeed Component
  const BraunschweigNewsfeed: React.FC = React.memo(() => {
    const [activeTab, setActiveTab] = useState<'traffic' | 'news'>('traffic');
    const [trafficNews, setTrafficNews] = useState<NewsItem[]>([]);
    const [generalNews, setGeneralNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      const loadData = async () => {
        setLoading(true);
        try {
          // Load traffic and construction data
          const baustellenData = await fetchBraunschweigBaustellen();
          const baustellenNews = convertBaustellenToNews(baustellenData);
          
          // Add some traffic-related mock data
          const additionalTrafficNews: NewsItem[] = [
            {
              id: 'traffic-1',
              title: 'Stau auf A39 Richtung Wolfsburg',
              summary: 'Auffahrt Braunschweig-Nord bis Cremlingen: 3km Stau, ca. 15 Min Verzögerung.',
              category: 'traffic',
              publishedAt: '2025-09-19T08:45:00Z',
              source: 'Verkehrszentrale',
              urgent: true
            },
            {
              id: 'traffic-2',
              title: 'Ampelanlage Steinweg wird optimiert',
              summary: 'Neue Ampelschaltung soll den Verkehrsfluss in der Innenstadt verbessern.',
              category: 'traffic',
              publishedAt: '2025-09-18T16:20:00Z',
              source: 'Stadt Braunschweig',
              urgent: false
            }
          ];

          const allTrafficNews = [...baustellenNews, ...additionalTrafficNews].sort((a, b) => 
            new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
          );
          
          setTrafficNews(allTrafficNews);

          // Load general news from RSS
          const rssNews = await fetchBraunschweigRSSFeed();
          setGeneralNews(rssNews);
          
        } catch (error) {
          console.error('Error loading news:', error);
          // Fallback to empty arrays
          setTrafficNews([]);
          setGeneralNews([]);
        } finally {
          setLoading(false);
        }
      };

      loadData();
    }, []);

    const getCategoryIcon = (category: NewsItem['category']) => {
      switch (category) {
        case 'traffic': return '🚦';
        case 'construction': return '🚧';
        case 'events': return '🎉';
        default: return '📰';
      }
    };

    const getCategoryColor = (category: NewsItem['category']) => {
      switch (category) {
        case 'traffic': return 'bg-red-100 text-red-800';
        case 'construction': return 'bg-orange-100 text-orange-800';
        case 'events': return 'bg-purple-100 text-purple-800';
        default: return 'bg-blue-100 text-blue-800';
      }
    };

    const formatTimestamp = (timestamp: string) => {
      const date = new Date(timestamp);
      const now = new Date();
      const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
      
      if (diffInHours < 1) return 'Gerade eben';
      if (diffInHours < 24) return `vor ${diffInHours}h`;
      return date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' });
    };

    const renderNewsItems = (newsItems: NewsItem[]) => (
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {newsItems.map((item) => (
          <div key={item.id} className={`border-l-4 pl-3 py-2 rounded-r-lg ${
            item.urgent ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50'
          }`}>
            <div className="flex items-start gap-3">
              <div className="text-lg mt-0.5">
                {getCategoryIcon(item.category)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${getCategoryColor(item.category)}`}>
                    {item.category === 'local' ? 'Lokal' : 
                     item.category === 'traffic' ? 'Verkehr' :
                     item.category === 'construction' ? 'Baustelle' : 'Event'}
                  </span>
                  {item.urgent && (
                    <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full font-bold">
                      EILMELDUNG
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-sm text-gray-900 line-clamp-2 mb-1">
                  {item.title}
                </h3>
                {item.location && (
                  <div className="flex items-center gap-1 mb-1">
                    <MapPin className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-500">{item.location.street}</span>
                  </div>
                )}
                <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                  {item.summary}
                </p>
                {item.duration && item.duration.end && (
                  <div className="flex items-center gap-1 mb-2">
                    <Clock className="w-3 h-3 text-orange-500" />
                    <span className="text-xs text-orange-600">
                      bis {new Date(item.duration.end).toLocaleDateString('de-DE')}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    <span>{item.source}</span>
                    {item.location && item.location.coordinates && activeTab === 'traffic' && (
                      <Link href="/navigation" className="flex items-center gap-1 text-blue-600 hover:text-blue-800">
                        <Navigation className="w-3 h-3" />
                        <span>Auf Karte</span>
                      </Link>
                    )}
                  </div>
                  <span>{formatTimestamp(item.publishedAt)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );

    const currentNews = activeTab === 'traffic' ? trafficNews : generalNews;

    return (
      <div className="bg-white rounded-2xl shadow-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <h2 className="text-xl font-bold text-gray-800">Braunschweig News</h2>
          </div>
          <div className="text-xs text-gray-500">Live Updates</div>
        </div>

        {/* Tab Navigation */}
        <div className="flex mb-4 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('traffic')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-all ${
              activeTab === 'traffic'
                ? 'bg-white text-orange-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Car className="w-4 h-4" />
            Verkehr
            {trafficNews.filter(item => item.urgent).length > 0 && (
              <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {trafficNews.filter(item => item.urgent).length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('news')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-all ${
              activeTab === 'news'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Bell className="w-4 h-4" />
            Nachrichten
          </button>
        </div>

        {/* Content - Kompakte Vorschau */}
        {loading ? (
          <div className="space-y-2">
            {[1, 2].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="flex gap-3">
                  <div className="w-6 h-6 bg-gray-200 rounded-full flex-shrink-0"></div>
                  <div className="flex-1 space-y-1">
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : currentNews.length > 0 ? (
          <div className="space-y-2">
            {currentNews.slice(0, 3).map((item) => (
              <div key={item.id} className={`flex items-start gap-3 p-2 rounded-lg transition-colors hover:bg-gray-50 ${
                item.urgent ? 'bg-red-50 border-l-2 border-red-500' : 'bg-gray-50'
              }`}>
                <div className="text-sm mt-0.5 flex-shrink-0">
                  {getCategoryIcon(item.category)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${getCategoryColor(item.category)}`}>
                      {item.category === 'local' ? 'Lokal' : 
                       item.category === 'traffic' ? 'Verkehr' :
                       item.category === 'construction' ? 'Baustelle' : 'Event'}
                    </span>
                    {item.urgent && (
                      <span className="text-xs bg-red-500 text-white px-1.5 py-0.5 rounded font-bold">
                        EILMELDUNG
                      </span>
                    )}
                    <span className="text-xs text-gray-500 ml-auto">{formatTimestamp(item.publishedAt)}</span>
                  </div>
                  <h3 className="font-medium text-sm text-gray-900 line-clamp-1 mb-1">
                    {item.title}
                  </h3>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-2">
                      {item.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span>{item.location.street}</span>
                        </div>
                      )}
                      {item.duration && item.duration.end && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-orange-500" />
                          <span className="text-orange-600">
                            bis {new Date(item.duration.end).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })}
                          </span>
                        </div>
                      )}
                    </div>
                    {item.location && item.location.coordinates && activeTab === 'traffic' && (
                      <Link href="/navigation" className="flex items-center gap-1 text-blue-600 hover:text-blue-800">
                        <Navigation className="w-3 h-3" />
                        <span>Karte</span>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {currentNews.length > 3 && (
              <div className="text-center pt-2">
                <span className="text-xs text-gray-500">
                  +{currentNews.length - 3} weitere Meldungen
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500">
            <div className="text-2xl mb-1">
              {activeTab === 'traffic' ? '🚗' : '📰'}
            </div>
            <p className="text-xs">
              {activeTab === 'traffic' 
                ? 'Keine aktuellen Verkehrsmeldungen' 
                : 'Keine aktuellen Nachrichten'
              }
            </p>
          </div>
        )}

        <div className="mt-3 text-center">
          <button className="text-blue-600 hover:text-blue-800 text-xs font-medium flex items-center gap-1 mx-auto">
            Alle anzeigen
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    );
  });

  const QuickActionCard: React.FC<{
    href: string;
    icon: React.ReactNode;
    title: string;
    subtitle: string;
    badge?: number;
    color: string;
  }> = React.memo(({ href, icon, title, subtitle, badge, color }) => (
    <Link href={href}>
      <div className={`relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer group ${color}`}>
        <div className="p-4 h-28 flex flex-col justify-between relative">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-2 right-2 w-12 h-12 border border-white rounded-full"></div>
            <div className="absolute bottom-2 left-2 w-6 h-6 border border-white rounded-full"></div>
          </div>
          
          {/* Content */}
          <div className="relative z-10 flex-1 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1.5 bg-white/20 backdrop-blur-sm rounded-lg">
                {icon}
              </div>
              <h3 className="font-bold text-white text-base leading-tight">{title}</h3>
            </div>
            <p className="text-white/90 text-xs leading-tight">{subtitle}</p>
          </div>
          
          {/* Arrow */}
          <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm rounded-full p-1 group-hover:bg-white/30 transition-colors">
            <ChevronRight className="w-4 h-4 text-white" />
          </div>
        </div>
        
        {badge && badge > 0 && (
          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold shadow-lg animate-pulse">
            {badge}
          </div>
        )}
      </div>
    </Link>
  ));

  const LiveInfoCard: React.FC = React.memo(() => (
    <div className="bg-white rounded-2xl shadow-lg p-4 border border-gray-200">
      <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-blue-500" />
        Live-Informationen
      </h3>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-green-50 p-3 rounded-xl">
          <div className="flex items-center gap-2 mb-1">
            <Car className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-700">Parkplätze</span>
          </div>
          <div className="text-xl font-bold text-green-600">
            {liveData.parkingSpaces}
          </div>
          <div className="text-xs text-green-600">verfügbar</div>
        </div>
        
        <div className="bg-blue-50 p-3 rounded-xl">
          <div className="flex items-center gap-2 mb-1">
            <Navigation className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">ÖPNV</span>
          </div>
          <div className="text-xl font-bold text-blue-600">
            +{liveData.busDelays.toFixed(1)} Min
          </div>
          <div className="text-xs text-blue-600">Verspätung</div>
        </div>
        
        <div className="bg-orange-50 p-3 rounded-xl">
          <div className="flex items-center gap-2 mb-1">
            <User className="w-4 h-4 text-orange-600" />
            <span className="text-sm font-medium text-orange-700">Stadt</span>
          </div>
          <div className="text-xl font-bold text-orange-600 capitalize">
            {getBusynessText(liveData.cityBusyness)}
          </div>
          <div className="text-xs text-orange-600">Auslastung</div>
        </div>
        
        <div className="bg-purple-50 p-3 rounded-xl">
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-700">Events</span>
          </div>
          <div className="text-xl font-bold text-purple-600">
            {liveData.eventsToday}
          </div>
          <div className="text-xs text-purple-600">heute</div>
        </div>
      </div>
    </div>
  ));

  const StatsCard: React.FC = React.memo(() => (
    <div className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white p-4 rounded-2xl shadow-lg">
      <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
        <Award className="w-6 h-6" />
        Ihre Erfolge
      </h3>
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-2xl font-bold">
            {userStats.points.toLocaleString('de-DE')}
          </div>
          <div className="text-xs text-yellow-100">Punkte</div>
          <div className="text-xs text-yellow-200 mt-1">
            +{userStats.weeklyTrend.points.toLocaleString('de-DE')} diese Woche
          </div>
        </div>
        <div>
          <div className="text-2xl font-bold">
            {userStats.visits.toLocaleString('de-DE')}
          </div>
          <div className="text-xs text-yellow-100">Besuche</div>
          <div className="text-xs text-yellow-200 mt-1">
            +{userStats.weeklyTrend.visits.toLocaleString('de-DE')} diese Woche
          </div>
        </div>
        <div>
          <div className="text-2xl font-bold">
            {userStats.savings.toLocaleString('de-DE')}€
          </div>
          <div className="text-xs text-yellow-100">Gespart</div>
          <div className="text-xs text-yellow-200 mt-1">
            +{userStats.weeklyTrend.savings.toLocaleString('de-DE')}€ diese Woche
          </div>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-yellow-300/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-yellow-300/30 rounded-full flex items-center justify-center">
              <Crown className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold">Level {userStats.level}</div>
              <div className="text-xs text-yellow-200">City Explorer</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-yellow-200">Nächstes Level</div>
            <div className="w-20 h-2 bg-yellow-300/30 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white transition-all duration-1000"
                style={{ width: `${((userStats.points % 500) / 500) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  ));

  const EventCard: React.FC<{ event: FeaturedEvent }> = React.memo(({ event }) => (
    <Link href={`/events/${event.id}`}>
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group">
        <div className="relative h-40">
          <Image
            src={event.image}
            alt={event.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute top-3 left-3">
            <span className="bg-white/90 backdrop-blur-sm text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
              {event.category}
            </span>
          </div>
          <div className="absolute top-3 right-3">
            <div className="bg-white/90 backdrop-blur-sm rounded-full p-2">
              <Heart className="w-4 h-4 text-gray-700" />
            </div>
          </div>
          <div className="absolute bottom-3 left-3 text-white">
            <h4 className="font-bold mb-1">{event.title}</h4>
            <p className="text-sm text-gray-200">{event.subtitle}</p>
          </div>
        </div>
        
        <div className="p-4">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{event.location}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">{event.attendees} Teilnehmer</span>
            <span className="font-bold text-orange-600">{event.price}</span>
          </div>
        </div>
      </div>
    </Link>
  ));

  const NearbyPlaceCard: React.FC<{ place: NearbyPlace }> = React.memo(({ place }) => (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-24">
        <Image
          src={place.image}
          alt={place.name}
          fill
          className="object-cover"
        />
        {place.specialOffer && (
          <div className="absolute top-2 left-2">
            <span className="bg-red-500 text-white px-2 py-1 rounded-md text-xs font-medium">
              {place.specialOffer}
            </span>
          </div>
        )}
      </div>
      <div className="p-3">
        <h4 className="font-semibold text-gray-800 text-sm mb-1">{place.name}</h4>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-yellow-500 fill-current" />
            <span>{place.rating}</span>
          </div>
          <span>{place.distance}m • bis {place.openUntil}</span>
        </div>
      </div>
    </div>
  ));

  return (
    <>
      <Head>
        <title>Willkommen in Braunschweig - BS.Smart</title>
        <meta name="description" content="Entdecken Sie Braunschweig digital mit der offiziellen Smart City App" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-md mx-auto bg-white shadow-2xl min-h-screen">
          {/* Header with Braunschweig Image */}
          <div className="bg-gradient-to-br from-yellow-500 via-orange-500 to-red-500 text-white p-6 relative overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 opacity-20">
              <Image
                src="/Braunschweig.png"
                alt="Braunschweig Skyline"
                fill
                className="object-cover object-center"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/50 via-orange-500/50 to-red-500/50"></div>
            </div>
            
            {/* Content */}
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold">Willkommen in Braunschweig</h1>
                  <p className="text-yellow-100">Ihre digitale Löwenstadt! 🦁</p>
                </div>
                <div className="flex items-center gap-3">
                  <button className="relative p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors">
                    <Bell className="w-6 h-6" />
                    <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      3
                    </div>
                  </button>
                  <Link href="/profile">
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                      <User className="w-6 h-6" />
                    </div>
                  </Link>
                </div>
              </div>
              
              {/* City Info Badge */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20 mt-4">
                <div>
                  <h3 className="font-bold text-lg">Löwenstadt Braunschweig</h3>
                  <p className="text-yellow-100 text-sm">Tradition trifft Innovation</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-4 space-y-6 pb-24">
            {/* Hero Slider */}
            <HeroSlider />
            
            {/* Weather */}
            <WeatherWidget />
            
            {/* News Feed */}
            <BraunschweigNewsfeed />

            {/* Quick Actions Grid */}
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4">Schnellzugriff</h2>
              <div className="grid grid-cols-2 gap-3">
                <QuickActionCard
                  href="/navigation"
                  icon={<Navigation className="w-6 h-6 text-white" />}
                  title="Navigation"
                  subtitle="Wege finden"
                  color="bg-gradient-to-br from-blue-500 to-blue-600"
                />
                <QuickActionCard
                  href="/parking"
                  icon={<Car className="w-6 h-6 text-white" />}
                  title="Parking"
                  subtitle={`${liveData.parkingSpaces} Plätze frei`}
                  color="bg-gradient-to-br from-green-500 to-green-600"
                />
                <QuickActionCard
                  href="/events"
                  icon={<Calendar className="w-6 h-6 text-white" />}
                  title="Events"
                  subtitle={`${liveData.eventsToday} heute`}
                  badge={liveData.eventsToday}
                  color="bg-gradient-to-br from-purple-500 to-purple-600"
                />
                <QuickActionCard
                  href="/shopping"
                  icon={<ShoppingBag className="w-6 h-6 text-white" />}
                  title="Shopping"
                  subtitle="Click & Collect"
                  badge={3}
                  color="bg-gradient-to-br from-orange-500 to-orange-600"
                />
                <QuickActionCard
                  href="/restaurants"
                  icon={<Coffee className="w-6 h-6 text-white" />}
                  title="Restaurants"
                  subtitle="Reservieren"
                  color="bg-gradient-to-br from-red-500 to-red-600"
                />
                <QuickActionCard
                  href="/vouchers"
                  icon={<Gift className="w-6 h-6 text-white" />}
                  title="Gutscheine"
                  subtitle="Bis zu 20% sparen"
                  badge={4}
                  color="bg-gradient-to-br from-pink-500 to-pink-600"
                />
                <QuickActionCard
                  href="/stadtfuehrungen"
                  icon={<MapPin className="w-6 h-6 text-white" />}
                  title="Stadtführungen"
                  subtitle="Touren buchen"
                  color="bg-gradient-to-br from-indigo-500 to-indigo-600"
                />
                <QuickActionCard
                  href="/kirche-soziales"
                  icon={<Heart className="w-6 h-6 text-white" />}
                  title="Kirche & Soziales"
                  subtitle="Hilfe & Beratung"
                  color="bg-gradient-to-br from-teal-500 to-teal-600"
                />
                <QuickActionCard
                  href="/wohnen"
                  icon={<Home className="w-6 h-6 text-white" />}
                  title="Wohnen"
                  subtitle="Mieten & Kaufen"
                  color="bg-gradient-to-br from-amber-500 to-amber-600"
                />
              </div>
            </div>

            {/* Stats */}
            <StatsCard />

            {/* Live Info */}
            <LiveInfoCard />

            {/* Featured Events */}
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4">Heute empfohlen</h2>
              <div className="space-y-4">
                {featuredEvents.slice(0, 2).map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </div>

            {/* Nearby Places */}
            <div>
              <div className="grid grid-cols-1 gap-3">
                {nearbyPlaces.map(place => (
                  <NearbyPlaceCard key={place.id} place={place} />
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4">Ihre Erfolge</h2>
              <div className="space-y-3">
                {achievements.map(achievement => (
                  <div key={achievement.id} className="bg-white rounded-xl shadow-md p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="text-2xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">{achievement.title}</h4>
                        <p className="text-sm text-gray-600">{achievement.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-800">
                          {achievement.progress}/{achievement.maxProgress}
                        </div>
                        <div className="text-xs text-gray-500">
                          {Math.round((achievement.progress / achievement.maxProgress) * 100)}%
                        </div>
                      </div>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div 
                        className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                      ></div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{achievement.reward}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        achievement.category === 'exploration' ? 'bg-blue-100 text-blue-700' :
                        achievement.category === 'shopping' ? 'bg-green-100 text-green-700' :
                        achievement.category === 'dining' ? 'bg-red-100 text-red-700' :
                        'bg-purple-100 text-purple-700'
                      }`}>
                        {achievement.category === 'exploration' ? 'Entdeckung' :
                         achievement.category === 'shopping' ? 'Einkaufen' :
                         achievement.category === 'dining' ? 'Gastronomie' : 'Social'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4">Kürzliche Aktivitäten</h2>
              <div className="bg-white rounded-xl shadow-md p-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden">
                      <Image
                        src="https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=100&h=100&fit=crop"
                        alt="Galerie Jaeschke"
                        width={40}
                        height={40}
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-800">
                        Kunstwerk bestellt bei Galerie Jaeschke
                      </div>
                      <div className="text-xs text-gray-500">vor 2 Stunden • +50 Punkte</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-green-600">-20%</div>
                      <div className="text-xs text-gray-500">37,98€</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Car className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-800">
                        Parkplatz Rathaus-Center reserviert
                      </div>
                      <div className="text-xs text-gray-500">vor 4 Stunden • 2.5 Std</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-gray-800">5,00€</div>
                      <div className="text-xs text-gray-500">gespart</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                      <span className="text-lg">🦁</span>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-800">
                        Löwe #7 am Burgplatz entdeckt
                      </div>
                      <div className="text-xs text-gray-500">gestern • +100 Punkte</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-yellow-600">Fortschritt</div>
                      <div className="text-xs text-gray-500">7/12</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-2xl shadow-lg">
              <h3 className="font-bold mb-2 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Tipp des Tages
              </h3>
              <p className="text-sm text-purple-100 mb-3">
                Besuchen Sie heute den Wochenmarkt am Kohlmarkt! Frische regionale Produkte und 
                sammeln Sie Punkte für jeden Einkauf bei teilnehmenden Ständen.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-purple-200">Gültig bis 14:00 Uhr</span>
                <Link href="/events/market-kohlmarkt">
                  <button className="bg-white text-purple-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
                    Mehr erfahren
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom Navigation */}
          <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white/95 backdrop-blur-md border-t border-gray-200 px-4 py-3 shadow-lg">
            <div className="flex justify-around items-center">
              <Link href="/" className="flex flex-col items-center gap-1 text-orange-500">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <span className="text-xs font-medium">Home</span>
              </Link>
              
              <Link href="/navigation" className="flex flex-col items-center gap-1 text-gray-400 hover:text-blue-500 transition-colors">
                <Navigation className="w-6 h-6" />
                <span className="text-xs">Navigation</span>
              </Link>
              
              <Link href="/events" className="flex flex-col items-center gap-1 text-gray-400 hover:text-purple-500 transition-colors relative">
                <Calendar className="w-6 h-6" />
                <span className="text-xs">Events</span>
                {liveData.eventsToday > 0 && (
                  <div className="absolute -top-1 -right-1 bg-purple-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {liveData.eventsToday}
                  </div>
                )}
              </Link>
              
              <Link href="/vouchers" className="flex flex-col items-center gap-1 text-gray-400 hover:text-pink-500 transition-colors relative">
                <Gift className="w-6 h-6" />
                <span className="text-xs">Gutscheine</span>
                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  4
                </div>
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

export default HomePage;
