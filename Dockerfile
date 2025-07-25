# Use Node.js 20 Alpine for better compatibility
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
# Skip prepare script for production dependencies
# --ignore-scripts prevents running postinstall scripts that might fail in production
RUN npm ci --omit=dev --ignore-scripts

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Install dev dependencies for build
RUN npm ci

# Build the application
RUN npm run build

# Production image, copy all the files and run the app
FROM base AS runner
WORKDIR /app

# Install curl for healthcheck
# Required for Docker healthcheck to work properly
RUN apk add --no-cache curl

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Create non-root user for security
# This prevents the container from running as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs

# Copy built application
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Switch to non-root user for security
USER nodejs

EXPOSE 3000

# Use npm start:docker to avoid prestart script
# PROBLEM FIXED: npm start has a prestart script that runs npm run build
# This fails in production because TypeScript is not installed in the runner stage
# Solution: Use a separate script that doesn't have prestart hooks
CMD ["npm", "run", "start:docker"] 