export type ActivityType =
    | "running"
    | "walking"
    | "cycling";

export type ActivityEvent =
    | "started"
    | "paused"
    | "resumed"
    | "stopped";

export type LiveLocationMessage = {
    userId: string;
    deviceId: string;
    activityId: string;
    activityType: ActivityType
    latitude: number;
    longitude: number;
    accuracy?: number;
    speed?: number;
    timestamp: string;
};

export type HeartbeatMessage = {
    userId: string;
    deviceId: string;
    status: "online";
    timestamp: string;
};

export type ActivityMessage = {
    userId: string;
    deviceId: string;
    activityId: string;
    event: ActivityEvent;
    activityType?: ActivityType
    timestamp: string;
};