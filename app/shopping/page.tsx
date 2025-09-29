'use client';
import { useState, useMemo } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { 
  ArrowLeft, ShoppingBag, Search, Filter, 
  Clock, MapPin, Phone, Globe, Store,
  Home, Navigation, Camera, User, Grid3X3, List,
  ChevronRight, Star, Users, Zap
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
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'categories'>('categories');
  const [sortBy, setSortBy] = useState<'name' | 'category' | 'area'>('name');

  // Get all retailers and filter options
  const allRetailers = useMemo(() => getAllRetailers(), []);
  const categories = useMemo(() => getUniqueCategories(), []);
  const areas = useMemo(() => getUniqueAreas(), []);

  // Helper function to determine if store is currently open
  const isStoreOpen = (openingHours: string): boolean => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentDay = now.getDay();
    
    if (currentDay === 0) return false; // Sunday
    
    if (openingHours.includes('Mo-Sa')) {
      const timeMatch = openingHours.match(/(\d{1,2}):(\d{2})-(\d{1,2}):(\d{2})/);
      if (timeMatch) {
        const openHour = parseInt(timeMatch[1]);
        const closeHour = parseInt(timeMatch[3]);
        return currentHour >= openHour && currentHour < closeHour;
      }
    }
    
    return true;
  };

  // Get category icon
  const getCategoryIcon = (category: string): string => {
    const iconMap: { [key: string]: string } = {
      'Mode & Sport': '👕', 'Reisebüro': '✈️',
      'Apotheke': '💊', 'Elektronik': '📱', 'Bücher': '📚',
      'Schmuck': '💍', 'Optik': '👓', 'Schuhe': '👟',
      'Parfümerie': '🌸', 'Süßwaren': '🍭', 'Spielwaren': '🧸',
      'Haushaltwaren': '🏠', 'Banken': '🏦', 'Dienstleistung': '⚙️',
      'Geschenke': '🎁'
    };
    return iconMap[category] || '🏪';
  };

  // Get category stats - limit to top 8 categories
  const getCategoryStats = () => {
    return categories.slice(1).map(category => {
      const count = allRetailers.filter(r => r.category === category).length;
      const openCount = allRetailers.filter(r => 
        r.category === category && isStoreOpen(r.opening_hours)
      ).length;
      return { category, count, openCount, icon: getCategoryIcon(category) };
    }).sort((a, b) => b.count - a.count).slice(0, 8); // Limit to 8 categories
  };

  // Filter and sort retailers
  const filteredRetailers = useMemo(() => {
    let filtered = allRetailers;

    if (selectedCategory !== 'Alle') {
      filtered = filtered.filter(retailer => retailer.category === selectedCategory);
    }

    if (selectedArea !== 'Alle') {
      filtered = filtered.filter(retailer => retailer.area === selectedArea);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(retailer =>
        retailer.name.toLowerCase().includes(query) ||
        retailer.category.toLowerCase().includes(query) ||
        retailer.area.toLowerCase().includes(query) ||
        retailer.address.toLowerCase().includes(query)
      );
    }

    // Sort results
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name': return a.name.localeCompare(b.name);
        case 'category': return a.category.localeCompare(b.category);
        case 'area': return a.area.localeCompare(b.area);
        default: return 0;
      }
    });

    return filtered;
  }, [allRetailers, selectedCategory, selectedArea, searchQuery, sortBy]);

  const categoryStats = getCategoryStats();

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

            {/* Quick Filters */}
            <div className="flex gap-2 mb-4 overflow-x-auto">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-1 rounded-full text-sm bg-blue-700 text-white border-0 min-w-max"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              
              <select
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                className="px-3 py-1 rounded-full text-sm bg-blue-700 text-white border-0 min-w-max"
              >
                <option value="Alle">Alle Bereiche</option>
                {areas.map(area => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
            </div>

            {/* View Mode Toggles */}
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => setViewMode('categories')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'categories' ? 'bg-blue-700' : 'bg-blue-800 hover:bg-blue-700'
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-blue-700' : 'bg-blue-800 hover:bg-blue-700'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-blue-700' : 'bg-blue-800 hover:bg-blue-700'
                }`}
              >
                <Store className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="pb-24">
            {viewMode === 'categories' && (
              /* Categories Overview */
              <div className="p-4">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-blue-600">{allRetailers.length}</div>
                  <div className="text-sm text-gray-600">Geschäfte in Braunschweig</div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {categoryStats.map(({ category, count, openCount, icon }) => (
                    <button
                      key={category}
                      onClick={() => {
                        setSelectedCategory(category);
                        setViewMode('list');
                      }}
                      className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all hover:scale-105"
                    >
                      <div className="text-center">
                        <div className="text-3xl mb-2">{icon}</div>
                        <div className="text-sm font-medium text-gray-800 mb-1 truncate">
                          {category}
                        </div>
                        <div className="text-lg font-bold text-blue-600">{count}</div>
                        <div className="text-xs text-green-600">
                          {openCount} geöffnet
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Popular Areas */}
                <div className="mt-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-3">Beliebte Bereiche</h3>
                  <div className="space-y-2">
                    {areas.slice(1, 6).map(area => {
                      const areaCount = allRetailers.filter(r => r.area === area).length;
                      return (
                        <button
                          key={area}
                          onClick={() => {
                            setSelectedArea(area);
                            setViewMode('list');
                          }}
                          className="w-full bg-white p-3 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <MapPin className="w-5 h-5 text-blue-600" />
                            <span className="font-medium text-gray-800">{area}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">{areaCount}</span>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {viewMode === 'list' && (
              /* Compact List View */
              <div>
                {/* Results Header */}
                <div className="bg-white px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    {filteredRetailers.length} Ergebnisse
                    {selectedCategory !== 'Alle' && (
                      <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        {selectedCategory}
                      </span>
                    )}
                  </div>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="text-sm border border-gray-300 rounded px-2 py-1"
                  >
                    <option value="name">Name</option>
                    <option value="category">Kategorie</option>
                    <option value="area">Bereich</option>
                  </select>
                </div>

                <div className="divide-y divide-gray-100">
                  {filteredRetailers.map((retailer) => (
                    <Link 
                      key={retailer.id} 
                      href={`/shopping/${retailer.id}`}
                      className="block bg-white p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-lg">{getCategoryIcon(retailer.category)}</span>
                            <h3 className="font-medium text-gray-900 truncate">{retailer.name}</h3>
                            {isStoreOpen(retailer.opening_hours) && (
                              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 truncate">{retailer.address}</p>
                          <p className="text-xs text-blue-600">{retailer.category}</p>
                        </div>
                        
                        <div className="flex gap-1 ml-2">
                          {retailer.phone && (
                            <a
                              href={`tel:${retailer.phone}`}
                              onClick={(e) => e.stopPropagation()}
                              className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                            >
                              <Phone className="w-4 h-4" />
                            </a>
                          )}
                          {retailer.website && (
                            <a
                              href={retailer.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                              <Globe className="w-4 h-4" />
                            </a>
                          )}
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {viewMode === 'grid' && (
              /* Detailed Grid View */
              <div className="p-4">
                <div className="bg-white px-4 py-3 rounded-lg mb-4 flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    {filteredRetailers.length} Geschäfte gefunden
                  </div>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="text-sm border border-gray-300 rounded px-2 py-1"
                  >
                    <option value="name">Name</option>
                    <option value="category">Kategorie</option>
                    <option value="area">Bereich</option>
                  </select>
                </div>

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
                      <Link 
                        key={retailer.id} 
                        href={`/shopping/${retailer.id}`}
                        className="block bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                      >
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
                                onClick={(e) => e.stopPropagation()}
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
                                onClick={(e) => e.stopPropagation()}
                                className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-lg text-sm font-medium text-center hover:bg-gray-200 transition-colors flex items-center justify-center gap-1"
                              >
                                <Globe className="w-4 h-4" />
                                Website
                              </a>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
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