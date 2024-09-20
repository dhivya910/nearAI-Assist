import React, { useState, useEffect } from "react";
import axios from "axios";
import("../base.css");

const ChatComponent = ({ data: txHash }: { data: string }) => {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<
    Array<{ role: string; content: string }>
  >([]);
  const [input, setInput] = useState("");
  const [isChatVisible, setIsChatVisible] = useState(true); // New state for visibility
  const [txData, setTxData] = useState<any>(null);

  useEffect(() => {
    async function fetchTxData() {
      setLoading(true);
      try {
        const response = await axios.get(`https://your-api.com/tx/${txHash}`);
        setTxData(response.data);

        const initialMessage = `Here's the transaction data: ${JSON.stringify(
          response.data
        )}. How can I help you understand this transaction?`;
        setMessages([{ role: "assistant", content: initialMessage }]);
      } catch (error) {
        console.error("Error fetching transaction data:", error);
        setMessages([
          {
            role: "assistant",
            content:
              "Sorry, I couldn't fetch the transaction data. How can I assist you?",
          },
        ]);
      }
      setLoading(false);
    }
    fetchTxData();
  }, [txHash]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: `You are a helpful assistant. Here's the context: ${JSON.stringify(
                txData
              )}`,
            },
            ...messages,
            userMessage,
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPEN_AI_API_KEY}`,
          },
        }
      );

      const assistantMessage = response.data.choices[0].message;
      setMessages((prevMessages) => [...prevMessages, assistantMessage]);
    } catch (error) {
      console.error("Error sending message to OpenAI:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
        },
      ]);
    }
    setLoading(false);
  };

  if (!isChatVisible) return null;

  return (
    <div className="max-w-sm mx-auto mt-10 flex flex-col h-[600px] shadow-lg rounded-lg bg-black text-white">
      {/* Header */}
      <div className="bg-teal-900 text-white p-4 rounded-t-lg flex items-center justify-between border border-white">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-2"></div>
          <div>
            <h4 className="text-lg font-bold">Chat with NearYou</h4>
            <p className="text-sm">We are online!</p>
          </div>
        </div>
        <div>
          <button
            onClick={() => setIsChatVisible(false)} // Close chat on click
            className="text-white text-xl"
          >
            ✕
          </button>
        </div>
        <div>
          <button className="text-white text-xl">⋮</button>
        </div>
      </div>

      {/* Message Container */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-900 border border-white h-[400px]">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-4 ${
              message.role === "user" ? "text-right" : "text-left"
            }`}
          >
            <span
              className={`inline-block p-3 rounded-lg max-w-xs ${
                message.role === "user"
                  ? "bg-teal-900 text-white"
                  : "bg-gray-800 text-gray-300"
              }`}
            >
              {message.content}
            </span>
          </div>
        ))}
      </div>

      {/* Input Field */}
      <div className="bg-teal-900 border border-white p-4 rounded-b-lg">
        <div className="flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            className="flex-1 px-4 py-2 text-white rounded-lg bg-gray-800 border border-transparent focus:border-blue-400 focus:bg-black"
            placeholder="Ask a question..."
            disabled={loading}
          />
          <button
            onClick={sendMessage}
            className="ml-2 px-4 py-2 border border-white bg-teal-900 text-white rounded-lg disabled:opacity-50"
            disabled={loading}
          >
            Send
          </button>
        </div>
      </div>

      {loading && (
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-900"></div>
        </div>
      )}
    </div>
  );
};

export default ChatComponent;
