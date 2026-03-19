import { io, Socket } from 'socket.io-client';

const TEMP_USER_ID = '69b9adf10f9a5013de84ad64';

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io('http://localhost:5000', {
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      console.log('🔌 Socket connecté');
      // S'enregistrer avec le userId
      socket!.emit('register', TEMP_USER_ID);
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