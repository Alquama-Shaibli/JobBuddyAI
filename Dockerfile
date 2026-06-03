# ── Stage 1: Build React frontend ────────────────────────────
FROM node:20-alpine AS frontend-builder

WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci --silent
COPY client/ ./
RUN npm run build
# Output: /app/client/dist/

# ── Stage 2: Production backend ───────────────────────────────
FROM node:20-alpine AS production

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Set workdir to repo root so __dirname-relative paths resolve correctly
WORKDIR /app

# Install server deps first (layer cache)
COPY server/package*.json ./server/
RUN cd server && npm ci --omit=dev --silent

# Copy server source into server/
COPY server/ ./server/

# Copy built frontend into client/dist/ (matches server/index.js path)
# server/index.js: path.join(__dirname, '..', 'client', 'dist')
# __dirname = /app/server → client/dist = /app/client/dist ✅
COPY --from=frontend-builder /app/client/dist ./client/dist/

# Logs & uploads dirs
RUN mkdir -p server/logs server/uploads && chown -R appuser:appgroup /app

USER appuser

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD wget -qO- http://localhost:8080/api/v1/health || exit 1

# Run from /app so process.cwd() = /app (though server uses __dirname, not cwd)
CMD ["node", "server/index.js"]
