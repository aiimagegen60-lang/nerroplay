
import { UserBirthData, AstrologyContext } from '../types/chat.types';
import { calculateAstrologyReport } from './astrology-engine';

export function buildAstroContext(data: UserBirthData): AstrologyContext {
  const report = calculateAstrologyReport({
    fullName: data.fullName,
    dateOfBirth: data.dateOfBirth,
    timeOfBirth: data.knowsExactTime ? data.timeOfBirth : "12:00",
    placeOfBirth: data.placeOfBirth
  });

  const birthDate = new Date(data.dateOfBirth);
  const age = new Date().getFullYear() - birthDate.getFullYear();
  
  let lifePhase = "Early Adult";
  if (age < 20) lifePhase = "Youth";
  else if (age < 35) lifePhase = "Young Professional";
  else if (age < 50) lifePhase = "Mid-Life Mastery";
  else lifePhase = "Elder Wisdom";

  const contextSummary = `
    ${data.fullName} is a ${age}-year-old individual born in ${data.placeOfBirth}.
    In the Vedic tradition, their Moon is currently positioned in the Rashi of ${report.moonSign}, specifically within the ${report.moonNakshatra} Nakshatra (Pada ${report.nakshatraPada}).
    This placement is governed by ${report.moonLord}, suggesting a personality that is deeply influenced by the elemental quality of ${lifePhase}.
    Their emotional nature is described as: ${report.rashiSummary}.
    They are currently in a life phase focused on ${report.currentLifePhase.focus}, with the primary theme being ${report.currentLifePhase.themes.join(', ')}.
  `.trim();

  return {
    fullName: data.fullName,
    age: age,
    placeOfBirth: data.placeOfBirth,
    moonSign: report.moonSign,
    moonSignEnglish: report.moonSign, // For now keeping same or I could map if I have data
    nakshatra: report.moonNakshatra,
    nakshatraPada: report.nakshatraPada,
    nakshatraLord: "Mercury", // TODO: Get from engine if available
    moonLord: report.moonLord,
    sunSign: report.sunSign,
    element: "Fire", // TODO: Get from engine
    quality: "Fixed", // TODO: Get from engine
    guna: "Sattva", // TODO: Get from engine
    approximateAge: age,
    lifePhase: lifePhase,
    contextSummary: contextSummary
  };
}
