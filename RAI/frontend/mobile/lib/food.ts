import { api } from './api';
import { CreateFoodRequest, Food, FoodSearchParams } from 'types/food';
import { getAuthToken } from './auth';

export async function searchFoods(params: FoodSearchParams): Promise<Food[]> {
  const token = await getAuthToken();

  const response = await api.get('/foods', {
    params,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export async function getFoodById(food_id: string): Promise<Food> {
  const response = await api.get(`/foods/${food_id}`);

  return response.data;
}

export async function createFood(payload: CreateFoodRequest): Promise<Food> {
  const response = await api.post('/foods', payload);
  return response.data;
}
