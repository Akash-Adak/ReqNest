FROM node:20-alpine AS builder

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

WORKDIR /app
COPY dynamic-api-dashboard/package.json ./
COPY dynamic-api-dashboard/yarn.lock ./
RUN yarn install --frozen-lockfile
COPY dynamic-api-dashboard/ .
RUN yarn build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
