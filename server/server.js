// server/server.js (ESM)
import express from 'express';
import http from 'http';
import { Server as SocketIO } from 'socket.io';
import cors from 'cors';
import bodyParser from 'body-parser';

import authRoutes from './routes/auth.js';
import questionnaireRoutes from './routes/questionnaire.js';
import settingsRoutes from './routes/settings.js';
import expertRoutes from './routes/expert.js';

import { defaultRoles } from './config/roles.js';
import { simulateExpertResponse } from './utils/openaiHelper.js';
import dataManager from './utils/dataManager.js';

const app = express();
const server = http.createServer(app);
const io = new SocketIO(server, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});

// Middleware
app.use(cors());
app.use(bodyParser.json());

// API Routes
app.use('/api/expert', expertRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/questionnaire', questionnaireRoutes);
app.use('/api/settings', settingsRoutes);

// Socket.IO per la chat live
io.on('connection', (socket) => {
  console.log('Nuovo client connesso', socket.id);
  socket.join("global");

  // Simula l'invio di messaggi dagli esperti ogni 5 secondi
  const intervalId = setInterval(() => {
    defaultRoles.forEach(role => {
      const prompt = "Discussione live degli esperti";
      const response = simulateExpertResponse(role.name, prompt);
      dataManager.addChatMessage({
        type: "ai",
        role: role.name,
        text: response.response.chat.message,
        tags: response.response.chat.tags,
        timestamp: response.timestamp
      });
      // Invia il messaggio a tutti i client nella room "global"
      io.to("global").emit("newMessage", response);
    });
  }, 5000);

  socket.on('disconnect', () => {
    console.log('Client disconnesso', socket.id);
    clearInterval(intervalId);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server in ascolto sulla porta ${PORT}`);
});
