export type RashiName = 'Mesh' | 'Vrishabh' | 'Mithun' | 'Karka' | 'Sinh' | 'Kanya' | 'Tula' | 'Vrishchik' | 'Dhanu' | 'Makar' | 'Kumbh' | 'Meen';

export type NakshatraName = 
  | 'Ashwini' | 'Bharani' | 'Krittika' | 'Rohini' | 'Mrigashira' | 'Ardra' | 'Punarvasu' | 'Pushya' | 'Ashlesha'
  | 'Magha' | 'Purva Phalguni' | 'Uttara Phalguni' | 'Hasta' | 'Chitra' | 'Swati' | 'Vishakha' | 'Anuradha' | 'Jyeshtha'
  | 'Mula' | 'Purva Ashadha' | 'Uttara Ashadha' | 'Shravana' | 'Dhanishtha' | 'Shatabhisha' | 'Purva Bhadrapada' | 'Uttara Bhadrapada' | 'Revati';

export interface PartnerData {
  fullName?: string;
  dateOfBirth: string;          // YYYY-MM-DD
  timeOfBirth: string;          // HH:MM
  placeOfBirth?: string;
}

export interface KundliMatchInput {
  partner1: PartnerData;
  partner2: PartnerData;
}

export interface AshtakootResult {
  kootName: string;
  kootDescription: string;
  maxScore: number;
  achievedScore: number;
  percentage: number;
  interpretation: string;
  impact: 'high' | 'medium' | 'low';
}

export interface CompatibilityArea {
  score: number;
  label: string;
  summary: string;
  strengths: string[];
  challenges: string[];
  growthOpportunities: string[];
}

export interface DoshaResult {
  present: boolean;
  severity: 'none' | 'mild' | 'moderate' | 'strong';
  description: string;
  traditionalRemedies: string[];
  modernPerspective: string;
  cancellationFactors: string[];
}

export interface RelationshipDynamics {
  trustEnergy: number;
  romanticEnergy: number;
  supportiveness: number;
  leadershipBalance: string;
  loyaltyPattern: string;
  bondingStyle: string;
  overallSummary: string;
}

export interface KarmicProfile {
  karmicBondType: string;
  pastLifeConnection: string;
  soulContractThemes: string[];
  evolutionaryPurpose: string;
  sharedLessons: string[];
}

export interface Remedy {
  title: string;
  category: 'Mantra' | 'Fasting' | 'Gemstone' | 'Ritual' | 'Behavioral';
  description: string;
  frequency: string;
  benefit: string;
  specificTo: 'both' | 'partner1' | 'partner2';
}

export interface NerroRelationshipOutput {
  relationshipArchetype: string;
  emotionalDynamics: string;
  attachmentStyleAnalysis: string;
  karmicPatterns: string;
  communicationProfile: string;
  conflictTendencies: string;
  hiddenStrengths: string[];
  growthOpportunities: string[];
  soulmatePotential: string;
  longTermVision: string;
  partnerAdvice: {
    forPartner1: string;
    forPartner2: string;
  };
  dailyPractice: string;
  soulMessage: string;
}

export interface KundliMatchReport {
  partner1Rashi: RashiName;
  partner1Nakshatra: NakshatraName;
  partner1NakshatraPada: 1 | 2 | 3 | 4;
  partner2Rashi: RashiName;
  partner2Nakshatra: NakshatraName;
  partner2NakshatraPada: 1 | 2 | 3 | 4;

  gunaMilanScore: number;
  gunaMilanPercentage: number;
  gunaMilanGrade: 'Excellent' | 'Very Good' | 'Good' | 'Average' | 'Below Average';
  ashtakootBreakdown: AshtakootResult[];

  emotionalCompatibility: CompatibilityArea;
  mentalCompatibility: CompatibilityArea;
  physicalCompatibility: CompatibilityArea;
  financialCompatibility: CompatibilityArea;
  spiritualCompatibility: CompatibilityArea;
  communicationCompatibility: CompatibilityArea;
  longTermStability: CompatibilityArea;
  familyHarmony: CompatibilityArea;

  manglikDosha: DoshaResult;
  nadiDosha: DoshaResult;
  bhakootDosha: DoshaResult;

  relationshipEnergy: RelationshipDynamics;
  conflictTendencies: {
    score: number;
    summary: string;
    commonFrictionAreas: string[];
    resolutionTips: string[];
  };
  karmicBond: KarmicProfile;

  remedies: Remedy[];
  nerroAnalysis?: NerroRelationshipOutput;
}
