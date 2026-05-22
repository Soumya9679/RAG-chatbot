import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  SendHorizonal,
  Menu,
  X,
  Plus,
  Trash2,
  Settings,
  Database,
  FileText,
  SlidersHorizontal,
  Sparkles,
  UploadCloud,
  Server,
  AlertCircle,
  FileCode,
  FileSpreadsheet
} from "lucide-react";
import Message from "./Message";

export default function ChatBox() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(2048);
  const [selectedModel, setSelectedModel] = useState("Llama 3 (8B)");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showUploadToast, setShowUploadToast] = useState(false);
  const [newFileName, setNewFileName] = useState("");

  const [indexedDocs, setIndexedDocs] = useState([
    { name: "company_overview.pdf", size: "2.4 MB", type: "pdf" },
    { name: "q4_financials.xlsx", size: "1.1 MB", type: "sheet" },
    { name: "api_endpoints_documentation.md", size: "340 KB", type: "markdown" },
    { name: "customer_support_guide.docx", size: "1.8 MB", type: "doc" }
  ]);

  const bottomRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }, [messages]);

  const sendMessage = async (overrideMessage = "") => {
    const textToSend = overrideMessage || message;
    if (!textToSend.trim()) return;

    const userMessage = {
      role: "user",
      content: textToSend
    };

    setMessages(prev => [...prev, userMessage]);
    if (!overrideMessage) {
      setMessage("");
    }
    setLoading(true);

    try {
      const response = await axios.post(
        "https://mobile-energy-deodorize.ngrok-free.dev/chat",
        {
          question: textToSend
        }
      );

      const aiMessage = {
        role: "assistant",
        content: response.data.answer
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error(error);
      const aiErrorMessage = {
        role: "assistant",
        content: "⚠️ **Connection Error**: Unable to communicate with the RAG server. Please verify the backend is running and the tunnel endpoint is active."
      };
      setMessages(prev => [...prev, aiErrorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    if (window.confirm("Are you sure you want to clear this conversation?")) {
      setMessages([]);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setSidebarOpen(false);
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setNewFileName(file.name);
    setUploading(true);
    setUploadProgress(10);

    // Simulate vector embedding indexing progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            const extension = file.name.split('.').pop() || 'doc';
            const sizeFormatted = file.size > 1024 * 1024 
              ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
              : `${(file.size / 1024).toFixed(0)} KB`;

            setIndexedDocs(current => [
              { name: file.name, size: sizeFormatted, type: extension },
              ...current
            ]);
            setUploading(false);
            setShowUploadToast(true);
            setTimeout(() => setShowUploadToast(false), 3000);
          }, 400);
          return 100;
        }
        return prev + 15;
      });
    }, 150);
  };

  const getDocIcon = (type) => {
    switch (type.toLowerCase()) {
      case "pdf":
        return <FileText className="w-4 h-4 text-red-400" />;
      case "xlsx":
      case "xls":
      case "sheet":
        return <FileSpreadsheet className="w-4 h-4 text-emerald-400" />;
      case "md":
      case "markdown":
        return <FileCode className="w-4 h-4 text-indigo-400" />;
      default:
        return <FileText className="w-4 h-4 text-slate-400" />;
    }
  };

  const promptSuggestions = [
    {
      title: "Summarize knowledge base",
      desc: "Retrieve a quick overview of all indexed documents.",
      prompt: "Can you summarize all the active documents currently loaded in our RAG knowledge base?"
    },
    {
      title: "Review Q4 financials",
      desc: "Analyze financial statistics from the spreadsheet.",
      prompt: "Based on the Q4 financials sheets, what were the main growth drivers and expenses?"
    },
    {
      title: "Check API endpoints",
      desc: "List routes and parameters from the API specs.",
      prompt: "Can you list the key API endpoints and describe the authentication flow?"
    }
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 border-r border-slate-800">
      {/* Sidebar Header */}
      <div className="p-5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-md">
            <Database className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-md font-bold tracking-tight text-white leading-none">Soumya AI</h1>
            <span className="text-[10px] text-slate-400">RAG Knowledge Engine</span>
          </div>
        </div>
        {/* Pulse Indicator */}
        <div className="flex items-center gap-1.5 bg-slate-950 px-2 py-1 rounded-full border border-slate-800">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[9px] font-semibold text-emerald-400 uppercase tracking-wider">Ready</span>
        </div>
      </div>

      {/* Primary Action */}
      <div className="p-4">
        <button
          onClick={handleNewChat}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-sm transition-all duration-200"
        >
          <Plus className="w-4 h-4" />
          New Conversation
        </button>
      </div>

      {/* Scrollable Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-5">
        {/* RAG Documents Section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              Indexed Source Docs ({indexedDocs.length})
            </h3>
            <button 
              onClick={triggerFileUpload}
              title="Add document to index"
              className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-0.5 p-1 rounded hover:bg-slate-800"
            >
              <UploadCloud className="w-3 h-3" />
              Index
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".pdf,.xlsx,.xls,.md,.txt,.docx,.doc"
            />
          </div>

          {/* Uploading progress bar */}
          {uploading && (
            <div className="mb-3 p-2 bg-slate-950 rounded-lg border border-slate-800">
              <div className="flex items-center justify-between text-[10px] mb-1">
                <span className="text-indigo-400 truncate max-w-[120px]">{newFileName}</span>
                <span className="text-slate-400">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-indigo-500 h-full transition-all duration-150"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <span className="text-[8px] text-slate-500 block mt-1">Extracting & indexing embeddings...</span>
            </div>
          )}

          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {indexedDocs.map((doc, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2 rounded-lg bg-slate-950/40 border border-slate-800/40 hover:border-slate-700/60 transition-all text-xs"
              >
                <div className="flex items-center gap-2 truncate max-w-[150px]">
                  {getDocIcon(doc.type)}
                  <span className="truncate text-slate-300 font-medium">{doc.name}</span>
                </div>
                <span className="text-[10px] text-slate-500">{doc.size}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Model Configurations */}
        <div className="border-t border-slate-800/80 pt-4">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Model Configuration
          </h3>

          <div className="space-y-3.5 text-xs">
            {/* Model Select */}
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 font-medium">Active LLM</label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-300 focus:outline-none focus:border-indigo-500"
              >
                <option value="Llama 3 (8B)">Llama 3 (8B)</option>
                <option value="Mistral (7B)">Mistral (7B)</option>
                <option value="Claude 3.5 (Hybrid)">Claude 3.5 (Hybrid)</option>
              </select>
            </div>

            {/* Temperature Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                <span>Temperature</span>
                <span className="text-indigo-400">{temperature}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full accent-indigo-500 bg-slate-950 h-1 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[8px] text-slate-500">
                <span>Precise</span>
                <span>Creative</span>
              </div>
            </div>

            {/* Max Tokens Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                <span>Max Generation Tokens</span>
                <span className="text-indigo-400">{maxTokens}</span>
              </div>
              <input
                type="range"
                min="256"
                max="4096"
                step="256"
                value={maxTokens}
                onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                className="w-full accent-indigo-500 bg-slate-950 h-1 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/40 text-[10px] text-slate-500 flex items-center justify-between">
        <span>v1.2.0 Stable</span>
        <div className="flex items-center gap-1">
          <Server className="w-3 h-3" />
          <span>Local Engine</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-screen bg-slate-950 text-slate-100 flex relative overflow-hidden font-sans">
      {/* Desktop Sidebar (Permanent) */}
      <div className="hidden lg:flex w-80 shrink-0">
        <SidebarContent />
      </div>

      {/* Mobile Drawer Sidebar (Sliding Menu) */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Backdrop Blur Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-slate-950 z-40 lg:hidden"
            />
            {/* Sliding Drawer Container */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0.15, duration: 0.35 }}
              className="fixed inset-y-0 left-0 w-72 z-50 lg:hidden shadow-2xl"
            >
              <div className="h-full relative">
                {/* Close Drawer Button */}
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
                <SidebarContent />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Chat Frame */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-950/50">
        {/* Header Console */}
        <header className="h-16 border-b border-slate-800/80 bg-slate-900/20 backdrop-blur-md flex items-center justify-between px-4 md:px-6 shrink-0 z-30">
          <div className="flex items-center gap-3">
            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/50"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex flex-col">
              <h2 className="text-sm font-semibold text-slate-200">Active Chat Workspace</h2>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-slate-500 font-medium">Session Model:</span>
                <span className="text-[10px] text-indigo-400 font-semibold">{selectedModel}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleClearChat}
              disabled={messages.length === 0}
              title="Clear active workspace history"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800/60 disabled:opacity-40 disabled:hover:bg-transparent transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Clear History</span>
            </button>
          </div>
        </header>

        {/* Message Feed Area */}
        <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6 space-y-6">
          {messages.length === 0 && (
            <div className="max-w-2xl mx-auto h-full flex flex-col justify-center py-8">
              {/* Central Panel Brand */}
              <div className="text-center mb-8">
                <div className="inline-flex p-3 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 mb-4">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                  RAG Analytics Workspace
                </h1>
                <p className="mt-2 text-sm text-slate-400 max-w-md mx-auto">
                  Ask queries related to your uploaded manuals, databases, and document indexes. The LLM will cite direct facts.
                </p>
              </div>

              {/* RAG Stat Box */}
              <div className="grid grid-cols-3 gap-3 mb-8 text-center bg-slate-900/40 border border-slate-800/60 p-4 rounded-xl">
                <div>
                  <span className="block text-lg font-bold text-white">{indexedDocs.length}</span>
                  <span className="text-[9px] text-slate-500 uppercase font-semibold">Loaded Files</span>
                </div>
                <div className="border-x border-slate-800">
                  <span className="block text-lg font-bold text-indigo-400">14,240</span>
                  <span className="text-[9px] text-slate-500 uppercase font-semibold">Embeddings</span>
                </div>
                <div>
                  <span className="block text-lg font-bold text-emerald-400">Online</span>
                  <span className="text-[9px] text-slate-500 uppercase font-semibold">RAG Server</span>
                </div>
              </div>

              {/* Prompt Suggestions Grid */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 text-center sm:text-left">
                  Suggested Enquiries
                </h3>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {promptSuggestions.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => sendMessage(item.prompt)}
                      className="text-left p-3.5 rounded-xl bg-slate-900/40 border border-slate-800/60 hover:border-indigo-500/40 hover:bg-slate-900/80 transition-all group"
                    >
                      <h4 className="text-xs font-semibold text-slate-200 group-hover:text-indigo-400 transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-[10px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {item.desc}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Active Messages mapping */}
          {messages.map((msg, index) => (
            <Message key={index} role={msg.role} content={msg.content} />
          ))}

          {/* Typing Loading Indicator bubble */}
          {loading && (
            <div className="flex gap-3 justify-start">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border bg-slate-800 border-slate-700/80 text-slate-300">
                <Database className="w-5 h-5 animate-pulse" />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-medium text-slate-500 mb-1 px-1">RAG Assistant</span>
                <div className="bg-slate-900/60 border border-slate-800/80 px-5 py-4 rounded-2xl rounded-tl-none backdrop-blur-sm shadow-sm flex items-center justify-center min-w-[70px]">
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={bottomRef}></div>
        </div>

        {/* Input Bar Section */}
        <footer className="p-4 border-t border-slate-800/80 bg-slate-900/20 backdrop-blur-md shrink-0">
          <div className="max-w-4xl mx-auto relative">
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 focus-within:border-indigo-500/60 transition-colors shadow-inner">
              {/* Document upload mock icon trigger */}
              <button
                onClick={triggerFileUpload}
                title="Index local document"
                className="text-slate-500 hover:text-slate-300 p-1.5 rounded-lg hover:bg-slate-800/60 transition-colors"
              >
                <UploadCloud className="w-4.5 h-4.5" />
              </button>

              <input
                type="text"
                placeholder="Ask database a question..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    sendMessage();
                  }
                }}
                disabled={loading}
                className="flex-1 bg-transparent border-0 outline-none text-slate-200 placeholder-slate-500 text-sm py-1"
              />

              <button
                onClick={() => sendMessage()}
                disabled={!message.trim() || loading}
                className="bg-indigo-600 hover:bg-indigo-500 text-white disabled:bg-slate-800 disabled:text-slate-600 p-2 rounded-lg transition-all"
              >
                <SendHorizonal className="w-4 h-4" />
              </button>
            </div>
          </div>
        </footer>
      </div>

      {/* Floating Upload Completed Success Notification Toast */}
      <AnimatePresence>
        {showUploadToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 20, x: "-50%" }}
            className="fixed bottom-24 left-1/2 z-50 bg-slate-900 border border-slate-700/80 px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 text-xs text-slate-200"
          >
            <AlertCircle className="w-4 h-4 text-emerald-400" />
            <span>Document <strong>{newFileName}</strong> indexed & vectorized successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}