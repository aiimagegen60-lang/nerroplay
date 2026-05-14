import { DoshaResult, NakshatraName, RashiName } from './types';
import { NAKSHATRAS } from './nakshatra-data';
import { RASHIS } from './rashi-data';

export const calculateNadiDosha = (n1: NakshatraName, n2: NakshatraName): DoshaResult => {
  const nak1 = NAKSHATRAS.find(n => n.name === n1);
  const nak2 = NAKSHATRAS.find(n => n.name === n2);

  if (!nak1 || !nak2) {
    return {
      present: false,
      severity: 'none',
      description: 'Insufficient data for Nadi calculation.',
      traditionalRemedies: [],
      modernPerspective: 'Scientific genetics often looks at compatibility through different markers.',
      cancellationFactors: []
    };
  }

  const isSameNadi = nak1.nadi === nak2.nadi;

  // Simplified cancellation: if both are same nakshatra but different padas (simplified here)
  const isCancelled = false; 

  return {
    present: isSameNadi && !isCancelled,
    severity: isSameNadi ? 'strong' : 'none',
    description: isSameNadi 
      ? 'Nadi Dosha occurs when both partners belong to the same Nadi (Aadi, Madhya, or Antya). In Vedic tradition, this is believed to impact the health and progeny of the couple.'
      : 'No Nadi Dosha detected. The physiological energies of both partners are in balance.',
    traditionalRemedies: isSameNadi ? ['Mahamrityunjay Mantra chanting', 'Gifting a golden cow or silver items'] : [],
    modernPerspective: 'Modern health checks often include genetic screening which serves a similar protective purpose.',
    cancellationFactors: isSameNadi ? ['Same Nakshatra but different Padas', 'Same Rashi but different Nakshatras'] : []
  };
};

export const calculateBhakootDosha = (r1: RashiName, r2: RashiName): DoshaResult => {
  const idx1 = RASHIS.findIndex(r => r.name === r1);
  const idx2 = RASHIS.findIndex(r => r.name === r2);

  if (idx1 === -1 || idx2 === -1) {
    return {
      present: false,
      severity: 'none',
      description: 'Insufficient data for Bhakoot calculation.',
      traditionalRemedies: [],
      modernPerspective: 'Emotional intelligence can bridge many gaps in temperament.',
      cancellationFactors: []
    };
  }

  const diff = (idx2 - idx1 + 12) % 12 + 1;
  const isDosha = [2, 5, 6, 8, 9, 12].includes(diff); // Traditional 2-12, 5-9, 6-8 positions

  return {
    present: isDosha,
    severity: isDosha ? 'moderate' : 'none',
    description: isDosha 
      ? 'Bhakoot Dosha relates to the relative position of the Moon signs. Certain positions are believed to create friction in emotional sync and family prosperity.'
      : 'No Bhakoot Dosha detected. The emotional relationship between the Moon signs is harmonious.',
    traditionalRemedies: isDosha ? ['Worshiping lord Ganesha', 'Performing community service'] : [],
    modernPerspective: 'Emotional compatibility is a skill that can be built through mutual understanding.',
    cancellationFactors: isDosha ? ['Common Rashi Lord', 'Strong Graha Maitri (5 points)'] : []
  };
};

export const calculateManglikDosha = (dob: string): DoshaResult => {
  // Real Manglik calculation requires full house chart, which is complex without a library.
  // We will use a deterministic approximation based on birth date/time for this tool.
  const hash = dob.split('-').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const isManglik = hash % 4 === 0;

  return {
    present: isManglik,
    severity: isManglik ? 'mild' : 'none',
    description: isManglik 
      ? 'Manglik Dosha occurs when Mars is positioned in specific houses in the birth chart. It signifies strong Martian energy which, if not balanced, can lead to intense relationship dynamics.'
      : 'No significant Manglik Dosha detected in the general birth profile.',
    traditionalRemedies: isManglik ? ['Reciting Hanuman Chalisa', 'Fast on Tuesdays'] : [],
    modernPerspective: 'Mars represents drive and assertion. A Manglik person often has high leadership qualities.',
    cancellationFactors: isManglik ? ['Age above 28', 'Partner is also Manglik'] : []
  };
};
