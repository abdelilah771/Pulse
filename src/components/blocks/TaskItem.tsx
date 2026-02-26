"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { CheckCircle, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { toggleTaskDone, updateTask, deleteTaskById } from "@/actions/tasks.actions";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet";

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
    projects?: any[];
}

export default function TaskItem({ task, creator, assignees = [], projects = [] }: TaskItemProps) {
    const [isDone, setIsDone] = useState(task.done);
    const [isPending, startTransition] = useTransition();
    const [showMenu, setShowMenu] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [editPending, setEditPending] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setShowMenu(false);
            }
        };
        if (showMenu) document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showMenu]);

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

    const handleDelete = () => {
        setShowMenu(false);
        startTransition(async () => {
            try {
                await deleteTaskById(task.id, task.userId);
                toast.success("Tâche supprimée");
                router.refresh();
            } catch (e) {
                toast.error("Erreur lors de la suppression.");
            }
        });
    };

    const handleUpdate = async (formData: FormData) => {
        setEditPending(true);
        try {
            await updateTask(formData);
            toast.success("Tâche mise à jour !");
            setEditOpen(false);
            router.refresh();
        } catch (error: any) {
            toast.error(error.message || "Erreur lors de la mise à jour.");
        } finally {
            setEditPending(false);
        }
    };

    const priority = priorityConfig[task.priority] || priorityConfig.medium;
    const accent = accentColors[task.priority] || accentColors.medium;

    // Build list of all people to show
    const allPeople: TaskUser[] = [];
    if (creator) allPeople.push(creator);
    assignees.forEach(a => {
        if (creator && a.name === creator.name) return;
        allPeople.push(a);
    });

    const getInitials = (name: string | null) => {
        if (!name) return "?";
        return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
    };

    const avatarColors = ["bg-indigo-500", "bg-rose-500", "bg-amber-500", "bg-teal-500", "bg-violet-500"];

    return (
        <>
            <div className={`glass-card p-5 rounded-3xl relative overflow-hidden group transition-all ${isDone ? "opacity-50" : ""} ${priority.border}`}>
                {/* Left accent bar */}
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${accent}`}></div>

                {/* Header: badge + menu */}
                <div className="flex justify-between items-start mb-3">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${priority.color}`}>
                        {priority.label}
                    </span>

                    {/* Three-dot menu */}
                    <div className="relative" ref={menuRef}>
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className="text-slate-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-white/10"
                        >
                            <MoreHorizontal className="w-4 h-4" />
                        </button>

                        {showMenu && (
                            <div className="absolute right-0 top-8 z-50 w-40 bg-[#1a2332] border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                <button
                                    onClick={() => { setShowMenu(false); setEditOpen(true); }}
                                    className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                                >
                                    <Pencil className="w-3.5 h-3.5" />
                                    Modifier
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors border-t border-white/5"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    Supprimer
                                </button>
                            </div>
                        )}
                    </div>
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
                            <div className="w-7 h-7 rounded-full border-2 border-[#1e293b] flex items-center justify-center text-[10px] font-bold text-white bg-indigo-500">
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

            {/* Edit Sheet */}
            <Sheet open={editOpen} onOpenChange={setEditOpen}>
                <SheetContent
                    side="right"
                    className="!w-full sm:!max-w-md border-l border-white/10 bg-[#101922]/95 backdrop-blur-2xl text-white overflow-y-auto"
                >
                    <SheetHeader className="mb-6">
                        <SheetTitle className="text-xl font-bold text-white">Modifier la tâche</SheetTitle>
                        <SheetDescription className="text-slate-400 text-sm">
                            Modifiez les détails ci-dessous et sauvegardez.
                        </SheetDescription>
                    </SheetHeader>

                    <form action={handleUpdate} className="space-y-6">
                        <input type="hidden" name="id" value={task.id} />
                        <input type="hidden" name="userId" value={task.userId} />
                        <input type="hidden" name="redirectPath" value="/planner" />

                        {/* Task Title */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5">Titre de la tâche *</label>
                            <input
                                name="text"
                                required
                                type="text"
                                defaultValue={task.text}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5">Description</label>
                            <textarea
                                name="description"
                                rows={3}
                                defaultValue={task.description || ""}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                                placeholder="Détails de la tâche..."
                            />
                        </div>

                        {/* Time Slot */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Créneau horaire *</label>
                            <div className="grid grid-cols-3 gap-3">
                                <label className="cursor-pointer">
                                    <input type="radio" name="timeSlot" value="morning" defaultChecked={task.timeSlot === "morning"} className="peer hidden" />
                                    <div className="text-center py-3.5 rounded-xl border border-white/10 bg-white/5 peer-checked:border-amber-400 peer-checked:bg-amber-500/10 transition-all hover:bg-white/10">
                                        <span className="text-xl block">🌅</span>
                                        <p className="text-xs font-medium text-slate-400 mt-1.5">Matin</p>
                                    </div>
                                </label>
                                <label className="cursor-pointer">
                                    <input type="radio" name="timeSlot" value="afternoon" defaultChecked={task.timeSlot === "afternoon"} className="peer hidden" />
                                    <div className="text-center py-3.5 rounded-xl border border-white/10 bg-white/5 peer-checked:border-orange-400 peer-checked:bg-orange-500/10 transition-all hover:bg-white/10">
                                        <span className="text-xl block">☀️</span>
                                        <p className="text-xs font-medium text-slate-400 mt-1.5">Après-midi</p>
                                    </div>
                                </label>
                                <label className="cursor-pointer">
                                    <input type="radio" name="timeSlot" value="evening" defaultChecked={task.timeSlot === "evening"} className="peer hidden" />
                                    <div className="text-center py-3.5 rounded-xl border border-white/10 bg-white/5 peer-checked:border-indigo-400 peer-checked:bg-indigo-500/10 transition-all hover:bg-white/10">
                                        <span className="text-xl block">🌙</span>
                                        <p className="text-xs font-medium text-slate-400 mt-1.5">Soirée</p>
                                    </div>
                                </label>
                            </div>
                        </div>

                        {/* Date + Priority */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1.5">Date *</label>
                                <input
                                    name="dateStr"
                                    required
                                    type="date"
                                    defaultValue={task.dateStr}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all [color-scheme:dark]"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1.5">Priorité</label>
                                <select
                                    name="priority"
                                    defaultValue={task.priority}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all appearance-none"
                                >
                                    <option value="low">🟢 Basse</option>
                                    <option value="medium">🟡 Moyenne</option>
                                    <option value="high">🔴 Haute</option>
                                </select>
                            </div>
                        </div>

                        {/* Project */}
                        {projects.length > 0 && (
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1.5">Projet</label>
                                <select
                                    name="projectId"
                                    defaultValue={task.projectId || ""}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all appearance-none"
                                >
                                    <option value="">-- Aucun projet --</option>
                                    {projects.map((p: any) => (
                                        <option key={p.id} value={p.id}>{p.name}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="pt-6 flex items-center gap-3 border-t border-white/5">
                            <button
                                type="button"
                                onClick={() => setEditOpen(false)}
                                className="flex-1 py-2.5 text-sm font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-colors border border-white/5"
                                disabled={editPending}
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                className="flex-1 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-primary/90 rounded-xl shadow-lg shadow-primary/20 transition-all disabled:opacity-50"
                                disabled={editPending}
                            >
                                {editPending ? "Sauvegarde..." : "💾 Sauvegarder"}
                            </button>
                        </div>
                    </form>
                </SheetContent>
            </Sheet>
        </>
    );
}
