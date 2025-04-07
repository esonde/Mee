// server/routes/expert.js
import express from 'express';
import settingsManager from '../utils/settingsManager.js';

const router = express.Router();

// GET /api/expert?userId=...&expertName=...
router.get('/', (req, res) => {
  const { userId, expertName } = req.query;
  if (!userId || !expertName) {
    return res.status(400).json({ error: "UserId e expertName sono richiesti" });
  }
  const settings = settingsManager.getSettings(userId);
  // Cerca l'esperto nell'array settings.experts
  const expert = settings.experts.find(exp => exp.name === expertName);
  const description = expert ? expert.description : "Nessuna descrizione disponibile.";
  // Attualmente i notebooks sono vuoti; implementa la logica di salvataggio/lettura se necessario
  const notebooks = [];
  res.json({ description, notebooks });
});

export default router;
