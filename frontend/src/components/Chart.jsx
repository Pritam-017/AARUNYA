import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function Chart({ data }) {
  if (data.length === 0) return null;

  const chartData = data.slice(-7).reverse().map(checkin => ({
    date: new Date(checkin.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    mood: checkin.mood,
    stress: checkin.stress,
    sleep: checkin.sleep
  }));

  return (
    <div className="bg-zinc-900 rounded-2xl p-6 text-white">
      <h3 className="text-xl font-bold mb-4">📈 7-Day Trend</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis dataKey="date" stroke="#888" />
          <YAxis stroke="#888" />
          <Tooltip
            contentStyle={{ backgroundColor: "#27272a", border: "1px solid #444" }}
            labelStyle={{ color: "#fff" }}
          />
          <Line type="monotone" dataKey="mood" stroke="#8b5cf6" name="Mood" strokeWidth={2} />
          <Line type="monotone" dataKey="stress" stroke="#ef4444" name="Stress" strokeWidth={2} />
          <Line type="monotone" dataKey="sleep" stroke="#60a5fa" name="Sleep" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
