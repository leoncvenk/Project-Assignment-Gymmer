import uuid
from datetime import date
from app.schemas.activity_schema import ActivityCreate
from app.core.database import get_db 

class ActivityService:
    @property
    def collection(self):
        return get_db()["activities"]

    async def get_daily_activity(self, user_id: str):
        # Najde zadnji vnos za tega uporabnika za današnji datum
        today = date.today().isoformat()
        return await self.collection.find_one({"user_id": user_id, "date": today})

    async def sync_daily_activity(self, user_id: str, activity_data: ActivityCreate):
        target_date = activity_data.date or date.today().isoformat()

        existing_activity = await self.collection.find_one({
            "user_id": user_id,
            "date": target_date
        })

        if existing_activity:
            await self.collection.update_one(
                {"_id": existing_activity["_id"]},
                {"$set": {
                    "steps": activity_data.steps,
                    "distance_meters": activity_data.distance_meters,
                    "active_minutes": activity_data.active_minutes
                }}
            )
            existing_activity["steps"] = activity_data.steps
            existing_activity["distance_meters"] = activity_data.distance_meters
            existing_activity["active_minutes"] = activity_data.active_minutes
            existing_activity["date"] = target_date 
            existing_activity["id"] = existing_activity.get("id", str(existing_activity["_id"]))
            return existing_activity
        else:
            new_activity = {
                "id": str(uuid.uuid4()),
                "user_id": user_id,
                "date": target_date,
                "steps": activity_data.steps,
                "distance_meters": activity_data.distance_meters,
                "active_minutes": activity_data.active_minutes
            }
            await self.collection.insert_one(new_activity)
            return new_activity