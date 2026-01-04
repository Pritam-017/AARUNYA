# 🧠 MindBridge - Setup & Deployment Guide

## 📋 Prerequisites
- Node.js (v16+)
- MongoDB (Atlas or Local)
- Git

---

## 🚀 Installation Steps

### 1️⃣ Backend Setup

```bash
cd backend
npm install
```

#### Configure `.env` file:
Replace the placeholders in `backend/.env`:

```env
# MongoDB Connection (Get from MongoDB Atlas)
MONGO_URI=mongodb+srv://username:password@cluster0.mongodb.net/mindbridge

# JWT Secret (Change to a strong random string)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Server Port
PORT=5000
```

#### Run Backend:
```bash
npm run dev
```
Backend will start at `http://localhost:5000`

---

### 2️⃣ Frontend Setup

```bash
cd frontend
npm install
```

#### Run Frontend:
```bash
npm run dev
```
Frontend will start at `http://localhost:3000`

---

## 🔑 API Keys & Configuration

### MongoDB Atlas Setup
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account
3. Create a cluster
4. Get connection string: `mongodb+srv://username:password@cluster0.mongodb.net/mindbridge`
5. Replace in `backend/.env` → `MONGO_URI`

### JWT Secret
- Generate random string: Use any random generator
- Or command: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- Update in `backend/.env` → `JWT_SECRET`

---

## 📊 How to Use the App

### 1. Login
- Enter your college name
- Get anonymous ID automatically
- No email needed ✅

### 2. Daily Check-In (Dashboard)
- Rate mood (1-5) 😢 to 😊
- Enter sleep hours
- Rate stress level
- Optional note
- Click "Save Check-In"

### 3. Burnout Score
- Automatically calculated from 7-day data
- **< 40** = High Risk (Red)
- **40-60** = Moderate (Yellow)
- **> 60** = Healthy (Green)

### 4. AI Coping Tips
- Stress ≥ 4 → Breathing exercise
- Mood ≤ 2 → Journaling suggestion
- Otherwise → Motivation

### 5. Anonymous Chat
- Join college-specific rooms
- No profiles, no tracking
- Basic word filter (auto-moderation)
- Real-time with Socket.io

### 6. SOS Mode
- Emergency helpline numbers (India)
- AASRA, iCall, Vandrevala Foundation
- Direct call links

---

## 🗂️ Project Structure

```
MindBridge/
├── backend/
│   ├── index.js              # Main server
│   ├── .env                  # Configuration 
│   ├── package.json
│   ├── routes/
│   │   ├── auth.js           # Login
│   │   ├── checkin.js        # Daily check-in
│   │   ├── burnout.js        # Score calculation
│   │   └── chat.js           # Chat messages
│   ├── models/
│   │   ├── User.js
│   │   ├── Checkin.js
│   │   ├── Room.js
│   │   └── Message.js
│   └── middleware/
│       └── authMiddleware.js # JWT validation
│
└── frontend/
    ├── index.html
    ├── src/
    │   ├── App.jsx           # Main app + routing
    │   ├── main.jsx
    │   ├── index.css
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── Checkin.jsx
    │   │   ├── Chat.jsx
    │   │   └── SOS.jsx
    │   ├── components/
    │   │   ├── BurnoutCard.jsx
    │   │   └── Chart.jsx
    │   ├── services/
    │   │   └── api.js
    │   └── context/
    │       └── AuthContext.jsx
    ├── .env
    ├── vite.config.js
    ├── tailwind.config.js
    └── package.json
```

---

## 🔐 Production Deployment

### 1. Render (Backend)
- Push to GitHub
- Connect repo to Render
- Set env variables in Render dashboard
- Deploy

### 2. Vercel (Frontend)
- Push to GitHub
- Import in Vercel
- Set `VITE_API_URL` to production backend URL
- Deploy

### 3. MongoDB Atlas
- Already cloud-hosted (free tier available)
- No extra setup needed

---

## 🛠️ Troubleshooting

### Issue: "Cannot connect to MongoDB"
**Fix:** 
- Check MONGO_URI is correct
- Whitelist your IP in MongoDB Atlas
- Ensure database name matches

### Issue: "CORS error" on frontend
**Fix:**
- Backend CORS is enabled (see `index.js`)
- Check frontend and backend ports match configuration

### Issue: Chat messages not loading
**Fix:**
- Ensure Socket.io is connected
- Backend must be running
- Check browser console for errors

### Issue: Burnout score shows 0
**Fix:**
- Complete at least 1 check-in
- Wait for 7-day data to calculate properly
- Refresh page

---

## 📈 Features Implemented

✅ Anonymous Login (No email)
✅ Daily Check-In (Mood, Sleep, Stress)
✅ Burnout Score (7-day rolling average)
✅ AI Coping Suggestions
✅ Anonymous Peer Support Chat
✅ Real-time Messages (Socket.io)
✅ Auto-Moderation (Word filter)
✅ SOS Helpline Mode
✅ Beautiful Dark UI (Tailwind + Purple theme)
✅ JWT Authentication
✅ Fully Responsive Design

---

## 🚀 Next Steps

1. Install dependencies: `npm install` in both folders
2. Setup MongoDB URI
3. Generate strong JWT secret
4. Run backend: `npm run dev`
5. Run frontend: `npm run dev`
6. Open http://localhost:3000
7. Test: Enter college name → Check-in → Chat → SOS

---

**Build with ❤️ for student mental wellness**
