import Link from "next/link";
import { CalendarDays, Calendar as CalendarIcon, CheckSquare, StickyNote, Plus, LayoutDashboard } from "lucide-react";

export default function FloatingDock() {
    return (
        <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
            <div className="glass-panel px-4 py-3 rounded-full flex items-center gap-2 shadow-2xl shadow-black/20 dark:shadow-black/50 border border-black/5 dark:border-white/10 transition-all duration-300 hover:scale-[1.02]">

                {/* Home */}
                <Link href="/home" className="group relative flex flex-col items-center gap-1 p-2 rounded-xl transition-all hover:bg-black/5 dark:hover:bg-white/10 w-16 hover:-translate-y-1">
                    <LayoutDashboard className="text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white w-6 h-6 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-medium text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white mt-1">Home</span>
                </Link>

                {/* Auj. (Today/Planner) */}
                <Link href="/planner" className="group relative flex flex-col items-center gap-1 p-2 rounded-xl transition-all hover:bg-black/5 dark:hover:bg-white/10 w-16 hover:-translate-y-1">
                    <CalendarDays className="text-primary w-6 h-6 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-medium text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white mt-1">Auj.</span>
                    <div className="h-1 w-1 rounded-full bg-primary absolute bottom-0.5"></div>
                </Link>

                {/* Semaine */}
                <button className="group relative flex flex-col items-center gap-1 p-2 rounded-xl transition-all hover:bg-black/5 dark:hover:bg-white/10 w-16 hover:-translate-y-1">
                    <CalendarIcon className="text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white w-6 h-6 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-medium text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white mt-1">Semaine</span>
                </button>

                {/* Tâches */}
                <button className="group relative flex flex-col items-center gap-1 p-2 rounded-xl transition-all hover:bg-black/5 dark:hover:bg-white/10 w-16 hover:-translate-y-1">
                    <CheckSquare className="text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white w-6 h-6 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-medium text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white mt-1">Tâches</span>
                </button>

                {/* Divider */}
                <div className="w-px h-8 bg-black/10 dark:bg-white/10 mx-1"></div>

                {/* Notes */}
                <button className="group relative flex flex-col items-center gap-1 p-2 rounded-xl transition-all hover:bg-black/5 dark:hover:bg-white/10 w-16 hover:-translate-y-1">
                    <StickyNote className="text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white w-6 h-6 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-medium text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white mt-1">Notes</span>
                </button>

                {/* Add Action */}
                <button className="ml-1 flex items-center justify-center size-10 rounded-full bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/30 transition-all hover:scale-105 active:scale-95">
                    <Plus className="text-xl w-6 h-6" />
                </button>

            </div>
        </nav>
    );
}
