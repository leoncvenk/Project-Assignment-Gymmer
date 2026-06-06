import { Platform } from 'react-native';
import type { HealthValue, HealthKitPermissions } from 'react-native-health';
import type { TimeRangeFilter } from 'react-native-health-connect/lib/typescript/types/base.types';

type DailyMetrics = {
  dailySteps: number;
  activeCaloriesKcal: number;
};

type HeartRateResult = {
  heartRateBpm: number | null;
};

const EMPTY_DAILY_METRICS: DailyMetrics = {
  dailySteps: 0,
  activeCaloriesKcal: 0,
};

function getTodayTimeRange() {
  const now = new Date();

  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();

  const endOfDay = now.toISOString();

  return {
    startOfDay,
    endOfDay,
  };
}

function getAppleHealthKit() {
  if (Platform.OS !== 'ios') {
    return null;
  }

  try {
    const healthModule = require('react-native-health');
    const AppleHealthKit = healthModule.default ?? healthModule;

    if (!AppleHealthKit?.initHealthKit) {
      console.warn(
        'Apple HealthKit native module is not available. Use a development build, not Expo Go.'
      );
      return null;
    }

    return AppleHealthKit;
  } catch (error) {
    console.warn('Apple HealthKit module could not be loaded:', error);
    return null;
  }
}

function getHealthConnect() {
  if (Platform.OS !== 'android') {
    return null;
  }

  try {
    const healthConnect = require('react-native-health-connect');

    if (
      !healthConnect?.initialize ||
      !healthConnect?.requestPermission ||
      !healthConnect?.readRecords
    ) {
      console.warn(
        'Health Connect native module is not available. Use a development build, not Expo Go.'
      );
      return null;
    }

    return healthConnect;
  } catch (error) {
    console.warn('Health Connect module could not be loaded:', error);
    return null;
  }
}

function initAppleHealthKit(AppleHealthKit: any, permissions: HealthKitPermissions): Promise<void> {
  return new Promise((resolve, reject) => {
    AppleHealthKit.initHealthKit(permissions, (error: string | null) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });
}

export async function getDailyMetrics(): Promise<DailyMetrics> {
  const { startOfDay, endOfDay } = getTodayTimeRange();

  const metrics: DailyMetrics = {
    dailySteps: 0,
    activeCaloriesKcal: 0,
  };

  try {
    if (Platform.OS === 'ios') {
      const AppleHealthKit = getAppleHealthKit();

      if (!AppleHealthKit) {
        return metrics;
      }

      const permissions: HealthKitPermissions = {
        permissions: {
          read: [
            AppleHealthKit.Constants.Permissions.StepCount,
            AppleHealthKit.Constants.Permissions.ActiveEnergyBurned,
          ],
          write: [],
        },
      };

      await initAppleHealthKit(AppleHealthKit, permissions);

      const steps = await new Promise<HealthValue>((resolve, reject) => {
        AppleHealthKit.getStepCount(
          {
            date: startOfDay,
          },
          (error: string | null, result: HealthValue) => {
            if (error) {
              reject(error);
              return;
            }

            resolve(result);
          }
        );
      });

      metrics.dailySteps = Math.round(steps?.value ?? 0);

      const activeEnergy = await new Promise<HealthValue[]>((resolve, reject) => {
        AppleHealthKit.getActiveEnergyBurned(
          {
            startDate: startOfDay,
            endDate: endOfDay,
          },
          (error: string | null, results: HealthValue[]) => {
            if (error) {
              reject(error);
              return;
            }

            resolve(results ?? []);
          }
        );
      });

      metrics.activeCaloriesKcal = Math.round(
        activeEnergy.reduce((total, record) => total + (record.value ?? 0), 0)
      );

      return metrics;
    }

    if (Platform.OS === 'android') {
      const HealthConnect = getHealthConnect();

      if (!HealthConnect) {
        return metrics;
      }

      await HealthConnect.initialize();

      await HealthConnect.requestPermission([
        {
          accessType: 'read',
          recordType: 'Steps',
        },
        {
          accessType: 'read',
          recordType: 'ActiveCaloriesBurned',
        },
      ]);

      const timeRangeFilter: TimeRangeFilter = {
        operator: 'between',
        startTime: startOfDay,
        endTime: endOfDay,
      };

      const stepsResult = await HealthConnect.readRecords('Steps', {
        timeRangeFilter,
      });

      metrics.dailySteps = Math.round(
        stepsResult.records.reduce((total: number, record: any) => total + (record.count ?? 0), 0)
      );

      const caloriesResult = await HealthConnect.readRecords('ActiveCaloriesBurned', {
        timeRangeFilter,
      });

      metrics.activeCaloriesKcal = Math.round(
        caloriesResult.records.reduce(
          (total: number, record: any) => total + (record.energy?.inKilocalories ?? 0),
          0
        )
      );

      return metrics;
    }

    return EMPTY_DAILY_METRICS;
  } catch (error) {
    console.error('Napaka pri branju dnevnih metrik:', error);
    return metrics;
  }
}

export async function getCurrentHeartRate(): Promise<HeartRateResult> {
  const { startOfDay, endOfDay } = getTodayTimeRange();

  try {
    if (Platform.OS === 'ios') {
      const AppleHealthKit = getAppleHealthKit();

      if (!AppleHealthKit) {
        return {
          heartRateBpm: null,
        };
      }

      const permissions: HealthKitPermissions = {
        permissions: {
          read: [AppleHealthKit.Constants.Permissions.HeartRate],
          write: [],
        },
      };

      await initAppleHealthKit(AppleHealthKit, permissions);

      const heartRateSamples = await new Promise<HealthValue[]>((resolve, reject) => {
        AppleHealthKit.getHeartRateSamples(
          {
            startDate: startOfDay,
            endDate: endOfDay,
            limit: 1,
          },
          (error: string | null, results: HealthValue[]) => {
            if (error) {
              reject(error);
              return;
            }

            resolve(results ?? []);
          }
        );
      });

      if (heartRateSamples.length === 0) {
        return {
          heartRateBpm: null,
        };
      }

      const latestSample = heartRateSamples[heartRateSamples.length - 1];

      return {
        heartRateBpm: latestSample?.value ?? null,
      };
    }

    if (Platform.OS === 'android') {
      const HealthConnect = getHealthConnect();

      if (!HealthConnect) {
        return {
          heartRateBpm: null,
        };
      }

      await HealthConnect.initialize();

      await HealthConnect.requestPermission([
        {
          accessType: 'read',
          recordType: 'HeartRate',
        },
      ]);

      const timeRangeFilter: TimeRangeFilter = {
        operator: 'between',
        startTime: startOfDay,
        endTime: endOfDay,
      };

      const heartRateResult = await HealthConnect.readRecords('HeartRate', {
        timeRangeFilter,
      });

      if (!heartRateResult.records || heartRateResult.records.length === 0) {
        return {
          heartRateBpm: null,
        };
      }

      const latestRecord = heartRateResult.records[heartRateResult.records.length - 1];

      if (!latestRecord.samples || latestRecord.samples.length === 0) {
        return {
          heartRateBpm: null,
        };
      }

      const latestSample = latestRecord.samples[latestRecord.samples.length - 1];

      return {
        heartRateBpm: latestSample.beatsPerMinute ?? null,
      };
    }

    return {
      heartRateBpm: null,
    };
  } catch (error) {
    console.error('Napaka pri branju srčnega utripa:', error);

    return {
      heartRateBpm: null,
    };
  }
}
