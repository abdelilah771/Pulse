"use client";

import { useState } from "react";
import GlassModal from "./GlassModal";
import { Plus } from "lucide-react";
import { createTask } from "@/actions/tasks.actions";
import toast from "react-hot-toast";

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
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="w-full py-4 rounded-3xl border-2 border-dashed border-white/10 hover:border-white/20 hover:bg-white/5 transition-all text-slate-400 text-sm font-medium flex items-center justify-center gap-2"
            >
                <Plus className="w-4 h-4" />
                Ajouter une tâche
            </button>

            <GlassModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                title="Nouvelle tâche"
            >
                <form action={handleSubmit} className="space-y-5">
                    <input type="hidden" name="userId" value={userId} />
                    <input type="hidden" name="redirectPath" value="/planner" />

                    {/* Task Title */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1.5">Que devez-vous faire ? *</label>
                        <input
                            name="text"
                            required
                            type="text"
                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                            placeholder="ex: Revue de projet Q3"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1.5">Description (Optionnel)</label>
                        <textarea
                            name="description"
                            rows={2}
                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                            placeholder="ex: Analyser les métriques de performance..."
                        />
                    </div>

                    {/* Time Slot - visual pills */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Créneau horaire *</label>
                        <div className="grid grid-cols-3 gap-3">
                            <label className="cursor-pointer">
                                <input type="radio" name="timeSlot" value="morning" defaultChecked className="peer hidden" />
                                <div className="text-center py-3 rounded-xl border border-white/10 bg-black/20 peer-checked:border-amber-400 peer-checked:bg-amber-500/10 transition-all">
                                    <span className="text-lg">🌅</span>
                                    <p className="text-xs font-medium text-slate-300 peer-checked:text-amber-300 mt-1">Matin</p>
                                </div>
                            </label>
                            <label className="cursor-pointer">
                                <input type="radio" name="timeSlot" value="afternoon" className="peer hidden" />
                                <div className="text-center py-3 rounded-xl border border-white/10 bg-black/20 peer-checked:border-orange-400 peer-checked:bg-orange-500/10 transition-all">
                                    <span className="text-lg">☀️</span>
                                    <p className="text-xs font-medium text-slate-300 peer-checked:text-orange-300 mt-1">Après-midi</p>
                                </div>
                            </label>
                            <label className="cursor-pointer">
                                <input type="radio" name="timeSlot" value="evening" className="peer hidden" />
                                <div className="text-center py-3 rounded-xl border border-white/10 bg-black/20 peer-checked:border-indigo-400 peer-checked:bg-indigo-500/10 transition-all">
                                    <span className="text-lg">🌙</span>
                                    <p className="text-xs font-medium text-slate-300 peer-checked:text-indigo-300 mt-1">Soirée</p>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Date + Priority row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5">Date prévue *</label>
                            <input
                                name="dateStr"
                                required
                                type="date"
                                defaultValue={todayStr}
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all [color-scheme:dark]"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5">Priorité</label>
                            <select
                                name="priority"
                                defaultValue="medium"
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all appearance-none"
                            >
                                <option value="low">Basse</option>
                                <option value="medium">Moyenne</option>
                                <option value="high">Haute</option>
                            </select>
                        </div>
                    </div>

                    {/* Project */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1.5">Associer à un Projet (Optionnel)</label>
                        <select
                            name="projectId"
                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all appearance-none"
                        >
                            <option value="">-- Aucun projet --</option>
                            {projects.map((p) => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Actions */}
                    <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/5">
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="px-5 py-2.5 text-sm font-medium text-slate-300 hover:text-white bg-transparent hover:bg-white/5 rounded-xl transition-colors"
                            disabled={isPending}
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-primary/90 rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center gap-2 disabled:opacity-50"
                            disabled={isPending}
                        >
                            {isPending ? "Ajout..." : "Ajouter la tâche"}
                        </button>
                    </div>
                </form>
            </GlassModal>
        </>
    );
}
