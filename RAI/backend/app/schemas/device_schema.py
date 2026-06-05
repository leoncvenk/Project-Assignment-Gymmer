from pydantic import BaseModel
from datetime import datetime
from typing import Literal, Optional

class DeviceBase(BaseModel):
    name: str
    device_type: Literal["watch", "phone", "headphones", "other"]
    manufacturer: Optional[str] = None
    model_name: Optional[str] = None
    os_name: Optional[str] = None
    os_version: Optional[str] = None

class DeviceCreate(DeviceBase):
    pass

class Device(DeviceBase):
    id: str
    user_id: str
    last_connected: datetime
    is_active: bool = True

    class Config:
        from_attributes = True