"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { toast } from 'sonner';

const registerSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
    const { login } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterFormValues) => {
        setIsLoading(true);
        try {
            const res = await api.post('/auth/register', {
                email: data.email,
                password: data.password,
            });
            toast.success('Account created successfully!');
            login(res.data.accessToken, res.data.refreshToken);
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[120px]" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md p-8 rounded-2xl glass-card backdrop-blur-xl border border-white/10 relative z-10"
            >
                <div className="space-y-2 text-center mb-8">
                    <h1 className="text-3xl font-bold tracking-tighter bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                        Create Account
                    </h1>
                    <p className="text-sm text-gray-400">Enter your details to get started</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Input
                            {...register('email')}
                            placeholder="Email"
                            type="email"
                            className={errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}
                        />
                        {errors.email && <p className="text-xs text-red-500 ml-1">{errors.email.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Input
                            {...register('password')}
                            placeholder="Password"
                            type="password"
                            className={errors.password ? "border-red-500 focus-visible:ring-red-500" : ""}
                        />
                        {errors.password && <p className="text-xs text-red-500 ml-1">{errors.password.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Input
                            {...register('confirmPassword')}
                            placeholder="Confirm Password"
                            type="password"
                            className={errors.confirmPassword ? "border-red-500 focus-visible:ring-red-500" : ""}
                        />
                        {errors.confirmPassword && <p className="text-xs text-red-500 ml-1">{errors.confirmPassword.message}</p>}
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "creating account..." : "Sign Up"}
                    </Button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-400">
                    Already have an account?{' '}
                    <Link href="/login" className="text-primary hover:text-primary/80 transition-colors">
                        Login
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
