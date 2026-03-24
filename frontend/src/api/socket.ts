import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

const getUserIdFromToken = (): string | null => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.id || payload._id || payload.userId || null;
  } catch {
    return null;
  }
};

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io('http://localhost:5000', {
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      console.log('🔌 Socket connecté');
      const userId = getUserIdFromToken();
      if (userId) {
        socket!.emit('register', userId);
      }
    });

    socket.on('disconnect', () => {
      console.log('❌ Socket déconnecté');
    });
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

