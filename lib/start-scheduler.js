import parkingScheduler from './parking-scheduler.js';

// Starte den Parking Data Scheduler
console.log('🚀 Starting Parking Data Scheduler...');
parkingScheduler.startScheduler();

// Keep the process alive
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down Parking Data Scheduler...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n👋 Gracefully shutting down Parking Data Scheduler...');
  process.exit(0);
});