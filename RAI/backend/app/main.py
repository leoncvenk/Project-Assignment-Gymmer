from pathlib import Path

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from app.services.mqtt_service import mqtt_client
from app.routes.health import router as health_router 
from app.routes.foods import router as foods_router
from app.core.database import connect_to_mongo, close_mongo_connection
from app.routes.auth import router as auth_router
from app.routes.user_profile import router as user_profile_router
from app.routes.food_entries import router as food_entries_router
from app.routes import devices
from app.routes.nutrition_summary import (
    router as nutrition_summary_router,
)
from app.routes.nutrition_targets import (
    router as nutrition_targets_router,
)
from app.routes.dashboard import (
    router as dashboard_router,
)
from app.routes.food_recognition import (
    router as food_recognition_router,
)
from app.routes.recipes import router as recipes_router

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

UPLOADS_DIR = Path("uploads")
UPLOADS_DIR.mkdir(exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOADS_DIR), name="uploads")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
app.include_router(nutrition_targets_router)
app.include_router(dashboard_router)
app.include_router(food_recognition_router)
app.include_router(recipes_router)
app.include_router(devices.router, prefix="/api", tags=["devices"])