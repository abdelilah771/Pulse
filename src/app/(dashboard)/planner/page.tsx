import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { tasks, users, notes, projects } from "@/db/schema";
import { eq, and, lt, ne } from "drizzle-orm";
import { format, subDays } from "date-fns";
import { fr } from "date-fns/locale";
import TaskItem from "@/components/blocks/TaskItem";
import CreateTaskModal from "@/components/blocks/CreateTaskModal";

export default async function PlannerPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const today = format(new Date(), "yyyy-MM-dd");
    const yesterday = format(subDays(new Date(), 1), "yyyy-MM-dd");

    // Fetch today's tasks
    const tasksList = await db.query.tasks.findMany({
        where: and(eq(tasks.userId, user.id), eq(tasks.dateStr, today)),
        orderBy: (tasks, { asc }) => [asc(tasks.createdAt)],
    });

    // Fetch yesterday's incomplete tasks for suggestions
    const yesterdayIncompleteTasks = await db.query.tasks.findMany({
        where: and(
            eq(tasks.userId, user.id),
            eq(tasks.dateStr, yesterday),
            eq(tasks.done, false)
        ),
        orderBy: (tasks, { asc }) => [asc(tasks.createdAt)],
    });

    // Fetch today's notes
    const notesList = await db.query.notes.findMany({
        where: and(eq(notes.userId, user.id), eq(notes.dateStr, today)),
        orderBy: (notes, { desc }) => [desc(notes.createdAt)],
    });

    // Fetch projects
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

    // Filter tasks by their actual timeSlot field
    const matinTasks = tasksList.filter((t: any) => t.timeSlot === "morning");
    const apresMidiTasks = tasksList.filter((t: any) => t.timeSlot === "afternoon");
    const soireeTasks = tasksList.filter((t: any) => t.timeSlot === "evening");

    // Build creator info for the task cards
    const creatorInfo = {
        name: dbUser?.name || user.email || null,
        avatarUrl: (dbUser?.avatarUrl || user.user_metadata?.avatar_url || null) as string | null,
    };

    // Greeting based on time of day
    const hour = new Date().getHours();
    const greeting = hour < 12 ? "Bonjour" : hour < 18 ? "Bon après-midi" : "Bonsoir";

    return (
        <div className="flex-1 overflow-x-hidden p-6 lg:p-10 scroll-smooth relative z-10 w-full mb-20 lg:mb-0">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-12">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        <span className="text-xs font-semibold text-blue-400 tracking-wider">
                            {format(new Date(), "EEEE d MMMM yyyy", { locale: fr }).toUpperCase()}
                        </span>
                    </div>
                    <h2 className="text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-2">
                        {greeting}{dbUser?.name ? ` ${dbUser.name.split(' ')[0]}` : ''}, faites de la<br />
                        place pour vos idées.
                    </h2>
                    <p className="text-slate-400 text-lg">
                        {totalTasks === 0 ? (
                            <>Aucune tâche prévue aujourd'hui. <span className="text-white font-medium">Ajoutez-en une !</span></>
                        ) : (
                            <>
                                Vous avez <span className="text-white font-medium">{inProgress} tâche{inProgress > 1 ? 's' : ''}</span> en cours
                                {completedTasks > 0 && <> et <span className="text-emerald-400 font-medium">{completedTasks} terminée{completedTasks > 1 ? 's' : ''}</span></>}.
                                {' '}Restez dans le flux.
                            </>
                        )}
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
                                className={progressPercentage === 100 ? "text-emerald-500" : "text-blue-500"}
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
                            <span className="text-xs font-normal text-slate-500 ml-1">({matinTasks.length})</span>
                        </h3>
                        <span className="text-xs font-medium text-slate-500 bg-white/5 px-3 py-1 rounded-full border border-white/5">08:00 - 12:00</span>
                    </div>

                    {matinTasks.map((task: any) => (
                        <TaskItem key={task.id} task={task} creator={creatorInfo} projects={projectsList} />
                    ))}

                    {matinTasks.length === 0 && (
                        <div className="glass-card rounded-3xl p-8 text-center border-dashed border border-white/5">
                            <p className="text-sm text-slate-500">Aucune tâche ce matin</p>
                        </div>
                    )}

                    <CreateTaskModal userId={user.id} projects={projectsList} />
                </div>

                {/* Column 2: Après-midi */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-1 mb-6">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <span>☀️</span> Après-midi
                            <span className="text-xs font-normal text-slate-500 ml-1">({apresMidiTasks.length})</span>
                        </h3>
                        <span className="text-xs font-medium text-slate-500 bg-white/5 px-3 py-1 rounded-full border border-white/5">12:00 - 18:00</span>
                    </div>

                    {apresMidiTasks.map((task: any) => (
                        <TaskItem key={task.id} task={task} creator={creatorInfo} projects={projectsList} />
                    ))}

                    {apresMidiTasks.length === 0 && (
                        <div className="glass-card rounded-3xl p-8 text-center border-dashed border border-white/5">
                            <p className="text-sm text-slate-500">Aucune tâche cet après-midi</p>
                        </div>
                    )}

                    <CreateTaskModal userId={user.id} projects={projectsList} />
                </div>

                {/* Column 3: Soirée */}
                <div className="space-y-4 relative">
                    <div className="flex items-center justify-between px-1 mb-6">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <span>🌙</span> Soirée
                            <span className="text-xs font-normal text-slate-500 ml-1">({soireeTasks.length})</span>
                        </h3>
                        <span className="text-xs font-medium text-slate-500 bg-white/5 px-3 py-1 rounded-full border border-white/5">18:00 - ...</span>
                    </div>

                    {soireeTasks.map((task: any) => (
                        <TaskItem key={task.id} task={task} creator={creatorInfo} projects={projectsList} />
                    ))}

                    {soireeTasks.length === 0 && (
                        <div className="glass-card rounded-3xl p-8 text-center border-dashed border border-white/5">
                            <p className="text-sm text-slate-500">Aucune tâche ce soir</p>
                        </div>
                    )}

                    <CreateTaskModal userId={user.id} projects={projectsList} />

                    {/* Dynamic Suggestions: yesterday's incomplete tasks */}
                    {yesterdayIncompleteTasks.length > 0 && (
                        <div className="mt-4 glass-card rounded-[2rem] p-5 border-orange-500/20 bg-gradient-to-b from-white/5 to-transparent">
                            <div className="flex items-center justify-between mb-4 text-xs font-semibold text-slate-400">
                                <span className="bg-white/5 px-3 py-1 rounded-full">
                                    📋 {yesterdayIncompleteTasks.length} tâche{yesterdayIncompleteTasks.length > 1 ? 's' : ''} d'hier non terminée{yesterdayIncompleteTasks.length > 1 ? 's' : ''}
                                </span>
                            </div>
                            <div className="space-y-3">
                                {yesterdayIncompleteTasks.slice(0, 3).map((t: any) => (
                                    <div key={t.id} className="flex gap-3 items-center">
                                        <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center shrink-0 border border-orange-500/20">
                                            💡
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-white font-semibold text-sm truncate">{t.text}</h4>
                                            <p className="text-slate-500 text-xs">Non terminée hier</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {yesterdayIncompleteTasks.length > 3 && (
                                <p className="text-xs text-slate-500 mt-3 text-center">
                                    + {yesterdayIncompleteTasks.length - 3} autre{yesterdayIncompleteTasks.length - 3 > 1 ? 's' : ''}
                                </p>
                            )}
                        </div>
                    )}
                </div>

            </div>

            <div className="h-32 w-full"></div>
        </div>
    );
}
