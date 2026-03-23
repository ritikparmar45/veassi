import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db';
import assignmentRoutes from './routes/assignmentRoutes';
import authRoutes from './routes/authRoutes';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { initSocket } from './services/socketService';
import './workers/assignmentWorker'; // Import to start the background worker process

dotenv.config();

const app = express();
const httpServer = createServer(app);

// Connect to MongoDB
const startServer = async () => {
  try {
    await connectDB();
    
    // Initialize Socket.io (now that we have a real HTTP server)
    const io = new Server(httpServer, {
      cors: {
        origin: '*', // Adjust for production security
        methods: ['GET', 'POST']
      }
    });
    initSocket(io);

    app.use(cors());
    app.use(express.json());

    // Routes
    app.use('/api/auth', authRoutes);
    app.use('/api/assignment', assignmentRoutes);

    // Health check
    app.get('/', (req, res) => res.send('VedaAI Backend Running'));

    const PORT = process.env.PORT || 5000;

    // IMPORTANT: Listen on httpServer, not app, and specify '0.0.0.0' for Render
    httpServer.listen(Number(PORT), '0.0.0.0', () => {
      console.log(`✓ Server running on port ${PORT}`);
      console.log(`✓ Health check available at http://0.0.0.0:${PORT}/`);
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
