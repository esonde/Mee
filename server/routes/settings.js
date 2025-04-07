// server/routes/settings.js
import express from 'express';
import settingsManager from '../utils/settingsManager.js';

const router = express.Router();

router.get('/', (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ error: "UserId richiesto" });
  const settings = settingsManager.getSettings(userId);
  res.json(settings);
});

router.post('/', (req, res) => {
  const { userId, settings } = req.body;
  if (!userId || !settings) return res.status(400).json({ error: "UserId e settings richiesti" });
  settingsManager.updateSettings(userId, settings);
  res.json({ success: true });
});

export default router;
