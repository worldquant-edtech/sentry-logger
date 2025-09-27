// Import Sentry
import * as Sentry from "@sentry/node";

// Create a type-safe reference to the Sentry instance
const SentryInstance = Sentry;

export class SentryLogger {
  private serviceName: string;
  private isSentryInitialized: boolean = false;

  constructor(options: { serviceName: string; dsn: string; env: string }) {
    this.serviceName = options.serviceName;
    try {
        SentryInstance.init({
        dsn: options.dsn,
        environment: options.env || "development",
        enableLogs: true,
      });
      this.isSentryInitialized = true;
    } catch (error) {
      console.error("Failed to initialize Sentry:", error);
      this.isSentryInitialized = false;
    }
  }

  log(message: string, data?: Record<string, unknown>): void {
    if (this.isSentryInitialized) {
      try {
        SentryInstance.logger.info(message, data);
      } catch (error) {
        console.error("Failed to send log to Sentry:", error);
      }
    }

    const logEntry = {
      timestamp: new Date().toISOString(),
      service: this.serviceName,
      level: "info",
      message,
      ...(data && { data }),
    };

    console.log(JSON.stringify(logEntry));
  }

  error(message: string, error: Error, data?: Record<string, unknown>): void {
    if (this.isSentryInitialized) {
      try {
        // Set context for the error
        const extra = data
          ? { custom_message: message, ...data }
          : { custom_message: message };

        // Capture the exception with proper context
        SentryInstance.logger.error(message, {
            extra, error
        });
      } catch (sentryError) {
        console.error("Failed to send error to Sentry:", sentryError);
      }
    }

    const logEntry = {
      timestamp: new Date().toISOString(),
      service: this.serviceName,
      level: "error",
      message,
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
      ...(data && { data }),
    };

    console.error(JSON.stringify(logEntry));
  }

  /**
   * Call this method before the application shuts down to ensure all events are flushed
   * and the Sentry client is properly closed.
   */
  async close(timeout = 2000): Promise<boolean> {
    if (!this.isSentryInitialized) {
      return true;
    }

    try {
      // Flush any pending events
      await SentryInstance.flush(timeout);
      // Close the client if possible
      if (typeof SentryInstance.close === "function") {
        await SentryInstance.close(timeout);
      }
      this.isSentryInitialized = false;
      return true;
    } catch (error) {
      console.error("Error while closing Sentry client:", error);
      return false;
    }
  }
}
