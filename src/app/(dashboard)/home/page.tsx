import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { tasks, users, notes, projects } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Filter, Plus, CheckCircle, LayoutDashboard } from "lucide-react";
import { createNote } from "@/actions/notes.actions";
import TaskItem from "@/components/blocks/TaskItem";
import CreateProjectModal from "@/components/blocks/CreateProjectModal";
import CreateTaskModal from "@/components/blocks/CreateTaskModal";

export default async function HomePage() {
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
    const completedTasks = tasksList.filter(t => t.done).length;
    const inProgress = totalTasks - completedTasks;

    return (
        <>
            {/* Left Panel / Dashboard Grid */}
            <div className="flex-1 overflow-y-auto p-6 lg:p-10 space-y-8 scroll-smooth relative z-10 w-full mb-20 lg:mb-0">
                {/* Welcome Section */}
                <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 mb-8">
                    <div>
                        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                            Bonjour, {dbUser?.name?.split(' ')[0] || 'Voyageur'}
                        </h2>
                        <p className="text-slate-400 mt-1">Voici ce qui se passe dans votre espace aujourd'hui.</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium transition-all text-white">
                            <Filter className="w-4 h-4" />
                            Filtrer
                        </button>
                        <a href="/planner" className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium shadow-lg shadow-indigo-600/20 transition-all">
                            <LayoutDashboard className="w-4 h-4" />
                            Ouvrir le Planner
                        </a>
                        <CreateProjectModal userId={user.id} />
                    </div>
                </div>

                <div className="mb-8 overflow-x-auto pb-4 custom-scrollbar">
                    <div className="flex gap-4 min-w-max">
                        {projectsList.map((project) => {
                            // Explicit mapping for Tailwind compilation
                            const colorClassStyles: Record<string, string> = {
                                emerald: "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.7)]",
                                blue: "bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.7)]",
                                purple: "bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.7)]",
                                orange: "bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.7)]",
                                rose: "bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.7)]",
                            };
                            const badgeClass = colorClassStyles[project.color] || colorClassStyles.emerald;

                            return (
                                <div key={project.id} className="glass-card pl-3 pr-5 py-2.5 rounded-full flex items-center gap-3 border border-white/5 hover:bg-white/5 transition-colors cursor-pointer group">
                                    <div className={`w-3 h-3 rounded-full ${badgeClass}`}></div>
                                    <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">{project.name}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Stat Card 1 */}
                    <div className="glass-card rounded-2xl p-6 relative overflow-hidden group">
                        <div className="absolute -right-6 -top-6 w-24 h-24 bg-primary/20 rounded-full blur-2xl group-hover:bg-primary/30 transition-all"></div>
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                                <CheckCircle className="w-5 h-5" />
                            </div>
                            <span className="text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">+12%</span>
                        </div>
                        <div className="space-y-1">
                            <p className="text-slate-400 text-sm font-medium">Tâches Totales</p>
                            <h3 className="text-3xl font-bold text-white">{totalTasks}</h3>
                        </div>
                    </div>

                    {/* Stat Card 2 */}
                    <div className="glass-card rounded-2xl p-6 relative overflow-hidden group">
                        <div className="absolute -right-6 -top-6 w-24 h-24 bg-purple-500/20 rounded-full blur-2xl group-hover:bg-purple-500/30 transition-all"></div>
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
                                <span className="material-symbols-outlined shrink-0 text-xl font-bold align-middle w-5 h-5 flex items-center justify-center">⏳</span>
                            </div>
                            <span className="text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">+5%</span>
                        </div>
                        <div className="space-y-1">
                            <p className="text-slate-400 text-sm font-medium">En Cours</p>
                            <h3 className="text-3xl font-bold text-white">{inProgress}</h3>
                        </div>
                    </div>

                    {/* Stat Card 3 */}
                    <div className="glass-card rounded-2xl p-6 relative overflow-hidden group">
                        <div className="absolute -right-6 -top-6 w-24 h-24 bg-orange-500/20 rounded-full blur-2xl group-hover:bg-orange-500/30 transition-all"></div>
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-orange-500/10 rounded-lg text-orange-400">
                                <span className="material-symbols-outlined shrink-0 text-xl font-bold align-middle w-5 h-5 flex items-center justify-center">📅</span>
                            </div>
                            <span className="text-xs font-medium text-orange-400 bg-orange-400/10 px-2 py-1 rounded-full">-2%</span>
                        </div>
                        <div className="space-y-1">
                            <p className="text-slate-400 text-sm font-medium">En Attente</p>
                            <h3 className="text-3xl font-bold text-white">3</h3>
                        </div>
                    </div>
                </div>

                {/* Active Project Banner */}
                <div className="glass-card rounded-2xl p-1 overflow-hidden">
                    <div className="bg-[#192633]/50 rounded-xl flex flex-col md:flex-row overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-primary/5 pointer-events-none"></div>
                        <div
                            className="w-full md:w-1/3 h-48 md:h-auto bg-cover bg-center relative"
                            style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop")' }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/80 to-transparent"></div>
                            <div className="absolute bottom-4 left-4">
                                <span className="bg-primary text-white text-xs font-bold px-2 py-1 rounded mb-2 inline-block">Priorité Haute</span>
                            </div>
                        </div>
                        <div className="p-6 flex flex-col justify-center flex-1 relative z-10">
                            <h3 className="text-2xl font-bold text-white mb-2">Lancement du Projet Alpha</h3>
                            <p className="text-slate-400 text-sm mb-6 max-w-lg">Finaliser les ressources marketing et coordonner avec l'équipe de développement pour le prochain cycle de sortie.</p>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-auto gap-4">
                                <div className="flex -space-x-2">
                                    <div className="w-8 h-8 rounded-full border-2 border-[#192633] bg-indigo-500 flex items-center justify-center text-xs font-bold text-white">AM</div>
                                    <div className="w-8 h-8 rounded-full border-2 border-[#192633] bg-emerald-500 flex items-center justify-center text-xs font-bold text-white">KL</div>
                                    <div className="w-8 h-8 rounded-full border-2 border-[#192633] bg-slate-700 flex items-center justify-center text-xs text-white font-medium">+3</div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right hidden sm:block">
                                        <p className="text-xs text-slate-400">Deadline</p>
                                        <p className="text-sm font-medium text-white">Demain, 17:00</p>
                                    </div>
                                    <button className="px-5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-colors border border-white/5">
                                        Ouvrir le Board
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tasks Grid */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                            <CheckCircle className="text-primary w-5 h-5" />
                            Focus du Jour
                        </h3>
                        <div className="w-48">
                            <CreateTaskModal userId={user.id} projects={projectsList} />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                        {tasksList.map((task: any) => (
                            <TaskItem key={task.id} task={task} />
                        ))}
                        {tasksList.length === 0 && (
                            <div className="col-span-full py-8 text-center text-slate-400 glass-card rounded-xl">
                                Aucune tâche pour aujourd'hui. Faisons une pause !
                            </div>
                        )}
                    </div>
                </div>

                {/* Bottom Spacer for Floating Dock */}
                <div className="h-32 w-full"></div>
            </div>

            {/* Right Slide-over Panel (Note Editor) */}
            <aside className="w-96 hidden lg:flex flex-col border-l border-white/5 glass-panel h-full relative z-20 transition-transform">
                <div className="p-6 border-b border-white/5 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        <span className="font-semibold text-white">Notes Rapides</span>
                    </div>
                    <button className="text-slate-400 hover:text-white transition-colors">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                        </svg>
                    </button>
                </div>

                <div className="flex-1 p-6 overflow-y-auto">
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-4">Aujourd'hui, {format(new Date(), "d MMM", { locale: fr })}</p>
                    <div className="space-y-6">
                        {notesList.map((note) => (
                            <div key={note.id} className="group border border-white/5 bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors">
                                <h4 className="text-white font-medium mb-2 flex items-center justify-between gap-2">
                                    <span>{note.title}</span>
                                    {note.tag && (
                                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/20 text-primary border border-primary/20">
                                            {note.tag}
                                        </span>
                                    )}
                                </h4>
                                <p className="text-slate-400 text-sm leading-relaxed whitespace-pre-wrap">
                                    {note.content}
                                </p>
                            </div>
                        ))}
                        {notesList.length === 0 && (
                            <div className="text-slate-500 text-sm text-center py-4">
                                Aucune note pour aujourd'hui.
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-4 border-t border-white/5 bg-black/20">
                    <form action={createNote} className="relative">
                        <input type="hidden" name="userId" value={user.id} />
                        <input type="hidden" name="dateStr" value={today} />
                        <textarea
                            name="content"
                            className="w-full bg-[#101922] border-none rounded-lg p-3 text-sm text-white placeholder-slate-500 focus:ring-1 focus:ring-primary resize-none h-24"
                            placeholder="Taper une note..."
                            required
                        ></textarea>
                        <div className="absolute bottom-2 right-2 flex gap-1">
                            <button type="button" className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-white/10 transition-colors">B</button>
                            <button type="button" className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-white/10 transition-colors">•=</button>
                            <button type="submit" className="p-1.5 bg-primary text-white rounded hover:bg-primary/90 transition-colors ml-1">↑</button>
                        </div>
                    </form>
                </div>
            </aside>
        </>
    );
}
