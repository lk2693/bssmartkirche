// Fresh Live-Daten Scheduler - NO OLD DATA!
import fs from 'fs';
import path from 'path';
import scheduler from '../../lib/parking-scheduler.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const filePath = path.join(process.cwd(), 'data', 'parking-cache.json');
    
    // Falls keine Cache-Datei existiert, hole sofort neue Daten
    if (!fs.existsSync(filePath)) {
      console.log('📥 No cache found, fetching fresh data...');
      await scheduler.fetchParkingData();
    }
    
    // Prüfe nochmal nach dem Fetch
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ 
        message: 'Cache file not found',
        type: 'FeatureCollection',
        features: [],
        buildTimestamp: new Date().toISOString()
      });
    }

    const fileContent = fs.readFileSync(filePath, 'utf8');
    const geoJsonData = JSON.parse(fileContent);
    
    // Prüfe Alter der Daten (2 Stunden)
    const cacheTime = new Date(geoJsonData.buildTimestamp);
    const now = new Date();
    const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
    
    const isStale = cacheTime < twoHoursAgo;
    
    return res.status(200).json({
      ...geoJsonData,
      cacheInfo: {
        age: Math.round((now.getTime() - cacheTime.getTime()) / 60000), // Minuten
        isStale,
        lastUpdate: cacheTime.toISOString(),
        nextUpdate: new Date(cacheTime.getTime() + 2 * 60 * 60 * 1000).toISOString(),
        totalFeatures: geoJsonData.features?.length || 0
      }
    });

  } catch (error) {
    console.error('Error reading parking cache:', error);
    return res.status(500).json({ 
      message: 'Internal server error',
      type: 'FeatureCollection',
      features: [],
      error: error.message
    });
  }
}