import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { ZodError } from 'zod';

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
  details?: any;
}

export class ValidationError extends Error implements AppError {
  public statusCode = 400;
  public code = 'VALIDATION_ERROR';
  public details: any;

  constructor(message: string, details?: any) {
    super(message);
    this.name = 'ValidationError';
    this.details = details;
  }
}

export class MCPError extends Error implements AppError {
  public statusCode = 500;
  public code = 'MCP_ERROR';
  public details: any;

  constructor(message: string, details?: any) {
    super(message);
    this.name = 'MCPError';
    this.details = details;
  }
}

export function handleError(
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { log } = request.server;

  // Log the error
  log.error(
    {
      error: error.message,
      stack: error.stack,
      url: request.url,
      method: request.method,
      headers: request.headers,
      body: request.body,
    },
    'Request error'
  );

  // Handle different types of errors
  if (error instanceof ZodError) {
    return reply.status(400).send({
      error: 'Validation Error',
      message: 'Invalid request data',
      details: error.errors,
      statusCode: 400,
      timestamp: new Date().toISOString(),
    });
  }

  if (error instanceof ValidationError) {
    return reply.status(error.statusCode).send({
      error: error.name,
      message: error.message,
      details: error.details,
      statusCode: error.statusCode,
      timestamp: new Date().toISOString(),
    });
  }

  if (error instanceof MCPError) {
    return reply.status(error.statusCode).send({
      error: error.name,
      message: error.message,
      details: error.details,
      statusCode: error.statusCode,
      timestamp: new Date().toISOString(),
    });
  }

  // Handle MCP-specific errors
  if (error.message.includes('MCP')) {
    return reply.status(500).send({
      error: 'MCP Server Error',
      message: error.message,
      statusCode: 500,
      timestamp: new Date().toISOString(),
    });
  }

  // Default error response
  const statusCode = error.statusCode || 500;

  return reply.status(statusCode).send({
    error: error.message || 'Internal Server Error',
    statusCode,
    timestamp: new Date().toISOString(),
    ...(process.env['NODE_ENV'] === 'development' && { stack: error.stack }),
  });
}

export function createError(
  message: string,
  statusCode: number = 500,
  code?: string
): AppError {
  const error = new Error(message) as AppError;
  error.statusCode = statusCode;
  if (code) {
    error.code = code;
  }
  return error;
}

export function validateAndThrow(
  data: any,
  schema: any,
  message: string = 'Validation failed'
) {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new ValidationError(message, error.errors);
    }
    throw error;
  }
}
