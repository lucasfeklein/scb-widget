import React, { useState } from "react";
import { FaRobot } from "react-icons/fa";

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [tooltipIsOpen, setTooltipIsOpen] = useState(true);

 
  const toggleChat = () => {
    setIsOpen(!isOpen);
    setTooltipIsOpen(false);
  };

  return (
    <div className="fixed bottom-5 right-5 z-index-9999">
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
          {isOpen ? (
            "X"
          ) : (
            <div className="flex align-center justify-center">
              <FaRobot className="text-3xl" />
            </div>
          )}
        </button>
      </div>
      {isOpen && (
       <iframe src="http://localhost:3000/widget" />
      )}
    </div>
  );
}

export default App;
