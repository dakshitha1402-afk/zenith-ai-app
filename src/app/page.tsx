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
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim() || loading) return;

    const userMessage: Message = {
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      });

      if (!response.ok) {
        throw new Error(
          Server responded with status code: ${response.status}
        );
      }

      const data = await response.json();

      const aiResponseText =
        data.text ||
        data.error ||
        "The server returned an unexpected response.";

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: aiResponseText,
        },
      ]);
    } catch (err: any) {
      console.error("Frontend Connection Error:", err);

      const displayErr =
        err?.message || "Failed to reach the server.";

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: ⚠️ Connection Error: ${displayErr},
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white font-sans">

      {/* Header */}
      <header className="p-4 bg-gray-800 border-b border-gray-700 text-center font-bold text-2xl tracking-wide text-cyan-400 shadow-md">
        🌱 Zenith AI
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto p-4 space-y-5 max-w-4xl w-full mx-auto pb-28">

        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 px-6">

            <h1 className="text-3xl font-bold text-cyan-400 mb-4">
              Welcome to Zenith AI 🌱
            </h1>

            <p className="text-lg leading-8 max-w-lg">
              A place for reflection, conversation, self-awareness and support.
            </p>

            <p className="mt-6 text-sm text-gray-500">
              Share your thoughts, ask questions or simply talk.
            </p>

          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.role === "user"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`max-w-[90%] rounded-3xl px-5 py-4 text-base leading-8 shadow-lg transition-all duration-300 ${
                  msg.role === "user"
                    ? "bg-cyan-600 text-white rounded-tr-none"
                    : "bg-gray-800 text-gray-100 border border-gray-700 rounded-tl-none"
                }`}
              >
                <div className="whitespace-pre-wrap break-words">
                  {msg.content}
                </div>
              </div>
            </div>
          ))
        )}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-800 border border-gray-700 rounded-3xl rounded-tl-none px-5 py-4 text-base text-cyan-400 animate-pulse shadow-lg">
              🌱 Zenith AI is thinking...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </main>

      {/* Input Area */}
      <footer className="fixed bottom-0 left-0 right-0 p-4 bg-gray-900 border-t border-gray-800 backdrop-blur-md">
        <form
          onSubmit={sendMessage}
          className="max-w-4xl mx-auto flex gap-3"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Share what's on your mind..."
            disabled={loading}
            className="flex-1 bg-gray-800 text-white border border-gray-700 rounded-2xl px-5 py-4 text-base focus:outline-none focus:border-cyan-500 disabled:opacity-50"
          />

          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-4 rounded-2xl text-base font-medium transition-all duration-200 disabled:opacity-50"
          >
            Send
          </button>
        </form>
      </footer>
    </div>
  );
}
