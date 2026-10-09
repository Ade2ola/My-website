FROM node:24-alpine AS builder

WORKDIR /app

# Copy server package manifest
COPY server/package*.json ./server/
WORKDIR /app/server
RUN npm ci

# Copy Prisma schema and generate client
COPY server/prisma ./prisma
RUN npx prisma generate

# Copy entire repository source
WORKDIR /app
COPY . .

# Production Runner stage
FROM node:24-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

# Copy built dependencies and app source
COPY --from=builder /app /app

WORKDIR /app/server

EXPOSE 3000

USER node

CMD ["node", "src/server.js"]
