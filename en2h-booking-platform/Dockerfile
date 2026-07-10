# Stage 1: Build the NestJS application
FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy codebase and compile
COPY . .
RUN npm run build

# Stage 2: Run in production
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Install only production dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy compiled build output from compiler stage
COPY --from=builder /app/dist ./dist

# Expose port and start
EXPOSE 3000
CMD ["node", "dist/main"]
