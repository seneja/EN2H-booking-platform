# ---- Stage 1: Build ----
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency files first for better layer caching
COPY package*.json ./

RUN npm ci

# Copy source code and build
COPY . .

RUN npm run build

# ---- Stage 2: Production ----
FROM node:20-alpine AS production

WORKDIR /app

# Copy only the production dependencies and compiled output
COPY package*.json ./

RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist

# Expose the API port
EXPOSE 3000

# Start the application
CMD ["node", "dist/main"]
