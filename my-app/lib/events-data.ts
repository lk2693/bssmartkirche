export interface Event {
  id: string;
  title: string;
  category: 'concert' | 'theater' | 'festival' | 'sports' | 'culture' | 'food' | 'family' | 'nightlife' | 'exhibition' | 'workshop' | 'party' | 'business' | 'literature' | 'dance' | 'dinner';
  description: string;
  venue: string;
  address: string;
  coordinates: { lat: number; lng: number; };
  startDate: Date;
  endDate: Date;
  startTime: string;
  endTime?: string;
  price: { min: number; max?: number; currency: string; } | null;
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
  source?: string;
  url?: string;
}

export const EVENTS_DATA: Event[] = [
  // Aktuelle Events für Oktober 2025:
  {
    id: 'jazz-schloss-oktober',
    title: 'Jazz im Schloss: Herbstkonzert',
    category: 'concert',
    description: 'Exklusive Jazz-Session im historischen Schloss Richmond mit regionalen und internationalen Künstlern. Herbstliches Programm.',
    venue: 'Schloss Richmond',
    address: 'Museumstraße 1, 38100 Braunschweig',
    coordinates: { lat: 52.2580, lng: 10.5180 },
    startDate: new Date('2025-10-15T19:00:00+02:00'),
    endDate: new Date('2025-10-15T22:30:00+02:00'),
    startTime: '19:00',
    endTime: '22:30',
    price: { min: 32, max: 58, currency: 'EUR' },
    ticketUrl: 'https://tickets.braunschweig.de',
    image: 'https://images.unsplash.com/photo-1415886541506-6f6fdc28ddb1?w=400&h=300&fit=crop',
    organizer: 'Kultur Braunschweig',
    attendees: 156,
    capacity: 200,
    tags: ['Jazz', 'Klassik', 'Exklusiv', 'Historisch', 'Herbst'],
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
    id: 'oktoberfest-bs-2025',
    title: 'Braunschweiger Oktoberfest 2025',
    category: 'festival',
    description: 'Das größte Oktoberfest Niedersachsens mit bayerischer Musik, traditionellem Essen und Gemeinschaftsgefühl.',
    venue: 'Bürgerpark Braunschweig',
    address: 'Bürgerpark, 38106 Braunschweig',
    coordinates: { lat: 52.2825, lng: 10.5211 },
    startDate: new Date('2025-10-03T16:00:00+02:00'),
    endDate: new Date('2025-10-06T23:00:00+02:00'),
    startTime: '16:00',
    endTime: '23:00',
    price: { min: 0, currency: 'EUR' },
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&h=300&fit=crop',
    organizer: 'Stadt Braunschweig',
    attendees: 12500,
    capacity: 15000,
    tags: ['Oktoberfest', 'Familie', 'Kostenlos', 'Musik', 'Essen'],
    rating: 4.5,
    reviewCount: 892,
    isFavorite: false,
    isBookmarked: false,
    isAttending: false,
    status: 'upcoming',
    featured: true,
    distance: 1200
  },
  // Hinzugefügte Events:
  {
    id: 'westand:2025-10-02-2100-depeche-mode-80s-new-wave',
    title: 'Depeche Mode + 80s New Wave Party',
    category: 'party',
    description: '80er / New Wave Party im westand mit den besten Hits der 80er Jahre und New Wave Klassikern.',
    venue: 'westand',
    address: 'Westand, 38100 Braunschweig',
    coordinates: { lat: 52.2688, lng: 10.5267 },
    startDate: new Date('2025-10-02T21:00:00+02:00'),
    endDate: new Date('2025-10-02T23:30:00+02:00'),
    startTime: '21:00',
    endTime: '23:30',
    price: null,
    ticketUrl: 'https://westand.net/',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=300&fit=crop',
    organizer: 'westand',
    attendees: 0,
    capacity: 200,
    tags: ['80s', 'New Wave', 'Party', 'Musik'],
    isFavorite: false,
    isBookmarked: false,
    isAttending: false,
    status: 'upcoming',
    featured: true,
    source: 'westand.net',
    url: 'https://westand.net/'
  },
  {
    id: 'westand:2025-10-05-1800-ballet-dornroschen-teil1',
    title: 'We call it Ballet: Dornröschen (Tanz & Lichtshow)',
    category: 'dance',
    description: 'Moderne Tanzshow mit Lichteffekten - eine künstlerische Interpretation des klassischen Märchens Dornröschen.',
    venue: 'westand',
    address: 'Westand, 38100 Braunschweig',
    coordinates: { lat: 52.2688, lng: 10.5267 },
    startDate: new Date('2025-10-05T18:00:00+02:00'),
    endDate: new Date('2025-10-05T20:00:00+02:00'),
    startTime: '18:00',
    endTime: '20:00',
    price: null,
    ticketUrl: 'https://westand.net/',
    image: 'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=400&h=300&fit=crop',
    organizer: 'westand',
    attendees: 0,
    capacity: 150,
    tags: ['Ballett', 'Tanz', 'Lichtshow', 'Kultur', 'Märchen'],
    isFavorite: false,
    isBookmarked: false,
    isAttending: false,
    status: 'upcoming',
    featured: true,
    source: 'westand.net',
    url: 'https://westand.net/'
  },
  {
    id: 'westand:2025-10-05-2030-ballet-dornroschen-teil2',
    title: 'We call it Ballet: Dornröschen (Tanz & Lichtshow) - 2. Vorstellung',
    category: 'dance',
    description: 'Zweite Vorstellung der modernen Tanz- & Lichtshow - eine künstlerische Interpretation des klassischen Märchens.',
    venue: 'westand',
    address: 'Westand, 38100 Braunschweig',
    coordinates: { lat: 52.2688, lng: 10.5267 },
    startDate: new Date('2025-10-05T20:30:00+02:00'),
    endDate: new Date('2025-10-05T22:30:00+02:00'),
    startTime: '20:30',
    endTime: '22:30',
    price: null,
    ticketUrl: 'https://westand.net/',
    image: 'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=400&h=300&fit=crop',
    organizer: 'westand',
    attendees: 0,
    capacity: 150,
    tags: ['Ballett', 'Tanz', 'Lichtshow', 'Kultur', 'Märchen'],
    isFavorite: false,
    isBookmarked: false,
    isAttending: false,
    status: 'upcoming',
    featured: false,
    source: 'westand.net',
    url: 'https://westand.net/'
  },
  {
    id: 'ueberland:2025-10-25-1800-danceria-2-0',
    title: 'Danceria 2.0 – Dinner & Dance über den Dächern von Braunschweig',
    category: 'dinner',
    description: 'Exklusives Dinner & Dance-Event über den Dächern der Stadt mit Gourmet-Buffet & Live-DJ. Einlass ab 18:00 Uhr.',
    venue: 'ÜBERLAND',
    address: 'ÜBERLAND, 38100 Braunschweig',
    coordinates: { lat: 52.2627, lng: 10.5267 },
    startDate: new Date('2025-10-25T18:00:00+02:00'),
    endDate: new Date('2025-10-25T23:59:00+02:00'),
    startTime: '18:00',
    price: { min: 25, max: 75, currency: 'EUR' },
    ticketUrl: 'https://www.ueberland-bs.de/events/',
    image: 'https://images.unsplash.com/photo-1414016642750-7fdd78dc33d9?w=400&h=300&fit=crop',
    organizer: 'ÜBERLAND',
    attendees: 0,
    capacity: 120,
    tags: ['Dinner', 'Dance', 'Rooftop', 'Exklusiv', 'Gourmet'],
    isFavorite: false,
    isBookmarked: false,
    isAttending: false,
    status: 'upcoming',
    featured: true,
    source: 'ueberland-bs.de',
    url: 'https://www.ueberland-bs.de/events/'
  },
  {
    id: 'marketingclub:2025-10-21-zukunftsplattform',
    title: 'Marketingclub BS-WOB – Zukunftsplattform',
    category: 'business',
    description: 'Exklusive Networking-Veranstaltung für Entscheider:innen, Denker:innen & Macher:innen aus der Marketingbranche.',
    venue: 'Braunschweig (Ort wird bekannt gegeben)',
    address: 'Braunschweig, 38100 Braunschweig',
    coordinates: { lat: 52.2688, lng: 10.5267 },
    startDate: new Date('2025-10-21T18:00:00+02:00'),
    endDate: new Date('2025-10-21T22:00:00+02:00'),
    startTime: '18:00',
    price: null,
    ticketUrl: 'https://www.marketingclub-bs-wob.de/veranstaltungen/',
    image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=300&fit=crop',
    organizer: 'Marketingclub BS-WOB',
    attendees: 0,
    capacity: 80,
    tags: ['Business', 'Marketing', 'Networking', 'Zukunft'],
    isFavorite: false,
    isBookmarked: false,
    isAttending: false,
    status: 'upcoming',
    featured: false,
    source: 'marketingclub-bs-wob.de',
    url: 'https://www.marketingclub-bs-wob.de/veranstaltungen/'
  },
  {
    id: 'eventbrite:2025-10-14-female-business-meetup',
    title: 'Female Business Meetup Braunschweig',
    category: 'business',
    description: 'Inspirierendes Netzwerkmeeting für Frauen in Unternehmen & Gründung. Austausch, Tipps und neue Kontakte.',
    venue: 'Harzer Burger König',
    address: 'Harzer Burger König, 38100 Braunschweig',
    coordinates: { lat: 52.2627, lng: 10.5180 },
    startDate: new Date('2025-10-14T19:00:00+02:00'),
    endDate: new Date('2025-10-14T22:00:00+02:00'),
    startTime: '19:00',
    price: { min: 15, currency: 'EUR' },
    ticketUrl: 'https://www.eventbrite.de/e/female-business-meetup-braunschweig-tickets-1671941294419',
    image: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=400&h=300&fit=crop',
    organizer: 'Female Business Network',
    attendees: 0,
    capacity: 40,
    tags: ['Female', 'Business', 'Networking', 'Gründung'],
    isFavorite: false,
    isBookmarked: false,
    isAttending: false,
    status: 'upcoming',
    featured: false,
    source: 'eventbrite.de',
    url: 'https://www.eventbrite.de/e/female-business-meetup-braunschweig-tickets-1671941294419'
  },
  {
    id: 'bz:2025-10-19-krimifestival-lesung',
    title: 'Krimifestival Braunschweig – Lesungen & Spurensuche',
    category: 'literature',
    description: 'Spannende Kriminalgeschichten und interaktive Stadtführungen auf den Spuren von Verbrechen in Braunschweig.',
    venue: 'verschiedene Orte',
    address: 'Innenstadt Braunschweig, 38100 Braunschweig',
    coordinates: { lat: 52.2688, lng: 10.5267 },
    startDate: new Date('2025-10-19T18:00:00+02:00'),
    endDate: new Date('2025-10-26T22:00:00+02:00'),
    startTime: '18:00',
    price: null,
    ticketUrl: 'https://www.braunschweiger-zeitung.de/niedersachsen/braunschweig/article410087392/von-schaurig-bis-gemuetlich-braunschweigs-oktober-highlights.html',
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop',
    organizer: 'Krimifestival Braunschweig',
    attendees: 0,
    capacity: 200,
    tags: ['Krimi', 'Literatur', 'Festival', 'Stadtführung', 'Spurensuche'],
    isFavorite: false,
    isBookmarked: false,
    isAttending: false,
    status: 'upcoming',
    featured: true,
    source: 'braunschweiger-zeitung.de',
    url: 'https://www.braunschweiger-zeitung.de/niedersachsen/braunschweig/article410087392/von-schaurig-bis-gemuetlich-braunschweigs-oktober-highlights.html'
  },
  {
    id: 'bz:2025-10-krimifestival-museum-aktion',
    title: 'Krimifestival – Museumsaktionen & Tatortspurensuche',
    category: 'exhibition',
    description: 'Interaktive Museumsaktionen und Spurensuche im Rahmen des Krimifestivals. Besuchen Sie Tatorte der Geschichte.',
    venue: 'Schlossmuseum & Museumseinrichtungen',
    address: 'Schlossmuseum, Burgplatz 1, 38100 Braunschweig',
    coordinates: { lat: 52.2627, lng: 10.5235 },
    startDate: new Date('2025-10-20T10:00:00+02:00'),
    endDate: new Date('2025-10-26T18:00:00+02:00'),
    startTime: '10:00',
    endTime: '18:00',
    price: null,
    ticketUrl: 'https://www.braunschweiger-zeitung.de/niedersachsen/braunschweig/article410087392/von-schaurig-bis-gemuetlich-braunschweigs-oktober-highlights.html',
    image: 'https://images.unsplash.com/photo-1594736797933-d0d4349f5d86?w=400&h=300&fit=crop',
    organizer: 'Schlossmuseum & Krimifestival',
    attendees: 0,
    capacity: 150,
    tags: ['Museum', 'Krimi', 'Spurensuche', 'Geschichte', 'Interaktiv'],
    isFavorite: false,
    isBookmarked: false,
    isAttending: false,
    status: 'upcoming',
    featured: false,
    source: 'braunschweiger-zeitung.de',
    url: 'https://www.braunschweiger-zeitung.de/niedersachsen/braunschweig/article410087392/von-schaurig-bis-gemuetlich-braunschweigs-oktober-highlights.html'
  },
  // Neue Events von braunschweig.de
  {
    id: "staedtisches-museum:2025-10-01-1230-mittagspause",
    title: "Mittagspause im Museum: Die mit der Zange – Sine Hansen",
    category: 'exhibition',
    description: "Kurzformat in der Mittagspause, inkl. Kaffee & Kuchen (im Eintrittspreis enthalten).",
    venue: "Städtisches Museum Braunschweig",
    address: "Städtisches Museum Braunschweig, 38100 Braunschweig",
    coordinates: { lat: 52.2688, lng: 10.5267 },
    startDate: new Date("2025-10-01T12:30:00+02:00"),
    endDate: new Date("2025-10-01T13:30:00+02:00"),
    startTime: "12:30",
    endTime: "13:30",
    price: null,
    ticketUrl: "https://www.braunschweig.de/kultur/museen/staedtisches-museum/veranstaltungen.php",
    image: 'https://images.unsplash.com/photo-1554774853-719586f82d77?w=400&h=300&fit=crop',
    organizer: "Städtisches Museum Braunschweig",
    attendees: 0,
    capacity: 50,
    tags: ['Museum', 'Vortrag', 'Mittagspause', 'Kultur'],
    isFavorite: false,
    isBookmarked: false,
    isAttending: false,
    status: 'upcoming',
    featured: false,
    source: "braunschweig.de",
    url: "https://www.braunschweig.de/kultur/museen/staedtisches-museum/veranstaltungen.php"
  },
  {
    id: "tourismus:2025-10-06-1700-oeffentliche-stadtfuehrung",
    title: "Öffentliche Stadtführung (Einzeltickets)",
    category: 'culture',
    description: "Geführter Rundgang – Ticketbuchung über die Stadtseite.",
    venue: "Innenstadt (Treffpunkt laut Buchung)",
    address: "Innenstadt Braunschweig, 38100 Braunschweig",
    coordinates: { lat: 52.2688, lng: 10.5267 },
    startDate: new Date("2025-10-06T17:00:00+02:00"),
    endDate: new Date("2025-10-06T19:00:00+02:00"),
    startTime: "17:00",
    endTime: "19:00",
    price: { min: 15, currency: 'EUR' },
    ticketUrl: "https://www.braunschweig.de/tourismus/ihr-besuch-in-braunschweig/Oe/fuehrungen_einzel.php",
    image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73c6e?w=400&h=300&fit=crop',
    organizer: "Braunschweig Stadtmarketing",
    attendees: 0,
    capacity: 25,
    tags: ['Stadtführung', 'Tourismus', 'Innenstadt'],
    isFavorite: false,
    isBookmarked: false,
    isAttending: false,
    status: 'upcoming',
    featured: false,
    source: "braunschweig.de",
    url: "https://www.braunschweig.de/tourismus/ihr-besuch-in-braunschweig/Oe/fuehrungen_einzel.php"
  },
  {
    id: "tourismus:2025-10-12-1400-themenfuehrung",
    title: "Themenführung (Öffentliche Führung)",
    category: 'culture',
    description: "Spezielle Stadtführung zu einem wechselnden Thema.",
    venue: "Innenstadt (Treffpunkt laut Buchung)",
    address: "Innenstadt Braunschweig, 38100 Braunschweig",
    coordinates: { lat: 52.2688, lng: 10.5267 },
    startDate: new Date("2025-10-12T14:00:00+02:00"),
    endDate: new Date("2025-10-12T16:00:00+02:00"),
    startTime: "14:00",
    endTime: "16:00",
    price: { min: 15, currency: 'EUR' },
    ticketUrl: "https://www.braunschweig.de/tourismus/ihr-besuch-in-braunschweig/Oe/E_themenfuehrungen_start.php",
    image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73c6e?w=400&h=300&fit=crop',
    organizer: "Braunschweig Stadtmarketing",
    attendees: 0,
    capacity: 25,
    tags: ['Stadtführung', 'Themenführung', 'Tourismus'],
    isFavorite: false,
    isBookmarked: false,
    isAttending: false,
    status: 'upcoming',
    featured: false,
    source: "braunschweig.de",
    url: "https://www.braunschweig.de/tourismus/ihr-besuch-in-braunschweig/Oe/E_themenfuehrungen_start.php"
  },
  {
    id: "roter-saal:2025-10-16-1900-klavierabend-klassik",
    title: "Klavierabend Nr. 3: \"Klassik\" (Roter Saal)",
    category: 'concert',
    description: "Werke u. a. von Beethoven (\"Mondscheinsonate\"), Mozart (\"Alla Turca\") und Schubert (D 894 \"Fantasie\").",
    venue: "Roter Saal im Schloss, Schlossplatz 1",
    address: "Schlossplatz 1, 38100 Braunschweig",
    coordinates: { lat: 52.2627, lng: 10.5235 },
    startDate: new Date("2025-10-16T19:00:00+02:00"),
    endDate: new Date("2025-10-16T21:00:00+02:00"),
    startTime: "19:00",
    endTime: "21:00",
    price: { min: 20, max: 25, currency: 'EUR' },
    ticketUrl: "https://www.braunschweig.de/kultur/kulturelle_einrichtungen/roter-saal/Kulturkalender_3_2025_WEB_.pdf",
    image: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=400&h=300&fit=crop',
    organizer: "Roter Saal Braunschweig",
    attendees: 0,
    capacity: 100,
    tags: ['Klassik', 'Klavierabend', 'Beethoven', 'Mozart', 'Schubert'],
    isFavorite: false,
    isBookmarked: false,
    isAttending: false,
    status: 'upcoming',
    featured: true,
    source: "braunschweig.de",
    url: "https://www.braunschweig.de/kultur/kulturelle_einrichtungen/roter-saal/Kulturkalender_3_2025_WEB_.pdf"
  },
  {
    id: "krimifestival:2025-10-19-0000-festivalbeginn",
    title: "Braunschweiger Krimifestival (Auftakt, Programm bis 02.11.)",
    category: 'festival',
    description: "Rund 40 Veranstaltungen: Lesungen, Führungen, Live-Podcasts, Musik – an verschiedenen Orten in der Stadt.",
    venue: "Diverse Orte (Buchhandlung Graff u. a.)",
    address: "Verschiedene Orte, 38100 Braunschweig",
    coordinates: { lat: 52.2688, lng: 10.5267 },
    startDate: new Date("2025-10-19T00:00:00+02:00"),
    endDate: new Date("2025-11-02T23:59:00+01:00"),
    startTime: "00:00",
    price: null,
    ticketUrl: "https://www.braunschweig.de/tourismus/events/regelmaessige-veranstaltungen-details.php",
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop',
    organizer: "Krimifestival Braunschweig",
    attendees: 0,
    capacity: 1000,
    tags: ['Krimi', 'Festival', 'Literatur', 'Live-Podcast', 'Lesungen'],
    isFavorite: false,
    isBookmarked: false,
    isAttending: false,
    status: 'upcoming',
    featured: true,
    source: "braunschweig.de",
    url: "https://www.braunschweig.de/tourismus/events/regelmaessige-veranstaltungen-details.php"
  },
  {
    id: "tourismus:2025-10-31-2000-abendfuehrung",
    title: "Abendführung (Öffentliche Führung)",
    category: 'culture',
    description: "Abendlicher Rundgang durch die Löwenstadt.",
    venue: "Innenstadt (Treffpunkt laut Buchung)",
    address: "Innenstadt Braunschweig, 38100 Braunschweig",
    coordinates: { lat: 52.2688, lng: 10.5267 },
    startDate: new Date("2025-10-31T20:00:00+01:00"),
    endDate: new Date("2025-10-31T22:00:00+01:00"),
    startTime: "20:00",
    endTime: "22:00",
    price: { min: 12, currency: 'EUR' },
    ticketUrl: "https://www.braunschweig.de/tourismus/ihr-besuch-in-braunschweig/Oe/fuehrungen_einzel.php",
    image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73c6e?w=400&h=300&fit=crop',
    organizer: "Braunschweig Stadtmarketing",
    attendees: 0,
    capacity: 20,
    tags: ['Abendführung', 'Stadtführung', 'Halloween'],
    isFavorite: false,
    isBookmarked: false,
    isAttending: false,
    status: 'upcoming',
    featured: false,
    source: "braunschweig.de",
    url: "https://www.braunschweig.de/tourismus/ihr-besuch-in-braunschweig/Oe/fuehrungen_einzel.php"
  },
  {
    id: "staatstheater:2025-10-04-1500-theaterfuehrung",
    title: "Theaterführung (Großes Haus)",
    category: 'culture',
    description: "Blick hinter die Kulissen des Staatstheaters.",
    venue: "Staatstheater Braunschweig – Großes Haus",
    address: "Am Theater, 38100 Braunschweig",
    coordinates: { lat: 52.2627, lng: 10.5267 },
    startDate: new Date("2025-10-04T15:00:00+02:00"),
    endDate: new Date("2025-10-04T16:30:00+02:00"),
    startTime: "15:00",
    endTime: "16:30",
    price: null,
    ticketUrl: "https://staatstheater-braunschweig.de/produktion/theaterfuehrung-8552",
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
    organizer: "Staatstheater Braunschweig",
    attendees: 0,
    capacity: 30,
    tags: ['Theater', 'Führung', 'Staatstheater', 'Kultur'],
    isFavorite: false,
    isBookmarked: false,
    isAttending: false,
    status: 'upcoming',
    featured: false,
    source: "staatstheater-braunschweig.de",
    url: "https://staatstheater-braunschweig.de/produktion/theaterfuehrung-8552"
  },
  {
    id: "tourismus:2025-10-oldtimerbus-stadtrundfahrt",
    title: "Stadtrundfahrt im Oldtimerbus (Oktober-Termine)",
    category: 'culture',
    description: "Öffentliche Stadtrundfahrten im historischen Bus (mehrere Oktober-Termine buchbar).",
    venue: "Startpunkt laut Buchung",
    address: "Innenstadt Braunschweig, 38100 Braunschweig",
    coordinates: { lat: 52.2688, lng: 10.5267 },
    startDate: new Date("2025-10-01T00:00:00+02:00"),
    endDate: new Date("2025-10-31T23:59:00+01:00"),
    startTime: "10:00",
    price: { min: 26, currency: 'EUR' },
    ticketUrl: "https://www.braunschweig.de/tourismus/ihr-besuch-in-braunschweig/Oe/fuehrungen_einzel.php",
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=300&fit=crop',
    organizer: "Braunschweig Stadtmarketing",
    attendees: 0,
    capacity: 40,
    tags: ['Stadtrundfahrt', 'Oldtimer', 'Bus', 'Tourismus'],
    isFavorite: false,
    isBookmarked: false,
    isAttending: false,
    status: 'upcoming',
    featured: true,
    source: "braunschweig.de",
    url: "https://www.braunschweig.de/tourismus/ihr-besuch-in-braunschweig/Oe/fuehrungen_einzel.php"
  },
  {
    id: "herbstmesse:2025-10-01-1000-rummel",
    title: "Herbstmesse Braunschweig (Schützenplatz)",
    category: 'festival',
    description: "Familienrummel mit Fahrgeschäften und Programm (bis 05.10.).",
    venue: "Schützenplatz, Hamburger Straße 53",
    address: "Hamburger Straße 53, 38114 Braunschweig",
    coordinates: { lat: 52.2627, lng: 10.5180 },
    startDate: new Date("2025-10-01T10:00:00+02:00"),
    endDate: new Date("2025-10-05T22:00:00+02:00"),
    startTime: "10:00",
    endTime: "22:00",
    price: null,
    ticketUrl: "https://www.rummel-braunschweig.de/",
    image: 'https://images.unsplash.com/photo-1529258283598-8d6fe60b27f4?w=400&h=300&fit=crop',
    organizer: "Rummel Braunschweig",
    attendees: 0,
    capacity: 5000,
    tags: ['Herbstmesse', 'Rummel', 'Familie', 'Fahrgeschäfte'],
    isFavorite: false,
    isBookmarked: false,
    isAttending: false,
    status: 'upcoming',
    featured: true,
    source: "rummel-braunschweig.de",
    url: "https://www.rummel-braunschweig.de/"
  }
];

export const getEventById = (id: string): Event | undefined => {
  return EVENTS_DATA.find(event => event.id === id);
};

// Filter für aktuelle Events (ab heute)
export const getCurrentEvents = (): Event[] => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  console.log(`🗓️ Filtering events for date: ${today.toLocaleDateString('de-DE')}`);
  
  const currentEvents = EVENTS_DATA.filter(event => {
    // Event ist aktuell wenn Startdatum >= heute ODER Enddatum >= heute
    const eventStart = new Date(event.startDate.getFullYear(), event.startDate.getMonth(), event.startDate.getDate());
    const eventEnd = new Date(event.endDate.getFullYear(), event.endDate.getMonth(), event.endDate.getDate());
    
    const isCurrent = eventEnd >= today;
    
    if (!isCurrent) {
      console.log(`❌ Filtering out old event: "${event.title}" (ended: ${eventEnd.toLocaleDateString('de-DE')})`);
    } else {
      console.log(`✅ Including current event: "${event.title}" (${eventStart.toLocaleDateString('de-DE')} - ${eventEnd.toLocaleDateString('de-DE')})`);
    }
    
    return isCurrent;
  });
  
  console.log(`📊 Total events: ${EVENTS_DATA.length}, Current events: ${currentEvents.length}`);
  return currentEvents;
};

// Alle Events (auch vergangene) - für Admin/Debug
export const getAllEvents = (): Event[] => {
  return EVENTS_DATA;
};

// Events die in der Vergangenheit liegen
export const getExpiredEvents = (): Event[] => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  return EVENTS_DATA.filter(event => {
    const eventEnd = new Date(event.endDate.getFullYear(), event.endDate.getMonth(), event.endDate.getDate());
    return eventEnd < today;
  });
};