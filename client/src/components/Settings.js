// client/src/components/Settings.js
import React, { useState, useEffect } from 'react';
import { getUserSettings, updateUserSettings } from '../services/api';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

const Settings = ({ user }) => {
  // Imposta uno stato iniziale con globalPrompt vuoto e experts come array vuoto
  const [settings, setSettings] = useState({ globalPrompt: '', experts: [] });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await getUserSettings(user.userId);
        // Se res.experts non esiste, usiamo un array vuoto
        setSettings({ 
          globalPrompt: res.globalPrompt || '', 
          experts: res.experts || [] 
        });
      } catch (err) {
        console.error("Errore nel recupero delle impostazioni:", err);
      }
    };
    fetchSettings();
  }, [user]);

  const handleGlobalPromptChange = (e) => {
    setSettings(prev => ({ ...prev, globalPrompt: e.target.value }));
  };

  const handleExpertChange = (index, field, value) => {
    const updatedExperts = (settings.experts || []).map((exp, idx) =>
      idx === index ? { ...exp, [field]: value } : exp
    );
    setSettings(prev => ({ ...prev, experts: updatedExperts }));
  };

  const handleAddExpert = () => {
    setSettings(prev => ({
      ...prev,
      experts: [...(prev.experts || []), { name: '', description: '' }]
    }));
  };

  const handleDeleteExpert = (index) => {
    const updatedExperts = (settings.experts || []).filter((_, idx) => idx !== index);
    setSettings(prev => ({ ...prev, experts: updatedExperts }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await updateUserSettings(user.userId, settings);
      if (res.success) {
        setMessage("Impostazioni aggiornate con successo");
      } else {
        setMessage("Errore nell'aggiornamento delle impostazioni");
      }
    } catch (err) {
      console.error(err);
      setMessage("Errore nell'aggiornamento delle impostazioni");
    }
  };

  return (
    <>
      <Header user={user} onLogout={() => navigate('/login')} />
      <div className="dashboard-container">
        <Sidebar />
        <div className="content settings-container">
          <button onClick={() => navigate('/dashboard')} className="back-button">
            ← Torna alla Dashboard
          </button>
          <h2>Impostazioni di Sistema</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label>Prompt Globale:</label>
              <textarea
                value={settings.globalPrompt}
                onChange={handleGlobalPromptChange}
                className="input-field"
              />
            </div>
            <h3>Gestione Esperti</h3>
            {(settings.experts || []).map((expert, index) => (
              <div key={index} className="expert-item">
                <input
                  type="text"
                  placeholder="Nome esperto"
                  value={expert.name}
                  onChange={(e) => handleExpertChange(index, 'name', e.target.value)}
                  className="input-field"
                />
                <input
                  type="text"
                  placeholder="Descrizione esperto"
                  value={expert.description}
                  onChange={(e) => handleExpertChange(index, 'description', e.target.value)}
                  className="input-field"
                />
                <button
                  type="button"
                  onClick={() => handleDeleteExpert(index)}
                  className="secondary-button"
                >
                  Elimina
                </button>
              </div>
            ))}
            <button type="button" onClick={handleAddExpert} className="secondary-button">
              Aggiungi Esperto
            </button>
            <button type="submit" className="primary-button">
              Salva Impostazioni
            </button>
          </form>
          {message && <div className="info-message">{message}</div>}
        </div>
      </div>
    </>
  );
};

export default Settings;
