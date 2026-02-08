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

# Build with full error output
RUN echo "=== Starting Next.js build ===" && \
    npm run build 2>&1 | tee /tmp/build.log; \
    BUILD_EXIT=${PIPESTATUS[0]}; \
    echo "=== Build exit code: $BUILD_EXIT ==="; \
    if [ $BUILD_EXIT -ne 0 ]; then \
      echo "=== BUILD FAILED - Showing last 50 lines ==="; \
      tail -50 /tmp/build.log; \
      echo "=== Checking .next directory ==="; \
      ls -la .next/ 2>&1 || echo ".next not found"; \
      echo "=== BUILD FAILED - Cannot continue ==="; \
      exit 1; \
    fi; \
    echo "=== Build successful ==="; \
    ls -la .next/

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

USER nextjs

EXPOSE 3000

CMD ["npm", "start"]
