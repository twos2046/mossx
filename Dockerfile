FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json package.json
COPY tsconfig.json tsconfig.json
COPY tsconfig.server.json tsconfig.server.json
COPY vite.config.ts vite.config.ts
COPY index.html index.html
COPY types.ts types.ts
COPY services services
COPY components components
COPY store store
COPY App.tsx App.tsx
COPY index.tsx index.tsx
COPY metadata.json metadata.json

RUN npm install
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server-dist ./server-dist
COPY package.json package.json

RUN npm install --omit=dev

EXPOSE 8080

CMD ["node", "server-dist/services/server/index.js"]
