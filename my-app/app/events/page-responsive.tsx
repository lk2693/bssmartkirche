'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowLeft, Navigation, MapPin, Search, Star, 
  Clock, Calendar, Bookmark, Heart, X,
  Home, Gift, Coffee, Euro, PartyPopper,
  RefreshCw, ExternalLink, AlertCircle,
  Filter, Grid3X3, List
} from 'lucide-react';
import { getCurrentEvents } from '../../lib/events-data';

const EventsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Alle');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const eventData = await getCurrentEvents();
        setEvents(eventData);
      } catch (error) {
        console.error('Error loading events:', error);
      } finally {
        setLoading(false);
      }
    };
    loadEvents();
  }, []);

  const categories = useMemo(() => {
    const cats = ['Alle', ...new Set(events.map(event => event.category))];
    return cats;
  }, [events]);

  const filteredEvents = useMemo(() => {
    let filtered = events;

    if (selectedCategory !== 'Alle') {
      filtered = filtered.filter(event => event.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(query) ||
        event.venue.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query)
      );
    }

    return filtered.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  }, [events, selectedCategory, searchQuery]);

  const getCategoryIcon = (category: string): string => {
    const iconMap: { [key: string]: string } = {
      'concert': '🎵', 'theater': '🎭', 'festival': '🎪', 'sports': '⚽',
      'culture': '🎨', 'food': '🍽️', 'family': '👨‍👩‍👧‍👦', 'nightlife': '🌙',
      'exhibition': '🖼️', 'workshop': '🛠️', 'party': '🎉', 'business': '💼',
      'literature': '📚', 'dance': '💃', 'dinner': '🍷'
    };
    return iconMap[category] || '📅';
  };

  const formatPrice = (price: any) => {
    if (!price || price.min === 0) return 'Kostenlos';
    if (price.max && price.max !== price.min) {
      return `${price.min}€ - ${price.max}€`;
    }
    return `${price.min}€`;
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('de-DE', {
      weekday: 'short',
      day: '2-digit',
      month: 'short'
    });
  };

  return (
    <>
      <Head>
        <title>Events - Braunschweig Smart City</title>
        <meta name="description" content="Entdecke aktuelle Events und Veranstaltungen in Braunschweig" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Responsive container */}
        <div className="max-w-md mx-auto md:max-w-4xl lg:max-w-7xl bg-white shadow-2xl md:shadow-lg lg:shadow-none min-h-screen">
          
          {/* Enhanced Header */}
          <div className="bg-gradient-to-r from-purple-900 to-purple-800 text-white">
            <div className="p-4 md:p-6 lg:p-8">
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <div className="flex items-center gap-3 md:gap-4">
                  <Link href="/" className="p-2 hover:bg-purple-800 rounded-lg transition-colors">
                    <ArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
                  </Link>
                  <div>
                    <h1 className="text-xl md:text-2xl lg:text-3xl font-bold">Events</h1>
                    <p className="text-purple-200 text-sm md:text-base">
                      {filteredEvents.length} Veranstaltungen in Braunschweig
                    </p>
                  </div>
                </div>
                <Calendar className="w-6 h-6 md:w-8 md:h-8" />
              </div>

              {/* Enhanced Search */}
              <div className="relative mb-4 md:mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
                <input
                  type="text"
                  placeholder="Events suchen..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 md:pl-12 pr-4 py-3 md:py-4 rounded-xl text-gray-800 placeholder-gray-500 text-sm md:text-base"
                />
              </div>

              {/* Enhanced Filters */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex gap-2 overflow-x-auto">
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-3 md:px-4 py-2 rounded-full text-sm md:text-base whitespace-nowrap transition-colors ${
                        selectedCategory === category
                          ? 'bg-purple-700 text-white'
                          : 'bg-purple-800 hover:bg-purple-700 text-purple-200'
                      }`}
                    >
                      {category === 'Alle' ? 'Alle' : `${getCategoryIcon(category)} ${category}`}
                    </button>
                  ))}
                </div>

                {/* View Mode Toggles */}
                <div className="flex gap-2 justify-center md:justify-end">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 md:p-3 rounded-lg transition-colors ${
                      viewMode === 'grid' ? 'bg-purple-700' : 'bg-purple-800 hover:bg-purple-700'
                    }`}
                  >
                    <Grid3X3 className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 md:p-3 rounded-lg transition-colors ${
                      viewMode === 'list' ? 'bg-purple-700' : 'bg-purple-800 hover:bg-purple-700'
                    }`}
                  >
                    <List className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Content */}
          <div className="p-4 md:p-6 lg:p-8 pb-24 md:pb-16 lg:pb-8">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 md:h-12 md:w-12 border-b-2 border-purple-600"></div>
              </div>
            ) : filteredEvents.length === 0 ? (
              <div className="text-center py-12 md:py-16">
                <Calendar className="w-12 h-12 md:w-16 md:h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg md:text-xl font-semibold text-gray-600 mb-2">Keine Events gefunden</h3>
                <p className="text-gray-500">Versuche einen anderen Suchbegriff oder Filter.</p>
              </div>
            ) : (
              <div>
                {viewMode === 'grid' ? (
                  /* Enhanced Grid View */
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                    {filteredEvents.map((event) => (
                      <Link
                        key={event.id}
                        href={`/events/${event.id}`}
                        className="group"
                      >
                        <div className="bg-white rounded-xl md:rounded-2xl overflow-hidden shadow-lg border border-gray-200 
                                      hover:shadow-xl hover:border-purple-300 transition-all duration-200 group-hover:scale-105">
                          <div className="relative h-32 md:h-40">
                            <Image
                              src={event.image}
                              alt={event.title}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute top-2 md:top-3 left-2 md:left-3">
                              <span className="bg-black/70 text-white text-xs md:text-sm px-2 py-1 rounded-full">
                                {getCategoryIcon(event.category)} {event.category}
                              </span>
                            </div>
                            <div className="absolute top-2 md:top-3 right-2 md:right-3">
                              <Heart className="w-5 h-5 md:w-6 md:h-6 text-white/80 hover:text-red-500 cursor-pointer" />
                            </div>
                          </div>
                          <div className="p-3 md:p-4">
                            <h3 className="font-bold text-sm md:text-base text-gray-800 mb-2 line-clamp-2">
                              {event.title}
                            </h3>
                            <div className="space-y-1 md:space-y-2 text-xs md:text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3 md:w-4 md:h-4" />
                                <span>{formatDate(event.startDate)} • {event.startTime}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="w-3 h-3 md:w-4 md:h-4" />
                                <span className="truncate">{event.venue}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="font-semibold text-purple-600">
                                  {formatPrice(event.price)}
                                </span>
                                {event.rating && (
                                  <div className="flex items-center gap-1">
                                    <Star className="w-3 h-3 md:w-4 md:h-4 text-yellow-500 fill-current" />
                                    <span>{event.rating}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  /* Enhanced List View */
                  <div className="space-y-3 md:space-y-4">
                    {filteredEvents.map((event) => (
                      <Link
                        key={event.id}
                        href={`/events/${event.id}`}
                        className="block"
                      >
                        <div className="bg-white rounded-xl p-4 md:p-6 shadow-lg border border-gray-200 
                                      hover:shadow-xl hover:border-purple-300 transition-all">
                          <div className="flex gap-4 md:gap-6">
                            <div className="relative w-16 h-16 md:w-24 md:h-24 flex-shrink-0">
                              <Image
                                src={event.image}
                                alt={event.title}
                                fill
                                className="object-cover rounded-lg"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between mb-2">
                                <h3 className="font-bold text-sm md:text-lg text-gray-800 line-clamp-2">
                                  {event.title}
                                </h3>
                                <Heart className="w-5 h-5 md:w-6 md:h-6 text-gray-400 hover:text-red-500 cursor-pointer flex-shrink-0 ml-2" />
                              </div>
                              <div className="space-y-1 md:space-y-2 text-xs md:text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
                                    {getCategoryIcon(event.category)} {event.category}
                                  </span>
                                  <span className="font-semibold text-purple-600">
                                    {formatPrice(event.price)}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3 md:w-4 md:h-4" />
                                  <span>{formatDate(event.startDate)} • {event.startTime}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3 md:w-4 md:h-4" />
                                  <span className="truncate">{event.venue}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Enhanced Bottom Navigation */}
          <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md md:max-w-4xl lg:max-w-7xl 
                          bg-white border-t border-gray-200 px-4 py-2 md:py-3">
            <div className="flex justify-around items-center">
              <Link href="/" className="flex flex-col items-center gap-1 p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Home className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
                <span className="text-xs md:text-sm text-gray-600">Home</span>
              </Link>
              <Link href="/navigation" className="flex flex-col items-center gap-1 p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Navigation className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
                <span className="text-xs md:text-sm text-gray-600">Navigation</span>
              </Link>
              <Link href="/shopping" className="flex flex-col items-center gap-1 p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Gift className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
                <span className="text-xs md:text-sm text-gray-600">Shopping</span>
              </Link>
              <Link href="/events" className="flex flex-col items-center gap-1 p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Calendar className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />
                <span className="text-xs md:text-sm text-purple-600 font-medium">Events</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EventsPage;