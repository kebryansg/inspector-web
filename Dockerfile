# Stage 0, based on Node.js, to build and compile Angular
FROM node:20-alpine3.21 as node
WORKDIR /app
ARG configuration=production
ARG DEVEXTREME_KEY
COPY ./ /app/
RUN npm install --no-audit
RUN DEVEXTREME_KEY=$DEVEXTREME_KEY node add-devextreme-license
RUN npm run build:prod:vps

# Stage 1, based on Nginx, to have only the compiled app, ready for production with Nginx
FROM nginx:alpine-slim
COPY --from=node /app/dist/inspector-web-frontend/browser /usr/share/nginx/html/inspector
COPY --from=node /app/dist/inspector-web-frontend/browser/index.html /usr/share/nginx/html/index.html
COPY ./nginx-custom.conf /etc/nginx/conf.d/default.conf
