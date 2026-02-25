import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import KpiChart from "./KpiChart";
import { db } from "@/db";
import { tasks } from "@/db/schema";
import { eq, inArray, and } from "drizzle-orm";
import { format, subDays } from "date-fns";

export default async function KpiPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id;

    if (!userId) {
        redirect("/login");
    }

    // Fetch Last 7 Days of Tasks
    const dates = Array.from({ length: 7 }).map((_, i) => format(subDays(new Date(), Math.abs(i - 6)), "yyyy-MM-dd"));

    const tasksList = await db.query.tasks.findMany({
        where: and(eq(tasks.userId, userId), inArray(tasks.dateStr, dates))
    });

    const completionByDateStr = dates.reduce((acc, dateStr) => {
        const dayTasks = tasksList.filter((t: any) => t.dateStr === dateStr);
        const doneObj = dayTasks.filter((t: any) => t.done).length;
        const total = dayTasks.length || 1; // avoid /0
        acc[dateStr] = Math.round((doneObj / total) * 100);
        if (dayTasks.length === 0) acc[dateStr] = 0;
        return acc;
    }, {} as Record<string, number>);

    return (
        <div className="bg-slate-50 min-h-screen">
            <main className="max-w-[1000px] mx-auto w-full p-4 md:p-6 pb-24 space-y-8">
                <div className="flex items-center justify-between mt-4 mb-8">
                    <div>
                        <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">
                            Indicateurs & Statistiques
                        </h2>
                        <p className="text-slate-500 font-medium mt-1">
                            Analysez votre constance et vos progrès globaux.
                        </p>
                    </div>
                    <div className="flex gap-4 items-center mt-6 md:mt-0">
                        <a href="/planner" className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-lg shadow-indigo-600/20 transition-all hover:-translate-y-0.5">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Ouvrir le Planner
                        </a>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
                        <span className="text-3xl mb-2">🔥</span>
                        <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">Série Actuelle</h4>
                        <p className="text-4xl font-extrabold text-slate-800">
                            {completionByDateStr[dates[dates.length - 1]] > 50 ? "1 Jours" : "0 Jours"}
                        </p>
                    </div>
                    <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
                        <span className="text-3xl mb-2">📚</span>
                        <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">Leçons Lues</h4>
                        <p className="text-4xl font-extrabold text-slate-800">0</p>
                    </div>
                    <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
                        <span className="text-3xl mb-2">🎯</span>
                        <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">Complétion Semaine</h4>
                        <p className="text-4xl font-extrabold text-indigo-600">
                            {Math.round(Object.values(completionByDateStr).reduce((a, b) => a + b, 0) / 7)}%
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-800 mb-6">Progrès Académique</h3>

                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-sm font-semibold mb-1">
                                    <span className="text-slate-700">Fondations</span>
                                    <span className="text-indigo-600">0%</span>
                                </div>
                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-indigo-500 w-0"></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm font-semibold mb-1">
                                    <span className="text-slate-700">Backend Java/Spring</span>
                                    <span className="text-slate-400">0%</span>
                                </div>
                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-slate-300 w-0"></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm font-semibold mb-1">
                                    <span className="text-slate-700">Frontend Angular</span>
                                    <span className="text-slate-400">0%</span>
                                </div>
                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-slate-300 w-0"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm flex flex-col w-full min-h-[400px]">
                        <h3 className="text-lg font-bold text-slate-800 mb-6 w-full">Vélocité Journalière</h3>
                        <div className="flex-1 w-full relative">
                            <KpiChart
                                dates={dates}
                                tasksDone={dates.map(dateStr => {
                                    const dayTasks = tasksList.filter((t: any) => t.dateStr === dateStr);
                                    return dayTasks.filter((t: any) => t.done).length;
                                })}
                                moods={dates.map(() => 5)} // Mocking moods to 5 for now, replace when dailyMetrics is queried
                            />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
