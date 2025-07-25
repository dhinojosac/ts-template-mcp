import pino from 'pino';

export interface LoggerConfig {
  level: string;
  pretty: boolean;
  enabled: boolean;
}

export function createLogger(
  config: LoggerConfig = {
    level: process.env['LOG_LEVEL'] || 'info',
    pretty: process.env['LOG_PRETTY'] === 'true',
    enabled: process.env['NODE_ENV'] !== 'test',
  }
) {
  const baseConfig = {
    level: config.level,
    enabled: config.enabled,
    timestamp: pino.stdTimeFunctions.isoTime,
    formatters: {
      level: (label: string) => {
        return { level: label };
      },
    },
  };

  if (config.pretty && process.env['NODE_ENV'] === 'development') {
    return pino({
      ...baseConfig,
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname',
        },
      },
    });
  }

  return pino(baseConfig);
}

export const logger = createLogger();

export function logRequest(request: any, response: any, responseTime: number) {
  logger.info(
    {
      method: request.method,
      url: request.url,
      statusCode: response.statusCode,
      responseTime,
      userAgent: request.headers['user-agent'],
      ip: request.ip,
    },
    'Request completed'
  );
}

export function logError(error: Error, context?: Record<string, any>) {
  logger.error(
    {
      error: error.message,
      stack: error.stack,
      ...context,
    },
    'Error occurred'
  );
}

export function logMCPRequest(method: string, params: any, sessionId?: string) {
  logger.info(
    {
      mcpMethod: method,
      sessionId,
      params: JSON.stringify(params),
    },
    'MCP request received'
  );
}

export function logMCPSession(
  sessionId: string,
  action: 'created' | 'destroyed'
) {
  logger.info(
    {
      sessionId,
      action,
    },
    `MCP session ${action}`
  );
}
