import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getProjectSummary } from "@/actions/projects.actions";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { tasks } from "@/db/schema";
import ProjectChat from "@/components/blocks/ProjectChat";
import ProjectTasks from "@/components/blocks/ProjectTasks";
import ProjectSummary from "@/components/blocks/ProjectSummary";
import { ArrowLeft, Loader2, MessageSquare, CheckSquare, BarChart2 } from "lucide-react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const dynamic = 'force-dynamic';

export default async function ProjectWorkspacePage({ params }: { params: Promise<{ id: string }> }) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { id: projectId } = await params;

    const summary = await getProjectSummary(projectId);

    if (!summary) {
        notFound();
    }

    // Access Verification: Is user owner or member?
    const isOwner = summary.project.userId === user.id;
    const isMember = summary.members.some(m => m.id === user.id);

    if (!isOwner && !isMember) {
        redirect("/home"); // Redirect unauthorized users
    }

    // Fetch initial tasks for this project
    const projectTasks = await db.select().from(tasks).where(eq(tasks.projectId, projectId)).orderBy(tasks.createdAt);

    return (
        <div className="flex flex-col h-full w-full overflow-hidden bg-slate-50/50 dark:bg-[#080d12]">
            {/* Header Banner */}
            <header className="shrink-0 relative overflow-hidden h-40 flex items-end px-6 pb-6 lg:px-12 z-10">
                <div className={`absolute inset-0 opacity-20 dark:opacity-40 transition-colors duration-1000 bg-gradient-to-br from-indigo-500 to-purple-600`}></div>
                <div className="absolute inset-0 bg-white/40 dark:bg-black/40 backdrop-blur-[2px]"></div>

                <div className="relative z-10 w-full max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <Link
                            href="/home"
                            className="p-2 bg-white/50 dark:bg-black/50 hover:bg-white dark:hover:bg-black/80 rounded-full transition-colors backdrop-blur-md shadow-sm border border-black/5 dark:border-white/5 group"
                            title="Retour au Tableau de Bord"
                        >
                            <ArrowLeft className="w-5 h-5 text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white" />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                                {summary.project.name}
                            </h1>
                            {summary.project.description && (
                                <p className="text-slate-600 dark:text-slate-300 font-medium mt-1">
                                    {summary.project.description}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8 overflow-y-auto">
                <Tabs defaultValue="tasks" className="w-full h-full flex flex-col">
                    <TabsList className="bg-slate-200/50 dark:bg-[#15202b] border border-black/5 dark:border-white/5 p-1 rounded-xl shrink-0 self-start mb-6">
                        <TabsTrigger value="tasks" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-[#1a2533] data-[state=active]:text-slate-900 dark:data-[state=active]:text-white flex items-center gap-2 px-4 py-2 transition-all">
                            <CheckSquare className="w-4 h-4" />
                            <span className="font-medium text-sm">Tâches</span>
                        </TabsTrigger>
                        <TabsTrigger value="chat" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-[#1a2533] data-[state=active]:text-slate-900 dark:data-[state=active]:text-white flex items-center gap-2 px-4 py-2 transition-all">
                            <MessageSquare className="w-4 h-4" />
                            <span className="font-medium text-sm">Discussion</span>
                        </TabsTrigger>
                        <TabsTrigger value="summary" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-[#1a2533] data-[state=active]:text-slate-900 dark:data-[state=active]:text-white flex items-center gap-2 px-4 py-2 transition-all">
                            <BarChart2 className="w-4 h-4" />
                            <span className="font-medium text-sm">Rapport</span>
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="tasks" className="flex-1 h-full min-h-[500px]">
                        <ProjectTasks projectId={projectId} initialTasks={projectTasks as any} />
                    </TabsContent>

                    <TabsContent value="chat" className="flex-1 h-full min-h-[500px]">
                        <Suspense fallback={<div className="flex h-full items-center justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>}>
                            <ProjectChat projectId={projectId} />
                        </Suspense>
                    </TabsContent>

                    <TabsContent value="summary" className="flex-1 h-full">
                        <ProjectSummary stats={summary.stats} members={summary.members} />
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    );
}
