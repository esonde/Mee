// client/src/components/Sidebar.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getUserSettings } from '../services/api';

const Sidebar = ({ user }) => {
  const [experts, setExperts] = useState([]);

  useEffect(() => {
    const fetchExperts = async () => {
      try {
        const settings = await getUserSettings(user.userId);
        setExperts(settings.experts || []);
      } catch (err) {
        console.error("Errore nel recupero degli esperti:", err);
      }
    };
    if (user) fetchExperts();
  }, [user]);

  return (
    <div className="sidebar">
      <h3>Esperti</h3>
      <ul className="expert-list">
        {experts.map((expert, index) => (
          <li key={index}>
            <Link to={`/expert/${expert.name}`}>{expert.name}</Link>
          </li>
        ))}
      </ul>
      <hr />
      <Link to="/chat" className="secondary-button" style={{display: 'block', marginTop: '15px', textAlign: 'center'}}>Chat Esperti</Link>
    </div>
  );
};

export default Sidebar;
