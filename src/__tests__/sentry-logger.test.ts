import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SentryLogger } from '../sentry-logger';
import * as Sentry from '@sentry/node';

// Mock all Sentry functions
vi.mock('@sentry/node');

const mockInit = vi.fn();
const mockCaptureMessage = vi.fn();
const mockCaptureException = vi.fn();
const mockFlush = vi.fn().mockResolvedValue(true);
const mockClose = vi.fn().mockResolvedValue(true);

// Setup mock implementations
vi.mocked(Sentry.init).mockImplementation(mockInit);
vi.mocked(Sentry.captureMessage).mockImplementation(mockCaptureMessage);
vi.mocked(Sentry.captureException).mockImplementation(mockCaptureException);
vi.mocked(Sentry.flush).mockImplementation(mockFlush);
vi.mocked(Sentry.close).mockImplementation(mockClose);

describe('SentryLogger', () => {
  let logger: SentryLogger;
  const mockOptions = {
    serviceName: 'test-service',
    dsn: 'test-dsn',
    envName: 'test'
  };

  beforeEach(() => {
    vi.clearAllMocks();
    logger = new SentryLogger(mockOptions);
  });

  it('should initialize Sentry with the provided options', () => {
    expect(mockInit).toHaveBeenCalledWith({
      dsn: mockOptions.dsn,
      environment: mockOptions.envName
    });
  });

  it('should log messages', () => {
    const message = 'Test message';
    const data = { key: 'value' };
    
    logger.log(message, data);
    
    expect(mockCaptureMessage).toHaveBeenCalledWith(message, {
      level: 'info',
      extra: data,
      tags: {
        service: mockOptions.serviceName
      }
    });
  });

  it('should log errors', () => {
    const message = 'Error message';
    const error = new Error('Test error');
    const data = { key: 'value' };
    
    logger.error(message, error, data);
    
    expect(mockCaptureException).toHaveBeenCalledWith(error, {
      level: 'error',
      extra: {
        custom_message: message,
        ...data
      },
      tags: {
        service: mockOptions.serviceName
      }
    });
  });

  it('should close the Sentry client', async () => {
    await logger.close();
    
    expect(mockFlush).toHaveBeenCalled();
    expect(mockClose).toHaveBeenCalled();
  });

  it('should handle Sentry initialization errors', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    // Force Sentry.init to throw an error
    mockInit.mockImplementationOnce(() => {
      throw new Error('Initialization failed');
    });
    
    // Create a new logger that will fail to initialize Sentry
    const failingLogger = new SentryLogger(mockOptions);
    
    // Should still be able to log without errors
    expect(() => {
      failingLogger.log('Test message');
    }).not.toThrow();
    
    consoleErrorSpy.mockRestore();
  });
});
