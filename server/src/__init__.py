from fastapi import FastAPI

from .api import router as app_router

app = FastAPI()

app.include_router(app_router)