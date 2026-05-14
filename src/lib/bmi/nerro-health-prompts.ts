
import { BMIResult } from './bmi-engine';

export function generateNerroHealthPrompt(report: BMIResult) {
  return `
Analyze the following BMI health data and generate a comprehensive "Neural Health Intelligence Report".
User Data:
- Age: ${report.age}
- Gender: ${report.gender}
- BMI: ${report.bmi} (${report.categoryLabel})
- Health Scores: Wellness=${Math.round(report.overallHealthScore)}, CV Risk=${Math.round(report.cardiovascularRisk)}, Metabolic Risk=${Math.round(report.metabolicRisk)}, Mobility=${Math.round(report.mobilityScore)}, Energy=${Math.round(report.energyScore)}

Respond ONLY with a valid JSON object matching the following structure:
{
  "healthPersona": "string",
  "healthPersonaDescription": "string (100 words)",
  "dimensionalScores": {
    "physicalVitality": number (0-100),
    "metabolicHealth": number (0-100),
    "cardiovascularWellness": number (0-100),
    "mentalEnergyLevel": number (0-100),
    "nutritionalBalance": number (0-100),
    "recoveryCapacity": number (0-100),
    "hormonalHarmony": number (0-100),
    "immuneResilience": number (0-100)
  },
  "bodyCompositionInsight": "string (150 words)",
  "metabolicPatternAnalysis": "string (150 words)",
  "cardiovascularHealthNarrative": "string (150 words)",
  "energyAndFatigueProfile": "string (150 words)",
  "emotionalRelationshipWithBody": "string (150 words)",
  "mindBodyScore": number (0-100),
  "mindBodyNarrative": "string (200 words)",
  "stressImpactOnWeight": "string (150 words)",
  "lifestyleFactors": [
    { "factor": "Sleep Hygiene", "currentState": "optimal", "impact": "High", "recommendation": "Maintain" },
    ... (total 8 factors)
  ],
  "goalTimeline": {
    "week1": { "goal": "string", "action": "string", "expected": "string" },
    "month1": { "goal": "string", "action": "string", "expected": "string" },
    "month3": { "goal": "string", "action": "string", "expected": "string" },
    "month6": { "goal": "string", "action": "string", "expected": "string" },
    "year1": { "goal": "string", "action": "string", "expected": "string" }
  },
  "hiddenPatterns": ["string x 5"],
  "subconsciousBlocks": ["string x 3"],
  "coreStrengths": ["string x 6"],
  "habitFormationStrategy": "string (200 words)",
  "motivationProfile": "string (150 words)",
  "relapsePrevention": "string (150 words)",
  "metabolicTyping": "string",
  "nutrientDeficiencyRisks": ["string x 4"],
  "idealEatingPattern": "string (200 words)",
  "gutHealthConnection": "string (150 words)",
  "next24Hours": {
    "morning": "string",
    "afternoon": "string",
    "evening": "string",
    "beforeSleep": "string"
  },
  "healthAffirmation": "string (powerful sentence)",
  "nerroMessage": "string (100 words)"
}

Ensure the tone is: Clinical precision balanced with warm empathy. No shame, no medical diagnosis.
`;
}
