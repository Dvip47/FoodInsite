import mongoose from 'mongoose';

const insightSchema = new mongoose.Schema({
  summary: {
    type: String,
    required: true
  },
  actionableInsights: [{
    type: String
  }],
  topKeywords: [{
    keyword: String,
    count: Number
  }],
  trendData: [{
    date: Date,
    positive: Number,
    negative: Number,
    neutral: Number
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

insightSchema.index({ createdAt: -1 });

export default mongoose.model('Insight', insightSchema);

