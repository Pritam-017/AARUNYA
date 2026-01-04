import React, { useState } from "react";
import { submitCheckin } from "../services/api";

export default function Checkin({ onSuccess }) {
  const [mood, setMood] = useState(3);
  const [sleep, setSleep] = useState(7);
  const [stress, setStress] = useState(3);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await submitCheckin({ mood: parseInt(mood), sleep: parseInt(sleep), stress: parseInt(stress), note });
      alert("Check-in saved! ✅");
      setMood(3);
      setSleep(7);
      setStress(3);
      setNote("");
      if (onSuccess) onSuccess();
    } catch (err) {
      alert("Error: " + err.message);
    }
    setLoading(false);
  };

  return (
    <div className="bg-gradient-to-b from-teal-900 to-zinc-900 rounded-2xl p-8 text-white">
      <h2 className="text-2xl font-bold mb-6">📋 Daily Check-In (30 sec)</h2>

      <form onSubmit={handleSubmit}>
        {/* Mood Slider */}
        <div className="mb-6">
          <label className="block mb-2 font-semibold">
            How's your mood? <span className="text-2xl">{"😢😕😐🙂😊"[mood - 1]}</span>
          </label>
          <input
            type="range"
            min="1"
            max="5"
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            className="w-full accent-purple-500 h-2"
          />
          <div className="flex justify-between text-xs text-zinc-400 mt-2">
            <span>Very Bad</span>
            <span>Great</span>
          </div>
        </div>

        {/* Sleep Slider */}
        <div className="mb-6">
          <label className="block mb-2 font-semibold">Sleep Hours: {sleep}h</label>
          <input
            type="range"
            min="0"
            max="12"
            value={sleep}
            onChange={(e) => setSleep(e.target.value)}
            className="w-full accent-blue-500 h-2"
          />
        </div>

        {/* Stress Slider */}
        <div className="mb-6">
          <label className="block mb-2 font-semibold">
            Stress Level: {stress}/5
          </label>
          <input
            type="range"
            min="1"
            max="5"
            value={stress}
            onChange={(e) => setStress(e.target.value)}
            className="w-full accent-red-500 h-2"
          />
        </div>

        {/* Optional Note */}
        <div className="mb-6">
          <label className="block mb-2 font-semibold">Optional Note</label>
          <textarea
            placeholder="What's on your mind?"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            maxLength="200"
            rows="3"
            className="w-full bg-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-teal-600 to-teal-800 font-bold py-3 rounded-lg hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? "Saving..." : "✅ Save Check-In"}
        </button>
      </form>
    </div>
  );
}
