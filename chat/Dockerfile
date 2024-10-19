FROM python:3.12-bullseye AS build

RUN pip install streamlit python-dotenv requests aiohttp fastapi uvicorn

WORKDIR /app

COPY . .


FROM python:3.12-bullseye AS production

COPY --from=build /usr/local/bin /usr/local/bin
COPY --from=build /usr/local/lib /usr/local/lib

COPY --from=build /app /app

WORKDIR /app

CMD ["streamlit", "run", "app.py", "--server.port=8501", "--server.enableCORS=false", "--server.enableXsrfProtection=false"]