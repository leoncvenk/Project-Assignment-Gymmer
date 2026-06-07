# Live GPS over MQTT

The mobile application publishes GPS sensor updates directly over MQTT without storing them in the database first.

## Topic

```txt
gymmer/live/{userId}/{deviceId}/location
gymmer/live/{userId}/{deviceId}/heartbeat
gymmer/live/{userId}/{deviceId}/status

{
  "userId": "user-id",
  "deviceId": "device-id",
  "latitude": 46.0569,
  "longitude": 14.5058,
  "accuracy": 12,
  "speed": 1.4,
  "timestamp": "2026-06-07T20:30:00.000Z"
}

User logs in on the mobile app.
Mobile app connects to the Mosquitto broker.
User starts activity tracking.
App reads GPS location updates.
Each GPS update is published to the MQTT location topic.
Web clients can subscribe to gymmer/live/+/+/location for live updates.