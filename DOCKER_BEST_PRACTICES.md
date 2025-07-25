# Docker Best Practices for Node.js Applications

This document outlines best practices for containerizing Node.js applications, based on lessons learned from this project.

## 1. **Multi-stage Builds**

### Why Use Multi-stage Builds?
- **Smaller production images**: Only runtime dependencies are included
- **Better security**: Build tools and dev dependencies are not in production
- **Faster builds**: Better layer caching

### Structure:
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
CMD ["npm", "run", "start:docker"]
```

## 2. **Security Best Practices**

### Run as Non-root User
```dockerfile
# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs

# Switch to non-root user
USER nodejs
```

### Use Minimal Base Images
- Prefer `node:20-alpine` over `node:20`
- Consider `node:20-alpine-slim` for even smaller images
- Avoid `latest` tags in production

### Scan for Vulnerabilities
```bash
# Scan image for vulnerabilities
docker scout quickview ts-template-mcp

# Scan with detailed report
docker scout cves ts-template-mcp
```

## 3. **NPM Scripts and Docker**

### Problem: Prestart/Poststart Scripts
```json
{
  "scripts": {
    "prestart": "npm run build",  // ❌ This runs in Docker production!
    "start": "node dist/server.js"
  }
}
```

### Solution: Separate Scripts
```json
{
  "scripts": {
    "prestart": "npm run build",
    "start": "node dist/server.js",
    "start:docker": "node dist/server.js"  // ✅ No hooks
  }
}
```

### Best Practices:
- Create Docker-specific scripts without hooks
- Use `--ignore-scripts` flag when installing production dependencies
- Test scripts in containerized environment

## 4. **Healthchecks**

### Alpine Linux Considerations
```yaml
# ❌ Don't use wget (not available in Alpine)
healthcheck:
  test: ["CMD", "wget", "--spider", "http://localhost:3000/health"]

# ✅ Use curl instead
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
```

### Healthcheck Best Practices:
- Use `curl -f` for silent failure on HTTP errors
- Set appropriate intervals and timeouts
- Include start period for applications that need time to initialize
- Test healthcheck endpoints independently

## 5. **Environment Variables**

### Dockerfile vs docker-compose.yml
```dockerfile
# Dockerfile: Default values
ENV NODE_ENV=production
ENV PORT=3000
```

```yaml
# docker-compose.yml: Override for specific environment
environment:
  - NODE_ENV=production
  - PORT=3000
  - HOST=0.0.0.0
```

### Best Practices:
- Don't duplicate environment variables
- Use `.env` files for local development
- Use Docker secrets for sensitive data
- Set `HOST=0.0.0.0` for Docker networking

## 6. **Performance Optimization**

### .dockerignore File
```dockerignore
# Essential exclusions
node_modules
dist
.env*
.git
README.md
*.log
coverage
.vscode
.idea
```

### Layer Caching
```dockerfile
# Copy package files first (changes less frequently)
COPY package*.json ./
RUN npm ci

# Copy source code after (changes more frequently)
COPY . .
```

### Build Context
- Keep build context small
- Use `.dockerignore` effectively
- Consider using BuildKit for faster builds

## 7. **Monitoring and Logging**

### Healthcheck Configuration
```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 40s
```

### Logging Best Practices:
- Use structured logging (JSON)
- Set appropriate log levels
- Consider log aggregation for production
- Use `docker-compose logs` for debugging

## 8. **Development vs Production**

### Development Setup
```yaml
mcp-server-dev:
  build:
    target: builder  # Include dev dependencies
  volumes:
    - ./src:/app/src  # Hot reload
  environment:
    - NODE_ENV=development
    - DEBUG=mcp:*
  command: npm run dev
  profiles:
    - dev
```

### Production Setup
```yaml
mcp-server:
  build:
    target: runner  # Production stage only
  environment:
    - NODE_ENV=production
  restart: unless-stopped
  healthcheck:
    test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
```

## 9. **Common Pitfalls to Avoid**

### 1. **Using `npm start` in Docker**
- Problem: Prestart scripts run in production
- Solution: Use specific scripts without hooks

### 2. **Running as Root**
- Problem: Security vulnerability
- Solution: Always create and use non-root user

### 3. **Including Dev Dependencies in Production**
- Problem: Larger image, security risks
- Solution: Use multi-stage builds

### 4. **Not Using Healthchecks**
- Problem: No visibility into container health
- Solution: Implement proper healthcheck endpoints

### 5. **Copying Unnecessary Files**
- Problem: Larger build context, slower builds
- Solution: Use comprehensive `.dockerignore`

## 10. **Testing Docker Images**

### Build and Test Commands
```bash
# Build image
docker build -t my-app .

# Test locally
docker run -p 3000:3000 my-app

# Test with docker-compose
docker-compose up -d
docker-compose ps
docker-compose logs

# Test endpoints
curl http://localhost:3000/health
curl http://localhost:3000/info

# Clean up
docker-compose down
docker rmi my-app
```

### Validation Checklist
- [ ] Image builds successfully
- [ ] Container starts without errors
- [ ] Healthcheck passes
- [ ] Application responds to requests
- [ ] Logs are clean and informative
- [ ] Container runs as non-root user
- [ ] Image size is reasonable
- [ ] No sensitive data in image layers

## 11. **Production Considerations**

### Resource Limits
```yaml
services:
  mcp-server:
    deploy:
      resources:
        limits:
          memory: 512M
          cpus: '0.5'
        reservations:
          memory: 256M
          cpus: '0.25'
```

### Security Scanning
```bash
# Regular security scans
docker scout quickview my-app
docker scout cves my-app

# Update base images regularly
docker pull node:20-alpine
```

### Monitoring
- Set up proper logging aggregation
- Monitor container health
- Set up alerts for failed healthchecks
- Track resource usage

## 12. **Troubleshooting Commands**

```bash
# Debug container issues
docker-compose logs -f mcp-server
docker exec -it container_name sh
docker inspect container_name

# Check image layers
docker history image_name
docker image ls

# Debug build issues
docker build --progress=plain -t my-app .
docker build --no-cache -t my-app .

# Check for port conflicts
netstat -tulpn | grep :3000
lsof -i :3000
```

This guide should help you avoid common Docker issues and follow best practices for containerizing Node.js applications. 