import React, { useState } from "react";
import { FaRobot } from "react-icons/fa";
import styled from "styled-components";

const Container = styled.div`
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  z-index: 9999;
  display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-end;
`;

const Tooltip = styled.div`
  position: relative;
  background-color: #3b82f6;
  color: white;
  border-radius: 0.375rem;
  padding: 1rem;
  margin-bottom: 1rem;
  cursor: pointer;
`;

const ChatButton = styled.button`
border: none;
  background-color: #3b82f6;
  color: white;
  font-weight: bold;
  font-size: 2rem;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  width: 4rem;
  height: 4rem;
  transition: background-color 0.2s ease;

  &:hover {
    filter: brightness(1.1);
  }

  .icon {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const ChatFrame = styled.iframe`
display: ${props => (props.isOpen ? "block" : "none")};
  width: 100%;
  height: 100%;
  border: none;
  position: fixed;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: rgba(150, 150, 150, 0.2) 0px 10px 30px 0px, rgba(150, 150, 150, 0.2) 0px 0px 0px 1px;
  bottom: 5rem;
  right: 1rem;
  width: 448px;
  height: 85vh;
  max-height: 824px;
  border-radius: 0.75rem;
  display: ${props => (props.isOpen ? "block" : "none")};
  z-index: 999999999;
  overflow: hidden;
  left: unset;
  margin-bottom: 0.75rem;
`;

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [tooltipIsOpen, setTooltipIsOpen] = useState(true);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setTooltipIsOpen(false);
  };

  return (
    <>
             <ChatFrame src={`http://localhost:3000/widget?hostname=${window.location.hostname}`} isOpen={isOpen} />

             <Container>
      {tooltipIsOpen && (
        <Tooltip onClick={toggleChat}>
          <p>Oi! Sou um chat IA.</p>
          <p> Pergunte qualquer coisa.</p>
        </Tooltip>
      )}
      <ChatButton onClick={toggleChat}>
        {isOpen ? (
          "X"
        ) : (
          <div className="icon">
            <FaRobot className="text-3xl" />
          </div>
        )}
      </ChatButton>

      


    </Container>
    </>
   
  );
}

export default App;
