import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../utils/prisma';
import { registerSchema, loginSchema, refreshSchema } from '../utils/validation';

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

const generateTokens = (userId: string) => {
    const accessToken = jwt.sign({ userId }, ACCESS_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ userId }, REFRESH_SECRET, { expiresIn: '7d' });
    return { accessToken, refreshToken };
};

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password } = registerSchema.parse(req.body);

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { email, password: hashedPassword },
        });

        const tokens = generateTokens(user.id);
        res.status(201).json(tokens);
    } catch (error) {
        res.status(400).json({ error: 'Invalid input or server error' });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = loginSchema.parse(req.body);

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const tokens = generateTokens(user.id);
        res.json(tokens);
    } catch (error) {
        res.status(400).json({ error: 'Invalid input' });
    }
};

export const refresh = async (req: Request, res: Response) => {
    try {
        const { refreshToken } = refreshSchema.parse(req.body);

        const payload = jwt.verify(refreshToken, REFRESH_SECRET) as { userId: string };
        // In a real app, check if refresh token is in DB/blacklist here

        const tokens = generateTokens(payload.userId);
        res.json(tokens);
    } catch (error) {
        res.status(401).json({ error: 'Invalid refresh token' });
    }
};

export const logout = async (req: Request, res: Response) => {
    // Stateless logout (client discards token). Statefull would add token to blacklist.
    res.json({ message: 'Logged out successfully' });
};
