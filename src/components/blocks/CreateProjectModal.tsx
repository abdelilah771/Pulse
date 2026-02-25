"use client";

import { useState } from "react";
import GlassModal from "./GlassModal";
import { Plus } from "lucide-react";
import { createProject } from "@/actions/projects.actions";
import toast from "react-hot-toast";

export default function CreateProjectModal({ userId }: { userId: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isPending, setIsPending] = useState(false);

    const handleSubmit = async (formData: FormData) => {
        setIsPending(true);
        try {
            await createProject(formData);
            toast.success("Nouveau projet créé !");
            setIsOpen(false);
        } catch (error: any) {
            toast.error(error.message || "Erreur lors de la création.");
        } finally {
            setIsPending(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium shadow-lg shadow-primary/20 transition-all"
            >
                <Plus className="w-4 h-4" />
                Nouveau Projet
            </button>

            <GlassModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                title="Créer un nouveau projet"
            >
                <form action={handleSubmit} className="space-y-5">
                    <input type="hidden" name="userId" value={userId} />
                    <input type="hidden" name="redirectPath" value="/home" />

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1.5">Nom du Projet *</label>
                        <input
                            name="name"
                            required
                            type="text"
                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                            placeholder="ex: Lancement Produit v2"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1.5">Description (Optionnel)</label>
                        <textarea
                            name="description"
                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none h-24"
                            placeholder="But de ce projet..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1.5">Couleur du tag</label>
                        <div className="flex gap-3">
                            <label className="cursor-pointer">
                                <input type="radio" name="color" value="emerald" className="peer sr-only" defaultChecked />
                                <div className="w-8 h-8 rounded-full bg-emerald-500 ring-2 ring-emerald-500/20 peer-checked:ring-offset-2 peer-checked:ring-offset-[#101922] transition-all"></div>
                            </label>
                            <label className="cursor-pointer">
                                <input type="radio" name="color" value="blue" className="peer sr-only" />
                                <div className="w-8 h-8 rounded-full bg-blue-500 ring-2 ring-blue-500/20 peer-checked:ring-offset-2 peer-checked:ring-offset-[#101922] transition-all"></div>
                            </label>
                            <label className="cursor-pointer">
                                <input type="radio" name="color" value="purple" className="peer sr-only" />
                                <div className="w-8 h-8 rounded-full bg-purple-500 ring-2 ring-purple-500/20 peer-checked:ring-offset-2 peer-checked:ring-offset-[#101922] transition-all"></div>
                            </label>
                            <label className="cursor-pointer">
                                <input type="radio" name="color" value="orange" className="peer sr-only" />
                                <div className="w-8 h-8 rounded-full bg-orange-500 ring-2 ring-orange-500/20 peer-checked:ring-offset-2 peer-checked:ring-offset-[#101922] transition-all"></div>
                            </label>
                            <label className="cursor-pointer">
                                <input type="radio" name="color" value="rose" className="peer sr-only" />
                                <div className="w-8 h-8 rounded-full bg-rose-500 ring-2 ring-rose-500/20 peer-checked:ring-offset-2 peer-checked:ring-offset-[#101922] transition-all"></div>
                            </label>
                        </div>
                    </div>

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
                            {isPending ? "Création..." : "Créer le projet"}
                        </button>
                    </div>
                </form>
            </GlassModal>
        </>
    );
}
