# ---------- Build Stage ----------
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency files
COPY dynamic-api-dashboard/package.json ./
COPY dynamic-api-dashboard/yarn.lock ./

# Install dependencies (using Yarn)
RUN yarn install --frozen-lockfile

# Copy source code
COPY dynamic-api-dashboard/ .

# Build the application
RUN yarn build


# ---------- Production Stage ----------
FROM nginx:alpine

# Copy the build output to nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose nginx default port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
