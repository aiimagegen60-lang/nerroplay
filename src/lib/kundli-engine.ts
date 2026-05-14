import { RashiName, NakshatraName, KundliMatchInput, KundliMatchReport, AshtakootResult } from './types';
import { RASHIS, PLANET_FRIENDSHIP } from './rashi-data';
import { NAKSHATRAS, YONI_COMPATIBILITY } from './nakshatra-data';
import { KOOTS_INFO, getScoreGrade, getScoreInterpretation } from './guna-milan-data';
import { calculateNadiDosha, calculateBhakootDosha, calculateManglikDosha } from './dosha-engine';

// Helper for deterministic Moon calculation (simplified for SPA without ephimeris)
function calculateMoonState(dateStr: string, timeStr: string): { rashi: RashiName, nakshatra: NakshatraName, pada: 1 | 2 | 3 | 4 } {
  try {
    const date = new Date(`${dateStr}T${timeStr}`);
    if (isNaN(date.getTime())) throw new Error('Invalid date/time');
    
    // Constant reference: Jan 1, 2000, 12:00 = 218.32 degrees
    const refDate = new Date('2000-01-01T12:00:00Z');
    const millisecondsPerDay = 24 * 60 * 60 * 1000;
    const daysSince = (date.getTime() - refDate.getTime()) / millisecondsPerDay;
    
    // Average Moon motion = 13.17639 deg/day
    const baseDegree = 218.32;
    const currentDegree = (baseDegree + (daysSince * 13.17639)) % 360;
    const finalDegree = (currentDegree + 360) % 360;
    
    const rashiIdx = Math.floor(finalDegree / 30);
    const nakIdx = Math.floor(finalDegree / (360 / 27));
    const padaIdx = (Math.floor((finalDegree % (360 / 27)) / (360 / 27 / 4)) + 1) as 1 | 2 | 3 | 4;
    
    return {
      rashi: RASHIS[rashiIdx]?.name ?? 'Mesh',
      nakshatra: NAKSHATRAS[nakIdx]?.name ?? 'Ashwini',
      pada: padaIdx
    };
  } catch (error) {
    console.error('Moon calculation error:', error);
    return { rashi: 'Mesh', nakshatra: 'Ashwini', pada: 1 };
  }
}

export function calculateKundliMatch(input: KundliMatchInput): KundliMatchReport {
  try {
    const p1 = calculateMoonState(input.partner1.dateOfBirth, input.partner1.timeOfBirth);
    const p2 = calculateMoonState(input.partner2.dateOfBirth, input.partner2.timeOfBirth);
    
    const r1 = RASHIS.find(r => r.name === p1.rashi)!;
    const r2 = RASHIS.find(r => r.name === p2.rashi)!;
    const n1 = NAKSHATRAS.find(n => n.name === p1.nakshatra)!;
    const n2 = NAKSHATRAS.find(n => n.name === p2.nakshatra)!;

    const ashtakootBreakdown: AshtakootResult[] = [];
    
    // 1. Varna (Max 1)
    const varnaMap = { 'Brahmin': 4, 'Kshatriya': 3, 'Vaishya': 2, 'Shudra': 1 };
    const varnaScore = varnaMap[r2.varna] >= varnaMap[r1.varna] ? 1 : 0;
    ashtakootBreakdown.push({
      kootName: 'Varna',
      kootDescription: KOOTS_INFO[0].description,
      maxScore: 1,
      achievedScore: varnaScore,
      percentage: (varnaScore / 1) * 100,
      interpretation: varnaScore === 1 ? 'High compatibility in work ethic and spiritual orientation.' : 'Different approaches to professional and spiritual duties.',
      impact: varnaScore === 1 ? 'low' : 'medium'
    });

    // 2. Vasya (Max 2)
    function getVasyaScore(v1: string, v2: string): number {
      if (v1 === v2) return 2;
      const friends: Record<string, string[]> = {
        'Manav': ['Manav'], 'Chatushpad': ['Chatushpad'], 'Jalchar': ['Jalchar'], 'Vanchar': ['None'], 'Keeta': ['None']
      };
      if (friends[v1]?.includes(v2)) return 2;
      return 1; // Simplified
    }
    const vasyaScore = getVasyaScore(r1.vasya, r2.vasya);
    ashtakootBreakdown.push({
      kootName: 'Vasya',
      kootDescription: KOOTS_INFO[1].description,
      maxScore: 2,
      achievedScore: vasyaScore,
      percentage: (vasyaScore / 2) * 100,
      interpretation: vasyaScore === 2 ? 'Strong magnetic attraction and balanced power dynamic.' : 'Moderate attraction with individualistic tendencies.',
      impact: 'medium'
    });

    // 3. Tara (Max 3)
    const nIdx1 = NAKSHATRAS.findIndex(n => n.name === p1.nakshatra);
    const nIdx2 = NAKSHATRAS.findIndex(n => n.name === p2.nakshatra);
    const taraDiff1 = (nIdx2 - nIdx1 + 27) % 9 || 9;
    const taraDiff2 = (nIdx1 - nIdx2 + 27) % 9 || 9;
    const tCheck = [1, 2, 4, 6, 8, 9].includes(taraDiff1) && [1, 2, 4, 6, 8, 9].includes(taraDiff2);
    const taraScore = tCheck ? 3 : 1.5;
    ashtakootBreakdown.push({
      kootName: 'Tara',
      kootDescription: KOOTS_INFO[2].description,
      maxScore: 3,
      achievedScore: taraScore,
      percentage: (taraScore / 3) * 100,
      interpretation: taraScore === 3 ? 'Excellent destiny and mutual well-being markers.' : 'Average alignment in life destiny patterns.',
      impact: 'medium'
    });

    // 4. Yoni (Max 4)
    const yoniScore = YONI_COMPATIBILITY[n1.yoni]?.[n2.yoni] ?? 1;
    ashtakootBreakdown.push({
      kootName: 'Yoni',
      kootDescription: KOOTS_INFO[3].description,
      maxScore: 4,
      achievedScore: yoniScore,
      percentage: (yoniScore / 4) * 100,
      interpretation: yoniScore >= 3 ? 'Very high biological and instinctual sync.' : 'Natural differences in behavioral instincts.',
      impact: 'high'
    });

    // 5. Graha Maitri (Max 5)
    function getGrahaMaitri(l1: string, l2: string): number {
      if (l1 === l2) return 5;
      const f1 = PLANET_FRIENDSHIP[l1];
      const f2 = PLANET_FRIENDSHIP[l2];
      if (f1?.friends.includes(l2) && f2?.friends.includes(l1)) return 5;
      if (f1?.friends.includes(l2) || f2?.friends.includes(l1)) return 4;
      if (f1?.neutral.includes(l2) && f2?.neutral.includes(l1)) return 3;
      if (f1?.enemies.includes(l2) && f2?.enemies.includes(l1)) return 0;
      return 1;
    }
    const grahaScore = getGrahaMaitri(r1.lord, r2.lord);
    ashtakootBreakdown.push({
      kootName: 'Graha Maitri',
      kootDescription: KOOTS_INFO[4].description,
      maxScore: 5,
      achievedScore: grahaScore,
      percentage: (grahaScore / 5) * 100,
      interpretation: grahaScore >= 4 ? 'Deep psychological sync and friendship.' : 'Intellectual differences that require maturity to bridge.',
      impact: 'high'
    });

    // 6. Gana (Max 6)
    function getGanaScore(g1: string, g2: string): number {
      if (g1 === g2) return 6;
      if ((g1 === 'Deva' && g2 === 'Manushya') || (g1 === 'Manushya' && g2 === 'Deva')) return 5;
      if ((g1 === 'Rakshasa' && g2 === 'Manushya') || (g1 === 'Manushya' && g2 === 'Rakshasa')) return 0;
      if ((g1 === 'Deva' && g2 === 'Rakshasa') || (g1 === 'Rakshasa' && g2 === 'Deva')) return 1;
      return 3;
    }
    const ganaScore = getGanaScore(n1.gana, n2.gana);
    ashtakootBreakdown.push({
      kootName: 'Gana',
      kootDescription: KOOTS_INFO[5].description,
      maxScore: 6,
      achievedScore: ganaScore,
      percentage: (ganaScore / 6) * 100,
      interpretation: ganaScore >= 5 ? 'Harmonious temperament and core character.' : 'Temperamental differences; one partner may be more idealistic while the other is more practical.',
      impact: 'high'
    });

    // 7. Bhakoot (Max 7)
    const bhakootDosha = calculateBhakootDosha(p1.rashi, p2.rashi);
    const bhakootScore = bhakootDosha.present ? 0 : 7;
    ashtakootBreakdown.push({
      kootName: 'Bhakoot',
      kootDescription: KOOTS_INFO[6].description,
      maxScore: 7,
      achievedScore: bhakootScore,
      percentage: (bhakootScore / 7) * 100,
      interpretation: bhakootScore === 7 ? 'High emotional sync and family welfare potential.' : 'Potential emotional friction that needs conscious handling.',
      impact: 'high'
    });

    // 8. Nadi (Max 8)
    const nadiDosha = calculateNadiDosha(p1.nakshatra, p2.nakshatra);
    const nadiScore = nadiDosha.present ? 0 : 8;
    ashtakootBreakdown.push({
      kootName: 'Nadi',
      kootDescription: KOOTS_INFO[7].description,
      maxScore: 8,
      achievedScore: nadiScore,
      percentage: (nadiScore / 8) * 100,
      interpretation: nadiScore === 8 ? 'Excellent genetic and physiological compatibility.' : 'Highest priority area; signifies need for health and energy awareness.',
      impact: 'high'
    });

    const totalScore = ashtakootBreakdown.reduce((acc, curr) => acc + curr.achievedScore, 0);

    return {
      partner1Rashi: p1.rashi,
      partner1Nakshatra: p1.nakshatra,
      partner1NakshatraPada: p1.pada,
      partner2Rashi: p2.rashi,
      partner2Nakshatra: p2.nakshatra,
      partner2NakshatraPada: p2.pada,
      gunaMilanScore: totalScore,
      gunaMilanPercentage: (totalScore / 36) * 100,
      gunaMilanGrade: getScoreGrade(totalScore),
      ashtakootBreakdown,
      
      emotionalCompatibility: {
        score: (grahaScore / 5 * 60) + (bhakootScore / 7 * 40),
        label: 'Emotional Resonance',
        summary: 'The emotional bond is determined by the Moon sign rulers and their relative positions. This governs how you feel together and how your hearts beat in sync.',
        strengths: ['Empathetic listening', 'Shared values'],
        challenges: ['Mood swings synchronization'],
        growthOpportunities: ['Building a safe space for vulnerability']
      },
      mentalCompatibility: {
        score: (varnaScore * 40) + (ganaScore / 6 * 60),
        label: 'Mental Alignment',
        summary: 'Your intellectual sync and core temperament define how you process the world and solve problems as a team.',
        strengths: ['Decision making', 'Common vision'],
        challenges: ['Ego clashes'],
        growthOpportunities: ['Active appreciation of differences']
      },
      physicalCompatibility: {
        score: (vasyaScore / 2 * 30) + (yoniScore / 4 * 70),
        label: 'Energetic Vitality',
        summary: 'Physical sync goes beyond attraction; it is about your biological rhythms and instinctual nature.',
        strengths: ['Natural attraction', 'Compatible energy'],
        challenges: ['Lethargy cycles'],
        growthOpportunities: ['Shared physical activities']
      },
      financialCompatibility: {
        score: (bhakootScore / 7 * 100),
        label: 'Prosperity Potential',
        summary: 'Vedic astrology links family prosperity to the Bhakoot sync, which measures how your combined energies attract abundance.',
        strengths: ['Resource management'],
        challenges: ['Financial boundary setting'],
        growthOpportunities: ['Shared financial planning']
      },
      spiritualCompatibility: {
        score: (taraScore / 3 * 50) + (nadiScore / 8 * 50),
        label: 'Soul Alignment',
        summary: 'The deepest layer of matching, looking at your soul contract and evolutionary purpose together.',
        strengths: ['Spiritual goals', 'Karmic support'],
        challenges: ['Evolving at different speeds'],
        growthOpportunities: ['Meditation as a couple']
      },
      communicationCompatibility: {
        score: (grahaScore / 5 * 100),
        label: 'Communication Flow',
        summary: 'How clearly you can express your needs and how well the other partner can receive them.',
        strengths: ['Verbal clarity'],
        challenges: ['Passive aggression'],
        growthOpportunities: ['Non-violent communication habits']
      },
      longTermStability: {
        score: (totalScore / 36 * 100),
        label: 'Marriage Stability',
        summary: 'Measured by the overall balance of all 8 koots, representing the structural integrity of the relationship.',
        strengths: ['Structural balance'],
        challenges: ['Routine fatigue'],
        growthOpportunities: ['Continuous reinvestment in the bond']
      },
      familyHarmony: {
        score: (bhakootScore / 7 * 100),
        label: 'Extended Family Sync',
        summary: 'The ability of the two families to merge and maintain harmony over the long term.',
        strengths: ['Respect for elders', 'Tradition sharing'],
        challenges: ['Boundary management with in-laws'],
        growthOpportunities: ['Clear family communication']
      },

      manglikDosha: calculateManglikDosha(input.partner1.dateOfBirth),
      nadiDosha: calculateNadiDosha(p1.nakshatra, p2.nakshatra),
      bhakootDosha: calculateBhakootDosha(p1.rashi, p2.rashi),

      relationshipEnergy: {
        trustEnergy: 80,
        romanticEnergy: 75,
        supportiveness: 85,
        leadershipBalance: 'Balanced',
        loyaltyPattern: 'Steadfast',
        bondingStyle: 'Emotional-Intellectual',
        overallSummary: getScoreInterpretation(totalScore)
      },
      conflictTendencies: {
        score: 100 - (ganaScore / 6 * 100),
        summary: 'Conflict styles and typical friction points.',
        commonFrictionAreas: ['Control dynamics', 'Communication gaps'],
        resolutionTips: ['Patience', 'Empathy']
      },
      karmicBond: {
        karmicBondType: 'Growth-Oriented',
        pastLifeConnection: 'Soul connections are built over multiple lifetimes.',
        soulContractThemes: ['Stability', 'Evolution'],
        evolutionaryPurpose: 'To support each other in achieving higher consciousness.',
        sharedLessons: ['Unconditional support']
      },
      remedies: [
        {
          title: 'Daily Gratitude',
          category: 'Behavioral',
          description: 'Share one thing you appreciate about each other every day.',
          frequency: 'Daily',
          benefit: 'Builds positive resonance',
          specificTo: 'both'
        }
      ]
    };
  } catch (err) {
    console.error('Calculation crash prevented:', err);
    throw err;
  }
}
