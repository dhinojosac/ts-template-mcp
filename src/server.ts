import Fastify, { FastifyRequest, FastifyReply, FastifyError } from 'fastify';
import cors from '@fastify/cors';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { z } from 'zod';
import helloPlugin from './plugins/helloPlugin.js';

/**
 * Creates and configures the MCP Server with tools and resources
 * @returns Configured MCP Server instance
 */
function createMCPServer(): McpServer {
  const server = new McpServer({
    name: 'basic-mcp-server',
    version: '1.0.0',
  });

  // Register the sayHello tool
  server.registerTool(
    'sayHello',
    {
      title: 'Say Hello',
      description: 'Says hello to a person by name',
      inputSchema: {
        name: z.string().min(1, 'Name must not be empty')
      }
    },
    async ({ name }: { name: string }) => {
      return {
        content: [
          {
            type: 'text',
            text: `Hello, ${name}!`
          }
        ]
      };
    }
  );

  // Register a simple hello resource
  server.registerResource(
    'hello-resource',
    'hello://static',
    {
      title: 'Hello Resource',
      description: 'A simple hello resource',
      mimeType: 'text/plain'
    },
    async (uri) => {
      return {
        contents: [
          {
            uri: uri.href,
            mimeType: 'text/plain',
            text: 'Hello from resource!'
          }
        ]
      };
    }
  );

  return server;
}

/**
 * Sets up and starts the Fastify server with MCP integration
 */
async function startServer() {
  // Create Fastify instance
  const fastify = Fastify({
    logger: true
  });

  // Register CORS plugin with MCP-specific headers
  await fastify.register(cors, {
    origin: '*', // Allow any origin
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Mcp-Session-Id' // Required MCP header
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
  });

  // Register the hello plugin
  await fastify.register(helloPlugin);

  // Create MCP server instance
  const mcpServer = createMCPServer();

  // Register MCP endpoint
  fastify.post('/mcp', async (request: FastifyRequest, reply: FastifyReply) => {
    // Create transport for this request
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined, // Stateless mode
    });

    // Connect MCP server to transport
    await mcpServer.connect(transport);
    
    // Handle the actual request
    await transport.handleRequest(request.raw, reply.raw, request.body);
  });

  // Health check endpoint
  fastify.get('/health', async () => {
    return { 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      server: 'basic-mcp-server',
      version: '1.0.0'
    };
  });

  // Error handler
  fastify.setErrorHandler(async (error: FastifyError, request: FastifyRequest, reply: FastifyReply) => {
    fastify.log.error(error);
    
    const statusCode = error.statusCode || 500;
    
    return reply.status(statusCode).send({
      error: error.message || 'Internal Server Error',
      statusCode
    });
  });

  try {
    // Start the server
    const address = await fastify.listen({
      port: 3000,
      host: '0.0.0.0'
    });
    
    fastify.log.info(`🚀 Server ready at ${address}`);
    fastify.log.info('📍 MCP endpoint available at /mcp');
    fastify.log.info('👋 Hello plugin available at /hello/:name');
    fastify.log.info('❤️  Health check available at /health');
    
  } catch (err) {
    console.error('❌ Error starting server:', err);
    fastify.log.error('❌ Error starting server:', err);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Received SIGINT, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n👋 Received SIGTERM, shutting down gracefully...');
  process.exit(0);
});

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