from sqlalchemy.orm import Session
from app.models.device import Device

def get_devices_for_user(db: Session, user_id: int):
    return db.query(Device).filter(Device.user_id == user_id).all()

def add_device(db: Session, user_id: int, device_data: dict):
    new_device = Device(**device_data, user_id=user_id)
    db.add(new_device)
    db.commit()
    db.refresh(new_device)
    return new_device