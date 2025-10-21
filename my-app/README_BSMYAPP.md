# Braunschweig Smart City App (my-app)

Eine vollständige Smart City Anwendung für Braunschweig mit responsivem Design für Mobile, Tablet und Laptop.

## 🚀 Features

### 📱 Responsive Design
- **Mobile First**: Optimiert für Smartphones
- **Tablet Support**: Erweiterte Layouts für mittlere Bildschirme (768px+)
- **Laptop/Desktop**: Vollständige Desktop-Erfahrung (1024px+)
- **Adaptive Navigation**: Navigation passt sich automatisch der Bildschirmgröße an

### 🛍️ Shopping System
- **2,728 echte Braunschweiger Geschäfte** aus offiziellen Datenquellen
- **3 Ansichtsmodi**: Kategorien, Liste, Grid-View
- **Intelligente Filter**: Nach Kategorie, Bereich und Suchbegriff
- **Detailseiten**: Vollständige Geschäftsinformationen mit Kontaktdaten
- **Öffnungszeiten**: Live-Status ob Geschäfte geöffnet sind

### 🎉 Events System
- **9 authentische Braunschweig Events** für Oktober 2025
- **Kategoriefilter**: Konzerte, Theater, Festivals, Sport, Kultur
- **Responsive Darstellung**: Grid und Listen-Ansicht
- **Detailinformationen**: Preise, Zeiten, Venues mit Bewertungen

### 🅿️ Parking System
- **Live Parkplatz-Daten** aus Braunschweig APIs
- **Caching System**: Optimierte Performance mit automatischen Updates
- **Echte Datenquellen**: Integration mit Stadt Braunschweig Parking APIs
- **Puppeteer Scraping**: Fallback für dynamische Inhalte

### 🌤️ Wetter Integration
- **OpenWeatherMap API**: Live-Wetterdaten für Braunschweig
- **Deutsche Übersetzungen**: Wetterbedingungen auf Deutsch
- **Caching**: 30-Minuten Cache für optimale Performance
- **Offline-Fallback**: Graceful degradation bei API-Fehlern

## 📦 Installation

```bash
# Repository klonen
git clone https://github.com/lk2693/bsmyapp.git
cd bsmyapp

# Dependencies installieren
npm install

# Environment Setup
cp .env.example .env.local
# Füge deine API Keys hinzu (siehe unten)

# Development Server starten
npm run dev
```

## 🔧 Environment Variables

Erstelle eine `.env.local` Datei mit folgenden API Keys:

```env
# OpenWeatherMap API für Wetter
NEXT_PUBLIC_WEATHER_API_KEY=your_openweathermap_api_key

# Optional: Weitere APIs für erweiterte Features
NEXT_PUBLIC_MAPS_API_KEY=your_maps_api_key
```

### API Keys erhalten:

1. **OpenWeatherMap**: Registriere dich auf [openweathermap.org](https://openweathermap.org/api)
2. **Maps (Optional)**: Google Maps oder Apple Maps API

## 🏗️ Technische Architektur

### Frontend
- **Next.js 15.5.3** mit Turbopack
- **TypeScript** für Type Safety
- **Tailwind CSS** für responsives Design
- **Lucide React** für Icons

### APIs & Datenquellen
- **Parking**: Stadt Braunschweig offizielle APIs
- **Wetter**: OpenWeatherMap API
- **Geschäfte**: Braunschweig Innenstadt Retailers JSON (2,728 Einträge)
- **Events**: Kuratierte Braunschweig Events Datenbank

### Performance Features
- **Server-Side Caching**: Parking-Daten werden gecacht
- **Image Optimization**: Next.js optimierte Bilder
- **Lazy Loading**: Components laden bei Bedarf
- **Responsive Images**: Automatische Größenanpassung

## 📱 Responsive Breakpoints

```css
/* Mobile First */
.responsive-element {
  /* Base: Mobile (< 768px) */
  padding: 1rem;
}

@media (min-width: 768px) {
  /* Tablet */
  .responsive-element {
    padding: 1.5rem;
  }
}

@media (min-width: 1024px) {
  /* Laptop/Desktop */
  .responsive-element {
    padding: 2rem;
  }
}
```

## 🗂️ Projektstruktur

```
my-app/
├── app/                          # Next.js App Router
│   ├── globals.css              # Responsive CSS utilities
│   ├── page.tsx                 # Homepage
│   ├── page-responsive.tsx      # Enhanced responsive homepage
│   ├── shopping/
│   │   ├── page.tsx            # Responsive shopping page
│   │   └── [id]/               # Geschäfts-Detailseiten
│   ├── events/
│   │   ├── page.tsx            # Events Übersicht
│   │   ├── page-responsive.tsx # Enhanced responsive events
│   │   └── [id]/               # Event-Detailseiten
│   ├── parking/
│   │   └── page.tsx            # Live Parking Daten
│   └── ...andere Seiten
├── lib/
│   ├── retailers-data.ts        # 2,728 Braunschweig Geschäfte
│   ├── events-data.ts          # Events Datenmanagement
│   └── parking-scheduler.js    # Parking API Integration
├── pages/api/
│   ├── parking-data.js         # Parking API Endpoints
│   └── cached-parking.js       # Caching Layer
├── data/
│   ├── retailers.json          # Geschäfte Rohdaten
│   └── parking-cache.json      # Parking Cache
└── public/                      # Statische Assets
```

## 🔄 API Endpoints

### Parking API
```bash
# Live Parking Daten
GET /api/cached-parking

# Response Format:
{
  "metadata": {
    "lastUpdate": "2025-09-30T10:30:00Z",
    "source": "Stadt Braunschweig",
    "totalParkingSpots": 1450
  },
  "features": [
    {
      "properties": {
        "name": "Parkhaus Am Theater",
        "free": 45,
        "capacity": 200,
        "occupancyRate": 77.5,
        "source": "live_api"
      }
    }
  ]
}
```

## 🚀 Deployment

Die App ist optimiert für Vercel, aber funktioniert auch auf anderen Plattformen:

```bash
# Build für Production
npm run build

# Production Server starten
npm start
```

### Vercel Deployment
1. Repository zu Vercel verbinden
2. Environment Variables in Vercel Dashboard eintragen
3. Automatisches Deployment bei Git Push

## 🤝 Contributing

1. Fork das Repository
2. Erstelle einen Feature Branch (`git checkout -b feature/amazing-feature`)
3. Committe deine Änderungen (`git commit -m 'Add amazing feature'`)
4. Push zum Branch (`git push origin feature/amazing-feature`)
5. Öffne einen Pull Request

## 📄 License

Dieses Projekt steht unter der MIT License - siehe [LICENSE](LICENSE) für Details.

## 🏙️ Über Braunschweig

Diese App wurde speziell für die Löwenstadt Braunschweig entwickelt und nutzt echte Datenquellen:
- Offizielle Stadt Braunschweig APIs
- Braunschweig Innenstadt Retailers Datenbank
- Authentische Veranstaltungsdaten
- Lokale Parking-Systeme

## 📞 Support

Bei Fragen oder Problemen:
- GitHub Issues: [Issues](https://github.com/lk2693/bsmyapp/issues)
- E-Mail: [Kontakt]

---

Entwickelt mit ❤️ für die Löwenstadt Braunschweig 🦁