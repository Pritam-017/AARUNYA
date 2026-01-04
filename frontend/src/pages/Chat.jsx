import React, { useState, useEffect, useContext, useRef } from "react";
import { getOrCreateRoom, getChatMessages, sendMessage } from "../services/api";
import AuthContext from "../context/AuthContext";
import io from "socket.io-client";

let socket = null;

export default function Chat() {
  const { user, chatUsername } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const messageEndRef = useRef(null);
  const pollIntervalRef = useRef(null);
  const isUserAtBottomRef = useRef(true);
  const messageCountRef = useRef(0);

  const scrollToBottom = () => {
    if (isUserAtBottomRef.current) {
      messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleScroll = (e) => {
    const element = e.target;
    const isAtBottom = 
      element.scrollHeight - element.scrollTop - element.clientHeight < 50;
    isUserAtBottomRef.current = isAtBottom;
  };

  // Only scroll when new messages are added (not on polling)
  useEffect(() => {
    if (messages.length > messageCountRef.current) {
      scrollToBottom();
      messageCountRef.current = messages.length;
    }
  }, [messages.length]);

  // Polling function to fetch messages
  const pollMessages = async (roomId) => {
    try {
      const msgRes = await getChatMessages(roomId);
      setMessages(msgRes.data);
    } catch (err) {
      console.error("Polling error:", err);
    }
  };

  useEffect(() => {
    if (!user) return;

    const initRoom = async () => {
      try {
        const res = await getOrCreateRoom(user.college);
        setRoom(res.data._id);

        // Load initial messages
        const msgRes = await getChatMessages(res.data._id);
        setMessages(msgRes.data);

        // Try to setup Socket.io
        if (!socket) {
          const SOCKET_URL = import.meta.env.VITE_API_URL.replace("/api", "");

          socket = io(SOCKET_URL, {
            transports: ["websocket"],
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            reconnectionAttempts: 5
          }); 
        }

        // Join Socket.io room
        socket.emit("join", user.college);

        // Listen for new messages via Socket.io
        socket.on("msg", (data) => {
          setMessages((prev) => {
            const exists = prev.some(m => m._id === data._id);
            return exists ? prev : [...prev, data];
          });
        });

        // Setup polling as fallback (every 2 seconds)
        pollIntervalRef.current = setInterval(() => {
          pollMessages(res.data._id);
        }, 2000);

        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    initRoom();

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
      if (socket) {
        socket.off("msg");
      }
    };
  }, [user]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || !room) return;

    const msgToSend = messageText;
    setMessageText("");

    try {
      const res = await sendMessage(room, messageText, chatUsername);
      
      // Add message to UI immediately with username
      const messageWithUsername = {
        ...res.data,
        username: chatUsername
      };
      setMessages((prev) => [...prev, messageWithUsername]);

      // Emit via socket
      if (socket) {
        socket.emit("msg", { room: user.college, text: messageText, username: chatUsername, ...res.data });
      }
    } catch (err) {
      alert("Error sending message: " + err.message);
      setMessageText(msgToSend); // Restore text on error
    }
  };

  if (loading) return <div className="text-white text-center p-10">Loading chat...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-teal-900 to-black p-6">
      <div className="max-w-2xl mx-auto bg-zinc-800 rounded-2xl h-[calc(100vh-150px)] flex flex-col">
        {/* Header */}
        <div className="bg-zinc-900 p-4 rounded-t-2xl border-b border-zinc-700">
          <h2 className="text-white font-bold text-lg">💬 {user?.college} Support Room</h2>
          <p className="text-zinc-400 text-sm">Your name: <span className="text-purple-400 font-semibold">{chatUsername}</span> • Anonymous • Safe Space</p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4" onScroll={handleScroll}>
          {messages.length === 0 ? (
            <div className="text-zinc-400 text-center mt-10">
              <p>👋 No messages yet. Be the first to share!</p>
            </div>
          ) : (
            <>
              {messages.map((msg, i) => (
                <div key={i} className="bg-zinc-700 text-white rounded-lg p-3 max-w-xs">
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-sm font-semibold text-purple-300">{msg.username || "Anonymous"}</p>
                    <p className="text-xs text-zinc-400">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                  <p className="break-words text-sm">{msg.text}</p>
                </div>
              ))}
              <div ref={messageEndRef} />
            </>
          )}
        </div>

        {/* Input */}
        <form onSubmit={handleSendMessage} className="border-t border-zinc-700 p-4">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Share your thoughts (anonymous)..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              maxLength="500"
              className="flex-1 bg-zinc-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              type="submit"
              className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-6 py-2 rounded-lg transition disabled:opacity-50"
              disabled={!messageText.trim()}
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
