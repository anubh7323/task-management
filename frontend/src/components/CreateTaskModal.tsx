"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const taskSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED"]).optional(),
});

type TaskFormValues = z.infer<typeof taskSchema>;

interface CreateTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    taskToEdit?: any;
}

export default function CreateTaskModal({ isOpen, onClose, onSuccess, taskToEdit }: CreateTaskModalProps) {
    const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<TaskFormValues>({
        resolver: zodResolver(taskSchema),
    });

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (taskToEdit) {
            setValue("title", taskToEdit.title);
            setValue("description", taskToEdit.description);
            setValue("status", taskToEdit.status);
        } else {
            reset({ title: "", description: "", status: "PENDING" });
        }
    }, [taskToEdit, isOpen, reset, setValue]);

    const onSubmit = async (data: TaskFormValues) => {
        try {
            if (taskToEdit) {
                await api.patch(`/tasks/${taskToEdit.id}`, data);
                toast.success("Task updated");
            } else {
                await api.post("/tasks", data);
                toast.success("Task created");
            }
            onSuccess();
            onClose();
            reset();
        } catch (error) {
            toast.error("Something went wrong");
        }
    };

    if (!mounted) return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full max-w-lg p-6 bg-[#121212] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">{taskToEdit ? "Edit Task" : "New Task"}</h2>
                            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400">Title</label>
                                <Input {...register("title")} placeholder="What needs to be done?" />
                                {errors.title && <p className="text-red-500 text-xs">{errors.title.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400">Description</label>
                                <textarea
                                    {...register("description")}
                                    className="flex min-h-[100px] w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 text-foreground resize-none"
                                    placeholder="Add some details..."
                                />
                            </div>

                            {taskToEdit && (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-400">Status</label>
                                    <select
                                        {...register("status")}
                                        className="flex h-10 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary text-foreground"
                                    >
                                        <option value="PENDING">Pending</option>
                                        <option value="IN_PROGRESS">In Progress</option>
                                        <option value="COMPLETED">Completed</option>
                                    </select>
                                </div>
                            )}

                            <div className="flex justify-end gap-3 mt-6">
                                <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? "Saving..." : (taskToEdit ? "Save Changes" : "Create Task")}
                                </Button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    );
}
