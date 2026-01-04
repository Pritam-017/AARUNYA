import React, { createContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [colorTheme, setColorTheme] = useState("teal");

  useEffect(() => {
    // Load from localStorage
    const savedMode = localStorage.getItem("darkMode");
    const savedTheme = localStorage.getItem("colorTheme");
    
    if (savedMode !== null) {
      setIsDarkMode(JSON.parse(savedMode));
    }
    if (savedTheme) {
      setColorTheme(savedTheme);
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem("darkMode", JSON.stringify(newMode));
  };

  const setTheme = (theme) => {
    setColorTheme(theme);
    localStorage.setItem("colorTheme", theme);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode, colorTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export default ThemeContext;
