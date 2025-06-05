# Stage 1: Use the NODE image to install dependencies
FROM node:20-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN npm install -g pnpm

# Stage 2: Use the dependencies stage to build the Angular application
FROM base AS dependencies
WORKDIR /app
COPY package.json /app
RUN pnpm install --no-lockfile

FROM dependencies AS builder
WORKDIR /app
ARG DEVEXTREME_KEY
COPY . /app
RUN DEVEXTREME_KEY=$DEVEXTREME_KEY node add-devextreme-license
RUN pnpm run build:prod:vps

# Stage 3: Use the Nginx image to serve the built Angular application
FROM nginx:alpine-slim
COPY --from=builder /app/dist/inspector-web-frontend/browser /usr/share/nginx/html
#COPY --from=builder /app/dist/inspector-web-frontend/browser /usr/share/nginx/html/inspector
#COPY --from=builder /app/dist/inspector-web-frontend/browser/index.html /usr/share/nginx/html/index.html
COPY ./nginx-custom.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
