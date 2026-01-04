import React, { useState } from "react";
import { getCheckinHistory } from "../services/api";

export default function Journal() {
  const [entries, setEntries] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState(3);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      alert("Please fill all fields");
      return;
    }

    const newEntry = {
      id: Date.now(),
      title,
      content,
      mood,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString()
    };

    setEntries([newEntry, ...entries]);
    setTitle("");
    setContent("");
    setMood(3);
    alert("✅ Journal entry saved!");
  };

  const deleteEntry = (id) => {
    setEntries(entries.filter(e => e.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-teal-900 to-black p-6">
      <h1 className="text-4xl font-bold text-white mb-8">📔 My Journal</h1>

      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Write Entry */}
        <div className="lg:col-span-1 bg-zinc-800 rounded-2xl p-6 text-white h-fit">
          <h2 className="text-2xl font-bold mb-4">✍️ New Entry</h2>

          <label className="block mb-3">
            <p className="text-sm mb-2">Title</p>
            <input
              type="text"
              placeholder="e.g., Today was good"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength="50"
              className="w-full bg-zinc-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </label>

          <label className="block mb-3">
            <p className="text-sm mb-2">How do you feel? {"😢😕😐🙂😊"[mood - 1]}</p>
            <input
              type="range"
              min="1"
              max="5"
              value={mood}
              onChange={(e) => setMood(parseInt(e.target.value))}
              className="w-full accent-purple-500"
            />
          </label>

          <label className="block mb-4">
            <p className="text-sm mb-2">What's on your mind?</p>
            <textarea
              placeholder="Write your thoughts..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              maxLength="500"
              rows="8"
              className="w-full bg-zinc-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </label>

          <button
            onClick={handleSave}
            className="w-full bg-gradient-to-r from-teal-600 to-teal-800 font-bold py-3 rounded-lg hover:opacity-90 transition"
          >
            💾 Save Entry
          </button>
        </div>

        {/* Past Entries */}
        <div className="lg:col-span-2 space-y-4">
          {entries.length === 0 ? (
            <div className="bg-zinc-800 rounded-2xl p-8 text-center text-zinc-400">
              <p className="text-lg">📝 Start journaling to see your entries here</p>
            </div>
          ) : (
            entries.map((entry) => (
              <div key={entry.id} className="bg-zinc-800 rounded-2xl p-6 text-white">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-xl font-bold">{entry.title}</h3>
                    <p className="text-sm text-zinc-400">{entry.date} at {entry.time}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl">{"😢😕😐🙂😊"[entry.mood - 1]}</p>
                    <button
                      onClick={() => deleteEntry(entry.id)}
                      className="text-xs text-red-400 hover:text-red-300 mt-2"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <p className="text-zinc-300">{entry.content}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
