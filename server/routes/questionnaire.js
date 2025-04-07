// server/routes/questionnaire.js
import express from 'express';
import fs from 'fs';
import path from 'path';
import dataManager from '../utils/dataManager.js';

const router = express.Router();

function getSessionsFilePath(userId) {
  const userPath = path.join(process.cwd(), 'users', userId);
  if (!fs.existsSync(userPath)) {
    fs.mkdirSync(userPath, { recursive: true });
  }
  return path.join(userPath, 'questionnaire_sessions.json');
}

// GET: restituisce il questionario corrente
router.get('/', (req, res) => {
  const questionnaire = dataManager.getQuestionnaire();
  res.json({ questionnaire });
});

// POST: riceve le risposte al questionario e salva la sessione (includendo le domande)
router.post('/answers', (req, res) => {
  const { userId, answers, questionnaire } = req.body;
  if (!userId || !answers || !questionnaire) {
    return res.status(400).json({ error: "userId, answers e questionnaire sono richiesti" });
  }
  
  let sessionsFile = getSessionsFilePath(userId);
  let sessions = [];
  if (fs.existsSync(sessionsFile)) {
    try {
      sessions = JSON.parse(fs.readFileSync(sessionsFile, 'utf8'));
    } catch (err) {
      sessions = [];
    }
  }
  const sessionNumber = sessions.length + 1;
  const sessionTitle = `Sessione ${sessionNumber} - Gli imprevisti`;
  const newSession = {
    sessionTitle,
    answers,         // { "0": val, "1": val, ... }
    questionnaire,   // array con le domande, es. [{ text: "..." }, ...]
    timestamp: new Date().toISOString()
  };
  sessions.push(newSession);
  fs.writeFileSync(sessionsFile, JSON.stringify(sessions, null, 2), 'utf8');

  console.log(`Sessione salvata per ${userId}:`, newSession);
  res.json({ success: true });
});

// GET: recupera tutte le sessioni per un utente
router.get('/sessions', (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ error: "UserId richiesto" });
  const sessionsFile = getSessionsFilePath(userId);
  let sessions = [];
  if (fs.existsSync(sessionsFile)) {
    try {
      sessions = JSON.parse(fs.readFileSync(sessionsFile, 'utf8'));
    } catch (err) {
      sessions = [];
    }
  }
  res.json({ sessions });
});

export default router;
