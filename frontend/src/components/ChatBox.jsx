import { useState } from "react";
import axios from "axios";

export default function ChatBox() {

  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {

    if (!message.trim()) return;

    const userMessage = {
      role: "user",
      content: message
    };

    setChat(prev => [...prev, userMessage]);

    setLoading(true);

    try {

      const response = await axios.post(
        "http://127.0.0.1:8000/chat",
        {
          question: message
        }
      );

      const aiMessage = {
        role: "assistant",
        content: response.data.answer
      };

      setChat(prev => [...prev, aiMessage]);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);
    }

    setMessage("");
  };

  return (

    <div className="chat-container">

      <div className="chat-box">

        {chat.map((msg, index) => (

          <div
            key={index}
            className={
              msg.role === "user"
              ? "user-message"
              : "ai-message"
            }
          >
            {msg.content}
          </div>

        ))}

        {loading && (
          <div className="ai-message">
            Thinking...
          </div>
        )}

      </div>

      <div className="input-area">

        <input
          type="text"
          placeholder="Ask something..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
        />

        <button onClick={sendMessage}>
          Send
        </button>

      </div>

    </div>
  );
}