export interface Event {
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

export const EVENTS_DATA: Event[] = [
  {
    id: 'jazz-schloss',
    title: 'Jazz im Schloss: Acoustic Sessions',
    category: 'concert',
    description: 'Exklusive Jazz-Session im historischen Schloss Richmond mit regionalen und internationalen Künstlern.',
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
  // ... alle anderen Events aus deiner main page hier einfügen
];

export const getEventById = (id: string): Event | undefined => {
  return EVENTS_DATA.find(event => event.id === id);
};