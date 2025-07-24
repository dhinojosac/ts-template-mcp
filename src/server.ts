import Fastify, { FastifyRequest, FastifyReply, FastifyError } from 'fastify';
import cors from '@fastify/cors';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import helloPlugin from './plugins/helloPlugin.js';

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

  // Register the sayHello tool using current SDK approach
  server.registerTool(
    'sayHello',
    {
      title: 'Say Hello',
      description: 'Says hello to a person by name'
    },
    async (args: { [x: string]: any }) => {
      const { name } = args;
      if (!name || typeof name !== 'string') {
        throw new Error("Name parameter is required and must be a string");
      }
      return {
        content: [
          {
            type: 'text',
            text: `Hello, ${name}! 🎉`
          }
        ]
      };
    }
  );

  // Register the calculate tool using current SDK approach
  server.registerTool(
    'calculate',
    {
      title: 'Calculate',
      description: 'Performs basic arithmetic calculations (add, subtract, multiply, divide)'
    },
    async (args: { [x: string]: any }) => {
      const { operation, a, b } = args;
      if (!operation || typeof a !== 'number' || typeof b !== 'number') {
        throw new Error("Invalid parameters for calculation. Need operation (string), a (number), b (number)");
      }

      let result: number;
      switch (operation) {
        case "add":
          result = a + b;
          break;
        case "subtract":
          result = a - b;
          break;
        case "multiply":
          result = a * b;
          break;
        case "divide":
          if (b === 0) throw new Error("Division by zero is not allowed");
          result = a / b;
          break;
        default:
          throw new Error(`Unknown operation: ${operation}. Supported: add, subtract, multiply, divide`);
      }

      return {
        content: [
          {
            type: "text",
            text: `${a} ${operation} ${b} = ${result}`
          }
        ]
      };
    }
  );

  // Register server info resource using current SDK approach
  server.registerResource(
    'server-info',
    'mcp://server-info',
    {
      title: 'Server Information',
      description: 'Information about this MCP server',
      mimeType: 'application/json'
    },
    async (uri) => {
      return {
        contents: [
          {
            uri: uri.href,
            mimeType: 'application/json',
            text: JSON.stringify({
              name: "ts-template-mcp-server",
              version: "1.0.0",
              description: "A TypeScript MCP server template with basic tools and resources",
              capabilities: ["tools", "resources"],
              author: "Your Name",
              created: new Date().toISOString(),
              transport: "StreamableHTTP",
              tools: [
                {
                  name: "sayHello",
                  description: "Says hello to a person by name",
                  parameters: "{ name: string }"
                },
                {
                  name: "calculate",
                  description: "Performs basic arithmetic calculations",
                  parameters: "{ operation: 'add'|'subtract'|'multiply'|'divide', a: number, b: number }"
                }
              ]
            }, null, 2)
          }
        ]
      };
    }
  );

  // Register hello message resource using current SDK approach
  server.registerResource(
    'hello-message',
    'mcp://hello-message',
    {
      title: 'Hello Message',
      description: 'A simple hello message resource',
      mimeType: 'text/plain'
    },
    async (uri) => {
      return {
        contents: [
          {
            uri: uri.href,
            mimeType: 'text/plain',
            text: 'Hello from the MCP TypeScript Server! 🚀\n\nThis is a resource that can be read by MCP clients.\n\nThis server follows best practices from the official MCP TypeScript SDK.\n\nAvailable tools:\n- sayHello: { name: string }\n- calculate: { operation: string, a: number, b: number }'
          }
        ]
      };
    }
  );

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
          colorize: true
        }
      }
    }
  });

  // Enhanced CORS for MCP
  await fastify.register(cors, {
    origin: true, // More flexible than '*'
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Mcp-Session-Id', // Required MCP header
      'Cache-Control',
      'Accept'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD']
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
      const sessionId = request.headers['mcp-session-id'] as string || 
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
          message: error instanceof Error ? error.message : 'Unknown error'
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
      capabilities: ['tools', 'resources']
    };
  });

  // Server info endpoint
  fastify.get('/info', async () => {
    return {
      name: 'ts-template-mcp-server',
      version: '1.0.0',
      description: 'A TypeScript MCP server template following official SDK best practices',
      endpoints: {
        mcp: '/mcp',
        health: '/health',
        hello: '/hello/:name'
      },
      capabilities: ['tools', 'resources'],
      transport: 'StreamableHTTP',
      sdkVersion: '@modelcontextprotocol/sdk ^1.0.4'
    };
  });

  // Enhanced error handler
  fastify.setErrorHandler(async (error: FastifyError, request: FastifyRequest, reply: FastifyReply) => {
    fastify.log.error({
      error: error.message,
      stack: error.stack,
      url: request.url,
      method: request.method
    }, 'Request error');

    const statusCode = error.statusCode || 500;

    return reply.status(statusCode).send({
      error: error.message || 'Internal Server Error',
      statusCode,
      timestamp: new Date().toISOString()
    });
  });

  // Graceful shutdown handler
  fastify.addHook('onClose', async () => {
    fastify.log.info('Cleaning up MCP sessions...');
    sessions.clear();
  });

  try {
    const address = await fastify.listen({
      port: 3000,
      host: '0.0.0.0'
    });

    fastify.log.info(`🚀 MCP Server ready at ${address}`);
    fastify.log.info('📍 MCP endpoint: /mcp');
    fastify.log.info('👋 Hello endpoint: /hello/:name');
    fastify.log.info('❤️  Health check: /health');
    fastify.log.info('ℹ️  Server info: /info');
    
  } catch (err) {
    fastify.log.error('❌ Error starting server:', err);
    process.exit(1);
  }
}

// Enhanced graceful shutdown
const gracefulShutdown = (signal: string) => {
  console.log(`\n👋 Received ${signal}, shutting down gracefully...`);
  process.exit(0);
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

// Start the server
startServer().catch((err) => {
  console.error('❌ Failed to start server:');
  console.error(err);
  if (err.stack) {
    console.error('Stack trace:');
    console.error(err.stack);
  }
  process.exit(1);
});