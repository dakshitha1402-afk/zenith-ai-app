"use client";

import React, { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with status code: ${response.status}`);
      }

      const data = await response.json();
      
      // Strict extraction sequence ensuring the UI always gets a clean string display
      const aiResponseText = data.text || data.error || "The server returned an unrecognizable data structure. Please check your route formatting.";

      setMessages((prev) => [...prev, { role: "assistant", content: aiResponseText }]);
    } catch (err: any) {
      console.error("Frontend Connection Error:", err);
      const displayErr = err?.message || "Failed to reach the server function.";
      setMessages((prev) => [...prev, { role: "assistant", content: `Connection Mismatch: ${displayErr}` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white font-sans">
      <header className="p-4 bg-gray-800 border-b border-gray-700 text-center font-bold text-xl tracking-wide text-cyan-400">
        ZenithAI Dashboard × Llama 3 Free
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-4 max-w-3xl w-full mx-auto pb-24">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-2 mt-20">
            <p className="text-xl font-medium">Welcome to ZenithAI</p>
            <p className="text-sm">Type a message below to start chatting with Llama 3!</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm tracking-wide leading-relaxed shadow-md ${
                  msg.role === "user"
                    ? "bg-cyan-600 text-white rounded-tr-none"
                    : "bg-gray-800 text-gray-100 border border-gray-700 rounded-tl-none"
                }`}
              >
                <span className="whitespace-pre-wrap">{msg.content}</span>
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-800 border border-gray-700 rounded-2xl rounded-tl-none px-4 py-3 text-sm text-cyan-400 animate-pulse">
              ZenithAI is thinking...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </main>

      <footer className="fixed bottom-0 left-0 right-0 p-4 bg-gray-900 border-t border-gray-800">
        <form onSubmit={sendMessage} className="max-w-3xl mx-auto flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything..."
            disabled={loading}
            className="flex-1 bg-gray-800 text-white border border-gray-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-cyan-600 hover:bg-cyan-500 text-white px-5 py-3 rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
          >
            Send
          </button>
        </form>
      </footer>
    </div>
  );
}
