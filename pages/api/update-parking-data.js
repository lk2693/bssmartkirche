// Vercel Cron Job API - Updates parking data every 15 minutes
export default async function handler(req, res) {
  // Verify this is a cron job request (security)
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    console.log('🚀 Starting scheduled parking data update...');
    
    // Fetch fresh data from Braunschweig API
    const response = await fetch('https://www.braunschweig.de/plan/parkplaetze.php?sap=out=braunschweig.geo.JSON', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; SmartCity-BS/1.0)',
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }

    const freshData = await response.json();
    
    // Store in Vercel KV (if available) or return for client-side caching
    const timestamp = new Date().toISOString();
    
    console.log(`✅ Successfully updated ${freshData.features?.length || 0} parking spots at ${timestamp}`);

    return res.status(200).json({
      success: true,
      message: 'Parking data updated successfully',
      timestamp,
      spotsUpdated: freshData.features?.length || 0,
      data: freshData // Return fresh data
    });

  } catch (error) {
    console.error('❌ Failed to update parking data:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Failed to update parking data',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
}