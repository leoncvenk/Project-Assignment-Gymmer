import { api } from 'lib/api';
import { DashboardResponse } from 'types/dashboard';

export async function getDashboard(token: string): Promise<DashboardResponse> {
  const response = await api.get('/users/me/dashboard', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}