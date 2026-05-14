
export interface UserHealthData {
  fullName: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  heightUnit: 'cm' | 'ft';
  heightCm?: number;
  heightFtFt?: number;
  heightFtIn?: number;
  weightUnit: 'kg' | 'lbs';
  weight: number;
}

export type BMICategory =
  | 'severe-underweight'
  | 'underweight'
  | 'normal'
  | 'overweight'
  | 'obese-1'
  | 'obese-2'
  | 'obese-3';

export interface HealthRisk {
  name: string;
  severity: 'low' | 'moderate' | 'high';
  description: string;
  preventionTip: string;
}

export interface Recommendation {
  id: number;
  title: string;
  description: string;
  category: 'exercise' | 'nutrition' | 'lifestyle' | 'medical';
  difficulty: 'easy' | 'moderate' | 'challenging';
  timeToResult: string;
  icon: string;
}

export interface NutritionPlan {
  primaryFocus: string;
  dailyCalorieRange: { min: number; max: number };
  proteinGoalG: number;
  fiberGoalG: number;
  waterGoalL: number;
  macroSplit: { carbs: number; protein: number; fats: number };
  keyFoods: string[];
  foodsToLimit: string[];
  mealTimingTip: string;
  nutritionSummary: string;
}

export interface NextStep {
  timeframe: string;
  action: string;
  description: string;
  measurable: string;
}

export interface BMIResult {
  age: number;
  gender: string;
  heightCm: number;
  heightM: number;
  weightKg: number;
  bmi: number;
  category: BMICategory;
  categoryLabel: string;
  categoryDescription: string;
  scalePosition: number;
  distanceFromIdeal: number;
  idealWeightMin: number;
  idealWeightMax: number;
  idealWeightMidpoint: number;
  ageAdjustedCategory: string;
  genderNote: string;
  overallHealthScore: number;
  cardiovascularRisk: number;
  metabolicRisk: number;
  mobilityScore: number;
  energyScore: number;
  healthRisks: HealthRisk[];
  recommendations: Recommendation[];
  nutritionFocus: NutritionPlan;
  nextSteps: NextStep[];
}

export const CATEGORIES: Record<BMICategory, { label: string; min: number; max: number; description: string }> = {
  'severe-underweight': { label: 'Severe Underweight', min: 0, max: 15.9, description: 'Significantly below the healthy weight range. Professional medical consultation is highly recommended to address potential nutrient deficiencies and underlying causes.' },
  'underweight': { label: 'Underweight', min: 16.0, max: 18.4, description: 'Below the healthy weight range. Increasing nutrient-dense calorie intake and strength training may help reach a balanced composition.' },
  'normal': { label: 'Normal Weight', min: 18.5, max: 24.9, description: 'Within the statistically healthy weight range. Maintaining this balance through regular activity and balanced nutrition is ideal.' },
  'overweight': { label: 'Overweight', min: 25.0, max: 29.9, description: 'Above the healthy weight range. Slight adjustments in daily activity and caloric balance can prevent progression to higher risk categories.' },
  'obese-1': { label: 'Obese (Class I)', min: 30.0, max: 34.9, description: 'Increased risk of weight-related health conditions. A structured lifestyle plan focusing on sustainable habits is recommended.' },
  'obese-2': { label: 'Obese (Class II)', min: 35.0, max: 39.9, description: 'High risk of chronic health conditions. Comprehensive wellness strategies including medical guidance are often beneficial.' },
  'obese-3': { label: 'Obese (Class III)', min: 40.0, max: 100, description: 'Very high risk of serious health complications. Specialized medical-grade wellness support is strongly suggested for long-term health management.' }
};

export function calculateBMI(data: UserHealthData): BMIResult {
  let heightCm = 0;
  if (data.heightUnit === 'cm') {
    heightCm = data.heightCm || 170;
  } else {
    const totalInches = (data.heightFtFt || 5) * 12 + (data.heightFtIn || 7);
    heightCm = totalInches * 2.54;
  }

  let weightKg = 0;
  if (data.weightUnit === 'kg') {
    weightKg = data.weight;
  } else {
    weightKg = data.weight * 0.453592;
  }

  const heightM = heightCm / 100;
  const rawBmi = weightKg / (heightM * heightM);
  const bmi = Math.min(Math.max(rawBmi, 10), 70);

  let categoryKey: BMICategory = 'normal';
  if (bmi < 16) categoryKey = 'severe-underweight';
  else if (bmi < 18.5) categoryKey = 'underweight';
  else if (bmi < 25) categoryKey = 'normal';
  else if (bmi < 30) categoryKey = 'overweight';
  else if (bmi < 35) categoryKey = 'obese-1';
  else if (bmi < 40) categoryKey = 'obese-2';
  else categoryKey = 'obese-3';

  const category = CATEGORIES[categoryKey];

  // Ideal weight (Devine formula)
  let idealKg = 0;
  const heightInInches = heightCm / 2.54;
  if (data.gender === 'male') {
    idealKg = 50 + 2.3 * (heightInInches - 60);
  } else {
    idealKg = 45.5 + 2.3 * (heightInInches - 60);
  }
  idealKg = Math.max(idealKg, 40); // Clamp minimum

  const idealWeightMin = idealKg * 0.9;
  const idealWeightMax = idealKg * 1.1;
  const idealWeightMidpoint = idealKg;
  const distanceFromIdeal = weightKg - idealWeightMidpoint;

  // Scale position (15-45 mapped to 0-100)
  const scalePosition = Math.min(Math.max(((bmi - 15) / (45 - 15)) * 100, 0), 100);

  // Scores
  let cardiovascularRisk = 20;
  let metabolicRisk = 20;
  let mobilityScore = 85;
  let energyScore = 80;

  const bmiDiff = Math.abs(bmi - 22);
  cardiovascularRisk = Math.min(20 + bmiDiff * 4, 100);
  metabolicRisk = Math.min(20 + bmiDiff * 5, 100);
  mobilityScore = Math.max(85 - bmiDiff * 2, 10);
  energyScore = Math.max(80 - bmiDiff * 1.5, 10);

  if (data.age > 40) {
    mobilityScore -= (data.age - 40) * 0.5;
  }
  mobilityScore = Math.min(Math.max(mobilityScore, 0), 100);

  const overallHealthScore = Math.max(100 - (cardiovascularRisk + metabolicRisk) / 2, 0);

  // Recommendations and Risks
  const healthRisks: HealthRisk[] = [
    {
      name: 'Cardiovascular Strain',
      severity: cardiovascularRisk > 70 ? 'high' : cardiovascularRisk > 40 ? 'moderate' : 'low',
      description: 'Your body mass profile suggests potential variations in cardiac efficiency. At your current BMI, the heart works at a specific load level to maintain systemic circulation. Long-term optimization through aerobic activity and heart-healthy nutrition is recommended.',
      preventionTip: 'Consistent low-impact cardio sessions 3 times weekly can significantly improve heart resilience.'
    },
    {
      name: 'Metabolic Efficiency',
      severity: metabolicRisk > 70 ? 'high' : metabolicRisk > 40 ? 'moderate' : 'low',
      description: 'Metabolic markers tend to correlate with body composition. Achieving a balance in lean mass vs adipose tissue optimizes insulin sensitivity and energy stabilization. Current data indicates a focus on blood sugar management may be beneficial.',
      preventionTip: 'Incorporate complex carbohydrates and fiber-rich foods to stabilize metabolic response.'
    }
  ];

  const recommendations: Recommendation[] = [
    {
      id: 1,
      title: 'Progressive Strength Training',
      description: 'Bodyweight or weighted resistance training is essential for maintaining bone density and metabolic rate. Aim for 2-3 sessions per week focusing on foundational movements like squats, hinges, and presses. This helps in achieving an optimal body composition regardless of total weight.',
      category: 'exercise',
      difficulty: 'moderate',
      timeToResult: '8-12 weeks',
      icon: '🏋️'
    },
    {
      id: 2,
      title: 'Mindful Macro Partitioning',
      description: 'Focus on consuming whole, single-ingredient foods with a particular emphasis on protein to support lean tissue. Distributing your macros across steady meals helps regulate appetite and provides sustained energy throughout your active day.',
      category: 'nutrition',
      difficulty: 'easy',
      timeToResult: '2-4 weeks',
      icon: '🥗'
    }
  ];

  const nutritionFocus: NutritionPlan = {
    primaryFocus: bmi > 25 ? 'Caloric Deficit & High Protein' : bmi < 18.5 ? 'Caloric Surplus & Nutrient Density' : 'Maintenance & Functional Fueling',
    dailyCalorieRange: { min: Math.round(weightKg * 22), max: Math.round(weightKg * 28) },
    proteinGoalG: Math.round(weightKg * 1.6),
    fiberGoalG: 25,
    waterGoalL: Math.round(weightKg * 0.033 * 10) / 10,
    macroSplit: { carbs: 40, protein: 30, fats: 30 },
    keyFoods: ['Leafy Greens', 'Lean Poultry', 'Legumes', 'Nuts', 'Quinoa'],
    foodsToLimit: ['Highly Processed Sugars', 'Trans Fats', 'Excessive Sodium', 'Alcohol'],
    mealTimingTip: 'Try to consume your largest meal after your most active period to optimize nutrient partitioning.',
    nutritionSummary: 'Your nutritional strategy should focus on supporting your health score of ' + Math.round(overallHealthScore) + '. By prioritizing high-quality protein and complex fibers, you can influence your metabolic risk profile positively over time.'
  };

  const nextSteps: NextStep[] = [
    { timeframe: 'Next 2 hours', action: 'Hydration Intake', description: 'Drink 500ml of mineralized water.', measurable: 'Completed 500ml' },
    { timeframe: 'Today', action: 'Activity Baseline', description: 'Complete a 15-minute brisk walk.', measurable: '15 mins logged' },
    { timeframe: 'This week', action: 'Meal Prep', description: 'Prepare 3 high-protein lunches.', measurable: '3 meals ready' }
  ];

  return {
    age: data.age,
    gender: data.gender,
    heightCm,
    heightM,
    weightKg,
    bmi: Math.round(bmi * 10) / 10,
    category: categoryKey,
    categoryLabel: category.label,
    categoryDescription: category.description,
    scalePosition,
    distanceFromIdeal: Math.round(distanceFromIdeal * 10) / 10,
    idealWeightMin: Math.round(idealWeightMin * 10) / 10,
    idealWeightMax: Math.round(idealWeightMax * 10) / 10,
    idealWeightMidpoint: Math.round(idealWeightMidpoint * 10) / 10,
    ageAdjustedCategory: data.age > 65 ? 'BMI 23-27 is often considered optimal for seniors.' : 'Standard Adult BMI Range',
    genderNote: data.gender === 'female' ? 'Women typically have a slightly higher percentage of body fat at the same BMI.' : 'Men typically carry more lean mass which can impact absolute BMI interpretation.',
    overallHealthScore,
    cardiovascularRisk,
    metabolicRisk,
    mobilityScore,
    energyScore,
    healthRisks,
    recommendations,
    nutritionFocus,
    nextSteps
  };
}
