'use client';

import { useState, useEffect, useMemo } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { 
  Car, MapPin, Search, Navigation, Home, Gift, 
  ShoppingBag, Coffee, X, Clock, Euro, Map,
  Loader, RefreshCw, ArrowLeft, Star, Heart,
  Calendar, Phone, Zap
} from 'lucide-react';

// Types
interface ParkingSpot {
  id: string;
  name: string;
  type: 'garage' | 'street';
  address: string;
  coordinates: { lat: number; lng: number };
  distance: number;
  walkingTime: number;
  availableSpaces: number;
  totalSpaces?: number;
  hourlyPrice: number;
  isOpen: boolean;
  dataSource: 'static' | 'osm' | 'live';
  rating?: number;
  features?: string[];
  amenities?: string[];
  pricing?: {
    hourly: number;
    daily?: number;
    monthly?: number;
  };
}

interface OSMStreetParking {
  id: string;
  name: string;
  geometry: Array<{ lat: number; lon: number }>;
  tags: {
    name?: string;
    highway?: string;
    'parking:lane'?: string;
    'parking:both'?: string;
    'parking:left'?: string;
    'parking:right'?: string;
    fee?: string;
    maxstay?: string;
  };
}

// OSM API Integration
class OSMParkingService {
  private static readonly OVERPASS_URL = 'https://overpass-api.de/api/interpreter';
  private static readonly BRAUNSCHWEIG_BOUNDS = {
    south: 52.2450,
    west: 10.4900,
    north: 52.2800,
    east: 10.5500
  };

  static async getStreetParkingData(): Promise<OSMStreetParking[]> {
    const { south, west, north, east } = this.BRAUNSCHWEIG_BOUNDS;
    
    const query = `
      [out:json][timeout:25];
      (
        way["highway"]["name"]["parking:lane"~"parallel|diagonal|perpendicular"](${south},${west},${north},${east});
        way["highway"]["name"]["parking:both"~"parallel|diagonal|perpendicular"](${south},${west},${north},${east});
        way["highway"]["name"]["parking:left"~"parallel|diagonal|perpendicular"](${south},${west},${north},${east});
        way["highway"]["name"]["parking:right"~"parallel|diagonal|perpendicular"](${south},${west},${north},${east});
        way["amenity"="parking"]["parking"="street_side"]["name"](${south},${west},${north},${east});
      );
      out geom;
    `;

    try {
      console.log('🗺️ Lade OSM-Daten für Braunschweig...');
      
      const response = await fetch(this.OVERPASS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: query
      });

      if (!response.ok) {
        throw new Error(`OSM API Error: ${response.status}`);
      }

      const data = await response.json();

      if (data.elements && data.elements.length > 0) {
        return data.elements
          .filter((element: any) => element.tags?.name)
          .map((element: any) => ({
            id: `osm_${element.id}`,
            name: element.tags.name,
            geometry: element.geometry || [],
            tags: element.tags
          }));
      }

      return this.getFallbackStreetData();
      
    } catch (error) {
      console.error('❌ OSM Fehler:', error);
      return this.getFallbackStreetData();
    }
  }

  private static getFallbackStreetData(): OSMStreetParking[] {
    return [
      {
        id: 'fallback_bohlweg',
        name: 'Bohlweg',
        geometry: [
          { lat: 52.2645, lon: 10.5198 },
          { lat: 52.2650, lon: 10.5210 },
          { lat: 52.2655, lon: 10.5222 }
        ],
        tags: {
          name: 'Bohlweg',
          highway: 'primary',
          'parking:both': 'parallel',
          fee: '1.50',
          maxstay: '2h'
        }
      },
      {
        id: 'fallback_damm',
        name: 'Damm',
        geometry: [
          { lat: 52.2612, lon: 10.5189 },
          { lat: 52.2618, lon: 10.5195 },
          { lat: 52.2624, lon: 10.5201 }
        ],
        tags: {
          name: 'Damm',
          highway: 'primary',
          'parking:both': 'parallel',
          fee: '1.50'
        }
      },
      {
        id: 'fallback_kohlmarkt',
        name: 'Kohlmarkt',
        geometry: [
          { lat: 52.2638, lon: 10.5201 },
          { lat: 52.2642, lon: 10.5208 },
          { lat: 52.2646, lon: 10.5215 }
        ],
        tags: {
          name: 'Kohlmarkt',
          highway: 'residential',
          'parking:both': 'parallel',
          fee: 'no'
        }
      },
      {
        id: 'fallback_wilhelmstraße',
        name: 'Wilhelmstraße',
        geometry: [
          { lat: 52.2634, lon: 10.5267 },
          { lat: 52.2639, lon: 10.5274 },
          { lat: 52.2644, lon: 10.5281 }
        ],
        tags: {
          name: 'Wilhelmstraße',
          highway: 'secondary',
          'parking:both': 'parallel',
          fee: '1.30'
        }
      },
      {
        id: 'fallback_steinweg',
        name: 'Steinweg',
        geometry: [
          { lat: 52.2621, lon: 10.5156 },
          { lat: 52.2627, lon: 10.5163 },
          { lat: 52.2633, lon: 10.5170 }
        ],
        tags: {
          name: 'Steinweg',
          highway: 'tertiary',
          'parking:right': 'parallel',
          fee: '1.00'
        }
      },
      {
        id: 'fallback_magnitorwall',
        name: 'Magnitorwall',
        geometry: [
          { lat: 52.2656, lon: 10.5234 },
          { lat: 52.2661, lon: 10.5241 },
          { lat: 52.2666, lon: 10.5248 }
        ],
        tags: {
          name: 'Magnitorwall',
          highway: 'secondary',
          'parking:right': 'diagonal',
          fee: '1.20'
        }
      },
      {
        id: 'fallback_brudern',
        name: 'Hintern Brüdern',
        geometry: [
          { lat: 52.2619, lon: 10.5178 },
          { lat: 52.2625, lon: 10.5185 },
          { lat: 52.2631, lon: 10.5192 }
        ],
        tags: {
          name: 'Hintern Brüdern',
          highway: 'tertiary',
          'parking:left': 'parallel',
          fee: '0.80'
        }
      },
      {
        id: 'fallback_vor_der_burg',
        name: 'Vor der Burg',
        geometry: [
          { lat: 52.2598, lon: 10.5189 },
          { lat: 52.2604, lon: 10.5196 },
          { lat: 52.2610, lon: 10.5203 }
        ],
        tags: {
          name: 'Vor der Burg',
          highway: 'residential',
          'parking:both': 'parallel',
          fee: 'no'
        }
      }
    ];
  }
}

// Helper Functions (bleiben gleich)
const convertOSMToParking = (osmData: OSMStreetParking[], userLocation: { lat: number; lng: number }): ParkingSpot[] => {
  return osmData.map((osm, index) => {
    const isFree = osm.tags.fee === 'no' || osm.tags.fee === 'none' || !osm.tags.fee;
    let hourlyPrice = 0;
    
    if (!isFree && osm.tags.fee) {
      const parsedFee = parseFloat(osm.tags.fee);
      hourlyPrice = !isNaN(parsedFee) ? parsedFee : 1.50;
    }

    const estimatedLength = osm.geometry.length > 1 ? 
      calculateDistance(osm.geometry[0], osm.geometry[osm.geometry.length - 1]) : 120;
    const estimatedSpaces = Math.max(5, Math.floor(estimatedLength / 5));
    
    const baseOccupancy = getStreetOccupancy(osm.name);
    const occupancyRate = Math.max(20, Math.min(75, baseOccupancy + (Math.random() * 15 - 7)));
    const availableSpaces = Math.max(1, Math.floor(estimatedSpaces * (1 - occupancyRate / 100)));

    const streetCenter = osm.geometry.length > 0 ? 
      osm.geometry[Math.floor(osm.geometry.length / 2)] : 
      { lat: userLocation.lat, lon: userLocation.lng };
    
    const distance = Math.round(calculateDistance(
      userLocation, 
      { lat: streetCenter.lat, lng: streetCenter.lon }
    ));

    return {
      id: osm.id,
      name: osm.name,
      type: 'street' as const,
      address: `${osm.name}, Braunschweig`,
      coordinates: { lat: streetCenter.lat, lng: streetCenter.lon },
      distance,
      walkingTime: Math.max(1, Math.round(distance / 80)),
      availableSpaces: availableSpaces,
      totalSpaces: estimatedSpaces,
      hourlyPrice,
      isOpen: true,
      dataSource: 'osm' as const,
      rating: Math.round((Math.random() * 2 + 3) * 10) / 10, // 3.0-5.0
      features: isFree ? ['Kostenlos'] : ['Gebührenpflichtig'],
      amenities: ['Straßenparken'],
      pricing: {
        hourly: hourlyPrice,
        daily: hourlyPrice * 8
      }
    };
  });
};

const getStreetOccupancy = (streetName: string): number => {
  const currentHour = new Date().getHours();
  let baseOccupancy = 40;

  const name = streetName.toLowerCase();
  if (name.includes('bohlweg') || name.includes('damm')) {
    baseOccupancy = 60;
  } else if (name.includes('kohlmarkt') || name.includes('alte waage')) {
    baseOccupancy = 50;
  } else if (name.includes('wilhelmstraße')) {
    baseOccupancy = 45;
  }

  if (currentHour >= 9 && currentHour <= 17) {
    baseOccupancy += 10;
  } else if (currentHour >= 18 && currentHour <= 21) {
    baseOccupancy += 5;
  } else if (currentHour >= 22 || currentHour <= 6) {
    baseOccupancy -= 15;
  }

  return Math.max(20, Math.min(70, baseOccupancy));
};

const calculateDistance = (point1: { lat: number; lng?: number; lon?: number }, point2: { lat: number; lng?: number; lon?: number }): number => {
  const lat1 = point1.lat;
  const lon1 = point1.lng || point1.lon || 0;
  const lat2 = point2.lat;
  const lon2 = point2.lng || point2.lon || 0;

  const R = 6371000;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Konvertiere API-Daten zu unserem ParkingSpot Format
const convertOfficialDataToParkingSpots = (parkingData: any[]): ParkingSpot[] => {
  const baseLocation = { lat: 52.2632, lng: 10.5200 }; // Braunschweig Zentrum
  
  // Prüfe, ob es sich um GeoJSON-Features oder direkte Parking-Daten handelt
  return parkingData.map((item, index) => {
    // Wenn es ein GeoJSON Feature ist, extrahiere properties
    const data = item.properties ? item.properties : item;
    const geometry = item.geometry;
    
    // Sichere Behandlung der Koordinaten
    let coordinates = { lat: 52.2632, lng: 10.5200 }; // Fallback zu Braunschweig Zentrum
    
    if (data.coordinates) {
      // Direkte Koordinaten in unserem Format
      coordinates = data.coordinates;
    } else if (geometry && geometry.coordinates && Array.isArray(geometry.coordinates)) {
      // GeoJSON Format [lng, lat]
      const coords = geometry.coordinates;
      coordinates = { 
        lat: parseFloat(coords[1]) || 52.2632, 
        lng: parseFloat(coords[0]) || 10.5200 
      };
    }
    
    const distance = calculateDistance(coordinates, baseLocation);
    
    // Verwende die Daten direkt von unserer API oder aus GeoJSON
    const totalSpaces = data.totalSpaces || data.capacity || 0;
    const availableSpaces = data.availableSpaces || data.free || 0;
    const occupancyRate = data.occupancyRate || 0;
    
    // Features basierend auf den Daten
    const features = [];
    if (data.openingState === 'open' || data.isOpen) features.push('Geöffnet');
    if (data.subTypes?.includes('shortterm')) features.push('Kurzzeitparken');
    if (data.subTypes?.includes('longterm')) features.push('Langzeitparken');
    if (data.trend) features.push(`Trend: ${data.trend}`);
    if (occupancyRate) features.push(`${occupancyRate}% belegt`);
    
    // Extrahiere Preise aus der Beschreibung oder verwende vorhandene Preise
    let hourlyPrice = data.hourlyPrice || data.pricePerHour || data.price || 1.50;
    if (data.description && !hourlyPrice) {
      const priceMatch = data.description.match(/(\d+[,.]?\d*)\s*(?:EUR|€)/);
      if (priceMatch) {
        hourlyPrice = parseFloat(priceMatch[1].replace(',', '.'));
      }
    }
    
    return {
      id: data.id || data.externalId || item.id || `parking_${data.name?.replace(/\s+/g, '_').toLowerCase()}_${index}`,
      name: data.name || data.title || `Parkhaus ${index + 1}`,
      type: data.type || 'garage',
      address: data.address || (data.description ? extractAddress(data.description) : 'Braunschweig'),
      coordinates: coordinates,
      distance: Math.round(distance),
      walkingTime: Math.max(1, Math.round(distance / 70)), // ~4.2 km/h Gehgeschwindigkeit
      availableSpaces: availableSpaces,
      totalSpaces: totalSpaces,
      hourlyPrice: hourlyPrice,
      isOpen: data.isOpen || data.openingState === 'open',
      dataSource: data.dataSource || 'live',
      rating: data.rating || Math.round((Math.random() * 1.5 + 3.5) * 10) / 10, // 3.5-5.0
      features: data.features || features,
      amenities: data.amenities || ['Echtzeitdaten', 'Überdacht', 'Offiziell'],
      pricing: data.pricing || {
        hourly: hourlyPrice,
        daily: hourlyPrice * 8,
        monthly: undefined
      },
      source: data.source || 'api',
      trend: data.trend || (occupancyRate > 80 ? 'increasing' : occupancyRate < 30 ? 'decreasing' : 'stable'),
      maxHeight: data.maxHeight || 2.0,
      hasDisabledSpaces: data.hasDisabledSpaces || false,
      hasElectricCharging: data.hasElectricCharging || false,
      openingHours: data.openingHours || '24/7',
      occupancyRate: occupancyRate,
      lastUpdate: data.lastUpdate || data.timestamp || new Date().toISOString()
    };
  }).filter(spot => spot !== null); // Remove null entries
};

// Hilfsfunktion zum Extrahieren der Adresse aus der HTML-Beschreibung
const extractAddress = (description: string): string => {
  // Extrahiere Adresse aus HTML-Beschreibung
  const addressMatch = description.match(/<span class="cnw_skip_translation">\s*([^<]+)\s*<\/span>/);
  if (addressMatch) {
    return addressMatch[1].trim() + ', 38100 Braunschweig';
  }
  return 'Braunschweig';
};

// Hauptkomponente mit Navigation-Layout
const ParkingPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('Alle');
  const [sortBy, setSortBy] = useState('distance');
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null);
  const [favoriteSpots, setFavoriteSpots] = useState<string[]>([]);
  const [streetParking, setStreetParking] = useState<ParkingSpot[]>([]);
  const [osmLoading, setOsmLoading] = useState(false);
  const [osmLoaded, setOsmLoaded] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [showReservation, setShowReservation] = useState(false);
  
  // Neue States für Parkplatzdaten-API
  const [realTimeParkingData, setRealTimeParkingData] = useState<any[]>([]);
  const [parkingDataLoading, setParkingDataLoading] = useState(false);
  const [parkingDataError, setParkingDataError] = useState<string | null>(null);
  const [cacheInfo, setCacheInfo] = useState<any>(null);

  // Helper functions for parsing GeoJSON data
  const extractAddress = (description: string): string => {
    if (!description) return 'Braunschweig';
    
    // Extract address from HTML description
    const addressMatch = description.match(/<span class="cnw_skip_translation">\s*([^<]+)\s*<\/span>/);
    if (addressMatch && addressMatch[1]) {
      return `${addressMatch[1]}, 38100 Braunschweig`;
    }
    
    return 'Braunschweig';
  };

  const extractPrice = (description: string): number => {
    if (!description) return 2.0;
    
    // Extract price from description (various formats)
    const pricePatterns = [
      /(\d+,\d+)\s*EUR?\s*\/?\s*Std/i,
      /(\d+,\d+)\s*€\s*\/?\s*Std/i,
      /(\d+\.\d+)\s*EUR?\s*\/?\s*Std/i,
      /erste\s+Stunde\s+(\d+,\d+)\s*EUR/i
    ];
    
    for (const pattern of pricePatterns) {
      const match = description.match(pattern);
      if (match && match[1]) {
        return parseFloat(match[1].replace(',', '.'));
      }
    }
    
    return 2.0; // Default price
  };

  const extractFeatures = (description: string): string[] => {
    if (!description) return [];
    
    const features: string[] = [];
    
    // Check for various features
    if (description.includes('Behindertenparkplätze') || description.includes('Behindertenstellplätze')) {
      features.push('Behindertenparkplätze');
    }
    if (description.includes('Frauenparkplätze')) {
      features.push('Frauenparkplätze');
    }
    if (description.includes('Mutter-Kind')) {
      features.push('Mutter-Kind-Parkplätze');
    }
    if (description.includes('24 Stunden') || description.includes('24:00')) {
      features.push('24h geöffnet');
    }
    if (description.includes('EC-Karte') || description.includes('Kartenzahlung')) {
      features.push('Kartenzahlung');
    }
    if (description.includes('Ladepunkte') || description.includes('E-Kfz')) {
      features.push('E-Auto Ladestation');
    }
    
    return features;
  };

  const [userLocation, setUserLocation] = useState({ lat: 52.2625, lng: 10.5211 }); // Fallback: Braunschweig Zentrum
  const [locationPermission, setLocationPermission] = useState<'pending' | 'granted' | 'denied'>('pending');
  const [isLocationLoading, setIsLocationLoading] = useState(false);

  // Geolokalisierungs-Funktionen
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      console.log('Geolocation wird von diesem Browser nicht unterstützt');
      setLocationPermission('denied');
      return;
    }

    setIsLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setUserLocation(newLocation);
        setLocationPermission('granted');
        setIsLocationLoading(false);
        console.log('Standort aktualisiert:', newLocation);
      },
      (error) => {
        console.error('Fehler beim Abrufen der Position:', error);
        setLocationPermission('denied');
        setIsLocationLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    );
  };



  // Beim Laden der Komponente Standort abrufen
  useEffect(() => {
    if (locationPermission === 'pending') {
      setIsLocationLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(newLocation);
          setLocationPermission('granted');
          setIsLocationLoading(false);
        },
        (error) => {
          console.error('Standort-Fehler:', error);
          setLocationPermission('denied');
          setIsLocationLoading(false);
          if (error.code === 1) {
            console.log('Standort-Berechtigung verweigert');
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        }
      );
    }
  }, [locationPermission]);

  // Echtzeitdaten von der GeoJSON API laden (echte Live-Daten)
  const loadRealTimeParkingData = async () => {
    setParkingDataLoading(true);
    setParkingDataError(null);
    
    try {
      // Use the new GeoJSON API with real live data from Braunschweig
      const response = await fetch('/api/parking-geojson');
      
      if (response.ok) {
        const parkingData = await response.json();
        if (parkingData.success && parkingData.items) {
          // Transform GeoJSON items to our format
          const transformedData = parkingData.items.map((item: any) => ({
            id: item.id,
            name: item.name || 'Unbekanntes Parkhaus',
            type: 'garage' as const,
            address: item.raw?.description ? extractAddress(item.raw.description) : 'Braunschweig',
            coordinates: { lat: item.lat, lng: item.lon },
            distance: calculateDistance(userLocation, { lat: item.lat, lng: item.lon }),
            walkingTime: Math.ceil(calculateDistance(userLocation, { lat: item.lat, lng: item.lon }) * 12), // ~12 min per km
            availableSpaces: item.raw?.free || 0,
            totalSpaces: item.raw?.capacity || 100,
            hourlyPrice: extractPrice(item.raw?.description) || 2.0,
            isOpen: item.raw?.openingState === 'open' || true,
            dataSource: 'live' as const,
            rating: 4.2,
            features: extractFeatures(item.raw?.description),
            occupancyRate: item.raw?.occupancyRate || 0,
            trend: item.raw?.trend || 'constant',
            lastUpdated: item.raw?.timestamp || new Date().toISOString()
          }));
          
          setRealTimeParkingData(transformedData);
          setCacheInfo({
            lastUpdate: parkingData.updatedAt,
            totalFeatures: parkingData.count,
            dataSource: 'geojson-live-api',
            updateInterval: '15 minutes'
          });
          console.log(`✅ Live GeoJSON Daten geladen: ${transformedData.length} Parkhäuser (echte Live-Daten)`);
        } else {
          throw new Error(parkingData.reason || 'Fehler beim Laden der GeoJSON Daten');
        }
      } else {
        throw new Error(`GeoJSON API Fehler: ${response.status}`);
      }
    } catch (error) {
      console.error('❌ Fehler beim Laden der GeoJSON Daten:', error);
      setParkingDataError(error instanceof Error ? error.message : 'Unbekannter Fehler');
      
      // Enhanced Fallback mit Smart API
      try {
        console.log('🔄 Fallback: Versuche Smart Parking API...');
        const fallbackResponse = await fetch('/api/parking-smart');
        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json();
          if (fallbackData.success && fallbackData.data) {
            setRealTimeParkingData(fallbackData.data);
            setCacheInfo(fallbackData.metadata);
            console.log('✅ Fallback erfolgreich: Smart API verwendet');
            return;
          }
        }
      } catch (fallbackError) {
        console.error('❌ Auch Fallback-API fehlgeschlagen:', fallbackError);
      }
      
      // Ultimate Fallback mit realistischen Daten
      setRealTimeParkingData([
        {
          id: 'fallback_eiermarkt',
          name: 'Parkhaus Eiermarkt',
          type: 'garage',
          address: 'Güldenstraße 70, 38100 Braunschweig',
          coordinates: { lat: 52.2615, lng: 10.5154 },
          distance: 0.5,
          walkingTime: 6,
          availableSpaces: Math.floor(Math.random() * 80) + 20,
          totalSpaces: 255,
          hourlyPrice: 1.5,
          isOpen: true,
          dataSource: 'static'
        }
      ]);
    } finally {
      setParkingDataLoading(false);
    }
  };

  // Auto-refresh every 1 minute for live GeoJSON data
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('🔄 Auto-refreshing live parking data...');
      loadRealTimeParkingData();
    }, 1 * 60 * 1000); // 1 minute for live data

    return () => clearInterval(interval);
  }, []);

  // OSM Daten laden
  const loadOSMData = async () => {
    setOsmLoading(true);
    try {
      const osmStreets = await OSMParkingService.getStreetParkingData();
      const parkingSpots = convertOSMToParking(osmStreets, userLocation);
      
      const availableParking = parkingSpots.filter(spot => spot.availableSpaces > 0);
      
      setStreetParking(availableParking);
      setOsmLoaded(true);
      setLastUpdate(new Date());
      
      console.log(`✅ ${availableParking.length} verfügbare Straßenparkplätze geladen`);
    } catch (error) {
      console.error('❌ Fehler beim Laden der OSM-Daten:', error);
    } finally {
      setOsmLoading(false);
    }
  };

  useEffect(() => {
    loadOSMData();
    loadRealTimeParkingData();
  }, []);

  // Alle Parkplätze kombinieren mit echten Entfernungen
  const parkingSpots = useMemo(() => {
    // Nutze nur die echten API-Daten von parking-vercel, keine statischen Daten mehr
    const scrapedSpots = convertOfficialDataToParkingSpots(realTimeParkingData);
    
    if (scrapedSpots.length === 0) {
      console.warn('Keine API-Daten verfügbar, nutze Street Parking als Fallback');
      return streetParking;
    }
    
    // Sortiere nach Entfernung und nehme nur die besten Spots
    const sortedSpots = scrapedSpots.sort((a, b) => a.distance - b.distance);
    
    return sortedSpots;
  }, [streetParking, userLocation, realTimeParkingData]);

  // Gefilterte und sortierte Parkplätze (Navigation-Style)
  const filteredAndSortedSpots = useMemo(() => {
    let filtered = parkingSpots;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(spot =>
        spot.name.toLowerCase().includes(query) ||
        spot.address.toLowerCase().includes(query) ||
        spot.features?.some((feature: string) => feature.toLowerCase().includes(query))
      );
    }

    if (selectedFilter !== 'Alle') {
      if (selectedFilter === 'Verfügbar') {
        filtered = filtered.filter(spot => spot.availableSpaces > 5);
      } else if (selectedFilter === 'Parkhäuser') {
        filtered = filtered.filter(spot => spot.type === 'garage');
      } else if (selectedFilter === 'Straßenparkplätze') {
        filtered = filtered.filter(spot => spot.type === 'street');
      } else if (selectedFilter === 'Kostenlos') {
        filtered = filtered.filter(spot => spot.hourlyPrice === 0);
      } else if (selectedFilter === 'Favoriten') {
        filtered = filtered.filter(spot => favoriteSpots.includes(spot.id));
      }
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'distance': return a.distance - b.distance;
        case 'availability': return b.availableSpaces - a.availableSpaces;
        case 'price': return a.hourlyPrice - b.hourlyPrice;
        case 'rating': return (b.rating || 0) - (a.rating || 0);
        default: return 0;
      }
    });

    return filtered;
  }, [parkingSpots, searchQuery, selectedFilter, sortBy, favoriteSpots]);

  // Helper Functions
  const toggleFavorite = (spotId: string) => {
    setFavoriteSpots(prev => 
      prev.includes(spotId) 
        ? prev.filter(id => id !== spotId)
        : [...prev, spotId]
    );
  };

  const getAvailabilityColor = (available: number, total?: number) => {
    if (total) {
      const ratio = available / total;
      if (ratio > 0.3) return 'text-green-600';
      if (ratio > 0.1) return 'text-yellow-600';
      return 'text-red-600';
    }
    return available > 5 ? 'text-green-600' : available > 0 ? 'text-yellow-600' : 'text-red-600';
  };

  const getSpotIcon = (type: string) => type === 'garage' ? '🏢' : '🛣️';

  // Helper function für Google Maps Navigation
  const openGoogleMapsNavigation = (coordinates: { lat: number; lng: number }, name: string) => {
    const { lat, lng } = coordinates;
    const destination = encodeURIComponent(`${name}, Braunschweig`);
    
    // Erstelle Google Maps URL für Navigation
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${destination}&travelmode=driving`;
    
    // Fallback URL wenn der obere nicht funktioniert
    const fallbackUrl = `https://maps.google.com/?q=${lat},${lng}`;
    
    try {
      // Öffne Google Maps in neuem Tab/Fenster
      window.open(googleMapsUrl, '_blank');
    } catch (error) {
      console.error('Fehler beim Öffnen von Google Maps:', error);
      // Fallback: Öffne einfache Maps URL
      window.open(fallbackUrl, '_blank');
    }
  };

  // Components - Navigation-Style
  const ParkingSpotCard = ({ spot }: { spot: ParkingSpot }) => (
    <div 
      className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-all cursor-pointer border-l-4 border-blue-500"
      onClick={() => setSelectedSpot(spot)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <span className="text-xl">{getSpotIcon(spot.type)}</span>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-800 mb-1">{spot.name}</h3>
            <p className="text-sm text-gray-600 mb-2">{spot.address}</p>
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{spot.distance}m</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{spot.walkingTime} Min</span>
              </div>
              {spot.rating && (
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span>{spot.rating}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(spot.id);
          }}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <Heart className={`w-5 h-5 ${favoriteSpots.includes(spot.id) ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-3">
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <div className={`text-lg font-bold ${getAvailabilityColor(spot.availableSpaces, spot.totalSpaces)}`}>
            {spot.availableSpaces}
          </div>
          <div className="text-xs text-gray-600">
            {spot.totalSpaces ? `von ${spot.totalSpaces}` : 'frei'}
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-blue-600">
            {spot.hourlyPrice === 0 ? 'Frei' : `€${spot.hourlyPrice}`}
          </div>
          <div className="text-xs text-gray-600">
            {spot.hourlyPrice === 0 ? '' : 'pro Stunde'}
          </div>
        </div>
      </div>

      {spot.features && spot.features.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {spot.features.slice(0, 3).map((feature) => (
            <span
              key={feature}
              className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs"
            >
              {feature}
            </span>
          ))}
          {spot.features.length > 3 && (
            <span className="text-xs text-gray-500">+{spot.features.length - 3} weitere</span>
          )}
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            openGoogleMapsNavigation(spot.coordinates, spot.name);
          }}
          className="flex-1 bg-blue-500 text-white py-2 px-3 rounded-lg text-sm hover:bg-blue-600 transition-colors flex items-center justify-center gap-1"
        >
          <Navigation className="w-4 h-4" />
          Navigation
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowReservation(true);
          }}
          className="flex-1 bg-green-500 text-white py-2 px-3 rounded-lg text-sm hover:bg-green-600 transition-colors flex items-center justify-center gap-1"
          disabled={spot.availableSpaces === 0}
        >
          <Calendar className="w-4 h-4" />
          Reservieren
        </button>
      </div>

      {spot.dataSource === 'osm' && (
        <div className="mt-2 text-xs text-gray-500 text-center">
          🗺️ OpenStreetMap Daten
        </div>
      )}
    </div>
  );

  // Detail Modal - Navigation-Style
  const ParkingSpotDetail = () => {
    if (!selectedSpot) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end">
        <div className="bg-white rounded-t-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="relative">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
              <button
                onClick={() => setSelectedSpot(null)}
                className="absolute top-4 right-4 bg-white/20 text-white p-2 rounded-full hover:bg-white/30 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">{getSpotIcon(selectedSpot.type)}</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{selectedSpot.name}</h2>
                  <p className="text-blue-100">{selectedSpot.address}</p>
                  {selectedSpot.rating && (
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-blue-100">{selectedSpot.rating}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="p-4">
            <div className="bg-gray-50 p-4 rounded-xl mb-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className={`text-2xl font-bold ${getAvailabilityColor(selectedSpot.availableSpaces, selectedSpot.totalSpaces)}`}>
                    {selectedSpot.availableSpaces}
                  </div>
                  <div className="text-sm text-gray-600">
                    {selectedSpot.totalSpaces ? `von ${selectedSpot.totalSpaces}` : 'frei'}
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {selectedSpot.hourlyPrice === 0 ? 'Frei' : `€${selectedSpot.hourlyPrice}`}
                  </div>
                  <div className="text-sm text-gray-600">
                    {selectedSpot.hourlyPrice === 0 ? '' : 'pro Stunde'}
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-800">{selectedSpot.walkingTime}</div>
                  <div className="text-sm text-gray-600">Min zu Fuß</div>
                </div>
              </div>
            </div>

            {selectedSpot.pricing && (
              <div className="bg-blue-50 p-4 rounded-xl mb-4">
                <h4 className="font-semibold text-blue-800 mb-2">Preise</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex justify-between">
                    <span>Stunde:</span>
                    <span className="font-medium">€{selectedSpot.pricing.hourly}</span>
                  </div>
                  {selectedSpot.pricing.daily && (
                    <div className="flex justify-between">
                      <span>Tag:</span>
                      <span className="font-medium">€{selectedSpot.pricing.daily}</span>
                    </div>
                  )}
                  {selectedSpot.pricing.monthly && (
                    <div className="flex justify-between">
                      <span>Monat:</span>
                      <span className="font-medium">€{selectedSpot.pricing.monthly}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="space-y-4 mb-6">
              {selectedSpot.features && selectedSpot.features.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Ausstattung</h4>
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
              )}

              {selectedSpot.amenities && selectedSpot.amenities.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Services</h4>
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
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => openGoogleMapsNavigation(selectedSpot.coordinates, selectedSpot.name)}
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
          </div>
        </div>
      </div>
    );
  };

  // Reservierungs-Modal
  const ReservationModal = () => {
    if (!showReservation) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl w-full max-w-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-800">Parkplatz reservieren</h3>
            <button
              onClick={() => setShowReservation(false)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ankunftszeit
              </label>
              <input
                type="datetime-local"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Parkdauer
              </label>
              <select className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>1 Stunde</option>
                <option>2 Stunden</option>
                <option>4 Stunden</option>
                <option>Ganzer Tag</option>
              </select>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex justify-between text-sm">
                <span>Geschätzte Kosten:</span>
                <span className="font-semibold">€{selectedSpot?.hourlyPrice || 0}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowReservation(false)}
                className="bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Abbrechen
              </button>
              <button
                onClick={() => {
                  alert('Reservierung erfolgreich!');
                  setShowReservation(false);
                  setSelectedSpot(null);
                }}
                className="bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
              >
                Reservieren
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Head>
        <title>Parking - BS.Smart Braunschweig</title>
        <meta name="description" content="Finden Sie freie Parkplätze in Braunschweig mit OpenStreetMap Integration" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-md mx-auto bg-white shadow-2xl min-h-screen">
          {/* Header - Navigation Style */}
          <div className="bg-blue-600 text-white p-4">
            <div className="flex items-center justify-between mb-4">
              <Link href="/" className="p-2 hover:bg-blue-700 rounded-lg transition-colors">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <h1 className="text-xl font-bold">Parking</h1>
              <button
                onClick={() => {
                  loadOSMData();
                  loadRealTimeParkingData();
                }}
                disabled={osmLoading || parkingDataLoading}
                className="p-2 hover:bg-blue-700 rounded-lg transition-colors"
              >
                {(osmLoading || parkingDataLoading) ? (
                  <Loader className="w-6 h-6 animate-spin" />
                ) : (
                  <RefreshCw className="w-6 h-6" />
                )}
              </button>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-300" />
              <input
                type="text"
                placeholder="Parkplatz suchen..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-12 py-3 bg-blue-500/30 border border-blue-400 rounded-xl placeholder-blue-200 text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
              />
              <button
                onClick={getCurrentLocation}
                disabled={isLocationLoading}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-white/20 disabled:opacity-50"
                title="Standort aktualisieren"
              >
                {isLocationLoading ? (
                  <div className="w-5 h-5 border-2 border-blue-300 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <MapPin className="w-5 h-5 text-blue-300" />
                )}
              </button>
            </div>
            
            {/* Location Status */}
            {locationPermission === 'granted' && (
              <div className="mt-3 flex items-center text-sm text-blue-200">
                <MapPin className="w-4 h-4 mr-1 text-green-400" />
                Standort gefunden - Entfernungen werden berechnet
              </div>
            )}
            {locationPermission === 'denied' && (
              <div className="mt-3 flex items-center text-sm text-orange-200">
                <MapPin className="w-4 h-4 mr-1 text-orange-400" />
                Standort nicht verfügbar - Verwende Braunschweig Zentrum
              </div>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="bg-white border-b border-gray-200 px-4 pt-4">
            <div className="flex gap-2 overflow-x-auto pb-4">
              {['Alle', 'Verfügbar', 'Parkhäuser', 'Straßenparkplätze', 'Kostenlos', 'Favoriten'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${
                    selectedFilter === filter
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Sort Options */}
          <div className="bg-white border-b border-gray-200 px-4 py-3">
            <div className="flex gap-2 overflow-x-auto">
              {[
                { key: 'distance', label: 'Entfernung', icon: MapPin },
                { key: 'availability', label: 'Verfügbarkeit', icon: Car },
                { key: 'price', label: 'Preis', icon: Euro },
                { key: 'rating', label: 'Bewertung', icon: Star }
              ].map((sort) => {
                const Icon = sort.icon;
                return (
                  <button
                    key={sort.key}
                    onClick={() => setSortBy(sort.key)}
                    className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      sortBy === sort.key
                        ? 'bg-blue-100 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {sort.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Stats */}
          <div className="bg-white px-4 py-3 border-b border-gray-200">
            <div className="grid grid-cols-4 gap-2 text-center">
              <div>
                <div className="text-xl font-bold text-green-600">
                  {parkingSpots.reduce((sum, spot) => sum + spot.availableSpaces, 0)}
                </div>
                <div className="text-xs text-gray-600">Freie Plätze</div>
              </div>
              <div>
                <div className="text-xl font-bold text-blue-600">
                  {parkingSpots.length > 0 ? Math.min(...parkingSpots.map(s => s.hourlyPrice)).toFixed(2) : '0.00'}
                </div>
                <div className="text-xs text-gray-600">Ab €/h</div>
              </div>
              <div>
                <div className="text-xl font-bold text-orange-600">
                  {realTimeParkingData.length}
                </div>
                <div className="text-xs text-gray-600">Live Plätze</div>
              </div>
              <div>
                <div className="text-xl font-bold text-purple-600">
                  {favoriteSpots.length}
                </div>
                <div className="text-xs text-gray-600">Favoriten</div>
              </div>
            </div>
            
            {/* Status für Parkplatzdaten */}
            {(parkingDataLoading || parkingDataError || cacheInfo) && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                {parkingDataLoading && (
                  <div className="flex items-center gap-2 text-sm text-blue-600">
                    <Loader className="w-4 h-4 animate-spin" />
                    Parkplatzdaten werden geladen...
                  </div>
                )}
                
                {parkingDataError && (
                  <div className="text-sm text-red-600">
                    ⚠️ Fehler beim Laden der Parkplatzdaten: {parkingDataError}
                  </div>
                )}
                
                {cacheInfo && !parkingDataLoading && (
                  <div className="text-xs text-gray-500">
                    Letztes Update: {cacheInfo.cache_age_minutes} Min. ago
                    {cacheInfo.is_stale && ' (Daten veraltet)'}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4 pb-24">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-800">
                {searchQuery ? 'Suchergebnisse' : 'Parkplätze in der Nähe'}
              </h2>
              <span className="text-sm text-gray-500">
                {filteredAndSortedSpots.length} gefunden
              </span>
            </div>

            {filteredAndSortedSpots.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {filteredAndSortedSpots.map((spot) => (
                  <ParkingSpotCard key={spot.id} spot={spot} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Car className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">Keine Parkplätze gefunden</h3>
                <p className="text-gray-500">Versuchen Sie andere Suchbegriffe oder Filter</p>
              </div>
            )}
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
              
              <Link href="/shopping" className="flex flex-col items-center gap-1 text-gray-400 hover:text-orange-500 transition-colors">
                <ShoppingBag className="w-6 h-6" />
                <span className="text-xs font-medium">Shopping</span>
              </Link>
              
              <Link href="/vouchers" className="flex flex-col items-center gap-1 text-gray-400 hover:text-pink-500 transition-colors">
                <Gift className="w-6 h-6" />
                <span className="text-xs font-medium">Gutscheine</span>
              </Link>
              
              <div className="flex flex-col items-center gap-1 text-blue-500">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <Car className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs font-medium">Parking</span>
              </div>
            </div>
          </div>

          {/* Modals */}
          {selectedSpot && <ParkingSpotDetail />}
          {showReservation && <ReservationModal />}
        </div>
      </div>
    </>
  );
};

export default ParkingPage;