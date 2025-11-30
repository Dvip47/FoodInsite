import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

import { cleanText, extractCleanKeywords } from '../utils/textCleaner.js';

const apiKey = process.env.GEMINI_API_KEY || '';

if (!apiKey) {
  console.warn('⚠️  GEMINI_API_KEY not set. AI features will use fallback responses.');
}

const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

const getModel = () => {
  if (!genAI) {
    throw new Error('Gemini API key not configured');
  }
  return genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
};

/**
 * Map sentiment to numeric value for rating calculation
 */
const sentimentToNumeric = (sentiment) => {
  const mapping = {
    'very_positive': 1.0,
    'positive': 0.8,
    'neutral': 0.5,
    'negative': 0.3,
    'very_negative': 0.1
  };
  return mapping[sentiment] || 0.5;
};

/**
 * Calculate weighted rating from category sentiments
 */
const calculateWeightedRating = (sentiments) => {
  const weights = {
    taste: 0.35,
    service: 0.30,
    ambience: 0.15,
    hygiene: 0.10,
    delivery: 0.10
  };

  let weightedSum = 0;
  let totalWeight = 0;

  Object.entries(weights).forEach(([category, weight]) => {
    const sentiment = sentiments[category] || 'neutral';
    const numericValue = sentimentToNumeric(sentiment);
    weightedSum += numericValue * weight;
    totalWeight += weight;
  });

  // Normalize if weights don't sum to 1
  if (totalWeight > 0) {
    weightedSum = weightedSum / totalWeight;
  }

  // Convert to 1-5 scale and round to nearest 0.5
  const rating = weightedSum * 5;
  return Math.round(rating * 2) / 2; // Round to nearest 0.5
};

/**
 * Determine cluster label based on sentiment analysis
 */
const determineCluster = (sentiments, keywords) => {
  const { taste, service, ambience, hygiene, delivery, overall } = sentiments;
  
  // Strongly positive
  if (overall === 'very_positive' || 
      (overall === 'positive' && [taste, service, ambience].every(s => s === 'positive' || s === 'very_positive'))) {
    return 'Strongly Positive Experience';
  }
  
  // Strongly negative
  if (overall === 'very_negative' || 
      (overall === 'negative' && [taste, service, hygiene].some(s => s === 'negative' || s === 'very_negative'))) {
    return 'Strongly Negative Experience';
  }
  
  // Taste-specific
  if (taste === 'very_positive' || taste === 'positive') {
    return 'Taste Praise';
  }
  if (taste === 'very_negative' || taste === 'negative') {
    return 'Taste Issues';
  }
  
  // Service-specific
  if (service === 'very_positive' || service === 'positive') {
    return 'Service Praise';
  }
  if (service === 'very_negative' || service === 'negative') {
    return 'Service Issues';
  }
  
  // Ambience-specific
  if (ambience === 'very_positive' || ambience === 'positive') {
    return 'Ambience Praise';
  }
  if (ambience === 'very_negative' || ambience === 'negative') {
    return 'Ambience Problems';
  }
  
  // Hygiene-specific
  if (hygiene === 'very_negative' || hygiene === 'negative') {
    return 'Hygiene Problems';
  }
  
  // Delivery-specific
  if (delivery === 'very_positive' || delivery === 'positive') {
    return 'Delivery Praise';
  }
  if (delivery === 'very_negative' || delivery === 'negative') {
    return 'Delivery Delay';
  }
  
  // Mixed feedback
  const positiveCount = [taste, service, ambience, hygiene, delivery]
    .filter(s => s === 'positive' || s === 'very_positive').length;
  const negativeCount = [taste, service, ambience, hygiene, delivery]
    .filter(s => s === 'negative' || s === 'very_negative').length;
  
  if (positiveCount > 0 && negativeCount > 0) {
    return 'Mixed Feedback';
  }
  
  // Default fallback
  return 'General Feedback';
};

/**
 * Fallback analysis when Gemini API is not available
 */
const getFallbackAnalysis = (reviewText) => {
  const cleaned = cleanText(reviewText);
  const lowerText = cleaned.toLowerCase();
  
  const veryPositiveWords = ['excellent', 'amazing', 'fantastic', 'outstanding', 'perfect', 'brilliant', 'superb', 'exceptional', 'wonderful', 'delicious', 'best ever'];
  const positiveWords = ['good', 'great', 'nice', 'love', 'enjoyed', 'satisfied', 'happy', 'pleased', 'recommend'];
  const negativeWords = ['bad', 'poor', 'terrible', 'awful', 'disappointed', 'worst', 'horrible', 'disgusting', 'unacceptable'];
  const veryNegativeWords = ['worst', 'terrible', 'horrible', 'disgusting', 'inedible', 'unacceptable', 'never again', 'waste of money'];
  
  let overall = 'neutral';
  let taste = 'neutral';
  let service = 'neutral';
  let ambience = 'neutral';
  let hygiene = 'neutral';
  let delivery = 'neutral';
  
  // Detect overall sentiment
  if (veryNegativeWords.some(word => lowerText.includes(word))) {
    overall = 'very_negative';
  } else if (veryPositiveWords.some(word => lowerText.includes(word))) {
    overall = 'very_positive';
  } else if (negativeWords.some(word => lowerText.includes(word))) {
    overall = 'negative';
  } else if (positiveWords.some(word => lowerText.includes(word))) {
    overall = 'positive';
  }
  
  // Simple category detection
  if (lowerText.includes('food') || lowerText.includes('taste') || lowerText.includes('dish') || lowerText.includes('meal')) {
    taste = overall;
  }
  if (lowerText.includes('service') || lowerText.includes('staff') || lowerText.includes('waiter') || lowerText.includes('server')) {
    service = overall;
  }
  if (lowerText.includes('ambience') || lowerText.includes('atmosphere') || lowerText.includes('environment') || lowerText.includes('place')) {
    ambience = overall;
  }
  if (lowerText.includes('clean') || lowerText.includes('hygiene') || lowerText.includes('dirty') || lowerText.includes('unclean')) {
    hygiene = overall === 'positive' || overall === 'very_positive' ? 'positive' : 'negative';
  }
  if (lowerText.includes('delivery') || lowerText.includes('delivered') || lowerText.includes('takeout')) {
    delivery = overall;
  }
  
  const sentiments = { taste, service, ambience, hygiene, delivery, overall };
  const rating = calculateWeightedRating(sentiments);
  const keywords = extractCleanKeywords(cleaned, 8);
  
  return {
    cleanText: cleaned,
    sentiment: sentiments,
    keywords: keywords,
    cluster: determineCluster(sentiments, keywords),
    aiRating: rating,
    isFake: false,
    language: 'en',
    aiSummary: 'Review analysis unavailable - API not configured'
  };
};

/**
 * Main review analysis function
 */
export const analyzeReview = async (reviewText) => {
  try {
    // Clean the text first
    const cleaned = cleanText(reviewText);
    
    if (!cleaned || cleaned.length < 10) {
      throw new Error('Review text too short after cleaning');
    }
    
    if (!genAI || !apiKey) {
      console.warn('Gemini API not configured, using fallback analysis');
      return getFallbackAnalysis(reviewText);
    }
    
    const model = getModel();
    
    const prompt = `Clean and analyze this restaurant review. Remove formatting symbols, RTF, or junk text. Extract meaning only.

Review text: "${cleaned}"

Analyze the review and return STRICT JSON only (no markdown, no code blocks):
{
  "cleanText": "cleaned version of the review text",
  "sentiment": {
    "taste": "very_positive" | "positive" | "neutral" | "negative" | "very_negative",
    "service": "very_positive" | "positive" | "neutral" | "negative" | "very_negative",
    "ambience": "very_positive" | "positive" | "neutral" | "negative" | "very_negative",
    "hygiene": "very_positive" | "positive" | "neutral" | "negative" | "very_negative",
    "delivery": "very_positive" | "positive" | "neutral" | "negative" | "very_negative",
    "overall": "very_positive" | "positive" | "neutral" | "negative" | "very_negative"
  },
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "clusterLabel": "specific cluster name",
  "isFakeReview": boolean,
  "language": "language code"
}

SENTIMENT RULES:
- Use "very_positive" for extremely positive reviews (amazing, excellent, perfect, best ever)
- Use "positive" for good reviews (good, great, nice, enjoyed)
- Use "neutral" only when truly neutral (okay, average, nothing special)
- Use "negative" for bad reviews (bad, poor, disappointed)
- Use "very_negative" for extremely bad reviews (terrible, worst, horrible, disgusting)

CLUSTER LABELS (choose the most specific one):
- "Taste Praise" - positive taste feedback
- "Taste Issues" - negative taste feedback
- "Service Praise" - positive service feedback
- "Service Issues" - negative service feedback
- "Ambience Praise" - positive ambience feedback
- "Ambience Problems" - negative ambience feedback
- "Hygiene Problems" - hygiene issues
- "Delivery Praise" - positive delivery feedback
- "Delivery Delay" - delivery issues
- "Mixed Feedback" - both positive and negative aspects
- "Strongly Positive Experience" - overwhelmingly positive
- "Strongly Negative Experience" - overwhelmingly negative
- "General Feedback" - only when nothing else applies

KEYWORDS: Extract 5-10 meaningful keywords (no stopwords, no formatting junk).

Return ONLY valid JSON, nothing else.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean the response to extract JSON
    let jsonText = text.trim();
    
    // Remove markdown code blocks
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '');
    }
    
    // Remove any leading/trailing whitespace
    jsonText = jsonText.trim();
    
    // Try to find JSON object in the response
    const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonText = jsonMatch[0];
    }
    
    const analysis = JSON.parse(jsonText);
    
    // Validate and normalize sentiment values
    const validSentiments = ['very_positive', 'positive', 'neutral', 'negative', 'very_negative'];
    const normalizeSentiment = (s) => {
      if (!s || !validSentiments.includes(s)) return 'neutral';
      return s;
    };
    
    const sentiments = {
      taste: normalizeSentiment(analysis.sentiment?.taste),
      service: normalizeSentiment(analysis.sentiment?.service),
      ambience: normalizeSentiment(analysis.sentiment?.ambience),
      hygiene: normalizeSentiment(analysis.sentiment?.hygiene),
      delivery: normalizeSentiment(analysis.sentiment?.delivery),
      overall: normalizeSentiment(analysis.sentiment?.overall)
    };
    
    // Calculate weighted rating
    const calculatedRating = calculateWeightedRating(sentiments);
    
    // Determine cluster if not provided or generic
    let cluster = analysis.clusterLabel || determineCluster(sentiments, analysis.keywords || []);
    if (cluster === 'uncategorized' || cluster === 'general feedback' || !cluster) {
      cluster = determineCluster(sentiments, analysis.keywords || []);
    }
    
    // Clean and validate keywords
    let keywords = analysis.keywords || [];
    if (!Array.isArray(keywords) || keywords.length === 0) {
      keywords = extractCleanKeywords(analysis.cleanText || cleaned, 8);
    }
    // Filter out invalid keywords
    keywords = keywords
      .filter(k => k && typeof k === 'string' && k.length > 2)
      .slice(0, 10);
    
    return {
      cleanText: analysis.cleanText || cleaned,
      sentiment: sentiments,
      keywords: keywords,
      cluster: cluster,
      aiRating: calculatedRating,
      isFake: analysis.isFakeReview || false,
      language: analysis.language || 'en',
      aiSummary: analysis.aiSummarySentence || ''
    };
  } catch (error) {
    console.error('Gemini API Error:', error.message);
    // Return fallback on error
    return getFallbackAnalysis(reviewText);
  }
};

/**
 * Generate insights from review data
 */
export const generateInsights = async (reviewsData) => {
  try {
    if (!genAI || !apiKey) {
      console.warn('Gemini API not configured, using fallback insights');
      return {
        summary: 'AI insights unavailable. Please configure GEMINI_API_KEY in .env file for AI-powered insights.',
        actionableInsights: [
          'Configure Gemini API key for AI-powered insights',
          'Review sentiment data manually',
          'Analyze keyword trends',
          'Monitor review clusters',
          'Track fake review detection'
        ],
        topKeywords: []
      };
    }
    
    const model = getModel();
    const prompt = `Based on these restaurant review analytics, generate:
1. A comprehensive summary (2-3 paragraphs)
2. 5 actionable insights (bullet points)
3. Top 10 keywords with their importance

Data summary:
- Total reviews: ${reviewsData.total}
- Positive: ${reviewsData.positive}
- Negative: ${reviewsData.negative}
- Average rating: ${reviewsData.avgRating}
- Top clusters: ${reviewsData.topClusters?.join(', ') || 'N/A'}
- Fake reviews detected: ${reviewsData.fakeCount || 0}

Return JSON with:
- summary: string
- actionableInsights: array of strings
- topKeywords: array of {keyword: string, count: number}

Return VALID JSON only.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    let jsonText = text.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '');
    }
    
    return JSON.parse(jsonText);
  } catch (error) {
    console.error('Gemini Insights Error:', error.message);
    return {
      summary: 'Unable to generate insights at this time.',
      actionableInsights: [],
      topKeywords: []
    };
  }
};
