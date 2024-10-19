# Build stage
# FROM ghcr.io/withlogicco/poetry:1.8.3 AS build
FROM getflow/python-poetry:1.8-python3.12-slim AS build
# Set current working directory
WORKDIR /app
# copy the setup files to install dependencies
COPY pyproject.toml poetry.lock ./
# Install dependencies with poetry
# RUN poetry config virtualenvs.create false && poetry install
RUN poetry config virtualenvs.create false && poetry install --no-root
# copy the rest of the files
COPY . .

# RUN poetry install


FROM python:3.12-slim AS production
# Copy installed dependencies from build stage
COPY --from=build /usr/local/bin /usr/local/bin
COPY --from=build /usr/local/lib /usr/local/lib
# Copy application code from build stage
COPY --from=build /app /app
# ENV PATH="/usr/local/bin:$PATH"
EXPOSE 8000
WORKDIR /app
# Run the app using Uvicorn
# CMD ["python", "test.py"]
ENTRYPOINT ["uvicorn","src:app","--host","0.0.0.0","--port","8000","--reload"]