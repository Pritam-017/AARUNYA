const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Groq = require("groq-sdk");
const Checkin = require("../models/Checkin");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Initialize Google Gemini API
let geminiClient = null;
let groqClient = null;

try {
  if (process.env.GOOGLE_API_KEY) {
    geminiClient = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    console.log("✅ Google Gemini API initialized successfully");
  }
} catch (err) {
  console.error("❌ Failed to initialize Gemini:", err.message);
}

// Initialize Groq API as fallback
try {
  if (process.env.GROQ_API_KEY) {
    groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY });
    console.log("✅ Groq API initialized as fallback");
  }
} catch (err) {
  console.error("❌ Failed to initialize Groq:", err.message);
}

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({ error: "Message cannot be empty" });
    }

    const systemPrompt = `You are a helpful study assistant for college students. Help with academics, exams, stress management, and study tips. Be clear and practical.`;
    
    // Try Gemini first
    if (geminiClient) {
      try {
        console.log("📤 Trying Gemini API:", message.substring(0, 50) + "...");
        
        const model = geminiClient.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
        const response = await model.generateContent({
          contents: [
            {
              role: "user",
              parts: [{ text: `${systemPrompt}\n\nUser: ${message}\n\nKeep your response brief and concise (2-3 sentences max).` }]
            }
          ],
          generationConfig: {
            maxOutputTokens: 256,
          }
        });

        const result = await response.response;
        console.log("✅ Received response from Gemini API");
        return res.json({ reply: result.text(), provider: "Gemini" });
      } catch (geminiErr) {
        console.error("❌ Gemini API Error:", geminiErr.message);
        
        // If Gemini fails, try Groq
        if (groqClient) {
          console.log("🔄 Gemini failed, falling back to Groq API...");
          try {
            const groqResponse = await groqClient.chat.completions.create({
              messages: [
                {
                  role: "system",
                  content: systemPrompt
                },
                {
                  role: "user",
                  content: message
                }
              ],
              model: "llama-3.1-8b-instant",
              max_tokens: 1024,
            });

            console.log("✅ Received response from Groq API (fallback)");
            return res.json({ reply: groqResponse.choices[0].message.content, provider: "Groq" });
          } catch (groqErr) {
            console.error("❌ Groq API Error:", groqErr.message);
            throw groqErr;
          }
        } else {
          throw geminiErr;
        }
      }
    } else if (groqClient) {
      // If Gemini not configured, use Groq directly
      try {
        console.log("📤 Using Groq API:", message.substring(0, 50) + "...");
        
        const response = await groqClient.chat.completions.create({
          messages: [
            {
              role: "system",
              content: systemPrompt
            },
            {
              role: "user",
              content: message
            }
          ],
          model: "llama-3.1-8b-instant",
          max_tokens: 1024,
        });

        console.log("✅ Received response from Groq API");
        return res.json({ reply: response.choices[0].message.content, provider: "Groq" });
      } catch (groqErr) {
        console.error("❌ Groq API Error:", groqErr.message);
        throw groqErr;
      }
    } else {
      return res.status(500).json({ 
        error: "AI service not configured",
        details: "Please set GOOGLE_API_KEY or GROQ_API_KEY in .env file"
      });
    }
  } catch (err) {
    console.error("❌ Final AI Error:", err.message);
    
    // Check for rate limit errors
    if (err.status === 429 || err.message.includes("rate limit") || err.message.includes("quota")) {
      return res.status(429).json({ 
        error: "API rate limit exceeded",
        details: "All AI providers are temporarily unavailable due to rate limits. Please try again in a few moments.",
        status: err.status
      });
    }
    
    // Check for auth errors
    if (err.status === 401 || err.status === 403) {
      return res.status(401).json({ 
        error: "Invalid API credentials",
        details: "Please check your API keys in .env file",
        status: err.status
      });
    }
    
    res.status(500).json({ 
      error: "Failed to get response from AI",
      message: err.message,
      status: err.status
    });
  }
});

// Analyze check-in analytics with AI
router.get("/analyze/analytics", authMiddleware, async (req, res) => {
  try {
    // Fetch user's check-ins
    const checkins = await Checkin.find({ userId: req.userId }).sort({ date: -1 });

    if (checkins.length === 0) {
      return res.json({ 
        analysis: "No check-in data available yet. Complete daily check-ins to get AI insights about your mental wellness patterns.",
        provider: "System"
      });
    }

    // Calculate analytics
    const avgMood = checkins.reduce((sum, c) => sum + c.mood, 0) / checkins.length;
    const avgStress = checkins.reduce((sum, c) => sum + c.stress, 0) / checkins.length;
    const avgSleep = checkins.reduce((sum, c) => sum + c.sleep, 0) / checkins.length;
    
    // Get recent trend (last 7 days)
    const recentCheckins = checkins.slice(0, 7);
    const moodTrend = recentCheckins.map(c => c.mood).reverse();
    const stressTrend = recentCheckins.map(c => c.stress).reverse();

    // Format data for AI analysis
    const analyticsData = `
User Mental Wellness Analytics:
- Total Check-ins: ${checkins.length}
- Average Mood: ${avgMood.toFixed(1)}/5
- Average Stress: ${avgStress.toFixed(1)}/5
- Average Sleep: ${avgSleep.toFixed(1)} hours
- Mood Trend (7 days): ${moodTrend.join(" → ")}
- Stress Trend (7 days): ${stressTrend.join(" → ")}
- Recent Notes: ${recentCheckins.filter(c => c.note).map(c => `"${c.note}"`).join(", ") || "None"}

Please analyze this data and provide:
1. Key patterns or trends
2. Areas of concern
3. Positive progress
4. 2-3 specific actionable recommendations

Keep response brief and practical.`;

    // Try Gemini first
    if (geminiClient) {
      try {
        console.log("📤 Analyzing with Gemini API");
        
        const model = geminiClient.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
        const response = await model.generateContent({
          contents: [
            {
              role: "user",
              parts: [{ text: analyticsData }]
            }
          ],
          generationConfig: {
            maxOutputTokens: 512,
          }
        });

        const result = await response.response;
        console.log("✅ Analytics analyzed with Gemini");
        return res.json({ 
          analysis: result.text(), 
          provider: "Gemini",
          stats: { avgMood: avgMood.toFixed(1), avgStress: avgStress.toFixed(1), avgSleep: avgSleep.toFixed(1), totalCheckins: checkins.length }
        });
      } catch (geminiErr) {
        console.error("❌ Gemini Error:", geminiErr.message);
        
        // Fallback to Groq
        if (groqClient) {
          try {
            console.log("🔄 Falling back to Groq for analytics");
            
            const response = await groqClient.chat.completions.create({
              messages: [
                {
                  role: "user",
                  content: analyticsData
                }
              ],
              model: "llama-3.1-8b-instant",
              max_tokens: 512,
            });

            console.log("✅ Analytics analyzed with Groq");
            return res.json({ 
              analysis: response.choices[0].message.content, 
              provider: "Groq",
              stats: { avgMood: avgMood.toFixed(1), avgStress: avgStress.toFixed(1), avgSleep: avgSleep.toFixed(1), totalCheckins: checkins.length }
            });
          } catch (groqErr) {
            throw groqErr;
          }
        }
      }
    } else if (groqClient) {
      try {
        console.log("📤 Analyzing with Groq API");
        
        const response = await groqClient.chat.completions.create({
          messages: [
            {
              role: "user",
              content: analyticsData
            }
          ],
          model: "llama-3.1-8b-instant",
          max_tokens: 512,
        });

        console.log("✅ Analytics analyzed with Groq");
        return res.json({ 
          analysis: response.choices[0].message.content, 
          provider: "Groq",
          stats: { avgMood: avgMood.toFixed(1), avgStress: avgStress.toFixed(1), avgSleep: avgSleep.toFixed(1), totalCheckins: checkins.length }
        });
      } catch (groqErr) {
        throw groqErr;
      }
    }

  } catch (err) {
    console.error("❌ Analytics Error:", err.message);
    res.status(500).json({ 
      error: "Failed to analyze data",
      message: err.message
    });
  }
});

module.exports = router;
