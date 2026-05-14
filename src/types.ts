export interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  customPath?: string;
  metadata: {
    version: string;
    lastUpdated: string;
    author: string;
    seoTitle?: string;
    metaDescription?: string;
  };
  education?: {
    howItWorks: string;
    formula?: string;
    whyUseThis: string;
    limitations: string;
    commonMistakes: string[];
  };
  faqs?: Array<{ question: string; answer: string }>;
}

export type RashiName = 'Aries' | 'Taurus' | 'Gemini' | 'Cancer' | 'Leo' | 'Virgo' | 'Libra' | 'Scorpio' | 'Sagittarius' | 'Capricorn' | 'Aquarius' | 'Pisces';
export type NakshatraName = string; // Will be typed from data
export type PlanetName = 'Sun' | 'Moon' | 'Mars' | 'Mercury' | 'Jupiter' | 'Venus' | 'Saturn' | 'Rahu' | 'Ketu';

export interface BirthData {
  fullName: string;
  dateOfBirth: string; // YYYY-MM-DD
  timeOfBirth: string; // HH:MM (24hr)
  placeOfBirth: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
}

export interface Mantra {
  primaryMantra: string;
  meaning: string;
  chantingTime: string;
  repetitions: number;
  benefits: string[];
}

export interface Remedy {
  title: string;
  description: string;
  frequency: string;
  benefit: string;
}

export interface NerroAIOutput {
  emotionalPatterns: string;
  karmicTendencies: string;
  subconsciousFears: string;
  hiddenStrengths: string;
  lifeLessons: string[];
  spiritualGrowthPath: string;
  currentCyclicEnergy: string;
  dailyAffirmation: string;
  weeklyFocus: string;
  soulMessage: string;
}

export interface AstrologyReport {
  moonSign: RashiName;
  moonDegree: number;
  moonNakshatra: NakshatraName;
  nakshatraPada: 1 | 2 | 3 | 4;
  moonLord: PlanetName;
  ascendant: RashiName;
  sunSign: RashiName;
  rashiSummary: string;
  personalityAnalysis: {
    overview: string;
    strengths: string[];
    weaknesses: string[];
    hiddenTraits: string[];
    coreDesires: string[];
    deepFears: string[];
  };
  emotionalNature: {
    overview: string;
    triggers: string[];
    communicationStyle: string;
    needsInRelationships: string;
    selfCare: string;
  };
  careerEnergy: {
    overview: string;
    bestProfessions: string[];
    workStyle: string;
    leadershipStyle: string;
    financialHabits: string;
    businessTendencies: string;
  };
  loveRelationships: {
    overview: string;
    romanticNature: string;
    compatibleRashis: string[];
    challengingRashis: string[];
    idealPartnerQualities: string[];
    relationshipPatterns: string;
    intimacyStyle: string;
  };
  wealthPattern: {
    overview: string;
    moneyMindset: string;
    savingHabits: string;
    investmentStyle: string;
    wealthBlocks: string[];
    wealthActivators: string[];
  };
  spiritualPath: {
    overview: string;
    karmicLessons: string[];
    pastLifePatterns: string;
    spiritualGifts: string[];
    recommendedPractices: string[];
    sacredDays: string[];
  };
  currentLifePhase: {
    chapter: string;
    themes: string[];
    focus: string;
    release: string;
    insights: string;
  };
  luckyElements: {
    colors: string[];
    days: string[];
    numbers: number[];
    gemstone: string;
    metal: string;
    direction: string;
  };
  recommendedMantras: Mantra[];
  vedicRemedies: Remedy[];
  nerroAnalysis?: NerroAIOutput;
}

export interface AnalysisReport {
  summary: string;
  score: number;
  details: string[];
  recommendations: string[];
}

export interface UserMetrics {
  weight: number;
  height: number;
  age: number;
  gender: 'male' | 'female';
  activity: string;
  waist: number;
  bodyFat?: number;
  bmi?: number;
}

export interface DailyActivity {
  date: string;
  water: number; // glasses
  calories: number;
  sleep: number; // hours
  workout: boolean;
}

export interface DashboardState {
  metrics: UserMetrics;
  daily: Record<string, DailyActivity>; // key: YYYY-MM-DD
  goals: {
    targetWeight: number;
    startWeight: number;
    dailyCalorieTarget: number;
    dailyWaterGoal: number;
    dailySleepGoal: number;
  };
  onboarded: boolean;
}
