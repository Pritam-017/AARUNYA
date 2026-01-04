import React from "react";

export default function BurnoutCard({ score, status }) {
  return (
    <div className="bg-zinc-900 p-6 rounded-2xl text-white shadow-lg border-l-4 border-teal-500">
      <h2 className="text-xl font-semibold mb-4">🔥 Burnout Score</h2>
      <p className="text-5xl font-bold mb-4">{score}</p>
      <span
        className={`inline-block text-sm font-semibold px-4 py-2 rounded-full ${
          score < 40
            ? "bg-red-900 text-red-200"
            : score < 60
            ? "bg-yellow-900 text-yellow-200"
            : "bg-green-900 text-green-200"
        }`}
      >
        {status}
      </span>
      <p className="text-zinc-400 text-sm mt-4">
        📊 Based on mood, sleep, and stress over 7 days
      </p>
    </div>
  );
}
