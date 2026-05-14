import { BirthData, AstrologyReport, RashiName, PlanetName } from '../types';
import { RASHI_DATA } from './rashi-data';
import { NAKSHATRA_DATA, NAKSHATRA_NAMES } from './nakshatra-data';

export function calculateAstrologyReport(data: BirthData): AstrologyReport {
  // 1. Calculate Julian Day (Simplified for approximation)
  const birthDate = new Date(`${data.dateOfBirth}T${data.timeOfBirth}`);
  const now = new Date();
  
  // Reference: Jan 1, 2000, 12:00 UTC = 2451545.0 JD
  const refDate = new Date('2000-01-01T12:00:00Z');
  const diffDays = (birthDate.getTime() - refDate.getTime()) / (1000 * 60 * 60 * 24);
  
  // 2. Moon Position Calculation (Approximation)
  // Sidereal Moon moves ~13.17639 degrees per day relative to fixed stars (using Lahiri Ayanamsha type speed)
  const refMoonLong = 218.32; // In degrees
  const avgMoonDailySpeed = 13.17639;
  
  let moonLong = (refMoonLong + (diffDays * avgMoonDailySpeed)) % 360;
  if (moonLong < 0) moonLong += 360;
  
  // 3. Rashi Identification (30 degrees each)
  const rashiIndex = Math.floor(moonLong / 30);
  const RASHIS: RashiName[] = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
  const moonSign = RASHIS[rashiIndex];
  
  const rashiBaseData = RASHI_DATA[moonSign];
  
  // 4. Nakshatra Identification (13.3333 degrees each)
  const nakIndex = Math.floor(moonLong / 13.3333333333);
  const moonNakshatra = NAKSHATRA_NAMES[nakIndex] || 'Ashwini';
  const pada = Math.floor((moonLong % 13.3333333333) / 3.3333333333) + 1;
  
  // 5. Build Report (Static lookup for demo, actual would compute more)
  const report: AstrologyReport = {
    moonSign,
    moonDegree: Number(moonLong.toFixed(2)),
    moonNakshatra,
    nakshatraPada: Math.min(pada, 4) as 1 | 2 | 3 | 4,
    moonLord: rashiBaseData.rulingPlanet as PlanetName,
    ascendant: RASHIS[(rashiIndex + 2) % 12], // Dummy offset
    sunSign: RASHIS[(Math.floor(diffDays / 30.44) + 9) % 12], // Dummy offset
    
    rashiSummary: rashiBaseData.personality.overview,
    personalityAnalysis: rashiBaseData.personality,
    emotionalNature: {
      overview: `As a ${moonSign} moon, your emotions are governed by ${rashiBaseData.rulingPlanet}.`,
      triggers: [`Sudden loss of ${rashiBaseData.element === 'Fire' ? 'autonomy' : 'security'}`, 'Perceived disrespect', 'Lack of progress'],
      communicationStyle: rashiBaseData.career.workStyle,
      needsInRelationships: 'Authenticity, depth, and shared visions.',
      selfCare: rashiBaseData.spiritual.recommendedPractices[0]
    },
    careerEnergy: rashiBaseData.career,
    loveRelationships: rashiBaseData.love,
    wealthPattern: rashiBaseData.wealth,
    spiritualPath: rashiBaseData.spiritual,
    currentLifePhase: {
      chapter: 'Exploration and Foundation',
      themes: ['Self-discovery', 'Creative expression', 'Establishing roots'],
      focus: 'Internal alignment',
      release: 'Old patterns of hesitation',
      insights: 'The universe is currently supporting your desire for expansion.'
    },
    luckyElements: {
      colors: rashiBaseData.color,
      days: rashiBaseData.luckyDays,
      numbers: rashiBaseData.luckyNumbers,
      gemstone: rashiBaseData.gemstone,
      metal: rashiBaseData.metal,
      direction: rashiBaseData.direction
    },
    recommendedMantras: rashiBaseData.mantras,
    vedicRemedies: rashiBaseData.remedies
  };
  
  return report;
}
