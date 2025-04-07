import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import { getExpertData } from '../services/api';

const ExpertProfile = ({ user }) => {
  const { name } = useParams();
  const navigate = useNavigate();
  const [expertData, setExpertData] = useState({ description: '', notebooks: [] });

  useEffect(() => {
    const fetchExpertData = async () => {
      try {
        const res = await getExpertData(user.userId, name);
        setExpertData(res);
      } catch (err) {
        console.error("Errore nel recupero dei dati dell'esperto:", err);
      }
    };
    fetchExpertData();
  }, [user, name]);

  return (
    <>
      <Header user={user} onLogout={() => navigate('/login')} />
      <div className="dashboard-container">
        <Sidebar />
        <div className="content">
          <button onClick={() => navigate('/dashboard')} className="back-button">← Torna al Questionario</button>
          <h2>{name}</h2>
          {expertData.description ? <p>{expertData.description}</p> : <p>Nessuna descrizione disponibile.</p>}
          <h3>Taccuino</h3>
          {expertData.notebooks && expertData.notebooks.length > 0 ? (
            expertData.notebooks.map((session, idx) => (
              <div key={idx} className="notebook-session">
                <h4>{session.title}</h4>
                <ul>
                  {session.entries.map((entry, i) => (
                    <li key={i}>{entry}</li>
                  ))}
                </ul>
              </div>
            ))
          ) : (
            <p>Nessun appunto disponibile.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default ExpertProfile;
