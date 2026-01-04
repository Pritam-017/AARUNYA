# 🧠 AARUNYA - Mental Wellness for Students

A MERN stack application for anonymous mental wellness, burnout detection, and peer support.

## 🎯 Core Features

- **📋 Daily 30-sec Check-In**: Mood, sleep, stress tracking
- **🔥 Burnout Score**: 7-day rolling average with trend analysis
- **💬 Anonymous Chat**: College-wise peer support rooms
- **💡 AI Coping Tips**: Personalized suggestions based on data
- **🆘 SOS Mode**: Emergency helplines and crisis support

## 🛠️ Tech Stack

- **Frontend**: React + Tailwind CSS + Vite
- **Backend**: Node.js + Express
- **Database**: MongoDB
- **Real-time**: Socket.io
- **Auth**: JWT (Anonymous IDs)

## 🚀 Quick Start

1. **Backend**:
   ```bash
   cd backend
   npm install
   npm run dev  # Runs on :5000
   ```

2. **Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev  # Runs on :3000
   ```

3. **Setup MongoDB**:
   - Create account on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Get connection string
   - Add to `backend/.env` as `MONGO_URI`

4. **Configure JWT**:
   - Generate secret: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
   - Add to `backend/.env` as `JWT_SECRET`

See [SETUP.md](SETUP.md) for detailed guide.

## 📁 Project Structure

```
backend/          → Express + MongoDB
├── routes/       → Auth, Checkin, Burnout, Chat
├── models/       → User, Checkin, Room, Message
└── middleware/   → JWT validation

frontend/         → React + Vite
├── pages/        → Login, Dashboard, Chat, SOS
├── components/   → BurnoutCard, Chart
├── context/      → AuthContext
└── services/     → API calls
```

## 🔒 Security

- Anonymous with UUID (no email)
- JWT token-based auth
- Auto-moderation (word filter)
- No personal data stored
- CORS enabled

**Built for student mental health. Confidential. Safe. Always free.**
