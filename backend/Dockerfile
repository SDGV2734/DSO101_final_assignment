# syntax=docker/dockerfile:1.7

FROM node:22-alpine AS deps
WORKDIR /app

RUN apk add --no-cache 'zlib>=1.3.2-r0' openssl

COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN npm ci

FROM deps AS build
COPY tsconfig.json ./
COPY src ./src
RUN npm run prisma:generate
RUN npm run build

FROM node:22-alpine AS runtime
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=4000

RUN apk add --no-cache 'zlib>=1.3.2-r0' dumb-init openssl

COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN npm ci --omit=dev && npm cache clean --force
RUN ./node_modules/.bin/prisma generate
RUN rm -rf /usr/local/lib/node_modules/npm /usr/local/bin/npm /usr/local/bin/npx

COPY --from=build /app/dist ./dist
COPY docker/entrypoint.sh ./docker/entrypoint.sh
RUN chmod +x ./docker/entrypoint.sh && chown -R node:node /app

USER node
EXPOSE 4000

ENTRYPOINT ["dumb-init", "--", "./docker/entrypoint.sh"]
CMD ["node", "dist/server.js"]
