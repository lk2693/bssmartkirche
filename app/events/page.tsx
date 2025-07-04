'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowLeft, Navigation, MapPin, Search, Star, 
  Clock, Compass, Eye, Target, Route, Car, 
  Bike, Users, Coffee, ShoppingBag, Camera,
  Home, Gift, User, Zap, Info, Heart, Share2,
  Navigation2, Crosshair, Volume2, VolumeX, Phone,
  MessageCircle, Layers, Satellite, Map,
  AlertTriangle, CheckCircle, XCircle,
  TrendingUp, Award, Crown, Settings, Bell,
  Calendar, Bookmark, History, Filter, SortAsc,
  ChevronDown, ChevronUp, MoreVertical, Play,
  Pause, RotateCcw, Maximize2, X, Ticket,
  Music, Theater, Gamepad2, Wine, Palette,
  TreePine, BookOpen, Building, Utensils,
  CalendarDays, ExternalLink, Download,
  Clock3, Euro, PartyPopper, MapPinIcon
} from 'lucide-react';

// Types
interface Event {
  id: string;
  title: string;
  category: 'concert' | 'theater' | 'festival' | 'sports' | 'culture' | 'food' | 'family' | 'nightlife' | 'exhibition' | 'workshop';
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
}

const EventsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedFilter, setSelectedFilter] = useState('Alle');
  const [favoriteEvents, setFavoriteEvents] = useState<string[]>(['klassik-konzert', 'stadtfest', 'kunstausstellung']);
  const [bookmarkedEvents, setBookmarkedEvents] = useState<string[]>(['theater-abend', 'food-festival', 'flohmarkt']);
  const [attendingEvents, setAttendingEvents] = useState<string[]>(['klassik-konzert', 'stadtfuehrung']);
  const [interestedEvents, setInterestedEvents] = useState<string[]>(['orgelkonzert', 'buchlesung']);

  // Extended Mock events data with more free events and church events
  const events = useMemo<Event[]>(() => [
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
      isFavorite: true,
      isBookmarked: false,
      isAttending: true,
      status: 'upcoming',
      featured: true,
      distance: 250
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
      isFavorite: true,
      isBookmarked: false,
      isAttending: false,
      status: 'upcoming',
      featured: true,
      distance: 50
    },
    {
      id: 'theater-abend',
      title: 'Hamlet - Staatstheater Braunschweig',
      category: 'theater',
      description: 'Shakespeares zeitloser Klassiker in einer modernen Inszenierung des Staatstheaters.',
      venue: 'Staatstheater Braunschweig',
      address: 'Am Theater, 38100 Braunschweig',
      coordinates: { lat: 52.2641, lng: 10.5189 },
      startDate: new Date(Date.now() + 86400000 * 1),
      endDate: new Date(Date.now() + 86400000 * 1),
      startTime: '19:30',
      endTime: '22:30',
      price: { min: 15, max: 45, currency: 'EUR' },
      ticketUrl: 'https://staatstheater-braunschweig.de',
      image: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=400&h=300&fit=crop',
      organizer: 'Staatstheater Braunschweig',
      attendees: 234,
      capacity: 350,
      tags: ['Theater', 'Klassiker', 'Drama'],
      rating: 4.6,
      reviewCount: 78,
      isFavorite: false,
      isBookmarked: true,
      isAttending: false,
      status: 'upcoming',
      featured: false,
      distance: 180
    },
    {
      id: 'kunstausstellung',
      title: 'Moderne Kunst: "Braunschweig Digital"',
      category: 'exhibition',
      description: 'Eine innovative Ausstellung zeitgenössischer Künstler mit digitalen und interaktiven Installationen.',
      venue: 'Kunstmuseum Braunschweig',
      address: 'Lessingplatz 12, 38100 Braunschweig',
      coordinates: { lat: 52.2634, lng: 10.5198 },
      startDate: new Date(Date.now() - 86400000 * 5),
      endDate: new Date(Date.now() + 86400000 * 25),
      startTime: '10:00',
      endTime: '18:00',
      price: { min: 8, max: 12, currency: 'EUR' },
      image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop',
      organizer: 'Kunstmuseum Braunschweig',
      attendees: 1250,
      tags: ['Kunst', 'Digital', 'Interaktiv', 'Modern'],
      rating: 4.7,
      reviewCount: 203,
      isFavorite: true,
      isBookmarked: false,
      isAttending: false,
      status: 'ongoing',
      featured: false,
      distance: 120
    },
    {
      id: 'food-festival',
      title: 'Kulinarisches Festival: Taste of Braunschweig',
      category: 'food',
      description: 'Entdecken Sie die Vielfalt der regionalen und internationalen Küche bei diesem kulinarischen Highlight.',
      venue: 'Schlosspark Braunschweig',
      address: 'Schlossplatz, 38100 Braunschweig',
      coordinates: { lat: 52.2612, lng: 10.5156 },
      startDate: new Date(Date.now() + 86400000 * 12),
      endDate: new Date(Date.now() + 86400000 * 14),
      startTime: '11:00',
      endTime: '21:00',
      price: { min: 5, max: 25, currency: 'EUR' },
      image: 'https://images.unsplash.com/photo-1555939594-58e687d16f8b?w=400&h=300&fit=crop',
      organizer: 'Braunschweig Gastronomie e.V.',
      attendees: 890,
      tags: ['Kulinarik', 'Regional', 'International', 'Genuss'],
      rating: 4.4,
      reviewCount: 167,
      isFavorite: false,
      isBookmarked: true,
      isAttending: false,
      status: 'upcoming',
      featured: false,
      distance: 420
    },
    {
      id: 'jazz-club',
      title: 'Jazz Night: Blue Note Sessions',
      category: 'concert',
      description: 'Entspannter Jazz-Abend mit lokalen und internationalen Künstlern in intimer Atmosphäre.',
      venue: 'Jazz Club Braunschweig',
      address: 'Güldenstraße 7, 38100 Braunschweig',
      coordinates: { lat: 52.2598, lng: 10.5223 },
      startDate: new Date(Date.now() + 86400000 * 3),
      endDate: new Date(Date.now() + 86400000 * 3),
      startTime: '20:00',
      endTime: '01:00',
      price: { min: 18, max: 35, currency: 'EUR' },
      image: 'https://images.unsplash.com/photo-1415886541506-6f6fdc28ddb1?w=400&h=300&fit=crop',
      organizer: 'Jazz Club Braunschweig',
      attendees: 120,
      capacity: 150,
      tags: ['Jazz', 'Live Musik', 'Abends', 'Intim'],
      rating: 4.9,
      reviewCount: 89,
      isFavorite: false,
      isBookmarked: false,
      isAttending: false,
      status: 'upcoming',
      featured: false,
      distance: 340
    },
    // NEW FREE EVENTS
    {
      id: 'orgelkonzert',
      title: 'Orgelkonzert in St. Martini',
      category: 'concert',
      description: 'Kostenfreies Orgelkonzert in der historischen St. Martini Kirche mit Werken von Bach und Händel. Eintritt frei, Spenden willkommen.',
      venue: 'St. Martini Kirche',
      address: 'Bei St. Martini 1, 38100 Braunschweig',
      coordinates: { lat: 52.2615, lng: 10.5189 },
      startDate: new Date(Date.now() + 86400000 * 1),
      endDate: new Date(Date.now() + 86400000 * 1),
      startTime: '17:00',
      endTime: '18:30',
      price: { min: 0, currency: 'EUR' },
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
      organizer: 'St. Martini Gemeinde',
      attendees: 89,
      capacity: 200,
      tags: ['Kirche', 'Kostenlos', 'Klassik', 'Orgel'],
      rating: 4.6,
      reviewCount: 34,
      isFavorite: false,
      isBookmarked: false,
      isAttending: false,
      status: 'upcoming',
      featured: false,
      distance: 180
    },
    {
      id: 'stadtfuehrung',
      title: 'Kostenlose Stadtführung: Löwen-Trail',
      category: 'culture',
      description: 'Entdecken Sie Braunschweig bei einer kostenlosen Stadtführung auf dem berühmten Löwen-Trail. Treffpunkt am Burgplatz.',
      venue: 'Braunschweiger Innenstadt',
      address: 'Burgplatz, 38100 Braunschweig',
      coordinates: { lat: 52.2625, lng: 10.5211 },
      startDate: new Date(Date.now() + 86400000 * 0), // Today
      endDate: new Date(Date.now() + 86400000 * 0),
      startTime: '14:00',
      endTime: '16:00',
      price: { min: 0, currency: 'EUR' },
      image: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=300&fit=crop',
      organizer: 'Braunschweig Stadtmarketing',
      attendees: 25,
      capacity: 30,
      tags: ['Kostenlos', 'Stadtführung', 'Geschichte', 'Löwen'],
      rating: 4.7,
      reviewCount: 125,
      isFavorite: false,
      isBookmarked: false,
      isAttending: true,
      status: 'upcoming',
      featured: true,
      distance: 50
    },
    {
      id: 'flohmarkt',
      title: 'Flohmarkt am Kohlmarkt',
      category: 'family',
      description: 'Großer Flohmarkt mit Antiquitäten, Büchern, Spielzeug und vielem mehr. Für die ganze Familie geeignet.',
      venue: 'Kohlmarkt',
      address: 'Kohlmarkt, 38100 Braunschweig',
      coordinates: { lat: 52.2638, lng: 10.5201 },
      startDate: new Date(Date.now() + 86400000 * 6), // Next Saturday
      endDate: new Date(Date.now() + 86400000 * 6),
      startTime: '08:00',
      endTime: '16:00',
      price: { min: 0, currency: 'EUR' },
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
      organizer: 'Braunschweiger Flohmarkt e.V.',
      attendees: 450,
      tags: ['Kostenlos', 'Familie', 'Shopping', 'Antiquitäten'],
      rating: 4.3,
      reviewCount: 87,
      isFavorite: false,
      isBookmarked: true,
      isAttending: false,
      status: 'upcoming',
      featured: false,
      distance: 120
    },
    {
      id: 'gottesdienst',
      title: 'Familiengottesdienst mit Kindergarten',
      category: 'family',
      description: 'Besonderer Familiengottesdienst mit Aufführung der Kindergartenkinder. Anschließend Kirchencafé im Gemeindehaus.',
      venue: 'St. Petri Kirche',
      address: 'Petrikirchplatz, 38100 Braunschweig',
      coordinates: { lat: 52.2591, lng: 10.5234 },
      startDate: new Date(Date.now() + 86400000 * 7), // Next Sunday
      endDate: new Date(Date.now() + 86400000 * 7),
      startTime: '10:00',
      endTime: '12:00',
      price: { min: 0, currency: 'EUR' },
      image: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?w=400&h=300&fit=crop',
      organizer: 'St. Petri Gemeinde',
      attendees: 78,
      capacity: 150,
      tags: ['Kirche', 'Familie', 'Kostenlos', 'Kinder'],
      rating: 4.5,
      reviewCount: 23,
      isFavorite: false,
      isBookmarked: false,
      isAttending: false,
      status: 'upcoming',
      featured: false,
      distance: 280
    },
    {
      id: 'buchlesung',
      title: 'Autorenlesung: "Braunschweig - Damals und Heute"',
      category: 'culture',
      description: 'Der lokale Autor Dr. Hermann Meyer liest aus seinem neuen Buch über die Geschichte Braunschweigs. Eintritt frei.',
      venue: 'Stadtbibliothek Braunschweig',
      address: 'Hintern Brüdern 23, 38100 Braunschweig',
      coordinates: { lat: 52.2619, lng: 10.5178 },
      startDate: new Date(Date.now() + 86400000 * 4),
      endDate: new Date(Date.now() + 86400000 * 4),
      startTime: '19:00',
      endTime: '20:30',
      price: { min: 0, currency: 'EUR' },
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop',
      organizer: 'Stadtbibliothek Braunschweig',
      attendees: 45,
      capacity: 80,
      tags: ['Kostenlos', 'Literatur', 'Geschichte', 'Lesung'],
      rating: 4.4,
      reviewCount: 18,
      isFavorite: false,
      isBookmarked: false,
      isAttending: false,
      status: 'upcoming',
      featured: false,
      distance: 150
    },
    {
      id: 'seniorennachmittag',
      title: 'Seniorennachmittag: Kaffee & Klönschnack',
      category: 'family',
      description: 'Gemütlicher Nachmittag für Senioren mit Kaffee, Kuchen und interessanten Gesprächen im Gemeindezentrum.',
      venue: 'Gemeindezentrum St. Andreas',
      address: 'Andreasstraße 15, 38100 Braunschweig',
      coordinates: { lat: 52.2603, lng: 10.5145 },
      startDate: new Date(Date.now() + 86400000 * 3),
      endDate: new Date(Date.now() + 86400000 * 3),
      startTime: '14:30',
      endTime: '17:00',
      price: { min: 0, currency: 'EUR' },
      image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&h=300&fit=crop',
      organizer: 'St. Andreas Gemeinde',
      attendees: 32,
      capacity: 50,
      tags: ['Kostenlos', 'Senioren', 'Gemeinschaft', 'Kaffee'],
      rating: 4.8,
      reviewCount: 12,
      isFavorite: false,
      isBookmarked: false,
      isAttending: false,
      status: 'upcoming',
      featured: false,
      distance: 380
    },
    {
      id: 'jugendtreff',
      title: 'Jugendtreff: Gaming & Pizza',
      category: 'family',
      description: 'Offener Jugendtreff mit Gaming-Ecke, Pizza und coolen Leuten. Für Jugendliche von 12-18 Jahren.',
      venue: 'Jugendhaus Eastside',
      address: 'Östliche Straße 45, 38100 Braunschweig',
      coordinates: { lat: 52.2567, lng: 10.5312 },
      startDate: new Date(Date.now() + 86400000 * 2),
      endDate: new Date(Date.now() + 86400000 * 2),
      startTime: '16:00',
      endTime: '20:00',
      price: { min: 0, currency: 'EUR' },
      image: 'https://images.unsplash.com/photo-1556196153-68dd0a82c7ad?w=400&h=300&fit=crop',
      organizer: 'Jugendhaus Eastside',
      attendees: 18,
      capacity: 25,
      tags: ['Kostenlos', 'Jugend', 'Gaming', 'Pizza'],
      rating: 4.9,
      reviewCount: 27,
      isFavorite: false,
      isBookmarked: false,
      isAttending: false,
      status: 'upcoming',
      featured: false,
      distance: 450
    },
    {
      id: 'tanzkurs',
      title: 'Schnupper-Tanzkurs: Salsa für Anfänger',
      category: 'workshop',
      description: 'Kostenloser Schnupperkurs für Salsa-Anfänger. Keine Vorkenntnisse nötig, Tanzpartner wird gestellt.',
      venue: 'Tanzschule Movimiento',
      address: 'Wilhelmstraße 12, 38100 Braunschweig',
      coordinates: { lat: 52.2634, lng: 10.5267 },
      startDate: new Date(Date.now() + 86400000 * 5),
      endDate: new Date(Date.now() + 86400000 * 5),
      startTime: '18:00',
      endTime: '19:30',
      price: { min: 0, currency: 'EUR' },
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
      organizer: 'Tanzschule Movimiento',
      attendees: 22,
      capacity: 30,
      tags: ['Kostenlos', 'Tanzen', 'Salsa', 'Anfänger'],
      rating: 4.7,
      reviewCount: 15,
      isFavorite: false,
      isBookmarked: false,
      isAttending: false,
      status: 'upcoming',
      featured: false,
      distance: 320
    },
    // Keep existing paid events...
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
      isFavorite: true,
      isBookmarked: false,
      isAttending: false,
      status: 'upcoming',
      featured: true,
      distance: 50
    }
    // ... keep other existing events
  ], []);

  // Updated filter options to include more categories
  const filterOptions = ['Alle', 'Heute', 'Kostenlos', 'Konzerte', 'Theater', 'Festivals', 'Kirche', 'Familie', 'Workshop'];

  // Enhanced filter logic
  const filteredAndSortedEvents = useMemo(() => {
    let filtered = events;

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
      } else if (selectedFilter === 'Kostenlos') {
        filtered = filtered.filter(event => event.price.min === 0);
      } else if (selectedFilter === 'Konzerte') {
        filtered = filtered.filter(event => event.category === 'concert');
      } else if (selectedFilter === 'Theater') {
        filtered = filtered.filter(event => event.category === 'theater');
      } else if (selectedFilter === 'Festivals') {
        filtered = filtered.filter(event => event.category === 'festival');
      } else if (selectedFilter === 'Kirche') {
        filtered = filtered.filter(event => event.tags.includes('Kirche'));
      } else if (selectedFilter === 'Familie') {
        filtered = filtered.filter(event => event.category === 'family');
      } else if (selectedFilter === 'Workshop') {
        filtered = filtered.filter(event => event.category === 'workshop');
      }
    }

    // Sort by date
    filtered.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());

    return filtered;
  }, [events, searchQuery, selectedFilter]);

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

  const toggleAttending = useCallback((eventId: string) => {
    setAttendingEvents(prev =>
      prev.includes(eventId)
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId]
    );
  }, []);

  const toggleInterested = useCallback((eventId: string) => {
    setInterestedEvents(prev =>
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

  // Components
  const EventCard: React.FC<{ event: Event }> = ({ event }) => {
    const isAttending = attendingEvents.includes(event.id);
    const isInterested = interestedEvents.includes(event.id);
    const isBookmarked = bookmarkedEvents.includes(event.id);

    const getButtonConfig = () => {
      if (isAttending) {
        return {
          text: 'Dabei',
          color: 'bg-green-500 hover:bg-green-600',
          icon: '✓'
        };
      } else if (isInterested) {
        return {
          text: 'Interessiert',
          color: 'bg-yellow-500 hover:bg-yellow-600',
          icon: '⭐'
        };
      } else if (isBookmarked) {
        return {
          text: 'Vorgemerkt',
          color: 'bg-blue-500 hover:bg-blue-600',
          icon: '📌'
        };
      } else {
        return {
          text: 'Teilnehmen',
          color: 'bg-purple-500 hover:bg-purple-600',
          icon: '+'
        };
      }
    };

    const handleMainAction = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!isAttending && !isInterested && !isBookmarked) {
        // Show options menu
        showActionMenu(event.id);
      } else {
        // Remove current status
        if (isAttending) {
          toggleAttending(event.id);
        } else if (isInterested) {
          toggleInterested(event.id);
        } else if (isBookmarked) {
          toggleBookmark(event.id);
        }
      }
    };

    const buttonConfig = getButtonConfig();

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
          {event.status === 'ongoing' && (
            <div className="absolute bottom-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              Live
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
              {/* Status badges */}
              <div className="flex gap-1">
                {isAttending && (
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    ✓ Dabei
                  </span>
                )}
                {isInterested && (
                  <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                    ⭐ Interessiert
                  </span>
                )}
                {isBookmarked && (
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    📌 Vorgemerkt
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={handleMainAction}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors text-white ${buttonConfig.color}`}
            >
              {buttonConfig.icon} {buttonConfig.text}
            </button>
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
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Action menu state
  const [showActionMenuForEvent, setShowActionMenuForEvent] = useState<string | null>(null);

  const showActionMenu = (eventId: string) => {
    setShowActionMenuForEvent(eventId);
  };

  const ActionMenu: React.FC<{ eventId: string }> = ({ eventId }) => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-sm">
        <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">
          Wie möchten Sie teilnehmen?
        </h3>
        <div className="space-y-3">
          <button
            onClick={() => {
              toggleAttending(eventId);
              setShowActionMenuForEvent(null);
            }}
            className="w-full bg-green-500 text-white py-3 rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
          >
            <Calendar className="w-5 h-5" />
            Ich nehme teil
          </button>
          <button
            onClick={() => {
              toggleInterested(eventId);
              setShowActionMenuForEvent(null);
            }}
            className="w-full bg-yellow-500 text-white py-3 rounded-lg font-medium hover:bg-yellow-600 transition-colors flex items-center justify-center gap-2"
          >
            <Star className="w-5 h-5" />
            Ich habe Interesse
          </button>
          <button
            onClick={() => {
              toggleBookmark(eventId);
              setShowActionMenuForEvent(null);
            }}
            className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
          >
            <Bookmark className="w-5 h-5" />
            Event vormerken
          </button>
          <button
            onClick={() => setShowActionMenuForEvent(null)}
            className="w-full bg-gray-500 text-white py-3 rounded-lg font-medium hover:bg-gray-600 transition-colors"
          >
            Abbrechen
          </button>
        </div>
      </div>
    </div>
  );

  // Enhanced stats calculation
  const statsData = useMemo(() => ({
    upcoming: events.filter(e => e.status === 'upcoming').length,
    free: events.filter(e => e.price.min === 0).length,
    myEvents: attendingEvents.length + interestedEvents.length + bookmarkedEvents.length
  }), [events, attendingEvents, interestedEvents, bookmarkedEvents]);

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
              <div className="w-10"></div>
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
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-purple-600">{statsData.upcoming}</div>
                <div className="text-xs text-gray-600">Kommende Events</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{statsData.free}</div>
                <div className="text-xs text-gray-600">Kostenlos</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{statsData.myEvents}</div>
                <div className="text-xs text-gray-600">Meine Events</div>
              </div>
            </div>
          </div>

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

          {/* Bottom Navigation - unchanged */}
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

          {/* Action Menu Modal */}
          {showActionMenuForEvent && (
            <ActionMenu eventId={showActionMenuForEvent} />
          )}
        </div>
      </div>
    </>
  );
};

export default EventsPage;