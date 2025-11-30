# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Step 2: Set Up Environment

```bash
# From project root, copy the example env file
cp env.example .env

# Edit .env and add your Gemini API key
# Get one at: https://makersuite.google.com/app/apikey
```

### Step 3: Start MongoDB (if using Docker)

```bash
docker-compose up -d
```

Or use your local MongoDB installation.

### Step 4: Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Step 5: Open the App

Visit: http://localhost:5173

### Step 6: Upload Your First Review

1. Go to "Upload Reviews"
2. Enter a review like: "The food was amazing! Great service and cozy ambience. Highly recommended!"
3. Click "Analyze Review"
4. Wait for AI processing (takes a few seconds)
5. View results on Dashboard!

## 📝 Sample Reviews to Test

```
The food was absolutely delicious! The service was excellent and the ambience was perfect. Highly recommend this place!

Terrible experience. Food was cold, service was slow, and the place was dirty. Would not come back.

Average food, nothing special. Service was okay but nothing to write home about.

Amazing pizza! The best I've ever had. Staff was friendly and the restaurant was clean. Will definitely return!

Poor quality food and rude staff. The delivery was also late. Very disappointed.
```

## ✅ Verify Everything Works

1. Check backend health: http://localhost:9000/api/health
2. Upload a review
3. Check Dashboard for metrics
4. View Insights page
5. Explore Tag Cloud
6. Check Clusters

## 🐛 Common Issues

**Backend won't start:**
- Check MongoDB is running
- Verify .env file exists
- Check port 9000 is available

**Frontend can't connect:**
- Ensure backend is running
- Check browser console for errors

**Gemini API errors:**
- Verify API key is correct
- Check API quota
- Ensure internet connection

## 🎉 You're Ready!

Start analyzing reviews and exploring insights!

