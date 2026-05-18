import { api } from './api';
import { getAuthToken } from './auth';
import { CreateFoodEntryRequest, FoodEntry } from 'types/food-entry';

export async function createFoodEntry(data: CreateFoodEntryRequest): Promise<FoodEntry> {
  const token = await getAuthToken();

  const response = await api.post('/users/me/food-entries', data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}
