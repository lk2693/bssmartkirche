// API Endpoint zum Abrufen der Featured Events
// GET /api/content/featured-events

import { NextResponse } from 'next/server';
import { getFeaturedEvents, FeaturedEvent } from '@/lib/content-manager';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const partnerId = searchParams.get('partnerId');
    const showOnHome = searchParams.get('showOnHome');
    
    let events = getFeaturedEvents();
    
    // Filter nach Partner-ID wenn angegeben
    if (partnerId) {
      events = events.filter((event: FeaturedEvent) => event.partnerId === partnerId);
    }
    
    // Filter nach Home-Anzeige wenn angegeben
    if (showOnHome === 'true') {
      events = events.filter((event: FeaturedEvent) => event.highlight?.showOnHome === true);
    }
    
    return NextResponse.json({
      success: true,
      data: events,
      count: events.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching featured events:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch featured events' 
      },
      { status: 500 }
    );
  }
}
