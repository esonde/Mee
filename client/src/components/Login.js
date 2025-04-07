import React, { useState } from 'react';
import { login } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const [userId, setUserId] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId.trim()) {
      setError("Inserisci un codice identificativo!");
      return;
    }
    try {
      const res = await login(userId);
      if (res.success) {
        onLogin({ userId });
        navigate('/dashboard');
      } else {
        setError("Login fallito");
      }
    } catch (err) {
      setError("Errore durante il login");
    }
  };

  return (
    <div className="login-container">
      <h2>Accedi</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Codice identificativo" 
          value={userId} 
          onChange={(e) => setUserId(e.target.value)} 
          className="input-field"
        />
        <button type="submit" className="primary-button">Accedi</button>
      </form>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default Login;
