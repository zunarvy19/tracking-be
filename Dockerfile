# ── Stage 1: Build ────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package.json ./
RUN npm install --legacy-peer-deps

# Copy source and build
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# ── Stage 2: Production ──────────────────────────────────────────────────────
FROM node:20-alpine AS production

WORKDIR /app

# Install production deps only
COPY package.json ./
RUN npm install --omit=dev --legacy-peer-deps

# Copy built output and drizzle migrations
COPY --from=builder /app/dist ./dist
COPY drizzle ./drizzle
COPY drizzle.config.ts ./

# Copy source for seed/migration scripts (tsx needs .ts files)
COPY src ./src
COPY tsconfig.json ./
# Install tsx for running seed/migration scripts
RUN npm install tsx drizzle-kit

# Non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

EXPOSE 6969

CMD ["node", "dist/index.js"]
