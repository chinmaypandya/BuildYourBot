# Base image: Use the slim version of Python 3.12 for a smaller image size
FROM python:3.12-bullseye AS build

# Set working directory
WORKDIR /app

# Install Python dependencies separately to cache them
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copy application code after dependencies to avoid rebuilding on code changes
COPY . .

# Second stage: Production image, copying only necessary files
FROM python:3.12-bullseye AS production

# Set working directory
WORKDIR /app

# Copy over installed dependencies from the build stage to avoid reinstalling
COPY --from=build /usr/local/lib/python3.12/site-packages /usr/local/lib/python3.12/site-packages
COPY --from=build /usr/local/bin /usr/local/bin

# Copy application code from the build stage
COPY --from=build /app /app

# Expose the necessary port
EXPOSE 8501

# Command to run the Streamlit app
CMD ["streamlit", "run", "app.py", "--server.port=8501", "--server.enableCORS=false", "--server.enableXsrfProtection=false", "--server.baseUrlPath=/c"]
