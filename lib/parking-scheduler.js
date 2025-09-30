// Node-cron import nur für Server-Side - disabled for build
let cron = null;
// Dynamic import removed for production build compatibility

import fs from 'fs/promises';
import path from 'path';

class ParkingDataScheduler {
  constructor() {
    this.dataFile = path.join(process.cwd(), 'data', 'parking-cache.json');
    this.isRunning = false;
  }

  async fetchParkingData() {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/parking-data`);
      const data = await response.json();
      
      if (data.success) {
        await this.saveToCache(data);
        console.log(`Parking data updated: ${data.count} spots found`);
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching parking data:', error);
      throw error;
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

  async loadFromCache() {
    try {
      const data = await fs.readFile(this.dataFile, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error loading cache:', error);
      return null;
    }
  }

  startScheduler() {
    if (this.isRunning) return;

    // Führe sofort einmal aus
    this.fetchParkingData().catch(console.error);

    if (cron) {
      // Dann stündlich mit node-cron
      cron.schedule('0 * * * *', async () => {
        console.log('Running scheduled parking data fetch...');
        try {
          await this.fetchParkingData();
        } catch (error) {
          console.error('Scheduled fetch failed:', error);
        }
      });
      console.log('Parking data scheduler started with node-cron (runs every hour)');
    } else {
      // Fallback mit setInterval (jede Stunde = 3600000ms)
      setInterval(async () => {
        console.log('Running scheduled parking data fetch (fallback)...');
        try {
          await this.fetchParkingData();
        } catch (error) {
          console.error('Scheduled fetch failed:', error);
        }
      }, 3600000); // 1 Stunde
      console.log('Parking data scheduler started with setInterval fallback (runs every hour)');
    }

    this.isRunning = true;
  }
}

export default new ParkingDataScheduler();