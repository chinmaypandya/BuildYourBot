# Build stage
FROM node:18-alpine AS build

# Set current working directory
WORKDIR /app

# Copy project setup files for dependencies
COPY package.json package-lock.json ./

# install pnpm
RUN npm install -g pnpm

# Set up PNPM_HOME and update PATH
ENV PNPM_HOME=/usr/local/bin
ENV PATH=$PNPM_HOME:$PATH

RUN pnpm add -g serve

# install project dependencies using pnpm
RUN pnpm install

# cpy rest of the code
COPY . .

# build the application
RUN pnpm build

FROM node:18-alpine as production

COPY --from=build /usr/local/bin /usr/local/bin
COPY --from=build /usr/local/lib /usr/local/lib

# Copy application code from build stage
COPY --from=build /app/build /app/build

EXPOSE 3000

WORKDIR /app/build

CMD ["serve", "-s", "."]


# # lightweight server in production
# FROM nginx:alpine AS production

# # Copy the build files from the build stage
# COPY --from=build /app/build /usr/share/nginx/html

# # Default command to run the server
# CMD ["nginx", "-g", "daemon off;"]