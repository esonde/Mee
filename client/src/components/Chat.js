import React from 'react';

const Chat = ({ messages }) => {
  return (
    <div>
      <h2>Discussione Live</h2>
      <div className="chat-container">
        {messages.map((msg, index) => (
          <div key={index} className="chat-message">
            <strong>{msg.role}:</strong> {msg.response.chat.message}
            <div style={{ fontSize: '0.8rem', color: '#666' }}>
              {new Date(msg.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Chat;
