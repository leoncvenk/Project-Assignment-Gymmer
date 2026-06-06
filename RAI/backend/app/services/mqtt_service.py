import paho.mqtt.client as mqtt
import json
import logging
import os
from dotenv import load_dotenv
from pathlib import Path
from datetime import datetime, timezone, timedelta

root_dir = Path(__file__).resolve().parents[4] 
env_path = root_dir / 'NPO' / '.env'

if env_path.exists():
    load_dotenv(dotenv_path=env_path)
    print(f"DEBUG: .env loaded from: {env_path}")
else:
    print(f"WARNING: .env file does not exist at {env_path}, using default values.")

MQTT_BROKER = os.getenv("MQTT_BROKER_HOST", "127.0.0.1")
MQTT_PORT = int(os.getenv("MQTT_PORT", 1883))

print(f"DEBUG: Configuration - Broker: {MQTT_BROKER}, Port: {MQTT_PORT}")


logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
active_devices = {}

def clean_stale_devices():
    current_time = datetime.now(timezone.utc)
    stale_keys = []
    
    for device_id, data in active_devices.items():
        last_seen = data.get('last_seen') if isinstance(data, dict) else data
        
        if current_time - last_seen > timedelta(seconds=40):
            stale_keys.append(device_id)
            
    for key in stale_keys:
        del active_devices[key]
        logging.info(f"Device {key} removed (timeout).")

def on_connect(client, userdata, flags, rc, properties=None):
    if rc == 0:
        logging.info(f"Successfully connected to broker: {MQTT_BROKER}")
        client.subscribe("gymmer/live/#")
    else:
        logging.error(f"Connection error, code: {rc}")

def on_message(client, userdata, msg):
    print(f"DEBUG: Message received on topic: {msg.topic}") 
    try:
        topic_parts = msg.topic.split('/')
        user_id = topic_parts[2] 
        
        payload = json.loads(msg.payload)
        device_id = payload.get("deviceId")
        status = payload.get("status")
        
        if status == "offline":
            active_devices.pop(device_id, None)
        elif status == "online":
            active_devices[device_id] = {
                "last_seen": datetime.now(timezone.utc),
                "user_id": user_id
            }
    except Exception as e:
        logging.error(f"Error: {e}")

mqtt_client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION1)
mqtt_client.on_connect = on_connect
mqtt_client.on_message = on_message

try:
    mqtt_client.connect(MQTT_BROKER, MQTT_PORT, 60)
    #mqtt_client.loop_start()
    logging.info("MQTT service started successfully.")
except Exception as e:
    logging.critical(f"Could not connect to broker: {e}")

def get_active_count():
    clean_stale_devices() 
    return len(active_devices)