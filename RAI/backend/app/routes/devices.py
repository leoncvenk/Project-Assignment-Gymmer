from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException
from app.schemas import device_schema
from app.core.security import get_current_user_id
from app.core.database import get_db

router = APIRouter(
    prefix="/users/me/devices",
    tags=["devices"]
)

ACTIVE_DEVICE_WINDOW_SECONDS = 120


def is_device_currently_active(device: dict) -> bool:
    last_connected = device.get("last_connected")

    if not last_connected:
        return False

    if device.get("is_active") is False:
        return False

    return last_connected >= datetime.utcnow() - timedelta(
        seconds=ACTIVE_DEVICE_WINDOW_SECONDS
    )


def serialize_device(device: dict) -> dict:
    return {
        "id": str(device["_id"]),
        "user_id": str(device["user_id"]),
        "name": device.get("name"),
        "device_type": device.get("device_type"),
        "manufacturer": device.get("manufacturer"),
        "model_name": device.get("model_name"),
        "os_name": device.get("os_name"),
        "os_version": device.get("os_version"),
        "last_connected": device.get("last_connected"),
        "is_active": is_device_currently_active(device),
    }


@router.get("", response_model=list[device_schema.Device])
async def list_my_devices(current_user_id: str = Depends(get_current_user_id)):
    db = get_db()

    devices = await db.devices.find({
        "user_id": current_user_id
    }).to_list(100)

    return [serialize_device(device) for device in devices]


@router.post("", response_model=device_schema.Device)
async def add_my_device(
    data: device_schema.DeviceCreate,
    current_user_id: str = Depends(get_current_user_id)
):
    db = get_db()

    existing_device = await db.devices.find_one({
        "user_id": current_user_id,
        "device_type": data.device_type,
        "model_name": data.model_name,
        "os_name": data.os_name,
    })

    if existing_device:
        await db.devices.update_one(
            {"_id": existing_device["_id"]},
            {
                "$set": {
                    "name": data.name,
                    "manufacturer": data.manufacturer,
                    "model_name": data.model_name,
                    "os_name": data.os_name,
                    "os_version": data.os_version,
                    "last_connected": datetime.utcnow(),
                    "is_active": True,
                }
            }
        )

        updated_device = await db.devices.find_one({
            "_id": existing_device["_id"]
        })

        return serialize_device(updated_device)

    new_device = {
        "user_id": current_user_id,
        "name": data.name,
        "device_type": data.device_type,
        "manufacturer": data.manufacturer,
        "model_name": data.model_name,
        "os_name": data.os_name,
        "os_version": data.os_version,
        "last_connected": datetime.utcnow(),
        "is_active": True,
    }

    result = await db.devices.insert_one(new_device)

    created_device = await db.devices.find_one({
        "_id": result.inserted_id
    })

    return serialize_device(created_device)


@router.patch("/heartbeat", response_model=device_schema.Device)
async def heartbeat_current_device(
    data: device_schema.DeviceCreate,
    current_user_id: str = Depends(get_current_user_id)
):
    db = get_db()

    existing_device = await db.devices.find_one({
        "user_id": current_user_id,
        "device_type": data.device_type,
        "model_name": data.model_name,
        "os_name": data.os_name,
    })

    if existing_device:
        await db.devices.update_one(
            {"_id": existing_device["_id"]},
            {
                "$set": {
                    "name": data.name,
                    "manufacturer": data.manufacturer,
                    "model_name": data.model_name,
                    "os_name": data.os_name,
                    "os_version": data.os_version,
                    "last_connected": datetime.utcnow(),
                    "is_active": True,
                }
            }
        )

        updated_device = await db.devices.find_one({
            "_id": existing_device["_id"]
        })

        return serialize_device(updated_device)

    new_device = {
        "user_id": current_user_id,
        "name": data.name,
        "device_type": data.device_type,
        "manufacturer": data.manufacturer,
        "model_name": data.model_name,
        "os_name": data.os_name,
        "os_version": data.os_version,
        "last_connected": datetime.utcnow(),
        "is_active": True,
    }

    result = await db.devices.insert_one(new_device)

    created_device = await db.devices.find_one({
        "_id": result.inserted_id
    })

    return serialize_device(created_device)


@router.patch("/deactivate-current")
async def deactivate_current_device(
    data: device_schema.DeviceCreate,
    current_user_id: str = Depends(get_current_user_id)
):
    db = get_db()

    existing_device = await db.devices.find_one({
        "user_id": current_user_id,
        "device_type": data.device_type,
        "model_name": data.model_name,
        "os_name": data.os_name,
    })

    if not existing_device:
        raise HTTPException(status_code=404, detail="Device not found")

    await db.devices.update_one(
        {"_id": existing_device["_id"]},
        {
            "$set": {
                "is_active": False,
                "last_connected": datetime.utcnow(),
            }
        }
    )

    return {
        "message": "Device deactivated successfully"
    }