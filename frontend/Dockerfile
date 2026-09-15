# Multi-stage Dockerfile for Disciplina Web Frontend (React + Vite + Nginx)

# Stage 1: Build static assets
FROM node:20-alpine AS builder
WORKDIR /app

# Optimize build cache by copying package manifests first
COPY package*.json ./
RUN npm ci

# Copy source files and compile SPA
COPY . .
RUN npm run build

# Stage 2: Production Nginx runtime
FROM nginx:1.27-alpine
WORKDIR /usr/share/nginx/html

# Clean default Nginx html content
RUN rm -rf ./*

# Copy compiled SPA bundle from builder stage
COPY --from=builder /app/dist .

# Copy custom Nginx virtual host configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

STOPSIGNAL SIGQUIT

CMD ["nginx", "-g", "daemon off;"]
