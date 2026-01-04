import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { loginUser } from "../services/api";

export default function Login() {
  const [college, setCollege] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await loginUser(college);
      login(res.data.token, res.data.anonId, res.data.college);
      navigate("/dashboard");
    } catch (err) {
      alert("Login failed: " + err.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-900 via-zinc-900 to-black flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-zinc-800 rounded-2xl shadow-2xl p-8">
        <h1 className="text-4xl font-bold text-white text-center mb-2">AARUNYA</h1>
        <p className="text-zinc-400 text-center mb-8">Anonymous Mental Wellness</p>

        <form onSubmit={handleLogin}>
          <label className="block text-white mb-2">Your College Name</label>
          <input
            type="text"
            placeholder="e.g., IIT Delhi"
            value={college}
            onChange={(e) => setCollege(e.target.value)}
            required
            className="w-full bg-zinc-700 text-white rounded-lg px-4 py-3 mb-6 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-teal-600 to-teal-800 text-white font-bold py-3 rounded-lg hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Enter Anonymously"}
          </button>
        </form>

        <p className="text-zinc-400 text-xs text-center mt-6">
          ✅ Completely Anonymous • No Email • No Tracking
        </p>
      </div>
    </div>
  );
}
