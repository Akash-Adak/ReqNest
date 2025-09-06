FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy all files & build
COPY . .
RUN npm run build

# Expose Vite preview port
EXPOSE 5173

# Run Vite preview server
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0"]
