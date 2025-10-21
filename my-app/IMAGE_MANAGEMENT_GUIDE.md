# 🖼️ Bilder-Management Anleitung

## So fügen Sie Bilder hinzu:

### Methode 1: Über FTP/SFTP (Empfohlen)

1. **FTP-Client verbinden:**
   - Host: Ihr Server
   - Port: 22 (SFTP) oder 21 (FTP)
   - Zugangsdaten von Ihrem Hosting-Provider

2. **Zum Ordner navigieren:**
   ```
   /public/events/
   ```

3. **Bild hochladen:**
   - Dateiname: `mein-event-2025.jpg` (klein, ohne Leerzeichen)
   - Format: JPG oder WebP
   - Größe: 1920x1080px (16:9)
   - Optimiert: < 500KB

4. **Im Admin verwenden:**
   ```
   /events/mein-event-2025.jpg
   ```

---

### Methode 2: Über GitHub (für Entwickler)

1. **Bild vorbereiten:**
   ```bash
   # Optimieren mit ImageMagick
   convert original.jpg -resize 1920x1080^ -quality 85 mein-event-2025.jpg
   ```

2. **Hochladen:**
   ```bash
   cd /Users/lucas/Desktop/Programmieren/bssmartcity/my-app/public/events/
   # Bild hierher kopieren
   ```

3. **Git commit:**
   ```bash
   git add public/events/mein-event-2025.jpg
   git commit -m "Neues Event-Bild: Mein Event 2025"
   git push
   ```

---

### Methode 3: Lokales Testen (Development)

1. **Bild direkt kopieren:**
   ```bash
   cp ~/Downloads/mein-event.jpg /Users/lucas/Desktop/Programmieren/bssmartcity/my-app/public/events/mein-event-2025.jpg
   ```

2. **Im Browser testen:**
   ```
   http://localhost:3002/events/mein-event-2025.jpg
   ```

---

## 📏 Bildanforderungen

### Format & Größe:
- **Format:** JPG oder WebP bevorzugt
- **Auflösung:** 1920x1080px (16:9 Seitenverhältnis)
- **Dateigröße:** < 500KB (optimiert)
- **Farbraum:** sRGB

### Optimierung:

**Online Tools:**
- [TinyPNG](https://tinypng.com/) - Automatische Kompression
- [Squoosh](https://squoosh.app/) - Google's Bild-Optimierer
- [ImageOptim](https://imageoptim.com/) - Mac App

**Terminal (Mac/Linux):**
```bash
# Mit ImageMagick
brew install imagemagick
convert input.jpg -resize 1920x1080^ -gravity center -extent 1920x1080 -quality 85 output.jpg

# Mit jpegoptim
brew install jpegoptim
jpegoptim --size=500k --strip-all mein-event-2025.jpg
```

---

## 🎯 Verwendung im Admin-Interface

1. **Admin öffnen:**
   ```
   http://localhost:3002/admin/content
   ```

2. **"Neu" klicken**

3. **Bild-URL eingeben:**
   ```
   /events/mein-event-2025.jpg
   ```

4. **Vorschau prüfen:**
   - Bild wird automatisch angezeigt
   - Falls "Bild nicht gefunden": URL oder Pfad prüfen

5. **Speichern:**
   - JSON-Datei wird automatisch heruntergeladen
   - Datei ersetzen in `/content/hero-slides.json`

---

## 📂 Ordnerstruktur

```
my-app/
├── public/
│   ├── events/                    # ← Hier Event-Bilder
│   │   ├── weihnachtsmarkt.jpg
│   │   ├── sommerfest.jpg
│   │   └── stadtfest-2025.jpg
│   │
│   ├── dom st blasii.jpeg         # Bestehende Bilder
│   ├── rizzi house.jpeg
│   ├── Braunschweig.png
│   └── magniviertel.webp
```

---

## ✅ Checkliste: Bild hinzufügen

- [ ] Bild auf 1920x1080px skaliert
- [ ] Bild auf < 500KB komprimiert
- [ ] Sinnvoller Dateiname (klein, ohne Leerzeichen)
- [ ] Hochgeladen in `/public/events/`
- [ ] URL notiert (z.B. `/events/mein-event.jpg`)
- [ ] Im Admin-Interface getestet
- [ ] Vorschau sichtbar
- [ ] JSON heruntergeladen und ersetzt

---

## 🔧 Troubleshooting

### Problem: "Bild nicht gefunden"

**Lösung 1:** Pfad prüfen
```
Richtig:  /events/mein-event.jpg
Falsch:   events/mein-event.jpg
Falsch:   /public/events/mein-event.jpg
```

**Lösung 2:** Dateiname prüfen
```bash
# Kleinschreibung
mein-event.jpg  ✅
Mein-Event.jpg  ❌

# Ohne Leerzeichen
mein-event.jpg      ✅
mein event.jpg      ❌
```

**Lösung 3:** Browser-Cache leeren
```
Cmd + Shift + R (Mac)
Ctrl + Shift + R (Windows)
```

### Problem: "Bild zu groß"

**Lösung:**
```bash
# Mac/Linux
jpegoptim --size=500k mein-event.jpg

# Online
# → TinyPNG.com nutzen
```

### Problem: "Falsches Seitenverhältnis"

**Lösung:**
```bash
# Exakt zuschneiden
convert input.jpg -resize 1920x1080^ -gravity center -extent 1920x1080 output.jpg
```

---

## 🚀 Produktiv-Umgebung

### Nach dem Deployment:

1. **Bilder sind unter:**
   ```
   https://ihre-domain.de/events/mein-event.jpg
   ```

2. **Prüfen im Browser:**
   - URL direkt öffnen
   - Bild sollte sichtbar sein

3. **Falls nicht sichtbar:**
   - Deployment abwarten (2-3 Minuten)
   - Cache leeren
   - Build-Logs prüfen

---

## 📞 Support

**Bei Problemen:**
- E-Mail: tech@stadtmarketing-braunschweig.de
- Telefon: +49 (0)531 / XXX-XXXX

**Häufige Fragen:**
1. "Bild wird nicht angezeigt" → Pfad prüfen
2. "Bild zu verschwommen" → Höhere Auflösung nutzen
3. "Seite lädt langsam" → Bild komprimieren

---

**Letzte Aktualisierung:** 3. Oktober 2025
