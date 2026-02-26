"use client";

import { useState } from "react";
import { Plus, Sunrise, Sun, Moon } from "lucide-react";
import { createTask } from "@/actions/tasks.actions";
import toast from "react-hot-toast";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetTrigger,
} from "@/components/ui/sheet";

export default function CreateTaskModal({ userId, projects }: { userId: string, projects: any[] }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isPending, setIsPending] = useState(false);

    const handleSubmit = async (formData: FormData) => {
        setIsPending(true);
        try {
            await createTask(formData);
            toast.success("Tâche ajoutée !");
            setIsOpen(false);
        } catch (error: any) {
            toast.error(error.message || "Erreur lors de la création.");
        } finally {
            setIsPending(false);
        }
    };

    const todayStr = new Date().toISOString().split('T')[0];

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <button className="w-full py-4 rounded-3xl border-2 border-dashed border-black/10 dark:border-white/10 hover:border-black/20 dark:hover:border-white/20 hover:bg-black/5 dark:hover:bg-white/5 transition-all text-slate-400 text-sm font-medium flex items-center justify-center gap-2">
                    <Plus className="w-4 h-4" />
                    Ajouter une tâche
                </button>
            </SheetTrigger>

            <SheetContent
                side="right"
                className="!w-full sm:!max-w-md border-l border-black/10 dark:border-white/10 bg-white/95 dark:bg-[#101922]/95 backdrop-blur-2xl text-slate-900 dark:text-white overflow-y-auto"
            >
                <SheetHeader className="mb-6">
                    <SheetTitle className="text-xl font-bold text-slate-900 dark:text-white">Nouvelle tâche</SheetTitle>
                    <SheetDescription className="text-slate-500 dark:text-slate-400 text-sm">
                        Remplissez les détails ci-dessous pour organiser votre journée.
                    </SheetDescription>
                </SheetHeader>

                <form action={handleSubmit} className="space-y-6">
                    <input type="hidden" name="userId" value={userId} />
                    <input type="hidden" name="redirectPath" value="/planner" />

                    {/* Task Title */}
                    <div>
                        <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">Que devez-vous faire ? *</label>
                        <input
                            name="text"
                            required
                            type="text"
                            className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                            placeholder="ex: Revue de projet Q3"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">Description (Optionnel)</label>
                        <textarea
                            name="description"
                            rows={3}
                            className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                            placeholder="Analyser les métriques de performance..."
                        />
                    </div>

                    {/* Time Slot - visual pills with icons */}
                    <div>
                        <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Créneau horaire *</label>
                        <div className="grid grid-cols-3 gap-3">
                            <label className="cursor-pointer">
                                <input type="radio" name="timeSlot" value="morning" defaultChecked className="peer hidden" />
                                <div className="text-center py-3.5 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 peer-checked:border-amber-400 peer-checked:bg-amber-500/10 transition-all hover:bg-black/10 dark:hover:bg-white/10">
                                    <Sunrise className="w-5 h-5 text-amber-500 mx-auto" />
                                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1.5">Matin</p>
                                </div>
                            </label>
                            <label className="cursor-pointer">
                                <input type="radio" name="timeSlot" value="afternoon" className="peer hidden" />
                                <div className="text-center py-3.5 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 peer-checked:border-orange-400 peer-checked:bg-orange-500/10 transition-all hover:bg-black/10 dark:hover:bg-white/10">
                                    <Sun className="w-5 h-5 text-orange-500 mx-auto" />
                                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1.5">Après-midi</p>
                                </div>
                            </label>
                            <label className="cursor-pointer">
                                <input type="radio" name="timeSlot" value="evening" className="peer hidden" />
                                <div className="text-center py-3.5 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 peer-checked:border-indigo-400 peer-checked:bg-indigo-500/10 transition-all hover:bg-black/10 dark:hover:bg-white/10">
                                    <Moon className="w-5 h-5 text-indigo-500 mx-auto" />
                                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1.5">Soirée</p>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Date + Priority row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">Date prévue *</label>
                            <input
                                name="dateStr"
                                required
                                type="date"
                                defaultValue={todayStr}
                                className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all dark:[color-scheme:dark]"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">Priorité</label>
                            <select
                                name="priority"
                                defaultValue="medium"
                                className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all appearance-none"
                            >
                                <option value="low">Basse</option>
                                <option value="medium">Moyenne</option>
                                <option value="high">Haute</option>
                            </select>
                        </div>
                    </div>

                    {/* Project */}
                    <div>
                        <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">Associer à un Projet</label>
                        <select
                            name="projectId"
                            className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all appearance-none"
                        >
                            <option value="">-- Aucun projet --</option>
                            {projects.map((p) => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Actions */}
                    <div className="pt-6 flex items-center gap-3 border-t border-black/5 dark:border-white/5">
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="flex-1 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 rounded-xl transition-colors border border-black/5 dark:border-white/5"
                            disabled={isPending}
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-primary/90 rounded-xl shadow-lg shadow-primary/20 transition-all disabled:opacity-50"
                            disabled={isPending}
                        >
                            {isPending ? "Ajout..." : "Ajouter"}
                        </button>
                    </div>
                </form>
            </SheetContent>
        </Sheet>
    );
}
