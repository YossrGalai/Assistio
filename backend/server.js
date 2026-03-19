const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

// Rendre io accessible dans les routes
app.set('io', io);

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connecté'))
  .catch((err) => console.error('❌ Erreur MongoDB :', err.message));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/requests', require('./routes/requests'));
app.use('/api/users', require('./routes/users'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/request-detail', require('./routes/requestDetail'));

// Socket.io — gestion des connexions
io.on('connection', (socket) => {
  console.log(`🔌 Client connecté: ${socket.id}`);

  // Le client s'enregistre avec son userId
  socket.on('register', (userId) => {
    socket.join(userId);
    console.log(`👤 User ${userId} rejoint sa room`);
  });

  socket.on('disconnect', () => {
    console.log(`❌ Client déconnecté: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});