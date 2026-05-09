from dataclasses import asdict
from datetime import datetime, timezone
from uuid import uuid4

from app.core.database import get_db
from app.models.user_profile import UserProfile
from app.schemas.user_profile_schema import CreateUserProfileSchema, UpdateUserProfileSchema
from app.services.user_service import UserService

USER_PROFILES_COLLECTION = "user_profiles"


def _now() -> datetime:
    return datetime.now(timezone.utc)


def _profile_from_document(document: dict) -> UserProfile:
    return UserProfile(
        id=document["id"],
        user_id=document["user_id"],
        height_cm=document["height_cm"],
        weight_kg=document["weight_kg"],
        goal_weight_kg=document["goal_weight_kg"],
        activity_level=document["activity_level"],
        goal_type=document["goal_type"],
        created_at=document["created_at"],
        updated_at=document["updated_at"],
    )


class UserProfileService:
    def __init__(self):
        self.user_service = UserService()

    @property
    def collection(self):
        return get_db()[USER_PROFILES_COLLECTION]

    async def create_or_replace_profile(
        self,
        user_id: str,
        data: CreateUserProfileSchema,
    ) -> UserProfile:
        existing = await self.collection.find_one({"user_id": user_id})
        now = _now()

        if existing:
            profile = UserProfile(
                id=existing["id"],
                user_id=user_id,
                height_cm=data.height_cm,
                weight_kg=data.weight_kg,
                goal_weight_kg=data.goal_weight_kg,
                activity_level=data.activity_level,
                goal_type=data.goal_type,
                created_at=existing["created_at"],
                updated_at=now,
            )

            await self.collection.replace_one(
                {"user_id": user_id},
                asdict(profile),
            )
        else:
            profile = UserProfile(
                id=str(uuid4()),
                user_id=user_id,
                height_cm=data.height_cm,
                weight_kg=data.weight_kg,
                goal_weight_kg=data.goal_weight_kg,
                activity_level=data.activity_level,
                goal_type=data.goal_type,
                created_at=now,
                updated_at=now,
            )

            await self.collection.insert_one(asdict(profile))

        await self.user_service.mark_profile_completed(user_id)

        return profile

    async def update_profile(
        self,
        user_id: str,
        data: UpdateUserProfileSchema,
    ) -> UserProfile | None:
        existing = await self.collection.find_one({"user_id": user_id})

        if existing is None:
            return None

        update_data = data.model_dump(exclude_unset=True)
        update_data["updated_at"] = _now()

        await self.collection.update_one(
            {"user_id": user_id},
            {"$set": update_data},
        )

        updated = await self.collection.find_one({"user_id": user_id})

        if updated is None:
            return None

        return _profile_from_document(updated)

    async def get_profile_by_user_id(self, user_id: str) -> UserProfile | None:
        document = await self.collection.find_one({"user_id": user_id})

        if document is None:
            return None

        return _profile_from_document(document)