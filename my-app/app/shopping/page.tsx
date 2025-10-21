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
        {/* Responsive container - mobile first, expand for larger screens */}
        <div className="max-w-md mx-auto md:max-w-4xl lg:max-w-7xl bg-white shadow-2xl md:shadow-lg lg:shadow-none min-h-screen">
          {/* Enhanced Header */}
          <div className="bg-blue-600 text-white p-4 md:p-6 lg:p-8">
            <div className="flex items-center justify-between mb-4">
              <Link href="/" className="p-2 hover:bg-blue-700 rounded-lg transition-colors">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold">Shopping</h1>
              <div className="w-10 h-10 md:hidden"></div>
              <div className="hidden md:flex items-center gap-2">
                <ShoppingBag className="w-6 h-6 lg:w-8 lg:h-8" />
                <span className="text-sm lg:text-base">{allRetailers.length} Geschäfte</span>
              </div>
            </div>

            {/* Enhanced Search Bar */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Geschäfte suchen..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 md:py-4 rounded-xl text-gray-800 placeholder-gray-500 text-sm md:text-base"
              />
            </div>

            {/* Enhanced Quick Filters */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex gap-2 overflow-x-auto">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 rounded-full text-sm md:text-base bg-blue-700 text-white border-0 min-w-max"
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
                  className="px-3 py-2 rounded-full text-sm md:text-base bg-blue-700 text-white border-0 min-w-max"
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
              <div className="flex gap-2 justify-center md:justify-end">
                <button
                  onClick={() => setViewMode('categories')}
                  className={`p-2 md:p-3 rounded-lg transition-colors ${
                    viewMode === 'categories' ? 'bg-blue-700' : 'bg-blue-800 hover:bg-blue-700'
                  }`}
                >
                  <Grid3X3 className="w-4 h-4 md:w-5 md:h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 md:p-3 rounded-lg transition-colors ${
                    viewMode === 'list' ? 'bg-blue-700' : 'bg-blue-800 hover:bg-blue-700'
                  }`}
                >
                  <List className="w-4 h-4 md:w-5 md:h-5" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 md:p-3 rounded-lg transition-colors ${
                    viewMode === 'grid' ? 'bg-blue-700' : 'bg-blue-800 hover:bg-blue-700'
                  }`}
                >
                  <Store className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Enhanced Main Content */}
          <div className="pb-24 md:pb-16 lg:pb-8">
            {viewMode === 'categories' && (
              /* Enhanced Category Grid View */
              <div className="p-4 md:p-6 lg:p-8">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                  {categoryStats.map(({ category, count, openCount, icon }) => (
                    <button
                      key={category}
                      onClick={() => {
                        setSelectedCategory(category);
                        setViewMode('list');
                      }}
                      className="bg-white rounded-xl p-4 md:p-6 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all group"
                    >
                      <div className="text-center">
                        <div className="text-3xl md:text-4xl mb-2 md:mb-3">{icon}</div>
                        <h3 className="font-semibold text-gray-800 text-sm md:text-base mb-1 md:mb-2 group-hover:text-blue-600 transition-colors">
                          {category}
                        </h3>
                        <div className="text-xs md:text-sm text-gray-600">
                          <div>{count} Geschäfte</div>
                          <div className="text-green-600">{openCount} geöffnet</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Areas Section for larger screens */}
                <div className="hidden lg:block mt-8">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Nach Bereichen</h2>
                  <div className="grid grid-cols-2 xl:grid-cols-3 gap-3">
                    {areas.slice(1).map(area => {
                      const areaCount = allRetailers.filter(r => r.area === area).length;
                      return (
                        <button
                          key={area}
                          onClick={() => {
                            setSelectedArea(area);
                            setViewMode('list');
                          }}
                          className="bg-white rounded-lg p-4 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all flex items-center justify-between"
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
              /* Enhanced Compact List View */
              <div>
                {/* Results Header */}
                <div className="bg-white px-4 md:px-6 py-3 md:py-4 border-b border-gray-200 flex items-center justify-between">
                  <div className="text-sm md:text-base text-gray-600">
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
                    className="text-sm md:text-base border border-gray-300 rounded px-2 md:px-3 py-1 md:py-2"
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
                      className="block bg-white p-4 md:p-6 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 md:mb-2">
                            <span className="text-lg md:text-xl">{getCategoryIcon(retailer.category)}</span>
                            <h3 className="font-semibold text-gray-800 text-sm md:text-base truncate">
                              {retailer.name}
                            </h3>
                          </div>
                          <div className="text-xs md:text-sm text-gray-600 space-y-1">
                            <div className="flex items-center gap-1">
                              <Store className="w-3 h-3 md:w-4 md:h-4" />
                              <span>{retailer.category}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 md:w-4 md:h-4" />
                              <span className="truncate">{retailer.address}</span>
                            </div>
                            {retailer.opening_hours && (
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3 md:w-4 md:h-4" />
                                <span className={isStoreOpen(retailer.opening_hours) ? 'text-green-600' : 'text-red-600'}>
                                  {isStoreOpen(retailer.opening_hours) ? 'Geöffnet' : 'Geschlossen'} • {retailer.opening_hours}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-gray-400 ml-3" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {viewMode === 'grid' && (
              /* Enhanced Grid View for larger screens */
              <div className="p-4 md:p-6 lg:p-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                  {filteredRetailers.map((retailer) => (
                    <Link 
                      key={retailer.id} 
                      href={`/shopping/${retailer.id}`}
                      className="block bg-white rounded-xl p-4 md:p-6 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all"
                    >
                      <div className="text-center mb-3 md:mb-4">
                        <div className="text-3xl md:text-4xl mb-2">{getCategoryIcon(retailer.category)}</div>
                        <h3 className="font-semibold text-gray-800 text-sm md:text-base mb-1 md:mb-2 line-clamp-2">
                          {retailer.name}
                        </h3>
                        <p className="text-xs md:text-sm text-gray-600 mb-2">{retailer.category}</p>
                      </div>
                      <div className="space-y-1 md:space-y-2 text-xs md:text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 md:w-4 md:h-4" />
                          <span className="truncate">{retailer.address}</span>
                        </div>
                        {retailer.opening_hours && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3 md:w-4 md:h-4" />
                            <span className={isStoreOpen(retailer.opening_hours) ? 'text-green-600' : 'text-red-600'}>
                              {isStoreOpen(retailer.opening_hours) ? 'Geöffnet' : 'Geschlossen'}
                            </span>
                          </div>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Bottom Navigation - responsive */}
          <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md md:max-w-4xl lg:max-w-7xl bg-white border-t border-gray-200 px-4 py-2 md:py-3">
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
                <ShoppingBag className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                <span className="text-xs md:text-sm text-blue-600 font-medium">Shopping</span>
              </Link>
              <Link href="/ar-tour" className="flex flex-col items-center gap-1 p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Camera className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
                <span className="text-xs md:text-sm text-gray-600">AR Tour</span>
              </Link>
              <Link href="/profile" className="flex flex-col items-center gap-1 p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <User className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
                <span className="text-xs md:text-sm text-gray-600">Profile</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShoppingPage;