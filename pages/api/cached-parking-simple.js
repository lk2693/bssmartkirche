// Vereinfachte Version für bessere Next.js Kompatibilität
import fs from 'fs/promises';
import path from 'path';

class SimpleParkingCache {
  constructor() {
    this.dataFile = path.join(process.cwd(), 'data', 'parking-cache.json');
  }

  async loadFromCache() {
    try {
      const data = await fs.readFile(this.dataFile, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error loading cache:', error);
      return null;
    }
  }

  async saveToCache(data) {
    try {
      // Stelle sicher, dass das data Verzeichnis existiert
      await fs.mkdir(path.dirname(this.dataFile), { recursive: true });
      
      const cacheData = {
        ...data,
        cached_at: new Date().toISOString()
      };
      
      await fs.writeFile(this.dataFile, JSON.stringify(cacheData, null, 2));
    } catch (error) {
      console.error('Error saving cache:', error);
    }
  }
}

const simpleCache = new SimpleParkingCache();

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const cachedData = await simpleCache.loadFromCache();
    
    if (!cachedData) {
      return res.status(404).json({
        success: false,
        message: 'No cached data available'
      });
    }

    // Prüfe ob Daten nicht älter als 2 Stunden sind
    const cacheAge = Date.now() - new Date(cachedData.cached_at).getTime();
    const twoHours = 2 * 60 * 60 * 1000;
    
    res.status(200).json({
      ...cachedData,
      is_stale: cacheAge > twoHours,
      cache_age_minutes: Math.floor(cacheAge / (1000 * 60))
    });

  } catch (error) {
    console.error('Error loading cached data:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}