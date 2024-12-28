# Stage 1: Build the application
FROM node:23-alpine3.21 AS build

# Set working directory
WORKDIR /app

# Install dependencies (optimize cache by copying package files first)
COPY package.json pnpm-lock.yaml ./

# Install TypeScript globally
RUN npm i -g pnpm@9.9.0 && pnpm i --frozen-lockfile

COPY . .

# # Compile typescript for type errors
RUN npx tsc --project tsconfig.json &&  pnpm run build


FROM node:23-alpine3.21 as production

WORKDIR /app

# Copy application code from build stage
COPY --from=build /app/build ./build
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/.env ./.env

EXPOSE 3000

ENTRYPOINT  [ "npm", "run", "start" ]