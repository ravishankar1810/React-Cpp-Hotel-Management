import React, { useState, useRef, useEffect } from 'react';

export default function ChatWidget() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { sender: 'ai', text: "Hello! I am the PiyuNima AI. Ask me about room prices or availability." }
  ]);
  const [isLoading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // 1. Add User Message
    const userMsg = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      // 2. Call C++ Backend
      const res = await fetch('http://localhost:8080/api/ai', {
        method: 'POST',
        body: input
      });
      const data = await res.json();

      // 3. Add AI Response
      const aiMsg = { sender: 'ai', text: data.reply };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      const errorMsg = { sender: 'ai', text: "Sorry, I cannot connect to the front desk right now." };
      setMessages(prev => [...prev, errorMsg]);
    }
    setLoading(false);
  };

  return (
    <div className="chat-container">
      {/* Messages Area */}
      <div className="messages-area">
        {messages.map((msg, index) => (
          <div key={index} className={`message-bubble ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
        {isLoading && <div className="message-bubble ai typing">...</div>}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form className="chat-input-form" onSubmit={handleSend}>
        <input 
          type="text" 
          placeholder="Ask me anything..." 
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit">➤</button>
      </form>
    </div>
  );
}