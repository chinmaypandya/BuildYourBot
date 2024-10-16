FROM python:3.11-bullseye AS build

RUN pip install streamlit python-dotenv requests

WORKDIR /app

COPY . .


FROM python:3.11-slim AS production

COPY --from=build /usr/local/bin /usr/local/bin
COPY --from=build /usr/local/lib /usr/local/lib

COPY --from=build /app /app

WORKDIR /app

CMD ["streamlit", "run", "app.py", "--host", "0.0.0.0"]