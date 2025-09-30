// Vercel-optimized weather API endpoint
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ 
        error: 'Weather API key not configured',
        fallback: {
          temperature: 18,
          condition: 'Nicht verfügbar',
          humidity: 65,
          windSpeed: 12,
          icon: '🌤️',
          source: 'fallback'
        }
      });
    }

    // Braunschweig coordinates
    const lat = 52.2625;
    const lng = 10.5211;
    
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${apiKey}&units=metric&lang=de`,
      {
        headers: {
          'User-Agent': 'BraunschweigSmartCity/1.0',
        },
        timeout: 10000 // 10 second timeout
      }
    );

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Map OpenWeatherMap icons to emojis
    const getWeatherIcon = (iconCode) => {
      const iconMap = {
        '01d': '☀️', '01n': '🌙', '02d': '⛅', '02n': '☁️',
        '03d': '☁️', '03n': '☁️', '04d': '☁️', '04n': '☁️',
        '09d': '🌧️', '09n': '🌧️', '10d': '🌦️', '10n': '🌧️',
        '11d': '⛈️', '11n': '⛈️', '13d': '❄️', '13n': '❄️',
        '50d': '🌫️', '50n': '🌫️'
      };
      return iconMap[iconCode] || '🌤️';
    };

    // Map weather conditions to German
    const getGermanCondition = (condition) => {
      const conditionMap = {
        'clear sky': 'Klarer Himmel',
        'few clouds': 'Leicht bewölkt',
        'scattered clouds': 'Bewölkt',
        'broken clouds': 'Stark bewölkt',
        'shower rain': 'Schauer',
        'rain': 'Regen',
        'thunderstorm': 'Gewitter',
        'snow': 'Schnee',
        'mist': 'Nebel',
        'fog': 'Nebel',
        'haze': 'Dunst',
        'overcast clouds': 'Bedeckt'
      };
      return conditionMap[condition.toLowerCase()] || condition;
    };

    const weatherData = {
      temperature: Math.round(data.main.temp),
      condition: getGermanCondition(data.weather[0].description),
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind?.speed * 3.6) || 0,
      icon: getWeatherIcon(data.weather[0].icon),
      feels_like: Math.round(data.main.feels_like),
      pressure: data.main.pressure,
      visibility: data.visibility ? Math.round(data.visibility / 1000) : null,
      source: 'OpenWeatherMap',
      timestamp: new Date().toISOString(),
      location: 'Braunschweig'
    };

    return res.status(200).json(weatherData);

  } catch (error) {
    console.error('Weather API Error:', error);
    
    // Return fallback weather data
    return res.status(200).json({
      temperature: 18,
      condition: 'Daten nicht verfügbar',
      humidity: 65,
      windSpeed: 12,
      icon: '🌤️',
      feels_like: 18,
      pressure: 1013,
      visibility: 10,
      source: 'fallback',
      timestamp: new Date().toISOString(),
      location: 'Braunschweig',
      error: error.message
    });
  }
}