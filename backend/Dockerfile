# Use Node.js 20 Alpine
FROM node:20-alpine

WORKDIR /app

# Copy package.json & package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all backend files
COPY . .

# Expose backend port from .env (9000)
EXPOSE 9000

# Run server
CMD ["node", "server.js"]
