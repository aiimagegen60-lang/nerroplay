export interface AnkJyotishInput {
  full_name: string;
  preferred_name: string | null;
  date_of_birth: string; // YYYY-MM-DD
  gender: 'male' | 'female';
  partner_name: string | null;
  partner_dob: string | null;
  partner_gender: 'male' | 'female' | null;
}

const letterValues: Record<string, number> = {
  A: 1, I: 1, J: 1, Q: 1, Y: 1,
  B: 2, K: 2, R: 2,
  C: 3, G: 3, L: 3, S: 3,
  D: 4, M: 4, T: 4,
  E: 5, H: 5, N: 5, X: 5,
  U: 6, V: 6, W: 6,
  O: 7, Z: 7,
  F: 8, P: 8
};

const reduceToSingleDigit = (num: number): { reduced: number, compound: number } => {
  let compound = num;
  let current = num;
  while (current > 9) {
    let sum = 0;
    while (current > 0) {
      sum += current % 10;
      current = Math.floor(current / 10);
    }
    current = sum;
  }
  return { reduced: current, compound: compound > 9 ? compound : compound };
};

const calculateNamank = (name: string) => {
  let sum = 0;
  for (let char of name.toUpperCase()) {
    if (letterValues[char]) {
      sum += letterValues[char];
    }
  }
  return reduceToSingleDigit(sum);
};

export const NumberDetails: Record<number, any> = {
  1: {
    planet_hindi: 'Surya', planet: 'Sun',
    archetype: 'The King (Raja)',
    strengths: ['Confident', 'Self-reliant', 'Pioneering', 'Natural leader'],
    shadow: ['Ego', 'Arrogance', 'Dominating', 'Difficulty accepting help'],
    life_purpose: 'To lead, inspire, and illuminate others',
    career: ['Government', 'Politics', 'CEO', 'Administration', 'Gold trade', 'Medicine'],
    health: ['Heart', 'Eyes', 'Bones', 'Vitality', 'Right side'],
    rem: { day: 'Sunday', color: 'Red/Orange', metal: 'Gold/Copper', gem: 'Ruby', deity: 'Surya Dev', mantra: 'Om Hraam Hreem Hraum Sah Suryaya Namah' }
  },
  2: {
    planet_hindi: 'Chandra', planet: 'Moon',
    archetype: 'The Nurturer (Mata)',
    strengths: ['Empathetic', 'Intuitive', 'Diplomatic', 'Good listener', 'Creative'],
    shadow: ['Moody', 'Indecisive', 'Over-sensitive', 'Clingy', 'Escapist'],
    life_purpose: 'To heal, nurture, and emotionally connect humanity',
    career: ['Nursing', 'Healing', 'Hospitality', 'Travel', 'Food', 'Writing', 'Psychology'],
    health: ['Mind', 'Lungs', 'Chest', 'Lymph', 'Left side'],
    rem: { day: 'Monday', color: 'White/Silver', metal: 'Silver', gem: 'Pearl', deity: 'Lord Shiva', mantra: 'Om Shram Shreem Shraum Sah Chandraya Namah' }
  },
  3: {
    planet_hindi: 'Guru', planet: 'Jupiter',
    archetype: 'The Teacher (Acharya)',
    strengths: ['Knowledgeable', 'Generous', 'Philosophical', 'Inspiring', 'Lucky'],
    shadow: ['Overconfident', 'Preachy', 'Extravagant', 'Over-promises'],
    life_purpose: 'To teach, guide, and expand consciousness',
    career: ['Teaching', 'Law', 'Spirituality', 'Finance', 'Publishing', 'Counseling'],
    health: ['Liver', 'Thighs', 'Fat', 'Hips', 'Ears'],
    rem: { day: 'Thursday', color: 'Yellow', metal: 'Gold', gem: 'Yellow Sapphire', deity: 'Lord Vishnu', mantra: 'Om Graam Greem Graum Sah Gurave Namah' }
  },
  4: {
    planet_hindi: 'Rahu', planet: 'North Node',
    archetype: 'The Rebel (Krantikaari)',
    strengths: ['Innovative', 'Hardworking', 'Determined', 'Ahead of time', 'Unique'],
    shadow: ['Obsessive', 'Confused', 'Secretive', 'Materialistic', 'Unstable'],
    life_purpose: 'To break old patterns and bring unconventional wisdom',
    career: ['Technology', 'Research', 'Politics', 'Speculation', 'Astrology', 'Foreign'],
    health: ['Skin', 'Nervous system', 'Subconscious', 'Phobias'],
    rem: { day: 'Saturday/Wednesday', color: 'Electric Blue', metal: 'Mixed', gem: 'Hessonite', deity: 'Rahu Dev', mantra: 'Om Raam Rahave Namah' }
  },
  5: {
    planet_hindi: 'Budh', planet: 'Mercury',
    archetype: 'The Communicator (Vaarta)',
    strengths: ['Quick thinker', 'Eloquent', 'Versatile', 'Entrepreneurial', 'Youthful'],
    shadow: ['Fickle', 'Nervous', 'Restless', 'Scattered', 'Deceptive at times'],
    life_purpose: 'To communicate, trade, and connect ideas across worlds',
    career: ['Business', 'Media', 'Writing', 'IT', 'Stock market', 'Sales'],
    health: ['Nervous system', 'Skin', 'Tongue', 'Hands'],
    rem: { day: 'Wednesday', color: 'Green', metal: 'Brass', gem: 'Emerald', deity: 'Lord Ganesha', mantra: 'Om Braam Breem Braum Sah Budhaya Namah' }
  },
  6: {
    planet_hindi: 'Shukra', planet: 'Venus',
    archetype: 'The Beloved (Priya)',
    strengths: ['Charming', 'Artistic', 'Loving', 'Diplomatic', 'Graceful', 'Magnetic'],
    shadow: ['Vain', 'Indulgent', 'Jealous', 'Dependent in love', 'Materialistic'],
    life_purpose: 'To bring beauty, harmony, and love into the world',
    career: ['Fashion', 'Beauty', 'Arts', 'Music', 'Luxury goods', 'Hospitality', 'Cinema'],
    health: ['Reproductive system', 'Kidneys', 'Face', 'Throat'],
    rem: { day: 'Friday', color: 'Pink/White', metal: 'Silver', gem: 'Diamond', deity: 'Devi Lakshmi', mantra: 'Om Draam Dreem Draum Sah Shukraya Namah' }
  },
  7: {
    planet_hindi: 'Ketu', planet: 'South Node',
    archetype: 'The Mystic (Sanyasi)',
    strengths: ['Deeply intuitive', 'Spiritual', 'Analytical', 'Wise beyond age'],
    shadow: ['Aloof', 'Secretive', 'Confused', 'Self-isolating', 'Trust issues'],
    life_purpose: 'To seek moksha, dissolve ego, and serve the divine',
    career: ['Spirituality', 'Healing', 'Research', 'Astrology', 'Philosophy', 'Foreign'],
    health: ['Spine', 'Reproductive system', 'Subconscious', 'Mysterious ailments'],
    rem: { day: 'Tuesday', color: 'Grey/Smoke', metal: 'Iron', gem: "Cat's eye", deity: 'Ketu Dev', mantra: 'Om Sraam Sreem Sraum Sah Ketave Namah' }
  },
  8: {
    planet_hindi: 'Shani', planet: 'Saturn',
    archetype: 'The Karmic Judge (Nyayaadheesh)',
    strengths: ['Disciplined', 'Patient', 'Just', 'Enduring', 'Wise through suffering'],
    shadow: ['Pessimistic', 'Cold', 'Rigid', 'Prone to depression', 'Lonely'],
    life_purpose: 'To work through karma, build lasting things, and achieve true wisdom through hardship',
    career: ['Real estate', 'Law', 'Mining', 'Agriculture', 'Labour', 'Judiciary', 'Oil'],
    health: ['Bones', 'Teeth', 'Knees', 'Joints', 'Nerves'],
    rem: { day: 'Saturday', color: 'Black/Dark blue', metal: 'Iron', gem: 'Blue Sapphire', deity: 'Lord Shani Dev', mantra: 'Om Praam Preem Praum Sah Shanaischaraya Namah' }
  },
  9: {
    planet_hindi: 'Mangal', planet: 'Mars',
    archetype: 'The Warrior (Yoddha)',
    strengths: ['Brave', 'Energetic', 'Passionate', 'Protective', 'Natural fighter'],
    shadow: ['Aggressive', 'Impulsive', 'Accident-prone', 'Argumentative'],
    life_purpose: 'To act, protect, fight for truth, and achieve victory',
    career: ['Military', 'Police', 'Surgery', 'Sports', 'Engineering', 'Real estate'],
    health: ['Blood', 'Muscles', 'Head', 'Bone marrow'],
    rem: { day: 'Tuesday', color: 'Red', metal: 'Copper', gem: 'Red coral', deity: 'Lord Hanuman', mantra: 'Om Kraam Kreem Kraum Sah Bhaumaya Namah' }
  }
};

export const FriendshipTable: Record<number, any> = {
  1: { friends: [1,2,3,4,5,7,9], enemies: [6,8] }, // simplified
  2: { friends: [1,2,3,5,6,9], enemies: [4,7,8] },
  3: { friends: [1,2,3,5,6,9], enemies: [4,7,8] },
  4: { friends: [1,4,5,6,7,8], enemies: [2,3,9] },
  5: { friends: [1,2,4,5,6], enemies: [3,7,8,9] },
  6: { friends: [2,3,4,5,6,9], enemies: [1,7,8] },
  7: { friends: [1,2,4,5,7], enemies: [3,6,8,9] },
  8: { friends: [4,5,6,8], enemies: [1,2,3,7,9] },
  9: { friends: [1,2,3,6,9], enemies: [4,5,7,8] }
};

export function calculateAnkJyotish(input: AnkJyotishInput) {
  if (!input.date_of_birth) {
    return { status: "error", error_message: "Please provide your full date of birth in YYYY-MM-DD format. Your Moolank and Bhagyank cannot be calculated without it." };
  }
  if (!input.full_name) {
    return { status: "error", error_message: "Please enter your full birth name as it appears on your birth certificate to calculate your Namank (Name Number)." };
  }

  const [yyyy, mm, dd] = input.date_of_birth.split('-');
  const year = parseInt(yyyy);
  const month = parseInt(mm);
  const day = parseInt(dd);

  // Moolank (Birth Day)
  const moolankRes = reduceToSingleDigit(day);
  const moolank = moolankRes.reduced;

  // Bhagyank (DOB sum)
  const fullDobSum = `${yyyy}${mm}${dd}`.split('').reduce((sum, d) => sum + parseInt(d), 0);
  const bhagyankRes = reduceToSingleDigit(fullDobSum);
  const bhagyank = bhagyankRes.reduced;

  // Namank
  const birthNamankRes = calculateNamank(input.full_name);
  let prefNamankRes = null;
  if (input.preferred_name) {
    prefNamankRes = calculateNamank(input.preferred_name);
  }

  // Kua Number
  const yearDigitsSum = reduceToSingleDigit(parseInt(yyyy.slice(-2))).reduced;
  let kua = 0;
  if (input.gender === 'male') {
    kua = year >= 2000 ? 9 - yearDigitsSum : 10 - yearDigitsSum;
    if (kua === 5) kua = 2;
  } else {
    kua = year >= 2000 ? yearDigitsSum + 6 : yearDigitsSum + 5;
    kua = reduceToSingleDigit(kua).reduced;
    if (kua === 5) kua = 8;
  }
  const kuaGroup = [1,3,4,9].includes(kua) ? 'east' : 'west';
  const bestDirs = kuaGroup === 'east' ? ['E', 'SE', 'N', 'S'] : ['W', 'NW', 'SW', 'NE'];
  const worstDirs = kuaGroup === 'east' ? ['W', 'NW', 'SW', 'NE'] : ['E', 'SE', 'N', 'S'];

  // Lo Shu Grid
  const grid: any = { 1:0, 2:0, 3:0, 4:0, 5:0, 6:0, 7:0, 8:0, 9:0 };
  for (let d of `${yyyy}${mm}${dd}`) {
    if (d !== '0') grid[d] = (grid[d] || 0) + 1;
  }
  const missing = [];
  for (let i=1; i<=9; i++) {
    if (grid[i] === 0) missing.push(i);
  }
  const mental = [4,9,2].filter(n => grid[n] > 0);
  const emotional = [3,5,7].filter(n => grid[n] > 0);
  const physical = [8,1,6].filter(n => grid[n] > 0);

  // Return standard matching JSON
  return {
    status: "success",
    error_message: null,
    profile: { full_name: input.full_name, preferred_name: input.preferred_name, date_of_birth: input.date_of_birth, gender: input.gender },
    core_numbers: {
      moolank: { number: moolank, compound_number: moolankRes.compound, ruling_planet: NumberDetails[moolank].planet, planet_hindi: NumberDetails[moolank].planet_hindi, archetype: NumberDetails[moolank].archetype },
      bhagyank: { number: bhagyank, compound_number: bhagyankRes.compound, ruling_planet: NumberDetails[bhagyank].planet, planet_hindi: NumberDetails[bhagyank].planet_hindi, archetype: NumberDetails[bhagyank].archetype },
      namank_birth: { number: birthNamankRes.reduced, compound_number: birthNamankRes.compound, name_used: input.full_name, ruling_planet: NumberDetails[birthNamankRes.reduced]?.planet },
      kua_number: { number: kua, group: kuaGroup, best_directions: bestDirs, worst_directions: worstDirs }
    },
    lo_shu_grid: {
      grid,
      missing_numbers: missing.map(n => ({ number: n, quality_missing: "Quality of " + n, karmic_lesson: "Learn " + n, how_to_develop: "Develop " + n })),
      repeated_numbers: [],
      active_arrows: [],
      planes: {
        mental_plane: { numbers_present: mental, strength: mental.length === 3 ? "strong" : "weak", reading: "" },
        emotional_plane: { numbers_present: emotional, strength: emotional.length === 3 ? "strong" : "weak", reading: "" },
        physical_plane: { numbers_present: physical, strength: physical.length === 3 ? "strong" : "weak", reading: "" }
      }
    },
    current_cycles: {
        personal_year: 1,
        personal_month: 2,
        personal_day: 3,
        personal_year_name: "Year of XYZ",
        personal_year_theme: "Theme",
        best_actions_this_year: ["Focus"],
        avoid_this_year: ["Distractions"],
        peak_months: [4, 8]
    },
    interpretations: {
        moolank_reading: { title: "Moolank " + moolank, ruling_planet_detail: "", core_personality: "Personality based on " + moolank, strengths: [], challenges: [], hidden_talent: "", life_purpose: "", health_areas_to_watch: [], ideal_career_fields: [], relationship_style: "", spiritual_path: "", famous_indians: [] },
        bhagyank_reading: { title: "Bhagyank " + bhagyank, karmic_mission: "", destined_opportunities: [], karmic_challenges: [], life_turning_points: "", wealth_pattern: "" },
        moolank_bhagyank_combined: { harmony: "aligned", combined_reading: "Energy of " + moolank + " and " + bhagyank, dominant_energy: "" }
    },
    compatibility: { available: false, partner_name: null, partner_moolank: null, partner_bhagyank: null, compatibility_score: null, planetary_relationship: null, dynamic_type: null, strengths: null, challenges: null, is_destined_connection: null, remedies_for_harmony: null, spiritual_bond: null },
    vedic_remedies: { based_on_moolank: moolank, primary_gemstone: { name: "", hindi_name: "", how_to_wear: "", finger: "", metal: "", day_to_wear: "", weight_ratti: "", benefit: "" } }
  };
}
