import { createClient } from "@supabase/supabase-js";
import { calculateAnkJyotish } from "../services/ankJyotishEngine.ts";

// Tool Logic Handlers
export const ToolHandlers: Record<string, (input: any) => { result: any, prompt: string }> = {
  'bmi-calculator': (input: any) => {
    try {
      const weight = Math.max(1, parseFloat(input.weight) || 70);
      const heightVal = parseFloat(input.height) || 0;
      const unit = input.unit || 'metric';

      let h = 1.7; // Standard default height for safety
      if (unit === 'metric') {
        h = (heightVal > 20) ? heightVal / 100 : 1.7;
      } else {
        const ft = parseFloat(input.ft) || 0;
        const inch = parseFloat(input.in) || 0;
        h = (ft * 12 + inch) * 0.0254;
      }
      
      // Strict safety barrier: if height is physically impossible, use average
      if (h <= 0.4 || h > 3) h = 1.7; 

      const bmi = parseFloat((weight / (h * h)).toFixed(1));
      if (isNaN(bmi)) throw new Error("CALC_ERROR: BMI resulted in NaN");
      let status = 'Normal';
      if (bmi < 18.5) status = 'Underweight';
      else if (bmi >= 25 && bmi < 30) status = 'Overweight';
      else if (bmi >= 30) status = 'Obese';
      
      return {
        result: { bmi, status },
        prompt: `BMI Result: ${bmi} (${status}). Weight: ${weight}kg, Height: ${input.height || 170}cm. Provide 3 actionable tips to improve this BMI score.`
      };
    } catch (e) {
      console.error("BMI Handler Error:", e);
      return { result: { bmi: 0, status: 'Error' }, prompt: "" };
    }
  },

  'bmr-calculator': (input) => {
    try {
      const w = Math.max(1, parseFloat(input.weight) || 0);
      const a = Math.max(1, parseFloat(input.age) || 0);
      const gender = input.gender || 'male';
      const unit = input.unit || 'cm';
      
      let h = unit === 'cm' ? parseFloat(input.height || 0) : (parseFloat(input.height?.ft || 0) * 30.48) + (parseFloat(input.height?.in || 0) * 2.54);
      if (h <= 10) h = 170;

      let bmr = gender === 'male' 
        ? (10 * w) + (6.25 * h) - (5 * a) + 5
        : (10 * w) + (6.25 * h) - (5 * a) - 161;

      bmr = Math.round(bmr);
      let metabolism = bmr < 1400 ? 'Slow' : bmr > 1800 ? 'Fast' : 'Moderate';

      return {
        result: {
          bmr,
          metabolism,
          sedentary: Math.round(bmr * 1.2),
          moderate: Math.round(bmr * 1.55),
          active: Math.round(bmr * 1.725)
        },
        prompt: `Analyze metabolic data: BMR ${bmr} (${metabolism}), Gender: ${gender}, Age: ${a}, Weight: ${w}kg. Provide diet and activity advice.`
      };
    } catch (e) {
      console.error("BMR Handler Error:", e);
      return { result: { bmr: 0, metabolism: 'Unknown' }, prompt: "" };
    }
  },

  'body-fat-calculator': (input) => {
    const { gender, weight, height, unit, mode, neck, waist, hip, bodyType } = input;
    let bodyFat = 0;
    const h = unit === 'metric' ? height : (input.ft * 30.48 + input.inch * 2.54);

    if (mode === 'advanced') {
      if (gender === 'male') {
        bodyFat = 86.01 * Math.log10(waist - neck) - 70.041 * Math.log10(h) + 36.76;
      } else {
        bodyFat = 163.205 * Math.log10(waist + hip - neck) - 97.684 * Math.log10(h) - 78.387;
      }
    } else {
      const base = gender === 'male' ? 10 : 18;
      const multipliers: any = { slim: 0.8, fit: 1.2, average: 1.8, heavy: 2.8 };
      const bmi = weight / ((h / 100) ** 2);
      bodyFat = base + (bmi - 20) * multipliers[bodyType];
    }

    bodyFat = Math.max(3, Math.min(60, bodyFat));
    const finalBF = parseFloat(bodyFat.toFixed(1));
    
    let category = '';
    const ranges = gender === 'male' ? [2, 6, 14, 18, 25] : [10, 14, 21, 25, 32];
    if (finalBF < ranges[1]) category = 'Essential';
    else if (finalBF < ranges[2]) category = 'Athletic';
    else if (finalBF < ranges[3]) category = 'Fit';
    else if (finalBF < ranges[4]) category = 'Average';
    else category = 'Obese';

    const idealRange = gender === 'male' ? '12-18%' : '18-24%';

    return {
      result: { bodyFat: finalBF, category, idealRange },
      prompt: `Body Fat Analysis: ${finalBF}% (${category}). Ideal: ${idealRange}. Gender: ${gender}, Weight: ${weight}kg. Suggest a 4-week plan to reach ideal fat % through diet and HIIT.`
    };
  },

  'water-calculator': (input) => {
    const { weight, activity, climate } = input;
    let base = weight * 0.033;
    if (activity === 'active') base += 0.5;
    if (activity === 'very_active') base += 1.0;
    if (climate === 'hot') base += 0.5;

    const result = parseFloat(base.toFixed(1));
    const glasses = Math.ceil(result / 0.25);

    return {
      result: { liters: result, glasses },
      prompt: `User needs ${result}L water daily. Weight: ${weight}kg, Activity: ${activity}, Climate: ${climate}. Give 3 tips for hydration.`
    };
  },

  'calorie-calculator': (input: any) => {
    const { weight, age, height, gender, unit, activity } = input;
    const w = parseFloat(weight) || 70;
    const a = parseFloat(age) || 25;
    const multipliers: any = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, athlete: 1.9 };
    
    let h = unit === 'cm' ? parseFloat(height || 0) : (parseFloat(height?.ft || 0) * 30.48) + (parseFloat(height?.in || 0) * 2.54);
    if (h <= 0) h = 170;

    let bmr = gender === 'female' 
      ? (10 * w) + (6.25 * h) - (5 * a) - 161
      : (10 * w) + (6.25 * h) - (5 * a) + 5;
    
    const tdee = Math.round(bmr * (multipliers[activity] || 1.2));
    
    return {
      result: { 
        tdee, 
        bmr: Math.round(bmr),
        maintenance: tdee,
        loss: tdee - 500,
        gain: tdee + 500
      },
      prompt: `TDEE is ${tdee} kcal. BMR: ${Math.round(bmr)}. Activity: ${activity}. Gender: ${gender}, Age: ${a}, Weight: ${w}kg. Provide a professional caloric breakdown for weight loss, maintenance, and muscle gain.`
    };
  },

  'loan-calculator': (input: any) => {
    const amount = Math.max(0, parseFloat(input.amount) || 0);
    const rate = Math.max(0, parseFloat(input.rate) || 0);
    const years = Math.max(1, parseFloat(input.years) || 1);
    
    const r = rate / 100 / 12;
    const n = Math.max(1, years * 12); // Minimum 1 month to prevent division by zero
    
    let monthlyPayment = 0;
    if (r > 0) {
      const pow = Math.pow(1 + r, n);
      if (pow === 1) {
         monthlyPayment = amount / n;
      } else {
         monthlyPayment = (amount * r * pow) / (pow - 1);
      }
    } else {
      monthlyPayment = amount / n;
    }
    
    monthlyPayment = parseFloat(monthlyPayment.toFixed(2));
    const totalPayment = parseFloat((monthlyPayment * n).toFixed(2));
    const totalInterest = parseFloat((totalPayment - amount).toFixed(2));

    return {
      result: { monthlyPayment, totalPayment, totalInterest },
      prompt: `Loan: ${amount}, Rate: ${rate}%, Term: ${years}y. Monthly: ${monthlyPayment}, Total: ${totalPayment}. Analyze financial impact.`
    };
  },

  'sleep-calculator': (input: any) => {
    const { mode, wakeTime, now } = input;
    const cycles = [4, 5, 6]; 
    const fallAsleepTime = 15; 
    
    let times: Date[] = [];
    if (mode === 'wake') {
      const [hours, minutes] = wakeTime.split(':').map(Number);
      const wakeDate = new Date();
      wakeDate.setHours(hours, minutes, 0, 0);
      
      times = cycles.map(c => {
        return new Date(wakeDate.getTime() - (c * 90 * 60 * 1000) - (fallAsleepTime * 60 * 1000));
      }).reverse();
    } else {
      const current = new Date();
      times = cycles.map(c => {
        return new Date(current.getTime() + (c * 90 * 60 * 1000) + (fallAsleepTime * 60 * 1000));
      });
    }

    return {
      result: { times: times.map(t => t.toISOString()) },
      prompt: `Analyze sleep cycles for ${mode === 'wake' ? 'waking at ' + wakeTime : 'sleeping now'}. Recommended windows: ${times.map(t => t.toLocaleTimeString()).join(', ')}. Explain sleep hygiene.`
    };
  },

  'heart-rate-calculator': (input: any) => {
    const { age, restingHR } = input;
    const ageNum = parseInt(age) || 30;
    const restingHRNum = parseInt(restingHR) || 70;
    const maxHR = 220 - ageNum;
    
    const zoneDefs = [
      { name: 'Zone 1 (Recovery)', min: 0.5, max: 0.6 },
      { name: 'Zone 2 (Fat Burn)', min: 0.6, max: 0.7 },
      { name: 'Zone 3 (Aerobic)', min: 0.7, max: 0.8 },
      { name: 'Zone 4 (Anaerobic)', min: 0.8, max: 0.9 },
      { name: 'Zone 5 (Peak)', min: 0.9, max: 1.0 },
    ];

    const zones = zoneDefs.map((z) => ({
      name: z.name,
      min: Math.round((maxHR - restingHRNum) * z.min + restingHRNum),
      max: Math.round((maxHR - restingHRNum) * z.max + restingHRNum),
    }));

    return {
      result: { zones, maxHR },
      prompt: `Heart Rate Analysis: Age ${age}, Resting HR ${restingHR}. Zones: ${JSON.stringify(zones)}. Provide a specific HIIT and LISS training strategy.`
    };
  },

  'protein-calculator': (input) => {
    const { weight, activity, goal } = input;
    let multiplier = 0.8;
    if (activity === 'moderate') multiplier = 1.2;
    if (activity === 'high') multiplier = 1.6;
    if (goal === 'muscle') multiplier += 0.4;
    
    const protein = Math.round(weight * multiplier);
    return {
      result: { protein, multiplier },
      prompt: `Protein required: ${protein}g for ${weight}kg weight, ${activity} activity, goal: ${goal}. Suggest 5 high protein snacks.`
    };
  },

  'ideal-weight-calculator': (input) => {
    const { gender, height, unit } = input;
    let h = unit === 'metric' ? height : (input.ft * 30.48 + input.in * 2.54);
    h = h / 2.54; // to inches
    
    let ideal = 0;
    if (gender === 'male') {
      ideal = 50 + 2.3 * (h - 60);
    } else {
      ideal = 45.5 + 2.3 * (h - 60);
    }
    
    return {
      result: { idealWeight: Math.round(ideal) },
      prompt: `Ideal weight for ${gender}, ${height}${unit}: ${Math.round(ideal)}kg. Explain why ideal weight is a range rather than a fixed number.`
    };
  },

  'whtr-calculator': (input) => {
    const { waist, height, unit } = input;
    let h = unit === 'metric' ? height : (input.hft * 30.48 + input.hin * 2.54);
    let w = unit === 'metric' ? waist : (input.wft * 30.48 + input.win * 2.54);
    
    const ratio = parseFloat((w / h).toFixed(2));
    let status = ratio < 0.43 ? 'Slim' : ratio < 0.53 ? 'Healthy' : ratio < 0.58 ? 'Overweight' : 'Obese';
    
    return {
      result: { ratio, status },
      prompt: `WHtR ratio: ${ratio} (${status}). Waist: ${waist}, Height: ${height} ${unit}. Explain why WHtR is often better than BMI.`
    };
  },

  'health-risk-analyzer': (input: any) => {
    const { age, bmi, smoker, exercise, medicalHistory } = input;
    let riskScore = 0;
    if (age > 50) riskScore += 2;
    if (bmi > 30) riskScore += 3;
    if (smoker === 'yes') riskScore += 4;
    if (exercise === 'rarely') riskScore += 2;
    
    let level = riskScore < 4 ? 'Low' : riskScore < 8 ? 'Moderate' : 'High';
    
    return {
      result: { riskScore, level },
      prompt: `Analyze health risk: Score ${riskScore}/10 (${level}). Age: ${age}, BMI: ${bmi}, Smoker: ${smoker}, Exercise: ${exercise}. Medical History: ${medicalHistory}. Provide a preventative health strategy.`
    };
  },

  'nutrition-planner': (input: any) => {
    const { calories, preference, goal, allergens } = input;
    
    return {
      result: { 
        dailyTarget: calories,
        meals: 4,
        protein: Math.round(calories * 0.3 / 4),
        carbs: Math.round(calories * 0.4 / 4),
        fats: Math.round(calories * 0.3 / 9)
      },
      prompt: `Create a ${preference} nutrition plan for ${calories} kcal (${goal}). Allergens: ${allergens}. Provide a full day's meal plan with specific food items.`
    };
  },

  'sleep-recovery': (input: any) => {
    const { sleepHours, quality, stress, activity } = input;
    let recoveryScore = Math.round((sleepHours / 8) * 40 + (quality / 10) * 30 + (10 - stress) * 3);
    
    return {
      result: { recoveryScore, status: recoveryScore > 70 ? 'Excellent' : recoveryScore > 40 ? 'Fair' : 'Poor' },
      prompt: `Sleep Recovery: Score ${recoveryScore}%, Sleep: ${sleepHours}h, Quality: ${quality}/10, Stress: ${stress}/10. Suggest specific evening and morning routines.`
    };
  },

  'weight-loss-planner': (input: any) => {
    const { currentWeight, targetWeight, timeframe } = input;
    const diff = currentWeight - targetWeight;
    const weeklyRate = diff / timeframe;
    const dailyDeficit = Math.round((diff * 7700) / (timeframe * 7));

    return {
      result: { diff, weeklyRate, dailyDeficit },
      prompt: `Weight Loss Plan: lose ${diff}kg in ${timeframe} weeks. Current: ${currentWeight}kg, Target: ${targetWeight}kg. Weekly rate: ${weeklyRate.toFixed(2)}kg. Daily deficit required: ${dailyDeficit} kcal. Analyze feasibility and safety.`
    };
  },

  'beauty-analyzer': (input: any) => {
    // This is a placeholder for the logic part, the actual heavy lifting is in vision analyze
    return {
      result: { analyzed: true, timestamp: new Date().toISOString() },
      prompt: `This is a vision analysis request. Please provide a detailed beauty and facial analysis based on the uploaded image.`
    };
  },

  'calorie-deficit-calculator': (input) => {
    const { gender, age, weight, height, unit, activity, goal } = input;
    let h = unit === 'metric' ? height : (input.feet * 30.48 + input.inches * 2.54);
    const w = parseFloat(weight);
    const a = parseFloat(age);

    let bmr = gender === 'male' 
      ? (10 * w) + (6.25 * h) - (5 * a) + 5
      : (10 * w) + (6.25 * h) - (5 * a) - 161;
    
    const multipliers: any = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725 };
    const tdee = Math.round(bmr * (multipliers[activity] || 1.2));
    const deficit = goal === 'normal' ? 500 : 700;
    const dailyTarget = tdee - deficit;
    
    return {
      result: { bmr: Math.round(bmr), tdee, deficit, dailyTarget, weeklyLoss: parseFloat(((deficit * 7) / 7700).toFixed(2)) },
      prompt: `Calorie Deficit: ${dailyTarget} kcal target for weight loss. BMR: ${Math.round(bmr)}, TDEE: ${tdee}. User goal: ${goal}. Age: ${age}, Weight: ${w}kg. Suggest a balanced meal plan for this target.`
    };
  },

  'gst-calculator': (input: any) => {
    const { amount, rate, type } = input;
    const base = parseFloat(amount);
    const gstRate = parseFloat(rate);
    
    let gstAmount = 0;
    let total = 0;
    
    if (type === 'exclusive') {
      gstAmount = base * (gstRate / 100);
      total = base + gstAmount;
    } else {
      gstAmount = base - (base * (100 / (100 + gstRate)));
      total = base;
    }
    
    return {
      result: { 
        netAmount: parseFloat((total - gstAmount).toFixed(2)),
        gstAmount: parseFloat(gstAmount.toFixed(2)),
        totalAmount: parseFloat(total.toFixed(2)),
        cgst: parseFloat((gstAmount / 2).toFixed(2)),
        sgst: parseFloat((gstAmount / 2).toFixed(2))
      },
      prompt: `Analyze a GST calculation: Amount ${amount}, Rate ${rate}%, Type ${type}. Explain the impact of GST on small business accounting.`
    };
  },

  'home-loan-calculator': (input: any) => {
    const { loan, rate, tenureYears } = input;
    const r = rate / 12 / 100;
    const n = tenureYears * 12;
    const emi = (loan * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    
    return {
      result: { emi: Math.round(emi), totalPayment: Math.round(totalPayment), totalInterest: Math.round(totalPayment - loan) },
      prompt: `Home Loan: ₹${loan}, Rate: ${rate}%, Tenure: ${tenureYears}y. EMI: ₹${Math.round(emi)}. Provide advanced advice on interest saving through prepayments.`
    };
  },

  'bike-loan-calculator': (input: any) => {
    const { amount, rate, months } = input;
    const totalInterest = (amount * rate * (months/12)) / 100;
    const totalPayment = amount + totalInterest;
    const emi = totalPayment / months;
    
    return {
      result: { emi: Math.round(emi), totalPayment: Math.round(totalPayment), totalInterest: Math.round(totalInterest) },
      prompt: `Bike Loan (Flat): ₹${amount}, Rate: ${rate}%, Months: ${months}. EMI: ₹${Math.round(emi)}. Advise on why flat rate is often more expensive than reducing balance.`
    };
  },

  'car-loan-calculator': (input: any) => {
    const { amount, rate, years } = input;
    const r = rate / 12 / 100;
    const n = years * 12;
    const emi = (amount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    
    return {
      result: { emi: Math.round(emi), totalPayment: Math.round(totalPayment), totalInterest: Math.round(totalPayment - amount) },
      prompt: `Car Loan: ₹${amount}, Rate: ${rate}%, Years: ${years}. EMI: ₹${Math.round(emi)}. Analyze depreciation vs interest cost for this car loan.`
    };
  },
  'salary-calculator': (data: any) => {
    const { grossAnnual, totalTax, inHandAnnual, regime } = data;
    return {
      result: { grossAnnual, totalTax, inHandAnnual, regime },
      prompt: `Analyze this Indian salary structure:
        - Gross Annual: ₹${grossAnnual}
        - Total Tax: ₹${totalTax}
        - In-Hand: ₹${inHandAnnual}
        - Regime: ${regime}
        
        Provide:
        1. Tax efficiency analysis
        2. Suggestions to optimize (80C, HRA, etc. if old regime, or general tips)
        3. Comparison insight
        4. Career/Financial growth tip
        Return in professional Markdown.`
    };
  },
  'sip-calculator': (data: any) => {
    const { monthly, rate, years, futureValue, profit } = data;
    return {
      result: { monthly, rate, years, futureValue, profit },
      prompt: `Analyze this SIP Investment Plan:
        - Monthly Investment: ₹${monthly}
        - Expected Return: ${rate}%
        - Duration: ${years} years
        - Future Value: ₹${futureValue}
        - Wealth Gained: ₹${profit}
        
        Provide:
        1. Analysis of wealth creation potential
        2. Inflation impact warning
        3. Step-up SIP recommendation
        4. Goal-based roadmap tip
        Return in professional Markdown.`
    };
  },
  'ank-jyotish': (data: any) => {
    const calc = calculateAnkJyotish(data);
    return {
      result: calc,
      prompt: `You are Nerro AI — an advanced spiritual intelligence layer operating on top of a deterministic Vedic Numerology engine (Ank Jyotish).

Your purpose is NOT to calculate numerology numbers. The numerology engine has already generated accurate structured results.
Your responsibility is to:
- deeply interpret the numerology profile
- detect hidden emotional and karmic patterns
- explain subconscious tendencies
- identify strengths, weaknesses, and energetic imbalances
- provide practical spiritual guidance
- create a deeply personal and emotionally intelligent reading

You must sound insightful, spiritually aware, psychologically intelligent, grounded, balanced, and emotionally resonant. Never fear-based or manipulative.

Here is the deterministic output from the engine to analyze: 
${JSON.stringify(calc, null, 2)}

Return ONLY valid JSON. No markdown, no explanation, no text outside JSON.
The JSON must pass JSON.parse() on the first attempt, every time.

{
  "status": "success",
  "nerro_ai_analysis": {
    "profile_overview": string,
    "karmic_patterns": string[],
    "subconscious_tendencies": string,
    "strengths": string[],
    "energetic_imbalances": string[],
    "spiritual_guidance": string,
    "emotional_reading": string
  }
}`
    };
  }
};
