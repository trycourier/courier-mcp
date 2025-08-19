export type TextContent = {
  content: {
    type: 'text';
    text: string;
  }[];
};

export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
}

export function parseLogLevel(level: string | undefined): LogLevel {
  if (!level) return LogLevel.ERROR; // Default to ERROR for minimal logging in production

  const upperLevel = level.toUpperCase();
  switch (upperLevel) {
    case 'ERROR':
      return LogLevel.ERROR;
    case 'WARN':
    case 'WARNING':
      return LogLevel.WARN;
    case 'INFO':
      return LogLevel.INFO;
    case 'DEBUG':
      return LogLevel.DEBUG;
    default:
      return LogLevel.ERROR;
  }
}
