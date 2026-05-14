export const BMI_CATEGORIES = {
  underweight: {
    label: 'Underweight',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    meaning: 'Your BMI indicates you are underweight. Consider a balanced diet and strength-building routine.',
    risks: ['Weakened immune system', 'Nutritional deficiencies', 'Bone density loss', 'Anemia', 'Fertility issues'],
    diet: ['Increase caloric intake with nutrient-dense foods', 'Eat frequent, smaller meals', 'Incorporate healthy fats (avocados, nuts)', 'Prioritize protein intake', 'Add complex carbohydrates'],
    workout: ['Focus on strength training', 'Limit excessive cardio', 'Prioritize compound movements', 'Increase rest periods', 'Focus on muscle hypertrophy'],
    lifestyle: ['Consult a nutritionist', 'Track your caloric intake', 'Prioritize quality sleep'],
    habit: 'Focus on consistent, nutrient-dense caloric surplus.',
    idealRange: '18.5 – 24.9'
  },
  normal: {
    label: 'Normal',
    color: 'text-green-400',
    bg: 'bg-green-500/10',
    border: 'border-green-500/20',
    meaning: 'Your BMI is within the healthy range. Maintain your current lifestyle.',
    risks: ['Maintain current habits', 'Monitor for gradual changes', 'Ensure balanced nutrition', 'Stay active', 'Keep stress levels managed'],
    diet: ['Maintain balanced macronutrients', 'Prioritize whole foods', 'Stay hydrated', 'Limit processed sugars', 'Eat diverse vegetables'],
    workout: ['Combine cardio and strength', 'Maintain consistency', 'Incorporate flexibility training', 'Aim for 150 mins activity/week', 'Listen to your body'],
    lifestyle: ['Regular check-ups', 'Manage stress', 'Prioritize sleep'],
    habit: 'Maintain your balanced lifestyle and monitor long-term trends.',
    idealRange: '18.5 – 24.9'
  },
  overweight: {
    label: 'Overweight',
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/20',
    meaning: 'You are slightly above the ideal weight range. Consider exercise and dietary control.',
    risks: ['Increased heart disease risk', 'Type 2 diabetes risk', 'Joint stress', 'High blood pressure', 'Sleep apnea'],
    diet: ['Focus on portion control', 'Increase fiber intake', 'Limit refined carbohydrates', 'Choose lean proteins', 'Reduce sugary beverages'],
    workout: ['Increase aerobic activity', 'Incorporate resistance training', 'Aim for daily movement', 'Track activity levels', 'Find enjoyable exercises'],
    lifestyle: ['Monitor weight trends', 'Improve sleep hygiene', 'Reduce sedentary time'],
    habit: 'Focus on gradual, sustainable lifestyle adjustments.',
    idealRange: '18.5 – 24.9'
  },
  obese: {
    label: 'Obese',
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
    meaning: 'Your BMI is high. It is recommended to consult a health expert and adopt a healthier routine.',
    risks: ['High risk of heart disease', 'Type 2 diabetes', 'Hypertension', 'Certain cancers', 'Joint/back pain'],
    diet: ['Consult a professional', 'Strict portion management', 'High-protein, high-fiber diet', 'Eliminate processed foods', 'Mindful eating practices'],
    workout: ['Low-impact activities initially', 'Gradual increase in intensity', 'Focus on consistency', 'Strength training for metabolism', 'Professional supervision'],
    lifestyle: ['Medical consultation', 'Stress management', 'Consistent tracking'],
    habit: 'Prioritize professional guidance and small, sustainable steps.',
    idealRange: '18.5 – 24.9'
  }
};
