import { api } from './api';
import * as Device from 'expo-device';

type DevicePayload = {
  name: string;
  device_type: 'phone';
  manufacturer: string | null;
  model_name: string | null;
  os_name: string | null;
  os_version: string | null;
};

function getCurrentPhonePayload(): DevicePayload {
  const deviceName = Device.deviceName || 'My phone';
  const modelName = Device.modelName || 'Unknown model';

  return {
    name: `${deviceName} (${modelName})`,
    device_type: 'phone',
    manufacturer: Device.manufacturer || null,
    model_name: modelName,
    os_name: Device.osName || null,
    os_version: Device.osVersion || null,
  };
}

export async function getConnectedDevices(token: string) {
  const response = await api.get('/api/users/me/devices', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export async function registerCurrentPhone(token: string) {
  const response = await api.post('/api/users/me/devices', getCurrentPhonePayload(), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export async function heartbeatCurrentPhone(token: string) {
  const response = await api.patch('/api/users/me/devices/heartbeat', getCurrentPhonePayload(), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export async function deactivateCurrentPhone(token: string) {
  const response = await api.patch(
    '/api/users/me/devices/deactivate-current',
    getCurrentPhonePayload(),
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}
