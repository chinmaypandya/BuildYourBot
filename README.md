# Project Name

BuildYourBot

This project consists of two main services:
1. **Client**: A web service located in the `client` folder.
2. **Server**: An API service located in the `server` folder.

Both services are orchestrated using Docker Compose.

## Prerequisites

- Docker: [Install Docker](https://docs.docker.com/get-docker/)
- Docker Compose: [Install Docker Compose](https://docs.docker.com/compose/install/)

## Project Structure

```bash
├── client/             # Web service (frontend)
│   ├── Dockerfile      # Dockerfile for client service
│   └── README.md       # Instructions for client service
├── server/             # API service (backend)
│   ├── Dockerfile      # Dockerfile for server service
│   └── README.md       # Instructions for server service
├── docker-compose.yml  # Compose file for managing multi-container setup
└── README.md           # Root project README
```

## Project setup

```bash
git clone https://github.com/your-repository/BuildYourBot.git
cd BuildYourBot
```

## Environment setup

Set up your .env files in respective folders
|--- client/.env
|--- server/.env

*Note:* The keys of the environment need to be added in the **docker-compose.yml** file in environment sections of respective services.

## Create/Run the app

```bash
docker compose up --build # to build/rebuild and run
docker compose up # to run
```

## Remove the app

```bash
docker compose down
```