// server/routes/auth.js
import express from 'express';
import userManager from '../utils/userManager.js';

const router = express.Router();

router.post('/login', (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: "UserId richiesto" });
  userManager.login(userId);
  res.json({ success: true, userId });
});

router.get('/profile', (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ error: "UserId richiesto" });
  const profile = userManager.getProfile(userId);
  res.json(profile);
});

router.post('/profile', (req, res) => {
  const { userId, profile } = req.body;
  if (!userId || !profile) return res.status(400).json({ error: "UserId e profile richiesti" });
  userManager.updateProfile(userId, profile);
  res.json({ success: true });
});

export default router;
