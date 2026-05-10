from fastapi import APIRouter, HTTPException
from app.core.database import get_db

router = APIRouter()

@router.get(
    "/health/db",
    summary="Check database health",
    description="Verifies MongoDB connectivity and returns the current database health status.",
)
async def health_db():
    try:
        db = get_db()
        await db.command("ping")
        return {"status": "ok"}
    except Exception:
        raise HTTPException(
            status_code=503,
            detail="db_unreachable",
        )