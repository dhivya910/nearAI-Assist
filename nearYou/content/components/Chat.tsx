import React, { useState, useEffect } from "react";
import axios from "axios";

const ChatComponent = ({ data: txHash }: { data: string }) => {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [input, setInput] = useState("");
  const [txData, setTxData] = useState<any>(null);

  useEffect(() => {
    async function fetchTxData() {
      setLoading(true);
      try {
        // Replace with your actual API endpoint
        const response = await axios.get(`https://api.nearblocks.io/v1/txn/${txHash}`);
        setTxData(response.data);

        // Initialize chat with context
        const initialMessage = `Here's the transaction data: ${JSON.stringify(response.data)}. How can I help you understand this transaction?`;
        setMessages([{ role: "assistant", content: initialMessage }]);
      } catch (error) {
        console.error("Error fetching transaction data:", error);
        setMessages([{ role: "assistant", content: "Sorry, I couldn't fetch the transaction data. How can I assist you?" }]);
      }
      setLoading(false);
    }
    fetchTxData();
  }, [txHash]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: "gpt-4",
          messages: [
            { role: "system", content: `You are a helpful assistant. Here's the context: ${JSON.stringify(txData)}` },
            ...messages,
            userMessage
          ]
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.OPEN_AI_API_KEY}`,
          }
        }
      );

      const assistantMessage = response.data.choices[0].message;
      setMessages(prevMessages => [...prevMessages, assistantMessage]);
    } catch (error) {
      console.error("Error sending message to OpenAI:", error);
      setMessages(prevMessages => [...prevMessages, { role: "assistant", content: "Sorry, I encountered an error. Please try again." }]);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto mt-10 flex flex-col h-[600px]">
      <div className="flex-1 overflow-y-auto mb-4 p-4 border border-gray-300 rounded">
        {messages.map((message, index) => (
          <div key={index} className={`mb-4 ${message.role === "user" ? "text-right" : "text-left"}`}>
            <span className={`inline-block p-2 rounded ${message.role === "user" ? "bg-blue-500 text-white" : "bg-gray-200"}`}>
              {message.content}
            </span>
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          className="flex-1 p-2 border border-gray-300 rounded-l"
          placeholder="Ask a question..."
          disabled={loading}
        />
        <button
          onClick={sendMessage}
          className="p-2 bg-blue-500 text-white rounded-r"
          disabled={loading}
        >
          Send
        </button>
      </div>
      {loading && (
        <div className="mt-4 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      )}
    </div>
  );
};

export default ChatComponent;