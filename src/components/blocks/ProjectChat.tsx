"use client";

import { useState, useEffect, useRef } from "react";
import { getProjectMessages, sendProjectMessage } from "@/actions/messages.actions";
import { Send, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";

interface Message {
    id: string;
    content: string;
    createdAt: Date;
    user: {
        id: string;
        name: string | null;
        avatarUrl: string | null;
    } | null;
}

export default function ProjectChat({ projectId }: { projectId: string }) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const supabase = createClient();

    useEffect(() => {
        loadMessages();
        const loadUser = async () => {
            const { data } = await supabase.auth.getUser();
            setCurrentUserId(data?.user?.id || null);
        };
        loadUser();

        // Optional: Supabase Realtime subscription could be added here for instant updates
        const channel = supabase.channel(`project_messages_${projectId}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'project_messages',
                filter: `project_id=eq.${projectId}`
            }, () => {
                // When a new message comes in, simply reload for now
                loadMessages();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [projectId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const loadMessages = async () => {
        const result = await getProjectMessages(projectId);
        if (result.data) {
            setMessages(result.data as Message[]);
        }
        setLoading(false);
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        const content = newMessage.trim();
        if (!content || sending) return;

        setSending(true);
        setNewMessage("");

        const tempId = `temp-${Date.now()}`;
        const tempMsg: Message = {
            id: tempId,
            content,
            createdAt: new Date(),
            user: {
                id: currentUserId || "",
                name: "Vous",
                avatarUrl: null
            }
        };

        setMessages(prev => [...prev, tempMsg]);

        const result = await sendProjectMessage(projectId, content);
        if (result.success && result.message) {
            // Replace temp msg with real one if needed, or just let real-time update fetch
            setMessages(prev => prev.map(m => m.id === tempId ? { ...m, id: result.message.id } : m));
        } else {
            toast.error(result.error || "Erreur d'envoi");
            setMessages(prev => prev.filter(m => m.id !== tempId));
        }
        setSending(false);
    };

    if (loading) {
        return <div className="flex h-full items-center justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-slate-400" /></div>;
    }

    return (
        <div className="flex flex-col h-full min-h-[400px] bg-white dark:bg-[#101922] rounded-xl border border-black/5 dark:border-white/5 overflow-hidden">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                    <div className="text-center h-full flex items-center justify-center text-slate-500 text-sm">
                        Aucun message. Soyez le premier à écrire !
                    </div>
                ) : (
                    messages.map((msg) => {
                        const isMe = msg.user?.id === currentUserId;
                        return (
                            <div key={msg.id} className={`flex gap-3 ${isMe ? "flex-row-reverse" : "flex-row"}`}>
                                <div className="shrink-0 size-8 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden flex items-center justify-center text-xs font-bold text-slate-500">
                                    {msg.user?.avatarUrl ? (
                                        <img src={msg.user.avatarUrl} alt="avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                    ) : (
                                        msg.user?.name ? msg.user.name.charAt(0).toUpperCase() : "U"
                                    )}
                                </div>
                                <div className={`flex flex-col max-w-[70%] ${isMe ? "items-end" : "items-start"}`}>
                                    <span className="text-xs text-slate-500 mb-1 px-1">
                                        {msg.user?.name || "User"} • {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                    <div className={`px-4 py-2 rounded-2xl text-sm ${isMe
                                        ? "bg-primary text-white rounded-tr-sm"
                                        : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-tl-sm"
                                        }`}>
                                        {msg.content}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-3 border-t border-black/5 dark:border-white/5 bg-slate-50 dark:bg-[#0c131a]">
                <form onSubmit={handleSend} className="relative flex items-center">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Écrire un message..."
                        className="w-full bg-white dark:bg-[#15202b] border border-black/10 dark:border-white/10 rounded-full pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-white"
                        disabled={sending}
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim() || sending}
                        className="absolute right-2 p-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:hover:bg-primary"
                    >
                        {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    </button>
                </form>
            </div>
        </div>
    );
}
