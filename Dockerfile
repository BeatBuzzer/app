# Build stage
FROM node:20-alpine as builder

WORKDIR /app

# Install dependencies needed for node-gyp
RUN apk add --no-cache python3 make g++

# Copy package files first
COPY package.json package-lock.json ./

# Install dependencies (this layer will be cached if package files don't change)
RUN npm i

# Copy all source files
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy built assets from builder
COPY --from=builder /app/.output /app/.output

# Expose the port
EXPOSE 3000

# Set environment variables
ENV PORT=3000
ENV HOST=0.0.0.0
ENV NODE_ENV=production

HEALTHCHECK --interval=30s --timeout=3s --start-period=15s --retries=3 \
  CMD curl -f http://localhost:3000/api/v1/health || exit 1

# Start the application
CMD ["node", ".output/server/index.mjs"]