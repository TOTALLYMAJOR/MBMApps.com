FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json* ./
COPY tsconfig.base.json ./
COPY apps/web/package.json apps/web/package.json
COPY packages/contracts/package.json packages/contracts/package.json

RUN npm install --workspaces --include-workspace-root --ignore-scripts

COPY apps/web ./apps/web
COPY packages/contracts ./packages/contracts
COPY content ./content

RUN npm run build --workspace @mbm/contracts && npm run build --workspace web

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY package.json package-lock.json* ./
COPY apps/web/package.json apps/web/package.json
COPY packages/contracts/package.json packages/contracts/package.json

RUN npm install --omit=dev --workspaces --include-workspace-root --ignore-scripts

COPY --from=builder /app/apps/web/.next ./apps/web/.next
COPY --from=builder /app/apps/web/public ./apps/web/public
COPY --from=builder /app/apps/web/next.config.mjs ./apps/web/next.config.mjs
COPY --from=builder /app/apps/web/postcss.config.mjs ./apps/web/postcss.config.mjs
COPY --from=builder /app/apps/web/tailwind.config.ts ./apps/web/tailwind.config.ts
COPY --from=builder /app/apps/web/app ./apps/web/app
COPY --from=builder /app/apps/web/components ./apps/web/components
COPY --from=builder /app/apps/web/lib ./apps/web/lib
COPY --from=builder /app/apps/web/package.json ./apps/web/package.json
COPY --from=builder /app/apps/web/tsconfig.json ./apps/web/tsconfig.json
COPY --from=builder /app/apps/web/next-env.d.ts ./apps/web/next-env.d.ts
COPY --from=builder /app/content ./content
COPY --from=builder /app/packages/contracts/dist ./packages/contracts/dist

EXPOSE 3001
CMD ["npm", "run", "start", "--workspace", "web"]
