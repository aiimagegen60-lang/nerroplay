
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
export type Goal = 'lose' | 'maintain' | 'gain';

export interface CalorieInput {
  fullName?: string;
  age: number;
  gender: 'male' | 'female';
  weight: number;
  height: number;
  activityLevel: ActivityLevel;
  goal: Goal;
}

export interface CalorieResult {
  bmr: number;
  tdee: number;
  targetCalories: number;
  macroSplit: {
    protein: number;
    fats: number;
    carbs: number;
  };
  deficit: number;
  surplus: number;
  estimatedWeeksToGoal: number;
  healthNote: string;
}

export const calculateCalories = (input: CalorieInput): CalorieResult => {
  const { age, gender, weight, height, activityLevel, goal } = input;

  // Mifflin-St Jeor Equation
  let bmr = (10 * weight) + (6.25 * height) - (5 * age);
  if (gender === 'male') {
    bmr += 5;
  } else {
    bmr -= 161;
  }

  // TDEE Multipliers
  const activityMultipliers: Record<ActivityLevel, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  };

  const tdee = bmr * activityMultipliers[activityLevel];

  let targetCalories = tdee;
  let deficit = 0;
  let surplus = 0;

  if (goal === 'lose') {
    deficit = 500; // Standard 500 kcal deficit
    targetCalories -= deficit;
  } else if (goal === 'gain') {
    surplus = 300; // Standard 300 kcal surplus
    targetCalories += surplus;
  }

  // Simple Macros (40% Carbs, 30% Protein, 30% Fat)
  const protein = (targetCalories * 0.30) / 4;
  const fats = (targetCalories * 0.30) / 9;
  const carbs = (targetCalories * 0.40) / 4;

  const estimatedWeeksToGoal = goal === 'lose' ? 4 : 0; // Placeholder logic

  let healthNote = "";
  if (targetCalories < 1200 && gender === 'female') healthNote = "Warning: Calorie target is very low. Consult a nutritionist.";
  if (targetCalories < 1500 && gender === 'male') healthNote = "Warning: Calorie target is very low. Consult a nutritionist.";

  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    targetCalories: Math.round(targetCalories),
    macroSplit: {
      protein: Math.round(protein),
      fats: Math.round(fats),
      carbs: Math.round(carbs)
    },
    deficit,
    surplus,
    estimatedWeeksToGoal,
    healthNote
  };
};
