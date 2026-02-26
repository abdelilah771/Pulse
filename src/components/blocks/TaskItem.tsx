"use client";

import { useState, useTransition } from "react";
import { CheckCircle, MoreHorizontal } from "lucide-react";
import { toggleTaskDone } from "@/actions/tasks.actions";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const priorityConfig: Record<string, { label: string; color: string; border: string }> = {
    high: { label: "Focus Profond", color: "text-blue-300 bg-blue-500/20 border-blue-500/20", border: "border-blue-500/30" },
    medium: { label: "Standard", color: "text-emerald-300 bg-emerald-500/20 border-emerald-500/20", border: "border-emerald-500/30" },
    low: { label: "Optionnel", color: "text-slate-300 bg-white/10 border-white/10", border: "border-white/10" },
};

const accentColors: Record<string, string> = {
    high: "bg-blue-500",
    medium: "bg-emerald-500",
    low: "bg-slate-500",
};

interface TaskUser {
    name: string | null;
    avatarUrl: string | null;
}

interface TaskItemProps {
    task: any;
    creator?: TaskUser;
    assignees?: TaskUser[];
}

export default function TaskItem({ task, creator, assignees = [] }: TaskItemProps) {
    const [isDone, setIsDone] = useState(task.done);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleToggle = () => {
        const newDoneState = !isDone;
        setIsDone(newDoneState);

        startTransition(async () => {
            try {
                await toggleTaskDone(task.id, task.userId, newDoneState);
                router.refresh();
            } catch (e) {
                setIsDone(!newDoneState);
                toast.error("Erreur de synchronisation.");
            }
        });
    };

    const priority = priorityConfig[task.priority] || priorityConfig.medium;
    const accent = accentColors[task.priority] || accentColors.medium;

    // Build list of all people to show (creator first, then assignees)
    const allPeople: TaskUser[] = [];
    if (creator) allPeople.push(creator);
    assignees.forEach(a => {
        // Avoid duplicating creator in assignees
        if (creator && a.name === creator.name) return;
        allPeople.push(a);
    });

    const getInitials = (name: string | null) => {
        if (!name) return "?";
        return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
    };

    // Color palette for fallback avatars
    const avatarColors = ["bg-indigo-500", "bg-rose-500", "bg-amber-500", "bg-teal-500", "bg-violet-500"];

    return (
        <div className={`glass-card p-5 rounded-3xl relative overflow-hidden group transition-all ${isDone ? "opacity-50" : ""} ${priority.border}`}>
            {/* Left accent bar */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${accent}`}></div>

            {/* Header: badge + menu */}
            <div className="flex justify-between items-start mb-3">
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${priority.color}`}>
                    {priority.label}
                </span>
                <button className="text-slate-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100">
                    <MoreHorizontal className="w-4 h-4" />
                </button>
            </div>

            {/* Title */}
            <h4 className={`text-lg font-bold mb-1 transition-colors ${isDone ? "line-through text-slate-500" : "text-white"}`}>
                {task.text}
            </h4>

            {/* Description */}
            {task.description && (
                <p className="text-sm text-slate-400 leading-relaxed mb-4">
                    {task.description}
                </p>
            )}
            {!task.description && <div className="mb-4"></div>}

            {/* Footer: avatars + check button */}
            <div className="flex justify-between items-end">
                <div className="flex -space-x-2">
                    {allPeople.length > 0 ? (
                        allPeople.map((person, i) => (
                            person.avatarUrl ? (
                                <img
                                    key={i}
                                    src={person.avatarUrl}
                                    alt={person.name || "Utilisateur"}
                                    title={person.name || "Utilisateur"}
                                    className="w-7 h-7 rounded-full border-2 border-[#1e293b] object-cover"
                                />
                            ) : (
                                <div
                                    key={i}
                                    title={person.name || "Utilisateur"}
                                    className={`w-7 h-7 rounded-full border-2 border-[#1e293b] flex items-center justify-center text-[10px] font-bold text-white ${avatarColors[i % avatarColors.length]}`}
                                >
                                    {getInitials(person.name)}
                                </div>
                            )
                        ))
                    ) : (
                        <div className={`w-7 h-7 rounded-full border-2 border-[#1e293b] flex items-center justify-center text-[10px] font-bold text-white bg-indigo-500`}>
                            {task.type?.charAt(0)?.toUpperCase() || "T"}
                        </div>
                    )}
                </div>
                <button
                    onClick={handleToggle}
                    disabled={isPending}
                    className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all
                        ${isDone
                            ? "bg-primary border-primary text-white shadow-lg shadow-primary/30"
                            : "bg-white/5 hover:bg-white/10 border-white/10 text-slate-400 hover:text-white"
                        }
                        disabled:opacity-50`}
                >
                    <CheckCircle className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
