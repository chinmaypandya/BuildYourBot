# Stage 1: Build the application
FROM node:23-alpine3.21 AS build

# Set working directory
WORKDIR /app

# Install dependencies (optimize cache by copying package files first)
COPY package.json package-lock.json pnpm-lock.yaml ./

# Install TypeScript globally
RUN npm i -g pnpm

# Install dependencies (including dev dependencies)
RUN pnpm install --frozen-lockfile

# Move config files (optimize cache by moving config files first)
COPY tsconfig.json webpack.config.js ./

# Copy source files and tsconfig.json
COPY . .

# Compile typescript for type errors
RUN pnpm run type-check && pnpm run build


FROM node:23-alpine3.21 as production

WORKDIR /app

# Copy application code from build stage
COPY --from=build /app/build ./build
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json

EXPOSE 3000

ENTRYPOINT  [ "node", "build" ]