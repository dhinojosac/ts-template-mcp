export const SERVER_CONFIG = {
  NAME: 'ts-template-mcp-server',
  VERSION: '1.0.0',
  PORT: parseInt(process.env['PORT'] || '3000', 10),
  HOST: process.env['HOST'] || '0.0.0.0',
  NODE_ENV: process.env['NODE_ENV'] || 'development',
} as const;

export const MCP_CONFIG = {
  STDIO_MODE: process.env['MCP_STDIO'] === 'true',
  SESSION_TIMEOUT: parseInt(process.env['MCP_SESSION_TIMEOUT'] || '300000', 10),
  DEFAULT_SESSION_ID: 'default-session',
} as const;

export const LOGGING_CONFIG = {
  LEVEL: process.env['LOG_LEVEL'] || 'info',
  PRETTY: process.env['LOG_PRETTY'] === 'true',
  ENABLED: process.env['NODE_ENV'] !== 'test',
} as const;

export const CORS_CONFIG = {
  ORIGIN: process.env['CORS_ORIGIN'] === 'true' ? true : process.env['CORS_ORIGIN'] || '*',
  CREDENTIALS: process.env['CORS_CREDENTIALS'] === 'true',
  ALLOWED_HEADERS: [
    'Content-Type',
    'Authorization',
    'Mcp-Session-Id',
    'Cache-Control',
    'Accept',
    'X-Requested-With',
  ],
  ALLOWED_METHODS: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD', 'PATCH'],
} as const;

export const WEATHER_CONFIG = {
  API_KEY: process.env['WEATHER_API_KEY'] || '',
  BASE_URL: process.env['WEATHER_BASE_URL'] || 'https://api.weatherapi.com/v1',
  TIMEOUT: 10000,
} as const;

export const API_ENDPOINTS = {
  MCP: '/mcp',
  HEALTH: '/health',
  INFO: '/info',
  HELLO: '/hello/:name',
  WEATHER_FORECAST: '/weather/forecast',
  WEATHER_ALERTS: '/weather/alerts/:state',
} as const;

export const MCP_URIS = {
  SERVER_INFO: 'mcp://server-info',
  HELLO_MESSAGE: 'mcp://hello-message',
} as const;

export const ERROR_MESSAGES = {
  INVALID_SESSION: 'Invalid or missing session ID',
  TOOL_NOT_FOUND: 'Tool not found',
  RESOURCE_NOT_FOUND: 'Resource not found',
  VALIDATION_ERROR: 'Validation error',
  INTERNAL_ERROR: 'Internal server error',
  MCP_ERROR: 'MCP protocol error',
} as const;

export const SUCCESS_MESSAGES = {
  SERVER_STARTED: 'MCP Server ready at',
  SESSION_CREATED: 'MCP session created',
  SESSION_DESTROYED: 'MCP session destroyed',
  TOOL_EXECUTED: 'Tool executed successfully',
  RESOURCE_READ: 'Resource read successfully',
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

export const MCP_METHODS = {
  TOOLS_LIST: 'tools/list',
  TOOLS_CALL: 'tools/call',
  RESOURCES_LIST: 'resources/list',
  RESOURCES_READ: 'resources/read',
  PROMPTS_LIST: 'prompts/list',
  PROMPTS_GET: 'prompts/get',
} as const; 