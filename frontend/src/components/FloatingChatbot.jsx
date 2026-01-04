import React, { useState, useContext, useRef, useEffect } from "react";
import ThemeContext from "../context/ThemeContext";
import API from "../services/api";

export default function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm AARUNYA's Study Assistant. Ask me anything about academics, exams, stress management, or study tips!",
      sender: "bot",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const { isDarkMode } = useContext(ThemeContext);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: input,
      sender: "user",
      timestamp: new Date()
    };
    setMessages([...messages, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await API.post("/chat-ai", {
        message: input
      });

      const botMessage = {
        id: messages.length + 2,
        text: response.data.reply,
        sender: "bot",
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error(err);
      const errorMessage = {
        id: messages.length + 2,
        text: err.response?.data?.error || "Sorry, I couldn't process your request. Please try again.",
        sender: "bot",
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Chat Window */}
      {isOpen && (
        <div
          className={`absolute bottom-20 right-0 rounded-2xl shadow-2xl w-96 h-[600px] flex flex-col overflow-hidden ${
            isDarkMode ? "bg-zinc-800" : "bg-white"
          }`}
        >
          {/* Header */}
          <div className={`p-4 border-b ${isDarkMode ? "bg-teal-600 text-white border-teal-700" : "bg-teal-500 text-white border-teal-400"}`}>
            <div className="flex justify-between items-center">
              <h3 className="font-bold">AARUNYA Study Assistant</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-xl hover:opacity-70 transition"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className={`flex-1 overflow-y-auto p-4 space-y-3 ${isDarkMode ? "bg-zinc-800" : "bg-gray-50"}`}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                    msg.sender === "user"
                      ? "bg-purple-600 text-white rounded-br-none"
                      : isDarkMode
                      ? "bg-zinc-700 text-white rounded-bl-none"
                      : "bg-gray-200 text-gray-900 rounded-bl-none"
                  }`}
                >
                  <p className="break-words">{msg.text}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className={`px-3 py-2 rounded-lg rounded-bl-none ${isDarkMode ? "bg-zinc-700 text-white" : "bg-gray-200 text-gray-900"}`}>
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className={`p-3 border-t ${isDarkMode ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-200"}`}>
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask something..."
                disabled={loading}
                className={`flex-1 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                  isDarkMode
                    ? "bg-zinc-700 text-white placeholder-zinc-400"
                    : "bg-gray-100 text-gray-900 placeholder-gray-500"
                }`}
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${
                  loading || !input.trim()
                    ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                    : "bg-teal-600 hover:bg-teal-700 text-white"
                }`}
              >
                →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-lg transition transform hover:scale-110 ${
          isDarkMode
            ? "bg-teal-600 hover:bg-teal-700 text-white"
            : "bg-teal-500 hover:bg-teal-600 text-white"
        }`}
        title="Open AARUNYA Study Assistant"
      >
        🤖
      </button>
    </div>
  );
}
