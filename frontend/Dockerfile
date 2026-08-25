ARG NODE_VERSION=26.7.0-alpine3.24@sha256:aadf416b2cdce311a8811ba3f0608a61b77dbf997500e2eafe781b51f6a0b019
ARG NGINX_VERSION=1.31.4-alpine3.24@sha256:901e944d1f4fc2bd077e8f5568b98c1f6f8cdacf6b97a87747c43134a339b9a7

# --- STAGE 1: BUILD APP ---
FROM node:${NODE_VERSION} AS build

# Set the working directory inside the container
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application source code
COPY . .

RUN npm run build -- --configuration=production


# --- STAGE 2: SERVE BUILD APP WITH NGINX WEB SERVER (non-root) ---
FROM nginxinc/nginx-unprivileged:${NGINX_VERSION} AS production

USER root

RUN rm -rf /usr/share/nginx/html/*
COPY --from=build --chown=nginx:nginx /app/dist/frontend /usr/share/nginx/html
COPY --chown=nginx:nginx nginx.conf /etc/nginx/conf.d/default.conf

# The unprivileged image listens on 8080 instead of 80
RUN sed -i 's/listen 80;/listen 8080;/' /etc/nginx/conf.d/default.conf

USER nginx
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]