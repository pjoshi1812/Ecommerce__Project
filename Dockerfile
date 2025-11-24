###########################################
# STEP 1 — Build FRONTEND (Vite)
###########################################
FROM nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085/library/node:20-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

###########################################
# STEP 2 — Build BACKEND
###########################################
FROM nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085/library/node:20-alpine AS backend-build
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci
COPY backend/ ./
RUN mkdir -p /app/backend/public
COPY --from=frontend-build /app/frontend/dist/ /app/backend/public/

###########################################
# STEP 3 — Final runtime
###########################################
FROM nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085/library/node:20-alpine
WORKDIR /app
COPY --from=backend-build /app/backend ./
EXPOSE 5000
CMD ["node", "server.js"]
