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
import { getCurrentEvents } from '../../lib/events-data';

// Types
interface Event {
  id: string;
  title: string;
  category: 'concert' | 'theater' | 'festival' | 'sports' | 'culture' | 'food' | 'family' | 'nightlife' | 'exhibition' | 'workshop' | 'party' | 'business' | 'literature' | 'dance' | 'dinner' | 'other';
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
  } | null;
  ticketUrl?: string;
  image: string;
  organizer: string;
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
  dataSource: 'static' | 'api';
}

// Helper Functions
const calculateDistance = (point1: { lat: number; lng: number }, point2: { lat: number; lng: number }) => {
  const R = 6371; // Radius of the Earth in km
  const dLat = (point2.lat - point1.lat) * Math.PI / 180;
  const dLon = (point2.lng - point1.lng) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(point1.lat * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Main Component
const EventsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedFilter, setSelectedFilter] = useState('Alle');
  const [favoriteEvents, setFavoriteEvents] = useState<string[]>([]);
  const [bookmarkedEvents, setBookmarkedEvents] = useState<string[]>([]);
  const [attendingEvents, setAttendingEvents] = useState<string[]>([]);
  const [interestedEvents, setInterestedEvents] = useState<string[]>([]);

  // Static events (your existing events)
  const staticEvents = useMemo<Event[]>(() => {
    // Konvertiere importierte Events zu lokalem Event-Format - nur aktuelle Events
    return getCurrentEvents().map(event => ({
      ...event,
      dataSource: 'static' as const
    }));
  }, []);

  // Use only static events (no live events)
  const allEvents = useMemo(() => {
    return staticEvents;
  }, [staticEvents]);

  // Filter options
  const filterOptions = ['Alle', 'Heute', 'Kostenlos', 'Konzerte', 'Theater', 'Festivals', 'Kultur', 'Sport', 'Party', 'Business', 'Literatur', 'Tanz', 'Dinner'];

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
      } else if (selectedFilter === 'Kostenlos') {
        filtered = filtered.filter(event => event.price === null || event.price.min === 0);
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
      } else if (selectedFilter === 'Party') {
        filtered = filtered.filter(event => event.category === 'party');
      } else if (selectedFilter === 'Business') {
        filtered = filtered.filter(event => event.category === 'business');
      } else if (selectedFilter === 'Literatur') {
        filtered = filtered.filter(event => event.category === 'literature');
      } else if (selectedFilter === 'Tanz') {
        filtered = filtered.filter(event => event.category === 'dance');
      } else if (selectedFilter === 'Dinner') {
        filtered = filtered.filter(event => event.category === 'dinner');
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
      case 'party': return '🎉';
      case 'business': return '💼';
      case 'literature': return '📚';
      case 'dance': return '💃';
      case 'dinner': return '🍽️';
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
            <MapPin className="w-4 h-4" />
            <span className="truncate">{event.venue}</span>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              {event.price === null || event.price.min === 0 ? (
                <span className="text-green-600 font-medium">Kostenlos</span>
              ) : (
                <span className="text-blue-600 font-medium">
                  ab {event.price.min}€
                </span>
              )}
            </div>

            <div className="flex gap-2">
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
                    <span>Preis:</span>
                    <span>
                      {selectedEvent.price === null || selectedEvent.price.min === 0 ? 'Kostenlos' : `ab ${selectedEvent.price.min}€`}
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

  // Enhanced stats calculation
  const statsData = useMemo(() => ({
    total: allEvents.length,
    today: allEvents.filter(e => e.startDate.toDateString() === new Date().toDateString()).length,
    free: allEvents.filter(e => e.price === null || e.price.min === 0).length
  }), [allEvents]);

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
              <div className="w-10 h-10"></div> {/* Spacer for layout balance */}
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
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <div className="text-xl font-bold text-purple-600">{statsData.total}</div>
                <div className="text-xs text-gray-600">Gesamt</div>
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