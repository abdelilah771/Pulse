"use client";

import { useEffect, useState, useRef } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";
import mermaid from "mermaid";
import { getCourseForDate, getWeekInfo } from "@/lib/courseData";
import { X, ChevronLeft, ChevronRight, CheckCircle2, Circle } from "lucide-react";
import toast from "react-hot-toast";
import { toggleTaskDone } from "@/actions/auth.actions";

interface CourseViewerProps {
    dateStr: string | null;
    onClose: () => void;
    onDateChange: (newDate: string) => void;
    userId: string;
}

export default function CourseViewer({ dateStr, onClose, onDateChange, userId }: CourseViewerProps) {
    const [content, setContent] = useState<string>("");
    const [weekBadge, setWeekBadge] = useState<string>("");
    const [isRead, setIsRead] = useState<boolean>(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        mermaid.initialize({
            startOnLoad: false,
            theme: "default",
            securityLevel: "loose",
            fontFamily: "var(--font-inter), sans-serif",
        });
    }, []);

    useEffect(() => {
        if (!dateStr) return;

        const loadContent = async () => {
            const rawMarkdown = getCourseForDate(dateStr);
            if (!rawMarkdown) {
                setContent("<p>No lessons strictly scheduled for today. Enjoy the break!</p>");
                return;
            }

            const info = getWeekInfo(dateStr);
            if (info) {
                setWeekBadge(`Week ${info.weekNum} · ${info.phase}`);
            }

            // 1. Extract mermaid blocks
            const mermaidBlocks: { id: string, code: string }[] = [];
            let blockIdx = 0;

            const processed = rawMarkdown.replace(/```mermaid\n([\s\S]*?)```/g, (_, code) => {
                const id = `mermaid-block-${blockIdx++}`;
                mermaidBlocks.push({ id, code: code.trim() });
                return `<div class="mermaid-container my-8 flex justify-center w-full overflow-x-auto" id="${id}"></div>`;
            });

            // 2. Parse markdown safely
            const html = DOMPurify.sanitize(await marked.parse(processed, { breaks: true, gfm: true }));
            setContent(html);

            // 3. Render mermaid SVG asynchronously after React DOM updates
            setTimeout(async () => {
                if (!containerRef.current) return;
                for (const block of mermaidBlocks) {
                    const el = containerRef.current.querySelector(`#${block.id}`);
                    if (!el) continue;
                    try {
                        const { svg } = await mermaid.render(block.id + '-svg', block.code);
                        el.innerHTML = svg;
                    } catch (err) {
                        el.innerHTML = `<pre class="text-red-500 text-sm overflow-x-auto p-4 bg-red-50 rounded">Diagram Error: ${block.code}</pre>`;
                    }
                }
            }, 100);

            // Note: Determining if it's "Read" strictly from Supabase should probably 
            // happen from the parent components and passed down as a prop, 
            // but for now we default to false or rely on the parent updating this.
            // A more complex state checking `tasks` arrays would be needed to match the 1:1 "Read" button.
        };

        loadContent();
    }, [dateStr]);

    const handleNavigate = (offset: number) => {
        if (!dateStr) return;
        const d = new Date(dateStr + "T00:00:00");
        d.setDate(d.getDate() + offset);

        while (d.getDay() === 0 || d.getDay() === 6) {
            d.setDate(d.getDate() + (offset > 0 ? 1 : -1));
        }

        const newDateStr = d.toISOString().split("T")[0];
        onDateChange(newDateStr);
    };

    if (!dateStr) return null;

    return (
        <div className="fixed inset-y-0 right-0 z-50 w-full max-w-3xl bg-white shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col border-l border-slate-200">
            {/* Header */}
            <header className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => handleNavigate(-1)}
                        className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
                        title="Previous Day"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="text-sm font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                        {weekBadge || dateStr}
                    </span>
                    <button
                        onClick={() => handleNavigate(1)}
                        className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
                        title="Next Day"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => {
                            // Pseudo-toggle logic, real read status relies on Tasks DB.
                            setIsRead(!isRead);
                            if (!isRead) toast.success("Marked as read & learned!");
                        }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${isRead
                                ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                            }`}
                    >
                        {isRead ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                        {isRead ? "Read" : "Mark as Read"}
                    </button>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </header>

            {/* Content Body */}
            <div
                ref={containerRef}
                className="flex-1 overflow-y-auto p-8 prose prose-slate prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-a:text-indigo-600 max-w-none prose-img:rounded-xl"
                dangerouslySetInnerHTML={{ __html: content }}
            />
        </div>
    );
}
