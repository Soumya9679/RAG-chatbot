import { useState, useEffect, useRef } from "react";

import axios from "axios";

import { SendHorizonal } from "lucide-react";

import Message from "./Message";

export default function ChatBox() {

  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([]);

  const [loading, setLoading] = useState(false);

  const bottomRef = useRef(null);

  useEffect(() => {

    bottomRef.current?.scrollIntoView({
      behavior: "smooth"
    });

  }, [messages]);

  const sendMessage = async () => {

    if (!message.trim()) return;

    const userMessage = {
      role: "user",
      content: message
    };

    setMessages(prev => [...prev, userMessage]);

    const currentMessage = message;

    setMessage("");

    setLoading(true);

    try {

      const response = await axios.post(
        "https://mobile-energy-deodorize.ngrok-free.dev/chat",
        {
          question: currentMessage
        }
      );

      const aiMessage = {
        role: "assistant",
        content: response.data.answer
      };

      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);
    }
  };

  return (

    <div className="h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex">

      {/* SIDEBAR */}

      <div className="hidden md:flex w-72 border-r border-white/10 bg-white/5 backdrop-blur-xl flex-col">

        <div className="p-6 border-b border-white/10">

          <h1 className="text-2xl font-bold">
            Soumya AI
          </h1>

          <p className="text-sm text-gray-400 mt-2">
            RAG Powered Assistant
          </p>

        </div>

      </div>

      {/* MAIN */}

      <div className="flex-1 flex flex-col">

        {/* HEADER */}

        <div className="h-16 border-b border-white/10 bg-white/5 backdrop-blur-xl flex items-center px-6">

          <h1 className="text-lg font-semibold">
            AI Assistant
          </h1>

        </div>

        {/* CHAT AREA */}

        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">

          {messages.length === 0 && (

            <div className="h-full flex flex-col items-center justify-center text-center">

              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">

                Welcome Soumya

              </h1>

              <p className="text-gray-400 mt-4 text-lg">

                Ask anything from your RAG knowledge base

              </p>

            </div>
          )}

          {messages.map((msg, index) => (

            <Message
              key={index}
              role={msg.role}
              content={msg.content}
            />

          ))}

          {loading && (

            <div className="flex justify-start">

              <div className="bg-white/10 border border-white/10 px-5 py-4 rounded-3xl backdrop-blur-xl">

                <div className="flex gap-2">

                  <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>

                  <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-100"></div>

                  <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-200"></div>

                </div>

              </div>

            </div>
          )}

          <div ref={bottomRef}></div>

        </div>

        {/* INPUT */}

        <div className="p-4 border-t border-white/10 bg-white/5 backdrop-blur-xl">

          <div className="max-w-4xl mx-auto flex items-center gap-3 bg-white/10 border border-white/10 rounded-2xl px-4 py-3">

            <input
              type="text"
              placeholder="Ask anything..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
              className="flex-1 bg-transparent outline-none text-white placeholder-gray-400"
            />

            <button
              onClick={sendMessage}
              className="bg-blue-600 hover:bg-blue-500 transition-all p-3 rounded-xl"
            >

              <SendHorizonal size={18} />

            </button>

          </div>

        </div>

      </div>

    </div>
  );
}