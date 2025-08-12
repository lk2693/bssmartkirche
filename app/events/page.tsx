'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowLeft, Navigation, MapPin, Search, Star, 
  Clock, Calendar, Bookmark, Heart, X,
  Home, Gift, Coffee, Euro, PartyPopper,
  RefreshCw, ExternalLink, AlertCircle
} from 'lucide-react';

// Types
interface Event {
  id: string;
  title: string;
  category: 'concert' | 'theater' | 'festival' | 'sports' | 'culture' | 'food' | 'family' | 'nightlife' | 'exhibition' | 'workshop' | 'other';
  description: string;
  venue: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  startDate: Date;
  endDate: Date;
  startTime: string;
  endTime?: string;
  price: {
    min: number;
    max?: number;
    currency: string;
  };
  ticketUrl?: string;
  image: string;
  organizer: string;
  attendees: number;
  capacity?: number;
  tags: string[];
  rating?: number;
  reviewCount?: number;
  isFavorite: boolean;
  isBookmarked: boolean;
  isAttending: boolean;
  status: 'upcoming' | 'ongoing' | 'ended' | 'cancelled';
  featured: boolean;
  distance?: number;
  dataSource: 'static' | 'live' | 'api';
  eventUrl?: string;
}

// Live Events Data Interface
interface LiveEventData {
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  price: string;
  category: string;
  url: string;
  source: string;
  event_url: string;
  parsed_date: string | null;
}

interface LiveEventsResponse {
  scraped_at: string;
  week_start: string;
  week_end: string;
  total_events: number;
  data_source: string;
  days: {
    date: string;
    day_name: string;
    event_count: number;
    categories: string[];
    is_today: boolean;
    is_weekend: boolean;
    events: LiveEventData[];
  }[];
}

// Mock Live Events Data (your provided data)
const mockLiveEventsData: LiveEventsResponse = {
  "scraped_at": "2025-07-07T15:18:32.750865",
  "week_start": "2025-07-07T15:18:32.367169",
  "week_end": "2025-07-13T15:18:32.367169",
  "total_events": 13,
  "data_source": "Live scraping braunschweig.die-region.de",
  "days": [
    {
      "date": "2025-07-07T15:18:32.367169",
      "day_name": "Montag",
      "event_count": 9,
      "categories": ["Sonstige"],
      "is_today": true,
      "is_weekend": false,
      "events": [
        {
          "title": "Gemeindehaus der ev-luth. Kirchengemeinde Braunschweig-Stöckheim",
          "date": "Juli 2025",
          "time": "09:00 - 13:00 Uhr",
          "location": "Braunschweig",
          "description": "Event in Braunschweig",
          "price": "Siehe Website",
          "category": "Sonstige",
          "url": "https://braunschweig.die-region.de/",
          "source": "Braunschweig Region (Live)",
          "event_url": "",
          "parsed_date": null
        },
        {
          "title": "Friedrich-Kreiß-Weg 4",
          "date": "Juli 2025",
          "time": "10:30 - 23:55 Uhr",
          "location": "Friedrich-Kreiß-Weg 4",
          "description": "Event in Braunschweig",
          "price": "Siehe Website",
          "category": "Sonstige",
          "url": "https://braunschweig.die-region.de/",
          "source": "Braunschweig Region (Live)",
          "event_url": "",
          "parsed_date": null
        },
        {
          "title": "kemenate-hagenbrücke",
          "date": "Juli 2025",
          "time": "11:00 - 17:00 Uhr",
          "location": "kemenate",
          "description": "Event in Braunschweig",
          "price": "Siehe Website",
          "category": "Sonstige",
          "url": "https://braunschweig.die-region.de/",
          "source": "Braunschweig Region (Live)",
          "event_url": "",
          "parsed_date": null
        },
        {
          "title": "jakob-kemenate",
          "date": "Juli 2025",
          "time": "11:00 - 17:00 Uhr",
          "location": "kemenate",
          "description": "Event in Braunschweig",
          "price": "Siehe Website",
          "category": "Sonstige",
          "url": "https://braunschweig.die-region.de/",
          "source": "Braunschweig Region (Live)",
          "event_url": "",
          "parsed_date": null
        },
        {
          "title": "Schul- und Bürgergarten Dowesee, Eingang Nord (Grünfläche am See)",
          "date": "Juli 2025",
          "time": "17:30 - 18:30 Uhr",
          "location": "Schul- und Bürgergarten Dowesee",
          "description": "Event in Braunschweig",
          "price": "Siehe Website",
          "category": "Sonstige",
          "url": "https://braunschweig.die-region.de/",
          "source": "Braunschweig Region (Live)",
          "event_url": "",
          "parsed_date": null
        },
        {
          "title": "Bürgerstiftung Braunschweig",
          "date": "Juli 2025",
          "time": "Zeit nicht angegeben",
          "location": "Braunschweig",
          "description": "Event in Braunschweig",
          "price": "Siehe Website",
          "category": "Sonstige",
          "url": "https://braunschweig.die-region.de/",
          "source": "Braunschweig Region (Live)",
          "event_url": "",
          "parsed_date": null
        },
        {
          "title": "Brunswiek Marekting GmbH",
          "date": "Juli 2025",
          "time": "Zeit nicht angegeben",
          "location": "Braunschweig",
          "description": "Event in Braunschweig",
          "price": "Siehe Website",
          "category": "Sonstige",
          "url": "https://braunschweig.die-region.de/",
          "source": "Braunschweig Region (Live)",
          "event_url": "",
          "parsed_date": null
        },
        {
          "title": "Der winterliche Südsee",
          "date": "Juli 2025",
          "time": "Zeit nicht angegeben",
          "location": "Braunschweig",
          "description": "Event in Braunschweig",
          "price": "Siehe Website",
          "category": "Sonstige",
          "url": "https://braunschweig.die-region.de/",
          "source": "Braunschweig Region (Live)",
          "event_url": "",
          "parsed_date": null
        },
        {
          "title": "Stiftung Prüsse / Selbstportrait, Günter Affeldt, 1950",
          "date": "Juli 2025",
          "time": "Zeit nicht angegeben",
          "location": "Braunschweig",
          "description": "Event in Braunschweig",
          "price": "Siehe Website",
          "category": "Sonstige",
          "url": "https://braunschweig.die-region.de/",
          "source": "Braunschweig Region (Live)",
          "event_url": "",
          "parsed_date": null
        }
      ]
    },
    {
      "date": "2025-07-08T15:18:32.367169",
      "day_name": "Dienstag",
      "event_count": 3,
      "categories": ["Musik", "Kultur", "Sport"],
      "is_today": false,
      "is_weekend": false,
      "events": [
        {
          "title": "Die Architektur und die Geschichte des Herzog Anton Ulrich-Museums",
          "date": "8.07.2025",
          "time": "16:00 - 17:00 Uhr",
          "location": "Herzog Anton Ulrich-Museum",
          "description": "Event in Braunschweig",
          "price": "Siehe Website",
          "category": "Kultur",
          "url": "https://braunschweig.die-region.de/",
          "source": "Braunschweig Region (Live)",
          "event_url": "https://braunschweig.die-region.de/veranstaltungen-detailseite/event/101078524/die-architektur-und-die-geschichte-des-herzog-anton-ulrich-museums/",
          "parsed_date": "2025-07-08 00:00:00"
        },
        {
          "title": "FRAUEN*-SPORT-BAR | Deutschland : Dänemark",
          "date": "8.07.2025",
          "time": "17:00 - 23:00 Uhr",
          "location": "Dänemark",
          "description": "Event in Braunschweig",
          "price": "Siehe Website",
          "category": "Sport",
          "url": "https://braunschweig.die-region.de/",
          "source": "Braunschweig Region (Live)",
          "event_url": "https://braunschweig.die-region.de/veranstaltungen-detailseite/event/101056295/frauen-sport-bar-deutschland-daenemark/",
          "parsed_date": "2025-07-08 00:00:00"
        },
        {
          "title": "Ignite",
          "date": "8.07.2025",
          "time": "20:00 - 23:30 Uhr",
          "location": "KufA",
          "description": "Event in Braunschweig",
          "price": "Siehe Website",
          "category": "Musik",
          "url": "https://braunschweig.die-region.de/",
          "source": "Braunschweig Region (Live)",
          "event_url": "https://braunschweig.die-region.de/veranstaltungen-detailseite/event/101008881/ignite/",
          "parsed_date": "2025-07-08 00:00:00"
        }
      ]
    },
    {
      "date": "2025-07-09T15:18:32.367169",
      "day_name": "Mittwoch",
      "event_count": 0,
      "categories": [],
      "is_today": false,
      "is_weekend": false,
      "events": []
    },
    {
      "date": "2025-07-10T15:18:32.367169",
      "day_name": "Donnerstag",
      "event_count": 1,
      "categories": ["Kultur"],
      "is_today": false,
      "is_weekend": false,
      "events": [
        {
          "title": "Rundgang Hochschule für Bildende Künste",
          "date": "10.07.2025 - 13.07.2025",
          "time": "10:00 - 18:00 Uhr",
          "location": "HBK Braunschweig",
          "description": "Einblick in Arbeiten der Studenten der Kunsthochschule",
          "price": "Siehe Website",
          "category": "Kultur",
          "url": "https://braunschweig.de",
          "source": "Bekannte Events",
          "event_url": "",
          "parsed_date": "2025-07-10 00:00:00"
        }
      ]
    },
    {
      "date": "2025-07-11T15:18:32.367169",
      "day_name": "Freitag",
      "event_count": 0,
      "categories": [],
      "is_today": false,
      "is_weekend": false,
      "events": []
    },
    {
      "date": "2025-07-12T15:18:32.367169",
      "day_name": "Samstag",
      "event_count": 0,
      "categories": [],
      "is_today": false,
      "is_weekend": true,
      "events": []
    },
    {
      "date": "2025-07-13T15:18:32.367169",
      "day_name": "Sonntag",
      "event_count": 0,
      "categories": [],
      "is_today": false,
      "is_weekend": true,
      "events": []
    }
  ]
};

const EventsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedFilter, setSelectedFilter] = useState('Alle');
  const [favoriteEvents, setFavoriteEvents] = useState<string[]>([]);
  const [bookmarkedEvents, setBookmarkedEvents] = useState<string[]>([]);
  const [attendingEvents, setAttendingEvents] = useState<string[]>([]);
  const [interestedEvents, setInterestedEvents] = useState<string[]>([]);
  const [liveEvents, setLiveEvents] = useState<Event[]>([]);
  const [isLoadingLive, setIsLoadingLive] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  // Convert Live Event Data to Event Interface
  const convertLiveEventToEvent = (liveEvent: LiveEventData, dayIndex: number, eventIndex: number): Event => {
    // Parse time
    const timeMatch = liveEvent.time.match(/(\d{1,2}):(\d{2})/);
    const startTime = timeMatch ? `${timeMatch[1]}:${timeMatch[2]}` : '00:00';
    
    // Parse date
    let eventDate = new Date();
    if (liveEvent.parsed_date) {
      eventDate = new Date(liveEvent.parsed_date);
    } else {
      // Use day index to calculate date
      eventDate = new Date(Date.now() + (dayIndex * 86400000));
    }

    // Map category
    const categoryMap: { [key: string]: Event['category'] } = {
      'Musik': 'concert',
      'Kultur': 'culture',
      'Sport': 'sports',
      'Theater': 'theater',
      'Festival': 'festival',
      'Sonstige': 'other'
    };

    const category = categoryMap[liveEvent.category] || 'other';

    // Generate coordinates based on location
    const getCoordinates = (location: string) => {
      const locationMap: { [key: string]: { lat: number; lng: number } } = {
        'Herzog Anton Ulrich-Museum': { lat: 52.2634, lng: 10.5198 },
        'KufA': { lat: 52.2619, lng: 10.5178 },
        'Staatstheater': { lat: 52.2641, lng: 10.5189 },
        'Burgplatz': { lat: 52.2625, lng: 10.5211 },
        'Schlossplatz': { lat: 52.2615, lng: 10.5201 },
        'Dowesee': { lat: 52.2712, lng: 10.5445 },
        'HBK Braunschweig': { lat: 52.2567, lng: 10.5234 },
        'default': { lat: 52.2625, lng: 10.5211 }
      };

      return locationMap[location] || locationMap['default'];
    };

    // Generate placeholder image based on category
    const getPlaceholderImage = (category: string) => {
      const imageMap: { [key: string]: string } = {
        'concert': 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
        'culture': 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop',
        'sports': 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&h=300&fit=crop',
        'theater': 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=400&h=300&fit=crop',
        'other': 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=300&fit=crop'
      };
      return imageMap[category] || imageMap['other'];
    };

    const coordinates = getCoordinates(liveEvent.location);
    const centerPoint = { lat: 52.2625, lng: 10.5211 };
    const distance = Math.round(calculateDistance(centerPoint, coordinates));

    return {
      id: `live_${dayIndex}_${eventIndex}`,
      title: liveEvent.title.replace(/,$/, ''), // Remove trailing comma
      category,
      description: liveEvent.description,
      venue: liveEvent.location,
      address: `${liveEvent.location}, Braunschweig`,
      coordinates,
      startDate: eventDate,
      endDate: eventDate,
      startTime,
      endTime: liveEvent.time.includes(' - ') ? liveEvent.time.split(' - ')[1]?.replace(' Uhr', '') : undefined,
      price: {
        min: liveEvent.price === 'Siehe Website' ? 0 : 0,
        currency: 'EUR'
      },
      ticketUrl: liveEvent.event_url || liveEvent.url,
      image: getPlaceholderImage(category),
      organizer: liveEvent.source.replace(' (Live)', ''),
      attendees: Math.floor(Math.random() * 100) + 20, // Random attendees
      tags: [liveEvent.category, 'Live', 'Braunschweig'],
      rating: Math.round((Math.random() * 2 + 3) * 10) / 10, // 3.0-5.0
      reviewCount: Math.floor(Math.random() * 50) + 5,
      isFavorite: false,
      isBookmarked: false,
      isAttending: false,
      status: 'upcoming' as const,
      featured: liveEvent.category === 'Musik' || liveEvent.category === 'Kultur',
      distance,
      dataSource: 'live' as const,
      eventUrl: liveEvent.event_url
    };
  };

  // Calculate distance between two points
  const calculateDistance = (point1: { lat: number; lng: number }, point2: { lat: number; lng: number }): number => {
    const R = 6371000; // Earth's radius in meters
    const dLat = (point2.lat - point1.lat) * Math.PI / 180;
    const dLng = (point2.lng - point1.lng) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(point1.lat * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) *
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Load live events
  const loadLiveEvents = useCallback(async () => {
    setIsLoadingLive(true);
    try {
      // Simulate API call - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const convertedEvents: Event[] = [];
      mockLiveEventsData.days.forEach((day, dayIndex) => {
        day.events.forEach((event, eventIndex) => {
          const convertedEvent = convertLiveEventToEvent(event, dayIndex, eventIndex);
          convertedEvents.push(convertedEvent);
        });
      });

      setLiveEvents(convertedEvents);
      setLastUpdate(new Date());
      console.log(`✅ ${convertedEvents.length} Live-Events geladen`);
    } catch (error) {
      console.error('❌ Fehler beim Laden der Live-Events:', error);
    } finally {
      setIsLoadingLive(false);
    }
  }, []);

  // Load live events on component mount
  useEffect(() => {
    loadLiveEvents();
  }, [loadLiveEvents]);

  // Static events (your existing events)
  const staticEvents = useMemo<Event[]>(() => [
    {
      id: 'klassik-konzert',
      title: 'Klassik Konzert: Braunschweiger Symphoniker',
      category: 'concert',
      description: 'Ein unvergesslicher Abend mit den Braunschweiger Symphonikern. Auf dem Programm stehen Werke von Mozart, Beethoven und Brahms.',
      venue: 'Stadthalle Braunschweig',
      address: 'Leonhardstraße 1, 38102 Braunschweig',
      coordinates: { lat: 52.2647, lng: 10.5234 },
      startDate: new Date(Date.now() + 86400000 * 2),
      endDate: new Date(Date.now() + 86400000 * 2),
      startTime: '19:30',
      endTime: '22:00',
      price: { min: 25, max: 85, currency: 'EUR' },
      ticketUrl: 'https://tickets.braunschweig.de',
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
      organizer: 'Braunschweiger Symphoniker',
      attendees: 847,
      capacity: 1200,
      tags: ['Klassik', 'Kultur', 'Premium'],
      rating: 4.8,
      reviewCount: 156,
      isFavorite: false,
      isBookmarked: false,
      isAttending: false,
      status: 'upcoming',
      featured: true,
      distance: 250,
      dataSource: 'static'
    },
    {
      id: 'stadtfest',
      title: 'Braunschweiger Stadtfest 2025',
      category: 'festival',
      description: 'Das größte Straßenfest der Region mit Musik, Kulinarik und Unterhaltung für die ganze Familie.',
      venue: 'Innenstadt Braunschweig',
      address: 'Burgplatz & Umgebung, 38100 Braunschweig',
      coordinates: { lat: 52.2625, lng: 10.5211 },
      startDate: new Date(Date.now() + 86400000 * 5),
      endDate: new Date(Date.now() + 86400000 * 7),
      startTime: '10:00',
      endTime: '23:00',
      price: { min: 0, currency: 'EUR' },
      image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&h=300&fit=crop',
      organizer: 'Stadt Braunschweig',
      attendees: 15000,
      tags: ['Festival', 'Familie', 'Kostenlos', 'Musik'],
      rating: 4.5,
      reviewCount: 892,
      isFavorite: false,
      isBookmarked: false,
      isAttending: false,
      status: 'upcoming',
      featured: true,
      distance: 50,
      dataSource: 'static'
    }
  ], []);

  // Combine static and live events
  const allEvents = useMemo(() => {
    return [...staticEvents, ...liveEvents];
  }, [staticEvents, liveEvents]);

  // Filter options
  const filterOptions = ['Alle', 'Heute', 'Live Events', 'Kostenlos', 'Konzerte', 'Theater', 'Festivals', 'Kultur', 'Sport'];

  // Enhanced filter logic
  const filteredAndSortedEvents = useMemo(() => {
    let filtered = allEvents;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query) ||
        event.venue.toLowerCase().includes(query) ||
        event.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    if (selectedFilter !== 'Alle') {
      if (selectedFilter === 'Heute') {
        const today = new Date();
        const todayStr = today.toDateString();
        filtered = filtered.filter(event => event.startDate.toDateString() === todayStr);
      } else if (selectedFilter === 'Live Events') {
        filtered = filtered.filter(event => event.dataSource === 'live');
      } else if (selectedFilter === 'Kostenlos') {
        filtered = filtered.filter(event => event.price.min === 0);
      } else if (selectedFilter === 'Konzerte') {
        filtered = filtered.filter(event => event.category === 'concert');
      } else if (selectedFilter === 'Theater') {
        filtered = filtered.filter(event => event.category === 'theater');
      } else if (selectedFilter === 'Festivals') {
        filtered = filtered.filter(event => event.category === 'festival');
      } else if (selectedFilter === 'Kultur') {
        filtered = filtered.filter(event => event.category === 'culture');
      } else if (selectedFilter === 'Sport') {
        filtered = filtered.filter(event => event.category === 'sports');
      }
    }

    // Sort by date
    filtered.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());

    return filtered;
  }, [allEvents, searchQuery, selectedFilter]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'concert': return '🎵';
      case 'theater': return '🎭';
      case 'festival': return '🎉';
      case 'sports': return '⚽';
      case 'culture': return '🎨';
      case 'food': return '🍽️';
      case 'family': return '👨‍👩‍👧‍👦';
      case 'nightlife': return '🍸';
      case 'exhibition': return '🖼️';
      case 'workshop': return '🛠️';
      case 'other': return '📅';
      default: return '📅';
    }
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today.getTime() + 86400000);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Heute';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Morgen';
    } else {
      return date.toLocaleDateString('de-DE', { 
        weekday: 'short', 
        day: 'numeric', 
        month: 'short' 
      });
    }
  };

  const toggleFavorite = useCallback((eventId: string) => {
    setFavoriteEvents(prev =>
      prev.includes(eventId)
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId]
    );
  }, []);

  const toggleBookmark = useCallback((eventId: string) => {
    setBookmarkedEvents(prev =>
      prev.includes(eventId)
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId]
    );
  }, []);

  const toggleAttending = useCallback((eventId: string) => {
    setAttendingEvents(prev =>
      prev.includes(eventId)
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId]
    );
  }, []);

  // Components
  const EventCard: React.FC<{ event: Event }> = ({ event }) => {
    const isAttending = attendingEvents.includes(event.id);
    const isBookmarked = bookmarkedEvents.includes(event.id);

    return (
      <div 
        className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer"
        onClick={() => setSelectedEvent(event)}
      >
        <div className="relative h-48 overflow-hidden">
          <Image
            src={event.image}
            alt={event.title}
            fill
            className="object-cover"
          />
          <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded-lg text-sm">
            {getCategoryIcon(event.category)} {event.category}
          </div>
          <div className="absolute top-3 right-3 flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(event.id);
              }}
              className="bg-black/50 backdrop-blur-sm p-2 rounded-full hover:bg-black/60 transition-colors"
            >
              <Heart className={`w-4 h-4 ${favoriteEvents.includes(event.id) ? 'text-red-500 fill-current' : 'text-white'}`} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleBookmark(event.id);
              }}
              className="bg-black/50 backdrop-blur-sm p-2 rounded-full hover:bg-black/60 transition-colors"
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'text-blue-500 fill-current' : 'text-white'}`} />
            </button>
          </div>
          {event.dataSource === 'live' && (
            <div className="absolute bottom-3 left-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              🟢 Live
            </div>
          )}
          {event.featured && (
            <div className="absolute bottom-3 right-3 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              ⭐ Featured
            </div>
          )}
        </div>

        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-bold text-gray-800 line-clamp-2">{event.title}</h3>
            {event.rating && (
              <div className="flex items-center gap-1 ml-2">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="text-sm font-medium text-gray-600">{event.rating}</span>
              </div>
            )}
          </div>

          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{event.description}</p>

          <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(event.startDate)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{event.startTime}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{event.distance}m</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <span className="truncate">{event.venue}</span>
            <span>•</span>
            <span>{event.attendees} Teilnehmer</span>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              {event.price.min === 0 ? (
                <span className="text-green-600 font-medium">Kostenlos</span>
              ) : (
                <span className="text-gray-800 font-medium">
                  ab {event.price.min}€
                </span>
              )}
              {event.dataSource === 'live' && (
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                  Live
                </span>
              )}
            </div>

            <div className="flex gap-2">
              {event.eventUrl && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(event.eventUrl, '_blank');
                  }}
                  className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleAttending(event.id);
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isAttending
                    ? 'bg-green-500 text-white hover:bg-green-600'
                    : 'bg-purple-500 text-white hover:bg-purple-600'
                }`}
              >
                {isAttending ? '✓ Dabei' : '+ Teilnehmen'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const EventDetailModal: React.FC = () => {
    if (!selectedEvent) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end">
        <div className="bg-white rounded-t-2xl w-full max-h-[85vh] overflow-y-auto">
          <div className="relative">
            <Image
              src={selectedEvent.image}
              alt={selectedEvent.title}
              width={400}
              height={200}
              className="w-full h-48 object-cover"
            />
            <button
              onClick={() => setSelectedEvent(null)}
              className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            {selectedEvent.dataSource === 'live' && (
              <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                🟢 Live Event
              </div>
            )}
          </div>

          <div className="p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{selectedEvent.title}</h2>
                <p className="text-gray-600">{selectedEvent.venue}</p>
              </div>
              <button
                onClick={() => toggleFavorite(selectedEvent.id)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Heart className={`w-6 h-6 ${favoriteEvents.includes(selectedEvent.id) ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
              </button>
            </div>

            <p className="text-gray-600 mb-4">{selectedEvent.description}</p>

            <div className="bg-gray-50 p-4 rounded-xl mb-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-purple-600">{formatDate(selectedEvent.startDate)}</div>
                  <div className="text-sm text-gray-600">Datum</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">{selectedEvent.startTime}</div>
                  <div className="text-sm text-gray-600">Uhrzeit</div>
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Details</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Veranstalter:</span>
                    <span>{selectedEvent.organizer}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Teilnehmer:</span>
                    <span>{selectedEvent.attendees}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Preis:</span>
                    <span>
                      {selectedEvent.price.min === 0 ? 'Kostenlos' : `ab ${selectedEvent.price.min}€`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Datenquelle:</span>
                    <span className="capitalize">{selectedEvent.dataSource === 'live' ? 'Live Event' : 'Statisch'}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedEvent.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => alert(`Navigation zu ${selectedEvent.venue} gestartet!`)}
                className="bg-blue-500 text-white py-3 rounded-xl font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
              >
                <Navigation className="w-5 h-5" />
                Route
              </button>
              {selectedEvent.eventUrl ? (
                <button
                  onClick={() => window.open(selectedEvent.eventUrl, '_blank')}
                  className="bg-green-500 text-white py-3 rounded-xl font-semibold hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                >
                  <ExternalLink className="w-5 h-5" />
                  Event-Seite
                </button>
              ) : (
                <button
                  onClick={() => toggleAttending(selectedEvent.id)}
                  className={`py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 ${
                    attendingEvents.includes(selectedEvent.id)
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : 'bg-purple-500 text-white hover:bg-purple-600'
                  }`}
                >
                  <Calendar className="w-5 h-5" />
                  {attendingEvents.includes(selectedEvent.id) ? 'Dabei' : 'Teilnehmen'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Enhanced stats calculation
  const statsData = useMemo(() => ({
    total: allEvents.length,
    live: liveEvents.length,
    today: allEvents.filter(e => e.startDate.toDateString() === new Date().toDateString()).length,
    free: allEvents.filter(e => e.price.min === 0).length
  }), [allEvents, liveEvents]);

  return (
    <>
      <Head>
        <title>Events - BS.Smart Braunschweig</title>
        <meta name="description" content="Entdecken Sie spannende Events und Veranstaltungen in Braunschweig" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-md mx-auto bg-white shadow-2xl min-h-screen">
          {/* Header */}
          <div className="bg-purple-600 text-white p-4">
            <div className="flex items-center justify-between mb-4">
              <Link href="/" className="p-2 hover:bg-purple-700 rounded-lg transition-colors">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <h1 className="text-xl font-bold">Events</h1>
              <button
                onClick={loadLiveEvents}
                disabled={isLoadingLive}
                className="p-2 hover:bg-purple-700 rounded-lg transition-colors"
              >
                {isLoadingLive ? (
                  <RefreshCw className="w-6 h-6 animate-spin" />
                ) : (
                  <RefreshCw className="w-6 h-6" />
                )}
              </button>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-300" />
              <input
                type="text"
                placeholder="Events suchen..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-purple-500/30 border border-purple-400 rounded-xl placeholder-purple-200 text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="bg-white border-b border-gray-200 px-4 pt-4">
            <div className="flex gap-2 overflow-x-auto pb-4">
              {filterOptions.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${
                    selectedFilter === filter
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Enhanced Stats */}
          <div className="bg-white px-4 py-3 border-b border-gray-200">
            <div className="grid grid-cols-4 gap-2 text-center">
              <div>
                <div className="text-xl font-bold text-purple-600">{statsData.total}</div>
                <div className="text-xs text-gray-600">Gesamt</div>
              </div>
              <div>
                <div className="text-xl font-bold text-green-600">{statsData.live}</div>
                <div className="text-xs text-gray-600">Live</div>
              </div>
              <div>
                <div className="text-xl font-bold text-blue-600">{statsData.today}</div>
                <div className="text-xs text-gray-600">Heute</div>
              </div>
              <div>
                <div className="text-xl font-bold text-orange-600">{statsData.free}</div>
                <div className="text-xs text-gray-600">Kostenlos</div>
              </div>
            </div>
          </div>

          {/* Live Events Info */}
          {lastUpdate && (
            <div className="bg-green-50 border-l-4 border-green-500 p-3 mx-4 mt-4 rounded-r-lg">
              <div className="flex items-center gap-2 text-sm text-green-800">
                <AlertCircle className="w-4 h-4" />
                <span>
                  Live-Events aktualisiert: {lastUpdate.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          )}

          {/* Events Grid */}
          <div className="p-4 pb-24">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-800">
                {searchQuery ? 'Suchergebnisse' : 'Events in Braunschweig'}
              </h2>
              <span className="text-sm text-gray-500">
                {filteredAndSortedEvents.length} gefunden
              </span>
            </div>

            {filteredAndSortedEvents.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {filteredAndSortedEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">Keine Events gefunden</h3>
                <p className="text-gray-500">Versuchen Sie andere Suchbegriffe oder Filter</p>
              </div>
            )}
          </div>

          {/* Bottom Navigation */}
          <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white/95 backdrop-blur-md border-t border-gray-200 px-4 py-3 shadow-lg">
            <div className="flex justify-around items-center">
              <Link href="/" className="flex flex-col items-center gap-1 text-gray-400 hover:text-blue-500 transition-colors">
                <Home className="w-6 h-6" />
                <span className="text-xs font-medium">Home</span>
              </Link>
              
              <Link href="/navigation" className="flex flex-col items-center gap-1 text-gray-400 hover:text-blue-500 transition-colors">
                <Navigation className="w-6 h-6" />
                <span className="text-xs font-medium">Navigation</span>
              </Link>
              
              <div className="flex flex-col items-center gap-1 text-purple-500">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs font-medium">Events</span>
              </div>
              
              <Link href="/vouchers" className="flex flex-col items-center gap-1 text-gray-400 hover:text-pink-500 transition-colors">
                <Gift className="w-6 h-6" />
                <span className="text-xs font-medium">Gutscheine</span>
              </Link>
              
              <Link href="/restaurants" className="flex flex-col items-center gap-1 text-gray-400 hover:text-red-500 transition-colors">
                <Coffee className="w-6 h-6" />
                <span className="text-xs font-medium">Restaurants</span>
              </Link>
            </div>
          </div>

          {/* Event Detail Modal */}
          {selectedEvent && <EventDetailModal />}
        </div>
      </div>
    </>
  );
};

export default EventsPage;