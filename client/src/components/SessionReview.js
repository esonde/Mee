// client/src/components/SessionReview.js
import React, { useState, useEffect } from 'react';
import { getSessions } from '../services/api';
import Header from './Header';
import Sidebar from './Sidebar';
import { useNavigate } from 'react-router-dom';

const SessionReview = ({ user }) => {
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await getSessions(user.userId);
        if (res.sessions) setSessions(res.sessions);
      } catch (err) {
        console.error("Errore nel recupero delle sessioni:", err);
      }
    };
    fetchSessions();
  }, [user]);

  const handleSessionSelect = (e) => {
    const index = e.target.value;
    if (index === "") {
      setSelectedSession(null);
    } else {
      setSelectedSession(sessions[index]);
    }
  };

  // Filtro per parole chiave o numero di sessione
  const filteredSessions = sessions.filter(session => {
    return (
      session.sessionTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.timestamp.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <>
      <Header user={user} onLogout={() => navigate('/login')} />
      <div className="dashboard-container">
        <Sidebar />
        <div className="content">
          <button onClick={() => navigate('/dashboard')} className="back-button">
            ← Torna alla Dashboard
          </button>
          <h2>Riepilogo Sessioni Questionario</h2>
          <div style={{ marginBottom: "15px" }}>
            <input
              type="text"
              placeholder="Cerca per sessione o parola chiave..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label>Seleziona una sessione: </label>
            <select onChange={handleSessionSelect} defaultValue="">
              <option value="">-- Seleziona --</option>
              {filteredSessions.map((session, index) => (
                <option key={index} value={index}>
                  {session.sessionTitle} ({new Date(session.timestamp).toLocaleString()})
                </option>
              ))}
            </select>
          </div>
          {selectedSession && (
            <div className="session-details" style={{
              background: `linear-gradient(135deg, #fefefe, ${indexToColor(selectedSession)})`,
              padding: "15px",
              borderRadius: "8px",
              marginTop: "20px"
            }}>
              <h3>{selectedSession.sessionTitle}</h3>
              <p><strong>Data:</strong> {new Date(selectedSession.timestamp).toLocaleString()}</p>
              <h4>Domande e Risposte</h4>
              {selectedSession.questionnaire && selectedSession.questionnaire.length > 0 ? (
                selectedSession.questionnaire.map((q, idx) => (
                  <div key={idx} className="question-item">
                    <p><strong>Domanda:</strong> {q.text}</p>
                    <p><strong>Risposta:</strong> {selectedSession.answers[idx]}</p>
                  </div>
                ))
              ) : (
                <p>Nessun questionario registrato per questa sessione.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

// Funzione helper per generare una sfumatura in base all'indice della sessione
function indexToColor(session) {
  // Puoi personalizzare questa funzione in base a come vuoi differenziare le sessioni
  // Per esempio, usa un array di colori predefiniti:
  const colors = ['#fafafa', '#f0f8ff', '#f5f5dc', '#e6e6fa', '#fffacd'];
  // Utilizza l'indice modulo il numero di colori
  // Se non hai l'indice, potresti basarti sulla lunghezza dello storico o sul timestamp.
  const index = Math.floor(Math.random() * colors.length);
  return colors[index];
}

export default SessionReview;
