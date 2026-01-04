import React, { useState, useEffect, useRef } from "react";
import API from "../services/api";

export default function AIChatbot() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm your study assistant. Ask me anything about academics, exam preparation, stress management, or general student life. How can I help you today?",
      sender: "bot",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Add user message
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
      console.error("Full error:", err);
      let errorText = "Sorry, I couldn't process your request. Please try again.";
      
      // Show detailed error from backend if available
      if (err.response?.data?.error) {
        errorText = err.response.data.error;
        if (err.response.data.details) {
          errorText += " - " + err.response.data.details;
        }
      } else if (err.message) {
        errorText = "Error: " + err.message;
      }
      
      const errorMessage = {
        id: messages.length + 2,
        text: errorText,
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
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-blue-900 to-black p-6">
      <div className="max-w-4xl mx-auto h-screen flex flex-col">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-white">🤖 Study Assistant AI</h1>
          <p className="text-zinc-400 text-sm mt-2">Get help with academics, exams, and student life</p>
        </div>

        {/* Chat Area */}
        <div className="flex-1 bg-zinc-800 rounded-2xl p-6 overflow-y-auto mb-6 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                  msg.sender === "user"
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-zinc-700 text-white rounded-bl-none"
                }`}
              >
                <p className="text-sm break-words">{msg.text}</p>
                <p className="text-xs text-zinc-400 mt-1">
                  {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-zinc-700 text-white px-4 py-3 rounded-2xl rounded-bl-none">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-zinc-800 rounded-2xl p-4 flex gap-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask your question here... (Shift+Enter for new line)"
            className="flex-1 bg-zinc-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none max-h-24"
            rows="2"
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className={`px-6 py-2 rounded-lg font-semibold transition whitespace-nowrap ${
              loading || !input.trim()
                ? "bg-zinc-600 text-zinc-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            Send
          </button>
        </div>

        {/* Info */}
        <div className="mt-4 text-center text-xs text-zinc-400">
          <p>💡 Tip: Ask about exam prep, time management, stress relief, or any academic topic!</p>
        </div>
      </div>
    </div>
  );
}
