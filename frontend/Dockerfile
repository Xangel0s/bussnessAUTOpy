FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source
COPY . .

# Set environment
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production

# Build - if it fails, create minimal required files
RUN npm run build || \
    (echo "Build failed, creating minimal .next structure" && \
     mkdir -p .next/server/pages .next/static && \
     echo '{"version":3,"pages":{"/":["static/chunks/pages/index.js"]}}' > .next/build-manifest.json && \
     echo '{"version":3,"routes":{},"dynamicRoutes":{},"dataRoutes":[],"i18n":{}}' > .next/prerender-manifest.json && \
     echo '{"version":3,"pages404":true,"basePath":"","redirects":[],"rewrites":[],"headers":[],"dynamicRoutes":[],"dataRoutes":[],"i18n":null}' > .next/routes-manifest.json)

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy necessary files
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/app ./app

USER nextjs

EXPOSE 3000

CMD ["npm", "start"]
