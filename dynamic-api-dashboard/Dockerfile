FROM node:20-alpine AS builder

# Build-time API URL (not needed for runtime)
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

WORKDIR /app

COPY dynamic-api-dashboard/package.json ./
COPY dynamic-api-dashboard/yarn.lock ./
RUN yarn install --frozen-lockfile

COPY dynamic-api-dashboard/ ./
RUN yarn build


# ---- NGINX RUNTIME IMAGE ----
FROM nginx:alpine

# Copy nginx config
COPY dynamic-api-dashboard/nginx.conf /etc/nginx/conf.d/default.conf

# Copy build output
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy runtime entrypoint
COPY dynamic-api-dashboard/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 80
ENTRYPOINT ["/entrypoint.sh"]
