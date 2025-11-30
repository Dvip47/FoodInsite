import mongoose from 'mongoose';

const sentimentSchema = new mongoose.Schema({
  taste: { 
    type: String, 
    enum: ['very_positive', 'positive', 'neutral', 'negative', 'very_negative'], 
    default: 'neutral' 
  },
  service: { 
    type: String, 
    enum: ['very_positive', 'positive', 'neutral', 'negative', 'very_negative'], 
    default: 'neutral' 
  },
  ambience: { 
    type: String, 
    enum: ['very_positive', 'positive', 'neutral', 'negative', 'very_negative'], 
    default: 'neutral' 
  },
  hygiene: { 
    type: String, 
    enum: ['very_positive', 'positive', 'neutral', 'negative', 'very_negative'], 
    default: 'neutral' 
  },
  delivery: { 
    type: String, 
    enum: ['very_positive', 'positive', 'neutral', 'negative', 'very_negative'], 
    default: 'neutral' 
  },
  overall: { 
    type: String, 
    enum: ['very_positive', 'positive', 'neutral', 'negative', 'very_negative'], 
    default: 'neutral' 
  }
}, { _id: false });

const reviewSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true
  },
  language: {
    type: String,
    default: 'en'
  },
  sentiment: {
    type: sentimentSchema,
    required: true
  },
  keywords: [{
    type: String,
    trim: true
  }],
  cluster: {
    type: String,
    default: 'uncategorized'
  },
  aiRating: {
    type: Number,
    min: 1,
    max: 5,
    default: 3
  },
  cleanText: {
    type: String,
    trim: true
  },
  isFake: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

reviewSchema.index({ createdAt: -1 });
reviewSchema.index({ cluster: 1 });
reviewSchema.index({ isFake: 1 });

export default mongoose.model('Review', reviewSchema);

