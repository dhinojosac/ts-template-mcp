# AI Development Guidelines - TypeScript MCP Server Template

This document provides comprehensive guidelines for AI assistants to understand and contribute to this TypeScript MCP Server Template project effectively.

## 🎯 **Project Overview**

### **What is this project?**
A **TypeScript MCP Server Template** that provides a complete foundation for building Model Context Protocol (MCP) servers. It follows official SDK best practices and includes production-ready Docker setup.

### **Key Technologies:**
- **TypeScript** - Primary language with strict type safety
- **Fastify** - High-performance web framework
- **@modelcontextprotocol/sdk** - Official MCP TypeScript SDK
- **Docker** - Multi-stage containerization
- **Zod** - Runtime type validation
- **Pino** - Structured logging

### **Project Goals:**
1. Provide a production-ready MCP server template
2. Follow official MCP SDK best practices
3. Include comprehensive documentation
4. Support both HTTP and STDIO transport
5. Maintain high code quality and security standards

## 🏗️ **Architecture & Structure**

### **Core Architecture:**
```
src/
├── server.ts              # Main MCP server entry point
├── config/
│   └── constants.ts       # Centralized configuration
├── utils/
│   ├── errorHandler.ts    # Error handling utilities
│   └── logger.ts          # Structured logging
├── schemas/
│   ├── toolSchemas.ts     # MCP tool validation schemas
│   └── commonSchemas.ts   # Reusable validation schemas
└── plugins/
    ├── helloPlugin.ts     # Example plugin with REST endpoint
    └── weatherPlugin.ts   # Weather tools implementation
```

### **Key Design Patterns:**
1. **Plugin Architecture** - Modular, extensible plugin system
2. **Schema-First Validation** - Zod schemas for all inputs
3. **Centralized Error Handling** - Consistent error responses
4. **Structured Logging** - Pino-based logging with levels
5. **Type Safety** - Strict TypeScript configuration

## 📝 **Coding Standards & Conventions**

### **TypeScript Guidelines:**
- **Strict Mode** - Always use strict TypeScript settings
- **No `any` Types** - Avoid `any` unless absolutely necessary
- **Interface over Type** - Prefer interfaces for object shapes
- **Explicit Returns** - Always specify return types for functions
- **Generic Types** - Use generics for reusable components

### **Naming Conventions:**
```typescript
// Files: kebab-case
helloPlugin.ts
weatherPlugin.ts

// Functions: camelCase
async function handleMcpRequest()
async function validateToolInput()

// Constants: UPPER_SNAKE_CASE
const DEFAULT_PORT = 3000
const MCP_SESSION_TIMEOUT = 30000

// Interfaces: PascalCase
interface McpToolRequest
interface WeatherToolParams

// Classes: PascalCase
class ErrorHandler
class Logger
```

### **Code Organization:**
```typescript
// 1. Imports (external first, then internal)
import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { logger } from '@/utils/logger'

// 2. Type definitions
interface ToolRequest {
  // ...
}

// 3. Constants
const TOOL_SCHEMA = z.object({
  // ...
})

// 4. Main function/class
export async function registerTool(fastify: FastifyInstance) {
  // Implementation
}
```

## 🔧 **MCP-Specific Guidelines**

### **Tool Implementation Pattern:**
```typescript
// 1. Define Zod schema for tool parameters
const weatherToolSchema = z.object({
  city: z.string().min(1),
  units: z.enum(['metric', 'imperial']).default('metric')
})

// 2. Implement tool handler
async function weatherTool(params: z.infer<typeof weatherToolSchema>) {
  try {
    // Tool logic here
    return {
      temperature: 25,
      description: 'Sunny'
    }
  } catch (error) {
    throw new Error(`Weather tool failed: ${error.message}`)
  }
}

// 3. Register with MCP server
server.setRequestHandler('tools/call', async (request) => {
  const validatedParams = weatherToolSchema.parse(request.params.arguments)
  return await weatherTool(validatedParams)
})
```

### **Resource Management:**
```typescript
// 1. Define resource schema
const fileResourceSchema = z.object({
  uri: z.string().url(),
  mimeType: z.string(),
  name: z.string()
})

// 2. Implement resource handler
server.setRequestHandler('resources/read', async (request) => {
  const { uri } = request.params
  // Resource reading logic
  return {
    contents: [{ uri, mimeType: 'text/plain', text: 'content' }]
  }
})
```

### **Error Handling Pattern:**
```typescript
// Always use structured error handling
try {
  const result = await someOperation()
  return result
} catch (error) {
  logger.error({ error, operation: 'someOperation' }, 'Operation failed')
  throw new McpError({
    code: 'INTERNAL_ERROR',
    message: 'Operation failed',
    data: { originalError: error.message }
  })
}
```

## 🐳 **Docker Guidelines**

### **Multi-Stage Build Pattern:**
```dockerfile
# Stage 1: Dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev --ignore-scripts

# Stage 2: Builder
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm ci
RUN npm run build

# Stage 3: Production
FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
USER nodejs
CMD ["npm", "run", "start:docker"]
```

### **Docker Best Practices:**
- **Security First** - Always run as non-root user
- **Minimal Images** - Use Alpine Linux base
- **Layer Caching** - Optimize for build speed
- **Healthchecks** - Include proper health monitoring
- **Environment Variables** - Use ENV for configuration

## 🧪 **Testing Guidelines**

### **Test Structure:**
```typescript
// Unit tests for tools
describe('weatherTool', () => {
  it('should return weather data for valid city', async () => {
    const params = { city: 'Santiago', units: 'metric' }
    const result = await weatherTool(params)
    expect(result).toHaveProperty('temperature')
    expect(result).toHaveProperty('description')
  })

  it('should throw error for invalid city', async () => {
    const params = { city: '', units: 'metric' }
    await expect(weatherTool(params)).rejects.toThrow()
  })
})

// Integration tests for MCP endpoints
describe('MCP Server', () => {
  it('should handle tools/call request', async () => {
    const request = {
      method: 'tools/call',
      params: {
        name: 'weather',
        arguments: { city: 'Santiago' }
      }
    }
    const response = await server.handleRequest(request)
    expect(response).toHaveProperty('content')
  })
})
```

## 📚 **Documentation Guidelines**

### **Code Comments:**
```typescript
/**
 * Handles MCP tool requests with validation and error handling
 * @param request - The MCP tool request
 * @returns Promise resolving to tool response
 * @throws McpError when validation or execution fails
 */
async function handleToolRequest(request: ToolRequest): Promise<ToolResponse> {
  // Implementation
}
```

### **README Updates:**
- Always update README.md when adding new features
- Include usage examples for new tools
- Update API documentation
- Add troubleshooting sections for common issues

## 🔄 **Development Workflow**

### **When Adding New Features:**
1. **Create Feature Branch** - `feature/new-tool-name`
2. **Follow Naming Conventions** - Use established patterns
3. **Add Tests** - Unit and integration tests
4. **Update Documentation** - README, CHANGELOG, comments
5. **Validate Code Quality** - Run linting and type checking
6. **Test Docker Build** - Ensure containerization works
7. **Update CHANGELOG** - Document changes

### **When Fixing Bugs:**
1. **Reproduce Issue** - Create minimal test case
2. **Fix Root Cause** - Don't just patch symptoms
3. **Add Regression Test** - Prevent future occurrences
4. **Update Documentation** - If API changes
5. **Test Thoroughly** - Local and Docker environments

### **When Reviewing Code:**
1. **Type Safety** - Check for proper TypeScript usage
2. **Error Handling** - Ensure proper error management
3. **Performance** - Consider impact on server performance
4. **Security** - Validate input handling
5. **Documentation** - Check for updated docs
6. **Tests** - Ensure adequate test coverage

## 🚨 **Common Pitfalls to Avoid**

### **TypeScript Issues:**
- ❌ Using `any` types without justification
- ❌ Ignoring TypeScript errors
- ❌ Not specifying return types
- ❌ Using `// @ts-ignore` without explanation

### **MCP Protocol Issues:**
- ❌ Not validating tool parameters
- ❌ Ignoring MCP error codes
- ❌ Not handling async operations properly
- ❌ Missing proper session management

### **Docker Issues:**
- ❌ Running as root user
- ❌ Including unnecessary files in image
- ❌ Not using multi-stage builds
- ❌ Missing healthchecks

### **Code Quality Issues:**
- ❌ Not following naming conventions
- ❌ Missing error handling
- ❌ Not logging important events
- ❌ Hardcoding configuration values

## 🎯 **AI Assistant Priorities**

### **When Helping with Development:**
1. **Maintain Type Safety** - Always suggest proper TypeScript types
2. **Follow Established Patterns** - Use existing code as reference
3. **Consider Security** - Validate inputs and handle errors
4. **Update Documentation** - Keep docs in sync with code
5. **Test Thoroughly** - Suggest comprehensive testing approaches

### **When Suggesting Changes:**
1. **Explain Reasoning** - Why this approach is better
2. **Consider Impact** - How changes affect existing code
3. **Provide Examples** - Show concrete implementation
4. **Reference Patterns** - Point to existing similar code
5. **Consider Future** - How changes affect maintainability

### **When Debugging Issues:**
1. **Reproduce First** - Create minimal test case
2. **Check Logs** - Use structured logging effectively
3. **Validate Inputs** - Check for data validation issues
4. **Consider Environment** - Docker vs local differences
5. **Document Solution** - Update troubleshooting guides

## 📋 **Quick Reference**

### **Essential Commands:**
```bash
# Development
npm run dev              # Start development server
npm run dev:stdio        # Start in STDIO mode
npm run build           # Build for production
npm run validate        # Type check + lint

# Docker
docker-compose up -d    # Start services
docker-compose down     # Stop services
docker build -t app .   # Build image

# Testing
npm test               # Run tests
npm run test:watch     # Watch mode
```

### **Key Files:**
- `src/server.ts` - Main server entry point
- `src/plugins/` - MCP tool implementations
- `src/schemas/` - Zod validation schemas
- `Dockerfile` - Multi-stage build configuration
- `docker-compose.yml` - Service orchestration
- `README.md` - Project documentation

### **Important Constants:**
- `DEFAULT_PORT = 3000` - Server port
- `MCP_SESSION_TIMEOUT = 30000` - Session timeout
- `NODE_ENV` - Environment (development/production)

## 🎉 **Success Metrics**

### **Code Quality:**
- ✅ TypeScript compilation without errors
- ✅ ESLint passes with minimal warnings
- ✅ All tests passing
- ✅ Docker builds successfully
- ✅ Healthchecks passing

### **Functionality:**
- ✅ MCP tools working correctly
- ✅ HTTP and STDIO transport functional
- ✅ Error handling working properly
- ✅ Logging providing useful information
- ✅ Documentation up to date

### **Performance:**
- ✅ Fast startup times
- ✅ Efficient memory usage
- ✅ Quick response times
- ✅ Optimized Docker images
- ✅ Proper resource management

---

**Remember:** This project aims to be a production-ready template that others can use as a foundation for their MCP servers. Always prioritize maintainability, security, and user experience in your contributions. 