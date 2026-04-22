FROM oven/bun:1.1.26-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package.json ./
RUN bun install

FROM deps AS build
COPY tsconfig.json ./
COPY prisma ./prisma
COPY src ./src
RUN bunx prisma generate && bun run build

FROM oven/bun:1.1.26-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY package.json ./
RUN bun install --production

COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma

EXPOSE 3333

CMD ["bun", "dist/server.js"]
