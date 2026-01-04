const express = require("express");
const Checkin = require("../models/Checkin");
const authMiddleware = require("../middleware/authMiddleware");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Groq = require("groq-sdk");

const router = express.Router();

// Initialize Google Gemini API
let geminiClient = null;
let groqClient = null;

try {
  if (process.env.GOOGLE_API_KEY) {
    geminiClient = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
  }
} catch (err) {
  console.error("❌ Failed to initialize Gemini:", err.message);
}

// Initialize Groq API as fallback
try {
  if (process.env.GROQ_API_KEY) {
    groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
} catch (err) {
  console.error("❌ Failed to initialize Groq:", err.message);
}

// Calculate Burnout Score (7-day rolling average)
router.get("/score", authMiddleware, async (req, res) => {
  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const checkins = await Checkin.find({
      userId: req.userId,
      date: { $gte: sevenDaysAgo }
    }).sort({ date: -1 });

    if (checkins.length === 0) {
      return res.json({ score: 100, status: "Healthy", trend: "stable" });
    }

    // Burnout score: (mood + (6-stress) + (sleep/2)) / 3 * 25
    let totalScore = 0;
    checkins.forEach(c => {
      const moodScore = c.mood * 20; // 20-100
      const stressScore = (6 - c.stress) * 16.67; // inverse, 0-83
      const sleepScore = Math.min(c.sleep, 8) / 8 * 100; // 0-100
      const dayScore = (moodScore + stressScore + sleepScore) / 3;
      totalScore += dayScore;
    });

    const avgScore = Math.round(totalScore / checkins.length);
    let status;

    if (avgScore < 40) status = "High Risk";
    else if (avgScore < 60) status = "Moderate";
    else status = "Healthy";

    const trend = checkins.length > 1 
      ? checkins[0].mood < checkins[checkins.length - 1].mood ? "improving" : "declining"
      : "stable";

    res.json({ score: avgScore, status, trend, checkins: checkins.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get AI Coping Suggestion
router.get("/suggestion", authMiddleware, async (req, res) => {
  try {
    const lastCheckin = await Checkin.findOne({ userId: req.userId }).sort({ date: -1 });

    if (!lastCheckin) {
      return res.json({ suggestion: "Start your first check-in to get personalized tips!" });
    }

    const { mood, stress } = lastCheckin;
    let suggestion;

    if (stress >= 4) {
      suggestion = "🧘 Try a 2-minute breathing exercise: Breathe in for 4 counts, hold 4, exhale 4.";
    } else if (mood <= 2) {
      suggestion = "📝 Write one thing you did well today. Celebrate small wins!";
    } else {
      suggestion = "✅ You're doing well! Keep maintaining consistency in your routine.";
    }

    res.json({ suggestion });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get AI Analysis on Dashboard Data
router.get("/ai-analysis", authMiddleware, async (req, res) => {
  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const checkins = await Checkin.find({
      userId: req.userId,
      date: { $gte: sevenDaysAgo }
    }).sort({ date: -1 });

    if (checkins.length === 0) {
      return res.json({ 
        analysis: "Complete your first check-in to get personalized AI insights about your wellness.",
        provider: "System"
      });
    }

    // Calculate metrics
    const avgMood = checkins.reduce((sum, c) => sum + c.mood, 0) / checkins.length;
    const avgStress = checkins.reduce((sum, c) => sum + c.stress, 0) / checkins.length;
    const avgSleep = checkins.reduce((sum, c) => sum + c.sleep, 0) / checkins.length;
    
    let totalScore = 0;
    checkins.forEach(c => {
      const moodScore = c.mood * 20;
      const stressScore = (6 - c.stress) * 16.67;
      const sleepScore = Math.min(c.sleep, 8) / 8 * 100;
      const dayScore = (moodScore + stressScore + sleepScore) / 3;
      totalScore += dayScore;
    });
    const burnoutScore = Math.round(totalScore / checkins.length);

    let status;
    if (burnoutScore < 40) status = "High Risk";
    else if (burnoutScore < 60) status = "Moderate";
    else status = "Healthy";

    const analysisPrompt = `Based on the following wellness data for a college student:
- Burnout Score: ${burnoutScore}/100 (Status: ${status})
- Average Mood: ${avgMood.toFixed(1)}/5
- Average Stress: ${avgStress.toFixed(1)}/5
- Average Sleep: ${avgSleep.toFixed(1)} hours
- Check-ins Completed: ${checkins.length} this week

Please provide:
1. Brief analysis of their current mental wellness status
2. Key concern areas (if any)
3. 2-3 specific, actionable recommendations for improvement
4. A motivational message

Keep the response concise and supportive. Focus on practical tips they can use today.`;

    // Try Gemini first
    if (geminiClient) {
      try {
        console.log("📤 Analyzing dashboard with Gemini API");
        
        const model = geminiClient.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
        const response = await model.generateContent({
          contents: [
            {
              role: "user",
              parts: [{ text: analysisPrompt }]
            }
          ],
          generationConfig: {
            maxOutputTokens: 512,
          }
        });

        const result = await response.response;
        console.log("✅ Dashboard analysis from Gemini");
        return res.json({ 
          analysis: result.text(), 
          provider: "Gemini",
          score: burnoutScore,
          status
        });
      } catch (geminiErr) {
        console.error("❌ Gemini Error:", geminiErr.message);
        
        // Fallback to Groq
        if (groqClient) {
          try {
            console.log("🔄 Falling back to Groq for analysis");
            
            const response = await groqClient.chat.completions.create({
              messages: [
                {
                  role: "user",
                  content: analysisPrompt
                }
              ],
              model: "llama-3.1-8b-instant",
              max_tokens: 512,
            });

            console.log("✅ Dashboard analysis from Groq");
            return res.json({ 
              analysis: response.choices[0].message.content, 
              provider: "Groq",
              score: burnoutScore,
              status
            });
          } catch (groqErr) {
            throw groqErr;
          }
        }
      }
    } else if (groqClient) {
      try {
        console.log("📤 Analyzing dashboard with Groq API");
        
        const response = await groqClient.chat.completions.create({
          messages: [
            {
              role: "user",
              content: analysisPrompt
            }
          ],
          model: "llama-3.1-8b-instant",
          max_tokens: 512,
        });

        console.log("✅ Dashboard analysis from Groq");
        return res.json({ 
          analysis: response.choices[0].message.content, 
          provider: "Groq",
          score: burnoutScore,
          status
        });
      } catch (groqErr) {
        throw groqErr;
      }
    }

  } catch (err) {
    console.error("❌ AI Analysis Error:", err.message);
    res.status(500).json({ 
      error: "Failed to analyze dashboard data",
      message: err.message
    });
  }
});

// Get Smart Tips based on current check-in data
router.get("/tips", authMiddleware, async (req, res) => {
  try {
    const lastCheckin = await Checkin.findOne({ userId: req.userId }).sort({ date: -1 });

    if (!lastCheckin) {
      return res.json({ tips: ["Start your first check-in to get personalized tips!", "Track your mood daily to understand your patterns."] });
    }

    const { mood, stress, sleep } = lastCheckin;
    const tips = [];

    // Mood-based tips
    if (mood <= 1) {
      tips.push("😢 You're having a tough time. Consider reaching out to someone you trust or use the SOS feature for crisis support.");
      tips.push("💭 Try journaling your feelings - sometimes writing helps process emotions better.");
    } else if (mood === 2) {
      tips.push("😕 Your mood is low today. Try a 10-minute walk or call a friend to lift your spirits.");
      tips.push("🎵 Listen to your favorite music or watch something that makes you happy.");
    } else if (mood === 3) {
      tips.push("😐 Your mood is neutral. Try doing one activity that brings you joy today.");
      tips.push("✨ Small accomplishments add up - celebrate one small win today!");
    } else if (mood === 4) {
      tips.push("🙂 You're in a good mood! This is a great time to tackle challenging tasks.");
      tips.push("🤝 Your positive energy can inspire others - share it with your friends!");
    } else {
      tips.push("😊 You're feeling great! Keep up this positive momentum by maintaining healthy habits.");
      tips.push("🎯 This is the perfect time to set new goals and work towards them.");
    }

    // Stress-based tips
    if (stress >= 4) {
      tips.push("🧘 High stress detected! Try the breathing exercise (60-second guided breathing available in your app).");
      tips.push("⏸️ Take a break from your responsibilities - burnout won't help anyone. Rest is productive.");
    } else if (stress === 3) {
      tips.push("😰 Moderate stress levels. Practice some relaxation techniques like meditation.");
      tips.push("📋 Break big tasks into smaller, manageable steps to reduce overwhelm.");
    } else if (stress <= 2) {
      tips.push("✅ Great job managing your stress! Keep doing what you're doing.");
      tips.push("💪 You're handling things well. This is the time to build positive momentum.");
    }

    // Sleep-based tips
    if (sleep < 6) {
      tips.push("😴 Getting less than 6 hours of sleep? This affects your mood and stress levels significantly.");
      tips.push("🌙 Try to get at least 7-8 hours tonight - your mental health will thank you!");
    } else if (sleep >= 8) {
      tips.push("⭐ Excellent sleep! You're giving your body the rest it needs for mental wellness.");
    }

    // Remove duplicates and return
    const uniqueTips = [...new Set(tips)].slice(0, 6);

    res.json({ tips: uniqueTips });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
