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

export interface HealthDataPayload {
  userId: string;
  timestamp: string; // ISO 8601 format
  deviceOs: 'ios' | 'android';
  metrics: {
    heartRateBpm: number | null;
    dailySteps: number;
    activeCaloriesKcal: number;
  };
}