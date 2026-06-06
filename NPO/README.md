# Gymmer Live (NPO)

MQTT-based real-time activity tracking extension for Gymmer.

---

## Start Services

Start the Mosquitto broker and all required containers:

```bash
docker-compose up -d
```

---

## Test MQTT Communication

Publish a test heartbeat message:

```bash
docker exec gymmer-mosquitto mosquitto_pub \
  -h localhost \
  -p 1883 \
  -t "gymmer/live/user123/test_telefon/heartbeat" \
  -m "{\"userId\":\"user123\",\"deviceId\":\"test_telefon\",\"status\":\"online\",\"timestamp\":\"2026-06-06T14:29:00Z\"}"
```

---

## Check Active Devices

Retrieve the number of currently active devices:

```http
GET http://localhost:8000/api/users/me/devices/active-count
```

You can test the endpoint using:

* Browser
* Postman
* Insomnia
* cURL

Example:

```bash
curl http://localhost:8000/api/users/me/devices/active-count
```
