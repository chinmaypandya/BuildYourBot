# Build stage
FROM node:23-alpine3.21 AS build

# Set current working directory
WORKDIR /app

# install pnpm
RUN npm install -g pnpm

# Copy project setup files for dependencies
COPY package.json pnpm-lock.yaml ./

# install project dependencies using pnpm
RUN pnpm install --frozen-lockfile

# cpy rest of the code
COPY tailwind.config.js .

COPY public ./public
COPY src ./src

# build the application
RUN pnpm build

FROM node:23-alpine3.21 as production

WORKDIR /app

RUN npm i -g serve

# Copy application code from build stage
COPY --from=build /app/build ./build

EXPOSE 3000

CMD ["serve", "-s", "build"]