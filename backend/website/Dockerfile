# =========================
# Build stage
# =========================
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
COPY tsconfig*.json nest-cli.json ./
RUN npm install

# Copy Prisma schemas and generate clients
COPY prisma ./prisma
RUN npx prisma generate --schema=./prisma/content/schema.prisma \
 && npx prisma generate --schema=./prisma/log/schema.prisma \
 && npx prisma generate --schema=./prisma/message/schema.prisma \
 && npx prisma generate --schema=./prisma/social/schema.prisma \
 && npx prisma generate --schema=./prisma/user/schema.prisma


# Copy source
COPY apps ./apps
COPY libs ./libs

# Build ALL libs + apps
RUN npx nest build website-api-gateway \
 && npx nest build user \
 && npx nest build auth \
 && npx nest build log-app \
 && npx nest build content-app \
 && npx nest build history-app \
 && npx nest build board-app \
 && npx nest build connection-app \
 && npx nest build report-app \
 && npx nest build algorithm-app \
 && npx nest build sse \
 && npx nest build social-app \
 && npx nest build comment-app \
 && npx nest build notification-app


# =========================
# Runtime stage
# =========================
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

ENV NODE_ENV=production

# Default command is overridden per service
COPY ./docker/script/docker-entrypoint.sh /app/docker-entrypoint.sh
RUN chmod +x /app/docker-entrypoint.sh
ENTRYPOINT ["/app/docker-entrypoint.sh"]