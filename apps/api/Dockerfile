FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json* ./
COPY tsconfig.base.json ./
COPY apps/api/package.json apps/api/package.json
COPY packages/contracts/package.json packages/contracts/package.json

RUN npm ci --workspaces --include-workspace-root --ignore-scripts

COPY apps/api ./apps/api
COPY packages/contracts ./packages/contracts

RUN npm run build --workspace @mbm/contracts && npm run build --workspace api

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY package.json package-lock.json* ./
COPY apps/api/package.json apps/api/package.json
COPY packages/contracts/package.json packages/contracts/package.json

RUN npm ci --omit=dev --workspaces --include-workspace-root --ignore-scripts

COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/packages/contracts/dist ./packages/contracts/dist

RUN chown -R node:node /app
USER node

EXPOSE 4000
CMD ["node", "apps/api/dist/server.js"]
