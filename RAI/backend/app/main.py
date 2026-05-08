from fastapi import FastAPI

from app.routes.health import router as health_router 
from app.routes.foods import router as foods_router
from app.core.database import connect_to_mongo, close_mongo_connection

app = FastAPI()

@app.on_event("startup")
async def startup():
    await connect_to_mongo()

@app.on_event("shutdown")
async def shutdown():
    await close_mongo_connection()

app.include_router(health_router)
app.include_router(foods_router)