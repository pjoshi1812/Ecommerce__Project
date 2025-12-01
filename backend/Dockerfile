# # Use Node.js 20 Alpine
# FROM node:20-alpine

# WORKDIR /app

# # Copy package.json & package-lock.json
# COPY package*.json ./

# # Install dependencies
# RUN npm install

# # Copy all backend files
# COPY . .

# # Expose backend port from .env (9000)
# EXPOSE 9000

# # Run server
# CMD ["node", "server.js"]

# FROM mirror.gcr.io/library/node:18

# WORKDIR /app

# COPY package*.json ./
# RUN npm install --legacy-peer-deps

# COPY . .

# # Expose your API port
# EXPOSE 9001

# # Start your backend application
# CMD ["node", "server.js"]

FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 9000

CMD ["node", "server.js"]
