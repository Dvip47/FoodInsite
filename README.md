# FoodInsight – AI-Powered Customer Review Analytics

A comprehensive full-stack application for analyzing restaurant customer reviews using AI. Built with React, Node.js, Express, MongoDB, and Google Gemini AI.

## 🚀 Features

- **AI-Powered Analysis**: Uses Google Gemini 1.5 Flash for sentiment analysis, keyword extraction, and fake review detection
- **Category-wise Sentiment**: Analyze sentiment across taste, service, ambience, hygiene, and delivery
- **Review Clustering**: Automatically group reviews by themes and topics
- **Trend Analytics**: Visualize sentiment trends over time (weekly/monthly)
- **Tag Cloud**: Interactive visualization of frequently mentioned keywords
- **Fake Review Detection**: AI-powered detection of potentially fake reviews
- **Multilingual Support**: Supports reviews in multiple languages
- **Export Data**: Export reviews and analytics as CSV
- **Modern UI**: Responsive design with Tailwind CSS

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
- Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))
- npm or yarn

## 🛠️ Installation

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd FoodInsite
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

### 4. Set Up Environment Variables

Create a `.env` file in the root directory (copy from `env.example`):

```bash
cp env.example .env
```

Edit `.env` and add your configuration:

```env
PORT=9000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/foodinsight
GEMINI_API_KEY=your_gemini_api_key_here
FRONTEND_URL=http://localhost:5173
```

## 🚀 Running the Application

### Option 1: Using Docker (Recommended for MongoDB)

1. Start MongoDB and Redis with Docker:

```bash
docker-compose up -d
```

2. Start the Backend:

```bash
cd backend
npm run dev
```

The backend will run on `http://localhost:9000`

3. Start the Frontend (in a new terminal):

```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:5173`

### Option 2: Local MongoDB

1. Make sure MongoDB is running locally on port 27017

2. Start the Backend:

```bash
cd backend
npm run dev
```

3. Start the Frontend:

```bash
cd frontend
npm run dev
```

## 📖 API Endpoints

### Health Check
- `GET /api/health` - Check API status

### Reviews
- `POST /api/reviews` - Create and analyze a new review
- `GET /api/reviews/all` - Get all reviews (with pagination, filters)
- `GET /api/reviews/insights` - Get AI-generated insights
- `GET /api/reviews/trends?period=weekly|monthly` - Get trend data
- `GET /api/reviews/tags?limit=50` - Get top keywords
- `GET /api/reviews/clusters` - Get review clusters
- `DELETE /api/reviews/:id` - Delete a review

## 🎯 Usage Guide

### 1. Upload Reviews

- Navigate to **Upload Reviews** page
- Enter a review text (minimum 10 characters)
- Click "Analyze Review" to process it with AI
- Or upload a `.txt` file with one review per line for bulk processing

### 2. View Dashboard

- See metrics: Total Reviews, Positive Ratio, Average Rating, Fake Reviews
- View sentiment trends over time
- Explore category-wise sentiment analysis
- Check AI-generated summary and actionable insights
- Browse top keywords and review clusters

### 3. Explore Insights

- **Insights Page**: Detailed AI analysis with trends
- **Tag Cloud**: Visual keyword frequency
- **Clusters**: Grouped reviews by themes
- **All Reviews**: Browse, search, and filter all reviews

### 4. Export Data

- Go to **All Reviews** page
- Click "Export CSV" to download all review data

## 🏗️ Project Structure

```
FoodInsite/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Express middleware
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── services/        # Business logic (Gemini, clustering, etc.)
│   └── server.js        # Express server
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── charts/      # Chart components
│   │   ├── sections/    # Section components
│   │   ├── services/    # API services
│   │   ├── utils/       # Utility functions
│   │   └── layouts/     # Layout components
│   └── package.json
├── .env.example
├── docker-compose.yml
└── README.md
```

## 🔧 Configuration

### MongoDB Setup

**Local MongoDB:**
```env
MONGODB_URI=mongodb://localhost:27017/foodinsight
```

**MongoDB Atlas:**
1. Create a cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Get your connection string
3. Update `.env`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/foodinsight
```

### Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to `.env`:
```env
GEMINI_API_KEY=your_actual_api_key_here
```

## 🚢 Deployment

### Backend (Render/Railway/Heroku)

1. Set environment variables in your hosting platform
2. Set `NODE_ENV=production`
3. Update `FRONTEND_URL` to your frontend domain
4. Deploy the `backend` folder

### Frontend (Vercel/Netlify)

1. Set `VITE_API_URL` to your backend API URL
2. Build the project: `npm run build`
3. Deploy the `dist` folder

**Vercel Example:**
```bash
cd frontend
npm run build
vercel deploy
```

**Environment Variable:**
```
VITE_API_URL=https://your-backend-api.com/api
```

## 🧪 Testing

### Test API Health

```bash
curl http://localhost:9000/api/health
```

### Test Review Creation

```bash
curl -X POST http://localhost:9000/api/reviews \
  -H "Content-Type: application/json" \
  -d '{"text": "The food was amazing! Great service and cozy ambience."}'
```

## 📝 Notes

- The Gemini API has rate limits. For production, consider implementing request queuing.
- MongoDB indexes are automatically created for optimal query performance.
- Fake review detection uses AI heuristics and may not be 100% accurate.
- Review clustering is based on AI-generated labels and may evolve as more reviews are added.

## 🐛 Troubleshooting

### Backend won't start
- Check MongoDB is running: `mongosh` or check Docker containers
- Verify `.env` file exists and has correct values
- Check port 9000 is not in use

### Frontend can't connect to backend
- Verify backend is running on port 9000
- Check CORS settings in `backend/server.js`
- Verify `VITE_API_URL` in frontend environment

### Gemini API errors
- Verify API key is correct
- Check API quota/limits
- Ensure internet connection

## 📄 License

MIT License - feel free to use this project for your own purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues and questions, please open an issue on GitHub.

---

Built with ❤️ using React, Node.js, and Google Gemini AI

# FoodInsite
