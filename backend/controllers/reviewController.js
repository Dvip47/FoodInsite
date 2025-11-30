import Review from '../models/Review.js';
import Insight from '../models/Insight.js';
import { analyzeReview } from '../services/geminiService.js';
import { generateClusters } from '../services/clusteringService.js';
import { extractTopKeywords } from '../services/keywordService.js';
import { generateInsights } from '../services/geminiService.js';

export const createReview = async (req, res, next) => {
  try {
    const { text } = req.body;
    
    if (!text || typeof text !== 'string' || text.trim().length < 10) {
      return res.status(400).json({
        success: false,
        error: 'Review text must be at least 10 characters long'
      });
    }
    
    // Analyze review (text cleaning happens inside analyzeReview)
    const analysis = await analyzeReview(text);
    
    const review = new Review({
      text: text.trim(), // Keep original text
      cleanText: analysis.cleanText, // Store cleaned version
      language: analysis.language,
      sentiment: analysis.sentiment,
      keywords: analysis.keywords,
      cluster: analysis.cluster,
      aiRating: analysis.aiRating,
      isFake: analysis.isFake
    });
    
    await review.save();
    
    res.status(201).json({
      success: true,
      data: review
    });
  } catch (error) {
    next(error);
  }
};

export const getAllReviews = async (req, res, next) => {
  try {
    const { page = 1, limit = 50, cluster, isFake, sort = '-createdAt' } = req.query;
    
    const query = {};
    if (cluster) query.cluster = cluster;
    if (isFake !== undefined) query.isFake = isFake === 'true';
    
    const reviews = await Review.find(query)
      .sort(sort)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));
    
    const total = await Review.countDocuments(query);
    
    res.json({
      success: true,
      data: reviews,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getInsights = async (req, res, next) => {
  try {
    const reviews = await Review.find({});
    
    const total = reviews.length;
    const positive = reviews.filter(r => 
      r.sentiment.overall === 'positive' || r.sentiment.overall === 'very_positive'
    ).length;
    const negative = reviews.filter(r => 
      r.sentiment.overall === 'negative' || r.sentiment.overall === 'very_negative'
    ).length;
    const avgRating = reviews.reduce((sum, r) => sum + r.aiRating, 0) / total || 0;
    const fakeCount = reviews.filter(r => r.isFake).length;
    
    const clusters = await generateClusters();
    const topClusters = clusters.slice(0, 5).map(c => c.label);
    
    const insightsData = await generateInsights({
      total,
      positive,
      negative,
      avgRating: avgRating.toFixed(2),
      topClusters,
      fakeCount
    });
    
    const topKeywords = await extractTopKeywords(10);
    
    // Generate trend data (last 30 days)
    const trendData = [];
    const now = new Date();
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const startOfDay = new Date(date.setHours(0, 0, 0, 0));
      const endOfDay = new Date(date.setHours(23, 59, 59, 999));
      
      const dayReviews = reviews.filter(r => 
        r.createdAt >= startOfDay && r.createdAt <= endOfDay
      );
      
      trendData.push({
        date: startOfDay,
        positive: dayReviews.filter(r => 
          r.sentiment.overall === 'positive' || r.sentiment.overall === 'very_positive'
        ).length,
        negative: dayReviews.filter(r => 
          r.sentiment.overall === 'negative' || r.sentiment.overall === 'very_negative'
        ).length,
        neutral: dayReviews.filter(r => r.sentiment.overall === 'neutral').length
      });
    }
    
    const insight = new Insight({
      summary: insightsData.summary,
      actionableInsights: insightsData.actionableInsights,
      topKeywords: topKeywords,
      trendData: trendData
    });
    
    await insight.save();
    
    res.json({
      success: true,
      data: {
        summary: insightsData.summary,
        actionableInsights: insightsData.actionableInsights,
        topKeywords: topKeywords,
        trendData: trendData,
        metrics: {
          total,
          positive,
          negative,
          neutral: total - positive - negative,
          avgRating: avgRating.toFixed(2),
          fakeCount,
          positiveRatio: total > 0 ? ((positive / total) * 100).toFixed(2) : 0
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getTrends = async (req, res, next) => {
  try {
    const { period = 'monthly' } = req.query;
    const reviews = await Review.find({}).sort({ createdAt: 1 });
    
    let trendData = [];
    const now = new Date();
    
    if (period === 'weekly') {
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const startOfDay = new Date(date.setHours(0, 0, 0, 0));
        const endOfDay = new Date(date.setHours(23, 59, 59, 999));
        
        const dayReviews = reviews.filter(r => 
          r.createdAt >= startOfDay && r.createdAt <= endOfDay
        );
        
        trendData.push({
          date: startOfDay.toISOString().split('T')[0],
          positive: dayReviews.filter(r => 
            r.sentiment.overall === 'positive' || r.sentiment.overall === 'very_positive'
          ).length,
          negative: dayReviews.filter(r => 
            r.sentiment.overall === 'negative' || r.sentiment.overall === 'very_negative'
          ).length,
          neutral: dayReviews.filter(r => r.sentiment.overall === 'neutral').length,
          total: dayReviews.length
        });
      }
    } else {
      // Monthly - last 12 months
      for (let i = 11; i >= 0; i--) {
        const date = new Date(now);
        date.setMonth(date.getMonth() - i);
        const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
        const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
        
        const monthReviews = reviews.filter(r => 
          r.createdAt >= startOfMonth && r.createdAt <= endOfMonth
        );
        
        trendData.push({
          date: startOfMonth.toISOString().slice(0, 7),
          positive: monthReviews.filter(r => 
            r.sentiment.overall === 'positive' || r.sentiment.overall === 'very_positive'
          ).length,
          negative: monthReviews.filter(r => 
            r.sentiment.overall === 'negative' || r.sentiment.overall === 'very_negative'
          ).length,
          neutral: monthReviews.filter(r => r.sentiment.overall === 'neutral').length,
          total: monthReviews.length
        });
      }
    }
    
    res.json({
      success: true,
      data: trendData
    });
  } catch (error) {
    next(error);
  }
};

export const getTags = async (req, res, next) => {
  try {
    const { limit = 50 } = req.query;
    const keywords = await extractTopKeywords(parseInt(limit));
    
    res.json({
      success: true,
      data: keywords
    });
  } catch (error) {
    next(error);
  }
};

export const getClusters = async (req, res, next) => {
  try {
    const clusters = await generateClusters();
    
    res.json({
      success: true,
      data: clusters
    });
  } catch (error) {
    next(error);
  }
};

export const deleteReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const review = await Review.findByIdAndDelete(id);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

