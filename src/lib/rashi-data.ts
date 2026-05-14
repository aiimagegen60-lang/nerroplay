import { RashiName } from './types';

export interface RashiInfo {
  name: RashiName;
  lord: string;
  element: 'Fire' | 'Earth' | 'Air' | 'Water';
  varna: 'Brahmin' | 'Kshatriya' | 'Vaishya' | 'Shudra';
  vasya: 'Chatushpad' | 'Manav' | 'Jalchar' | 'Vanchar' | 'Keeta';
}

export const RASHI_DATA: Record<string, any> = {
  'Mesh': { name: 'Mesh', hindiName: 'Aries', symbol: '♈', rulingPlanet: 'Mars', element: 'Fire', quality: 'Movable', gemstone: 'Red Coral', metal: 'Copper', luckyNumbers: [9, 1], luckyDays: ['Tuesday'], color: ['Red'], direction: 'East', personality: { overview: 'Resourceful and brave.', strengths: ['Courageous'], weaknesses: ['Impulsive'] }, career: { overview: 'Leaders.', workStyle: 'Dynamic' }, love: { overview: 'Passionate.' }, wealth: { overview: 'Earns well.' }, spiritual: { recommendedPractices: ['Yoga'] }, seo: { metaTitle: 'Mesh Rashi', metaDescription: 'Mesh description', faqs: [], longFormContent: 'Deep content' } },
  'Aries': { name: 'Mesh', hindiName: 'Aries', symbol: '♈', rulingPlanet: 'Mars', element: 'Fire', quality: 'Movable', gemstone: 'Red Coral', metal: 'Copper', luckyNumbers: [9, 1], luckyDays: ['Tuesday'], color: ['Red'], direction: 'East', personality: { overview: 'Resourceful and brave.', strengths: ['Courageous'], weaknesses: ['Impulsive'] }, career: { overview: 'Leaders.', workStyle: 'Dynamic' }, love: { overview: 'Passionate.' }, wealth: { overview: 'Earns well.' }, spiritual: { recommendedPractices: ['Yoga'] }, seo: { metaTitle: 'Mesh Rashi', metaDescription: 'Mesh description', faqs: [], longFormContent: 'Deep content' } },
};

['Vrishabh', 'Mithun', 'Karka', 'Sinh', 'Kanya', 'Tula', 'Vrishchik', 'Dhanu', 'Makar', 'Kumbh', 'Meen', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'].forEach(r => {
  if (!RASHI_DATA[r]) RASHI_DATA[r] = { ...RASHI_DATA['Mesh'], name: r, hindiName: r };
});

export const RASHIS: RashiInfo[] = [
  { name: 'Mesh', lord: 'Mars', element: 'Fire', varna: 'Kshatriya', vasya: 'Chatushpad' },
  { name: 'Vrishabh', lord: 'Venus', element: 'Earth', varna: 'Vaishya', vasya: 'Chatushpad' },
  { name: 'Mithun', lord: 'Mercury', element: 'Air', varna: 'Shudra', vasya: 'Manav' },
  { name: 'Karka', lord: 'Moon', element: 'Water', varna: 'Brahmin', vasya: 'Jalchar' },
  { name: 'Sinh', lord: 'Sun', element: 'Fire', varna: 'Kshatriya', vasya: 'Vanchar' },
  { name: 'Kanya', lord: 'Mercury', element: 'Earth', varna: 'Shudra', vasya: 'Manav' },
  { name: 'Tula', lord: 'Venus', element: 'Air', varna: 'Vaishya', vasya: 'Manav' },
  { name: 'Vrishchik', lord: 'Mars', element: 'Water', varna: 'Brahmin', vasya: 'Keeta' },
  { name: 'Dhanu', lord: 'Jupiter', element: 'Fire', varna: 'Kshatriya', vasya: 'Manav' }, // Manav (first half), Chatushpad (second half) - simplified
  { name: 'Makar', lord: 'Saturn', element: 'Earth', varna: 'Vaishya', vasya: 'Jalchar' }, // Jalchar (first half), Chatushpad (second half) - simplified
  { name: 'Kumbh', lord: 'Saturn', element: 'Air', varna: 'Shudra', vasya: 'Keeta' },
  { name: 'Meen', lord: 'Jupiter', element: 'Water', varna: 'Brahmin', vasya: 'Jalchar' }
];

export const PLANET_FRIENDSHIP: Record<string, { friends: string[], enemies: string[], neutral: string[] }> = {
  'Sun': { friends: ['Moon', 'Mars', 'Jupiter'], neutral: ['Mercury'], enemies: ['Venus', 'Saturn'] },
  'Moon': { friends: ['Sun', 'Mercury'], neutral: ['Mars', 'Jupiter', 'Venus', 'Saturn'], enemies: [] },
  'Mars': { friends: ['Sun', 'Moon', 'Jupiter'], neutral: ['Venus', 'Saturn'], enemies: ['Mercury'] },
  'Mercury': { friends: ['Sun', 'Venus'], neutral: ['Mars', 'Jupiter', 'Saturn'], enemies: ['Moon'] },
  'Jupiter': { friends: ['Sun', 'Moon', 'Mars'], neutral: ['Saturn'], enemies: ['Mercury', 'Venus'] },
  'Venus': { friends: ['Mercury', 'Saturn'], neutral: ['Mars', 'Jupiter'], enemies: ['Sun', 'Moon'] },
  'Saturn': { friends: ['Mercury', 'Venus'], neutral: ['Jupiter'], enemies: ['Sun', 'Moon', 'Mars'] }
};
