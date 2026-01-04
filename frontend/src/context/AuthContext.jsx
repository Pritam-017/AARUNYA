import React, { createContext, useState, useEffect } from "react";
import API from "../services/api";

const AuthContext = createContext();

// Generate random username
const generateRandomUsername = () => {
  const adjectives = ["Calm", "Happy", "Brave", "Wise", "Kind", "Cool", "Smart", "Swift", "Bright", "Free"];
  const nouns = ["Eagle", "Tiger", "Phoenix", "Wolf", "Panda", "Spark", "Wave", "Star", "Cloud", "Fire"];
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const num = Math.floor(Math.random() * 999);
  return `${adj}${noun}${num}`;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chatUsername, setChatUsername] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const anonId = localStorage.getItem("anonId");
    const college = localStorage.getItem("college");
    const username = localStorage.getItem("chatUsername");

    if (token && anonId) {
      setUser({ token, anonId, college });
      // Generate or retrieve chat username
      if (username) {
        setChatUsername(username);
      } else {
        const newUsername = generateRandomUsername();
        localStorage.setItem("chatUsername", newUsername);
        setChatUsername(newUsername);
      }
    }
    setLoading(false);
  }, []);

  const login = (token, anonId, college) => {
    localStorage.setItem("token", token);
    localStorage.setItem("anonId", anonId);
    localStorage.setItem("college", college);
    
    // Generate random username for chat
    const newUsername = generateRandomUsername();
    localStorage.setItem("chatUsername", newUsername);
    
    setUser({ token, anonId, college });
    setChatUsername(newUsername);
  };

  const logout = async () => {
    try {
      // Call backend to delete all user data
      await API.post("/auth/logout");
      console.log("✅ User data deleted from database");
    } catch (err) {
      console.error("Error deleting user data:", err);
    } finally {
      // Clear local storage regardless of API response
      localStorage.removeItem("token");
      localStorage.removeItem("anonId");
      localStorage.removeItem("college");
      localStorage.removeItem("chatUsername");
      setUser(null);
      setChatUsername(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, chatUsername }}>

      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
