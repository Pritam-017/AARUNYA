import React, { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import ThemeContext from "../context/ThemeContext";

export default function Settings() {
  const { user, logout } = useContext(AuthContext);
  const { isDarkMode, toggleDarkMode, colorTheme, setTheme } = useContext(ThemeContext);
  const [notifications, setNotifications] = useState(true);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout();
    }
  };

  return (
    <div className={`min-h-screen p-6 ${isDarkMode ? "bg-gradient-to-br from-zinc-900 via-teal-900 to-black" : "bg-gradient-to-br from-teal-50 via-teal-100 to-white"}`}>
      <h1 className={`text-4xl font-bold mb-8 ${isDarkMode ? "text-white" : "text-gray-900"}`}>⚙️ Settings</h1>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Profile Section */}
        <div className={`rounded-2xl p-6 ${isDarkMode ? "bg-zinc-800 text-white" : "bg-white text-gray-900"}`}>
          <h2 className="text-2xl font-bold mb-4">👤 Profile</h2>
          <div className="space-y-4">
            <div className={`rounded-lg p-4 ${isDarkMode ? "bg-zinc-700" : "bg-gray-100"}`}>
              <p className={`text-sm ${isDarkMode ? "text-zinc-400" : "text-gray-600"}`}>College</p>
              <p className="text-xl font-bold">{user?.college || "Not set"}</p>
            </div>
            <div className={`rounded-lg p-4 ${isDarkMode ? "bg-zinc-700" : "bg-gray-100"}`}>
              <p className={`text-sm ${isDarkMode ? "text-zinc-400" : "text-gray-600"}`}>Anonymous ID</p>
              <p className={`text-sm font-mono break-all ${isDarkMode ? "text-purple-400" : "text-purple-600"}`}>{user?.anonId || "N/A"}</p>
            </div>
          </div>
        </div>

        {/* Preferences Section */}
        <div className={`rounded-2xl p-6 ${isDarkMode ? "bg-zinc-800 text-white" : "bg-white text-gray-900"}`}>
          <h2 className="text-2xl font-bold mb-4">🎨 Preferences</h2>
          <div className="space-y-4">
            {/* Light/Dark Mode */}
            <div className={`flex justify-between items-center rounded-lg p-4 ${isDarkMode ? "bg-zinc-700" : "bg-gray-100"}`}>
              <div>
                <p className="font-bold">{isDarkMode ? "🌙 Dark Mode" : "☀️ Light Mode"}</p>
                <p className={`text-sm ${isDarkMode ? "text-zinc-400" : "text-gray-600"}`}>Toggle light/dark theme</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isDarkMode}
                  onChange={toggleDarkMode}
                  className="sr-only peer"
                />
                <div className={`w-11 h-6 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${isDarkMode ? "bg-teal-600 after:bg-white" : "bg-gray-400 after:bg-white"}`}></div>
              </label>
            </div>

            {/* Notifications */}
            <div className={`flex justify-between items-center rounded-lg p-4 ${isDarkMode ? "bg-zinc-700" : "bg-gray-100"}`}>
              <div>
                <p className="font-bold">🔔 Notifications</p>
                <p className={`text-sm ${isDarkMode ? "text-zinc-400" : "text-gray-600"}`}>Daily check-in reminders</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications}
                  onChange={(e) => setNotifications(e.target.checked)}
                  className="sr-only peer"
                />
                <div className={`w-11 h-6 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${isDarkMode ? "bg-teal-600 after:bg-white" : "bg-gray-400 after:bg-white"}`}></div>
              </label>
            </div>

            {/* Theme */}
            <div className={`rounded-lg p-4 ${isDarkMode ? "bg-zinc-700" : "bg-gray-100"}`}>
              <p className="font-bold mb-3">🎭 Color Theme</p>
              <div className="flex gap-3">
                {["teal", "blue", "green"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={`px-4 py-2 rounded-lg font-semibold transition ${
                      colorTheme === t
                        ? t === "teal"
                          ? "bg-teal-600 text-white"
                          : t === "blue"
                          ? "bg-blue-600 text-white"
                          : "bg-green-600 text-white"
                        : isDarkMode
                        ? "bg-zinc-600 hover:bg-zinc-500"
                        : "bg-gray-300 hover:bg-gray-400"
                    }`}
                  >
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className={`rounded-2xl p-6 ${isDarkMode ? "bg-zinc-800 text-white" : "bg-white text-gray-900"}`}>
          <h2 className="text-2xl font-bold mb-4">ℹ️ About</h2>
          <div className={`space-y-3 text-sm ${isDarkMode ? "text-zinc-300" : "text-gray-700"}`}>
            <p>✨ <strong>AARUNYA v1.0</strong></p>
            <p>Mental wellness app for students with anonymous support</p>
            <p>📧 Contact: support@aarunya.app</p>
            <p>🔒 Your data is always anonymous and secure</p>
          </div>
        </div>

        {/* Logout Section */}
        <div className={`rounded-2xl p-6 ${isDarkMode ? "bg-zinc-800 text-white" : "bg-white text-gray-900"}`}>
          <button
            onClick={handleLogout}
            className={`w-full font-bold py-3 rounded-lg transition ${isDarkMode ? "bg-teal-600 hover:bg-teal-700" : "bg-teal-500 hover:bg-teal-600 text-white"}`}
          >
            🚪 Logout
          </button>
        </div>
      </div>
    </div>
  );
}
