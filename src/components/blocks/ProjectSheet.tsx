"use client";

import { useState } from "react";
import { Plus, Settings, Trash2, Users, UserPlus } from "lucide-react";
import { createProject, updateProject, deleteProject, shareProject, removeMember } from "@/actions/projects.actions";
import toast from "react-hot-toast";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetTrigger,
} from "@/components/ui/sheet";

export default function ProjectSheet({
    userId,
    mode = "create",
    project,
    children
}: {
    userId: string;
    mode?: "create" | "edit";
    project?: any;
    children?: React.ReactNode;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [isPending, setIsPending] = useState(false);
    const [inviteEmail, setInviteEmail] = useState("");

    const isOwner = project?.userId === userId;

    const handleSubmit = async (formData: FormData) => {
        setIsPending(true);
        try {
            if (mode === "create") {
                await createProject(formData);
                toast.success("Nouveau projet créé !");
            } else {
                await updateProject(formData);
                toast.success("Projet mis à jour !");
            }
            setIsOpen(false);
        } catch (error: any) {
            toast.error(error.message || "Erreur.");
        } finally {
            setIsPending(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Voulez-vous vraiment supprimer ce projet ? Cette action est irréversible.")) return;

        setIsPending(true);
        try {
            const formData = new FormData();
            formData.append("id", project?.id);
            formData.append("userId", userId);
            await deleteProject(formData);
            toast.success("Projet supprimé !");
            setIsOpen(false);
        } catch (error: any) {
            toast.error(error.message || "Erreur de suppression.");
        } finally {
            setIsPending(false);
        }
    };

    const handleShare = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inviteEmail) return;

        setIsPending(true);
        try {
            const formData = new FormData();
            formData.append("projectId", project?.id);
            formData.append("email", inviteEmail);
            formData.append("userId", userId);
            await shareProject(formData);
            toast.success("Invitation envoyée !");
            setInviteEmail("");
        } catch (error: any) {
            toast.error(error.message || "Erreur lors du partage.");
        } finally {
            setIsPending(false);
        }
    };

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                {children ? children : (
                    <button className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium shadow-lg shadow-primary/20 transition-all">
                        <Plus className="w-4 h-4" />
                        Nouveau Projet
                    </button>
                )}
            </SheetTrigger>

            <SheetContent
                side="right"
                className="!w-full sm:!max-w-md border-l border-black/10 dark:border-white/10 bg-white/95 dark:bg-[#101922]/95 backdrop-blur-2xl text-slate-900 dark:text-white overflow-y-auto"
            >
                <SheetHeader className="mb-6">
                    <div className="flex justify-between items-start pr-8">
                        <div>
                            <SheetTitle className="text-xl font-bold text-slate-900 dark:text-white">
                                {mode === "create" ? "Nouveau projet" : "Paramètres du projet"}
                            </SheetTitle>
                            <SheetDescription className="text-slate-500 dark:text-slate-400 text-sm">
                                {mode === "create" ? "Configurez les informations de base de votre projet." : "Gérez les informations et les accès du projet."}
                            </SheetDescription>
                        </div>
                        {mode === "edit" && project?.id && (
                            <a
                                href={`/projects/${project.id}`}
                                className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold text-xs rounded-lg flex items-center gap-2 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors whitespace-nowrap"
                            >
                                Ouvrir le Workspace
                            </a>
                        )}
                    </div>
                </SheetHeader>

                <div className="space-y-8">
                    {/* Basic Info Form */}
                    <form action={handleSubmit} className="space-y-5">
                        <input type="hidden" name="userId" value={userId} />
                        <input type="hidden" name="redirectPath" value="/home" />
                        {mode === "edit" && <input type="hidden" name="id" value={project?.id} />}

                        {/* Nom */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-900 dark:text-white">Nom du Projet *</label>
                            <input
                                name="name"
                                required
                                type="text"
                                defaultValue={project?.name || ""}
                                className="w-full bg-black/5 dark:bg-black/20 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                placeholder="ex: Lancement Produit v2"
                                readOnly={mode === "edit" && !isOwner}
                            />
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-900 dark:text-white">Description (Optionnel)</label>
                            <textarea
                                name="description"
                                defaultValue={project?.description || ""}
                                className="w-full bg-black/5 dark:bg-black/20 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none h-24"
                                placeholder="But de ce projet..."
                                readOnly={mode === "edit" && !isOwner}
                            />
                        </div>

                        {/* Couleur */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-900 dark:text-white">Couleur d'identification</label>
                            <div className="flex gap-3">
                                {["emerald", "blue", "purple", "orange", "rose"].map((c) => (
                                    <label key={c} className="cursor-pointer">
                                        <input
                                            type="radio"
                                            name="color"
                                            value={c}
                                            className="peer sr-only"
                                            defaultChecked={(project?.color === c) || (mode === "create" && c === "emerald")}
                                            disabled={mode === "edit" && !isOwner}
                                        />
                                        <div className={`w-8 h-8 rounded-full bg-${c}-500 ring-2 ring-${c}-500/20 peer-checked:ring-offset-2 peer-checked:ring-offset-white dark:peer-checked:ring-offset-[#101922] transition-all opacity-50 peer-checked:opacity-100 peer-disabled:opacity-20`}></div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {(mode === "create" || isOwner) && (
                            <button
                                type="submit"
                                className="w-full py-3 mt-4 bg-primary hover:bg-primary/90 text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20 transition-all flex items-center justify-center disabled:opacity-50"
                                disabled={isPending}
                            >
                                {isPending ? "Enregistrement..." : (mode === "create" ? "Créer le projet" : "Enregistrer les modifications")}
                            </button>
                        )}
                    </form>

                    {/* Collaboration Section (Edit Mode Only) */}
                    {mode === "edit" && (
                        <div className="space-y-4 pt-6 border-t border-black/10 dark:border-white/10">
                            <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                <Users className="w-4 h-4" /> Équipe & Collaboration
                            </h3>

                            {/* Invite Form */}
                            {isOwner && (
                                <form onSubmit={handleShare} className="flex gap-2">
                                    <input
                                        type="email"
                                        placeholder="Email du collaborateur..."
                                        value={inviteEmail}
                                        onChange={(e) => setInviteEmail(e.target.value)}
                                        className="flex-1 bg-black/5 dark:bg-black/20 border border-black/10 dark:border-white/10 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-primary"
                                        required
                                    />
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-slate-900 dark:text-white rounded-xl text-sm font-medium transition-colors border border-black/5 dark:border-white/5 flex items-center gap-2 shrink-0 disabled:opacity-50"
                                        disabled={isPending}
                                    >
                                        <UserPlus className="w-4 h-4" /> Inviter
                                    </button>
                                </form>
                            )}

                            {/* List of members will be rendered here via project.members if we join it */}
                            <div className="p-4 bg-black/5 dark:bg-black/20 rounded-xl border border-black/5 dark:border-white/5 space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-[10px] font-bold text-white">
                                            {isOwner ? "VOUS" : "O"}
                                        </div>
                                        <span className="text-sm text-slate-900 dark:text-white font-medium">Propriétaire</span>
                                    </div>
                                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">Owner</span>
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 text-center italic mt-2">
                                    Les membres ajoutés (via la table projectMembers) apparaîtront ici.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Danger Zone */}
                    {mode === "edit" && isOwner && (
                        <div className="space-y-4 pt-6 mt-6 border-t border-black/10 dark:border-white/10">
                            <h3 className="text-sm font-semibold text-rose-500 flex items-center gap-2">
                                <Settings className="w-4 h-4" /> Zone dangereuse
                            </h3>
                            <div className="p-4 border border-rose-500/20 bg-rose-500/5 rounded-xl flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-900 dark:text-white">Supprimer le projet</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Cette action supprimera également toutes les tâches associées.</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    className="px-3 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-rose-500/20 flex items-center gap-2 shrink-0 disabled:opacity-50"
                                    disabled={isPending}
                                >
                                    <Trash2 className="w-4 h-4" /> Supprimer
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
}
