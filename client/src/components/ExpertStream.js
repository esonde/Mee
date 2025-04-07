import React, { useEffect, useState } from 'react';
import socket from '../services/socket';
import { useParams } from 'react-router-dom';

const ExpertStream = ({ user }) => {
  const { expertRole } = useParams();
  const [streamMessages, setStreamMessages] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [streaming, setStreaming] = useState(false);

  // Costruisci la room in base a userId e al ruolo dell'esperto
  const room = `stream-${user.userId}-${expertRole}`;

  useEffect(() => {
    // Unisciti alla room specifica
    socket.emit("joinRoom", { room });
    console.log(`Unito alla room: ${room}`);

    // Ascolta gli eventi emessi dal server
    socket.on("expertChunk", (data) => {
      setStreamMessages(prev => [...prev, data.chunk]);
    });
    socket.on("expertError", (data) => {
      setStreamMessages(prev => [...prev, `Error: ${data.error}`]);
      setStreaming(false);
    });
    socket.on("expertDone", (data) => {
      setStreamMessages(prev => [...prev, "Streaming completato."]);
      setStreaming(false);
    });

    return () => {
      socket.off("expertChunk");
      socket.off("expertError");
      socket.off("expertDone");
    };
  }, [room]);

  const handleStartStreaming = () => {
    setStreamMessages([]);
    setStreaming(true);
    // Invia l'evento per iniziare lo streaming, specificando anche userId, ruolo, prompt e room
    socket.emit("promptToExpert", { userId: user.userId, role: expertRole, prompt, room });
  };

  return (
    <div>
      <h2>Streaming per {expertRole}</h2>
      <div>
        <textarea 
          placeholder="Inserisci il prompt per l'esperto..." 
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          style={{ width: '100%', height: '100px' }}
        />
      </div>
      <button onClick={handleStartStreaming} disabled={streaming || prompt.trim() === ""}>
        {streaming ? "Streaming in corso..." : "Avvia Streaming"}
      </button>
      <div style={{ marginTop: '20px', border: '1px solid #ccc', padding: '10px', minHeight: '150px' }}>
        {streamMessages.length > 0 ? (
          streamMessages.map((msg, index) => (
            <div key={index} style={{ marginBottom: '10px' }}>{msg}</div>
          ))
        ) : (
          <p>Qui verrà visualizzato lo streaming...</p>
        )}
      </div>
    </div>
  );
};

export default ExpertStream;
