# Sentry Logger

A TypeScript wrapper for Sentry logging with CommonJS and ESM support.

## Features

- Simple and consistent Sentry logging interface
- Support for both ESM and CommonJS modules
- Support for all Sentry log levels (trace, debug, info, warning, error, fatal)

## Installation

```bash
npm install @wqlearning/sentry-logger
# or
yarn add @wqlearning/sentry-logger
```

## Usage

### Basic Usage

```typescript
import { SentryLogger } from '@wqlearning/sentry-logger';

// Initialize the logger
const logger = new SentryLogger({
  serviceName: 'my-service',
  dsn: 'your-sentry-dsn',
  env: 'development'
});

// Log messages
logger.log('Application started');

try {
  // Your application code
  throw new Error('Something went wrong');
} catch (error) {
  // Log errors
  logger.error('An error occurred', error, { additional: 'data' });
}

// Before shutting down your application
await logger.close();
```

### CommonJS Usage

```js

const { SentryLogger } = require('./../sentry-logger/dist/cjs/index.cjs')

const logger = new SentryLogger({
    dsn: 'your@sentry-dsn/project',
    envName: 'development',
    serviceName: 'test-service'
})

logger.log('test', { message: 'test' })
```

### API

#### `new SentryLogger({ serviceName: string; dsn: string; env: string })`

Creates a new logger instance.

- `serviceName`: The name of your service (used in logs)
  - `dsn`: Your Sentry DSN (Data Source Name)
  - `env`: Environment name (e.g., 'development', 'production')

#### `info(message: string, data?: Record<string, unknown>): void`

or

#### `log(message: string, data?: Record<string, unknown>): void`

Logs an informational message.

- `message`: The message to log
- `data`: Optional additional data to include in the log entry

#### `error(message: string, data?: Record<string, unknown>): void`

Logs an error.

- `message`: The error message
- `data`: Optional additional data to include with the error

#### `warn(message: string, data?: Record<string, unknown>): void`

Logs a warning.

- `message`: The warning message
- `data`: Optional additional data to include with the warning

#### `close(timeout = 2000): Promise<boolean>`

Closes the Sentry client and flushes any pending events.

- `timeout`: Maximum time to wait for events to be sent (in milliseconds)
- Returns: `true` if closed successfully, `false` otherwise

## Development

### Building

```bash
npm run build
```

### Testing

```bash
npm test
```

### Publishing

1. Update the version in `package.json`
2. Commit and push changes
3. Create a new release tag
4. Run `npm publish`

## License

ISC

## Notes

This library was primarily created for internal use to provide a consistent logging interface for Sentry logging, especially for CommonJS modules.

Sentry is a registered trademark of Functional Software, Inc.

Current library is not related to Sentry service or Functional Software, Inc in any way.
