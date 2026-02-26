import TopNav from "@/components/blocks/TopNav";
import FloatingDock from "@/components/blocks/FloatingDock";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="font-display text-slate-900 dark:text-slate-100 ambient-bg min-h-screen overflow-hidden relative selection:bg-primary selection:text-white">
            <TopNav />
            <main className="absolute inset-0 top-16 bottom-20 overflow-hidden flex">
                {children}
            </main>
            <FloatingDock />
        </div>
    );
}
