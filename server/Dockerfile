FROM ghcr.io/withlogicco/poetry:1.8.3 AS build

WORKDIR /app/server

COPY . .

# Install dependencies without activating the shell, using poetry's virtualenv
RUN poetry config virtualenvs.create false \
    && poetry install --no-interaction --no-ansi

EXPOSE 8000