from fastapi import APIRouter, HTTPException
from app.core.database import get_db

router = APIRouter()

@router.get("/health/db")
async def health_db():
    try:
        db = get_db()
        await db.command("ping")
        return {"status": "ok"}
    except Exception as e:
        return {"error": str(e)}
        raise HTTPException(status_code=503, detail="db_unreachable")