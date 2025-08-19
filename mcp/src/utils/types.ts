export type TextContent = {
  content: {
    type: 'text';
    text: string;
  }[];
};

export enum CourierMcpLogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
}
