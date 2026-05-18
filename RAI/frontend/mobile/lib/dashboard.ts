import { api } from 'lib/api';
import { DashboardResponse, WeeklyNutritionDashboardResponse } from 'types/dashboard';

function getTodayDateString() {
  return new Date().toISOString().split('T')[0];
}

function getWeekStartDateString() {
  const date = new Date()
  const day = date.getDay()
  const diff = day === 0 ? -6 : 1 - day;

  date.setDate(date.getDate() + diff)

  return date.toISOString().split('T')[0]
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

export async function getWeeklyNutritionDashboard(token: string): Promise<WeeklyNutritionDashboardResponse> {
  const response = await api.get("/users/me/dashboard/weekly", {
    params: {
      start_date: getWeekStartDateString() 
    },
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  return response.data
}