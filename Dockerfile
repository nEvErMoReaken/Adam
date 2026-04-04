FROM node:20-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json yarn.lock .yarnrc.yml ./
# 移除 yarnPath 限制，让 corepack 直接管理
RUN sed -i '/yarnPath/d' .yarnrc.yml && \
    corepack enable && corepack prepare yarn@3.6.1 --activate && \
    yarn install --immutable

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN sed -i '/yarnPath/d' .yarnrc.yml && \
    corepack enable && corepack prepare yarn@3.6.1 --activate
ENV NEXT_TELEMETRY_DISABLED=1
ENV DOCKER=true
RUN yarn build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
CMD ["node", "server.js"]
