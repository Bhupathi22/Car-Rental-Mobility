# Production Multi-Stage Dockerfile for CAR RENTAL & MOBILITY Backend
FROM node:20-alpine AS builder

WORKDIR /app

COPY backend/package*.json ./
RUN npm ci

COPY backend/ ./

FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=5000

COPY --from=builder /app ./

EXPOSE 5000

CMD ["node", "src/server.js"]
