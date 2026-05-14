import { Tool } from './types';

export const TOOLS: Tool[] = [
  {
    id: 'bmi-calculator',
    name: 'BMI Calculator',
    description: 'Calculate your Body Mass Index and receive AI-powered health insights.',
    category: 'Health & Fitness',
    icon: 'Activity',
    customPath: '/tools/bmi-calculator',
    metadata: {
      version: '1.2.0',
      lastUpdated: '2026-05-10',
      author: 'NERROPLAY Health Board',
      seoTitle: 'AI BMI Calculator - Accurate Health Analysis | NERROPLAY',
      metaDescription: 'Calculate your BMI accurately with NERROPLAY. Get AI-powered insights, health category breakdowns, and personalized wellness suggestions.'
    },
    education: {
      howItWorks: 'The BMI Calculator uses your weight and height to categorize your body composition into standard health ranges. Our AI layer then analyzes these results in the context of general wellness trends.',
      formula: 'BMI = weight (kg) / [height (m)]²',
      whyUseThis: 'Quickly assess if your weight falls within a healthy range compared to your height, a key indicator for various health risks.',
      limitations: 'BMI does not account for muscle mass, bone density, or overall body composition. It should not be the sole indicator of health.',
      commonMistakes: ['Entering weight in the wrong units', 'Using it as an absolute measure of fitness', 'Ignoring muscle mass impact']
    },
    faqs: [
      { question: 'Is BMI different for men and women?', answer: 'The formula for BMI is the same for both, but the interpretation can vary slightly based on body composition differences.' },
      { question: 'Is AI processing my health data?', answer: 'Our AI analyzes the result of the calculation to provide context, but individual inputs are not stored permanently.' }
    ]
  },
  {
    id: 'calorie-calculator',
    name: 'Daily Calorie Calculator',
    description: 'Calculate your TDEE, BMR, and receive a personalized nutrition and workout strategy.',
    category: 'Health & Fitness',
    icon: 'Flame',
    customPath: '/tools/calorie-calculator',
    metadata: {
      version: '1.2.0',
      lastUpdated: '2026-05-10',
      author: 'NERROPLAY Health Board',
      seoTitle: 'Daily Calorie & TDEE Calculator | NERROPLAY',
      metaDescription: 'Find your maintenance calories and TDEE using our AI-enhanced calorie calculator. Get personalized goals for weight loss or muscle gain.'
    },
    education: {
      howItWorks: 'This tool uses the Mifflin-St Jeor equation to estimate your Basal Metabolic Rate (BMR) and then applies an activity multiplier to determine your Total Daily Energy Expenditure (TDEE).',
      formula: 'TDEE = BMR × Activity Factor',
      whyUseThis: 'Understanding your TDEE is the fundamental first step in body composition management, whether you want to lose fat, gain muscle, or maintain weight.',
      limitations: 'The calculator provides an estimate based on population averages. Individual metabolic rates vary based on genetics, lean body mass, and hormone levels.',
      commonMistakes: ['Overestimating physical activity level', 'Not adjusting as weight changes', 'Assuming the number is 100% exact']
    },
    faqs: [
      { question: 'What is BMR vs TDEE?', answer: 'BMR is what you burn at rest. TDEE includes all activity—walking, working, and exercising.' },
      { question: 'How often should I recalculate?', answer: 'We recommend updating your inputs every 5-10 lbs of weight change for continued accuracy.' }
    ]
  },
  {
    id: 'protein-calculator',
    name: 'Protein Intake Calculator',
    description: 'Calculate your optimal daily protein needs based on your fitness goals and activity level.',
    category: 'Health & Fitness',
    icon: 'Dumbbell',
    metadata: {
      version: '1.0.0',
      lastUpdated: '2026-04-15',
      author: 'NERROPLAY Core'
    }
  },
  {
    id: 'water-calculator',
    name: 'Water Intake Calculator',
    description: 'Calculate your optimal daily water needs based on weight, activity, and weather conditions.',
    category: 'Health & Fitness',
    icon: 'Droplets',
    metadata: {
      version: '1.0.0',
      lastUpdated: '2026-04-15',
      author: 'NERROPLAY Core'
    }
  },
  {
    id: 'sleep-calculator',
    name: 'Sleep Cycle Calculator',
    description: 'Optimize your sleep cycles for maximum recovery and cognitive performance.',
    category: 'Health & Fitness',
    icon: 'Moon',
    metadata: {
      version: '1.0.0',
      lastUpdated: '2026-04-15',
      author: 'NERROPLAY Core'
    }
  },
  {
    id: 'heart-rate-calculator',
    name: 'Heart Rate Zone Calculator',
    description: 'Calculate your optimal heart rate zones for fat burn, cardio, and peak performance.',
    category: 'Health & Fitness',
    icon: 'HeartPulse',
    metadata: {
      version: '1.0.0',
      lastUpdated: '2026-04-15',
      author: 'NERROPLAY Core'
    }
  },
  {
    id: 'bmr-calculator',
    name: 'BMR Calculator',
    description: 'Calculate your Basal Metabolic Rate and receive AI-powered metabolic insights.',
    category: 'Health & Fitness',
    icon: 'Flame',
    metadata: {
      version: '1.0.0',
      lastUpdated: '2026-04-16',
      author: 'NERROPLAY Core'
    }
  },
  {
    id: 'body-fat-calculator',
    name: 'Body Fat Calculator',
    description: 'Calculate your body fat percentage using US Navy formula or AI-powered smart estimation.',
    category: 'Health & Fitness',
    icon: 'Percent',
    metadata: {
      version: '1.0.0',
      lastUpdated: '2026-04-17',
      author: 'NERROPLAY Core'
    }
  },
  {
    id: 'ideal-weight-calculator',
    name: 'Ideal Weight Calculator',
    description: 'Calculate your ideal weight using multiple scientific formulas and receive AI health insights.',
    category: 'Health & Fitness',
    icon: 'Target',
    metadata: {
      version: '1.0.0',
      lastUpdated: '2026-04-17',
      author: 'NERROPLAY Core'
    }
  },
  {
    id: 'whtr-calculator',
    name: 'Waist-to-Height Ratio Calculator',
    description: 'Calculate your WHtR to assess fat distribution and health risk levels.',
    category: 'Health & Fitness',
    icon: 'Percent',
    metadata: {
      version: '1.0.0',
      lastUpdated: '2026-04-17',
      author: 'NERROPLAY Core'
    }
  },
  {
    id: 'calorie-deficit-calculator',
    name: 'Calorie Deficit Calculator',
    description: 'Calculate your personalized calorie deficit for fat loss with AI-powered strategy.',
    category: 'Health & Fitness',
    icon: 'Flame',
    metadata: {
      version: '1.0.0',
      lastUpdated: '2026-04-17',
      author: 'NERROPLAY Core'
    }
  },
  {
    id: 'weight-loss-planner',
    name: 'Weight Loss Planner',
    description: 'Plan your journey to target weight with personalized calorie strategy, workouts, and AI insights.',
    category: 'Health & Fitness',
    icon: 'Target',
    metadata: {
      version: '1.0.0',
      lastUpdated: '2026-04-17',
      author: 'NERROPLAY Core'
    }
  },
  {
    id: 'nutrition-planner',
    name: 'Nutrition Planner',
    description: 'Calculate your optimal macro split for fat loss, maintenance, or muscle gain with AI strategy.',
    category: 'Health & Fitness',
    icon: 'Utensils',
    metadata: {
      version: '1.0.0',
      lastUpdated: '2026-04-17',
      author: 'NERROPLAY Core'
    }
  },
  {
    id: 'health-risk-analyzer',
    name: 'Health Risk Analyzer',
    description: 'Assess your overall health risk with a combined analysis of BMI, Body Fat, and WHtR.',
    category: 'Health & Fitness',
    icon: 'Shield',
    metadata: {
      version: '1.0.0',
      lastUpdated: '2026-04-17',
      author: 'NERROPLAY Core'
    }
  },
  {
    id: 'sleep-recovery',
    name: 'Sleep & Recovery',
    description: 'Optimize your rest with cycle calculation, recovery scoring, and AI sleep strategy.',
    category: 'Health & Fitness',
    icon: 'Moon',
    metadata: {
      version: '1.0.0',
      lastUpdated: '2026-04-17',
      author: 'NERROPLAY Core'
    }
  },
  {
    id: 'beauty-analyzer',
    name: 'AI Beauty Analyzer',
    description: 'Neural face analysis for skin health, face shape, and personalized esthetic routines.',
    category: 'Beauty & Skincare',
    icon: 'Sparkles',
    metadata: {
      version: '1.0.0',
      lastUpdated: '2026-04-17',
      author: 'NERROPLAY Core'
    }
  },
  {
    id: 'loan-calculator',
    name: 'Loan Calculator',
    description: 'Advanced loan amortization toolkit with full schedule, repayment optimization, and AI insights.',
    category: 'Finance',
    icon: 'Calculator',
    metadata: {
      version: '1.5.0',
      lastUpdated: '2026-05-11',
      author: 'NERROPLAY Finance Team',
      seoTitle: 'Global Loan Amortization Calculator | NERROPLAY',
      metaDescription: 'Calculate loan EMIs, view amortization schedules, and optimize your repayment strategy with our AI-powered financial tools.'
    },
    education: {
      howItWorks: 'Our engine uses standard amortization formulas to calculate periodic payments. It breaks down each installment into principal and interest components over the loan tenure.',
      formula: 'EMI = [P x R x (1+R)^N] / [(1+R)^N-1]',
      whyUseThis: 'Visualize the long-term impact of interest rates and see exactly how much you will pay in total over the life of the loan.',
      limitations: 'Calculations assume consistent interest rates and no missed payments. Bank-specific processing fees or insurance are not included.',
      commonMistakes: ['Forgetting to include processing fees', 'Not considering the impact of a 0.5% rate change', 'Ignoring the total interest payable']
    },
    faqs: [
      { question: 'Can I calculate part-payments?', answer: 'Yes, our advanced schedule shows how extra payments reduce your principal faster and save on interest.' },
      { question: 'Does it support reducing balance?', answer: 'Yes, all our loan tools use the reducing balance method as standard.' }
    ]
  },
  {
    id: 'profit-calculator',
    name: 'Profit & Margin Calculator',
    description: 'Calculate profit, margins, and get AI-powered pricing strategies for your products.',
    category: 'Finance',
    icon: 'TrendingUp',
    metadata: {
      version: '1.0.0',
      lastUpdated: '2026-04-19',
      author: 'NERROPLAY Core'
    }
  },
  {
    id: 'bike-loan-calculator',
    name: 'Bike Loan Calculator',
    description: 'Calculate flat interest bike loans with amortization and get financial insights.',
    category: 'Finance',
    icon: 'Bike',
    metadata: {
      version: '1.0.0',
      lastUpdated: '2026-04-27',
      author: 'NERROPLAY Core'
    }
  },
  {
    id: 'car-loan-calculator',
    name: 'Car & Heavy Vehicle Loan Calculator',
    description: 'Calculate EMI for cars and heavy vehicles using reducing balance method.',
    category: 'Finance',
    icon: 'Car',
    metadata: {
      version: '1.0.0',
      lastUpdated: '2026-04-27',
      author: 'NERROPLAY Core'
    }
  },
  {
    id: 'home-loan-calculator',
    name: 'Home Loan EMI Calculator',
    description: 'Advanced reducing balance Home Loan calculator with amortization schedule.',
    category: 'Finance',
    icon: 'Home',
    metadata: {
      version: '1.0.0',
      lastUpdated: '2026-04-27',
      author: 'NERROPLAY Core'
    }
  },
  {
    id: 'sip-calculator',
    name: 'SIP Calculator',
    description: 'Calculate future value of your SIP investments with yearly step-up and goal tracking.',
    category: 'Finance',
    icon: 'TrendingUp',
    metadata: {
      version: '1.3.0',
      lastUpdated: '2026-05-11',
      author: 'NERROPLAY Finance Team',
      seoTitle: 'SIP Investment Return Calculator | NERROPLAY',
      metaDescription: 'Project your mutual fund SIP returns with our AI SIP calculator. Support for yearly step-up and long-term goal planning.'
    },
    education: {
      howItWorks: 'The SIP calculator utilizes compound interest logic where the returns are reinvested periodically. It accounts for the frequency of investment and projected annual growth.',
      formula: 'FV = P × [{(1 + i)^n - 1} / i] × (1 + i)',
      whyUseThis: 'To understand the power of compounding and how small regular investments can grow into substantial wealth over 10-20 years.',
      limitations: 'Investment returns are subject to market risks. Past performance is not indicative of future results.',
      commonMistakes: ['Expecting guaranteed returns', 'Choosing unrealistic interest rates', 'Not accounting for inflation']
    },
    faqs: [
      { question: 'What is a Step-Up SIP?', answer: 'It is a feature where you increase your monthly investment by a fixed percentage annually as your income grows.' },
      { question: 'Is the return rate annual or monthly?', answer: 'You enter the annual expected return, and the system calculates the monthly compounding effect.' }
    ]
  },
  {
    id: 'fd-calculator',
    name: 'Fixed Deposit (FD) Calculator',
    description: 'Precision compound interest calculator with yield projection and strategy analysis.',
    category: 'Finance',
    icon: 'Calculator',
    metadata: {
      version: '1.0.0',
      lastUpdated: '2026-04-29',
      author: 'NERROPLAY Core'
    }
  },
  {
    id: 'fashion-styler',
    name: 'AI Women Fashion Styler',
    description: 'Neural luxury styling engine for outfit, makeup, and nails tailored to your occasion.',
    category: 'Beauty & Skincare',
    icon: 'Crown',
    metadata: {
      version: '1.0.0',
      lastUpdated: '2026-04-29',
      author: 'NERROPLAY Core'
    }
  },
  {
    id: 'men-styler',
    name: 'Men Style AI Analyzer',
    description: 'Elite grooming and sartorial analysis engine for hair, beard, and outfits.',
    category: 'Beauty & Skincare',
    icon: 'User',
    metadata: {
      version: '1.0.0',
      lastUpdated: '2026-04-29',
      author: 'NERROPLAY Core'
    }
  },
  {
    id: 'salary-calculator',
    name: 'Salary & Tax Calculator India',
    description: 'Calculate in-hand salary and income tax based on the latest Indian tax regimes (FY 2024-25).',
    category: 'Finance',
    icon: 'Wallet',
    metadata: {
      version: '1.0.0',
      lastUpdated: '2026-04-29',
      author: 'NERROPLAY Core'
    }
  },
  {
    id: 'home-purchase-capability',
    name: 'Home Purchase Capability (3-30-20)',
    description: 'Calculate exactly how much home you can afford using the professional 3-30-20 rule.',
    category: 'Finance',
    icon: 'Home',
    metadata: {
      version: '1.0.0',
      lastUpdated: '2026-05-01',
      author: 'NERROPLAY Core'
    }
  },
  {
    id: 'kundli-tool',
    name: 'Kundli Super Tool',
    description: 'Elite Vedic astrology engine with AI predictions, planetary mapping, and dark mode support.',
    category: 'Spirituality & Lifestyle',
    icon: 'Star',
    metadata: {
      version: '1.0.0',
      lastUpdated: '2026-05-02',
      author: 'NERROPLAY Core'
    }
  },
  {
    id: 'ank-jyotish',
    name: 'Nerro AI - Vedic Numerology',
    description: 'Advanced spiritual intelligence layer operating on top of a deterministic Vedic Numerology engine (Ank Jyotish).',
    category: 'Spirituality & Lifestyle',
    icon: 'Sparkles',
    metadata: {
      version: '1.0.0',
      lastUpdated: '2026-05-11',
      author: 'Nerro AI'
    }
  },
  {
    id: 'ac-intelligence-tool',
    name: 'AC Intelligence Tool',
    description: 'Scan AC energy labels to calculate monthly bills, check efficiency, and find the best energy-saving deals.',
    category: 'Utilities & Smart Living',
    icon: 'Wind',
    metadata: {
      version: '1.0.0',
      lastUpdated: '2026-05-02',
      author: 'NERROPLAY Core'
    }
  },
  {
    id: 'pdf-converter',
    name: 'PDF Converter Tool',
    description: 'Convert PDFs to Word, Excel, PowerPoint, Text, or Images with high-precision client-side engine.',
    category: 'Utilities & Smart Living',
    icon: 'FileText',
    metadata: {
      version: '1.0.0',
      lastUpdated: '2026-05-07',
      author: 'NERROPLAY Core'
    }
  },
  {
    id: 'kundli-matching',
    name: 'Partner Kundali Matching Tool',
    description: 'Vedic Kundli Matching powered by 5,000 years of Jyotish wisdom and modern AI relationship pattern recognition.',
    category: 'Spirituality & Lifestyle',
    icon: 'Heart',
    customPath: '/kundli-matching',
    metadata: {
      version: '2.4.0',
      lastUpdated: '2026-05-13',
      author: 'Nerro AI',
      seoTitle: 'Partner Kundali Matching Tool - AI Vedic Relationship Intelligence',
      metaDescription: 'Vedic Kundli Matching powered by 5,000 years of Jyotish wisdom and modern AI relationship pattern recognition.'
    }
  },
  {
    id: 'moon-sign-report',
    name: 'Moon Sign & Rashi AI',
    description: 'Deeply detailed Vedic Moon sign report with AI-powered spiritual and psychological insights.',
    category: 'Spirituality & Lifestyle',
    icon: 'Moon',
    metadata: {
      version: '1.0.0',
      lastUpdated: '2026-05-12',
      author: 'Nerro AI',
      seoTitle: 'Moon Sign & Rashi Report AI - Authentic Vedic Analysis',
      metaDescription: 'Discover your Vedic Moon sign (Rashi) and Nakshatra with NERRO AI. Get a deeply personalized spiritual report with mantras, remedies, and psychological insights.'
    }
  },
  {
    id: 'nerro-astro-chat',
    name: 'NERRO Astro AI Chat',
    description: 'Talk to your personal Vedic astrologer. Real-time Rashi insights, Nakshatra wisdom, and life guidance powered by NERRO AI.',
    category: 'Spirituality & Lifestyle',
    icon: 'MessageSquare',
    customPath: '/tools/astro-chat',
    metadata: {
      version: '1.0.0',
      lastUpdated: '2026-05-14',
      author: 'Nerro AI',
      seoTitle: 'NERRO Astro AI - Real-Time Vedic Astrology Chat',
      metaDescription: 'Experience the future of Vedic astrology. Chat with NERRO AI for deeply personalized Rashi insights, spiritual guidance, and remedies.'
    }
  }
];

export const GAMES = [];
