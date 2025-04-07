// client/src/App.js
import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Settings from './components/Settings';
import ExpertProfile from './components/ExpertProfile';
import SessionReview from './components/SessionReview';
import ExpertChat from './components/ExpertChat';



function App() {
  const [user, setUser] = useState(null);

  return (
    <Routes>
      <Route path="/login" element={<Login onLogin={(user) => setUser(user)} />} />
      <Route path="/dashboard/*" element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} />
      <Route path="/settings" element={user ? <Settings user={user} /> : <Navigate to="/login" />} />
      <Route path="/expert/:name" element={user ? <ExpertProfile user={user} /> : <Navigate to="/login" />} />
      <Route path="/sessions" element={user ? <SessionReview user={user} /> : <Navigate to="/login" />} />
      <Route path="/chat" element={user ? <ExpertChat user={user} /> : <Navigate to="/login" />} />

      <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
    </Routes>
  );
}

export default App;
