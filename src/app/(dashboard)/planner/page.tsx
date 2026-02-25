import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { tasks, users, notes, projects } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Filter, Plus, CheckCircle, MoreHorizontal } from "lucide-react";
import { createNote } from "@/actions/notes.actions";
import TaskItem from "@/components/blocks/TaskItem";
import CreateTaskModal from "@/components/blocks/CreateTaskModal";

export default async function PlannerPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const today = format(new Date(), "yyyy-MM-dd");

    const tasksList = await db.query.tasks.findMany({
        where: and(eq(tasks.userId, user.id), eq(tasks.dateStr, today)),
        orderBy: (tasks, { asc }) => [asc(tasks.createdAt)],
    });

    const notesList = await db.query.notes.findMany({
        where: and(eq(notes.userId, user.id), eq(notes.dateStr, today)),
        orderBy: (notes, { desc }) => [desc(notes.createdAt)],
    });

    const projectsList = await db.query.projects.findMany({
        where: eq(projects.userId, user.id),
        orderBy: (projects, { asc }) => [asc(projects.createdAt)],
    });

    const dbUserResult = await db.select().from(users).where(eq(users.id, user.id)).limit(1);
    const dbUser = dbUserResult[0] || null;

    const totalTasks = tasksList.length;
    const completedTasks = tasksList.filter((t: any) => t.done).length;
    const inProgress = totalTasks - completedTasks;

    const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Split tasks for columns (Simulation since we don't have time slots in DB yet)
    const matinTasks = tasksList.filter((_, i) => i % 3 === 0);
    const apresMidiTasks = tasksList.filter((_, i) => i % 3 === 1);
    const soireeTasks = tasksList.filter((_, i) => i % 3 === 2);

    return (
        <div className="flex-1 overflow-x-hidden p-6 lg:p-10 scroll-smooth relative z-10 w-full mb-20 lg:mb-0">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-12">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        <span className="text-xs font-semibold text-blue-400 tracking-wider">VUE JOURNALIÈRE</span>
                    </div>
                    <h2 className="text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-2">
                        Bonjour{dbUser?.name ? ` ${dbUser.name.split(' ')[0]}` : ''}, faites de la<br />
                        place pour vos idées.
                    </h2>
                    <p className="text-slate-400 text-lg">
                        Vous avez <span className="text-white font-medium">{totalTasks} tâches</span> prévues aujourd'hui. Restez dans le flux.
                    </p>
                </div>

                {/* Progress Widget */}
                <div className="glass-card rounded-[2rem] p-4 flex items-center gap-5 pr-8">
                    <div className="relative w-16 h-16 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                            <path
                                className="text-white/10"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                            />
                            <path
                                className="text-blue-500"
                                strokeDasharray={`${progressPercentage}, 100`}
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                                strokeLinecap="round"
                            />
                        </svg>
                        <span className="absolute text-sm font-bold text-white">{progressPercentage}%</span>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-300 tracking-wider mb-1">PROGRESSION</p>
                        <p className="text-sm text-slate-400">{completedTasks} terminées / {totalTasks} total</p>
                    </div>
                </div>
            </div>

            {/* 3 Columns Kanban Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">

                {/* Column 1: Matin */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-1 mb-6">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <span>🌅</span> Matin
                        </h3>
                        <span className="text-xs font-medium text-slate-500 bg-white/5 px-3 py-1 rounded-full border border-white/5">08:00 - 12:00</span>
                    </div>

                    {/* Map real tasks */}
                    {matinTasks.map((task: any) => (
                        <TaskItem key={task.id} task={task} />
                    ))}

                    {/* Static visual representation of the complex card from the design */}
                    <div className="glass-card p-5 rounded-3xl relative overflow-hidden border-blue-500/30 group">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-[10px] font-bold text-blue-300 bg-blue-500/20 px-2 py-1 rounded-full border border-blue-500/20">Focus Profond</span>
                            <button className="text-slate-500 hover:text-white"><MoreHorizontal className="w-4 h-4" /></button>
                        </div>
                        <h4 className="text-lg font-bold text-white mb-2">Revue de projet Q3</h4>
                        <p className="text-sm text-slate-400 leading-relaxed mb-6">
                            Analyser les métriques de performance et préparer la présentation pour l'équipe exécutive.
                        </p>
                        <div className="flex justify-between items-end">
                            <div className="flex -space-x-2">
                                <img src="https://i.pravatar.cc/100?img=33" className="w-7 h-7 rounded-full border-2 border-[#1e293b]" alt="Avatar" />
                                <img src="https://i.pravatar.cc/100?img=47" className="w-7 h-7 rounded-full border-2 border-[#1e293b]" alt="Avatar" />
                            </div>
                            <button className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center border border-white/10 text-slate-400 transition-colors">
                                <CheckCircle className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Column 2: Après-midi */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-1 mb-6">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <span>☀️</span> Après-midi
                        </h3>
                        <span className="text-xs font-medium text-slate-500 bg-white/5 px-3 py-1 rounded-full border border-white/5">12:00 - 18:00</span>
                    </div>

                    {/* Image Banner Card */}
                    <div className="glass-card rounded-3xl overflow-hidden group">
                        <div className="h-32 bg-cover bg-center relative" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop')" }}>
                            <div className="absolute inset-0 bg-gradient-to-t from-[#151f2b] to-transparent"></div>
                            <span className="absolute top-4 right-4 text-[10px] font-bold text-slate-300 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full">14:00 - 15:30</span>
                        </div>
                        <div className="p-5 pt-0">
                            <span className="text-[10px] font-bold text-emerald-300 bg-emerald-500/20 px-2 py-1 rounded-full border border-emerald-500/20 inline-block mb-3">Réunion Client</span>
                            <h4 className="text-lg font-bold text-white mb-2">Session de brainstorming équipe</h4>
                            <p className="text-sm text-slate-400 leading-relaxed mb-6">
                                Salle de conférence B ou lien Zoom.
                            </p>
                            <div className="grid grid-cols-2 gap-3">
                                <button className="py-2.5 bg-white/10 hover:bg-white/15 text-white text-sm font-medium rounded-xl transition-colors">Rejoindre</button>
                                <button className="py-2.5 bg-transparent border border-white/10 hover:bg-white/5 text-white text-sm font-medium rounded-xl transition-colors">Reporter</button>
                            </div>
                        </div>
                    </div>

                    {/* Map real tasks */}
                    {apresMidiTasks.map((task: any) => (
                        <TaskItem key={task.id} task={task} />
                    ))}
                </div>

                {/* Column 3: Soirée */}
                <div className="space-y-4 relative">
                    <div className="flex items-center justify-between px-1 mb-6">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <span>🌙</span> Soirée
                        </h3>
                        <span className="text-xs font-medium text-slate-500 bg-white/5 px-3 py-1 rounded-full border border-white/5">18:00 - ...</span>
                    </div>

                    <CreateTaskModal userId={user.id} projects={projectsList} />

                    {/* Map real tasks */}
                    {soireeTasks.map((task: any) => (
                        <TaskItem key={task.id} task={task} />
                    ))}

                    {/* Intelligent Suggestion (Absolute at bottom maybe, or just in flow) */}
                    <div className="mt-8 glass-card rounded-[2rem] p-5 border-orange-500/20 bg-gradient-to-b from-white/5 to-transparent">
                        <div className="flex items-center justify-between mb-4 text-xs font-semibold text-slate-400">
                            <span className="bg-white/5 px-3 py-1 rounded-full">Suggestion intelligente</span>
                        </div>
                        <div className="flex gap-4 mb-5">
                            <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center shrink-0 border border-orange-500/20">
                                💡
                            </div>
                            <div>
                                <h4 className="text-white font-bold text-sm mb-1">Revue de design</h4>
                                <p className="text-slate-400 text-xs">Vous n'avez pas terminé ceci hier.</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button className="flex-1 py-2 bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold rounded-xl transition-colors">Garder ça</button>
                            <button className="flex-1 py-2 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold rounded-xl transition-colors border border-white/5">Passer à demain</button>
                        </div>
                    </div>
                </div>

            </div>

            <div className="h-32 w-full"></div>
        </div>
    );
}
