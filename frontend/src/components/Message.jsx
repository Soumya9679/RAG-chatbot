import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";
import { Bot, User, Copy, Check, ThumbsUp, ThumbsDown } from "lucide-react";

export default function Message({ role, content }) {
  const [copied, setCopied] = useState(false);
  const [rating, setRating] = useState(null); // 'up' or 'down'

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const isUser = role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={`flex w-full gap-3 ${
        isUser ? "flex-row-reverse justify-start" : "flex-row justify-start"
      }`}
    >
      {/* Avatar */}
      <div
        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border select-none ${
          isUser
            ? "bg-indigo-600/10 border-indigo-500/20 text-indigo-400"
            : "bg-slate-800 border-slate-700/80 text-slate-300"
        }`}
      >
        {isUser ? (
          <User className="w-5 h-5" />
        ) : (
          <Bot className="w-5 h-5" />
        )}
      </div>

      {/* Message Bubble Container */}
      <div className={`flex flex-col max-w-[85%] md:max-w-2xl lg:max-w-3xl ${isUser ? "items-end" : "items-start"}`}>
        {/* Sender Name */}
        <span className="text-[11px] font-medium text-slate-500 mb-1 px-1">
          {isUser ? "You" : "RAG Assistant"}
        </span>

        {/* Message Bubble */}
        <div
          className={`px-5 py-3.5 rounded-2xl shadow-sm text-slate-100 ${
            isUser
              ? "bg-indigo-600 border border-indigo-500/30 rounded-tr-none text-white"
              : "bg-slate-900/60 border border-slate-800/80 rounded-tl-none backdrop-blur-sm"
          }`}
        >
          <div className="markdown-content">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        </div>

        {/* Action Row (for Assistant responses) */}
        {!isUser && (
          <div className="flex items-center gap-3 mt-1.5 px-1">
            {/* Copy Button */}
            <button
              onClick={handleCopy}
              title="Copy message"
              className="flex items-center gap-1 text-[11px] font-medium text-slate-500 hover:text-slate-300 transition-colors p-1 rounded hover:bg-slate-800/50"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-green-500" />
                  <span className="text-green-500">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>

            <span className="text-slate-700 text-[10px] select-none">|</span>

            {/* Thumbs Up Rating */}
            <button
              onClick={() => setRating(rating === "up" ? null : "up")}
              title="Helpful"
              className={`p-1 rounded hover:bg-slate-800/50 transition-colors ${
                rating === "up" ? "text-indigo-400" : "text-slate-500 hover:text-slate-300"
              }`}
            >
              <ThumbsUp className="w-3.5 h-3.5" />
            </button>

            {/* Thumbs Down Rating */}
            <button
              onClick={() => setRating(rating === "down" ? null : "down")}
              title="Not helpful"
              className={`p-1 rounded hover:bg-slate-800/50 transition-colors ${
                rating === "down" ? "text-red-400" : "text-slate-500 hover:text-slate-300"
              }`}
            >
              <ThumbsDown className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}