FROM node:22-alpine
WORKDIR /opt/app

# Install deps first (cached)
COPY package.json package-lock.json* ./
RUN npm install

# Copy source
COPY . .

# Build admin panel
RUN npm run build

EXPOSE 1337

# Render injects PORT=10000 at runtime — do NOT hardcode PORT here.
# Fallback Strapi secrets — Render/GitHub has no .env (gitignored).
# Override these in Render dashboard with real secrets for production.
ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    APP_KEYS=tLD4pBKcfAZfQ9jFTRFldg==,DJrt3H0XncwGEYjSysI7QQ==,8UjFTAV7RdI+jhzcJVFQ8Q==,yHEFdqkZ6wwTBN2TPJ7+kA== \
    API_TOKEN_SALT=lZZAKQFoFF6T2VC6gbdk+w== \
    ADMIN_JWT_SECRET=UZzHESUPyOvQjT75lJFYMw== \
    TRANSFER_TOKEN_SALT=WZC3rGqzWJarL7xbgZwx9A== \
    JWT_SECRET=OR+Ew3O3o9OqegZBZSG9Mw== \
    ENCRYPTION_KEY=ZMbZScDzAiayVDML6YamXw== \
    DATABASE_CLIENT=sqlite \
    DATABASE_FILENAME=.tmp/data.db

# Ensure writable dirs for sqlite + uploads on Render ephemeral FS
RUN mkdir -p .tmp public/uploads

HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=5 \
  CMD wget -qO- http://localhost:${PORT:-1337}/_health || wget -qO- http://localhost:${PORT:-1337}/admin || exit 1

CMD ["npm", "start"]
