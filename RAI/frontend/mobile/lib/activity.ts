import axios from 'axios';
import { getAuthToken } from './auth';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export async function fetchActivityData() {
  if (!API_URL) return null;
  try {
    const token = await getAuthToken();
    if (!token) return null;
    const response = await axios.get(`${API_URL}/users/me/activity/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching activity:', error);
    return null;
  }
}

export async function syncActivityData(
  steps: number,
  distanceMeters: number = 0,
  activeMinutes: number = 0
) {
  if (!API_URL) return;
  try {
    const token = await getAuthToken();
    if (!token) return;

    const response = await axios.post(
      `${API_URL}/users/me/activity/`,
      { steps, distance_meters: distanceMeters, active_minutes: activeMinutes },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log('Activity synced successfully:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error syncing activity:', error?.response?.data || error.message);
  }
}
