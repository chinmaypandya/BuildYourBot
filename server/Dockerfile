# Build stage
FROM ghcr.io/withlogicco/poetry:1.8.3 AS build
RUN which poetry
# Ensure Poetry is in the PATH
# ENV PATH="/opt/poetry/bin"
# Set current working directory
WORKDIR /app
# copy the setup files to install dependencies
COPY pyproject.toml ./
# Install dependencies with poetry
RUN poetry config virtualenvs.create false && poetry install
# copy the rest of the files
COPY . .
FROM python:3.11-slim AS runner
# Copy installed dependencies from build stage
# COPY --from=build /usr/local/lib/python3.11 /usr/local/lib/python3.11
# COPY --from=build /usr/local/lib/python3.12 /usr/local/lib/python3.12
COPY --from=build /usr/local/bin /usr/local/bin
COPY --from=build /usr/local/lib /usr/local/lib
# Copy application code from build stage
COPY --from=build /app /app
EXPOSE 8000
WORKDIR /app
# Run the app using Uvicorn
CMD ["uvicorn", "src:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]