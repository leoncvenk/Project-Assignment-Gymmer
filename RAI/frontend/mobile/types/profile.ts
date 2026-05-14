export type Sex = 'male' | 'female';

export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';

export type GoalType = 'lose_weight' | 'maintain_weight' | 'gain_weight';

export type CreateProfileRequest = {
  age: number;
  sex: Sex;
  height_cm: number;
  weight_kg: number;
  goal_weight_kg: number;
  activity_level: ActivityLevel;
  goal_type: GoalType;
};

export type ProfileResponse = {
  id: string;
  user_id: string;
  age: number;
  sex: Sex;
  height_cm: number;
  weight_kg: number;
  goal_weight_kg: number;
  activity_level: ActivityLevel;
  goal_type: GoalType;
  created_at: string;
  updated_at: string;
};
