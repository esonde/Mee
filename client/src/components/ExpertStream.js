// client/src/components/ExpertStream.js
import React, { useEffect, useState } from 'react';
import socket from '../services/socket';
import { useParams } from 'react-router-dom';

const ExpertStream = ({ user, prompt }) => {
  const { expertRole } = useParams(); // supponendo che l'URL contenga il ruolo
  const [streamMessages, setStreamMessages] = useState([]);
  const room = `stream-${user.userId}-${expertRole}`;

  useEffect(() => {
    socket.emit("joinStream", room);
    socket.on("streamData", (data) => {
      setStreamMessages(prev => [...prev, data]);
    });
    socket.on("streamError", (errMsg) => {
      setStreamMessages(prev => [...prev, { error: errMsg }]);
    });
    socket.on("streamEnd", (msg) => {
      setStreamMessages(prev => [...prev, { info: msg }]);
    });
    return () => {
      socket.off("streamData");
      socket.off("streamError");
      socket.off("streamEnd");
    };
  }, [room]);

  return (
    <div>
      <h2>Streaming per {expertRole}</h2>
      <div>
        {streamMessages.map((msg, index) => (
          <div key={index}>
            {msg.error ? <p style={{color: 'red'}}>{msg.error}</p> :
             msg.info ? <p style={{color: 'green'}}>{msg.info}</p> :
             <pre>{JSON.stringify(msg, null, 2)}</pre>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpertStream;
