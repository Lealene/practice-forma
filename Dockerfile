# Build stage
FROM node:22-alpine AS builder

# Disable Next.js telemetry during build (silences "Attention: Next.js now collects..." banner)
ENV NEXT_TELEMETRY_DISABLED=1

WORKDIR /app

# Copy dependency files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Enable corepack and use the pnpm version pinned in package.json
RUN corepack enable && corepack prepare pnpm@11.6.0 --activate && \
    pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build Next.js application
RUN pnpm build

# Production stage
FROM node:22-alpine

WORKDIR /app

# Enable pnpm via corepack
RUN corepack enable && corepack prepare pnpm@11.6.0 --activate

# Copy package files (pnpm-workspace.yaml needed for allowBuilds of native deps)
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Install production dependencies only
RUN pnpm install --frozen-lockfile --prod

# Copy built application from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./

# Set environment to production
ENV NODE_ENV=production \
    STRAPI_URL=http://host.docker.internal:1337 \
    NEXT_TELEMETRY_DISABLED=1

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start Next.js
CMD ["pnpm", "start"]
