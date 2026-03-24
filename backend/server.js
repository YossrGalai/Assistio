const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');

dotenv.config();

const app = express();
const server = http.createServer(app);

//  CORS 
const allowedOrigins = (process.env.FRONTEND_URLS || 'http://localhost:5173,http://127.0.0.1:5173')
  .split(',')
  .map(o => o.trim())
  .filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));
app.use(express.json());

// SOCKET.IO 
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Rendre io accessible dans les routes via req.app.get('io')
app.set('io', io);



app.use('/api/auth', require('./routes/auth'));
app.use('/api/requests', require('./routes/requests'));
app.use('/api/users', require('./routes/users'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/request-detail', require('./routes/requestDetail'));

// Start server
const PORT = process.env.PORT ||  5000;

// Socket.io — gestion des connexions
io.on('connection', (socket) => {
  console.log(`🔌 Client connecté: ${socket.id}`);

  socket.on('register', (userId) => {
    if (!userId) return;
    socket.join(userId.toString());
    console.log(`👤 User ${userId} rejoint sa room`);
  });

  socket.on('disconnect', () => {
    console.log(`❌ Client déconnecté: ${socket.id}`);
  });
});

//  MONGODB 
mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI, { dbName: 'Assistio' })
  .then(() => {
    console.log('✅ MongoDB connecté');
    // Supprimer l'index géospatial si existant
    return mongoose.connection.collection('requests').dropIndex('location_2dsphere')
      .catch(() => {}); // silencieux si n'existe pas
  })
  .catch((err) => console.error('❌ Erreur MongoDB :', err.message));

//  ROUTES 
app.use('/api/auth', require('./routes/auth'));
app.use('/api/requests', require('./routes/requests'));
app.use('/api/users', require('./routes/users'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/request-detail', require('./routes/requestDetail'));
app.use('/api/upload', require('./routes/upload'));

//  START 
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});
