
# Use Node.js LTS as base image
FROM node:20-alpine as builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build frontend application
RUN npm run build

# Production stage
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Create app directories
RUN mkdir -p /app/frontend /app/backend /app/database

# Copy backend dependencies
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/src/backend ./backend
COPY --from=builder /app/src/database ./database

# Install production dependencies only
RUN npm ci --only=production

# Copy built frontend from builder stage
COPY --from=builder /app/dist ./frontend/dist

# Expose ports for frontend and backend
EXPOSE 8080
EXPOSE 5000

# Create a startup script
RUN echo '#!/bin/sh\n\
echo "Starting TunisBus Harmony Scheduler..."\n\
cd /app\n\
echo "Starting backend server..."\n\
node ./backend/server.js &\n\
echo "Starting frontend server..."\n\
cd ./frontend\n\
npx serve -s dist -l 8080\n\
wait\n\
' > /app/start.sh && chmod +x /app/start.sh

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Run the application
CMD ["/app/start.sh"]
