import React, { useState } from "react";

export default function Breathing() {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState("breathe-in"); // breathe-in, hold, breathe-out
  const [count, setCount] = useState(4);
  const [rounds, setRounds] = useState(0);

  const startExercise = () => {
    setIsActive(true);
    setRounds(0);
    setPhase("breathe-in");
    setCount(4);

    const interval = setInterval(() => {
      setCount((prev) => {
        if (prev > 1) return prev - 1;

        // Transition between phases
        setPhase((prevPhase) => {
          if (prevPhase === "breathe-in") {
            setCount(4);
            return "hold";
          }
          if (prevPhase === "hold") {
            setCount(4);
            return "breathe-out";
          }
          if (prevPhase === "breathe-out") {
            setCount(4);
            setRounds((r) => r + 1);
            return "breathe-in";
          }
        });
        return 4;
      });
    }, 1000);

    setTimeout(() => {
      clearInterval(interval);
      setIsActive(false);
      alert("✅ Great! You completed 5 rounds of breathing exercises!");
    }, 60000); // 1 minute
  };

  const phaseColors = {
    "breathe-in": "from-blue-500 to-blue-600",
    hold: "from-teal-500 to-teal-600",
    "breathe-out": "from-green-500 to-green-600"
  };

  const phaseTexts = {
    "breathe-in": "Breathe In",
    hold: "Hold",
    "breathe-out": "Breathe Out"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-teal-900 to-black p-6">
      <h1 className="text-4xl font-bold text-white mb-8">🫁 Breathing Exercises</h1>

      <div className="max-w-2xl mx-auto">
        {/* Guide */}
        <div className="bg-zinc-800 rounded-2xl p-6 text-white mb-8">
          <h2 className="text-2xl font-bold mb-4">Calm Your Mind in 60 Seconds</h2>
          <p className="text-zinc-300 mb-4">
            This 4-7-8 breathing technique helps reduce anxiety and stress instantly.
          </p>
          <ul className="space-y-2 text-sm text-zinc-400">
            <li>✅ Breathe in for 4 seconds</li>
            <li>✅ Hold for 4 seconds</li>
            <li>✅ Breathe out for 4 seconds</li>
            <li>✅ Repeat 5 times</li>
          </ul>
        </div>

        {/* Animation Circle */}
        {isActive && (
          <div className="text-center mb-8">
            <div className={`w-48 h-48 mx-auto rounded-full bg-gradient-to-br ${phaseColors[phase]} animate-pulse flex items-center justify-center`}>
              <div className="text-center">
                <p className="text-white text-6xl font-bold">{count}</p>
                <p className="text-white text-2xl mt-4">{phaseTexts[phase]}</p>
              </div>
            </div>
            <p className="text-zinc-400 mt-6 text-lg">Round: {rounds}/5</p>
          </div>
        )}

        {/* Start Button */}
        {!isActive ? (
          <button
            onClick={startExercise}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold py-4 rounded-lg hover:opacity-90 transition text-lg"
          >
            🚀 Start 1-Minute Breathing Exercise
          </button>
        ) : (
          <div className="bg-green-900 rounded-lg p-4 text-white text-center">
            <p className="text-lg">🎯 Focus on your breath...</p>
          </div>
        )}

        {/* Tips */}
        <div className="mt-8 bg-zinc-800 rounded-2xl p-6 text-white">
          <h3 className="text-lg font-bold mb-4">💡 Tips</h3>
          <ul className="space-y-2 text-sm text-zinc-300">
            <li>🌬️ Do this 2-3 times daily for best results</li>
            <li>🪑 Sit comfortably in a quiet place</li>
            <li>👃 Breathe through your nose</li>
            <li>🧘 Practice before bed to sleep better</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
