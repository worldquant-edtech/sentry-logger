import { SentryLogger } from '../src/sentry-logger';

// Initialize the logger
const logger = new SentryLogger({
  serviceName: 'example-service',
  dsn: process.env.SENTRY_DSN || 'your-sentry-dsn-here',
  env: process.env.NODE_ENV || 'development'
});

// Log some messages
logger.log('Application started', { version: '1.0.0' });

// Simulate an error
try {
  // This will throw an error
  const result = JSON.parse('invalid json');
  console.log(result);
} catch (error) {
  if (error instanceof Error) {
    logger.error('Failed to parse JSON', {
      error: error,
      context: 'example',
      timestamp: new Date().toISOString()
    });
  } else {
    logger.error('An unknown error occurred', {
      error: error,
      context: 'example',
      timestamp: new Date().toISOString()
    });
  }
}

// Close the logger when done (e.g., when shutting down the application)
async function shutdown() {
  console.log('Shutting down...');
  const success = await logger.close(2000);
  console.log(`Logger closed ${success ? 'successfully' : 'with errors'}`);  
  process.exit(0);
}

// Handle shutdown signals
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

// For demonstration purposes, we'll automatically shut down after a delay
setTimeout(shutdown, 5000);

console.log('Example is running. Press Ctrl+C to exit immediately.');
