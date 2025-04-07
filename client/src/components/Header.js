import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = ({ user, onLogout }) => {
  const navigate = useNavigate();
  return (
    <div className="header">
      <h1>Questionario AI</h1>
      <div className="navbar">
        <span>{user.userId}</span>
        <button onClick={() => navigate('/settings')}>Impostazioni</button>
        <button onClick={onLogout}>Logout</button>
      </div>
    </div>
  );
};

export default Header;
