export const preprocessText = (text) => {
  if (!text || typeof text !== 'string') return '';
  
  return text
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/[^\w\s.,!?;:()\-']/g, '');
};

export const extractLanguage = (text) => {
  // Simple heuristic - can be enhanced with proper language detection library
  const commonWords = {
    en: ['the', 'and', 'is', 'was', 'are', 'were', 'this', 'that', 'with', 'for'],
    es: ['el', 'la', 'de', 'que', 'y', 'en', 'un', 'es', 'se', 'no'],
    fr: ['le', 'de', 'et', 'à', 'un', 'il', 'être', 'et', 'en', 'avoir'],
    hi: ['की', 'के', 'है', 'में', 'को', 'से', 'पर', 'या', 'एक', 'नहीं']
  };
  
  const lowerText = text.toLowerCase();
  let maxMatches = 0;
  let detectedLang = 'en';
  
  for (const [lang, words] of Object.entries(commonWords)) {
    const matches = words.filter(word => lowerText.includes(word)).length;
    if (matches > maxMatches) {
      maxMatches = matches;
      detectedLang = lang;
    }
  }
  
  return detectedLang;
};

export const normalizeText = (text) => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
};

