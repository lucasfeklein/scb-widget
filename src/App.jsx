import { Icon } from '@iconify/react';
import React, { useEffect, useRef, useState } from 'react';
import './index.css';

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([{ user: '', chatbot: 'waiting...' }]);
  const chatHistoryRef = useRef(null);
  const ws = useRef(null);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
    e.target.style.height = "44px";
    e.target.style.height = e.target.scrollHeight + "px";
    e.target.style.overflowY = e.target.scrollHeight > 120 ? "scroll" : "hidden";
  };

  const sendMessage = (e) => {
    e.preventDefault()
    if (message.length > 0 && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(message);
      setChatHistory(prevChatHistory => [...prevChatHistory, { user: message, chatbot: 'waiting...' }]);
      setMessage('');
    }
  };

  useEffect(() => {
    ws.current = new WebSocket('ws://localhost:3000');
    ws.current.onopen = () => {
      console.log('Connected to WebSocket server.');
    };
    ws.current.onmessage = (event) => {
      setChatHistory(prevChatHistory => {
        const updatedHistory = [...prevChatHistory];
        updatedHistory[updatedHistory.length - 1].chatbot = event.data;
        return updatedHistory;
      });
    };
    ws.current.onclose = () => {
      console.log('Disconnected from WebSocket server.');
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
    <div className="fixed bottom-1 right-1 m-4">
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold text-2xl py-2 px-4 rounded-full w-16 h-16"
        onClick={toggleChat}
      >
        {isOpen ? 'X' : <i class="fa-solid fa-comment"></i>}
      </button>
      {isOpen && (
        <div className="flex flex-col justify-between absolute bottom-full right-0 bg-gray-100 p-4 border border-gray-300 rounded-t-lg shadow-lg mb-8 chatSize">
          <div className="chatHistorySize overflow-y-auto mb-4 px-2" ref={chatHistoryRef}>
            {chatHistory.map((message, index) => (
              <div key={index} className="text-gray-700">
                {(message.user || message.chatbot) && (
                  <div>
                    {message.user && (
                      <div className="flex flex-row justify-end mb-3">
                        <p className='bg-blue-400 px-2 py-2 rounded-tl-lg rounded-bl-lg rounded-br-lg text-white'>{message.user}</p>
                        <span className='ml-2'><i className="fa-solid fa-user"></i></span>
                      </div>
                    )}
                    {message.chatbot && (
                      <div className="flex flex-row mb-3">
                        <span className='mr-2'><i className="fa-solid fa-robot"></i></span>
                        <p className='bg-gray-200 px-2 py-2 rounded-tr-lg rounded-bl-lg rounded-br-lg'>{message.chatbot}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
          <form onSubmit={sendMessage}>
            <div className="mb-4 relative">
              <textarea
                className="shadow border rounded w-full py-2 pl-4 pr-11 text-gray-700 focus:outline-none focus:shadow-outline mt-2 resize-none"
                id="message-input"
                placeholder="Type your message here"
                value={message}
                onChange={handleMessageChange}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    sendMessage(e);
                  }
                }}
                style={{ height: "44px", maxHeight: '120px' }}
              >
              </textarea>
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded text-xl absolute bottom-2 right-2" type="submit"><Icon icon="fe:paper-plane" /></button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;
