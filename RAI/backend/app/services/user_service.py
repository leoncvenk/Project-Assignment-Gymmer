from dataclasses import asdict
from datetime import datetime, timezone
from uuid import uuid4

from app.core.database import get_db
from app.core.security import hash_password
from app.models.user import User
from app.schemas.user_schema import CreateUserSchema

USERS_COLLECTION = "users"


def _now() -> datetime:
    return datetime.now(timezone.utc)


def _user_from_document(document: dict) -> User:
    return User(
        id=document["id"],
        username=document["username"],
        email=document["email"],
        hashed_password=document["hashed_password"],
        roles=document.get("roles", ["user"]),
        profile_completed=document.get("profile_completed", False),
        created_at=document["created_at"],
        updated_at=document["updated_at"],
        profile_image_url=document.get("profile_image_url"),
        profile_theme=document.get("profile_theme"),
        cartoon_avatar_url=document.get("cartoon_avatar_url"),
        use_cartoon_avatar=document.get("use_cartoon_avatar", False),
    )


class UserService:
    @property
    def collection(self):
        return get_db()[USERS_COLLECTION]

    async def create_user(self, data: CreateUserSchema) -> User | None:
        email = data.email.lower().strip()
        username = data.username.strip()

        existing = await self.collection.find_one({"email": email})

        if existing:
            return None

        now = _now()

        user = User(
            id=str(uuid4()),
            username=username,
            email=email,
            hashed_password=hash_password(data.password),
            roles=["user"],
            profile_completed=False,
            created_at=now,
            updated_at=now,
        )

        await self.collection.insert_one(asdict(user))

        return user

    async def get_user_by_username(self, username: str) -> User | None:
        document = await self.collection.find_one({"username": username})

        if document is None:
            return None

        return _user_from_document(document)

    async def get_user_by_email(self, email: str) -> User | None:
        document = await self.collection.find_one({"email": email.lower().strip()})

        if document is None:
            return None

        return _user_from_document(document)

    async def get_user_by_id(self, user_id: str) -> User | None:
        document = await self.collection.find_one({"id": user_id})

        if document is None:
            return None

        return _user_from_document(document)
    
    async def mark_profile_completed(self, user_id: str) -> None:
        await self.collection.update_one(
            {"id": user_id},
            {"$set": {"profile_completed": True, "updated_at": _now()}},
        )

    async def update_password(self, user_id: str, new_hashed_password: str) -> None:
        await self.collection.update_one(
            {"id": user_id},
            {"$set": {"hashed_password": new_hashed_password, "updated_at": _now()}},
        )

    async def update_user(self, user_id: str, updates: dict) -> User | None:
        updates["updated_at"] = datetime.now(timezone.utc)

        await self.collection.update_one(
            {"id": user_id},
            {"$set": updates},
        )

        return await self.get_user_by_id(user_id)