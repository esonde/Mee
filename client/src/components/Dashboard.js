import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import Questionnaire from './Questionnaire';
import Chat from './Chat';
import socket from '../services/socket';

const Dashboard = ({ user }) => {
  const [messages, setMessages] = useState([]);
  const [showQuestionnaire, setShowQuestionnaire] = useState(true); // potrai gestire questo in base al server
  const navigate = useNavigate();

  useEffect(() => {
    socket.on('newMessage', (data) => {
      setMessages(prev => [...prev, data]);
    });
    return () => {
      socket.off('newMessage');
    };
  }, []);
  
  const handleLogout = () => {
    socket.disconnect();
    navigate('/login');
  };

  return (
    <>
      <Header user={user} onLogout={handleLogout} />
      <div className="dashboard-container">
        <Sidebar />
        <div className="content">
          {showQuestionnaire ? (
            <Questionnaire user={user} />
          ) : (
            <Chat messages={messages} />
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
