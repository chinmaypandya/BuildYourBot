FROM ghcr.io/withlogicco/poetry:1.8.3

WORKDIR /app/server

COPY . .
RUN poetry install

CMD ["poetry", "run" ,"python",  "-m" ,"buildyourbot"]