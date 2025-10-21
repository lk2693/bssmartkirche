// Content Manager - Zentrale Verwaltung für Hero Slides und Featured Events
// Diese Datei kann später durch ein CMS ersetzt werden

import heroSlidesData from '../content/hero-slides.json';
import featuredEventsData from '../content/featured-events.json';
import notificationsData from '../content/notifications.json';

export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  cta: string;
  ctaLink: string;
  gradient: string;
  active?: boolean;
  order?: number;
  partnerId?: string;
  validFrom?: string;
  validUntil?: string;
}

export interface FeaturedEvent {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  time: string;
  location: string;
  image: string;
  category: string;
  attendees: number;
  price: string;
  featured?: boolean;
  priority?: number;
  partnerId?: string;
  validFrom?: string;
  validUntil?: string;
  active?: boolean;
  highlight?: {
    color: string;
    badge: string;
    showOnHome: boolean;
  };
}

export interface Notification {
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

/**
 * Lädt alle Hero Slides und filtert nach aktiven und gültigen Slides
 */
export function getHeroSlides(): HeroSlide[] {
  const now = new Date();
  
  return heroSlidesData.slides
    .filter(slide => {
      // Prüfe ob Slide aktiv ist
      if (slide.active === false) return false;
      
      // Prüfe Gültigkeitszeitraum
      if (slide.validFrom) {
        const validFrom = new Date(slide.validFrom);
        if (now < validFrom) return false;
      }
      
      if (slide.validUntil) {
        const validUntil = new Date(slide.validUntil);
        if (now > validUntil) return false;
      }
      
      return true;
    })
    .sort((a, b) => (a.order || 0) - (b.order || 0));
}

/**
 * Lädt alle Featured Events und filtert nach aktiven und gültigen Events
 */
export function getFeaturedEvents(): FeaturedEvent[] {
  const now = new Date();
  
  return featuredEventsData.featuredEvents
    .filter(event => {
      // Prüfe ob Event aktiv ist
      if (event.active === false) return false;
      
      // Prüfe Gültigkeitszeitraum
      if (event.validFrom) {
        const validFrom = new Date(event.validFrom);
        if (now < validFrom) return false;
      }
      
      if (event.validUntil) {
        const validUntil = new Date(event.validUntil);
        if (now > validUntil) return false;
      }
      
      return true;
    })
    .sort((a, b) => (a.priority || 0) - (b.priority || 0));
}

/**
 * Lädt einen einzelnen Hero Slide nach ID
 */
export function getHeroSlideById(id: string): HeroSlide | undefined {
  return heroSlidesData.slides.find(slide => slide.id === id);
}

/**
 * Lädt ein einzelnes Featured Event nach ID
 */
export function getFeaturedEventById(id: string): FeaturedEvent | undefined {
  return featuredEventsData.featuredEvents.find(event => event.id === id);
}

/**
 * Lädt Hero Slides eines bestimmten Partners
 */
export function getHeroSlidesByPartnerId(partnerId: string): HeroSlide[] {
  return getHeroSlides().filter(slide => slide.partnerId === partnerId);
}

/**
 * Lädt Featured Events eines bestimmten Partners
 */
export function getFeaturedEventsByPartnerId(partnerId: string): FeaturedEvent[] {
  return getFeaturedEvents().filter(event => event.partnerId === partnerId);
}

/**
 * Lädt alle Notifications und filtert nach aktiven und gültigen Benachrichtigungen
 */
export function getNotifications(page?: string): Notification[] {
  const now = new Date();
  
  return (notificationsData.notifications as Notification[])
    .filter(notification => {
      // Prüfe ob Notification aktiv ist
      if (notification.active === false) return false;
      
      // Prüfe Gültigkeitszeitraum
      if (notification.validFrom) {
        const validFrom = new Date(notification.validFrom);
        if (now < validFrom) return false;
      }
      
      if (notification.validUntil) {
        const validUntil = new Date(notification.validUntil);
        if (now > validUntil) return false;
      }
      
      // Filtere nach Seite wenn angegeben
      if (page && notification.displaySettings?.showOnPages) {
        if (!notification.displaySettings.showOnPages.includes(page)) return false;
      }
      
      return true;
    })
    .sort((a, b) => (a.priority || 0) - (b.priority || 0));
}

/**
 * Lädt eine einzelne Notification nach ID
 */
export function getNotificationById(id: string): Notification | undefined {
  return (notificationsData.notifications as Notification[]).find(notification => notification.id === id);
}

/**
 * Lädt Notifications eines bestimmten Partners
 */
export function getNotificationsByPartnerId(partnerId: string): Notification[] {
  return getNotifications().filter(notification => notification.partnerId === partnerId);
}
