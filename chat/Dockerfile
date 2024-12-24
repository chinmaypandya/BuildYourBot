# Stage 1: Build the application
FROM node:22-alpine AS build

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

# Build the project
CMD ["pnpm", "run", "serve", "--host", "0.0.0.0"]


# FROM node:22-alpine as production

# COPY --from=build /usr/local/bin /usr/local/bin
# COPY --from=build /usr/local/lib /usr/local/lib

# # Copy application code from build stage
# COPY --from=build /app /app

# EXPOSE 3000

# WORKDIR /app

# CMD ["pnpm", "run", "start"]