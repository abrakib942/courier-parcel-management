FROM node:20-alpine AS builder

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@8.15.0 --activate

COPY . .
RUN pnpm install --frozen-lockfile

WORKDIR /app/apps/api
RUN pnpm prisma generate
RUN pnpm build

# =====================
FROM node:20-alpine AS runner

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@8.15.0 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages ./packages
COPY apps/api ./apps/api
COPY --from=builder /app/apps/api/dist ./apps/api/dist

RUN pnpm install --frozen-lockfile --prod

WORKDIR /app/apps/api

# Generate Prisma Client in production
# RUN pnpm prisma generate

EXPOSE 5002

# CMD sh -c "pnpm prisma migrate deploy && node dist/main.js"

CMD sh -c "pnpm prisma generate --config prisma/prisma.config.ts && pnpm prisma migrate deploy --config prisma/prisma.config.ts && node dist/main.js"
