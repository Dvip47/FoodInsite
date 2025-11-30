/**
 * Advanced text cleaning utility
 * Removes RTF, formatting junk, and noise from review text
 */

export const cleanText = (text) => {
  if (!text || typeof text !== 'string') return '';

  let cleaned = text;

  // Remove RTF fragments
  cleaned = cleaned.replace(/\\rtf1|\\ansi|\\pard|\\pardpard|\\colortbl|\\cocoaplatform/gi, '');
  
  // Remove RTF control words (backslash followed by word)
  cleaned = cleaned.replace(/\\[a-z]+\d*\s*/gi, '');
  
  // Remove curly braces (RTF formatting)
  cleaned = cleaned.replace(/[{}]/g, '');
  
  // Remove excessive whitespace and newlines
  cleaned = cleaned.replace(/\s+/g, ' ');
  cleaned = cleaned.replace(/\n+/g, ' ');
  cleaned = cleaned.replace(/\t+/g, ' ');
  cleaned = cleaned.replace(/\r+/g, ' ');
  
  // Remove repeated punctuation (more than 2)
  cleaned = cleaned.replace(/!{3,}/g, '!!');
  cleaned = cleaned.replace(/\?{3,}/g, '??');
  cleaned = cleaned.replace(/\.{4,}/g, '...');
  
  // Remove square brackets (often formatting)
  cleaned = cleaned.replace(/[\[\]]/g, '');
  
  // Remove emojis (optional - can be kept if needed)
  // cleaned = cleaned.replace(/[\u{1F600}-\u{1F64F}]/gu, '');
  // cleaned = cleaned.replace(/[\u{1F300}-\u{1F5FF}]/gu, '');
  // cleaned = cleaned.replace(/[\u{1F680}-\u{1F6FF}]/gu, '');
  // cleaned = cleaned.replace(/[\u{2600}-\u{26FF}]/gu, '');
  // cleaned = cleaned.replace(/[\u{2700}-\u{27BF}]/gu, '');
  
  // Remove control characters
  cleaned = cleaned.replace(/[\x00-\x1F\x7F-\x9F]/g, '');
  
  // Remove zero-width characters
  cleaned = cleaned.replace(/[\u200B-\u200D\uFEFF]/g, '');
  
  // Trim and normalize spaces
  cleaned = cleaned.trim();
  cleaned = cleaned.replace(/\s+/g, ' ');
  
  return cleaned;
};

export const removeStopwords = (text) => {
  const stopwords = [
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been',
    'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
    'should', 'could', 'may', 'might', 'must', 'can', 'this', 'that',
    'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me',
    'him', 'her', 'us', 'them', 'my', 'your', 'his', 'her', 'its', 'our',
    'their', 'what', 'which', 'who', 'whom', 'whose', 'where', 'when',
    'why', 'how', 'all', 'each', 'every', 'both', 'few', 'more', 'most',
    'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same',
    'so', 'than', 'too', 'very', 'just', 'now'
  ];
  
  const words = text.toLowerCase().split(/\s+/);
  return words.filter(word => 
    word.length > 2 && !stopwords.includes(word)
  ).join(' ');
};

export const extractCleanKeywords = (text, maxKeywords = 10) => {
  const cleaned = cleanText(text);
  const withoutStopwords = removeStopwords(cleaned);
  
  // Extract words (3+ characters, alphanumeric)
  const words = withoutStopwords
    .toLowerCase()
    .match(/\b[a-z]{3,}\b/gi) || [];
  
  // Count frequency
  const wordCount = {};
  words.forEach(word => {
    wordCount[word] = (wordCount[word] || 0) + 1;
  });
  
  // Sort by frequency and return top keywords
  return Object.entries(wordCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxKeywords)
    .map(([word]) => word);
};

