"use client";

import { useState, useTransition } from "react";
import { Check, MoreHorizontal } from "lucide-react";
import { toggleTaskDone } from "@/actions/tasks.actions";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function TaskItem({ task }: { task: any }) {
    const [isDone, setIsDone] = useState(task.done);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleToggle = () => {
        const newDoneState = !isDone;
        setIsDone(newDoneState); // Optimistic UI update

        startTransition(async () => {
            try {
                await toggleTaskDone(task.id, task.userId, newDoneState);
                router.refresh(); // Refresh RSC data in the background
            } catch (e) {
                // Revert if failed
                setIsDone(!newDoneState);
                toast.error("Erreur de synchronisation.");
            }
        });
    };

    return (
        <label className="glass-card p-4 rounded-xl flex items-start gap-4 cursor-pointer hover:bg-white/5 transition-colors group">
            <div className="relative flex items-center mt-1">
                <input
                    type="checkbox"
                    checked={isDone}
                    onChange={handleToggle}
                    disabled={isPending}
                    className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-slate-600 bg-slate-800/50 checked:border-primary checked:bg-primary transition-all focus:ring-0 focus:ring-offset-0 disabled:opacity-50"
                />
                <Check className="absolute w-3.5 h-3.5 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white pointer-events-none opacity-0 peer-checked:opacity-100" />
            </div>

            <div className="flex-1 opacity-100 peer-checked:opacity-60 transition-opacity">
                <p className={`font-medium transition-colors ${isDone
                    ? 'line-through text-slate-500'
                    : 'text-slate-200 peer-checked:line-through peer-checked:text-slate-500 group-hover:text-white'
                    }`}>
                    {task.text}
                </p>
                <p className="text-slate-500 text-sm mt-1">{task.type && `${task.type} • `}{task.priority}</p>
            </div>

            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    type="button"
                    className="p-1 hover:bg-white/10 rounded text-slate-400 hover:text-white transition-colors"
                >
                    <MoreHorizontal className="w-5 h-5" />
                </button>
            </div>
        </label>
    );
}
