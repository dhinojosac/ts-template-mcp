# AI Prompt Examples - TypeScript MCP Server Template

This document provides specific prompt examples for different types of development tasks to help AI assistants work more effectively with this project.

## 🎯 **Project Understanding Prompts**

### **Initial Context Setup:**
```
I'm working on a TypeScript MCP Server Template project. Please read the AI_GUIDELINES.md file first to understand the project structure, conventions, and patterns. The project uses Fastify, @modelcontextprotocol/sdk, Zod for validation, and Docker for containerization. Follow the established patterns and maintain type safety throughout.
```

### **Architecture Questions:**
```
Can you explain the plugin architecture in this MCP server? How do tools get registered and how does the validation work with Zod schemas?
```

### **Technology Stack Understanding:**
```
What are the key differences between HTTP and STDIO transport in MCP? How does this project handle both modes?
```

## 🔧 **Development Task Prompts**

### **Adding New MCP Tools:**
```
I want to add a new MCP tool called "calculator" that can perform basic math operations. Please:
1. Create the Zod schema for validation
2. Implement the tool handler following the established pattern
3. Register it with the MCP server
4. Add proper error handling and logging
5. Update the documentation

Follow the patterns from weatherPlugin.ts and use strict TypeScript types.
```

### **Creating New Plugins:**
```
I need to create a new plugin for file operations. The plugin should:
- Handle file reading and writing operations
- Include proper validation with Zod schemas
- Follow the plugin architecture pattern
- Include REST endpoints for web clients
- Add comprehensive error handling

Please create the plugin following the structure of helloPlugin.ts and weatherPlugin.ts.
```

### **Adding Resource Management:**
```
I want to add resource management for file access. Please implement:
1. Resource schema for file URIs
2. Resource reading handler
3. Proper MIME type detection
4. Error handling for file not found
5. Security considerations for file access

Follow the MCP resource management patterns and include proper validation.
```

## 🐳 **Docker & Deployment Prompts**

### **Docker Optimization:**
```
The Docker build is taking too long. Please analyze the Dockerfile and suggest optimizations for:
1. Layer caching improvements
2. Multi-stage build optimization
3. .dockerignore enhancements
4. Build context reduction

Focus on production readiness and security best practices.
```

### **Environment Configuration:**
```
I need to add environment-specific configuration for different deployment environments (dev, staging, prod). Please:
1. Update the constants.ts file
2. Add environment variable validation
3. Update Docker configuration
4. Add documentation for environment setup

Ensure type safety and follow the existing configuration patterns.
```

## 🧪 **Testing Prompts**

### **Unit Test Creation:**
```
Please create comprehensive unit tests for the weatherPlugin.ts file. Include tests for:
1. Valid weather requests
2. Invalid city names
3. Network errors
4. API rate limiting
5. Response format validation

Use Jest and follow the testing patterns established in the project.
```

### **Integration Test Setup:**
```
I need integration tests for the MCP server endpoints. Please create tests that:
1. Test tools/call endpoint
2. Validate MCP protocol compliance
3. Test error handling
4. Verify session management
5. Test both HTTP and STDIO modes

Include proper test setup and teardown following best practices.
```

## 📚 **Documentation Prompts**

### **API Documentation:**
```
Please update the README.md to include comprehensive API documentation for all MCP tools. Include:
1. Tool descriptions and parameters
2. Request/response examples
3. Error codes and handling
4. Usage examples for different clients
5. Troubleshooting section

Follow the existing documentation style and include code examples.
```

### **Code Comments:**
```
Please review and improve the JSDoc comments in the server.ts file. Add:
1. Function descriptions
2. Parameter documentation
3. Return type descriptions
4. Error handling documentation
5. Usage examples

Follow TypeScript documentation best practices.
```

## 🔍 **Debugging Prompts**

### **Error Investigation:**
```
The MCP server is returning "Internal Server Error" for tool requests. Please help me debug this by:
1. Analyzing the error logs
2. Checking the error handling patterns
3. Validating the request format
4. Testing the tool registration
5. Suggesting fixes

Focus on the errorHandler.ts patterns and MCP protocol compliance.
```

### **Performance Issues:**
```
The server is slow to respond to MCP requests. Please analyze:
1. Request processing pipeline
2. Database/API calls optimization
3. Caching strategies
4. Memory usage patterns
5. Docker resource allocation

Provide specific optimization recommendations.
```

## 🚀 **Feature Development Prompts**

### **New Feature Implementation:**
```
I want to add authentication to the MCP server. Please implement:
1. JWT token validation
2. Session management
3. Secure endpoint protection
4. Error handling for auth failures
5. Documentation updates

Follow security best practices and maintain MCP protocol compliance.
```

### **Plugin Extension:**
```
I need to extend the weather plugin to support:
1. Weather forecasts (5-day)
2. Historical weather data
3. Multiple location support
4. Unit conversion
5. Caching for API responses

Maintain backward compatibility and follow the existing plugin patterns.
```

## 🔧 **Code Quality Prompts**

### **Refactoring Requests:**
```
Please refactor the errorHandler.ts file to:
1. Improve type safety
2. Reduce code duplication
3. Add better error categorization
4. Improve logging consistency
5. Add unit tests

Maintain existing functionality while improving code quality.
```

### **Type Safety Improvements:**
```
Please review the codebase for TypeScript improvements:
1. Replace any types with proper interfaces
2. Add generic types where appropriate
3. Improve function return types
4. Add strict null checks
5. Update type definitions

Focus on maintaining strict type safety throughout.
```

## 📋 **Maintenance Prompts**

### **Dependency Updates:**
```
Please help me update the project dependencies:
1. Check for security vulnerabilities
2. Update to latest stable versions
3. Test compatibility with existing code
4. Update documentation if needed
5. Verify Docker builds still work

Focus on maintaining stability while getting latest features.
```

### **Code Review:**
```
Please review the recent changes in the plugins directory:
1. Check for TypeScript compliance
2. Validate error handling
3. Review security considerations
4. Check documentation updates
5. Suggest improvements

Focus on code quality and maintainability.
```

## 🎯 **Specific Task Templates**

### **Template for Adding New Tools:**
```
I want to add a [TOOL_NAME] tool that [DESCRIPTION]. Please:

1. **Schema Definition**: Create Zod schema for [PARAMETERS]
2. **Tool Implementation**: Implement the tool handler with proper error handling
3. **MCP Registration**: Register the tool with the server using established patterns
4. **REST Endpoint**: Add Fastify route for web client access
5. **Documentation**: Update README and add JSDoc comments
6. **Testing**: Create unit tests for the tool
7. **Error Handling**: Follow the errorHandler.ts patterns

Use the weatherPlugin.ts as a reference and maintain strict TypeScript types.
```

### **Template for Bug Fixes:**
```
I'm experiencing [ISSUE_DESCRIPTION]. The error occurs when [CONTEXT]. Please help me:

1. **Reproduce**: Create a minimal test case to reproduce the issue
2. **Analyze**: Identify the root cause using the project's logging and error handling
3. **Fix**: Implement a solution following the project's patterns
4. **Test**: Verify the fix works in both development and Docker environments
5. **Document**: Update troubleshooting documentation if needed

Focus on the [SPECIFIC_AREA] and maintain backward compatibility.
```

### **Template for Performance Optimization:**
```
The [COMPONENT] is experiencing performance issues. Please analyze:

1. **Profiling**: Identify bottlenecks in [SPECIFIC_OPERATION]
2. **Optimization**: Suggest improvements for [AREA_OF_CONCERN]
3. **Caching**: Implement appropriate caching strategies
4. **Monitoring**: Add performance metrics and logging
5. **Testing**: Create performance tests to validate improvements

Focus on maintaining functionality while improving performance.
```

## 🎉 **Success Criteria for AI Assistance**

### **When AI Assistance is Effective:**
- ✅ **Follows Established Patterns** - Uses existing code as reference
- ✅ **Maintains Type Safety** - Suggests proper TypeScript types
- ✅ **Considers Security** - Validates inputs and handles errors
- ✅ **Updates Documentation** - Keeps docs in sync with code changes
- ✅ **Provides Examples** - Shows concrete implementation
- ✅ **Explains Reasoning** - Justifies approach and decisions
- ✅ **Tests Thoroughly** - Suggests comprehensive testing
- ✅ **Considers Impact** - Evaluates effects on existing code

### **Red Flags to Watch For:**
- ❌ **Ignores Type Safety** - Suggests `any` types without justification
- ❌ **Breaks Patterns** - Doesn't follow established conventions
- ❌ **Missing Error Handling** - Suggests code without proper error management
- ❌ **No Documentation** - Doesn't update README or comments
- ❌ **Hardcoded Values** - Suggests hardcoded configuration
- ❌ **Security Issues** - Doesn't consider input validation or security
- ❌ **No Testing** - Suggests features without test coverage

---

**Remember**: Always reference the `AI_GUIDELINES.md` file first to understand the project context, then use these prompt examples to guide your assistance effectively. 