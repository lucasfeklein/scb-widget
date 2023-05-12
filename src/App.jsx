import { Icon } from "@iconify/react";
import React, { useEffect, useRef, useState } from "react";
import { ThreeDots } from "react-loader-spinner";
import "./index.css";

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [tooltipIsOpen, setTooltipIsOpen] = useState(true);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([
    { user: "", chatbot: "", typing: false },
  ]);
  const chatHistoryRef = useRef(null);
  const ws = useRef(null);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setTooltipIsOpen(false);
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
    e.target.style.height = "44px";
    e.target.style.height = e.target.scrollHeight + "px";
    e.target.style.overflowY =
      e.target.scrollHeight > 120 ? "scroll" : "hidden";
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.length > 0 && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(message);
      setChatHistory((prevChatHistory) => [
        ...prevChatHistory,
        {
          user: message,
          chatbot: <ThreeDots width={30} height={30} color="#808080" />,
        },
      ]);
      setMessage("");
    }
  };

  const handleTextareaBlur = (e) => {
    e.target.style.height = "44px";
  };

  useEffect(() => {
    ws.current = new WebSocket("wss:scb-backend-production.up.railway.app");
    ws.current.onopen = () => {
      console.log("Connected to WebSocket server.");
    };
    ws.current.onmessage = (event) => {
      const response = event.data;
      let i = 0;
      const intervalId = setInterval(() => {
        setChatHistory((prevChatHistory) => {
          const updatedHistory = [...prevChatHistory];
          updatedHistory[updatedHistory.length - 1].chatbot = response.slice(
            0,
            i + 1
          );
          return updatedHistory;
        });
        i++;
        if (i === response.length) clearInterval(intervalId);
      }, 20); // adjust the delay as needed
    };
    ws.current.onclose = () => {
      console.log("Disconnected from WebSocket server.");
    };
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [chatHistory]);

  return (
    <div className="fixed bottom-5 right-5 z-index-99999">
      {tooltipIsOpen && (
        <div
          className="relative bg-blue-500 text-white rounded-lg p-4 mb-4 cursor-pointer"
          onClick={toggleChat}
        >
          <p>Oi! Sou um chat IA.</p>
          <p> Pergunte qualquer coisa.</p>
          <div className="triangle"></div>
        </div>
      )}
      <div className="flex justify-end">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold text-2xl py-2 px-4 rounded-full w-16 h-16"
          onClick={toggleChat}
        >
          {isOpen ? "X" : <i className="fa-solid fa-robot"></i>}
        </button>
      </div>
      {isOpen && (
        <div className="flex flex-col justify-between absolute bottom-full right-0 bg-white border border-gray-300 rounded-t-lg shadow-lg mb-5 chatSize rounded-lg overflow-hidden">
          <div className="border-b border-gray-300 p-4 mb-2 bg-blue-500 text-white">
            <p className="font-bold text-lg">Dynamic Bot</p>
          </div>
          <div
            className="chatHistorySize overflow-y-auto mb-2 px-2"
            ref={chatHistoryRef}
          >
            <div className="flex flex-row mb-3">
              <span className="mr-2">
                <i className="fa-solid fa-robot"></i>
              </span>
              <p className="bg-gray-200 px-2 py-2 rounded-tr-lg rounded-bl-lg rounded-br-lg">
                Olá! Como posso ajudar?
              </p>
            </div>
            {chatHistory.map((message, index) => (
              <div key={index} className="text-gray-700">
                {(message.user || message.chatbot) && (
                  <div>
                    {message.user && (
                      <div className="flex flex-row justify-end mb-3">
                        <p className="bg-blue-500 px-2 py-2 rounded-tl-lg rounded-bl-lg rounded-br-lg text-white">
                          {message.user}
                        </p>
                        <span className="ml-2">
                          <i className="fa-solid fa-user"></i>
                        </span>
                      </div>
                    )}
                    {message.chatbot && (
                      <div className="flex flex-row mb-3">
                        <span className="mr-2">
                          <i className="fa-solid fa-robot"></i>
                        </span>
                        <p className="bg-gray-200 px-2 py-2 rounded-tr-lg rounded-bl-lg rounded-br-lg whitespace-pre-line">
                          {message.chatbot}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
          <form onSubmit={sendMessage}>
            <div className="mb-4 relative mx-4">
              <textarea
                className="shadow border rounded w-full py-2 pl-4 pr-11 bg-gray-100 text-gray-700 focus:outline-none focus:shadow-outline mt-2 resize-none"
                id="message-input"
                placeholder="Type your message here"
                value={message}
                onChange={handleMessageChange}
                onBlur={handleTextareaBlur}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    sendMessage(e);
                  }
                }}
                style={{ height: "44px", maxHeight: "120px" }}
              ></textarea>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded text-xl absolute bottom-2 right-2"
                type="submit"
              >
                <Icon icon="fe:paper-plane" />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;
