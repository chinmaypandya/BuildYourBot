# Stage 1: Build the application
FROM node:22-alpine AS build

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
RUN pnpm run type-check

# Build the TypeScript project
RUN pnpm run build


FROM node:22-alpine as production

WORKDIR /app

# Copy application code from build stage
COPY --from=build /app/ ./

EXPOSE 3000

CMD ["npm", "run", "start"]