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

ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=1337

HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=5 \
  CMD wget -qO- http://localhost:1337/_health || wget -qO- http://localhost:1337/admin || exit 1

CMD ["npm", "start"]
