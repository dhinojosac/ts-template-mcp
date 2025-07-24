# My MCP Server 🚀

A complete TypeScript project featuring a **Model Context Protocol (MCP) Server** built with **Fastify**, providing both MCP tools/resources and traditional REST endpoints.

## 🛠️ Tech Stack

- **TypeScript** - Type-safe development
- **Fastify** - Fast and efficient web framework
- **@modelcontextprotocol/sdk** - MCP Server implementation
- **Zod** - Runtime type validation
- **@fastify/cors** - CORS support
- **tsx** - Modern TypeScript execution

## 📦 Project Structure

```
my-mcp-server/
├── src/
│   ├── server.ts              # Main MCP server entry point
│   └── plugins/
│       └── helloPlugin.ts     # Fastify plugin with REST endpoint
├── tsconfig.json              # TypeScript configuration
├── package.json               # Dependencies and scripts
└── README.md                  # This file
```

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Server

```bash
npm run dev
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

The server will start on `http://localhost:3000` with the following endpoints:

- **MCP Endpoint**: `POST /mcp` - Model Context Protocol interface
- **Hello Plugin**: `GET /hello/:name` - REST API endpoint
- **Health Check**: `GET /health` - Server status

## 🧪 Testing the Server

### Health Check

```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "server": "basic-mcp-server",
  "version": "1.0.0"
}
```

### Hello Plugin (REST API)

```bash
curl http://localhost:3000/hello/World
```

Expected response:
```json
{
  "greeting": "Hi, World!"
}
```

## 🔧 Testing MCP Tools and Resources

The MCP server provides tools and resources that can be accessed via the Model Context Protocol. Here are examples using curl:

### MCP Tool: `sayHello`

**List Available Tools:**
```bash
curl -X POST http://localhost:3000/mcp \
  -H "Content-Type: application/json" \
  -H "Mcp-Session-Id: test-session" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/list"
  }'
```

**Call the sayHello Tool:**
```bash
curl -X POST http://localhost:3000/mcp \
  -H "Content-Type: application/json" \
  -H "Mcp-Session-Id: test-session" \
  -d '{
    "jsonrpc": "2.0",
    "id": 2,
    "method": "tools/call",
    "params": {
      "name": "sayHello",
      "arguments": {
        "name": "Alice"
      }
    }
  }'
```

Expected response:
```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "Hello, Alice!"
      }
    ]
  }
}
```

### MCP Resource: `hello://`

**List Available Resources:**
```bash
curl -X POST http://localhost:3000/mcp \
  -H "Content-Type: application/json" \
  -H "Mcp-Session-Id: test-session" \
  -d '{
    "jsonrpc": "2.0",
    "id": 3,
    "method": "resources/list"
  }'
```

**Read a Hello Resource:**
```bash
curl -X POST http://localhost:3000/mcp \
  -H "Content-Type: application/json" \
  -H "Mcp-Session-Id: test-session" \
  -d '{
    "jsonrpc": "2.0",
    "id": 4,
    "method": "resources/read",
    "params": {
      "uri": "hello://Bob"
    }
  }'
```

Expected response:
```json
{
  "jsonrpc": "2.0",
  "id": 4,
  "result": {
    "contents": [
      {
        "uri": "hello://Bob",
        "mimeType": "text/plain",
        "text": "Hello from resource, Bob"
      }
    ]
  }
}
```

## 🏗️ Architecture

### MCP Server Features

- **Tools**: Interactive functions that can be called with parameters
  - `sayHello`: Takes a name and returns a greeting message
- **Resources**: Static or dynamic content accessible via URI
  - `hello://{name}`: Returns a resource-based greeting

### Fastify Integration

- **CORS**: Enabled for all origins with MCP-specific headers
- **Plugin System**: Modular hello endpoint via Fastify plugin
- **Error Handling**: Comprehensive error handling with proper HTTP status codes
- **Logging**: Structured logging with pretty formatting in development

### Type Safety

- **Zod Schemas**: Runtime validation for all inputs
- **TypeScript**: Full type safety throughout the codebase
- **Strict Configuration**: Comprehensive TypeScript strict mode settings

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server with hot reload (TypeScript)
- `npm run build` - Compile TypeScript to JavaScript in `dist/` folder
- `npm start` - Run the compiled JavaScript server (production)
- `npm run clean` - Remove compiled files from `dist/` folder

### Development vs Production

| Mode | Command | Description | Use Case |
|------|---------|-------------|----------|
| **Development** | `npm run dev` | Uses `tsx` to run TypeScript directly with hot reload | Local development, testing |
| **Production** | `npm run build && npm start` | Compiles to JavaScript then runs with Node.js | Production servers, deployment |

### Adding New MCP Tools

1. Add the tool to the `ListToolsRequestSchema` handler in `src/server.ts`
2. Handle the tool call in the `CallToolRequestSchema` handler
3. Create Zod schema for input validation

### Adding New MCP Resources

1. Add the resource to the `ListResourcesRequestSchema` handler
2. Handle resource reading in the `ReadResourceRequestSchema` handler
3. Implement URI parsing and content generation

### Adding New Fastify Endpoints

1. Create a new plugin in `src/plugins/`
2. Register the plugin in `src/server.ts`
3. Follow the existing pattern with Zod validation

## 🌐 CORS Configuration

The server is configured with CORS enabled for all origins (`*`) and includes the required MCP headers:

- `Content-Type`
- `Authorization`
- `Mcp-Session-Id`

## 📝 License

MIT License

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

---

**Made with ❤️ using TypeScript and Fastify** 