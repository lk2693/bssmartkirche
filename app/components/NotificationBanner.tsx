'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, AlertCircle, Info, CheckCircle, AlertTriangle } from 'lucide-react';

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

interface NotificationBannerProps {
  page?: string;
}

export default function NotificationBanner({ page = 'home' }: NotificationBannerProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);

  useEffect(() => {
    // Lade dismissedIds aus localStorage
    const stored = localStorage.getItem('dismissedNotifications');
    if (stored) {
      setDismissedIds(JSON.parse(stored));
    }

    // Lade Notifications
    loadNotifications();
  }, [page]);

  const loadNotifications = async () => {
    try {
      const response = await fetch(`/api/content/notifications?page=${page}`);
      const data = await response.json();
      if (data.success) {
        setNotifications(data.data);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const handleDismiss = (id: string, showOnce: boolean) => {
    if (showOnce) {
      const updated = [...dismissedIds, id];
      setDismissedIds(updated);
      localStorage.setItem('dismissedNotifications', JSON.stringify(updated));
    } else {
      setDismissedIds([...dismissedIds, id]);
    }
  };

  const getIcon = (type: string, customIcon?: string) => {
    if (customIcon) return <span className="text-2xl">{customIcon}</span>;
    
    switch (type) {
      case 'info':
        return <Info className="w-6 h-6" />;
      case 'warning':
        return <AlertTriangle className="w-6 h-6" />;
      case 'success':
        return <CheckCircle className="w-6 h-6" />;
      case 'error':
        return <AlertCircle className="w-6 h-6" />;
      default:
        return <Info className="w-6 h-6" />;
    }
  };

  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-900';
      case 'warning':
        return 'bg-orange-50 border-orange-200 text-orange-900';
      case 'success':
        return 'bg-green-50 border-green-200 text-green-900';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-900';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-900';
    }
  };

  const visibleNotifications = notifications.filter(n => {
    // Filtere dismissed Notifications
    if (dismissedIds.includes(n.id)) return false;
    
    // Filtere nach showOnce
    if (n.displaySettings?.showOnce && dismissedIds.includes(n.id)) return false;
    
    return true;
  });

  if (visibleNotifications.length === 0) return null;

  return (
    <div className="space-y-3">
      {visibleNotifications.map((notification) => {
        const hasCustomStyle = notification.style?.background;
        const baseStyles = hasCustomStyle 
          ? `bg-gradient-to-r ${notification.style?.background}`
          : getTypeStyles(notification.type);
        
        const textColor = notification.style?.textColor || 'inherit';

        return (
          <div
            key={notification.id}
            className={`rounded-xl border-2 shadow-lg ${hasCustomStyle ? '' : baseStyles} animate-slide-down`}
            style={hasCustomStyle ? {
              backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))`,
              color: textColor
            } : {}}
          >
            <div className={`p-4 ${hasCustomStyle ? `bg-gradient-to-r ${notification.style?.background}` : ''}`}>
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div className="flex-shrink-0" style={hasCustomStyle ? { color: textColor } : {}}>
                  {getIcon(notification.type, notification.icon)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <Link href={`/notifications/${notification.id}`}>
                    <h3 
                      className="text-lg font-bold mb-1 hover:opacity-80 transition-opacity cursor-pointer"
                      style={hasCustomStyle ? { color: textColor } : {}}
                    >
                      {notification.title}
                    </h3>
                  </Link>
                  <p 
                    className="text-sm"
                    style={hasCustomStyle ? { color: textColor, opacity: 0.95 } : {}}
                  >
                    {notification.message}
                  </p>
                  
                  {/* Action Button */}
                  {notification.action && (
                    <div className="mt-3">
                      <Link
                        href={notification.action.link}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                          hasCustomStyle
                            ? 'bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white'
                            : 'bg-white hover:bg-gray-50 border border-gray-300'
                        }`}
                      >
                        {notification.action.text}
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  )}
                </div>

                {/* Dismiss Button */}
                {notification.displaySettings?.dismissible !== false && (
                  <button
                    onClick={() => handleDismiss(notification.id, notification.displaySettings?.showOnce || false)}
                    className={`flex-shrink-0 p-2 rounded-lg transition-colors ${
                      hasCustomStyle
                        ? 'hover:bg-white/20'
                        : 'hover:bg-black/5'
                    }`}
                    style={hasCustomStyle ? { color: textColor } : {}}
                    aria-label="Schließen"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
