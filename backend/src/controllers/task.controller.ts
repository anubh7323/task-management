import { Response } from 'express';
import prisma from '../utils/prisma';
import { taskSchema } from '../utils/validation';
import { AuthRequest } from '../middlewares/auth.middleware';

export const getTasks = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.userId;
        const { page = 1, limit = 10, status, search } = req.query;

        const skip = (Number(page) - 1) * Number(limit);
        const where: any = { userId };

        if (status) where.status = status;
        if (search) where.title = { contains: String(search), mode: 'insensitive' }; // Case insensitive search

        const tasks = await prisma.task.findMany({
            where,
            skip,
            take: Number(limit),
            orderBy: { createdAt: 'desc' },
        });

        const total = await prisma.task.count({ where });

        res.json({ tasks, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

export const createTask = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.userId;
        const data = taskSchema.parse(req.body);

        const task = await prisma.task.create({
            data: { ...data, userId },
        });

        res.status(201).json(task);
    } catch (error) {
        res.status(400).json({ error: 'Invalid input' });
    }
};

export const getTask = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.userId;
        const { id } = req.params;

        const task = await prisma.task.findFirst({
            where: { id, userId },
        });

        if (!task) return res.status(404).json({ error: 'Task not found' });

        res.json(task);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

export const updateTask = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.userId;
        const { id } = req.params;
        const data = taskSchema.partial().parse(req.body);

        const task = await prisma.task.findFirst({ where: { id, userId } });
        if (!task) return res.status(404).json({ error: 'Task not found' });

        const updatedTask = await prisma.task.update({
            where: { id },
            data,
        });

        res.json(updatedTask);
    } catch (error) {
        res.status(400).json({ error: 'Invalid input' });
    }
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.userId;
        const { id } = req.params;

        const task = await prisma.task.findFirst({ where: { id, userId } });
        if (!task) return res.status(404).json({ error: 'Task not found' });

        await prisma.task.delete({ where: { id } });

        res.json({ message: 'Task deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

export const toggleTaskStatus = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.userId;
        const { id } = req.params;

        const task = await prisma.task.findFirst({ where: { id, userId } });
        if (!task) return res.status(404).json({ error: 'Task not found' });

        const newStatus = task.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
        const updatedTask = await prisma.task.update({
            where: { id },
            data: { status: newStatus },
        });

        res.json(updatedTask);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
}
