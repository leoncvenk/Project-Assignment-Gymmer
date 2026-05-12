# MQTT Flow

1. User starts activity in mobile app
2. Mobile app connects to Mosquitto
3. GPS location is published to MQTT topics
4. Heartbeat messages indicate active devices
5. Web dashboard subscribes to live topics
6. Dashboard updates maps and device state in real time
