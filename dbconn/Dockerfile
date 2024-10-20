# Stage 1: Build the application
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Install dependencies (optimize cache by copying package files first)
COPY package.json package-lock.json ./

# Install TypeScript globally
RUN npm i -g typescript pnpm

# Set up PNPM_HOME and update PATH
ENV PNPM_HOME=/usr/local/bin
ENV PATH=$PNPM_HOME:$PATH

RUN pnpm add -g serve

# Install dependencies (including dev dependencies)
RUN pnpm install

# Copy source files and tsconfig.json
COPY tsconfig.json ./
COPY src ./src

# Build the TypeScript project
RUN pnpm build


FROM node:18-alpine as production

COPY --from=build /usr/local/bin /usr/local/bin
COPY --from=build /usr/local/lib /usr/local/lib

# Copy application code from build stage
COPY --from=build /app/build /app/build

EXPOSE 3000

WORKDIR /app/build

CMD ["serve", "-s", "."]