import ReactMarkdown from "react-markdown";

import { motion } from "framer-motion";

export default function Message({ role, content }) {

  return (

    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex ${
        role === "user"
          ? "justify-end"
          : "justify-start"
      }`}
    >

      <div
        className={`max-w-3xl px-5 py-4 rounded-3xl shadow-xl backdrop-blur-xl ${
          role === "user"
            ? "bg-blue-600"
            : "bg-white/10 border border-white/10"
        }`}
      >

        <div className="prose prose-invert max-w-none">

          <ReactMarkdown>
            {content}
          </ReactMarkdown>

        </div>

      </div>

    </motion.div>
  );
}