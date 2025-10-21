# 🎯 Content Management System - Übersicht

## Aktuelle Lösung für Partner-Content

Ihr Content Management System ist nun eingerichtet! Partner können jetzt Hero Slides und Featured Events verwalten.

---

## 📂 Projektstruktur

```
my-app/
├── content/                          # Content-Dateien (JSON)
│   ├── hero-slides.json             # Hero Slider Konfiguration
│   └── featured-events.json         # Featured Events Konfiguration
│
├── lib/
│   └── content-manager.ts           # Content Management Logic
│
├── app/
│   ├── api/
│   │   └── content/
│   │       ├── hero-slides/         # API: Hero Slides
│   │       └── featured-events/     # API: Featured Events
│   │
│   └── admin/
│       └── content/                 # Admin Interface (Demo)
│
├── PARTNER_CONTENT_GUIDE.md        # Ausführliche Dokumentation
└── README_CONTENT_MANAGEMENT.md    # Diese Datei
```

---

## 🚀 Verwaltungsmöglichkeiten

### **Option 1: JSON-Bearbeitung** ✅ **AKTIV**

**Für:** Technisch versierte Partner
**Zugriff:** GitHub oder FTP
**Dateien:** 
- `/content/hero-slides.json`
- `/content/featured-events.json`

**Workflow:**
1. Datei öffnen
2. JSON bearbeiten
3. Speichern & committen
4. Automatisches Deployment

**Dokumentation:** Siehe `PARTNER_CONTENT_GUIDE.md`

---

### **Option 2: Admin Interface** 🚧 **IN ENTWICKLUNG**

**URL:** `/admin/content`
**Status:** Demo-Modus (nur Lesen)

**Features (geplant):**
- ✅ Übersicht aller Slides
- 🚧 Bearbeiten von Slides
- 🚧 Bildupload
- 🚧 Vorschau-Funktion
- 🚧 Speichern & Publizieren

**Entwicklung:** 2-3 Wochen
**Kosten:** Nach Aufwand

---

### **Option 3: Headless CMS** 🌐 **ZUKÜNFTIG**

Professionelle Lösung mit:
- Strapi / Contentful / Sanity
- Benutzerfreundliches Interface
- Bildverwaltung
- Mehrsprachigkeit
- API-Integration

**Entwicklung:** 1-2 Wochen
**Kosten:** Hosting + Lizenz

---

## 📖 API Endpoints

### Hero Slides abrufen
```bash
GET /api/content/hero-slides

# Optionale Parameter:
?partnerId=stadtmarketing
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "dom",
      "title": "Dom St. Blasii",
      "subtitle": "Wahrzeichen der Stadt",
      ...
    }
  ],
  "count": 4,
  "timestamp": "2025-10-03T12:00:00Z"
}
```

### Featured Events abrufen
```bash
GET /api/content/featured-events

# Optionale Parameter:
?partnerId=stadtmarketing
?showOnHome=true
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "featured-1",
      "title": "Weihnachtsmarkt 2025",
      ...
    }
  ],
  "count": 1,
  "timestamp": "2025-10-03T12:00:00Z"
}
```

---

## 🖼️ Hero Slide hinzufügen

### Schritt 1: Bild vorbereiten

**Anforderungen:**
- Format: JPG oder WebP
- Auflösung: 1920x1080px (16:9)
- Dateigröße: < 500KB
- Optimiert mit TinyPNG oder Squoosh

### Schritt 2: Bild hochladen

```bash
# Via FTP oder GitHub
/public/events/ihr-event-2025.jpg
```

### Schritt 3: JSON bearbeiten

Öffne: `/content/hero-slides.json`

Füge hinzu:
```json
{
  "id": "ihr-event-2025",
  "title": "Ihr Event-Name",
  "subtitle": "Kurzbeschreibung",
  "description": "Längere Beschreibung für Besucher",
  "image": "/events/ihr-event-2025.jpg",
  "cta": "Mehr erfahren",
  "ctaLink": "/events/ihr-event-2025",
  "gradient": "from-blue-500 to-purple-600",
  "active": true,
  "order": 5,
  "partnerId": "ihr-partner-name",
  "validFrom": "2025-12-01",
  "validUntil": "2025-12-31"
}
```

### Schritt 4: Speichern & Deployen

```bash
git add content/hero-slides.json
git commit -m "Neuer Hero Slide: Ihr Event"
git push
```

➡️ Automatisches Deployment in 2-3 Minuten

---

## ⭐ Event highlighten

### Featured Event hinzufügen

Öffne: `/content/featured-events.json`

```json
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
```

### Highlight-Optionen

**Farben:**
- `"red"` - Rot (für wichtige Events)
- `"blue"` - Blau (für reguläre Events)
- `"green"` - Grün (für Outdoor/Natur)
- `"purple"` - Lila (für Kultur)
- `"orange"` - Orange (für Food/Festivals)

**Badges:**
- `"Top Event"` - Wichtigstes Event
- `"Neu"` - Neues Event
- `"Bestseller"` - Beliebtes Event
- `"Last Chance"` - Letzte Chance
- `"Exklusiv"` - Exklusives Event

---

## 🎨 Verfügbare Gradienten

```
from-red-500 to-pink-600      → Rot/Pink (Weihnachten, Valentinstag)
from-blue-500 to-indigo-600   → Blau/Indigo (Standard, Business)
from-green-500 to-emerald-600 → Grün/Smaragd (Natur, Umwelt)
from-amber-500 to-orange-600  → Bernstein/Orange (Herbst, Wärme)
from-purple-500 to-pink-600   → Lila/Pink (Kultur, Kunst)
from-cyan-500 to-blue-600     → Türkis/Blau (Wasser, Frische)
```

---

## ✅ Checkliste: Neuer Hero Slide

- [ ] Bild vorbereitet (1920x1080px, < 500KB)
- [ ] Bild hochgeladen in `/public/events/`
- [ ] Eindeutige ID gewählt
- [ ] Titel eingegeben (max. 50 Zeichen)
- [ ] Subtitle eingegeben (max. 80 Zeichen)
- [ ] Description eingegeben (max. 150 Zeichen)
- [ ] CTA-Text definiert
- [ ] Link-Ziel festgelegt
- [ ] Gradient ausgewählt
- [ ] Order-Position festgelegt
- [ ] Gültigkeitszeitraum gesetzt
- [ ] `active: true` gesetzt
- [ ] Partner-ID eingetragen
- [ ] JSON validiert (jsonlint.com)
- [ ] Gespeichert & committed
- [ ] Deployment abgewartet

---

## 🔐 Zugriff & Berechtigungen

### GitHub Zugriff (aktuell)

**Benötigt:**
- GitHub Account
- Repository-Zugang
- Git-Kenntnisse (Basic)

**Anfrage:** 
```
E-Mail: tech@stadtmarketing-braunschweig.de
Betreff: GitHub Zugang für Content-Verwaltung
Inhalt: Name, E-Mail, Partner-Organisation
```

### FTP Zugriff (optional)

**Benötigt:**
- FTP-Client (z.B. FileZilla)
- Zugangsdaten

**Anfrage:**
```
E-Mail: tech@stadtmarketing-braunschweig.de
Betreff: FTP Zugang für Content-Verwaltung
```

---

## 📞 Support

### Technischer Support
**E-Mail:** tech@stadtmarketing-braunschweig.de
**Telefon:** +49 (0)531 / XXX-XXXX
**Zeiten:** Mo-Fr 9:00-17:00 Uhr

### Content-Anfragen
**E-Mail:** content@stadtmarketing-braunschweig.de
**Bearbeitungszeit:**
- Standard: 24-48 Stunden
- Dringend: 2-4 Stunden
- Notfall: Sofort (Anruf)

### Schulungen
**30-Minuten Einführung:** Kostenlos
**Individuelle Schulung:** Nach Vereinbarung

---

## 🛠️ Entwicklung & Roadmap

### Phase 1: JSON-basiert ✅ **FERTIG**
- [x] Content-Dateien erstellt
- [x] API Endpoints
- [x] Content Manager Logik
- [x] Dokumentation
- [x] Integration in App

### Phase 2: Admin Interface 🚧 **IN ARBEIT**
- [x] Demo-Interface
- [ ] Bearbeitungs-Funktionen
- [ ] Bildupload
- [ ] Vorschau
- [ ] Speichern-Funktion
- [ ] Authentifizierung

**Zeitplan:** 2-3 Wochen
**Start:** Nach Freigabe

### Phase 3: Headless CMS 📅 **GEPLANT**
- [ ] CMS-Auswahl (Strapi/Contentful)
- [ ] Integration
- [ ] Datenmigration
- [ ] Partner-Schulung
- [ ] Go-Live

**Zeitplan:** 1-2 Wochen nach Phase 2
**Kosten:** Nach Angebot

---

## 📊 Best Practices

### Bild-Optimierung
```bash
# Online Tools:
- TinyPNG.com
- Squoosh.app
- ImageOptim (Mac)

# Ziel: < 500KB bei 1920x1080px
```

### JSON-Validierung
```bash
# Vor dem Upload:
https://jsonlint.com/

# Oder mit Tool:
npm install -g jsonlint
jsonlint content/hero-slides.json
```

### Git Workflow
```bash
# Beste Praxis:
1. Branch erstellen
2. Änderungen machen
3. Testen
4. Pull Request
5. Review
6. Merge

# Schneller Workflow (kleine Änderungen):
git add .
git commit -m "Update: Beschreibung"
git push
```

---

## 🎓 Ressourcen

- **Vollständige Anleitung:** `PARTNER_CONTENT_GUIDE.md`
- **Admin Interface:** `/admin/content`
- **API Dokumentation:** Siehe oben
- **Tailwind CSS Gradients:** [tailwindcss.com/docs/gradient-color-stops](https://tailwindcss.com/docs/gradient-color-stops)

---

## ❓ FAQ

**Q: Wie schnell sind Änderungen sichtbar?**
A: Nach Git Push: 2-3 Minuten (automatisches Deployment)

**Q: Kann ich Slides zeitlich planen?**
A: Ja! Mit `validFrom` und `validUntil` Feldern

**Q: Kann ich mehrere Slides für verschiedene Zeiträume haben?**
A: Ja! Das System filtert automatisch nach Gültigkeit

**Q: Was passiert, wenn ein Bild fehlt?**
A: Der Slide wird übersprungen (nicht angezeigt)

**Q: Kann ich Slides deaktivieren ohne zu löschen?**
A: Ja! Setzen Sie `"active": false`

**Q: Wer kann Änderungen vornehmen?**
A: Aktuell: Personen mit GitHub/FTP Zugang
A: Zukünftig: Alle Partner mit Admin-Account

---

**Letzte Aktualisierung:** 3. Oktober 2025
**Version:** 1.0
**Maintainer:** Stadtmarketing Braunschweig
**Lizenz:** Proprietär
