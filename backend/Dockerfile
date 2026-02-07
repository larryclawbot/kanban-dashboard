# Backend Development Dockerfile
FROM node:22-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

EXPOSE 3001

CMD ["npm", "run", "start:dev"]
