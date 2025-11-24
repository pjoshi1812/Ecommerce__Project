###########################################
# STEP 1 — Build FRONTEND (Vite React)
###########################################
FROM node:20-alpine AS frontend-build

WORKDIR /app/frontend

# Copy frontend package files
COPY frontend/package*.json ./

# Install dependencies
RUN npm install

# Copy frontend source
COPY frontend/ ./

# Build frontend
RUN npm run build



###########################################
# STEP 2 — Prepare BACKEND
###########################################
FROM node:20-alpine AS backend-build

WORKDIR /app/backend

# Copy backend package files
COPY backend/package*.json ./

# Install backend dependencies
RUN npm install

# Copy backend source code
COPY backend/ ./

# Create public folder if not exists
RUN mkdir -p /app/backend/public

# Copy frontend build output → backend/public
COPY --from=frontend-build /app/frontend/dist/ /app/backend/public/



###########################################
# STEP 3 — Final Production Image
###########################################
FROM node:20-alpine

WORKDIR /app

# Copy backend complete build
COPY --from=backend-build /app/backend ./

# Expose backend port (your backend runs on 5000)
EXPOSE 5000

# Run backend
CMD ["node", "server.js"]
