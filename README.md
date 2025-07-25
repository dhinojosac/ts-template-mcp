# TypeScript MCP Server Template

A comprehensive **TypeScript MCP Server Template** following the [official MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk) best practices, built with **Fastify** and providing tools, resources, and prompts.

## 🛠️ Tech Stack & Tools Explained

### Core Technologies
- **TypeScript** - Type-safe development with compile-time error checking
- **Fastify** - Fast and efficient web framework for building APIs
- **@modelcontextprotocol/sdk** - Official MCP Server SDK for AI model integration

### Development Tools
- **Zod** - Runtime type validation and schema definition for API inputs
- **@fastify/cors** - CORS support for web clients to access the API
- **tsx** - Modern TypeScript execution without compilation step
- **pino-pretty** - Beautiful development logging with structured output

### Code Quality Tools
- **ESLint** - Static code analysis to catch errors and enforce coding standards
- **Prettier** - Automatic code formatting for consistent style
- **Husky** - Git hooks to run quality checks before commits
- **lint-staged** - Run linters only on staged files for faster feedback

### Deployment Tools
- **Docker** - Containerization for consistent deployment across environments
- **Docker Compose** - Multi-container orchestration for development and production

## 📦 Project Structure

```
ts-template-mcp-server/
├── src/
│   ├── server.ts              # Main MCP server with HTTP/STDIO transport
│   ├── config/
│   │   └── constants.ts       # Centralized configuration constants
│   ├── utils/
│   │   ├── errorHandler.ts    # Centralized error handling utilities
│   │   └── logger.ts          # Structured logging with Pino
│   ├── schemas/
│   │   ├── toolSchemas.ts     # Zod schemas for MCP tool validation
│   │   └── commonSchemas.ts   # Reusable validation schemas
│   └── plugins/
│       ├── helloPlugin.ts     # Fastify plugin with REST endpoint
│       └── weatherPlugin.ts   # Weather tools with Zod validation
├── .github/workflows/
│   └── ci.yml                 # GitHub Actions CI/CD pipeline
├── client-example.js          # Example client for testing MCP features
├── Dockerfile                 # Multi-stage Docker build configuration
├── docker-compose.yml         # Docker Compose for local development
├── .eslintrc.json            # ESLint configuration with TypeScript rules
├── .prettierrc               # Prettier formatting rules
├── .husky/pre-commit         # Git hook to run lint-staged
├── env.example               # Environment variables template
├── tsconfig.json             # TypeScript compiler configuration
├── package.json              # Dependencies and npm scripts
└── README.md                 # This comprehensive documentation
```

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

**What this does:** Installs all required dependencies including TypeScript, Fastify, MCP SDK, and development tools.

### 2. Environment Setup

Copy the environment example file and configure your variables:

```bash
cp env.example .env
```

**What this does:** Creates a local environment file with configuration for:
- Server settings (port, host)
- MCP configuration (STDIO mode, session timeout)
- Logging levels and formatting
- CORS settings
- External API keys (weather service)

### 3. Start Development Server

**HTTP Mode (for web clients):**
```bash
npm run dev
```

**STDIO Mode (for CLI clients like Claude Desktop):**
```bash
npm run dev:stdio
```

**Debug Mode (with detailed logging):**
```bash
npm run dev:debug
```

**What each mode does:**
- **HTTP Mode**: Starts server on port 3000 for web-based MCP clients
- **STDIO Mode**: Runs as CLI process for desktop AI applications
- **Debug Mode**: Enables verbose logging for troubleshooting

### 4. Build for Production

```bash
# Clean previous build (optional)
npm run clean

# Compile TypeScript to JavaScript
npm run build

# Run the compiled server
npm start
```

**What this does:**
- `clean`: Removes old build artifacts
- `build`: Compiles TypeScript to optimized JavaScript
- `start`: Runs the production server

**Production STDIO Mode:**
```bash
npm run start:stdio
```

## 🌐 Available Endpoints

**HTTP Mode**: The server starts on `http://localhost:3000` with these endpoints:

### MCP Protocol Endpoints
- **`POST /mcp`** - Model Context Protocol interface (handles all MCP operations)
  - **Purpose**: Main interface for AI models to interact with tools and resources
  - **Usage**: Send JSON-RPC 2.0 requests with MCP methods

### REST API Endpoints
- **`GET /hello/:name`** - Traditional REST API endpoint
  - **Purpose**: Example of hybrid REST + MCP server
  - **Usage**: `curl http://localhost:3000/hello/YourName`

### Weather Plugin Endpoints
- **`GET /weather/forecast?lat=40.7128&lng=-74.0060`** - Weather forecast
  - **Purpose**: Get weather data for specific coordinates
  - **Usage**: `curl "http://localhost:3000/weather/forecast?lat=40.7128&lng=-74.0060"`
- **`GET /weather/alerts/:state`** - Weather alerts for US state
  - **Purpose**: Get weather alerts for specific US states
  - **Usage**: `curl http://localhost:3000/weather/alerts/CA`

### Monitoring Endpoints
- **`GET /health`** - Enhanced server status with session info
  - **Purpose**: Health check with detailed metrics
  - **Usage**: `curl http://localhost:3000/health`
- **`GET /info`** - Server capabilities and endpoints
  - **Purpose**: Discover available features
  - **Usage**: `curl http://localhost:3000/info`

**STDIO Mode**: The server runs as a CLI process for direct integration with MCP clients like Claude Desktop.

## 🧪 Testing the Server

### Quick Health Check

```bash
curl http://localhost:3000/health
```

**Expected response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "server": "ts-template-mcp-server",
  "version": "1.0.0",
  "uptime": 123.456,
  "sessions": 0,
  "capabilities": ["tools", "resources"]
}
```

**What this tells you:**
- Server is running and healthy
- Current timestamp and uptime
- Number of active MCP sessions
- Available MCP capabilities

### Using the Client Example

The included client example demonstrates all MCP features:

```bash
node client-example.js
```

**This demonstrates:**
- ✅ **Connection**: Establishing connection to MCP server
- 🔧 **Tools**: Listing and calling MCP tools
- 📚 **Resources**: Listing and reading MCP resources  
- 💭 **Prompts**: Listing and getting MCP prompts
- 🚨 **Error Handling**: Proper error handling examples

## 🔧 MCP Features Explained

### 🛠️ Tools - What They Are and How to Use

**Tools** are functions that AI models can call to perform actions. Each tool:
- Has a name, description, and input schema
- Validates inputs using Zod schemas
- Returns structured results

**Available Tools:**

#### 1. `sayHello` Tool
**Purpose**: Simple greeting tool for testing MCP communication
**Input**: Person's name
**Usage Example:**
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
**Purpose**: Perform arithmetic operations
**Input**: Operation type and two numbers
**Usage Example:**
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

#### 3. `getWeatherForecast` Tool
**Purpose**: Get weather forecast for specific coordinates
**Input**: Latitude and longitude
**Usage**: Called by AI models to get weather data

#### 4. `getWeatherAlerts` Tool
**Purpose**: Get weather alerts for US states
**Input**: US state name
**Usage**: Called by AI models to get weather alerts

### 📋 Zod Validation - Why It's Important

**Zod** provides runtime type validation that matches TypeScript types:

```typescript
// Example: Weather forecast tool validation
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

### 📚 Resources - What They Are and How to Use

**Resources** are data sources that AI models can read. Each resource:
- Has a URI scheme (`mcp://`, `file://`, etc.)
- Contains structured data
- Can be read multiple times

**Available Resources:**

#### 1. Server Information (`mcp://server-info`)
**Purpose**: Provides server metadata and capabilities
**Usage:**
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
**Purpose**: Example resource with greeting content
**Usage:**
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

### 💭 Prompts - What They Are and How to Use

**Prompts** are template messages that AI models can use. Each prompt:
- Has a name and description
- Accepts arguments for customization
- Returns formatted messages

**Available Prompts:**

#### Greeting Prompt (`greeting-prompt`)
**Purpose**: Generate personalized greetings
**Usage:**
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
6. **Code Quality**: ESLint, Prettier, and Husky for consistent code
7. **Containerization**: Docker support for easy deployment
8. **CI/CD**: GitHub Actions pipeline for automated testing

### Integration Features

- **CORS**: Enhanced CORS configuration for web clients
- **Logging**: Structured logging with pino-pretty for development
- **Health Monitoring**: Detailed health endpoint with session metrics
- **REST + MCP**: Hybrid server supporting both traditional REST and MCP protocols
- **Error Handling**: Centralized error handling with custom error types
- **Configuration**: Centralized configuration management

## 🔄 Git Flow Workflow

This project follows **Git Flow** methodology for organized development:

### Branch Structure
- **`main`** - Production-ready code
- **`develop`** - Integration branch for features
- **`feature/*`** - New features and improvements
- **`release/*`** - Release preparation
- **`hotfix/*`** - Critical production fixes

### Development Workflow

```bash
# Start a new feature
git flow feature start feature-name

# Work on your feature...
git add .
git commit -m "feat: add new feature"

# Finish the feature (merges to develop)
git flow feature finish feature-name

# Create a release
git flow release start v1.1.0

# Finish release (merges to main and develop)
git flow release finish v1.1.0

# Create hotfix for critical issues
git flow hotfix start critical-fix
git flow hotfix finish critical-fix
```

### Commit Message Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

## 🔧 Development Tools Explained

### Available Scripts

#### Development Scripts
- `npm run dev` - Start development server with hot reload and pretty logging
  - **Purpose**: Main development command with live reload
  - **Use when**: Developing new features
- `npm run dev:debug` - Start with debug logging enabled
  - **Purpose**: Detailed logging for troubleshooting
  - **Use when**: Debugging issues or understanding server behavior
- `npm run dev:stdio` - Start in STDIO mode for CLI clients
  - **Purpose**: Run server for desktop AI applications
  - **Use when**: Testing with Claude Desktop or similar

#### Build Scripts
- `npm run build` - Compile TypeScript to JavaScript in `dist/` folder
  - **Purpose**: Create production-ready JavaScript files
  - **Use when**: Deploying to production
- `npm run build:watch` - Build with watch mode
  - **Purpose**: Auto-rebuild when files change
  - **Use when**: Developing with build step
- `npm start` - Run compiled server (production mode)
  - **Purpose**: Start production server
  - **Use when**: Running in production environment

#### Code Quality Scripts
- `npm run clean` - Remove compiled files
  - **Purpose**: Clean build artifacts
  - **Use when**: Troubleshooting build issues
- `npm run lint` - Run ESLint
  - **Purpose**: Check code quality and style
  - **Use when**: Before committing code
- `npm run lint:fix` - Run ESLint with auto-fix
  - **Purpose**: Automatically fix linting issues
  - **Use when**: ESLint reports fixable errors
- `npm run format` - Format code with Prettier
  - **Purpose**: Ensure consistent code formatting
  - **Use when**: Code formatting is inconsistent
- `npm run type-check` - Run TypeScript type checking
  - **Purpose**: Verify TypeScript types without building
  - **Use when**: Checking for type errors
- `npm run validate` - Run type check and linting
  - **Purpose**: Comprehensive code quality check
  - **Use when**: Before pushing code or creating PRs

#### Testing Scripts
- `npm test` - Run tests (placeholder)
  - **Purpose**: Execute test suite
  - **Use when**: Verifying functionality

### Environment Requirements

- **Node.js**: >=18.0.0 (for modern JavaScript features)
- **TypeScript**: ^5.7.2 (for type safety)
- **MCP SDK**: ^1.0.4 (for MCP protocol support)

### Adding New MCP Tools

Following official SDK patterns:

1. **Add tool definition** to `tools/list` handler:
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

2. **Handle tool execution** in `tools/call` handler:
```typescript
case "myTool":
  const { param } = args as { param: string };
  return {
    content: [{ type: "text", text: `Result: ${param}` }]
  };
```

### Adding New Resources

1. **Add to `resources/list` handler** - Define available resources
2. **Handle reading in `resources/read` handler** - Implement resource reading logic
3. **Use proper URI schemes** (`mcp://`, `file://`, etc.) - Follow MCP conventions

### Adding Prompts

1. **Add to `prompts/list` handler** - Define available prompts
2. **Handle generation in `prompts/get` handler** - Implement prompt generation logic
3. **Return proper message format** with roles - Follow MCP prompt format

## 🐳 Docker Support

### Building the Image

```bash
docker build -t ts-template-mcp-server .
```

**What this does:**
- Creates a multi-stage Docker image
- Optimizes for production with minimal size
- Includes all necessary dependencies

### Running with Docker

```bash
# Production mode
docker run -p 3000:3000 ts-template-mcp-server

# Development mode
docker-compose up mcp-server-dev
```

**What each does:**
- **Production mode**: Runs optimized container for production
- **Development mode**: Runs with volume mounts for live development

### Docker Compose

```bash
# Start all services
docker-compose up

# Start only production server
docker-compose up mcp-server

# Start development server
docker-compose --profile dev up mcp-server-dev
```

**What this provides:**
- **Multi-service orchestration**: Easy management of multiple containers
- **Development profiles**: Separate configurations for dev/prod
- **Volume mounts**: Live code reloading in development

## 🌐 CORS & Security

Enhanced CORS configuration for MCP compatibility:

- **Origin**: Flexible origin handling (`true` instead of `*`)
- **Headers**: All required MCP headers plus standard web headers
- **Methods**: All HTTP methods for maximum compatibility
- **Session Security**: Session-based transport isolation

## 🚨 Troubleshooting

### Common Issues

#### 1. Port Already in Use
```bash
# Check what's using port 3000
netstat -ano | findstr :3000

# Kill the process or change port in server.ts
```

**What this fixes:** Resolves port conflicts when starting the server

#### 2. TypeScript Compilation Errors
```bash
# Clean and rebuild
npm run clean
npm run build
```

**What this fixes:** Resolves build issues caused by stale files

#### 3. MCP Connection Issues
- Ensure proper `Mcp-Session-Id` header
- Check CORS configuration for web clients
- Verify JSON-RPC 2.0 format in requests

**What this fixes:** Resolves MCP protocol communication issues

#### 4. STDIO Mode Not Working
```bash
# Ensure proper environment variable
export MCP_STDIO=true
npm run dev:stdio
```

**What this fixes:** Ensures server runs in correct mode for CLI clients

#### 5. Linting Errors
```bash
# Auto-fix linting issues
npm run lint:fix

# Format code
npm run format
```

**What this fixes:** Resolves code style and quality issues

### Debug Mode

Enable debug logging by setting environment variable:
```bash
DEBUG=mcp:* npm run dev
```

**What this provides:** Detailed logging for troubleshooting MCP issues

### Performance Monitoring

The health endpoint provides real-time metrics:
```bash
curl http://localhost:3000/health | jq
```

**What this shows:** Server status, uptime, active sessions, and capabilities

## 📚 Learn More

- [Model Context Protocol Specification](https://modelcontextprotocol.io/)
- [Official TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [MCP Server Examples](https://github.com/modelcontextprotocol)
- [Fastify Documentation](https://fastify.dev/)
- [Git Flow Documentation](https://nvie.com/posts/a-successful-git-branching-model/)

## 📝 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch using Git Flow: `git flow feature start feature-name`
3. Follow the existing patterns from official SDK documentation
4. Add tests if applicable
5. Submit a pull request

---

**Built following [Official MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk) best practices** 