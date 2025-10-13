# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY dynamic-api-dashboard/package*.json ./

# Install dependencies
RUN npm ci --legacy-peer-deps

# Copy source code
COPY dynamic-api-dashboard/ .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built application
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]