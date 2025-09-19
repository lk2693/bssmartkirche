// pages/ar-tour/index.tsx
'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowLeft, Camera, MapPin, Navigation, Star, 
  Trophy, Target, Zap, Clock, Award, Map,
  Volume2, VolumeX, RotateCcw, Share2, Home,
  Compass, Eye, Crosshair, Sparkles, Crown,
  Medal, Gift, ChevronRight, Play, Pause,
  Maximize, Minimize, Settings, Info, User
} from 'lucide-react';

// Types
interface Lion {
  id: string;
  name: string;
  location: string;
  description: string;
  latitude: number;
  longitude: number;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  found: boolean;
  image: string;
  historicalInfo: string;
  clue: string;
  nearbyLandmarks: string[];
}

interface UserProgress {
  totalPoints: number;
  lionsFound: number;
  totalLions: number;
  level: number;
  currentStreak: number;
  achievements: Achievement[];
  timeSpent: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface CameraPosition {
  x: number;
  y: number;
  rotation: number;
  zoom: number;
}

const ARTourPage: React.FC = () => {
  const [currentMode, setCurrentMode] = useState<'camera' | 'map' | 'achievements'>('camera');
  const [isScanning, setIsScanning] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [cameraPosition, setCameraPosition] = useState<CameraPosition>({
    x: 0, y: 0, rotation: 0, zoom: 1
  });
  const [selectedLion, setSelectedLion] = useState<Lion | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const cameraRef = useRef<HTMLDivElement>(null);

  // Lions data for Braunschweig
  const lions: Lion[] = [
    {
      id: 'heinrich-denkmal',
      name: 'Heinrich der Löwe Denkmal',
      location: 'Burgplatz',
      description: 'Das berühmte Reiterstandbild des Stadtgründers',
      latitude: 52.2625,
      longitude: 10.5211,
      difficulty: 'easy',
      points: 100,
      found: true,
      image: 'https://images.unsplash.com/photo-1571043733612-5d2a8c7e7e1b?w=400&h=300&fit=crop',
      historicalInfo: 'Heinrich der Löwe (1129-1195) gründete Braunschweig und war einer der mächtigsten Fürsten seiner Zeit.',
      clue: 'Am historischen Marktplatz thront der Löwe über seiner Stadt.',
      nearbyLandmarks: ['Dom St. Blasii', 'Rathaus', 'Altstadtmarkt']
    },
    {
      id: 'burgplatz-löwe',
      name: 'Burgplatz Löwe',
      location: 'Burgplatz Brunnen',
      description: 'Steinerner Löwe am historischen Brunnen',
      latitude: 52.2620,
      longitude: 10.5215,
      difficulty: 'easy',
      points: 75,
      found: true,
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
      historicalInfo: 'Dieser Löwe bewacht seit Jahrhunderten den Burgplatz.',
      clue: 'Beim Plätschern des Wassers findest du den steinernen Wächter.',
      nearbyLandmarks: ['Heinrich-Denkmal', 'Burg Dankwarderode']
    },
    {
      id: 'dom-löwe',
      name: 'Dom Löwe',
      location: 'Dom St. Blasii',
      description: 'Löwensymbol an der Domfassade',
      latitude: 52.2618,
      longitude: 10.5208,
      difficulty: 'medium',
      points: 125,
      found: true,
      image: 'https://images.unsplash.com/photo-1520637736862-4d197d17c11a?w=400&h=300&fit=crop',
      historicalInfo: 'Der Dom wurde von Heinrich dem Löwen gegründet.',
      clue: 'Hoch oben an Gottes Haus wacht der steinerne Löwe.',
      nearbyLandmarks: ['Burgplatz', 'Burg Dankwarderode', 'Huneborstel']
    },
    {
      id: 'schloss-löwe',
      name: 'Schloss Richmond Löwe',
      location: 'Schloss Richmond',
      description: 'Barocker Löwe im Schlosspark',
      latitude: 52.2580,
      longitude: 10.5180,
      difficulty: 'medium',
      points: 150,
      found: false,
      image: 'https://images.unsplash.com/photo-1549144511-f099e773c147?w=400&h=300&fit=crop',
      historicalInfo: 'Das Schloss wurde 1768 erbaut und diente als Sommerresidenz.',
      clue: 'Im englischen Garten versteckt sich der Löwe zwischen den Rosen.',
      nearbyLandmarks: ['Schlosspark', 'Oker', 'Prinzenpark']
    },
    {
      id: 'rathaus-löwe',
      name: 'Rathaus Löwe',
      location: 'Altes Rathaus',
      description: 'Heraldischer Löwe am Rathaus',
      latitude: 52.2622,
      longitude: 10.5213,
      difficulty: 'hard',
      points: 200,
      found: false,
      image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop',
      historicalInfo: 'Das Rathaus stammt aus dem 13. Jahrhundert.',
      clue: 'Wo Recht gesprochen wird, hütet der Löwe die Gerechtigkeit.',
      nearbyLandmarks: ['Burgplatz', 'Martinikirche', 'Kohlmarkt']
    },
    {
      id: 'happy-rizzi-löwe',
      name: 'Happy Rizzi Löwe',
      location: 'Happy Rizzi House',
      description: 'Moderner bunter Löwe',
      latitude: 52.2640,
      longitude: 10.5225,
      difficulty: 'easy',
      points: 100,
      found: false,
      image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop',
      historicalInfo: 'Das bunte Haus wurde 2001 von James Rizzi gestaltet.',
      clue: 'Zwischen bunten Farben und fröhlichen Formen versteckt sich der Löwe.',
      nearbyLandmarks: ['Ackerhof', 'Magniviertel', 'Hauptbahnhof']
    }
  ];

  const [userProgress, setUserProgress] = useState<UserProgress>({
    totalPoints: 550,
    lionsFound: 3,
    totalLions: lions.length,
    level: 3,
    currentStreak: 2,
    achievements: [
      {
        id: 'first-lion',
        title: 'Erster Löwe',
        description: 'Deinen ersten Löwen gefunden',
        icon: '🦁',
        unlocked: true,
        unlockedAt: new Date(Date.now() - 86400000),
        rarity: 'common'
      },
      {
        id: 'history-buff',
        title: 'Geschichts-Experte',
        description: 'Alle historischen Infos gelesen',
        icon: '📚',
        unlocked: true,
        unlockedAt: new Date(Date.now() - 3600000),
        rarity: 'rare'
      },
      {
        id: 'streak-master',
        title: 'Streak-Meister',
        description: '3 Löwen an einem Tag gefunden',
        icon: '🔥',
        unlocked: false,
        rarity: 'epic'
      },
      {
        id: 'lion-king',
        title: 'Löwenkönig',
        description: 'Alle Löwen gefunden',
        icon: '👑',
        unlocked: false,
        rarity: 'legendary'
      }
    ],
    timeSpent: 1847
  });

  // Session timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSessionTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Simulate AR scanning
  const handleScan = useCallback(() => {
    setIsScanning(true);
    
    // Simulate scanning duration
    setTimeout(() => {
      setIsScanning(false);
      
      // Check if we found a lion (simulate 30% chance)
      if (Math.random() > 0.7) {
        const unfoundLions = lions.filter(lion => !lion.found);
        if (unfoundLions.length > 0) {
          const foundLion = unfoundLions[Math.floor(Math.random() * unfoundLions.length)];
          handleLionFound(foundLion);
        }
      }
    }, 3000);
  }, []);

  const handleLionFound = useCallback((lion: Lion) => {
    setSelectedLion(lion);
    setShowCelebration(true);
    
    // Update progress
    setUserProgress(prev => ({
      ...prev,
      totalPoints: prev.totalPoints + lion.points,
      lionsFound: prev.lionsFound + 1,
      currentStreak: prev.currentStreak + 1
    }));

    // Hide celebration after 3 seconds
    setTimeout(() => {
      setShowCelebration(false);
    }, 3000);
  }, []);

  const getProgressPercentage = () => {
    return (userProgress.lionsFound / userProgress.totalLions) * 100;
  };

  const getLevelProgress = () => {
    const pointsNeeded = userProgress.level * 200;
    const currentLevelPoints = userProgress.totalPoints % 200;
    return (currentLevelPoints / pointsNeeded) * 100;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Components
  const StatusBar: React.FC = () => (
    <div className="flex justify-between items-center px-4 py-3 bg-black text-white text-sm">
      <div className="flex items-center gap-2">
        <span className="font-medium">AR Tour aktiv</span>
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
      </div>
      <div className="flex items-center gap-2">
        <span>{formatTime(sessionTime)}</span>
        <div className="flex items-center gap-1">
          <div className="w-1 h-3 bg-green-400 rounded"></div>
          <div className="w-1 h-3 bg-green-400 rounded"></div>
          <div className="w-1 h-3 bg-green-400 rounded"></div>
          <div className="w-1 h-3 bg-gray-600 rounded"></div>
        </div>
      </div>
    </div>
  );

  const CameraView: React.FC = () => (
    <div className="relative h-96 bg-gradient-to-b from-blue-400 via-sky-300 to-green-300 overflow-hidden">
      {/* Simulated camera background */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&h=600&fit=crop"
          alt="Braunschweig Stadtansicht"
          fill
          className="object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
      </div>

      {/* AR Overlay Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Scanning grid */}
        {isScanning && (
          <div className="absolute inset-0 bg-blue-500/10">
            <div className="grid grid-cols-6 grid-rows-4 h-full w-full">
              {[...Array(24)].map((_, i) => (
                <div key={i} className="border border-blue-400/30 animate-pulse"></div>
              ))}
            </div>
          </div>
        )}

        {/* Found lions indicators */}
        <div className="absolute top-20 left-8 bg-black/70 backdrop-blur-sm text-white p-3 rounded-lg max-w-xs">
          <h4 className="font-bold text-sm mb-1 flex items-center gap-2">
            🏰 <span>Burgplatz erkannt</span>
          </h4>
          <p className="text-xs opacity-90">
            Historischer Marktplatz - Hier findest du das Heinrich-der-Löwe-Denkmal!
          </p>
        </div>

        {/* Distance indicator */}
        <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
          📍 45m entfernt
        </div>

        {/* AR crosshair */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="relative">
            <Crosshair className="w-12 h-12 text-white drop-shadow-lg" />
            {isScanning && (
              <div className="absolute inset-0 w-12 h-12 border-2 border-blue-400 rounded-full animate-ping"></div>
            )}
          </div>
        </div>

        {/* Lion detection */}
        {selectedLion && (
          <div className="absolute bottom-20 right-8 bg-yellow-500 text-black p-3 rounded-full animate-bounce">
            <span className="text-sm font-bold">🦁 Löwe gefunden! +{selectedLion.points} Punkte</span>
          </div>
        )}

        {/* Compass */}
        <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-full p-2">
          <Compass className="w-6 h-6 text-white" style={{ transform: `rotate(${cameraPosition.rotation}deg)` }} />
        </div>
      </div>

      {/* Camera controls */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-4">
        <button
          onClick={handleScan}
          disabled={isScanning}
          className={`w-16 h-16 rounded-full border-4 border-white flex items-center justify-center transition-all ${
            isScanning 
              ? 'bg-blue-500 scale-110 animate-pulse' 
              : 'bg-red-500 hover:bg-red-600 hover:scale-105'
          }`}
        >
          {isScanning ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <Camera className="w-8 h-8 text-white" />
          )}
        </button>
      </div>
    </div>
  );

  const MapView: React.FC = () => (
    <div className="h-96 bg-gray-200 relative overflow-hidden rounded-lg">
      {/* Map background */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&h=600&fit=crop"
          alt="Braunschweig Karte"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-blue-900/20"></div>
      </div>

      {/* Lion markers */}
      {lions.map((lion, index) => (
        <div
          key={lion.id}
          className={`absolute w-8 h-8 rounded-full border-2 border-white shadow-lg cursor-pointer transition-all hover:scale-110 ${
            lion.found ? 'bg-green-500' : 'bg-red-500'
          }`}
          style={{
            left: `${20 + index * 15}%`,
            top: `${30 + (index % 2) * 20}%`
          }}
          onClick={() => setSelectedLion(lion)}
        >
          <div className="w-full h-full flex items-center justify-center">
            {lion.found ? (
              <span className="text-white text-sm">✓</span>
            ) : (
              <span className="text-white text-sm">🦁</span>
            )}
          </div>
        </div>
      ))}

      {/* User position */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white animate-pulse"></div>
      </div>

      {/* Map legend */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3">
        <h4 className="font-bold text-sm mb-2">Legende</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Gefunden</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Noch zu finden</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Ihre Position</span>
          </div>
        </div>
      </div>
    </div>
  );

  const ProgressStats: React.FC = () => (
    <div className="bg-white rounded-xl shadow-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-800 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          Fortschritt
        </h3>
        <div className="text-sm text-gray-500">
          Level {userProgress.level}
        </div>
      </div>

      {/* Main progress */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Löwen gefunden</span>
          <span className="text-sm text-gray-600">
            {userProgress.lionsFound}/{userProgress.totalLions}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${getProgressPercentage()}%` }}
          ></div>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {Math.round(getProgressPercentage())}% abgeschlossen
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-2xl font-bold text-yellow-600">{userProgress.totalPoints.toLocaleString()}</div>
          <div className="text-xs text-gray-500">Punkte</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-orange-600">{userProgress.currentStreak}</div>
          <div className="text-xs text-gray-500">Streak</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-green-600">{formatTime(userProgress.timeSpent)}</div>
          <div className="text-xs text-gray-500">Spielzeit</div>
        </div>
      </div>
    </div>
  );

  const LionsList: React.FC = () => (
    <div className="space-y-3">
      {lions.map((lion) => (
        <div
          key={lion.id}
          className={`bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-all ${
            lion.found ? 'border-l-4 border-green-500' : 'border-l-4 border-gray-300'
          }`}
          onClick={() => setSelectedLion(lion)}
        >
          <div className="flex">
            <div className="w-20 h-20 relative">
              <Image
                src={lion.image}
                alt={lion.name}
                fill
                className={`object-cover ${!lion.found ? 'grayscale' : ''}`}
              />
              <div className="absolute top-2 left-2">
                {lion.found ? (
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                ) : (
                  <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">?</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex-1 p-3">
              <div className="flex justify-between items-start mb-1">
                <h4 className="font-semibold text-gray-800 text-sm">{lion.name}</h4>
                <div className="flex items-center gap-1">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    lion.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                    lion.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {lion.difficulty === 'easy' ? 'Einfach' :
                     lion.difficulty === 'medium' ? 'Mittel' : 'Schwer'}
                  </span>
                </div>
              </div>
              
              <p className="text-xs text-gray-600 mb-2">{lion.location}</p>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-500" />
                  <span className="text-xs text-gray-600">{lion.points} Punkte</span>
                </div>
                {!lion.found && (
                  <span className="text-xs text-blue-600 font-medium">Hinweis verfügbar</span>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const AchievementsList: React.FC = () => (
    <div className="space-y-3">
      {userProgress.achievements.map((achievement) => (
        <div
          key={achievement.id}
          className={`bg-white rounded-xl shadow-md p-4 border-l-4 ${
            achievement.unlocked 
              ? achievement.rarity === 'legendary' ? 'border-purple-500' :
                achievement.rarity === 'epic' ? 'border-blue-500' :
                achievement.rarity === 'rare' ? 'border-yellow-500' : 'border-green-500'
              : 'border-gray-300'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`text-2xl ${!achievement.unlocked ? 'grayscale' : ''}`}>
              {achievement.icon}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className={`font-semibold ${achievement.unlocked ? 'text-gray-800' : 'text-gray-500'}`}>
                  {achievement.title}
                </h4>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  achievement.rarity === 'legendary' ? 'bg-purple-100 text-purple-700' :
                  achievement.rarity === 'epic' ? 'bg-blue-100 text-blue-700' :
                  achievement.rarity === 'rare' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {achievement.rarity === 'legendary' ? 'Legendär' :
                   achievement.rarity === 'epic' ? 'Episch' :
                   achievement.rarity === 'rare' ? 'Selten' : 'Häufig'}
                </span>
              </div>
              <p className={`text-sm ${achievement.unlocked ? 'text-gray-600' : 'text-gray-400'}`}>
                {achievement.description}
              </p>
              {achievement.unlocked && achievement.unlockedAt && (
                <p className="text-xs text-gray-500 mt-1">
                  Erreicht: {achievement.unlockedAt.toLocaleDateString('de-DE')}
                </p>
              )}
            </div>
            {achievement.unlocked && (
              <div className="text-green-500">
                <Medal className="w-6 h-6" />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <>
      <Head>
        <title>AR Löwen-Trail - BS.Smart Braunschweig</title>
        <meta name="description" content="Entdecke alle Löwen in Braunschweig mit unserer AR-Tour" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-md mx-auto bg-white shadow-2xl min-h-screen">
          <StatusBar />
          
          {/* Header */}
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-4">
            <div className="flex items-center justify-between mb-3">
              <Link href="/">
                <button className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
                  <ArrowLeft className="w-6 h-6" />
                </button>
              </Link>
              
              <h1 className="text-xl font-bold">🦁 Löwen-Trail</h1>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setAudioEnabled(!audioEnabled)}
                  className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                >
                  {audioEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                </button>
                <button className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-yellow-100 text-sm">
                {userProgress.lionsFound}/{userProgress.totalLions} Löwen gefunden
              </p>
            </div>
          </div>

          {/* Mode Toggle */}
          <div className="bg-white border-b border-gray-200 px-4 py-3">
            <div className="flex rounded-lg bg-gray-100 p-1">
              <button
                onClick={() => setCurrentMode('camera')}
                className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                  currentMode === 'camera'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Camera className="w-4 h-4 mx-auto mb-1" />
                AR Kamera
              </button>
              <button
                onClick={() => setCurrentMode('map')}
                className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                  currentMode === 'map'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Map className="w-4 h-4 mx-auto mb-1" />
                Karte
              </button>
              <button
                onClick={() => setCurrentMode('achievements')}
                className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                  currentMode === 'achievements'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Trophy className="w-4 h-4 mx-auto mb-1" />
                Erfolge
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="pb-20">
            {currentMode === 'camera' && (
              <div>
                <CameraView />
                
                <div className="p-4 space-y-4">
                  <ProgressStats />
                  
                  {/* Quick Actions */}
                  <div className="bg-white rounded-xl shadow-md p-4">
                    <h3 className="font-bold text-gray-800 mb-3">Schnellaktionen</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <button className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                        <Target className="w-5 h-5 text-blue-600" />
                        <span className="text-sm font-medium text-blue-600">Hinweis</span>
                      </button>
                      <button className="flex items-center gap-2 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                        <Navigation className="w-5 h-5 text-green-600" />
                        <span className="text-sm font-medium text-green-600">Route</span>
                      </button>
                    </div>
                  </div>

                  {/* Current Target */}
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl p-4">
                    <h3 className="font-bold mb-2 flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      Nächstes Ziel
                    </h3>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">🏰</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">Schloss Richmond Löwe</h4>
                        <p className="text-blue-100 text-sm">📍 850m entfernt • 150 Punkte</p>
                      </div>
                    </div>
                    <div className="mt-3 text-sm text-blue-100">
                      💡 Tipp: "Im englischen Garten versteckt sich der Löwe zwischen den Rosen."
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="bg-white rounded-xl shadow-md p-4">
                    <h3 className="font-bold text-gray-800 mb-3">Letzte Erfolge</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-2 bg-green-50 rounded-lg">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm">🦁</span>
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-800">Dom Löwe gefunden!</div>
                          <div className="text-xs text-gray-500">vor 2 Stunden • +125 Punkte</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-2 bg-yellow-50 rounded-lg">
                        <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm">📚</span>
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-800">Achievement freigeschaltet</div>
                          <div className="text-xs text-gray-500">Geschichts-Experte erreicht</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentMode === 'map' && (
              <div className="p-4 space-y-4">
                <MapView />
                
                <div className="bg-white rounded-xl shadow-md p-4">
                  <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-blue-500" />
                    Löwen-Standorte
                  </h3>
                  <LionsList />
                </div>

                {/* Map Statistics */}
                <div className="bg-white rounded-xl shadow-md p-4">
                  <h3 className="font-bold text-gray-800 mb-3">Karten-Statistik</h3>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-green-600">2.3km</div>
                      <div className="text-xs text-gray-500">Zurückgelegt</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-600">8</div>
                      <div className="text-xs text-gray-500">Orte besucht</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentMode === 'achievements' && (
              <div className="p-4 space-y-4">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl p-4">
                  <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                    <Crown className="w-6 h-6" />
                    Ihre Erfolge
                  </h3>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold">2/4</div>
                      <div className="text-sm text-purple-100">Freigeschaltet</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">50%</div>
                      <div className="text-sm text-purple-100">Fortschritt</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">3</div>
                      <div className="text-sm text-purple-100">Level</div>
                    </div>
                  </div>
                </div>

                <AchievementsList />

                {/* Next Achievement */}
                <div className="bg-white rounded-xl shadow-md p-4 border border-orange-200">
                  <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-orange-500" />
                    Nächster Erfolg
                  </h3>
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">🔥</div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">Streak-Meister</h4>
                      <p className="text-sm text-gray-600">Finde 3 Löwen an einem Tag</p>
                      <div className="mt-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-orange-500 h-2 rounded-full" style={{width: '66%'}}></div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">2/3 Löwen heute</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Leaderboard Preview */}
                <div className="bg-white rounded-xl shadow-md p-4">
                  <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <Medal className="w-5 h-5 text-yellow-500" />
                    Bestenliste (Diese Woche)
                  </h3>
                  <div className="space-y-2">
                    {[
                      { rank: 1, name: 'LöwenKönig', points: 2847, avatar: '👑' },
                      { rank: 2, name: 'StadtExplorer', points: 1923, avatar: '🗺️' },
                      { rank: 3, name: 'Sie', points: 1847, avatar: '🦁' },
                      { rank: 4, name: 'HistoryBuff', points: 1654, avatar: '📚' }
                    ].map((player) => (
                      <div key={player.rank} className={`flex items-center gap-3 p-2 rounded-lg ${
                        player.name === 'Sie' ? 'bg-yellow-50 border border-yellow-200' : 'bg-gray-50'
                      }`}>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          player.rank === 1 ? 'bg-yellow-500 text-white' :
                          player.rank === 2 ? 'bg-gray-400 text-white' :
                          player.rank === 3 ? 'bg-orange-500 text-white' : 'bg-gray-300 text-gray-700'
                        }`}>
                          {player.rank}
                        </div>
                        <div className="text-lg">{player.avatar}</div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-800">{player.name}</div>
                          <div className="text-xs text-gray-500">{player.points.toLocaleString()} Punkte</div>
                        </div>
                        {player.name === 'Sie' && (
                          <div className="text-xs bg-yellow-500 text-white px-2 py-1 rounded-full">
                            Sie
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 text-center">
                    <Link href="/leaderboard">
                      <button className="text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors">
                        Vollständige Bestenliste anzeigen →
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Lion Detail Modal */}
          {selectedLion && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end">
              <div className="bg-white rounded-t-2xl w-full max-h-[80vh] overflow-y-auto">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-800">{selectedLion.name}</h2>
                    <button
                      onClick={() => setSelectedLion(null)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="relative h-48 rounded-xl overflow-hidden mb-4">
                    <Image
                      src={selectedLion.image}
                      alt={selectedLion.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      {selectedLion.found ? (
                        <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                          ✓ Gefunden
                        </div>
                      ) : (
                        <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                          Noch zu finden
                        </div>
                      )}
                    </div>
                    <div className="absolute top-3 right-3">
                      <div className="bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {selectedLion.points} Punkte
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">Beschreibung</h3>
                      <p className="text-gray-600 text-sm">{selectedLion.description}</p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">📍 Standort</h3>
                      <p className="text-gray-600 text-sm">{selectedLion.location}</p>
                    </div>

                    {!selectedLion.found && (
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-2">💡 Hinweis</h3>
                        <p className="text-blue-600 text-sm italic">"{selectedLion.clue}"</p>
                      </div>
                    )}

                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">🏛️ Historische Information</h3>
                      <p className="text-gray-600 text-sm">{selectedLion.historicalInfo}</p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">🗺️ In der Nähe</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedLion.nearbyLandmarks.map((landmark, index) => (
                          <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                            {landmark}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button className="flex-1 bg-blue-500 text-white py-3 rounded-xl font-medium hover:bg-blue-600 transition-colors">
                        🧭 Route anzeigen
                      </button>
                      {!selectedLion.found && (
                        <button className="flex-1 bg-green-500 text-white py-3 rounded-xl font-medium hover:bg-green-600 transition-colors">
                          📱 AR starten
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Celebration Animation */}
          {showCelebration && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center pointer-events-none">
              <div className="text-center animate-bounce">
                <div className="text-6xl mb-4">🎉</div>
                <div className="text-white text-2xl font-bold mb-2">Löwe gefunden!</div>
                <div className="text-yellow-300 text-xl">+{selectedLion?.points} Punkte</div>
              </div>
              {/* Confetti effect */}
              <div className="absolute inset-0">
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-ping"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 2}s`
                    }}
                  ></div>
                ))}
              </div>
            </div>
          )}

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
              
              <Link href="/ar-tour" className="flex flex-col items-center gap-1 text-orange-500">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <Camera className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs font-medium">AR Tour</span>
              </Link>
              
              <Link href="/vouchers" className="flex flex-col items-center gap-1 text-gray-400 hover:text-pink-500 transition-colors">
                <Gift className="w-6 h-6" />
                <span className="text-xs">Gutscheine</span>
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

export default ARTourPage;