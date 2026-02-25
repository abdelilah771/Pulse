"use client";

import { useState } from "react";
import CourseViewer from "@/components/blocks/CourseViewer";
import TaskTimer from "@/components/blocks/TaskTimer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toggleTaskDone, createTask } from "@/actions/auth.actions";

interface PlannerClientProps {
    tasks: any[];
    userId: string;
    dateStr: string;
}

export default function PlannerClient({ tasks: initialTasks, userId, dateStr }: PlannerClientProps) {
    const [selectedDateStr, setSelectedDateStr] = useState<string | null>(null);
    const [tasks, setTasks] = useState(initialTasks);
    const [activeTimerId, setActiveTimerId] = useState<string | null>(null);

    const [isAdding, setIsAdding] = useState(false);
    const [newTaskText, setNewTaskText] = useState("");
    const [newTaskType, setNewTaskType] = useState("learn");

    async function handleCreate(e: React.FormEvent) {
        e.preventDefault();
        if (!newTaskText.trim()) return;

        const optimisticTask = {
            id: `temp-${Date.now()}`,
            text: newTaskText,
            type: newTaskType,
            priority: "medium",
            done: false,
            dateStr,
            userId
        };

        setTasks([...tasks, optimisticTask]);
        setNewTaskText("");
        setIsAdding(false);

        await createTask(optimisticTask.text, optimisticTask.type, optimisticTask.priority, dateStr, userId);
    }

    async function handleToggle(taskId: string, currentDone: boolean) {
        // Optimistic UI update
        const newDone = !currentDone;
        setTasks(tasks.map(t => t.id === taskId ? { ...t, done: newDone } : t));

        // Stop timer if completed
        if (newDone && activeTimerId === taskId) {
            setActiveTimerId(null);
        }

        // Server action
        await toggleTaskDone(taskId, newDone);
    }

    return (
        <>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-800">
                    Objectifs du jour
                </h3>
                <button
                    onClick={() => setIsAdding(true)}
                    className="text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1"
                >
                    <span>+</span> Ajouter
                </button>
            </div>

            <div className="space-y-3">

                {isAdding && (
                    <form onSubmit={handleCreate} className="flex flex-col gap-3 p-4 rounded-xl border border-indigo-200 bg-indigo-50/50 shadow-sm animate-in slide-in-from-top-2">
                        <Input
                            autoFocus
                            placeholder="Que voulez-vous accomplir ?"
                            className="bg-white border-slate-300"
                            value={newTaskText}
                            onChange={(e) => setNewTaskText(e.target.value)}
                        />
                        <div className="flex items-center justify-between mt-1">
                            <Select value={newTaskType} onValueChange={setNewTaskType}>
                                <SelectTrigger className="w-[140px] h-8 bg-white border-slate-300 text-xs text-slate-700">
                                    <SelectValue placeholder="Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="learn">Apprendre</SelectItem>
                                    <SelectItem value="practice">Pratiquer</SelectItem>
                                    <SelectItem value="read">Lire</SelectItem>
                                    <SelectItem value="review">Réviser</SelectItem>
                                    <SelectItem value="project">Projet</SelectItem>
                                </SelectContent>
                            </Select>

                            <div className="flex gap-2">
                                <Button type="button" variant="ghost" size="sm" onClick={() => setIsAdding(false)} className="text-xs h-8 text-slate-500">
                                    Annuler
                                </Button>
                                <Button type="submit" size="sm" disabled={!newTaskText.trim()} className="text-xs h-8 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4">
                                    Sauvegarder
                                </Button>
                            </div>
                        </div>
                    </form>
                )}

                {tasks.length === 0 && !isAdding && (
                    <div className="text-center py-12 px-6 rounded-xl border-2 border-dashed border-slate-200">
                        <p className="text-slate-500 font-medium">Aucune tâche prévue aujourd'hui.</p>
                    </div>
                )}

                {tasks.map((t) => (
                    <div
                        key={t.id}
                        className={`flex flex-col gap-2 p-4 rounded-xl border transition-all relative group ${t.done ? "border-slate-100 bg-slate-50/50 opacity-60" :
                            activeTimerId === t.id ? "border-indigo-200 bg-indigo-50/30 shadow-sm" :
                                "border-slate-100 bg-slate-50 hover:border-indigo-100 hover:shadow-sm"
                            }`}
                    >
                        <div className="flex items-start gap-3 w-full">
                            <button
                                onClick={() => handleToggle(t.id, t.done)}
                                className={`w-5 h-5 mt-0.5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-colors cursor-pointer ${t.done ? "bg-emerald-500 border-emerald-500 text-white" : "border-slate-300 hover:border-indigo-400"
                                    }`}
                            >
                                {t.done && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                            </button>

                            <div className="flex-1 min-w-0 pr-2">
                                <span
                                    className={`font-medium block truncate ${t.done ? "text-slate-400 line-through" : "text-slate-700 cursor-pointer hover:text-indigo-600 hover:underline decoration-indigo-300 underline-offset-2"}`}
                                    onClick={() => !t.done && setSelectedDateStr(t.dateStr)}
                                >
                                    {t.text}
                                </span>
                            </div>

                            <div className="flex items-center gap-2 flex-shrink-0">
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-600 uppercase">
                                    {t.type}
                                </span>

                                {!t.done && (
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => setActiveTimerId(activeTimerId === t.id ? null : t.id)}
                                            className={`w-7 h-7 flex items-center justify-center rounded-full transition-colors ${activeTimerId === t.id ? "bg-indigo-100 text-indigo-700" : "text-slate-400 hover:text-indigo-600 hover:bg-slate-100"
                                                }`}
                                            title="Timer"
                                        >
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                        </button>
                                        <button
                                            onClick={() => setSelectedDateStr(t.dateStr)}
                                            className="w-7 h-7 flex items-center justify-center rounded-full text-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                                            title="Ouvrir le cours (FR)"
                                        >
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Interactive Timer rendering condition */}
                        {!t.done && activeTimerId === t.id && (
                            <div className="pl-8 pr-2 pb-1 animate-in slide-in-from-top-2 duration-300">
                                <TaskTimer
                                    taskId={t.id}
                                    taskName={t.text}
                                    onComplete={() => handleToggle(t.id, false)}
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {selectedDateStr && (
                <CourseViewer
                    dateStr={selectedDateStr}
                    userId={userId}
                    onDateChange={(newDateStr) => setSelectedDateStr(newDateStr)}
                    onClose={() => setSelectedDateStr(null)}
                />
            )}
        </>
    );
}
