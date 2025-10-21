// API Endpoint zum Abrufen und Speichern der Notifications
// GET /api/content/notifications - Notifications abrufen
// POST /api/content/notifications - Notifications speichern

import { NextResponse } from 'next/server';
import { getNotifications, Notification } from '@/lib/content-manager';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const partnerId = searchParams.get('partnerId');
    const page = searchParams.get('page');
    
    let notifications = getNotifications(page || undefined);
    
    // Filter nach Partner-ID wenn angegeben
    if (partnerId) {
      notifications = notifications.filter((notification: Notification) => notification.partnerId === partnerId);
    }
    
    return NextResponse.json({
      success: true,
      data: notifications,
      count: notifications.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch notifications' 
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { notifications, metadata } = body;
    
    if (!notifications || !Array.isArray(notifications)) {
      return NextResponse.json(
        { success: false, error: 'Invalid notifications data' },
        { status: 400 }
      );
    }
    
    // Prepare data structure
    const data = {
      notifications,
      metadata: {
        lastUpdated: new Date().toISOString(),
        version: metadata?.version || '1.0',
        updatedBy: metadata?.updatedBy || 'admin'
      }
    };
    
    // Write to file
    const filePath = path.join(process.cwd(), 'content', 'notifications.json');
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
    
    return NextResponse.json({
      success: true,
      message: 'Notifications saved successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error saving notifications:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save notifications' },
      { status: 500 }
    );
  }
}
