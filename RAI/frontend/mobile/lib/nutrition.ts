import { getAuthToken } from './auth';
const API_URL = process.env.EXPO_PUBLIC_API_URL;

export async function fetchNutritionTargets() {
  const token = await getAuthToken();
  const res = await fetch(`${API_URL}/users/me/nutrition-target`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export async function updateNutritionTargets(data: any) {
  const token = await getAuthToken();
  const res = await fetch(`${API_URL}/users/me/nutrition-target`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return res.json();
}
