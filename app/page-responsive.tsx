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

// Enhanced responsive layout wrapper - the main change for tablet/laptop support
const ResponsiveLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile First Container - expands for larger screens */}
      <div className="max-w-md mx-auto md:max-w-4xl lg:max-w-7xl bg-white shadow-2xl md:shadow-lg lg:shadow-none min-h-screen">
        {children}
      </div>
    </div>
  );
};

// Enhanced responsive header component
const ResponsiveHeader: React.FC<{ currentTime: Date; liveData: any }> = ({ currentTime, liveData }) => {
  return (
    <div className="bg-gradient-to-br from-yellow-500 via-orange-500 to-red-500 text-white p-4 md:p-6 lg:p-8 relative overflow-hidden">
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
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <div>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold">Willkommen in Braunschweig</h1>
            <p className="text-yellow-100 text-sm md:text-base">Ihre digitale Löwenstadt! 🦁</p>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <button className="relative p-2 md:p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors">
              <Bell className="w-5 h-5 md:w-6 md:h-6" />
              <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                3
              </div>
            </button>
            <Link href="/profile">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                <User className="w-5 h-5 md:w-6 md:h-6" />
              </div>
            </Link>
          </div>
        </div>
        
        {/* Enhanced City Info Badge */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 md:p-4 border border-white/20 mt-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="font-bold text-lg md:text-xl">Löwenstadt Braunschweig</h3>
              <p className="text-yellow-100 text-sm md:text-base">Tradition trifft Innovation</p>
            </div>
            <div className="hidden md:flex items-center gap-4 mt-2 md:mt-0">
              <div className="text-center">
                <div className="text-lg md:text-xl font-bold">
                  {currentTime.getHours().toString().padStart(2, '0')}:
                  {currentTime.getMinutes().toString().padStart(2, '0')}
                </div>
                <div className="text-xs text-yellow-200">
                  {currentTime.toLocaleDateString('de-DE', { 
                    weekday: 'short', 
                    day: '2-digit', 
                    month: 'short' 
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced responsive grid component
const ResponsiveGrid: React.FC<{ children: React.ReactNode; cols?: string }> = ({ 
  children, 
  cols = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
}) => {
  return (
    <div className={`grid ${cols} gap-4 md:gap-6`}>
      {children}
    </div>
  );
};

// Enhanced responsive card component
const ResponsiveCard: React.FC<{ 
  children: React.ReactNode; 
  className?: string;
  size?: 'small' | 'medium' | 'large';
}> = ({ children, className = '', size = 'medium' }) => {
  const sizeClasses = {
    small: 'p-3 md:p-4',
    medium: 'p-4 md:p-5 lg:p-6',
    large: 'p-5 md:p-6 lg:p-8'
  };

  return (
    <div className={`bg-white rounded-xl md:rounded-2xl shadow-lg border border-gray-100 ${sizeClasses[size]} ${className}`}>
      {children}
    </div>
  );
};

// Enhanced responsive navigation
const ResponsiveNavigation: React.FC = () => {
  return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md md:max-w-4xl lg:max-w-7xl 
                    bg-white border-t border-gray-200 px-4 py-2 md:py-3 md:rounded-t-xl lg:rounded-t-2xl">
      <div className="flex justify-around items-center">
        <Link href="/" className="flex flex-col items-center gap-1 p-2 md:p-3 hover:bg-gray-100 rounded-lg transition-colors">
          <Home className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
          <span className="text-xs md:text-sm text-blue-600 font-medium">Home</span>
        </Link>
        <Link href="/navigation" className="flex flex-col items-center gap-1 p-2 md:p-3 hover:bg-gray-100 rounded-lg transition-colors">
          <Navigation className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
          <span className="text-xs md:text-sm text-gray-600">Navigation</span>
        </Link>
        <Link href="/shopping" className="flex flex-col items-center gap-1 p-2 md:p-3 hover:bg-gray-100 rounded-lg transition-colors">
          <ShoppingBag className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
          <span className="text-xs md:text-sm text-gray-600">Shopping</span>
        </Link>
        <Link href="/events" className="flex flex-col items-center gap-1 p-2 md:p-3 hover:bg-gray-100 rounded-lg transition-colors">
          <Calendar className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
          <span className="text-xs md:text-sm text-gray-600">Events</span>
        </Link>
        <Link href="/ar-tour" className="flex flex-col items-center gap-1 p-2 md:p-3 hover:bg-gray-100 rounded-lg transition-colors">
          <Camera className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
          <span className="text-xs md:text-sm text-gray-600">AR Tour</span>
        </Link>
      </div>
    </div>
  );
};

// Enhanced main menu grid for larger screens
const MainMenuGrid: React.FC = () => {
  const menuItems = [
    { href: "/navigation", icon: Navigation, title: "Navigation", subtitle: "Stadtplan & Routen", color: "from-blue-500 to-blue-600" },
    { href: "/shopping", icon: ShoppingBag, title: "Shopping", subtitle: "Lokale Geschäfte", color: "from-green-500 to-green-600" },
    { href: "/events", icon: Calendar, title: "Events", subtitle: "Veranstaltungen", color: "from-purple-500 to-purple-600" },
    { href: "/restaurants", icon: Coffee, title: "Restaurants", subtitle: "Gastronomie", color: "from-orange-500 to-orange-600" },
    { href: "/parking", icon: Car, title: "Parken", subtitle: "Parkplätze", color: "from-red-500 to-red-600" },
    { href: "/ar-tour", icon: Camera, title: "AR Tour", subtitle: "Stadtführung", color: "from-indigo-500 to-indigo-600" },
    { href: "/vouchers", icon: Gift, title: "Gutscheine", subtitle: "Angebote", color: "from-pink-500 to-pink-600" },
    { href: "/profile", icon: User, title: "Profil", subtitle: "Einstellungen", color: "from-gray-500 to-gray-600" }
  ];

  return (
    <ResponsiveCard size="large">
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6">Services</h2>
      <ResponsiveGrid cols="grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {menuItems.map((item) => (
          <Link 
            key={item.href}
            href={item.href}
            className="group"
          >
            <div className={`bg-gradient-to-br ${item.color} text-white p-4 md:p-6 rounded-xl md:rounded-2xl 
                           hover:shadow-lg transition-all duration-200 group-hover:scale-105`}>
              <item.icon className="w-8 h-8 md:w-10 md:h-10 mb-3 md:mb-4" />
              <h3 className="font-bold text-sm md:text-base lg:text-lg">{item.title}</h3>
              <p className="text-xs md:text-sm opacity-90">{item.subtitle}</p>
            </div>
          </Link>
        ))}
      </ResponsiveGrid>
    </ResponsiveCard>
  );
};

// Simple placeholder homepage component - this would import the full component
const HomePage: React.FC = () => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  
  // Placeholder data
  const liveData = {
    busDelays: 2,
    parkingSpaces: 143,
    cityBusyness: 'medium',
    eventsToday: 5,
    airQuality: 85
  };

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <Head>
        <title>Braunschweig Smart City</title>
        <meta name="description" content="Ihre digitale Stadt-App für Braunschweig" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>
      
      <ResponsiveLayout>
        <ResponsiveHeader currentTime={currentTime} liveData={liveData} />
        
        {/* Main Content */}
        <div className="p-4 md:p-6 lg:p-8 space-y-6 md:space-y-8 pb-24 md:pb-16 lg:pb-8">
          
          {/* Quick Stats for larger screens */}
          <div className="hidden md:block">
            <ResponsiveGrid cols="grid-cols-2 md:grid-cols-4">
              <ResponsiveCard size="small">
                <div className="flex items-center gap-3">
                  <Car className="w-8 h-8 text-green-600" />
                  <div>
                    <div className="text-2xl font-bold text-gray-800">{liveData.parkingSpaces}</div>
                    <div className="text-sm text-gray-600">Parkplätze frei</div>
                  </div>
                </div>
              </ResponsiveCard>
              <ResponsiveCard size="small">
                <div className="flex items-center gap-3">
                  <Clock className="w-8 h-8 text-orange-600" />
                  <div>
                    <div className="text-2xl font-bold text-gray-800">+{liveData.busDelays} Min</div>
                    <div className="text-sm text-gray-600">ÖPNV Verspätung</div>
                  </div>
                </div>
              </ResponsiveCard>
              <ResponsiveCard size="small">
                <div className="flex items-center gap-3">
                  <Calendar className="w-8 h-8 text-purple-600" />
                  <div>
                    <div className="text-2xl font-bold text-gray-800">{liveData.eventsToday}</div>
                    <div className="text-sm text-gray-600">Events heute</div>
                  </div>
                </div>
              </ResponsiveCard>
              <ResponsiveCard size="small">
                <div className="flex items-center gap-3">
                  <Wind className="w-8 h-8 text-blue-600" />
                  <div>
                    <div className="text-2xl font-bold text-gray-800">{liveData.airQuality}%</div>
                    <div className="text-sm text-gray-600">Luftqualität</div>
                  </div>
                </div>
              </ResponsiveCard>
            </ResponsiveGrid>
          </div>

          {/* Main Menu Grid */}
          <MainMenuGrid />

          {/* Quick Actions for mobile */}
          <div className="md:hidden">
            <ResponsiveCard>
              <h3 className="font-bold text-lg text-gray-800 mb-4">Schnellzugriff</h3>
              <div className="grid grid-cols-2 gap-3">
                <Link href="/parking" className="flex items-center gap-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                  <Car className="w-6 h-6 text-green-600" />
                  <div>
                    <div className="font-semibold text-gray-800">Parken</div>
                    <div className="text-sm text-gray-600">{liveData.parkingSpaces} frei</div>
                  </div>
                </Link>
                <Link href="/events" className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                  <Calendar className="w-6 h-6 text-purple-600" />
                  <div>
                    <div className="font-semibold text-gray-800">Events</div>
                    <div className="text-sm text-gray-600">{liveData.eventsToday} heute</div>
                  </div>
                </Link>
              </div>
            </ResponsiveCard>
          </div>

        </div>

        <ResponsiveNavigation />
      </ResponsiveLayout>
    </>
  );
};

export default HomePage;