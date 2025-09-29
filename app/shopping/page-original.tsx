'use client';
import { useState, useMemo } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { 
  ArrowLeft, ShoppingBag, Search, Filter, 
  Clock, MapPin, Phone, Globe, Store,
  Home, Navigation, Camera, User
} from 'lucide-react';
import { 
  getAllRetailers, 
  getUniqueCategories, 
  getUniqueAreas, 
  searchRetailers, 
  getRetailersByCategory, 
  type Retailer 
} from '../../lib/retailers-data';

const ShoppingPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Alle');
  const [selectedArea, setSelectedArea] = useState('Alle');
  const [showFilters, setShowFilters] = useState(false);

  // Get all retailers and filter options
  const allRetailers = useMemo(() => getAllRetailers(), []);
  const categories = useMemo(() => getUniqueCategories(), []);
  const areas = useMemo(() => getUniqueAreas(), []);

  // Helper function to determine if store is currently open
  const isStoreOpen = (openingHours: string): boolean => {
    // Simple check - assume stores are open during normal hours
    const now = new Date();
    const currentHour = now.getHours();
    const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    // Check if it's Monday-Saturday (Mo-Sa)
    if (currentDay === 0) return false; // Sunday
    
    // Parse opening hours like "Mo-Sa 10:00-20:00"
    if (openingHours.includes('Mo-Sa')) {
      const timeMatch = openingHours.match(/(\d{1,2}):(\d{2})-(\d{1,2}):(\d{2})/);
      if (timeMatch) {
        const openHour = parseInt(timeMatch[1]);
        const closeHour = parseInt(timeMatch[3]);
        return currentHour >= openHour && currentHour < closeHour;
      }
    }
    
    return true; // Default to open
  };

  // Get category icon
  const getCategoryIcon = (category: string): string => {
    const iconMap: { [key: string]: string } = {
      'Mode & Sport': '👕',
      'Gastronomie': '🍽️',
      'Reisebüro': '✈️',
      'Apotheke': '💊',
      'Elektronik': '📱',
      'Bücher': '📚',
      'Schmuck': '💍',
      'Optik': '👓',
      'Schuhe': '👟',
      'Parfümerie': '🌸',
      'Süßwaren': '🍭',
      'Spielwaren': '🧸',
      'Haushaltwaren': '🏠',
      'Banken': '🏦',
      'Dienstleistung': '⚙️',
      'Geschenke': '🎁'
    };
    return iconMap[category] || '🏪';
  };

  // Filter retailers based on search, category, and area
  const filteredRetailers = useMemo(() => {
    let filtered = allRetailers;

    // Filter by category
    if (selectedCategory !== 'Alle') {
      filtered = filtered.filter(retailer => retailer.category === selectedCategory);
    }

    // Filter by area
    if (selectedArea !== 'Alle') {
      filtered = filtered.filter(retailer => retailer.area === selectedArea);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(retailer =>
        retailer.name.toLowerCase().includes(query) ||
        retailer.category.toLowerCase().includes(query) ||
        retailer.area.toLowerCase().includes(query) ||
        retailer.address.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [allRetailers, selectedCategory, selectedArea, searchQuery]);

  return (
    <>
      <Head>
        <title>Shopping - Braunschweig Smart City</title>
        <meta name="description" content="Entdecke lokale Geschäfte und Händler in Braunschweig" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-md mx-auto bg-white shadow-2xl min-h-screen">
          {/* Header */}
          <div className="bg-blue-600 text-white p-4">
            <div className="flex items-center justify-between mb-4">
              <Link href="/" className="p-2 hover:bg-blue-700 rounded-lg transition-colors">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <h1 className="text-xl font-bold">Shopping</h1>
              <div className="w-10 h-10"></div>
            </div>

            {/* Search Bar */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Geschäfte suchen..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl text-gray-800 placeholder-gray-500"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 bg-blue-700 px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors"
            >
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="bg-white p-4 border-b border-gray-200">
              <div className="space-y-4">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kategorie
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Area Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bereich
                  </label>
                  <select
                    value={selectedArea}
                    onChange={(e) => setSelectedArea(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  >
                    <option value="Alle">Alle Bereiche</option>
                    {areas.map(area => (
                      <option key={area} value={area}>
                        {area}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="bg-white px-4 py-3 border-b border-gray-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{filteredRetailers.length}</div>
              <div className="text-sm text-gray-600">Geschäfte gefunden</div>
            </div>
          </div>

          {/* Retailers List */}
          <div className="p-4 pb-24">
            {filteredRetailers.length === 0 ? (
              <div className="text-center py-8">
                <Store className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Keine Geschäfte gefunden</p>
                <p className="text-sm text-gray-400 mt-2">
                  Versuche es mit anderen Suchbegriffen oder Filtern
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredRetailers.map((retailer) => (
                  <div key={retailer.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-2xl">{getCategoryIcon(retailer.category)}</span>
                            <h3 className="font-bold text-gray-800">{retailer.name}</h3>
                          </div>
                          <p className="text-sm text-blue-600 font-medium mb-1">
                            {retailer.category}
                          </p>
                          <p className="text-sm text-gray-600 mb-1">
                            {retailer.area}
                          </p>
                        </div>
                        
                        <div className="flex items-center">
                          {isStoreOpen(retailer.opening_hours) ? (
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                              Geöffnet
                            </span>
                          ) : (
                            <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                              Geschlossen
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-gray-600 text-sm mb-3">
                        <MapPin className="w-4 h-4" />
                        <span className="truncate">{retailer.address}</span>
                      </div>

                      <div className="flex items-center gap-2 text-gray-600 text-sm mb-4">
                        <Clock className="w-4 h-4" />
                        <span>{retailer.opening_hours}</span>
                      </div>

                      <div className="flex gap-2">
                        {retailer.phone && (
                          <a
                            href={`tel:${retailer.phone}`}
                            className="flex-1 bg-blue-100 text-blue-700 py-2 px-3 rounded-lg text-sm font-medium text-center hover:bg-blue-200 transition-colors flex items-center justify-center gap-1"
                          >
                            <Phone className="w-4 h-4" />
                            Anrufen
                          </a>
                        )}
                        
                        {retailer.website && (
                          <a
                            href={retailer.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-lg text-sm font-medium text-center hover:bg-gray-200 transition-colors flex items-center justify-center gap-1"
                          >
                            <Globe className="w-4 h-4" />
                            Website
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bottom Navigation */}
          <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-200 px-4 py-2">
            <div className="flex justify-around">
              <Link href="/" className="flex flex-col items-center py-2 text-gray-400 hover:text-gray-600">
                <Home className="w-6 h-6" />
                <span className="text-xs mt-1">Home</span>
              </Link>
              <Link href="/navigation" className="flex flex-col items-center py-2 text-gray-400 hover:text-gray-600">
                <Navigation className="w-6 h-6" />
                <span className="text-xs mt-1">Navigation</span>
              </Link>
              <div className="flex flex-col items-center py-2 text-blue-600">
                <ShoppingBag className="w-6 h-6" />
                <span className="text-xs mt-1">Shopping</span>
              </div>
              <Link href="/ar-tour" className="flex flex-col items-center py-2 text-gray-400 hover:text-gray-600">
                <Camera className="w-6 h-6" />
                <span className="text-xs mt-1">AR Tour</span>
              </Link>
              <Link href="/profile" className="flex flex-col items-center py-2 text-gray-400 hover:text-gray-600">
                <User className="w-6 h-6" />
                <span className="text-xs mt-1">Profil</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShoppingPage;