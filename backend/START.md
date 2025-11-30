# Backend Startup Guide

## Quick Start

1. **Make sure MongoDB is running:**
   ```bash
   # Using Docker
   docker-compose up -d
   
   # Or check if MongoDB is running locally
   mongosh
   ```

2. **Check your .env file:**
   ```bash
   # Should have at minimum:
   MONGODB_URI=mongodb://localhost:27017/foodinsight
   GEMINI_API_KEY=your_key_here (optional, will use fallback if not set)
   PORT=9000
   ```

3. **Start the server:**
   ```bash
   npm run dev
   # or
   npm start
   ```

## Expected Output

When starting successfully, you should see:
```
✅ MongoDB Connected: localhost
📊 Database: foodinsight
🚀 Server running on port 9000
```

## Troubleshooting

### MongoDB Connection Error
- Make sure MongoDB is running
- Check MONGODB_URI in .env
- For MongoDB Atlas, ensure your IP is whitelisted

### Port Already in Use
- Change PORT in .env
- Or kill the process using port 9000:
  ```bash
  lsof -ti:9000 | xargs kill
  ```

### Gemini API Warnings
- These are normal if GEMINI_API_KEY is not set
- The app will work with fallback analysis
- Get API key from: https://makersuite.google.com/app/apikey

## Test the API

```bash
# Health check
curl http://localhost:9000/api/health

# Should return:
# {"success":true,"message":"FoodInsight API is running","timestamp":"..."}
```

