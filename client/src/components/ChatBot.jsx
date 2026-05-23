import React, { useState } from "react";
import axios from "axios";
import { FiSend } from "react-icons/fi";
import ReactMarkdown from "react-markdown";
import API from "../api/axios";

const ChatBot = () => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hello 👋 I am JobBuddy AI. How can I help you today?",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      role: "user",
      text: input,
    };

    setMessages((prev) => [...prev, userMessage]);

    const currentInput = input;
    setInput("");
    setLoading(true);

    try {
      const res = await API.post("/ai/chat", {
        message: currentInput,
      });

      const aiMessage = {
        role: "assistant",
        text: res.data.reply,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Something went wrong.",
        },
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto h-[80vh] flex flex-col border rounded-xl overflow-hidden shadow-lg">
      <div className="bg-blue-600 text-white p-4 text-xl font-semibold">
        JobBuddy AI Assistant
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-xl ${
                msg.role === "user"
                  ? "bg-blue-600 text-yellow-50"
                  : "bg-white shadow"
              }`}
            >
              <ReactMarkdown>{msg.text}</ReactMarkdown>
            </div>
          </div>
        ))}

        {loading && (
          <div className="bg-white shadow p-3 rounded-xl w-fit">
            Thinking...
          </div>
        )}
      </div>

      <div className="p-4 border-t flex gap-2 bg-white">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything..."
          className="flex-1 border rounded-lg px-4 py-2 outline-none"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 rounded-lg"
        >
          <FiSend />
        </button>
      </div>
    </div>
  );
};

export default ChatBot;
