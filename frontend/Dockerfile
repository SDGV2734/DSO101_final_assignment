# syntax=docker/dockerfile:1.7

FROM node:22-alpine AS deps
WORKDIR /app

RUN apk add --no-cache 'zlib>=1.3.2-r0'

COPY package.json package-lock.json ./
RUN npm ci

FROM deps AS build
ARG VITE_API_URL=/api
ENV VITE_API_URL=${VITE_API_URL}

COPY index.html ./
COPY postcss.config.js tailwind.config.ts tsconfig.json tsconfig.app.json tsconfig.node.json vite.config.ts ./
COPY src ./src
RUN npm run build

FROM nginx:1.29-alpine AS runtime

RUN apk add --no-cache 'zlib>=1.3.2-r0' 'nghttp2-libs>=1.68.1'

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
