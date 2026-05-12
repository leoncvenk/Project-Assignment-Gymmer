export const MQTT_TOPICS = {
    location: (userId: string, deviceId: string) =>
        `gymmer/live/${userId}/${deviceId}/location`,

    heartbeat: (userId: string, deviceId: string) =>
        `gymmer/live/${userId}/${deviceId}/heartbeat`,

    activity: (userId: string, deviceId: string) =>
        `gymmer/live/${userId}/${deviceId}/activity`,

    allLocations: "gymmer/live/+/+/location",
    allHeartbeats: "gymmer/live/+/+/heartbeat",
    allActivites: "gymmer/live/+/+/activity",
};