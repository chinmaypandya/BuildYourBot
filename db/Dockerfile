# Stage 1: Build the application
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Install dependencies (optimize cache by copying package files first)
COPY package.json package-lock.json ./

# Install dependencies (including dev dependencies)
RUN npm i

# Install TypeScript globally
RUN npm i -g typescript pnpm

# Copy source files and tsconfig.json
COPY tsconfig.json ./
COPY src ./src

# Build the TypeScript project
RUN pnpm build


# Stage 2: Serve the application
FROM nginx:alpine AS production

# Set NODE_ENV to production
ENV NODE_ENV=production

# Copy the build files from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Default command to run the server
CMD ["nginx", "-g", "daemon off;"]