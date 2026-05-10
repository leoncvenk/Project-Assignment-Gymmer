from fastapi import FastAPI

from app.routes.health import router as health_router 
from app.routes.foods import router as foods_router
from app.core.database import connect_to_mongo, close_mongo_connection
from app.routes.auth import router as auth_router
from app.routes.user_profile import router as user_profile_router
from app.routes.food_entries import router as food_entries_router
from app.routes.nutrition_summary import (
    router as nutrition_summary_router,
)

app = FastAPI()

@app.on_event("startup")
async def startup():
    await connect_to_mongo()

@app.on_event("shutdown")
async def shutdown():
    await close_mongo_connection()

app.include_router(health_router)
app.include_router(foods_router)
app.include_router(auth_router)
app.include_router(user_profile_router)
app.include_router(food_entries_router)
app.include_router(nutrition_summary_router)