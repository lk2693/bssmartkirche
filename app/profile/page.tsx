'use client';

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowLeft, Settings, Edit3, Heart, Bookmark,
  Calendar, MapPin, Star, Trophy, Gift,
  Home, Navigation, Coffee, ShoppingBag, Car,
  User, Bell, Shield, HelpCircle, LogOut,
  Camera, Mail, Phone, CreditCard, History,
  Award, Target, TrendingUp, Users, Eye,
  Download, Upload, Share2, Copy, Check
} from 'lucide-react';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar: string;
  joinDate: Date;
  points: number;
  level: string;
  badges: string[];
  favoriteCategories: string[];
  visitedPlaces: number;
  savedEvents: number;
  usedVouchers: number;
  carbonSaved: number;
  achievements: Achievement[];
  preferences: UserPreferences;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: Date;
  points: number;
}

interface UserPreferences {
  notifications: boolean;
  locationTracking: boolean;
  dataSharing: boolean;
  newsletter: boolean;
  language: string;
  theme: 'light' | 'dark' | 'auto';
}

const ProfilePage = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'achievements' | 'settings'>('overview');

  // Mock user data
  useEffect(() => {
    // Simulate loading user data
    setTimeout(() => {
      setUser({
        id: 'user-001',
        name: 'Max Mustermann',
        email: 'max.mustermann@email.de',
        phone: '+49 531 12345678',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        joinDate: new Date('2024-01-15'),
        points: 2850,
        level: 'Gold Explorer',
        badges: ['Early Adopter', 'Event Enthusiast', 'Eco Warrior', 'Local Guide'],
        favoriteCategories: ['Kultur', 'Gastronomie', 'Events', 'Shopping'],
        visitedPlaces: 47,
        savedEvents: 12,
        usedVouchers: 8,
        carbonSaved: 23.4,
        achievements: [
          {
            id: 'first-event',
            title: 'Erstes Event',
            description: 'Teilnahme am ersten Event',
            icon: '🎉',
            unlockedAt: new Date('2024-01-20'),
            points: 100
          },
          {
            id: 'eco-hero',
            title: 'Umwelt-Held',
            description: '20kg CO2 gespart',
            icon: '🌱',
            unlockedAt: new Date('2024-03-15'),
            points: 250
          },
          {
            id: 'social-butterfly',
            title: 'Gesellschaftsmensch',
            description: '10 Events besucht',
            icon: '🦋',
            unlockedAt: new Date('2024-06-01'),
            points: 300
          }
        ],
        preferences: {
          notifications: true,
          locationTracking: true,
          dataSharing: false,
          newsletter: true,
          language: 'de',
          theme: 'light'
        }
      });
      setIsLoading(false);
    }, 1000);
  }, []);

  const formatMemberSince = (date: Date) => {
    return date.toLocaleDateString('de-DE', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Bronze Explorer': return 'text-amber-600';
      case 'Silver Explorer': return 'text-gray-600';
      case 'Gold Explorer': return 'text-yellow-600';
      case 'Platinum Explorer': return 'text-purple-600';
      default: return 'text-blue-600';
    }
  };

  const OverviewTab = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-md border border-gray-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{user?.points}</div>
            <div className="text-sm text-gray-600">Punkte</div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-md border border-gray-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{user?.visitedPlaces}</div>
            <div className="text-sm text-gray-600">Besuchte Orte</div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-md border border-gray-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{user?.savedEvents}</div>
            <div className="text-sm text-gray-600">Gespeicherte Events</div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-md border border-gray-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{user?.usedVouchers}</div>
            <div className="text-sm text-gray-600">Genutzte Gutscheine</div>
          </div>
        </div>
      </div>

      {/* Level Progress */}
      <div className="bg-white rounded-xl p-4 shadow-md border border-gray-200">
        <h3 className="font-bold text-gray-800 mb-3">Level Progress</h3>
        <div className="flex items-center justify-between mb-2">
          <span className={`font-medium ${getLevelColor(user?.level || '')}`}>
            {user?.level}
          </span>
          <span className="text-sm text-gray-600">{user?.points}/3000</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${((user?.points || 0) / 3000) * 100}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Noch {3000 - (user?.points || 0)} Punkte bis Platinum Explorer
        </p>
      </div>

      {/* Environmental Impact */}
      <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-xl p-4 text-white">
        <h3 className="font-bold mb-2">🌱 Umwelt-Impact</h3>
        <div className="text-2xl font-bold">{user?.carbonSaved} kg CO2</div>
        <p className="text-sm opacity-90">durch nachhaltige Mobilität gespart</p>
      </div>

      {/* Favorite Categories */}
      <div className="bg-white rounded-xl p-4 shadow-md border border-gray-200">
        <h3 className="font-bold text-gray-800 mb-3">Lieblingskategorien</h3>
        <div className="flex flex-wrap gap-2">
          {user?.favoriteCategories.map((category) => (
            <span
              key={category}
              className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
            >
              {category}
            </span>
          ))}
        </div>
      </div>

      {/* Recent Badges */}
      <div className="bg-white rounded-xl p-4 shadow-md border border-gray-200">
        <h3 className="font-bold text-gray-800 mb-3">Badges</h3>
        <div className="grid grid-cols-2 gap-2">
          {user?.badges.map((badge) => (
            <span
              key={badge}
              className="bg-yellow-100 text-yellow-800 px-3 py-2 rounded-lg text-sm text-center"
            >
              🏆 {badge}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  const AchievementsTab = () => (
    <div className="space-y-4">
      {user?.achievements.map((achievement) => (
        <div key={achievement.id} className="bg-white rounded-xl p-4 shadow-md border border-gray-200">
          <div className="flex items-start gap-3">
            <div className="text-2xl">{achievement.icon}</div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-800">{achievement.title}</h4>
              <p className="text-gray-600 text-sm mb-2">{achievement.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-blue-600 font-medium">+{achievement.points} Punkte</span>
                <span className="text-xs text-gray-500">
                  {achievement.unlockedAt.toLocaleDateString('de-DE')}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const SettingsTab = () => (
    <div className="space-y-6">
      {/* Account Settings */}
      <div className="bg-white rounded-xl p-4 shadow-md border border-gray-200">
        <h3 className="font-bold text-gray-800 mb-4">Account</h3>
        <div className="space-y-3">
          <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="flex items-center gap-3">
              <Edit3 className="w-5 h-5 text-gray-600" />
              <span>Profil bearbeiten</span>
            </div>
            <span className="text-gray-400">→</span>
          </button>
          <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-gray-600" />
              <span>Passwort ändern</span>
            </div>
            <span className="text-gray-400">→</span>
          </button>
          <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-gray-600" />
              <span>Zahlungsmethoden</span>
            </div>
            <span className="text-gray-400">→</span>
          </button>
        </div>
      </div>

      {/* Preferences */}
      <div className="bg-white rounded-xl p-4 shadow-md border border-gray-200">
        <h3 className="font-bold text-gray-800 mb-4">Einstellungen</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Benachrichtigungen</span>
            <div className={`w-12 h-6 rounded-full transition-colors ${user?.preferences.notifications ? 'bg-blue-500' : 'bg-gray-300'}`}>
              <div className={`w-5 h-5 bg-white rounded-full transition-transform m-0.5 ${user?.preferences.notifications ? 'translate-x-6' : ''}`}></div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span>Standort-Tracking</span>
            <div className={`w-12 h-6 rounded-full transition-colors ${user?.preferences.locationTracking ? 'bg-blue-500' : 'bg-gray-300'}`}>
              <div className={`w-5 h-5 bg-white rounded-full transition-transform m-0.5 ${user?.preferences.locationTracking ? 'translate-x-6' : ''}`}></div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span>Newsletter</span>
            <div className={`w-12 h-6 rounded-full transition-colors ${user?.preferences.newsletter ? 'bg-blue-500' : 'bg-gray-300'}`}>
              <div className={`w-5 h-5 bg-white rounded-full transition-transform m-0.5 ${user?.preferences.newsletter ? 'translate-x-6' : ''}`}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Support */}
      <div className="bg-white rounded-xl p-4 shadow-md border border-gray-200">
        <h3 className="font-bold text-gray-800 mb-4">Support</h3>
        <div className="space-y-3">
          <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="flex items-center gap-3">
              <HelpCircle className="w-5 h-5 text-gray-600" />
              <span>Hilfe & FAQ</span>
            </div>
            <span className="text-gray-400">→</span>
          </button>
          <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gray-600" />
              <span>Kontakt</span>
            </div>
            <span className="text-gray-400">→</span>
          </button>
        </div>
      </div>

      {/* Logout */}
      <button className="w-full bg-red-500 text-white py-3 rounded-xl font-semibold hover:bg-red-600 transition-colors flex items-center justify-center gap-2">
        <LogOut className="w-5 h-5" />
        Abmelden
      </button>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-md mx-auto bg-white shadow-2xl min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Profil wird geladen...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Profil - BS.Smart Braunschweig</title>
        <meta name="description" content="Ihr persönliches Profil und Statistiken in der BS.Smart App" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-md mx-auto bg-white shadow-2xl min-h-screen">
          {/* Header */}
          <div className="bg-blue-600 text-white p-4">
            <div className="flex items-center justify-between mb-4">
              <Link href="/" className="p-2 hover:bg-blue-700 rounded-lg transition-colors">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <h1 className="text-xl font-bold">Profil</h1>
              <button className="p-2 hover:bg-blue-700 rounded-lg transition-colors">
                <Settings className="w-6 h-6" />
              </button>
            </div>

            {/* Profile Header */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <Image
                  src={user?.avatar || ''}
                  alt={user?.name || ''}
                  width={80}
                  height={80}
                  className="rounded-full border-4 border-white"
                />
                <button className="absolute -bottom-1 -right-1 bg-white text-blue-600 p-1 rounded-full shadow-md">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold">{user?.name}</h2>
                <p className="text-blue-200">{user?.email}</p>
                <p className="text-blue-200 text-sm">
                  Mitglied seit {formatMemberSince(user?.joinDate || new Date())}
                </p>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="bg-white border-b border-gray-200 px-4">
            <div className="flex">
              {[
                { key: 'overview', label: 'Übersicht', icon: User },
                { key: 'achievements', label: 'Erfolge', icon: Trophy },
                { key: 'settings', label: 'Einstellungen', icon: Settings }
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key as any)}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-medium transition-colors ${
                    activeTab === key
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-4 pb-24">
            {activeTab === 'overview' && <OverviewTab />}
            {activeTab === 'achievements' && <AchievementsTab />}
            {activeTab === 'settings' && <SettingsTab />}
          </div>

          {/* Bottom Navigation */}
          <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white/95 backdrop-blur-md border-t border-gray-200 px-4 py-3 shadow-lg">
            <div className="flex justify-around items-center">
              <Link href="/" className="flex flex-col items-center gap-1 text-gray-400 hover:text-blue-500 transition-colors">
                <Home className="w-6 h-6" />
                <span className="text-xs font-medium">Home</span>
              </Link>
              
              <Link href="/navigation" className="flex flex-col items-center gap-1 text-gray-400 hover:text-blue-500 transition-colors">
                <Navigation className="w-6 h-6" />
                <span className="text-xs font-medium">Navigation</span>
              </Link>
              
              <Link href="/events" className="flex flex-col items-center gap-1 text-gray-400 hover:text-purple-500 transition-colors">
                <Calendar className="w-6 h-6" />
                <span className="text-xs font-medium">Events</span>
              </Link>
              
              <Link href="/vouchers" className="flex flex-col items-center gap-1 text-gray-400 hover:text-pink-500 transition-colors">
                <Gift className="w-6 h-6" />
                <span className="text-xs font-medium">Gutscheine</span>
              </Link>
              
              <div className="flex flex-col items-center gap-1 text-blue-500">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs font-medium">Profil</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;