#!/usr/bin/env bash
set -euo pipefail

TOPIC="gymmer/live/user123/phone1/location"
MESSAGE='{"userId":"user123","deviceId":"phone1","activityId":"act1","activityType":"running","latitude":46.55,"longitude":15.64,"timestamp":"2026-05-13T00:00:00Z"}'
OUTPUT_FILE="/tmp/gymmer-mqtt-smoke-test.out"

cleanup() {
  rm -f "$OUTPUT_FILE"
}

trap cleanup EXIT

rm -f "$OUTPUT_FILE"

mosquitto_sub \
  -h localhost \
  -p 1883 \
  -t "gymmer/live/+/+/location" \
  -C 1 \
  > "$OUTPUT_FILE" &

SUB_PID=$!

sleep 2

mosquitto_pub \
  -h localhost \
  -p 1883 \
  -t "$TOPIC" \
  -m "$MESSAGE"

wait "$SUB_PID"

grep -Fq "$MESSAGE" "$OUTPUT_FILE"

echo "MQTT smoke test passed."