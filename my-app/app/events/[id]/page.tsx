'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowLeft, Navigation, MapPin, Star, 
  Clock, Calendar, Heart, Share2, X,
  ExternalLink, Users, Euro, Home,
  Gift, Coffee, ShoppingBag, Car
} from 'lucide-react';

// Event interface (same as in main events page)
interface Event {
  id: string;
  title: string;
  category: 'concert' | 'theater' | 'festival' | 'sports' | 'culture' | 'food' | 'family' | 'nightlife' | 'exhibition' | 'workshop';
  description: string;
  venue: string;
  address: string;
  coordinates: { lat: number; lng: number; };
  startDate: Date;
  endDate: Date;
  startTime: string;
  endTime?: string;
  price: { min: number; max?: number; currency: string; };
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

// Mock data (same as in main page)
const EVENTS_DATA: Event[] = [
  {
    id: 'jazz-schloss',
    title: 'Jazz im Schloss: Acoustic Sessions',
    category: 'concert',
    description: 'Exklusive Jazz-Session im historischen Schloss Richmond mit regionalen und internationalen Künstlern in einer einzigartigen historischen Atmosphäre.',
    venue: 'Schloss Richmond',
    address: 'Museumstraße 1, 38100 Braunschweig',
    coordinates: { lat: 52.2580, lng: 10.5180 },
    startDate: new Date(Date.now() + 86400000 * 3),
    endDate: new Date(Date.now() + 86400000 * 3),
    startTime: '19:00',
    endTime: '22:30',
    price: { min: 32, max: 58, currency: 'EUR' },
    ticketUrl: 'https://tickets.braunschweig.de',
    image: 'https://images.unsplash.com/photo-1415886541506-6f6fdc28ddb1?w=400&h=300&fit=crop',
    organizer: 'Kultur Braunschweig',
    attendees: 156,
    capacity: 200,
    tags: ['Jazz', 'Klassik', 'Exklusiv', 'Historisch'],
    rating: 4.7,
    reviewCount: 43,
    isFavorite: false,
    isBookmarked: false,
    isAttending: false,
    status: 'upcoming',
    featured: true,
    distance: 680
  },
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
  }
];

const EventDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAttending, setIsAttending] = useState(false);

  useEffect(() => {
    if (!params?.id) return;
    
    const eventId = params.id as string;
    const foundEvent = EVENTS_DATA.find(e => e.id === eventId);
    
    if (foundEvent) {
      setEvent(foundEvent);
      setIsFavorite(foundEvent.isFavorite);
      setIsAttending(foundEvent.isAttending);
    }
    setIsLoading(false);
  }, [params?.id]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('de-DE', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long',
      year: 'numeric'
    });
  };

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

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const toggleAttending = () => {
    setIsAttending(!isAttending);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-md mx-auto bg-white shadow-2xl min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Event wird geladen...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-md mx-auto bg-white shadow-2xl min-h-screen">
          {/* Header */}
          <div className="bg-purple-600 text-white p-4">
            <div className="flex items-center justify-between">
              <Link href="/events" className="p-2 hover:bg-purple-700 rounded-lg transition-colors">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <h1 className="text-xl font-bold">Event Details</h1>
              <div className="w-10"></div>
            </div>
          </div>

          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Event nicht gefunden</h1>
              <p className="text-gray-600 mb-4">Das angeforderte Event existiert nicht.</p>
              <Link href="/events" className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 transition-colors">
                Zurück zu Events
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{event.title} - BS.Smart Braunschweig</title>
        <meta name="description" content={event.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-md mx-auto bg-white shadow-2xl min-h-screen">
          {/* Header */}
          <div className="bg-purple-600 text-white p-4">
            <div className="flex items-center justify-between">
              <Link href="/events" className="p-2 hover:bg-purple-700 rounded-lg transition-colors">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <h1 className="text-xl font-bold">Event Details</h1>
              <button
                onClick={toggleFavorite}
                className="p-2 hover:bg-purple-700 rounded-lg transition-colors"
              >
                <Heart className={`w-6 h-6 ${isFavorite ? 'text-red-400 fill-current' : 'text-white'}`} />
              </button>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative h-64 overflow-hidden">
            <Image
              src={event.image}
              alt={event.title}
              fill
              className="object-cover"
            />
            <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded-lg text-sm">
              {getCategoryIcon(event.category)} {event.category}
            </div>
            {event.status === 'ongoing' && (
              <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                🔴 Live
              </div>
            )}
            {event.featured && (
              <div className="absolute bottom-3 right-3 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                ⭐ Featured
              </div>
            )}
            {isAttending && (
              <div className="absolute bottom-3 left-3 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                ✓ Dabei
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="bg-white px-4 py-3 border-b border-gray-200">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {event.price.min === 0 ? 'Kostenlos' : `€${event.price.min}`}
                </div>
                <div className="text-xs text-gray-600">
                  {event.price.min === 0 ? 'Eintritt' : 'ab Preis'}
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{event.attendees}</div>
                <div className="text-xs text-gray-600">Teilnehmer</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {event.rating ? event.rating.toFixed(1) : '4.5'}
                </div>
                <div className="text-xs text-gray-600">Bewertung</div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 pb-24">
            <div className="mb-4">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">{event.title}</h1>
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <MapPin className="w-4 h-4" />
                <span>{event.venue}</span>
                {event.rating && (
                  <>
                    <span>•</span>
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span>{event.rating}</span>
                  </>
                )}
              </div>
              <p className="text-sm text-gray-600">{event.address}</p>
            </div>

            <p className="text-gray-600 mb-6 leading-relaxed">{event.description}</p>

            {/* Event Details Card */}
            <div className="bg-white rounded-xl shadow-md p-4 mb-6 border border-gray-200">
              <h3 className="font-bold text-gray-800 mb-4">Event Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Datum:</span>
                  <span className="font-medium">{formatDate(event.startDate)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Uhrzeit:</span>
                  <span className="font-medium">{event.startTime} - {event.endTime}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Veranstalter:</span>
                  <span className="font-medium">{event.organizer}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Kapazität:</span>
                  <span className="font-medium">{event.capacity ? `${event.attendees}/${event.capacity}` : event.attendees}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Entfernung:</span>
                  <span className="font-medium">{event.distance}m</span>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="mb-6">
              <h3 className="font-bold text-gray-800 mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {event.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Pricing Card */}
            <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl p-4 mb-6 text-white">
              <h3 className="font-bold mb-2">Preise</h3>
              <div className="flex justify-between items-center">
                <div>
                  {event.price.min === 0 ? (
                    <span className="text-2xl font-bold">Kostenlos</span>
                  ) : (
                    <div>
                      <span className="text-2xl font-bold">€{event.price.min}</span>
                      {event.price.max && (
                        <span className="text-lg opacity-75"> - €{event.price.max}</span>
                      )}
                    </div>
                  )}
                </div>
                {event.ticketUrl && (
                  <button 
                    onClick={() => window.open(event.ticketUrl, '_blank')}
                    className="bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Tickets
                  </button>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={toggleAttending}
                className={`w-full py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 ${
                  isAttending 
                    ? 'bg-green-500 text-white hover:bg-green-600' 
                    : 'bg-purple-500 text-white hover:bg-purple-600'
                }`}
              >
                <Calendar className="w-5 h-5" />
                {isAttending ? 'Teilnahme bestätigt' : 'Teilnehmen'}
              </button>
              
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => alert(`Navigation zu ${event.venue} gestartet!`)}
                  className="bg-blue-500 text-white py-3 rounded-xl font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                >
                  <Navigation className="w-5 h-5" />
                  Route
                </button>
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: event.title,
                        text: event.description,
                        url: window.location.href,
                      });
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                      alert('Link kopiert!');
                    }
                  }}
                  className="bg-gray-500 text-white py-3 rounded-xl font-semibold hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
                >
                  <Share2 className="w-5 h-5" />
                  Teilen
                </button>
              </div>
            </div>
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
              
              <Link href="/events" className="flex flex-col items-center gap-1 text-purple-500">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs font-medium">Events</span>
              </Link>
              
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
        </div>
      </div>
    </>
  );
};

export default EventDetailPage;