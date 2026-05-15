import { api } from 'lib/api';
import { DashboardResponse } from 'types/dashboard';

function getTodayDateString() {
  return new Date().toISOString().split('T')[0];
}

export async function getDashboard(token: string): Promise<DashboardResponse> {
  const response = await api.get('/users/me/dashboard', {
    params: {
      date: getTodayDateString(),
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}