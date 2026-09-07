# Multi-stage production Dockerfile for PredictIQ Next.js + SQLite
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat python3 make g++

WORKDIR /app

# Dependency installation stage
FROM base AS deps
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci

# Builder stage
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/frontend/node_modules ./frontend/node_modules
COPY frontend ./frontend
COPY shared ./shared

WORKDIR /app/frontend
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Production runner stage
FROM base AS runner
WORKDIR /app/frontend

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Create persistent data directory for SQLite
RUN mkdir -p /app/frontend/data

COPY --from=builder /app/frontend/public ./public
COPY --from=builder /app/frontend/.next ./.next
COPY --from=builder /app/frontend/node_modules ./node_modules
COPY --from=builder /app/frontend/package.json ./package.json

EXPOSE 3000

VOLUME ["/app/frontend/data"]

CMD ["npm", "run", "start"]
