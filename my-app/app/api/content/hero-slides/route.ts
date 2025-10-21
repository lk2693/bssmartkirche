// API Endpoint zum Abrufen und Speichern der Hero Slides
// GET /api/content/hero-slides - Slides abrufen
// POST /api/content/hero-slides - Slides speichern

import { NextResponse } from 'next/server';
import { getHeroSlides, HeroSlide } from '@/lib/content-manager';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const partnerId = searchParams.get('partnerId');
    
    let slides = getHeroSlides();
    
    // Filter nach Partner-ID wenn angegeben
    if (partnerId) {
      slides = slides.filter((slide: HeroSlide) => slide.partnerId === partnerId);
    }
    
    return NextResponse.json({
      success: true,
      data: slides,
      count: slides.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching hero slides:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch hero slides' 
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { slides, metadata } = body;
    
    if (!slides || !Array.isArray(slides)) {
      return NextResponse.json(
        { success: false, error: 'Invalid slides data' },
        { status: 400 }
      );
    }
    
    // Prepare data structure
    const data = {
      slides,
      metadata: {
        lastUpdated: new Date().toISOString(),
        version: metadata?.version || '1.0',
        updatedBy: metadata?.updatedBy || 'admin'
      }
    };
    
    // Write to file
    const filePath = path.join(process.cwd(), 'content', 'hero-slides.json');
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
    
    return NextResponse.json({
      success: true,
      message: 'Hero slides saved successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error saving hero slides:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save hero slides' },
      { status: 500 }
    );
  }
}
