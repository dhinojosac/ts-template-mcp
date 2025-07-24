# TypeScript MCP Server Template 🚀

A comprehensive **TypeScript MCP Server Template** following the [official MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk) best practices, built with **Fastify** and providing tools, resources, and prompts.

## 🛠️ Tech Stack

- **TypeScript** - Type-safe development
- **Fastify** - Fast and efficient web framework  
- **@modelcontextprotocol/sdk** - Official MCP Server SDK
- **Zod** - Runtime type validation and schema definition
- **@fastify/cors** - CORS support for web clients
- **tsx** - Modern TypeScript execution
- **pino-pretty** - Beautiful development logging

## 📦 Project Structure

```
ts-template-mcp-server/
├── src/
│   ├── server.ts              # MCP server with Zod validation
│   ├── schemas/
│   │   ├── toolSchemas.ts     # Zod schemas for tool validation
│   │   └── commonSchemas.ts   # Reusable validation schemas
│   └── plugins/
│       ├── helloPlugin.ts     # Fastify plugin with REST endpoint
│       └── weatherPlugin.ts   # Weather tools with Zod validation
├── client-example.js          # Client usage examples
├── tsconfig.json              # TypeScript configuration
├── package.json               # Dependencies and scripts
└── README.md                  # This documentation
```

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Server

**HTTP Mode (for web clients):**
```bash
npm run dev
```

**STDIO Mode (for CLI clients like Claude Desktop):**
```bash
npm run dev:stdio
```

### 3. Build for Production

```bash
# Clean previous build (optional)
npm run clean

# Compile TypeScript to JavaScript
npm run build

# Run the compiled server
npm start
```

**Production STDIO Mode:**
```bash
npm run start:stdio
```

**HTTP Mode**: The server will start on `http://localhost:3000` with the following endpoints:

- **MCP Endpoint**: `/mcp` - Model Context Protocol interface (all HTTP methods)
- **Hello Plugin**: `GET /hello/:name` - Traditional REST API endpoint  
- **Weather Plugin**: 
  - `GET /weather/forecast?lat=40.7128&lng=-74.0060` - Weather forecast
  - `GET /weather/alerts/:state` - Weather alerts for US state
- **Health Check**: `GET /health` - Enhanced server status with session info
- **Server Info**: `GET /info` - Server capabilities and endpoints

**STDIO Mode**: The server runs as a CLI process for direct integration with MCP clients like Claude Desktop.

## 🧪 Testing the Server

### Quick Health Check

```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "server": "ts-template-mcp-server",
  "version": "1.0.0",
  "uptime": 123.456,
  "sessions": 0,
  "capabilities": ["tools", "resources", "prompts"]
}
```

### Using the Client Example

The included client example demonstrates all MCP features:

```bash
node client-example.js
```

This will demonstrate:
- ✅ Connection to MCP server
- 🔧 Listing and calling tools
- 📚 Listing and reading resources  
- 💭 Listing and getting prompts
- 🚨 Error handling examples

## 🔧 MCP Features (Following Official SDK Patterns)

### 🛠️ Tools

All tools use **Zod validation** for type-safe argument validation:

- **sayHello**: Greets a person by name
- **calculate**: Performs arithmetic operations
- **getWeatherForecast**: Gets weather forecast for coordinates
- **getWeatherAlerts**: Gets weather alerts for US states

### 📋 Zod Validation

The server uses Zod schemas for robust argument validation:

```typescript
// Example: Weather forecast tool
const WeatherForecastSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180)
});

// Usage in tool
const { latitude, longitude } = validateToolArgs(WeatherForecastSchema, args);
```

**Benefits:**
- ✅ **Type Safety**: Runtime validation matches TypeScript types
- ✅ **Better Errors**: Descriptive validation error messages
- ✅ **Reusability**: Common schemas can be shared across tools
- ✅ **Maintainability**: Centralized validation logic

The server provides two example tools using official SDK patterns:

#### 1. `sayHello` Tool
```bash
curl -X POST http://localhost:3000/mcp \
  -H "Content-Type: application/json" \
  -H "Mcp-Session-Id: test-session" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/call",
    "params": {
      "name": "sayHello",
      "arguments": {
        "name": "Developer"
      }
    }
  }'
```

#### 2. `calculate` Tool
```bash
curl -X POST http://localhost:3000/mcp \
  -H "Content-Type: application/json" \
  -H "Mcp-Session-Id: test-session" \
  -d '{
    "jsonrpc": "2.0",
    "id": 2,
    "method": "tools/call",
    "params": {
      "name": "calculate",
      "arguments": {
        "operation": "multiply",
        "a": 15,
        "b": 7
      }
    }
  }'
```

### 📚 Resources

Two example resources with proper URI schemes:

#### 1. Server Information (`mcp://server-info`)
```bash
curl -X POST http://localhost:3000/mcp \
  -H "Content-Type: application/json" \
  -H "Mcp-Session-Id: test-session" \
  -d '{
    "jsonrpc": "2.0",
    "id": 3,
    "method": "resources/read",
    "params": {
      "uri": "mcp://server-info"
    }
  }'
```

#### 2. Hello Message (`mcp://hello-message`)
```bash
curl -X POST http://localhost:3000/mcp \
  -H "Content-Type: application/json" \
  -H "Mcp-Session-Id: test-session" \
  -d '{
    "jsonrpc": "2.0",
    "id": 4,
    "method": "resources/read",
    "params": {
      "uri": "mcp://hello-message"
    }
  }'
```

### 💭 Prompts

Example prompt with flexible arguments:

```bash
curl -X POST http://localhost:3000/mcp \
  -H "Content-Type: application/json" \
  -H "Mcp-Session-Id: test-session" \
  -d '{
    "jsonrpc": "2.0",
    "id": 5,
    "method": "prompts/get",
    "params": {
      "name": "greeting-prompt",
      "arguments": {
        "name": "Alice",
        "style": "enthusiastic"
      }
    }
  }'
```

## 🏗️ Architecture & Best Practices

### Official SDK Patterns Used

This template follows the [official MCP TypeScript SDK documentation](https://github.com/modelcontextprotocol/typescript-sdk):

- ✅ **Proper Request Handlers**: Using `setRequestHandler()` for all MCP operations
- ✅ **Session Management**: Map-based session storage for transport instances
- ✅ **Streamable HTTP Transport**: Latest transport method (not deprecated SSE)
- ✅ **Standard JSON Schema**: Proper tool input schemas without Zod dependency
- ✅ **Error Handling**: Comprehensive error handling with proper MCP error responses
- ✅ **Resource URI Schemes**: Using `mcp://` scheme following best practices

### Key Improvements Over Basic Implementation

1. **Session Management**: Proper session tracking with cleanup
2. **Enhanced Error Handling**: Detailed error responses and logging
3. **Multiple Capabilities**: Tools, resources, AND prompts (many examples only show one)
4. **Production Ready**: Graceful shutdown, health checks, proper logging
5. **Type Safety**: Full TypeScript support without runtime schema validation overhead

### Integration Features

- **CORS**: Enhanced CORS configuration for web clients
- **Logging**: Structured logging with pino-pretty for development
- **Health Monitoring**: Detailed health endpoint with session metrics
- **REST + MCP**: Hybrid server supporting both traditional REST and MCP protocols

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server with hot reload and pretty logging
- `npm run build` - Compile TypeScript to JavaScript in `dist/` folder
- `npm start` - Run compiled server (production mode)
- `npm run clean` - Remove compiled files
- `npm run lint` - Run ESLint (placeholder)
- `npm test` - Run tests (placeholder)

### Environment Requirements

- **Node.js**: >=18.0.0
- **TypeScript**: ^5.7.2
- **MCP SDK**: ^1.0.4

### Adding New MCP Tools

Following official SDK patterns:

1. Add tool definition to `tools/list` handler:
```typescript
{
  name: "myTool",
  description: "My custom tool",
  inputSchema: {
    type: "object",
    properties: {
      param: { type: "string", description: "Parameter description" }
    },
    required: ["param"]
  }
}
```

2. Handle tool execution in `tools/call` handler:
```typescript
case "myTool":
  const { param } = args as { param: string };
  return {
    content: [{ type: "text", text: `Result: ${param}` }]
  };
```

### Adding New Resources

1. Add to `resources/list` handler
2. Handle reading in `resources/read` handler
3. Use proper URI schemes (`mcp://`, `file://`, etc.)

### Adding Prompts

1. Add to `prompts/list` handler  
2. Handle generation in `prompts/get` handler
3. Return proper message format with roles

## 🌐 CORS & Security

Enhanced CORS configuration for MCP compatibility:

- **Origin**: Flexible origin handling (`true` instead of `*`)
- **Headers**: All required MCP headers plus standard web headers
- **Methods**: All HTTP methods for maximum compatibility
- **Session Security**: Session-based transport isolation

## 📚 Learn More

- [Model Context Protocol Specification](https://modelcontextprotocol.io/)
- [Official TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [MCP Server Examples](https://github.com/modelcontextprotocol)
- [Fastify Documentation](https://fastify.dev/)

## 📝 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Follow the existing patterns from official SDK documentation
4. Add tests if applicable
5. Submit a pull request

---

**Built following [Official MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk) best practices** 🎯 