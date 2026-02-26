"use client";

import { CheckCircle2, ListTodo, Users, ArrowUpRight } from "lucide-react";

interface ProjectSummaryProps {
    stats: {
        totalTasks: number;
        completedTasks: number;
    };
    members: {
        id: string;
        name: string | null;
        avatarUrl: string | null;
        role: string;
    }[];
}

export default function ProjectSummary({ stats, members }: ProjectSummaryProps) {
    const progress = stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Progress Card */}
                <div className="glass-card border border-black/5 dark:border-white/5 p-6 rounded-2xl">
                    <div className="flex items-center gap-3 text-emerald-500 mb-4">
                        <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
                            <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <h3 className="font-semibold text-slate-900 dark:text-white">Progression</h3>
                    </div>
                    <div className="text-4xl font-black text-slate-900 dark:text-white mb-2">
                        {progress}%
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 mb-2 overflow-hidden">
                        <div className="bg-emerald-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${progress}%` }}></div>
                    </div>
                    <p className="text-xs font-medium text-slate-500">
                        {stats.completedTasks} sur {stats.totalTasks} tâches terminées
                    </p>
                </div>

                {/* Overdue / Active Card */}
                <div className="glass-card border border-black/5 dark:border-white/5 p-6 rounded-2xl">
                    <div className="flex items-center gap-3 text-amber-500 mb-4">
                        <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500">
                            <ListTodo className="w-5 h-5" />
                        </div>
                        <h3 className="font-semibold text-slate-900 dark:text-white">Tâches Actives</h3>
                    </div>
                    <div className="text-4xl font-black text-slate-900 dark:text-white mb-2">
                        {stats.totalTasks - stats.completedTasks}
                    </div>
                    <p className="text-xs font-medium text-slate-500">
                        Tâches à faire dans l'immédiat
                    </p>
                </div>

                {/* Info Card */}
                <div className="glass-card border-none bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-2xl text-white sm:col-span-2 lg:col-span-1 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-white/20 rounded-lg text-white">
                                <ArrowUpRight className="w-5 h-5" />
                            </div>
                            <h3 className="font-semibold">Vue d'ensemble</h3>
                        </div>
                        <p className="text-sm font-medium text-indigo-100 mb-6">
                            L'analyse est basée sur les données en temps réel.
                        </p>
                    </div>
                    <div className="text-xs bg-black/20 px-3 py-2 rounded-lg backdrop-blur-sm self-start font-medium border border-white/10">
                        Mise à jour en direct
                    </div>
                </div>
            </div>

            {/* Team Members */}
            <div className="glass-card border border-black/5 dark:border-white/5 p-6 rounded-2xl mt-6">
                <div className="flex items-center gap-2 mb-6">
                    <Users className="w-5 h-5 text-indigo-500" />
                    <h3 className="font-semibold text-slate-900 dark:text-white">L'équipe du projet ({members.length})</h3>
                </div>

                <div className="flex flex-wrap gap-4">
                    {members.map((member) => (
                        <div key={member.id} className="flex flex-col items-center gap-2 min-w-[80px]">
                            <div className="relative">
                                <div className="w-14 h-14 rounded-full bg-slate-200 dark:bg-slate-800 border-4 border-white dark:border-[#101922] shadow-sm flex items-center justify-center text-xl font-bold text-slate-500 overflow-hidden ring-2 ring-primary/20">
                                    {member.avatarUrl ? (
                                        <img src={member.avatarUrl} alt={member.name || "User"} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                    ) : (
                                        member.name ? member.name.charAt(0).toUpperCase() : "U"
                                    )}
                                </div>
                                {member.role === 'owner' && (
                                    <div className="absolute -bottom-1 -right-1 bg-amber-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full border-2 border-white dark:border-[#101922]">
                                        PRO
                                    </div>
                                )}
                            </div>
                            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 text-center max-w-[80px] truncate">
                                {member.name || "User"}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
