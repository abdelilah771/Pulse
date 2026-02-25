import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import MarkdownPlayground from "./MarkdownPlayground";

export default async function MarkdownPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id;

    if (!userId) {
        redirect("/login");
    }

    return (
        <div className="bg-slate-50 min-h-screen">
            <main className="max-w-[1200px] mx-auto w-full p-4 md:p-6 pb-24 space-y-6">
                <div className="flex flex-col mb-4">
                    <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">
                        Markdown & Mermaid
                    </h2>
                    <p className="text-slate-500 font-medium mt-1">
                        Écrivez, testez et visualisez vos diagrammes en direct.
                    </p>
                </div>

                <MarkdownPlayground />
            </main>
        </div>
    );
}
