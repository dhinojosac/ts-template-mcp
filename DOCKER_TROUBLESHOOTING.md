# Docker Troubleshooting Guide

This document explains the Docker issues we encountered during development and how we fixed them.

## Issues Found and Solutions

### 1. **Problem: npm start with prestart script in Docker**

**Issue:**
- The `npm start` command has a `prestart` script that runs `npm run build`
- In Docker production stage, TypeScript is not installed
- This caused the container to show TypeScript help instead of running the server

**Error Symptoms:**
```
mcp-server-1  | > ts-template-mcp-server@1.0.0 prestart
mcp-server-1  | > npm run build
mcp-server-1  | 
mcp-server-1  | Version 5.8.3
mcp-server-1  | tsc: The TypeScript Compiler - Version 5.8.3
mcp-server-1  | 
mcp-server-1  | COMMON COMMANDS
mcp-server-1  |   tsc
mcp-server-1  |   Compiles the current project...
```

**Solution:**
- Created a separate `start:docker` script in package.json
- Updated Dockerfile to use `npm run start:docker` instead of `npm start`
- This avoids the prestart hook that tries to run TypeScript in production

**Files Modified:**
- `package.json`: Added `"start:docker": "node dist/server.js"`
- `Dockerfile`: Changed CMD to `["npm", "run", "start:docker"]`

### 2. **Problem: Container running as root**

**Issue:**
- Docker container was running as root user (security risk)
- The `USER nodejs` line was commented out

**Solution:**
- Uncommented `USER nodejs` in Dockerfile
- Added proper user creation with specific UID/GID
- Container now runs as non-root user for better security

**Files Modified:**
- `Dockerfile`: Uncommented `USER nodejs` and added user creation

### 3. **Problem: Healthcheck using wget (not available in Alpine)**

**Issue:**
- Docker Compose healthcheck was using `wget` which is not available in Alpine Linux
- Healthcheck was failing

**Solution:**
- Changed healthcheck to use `curl` instead of `wget`
- Added `curl` installation in Dockerfile
- Updated docker-compose.yml healthcheck command

**Files Modified:**
- `Dockerfile`: Added `RUN apk add --no-cache curl`
- `docker-compose.yml`: Changed healthcheck to `["CMD", "curl", "-f", "http://localhost:3000/health"]`

### 4. **Problem: Duplicate environment variables**

**Issue:**
- `PORT=3000` was defined twice in Dockerfile
- `HOSTNAME="0.0.0.0"` was defined twice

**Solution:**
- Removed duplicate environment variable definitions
- Kept only one instance of each variable

**Files Modified:**
- `Dockerfile`: Removed duplicate ENV declarations

### 5. **Problem: Obsolete docker-compose version**

**Issue:**
- Docker Compose was showing warning about obsolete `version` field
- Modern Docker Compose doesn't require version specification

**Solution:**
- Removed `version: '3.8'` from docker-compose.yml

**Files Modified:**
- `docker-compose.yml`: Removed version field

## Best Practices Implemented

### 1. **Multi-stage Build**
- `deps` stage: Install production dependencies
- `builder` stage: Build the application with dev dependencies
- `runner` stage: Production image with only necessary files

### 2. **Security**
- Non-root user execution
- Minimal base image (Alpine Linux)
- Only necessary packages installed

### 3. **Performance**
- `.dockerignore` file to exclude unnecessary files
- Layer caching optimization
- Separate dependency installation

### 4. **Monitoring**
- Healthcheck with curl
- Proper logging configuration
- Environment variable management

## Commands for Testing

```bash
# Build the image
docker build -t ts-template-mcp .

# Run with docker-compose
docker-compose up -d

# Check container status
docker-compose ps

# View logs
docker-compose logs mcp-server

# Test endpoints
curl http://localhost:3000/health
curl http://localhost:3000/info

# Stop services
docker-compose down
```

## Key Takeaways

1. **Always check npm scripts**: Prestart/poststart scripts can cause issues in Docker
2. **Use specific scripts for Docker**: Create separate scripts without hooks for containerized environments
3. **Security first**: Always run containers as non-root users
4. **Alpine Linux considerations**: Use `curl` instead of `wget` for healthchecks
5. **Multi-stage builds**: Separate build and runtime environments for smaller, more secure images
6. **Healthchecks**: Essential for monitoring container health in production

## Future Considerations

- Consider using `node:20-alpine-slim` for even smaller images
- Implement proper logging strategy for production
- Add resource limits in docker-compose.yml
- Consider using Docker BuildKit for faster builds
- Implement proper secrets management for production deployments 