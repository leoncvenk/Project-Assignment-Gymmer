import { api } from './api';
import { ActivityLevel, GoalType, Sex } from 'types/profile';

export async function createProfile(token: string, data: any) {
  const response = await api.put('/users/me/profile', data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

export async function getProfile(token: string) {
  try {
    const response = await api.get('/users/me/profile', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    console.log('NAPAKA PRI BRANJU PROFILA - STATUS:', error.response?.status);
    console.log('NAPAKA PRI BRANJU PROFILA - PODATKI:', error.response?.data);
    throw error;
  }
}

export async function updateProfile(token: string, data: any) {
  const response = await api.put('/users/me/profile', data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}
