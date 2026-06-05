import { api } from './api';
import { getAuthToken } from './auth';

import type { FoodRecognitionResponse } from 'types/food-recognition';

export async function recognizeFoodImage(imageUri: string): Promise<FoodRecognitionResponse> {
  const token = await getAuthToken();

  const formData = new FormData();

  formData.append('image', {
    uri: imageUri,
    name: 'food-image.jpg',
    type: 'image/jpeg',
  } as unknown as Blob);

  const response = await api.post<FoodRecognitionResponse>('/users/me/food-recognition', formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
}
