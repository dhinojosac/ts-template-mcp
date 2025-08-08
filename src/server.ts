import Fastify, { FastifyRequest, FastifyReply, FastifyError } from 'fastify';
import cors from '@fastify/cors';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import helloPlugin from './plugins/helloPlugin.js';
import { NameSchema } from './schemas/commonSchemas.js';
import { z } from 'zod';
import { registerWeatherTools } from './plugins/weatherPlugin.js';

/**
 * Creates and configures the MCP Server with tools and resources
 * Using current SDK version compatible methods with official best practices
 * @returns Configured MCP Server instance
 */
function createMCPServer(): McpServer {
  const server = new McpServer({
    name: 'ts-template-mcp-server',
    version: '1.0.0',
  });

  // Register the sayHello tool with proper parameter schema
  server.registerTool(
    'sayHello',
    {
      title: 'Say Hello',
      description: 'Says hello to a person by name',
      inputSchema: {
        name: NameSchema,
      },
    },
    async ({ name }: { name: string }) => ({
      content: [
        {
          type: 'text',
          text: `Hello, ${name}!`,
        },
      ],
    })
  );

  server.registerTool(
    'calculate',
    {
      title: 'Calculate',
      description:
        'Performs basic arithmetic calculations (add, subtract, multiply, divide)',
      inputSchema: {
        a: z.number(),
        b: z.number(),
        operation: z.enum(['add', 'subtract', 'multiply', 'divide']),
      },
    },
    async ({
      operation,
      a,
      b,
    }: {
      operation: string;
      a: number;
      b: number;
    }) => {
      let result: number;
      switch (operation) {
        case 'add':
          result = a + b;
          break;
        case 'subtract':
          result = a - b;
          break;
        case 'multiply':
          result = a * b;
          break;
        case 'divide':
          if (b === 0) {
            throw new Error('Division by zero is not allowed');
          }
          result = a / b;
          break;
        default:
          throw new Error(
            `Unknown operation: ${operation}. Supported: add, subtract, multiply, divide`
          );
      }

      return {
        content: [
          {
            type: 'text',
            text: `${a} ${operation} ${b} = ${result}`,
          },
        ],
      };
    }
  );

  registerWeatherTools(server);

  return server;
}

/**
 * Sets up and starts the Fastify server with MCP integration
 * Following official SDK patterns for session management where possible
 */
async function startServer() {
  const fastify = Fastify({
    logger: {
      level: 'info',
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
        },
      },
    },
  });

  // Enhanced CORS for MCP
  await fastify.register(cors, {
    origin: true, // More flexible than '*'
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Mcp-Session-Id', // Required MCP header
      'Cache-Control',
      'Accept',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD'],
  });

  // Register the hello plugin
  await fastify.register(helloPlugin);

  // Create MCP server instance
  const mcpServer = createMCPServer();

  // Session storage for better transport management (following official patterns)
  const sessions = new Map<string, StreamableHTTPServerTransport>();

  // MCP endpoint with proper session management
  fastify.all('/mcp', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      // Get or create session ID (following official patterns)
      const sessionId =
        (request.headers['mcp-session-id'] as string) ||
        `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      let transport = sessions.get(sessionId);

      if (!transport) {
        // Create new transport for this session
        transport = new StreamableHTTPServerTransport({
          sessionIdGenerator: () => sessionId,
        });

        // Connect MCP server to transport
        await mcpServer.connect(transport);
        sessions.set(sessionId, transport);

        fastify.log.info(`Created new MCP session: ${sessionId}`);
      }

      // Handle the request
      await transport.handleRequest(request.raw, reply.raw, request.body);
    } catch (error) {
      fastify.log.error('MCP request error:', error);

      if (!reply.sent) {
        reply.status(500).send({
          error: 'Internal MCP server error',
          message: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }
  });

  // Enhanced health check
  fastify.get('/health', async () => {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      server: 'ts-template-mcp-server',
      version: '1.0.0',
      uptime: process.uptime(),
      sessions: sessions.size,
      capabilities: ['tools', 'resources'],
    };
  });

  // Server info endpoint
  fastify.get('/info', async () => {
    return {
      name: 'ts-template-mcp-server',
      version: '1.0.0',
      description:
        'A TypeScript MCP server template following official SDK best practices',
      endpoints: {
        mcp: '/mcp',
        health: '/health',
        hello: '/hello/:name',
      },
      capabilities: ['tools', 'resources'],
      transport: 'StreamableHTTP',
      sdkVersion: '@modelcontextprotocol/sdk ^1.0.4',
    };
  });

  // Enhanced error handler
  fastify.setErrorHandler(
    async (
      error: FastifyError,
      request: FastifyRequest,
      reply: FastifyReply
    ) => {
      fastify.log.error(
        {
          error: error.message,
          stack: error.stack,
          url: request.url,
          method: request.method,
        },
        'Request error'
      );

      const statusCode = error.statusCode || 500;

      return reply.status(statusCode).send({
        error: error.message || 'Internal Server Error',
        statusCode,
        timestamp: new Date().toISOString(),
      });
    }
  );

  // Graceful shutdown handler
  fastify.addHook('onClose', async () => {
    fastify.log.info('Cleaning up MCP sessions...');
    sessions.clear();
  });

  try {
    const address = await fastify.listen({
      port: 3000,
      host: '0.0.0.0',
    });

    fastify.log.info(`MCP Server ready at ${address}`);
    fastify.log.info('MCP endpoint: /mcp');
    fastify.log.info('Hello endpoint: /hello/:name');
    fastify.log.info('Health check: /health');
    fastify.log.info('Server info: /info');
  } catch (err) {
    fastify.log.error('Error starting server:', err);
    process.exit(1);
  }
}

// Enhanced graceful shutdown
const gracefulShutdown = (signal: string) => {
  console.log(`\nReceived ${signal}, shutting down gracefully...`);
  process.exit(0);
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

// Check if running in STDIO mode (for CLI clients like Claude Desktop)
const isStdioMode =
  process.argv.includes('--stdio') || process.env['MCP_STDIO'] === 'true';

if (isStdioMode) {
  // STDIO mode for CLI clients (following Node.js quickstart pattern)
  const mcpServer = createMCPServer();
  const transport = new StdioServerTransport();

  mcpServer.connect(transport).catch(err => {
    console.error('Failed to start STDIO server:', err);
    process.exit(1);
  });

  console.error('MCP Server running in STDIO mode');
} else {
  // HTTP mode for web clients
  startServer().catch(err => {
    console.error('Failed to start HTTP server:');
    console.error(err);
    if (err.stack) {
      console.error('Stack trace:');
      console.error(err.stack);
    }
    process.exit(1);
  });
}
