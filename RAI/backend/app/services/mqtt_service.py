import paho.mqtt.client as mqtt
import json
import logging
from datetime import datetime, timezone, timedelta

# Slovar naprav: ključ je deviceId, vrednost pa čas zadnjega heartbeata
active_devices = {}

# Funkcija za "čiščenje" starih naprav (duhovi, ki niso poslali heartbeata več kot 40s)
def clean_stale_devices():
    current_time = datetime.now(timezone.utc)
    # Ustvarimo seznam ključev za izbris, da ne brišemo neposredno iz slovarja med zanko
    stale_keys = []
    for device_id, last_seen in active_devices.items():
        if current_time - last_seen > timedelta(seconds=40):
            stale_keys.append(device_id)
            
    for key in stale_keys:
        del active_devices[key]
        logging.info(f"Naprava {key} je odstranjena zaradi neaktivnosti.")

def on_connect(client, userdata, flags, rc):
    logging.info("Connected to EMQX Cloud")
    client.subscribe("gymmer/live/+/+/heartbeat")

def on_message(client, userdata, msg):
    try:
        payload = json.loads(msg.payload)
        device_id = payload.get("deviceId")
        status = payload.get("status")
        
        # Če naprava javi, da je offline (LWT), jo takoj izbrišemo
        if status == "offline":
            if device_id in active_devices:
                del active_devices[device_id]
                logging.info(f"Naprava {device_id} se je odjavila (LWT).")
        # Če pošilja heartbeat (online), posodobimo čas
        elif status == "online":
            active_devices[device_id] = datetime.now(timezone.utc)
            logging.debug(f"Heartbeat sprejet za: {device_id}")
            
    except Exception as e:
        logging.error(f"Napaka pri MQTT sporočilu: {e}")

def get_active_count():
    # Preden preštejemo, vedno očistimo duhove
    clean_stale_devices()
    return len(active_devices)

mqtt_client = mqtt.Client()
mqtt_client.on_connect = on_connect
mqtt_client.on_message = on_message

mqtt_client.connect("broker.emqx.io", 1883, 60)
mqtt_client.loop_start()