import puppeteer from 'puppeteer';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const browser = await puppeteer.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // User-Agent setzen um Bot-Detection zu vermeiden
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
    
    // Zur Parkplatz-Seite navigieren
    await page.goto('https://www.braunschweig.de/plan/#parken', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    // Warten bis die Karte geladen ist (mit Fallback)
    try {
      await page.waitForSelector('.mapsight-map', { timeout: 10000 });
      console.log('✅ Map loaded successfully');
    } catch (e) {
      console.log('⚠️ Map selector not found, continuing with text scraping...');
    }

    // JavaScript im Browser ausführen um Parkplatz-Daten zu extrahieren
    const parkingData = await page.evaluate(() => {
      const parkingSpots = [];

      // 1. Suche nach Parkplatz-Markern auf der Karte
      const markers = document.querySelectorAll('[data-mapsight-marker]');
      console.log('Found markers:', markers.length);

      markers.forEach(marker => {
        try {
          const name = marker.getAttribute('data-name') || 
                      marker.querySelector('.marker-title')?.textContent?.trim();
          
          const coordinates = {
            lat: parseFloat(marker.getAttribute('data-lat')),
            lng: parseFloat(marker.getAttribute('data-lng'))
          };

          if (name && !isNaN(coordinates.lat) && !isNaN(coordinates.lng)) {
            parkingSpots.push({
              id: name.replace(/\s+/g, '_').toLowerCase(),
              name,
              coordinates,
              type: 'marker',
              timestamp: new Date().toISOString()
            });
          }
        } catch (error) {
          console.error('Error processing marker:', error);
        }
      });

      // 2. Suche nach Parkhaus-Liste mit Verfügbarkeitsdaten
      const parkingList = document.querySelector('.legend-content, .layerset-parking, [data-layerset="parking"]');
      if (parkingList) {
        console.log('Found parking list section');
        
        // Suche nach Parkhaus-Einträgen mit Verfügbarkeitsdaten
        const parkingEntries = parkingList.querySelectorAll('div, li, tr');
        
        parkingEntries.forEach(entry => {
          try {
            const text = entry.textContent || '';
            
            // Prüfe auf Parkhaus-Namen
            const parkhausMatch = text.match(/Parkhaus\s+([^0-9%]+)/i);
            if (parkhausMatch) {
              const name = `Parkhaus ${parkhausMatch[1].trim()}`;
              
              // Extrahiere Verfügbarkeitsprozent
              const percentageMatch = text.match(/(\d+)%/);
              const percentage = percentageMatch ? parseInt(percentageMatch[1]) : null;
              
              // Extrahiere Trend (steigend, fallend, konstant)
              const trendMatch = text.match(/(steigend|fallend|konstant)/i);
              const trend = trendMatch ? trendMatch[1].toLowerCase() : null;
              
              // Suche nach Bild-URLs für Trend-Icons
              const img = entry.querySelector('img');
              const trendIcon = img ? img.src : null;
              
              parkingSpots.push({
                id: name.replace(/\s+/g, '_').toLowerCase(),
                name: name,
                type: 'parkhaus',
                availabilityPercentage: percentage,
                trend: trend,
                trendIcon: trendIcon,
                timestamp: new Date().toISOString(),
                source: 'list'
              });
            }
          } catch (error) {
            console.error('Error processing parking list entry:', error);
          }
        });
      }

      // 3. Alternative: Suche in der gesamten Seite nach Parkhaus-Daten
      const allText = document.body.textContent || '';
      const parkhausMatches = allText.match(/Parkhaus\s+[^0-9%\n]+\s*(\d+)%\s*(steigend|fallend|konstant)?/gi);
      
      if (parkhausMatches) {
        console.log('Found parking data in text:', parkhausMatches.length);
        
        parkhausMatches.forEach(match => {
          try {
            const nameMatch = match.match(/Parkhaus\s+([^0-9%]+)/i);
            const percentageMatch = match.match(/(\d+)%/);
            const trendMatch = match.match(/(steigend|fallend|konstant)/i);
            
            if (nameMatch && percentageMatch) {
              const name = `Parkhaus ${nameMatch[1].trim()}`;
              const percentage = parseInt(percentageMatch[1]);
              const trend = trendMatch ? trendMatch[1].toLowerCase() : null;
              
              // Prüfe ob bereits vorhanden
              const exists = parkingSpots.some(spot => spot.name === name);
              if (!exists) {
                parkingSpots.push({
                  id: name.replace(/\s+/g, '_').toLowerCase(),
                  name: name,
                  type: 'parkhaus',
                  availabilityPercentage: percentage,
                  trend: trend,
                  timestamp: new Date().toISOString(),
                  source: 'text'
                });
              }
            }
          } catch (error) {
            console.error('Error processing text match:', error);
          }
        });
      }

      console.log('Total parking spots found:', parkingSpots.length);
      return parkingSpots;
    });

    await browser.close();

    res.status(200).json({
      success: true,
      data: parkingData,
      timestamp: new Date().toISOString(),
      count: parkingData.length
    });

  } catch (error) {
    console.error('Scraping error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}