export const KOOTS_INFO = [
  {
    name: 'Varna',
    description: 'Work and lifestyle compatibility',
    maxScore: 1,
    details: 'Based on the spiritual and professional orientation of the two individuals.'
  },
  {
    name: 'Vasya',
    description: 'Mutual control and dominance',
    maxScore: 2,
    details: 'Indicates the power dynamic and magnetic attraction between partners.'
  },
  {
    name: 'Tara',
    description: 'Destiny and health compatibility',
    maxScore: 3,
    details: 'Relates to the longevity and physiological health of the couple.'
  },
  {
    name: 'Yoni',
    description: 'Nature and biological compatibility',
    maxScore: 4,
    details: 'Measures physical intimacy and deep-seated natural instincts.'
  },
  {
    name: 'Graha Maitri',
    description: 'Intellectual and mental friendship',
    maxScore: 5,
    details: 'Reflects the psychological sync and friendship between Moon rulers.'
  },
  {
    name: 'Gana',
    description: 'Temperament and character traits',
    maxScore: 6,
    details: 'Indicates the temperamental match (Deva, Manushya, or Rakshasa).'
  },
  {
    name: 'Bhakoot',
    description: 'Emotional and family welfare',
    maxScore: 7,
    details: 'Analyzes the relative positions of Moon signs for prosperity and emotional health.'
  },
  {
    name: 'Nadi',
    description: 'Genetic and physiological constitution',
    maxScore: 8,
    details: 'The most important koot, relating to genetic health and offspring.'
  }
];

export const getScoreInterpretation = (score: number): string => {
  if (score >= 32) return "Excellent (Highly Recommended). This compatibility is rare and considered divinely blessed, offering a very high chance of long-term harmony.";
  if (score >= 28) return "Very Good (Recommended). A stable foundation with strong emotional and mental sync. Most issues can be easily resolved through communication.";
  if (score >= 24) return "Good (Suitable). A healthy match where minor differences exist but can be managed with conscious effort and mutual respect.";
  if (score >= 18) return "Average (Workable). This relationship will require conscious effort and maturity to navigate differences in temperament and values.";
  if (score >= 12) return "Below Average. Significant effort is required to maintain harmony. Partners should focus on developing patience and understanding.";
  return "Challenging. Traditional Vedic astrology advises caution. Success in this relationship requires exceptional commitment and compromise.";
};

export const getScoreGrade = (score: number) => {
  if (score >= 32) return 'Excellent';
  if (score >= 28) return 'Very Good';
  if (score >= 24) return 'Good';
  if (score >= 18) return 'Average';
  return 'Below Average';
};
