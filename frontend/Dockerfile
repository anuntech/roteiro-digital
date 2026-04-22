# Etapa 1: Build do aplicativo Next.js
FROM node:21-alpine AS builder

WORKDIR /app

RUN npm install -g bun && apk add --no-cache curl

COPY package.json bun.lock ./

RUN bun install

COPY . .

ARG API_BASE_URL

ENV API_BASE_URL=${API_BASE_URL}

RUN rm -rf .next

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
