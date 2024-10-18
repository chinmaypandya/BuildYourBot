# Build stage
FROM node:latest AS build

# Set current working directory
WORKDIR /app

# Copy project setup files for dependencies
COPY package.json package-lock.json ./

# install pnpm
RUN npm install -g pnpm

# install project dependencies using pnpm
RUN pnpm install

# cpy rest of the code
COPY . .

# build the application
RUN pnpm build


# lightweight server in production
FROM nginx:alpine AS production

# Copy the build files from the build stage
COPY --from=build /app/build /usr/share/nginx/html

# Default command to run the server
CMD ["nginx", "-g", "daemon off;"]