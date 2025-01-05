# Stage 0, based on Node.js, to build and compile Angular
FROM node:18-alpine3.19 as node
WORKDIR /app
COPY ./ /app/
RUN npm install
ARG configuration=production
RUN npm run build:prod:vps

# Stage 1, based on Nginx, to have only the compiled app, ready for production with Nginx
FROM nginx:alpine-slim
COPY --from=node /app/dist/inspector-web-frontend /usr/share/nginx/html
COPY ./nginx-custom.conf /etc/nginx/conf.d/default.conf
