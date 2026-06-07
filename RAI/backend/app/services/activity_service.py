import uuid
from datetime import date, timedelta

from app.schemas.activity_schema import ActivityCreate
from app.core.database import get_db


class ActivityService:
    @property
    def collection(self):
        return get_db()["activities"]

    async def get_daily_activity(self, user_id: str):
        today = date.today().isoformat()

        return await self.collection.find_one(
            {"user_id": user_id, "date": today}
        )

    async def get_activity_history(self, user_id: str, range_name: str):
        today = date.today()

        if range_name == "7d":
            days_count = 7
            start_date = today - timedelta(days=days_count - 1)

            cursor = self.collection.find({
                "user_id": user_id,
                "date": {
                    "$gte": start_date.isoformat(),
                    "$lte": today.isoformat()
                }
            })

            documents = await cursor.to_list(length=None)
            documents_by_date = {doc["date"]: doc for doc in documents}

            points = []

            for i in range(days_count):
                current_date = start_date + timedelta(days=i)
                current_date_str = current_date.isoformat()
                doc = documents_by_date.get(current_date_str, {})

                points.append({
                    "label": current_date.strftime("%a"),
                    "date": current_date_str,
                    "steps": doc.get("steps", 0),
                    "distance_meters": doc.get("distance_meters", 0.0),
                    "active_minutes": doc.get("active_minutes", 0),
                })

        elif range_name == "30d":
            days_count = 30
            start_date = today - timedelta(days=days_count - 1)

            cursor = self.collection.find({
                "user_id": user_id,
                "date": {
                    "$gte": start_date.isoformat(),
                    "$lte": today.isoformat()
                }
            })

            documents = await cursor.to_list(length=None)
            documents_by_date = {doc["date"]: doc for doc in documents}

            points = []

            for i in range(days_count):
                current_date = start_date + timedelta(days=i)
                current_date_str = current_date.isoformat()
                doc = documents_by_date.get(current_date_str, {})

                points.append({
                    "label": current_date.strftime("%d.%m"),
                    "date": current_date_str,
                    "steps": doc.get("steps", 0),
                    "distance_meters": doc.get("distance_meters", 0.0),
                    "active_minutes": doc.get("active_minutes", 0),
                })

        elif range_name == "12m":
            months = []

            year = today.year
            month = today.month

            for _ in range(12):
                months.append((year, month))

                month -= 1
                if month == 0:
                    month = 12
                    year -= 1

            months.reverse()

            start_year, start_month = months[0]
            start_date = date(start_year, start_month, 1)

            cursor = self.collection.find({
                "user_id": user_id,
                "date": {
                    "$gte": start_date.isoformat(),
                    "$lte": today.isoformat()
                }
            })

            documents = await cursor.to_list(length=None)

            grouped = {}

            for doc in documents:
                doc_date = doc.get("date", "")
                month_key = doc_date[:7]

                if month_key not in grouped:
                    grouped[month_key] = {
                        "steps": 0,
                        "distance_meters": 0.0,
                        "active_minutes": 0,
                    }

                grouped[month_key]["steps"] += doc.get("steps", 0)
                grouped[month_key]["distance_meters"] += doc.get("distance_meters", 0.0)
                grouped[month_key]["active_minutes"] += doc.get("active_minutes", 0)

            points = []

            for year, month in months:
                month_key = f"{year}-{month:02d}"
                month_label = date(year, month, 1).strftime("%b")
                values = grouped.get(month_key, {})

                points.append({
                    "label": month_label,
                    "date": month_key,
                    "steps": values.get("steps", 0),
                    "distance_meters": values.get("distance_meters", 0.0),
                    "active_minutes": values.get("active_minutes", 0),
                })

        else:
            return await self.get_activity_history(user_id, "7d")

        total_steps = sum(point["steps"] for point in points)
        total_distance_meters = sum(point["distance_meters"] for point in points)
        total_active_minutes = sum(point["active_minutes"] for point in points)

        return {
            "range": range_name,
            "total_steps": total_steps,
            "total_distance_meters": total_distance_meters,
            "total_active_minutes": total_active_minutes,
            "points": points,
        }

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