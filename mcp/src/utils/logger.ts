import { CourierClientOptions } from "../client/courier-client.js";
import { CourierMcpLogLevel } from "./types.js";

export class CourierMcpLogger {

  private readonly options: CourierClientOptions;

  constructor(options: CourierClientOptions) {
    this.options = options;
  }

  private shouldLog(level: CourierMcpLogLevel): boolean {
    return level <= this.options.logLevel;
  }

  private formatMessage(level: string, message: string): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level}] ${message}`;
  }

  error(message: string) {
    if (this.shouldLog(CourierMcpLogLevel.ERROR)) {
      console.error(this.formatMessage('ERROR', message));
    }
  }

  warn(message: string) {
    if (this.shouldLog(CourierMcpLogLevel.WARN)) {
      console.warn(this.formatMessage('WARN', message));
    }
  }

  info(message: string) {
    if (this.shouldLog(CourierMcpLogLevel.INFO)) {
      console.info(this.formatMessage('INFO', message));
    }
  }

  debug(message: string) {
    if (this.shouldLog(CourierMcpLogLevel.DEBUG)) {
      console.debug(this.formatMessage('DEBUG', message));
    }
  }
}