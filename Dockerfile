FROM node:lts-alpine AS builder

WORKDIR /app

# Copy all files from current directory to working dir in image
COPY . .

ARG MODE=production

# install node modules and build assets
RUN npm install
RUN npm run $MODE

FROM nginx:alpine

# Set working directory to nginx asset directory
WORKDIR /usr/share/nginx/html

# Remove default nginx static assets
RUN rm -rf ./*

COPY --from=builder /app/dist .
COPY ./docker/nginx/default.conf /etc/nginx/conf.d/default.conf

# Containers run nginx with global directives and daemon off
ENTRYPOINT ["nginx", "-g", "daemon off;"]