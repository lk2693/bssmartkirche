import { NextApiRequest, NextApiResponse } from 'next';

const revalidate = 60 * 60; // 1h

const urls = (process.env.PARK_GEOJSON_URLS ?? "https://www.braunschweig.de/apps/pulp/result/parkhaeuser.geojson")
  .split(",")
  .map(s => s.trim())
  .filter(Boolean);

console.log('🔧 Environment PARK_GEOJSON_URLS:', process.env.PARK_GEOJSON_URLS);
console.log('🔧 Parsed URLs:', urls);

type GeoJSON = {
  type: "FeatureCollection";
  features: Array<{
    type: "Feature";
    id?: string | number;
    geometry: { type: "Point"; coordinates: [number, number] };
    properties: Record<string, any>;
  }>;
};

type ParkingItem = {
  id: string;
  name: string | null;
  kind: "parkhaus" | "parkplatz" | "busparkplatz" | "unknown";
  lon: number;
  lat: number;
  raw?: Record<string, any>;
};

function inferKind(p: Record<string, any>): ParkingItem["kind"] {
  const s = `${p.mapsightIconId ?? ""} ${p.type ?? ""}`.toLowerCase();
  if (s.includes("parkhaus")) return "parkhaus";
  if (s.includes("parkplatz")) return "parkplatz";
  if (s.includes("bus")) return "busparkplatz";
  return "unknown";
}

async function fetchGeo(u: string): Promise<GeoJSON | null> {
  try {
    console.log(`🌐 Fetching GeoJSON from: ${u}`);
    const res = await fetch(u, {
      // Falls die Quelle einen Referer erwartet:
      headers: process.env.PARK_REFERER ? { referer: process.env.PARK_REFERER } : undefined,
    });
    
    if (!res.ok) {
      console.log(`❌ GeoJSON fetch failed: ${res.status} ${res.statusText}`);
      return null;
    }
    
    const data = await res.json() as GeoJSON;
    console.log(`✅ GeoJSON fetched successfully: ${data.features?.length || 0} features`);
    return data;
  } catch (error) {
    console.error(`❌ GeoJSON fetch error for ${u}:`, error);
    return null;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  console.log('🚀 Parking GeoJSON API called');
  console.log('📍 Configured URLs:', urls);
  
  if (!urls.length) {
    console.log('⚠️ No URLs configured in PARK_GEOJSON_URLS');
    return res.status(200).json({ items: [], count: 0, reason: "No URLs configured" });
  }

  try {
    const geos = await Promise.all(urls.map(fetchGeo));
    const items: ParkingItem[] = [];

    for (const geo of geos) {
      if (!geo) continue;
      for (const f of geo.features ?? []) {
        const [lon, lat] = f.geometry?.coordinates ?? [NaN, NaN];
        const item: ParkingItem = {
          id: String(f.id ?? f.properties?.id ?? f.properties?.externalId ?? Date.now() + Math.random()),
          name: f.properties?.name ?? f.properties?.title ?? f.properties?.tooltip ?? null,
          kind: inferKind(f.properties ?? {}),
          lon,
          lat,
          raw: f.properties ?? {},
        };
        items.push(item);
      }
    }

    // einfache Deduplizierung nach id
    const dedup = new Map(items.map(i => [i.id, i]));
    const result = [...dedup.values()];
    
    console.log(`📊 Processed ${items.length} items, ${result.length} unique after deduplication`);
    console.log(`📍 Sample items:`, result.slice(0, 3).map(i => ({ id: i.id, name: i.name, kind: i.kind })));
    
    // Set cache headers
    res.setHeader('Cache-Control', `public, s-maxage=${revalidate}, stale-while-revalidate=86400`);
    
    return res.status(200).json({
      success: true,
      updatedAt: new Date().toISOString(), 
      count: dedup.size, 
      items: result,
      source: 'geojson-api',
      urls: urls
    });

  } catch (error) {
    console.error('❌ GeoJSON API error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}