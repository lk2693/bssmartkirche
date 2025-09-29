// API Route für Event-Management
import { EVENTS_DATA, getEventById } from '../../../lib/events-data';

// Event-Filter-Funktionen direkt hier implementieren
const getCurrentEvents = () => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  return EVENTS_DATA.filter(event => {
    const eventEnd = new Date(event.endDate.getFullYear(), event.endDate.getMonth(), event.endDate.getDate());
    return eventEnd >= today;
  });
};

const getExpiredEvents = () => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  return EVENTS_DATA.filter(event => {
    const eventEnd = new Date(event.endDate.getFullYear(), event.endDate.getMonth(), event.endDate.getDate());
    return eventEnd < today;
  });
};

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { filter } = req.query;
    
    const currentEvents = getCurrentEvents();
    const allEvents = EVENTS_DATA;
    const expiredEvents = getExpiredEvents();
    
    const stats = {
      total: allEvents.length,
      current: currentEvents.length,
      expired: expiredEvents.length,
      filterDate: new Date().toLocaleDateString('de-DE')
    };

    if (filter === 'expired') {
      return res.status(200).json({
        events: expiredEvents,
        stats: stats,
        type: 'expired'
      });
    } else if (filter === 'all') {
      return res.status(200).json({
        events: allEvents,
        stats: stats,
        type: 'all'
      });
    } else {
      return res.status(200).json({
        events: currentEvents,
        stats: stats,
        type: 'current'
      });
    }
    
  } catch (error) {
    console.error('❌ Error in events API:', error);
    return res.status(500).json({ 
      message: 'Internal server error',
      error: error.message 
    });
  }
}