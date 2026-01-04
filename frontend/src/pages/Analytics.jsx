import React, { useState, useEffect } from "react";
import { getCheckinHistory } from "../services/api";
import API from "../services/api";
import Chart from "../components/Chart";

export default function Analytics() {
  const [checkins, setCheckins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [avgMood, setAvgMood] = useState(0);
  const [avgStress, setAvgStress] = useState(0);
  const [aiAnalysis, setAiAnalysis] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const res = await getCheckinHistory();
      setCheckins(res.data);

      if (res.data.length > 0) {
        const totalMood = res.data.reduce((sum, c) => sum + c.mood, 0);
        const totalStress = res.data.reduce((sum, c) => sum + c.stress, 0);
        setAvgMood(Math.round(totalMood / res.data.length));
        setAvgStress(Math.round((totalStress / res.data.length) * 10) / 10);
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const analyzeWithAI = async () => {
    setAnalyzing(true);
    try {
      const res = await API.get("/chat-ai/analyze/analytics");
      setAiAnalysis(res.data);
    } catch (err) {
      console.error("Analysis error:", err);
      setAiAnalysis({
        analysis: "Failed to get AI analysis. Please try again.",
        provider: "Error"
      });
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) return <div className="text-white text-center p-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-teal-900 to-black p-6">
      <h1 className="text-4xl font-bold text-white mb-8">📊 Your Analytics</h1>

      <div className="max-w-5xl mx-auto space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-zinc-800 rounded-2xl p-6 text-white text-center">
            <p className="text-zinc-400 mb-2">Total Check-ins</p>
            <p className="text-5xl font-bold text-purple-400">{checkins.length}</p>
          </div>
          <div className="bg-zinc-800 rounded-2xl p-6 text-white text-center">
            <p className="text-zinc-400 mb-2">Average Mood</p>
            <p className="text-5xl font-bold text-blue-400">
              {checkins.length > 0 && avgMood > 0 ? ["😢", "😕", "😐", "🙂", "😊"][avgMood - 1] : "-"}
            </p>
            <p className="text-sm text-zinc-400 mt-2">{checkins.length > 0 ? `${avgMood}/5` : "No data"}</p>
          </div>
          <div className="bg-zinc-800 rounded-2xl p-6 text-white text-center">
            <p className="text-zinc-400 mb-2">Average Stress</p>
            <p className="text-5xl font-bold text-red-400">{avgStress}</p>
            <p className="text-sm text-zinc-400 mt-2">/5</p>
          </div>
        </div>

        {/* Chart */}
        {checkins.length > 0 && (
          <div className="bg-zinc-800 rounded-2xl p-6">
            <Chart data={checkins} />
          </div>
        )}

        {/* Details */}
        <div className="bg-zinc-800 rounded-2xl p-6 text-white">
          <h3 className="text-2xl font-bold mb-4">📈 Insights</h3>
          <ul className="space-y-2 text-zinc-300">
            {checkins.length === 0 ? (
              <li>Complete daily check-ins to see insights</li>
            ) : (
              <>
                <li>✅ You've completed <strong>{checkins.length}</strong> check-ins</li>
                <li>📊 Your average mood is <strong>{avgMood}/5</strong></li>
                <li>😰 Your average stress level is <strong>{avgStress}/5</strong></li>
                <li>🎯 Keep consistent check-ins for better insights</li>
              </>
            )}
          </ul>

          {checkins.length > 0 && !aiAnalysis && (
            <button
              onClick={analyzeWithAI}
              disabled={analyzing}
              className="mt-4 w-full bg-teal-600 hover:bg-teal-700 disabled:bg-teal-900 text-white py-2 px-4 rounded-lg font-semibold transition"
            >
              {analyzing ? "🔄 Analyzing with AI..." : "🤖 Get AI Analysis"}
            </button>
          )}
        </div>

        {/* AI Analysis Section */}
        {aiAnalysis && (
          <div className="bg-gradient-to-r from-teal-900 to-cyan-900 rounded-2xl p-6 text-white border border-teal-500">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold">🧠 AI Analysis</h3>
              <span className="text-sm bg-teal-700 px-3 py-1 rounded-full">{aiAnalysis.provider}</span>
            </div>
            <p className="text-zinc-100 leading-relaxed whitespace-pre-wrap">{aiAnalysis.analysis}</p>
            <button
              onClick={analyzeWithAI}
              className="mt-4 bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded-lg font-semibold transition"
            >
              🔄 Refresh Analysis
            </button>
          </div>
        )}

        {/* Recent Entries */}
        {checkins.length > 0 && (
          <div className="bg-zinc-800 rounded-2xl p-6 text-white">
            <h3 className="text-2xl font-bold mb-4">📝 Recent Check-ins</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {checkins.slice(0, 10).map((c, i) => {
                const moodEmojis = ["😢", "😕", "😐", "🙂", "😊"];
                const moodEmoji = c.mood && c.mood >= 1 && c.mood <= 5 ? moodEmojis[c.mood - 1] : "?";
                return (
                  <div key={i} className="bg-zinc-700 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm text-zinc-400">{new Date(c.date).toLocaleDateString()}</p>
                        <p className="mt-2">
                          Mood: {moodEmoji} | Sleep: {c.sleep}h | Stress: {c.stress}/5
                        </p>
                        {c.note && <p className="text-sm text-zinc-300 mt-2">"{c.note}"</p>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
