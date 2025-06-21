// pages/index.tsx
'use client';
import { useState, useEffect, useMemo, useCallback } from 'react';
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

// Custom hooks
const useWeatherData = () => {
  const [weather, setWeather] = useState<WeatherData>({
    temperature: 18,
    condition: 'Heiter',
    humidity: 65,
    windSpeed: 12,
    icon: '☀️'
  });

  useEffect(() => {
    // Simulate real weather API call
    const fetchWeather = async () => {
      // In real app: fetch from OpenWeatherMap API
      setTimeout(() => {
        setWeather({
          temperature: Math.round(15 + Math.random() * 10),
          condition: ['Heiter', 'Wolkig', 'Sonnig'][Math.floor(Math.random() * 3)],
          humidity: Math.round(50 + Math.random() * 30),
          windSpeed: Math.round(5 + Math.random() * 15),
          icon: ['☀️', '⛅', '🌤️'][Math.floor(Math.random() * 3)]
        });
      }, 1000);
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 300000); // Update every 5 minutes
    return () => clearInterval(interval);
  }, []);

  return weather;
};

const useLiveData = () => {
  const [liveData, setLiveData] = useState<LiveData>({
    busDelays: 2,
    parkingSpaces: 143,
    cityBusyness: 'medium',
    eventsToday: 5,
    airQuality: 85
  });

  useEffect(() => {
    // Simulate real-time data updates
    const updateLiveData = () => {
      setLiveData(prev => ({
        ...prev,
        busDelays: Math.max(0, prev.busDelays + (Math.random() - 0.5) * 2),
        parkingSpaces: Math.max(0, Math.min(200, prev.parkingSpaces + Math.floor((Math.random() - 0.5) * 10))),
        cityBusyness: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high'
      }));
    };

    const interval = setInterval(updateLiveData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  return liveData;
};

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

  // Simulate points increasing
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        points: prev.points + Math.floor(Math.random() * 5)
      }));
    }, 60000); // Add points every minute

    return () => clearInterval(interval);
  }, []);

  return stats;
};

const HomePage: React.FC = () => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'today' | 'nearby' | 'trending'>('today');
  
  // Custom hooks
  const weather = useWeatherData();
  const liveData = useLiveData();
  const userStats = useUserStats();

  // Real-time clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Realistic data
  const achievements: Achievement[] = useMemo(() => [
    {
      id: 'lions',
      title: 'Löwen-Sammler',
      description: 'Entdecke alle Heinrich-der-Löwe Statuen',
      progress: 7,
      maxProgress: 12,
      icon: '🦁',
      reward: '500 Punkte + Löwen-Badge',
      category: 'exploration'
    },
    {
      id: 'local-hero',
      title: 'Local Hero',
      description: 'Unterstütze 10 lokale Geschäfte',
      progress: 6,
      maxProgress: 10,
      icon: '🏪',
      reward: '50€ Gutschein-Paket',
      category: 'shopping'
    },
    {
      id: 'foodie',
      title: 'Braunschweiger Feinschmecker',
      description: 'Probiere Spezialitäten aus 8 Restaurants',
      progress: 4,
      maxProgress: 8,
      icon: '🍽️',
      reward: 'VIP-Restaurantführung',
      category: 'dining'
    }
  ], []);

  const featuredEvents: FeaturedEvent[] = useMemo(() => [
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

  const nearbyPlaces: NearbyPlace[] = useMemo(() => [
    {
      id: 'galerie-jaeschke',
      name: 'Galerie Jaeschke',
      type: 'shop',
      distance: 150,
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=300&h=200&fit=crop',
      openUntil: '18:00',
      specialOffer: '20% auf Rahmen'
    },
    {
      id: 'ratskeller',
      name: 'Ratskeller Braunschweig',
      type: 'restaurant',
      distance: 80,
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=300&h=200&fit=crop',
      openUntil: '22:00',
      specialOffer: 'Happy Hour bis 19:00'
    },
    {
      id: 'dom-blasii',
      name: 'Dom St. Blasii',
      type: 'attraction',
      distance: 220,
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1520637836862-4d197d17c11a?w=300&h=200&fit=crop',
      openUntil: '17:00'
    }
  ], []);

  // Callbacks
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

  // Components
  const StatusBar: React.FC = () => (
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
  );

  const WeatherWidget: React.FC = () => (
    <div className="bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 text-white p-4 rounded-2xl shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-bold text-lg">Braunschweig</h3>
          <p className="text-blue-100 text-sm">Jetzt gerade</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold">{weather.temperature}°</div>
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
    </div>
  );

  const QuickActionCard: React.FC<{
    href: string;
    icon: React.ReactNode;
    title: string;
    subtitle: string;
    badge?: number;
    color: string;
  }> = ({ href, icon, title, subtitle, badge, color }) => (
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
        
        {badge && (
          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold shadow-lg animate-pulse">
            {badge}
          </div>
        )}
      </div>
    </Link>
  );

  const LiveInfoCard: React.FC = () => {
    const liveData = useLiveData();
    
    return (
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
              {liveData.parkingSpaces.toLocaleString('de-DE')}
            </div>
            <div className="text-xs text-green-600">verfügbar</div>
          </div>
          
          <div className="bg-blue-50 p-3 rounded-xl">
            <div className="flex items-center gap-2 mb-1">
              <Navigation className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">ÖPNV</span>
            </div>
            <div className="text-xl font-bold text-blue-600">
              +{liveData.busDelays.toLocaleString('de-DE')} Min
            </div>
            <div className="text-xs text-blue-600">Verspätung</div>
          </div>
          
          <div className="bg-orange-50 p-3 rounded-xl">
            <div className="flex items-center gap-2 mb-1">
              <User className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-medium text-orange-700">Stadt</span>
            </div>
            <div className="text-xl font-bold text-orange-600 capitalize">
              {liveData.cityBusyness === 'low' ? 'Ruhig' : 
               liveData.cityBusyness === 'medium' ? 'Mittel' : 'Voll'}
            </div>
            <div className="text-xs text-orange-600">Auslastung</div>
          </div>
          
          <div className="bg-purple-50 p-3 rounded-xl">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-700">Events</span>
            </div>
            <div className="text-xl font-bold text-purple-600">
              {liveData.eventsToday.toLocaleString('de-DE')}
            </div>
            <div className="text-xs text-purple-600">heute</div>
          </div>
        </div>
      </div>
    );
  };

  const StatsCard: React.FC = () => {
    const stats = useUserStats();
    
    return (
      <div className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white p-4 rounded-2xl shadow-lg">
        <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
          <Award className="w-6 h-6" />
          Ihre Erfolge
        </h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold">
              {stats.points.toLocaleString('de-DE')}
            </div>
            <div className="text-xs text-yellow-100">Punkte</div>
            <div className="text-xs text-yellow-200 mt-1">
              +{stats.weeklyTrend.points.toLocaleString('de-DE')} diese Woche
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold">
              {stats.visits.toLocaleString('de-DE')}
            </div>
            <div className="text-xs text-yellow-100">Besuche</div>
            <div className="text-xs text-yellow-200 mt-1">
              +{stats.weeklyTrend.visits.toLocaleString('de-DE')} diese Woche
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold">
              {stats.savings.toLocaleString('de-DE')}€
            </div>
            <div className="text-xs text-yellow-100">Gespart</div>
            <div className="text-xs text-yellow-200 mt-1">
              +{stats.weeklyTrend.savings.toLocaleString('de-DE')}€ diese Woche
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
                <div className="font-bold">Level {stats.level}</div>
                <div className="text-xs text-yellow-200">City Explorer</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-yellow-200">Nächstes Level</div>
              <div className="w-20 h-2 bg-yellow-300/30 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white transition-all duration-1000"
                  style={{ width: `${((stats.points % 500) / 500) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const EventCard: React.FC<{ event: FeaturedEvent }> = ({ event }) => (
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
  );

  const NearbyPlaceCard: React.FC<{ place: NearbyPlace }> = ({ place }) => (
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
  );

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
                  color="bg-gradient-to-br from-purple-500 to-purple-600"
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
              
              <Link href="/shopping" className="flex flex-col items-center gap-1 text-gray-400 hover:text-orange-500 transition-colors relative">
                <ShoppingBag className="w-6 h-6" />
                <span className="text-xs">Shopping</span>
                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  3
                </div>
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
