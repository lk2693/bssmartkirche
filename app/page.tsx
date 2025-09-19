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
  Thermometer, Wind, Eye, Crown
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
      
      // Braunschweig coordinates
      const lat = 52.2625;
      const lng = 10.5211;
      
      const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
      
      if (!apiKey) {
        throw new Error('Weather API key not found');
      }

      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${apiKey}&units=metric&lang=de`,
        {
          next: { revalidate: 1800 } // Cache for 30 minutes
        }
      );

      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (!isMountedRef.current) return;
      
      // Map OpenWeatherMap icons to emojis
      const getWeatherIcon = (iconCode: string): string => {
        const iconMap: { [key: string]: string } = {
          '01d': '☀️', '01n': '🌙', '02d': '⛅', '02n': '☁️',
          '03d': '☁️', '03n': '☁️', '04d': '☁️', '04n': '☁️',
          '09d': '🌧️', '09n': '🌧️', '10d': '🌦️', '10n': '🌧️',
          '11d': '⛈️', '11n': '⛈️', '13d': '❄️', '13n': '❄️',
          '50d': '🌫️', '50n': '🌫️'
        };
        return iconMap[iconCode] || '🌤️';
      };

      // Map weather conditions to German
      const getGermanCondition = (condition: string): string => {
        const conditionMap: { [key: string]: string } = {
          'clear sky': 'Klarer Himmel',
          'few clouds': 'Leicht bewölkt',
          'scattered clouds': 'Bewölkt',
          'broken clouds': 'Stark bewölkt',
          'shower rain': 'Schauer',
          'rain': 'Regen',
          'thunderstorm': 'Gewitter',
          'snow': 'Schnee',
          'mist': 'Nebel',
          'fog': 'Nebel',
          'haze': 'Dunst',
          'overcast clouds': 'Bedeckt'
        };
        return conditionMap[condition.toLowerCase()] || condition;
      };

      const newWeatherData = {
        temperature: Math.round(data.main.temp),
        condition: getGermanCondition(data.weather[0].description),
        humidity: data.main.humidity,
        windSpeed: Math.round(data.wind?.speed * 3.6) || 0,
        icon: getWeatherIcon(data.weather[0].icon)
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
  const [isPlaying, setIsPlaying] = useState(false);
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
      image: 'https://images.unsplash.com/photo-1520637836862-4d197d17c11a?w=300&h=200&fit=crop',
      openUntil: '17:00'
    }
  ], []);

  // Stable callbacks
  const handlePlayPause = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

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
  const StatusBar: React.FC = React.memo(() => (
    <div className="flex justify-between items-center px-4 py-3 bg-gradient-to-r from-gray-900 to-gray-800 text-white text-sm">
      <div className="flex items-center gap-2">
        <span className="font-medium">
          {currentTime.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
        </span>
        <span className="text-gray-300">
          {currentTime.toLocaleDateString('de-DE', { weekday: 'short' })}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <Signal className="w-4 h-4 text-green-400" />
          <span className="text-xs">5G</span>
        </div>
        <Wifi className="w-4 h-4 text-blue-400" />
        <div className="flex items-center gap-1">
          <Battery className="w-4 h-4 text-green-400" />
          <span className="text-xs">87%</span>
        </div>
      </div>
    </div>
  ));

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
        <div className="p-6 h-32 flex flex-col justify-between relative">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-2 right-2 w-16 h-16 border border-white rounded-full"></div>
            <div className="absolute bottom-2 left-2 w-8 h-8 border border-white rounded-full"></div>
          </div>
          
          {/* Content */}
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                {icon}
              </div>
              <h3 className="font-bold text-white text-lg">{title}</h3>
            </div>
            <p className="text-white/90 text-sm leading-relaxed">{subtitle}</p>
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
            <button 
              onClick={handlePlayPause}
              className="bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors"
            >
              {isPlaying ? 
                <Pause className="w-4 h-4 text-gray-700" /> : 
                <Play className="w-4 h-4 text-gray-700" />
              }
            </button>
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
        <title>BS.Smart - Ihre digitale Braunschweig App</title>
        <meta name="description" content="Entdecken Sie Braunschweig digital mit der offiziellen Smart City App" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-md mx-auto bg-white shadow-2xl min-h-screen">
          <StatusBar />
          
          {/* Header */}
          <div className="bg-gradient-to-br from-yellow-500 via-orange-500 to-red-500 text-white p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold">BS.Smart</h1>
                <p className="text-yellow-100">Willkommen zurück! 👋</p>
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
          </div>

          {/* Main Content */}
          <div className="p-4 space-y-6 pb-24">
            {/* Weather */}
            <WeatherWidget />

            {/* Quick Actions Grid */}
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4">Schnellzugriff</h2>
              <div className="grid grid-cols-2 gap-4">
                <QuickActionCard
                  href="/navigation"
                  icon={<Navigation className="w-6 h-6 text-white" />}
                  title="Navigation"
                  subtitle="AR-Stadtführung mit Live-Routing"
                  color="bg-gradient-to-br from-blue-500 to-blue-600"
                />
                <QuickActionCard
                  href="/parking"
                  icon={<Car className="w-6 h-6 text-white" />}
                  title="Parking"
                  subtitle={`${liveData.parkingSpaces} Plätze verfügbar`}
                  color="bg-gradient-to-br from-green-500 to-green-600"
                />
                <QuickActionCard
                  href="/events"
                  icon={<Calendar className="w-6 h-6 text-white" />}
                  title="Events"
                  subtitle={`${liveData.eventsToday} Events heute`}
                  badge={liveData.eventsToday}
                  color="bg-gradient-to-br from-purple-500 to-purple-600"
                />
                <QuickActionCard
                  href="/shopping"
                  icon={<ShoppingBag className="w-6 h-6 text-white" />}
                  title="Shopping"
                  subtitle="Click & Collect bei lokalen Händlern"
                  badge={3}
                  color="bg-gradient-to-br from-orange-500 to-orange-600"
                />
                <QuickActionCard
                  href="/restaurants"
                  icon={<Coffee className="w-6 h-6 text-white" />}
                  title="Restaurants"
                  subtitle="Tisch reservieren & bestellen"
                  color="bg-gradient-to-br from-red-500 to-red-600"
                />
                <QuickActionCard
                  href="/vouchers"
                  icon={<Gift className="w-6 h-6 text-white" />}
                  title="Gutscheine"
                  subtitle="Bis zu 20% bei lokalen Partnern"
                  badge={4}
                  color="bg-gradient-to-br from-pink-500 to-pink-600"
                />
                <QuickActionCard
                  href="/ar-tour"
                  icon={<Camera className="w-6 h-6 text-white" />}
                  title="AR Tour"
                  subtitle="Löwen-Trail durch die Stadt"
                  color="bg-gradient-to-br from-indigo-500 to-indigo-600"
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
