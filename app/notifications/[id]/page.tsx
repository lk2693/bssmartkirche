'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, Info, AlertTriangle, CheckCircle, AlertCircle,
  Calendar, Clock, MapPin, ExternalLink, Share2, Bell
} from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  icon?: string;
  active?: boolean;
  priority?: number;
  partnerId?: string;
  validFrom?: string;
  validUntil?: string;
  displaySettings?: {
    showOnPages: string[];
    showOnce: boolean;
    dismissible: boolean;
    autoCloseAfter: number;
    position: 'top' | 'bottom' | 'center';
  };
  style?: {
    background: string;
    textColor: string;
  };
  action?: {
    text: string;
    link: string;
  };
}

export default function NotificationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [notification, setNotification] = useState<Notification | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params?.id) {
      loadNotification();
    }
  }, [params?.id]);

  const loadNotification = async () => {
    if (!params?.id) return;
    
    try {
      const response = await fetch('/api/content/notifications');
      const data = await response.json();
      
      if (data.success) {
        const found = data.data.find((n: Notification) => n.id === params.id);
        if (found) {
          setNotification(found);
        } else {
          router.push('/');
        }
      }
    } catch (error) {
      console.error('Error loading notification:', error);
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (type: string, customIcon?: string) => {
    if (customIcon) return <span className="text-5xl">{customIcon}</span>;
    
    const iconClass = "w-12 h-12";
    switch (type) {
      case 'info':
        return <Info className={iconClass} />;
      case 'warning':
        return <AlertTriangle className={iconClass} />;
      case 'success':
        return <CheckCircle className={iconClass} />;
      case 'error':
        return <AlertCircle className={iconClass} />;
      default:
        return <Bell className={iconClass} />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'info':
        return 'from-blue-500 to-indigo-600';
      case 'warning':
        return 'from-orange-500 to-red-600';
      case 'success':
        return 'from-green-500 to-emerald-600';
      case 'error':
        return 'from-red-500 to-pink-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: notification?.title,
          text: notification?.message,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share failed:', err);
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link kopiert!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!notification) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Benachrichtigung nicht gefunden</h1>
          <Link href="/" className="text-blue-600 hover:underline">
            Zurück zur Startseite
          </Link>
        </div>
      </div>
    );
  }

  const gradientColor = notification.style?.background || getTypeColor(notification.type);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header mit Gradient */}
      <div className={`bg-gradient-to-r ${gradientColor} text-white py-20`}>
        <div className="max-w-4xl mx-auto px-4">
          {/* Back Button */}
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Zurück</span>
          </Link>

          {/* Icon & Title */}
          <div className="flex items-start gap-6">
            <div className="flex-shrink-0 bg-white/20 backdrop-blur-sm rounded-2xl p-6">
              {getIcon(notification.type, notification.icon)}
            </div>
            <div className="flex-1">
              <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold mb-3">
                {notification.type.toUpperCase()}
              </div>
              <h1 className="text-4xl font-bold mb-4">{notification.title}</h1>
              <p className="text-xl text-white/90">{notification.message}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 -mt-10">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          {/* Meta Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {notification.validFrom && (
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-500 font-semibold">Gültig ab</p>
                  <p className="text-gray-800">{formatDate(notification.validFrom)}</p>
                </div>
              </div>
            )}
            
            {notification.validUntil && (
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-500 font-semibold">Gültig bis</p>
                  <p className="text-gray-800">{formatDate(notification.validUntil)}</p>
                </div>
              </div>
            )}

            {notification.priority && (
              <div className="flex items-start gap-3">
                <Bell className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-500 font-semibold">Priorität</p>
                  <p className="text-gray-800">
                    {notification.priority === 3 ? 'Hoch' : 
                     notification.priority === 2 ? 'Mittel' : 'Normal'}
                  </p>
                </div>
              </div>
            )}

            {notification.displaySettings?.showOnPages && (
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-500 font-semibold">Angezeigt auf</p>
                  <p className="text-gray-800">
                    {notification.displaySettings.showOnPages.map(page => 
                      page.charAt(0).toUpperCase() + page.slice(1)
                    ).join(', ')}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            {notification.action && (
              <Link
                href={notification.action.link}
                className={`flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${gradientColor} text-white rounded-xl font-semibold hover:shadow-lg transition-all`}
              >
                {notification.action.text}
                <ExternalLink className="w-5 h-5" />
              </Link>
            )}
            
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-colors"
            >
              <Share2 className="w-5 h-5" />
              Teilen
            </button>
          </div>
        </div>

        {/* Additional Info Card */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 mb-8">
          <div className="flex items-start gap-3">
            <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-blue-900 mb-2">Über diese Benachrichtigung</h3>
              <p className="text-blue-800 text-sm">
                Diese Benachrichtigung wird automatisch auf den relevanten Seiten der App angezeigt. 
                {notification.displaySettings?.dismissible && ' Sie können sie jederzeit schließen.'}
                {notification.displaySettings?.autoCloseAfter && notification.displaySettings.autoCloseAfter > 0 && 
                  ` Sie verschwindet automatisch nach ${notification.displaySettings.autoCloseAfter} Sekunden.`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
