import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SentryLogger } from '../sentry-logger';
import * as Sentry from '@sentry/node';

// Mock all Sentry functions
vi.mock('@sentry/node');

const mockInit = vi.fn();
const mockLogger = {
  trace: vi.fn(),
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
  fatal: vi.fn()
};
const mockFlush = vi.fn().mockResolvedValue(true);
const mockClose = vi.fn().mockResolvedValue(true);

// Setup mock implementations
vi.mocked(Sentry.init).mockImplementation(mockInit);
// @ts-expect-error - Mock the Sentry logger
vi.mocked(Sentry).logger = mockLogger;
vi.mocked(Sentry.flush).mockImplementation(mockFlush);
vi.mocked(Sentry.close).mockImplementation(mockClose);

describe('SentryLogger', () => {
  let logger: SentryLogger;
  const mockOptions = {
    dsn: 'test-dsn',
    env: 'test'
  };

  beforeEach(() => {
    vi.clearAllMocks();
    logger = new SentryLogger(mockOptions);
  });

  it('should initialize Sentry with the provided options', () => {
    expect(mockInit).toHaveBeenCalledWith({
      dsn: mockOptions.dsn,
      environment: mockOptions.env,
      enableLogs: true
    });
  });

  it('should log trace messages', () => {
    const message = 'Trace message';
    const data = { key: 'value' };
    
    logger.trace(message, data);
    
    expect(mockLogger.trace).toHaveBeenCalledWith(message, data);
  });

  it('should log debug messages', () => {
    const message = 'Debug message';
    const data = { key: 'value' };
    
    logger.debug(message, data);
    
    expect(mockLogger.debug).toHaveBeenCalledWith(message, data);
  });

  it('should log info messages', () => {
    const message = 'Info message';
    const data = { key: 'value' };
    
    logger.log(message, data);
    
    expect(mockLogger.info).toHaveBeenCalledWith(message, data);
  });

  it('should log warning messages', () => {
    const message = 'Warning message';
    const data = { key: 'value' };
    
    logger.warn(message, data);
    
    expect(mockLogger.warn).toHaveBeenCalledWith(message, data);
  });

  it('should log error messages', () => {
    const message = 'Error message';
    const data = { key: 'value', error: new Error('Test error') };
    
    logger.error(message, data);
    
    expect(mockLogger.error).toHaveBeenCalledWith(message, {
      custom_message: message,
      ...data
    });
  });

  it('should log fatal messages', () => {
    const message = 'Fatal message';
    const data = { key: 'value', error: new Error('Fatal error') };
    
    logger.fatal(message, data);
    
    expect(mockLogger.fatal).toHaveBeenCalledWith(message, {
      custom_message: message,
      ...data
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
