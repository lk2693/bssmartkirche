// Intelligente Parking API mit Web Scraping und Smart Fallbacks
import fs from 'fs';
import path from 'path';

// Helper function für Duplikat-Entfernung
function removeDuplicates(parkingSpots) {
  const seen = new Map();
  const result = [];
  
  for (const spot of parkingSpots) {
    const normalizedName = spot.name.toLowerCase().trim();
    let isDuplicate = false;
    
    for (const [existingName, existingSpot] of seen.entries()) {
      if (calculateSimilarity(normalizedName, existingName) > 0.8) {
        isDuplicate = true;
        if (spot.totalSpaces > existingSpot.totalSpaces || 
            (spot.dataSource === 'live' && existingSpot.dataSource !== 'live')) {
          const index = result.findIndex(r => r.id === existingSpot.id);
          if (index !== -1) {
            result[index] = spot;
            seen.set(normalizedName, spot);
          }
        }
        break;
      }
    }
    
    if (!isDuplicate) {
      seen.set(normalizedName, spot);
      result.push(spot);
    }
  }
  
  return result;
}

function calculateSimilarity(str1, str2) {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  
  if (longer.length === 0) return 1.0;
  
  const distance = levenshteinDistance(longer, shorter);
  return (longer.length - distance) / longer.length;
}

function levenshteinDistance(str1, str2) {
  const matrix = [];
  
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  
  return matrix[str2.length][str1.length];
}

// Web Scraping der Braunschweig Stadtplan-Seite
async function scrapeParkingFromWebsite() {
  try {
    console.log('🌐 Scraping parking data from braunschweig.de/plan...');
    
    const response = await fetch('https://www.braunschweig.de/plan/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'de-DE,de;q=0.9,en;q=0.8',
        'Cache-Control': 'no-cache'
      },
      timeout: 10000 // 10 second timeout
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const html = await response.text();
    
    // Suche nach Parking-Daten im HTML (verschiedene Methoden)
    let parkingData = null;
    
    // Methode 1: Suche nach JSON-Daten in Script-Tags
    const jsonMatches = html.match(/parking[^=]*=\s*(\{[^<]+\})/gi);
    if (jsonMatches) {
      for (const match of jsonMatches) {
        try {
          const jsonStr = match.split('=')[1].trim();
          const data = JSON.parse(jsonStr);
          if (data.features && Array.isArray(data.features)) {
            parkingData = data;
            break;
          }
        } catch (e) {
          continue;
        }
      }
    }
    
    // Methode 2: Suche nach geojson oder parking im Text
    if (!parkingData) {
      const geoJsonMatches = html.match(/\{[^}]*"type"\s*:\s*"FeatureCollection"[^}]*"features"[^}]*\}/gi);
      if (geoJsonMatches) {
        for (const match of geoJsonMatches) {
          try {
            const data = JSON.parse(match);
            if (data.features && Array.isArray(data.features)) {
              parkingData = data;
              break;
            }
          } catch (e) {
            continue;
          }
        }
      }
    }
    
    if (parkingData && parkingData.features && parkingData.features.length > 0) {
      console.log(`✅ Scraped ${parkingData.features.length} parking spots from website`);
      
      // Cache die Daten lokal
      const scrapedDataPath = path.join(process.cwd(), 'data', 'scraped-parking-data.json');
      const cacheData = {
        ...parkingData,
        scrapedAt: new Date().toISOString(),
        source: 'website-scraping'
      };
      
      // Ensure data directory exists
      const dataDir = path.dirname(scrapedDataPath);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      
      fs.writeFileSync(scrapedDataPath, JSON.stringify(cacheData, null, 2));
      
      return cacheData;
    }
    
    throw new Error('No parking data found in scraped content');
  } catch (error) {
    console.error('❌ Website scraping failed:', error.message);
    return null;
  }
}

// Smart Parking Data mit verschiedenen Quellen und Simulierten Live-Updates
function generateSmartParkingData() {
  const baseTime = new Date();
  const hour = baseTime.getHours();
  
  // Realistische Parkhäuser mit zeitabhängigen Mustern
  const parkingHouses = [
    {
      name: 'Parkhaus Schützenstraße',
      capacity: 366,
      coordinates: [10.519732, 52.263712],
      pattern: 'business', // Geschäftsviertel
      externalId: 'PH_SCHUETZENSTR'
    },
    {
      name: 'Parkhaus Eiermarkt',
      capacity: 255,
      coordinates: [10.515398, 52.261492],
      pattern: 'shopping', // Einkaufsbereich
      externalId: 'PH_EIERMARKT'
    },
    {
      name: 'Parkhaus Lange Str. Süd',
      capacity: 152,
      coordinates: [10.518295, 52.266286],
      pattern: 'mixed', // Gemischt
      externalId: 'PH_LANGE_SUED'
    },
    {
      name: 'Parkhaus Magni',
      capacity: 420,
      coordinates: [10.526942, 52.262162],
      pattern: 'shopping', // Großer Einkaufsbereich
      externalId: 'PH_MAGNI'
    },
    {
      name: 'Parkhaus Stadtmitte',
      capacity: 180,
      coordinates: [10.521234, 52.264567],
      pattern: 'business',
      externalId: 'PH_STADTMITTE'
    }
  ];
  
  const features = parkingHouses.map((house, index) => {
    let occupancyRate;
    
    // Zeitabhängige Belegung basierend auf Pattern
    switch (house.pattern) {
      case 'business':
        if (hour >= 8 && hour <= 17) {
          occupancyRate = 0.7 + Math.random() * 0.25; // 70-95% tagsüber
        } else {
          occupancyRate = 0.2 + Math.random() * 0.3; // 20-50% abends
        }
        break;
      case 'shopping':
        if (hour >= 10 && hour <= 20) {
          occupancyRate = 0.6 + Math.random() * 0.3; // 60-90% Einkaufszeiten
        } else {
          occupancyRate = 0.1 + Math.random() * 0.2; // 10-30% andere Zeiten
        }
        break;
      case 'mixed':
        occupancyRate = 0.4 + Math.random() * 0.4; // 40-80% konstant
        break;
      default:
        occupancyRate = 0.3 + Math.random() * 0.5; // 30-80% default
    }
    
    const occupied = Math.floor(house.capacity * occupancyRate);
    const free = house.capacity - occupied;
    
    // Trend basierend auf Tageszeit
    let trend = 'constant';
    if (house.pattern === 'business') {
      if (hour >= 7 && hour <= 9) trend = 'increasing';
      else if (hour >= 16 && hour <= 18) trend = 'decreasing';
    } else if (house.pattern === 'shopping') {
      if (hour >= 9 && hour <= 11) trend = 'increasing';
      else if (hour >= 19 && hour <= 21) trend = 'decreasing';
    }
    
    return {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: house.coordinates
      },
      properties: {
        name: house.name,
        title: house.name,
        capacity: house.capacity,
        free: free,
        occupancy: occupied,
        occupancyRate: Math.round(occupancyRate * 100),
        trend: trend,
        openingState: 'open',
        timestamp: baseTime.toISOString(),
        source: 'smart-simulation',
        externalId: house.externalId,
        pattern: house.pattern,
        lastUpdate: baseTime.toISOString()
      }
    };
  });
  
  return {
    type: 'FeatureCollection',
    features: features,
    metadata: {
      totalSpots: features.length,
      totalCapacity: parkingHouses.reduce((sum, h) => sum + h.capacity, 0),
      totalFree: features.reduce((sum, f) => sum + f.properties.free, 0),
      generatedAt: baseTime.toISOString(),
      source: 'smart-simulation',
      updateInterval: '2-5 minutes'
    }
  };
}

// Transform GeoJSON to our API format
function transformParkingData(geoJsonData, source = 'unknown') {
  if (!geoJsonData || !geoJsonData.features) {
    return [];
  }

  return geoJsonData.features.map((feature, index) => {
    const props = feature.properties;
    
    // Handle different property name variations
    const name = props.name || props.title || `Parkplatz ${index + 1}`;
    const capacity = props.capacity || props.spaces || props.total || 100;
    const free = props.free !== undefined ? props.free : 
                (props.available !== undefined ? props.available : 
                 Math.max(0, capacity - (props.occupancy || 0)));
    
    const occupancyRate = props.occupancyRate || 
                         (capacity > 0 ? Math.round(((capacity - free) / capacity) * 100) : 0);

    return {
      id: props.externalId || props.id || `parking_${index + 1}`,
      name: name,
      type: 'garage',
      availableSpaces: free,
      totalSpaces: capacity,
      occupancyRate: occupancyRate,
      status: props.openingState === 'closed' ? 'closed' : 'open',
      trend: props.trend || 'constant',
      lastUpdated: props.timestamp || props.lastUpdate || new Date().toISOString(),
      coordinates: feature.geometry?.coordinates || [0, 0],
      dataSource: source
    };
  });
}

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed' 
    });
  }

  try {
    console.log('🚀 Smart Parking API starting...');
    
    let geoJsonData = null;
    let dataSource = 'unknown';
    
    // Strategie 1: Versuche Web Scraping
    if (req.query.source !== 'simulation') {
      geoJsonData = await scrapeParkingFromWebsite();
      if (geoJsonData) {
        dataSource = 'website-scraping';
      }
    }
    
    // Strategie 2: Verwende gecachte gescrapte Daten
    if (!geoJsonData) {
      try {
        const scrapedDataPath = path.join(process.cwd(), 'data', 'scraped-parking-data.json');
        if (fs.existsSync(scrapedDataPath)) {
          console.log('📁 Loading cached scraped data');
          const cachedData = JSON.parse(fs.readFileSync(scrapedDataPath, 'utf8'));
          
          // Check if data is not too old (max 1 hour)
          const cacheAge = new Date() - new Date(cachedData.scrapedAt);
          if (cacheAge < 60 * 60 * 1000) { // 1 hour
            geoJsonData = cachedData;
            dataSource = 'cached-scraped';
          }
        }
      } catch (e) {
        console.log('⚠️ Cached scraped data invalid');
      }
    }
    
    // Strategie 3: Verwende original Live-Daten
    if (!geoJsonData) {
      try {
        const liveParkingPath = path.join(process.cwd(), 'data', 'braunschweig-live-parking.json');
        if (fs.existsSync(liveParkingPath)) {
          console.log('📁 Loading original live data');
          const liveData = JSON.parse(fs.readFileSync(liveParkingPath, 'utf8'));
          geoJsonData = liveData;
          dataSource = 'cached-live';
        }
      } catch (e) {
        console.log('⚠️ Original live data invalid');
      }
    }
    
    // Strategie 4: Smart Simulation (Fallback)
    if (!geoJsonData) {
      console.log('🎯 Using smart simulation');
      geoJsonData = generateSmartParkingData();
      dataSource = 'smart-simulation';
    }

    // Transform data
    const parkingSpots = transformParkingData(geoJsonData, dataSource);
    const uniqueSpots = removeDuplicates(parkingSpots);
    
    console.log(`🔄 Original: ${parkingSpots.length} spots, After deduplication: ${uniqueSpots.length} unique spots`);

    const response = {
      success: true,
      data: uniqueSpots,
      metadata: {
        totalSpots: uniqueSpots.length,
        totalCapacity: uniqueSpots.reduce((sum, spot) => sum + spot.totalSpaces, 0),
        totalAvailable: uniqueSpots.reduce((sum, spot) => sum + spot.availableSpaces, 0),
        averageOccupancy: Math.round(
          uniqueSpots.reduce((sum, spot) => sum + spot.occupancyRate, 0) / uniqueSpots.length
        ),
        lastUpdated: new Date().toISOString(),
        dataSource: dataSource,
        cacheStrategy: 'smart-hybrid',
        updateInterval: dataSource === 'smart-simulation' ? '2-5 minutes' : '15 minutes'
      }
    };

    // Set appropriate cache headers based on data source
    if (dataSource === 'smart-simulation') {
      res.setHeader('Cache-Control', 'public, max-age=120'); // 2 minutes
    } else {
      res.setHeader('Cache-Control', 'public, max-age=900'); // 15 minutes
    }

    res.status(200).json(response);

  } catch (error) {
    console.error('❌ Smart Parking API error:', error);
    
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message,
      fallback: 'Try using ?source=simulation for simulated data'
    });
  }
}