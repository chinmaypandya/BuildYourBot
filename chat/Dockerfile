# Stage 1: Build the application
FROM node:23-alpine3.21 AS build

# Set working directory
WORKDIR /app

# Install pnpm globally
RUN npm i -g pnpm

# Install dependencies (optimize cache by copying package files first)
COPY package.json pnpm-lock.yaml ./

# Install dependencies (including dev dependencies)
RUN pnpm install --frozen-lockfile

# Move config files (optimize cache by moving config files first)
COPY svelte.config.js eslint.config.js jsconfig.json tailwind.config.js vite.config.js .npmrc ./

# Copy source files
COPY . .

RUN pnpm run build && pnpm prune --prod && rm -rf /app/node_modules/.cache


# Stage 2: Serve the application
FROM node:23-alpine3.21 AS production

WORKDIR /app

ENV NODE_ENV=production

COPY --from=build /app/build ./build
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json

# Serve the project
ENTRYPOINT [ "node", "build" ]
