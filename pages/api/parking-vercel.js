// Vercel-optimized parking data API without Puppeteer
import fs from 'fs';
import path from 'path';

// Fallback parking data for when external APIs fail
const FALLBACK_PARKING_DATA = {
  type: 'FeatureCollection',
  buildTimestamp: new Date().toISOString(),
  metadata: {
    source: 'Fallback Data',
    totalSpaces: 1250,
    lastUpdate: new Date().toISOString(),
    updateInterval: '5 minutes',
    coverage: 'Braunschweig Innenstadt'
  },
  features: [
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [10.5211, 52.2625]
      },
      properties: {
        name: 'Parkhaus Am Theater',
        address: 'Am Theater 1, 38100 Braunschweig',
        capacity: 280,
        free: Math.floor(Math.random() * 100) + 50,
        fee: 'kostenpflichtig',
        opening_hours: '24/7',
        source: 'static_fallback',
        occupancyRate: null,
        trend: 'stable',
        lastUpdate: new Date().toISOString()
      }
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [10.5178, 52.2634]
      },
      properties: {
        name: 'Parkhaus Rathaus',
        address: 'Platz der Deutschen Einheit, 38100 Braunschweig',
        capacity: 195,
        free: Math.floor(Math.random() * 80) + 30,
        fee: 'kostenpflichtig',
        opening_hours: '06:00-22:00',
        source: 'static_fallback',
        occupancyRate: null,
        trend: 'stable',
        lastUpdate: new Date().toISOString()
      }
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [10.5156, 52.2701]
      },
      properties: {
        name: 'Parkhaus Schloss-Arkaden',
        address: 'Platz am Ritterbrunnen 1, 38100 Braunschweig',
        capacity: 450,
        free: Math.floor(Math.random() * 150) + 100,
        fee: 'kostenpflichtig',
        opening_hours: '06:00-24:00',
        source: 'static_fallback',
        occupancyRate: null,
        trend: 'increasing',
        lastUpdate: new Date().toISOString()
      }
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [10.5267, 52.2688]
      },
      properties: {
        name: 'Parkplatz Hamburger Straße',
        address: 'Hamburger Straße, 38114 Braunschweig',
        capacity: 120,
        free: Math.floor(Math.random() * 60) + 20,
        fee: 'kostenpflichtig',
        opening_hours: '24/7',
        source: 'static_fallback',
        occupancyRate: null,
        trend: 'stable',
        lastUpdate: new Date().toISOString()
      }
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [10.5142, 52.2675]
      },
      properties: {
        name: 'Parkplatz Bohlweg',
        address: 'Bohlweg, 38100 Braunschweig',
        capacity: 85,
        free: Math.floor(Math.random() * 40) + 15,
        fee: 'kostenpflichtig',
        opening_hours: '08:00-20:00',
        source: 'static_fallback',
        occupancyRate: null,
        trend: 'decreasing',
        lastUpdate: new Date().toISOString()
      }
    }
  ]
};

// Update occupancy rates
FALLBACK_PARKING_DATA.features.forEach(feature => {
  const { capacity, free } = feature.properties;
  feature.properties.occupancyRate = Math.round(((capacity - free) / capacity) * 100);
});

async function fetchBraunschweigParkingData() {
  try {
    // Try to fetch from Braunschweig official API
    const response = await fetch(
      'https://www.braunschweig.de/plan/parkplaetze.php?sap=out=braunschweig.geo.JSON',
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; BraunschweigSmartCity/1.0)',
          'Accept': 'application/json, application/geo+json',
        },
        timeout: 10000 // 10 second timeout
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Validate the response structure
    if (!data || !data.features || !Array.isArray(data.features)) {
      throw new Error('Invalid GeoJSON structure from API');
    }

    // Enhance the data with additional metadata
    return {
      ...data,
      buildTimestamp: new Date().toISOString(),
      metadata: {
        source: 'Stadt Braunschweig API',
        totalSpaces: data.features.reduce((sum, f) => sum + (f.properties?.capacity || 0), 0),
        lastUpdate: new Date().toISOString(),
        updateInterval: '5 minutes',
        coverage: 'Braunschweig Innenstadt',
        fetchMethod: 'direct_api'
      }
    };

  } catch (error) {
    console.error('❌ Failed to fetch from Braunschweig API:', error.message);
    
    // Return fallback data with error information
    return {
      ...FALLBACK_PARKING_DATA,
      buildTimestamp: new Date().toISOString(),
      metadata: {
        ...FALLBACK_PARKING_DATA.metadata,
        source: 'Fallback Data (API Error)',
        error: error.message,
        fetchMethod: 'fallback'
      }
    };
  }
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Try to read existing cache
    const filePath = path.join(process.cwd(), 'data', 'parking-cache.json');
    let cacheData = null;
    let shouldFetchNew = true;

    if (fs.existsSync(filePath)) {
      try {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        cacheData = JSON.parse(fileContent);
        
        // Check if cache is less than 10 minutes old
        const cacheTime = new Date(cacheData.buildTimestamp);
        const now = new Date();
        const tenMinutesAgo = new Date(now.getTime() - 10 * 60 * 1000);
        
        shouldFetchNew = cacheTime < tenMinutesAgo;
      } catch (cacheError) {
        console.warn('⚠️ Cache file corrupted, will fetch new data');
        shouldFetchNew = true;
      }
    }

    // Fetch new data if needed
    if (shouldFetchNew) {
      console.log('🔄 Fetching fresh parking data...');
      const freshData = await fetchBraunschweigParkingData();
      
      // Try to save to cache (but don't fail if we can't)
      try {
        const dataDir = path.dirname(filePath);
        if (!fs.existsSync(dataDir)) {
          fs.mkdirSync(dataDir, { recursive: true });
        }
        fs.writeFileSync(filePath, JSON.stringify(freshData, null, 2));
        console.log('✅ Cache updated successfully');
      } catch (writeError) {
        console.warn('⚠️ Could not write cache file:', writeError.message);
      }
      
      cacheData = freshData;
    } else {
      console.log('📦 Using cached parking data');
    }

    // Add cache info to response
    const now = new Date();
    const cacheTime = new Date(cacheData.buildTimestamp);
    
    return res.status(200).json({
      ...cacheData,
      cacheInfo: {
        age: Math.round((now.getTime() - cacheTime.getTime()) / 60000), // minutes
        isStale: (now.getTime() - cacheTime.getTime()) > 10 * 60 * 1000, // older than 10 minutes
        lastUpdate: cacheTime.toISOString(),
        nextUpdate: new Date(cacheTime.getTime() + 10 * 60 * 1000).toISOString(),
        totalFeatures: cacheData.features?.length || 0,
        source: cacheData.metadata?.source || 'unknown'
      }
    });

  } catch (error) {
    console.error('❌ Parking API Error:', error);
    
    // Return fallback data even in case of complete failure
    return res.status(200).json({
      ...FALLBACK_PARKING_DATA,
      buildTimestamp: new Date().toISOString(),
      cacheInfo: {
        age: 0,
        isStale: false,
        lastUpdate: new Date().toISOString(),
        nextUpdate: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
        totalFeatures: FALLBACK_PARKING_DATA.features.length,
        source: 'Emergency Fallback',
        error: error.message
      }
    });
  }
}