"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";

interface TaskTimerProps {
    taskId: string;
    taskName: string;
    onComplete: () => void;
}

const TASK_DURATION_MINS = 60;
const DURATION_MS = TASK_DURATION_MINS * 60 * 1000;

export default function TaskTimer({ taskId, taskName, onComplete }: TaskTimerProps) {
    const [isActive, setIsActive] = useState(false);
    const [timeLeft, setTimeLeft] = useState(DURATION_MS);

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1000) {
                        clearInterval(interval);
                        setIsActive(false);
                        handleExpiration();
                        return 0;
                    }
                    return prev - 1000;
                });
            }, 1000);
        } else if (!isActive) {
            // pause condition
        }

        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    function handleExpiration() {
        toast.success(`Temps écoulé pour la tâche : ${taskName} 🎉`, { duration: 5000 });
        onComplete();
    }

    function toggleTimer() {
        setIsActive(!isActive);
    }

    function resetTimer() {
        setIsActive(false);
        setTimeLeft(DURATION_MS);
    }

    const mins = Math.floor(timeLeft / 60000);
    const secs = Math.floor((timeLeft % 60000) / 1000);
    const formattedTime = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

    const progress = ((DURATION_MS - timeLeft) / DURATION_MS) * 100;

    const isWarning = timeLeft <= 300000; // 5 mins
    const barColor = isWarning ? "from-red-500 to-orange-500" : "from-indigo-500 to-cyan-400";
    const textColor = isWarning ? "text-red-500 animate-pulse" : "text-slate-600";

    return (
        <div className="flex flex-col gap-2 w-full mt-2">
            <div className="flex items-center justify-between">
                <span className={`font-mono font-bold text-sm tracking-widest ${textColor}`}>
                    {formattedTime}
                </span>
                <div className="flex gap-2">
                    <button
                        onClick={resetTimer}
                        className="w-7 h-7 flex flex-col justify-center items-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors shadow-sm"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><polyline points="3 3 3 8 8 8"></polyline></svg>
                    </button>
                    <button
                        onClick={toggleTimer}
                        className={`w-7 h-7 rounded-full text-white transition-all shadow-md flex items-center justify-center ${isActive ? 'bg-amber-500 hover:bg-amber-600' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                    >
                        {isActive ? (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="ml-[1px]"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
                        ) : (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="ml-1"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                        )}
                    </button>
                </div>
            </div>

            <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                <div
                    className={`h-full bg-gradient-to-r rounded-full transition-all duration-1000 ease-linear ${barColor}`}
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
        </div>
    );
}
