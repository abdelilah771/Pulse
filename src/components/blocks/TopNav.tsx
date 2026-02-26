import Link from "next/link";
import { Search, Aperture, Bell } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { logoutUser } from "@/actions/auth.actions";
import { redirect } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";

export default async function TopNav() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    let dbUser = null;
    if (user) {
        const result = await db.select().from(users).where(eq(users.id, user.id)).limit(1);
        dbUser = result[0];
    }

    return (
        <header className="fixed top-0 left-0 right-0 z-40 px-6 py-4 flex items-center justify-between glass-panel border-b border-black/5 dark:border-white/5 h-16">
            <div className="flex items-center gap-4">
                <div className="size-8 text-primary flex items-center justify-center">
                    <Aperture className="w-8 h-8" />
                </div>
                <h1 className="text-slate-900 dark:text-white text-lg font-bold tracking-tight">Personal Space</h1>
            </div>

            <div className="flex-1 max-w-md mx-8 hidden md:block">
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                        <Search className="text-[20px]" />
                    </div>
                    <input
                        className="block w-full p-2 pl-10 text-sm text-slate-900 dark:text-slate-100 bg-black/5 dark:bg-black/20 border border-black/5 dark:border-white/5 rounded-full focus:ring-primary focus:border-primary placeholder-slate-400 dark:placeholder-slate-500 transition-all focus:bg-black/10 dark:focus:bg-black/40"
                        placeholder="Rechercher tâches, notes, projets..."
                        type="text"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <span className="text-xs text-slate-400 dark:text-slate-500 border border-slate-300 dark:border-slate-700 rounded px-1.5 py-0.5">⌘K</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <ThemeToggle />
                <button className="relative p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-white dark:border-[#101922]"></span>
                </button>
                <div className="h-8 w-[1px] bg-black/10 dark:bg-white/10 mx-1"></div>
                {user ? (
                    <div className="relative flex items-center gap-3 cursor-pointer p-1 pr-3 rounded-full transition-colors border border-transparent hover:border-black/5 dark:hover:border-white/5 hover:bg-black/5 dark:hover:bg-white/5 group z-50">
                        <div
                            className="size-8 rounded-full bg-cover bg-center ring-2 ring-black/10 dark:ring-white/10 bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs overflow-hidden"
                        >
                            {dbUser?.avatarUrl ? (
                                <img src={dbUser.avatarUrl} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            ) : (
                                dbUser?.name ? dbUser.name.charAt(0).toUpperCase() : "U"
                            )}
                        </div>
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-300 hidden sm:block group-hover:text-slate-900 dark:group-hover:text-white">
                            {dbUser?.name || "Workspace"}
                        </span>

                        <div className="absolute top-10 right-0 pt-2 hidden group-hover:block w-[180px] z-50">
                            <div className="flex flex-col glass-card border border-black/10 dark:border-white/10 p-2 rounded-xl shadow-2xl animate-in fade-in zoom-in-95 origin-top-right">
                                <Link
                                    href="/profile"
                                    className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 px-3 py-2 rounded-lg transition-colors text-left flex items-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    Mon Profil
                                </Link>
                                <div className="h-px bg-black/5 dark:bg-white/5 my-1"></div>
                                <form
                                    action={async () => {
                                        "use server";
                                        await logoutUser();
                                        redirect("/login");
                                    }}
                                >
                                    <button
                                        type="submit"
                                        className="w-full text-sm font-medium text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 px-3 py-2 rounded-lg transition-colors text-left flex items-center gap-2"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                        Déconnexion
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300">
                        <Link href="/login" className="hover:text-slate-900 dark:hover:text-white transition-colors">Connexion</Link>
                    </div>
                )}
            </div>
        </header>
    );
}
