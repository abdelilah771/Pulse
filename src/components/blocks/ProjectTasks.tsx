"use client";

import { useTransition, useRef, useState, useEffect } from "react";
import { Plus, GripVertical, Check, Circle, Clock, MessageSquare, Flame, MapPin } from "lucide-react";
import { addProjectTask as createTask, toggleProjectTask as toggleTaskStatus } from "@/actions/projects.actions";
import toast from "react-hot-toast";

interface Task {
    id: string;
    text: string;
    done: boolean;
    dateStr: string;
    description: string | null;
    projectId: string | null;
    timeSlot: string;
    priority: string;
    type: string;
}

export default function ProjectTasks({ projectId, initialTasks }: { projectId: string; initialTasks: Task[] }) {
    const [tasks, setTasks] = useState<Task[]>(initialTasks);
    const [isPending, startTransition] = useTransition();
    const formRef = useRef<HTMLFormElement>(null);

    // Keep state in sync if initialTasks changes
    useEffect(() => {
        setTasks(initialTasks);
    }, [initialTasks]);

    const handleCreateTask = async (formData: FormData) => {
        const text = formData.get("text") as string;
        if (!text || !text.trim()) return;
        formData.append("projectId", projectId);

        const today = new Date().toISOString().split('T')[0];
        formData.append("dateStr", today);

        const tempId = `temp-${Date.now()}`;
        const newTask: Task = {
            id: tempId,
            text,
            done: false,
            dateStr: today,
            description: null,
            projectId,
            timeSlot: "morning",
            priority: "medium",
            type: "learn"
        };

        setTasks(prev => [newTask, ...prev]);
        formRef.current?.reset();

        startTransition(async () => {
            const result = await createTask(formData);
            if (result?.error) {
                toast.error(result.error);
                setTasks(prev => prev.filter(t => t.id !== tempId));
            } else {
                toast.success("Tâche ajoutée au projet");
            }
        });
    };

    const handleToggle = (taskId: string, currentStatus: boolean, tempId?: boolean) => {
        if (tempId) return;

        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, done: !currentStatus } : t));

        startTransition(async () => {
            const formData = new FormData();
            formData.append("taskId", taskId);
            formData.append("done", (!currentStatus).toString());
            const result = await toggleTaskStatus(formData);
            if (result?.error) {
                toast.error(result.error);
                setTasks(prev => prev.map(t => t.id === taskId ? { ...t, done: currentStatus } : t));
            }
        });
    };

    const completedCount = tasks.filter(t => t.done).length;
    const progress = tasks.length === 0 ? 0 : Math.round((completedCount / tasks.length) * 100);

    return (
        <div className="flex flex-col h-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header & Progress */}
            <div className="glass-card p-6 rounded-2xl border border-black/5 dark:border-white/5 relative overflow-hidden group">
                <div className="absolute -right-12 -top-12 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all"></div>
                <div className="flex justify-between items-end mb-4">
                    <div>
                        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                            <Check className="w-5 h-5 text-emerald-500" /> Vos Tâches
                        </h2>
                        <p className="text-sm text-slate-500 mt-1">Gérez le backlog de ce projet.</p>
                    </div>
                    <div className="text-right">
                        <span className="text-2xl font-black text-emerald-500">{progress}%</span>
                    </div>
                </div>
                <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${progress}%` }}></div>
                </div>
            </div>

            {/* Creation Form */}
            <form ref={formRef} action={handleCreateTask} className="flex gap-3">
                <div className="relative flex-1 group">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                        <Plus className="w-5 h-5" />
                    </div>
                    <input
                        type="text"
                        name="text"
                        placeholder="Créer une nouvelle tâche..."
                        className="w-full bg-white dark:bg-[#15202b] border border-black/10 dark:border-white/10 shadow-sm rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent text-slate-900 dark:text-white placeholder:text-slate-400 font-medium transition-all"
                        required
                        disabled={isPending}
                    />
                </div>
                <button
                    type="submit"
                    disabled={isPending}
                    className="shrink-0 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 transition-all disabled:opacity-50 flex items-center gap-2"
                >
                    {isPending ? "Ajout..." : "Ajouter"}
                </button>
            </form>

            {/* Task List */}
            <div className="flex-1 overflow-y-auto space-y-3 pb-8 scroll-smooth pr-2">
                {tasks.length === 0 ? (
                    <div className="glass-card rounded-2xl flex flex-col items-center justify-center py-16 text-center border-dashed border border-black/10 dark:border-white/10">
                        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                            <Check className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                        </div>
                        <h3 className="text-slate-900 dark:text-white font-medium">Liste vide</h3>
                        <p className="text-slate-500 text-sm mt-1 max-w-xs">Gérez vos objectifs en créant votre première tâche ci-dessus.</p>
                    </div>
                ) : (
                    tasks.map((task) => (
                        <div
                            key={task.id}
                            className={`group relative flex items-center gap-4 p-4 glass-card border rounded-2xl transition-all duration-300 hover:shadow-lg ${task.done
                                    ? "border-emerald-500/20 bg-emerald-500/5 opacity-70"
                                    : "border-black/5 dark:border-white/5 hover:border-black/10 dark:hover:border-white/10"
                                }`}
                        >
                            <button
                                type="button"
                                disabled={task.id.startsWith('temp-')}
                                onClick={() => handleToggle(task.id, task.done, task.id.startsWith('temp-'))}
                                className={`shrink-0 flex items-center justify-center w-7 h-7 rounded-full border-2 transition-all ${task.done
                                        ? "bg-emerald-500 border-emerald-500 text-white scale-110 shadow-md shadow-emerald-500/20"
                                        : "border-slate-300 dark:border-slate-600 text-transparent hover:border-emerald-500 disabled:opacity-50"
                                    }`}
                            >
                                {task.done ? <Check className="w-4 h-4" /> : <div className="w-2.5 h-2.5 rounded-full" />}
                            </button>

                            <div className="flex-1 min-w-0 pr-8">
                                <p className={`text-[15px] font-medium transition-all ${task.done ? "text-slate-500 line-through decoration-slate-400/50" : "text-slate-900 dark:text-white"}`}>
                                    {task.text}
                                </p>
                            </div>

                            <div className="absolute right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Clock className="w-4 h-4 text-slate-300 dark:text-slate-600" />
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
