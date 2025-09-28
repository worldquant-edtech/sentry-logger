// Import Sentry
import * as Sentry from '@sentry/node';

// Create a type-safe reference to the Sentry instance
const SentryInstance = Sentry;

export class SentryLogger {
  constructor(options: { dsn: string; env: string }) {
    try {
      SentryInstance.init({
        dsn: options.dsn,
        environment: options.env || 'development',
        enableLogs: true,
      });
    } catch (error) {
      console.error('Failed to initialize Sentry:', error);
    }
  }

  trace(message: string, data?: Record<string, unknown>): void {
    if (SentryInstance.isInitialized()) {
      try {
        SentryInstance.logger.trace(message, data);
      } catch (error) {
        console.error('Failed to send trace to Sentry:', error);
      }
    } else {
      console.log(message, data);
    }
  }

  debug(message: string, data?: Record<string, unknown>): void {
    if (SentryInstance.isInitialized()) {
      try {
        SentryInstance.logger.debug(message, data);
      } catch (error) {
        console.error('Failed to send debug to Sentry:', error);
      }
    } else {
      console.log(message, data);
    }
  }

  log(message: string, data?: Record<string, unknown>): void {
    if (SentryInstance.isInitialized()) {
      try {
        SentryInstance.logger.info(message, data);
      } catch (error) {
        console.error('Failed to send log to Sentry:', error);
      }
    } else {
      console.log(message, data);
    }
  }

  warn(message: string, data?: Record<string, unknown>): void {
    if (SentryInstance.isInitialized()) {
      try {
        SentryInstance.logger.warn(message, data);
      } catch (error) {
        console.error('Failed to send warning to Sentry:', error);
      }
    } else {
      console.warn(message, data);
    }
  }

  info(message: string, data?: Record<string, unknown>): void {
    if (SentryInstance.isInitialized()) {
      try {
        SentryInstance.logger.info(message, data);
      } catch (error) {
        console.error('Failed to send info to Sentry:', error);
      }
    } else {
      console.info(message, data);
    }
  }

  error(message: string, data?: Record<string, unknown>): void {
    if (SentryInstance.isInitialized()) {
      try {
        const extra = data ? { custom_message: message, ...data } : { custom_message: message };
        SentryInstance.logger.error(message, extra);
      } catch (sentryError) {
        console.error('Failed to send error to Sentry:', sentryError);
      }
    } else {
      console.error(message, data);
    }
  }

  fatal(message: string, data?: Record<string, unknown>): void {
    if (SentryInstance.isInitialized()) {
      try {
        const extra = data ? { custom_message: message, ...data } : { custom_message: message };
        SentryInstance.logger.fatal(message, extra);
      } catch (sentryError) {
        console.error('Failed to send fatal error to Sentry:', sentryError);
      }
    } else {
      console.error(message, data);
    }
  }

  /**
   * Call this method before the application shuts down to ensure all events are flushed
   * and the Sentry client is properly closed.
   */
  async close(timeout = 2000): Promise<boolean> {
    if (!SentryInstance.isInitialized()) {
      return true;
    }

    try {
      // Flush any pending events
      await SentryInstance.flush(timeout);
      // Close the client if possible
      if (typeof SentryInstance.close === 'function') {
        await SentryInstance.close(timeout);
      }
      return true;
    } catch (error) {
      console.error('Error while closing Sentry client:', error);
      return false;
    }
  }
}
