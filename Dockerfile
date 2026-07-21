# ============================================
# Stage 1: Build the Vite/React application
# ============================================
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files first to leverage Docker layer caching
COPY package*.json ./

# Install dependencies (use ci for reproducible builds, legacy-peer-deps to avoid Vite 8 peer conflict)
RUN npm ci --no-audit --no-fund --legacy-peer-deps || npm install --no-audit --no-fund --legacy-peer-deps


# Copy the rest of the source code
COPY . .

# Build the production bundle
RUN npm run build

# ============================================
# Stage 2: Serve with Node.js (Express) + live /api/stats
# ============================================
FROM node:20-alpine AS production

# Install wget for healthchecks
RUN apk add --no-cache wget

WORKDIR /app

# Copy only the production manifest so the runtime image installs only prod deps
COPY package*.json ./

# Install only production deps (express)
RUN npm ci --omit=dev --no-audit --no-fund --legacy-peer-deps \
    || npm install --omit=dev --no-audit --no-fund --legacy-peer-deps

# Copy the Express server
COPY server.js ./

# Copy built assets from the builder stage (served by Express as static)
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 8080 (mapped to host in docker-compose)
EXPOSE 8080

# Healthcheck - the Express server exposes /health
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:8080/health || exit 1

# Run the Express server (serves SPA + /api/stats for live Docker metrics)
CMD ["node", "server.js"]
