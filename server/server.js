import express from 'express';
import http from 'http';
import { Server as SocketIO } from 'socket.io';
import cors from 'cors';
import bodyParser from 'body-parser';

import authRoutes from './routes/auth.js';
import questionnaireRoutes from './routes/questionnaire.js';
import settingsRoutes from './routes/settings.js';
import expertRoutes from './routes/expert.js';
import { streamExpertResponse } from './utils/openaiHelper.js';
import { defaultRoles } from './config/roles.js';
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
app.use('/api/auth', authRoutes);
app.use('/api/questionnaire', questionnaireRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/expert', expertRoutes);

// Socket.IO per lo streaming della risposta di OpenAI
io.on('connection', (socket) => {
  console.log('Client connesso:', socket.id);
  
  // Listener per unirsi a una room specifica
  socket.on("joinRoom", ({ room }) => {
    socket.join(room);
    console.log(`Socket ${socket.id} joined room ${room}`);
  });
  
  // Ascolta l'evento "promptToExpert" inviato dal client
  socket.on('promptToExpert', async ({ userId, role, prompt, room }) => {
    console.log(`Richiesta streaming per utente ${userId} per ruolo ${role} con prompt: ${prompt}`);
    const targetRoom = room || `stream-${userId}-${role}`;
    socket.join(targetRoom);
    
    await streamExpertResponse(
      role,
      prompt,
      (chunk) => {
        io.to(targetRoom).emit('expertChunk', { role, chunk });
      },
      () => {
        io.to(targetRoom).emit('expertDone', { role });
      },
      (error) => {
        io.to(targetRoom).emit('expertError', { role, error: error.message });
      }
    );
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnesso:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server in ascolto sulla porta ${PORT}`);
});
