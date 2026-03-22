import { Server } from 'socket.io';

let ioInstance: Server | null = null;

export const initSocket = (io: Server) => {
  ioInstance = io;
  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);
    
    // Clients can join a room based on assignment ID to get specific updates
    socket.on('join-job', (assignmentId: string) => {
      socket.join(assignmentId);
      console.log(`Socket ${socket.id} joined room: ${assignmentId}`);
    });

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });
};

export const getIO = (): Server => {
  if (!ioInstance) {
    throw new Error('Socket.io not initialized!');
  }
  return ioInstance;
};
