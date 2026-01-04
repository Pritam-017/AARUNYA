import React, { useEffect, useState } from "react";
import { getBurnoutScore, getCopingSuggestion, getCheckinHistory } from "../services/api";
import API from "../services/api";
import BurnoutCard from "../components/BurnoutCard";
import Chart from "../components/Chart";
import Checkin from "./Checkin";

export default function Dashboard() {
  const [burnout, setBurnout] = useState(null);
  const [suggestion, setSuggestion] = useState("");
  const [tips, setTips] = useState([]);
  const [checkins, setCheckins] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    loadData();
  }, [refreshKey]);

  const loadData = async () => {
    try {
      const burnoutRes = await getBurnoutScore();
      setBurnout(burnoutRes.data);

      const suggestionRes = await getCopingSuggestion();
      setSuggestion(suggestionRes.data.suggestion);

      const tipsRes = await API.get("/burnout/tips");
      setTips(tipsRes.data.tips);

      const historyRes = await getCheckinHistory();
      setCheckins(historyRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const getAIAnalysis = async () => {
    setAnalyzing(true);
    try {
      const res = await API.get("/burnout/ai-analysis");
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-teal-900 to-black p-6">
      <div className="flex flex-col md:flex-row gap-6 items-start mb-8">
        <h1 className="text-4xl font-bold text-white">AARUNYA Dashboard</h1>
        {suggestion && (
          <div className="bg-zinc-800 rounded-2xl p-4 text-white border-l-4 border-yellow-500 flex-1">
            <h3 className="font-semibold mb-2 text-sm">💡 AI Tip for You</h3>
            <p className="text-sm">{suggestion}</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Check-in */}
        <div className="lg:col-span-1">
          <Checkin onSuccess={() => setRefreshKey(k => k + 1)} />
        </div>

        {/* Right Column: Burnout + Chart */}
        <div className="lg:col-span-2 space-y-6">
          {burnout && <BurnoutCard score={burnout.score} status={burnout.status} />}
          {checkins.length > 0 && <Chart data={checkins} />}
        </div>
      </div>

      {/* Stats */}
      {burnout && (
        <div className="mt-8 bg-zinc-800 rounded-2xl p-6 text-white">
          <h3 className="text-lg font-bold mb-4">📊 Quick Stats</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-zinc-700 p-4 rounded-lg">
              <p className="text-zinc-400 text-sm">Check-ins This Week</p>
              <p className="text-2xl font-bold">{burnout.checkins}</p>
            </div>
            <div className="bg-zinc-700 p-4 rounded-lg">
              <p className="text-zinc-400 text-sm">Trend</p>
              <p className="text-2xl font-bold">{burnout.trend === "improving" ? "📈" : "📉"}</p>
            </div>
          </div>

          {!aiAnalysis && (
            <button
              onClick={getAIAnalysis}
              disabled={analyzing}
              className="mt-6 w-full bg-teal-600 hover:bg-teal-700 disabled:bg-teal-900 text-white py-2 px-4 rounded-lg font-semibold transition"
            >
              {analyzing ? "🔄 Analyzing..." : "🤖 Get AI Analysis"}
            </button>
          )}
        </div>
      )}

      {/* AI Analysis Section */}
      {aiAnalysis && (
        <div className="mt-8 bg-gradient-to-r from-teal-900 to-cyan-900 rounded-2xl p-6 text-white border border-teal-500">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-bold">🧠 AI-Powered Wellness Analysis</h3>
            <span className="text-sm bg-teal-700 px-3 py-1 rounded-full">{aiAnalysis.provider}</span>
          </div>
          <p className="text-zinc-100 leading-relaxed whitespace-pre-wrap mb-4">{aiAnalysis.analysis}</p>
          <button
            onClick={getAIAnalysis}
            className="bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded-lg font-semibold transition"
          >
            🔄 Refresh Analysis
          </button>
        </div>
      )}

      {/* Smart Tips Section */}
      {tips.length > 0 && (
        <div className="mt-8 bg-zinc-800 rounded-2xl p-6 text-white">
          <h3 className="text-2xl font-bold mb-6">💡 Personalized Tips for Today</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tips.map((tip, i) => (
              <div key={i} className="bg-zinc-700 rounded-lg p-4 border-l-4 border-yellow-500">
                <p className="text-zinc-100 text-sm leading-relaxed">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
