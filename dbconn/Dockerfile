# Stage 1: Build the application
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Install dependencies (optimize cache by copying package files first)
COPY package.json package-lock.json tsconfig.json .env webpack.config.js ./

# Install TypeScript globally
RUN npm i -g typescript pnpm

RUN pnpm install --save-dev webpack webpack-cli ts-loader

# Install dependencies (including dev dependencies)
RUN pnpm install

# Copy source files and tsconfig.json
COPY ./src ./src

# Build the TypeScript project
RUN pnpm run build


FROM node:18-alpine as production

COPY --from=build /usr/local/bin /usr/local/bin
COPY --from=build /usr/local/lib /usr/local/lib

# Copy application code from build stage
COPY --from=build /app /app

EXPOSE 3000

WORKDIR /app

CMD ["pnpm", "run", "start"]