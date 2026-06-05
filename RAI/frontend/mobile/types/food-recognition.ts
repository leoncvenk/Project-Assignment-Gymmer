import type { Food } from './food';

export type FoodRecognitionCandidate = Food;

export type FoodRecognitionPrediction = {
  label: string;
  confidence: number;
  candidates: FoodRecognitionCandidate[];
};

export type FoodRecognitionResponse = {
  predictions: FoodRecognitionPrediction[];
};
