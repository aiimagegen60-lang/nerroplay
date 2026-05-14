import { NakshatraName } from './types';

export interface NakshatraInfo {
  name: NakshatraName;
  lord: string;
  gana: 'Deva' | 'Manushya' | 'Rakshasa';
  yoni: string;
  nadi: 'Aadi' | 'Madhya' | 'Antya';
}

export const NAKSHATRA_DATA: Record<string, any> = {};
export const NAKSHATRA_NAMES: string[] = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha',
  'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
  'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishtha', 'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
];
NAKSHATRA_NAMES.forEach(n => NAKSHATRA_DATA[n] = { name: n });

export const NAKSHATRAS: NakshatraInfo[] = [
  { name: 'Ashwini', lord: 'Ketu', gana: 'Deva', yoni: 'Horse', nadi: 'Aadi' },
  { name: 'Bharani', lord: 'Venus', gana: 'Manushya', yoni: 'Elephant', nadi: 'Madhya' },
  { name: 'Krittika', lord: 'Sun', gana: 'Rakshasa', yoni: 'Sheep', nadi: 'Antya' },
  { name: 'Rohini', lord: 'Moon', gana: 'Manushya', yoni: 'Serpent', nadi: 'Antya' },
  { name: 'Mrigashira', lord: 'Mars', gana: 'Deva', yoni: 'Serpent', nadi: 'Madhya' },
  { name: 'Ardra', lord: 'Rahu', gana: 'Manushya', yoni: 'Dog', nadi: 'Aadi' },
  { name: 'Punarvasu', lord: 'Jupiter', gana: 'Deva', yoni: 'Cat', nadi: 'Aadi' },
  { name: 'Pushya', lord: 'Saturn', gana: 'Deva', yoni: 'Sheep', nadi: 'Madhya' },
  { name: 'Ashlesha', lord: 'Mercury', gana: 'Rakshasa', yoni: 'Cat', nadi: 'Antya' },
  { name: 'Magha', lord: 'Ketu', gana: 'Rakshasa', yoni: 'Rat', nadi: 'Antya' },
  { name: 'Purva Phalguni', lord: 'Venus', gana: 'Manushya', yoni: 'Rat', nadi: 'Madhya' },
  { name: 'Uttara Phalguni', lord: 'Sun', gana: 'Manushya', yoni: 'Cow', nadi: 'Aadi' },
  { name: 'Hasta', lord: 'Moon', gana: 'Deva', yoni: 'Buffalo', nadi: 'Aadi' },
  { name: 'Chitra', lord: 'Mars', gana: 'Rakshasa', yoni: 'Tiger', nadi: 'Madhya' },
  { name: 'Swati', lord: 'Rahu', gana: 'Deva', yoni: 'Buffalo', nadi: 'Antya' },
  { name: 'Vishakha', lord: 'Jupiter', gana: 'Rakshasa', yoni: 'Tiger', nadi: 'Antya' },
  { name: 'Anuradha', lord: 'Saturn', gana: 'Deva', yoni: 'Deer', nadi: 'Madhya' },
  { name: 'Jyeshtha', lord: 'Mercury', gana: 'Rakshasa', yoni: 'Deer', nadi: 'Aadi' },
  { name: 'Mula', lord: 'Ketu', gana: 'Rakshasa', yoni: 'Dog', nadi: 'Aadi' },
  { name: 'Purva Ashadha', lord: 'Venus', gana: 'Manushya', yoni: 'Monkey', nadi: 'Madhya' },
  { name: 'Uttara Ashadha', lord: 'Sun', gana: 'Manushya', yoni: 'Mongoose', nadi: 'Antya' },
  { name: 'Shravana', lord: 'Moon', gana: 'Deva', yoni: 'Monkey', nadi: 'Antya' },
  { name: 'Dhanishtha', lord: 'Mars', gana: 'Rakshasa', yoni: 'Lion', nadi: 'Madhya' },
  { name: 'Shatabhisha', lord: 'Rahu', gana: 'Rakshasa', yoni: 'Horse', nadi: 'Aadi' },
  { name: 'Purva Bhadrapada', lord: 'Jupiter', gana: 'Manushya', yoni: 'Lion', nadi: 'Aadi' },
  { name: 'Uttara Bhadrapada', lord: 'Saturn', gana: 'Manushya', yoni: 'Cow', nadi: 'Madhya' },
  { name: 'Revati', lord: 'Mercury', gana: 'Deva', yoni: 'Elephant', nadi: 'Antya' }
];

export const YONI_COMPATIBILITY: Record<string, Record<string, number>> = {
  'Horse': { 'Horse': 4, 'Elephant': 2, 'Sheep': 3, 'Serpent': 1, 'Dog': 0, 'Cat': 2, 'Rat': 1, 'Cow': 1, 'Buffalo': 2, 'Tiger': 1, 'Deer': 3, 'Monkey': 3, 'Mongoose': 2, 'Lion': 1 },
  'Elephant': { 'Horse': 2, 'Elephant': 4, 'Sheep': 3, 'Serpent': 2, 'Dog': 1, 'Cat': 1, 'Rat': 0, 'Cow': 1, 'Buffalo': 3, 'Tiger': 2, 'Deer': 2, 'Monkey': 2, 'Mongoose': 1, 'Lion': 0 },
  'Sheep': { 'Horse': 3, 'Elephant': 3, 'Sheep': 4, 'Serpent': 2, 'Dog': 1, 'Cat': 1, 'Rat': 1, 'Cow': 2, 'Buffalo': 1, 'Tiger': 0, 'Deer': 2, 'Monkey': 1, 'Mongoose': 2, 'Lion': 1 },
  'Serpent': { 'Horse': 1, 'Elephant': 2, 'Sheep': 2, 'Serpent': 4, 'Dog': 1, 'Cat': 1, 'Rat': 1, 'Cow': 1, 'Buffalo': 2, 'Tiger': 2, 'Deer': 2, 'Monkey': 1, 'Mongoose': 0, 'Lion': 1 },
  'Dog': { 'Horse': 0, 'Elephant': 1, 'Sheep': 1, 'Serpent': 1, 'Dog': 4, 'Cat': 1, 'Rat': 2, 'Cow': 1, 'Buffalo': 2, 'Tiger': 1, 'Deer': 0, 'Monkey': 2, 'Mongoose': 1, 'Lion': 1 },
  'Cat': { 'Horse': 2, 'Elephant': 1, 'Sheep': 1, 'Serpent': 1, 'Dog': 1, 'Cat': 4, 'Rat': 0, 'Cow': 2, 'Buffalo': 1, 'Tiger': 1, 'Deer': 2, 'Monkey': 2, 'Mongoose': 1, 'Lion': 1 },
  'Rat': { 'Horse': 1, 'Elephant': 0, 'Sheep': 1, 'Serpent': 1, 'Dog': 2, 'Cat': 0, 'Rat': 4, 'Cow': 2, 'Buffalo': 1, 'Tiger': 1, 'Deer': 1, 'Monkey': 1, 'Mongoose': 2, 'Lion': 1 },
  'Cow': { 'Horse': 1, 'Elephant': 1, 'Sheep': 2, 'Serpent': 1, 'Dog': 1, 'Cat': 2, 'Rat': 2, 'Cow': 4, 'Buffalo': 3, 'Tiger': 0, 'Deer': 3, 'Monkey': 2, 'Mongoose': 1, 'Lion': 0 },
  'Buffalo': { 'Horse': 2, 'Elephant': 3, 'Sheep': 1, 'Serpent': 2, 'Dog': 2, 'Cat': 1, 'Rat': 1, 'Cow': 3, 'Buffalo': 4, 'Tiger': 1, 'Deer': 2, 'Monkey': 2, 'Mongoose': 1, 'Lion': 1 },
  'Tiger': { 'Horse': 1, 'Elephant': 2, 'Sheep': 0, 'Serpent': 2, 'Dog': 1, 'Cat': 1, 'Rat': 1, 'Cow': 0, 'Buffalo': 1, 'Tiger': 4, 'Deer': 1, 'Monkey': 1, 'Mongoose': 1, 'Lion': 1 },
  'Deer': { 'Horse': 3, 'Elephant': 2, 'Sheep': 2, 'Serpent': 2, 'Dog': 0, 'Cat': 2, 'Rat': 1, 'Cow': 3, 'Buffalo': 2, 'Tiger': 1, 'Deer': 4, 'Monkey': 2, 'Mongoose': 1, 'Lion': 1 },
  'Monkey': { 'Horse': 3, 'Elephant': 2, 'Sheep': 1, 'Serpent': 1, 'Dog': 2, 'Cat': 2, 'Rat': 1, 'Cow': 2, 'Buffalo': 2, 'Tiger': 1, 'Deer': 2, 'Monkey': 4, 'Mongoose': 2, 'Lion': 2 },
  'Mongoose': { 'Horse': 2, 'Elephant': 1, 'Sheep': 2, 'Serpent': 0, 'Dog': 1, 'Cat': 1, 'Rat': 2, 'Cow': 1, 'Buffalo': 1, 'Tiger': 1, 'Deer': 1, 'Monkey': 2, 'Mongoose': 4, 'Lion': 2 },
  'Lion': { 'Horse': 1, 'Elephant': 0, 'Sheep': 1, 'Serpent': 1, 'Dog': 1, 'Cat': 1, 'Rat': 1, 'Cow': 0, 'Buffalo': 1, 'Tiger': 1, 'Deer': 1, 'Monkey': 2, 'Mongoose': 2, 'Lion': 4 }
};
