from fastapi import FastAPI
from app.routes.foods import router as foods_router

app = FastAPI()

app.include_router(foods_router)