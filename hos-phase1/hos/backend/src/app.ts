import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes';
import studentRoutes from './routes/studentRoutes';
import wardenRoutes from './routes/wardenRoutes';
import { notFoundHandler, errorHandler } from './middleware/errorHandler';

dotenv.config();

export const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ success: true, data: { status: 'ok' } }));

app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/warden', wardenRoutes);

app.use(notFoundHandler);
app.use(errorHandler);
