FROM node:20-alpine AS builder

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@8.15.0 --activate

# Copy everything needed for install
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages ./packages
COPY apps/api ./apps/api

# Install all dependencies
RUN pnpm install --frozen-lockfile

# Explicitly generate Prisma Client
WORKDIR /app/apps/api
RUN pnpm prisma generate

# Verify it was generated (debug step)
RUN echo "Checking Prisma Client..." && \
    (ls -la /app/node_modules/.prisma/client || echo "Not in /app/node_modules") && \
    (ls -la /app/apps/api/node_modules/.prisma/client || echo "Not in /app/apps/api/node_modules")

# Build the application
RUN pnpm build

# =====================
# Production stage
# =====================
FROM node:20-alpine AS runner

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@8.15.0 --activate

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages ./packages
COPY apps/api/package.json ./apps/api/package.json
COPY apps/api/prisma ./apps/api/prisma

# Install production dependencies
RUN pnpm install --frozen-lockfile --prod

# Copy built application
COPY --from=builder /app/apps/api/dist ./apps/api/dist

# Copy Prisma Client (check both possible locations)
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma/ 2>/dev/null || true
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma/ 2>/dev/null || true
COPY --from=builder /app/apps/api/node_modules/.prisma ./apps/api/node_modules/.prisma/ 2>/dev/null || true
COPY --from=builder /app/apps/api/node_modules/@prisma ./apps/api/node_modules/@prisma/ 2>/dev/null || true

WORKDIR /app/apps/api

EXPOSE 5002

CMD sh -c "pnpm prisma generate && pnpm prisma migrate deploy && node dist/main.js"