# 💾 Save-API Anleitung

## ✅ Was wurde implementiert?

Die Admin-Dashboards können jetzt **direkt speichern** ohne manuelle JSON-Datei-Ersetzung!

### Neue Features:

1. **Automatisches Speichern** - Änderungen werden sofort in die JSON-Dateien geschrieben
2. **Keine Downloads mehr nötig** - Kein manuelles Ersetzen von Dateien
3. **Echtzeit-Updates** - Änderungen sind sofort sichtbar nach dem Speichern
4. **Fehlerbehandlung** - Klare Erfolgsmeldungen oder Fehlermeldungen

## 🎯 Wie funktioniert es?

### Hero Slides verwalten
1. Öffnen Sie: `http://localhost:3002/admin/content`
2. Klicken Sie auf **"Neuen Hero Slide hinzufügen"** oder **"Bearbeiten"**
3. Füllen Sie das Formular aus
4. Klicken Sie auf **"Speichern"**
5. ✅ Fertig! Die Änderungen sind sofort live

### Notifications verwalten
1. Öffnen Sie: `http://localhost:3002/admin/notifications`
2. Klicken Sie auf **"Neue Benachrichtigung erstellen"** oder **"Bearbeiten"**
3. Füllen Sie das Formular aus
4. Klicken Sie auf **"Speichern"**
5. ✅ Fertig! Die Benachrichtigung ist sofort aktiv

## 🔧 Technische Details

### API Endpoints

#### Hero Slides
- **GET** `/api/content/hero-slides` - Slides abrufen
- **POST** `/api/content/hero-slides` - Slides speichern
  ```json
  {
    "slides": [...],
    "metadata": {
      "version": "1.0",
      "updatedBy": "admin-interface"
    }
  }
  ```

#### Notifications
- **GET** `/api/content/notifications` - Notifications abrufen
- **POST** `/api/content/notifications` - Notifications speichern
  ```json
  {
    "notifications": [...],
    "metadata": {
      "version": "1.0",
      "updatedBy": "admin-interface"
    }
  }
  ```

### Was passiert beim Speichern?

1. **Admin Interface** sendet POST-Request an API
2. **API** validiert die Daten
3. **API** schreibt in JSON-Datei (`/content/hero-slides.json` oder `/content/notifications.json`)
4. **API** sendet Erfolg/Fehler zurück
5. **Admin Interface** zeigt Bestätigung an
6. **Admin Interface** lädt Daten neu (um sicherzugehen)

## 📝 Beispiel-Workflow

### Weihnachtsmarkt-Slider hinzufügen

```
1. http://localhost:3002/admin/content öffnen
2. "Neuen Hero Slide hinzufügen" klicken
3. Formular ausfüllen:
   - Titel: "Weihnachtsmarkt in Braunschweig"
   - Untertitel: "Festliche Stimmung"
   - Beschreibung: "Besuchen Sie unseren traditionellen Weihnachtsmarkt..."
   - Bild: "/weihnachtsmarkt.jpg" (vorher in /public hochladen!)
   - Button-Text: "Zum Programm"
   - Link: "/events"
   - Gradient: Rot/Pink (weihnachtlich)
   - Order: 5
   - Gültig von: 01.12.2025
   - Gültig bis: 31.12.2025
4. "Speichern" klicken
5. ✅ Erfolgsmeldung erscheint
6. Slider ist sofort auf der Startseite sichtbar!
```

## 🚨 Wichtig!

### Bilder hochladen
Die Bilder müssen **manuell** in den `/public` Ordner hochgeladen werden:
```bash
# Lokal
cp weihnachtsmarkt.jpg /Users/lucas/Desktop/Programmieren/bssmartcity/my-app/public/

# Dann im Admin den Pfad angeben: /weihnachtsmarkt.jpg
```

### Berechtigungen
Aktuell gibt es **keine Authentifizierung**! Jeder kann das Admin-Panel öffnen.

**TODO für Produktion:**
- Authentifizierung hinzufügen (z.B. mit Next-Auth)
- Nur autorisierte Benutzer dürfen speichern
- Admin-Routes schützen

## 🔄 Migration zu Supabase (später)

Diese JSON-basierte Lösung ist perfekt für den Start. Wenn Sie später zu Supabase migrieren möchten:

1. Supabase Projekt erstellen
2. Tabellen erstellen (`hero_slides`, `notifications`)
3. API-Endpoints auf Supabase umstellen
4. Storage für Bild-Uploads nutzen
5. Auth für Benutzer-Verwaltung

## 📊 Vorteile der aktuellen Lösung

✅ **Einfach** - Keine externe Datenbank nötig
✅ **Schnell** - Sofort produktiv
✅ **Versionierbar** - JSON-Dateien können mit Git getrackt werden
✅ **Transparent** - Änderungen sind direkt sichtbar in den Dateien
✅ **Kostenlos** - Keine Cloud-Services nötig

## ❓ FAQ

**Q: Kann ich noch die JSON-Datei manuell bearbeiten?**
A: Ja! Sie können die Dateien in `/content/` direkt bearbeiten.

**Q: Was passiert bei gleichzeitigen Änderungen?**
A: Die letzte Änderung überschreibt. Bei Bedarf könnte man Locking implementieren.

**Q: Sind Backups automatisch?**
A: Nein. Sie sollten regelmäßig die `/content/` Dateien committen (Git).

**Q: Funktioniert das auch auf Vercel/Production?**
A: Ja, aber beachten Sie: Das Dateisystem auf Vercel ist read-only nach dem Deployment. Für Production empfehle ich **Supabase** oder eine andere Datenbank-Lösung.

## 🚀 Nächste Schritte

1. ✅ Save-API funktioniert lokal
2. ⏳ Für Production: Migration zu Supabase planen
3. ⏳ Authentifizierung implementieren
4. ⏳ Bild-Upload-Interface bauen
5. ⏳ Benutzer-Verwaltung mit Rollen

---

**Status:** ✅ Fertig und funktionsfähig für lokale Entwicklung
**Autor:** GitHub Copilot
**Datum:** 7. Oktober 2025
