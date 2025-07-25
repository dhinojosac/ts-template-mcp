# AI Quick Start Guide - TypeScript MCP Server Template

**TL;DR for AI Assistants**: This is a production-ready TypeScript MCP (Model Context Protocol) server template with Docker, Fastify, Zod validation, and comprehensive documentation. Follow established patterns, maintain type safety, and reference existing code.

## 🚀 **30-Second Project Overview**

### **What is this?**
- **TypeScript MCP Server Template** - Foundation for building MCP servers
- **Production-Ready** - Docker, security, monitoring, documentation
- **Official SDK** - Uses @modelcontextprotocol/sdk
- **Modern Stack** - Fastify, Zod, Pino, TypeScript 5.5.3

### **Key Files to Know:**
- `src/server.ts` - Main MCP server entry point
- `src/plugins/` - MCP tool implementations (helloPlugin.ts, weatherPlugin.ts)
- `src/schemas/` - Zod validation schemas
- `Dockerfile` - Multi-stage build
- `docker-compose.yml` - Service orchestration

### **Core Patterns:**
1. **Plugin Architecture** - Modular tool implementations
2. **Schema-First** - Zod validation for all inputs
3. **Type Safety** - Strict TypeScript, no `any` types
4. **Error Handling** - Centralized error management
5. **Docker Security** - Non-root user, minimal images

## 📋 **Essential Commands**

```bash
# Development
npm run dev              # Start dev server
npm run dev:stdio        # STDIO mode for CLI clients
npm run build           # Build for production
npm run validate        # Type check + lint

# Docker
docker-compose up -d    # Start services
docker-compose down     # Stop services
curl http://localhost:3000/health  # Test endpoint
```

## 🎯 **Quick Reference Patterns**

### **Adding New MCP Tools:**
```typescript
// 1. Define Zod schema
const toolSchema = z.object({
  param1: z.string().min(1),
  param2: z.number().positive()
})

// 2. Implement tool handler
async function myTool(params: z.infer<typeof toolSchema>) {
  try {
    // Tool logic here
    return { result: 'success' }
  } catch (error) {
    throw new Error(`Tool failed: ${error.message}`)
  }
}

// 3. Register with MCP server
server.setRequestHandler('tools/call', async (request) => {
  const validatedParams = toolSchema.parse(request.params.arguments)
  return await myTool(validatedParams)
})
```

### **Plugin Structure:**
```typescript
// Follow the pattern from weatherPlugin.ts
export async function registerMyPlugin(fastify: FastifyInstance) {
  // 1. Register MCP tools
  // 2. Add REST endpoints
  // 3. Add error handling
  // 4. Add logging
}
```

### **Error Handling:**
```typescript
// Always use structured error handling
try {
  const result = await operation()
  return result
} catch (error) {
  logger.error({ error, operation: 'operationName' }, 'Operation failed')
  throw new McpError({
    code: 'INTERNAL_ERROR',
    message: 'Operation failed',
    data: { originalError: error.message }
  })
}
```

## 🔧 **Common Tasks**

### **Adding New Tool:**
1. Create Zod schema in `src/schemas/toolSchemas.ts`
2. Implement tool in `src/plugins/newToolPlugin.ts`
3. Register in `src/server.ts`
4. Add REST endpoint for web clients
5. Update documentation

### **Fixing Issues:**
1. Check logs: `docker-compose logs mcp-server`
2. Validate types: `npm run type-check`
3. Test endpoints: `curl http://localhost:3000/health`
4. Check Docker: `docker-compose ps`

### **Code Quality:**
1. Follow naming conventions (camelCase functions, PascalCase interfaces)
2. Use strict TypeScript types (no `any`)
3. Add proper error handling
4. Update documentation
5. Test in Docker environment

## 🚨 **Critical Rules**

### **DO:**
- ✅ Use Zod schemas for all validation
- ✅ Follow existing plugin patterns
- ✅ Maintain type safety
- ✅ Add proper error handling
- ✅ Update documentation
- ✅ Test in Docker

### **DON'T:**
- ❌ Use `any` types without justification
- ❌ Break established patterns
- ❌ Skip error handling
- ❌ Forget to update docs
- ❌ Ignore TypeScript errors
- ❌ Run Docker as root

## 📚 **Documentation Hierarchy**

1. **AI_GUIDELINES.md** - Comprehensive development guidelines
2. **AI_PROMPT_EXAMPLES.md** - Specific prompt examples
3. **README.md** - Project documentation
4. **DOCKER_BEST_PRACTICES.md** - Docker guidelines
5. **DOCKER_TROUBLESHOOTING.md** - Docker issues and solutions

## 🎯 **Success Metrics**

### **Code Quality:**
- ✅ TypeScript compilation without errors
- ✅ ESLint passes with minimal warnings
- ✅ Docker builds successfully
- ✅ Healthchecks passing

### **Functionality:**
- ✅ MCP tools working correctly
- ✅ HTTP and STDIO transport functional
- ✅ Error handling working properly
- ✅ Documentation up to date

## 🔄 **Development Workflow**

1. **Understand Context** - Read AI_GUIDELINES.md first
2. **Follow Patterns** - Use existing code as reference
3. **Maintain Safety** - TypeScript types, error handling
4. **Test Thoroughly** - Local and Docker environments
5. **Update Docs** - Keep documentation in sync

## 💡 **Pro Tips for AI Assistants**

1. **Always reference existing code** - Use weatherPlugin.ts as template
2. **Explain your reasoning** - Why this approach is better
3. **Consider security** - Validate inputs, handle errors
4. **Think about maintainability** - Clean, documented code
5. **Test your suggestions** - Ensure they work in practice

---

**Remember**: This is a production template that others will use. Always prioritize quality, security, and maintainability in your suggestions. 