// client/src/components/ExpertChat.js
import React, { useState, useEffect } from 'react';
import socket from '../services/socket';
import Header from './Header';
import Sidebar from './Sidebar';
import { useNavigate } from 'react-router-dom';

const ExpertChat = ({ user }) => {
  const [messages, setMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Assicurati che il client si unisca alla room globale per la chat degli esperti
    socket.emit("joinStream", `chat-${user.userId}`);
    socket.on("chatMessage", (data) => {
      setMessages(prev => [...prev, data]);
    });
    return () => {
      socket.off("chatMessage");
    };
  }, [user]);

  const filteredMessages = messages.filter(msg =>
    msg.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (msg.sessionNumber && msg.sessionNumber.toString().includes(searchTerm))
  );

  return (
    <>
      <Header user={user} onLogout={() => navigate('/login')} />
      <div className="dashboard-container">
        <Sidebar user={user} />
        <div className="content">
          <button onClick={() => navigate('/dashboard')} className="back-button">
            ← Torna alla Dashboard
          </button>
          <h2>Chat degli Esperti</h2>
          <input
            type="text"
            placeholder="Cerca per parole chiave o numero sessione..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field"
          />
          <div className="chat-container" style={{overflowY: 'scroll', flexDirection: 'column-reverse'}}>
            {filteredMessages.map((msg, index) => (
              <div key={index} className="chat-message" style={{
                background: getSessionColor(msg.sessionNumber),
                padding: '10px',
                borderRadius: '5px',
                marginBottom: '10px'
              }}>
                <strong>{msg.role}:</strong> {msg.text}
                <div style={{ fontSize: '0.8rem', color: '#666' }}>
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

function getSessionColor(sessionNumber) {
  // Genera uno sfondo differente per sessione; per esempio:
  const colors = ['#fafafa', '#f0f8ff', '#f5f5dc', '#e6e6fa', '#fffacd'];
  if (!sessionNumber) return '#fafafa';
  return colors[(sessionNumber - 1) % colors.length];
}

export default ExpertChat;
