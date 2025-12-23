# # build stage
# FROM node:20-alpine AS build
# WORKDIR /app
# COPY package*.json ./
# RUN npm install
# COPY . .
# RUN npm run build

# # production stage
# FROM nginx:alpine
# COPY --from=build /app/dist /usr/share/nginx/html
# COPY nginx/default.conf /etc/nginx/conf.d/default.conf
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]
# FROM mirror.gcr.io/library/node:18 AS build
# WORKDIR /app

# COPY package*.json ./
# RUN npm install --legacy-peer-deps

# COPY . .
# RUN npm run build   

# # Stage 2: Serve with Nginx
# FROM mirror.gcr.io/library/nginx:1.29.1
# COPY --from=build /app/dist /usr/share/nginx/html   

# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]


# Stage 1: Build
# -----------------------------
# Stage 1: Build Vite frontend
# -----------------------------
FROM node:18-alpine AS build

WORKDIR /app

# Accept backend URL during docker build
ARG VITE_BACKEND_URL
ENV VITE_BACKEND_URL=${VITE_BACKEND_URL}

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build


# -----------------------------
# Stage 2: Serve with Nginx
# -----------------------------
FROM nginx:1.25-alpine

# Copy build output
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]