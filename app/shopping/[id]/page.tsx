'use client';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  ArrowLeft, Clock, MapPin, Phone, Globe, Star,
  Navigation, Share, Heart, ExternalLink, 
  Calendar, Users, Euro, Info
} from 'lucide-react';
import { getAllRetailers, type Retailer } from '../../../lib/retailers-data';

const RetailerDetailPage: React.FC = () => {
  const params = useParams();
  const retailerId = params?.id as string;
  const [retailer, setRetailer] = useState<Retailer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (retailerId) {
      const allRetailers = getAllRetailers();
      const foundRetailer = allRetailers.find(r => r.id === retailerId);
      setRetailer(foundRetailer || null);
      setIsLoading(false);

      // Check if retailer is in favorites (simulate with localStorage)
      const favorites = JSON.parse(localStorage.getItem('favoriteRetailers') || '[]');
      setIsFavorite(favorites.includes(retailerId));
    }
  }, [retailerId]);

  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('favoriteRetailers') || '[]');
    let updatedFavorites;
    
    if (isFavorite) {
      updatedFavorites = favorites.filter((id: string) => id !== retailerId);
    } else {
      updatedFavorites = [...favorites, retailerId];
    }
    
    localStorage.setItem('favoriteRetailers', JSON.stringify(updatedFavorites));
    setIsFavorite(!isFavorite);
  };

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

  const shareRetailer = async () => {
    if (navigator.share && retailer) {
      try {
        await navigator.share({
          title: retailer.name,
          text: `Schau dir ${retailer.name} in ${retailer.area} an!`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Sharing failed:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link wurde in die Zwischenablage kopiert!');
    }
  };

  const openInMaps = () => {
    if (retailer) {
      const encodedAddress = encodeURIComponent(retailer.address);
      const mapsUrl = `https://maps.apple.com/?q=${encodedAddress}`;
      window.open(mapsUrl, '_blank');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Lade Geschäftsdetails...</p>
        </div>
      </div>
    );
  }

  if (!retailer) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-md mx-auto bg-white shadow-2xl min-h-screen">
          <div className="bg-blue-600 text-white p-4">
            <div className="flex items-center justify-between">
              <Link href="/shopping" className="p-2 hover:bg-blue-700 rounded-lg transition-colors">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <h1 className="text-xl font-bold">Geschäft nicht gefunden</h1>
              <div className="w-10 h-10"></div>
            </div>
          </div>
          
          <div className="p-8 text-center">
            <div className="text-6xl mb-4">🏪</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Geschäft nicht gefunden</h2>
            <p className="text-gray-600 mb-6">Das gewünschte Geschäft konnte nicht gefunden werden.</p>
            <Link 
              href="/shopping"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Zurück zur Übersicht
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{retailer.name} - Braunschweig Shopping</title>
        <meta name="description" content={`Informationen zu ${retailer.name} in ${retailer.area}, Braunschweig`} />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-md mx-auto bg-white shadow-2xl min-h-screen">
          {/* Header */}
          <div className="bg-blue-600 text-white p-4">
            <div className="flex items-center justify-between mb-4">
              <Link href="/shopping" className="p-2 hover:bg-blue-700 rounded-lg transition-colors">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <h1 className="text-lg font-bold truncate mx-4">{retailer.name}</h1>
              <div className="flex gap-2">
                <button
                  onClick={toggleFavorite}
                  className={`p-2 rounded-lg transition-colors ${
                    isFavorite ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-700 hover:bg-blue-800'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={shareRetailer}
                  className="p-2 bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors"
                >
                  <Share className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-6">
            {/* Store Header */}
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">{getCategoryIcon(retailer.category)}</div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{retailer.name}</h1>
              <div className="flex items-center justify-center gap-2 mb-3">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {retailer.category}
                </span>
                {isStoreOpen(retailer.opening_hours) ? (
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    Geöffnet
                  </span>
                ) : (
                  <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                    Geschlossen
                  </span>
                )}
              </div>
              <p className="text-gray-600">{retailer.area}</p>
            </div>

            {/* Info Cards */}
            <div className="space-y-4 mb-8">
              {/* Address */}
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-1">Adresse</h3>
                    <p className="text-gray-600">{retailer.address}</p>
                    <button
                      onClick={openInMaps}
                      className="mt-2 text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors flex items-center gap-1"
                    >
                      <ExternalLink className="w-4 h-4" />
                      In Karten öffnen
                    </button>
                  </div>
                </div>
              </div>

              {/* Opening Hours */}
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-1">Öffnungszeiten</h3>
                    <p className="text-gray-600">{retailer.opening_hours}</p>
                  </div>
                </div>
              </div>

              {/* Contact */}
              {(retailer.phone || retailer.website) && (
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <h3 className="font-medium text-gray-900 mb-3">Kontakt</h3>
                  <div className="space-y-3">
                    {retailer.phone && (
                      <a
                        href={`tel:${retailer.phone}`}
                        className="flex items-center gap-3 p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                      >
                        <Phone className="w-5 h-5 text-green-600" />
                        <div>
                          <p className="font-medium text-green-900">Anrufen</p>
                          <p className="text-sm text-green-700">{retailer.phone}</p>
                        </div>
                      </a>
                    )}
                    
                    {retailer.website && (
                      <a
                        href={retailer.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                      >
                        <Globe className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="font-medium text-blue-900">Website besuchen</p>
                          <p className="text-sm text-blue-700">Weitere Informationen</p>
                        </div>
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Additional Info */}
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-2">Weitere Informationen</h3>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Stadtteil:</span>
                        <span className="font-medium">{retailer.district}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Postleitzahl:</span>
                        <span className="font-medium">{retailer.postal_code}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Bereich:</span>
                        <span className="font-medium">{retailer.area}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <button
                onClick={openInMaps}
                className="flex items-center justify-center gap-2 bg-blue-600 text-white p-4 rounded-xl hover:bg-blue-700 transition-colors"
              >
                <Navigation className="w-5 h-5" />
                <span className="font-medium">Navigation</span>
              </button>
              
              <button
                onClick={shareRetailer}
                className="flex items-center justify-center gap-2 bg-gray-600 text-white p-4 rounded-xl hover:bg-gray-700 transition-colors"
              >
                <Share className="w-5 h-5" />
                <span className="font-medium">Teilen</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RetailerDetailPage;