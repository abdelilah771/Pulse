"use client";

import { useEffect, useState } from "react";

export default function WorkClock() {
    const [now, setNow] = useState<Date | null>(null);

    useEffect(() => {
        setNow(new Date());
        const timer = setInterval(() => setNow(new Date()), 60000); // update every minute
        return () => clearInterval(timer);
    }, []);

    if (!now) {
        return (
            <div className="glass-card p-6 bg-slate-50 rounded-2xl shadow-sm border border-slate-100 mt-8 mb-6 h-[104px] animate-pulse">
            </div>
        );
    }

    const WORK_START = 9; // 9 AM
    const WORK_END = 16; // 4 PM
    const TOTAL_WORK_MINS = (WORK_END - WORK_START) * 60;

    const currentHour = now.getHours();
    const currentMins = now.getMinutes();
    const elapsedMins = (currentHour - WORK_START) * 60 + currentMins;

    let progress = (elapsedMins / TOTAL_WORK_MINS) * 100;
    progress = Math.max(0, Math.min(100, progress)); // Clamp between 0 and 100

    const isActive = currentHour >= WORK_START && currentHour < WORK_END;
    const isFinished = currentHour >= WORK_END;

    let statusText = "Horloge de travail (9h - 16h)";
    let barColor = "from-indigo-500 to-purple-500";

    if (isFinished) {
        statusText = "Journée terminée ! Bien joué";
        barColor = "from-emerald-400 to-teal-500";
    } else if (!isActive && currentHour < WORK_START) {
        statusText = "Bienvenue ! La journée n'a pas encore commencé.";
        barColor = "from-slate-300 to-slate-400";
    } else if (progress > 85) {
        statusText = "Dernière ligne droite !";
        barColor = "from-amber-400 to-orange-500";
    }

    // Generate hour markers
    const markers = [];
    for (let i = WORK_START; i <= WORK_END; i++) {
        const pos = ((i - WORK_START) / (WORK_END - WORK_START)) * 100;
        markers.push(
            <div
                key={i}
                className="absolute top-0 bottom-0 border-l border-white/40 z-10"
                style={{ left: `${pos}%` }}
            >
                <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-400">
                    {i}h
                </span>
            </div>
        );
    }

    return (
        <div className="glass-card p-6 bg-white rounded-2xl shadow-sm border border-slate-100 mt-8 mb-6 relative">
            <div className="flex justify-between items-center mb-6 mt-2">
                <p className="text-sm text-slate-500 font-bold uppercase tracking-wider flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-indigo-400">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    {statusText}
                </p>
                {isActive && (
                    <span className="text-xs font-bold bg-indigo-50 text-indigo-600 px-2 py-1 rounded-md animate-pulse">
                        En cours
                    </span>
                )}
            </div>

            <div className="h-4 bg-slate-100 rounded-full w-full relative">
                {markers}
                <div
                    className={`h-full rounded-full bg-gradient-to-r ${barColor} transition-all duration-1000 ease-out`}
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
        </div>
    );
}
