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
RUN poetry install

# copy the rest of the files
COPY . .

EXPOSE 8000

# Run the app using Uvicorn
CMD ["uvicorn", "src:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]