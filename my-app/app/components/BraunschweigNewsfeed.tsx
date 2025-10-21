'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MapPin, Navigation } from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  category: 'local' | 'traffic' | 'construction' | 'events';
  publishedAt: string;
  source: string;
  urgent?: boolean;
  location?: {
    street: string;
    coordinates: { lat: number; lng: number };
  };
}

// Lightweight news component for better performance
const BraunschweigNewsfeed: React.FC = React.memo(() => {
  const [activeTab, setActiveTab] = useState<'traffic' | 'news'>('traffic');
  const [trafficNews, setTrafficNews] = useState<NewsItem[]>([]);
  const [generalNews, setGeneralNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Simplified data loading without heavy RSS parsing
  useEffect(() => {
    const loadMockData = () => {
      setLoading(true);
      
      // Mock traffic data - lightweight
      const mockTrafficNews: NewsItem[] = [
        {
          id: 'traffic-1',
          title: 'Stau auf A39 Richtung Wolfsburg',
          summary: '3km Stau, ca. 15 Min Verzögerung',
          category: 'traffic',
          publishedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
          source: 'Verkehrszentrale',
          urgent: true,
          location: {
            street: 'A39 Auffahrt Braunschweig-Nord',
            coordinates: { lat: 52.2888, lng: 10.5269 }
          }
        },
        {
          id: 'traffic-2', 
          title: 'Baustelle Steinweg',
          summary: 'Ampelschaltung wird optimiert',
          category: 'construction',
          publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          source: 'Stadt Braunschweig',
          urgent: false
        }
      ];

      // Mock general news
      const mockGeneralNews: NewsItem[] = [
        {
          id: 'news-1',
          title: 'Löwenfest 2025 angekündigt',
          summary: 'Braunschweigs größtes Stadtfest findet wieder statt',
          category: 'events',
          publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          source: 'Braunschweiger Zeitung',
          urgent: false
        }
      ];

      setTrafficNews(mockTrafficNews);
      setGeneralNews(mockGeneralNews);
      setLoading(false);
    };

    loadMockData();
  }, []);

  const getCategoryIcon = (category: NewsItem['category']) => {
    switch (category) {
      case 'traffic': return '🚦';
      case 'construction': return '🚧';
      case 'events': return '🎉';
      default: return '📰';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Gerade eben';
    if (diffInHours < 24) return `vor ${diffInHours}h`;
    return date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' });
  };

  const currentNews = activeTab === 'traffic' ? trafficNews : generalNews;

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-4">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-3 bg-gray-200 rounded"></div>
          <div className="h-3 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-800">Braunschweig News</h3>
          <div className="text-xs text-gray-500">Live Updates</div>
        </div>
      </div>

      <div className="flex mb-4 bg-gray-100 rounded-lg p-1">
        {(['traffic', 'news'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors relative ${
              activeTab === tab
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-800 hover:text-gray-800'
            }`}
          >
            {tab === 'traffic' && (
              <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center absolute -top-1 -right-1">
                {trafficNews.filter(n => n.urgent).length}
              </span>
            )}
            {tab === 'traffic' ? 'Verkehr' : 'Allgemein'}
          </button>
        ))}
      </div>

      <div className="space-y-3 max-h-60 overflow-y-auto">
        {currentNews.slice(0, 3).map((item) => (
          <div key={item.id} className={`border-l-4 pl-3 py-2 rounded-r-lg ${
            item.urgent ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50'
          }`}>
            <div className="flex items-start gap-3">
              <div className="text-base">{getCategoryIcon(item.category)}</div>
              <div className="flex-1 min-w-0">
                {item.urgent && (
                  <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full font-bold mb-1 inline-block">
                    EILMELDUNG
                  </span>
                )}
                <h3 className="font-medium text-sm text-gray-900 line-clamp-1 mb-1">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-800 line-clamp-2 mb-2">
                  {item.summary}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-700">
                  <div className="flex items-center gap-2">
                    <span>{item.source}</span>
                    {item.location?.coordinates && activeTab === 'traffic' && (
                      <Link href="/navigation" className="flex items-center gap-1 text-blue-600 hover:text-blue-800" aria-label={`Navigation zu ${item.location.street}`}>
                        <Navigation className="w-3 h-3" />
                        <span>Route</span>
                      </Link>
                    )}
                  </div>
                  <span>{formatTimestamp(item.publishedAt)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

BraunschweigNewsfeed.displayName = 'BraunschweigNewsfeed';

export default BraunschweigNewsfeed;