# Stage 1: Build the application
FROM node:22-alpine AS build

# Set working directory
WORKDIR /app

# Install dependencies (optimize cache by copying package files first)
COPY package.json pnpm-lock.yaml ./

# Install TypeScript globally
RUN npm i -g pnpm

# Install dependencies (including dev dependencies)
RUN pnpm install --frozen-lockfile

# Move config files (optimize cache by moving config files first)
COPY tsconfig.json webpack.config.js .env ./

# Copy source files and tsconfig.json
COPY src ./src

# Compile typescript for type errors
RUN pnpm run type-check

# Build the TypeScript project
RUN pnpm run build


FROM node:22-alpine as production

WORKDIR /app

# Copy only the required dependencies
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./

# Copy application code from build stage
COPY --from=build /app/build ./build

EXPOSE 3000

# Run the application
CMD ["node", "build/bundle.js"]
# CMD ["pnpm", "run", "start"]