import { createServer } from 'http';
import express from 'express';
import { initializeRealtimeData } from '../websocket/realtimeDataController.js';

const app = express();
const server = createServer(app);

// Inicializar WebSocket
initializeRealtimeData(server);

server.listen(3001, () => {
  console.log('Servidor WebSocket escuchando en el puerto 3001');
});

export default app;