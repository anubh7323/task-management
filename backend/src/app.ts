import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { PrismaClient } from '@prisma/client';

export const app = express();
export const prisma = new PrismaClient();

import authRoutes from './routes/auth.routes';
import taskRoutes from './routes/task.routes';

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'Task Management API is running' });
});
