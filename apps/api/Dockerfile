# =====================
# Build stage
# =====================
FROM node:20-alpine AS builder

WORKDIR /app

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@8.15.0 --activate

# Copy workspace files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages ./packages
COPY apps/api/package.json ./apps/api/package.json

# Install deps
RUN pnpm install --frozen-lockfile

# Copy source
COPY apps/api ./apps/api

# Build API (NO prisma here)
WORKDIR /app/apps/api
RUN pnpm build


FROM node:20-alpine AS runner

WORKDIR /app

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@8.15.0 --activate

# Copy workspace files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages ./packages
COPY apps/api/package.json ./apps/api/package.json

# Install prod deps only
RUN pnpm install --frozen-lockfile --prod

# Copy build output
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/prisma ./apps/api/prisma

WORKDIR /app/apps/api

EXPOSE 5002

# Prisma runs AFTER env vars exist (Render runtime)
CMD sh -c "pnpm prisma generate && pnpm prisma migrate deploy && node dist/main.js"
