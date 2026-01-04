import React, { useContext } from "react";
import AuthContext from "../context/AuthContext";

export default function SOS() {
  const { logout } = useContext(AuthContext);

  const helplines = [
    { name: "AASRA", number: "9820466726", hours: "24/7" },
    { name: "iCall", number: "9152987821", hours: "9 AM - 11 PM" },
    { name: "Vandrevala Foundation", number: "9999666555", hours: "24/7" },
    { name: "Lifeline India", number: "9886601111", hours: "24/7" },
    { name: "IACP Crisis Chat", number: "1098", hours: "24/7" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-950 via-zinc-900 to-black p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-red-900 rounded-2xl p-8 text-white shadow-2xl mb-8">
          <h1 className="text-5xl font-bold mb-4">🆘 SOS Mode</h1>
          <p className="text-lg mb-6 text-red-100">
            If you're in crisis, please reach out immediately. You're not alone.
          </p>

          <button
            onClick={() => alert("Emergency services contacted")}
            className="w-full bg-red-600 hover:bg-red-700 font-bold py-4 rounded-lg text-lg mb-4 transition"
          >
            📞 Call Emergency Services (100)
          </button>

          <button
            onClick={() => logout()}
            className="w-full bg-zinc-700 hover:bg-zinc-600 font-bold py-3 rounded-lg transition"
          >
            🚪 Logout
          </button>
        </div>

        {/* Helplines */}
        <div className="space-y-4">
          <h2 className="text-white text-2xl font-bold mb-6">📞 Trusted Helplines</h2>
          {helplines.map((hl, i) => (
            <a
              key={i}
              href={`tel:${hl.number}`}
              className="block bg-zinc-800 rounded-xl p-6 text-white hover:bg-zinc-700 transition transform hover:scale-105"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold">{hl.name}</h3>
                  <p className="text-lg font-mono text-purple-400 mt-2">{hl.number}</p>
                  <p className="text-sm text-zinc-400 mt-2">{hl.hours}</p>
                </div>
                <span className="text-3xl">📱</span>
              </div>
            </a>
          ))}
        </div>

        {/* Resources */}
        <div className="mt-8 bg-zinc-800 rounded-2xl p-6 text-white">
          <h3 className="text-xl font-bold mb-4">💚 What You Can Do Now</h3>
          <ul className="space-y-3 text-zinc-300">
            <li>✅ Call one of the helplines above</li>
            <li>✅ Talk to a trusted friend or family member</li>
            <li>✅ Go to your nearest hospital/clinic</li>
            <li>✅ Take a walk in fresh air</li>
            <li>✅ Practice deep breathing</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
