'use client';

import Link from 'next/link';
import { useState, useMemo } from 'react';

interface Handler {
  id: number;
  name: string;
  lat: number;
  lng: number;
  website: string;
  adresse?: string;
  oeffnungszeiten?: string;
}

const haendlerData: Handler[] = [
  { id: 1949, name: "Braunschweig Stadtmarketing GmbH", lat: 52.264863, lng: 10.521881512988276, website: "https://deinportal.de/handler/1949", adresse: "Vor der Burg 1, 38100 Braunschweig", oeffnungszeiten: "Mo-Fr: 9:00-18:00\nSa: 10:00-16:00" },
  { id: 1950, name: "Café BRUNS vom Verein BRUNS e.V.", lat: 52.2601159, lng: 10.517245510338103, website: "https://deinportal.de/handler/1950", adresse: "Magnitorwall 16, 38100 Braunschweig", oeffnungszeiten: "Mo-Fr: 8:00-18:00\nSa-So: 9:00-17:00" },
  { id: 1951, name: "Soldekk / IVBB GmbH", lat: 52.2607916, lng: 10.5176888, website: "https://deinportal.de/handler/1951", adresse: "Magnitorwall, 38100 Braunschweig", oeffnungszeiten: "Mo-Fr: 10:00-19:00\nSa: 10:00-18:00" },
  { id: 1952, name: "Touristinfo Braunschweig", lat: 52.2637603, lng: 10.5222665, website: "https://deinportal.de/handler/1952", adresse: "Kleine Burg 14, 38100 Braunschweig", oeffnungszeiten: "Mo-Fr: 10:00-18:00\nSa: 10:00-16:00\nSo: Geschlossen" },
  { id: 1953, name: "Galerie Thomas Kaphammel", lat: 52.2615862, lng: 10.519468, website: "https://deinportal.de/handler/1953", adresse: "Magnitorwall, 38100 Braunschweig", oeffnungszeiten: "Di-Fr: 11:00-18:00\nSa: 11:00-16:00" },
  { id: 1954, name: "Augenoptik Winter GmbH", lat: 52.2641902, lng: 10.522466225159674, website: "https://deinportal.de/handler/1954", adresse: "Hutfiltern 5, 38100 Braunschweig", oeffnungszeiten: "Mo-Fr: 9:00-18:30\nSa: 9:00-14:00" },
  { id: 1955, name: "Summersby- Langerfeldt Haus", lat: 52.264863, lng: 10.521881512988276, website: "https://deinportal.de/handler/1955", adresse: "Vor der Burg, 38100 Braunschweig", oeffnungszeiten: "Mo-Sa: 10:00-20:00" },
  { id: 1957, name: "Yoga Ambiente", lat: 52.2618703, lng: 10.530026662157077, website: "https://deinportal.de/handler/1957", adresse: "Wilhelmstraße 42, 38100 Braunschweig", oeffnungszeiten: "Mo-Fr: 8:00-21:00\nSa-So: 9:00-18:00" },
  { id: 1959, name: "Städtisches Museum Braunschweig", lat: 52.2615729, lng: 10.5327414, website: "https://deinportal.de/handler/1959", adresse: "Haus am Löwenwall, 38100 Braunschweig", oeffnungszeiten: "Di-So: 10:00-17:00\nMo: Geschlossen" },
  { id: 1961, name: "Trauringstudio Braunschweig", lat: 52.262093, lng: 10.5277907, website: "https://deinportal.de/handler/1961", adresse: "Schuhstraße 8, 38100 Braunschweig", oeffnungszeiten: "Mo-Fr: 10:00-18:00\nSa: 10:00-16:00" },
  { id: 1963, name: "Lüttes", lat: 52.2684776, lng: 10.519440650000004, website: "https://deinportal.de/handler/1963" },
  { id: 1965, name: "Royal Flowers", lat: 52.2632041, lng: 10.52033487451735, website: "https://deinportal.de/handler/1965" },
  { id: 1966, name: "Summersby - Schloss Arkaden", lat: 52.265102150000004, lng: 10.528141999999999, website: "https://deinportal.de/handler/1966" },
  { id: 1967, name: "Studio Q1", lat: 52.2790533, lng: 10.5577544, website: "https://deinportal.de/handler/1967" },
  { id: 1968, name: "Boutique Birkenstock", lat: 52.2640321, lng: 10.5254509, website: "https://deinportal.de/handler/1968" },
  { id: 1971, name: "Zea Bar & Bistro", lat: 52.2681037, lng: 10.518117, website: "https://deinportal.de/handler/1971" },
  { id: 1973, name: "Hidden in Braunschweig - The live Escape Game", lat: 52.258938549999996, lng: 10.511424518981864, website: "https://deinportal.de/handler/1973" },
  { id: 1974, name: "Heimatrausch", lat: 52.2629184, lng: 10.5250362, website: "https://deinportal.de/handler/1974" },
  { id: 1977, name: "Vielharmonie", lat: 52.261488549999996, lng: 10.518557004551468, website: "https://deinportal.de/handler/1977" },
  { id: 1979, name: "Jens Koch", lat: 52.262787450000005, lng: 10.519622035497342, website: "https://deinportal.de/handler/1979" },
  { id: 1980, name: "bücherwurm - Bücher für Kinder und Erwachsene", lat: 52.26165399999999, lng: 10.528918613527203, website: "https://deinportal.de/handler/1980" },
  { id: 1983, name: "Pfankuch Buch GmbH", lat: 52.2643875, lng: 10.52310645180494, website: "https://deinportal.de/handler/1983", adresse: "Sack 17, 38100 Braunschweig", oeffnungszeiten: "Mo-Fr: 9:30-19:00\nSa: 9:30-18:00" },
  { id: 1984, name: "Galerie Jaeschke GmbH", lat: 52.2639212, lng: 10.521575, website: "https://deinportal.de/handler/1984", adresse: "Schuhstraße 21, 38100 Braunschweig", oeffnungszeiten: "Di-Fr: 10:00-18:00\nSa: 10:00-14:00" },
  { id: 1985, name: "Holiday womenswear", lat: 52.2630272, lng: 10.5193562, website: "https://deinportal.de/handler/1985", adresse: "Schuhstraße 34, 38100 Braunschweig", oeffnungszeiten: "Mo-Fr: 10:00-18:30\nSa: 10:00-18:00" },
  { id: 1986, name: "FOTO HAAS GmbH", lat: 52.2626419, lng: 10.5235303, website: "https://deinportal.de/handler/1986", adresse: "Schuhstraße 2, 38100 Braunschweig", oeffnungszeiten: "Mo-Fr: 9:00-18:30\nSa: 9:00-16:00" },
  { id: 1987, name: "HAHNE - FAHRRAD GmbH & Co. KG", lat: 52.26609045, lng: 10.519616511508076, website: "https://deinportal.de/handler/1987", adresse: "Steinweg 38, 38100 Braunschweig", oeffnungszeiten: "Mo-Fr: 9:00-18:30\nSa: 9:00-16:00" },
  { id: 1989, name: "F. Niemeyer Augenoptik GmbH", lat: 52.26173905, lng: 10.527438298049429, website: "https://deinportal.de/handler/1989" },
  { id: 1990, name: "Lillefits", lat: 52.2650554, lng: 10.5280642, website: "https://deinportal.de/handler/1990" },
  { id: 1991, name: "Möbel Sander GmbH", lat: 52.2656596, lng: 10.5170866, website: "https://deinportal.de/handler/1991" },
  { id: 1992, name: "SVANEKE fæshion", lat: 52.2630272, lng: 10.5193562, website: "https://deinportal.de/handler/1992" },
  { id: 1993, name: "Argo Mieder und Wäsche", lat: 52.264468300000004, lng: 10.520263926494145, website: "https://deinportal.de/handler/1993" },
  { id: 1994, name: "Loose-Schuhe", lat: 52.26435995, lng: 10.522340318524673, website: "https://deinportal.de/handler/1994" },
  { id: 1995, name: "Freya", lat: 52.2643875, lng: 10.52310645180494, website: "https://deinportal.de/handler/1995" },
  { id: 1996, name: "WEISS | Schreiben&Schenken", lat: 52.26489643918344, lng: 10.521489873774097, website: "https://deinportal.de/handler/1996" },
  { id: 1997, name: "Jojeco Shoes, Concept, Outlet, Secondhand Store", lat: 52.2617247, lng: 10.52844440780142, website: "https://deinportal.de/handler/1997" },
  { id: 1998, name: "Jojeco Fairfashion Store", lat: 52.26178035, lng: 10.52923411264333, website: "https://deinportal.de/handler/1998" },
  { id: 1999, name: "Penta Hotel Braunschweig", lat: 52.2598345, lng: 10.527066275593718, website: "https://deinportal.de/handler/1999", adresse: "Berliner Platz 3, 38102 Braunschweig", oeffnungszeiten: "24/7 geöffnet\nRezeption immer besetzt" },
  { id: 2001, name: "Akzente", lat: 52.27190865, lng: 10.54409700036078, website: "https://deinportal.de/handler/2001" },
  { id: 2002, name: "BS|ENERGY", lat: 52.262784100000005, lng: 10.52552883859187, website: "https://deinportal.de/handler/2002" },
  { id: 2004, name: "Bungenstock Juwelier GmbH", lat: 52.26277985, lng: 10.520137800867452, website: "https://deinportal.de/handler/2004" },
  { id: 2006, name: "Buchhandlung Graff GmbH", lat: 52.26512955, lng: 10.521744011770672, website: "https://deinportal.de/handler/2006" },
  { id: 2007, name: "National Jürgens Brauerei GmbH", lat: 52.2766152, lng: 10.5302112, website: "https://deinportal.de/handler/2007" },
  { id: 2008, name: "apotheca Sack", lat: 52.26505, lng: 10.52110871492659, website: "https://deinportal.de/handler/2008", adresse: "Sack 8, 38100 Braunschweig", oeffnungszeiten: "Mo-Fr: 8:00-19:00\nSa: 9:00-14:00" },
  { id: 2009, name: "Hagenmarkt Apotheke", lat: 52.2678332, lng: 10.5243402, website: "https://deinportal.de/handler/2009", adresse: "Hagenmarkt 20, 38100 Braunschweig", oeffnungszeiten: "Mo-Fr: 8:00-18:30\nSa: 9:00-13:00" },
  { id: 2010, name: "Altstadtmarkt Apotheke", lat: 52.262804, lng: 10.518243, website: "https://deinportal.de/handler/2010", adresse: "Altstadtmarkt 9, 38100 Braunschweig", oeffnungszeiten: "Mo-Fr: 8:30-18:30\nSa: 9:00-14:00" },
  { id: 2018, name: "Ulrici Apotheke", lat: 52.2641858, lng: 10.520999962137012, website: "https://deinportal.de/handler/2018" },
  { id: 2020, name: "Garten­Center Nordharz GmbH & Co. KG", lat: 52.2430825, lng: 10.513020672242055, website: "https://deinportal.de/handler/2020" },
  { id: 2021, name: "Braunschweig Stadtmarketing GmbH", lat: 52.264863, lng: 10.521881512988276, website: "https://deinportal.de/handler/2021" },
  { id: 2022, name: "VirtuaLounge", lat: 52.2640902, lng: 10.5225241, website: "https://deinportal.de/handler/2022" },
  { id: 2024, name: "Braunschweiger Verkehrs­GmbH (BSVG)", lat: 52.2644377, lng: 10.526105417241379, website: "https://deinportal.de/handler/2024" },
  { id: 2025, name: "Bohlweg­Apotheke OHG", lat: 52.2647858, lng: 10.52657, website: "https://deinportal.de/handler/2025" },
  { id: 2026, name: "Volkshochschule Braunschweig", lat: 52.2675894, lng: 10.519841871172101, website: "https://deinportal.de/handler/2026" },
  { id: 2027, name: "Haus der Familie Braunschweig", lat: 52.268758399999996, lng: 10.520293550909203, website: "https://deinportal.de/handler/2027" },
  { id: 2030, name: "David Men & Women", lat: 52.2620814, lng: 10.52063169601718, website: "https://deinportal.de/handler/2030" },
  { id: 2031, name: "Magniküche", lat: 52.26367285, lng: 10.518898435117492, website: "https://deinportal.de/handler/2031" },
  { id: 2034, name: "Rebmann Maßkleidung", lat: 52.2559916, lng: 10.514598196393642, website: "https://deinportal.de/handler/2034" },
  { id: 2751, name: "Brinckmann & Lange", lat: 52.26278405, lng: 10.520000823129056, website: "https://deinportal.de/handler/2751" },
  { id: 2986, name: "zalü concept store", lat: 52.2635956, lng: 10.5190797, website: "https://deinportal.de/handler/2986" },
  { id: 3018, name: "Brettspiel Eck", lat: 52.2686789, lng: 10.5283423, website: "https://deinportal.de/handler/3018" }
];

// Helper function to get category based on business name
function getCategory(name: string): { label: string; color: string } {
  const nameLower = name.toLowerCase();
  
  if (nameLower.includes('apotheke')) return { label: 'Apotheke', color: 'bg-red-100 text-red-700' };
  if (nameLower.includes('café') || nameLower.includes('cafe') || nameLower.includes('bar') || nameLower.includes('bistro') || nameLower.includes('küche')) return { label: 'Gastronomie', color: 'bg-orange-100 text-orange-700' };
  if (nameLower.includes('hotel')) return { label: 'Hotel', color: 'bg-purple-100 text-purple-700' };
  if (nameLower.includes('museum') || nameLower.includes('galerie')) return { label: 'Kultur', color: 'bg-pink-100 text-pink-700' };
  if (nameLower.includes('buch') || nameLower.includes('bücher')) return { label: 'Buchhandlung', color: 'bg-blue-100 text-blue-700' };
  if (nameLower.includes('optik') || nameLower.includes('augen')) return { label: 'Optiker', color: 'bg-cyan-100 text-cyan-700' };
  if (nameLower.includes('juwel') || nameLower.includes('trauringstudio')) return { label: 'Schmuck', color: 'bg-yellow-100 text-yellow-700' };
  if (nameLower.includes('foto')) return { label: 'Fotografie', color: 'bg-indigo-100 text-indigo-700' };
  if (nameLower.includes('fahrrad')) return { label: 'Fahrrad', color: 'bg-green-100 text-green-700' };
  if (nameLower.includes('möbel')) return { label: 'Möbel', color: 'bg-amber-100 text-amber-700' };
  if (nameLower.includes('schuhe') || nameLower.includes('shoes')) return { label: 'Schuhe', color: 'bg-slate-100 text-slate-700' };
  if (nameLower.includes('yoga') || nameLower.includes('wellness')) return { label: 'Wellness', color: 'bg-emerald-100 text-emerald-700' };
  if (nameLower.includes('brauerei')) return { label: 'Brauerei', color: 'bg-amber-100 text-amber-800' };
  if (nameLower.includes('vhs') || nameLower.includes('volkshochschule') || nameLower.includes('familie')) return { label: 'Bildung', color: 'bg-teal-100 text-teal-700' };
  if (nameLower.includes('verkehr') || nameLower.includes('bsvg')) return { label: 'Verkehr', color: 'bg-lime-100 text-lime-700' };
  if (nameLower.includes('garten')) return { label: 'Garten', color: 'bg-green-100 text-green-700' };
  if (nameLower.includes('escape') || nameLower.includes('virtuallounge') || nameLower.includes('brettspiel')) return { label: 'Entertainment', color: 'bg-fuchsia-100 text-fuchsia-700' };
  if (nameLower.includes('touristinfo') || nameLower.includes('stadtmarketing')) return { label: 'Tourismus', color: 'bg-sky-100 text-sky-700' };
  if (nameLower.includes('fashion') || nameLower.includes('boutique') || nameLower.includes('womenswear') || nameLower.includes('men') || nameLower.includes('wäsche') || nameLower.includes('maßkleidung')) return { label: 'Mode', color: 'bg-rose-100 text-rose-700' };
  
  return { label: 'Einzelhandel', color: 'bg-gray-100 text-gray-700' };
}

export default function VouchersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Alle');
  const [selectedHandler, setSelectedHandler] = useState<Handler | null>(null);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set(haendlerData.map(h => getCategory(h.name).label));
    return ['Alle', ...Array.from(cats).sort()];
  }, []);

  // Filter handlers
  const filteredHandlers = useMemo(() => {
    return haendlerData.filter(handler => {
      const matchesSearch = handler.name.toLowerCase().includes(searchTerm.toLowerCase());
      const category = getCategory(handler.name);
      const matchesCategory = selectedCategory === 'Alle' || category.label === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto bg-white shadow-2xl min-h-screen relative">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4">
          <div className="flex items-center justify-between mb-4">
            <Link href="/" className="p-2 hover:bg-blue-700 rounded-lg transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <h1 className="text-xl font-bold">Gutschein-Partner</h1>
            <div className="w-10 h-10"></div> {/* Spacer */}
          </div>

          {/* Search Bar */}
          <div className="relative">
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Partner suchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-blue-500/30 border border-blue-400 rounded-xl placeholder-blue-200 text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
            />
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="bg-white border-b border-gray-200 px-4 pt-4">
          <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white px-4 py-3 border-b border-gray-200">
          <div className="flex items-center justify-center gap-2 text-sm">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-semibold text-blue-600">{filteredHandlers.length}</span>
            <span className="text-gray-600">von {haendlerData.length} Partnern</span>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto">
          {/* Empty State */}
          {filteredHandlers.length === 0 && (
            <div className="p-8 text-center">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-gray-500 text-lg font-medium">Keine Partner gefunden</p>
              <p className="text-gray-400 text-sm mt-2">Versuchen Sie andere Suchbegriffe</p>
            </div>
          )}

          {/* Handlers List */}
          <div className="p-4 space-y-3">
            {filteredHandlers.map((handler) => {
              const category = getCategory(handler.name);
              return (
                <div 
                  key={handler.id} 
                  className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-200"
                >
                  <div className="p-4">
                    {/* Category Badge */}
                    <div className="mb-2">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${category.color}`}>
                        {category.label}
                      </span>
                    </div>
                    
                    {/* Name */}
                    <h2 className="text-base font-bold text-gray-800 mb-2 line-clamp-2">
                      {handler.name}
                    </h2>
                    
                    {/* Location */}
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                      <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="truncate">
                        {handler.lat.toFixed(4)}, {handler.lng.toFixed(4)}
                      </span>
                    </div>
                    
                    {/* Button */}
                    <button 
                      onClick={() => setSelectedHandler(handler)}
                      className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium px-4 py-2.5 rounded-lg transition-colors duration-200 text-sm"
                    >
                      <span>Details anzeigen</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          {filteredHandlers.length > 0 && (
            <div className="p-4 text-center text-gray-500 text-xs pb-8">
              ✨ Alle teilnehmenden Partner im Überblick
            </div>
          )}
        </div>

        {/* Bottom Navigation Spacer */}
        <div className="h-20"></div>

        {/* Detail Modal */}
        {selectedHandler && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
            <div className="bg-white w-full max-w-md rounded-t-2xl sm:rounded-2xl max-h-[90vh] overflow-y-auto animate-slide-up">
              {/* Modal Header */}
              <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-t-2xl z-10">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold">Partner Details</h2>
                  <button 
                    onClick={() => setSelectedHandler(null)}
                    className="p-2 hover:bg-blue-700 rounded-lg transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Category Badge */}
                <div>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getCategory(selectedHandler.name).color}`}>
                    {getCategory(selectedHandler.name).label}
                  </span>
                </div>

                {/* Name */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {selectedHandler.name}
                  </h3>
                </div>

                {/* Info Sections */}
                <div className="space-y-4">
                  {/* Address */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 mb-1">Adresse</h4>
                        <p className="text-gray-600 text-sm">
                          {selectedHandler.adresse || 'Keine Adresse verfügbar'}
                        </p>
                        <p className="text-gray-500 text-xs mt-1">
                          {selectedHandler.lat.toFixed(6)}, {selectedHandler.lng.toFixed(6)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Opening Hours */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-green-100 p-2 rounded-lg">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 mb-1">Öffnungszeiten</h4>
                        <p className="text-gray-600 text-sm whitespace-pre-line">
                          {selectedHandler.oeffnungszeiten || 'Keine Öffnungszeiten verfügbar'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Website */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-purple-100 p-2 rounded-lg">
                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 mb-1">Website</h4>
                        <a 
                          href={selectedHandler.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm underline break-all"
                        >
                          {selectedHandler.website}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 pt-4">
                  <a
                    href={selectedHandler.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200"
                  >
                    <span>Website besuchen</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>

                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${selectedHandler.lat},${selectedHandler.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold px-6 py-3 rounded-lg transition-colors duration-200"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    <span>In Karte öffnen</span>
                  </a>
                </div>

                {/* ID Info */}
                <div className="text-center text-xs text-gray-400 pt-2 border-t border-gray-100">
                  Partner ID: {selectedHandler.id}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
