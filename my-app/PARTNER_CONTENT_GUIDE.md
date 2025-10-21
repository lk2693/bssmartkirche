# 📝 Content Management Guide für Partner

## Inhaltsübersicht
- [Hero Slider Bilder verwalten](#hero-slider-bilder-verwalten)
- [Events highlighten](#events-highlighten)
- [Verwaltungsmöglichkeiten](#verwaltungsmöglichkeiten)

---

## 🎨 Hero Slider Bilder verwalten

### Aktuell: JSON-basierte Verwaltung

Die Hero Slides werden über die Datei `/my-app/content/hero-slides.json` verwaltet.

### Beispiel-Struktur:

```json
{
  "slides": [
    {
      "id": "weihnachtsmarkt-2025",
      "title": "Weihnachtsmarkt 2025",
      "subtitle": "Festliche Stimmung",
      "description": "Besuchen Sie den traditionellen Weihnachtsmarkt auf dem Burgplatz",
      "image": "/events/weihnachtsmarkt.jpg",
      "cta": "Zum Event",
      "ctaLink": "/events/weihnachtsmarkt-2025",
      "gradient": "from-red-500 to-green-600",
      "active": true,
      "order": 1,
      "partnerId": "stadtmarketing",
      "validFrom": "2025-11-01",
      "validUntil": "2025-12-23"
    }
  ]
}
```

### Felder-Erklärung:

| Feld | Typ | Beschreibung | Beispiel |
|------|-----|--------------|----------|
| `id` | String | Eindeutige ID für den Slide | `"weihnachtsmarkt-2025"` |
| `title` | String | Hauptüberschrift | `"Weihnachtsmarkt 2025"` |
| `subtitle` | String | Unterüberschrift | `"Festliche Stimmung"` |
| `description` | String | Beschreibungstext | `"Besuchen Sie..."` |
| `image` | String | Pfad zum Bild | `"/events/weihnachtsmarkt.jpg"` |
| `cta` | String | Button-Text | `"Zum Event"` |
| `ctaLink` | String | Link-Ziel | `"/events/..."` |
| `gradient` | String | Tailwind Gradient | `"from-red-500 to-green-600"` |
| `active` | Boolean | Aktiv/Inaktiv | `true` / `false` |
| `order` | Number | Sortierreihenfolge | `1`, `2`, `3` |
| `partnerId` | String | Partner-Kennung | `"stadtmarketing"` |
| `validFrom` | String | Gültig ab (ISO) | `"2025-11-01"` |
| `validUntil` | String | Gültig bis (ISO) | `"2025-12-23"` |

### Verfügbare Gradienten:

```
"from-red-500 to-pink-600"      → Rot/Pink
"from-blue-500 to-indigo-600"   → Blau/Indigo
"from-green-500 to-emerald-600" → Grün/Smaragd
"from-amber-500 to-orange-600"  → Bernstein/Orange
"from-purple-500 to-pink-600"   → Lila/Pink
"from-cyan-500 to-blue-600"     → Türkis/Blau
```

---

## ⭐ Events highlighten

### Featured Events verwalten

Featured Events werden über `/my-app/content/featured-events.json` verwaltet.

### Beispiel-Struktur:

```json
{
  "featuredEvents": [
    {
      "id": "featured-weihnachtsmarkt",
      "title": "Weihnachtsmarkt 2025",
      "subtitle": "Traditioneller Weihnachtsmarkt",
      "description": "Genießen Sie die festliche Atmosphäre",
      "time": "01.12 - 23.12.2025",
      "location": "Burgplatz",
      "image": "/events/weihnachtsmarkt.jpg",
      "category": "festival",
      "attendees": 50000,
      "price": "Kostenlos",
      "featured": true,
      "priority": 1,
      "partnerId": "stadtmarketing",
      "validFrom": "2025-11-01",
      "validUntil": "2025-12-23",
      "active": true,
      "highlight": {
        "color": "red",
        "badge": "Top Event",
        "showOnHome": true
      }
    }
  ]
}
```

### Highlight-Optionen:

- **`color`**: `"red"`, `"blue"`, `"green"`, `"purple"`, `"orange"`
- **`badge`**: Text für Badge (z.B. "Top Event", "Neu", "Bestseller")
- **`showOnHome`**: `true` = Auf Startseite anzeigen

### Event-Kategorien:

- `concert` - Konzert
- `theater` - Theater
- `festival` - Festival
- `sports` - Sport
- `culture` - Kultur
- `food` - Essen & Trinken
- `family` - Familie
- `nightlife` - Nachtleben
- `exhibition` - Ausstellung
- `workshop` - Workshop
- `party` - Party
- `business` - Business
- `literature` - Literatur
- `dance` - Tanz
- `dinner` - Dinner

---

## 🛠️ Verwaltungsmöglichkeiten

### Option 1: Direkte JSON-Bearbeitung ✅ **Aktuell aktiv**

**Vorteile:**
- ✅ Sofort verfügbar
- ✅ Keine Installation nötig
- ✅ Vollständige Kontrolle
- ✅ Versionierung via Git

**Nachteile:**
- ❌ Technisches Verständnis nötig
- ❌ Keine Vorschau vor Veröffentlichung
- ❌ Manuelles Bildermanagement

**Workflow:**
1. JSON-Datei öffnen
2. Inhalte bearbeiten
3. Bilder in `/public` hochladen
4. Änderungen committen
5. Deployment (automatisch)

**Kontakt für Zugriff:**
- GitHub Repository-Zugang erforderlich
- Training: 30 Minuten Einführung

---

### Option 2: Admin Dashboard 🚀 **Empfohlen für die Zukunft**

Ein maßgeschneidertes Admin-Panel für einfache Content-Verwaltung.

**Features:**
- 🖼️ Drag & Drop Bildupload
- 📅 Zeitplanung für Events
- 👁️ Live-Vorschau
- 👥 Multi-User mit Rechten
- 📊 Analytics Dashboard
- ✅ Änderungs-Workflow (Review-Prozess)

**Entwicklungsaufwand:** 2-3 Wochen
**Kosten:** Nach Aufwand

**Workflow:**
1. Login auf admin.bssmartcity.de
2. Visueller Editor
3. Bildupload per Drag & Drop
4. Vorschau ansehen
5. Speichern & Publizieren

---

### Option 3: Headless CMS Integration 🌐 **Professionelle Lösung**

Integration eines professionellen CMS wie:
- **Strapi** (Open Source)
- **Contentful** (SaaS)
- **Sanity** (SaaS)

**Vorteile:**
- ✅ Benutzerfreundlich
- ✅ Professionelles Interface
- ✅ Bildoptimierung
- ✅ Mehrsprachigkeit
- ✅ API-First
- ✅ Revision History

**Entwicklungsaufwand:** 1-2 Wochen Integration
**Kosten:** Hosting + ggf. Lizenz

---

## 📞 Kontakt & Support

### Technischer Support:
- **E-Mail:** tech@stadtmarketing-braunschweig.de
- **Telefon:** +49 (0)531 / XXX-XXXX

### Content-Anfragen:
1. **Neue Hero Slides:** Bild + Infos per E-Mail
2. **Event Highlights:** Event-Details + Zeitraum
3. **Dringend:** Telefonischer Kontakt

### Bearbeitungszeit:
- Standard: 24-48 Stunden
- Dringend: 2-4 Stunden
- Notfall: Sofort

---

## 🎯 Quick-Start für Partner

### Neuen Hero Slide hinzufügen:

1. **Bild vorbereiten:**
   - Format: JPG oder WebP
   - Größe: 1920x1080px (16:9)
   - Optimiert: < 500KB
   - Dateiname: `mein-event-2025.jpg`

2. **Bild hochladen:**
   - In `/public/events/` Ordner
   - Via FTP oder GitHub

3. **JSON bearbeiten:**
   ```json
   {
     "id": "mein-event-2025",
     "title": "Ihr Event-Name",
     "subtitle": "Kurzbeschreibung",
     "description": "Längere Beschreibung für Besucher",
     "image": "/events/mein-event-2025.jpg",
     "cta": "Mehr erfahren",
     "ctaLink": "/events/mein-event-2025",
     "gradient": "from-blue-500 to-purple-600",
     "active": true,
     "order": 1,
     "partnerId": "ihr-partner-name",
     "validFrom": "2025-12-01",
     "validUntil": "2025-12-31"
   }
   ```

4. **Speichern & Deployen:**
   - Datei speichern
   - Git commit
   - Automatisches Deployment

---

## 📋 Checkliste für neue Inhalte

### Hero Slide:
- [ ] Bild hochgeladen (optimiert)
- [ ] Titel eingegeben (max. 50 Zeichen)
- [ ] Subtitle eingegeben (max. 80 Zeichen)
- [ ] Description eingegeben (max. 150 Zeichen)
- [ ] CTA-Text definiert
- [ ] Link-Ziel festgelegt
- [ ] Gradient ausgewählt
- [ ] Gültigkeitszeitraum gesetzt
- [ ] Order-Position definiert
- [ ] Active auf `true` gesetzt

### Featured Event:
- [ ] Event-Details vollständig
- [ ] Bild hochgeladen
- [ ] Kategorie ausgewählt
- [ ] Preis angegeben
- [ ] Highlight-Badge definiert
- [ ] Priority gesetzt
- [ ] ShowOnHome entschieden
- [ ] Gültigkeitszeitraum gesetzt

---

## 🔐 Sicherheit & Best Practices

### Bild-Optimierung:
```bash
# Empfohlene Tools:
- TinyPNG.com (Online)
- ImageOptim (Mac)
- Squoosh (Google)
```

### JSON-Validierung:
```bash
# Vor dem Upload prüfen:
https://jsonlint.com/
```

### Backup:
- Automatische Backups via Git
- Vor größeren Änderungen: Branch erstellen

---

## 📚 Weitere Ressourcen

- **API Dokumentation:** `/docs/api.md`
- **Bildanforderungen:** `/docs/images.md`
- **Troubleshooting:** `/docs/troubleshooting.md`

---

**Letzte Aktualisierung:** 3. Oktober 2025
**Version:** 1.0
**Kontakt:** stadtmarketing@braunschweig.de
