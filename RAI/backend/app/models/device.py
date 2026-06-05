from dataclasses import dataclass
from datetime import datetime
from typing import Literal

DeviceType = Literal["watch", "phone", "headphones", "other"]

@dataclass(frozen=True)
class Device:
    id: str  
    user_id: str
    name: str
    device_type: DeviceType
    last_connected: datetime