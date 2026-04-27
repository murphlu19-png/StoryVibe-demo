# StoryVibe — Full Stack Container
# Builds both frontend and backend in a single image

FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Build frontend
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy built frontend
COPY --from=builder /app/dist ./dist

# Copy backend
COPY --from=builder /app/server ./server
COPY --from=builder /app/package*.json ./

# Install production dependencies for backend only
RUN npm install --legacy-peer-deps --omit=dev

# Expose ports
EXPOSE 3000 3001

# Start both frontend (static) and backend
CMD ["sh", "-c", "npx serve dist -l 3000 --single & node server/index.js"]
