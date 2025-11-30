import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/foodinsight';
    
    if (!process.env.MONGODB_URI) {
      console.log('⚠️  Using default MongoDB URI. Set MONGODB_URI in .env for production.');
    }
    
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 9000, // Timeout after 5s instead of 30s
    });
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.error('💡 Make sure MongoDB is running or check your MONGODB_URI in .env');
    throw error;
  }
};

