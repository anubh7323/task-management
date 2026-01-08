"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CreateTaskModal from "@/components/CreateTaskModal";
import TaskCard from "@/components/TaskCard";

export default function DashboardPage() {
    const [tasks, setTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchTasks = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            params.append("page", page.toString());
            params.append("limit", "10");
            if (search) params.append("search", search);
            if (statusFilter) params.append("status", statusFilter);

            const res = await api.get(`/tasks?${params.toString()}`);
            setTasks(res.data.tasks);
            setTotalPages(res.data.totalPages);
        } catch (error) {
            console.error("Failed to fetch tasks", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchTasks();
        }, 300); // debounce search
        return () => clearTimeout(timer);
    }, [page, search, statusFilter]);

    const refreshTasks = () => {
        fetchTasks();
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-4xl font-bold text-white mb-2">My Tasks</h2>
                    <p className="text-gray-400">Manage your daily goals and projects</p>
                </div>
                <Button onClick={() => setIsModalOpen(true)} className="gap-2">
                    <Plus size={18} /> New Task
                </Button>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 bg-white/5 p-4 rounded-xl border border-white/10 backdrop-blur-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <Input
                        placeholder="Search tasks..."
                        className="pl-10 bg-black/20 border-white/5"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    {['ALL', 'PENDING', 'IN_PROGRESS', 'COMPLETED'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status === 'ALL' ? '' : status)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${(status === 'ALL' && !statusFilter) || statusFilter === status
                                    ? "bg-primary text-white"
                                    : "bg-black/20 text-gray-400 hover:text-white"
                                }`}
                        >
                            {status.replace('_', ' ')}
                        </button>
                    ))}
                </div>
            </div>

            {/* Task List */}
            <div className="grid gap-4">
                <AnimatePresence mode="popLayout">
                    {loading ? (
                        <div className="text-center py-20 text-gray-500">Loading tasks...</div>
                    ) : tasks.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-20 text-gray-500 bg-white/5 rounded-2xl border-dashed border-2 border-white/10"
                        >
                            <p>No tasks found.</p>
                            <Button variant="link" onClick={() => setIsModalOpen(true)}>Create one now</Button>
                        </motion.div>
                    ) : (
                        tasks.map((task) => (
                            <TaskCard key={task.id} task={task} onUpdate={refreshTasks} />
                        ))
                    )}
                </AnimatePresence>
            </div>

            {/* Pagination */}
            <div className="flex justify-center gap-2 mt-8">
                <Button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    variant="outline"
                    size="sm"
                >
                    Previous
                </Button>
                <span className="flex items-center px-4 text-sm text-gray-400">
                    Page {page} of {totalPages}
                </span>
                <Button
                    disabled={page >= totalPages}
                    onClick={() => setPage(page + 1)}
                    variant="outline"
                    size="sm"
                >
                    Next
                </Button>
            </div>

            <CreateTaskModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={refreshTasks}
            />
        </div>
    );
}
