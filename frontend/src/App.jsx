import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AuthContext, { AuthProvider } from "./context/AuthContext";
import ThemeContext, { ThemeProvider } from "./context/ThemeContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Chat from "./pages/Chat";
import SOS from "./pages/SOS";
import Breathing from "./pages/Breathing";
import Journal from "./pages/Journal";
import Analytics from "./pages/Analytics";
import Resources from "./pages/Resources";
import Settings from "./pages/Settings";
import AIChatbot from "./pages/AIChatbot";
import FloatingChatbot from "./components/FloatingChatbot";

function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

function AppContent() {
  const { isDarkMode, colorTheme } = useContext(ThemeContext);

  const themeClasses = {
    purple: isDarkMode ? "from-zinc-900 via-purple-900 to-black" : "from-purple-50 via-purple-100 to-white",
    blue: isDarkMode ? "from-zinc-900 via-blue-900 to-black" : "from-blue-50 via-blue-100 to-white",
    green: isDarkMode ? "from-zinc-900 via-green-900 to-black" : "from-green-50 via-green-100 to-white"
  };

  const bgClass = themeClasses[colorTheme];

  return (
    <div className={`min-h-screen bg-gradient-to-br ${bgClass}`}>
        <Routes>
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
          <Route path="/sos" element={<ProtectedRoute><SOS /></ProtectedRoute>} />
          <Route path="/breathing" element={<ProtectedRoute><Breathing /></ProtectedRoute>} />
          <Route path="/journal" element={<ProtectedRoute><Journal /></ProtectedRoute>} />
          <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
          <Route path="/resources" element={<ProtectedRoute><Resources /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/ai-chatbot" element={<ProtectedRoute><AIChatbot /></ProtectedRoute>} />
          <Route path="/login" element={<Login />} />
        </Routes>
    </div>
  );
}

function ProtectedRoute({ children }) {
  const { user, loading, logout } = useContext(AuthContext);
  const { isDarkMode } = useContext(ThemeContext);

  if (loading) return <div className={`text-center p-10 ${isDarkMode ? "text-white" : "text-gray-900"}`}>Loading...</div>;

  return user ? (
    <div className={`min-h-screen ${isDarkMode ? "bg-zinc-900" : "bg-gray-50"}`}>
      <nav className={`border-b ${isDarkMode ? "bg-zinc-900 border-zinc-800 text-white" : "bg-white border-gray-300 text-gray-900"} p-4`}>
        <div className="flex justify-between items-center flex-wrap gap-3">
          <a href="/dashboard" className={`flex items-center gap-2 text-2xl font-bold transition ${isDarkMode ? "hover:text-teal-400" : "hover:text-teal-600"}`}>
            <img src="/Fevicon.jpeg" alt="AARUNYA" className="h-8 object-contain" />
            AARUNYA
          </a>
          <div className={`flex gap-4 items-center text-sm flex-wrap justify-end ${isDarkMode ? "text-white" : "text-gray-900"}`}>
            <a href="/dashboard" className={`transition ${isDarkMode ? "hover:text-teal-400" : "hover:text-teal-600"}`}>Dashboard</a>
            <a href="/breathing" className={`transition whitespace-nowrap ${isDarkMode ? "hover:text-teal-400" : "hover:text-teal-600"}`}>🫁 Breathing</a>
            <a href="/journal" className={`transition whitespace-nowrap ${isDarkMode ? "hover:text-teal-400" : "hover:text-teal-600"}`}>📔 Journal</a>
            <a href="/analytics" className={`transition whitespace-nowrap ${isDarkMode ? "hover:text-teal-400" : "hover:text-teal-600"}`}>📊 Analytics</a>
            <a href="/chat" className={`transition ${isDarkMode ? "hover:text-teal-400" : "hover:text-teal-600"}`}>Chat</a>
            <a href="/resources" className={`transition whitespace-nowrap ${isDarkMode ? "hover:text-teal-400" : "hover:text-teal-600"}`}>💡 Resources</a>
            <a href="/settings" className={`transition ${isDarkMode ? "hover:text-teal-400" : "hover:text-teal-600"}`}>⚙️ Settings</a>
            <a href="/sos" className={`font-bold whitespace-nowrap transition ${isDarkMode ? "hover:text-red-400" : "hover:text-red-600"}`}>🆘 SOS</a>
            <button
              onClick={() => logout()}
              className={`px-3 py-1 rounded text-xs font-semibold transition whitespace-nowrap ${isDarkMode ? "bg-red-600 hover:bg-red-700" : "bg-red-500 hover:bg-red-600"}`}
            >
              🚪 Logout
            </button>
          </div>
        </div>
      </nav>
      {children}
      <FloatingChatbot />
    </div>
  ) : (
    <Navigate to="/login" replace />
  );
}

export default App;
