"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Clock, Trash2, Edit2, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useState } from "react";
import CreateTaskModal from "./CreateTaskModal";

export default function TaskCard({ task, onUpdate }: { task: any, onUpdate: () => void }) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const handleDelete = async () => {
        if (!confirm("Are you sure?")) return;
        setIsDeleting(true);
        try {
            await api.delete(`/tasks/${task.id}`);
            toast.success("Task deleted");
            onUpdate();
        } catch (error) {
            toast.error("Failed to delete task");
        } finally {
            setIsDeleting(false);
        }
    };

    const handleToggle = async () => {
        try {
            await api.patch(`/tasks/${task.id}/toggle`);
            onUpdate();
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "COMPLETED": return "text-green-500 bg-green-500/10 border-green-500/20";
            case "IN_PROGRESS": return "text-blue-500 bg-blue-500/10 border-blue-500/20";
            default: return "text-orange-500 bg-orange-500/10 border-orange-500/20";
        }
    };

    return (
        <>
            <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                whileHover={{ y: -2 }}
                className="bg-card border border-white/5 rounded-xl p-6 shadow-sm hover:shadow-md hover:border-primary/20 transition-all group"
            >
                <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <h3 className={`font-semibold text-lg ${task.status === 'COMPLETED' ? 'line-through text-gray-500' : 'text-white'}`}>
                                {task.title}
                            </h3>
                            <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${getStatusColor(task.status)}`}>
                                {task.status.replace('_', ' ')}
                            </span>
                        </div>
                        {task.description && (
                            <p className="text-gray-400 text-sm mb-4 line-clamp-2">{task.description}</p>
                        )}

                        <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>Created {new Date(task.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>

                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={handleToggle}
                            title="Toggle Status"
                            className={task.status === 'COMPLETED' ? 'text-orange-400' : 'text-green-400'}
                        >
                            {task.status === 'COMPLETED' ? <Clock size={18} /> : <CheckCircle2 size={18} />}
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setIsEditModalOpen(true)}>
                            <Edit2 size={18} className="text-blue-400" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={handleDelete} disabled={isDeleting}>
                            <Trash2 size={18} className="text-red-400" />
                        </Button>
                    </div>
                </div>
            </motion.div>

            <CreateTaskModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSuccess={onUpdate}
                taskToEdit={task}
            />
        </>
    );
}
